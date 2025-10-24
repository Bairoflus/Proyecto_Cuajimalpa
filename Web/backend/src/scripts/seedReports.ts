import dotenv from 'dotenv';
import { connectDB, closeDB } from '../config/database';
import { getReportsCollection, getNextFolio, createIndexes } from '../models/collections';
import { IReport } from '../types';

dotenv.config();

const seedReports = async () => {
  try {
    await connectDB();

    console.log('Conectado a MongoDB');

    // Crear índices
    await createIndexes();

    const reportsCollection = getReportsCollection();

    // Limpiar reportes existentes si se desea comenzar desde cero
    console.log('Limpiando reportes existentes...');
    await reportsCollection.deleteMany({});

    // Datos base para generar reportes variados
    const ubicaciones = [
      'Av. José María Castorena 150, San José de los Cedros',
      'Calle Prolongación 5 de Mayo, Santa Fe',
      'Av. Tamaulipas 1230, Condesa',
      'Calle Desierto de los Leones 4855, Tetelpan',
      'Av. Santa Lucía 1789, Olivar de los Padres',
      'Calle Palmas 745, Lomas de Chapultepec',
      'Av. Centenario 1001, Merced Gómez',
      'Calle Nogal 456, Santa Fe',
      'Av. Universidad 3210, Copilco',
      'Calle Revolución 890, San Ángel',
      'Av. Luis Cabrera 235, Mixcoac',
      'Calle Insurgentes Sur 1567, Del Valle'
    ];

    const ambulancias = ['AMB-001', 'AMB-002', 'AMB-003', 'AMB-004', 'AMB-005', 'AMB-006'];
    const entidades = ['Cruz Roja Mexicana', 'ERUM CDMX', 'Bomberos CDMX', 'SUMMA'];

    const parametricos = [
      'Dr. Carlos Mendoza', 'Lic. Carmen Vega', 'Dr. Fernando Jiménez', 'Enf. Sofía Ramírez',
      'Dr. Luis González', 'Lic. Elena Castro', 'Dr. Ricardo Flores', 'Enf. Diana Herrera',
      'Dr. Arturo Sánchez', 'Lic. Gabriela Medina', 'Dr. Manuel Rivera', 'Enf. Alejandra Vargas'
    ];

    const operadores = [
      'operador1', 'operador2', 'operador3', 'operador4', 'operador5', 'operador6',
      'operador7', 'operador8', 'operador9', 'operador10', 'operador11', 'operador12'
    ];

    const hospitales = [
      'Hospital General de México',
      'Hospital ABC Santa Fe',
      'Hospital Ángeles del Pedregal',
      'Hospital San José',
      'Hospital Médica Sur',
      'Hospital Español',
      'Hospital Civil de Guadalajara'
    ];

    // Generar reportes de prueba
    const reports: Partial<IReport>[] = [];
    const now = new Date();

    for (let i = 0; i < 50; i++) {
      // Fechas aleatorias en los últimos 30 días
      const fechaLlamada = new Date(now.getTime() - Math.random() * 30 * 24 * 60 * 60 * 1000);
      const fechaArribo = new Date(fechaLlamada.getTime() + Math.random() * 45 * 60 * 1000); // 0-45 min después
      const fechaCierre = Math.random() > 0.3 ? new Date(fechaArribo.getTime() + Math.random() * 240 * 60 * 1000) : null; // 70% cerrados

      const turno = (Math.floor(Math.random() * 6) + 1).toString() as '1' | '2' | '3' | '4' | '5' | '6';
      const tipo = Math.random() > 0.3
        ? (Math.random() > 0.5 ? 'prehospitalaria' : 'urbana')
        : Math.random() > 0.7 ? 'otro' : Math.random() > 0.5 ? 'privada' : 'falsaAlarma';

      const gravedad = Math.random() > 0.6
        ? 'alta'
        : Math.random() > 0.4 ? 'media' : 'baja';

      const esFalsaAlarma = tipo === 'falsaAlarma';
      const esPrivada = tipo === 'privada';
      const hayTraslado = tipo === 'prehospitalaria' && Math.random() > 0.2; // 80% de prehospitalarias tienen traslado

      const folio = tipo === 'prehospitalaria' || tipo === 'urbana' ? await getNextFolio() : null;

      const report: Partial<IReport> = {
        folio,
        tipo: tipo as any,
        gravedad: gravedad as any,
        fechaHoraLlamada: fechaLlamada,
        fechaHoraArribo: fechaArribo,
        fechaHoraCierre: fechaCierre,

        // Ubicación
        ubicacion: ubicaciones[Math.floor(Math.random() * ubicaciones.length)],
        delegacion: 'Cuajimalpa de Morelos',
        lugarOcurrencia: ['via_publica', 'hogar', 'trabajo', 'escuela', 'transporte_publico'][Math.floor(Math.random() * 5)],

        // Personal y recursos
        ambulancia: ambulancias[Math.floor(Math.random() * ambulancias.length)],
        entidad: entidades[Math.floor(Math.random() * entidades.length)],
        paramedico: parametricos[Math.floor(Math.random() * parametricos.length)],
        creadoPor: operadores[Math.floor(Math.random() * operadores.length)],
        turnoCreacion: turno,

        // Métricas
        kilometros: Math.floor(Math.random() * 50) + 5, // 5-55 km
        tiempoAtencionMin: Math.floor(Math.random() * 90) + 10, // 10-100 min
        tiempoTrasladoMin: hayTraslado ? Math.floor(Math.random() * 45) + 5 : 0, // 5-50 min si hay traslado

        // Casos especiales
        esFalsaAlarma,
        esPrivada,
        motivoFalsaAlarma: esFalsaAlarma ? ['Llamada de broma', 'Error al marcar', 'Confusión de emergencia', 'Problema resuelto antes del arribo'][Math.floor(Math.random() * 4)] : undefined,
        motivoPrivada: esPrivada ? 'Ambulancia privada llegó primero al lugar' : undefined,

        // Información del paciente (solo para prehospitalaria)
        ...(tipo === 'prehospitalaria' && {
          pacienteNombre: ['Juan García López', 'María Rodríguez', 'Carlos Hernández', 'Ana Martínez', 'Luis Torres', 'Patricia Morales'][Math.floor(Math.random() * 6)],
          pacienteEdad: Math.floor(Math.random() * 80) + 5, // 5-85 años
          pacienteSexo: Math.random() > 0.5 ? 'M' : 'F',
          diagnostico: [
            'Trauma múltiple por accidente vehicular',
            'Infarto agudo al miocardio',
            'Crisis hipertensiva',
            'Fractura de extremidad inferior',
            'Intoxicación alimentaria',
            'Crisis epiléptica',
            'Quemaduras de segundo grado',
            'Dificultad respiratoria aguda'
          ][Math.floor(Math.random() * 8)],
          nivelConciencia: ['alerta', 'verbal', 'dolor', 'inconsciente'][Math.floor(Math.random() * 4)],
        }),

        // Traslado (solo si hay traslado)
        ...(hayTraslado && {
          hayTraslado: true,
          hospital: hospitales[Math.floor(Math.random() * hospitales.length)],
          quienRecibe: `Dr. ${['González', 'Pérez', 'López', 'Martínez', 'Rodríguez'][Math.floor(Math.random() * 5)]}`,
        }),

        // Información urbana (solo para urbana)
        ...(tipo === 'urbana' && {
          incidenteUrbano: [
            'Accidente vehicular menor',
            'Fuga de gas doméstico',
            'Caída de árbol',
            'Inundación por tubería rota',
            'Animal en situación de riesgo',
            'Persona atrapada en elevador'
          ][Math.floor(Math.random() * 6)],
          descripcionEvento: 'Evento urbano atendido por personal especializado',
          accionesRealizadas: 'Se coordinó con autoridades competentes y se resolvió la situación',
          notaInformativa: Math.random() > 0.7,
          evidenciasFotograficas: Math.random() > 0.5,
        }),

        // Control
        observaciones: `Reporte generado automáticamente para turno ${turno}`,
        casoAprobado: Math.random() > 0.3, // 70% aprobados
        requiereRevision: Math.random() > 0.8, // 20% requieren revisión
        createdAt: fechaLlamada,
        updatedAt: fechaCierre || fechaArribo,
      };

      reports.push(report);
    }

    // Insertar reportes
    console.log(`Insertando ${reports.length} reportes de prueba...`);

    for (const reportData of reports) {
      try {
        await reportsCollection.insertOne(reportData as IReport);
      } catch (error) {
        console.error('Error al insertar reporte:', error);
      }
    }

    console.log('\n=== SEED DE REPORTES COMPLETADO ===');
    console.log('\nRESUMEN DE REPORTES GENERADOS:');

    const prehospitalarios = reports.filter(r => r.tipo === 'prehospitalaria').length;
    const urbanos = reports.filter(r => r.tipo === 'urbana').length;
    const otros = reports.filter(r => r.tipo === 'otro').length;
    const privados = reports.filter(r => r.tipo === 'privada').length;
    const falsas = reports.filter(r => r.tipo === 'falsaAlarma').length;

    console.log(`  Prehospitalarios: ${prehospitalarios}`);
    console.log(`  Urbanos: ${urbanos}`);
    console.log(`  Otros: ${otros}`);
    console.log(`  Privados: ${privados}`);
    console.log(`  Falsas Alarmas: ${falsas}`);

    console.log('\nDISTRIBUCION POR TURNO:');
    for (let t = 1; t <= 6; t++) {
      const porTurno = reports.filter(r => r.turnoCreacion === t.toString()).length;
      console.log(`  Turno ${t}: ${porTurno} reportes`);
    }

    const alta = reports.filter(r => r.gravedad === 'alta').length;
    const media = reports.filter(r => r.gravedad === 'media').length;
    const baja = reports.filter(r => r.gravedad === 'baja').length;

    console.log('\nDISTRIBUCION POR GRAVEDAD:');
    console.log(`  Alta: ${alta}`);
    console.log(`  Media: ${media}`);
    console.log(`  Baja: ${baja}`);

    console.log('\nTodos los reportes incluyen:');
    console.log('   - Cronometría completa');
    console.log('   - Ubicaciones realistas de Cuajimalpa');
    console.log('   - Personal asignado');
    console.log('   - Métricas de tiempo y distancia');
    console.log('   - Información de pacientes (prehospitalarios)');
    console.log('   - Datos de traslado cuando aplica');
    console.log('   - Información específica según tipo');
    console.log('=====================================\n');

    await closeDB();
    process.exit(0);
  } catch (error) {
    console.error('Error al poblar reportes:', error);
    process.exit(1);
  }
};

seedReports();