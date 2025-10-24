import { Response } from 'express';
import { ObjectId } from 'mongodb';
import { AuthRequest, IReport, IAuditLog } from '../types';
import { getReportsCollection, getNextFolio, getAuditLogsCollection, getUsersCollection } from '../models/collections';
import { mockReports, mockUsers } from '../data/mockData';

// Array mutable como fallback cuando no hay MongoDB
let memoryReports = [...mockReports] as any[];

// Función para registrar en bitácora
const registrarEnBitacora = async (auditLog: IAuditLog) => {
  try {
    const auditLogsCollection = getAuditLogsCollection();
    await auditLogsCollection.insertOne(auditLog);
  } catch (error) {
    console.error('Error al registrar en bitácora:', error);
  }
};

// Función para validar si una unidad ya está asignada al mismo incidente
const validarUnidadDuplicada = async (
  ambulancia: string,
  reporteId: string,
  fechaHoraLlamada: Date
): Promise<{ isDuplicate: boolean; reporteDuplicado?: any }> => {
  try {
    const reportsCollection = getReportsCollection();

    // Buscar reportes con la misma ambulancia en un rango de tiempo cercano
    // (mismo día o incidente activo sin cerrar)
    const reporteDuplicado = await reportsCollection.findOne({
      _id: { $ne: new ObjectId(reporteId) },
      ambulancia: ambulancia,
      $or: [
        // Caso abierto (sin fecha de cierre)
        { fechaHoraCierre: null },
        // O mismo día que la llamada
        {
          fechaHoraLlamada: {
            $gte: new Date(new Date(fechaHoraLlamada).setHours(0, 0, 0, 0)),
            $lt: new Date(new Date(fechaHoraLlamada).setHours(23, 59, 59, 999))
          }
        }
      ]
    });

    return {
      isDuplicate: !!reporteDuplicado,
      reporteDuplicado
    };
  } catch (error) {
    console.error('Error al validar unidad duplicada:', error);
    return { isDuplicate: false };
  }
};

export const getReports = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Usuario no autenticado' });
    }

    const { page = '1', perPage = '25' } = req.query;
    const pageNum = parseInt(page as string);
    const perPageNum = parseInt(perPage as string);
    const skip = (pageNum - 1) * perPageNum;

    let reports: any[] = [];
    let total = 0;
    let usingDatabase = true;

    try {
      // Intentar usar MongoDB
      const reportsCollection = getReportsCollection();

      // Crear filtro según rol
      let filter: any = {};
      switch (req.user.role) {
        case 'admin':
          // Admin ve todos
          break;
        case 'jefe':
          // Jefe ve reportes de paramédicos/operadores de su turno
          try {
            const usersCollection = getUsersCollection();
            const staffInTurno = await usersCollection
              .find({
                turno: req.user.turno as '1' | '2' | '3' | '4' | '5' | '6',
                role: { $in: ['paramedico', 'operador'] } as any
              } as any)
              .toArray();

            const usernames = staffInTurno.map(u => u.username);
            const fullNames = staffInTurno.map(u => u.fullName);

            filter.$or = [
              { creadoPor: { $in: usernames } },
              { paramedico: { $in: fullNames } }
            ];
          } catch (error) {
            console.error('Error obteniendo staff del turno:', error);
            // Fallback: filtrar por turno de creación
            filter.turnoCreacion = req.user.turno;
          }
          break;
        case 'paramedico':
        case 'operador':
          // Paramédicos/operadores ven reportes que crearon O donde son el paramédico asignado
          filter.$or = [
            { creadoPor: req.user.username },
            { paramedico: req.user.fullName }
          ];
          break;
      }

      total = await reportsCollection.countDocuments(filter);
      const dbReports = await reportsCollection
        .find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(perPageNum)
        .toArray();

      reports = dbReports.map(report => ({
        ...report,
        id: report._id?.toString(),
        _id: report._id?.toString()
      }));

      console.log(`MongoDB: Encontrados ${reports.length} reportes de ${total} total`);
    } catch (dbError) {
      console.warn('Error de MongoDB, usando datos en memoria:', dbError instanceof Error ? dbError.message : String(dbError));
      usingDatabase = false;

      // Usar datos en memoria como fallback
      let filteredReports = [...memoryReports];

      switch (req.user.role) {
        case 'admin':
          // Admin ve todos
          break;
        case 'jefe':
          // Jefe ve reportes de paramédicos/operadores de su turno
          const staffInTurno = mockUsers.filter(u =>
            u.turno === req.user!.turno &&
            (u.role === 'paramedico' || u.role === 'operador')
          );
          const usernames = staffInTurno.map(u => u.username);
          const fullNames = staffInTurno.map(u => u.fullName);

          filteredReports = filteredReports.filter(r =>
            usernames.includes(r.creadoPor) ||
            fullNames.includes(r.paramedico)
          );
          break;
        case 'paramedico':
        case 'operador':
          // Paramédicos/operadores ven reportes que crearon O donde son el paramédico asignado
          filteredReports = filteredReports.filter(r =>
            r.creadoPor === req.user!.username ||
            r.paramedico === req.user!.fullName
          );
          break;
      }

      total = filteredReports.length;
      reports = filteredReports.slice(skip, skip + perPageNum);
      console.log(`Memoria: Encontrados ${reports.length} reportes de ${total} total`);
    }

    res.json({
      data: reports,
      total,
      page: pageNum,
      perPage: perPageNum,
      source: usingDatabase ? 'MongoDB' : 'Memory'
    });
  } catch (error) {
    console.error('Error al obtener reportes:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

export const getReport = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Usuario no autenticado' });
    }

    let report: any = null;
    let usingDatabase = true;

    try {
      // Intentar usar MongoDB
      const reportsCollection = getReportsCollection();
      const dbReport = await reportsCollection.findOne({ _id: new ObjectId(req.params.id) });

      if (dbReport) {
        report = {
          ...dbReport,
          id: dbReport._id?.toString(),
          _id: dbReport._id?.toString()
        };
      }
    } catch (dbError) {
      console.warn('Error de MongoDB, buscando en memoria:', dbError instanceof Error ? dbError.message : String(dbError));
      usingDatabase = false;
      report = memoryReports.find(r => r._id === req.params.id);
    }

    if (!report) {
      return res.status(404).json({ message: 'Reporte no encontrado' });
    }

    // Verificar permisos
    if (req.user.role === 'paramedico' || req.user.role === 'operador') {
      // Permitir si creó el reporte O si es el paramédico asignado
      console.log('🔍 Verificando permisos para paramédico/operador:');
      console.log('  - Usuario:', req.user.username, '/', req.user.fullName);
      console.log('  - Reporte creadoPor:', report.creadoPor);
      console.log('  - Reporte paramedico:', report.paramedico);
      console.log('  - ¿Creado por usuario?:', report.creadoPor === req.user.username);
      console.log('  - ¿Paramédico asignado?:', report.paramedico === req.user.fullName);

      if (report.creadoPor !== req.user.username && report.paramedico !== req.user.fullName) {
        console.log('❌ Acceso denegado - No cumple ninguna condición');
        return res.status(403).json({ message: 'No tienes permiso para ver este reporte' });
      }
      console.log('✅ Acceso permitido');
    } else if (req.user.role === 'jefe') {
      if (report.turnoCreacion !== req.user.turno) {
        return res.status(403).json({ message: 'No tienes permiso para ver este reporte' });
      }
    }

    // Log visualización de reporte
    try {
      await getAuditLogsCollection().insertOne({
        tipo: 'ver_reporte',
        recursoId: req.params.id,
        recursoTipo: 'reporte',
        usuario: req.user.username,
        usuarioRole: req.user.role,
        accion: 'Reporte visualizado',
        detalles: {
          folio: report.folio,
          tipo: report.tipo,
          source: usingDatabase ? 'MongoDB' : 'Memory'
        },
        timestamp: new Date()
      });
    } catch (logError) {
      console.error('Error logging report view:', logError);
    }

    res.json({
      data: report,
      source: usingDatabase ? 'MongoDB' : 'Memory'
    });
  } catch (error) {
    console.error('Error al obtener reporte:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

export const createReport = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Usuario no autenticado' });
    }

    const fechaHoraLlamada = req.body.fechaHoraLlamada ? new Date(req.body.fechaHoraLlamada) : new Date();

    // Validar si la unidad ya está asignada al mismo incidente
    if (req.body.ambulancia && !req.body.autorizacionJefe) {
      const validacion = await validarUnidadDuplicada(
        req.body.ambulancia,
        'new',
        fechaHoraLlamada
      );

      if (validacion.isDuplicate) {
        return res.status(409).json({
          message: 'La unidad ya está asignada a otro incidente activo o del mismo día',
          requiresAuthorization: true,
          conflictingReport: {
            id: validacion.reporteDuplicado._id,
            folio: validacion.reporteDuplicado.folio,
            fechaHoraLlamada: validacion.reporteDuplicado.fechaHoraLlamada,
            ubicacion: validacion.reporteDuplicado.ubicacion,
          }
        });
      }
    }

    let createdReport: any = null;
    let usingDatabase = true;
    let folio: string | null = null;

    // Extraer campos con manejo de aliases (FUERA del try para que estén disponibles en catch)
    const kilometrosValue = req.body.kilometros || req.body.kmRecorridos || 0;
    const tiempoAtencionValue = req.body.tiempoAtencionMin || req.body.tiempoDeAtencion || 0;
    const tiempoTrasladoValue = req.body.tiempoTrasladoMin || req.body.tiempoDeTraslado || 0;
    const entidadValue = req.body.entidad || req.body.entidadUnidad || '';
    const esPrivadaValue = req.body.esPrivada !== undefined ? req.body.esPrivada : req.body.privadaLlegoAntes;

    // Extraer campos de paciente (soporte para ambos formatos)
    const pacienteNombreValue = req.body.pacienteNombre || req.body.paciente?.nombre || '';
    const pacienteEdadValue = req.body.pacienteEdad || req.body.paciente?.edad || undefined;
    const pacienteSexoValue = req.body.pacienteSexo || req.body.paciente?.sexo || '';

    // Extraer campos de traslado (soporte para ambos formatos)
    const hayTrasladoValue = req.body.hayTraslado !== undefined ? req.body.hayTraslado : req.body.traslado?.huboTraslado;
    const hospitalValue = req.body.hospital || req.body.traslado?.hospital || '';
    const quienRecibeValue = req.body.quienRecibe || req.body.traslado?.quienRecibe || '';

    // Auto-llenar campo paramedico si el usuario es paramedico u operador
    let paramedicoValue = req.body.paramedico;
    if ((req.user.role === 'paramedico' || req.user.role === 'operador') && !paramedicoValue) {
      paramedicoValue = req.user.fullName;
    }

    // Determinar el tipo automáticamente basado en esPrivada y esFalsaAlarma
    let tipoValue = req.body.tipo;

    // Prioridad: esFalsaAlarma > esPrivada > tipo original
    if (req.body.esFalsaAlarma === true) {
      tipoValue = 'falsaAlarma';
    } else if (esPrivadaValue === true) {
      tipoValue = 'privada';
    }

    try {
      // Intentar usar MongoDB
      const reportsCollection = getReportsCollection();

      // Generar folio solo para reportes prehospitalarios y urbanos
      if (tipoValue === 'prehospitalaria' || tipoValue === 'urbana') {
        folio = await getNextFolio();
      }

      const newReport: IReport = {
        folio,
        tipo: tipoValue,
        gravedad: req.body.gravedad,
        fechaHoraLlamada: req.body.fechaHoraLlamada ? new Date(req.body.fechaHoraLlamada) : new Date(),
        fechaHoraArribo: req.body.fechaHoraArribo ? new Date(req.body.fechaHoraArribo) : new Date(),
        fechaHoraCierre: req.body.fechaHoraCierre ? new Date(req.body.fechaHoraCierre) : null,
        ubicacion: req.body.ubicacion || '',
        lugarOcurrencia: req.body.lugarOcurrencia || '',
        ambulancia: req.body.ambulancia || '',

        // Guardar ambas versiones del campo entidad
        entidad: entidadValue,
        entidadUnidad: entidadValue,

        paramedico: paramedicoValue || '',

        // Guardar ambas versiones de los campos de métricas
        kilometros: kilometrosValue,
        kmRecorridos: kilometrosValue,

        tiempoAtencionMin: tiempoAtencionValue,
        tiempoDeAtencion: tiempoAtencionValue,

        tiempoTrasladoMin: tiempoTrasladoValue,
        tiempoDeTraslado: tiempoTrasladoValue,

        observaciones: req.body.observaciones || '',
        observacionesJefe: null,
        creadoPor: req.user.username,
        turnoCreacion: req.user.turno as '1' | '2' | '3' | '4' | '5' | '6',
        casoAprobado: false,
        requiereRevision: false,

        // Guardar ambas versiones de campos booleanos
        esFalsaAlarma: req.body.esFalsaAlarma || false,
        esPrivada: esPrivadaValue || false,
        privadaLlegoAntes: esPrivadaValue || false,

        motivoFalsaAlarma: req.body.motivoFalsaAlarma || '',
        motivoPrivada: req.body.motivoPrivada || '',
        notaIncidente: req.body.notaIncidente || '',

        // Campos prehospitalaria - objeto paciente
        paciente: req.body.paciente || {
          nombre: pacienteNombreValue,
          edad: pacienteEdadValue,
          sexo: pacienteSexoValue
        },
        // Campos planos de paciente
        pacienteNombre: pacienteNombreValue,
        pacienteEdad: pacienteEdadValue,
        pacienteSexo: pacienteSexoValue,

        agenteCausal: req.body.agenteCausal,
        insumos: req.body.insumos,
        insumosCantidades: req.body.insumosCantidades,

        // Campos de traslado - guardar en ambos formatos
        traslado: req.body.traslado || {
          huboTraslado: hayTrasladoValue,
          hospital: hospitalValue,
          quienRecibe: quienRecibeValue
        },
        hayTraslado: hayTrasladoValue,
        hospital: hospitalValue,
        quienRecibe: quienRecibeValue,

        // Campos urbana
        descripcionEvento: req.body.descripcionEvento,
        notaInformativa: req.body.notaInformativa || false,
        evidenciasFotograficas: req.body.evidenciasFotograficas || false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const result = await reportsCollection.insertOne(newReport);

      createdReport = {
        ...newReport,
        _id: result.insertedId.toString(),
        id: result.insertedId.toString()
      };

      console.log('MongoDB: Nuevo reporte creado con folio:', folio);
    } catch (dbError) {
      console.warn('Error de MongoDB, guardando en memoria:', dbError instanceof Error ? dbError.message : String(dbError));
      usingDatabase = false;

      // Usar memoria como fallback - generar folio solo para tipos específicos
      if (tipoValue === 'prehospitalaria' || tipoValue === 'urbana') {
        const timestamp = Date.now();
        const memoryCounter = memoryReports.length + 1;
        folio = `CUAJ-MEM-${timestamp}-${memoryCounter.toString().padStart(4, '0')}`;
      }

      const memoryId = `6570bb123456789012345${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;

      const newReport = {
        folio,
        tipo: tipoValue, // Usar el tipo calculado automáticamente
        gravedad: req.body.gravedad,
        fechaHoraLlamada: req.body.fechaHoraLlamada ? new Date(req.body.fechaHoraLlamada) : new Date(),
        fechaHoraArribo: req.body.fechaHoraArribo ? new Date(req.body.fechaHoraArribo) : new Date(),
        fechaHoraCierre: req.body.fechaHoraCierre ? new Date(req.body.fechaHoraCierre) : null,
        ubicacion: req.body.ubicacion || '',
        lugarOcurrencia: req.body.lugarOcurrencia || '',
        ambulancia: req.body.ambulancia || '',

        entidad: entidadValue,
        entidadUnidad: entidadValue,

        paramedico: paramedicoValue || '', // Usar el valor calculado con auto-llenado

        kilometros: kilometrosValue,
        kmRecorridos: kilometrosValue,

        tiempoAtencionMin: tiempoAtencionValue,
        tiempoDeAtencion: tiempoAtencionValue,

        tiempoTrasladoMin: tiempoTrasladoValue,
        tiempoDeTraslado: tiempoTrasladoValue,

        observaciones: req.body.observaciones || '',
        observacionesJefe: null,
        creadoPor: req.user.username,
        turnoCreacion: req.user.turno as '1' | '2' | '3' | '4' | '5' | '6',
        casoAprobado: false,
        requiereRevision: false,

        esFalsaAlarma: req.body.esFalsaAlarma || false,
        esPrivada: esPrivadaValue || false,
        privadaLlegoAntes: esPrivadaValue || false,

        motivoFalsaAlarma: req.body.motivoFalsaAlarma || '',
        motivoPrivada: req.body.motivoPrivada || '',
        notaIncidente: req.body.notaIncidente || '',

        pacienteNombre: pacienteNombreValue,
        pacienteEdad: pacienteEdadValue,
        pacienteSexo: pacienteSexoValue,

        hayTraslado: hayTrasladoValue,
        hospital: hospitalValue,
        quienRecibe: quienRecibeValue,

        createdAt: new Date(),
        updatedAt: new Date(),
      };

      createdReport = {
        ...newReport,
        _id: memoryId,
        id: memoryId
      };

      memoryReports.push(createdReport);
      console.log('Memoria: Nuevo reporte creado con folio:', folio, 'Total reportes:', memoryReports.length);
    }

    // Si hubo autorización del jefe, registrar en bitácora
    if (req.body.autorizacionJefe && createdReport) {
      await registrarEnBitacora({
        tipo: 'autorizacion_unidad_duplicada',
        recursoId: new ObjectId(createdReport._id),
        recursoTipo: 'reporte',
        usuario: req.body.autorizacionJefe.autorizadoPor || req.user.username,
        usuarioRole: req.user.role,
        accion: 'Autorización para asignar unidad duplicada en creación de reporte',
        detalles: {
          ambulancia: req.body.ambulancia,
          motivoAutorizacion: req.body.autorizacionJefe.motivo || 'Sin motivo especificado',
        },
        timestamp: new Date(),
      });
    }

    // Log creación de reporte
    try {
      await getAuditLogsCollection().insertOne({
        tipo: 'crear_reporte',
        recursoId: createdReport._id || createdReport.id,
        recursoTipo: 'reporte',
        usuario: req.user.username,
        usuarioRole: req.user.role,
        accion: 'Reporte creado exitosamente',
        detalles: {
          folio: createdReport.folio,
          tipo: createdReport.tipo,
          ambulancia: createdReport.ambulancia,
          source: usingDatabase ? 'MongoDB' : 'Memory'
        },
        timestamp: new Date()
      });
    } catch (logError) {
      console.error('Error logging report creation:', logError);
    }

    res.status(201).json({
      data: createdReport,
      source: usingDatabase ? 'MongoDB' : 'Memory'
    });
  } catch (error) {
    console.error('Error al crear reporte:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

export const updateReport = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Usuario no autenticado' });
    }

    let report: any = null;
    let usingDatabase = true;

    try {
      // Intentar usar MongoDB
      const reportsCollection = getReportsCollection();
      report = await reportsCollection.findOne({ _id: new ObjectId(req.params.id) });
    } catch (dbError) {
      console.warn('Error de MongoDB, buscando en memoria:', dbError instanceof Error ? dbError.message : String(dbError));
      usingDatabase = false;
      report = memoryReports.find(r => r._id === req.params.id);
    }

    if (!report) {
      return res.status(404).json({ message: 'Reporte no encontrado' });
    }

    // Verificar permisos de edición
    if (req.user.role === 'paramedico' || req.user.role === 'operador') {
      // Permitir editar si creó el reporte O si es el paramédico asignado
      if (report.creadoPor !== req.user.username && report.paramedico !== req.user.fullName) {
        return res.status(403).json({ message: 'No tienes permiso para editar este reporte' });
      }
    } else if (req.user.role === 'jefe') {
      if (report.turnoCreacion !== req.user.turno) {
        return res.status(403).json({ message: 'No tienes permiso para editar este reporte' });
      }
    }

    const { _id, id, ...bodyData } = req.body;

    // Manejar aliases para actualización
    const kilometrosValue = req.body.kilometros !== undefined ? req.body.kilometros : (req.body.kmRecorridos !== undefined ? req.body.kmRecorridos : report.kilometros);
    const tiempoAtencionValue = req.body.tiempoAtencionMin !== undefined ? req.body.tiempoAtencionMin : (req.body.tiempoDeAtencion !== undefined ? req.body.tiempoDeAtencion : report.tiempoAtencionMin);
    const tiempoTrasladoValue = req.body.tiempoTrasladoMin !== undefined ? req.body.tiempoTrasladoMin : (req.body.tiempoDeTraslado !== undefined ? req.body.tiempoDeTraslado : report.tiempoTrasladoMin);
    const entidadValue = req.body.entidad !== undefined ? req.body.entidad : (req.body.entidadUnidad !== undefined ? req.body.entidadUnidad : report.entidad);
    const esPrivadaValue = req.body.esPrivada !== undefined ? req.body.esPrivada : (req.body.privadaLlegoAntes !== undefined ? req.body.privadaLlegoAntes : report.esPrivada);

    // Manejar campos de paciente
    const pacienteNombreValue = req.body.pacienteNombre !== undefined ? req.body.pacienteNombre : (req.body.paciente?.nombre !== undefined ? req.body.paciente.nombre : report.pacienteNombre);
    const pacienteEdadValue = req.body.pacienteEdad !== undefined ? req.body.pacienteEdad : (req.body.paciente?.edad !== undefined ? req.body.paciente.edad : report.pacienteEdad);
    const pacienteSexoValue = req.body.pacienteSexo !== undefined ? req.body.pacienteSexo : (req.body.paciente?.sexo !== undefined ? req.body.paciente.sexo : report.pacienteSexo);

    // Manejar campos de traslado
    const hayTrasladoValue = req.body.hayTraslado !== undefined ? req.body.hayTraslado : (req.body.traslado?.huboTraslado !== undefined ? req.body.traslado.huboTraslado : report.hayTraslado);
    const hospitalValue = req.body.hospital !== undefined ? req.body.hospital : (req.body.traslado?.hospital !== undefined ? req.body.traslado.hospital : report.hospital);
    const quienRecibeValue = req.body.quienRecibe !== undefined ? req.body.quienRecibe : (req.body.traslado?.quienRecibe !== undefined ? req.body.traslado.quienRecibe : report.quienRecibe);

    // Determinar el tipo automáticamente basado en esPrivada y esFalsaAlarma (para updates)
    const esFalsaAlarmaValue = req.body.esFalsaAlarma !== undefined ? req.body.esFalsaAlarma : report.esFalsaAlarma;
    let tipoValue = req.body.tipo !== undefined ? req.body.tipo : report.tipo;

    // Prioridad: esFalsaAlarma > esPrivada > tipo original
    if (esFalsaAlarmaValue === true) {
      tipoValue = 'falsaAlarma';
    } else if (esPrivadaValue === true) {
      tipoValue = 'privada';
    } else if (esFalsaAlarmaValue === false && esPrivadaValue === false) {
      // Si ambos son false, restaurar al tipo original si fue enviado
      tipoValue = req.body.tipo !== undefined ? req.body.tipo : report.tipo;
    }

    // Validar si la ambulancia está siendo modificada y ya está asignada
    if (req.body.ambulancia &&
        req.body.ambulancia !== report.ambulancia &&
        !req.body.autorizacionJefe) {

      const fechaHoraLlamada = req.body.fechaHoraLlamada
        ? new Date(req.body.fechaHoraLlamada)
        : new Date(report.fechaHoraLlamada);

      const validacion = await validarUnidadDuplicada(
        req.body.ambulancia,
        req.params.id,
        fechaHoraLlamada
      );

      if (validacion.isDuplicate) {
        return res.status(409).json({
          message: 'La unidad ya está asignada a otro incidente activo o del mismo día',
          requiresAuthorization: true,
          conflictingReport: {
            id: validacion.reporteDuplicado._id,
            folio: validacion.reporteDuplicado.folio,
            fechaHoraLlamada: validacion.reporteDuplicado.fechaHoraLlamada,
            ubicacion: validacion.reporteDuplicado.ubicacion,
          }
        });
      }
    }

    const updateData = {
      ...bodyData,
      tipo: tipoValue, // Usar el tipo calculado
      fechaHoraLlamada: req.body.fechaHoraLlamada ? new Date(req.body.fechaHoraLlamada) : report.fechaHoraLlamada,
      fechaHoraArribo: req.body.fechaHoraArribo ? new Date(req.body.fechaHoraArribo) : report.fechaHoraArribo,
      fechaHoraCierre: req.body.fechaHoraCierre ? new Date(req.body.fechaHoraCierre) : report.fechaHoraCierre,

      // Actualizar ambas versiones de los campos
      kilometros: kilometrosValue,
      kmRecorridos: kilometrosValue,

      tiempoAtencionMin: tiempoAtencionValue,
      tiempoDeAtencion: tiempoAtencionValue,

      tiempoTrasladoMin: tiempoTrasladoValue,
      tiempoDeTraslado: tiempoTrasladoValue,

      entidad: entidadValue,
      entidadUnidad: entidadValue,

      esFalsaAlarma: esFalsaAlarmaValue,
      esPrivada: esPrivadaValue,
      privadaLlegoAntes: esPrivadaValue,

      // Campos de paciente
      pacienteNombre: pacienteNombreValue,
      pacienteEdad: pacienteEdadValue,
      pacienteSexo: pacienteSexoValue,

      // Campos de traslado
      hayTraslado: hayTrasladoValue,
      hospital: hospitalValue,
      quienRecibe: quienRecibeValue,

      updatedAt: new Date(),
    };

    let updatedReport: any = null;

    if (usingDatabase) {
      try {
        const reportsCollection = getReportsCollection();
        await reportsCollection.updateOne(
          { _id: new ObjectId(req.params.id) },
          { $set: updateData }
        );

        updatedReport = await reportsCollection.findOne({ _id: new ObjectId(req.params.id) });
        if (updatedReport) {
          updatedReport = {
            ...updatedReport,
            id: updatedReport._id?.toString(),
            _id: updatedReport._id?.toString()
          };
        }

        console.log('MongoDB: Reporte actualizado:', req.params.id);
      } catch (dbError) {
        console.warn('Error al actualizar en MongoDB:', dbError);
        usingDatabase = false;
      }
    }

    if (!usingDatabase) {
      // Actualizar en memoria
      const reportIndex = memoryReports.findIndex(r => r._id === req.params.id);
      if (reportIndex !== -1) {
        memoryReports[reportIndex] = {
          ...report,
          ...updateData,
        };
        updatedReport = memoryReports[reportIndex];
        console.log('Memoria: Reporte actualizado:', req.params.id);
      }
    }

    if (!updatedReport) {
      return res.status(404).json({ message: 'Reporte no encontrado para actualizar' });
    }

    // Si hubo autorización del jefe, registrar en bitácora
    if (req.body.autorizacionJefe) {
      await registrarEnBitacora({
        tipo: 'autorizacion_unidad_duplicada',
        recursoId: new ObjectId(req.params.id),
        recursoTipo: 'reporte',
        usuario: req.body.autorizacionJefe.autorizadoPor || req.user.username,
        usuarioRole: req.user.role,
        accion: 'Autorización para asignar unidad duplicada en actualización de reporte',
        detalles: {
          ambulancia: req.body.ambulancia,
          motivoAutorizacion: req.body.autorizacionJefe.motivo || 'Sin motivo especificado',
        },
        timestamp: new Date(),
      });
    }

    // Log actualización de reporte
    try {
      await getAuditLogsCollection().insertOne({
        tipo: 'editar_reporte',
        recursoId: req.params.id,
        recursoTipo: 'reporte',
        usuario: req.user.username,
        usuarioRole: req.user.role,
        accion: 'Reporte actualizado exitosamente',
        detalles: {
          folio: updatedReport.folio,
          tipo: updatedReport.tipo,
          ambulancia: updatedReport.ambulancia,
          source: usingDatabase ? 'MongoDB' : 'Memory'
        },
        timestamp: new Date()
      });
    } catch (logError) {
      console.error('Error logging report update:', logError);
    }

    res.json({
      data: updatedReport,
      source: usingDatabase ? 'MongoDB' : 'Memory'
    });
  } catch (error) {
    console.error('Error al actualizar reporte:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

export const deleteReport = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Usuario no autenticado' });
    }

    if (req.user.role !== 'admin' && req.user.role !== 'jefe') {
      return res.status(403).json({ message: 'No tienes permiso para eliminar reportes' });
    }

    let deleted = false;
    let usingDatabase = true;

    try {
      // Intentar usar MongoDB
      const reportsCollection = getReportsCollection();
      const result = await reportsCollection.deleteOne({ _id: new ObjectId(req.params.id) });
      deleted = result.deletedCount > 0;

      if (deleted) {
        console.log('MongoDB: Reporte eliminado:', req.params.id);
      }
    } catch (dbError) {
      console.warn('Error de MongoDB, eliminando de memoria:', dbError instanceof Error ? dbError.message : String(dbError));
      usingDatabase = false;

      const reportIndex = memoryReports.findIndex(r => r._id === req.params.id);
      if (reportIndex !== -1) {
        memoryReports.splice(reportIndex, 1);
        deleted = true;
        console.log('Memoria: Reporte eliminado:', req.params.id, 'Total reportes:', memoryReports.length);
      }
    }

    if (!deleted) {
      return res.status(404).json({ message: 'Reporte no encontrado para eliminar' });
    }

    // Log eliminación de reporte
    try {
      await getAuditLogsCollection().insertOne({
        tipo: 'eliminar_reporte',
        recursoId: req.params.id,
        recursoTipo: 'reporte',
        usuario: req.user.username,
        usuarioRole: req.user.role,
        accion: 'Reporte eliminado exitosamente',
        detalles: {
          source: usingDatabase ? 'MongoDB' : 'Memory'
        },
        timestamp: new Date()
      });
    } catch (logError) {
      console.error('Error logging report deletion:', logError);
    }

    res.json({
      data: { id: req.params.id },
      message: 'Reporte eliminado exitosamente',
      source: usingDatabase ? 'MongoDB' : 'Memory'
    });
  } catch (error) {
    console.error('Error al eliminar reporte:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

export const approveReport = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Usuario no autenticado' });
    }

    if (req.user.role !== 'admin' && req.user.role !== 'jefe') {
      return res.status(403).json({ message: 'No tienes permiso para aprobar reportes' });
    }

    let report: any = null;
    let usingDatabase = true;

    try {
      // Intentar usar MongoDB
      const reportsCollection = getReportsCollection();
      report = await reportsCollection.findOne({ _id: new ObjectId(req.params.id) });
    } catch (dbError) {
      console.warn('Error de MongoDB, buscando en memoria:', dbError instanceof Error ? dbError.message : String(dbError));
      usingDatabase = false;
      report = memoryReports.find(r => r._id === req.params.id);
    }

    if (!report) {
      return res.status(404).json({ message: 'Reporte no encontrado' });
    }

    const updateData = {
      casoAprobado: true,
      observacionesJefe: req.body.observacionesJefe || report.observacionesJefe,
      updatedAt: new Date(),
    };
    // No incluir _id ni id en las actualizaciones

    let approvedReport: any = null;

    if (usingDatabase) {
      try {
        const reportsCollection = getReportsCollection();
        await reportsCollection.updateOne(
          { _id: new ObjectId(req.params.id) },
          { $set: updateData }
        );

        approvedReport = await reportsCollection.findOne({ _id: new ObjectId(req.params.id) });
        if (approvedReport) {
          approvedReport = {
            ...approvedReport,
            id: approvedReport._id?.toString(),
            _id: approvedReport._id?.toString()
          };
        }

        console.log('MongoDB: Reporte aprobado:', req.params.id);
      } catch (dbError) {
        console.warn('Error al aprobar en MongoDB:', dbError);
        usingDatabase = false;
      }
    }

    if (!usingDatabase) {
      // Actualizar en memoria
      const reportIndex = memoryReports.findIndex(r => r._id === req.params.id);
      if (reportIndex !== -1) {
        memoryReports[reportIndex] = {
          ...report,
          ...updateData,
        };
        approvedReport = memoryReports[reportIndex];
        console.log('Memoria: Reporte aprobado:', req.params.id);
      }
    }

    if (!approvedReport) {
      return res.status(404).json({ message: 'Reporte no encontrado para aprobar' });
    }

    res.json({
      data: approvedReport,
      message: 'Reporte aprobado exitosamente',
      source: usingDatabase ? 'MongoDB' : 'Memory'
    });
  } catch (error) {
    console.error('Error al aprobar reporte:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

// Obtener bitácora de auditoría (solo jefe y admin)
export const getAuditLogs = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Usuario no autenticado' });
    }

    // Solo jefes y admins pueden ver la bitácora
    if (req.user.role !== 'jefe' && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'No tienes permiso para ver la bitácora' });
    }

    const { reporteId, tipo, page = '1', perPage = '25' } = req.query;
    const pageNum = parseInt(page as string);
    const perPageNum = parseInt(perPage as string);
    const skip = (pageNum - 1) * perPageNum;

    const filter: any = {};

    if (reporteId) {
      filter.reporteId = new ObjectId(reporteId as string);
    }

    if (tipo) {
      filter.tipo = tipo;
    }

    const auditLogsCollection = getAuditLogsCollection();

    const total = await auditLogsCollection.countDocuments(filter);
    const logs = await auditLogsCollection
      .find(filter)
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(perPageNum)
      .toArray();

    res.json({
      data: logs,
      total,
      page: pageNum,
      perPage: perPageNum,
    });
  } catch (error) {
    console.error('Error al obtener bitácora:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};