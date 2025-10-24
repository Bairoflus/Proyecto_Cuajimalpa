import { Response } from 'express';
import { AuthRequest } from '../types';
import { getReportsCollection, getUsersCollection, getAuditLogsCollection } from '../models/collections';

export const getStats = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Usuario no autenticado' });
    }

    if (req.user.role !== 'admin') {
      // Log de acceso denegado
      try {
        await getAuditLogsCollection().insertOne({
          tipo: 'acceso_denegado',
          usuario: req.user.username,
          usuarioRole: req.user.role,
          accion: 'Acceso a estadísticas denegado',
          detalles: {},
          timestamp: new Date()
        });
      } catch (logError) {
        console.error('Error logging access denied:', logError);
      }
      return res.status(403).json({ message: 'Solo los administradores pueden ver estadísticas completas' });
    }

    // Log de acceso exitoso a estadísticas
    try {
      await getAuditLogsCollection().insertOne({
        tipo: 'acceso_estadisticas',
        usuario: req.user.username,
        usuarioRole: req.user.role,
        accion: 'Acceso a estadísticas exitoso',
        detalles: {
          ip: req.ip,
          userAgent: req.get('User-Agent'),
          metodo: req.method,
          url: req.originalUrl
        },
        timestamp: new Date()
      });
    } catch (logError) {
      console.error('Error logging stats access:', logError);
    }

    const reportsCollection = getReportsCollection();
    const usersCollection = getUsersCollection();

    // Obtener todos los reportes
    const allReports = await reportsCollection.find({}).toArray();
    const totalReportes = allReports.length;

    if (totalReportes === 0) {
      return res.json({
        totalReportes: 0,
        reportesHoy: 0,
        message: 'No hay reportes disponibles para generar estadísticas'
      });
    }

    // Reportes de hoy
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const reportesHoy = allReports.filter(r => {
      const fecha = new Date(r.fechaHoraLlamada);
      fecha.setHours(0, 0, 0, 0);
      return fecha.getTime() === hoy.getTime();
    }).length;

    // Calcular tiempos promedio
    const reportesConTiempos = allReports.filter(r => r.fechaHoraLlamada && r.fechaHoraArribo);
    let tiempoPromedioRespuesta = 0;
    if (reportesConTiempos.length > 0) {
      const tiempos = reportesConTiempos.map(r => {
        const llamada = new Date(r.fechaHoraLlamada);
        const arribo = new Date(r.fechaHoraArribo);
        return (arribo.getTime() - llamada.getTime()) / (1000 * 60); // en minutos
      });
      tiempoPromedioRespuesta = Number((tiempos.reduce((a, b) => a + b, 0) / tiempos.length).toFixed(1));
    }

    // Tiempo promedio de atención (soportar ambos campos)
    const reportesConAtencion = allReports.filter(r => {
      const tiempo = r.tiempoAtencionMin || r.tiempoDeAtencion;
      return tiempo && tiempo > 0;
    });
    let tiempoPromedioAtencion = 0;
    if (reportesConAtencion.length > 0) {
      tiempoPromedioAtencion = Number(
        (reportesConAtencion.reduce((sum, r) => sum + (r.tiempoAtencionMin || r.tiempoDeAtencion || 0), 0) / reportesConAtencion.length).toFixed(1)
      );
    }

    // Tiempo promedio de traslado (soportar ambos campos)
    const reportesConTraslado = allReports.filter(r => {
      const tiempo = r.tiempoTrasladoMin || r.tiempoDeTraslado;
      return tiempo && tiempo > 0;
    });
    let tiempoPromedioTraslado = 0;
    if (reportesConTraslado.length > 0) {
      tiempoPromedioTraslado = Number(
        (reportesConTraslado.reduce((sum, r) => sum + (r.tiempoTrasladoMin || r.tiempoDeTraslado || 0), 0) / reportesConTraslado.length).toFixed(1)
      );
    }

    // Kilómetros totales (soportar ambos campos)
    const kmTotales = allReports.reduce((sum, r) => sum + (r.kilometros || r.kmRecorridos || 0), 0);

    // Falsas alarmas y privadas (soportar ambos campos)
    const falsasAlarmas = allReports.filter(r => r.esFalsaAlarma === true).length;
    const reportesPrivada = allReports.filter(r => r.esPrivada === true || r.privadaLlegoAntes === true).length;

    // Distribución por tipo
    const tiposCount: any = {};
    allReports.forEach(r => {
      tiposCount[r.tipo] = (tiposCount[r.tipo] || 0) + 1;
    });
    const distribucionTipo = Object.entries(tiposCount).map(([tipo, cantidad]: [string, any]) => ({
      tipo: tipo.charAt(0).toUpperCase() + tipo.slice(1),
      cantidad,
      porcentaje: Math.round((cantidad / totalReportes) * 100)
    }));

    // Distribución por gravedad
    const gravedadCount: any = {};
    const gravedadColors: any = {
      alta: '#ef4444',
      media: '#f59e0b',
      baja: '#10b981'
    };
    allReports.forEach(r => {
      gravedadCount[r.gravedad] = (gravedadCount[r.gravedad] || 0) + 1;
    });
    const distribucionGravedad = Object.entries(gravedadCount).map(([gravedad, cantidad]: [string, any]) => ({
      gravedad: gravedad.charAt(0).toUpperCase() + gravedad.slice(1),
      cantidad,
      porcentaje: Math.round((cantidad / totalReportes) * 100),
      color: gravedadColors[gravedad] || '#6b7280'
    }));

    // Reportes por hora
    const horasCount: any = {};
    allReports.forEach(r => {
      const fecha = new Date(r.fechaHoraLlamada);
      const hora = `${fecha.getHours().toString().padStart(2, '0')}:00`;
      horasCount[hora] = (horasCount[hora] || 0) + 1;
    });
    const reportesPorHora = Object.entries(horasCount)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([hora, cantidad]) => ({ hora, cantidad }));

    // Estadísticas por ambulancia
    const ambulanciaStats: any = {};
    allReports.forEach(r => {
      if (!r.ambulancia) return;
      if (!ambulanciaStats[r.ambulancia]) {
        ambulanciaStats[r.ambulancia] = {
          ambulancia: r.ambulancia,
          servicios: 0,
          kmTotales: 0,
          tiemposRespuesta: []
        };
      }
      ambulanciaStats[r.ambulancia].servicios++;
      ambulanciaStats[r.ambulancia].kmTotales += r.kilometros || r.kmRecorridos || 0;
      if (r.fechaHoraLlamada && r.fechaHoraArribo) {
        const tiempo = (new Date(r.fechaHoraArribo).getTime() - new Date(r.fechaHoraLlamada).getTime()) / (1000 * 60);
        ambulanciaStats[r.ambulancia].tiemposRespuesta.push(tiempo);
      }
    });
    const estadisticasAmbulancia = Object.values(ambulanciaStats).map((amb: any) => ({
      ambulancia: amb.ambulancia,
      servicios: amb.servicios,
      kmTotales: amb.kmTotales,
      kmPromedio: Number((amb.kmTotales / amb.servicios).toFixed(1)),
      tiempoPromedioRespuesta: amb.tiemposRespuesta.length > 0
        ? Number((amb.tiemposRespuesta.reduce((a: number, b: number) => a + b, 0) / amb.tiemposRespuesta.length).toFixed(1))
        : 0
    }));

    // Estadísticas por paramédico
    const paramedicoStats: any = {};
    allReports.forEach(r => {
      if (!r.paramedico) return;
      if (!paramedicoStats[r.paramedico]) {
        paramedicoStats[r.paramedico] = {
          parametrico: r.paramedico,
          servicios: 0,
          tiempos: []
        };
      }
      paramedicoStats[r.paramedico].servicios++;
      if (r.fechaHoraLlamada && r.fechaHoraArribo) {
        const tiempo = (new Date(r.fechaHoraArribo).getTime() - new Date(r.fechaHoraLlamada).getTime()) / (1000 * 60);
        paramedicoStats[r.paramedico].tiempos.push(tiempo);
      }
    });
    const estadisticasParametrico = Object.values(paramedicoStats).map((p: any) => ({
      parametrico: p.parametrico,
      servicios: p.servicios,
      tiempoPromedio: p.tiempos.length > 0
        ? Number((p.tiempos.reduce((a: number, b: number) => a + b, 0) / p.tiempos.length).toFixed(1))
        : 0
    }));

    // Ubicaciones frecuentes
    const ubicacionStats: any = {};
    allReports.forEach(r => {
      if (!r.ubicacion || typeof r.ubicacion !== 'string') return;
      // Extraer primeras 2-3 palabras como zona
      const zona = r.ubicacion.split(' ').slice(0, 3).join(' ');
      if (!ubicacionStats[zona]) {
        ubicacionStats[zona] = {
          zona,
          reportes: 0,
          tiempos: []
        };
      }
      ubicacionStats[zona].reportes++;
      if (r.fechaHoraLlamada && r.fechaHoraArribo) {
        const tiempo = (new Date(r.fechaHoraArribo).getTime() - new Date(r.fechaHoraLlamada).getTime()) / (1000 * 60);
        ubicacionStats[zona].tiempos.push(tiempo);
      }
    });
    const ubicacionesFrecuentes = Object.values(ubicacionStats)
      .map((u: any) => ({
        zona: u.zona,
        reportes: u.reportes,
        tiempoPromedio: u.tiempos.length > 0
          ? Number((u.tiempos.reduce((a: number, b: number) => a + b, 0) / u.tiempos.length).toFixed(1))
          : 0
      }))
      .sort((a: any, b: any) => b.reportes - a.reportes)
      .slice(0, 6);

    // Estadísticas prehospitalarias
    const reportesPrehospitalaria = allReports.filter(r => r.tipo === 'prehospitalaria');
    // Soportar ambos formatos de traslado
    const prehospitalariaConTraslado = reportesPrehospitalaria.filter(r =>
      r.hayTraslado === true || r.traslado?.huboTraslado === true
    );

    const hospitalStats: any = {};
    prehospitalariaConTraslado.forEach(r => {
      // Soportar ambos formatos de hospital
      const hospital = r.hospital || r.traslado?.hospital;
      if (hospital) {
        hospitalStats[hospital] = (hospitalStats[hospital] || 0) + 1;
      }
    });
    const hospitalesDestino = Object.entries(hospitalStats)
      .map(([hospital, traslados]) => ({ hospital, traslados }))
      .sort((a: any, b: any) => b.traslados - a.traslados)
      .slice(0, 5);

    const edadStats: any = {
      '0-18': 0,
      '19-35': 0,
      '36-50': 0,
      '51-65': 0,
      '65+': 0
    };
    reportesPrehospitalaria.forEach(r => {
      // Soportar ambos formatos de edad
      const edad = r.pacienteEdad !== undefined ? r.pacienteEdad : r.paciente?.edad;
      if (edad !== undefined) {
        if (edad <= 18) edadStats['0-18']++;
        else if (edad <= 35) edadStats['19-35']++;
        else if (edad <= 50) edadStats['36-50']++;
        else if (edad <= 65) edadStats['51-65']++;
        else edadStats['65+']++;
      }
    });
    const distribucionEdad = Object.entries(edadStats).map(([rango, cantidad]) => ({ rango, cantidad }));

    const estadisticasPrehospitalaria = {
      total: reportesPrehospitalaria.length,
      conTraslado: prehospitalariaConTraslado.length,
      porcentajeTraslado: reportesPrehospitalaria.length > 0
        ? Math.round((prehospitalariaConTraslado.length / reportesPrehospitalaria.length) * 100)
        : 0,
      hospitalesDestino,
      distribucionEdad
    };

    // Estadísticas urbanas
    const reportesUrbana = allReports.filter(r => r.tipo === 'urbana');
    const urbanaConEvidencias = reportesUrbana.filter(r => r.evidenciasFotograficas === true);
    const urbanaRequierenNota = reportesUrbana.filter(r => r.notaInformativa === true);

    const estadisticasUrbana = {
      total: reportesUrbana.length,
      conEvidencias: urbanaConEvidencias.length,
      porcentajeEvidencias: reportesUrbana.length > 0
        ? Math.round((urbanaConEvidencias.length / reportesUrbana.length) * 100)
        : 0,
      requierenNota: urbanaRequierenNota.length,
      porcentajeNota: reportesUrbana.length > 0
        ? Math.round((urbanaRequierenNota.length / reportesUrbana.length) * 100)
        : 0
    };

    // Indicadores de calidad
    const reportesCerrados = allReports.filter(r => r.fechaHoraCierre !== null);
    const porcentajeFalsasAlarmas = Number(((falsasAlarmas / totalReportes) * 100).toFixed(1));
    const porcentajeCasosCerrados = Number(((reportesCerrados.length / totalReportes) * 100).toFixed(1));
    const tiempoTotalPromedio = tiempoPromedioRespuesta + tiempoPromedioAtencion;
    const eficienciaTraslados = prehospitalariaConTraslado.length > 0
      ? Number((((prehospitalariaConTraslado.length) / prehospitalariaConTraslado.length) * 100).toFixed(1))
      : 0;

    const indicadoresCalidad = {
      porcentajeFalsasAlarmas,
      porcentajeCasosCerrados,
      tiempoTotalPromedio: Number(tiempoTotalPromedio.toFixed(1)),
      eficienciaTraslados
    };

    // Obtener usuarios (paramédicos y operadores)
    const usuarios = await usersCollection
      .find({ role: { $in: ['paramedico', 'operador'] } })
      .toArray();

    const totalUsuarios = usuarios.length;

    res.json({
      totalReportes,
      reportesHoy,
      tiempoPromedioRespuesta,
      tiempoPromedioAtencion,
      tiempoPromedioTraslado,
      kmTotales,
      falsasAlarmas,
      distribucionTipo,
      distribucionGravedad,
      reportesPorHora,
      estadisticasAmbulancia,
      estadisticasParametrico,
      ubicacionesFrecuentes,
      estadisticasPrehospitalaria,
      estadisticasUrbana,
      indicadoresCalidad,
      totalUsuarios,
      reportesPendientesCierre: totalReportes - reportesCerrados.length
    });
  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    res.status(500).json({ message: 'Error al obtener estadísticas' });
  }
};
