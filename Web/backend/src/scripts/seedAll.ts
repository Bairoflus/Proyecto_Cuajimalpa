import dotenv from 'dotenv';
import { connectDB, closeDB } from '../config/database';
import { getUsersCollection, getReportsCollection, createIndexes } from '../models/collections';
import argon2 from 'argon2';
import { IUser, IReport } from '../types';

dotenv.config();

const seedAll = async () => {
  try {
    console.log('INICIANDO SEED COMPLETO DEL SISTEMA DE CUAJIMALPA');
    console.log('='.repeat(60));

    await connectDB();
    console.log('Conectado a MongoDB');

    await createIndexes();
    console.log('Indices creados/verificados');

    console.log('\nSEEDING USUARIOS...');
    const usersCollection = getUsersCollection();

    const users: IUser[] = [
      {
        username: 'admin',
        password: await argon2.hash('admin123'),
        fullName: 'Administrador del Sistema',
        role: 'admin',
        turno: '1',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        username: 'admin2',
        password: await argon2.hash('admin123'),
        fullName: 'Administrador Nocturno',
        role: 'admin',
        turno: '3',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        username: 'jefe1',
        password: await argon2.hash('jefe123'),
        fullName: 'Comandante Roberto Silva',
        role: 'jefe',
        turno: '1',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        username: 'jefe2',
        password: await argon2.hash('jefe123'),
        fullName: 'Comandante Ana López',
        role: 'jefe',
        turno: '2',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        username: 'jefe3',
        password: await argon2.hash('jefe123'),
        fullName: 'Comandante Miguel Torres',
        role: 'jefe',
        turno: '3',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        username: 'jefe4',
        password: await argon2.hash('jefe123'),
        fullName: 'Comandante Laura Ruiz',
        role: 'jefe',
        turno: '4',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        username: 'jefe5',
        password: await argon2.hash('jefe123'),
        fullName: 'Comandante José Hernández',
        role: 'jefe',
        turno: '5',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        username: 'jefe6',
        password: await argon2.hash('jefe123'),
        fullName: 'Comandante Patricia Morales',
        role: 'jefe',
        turno: '6',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        username: 'paramedico1',
        password: await argon2.hash('para123'),
        fullName: 'Dr. Carlos Mendoza',
        role: 'paramedico',
        turno: '1',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        username: 'paramedico2',
        password: await argon2.hash('para123'),
        fullName: 'Lic. Carmen Vega',
        role: 'paramedico',
        turno: '1',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        username: 'paramedico3',
        password: await argon2.hash('para123'),
        fullName: 'Dr. Fernando Jiménez',
        role: 'paramedico',
        turno: '2',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        username: 'paramedico4',
        password: await argon2.hash('para123'),
        fullName: 'Enf. Sofía Ramírez',
        role: 'paramedico',
        turno: '2',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        username: 'paramedico5',
        password: await argon2.hash('para123'),
        fullName: 'Dr. Luis González',
        role: 'paramedico',
        turno: '3',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        username: 'paramedico6',
        password: await argon2.hash('para123'),
        fullName: 'Lic. Elena Castro',
        role: 'paramedico',
        turno: '3',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        username: 'paramedico7',
        password: await argon2.hash('para123'),
        fullName: 'Dr. Ricardo Flores',
        role: 'paramedico',
        turno: '4',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        username: 'paramedico8',
        password: await argon2.hash('para123'),
        fullName: 'Enf. Diana Herrera',
        role: 'paramedico',
        turno: '4',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        username: 'paramedico9',
        password: await argon2.hash('para123'),
        fullName: 'Dr. Arturo Sánchez',
        role: 'paramedico',
        turno: '5',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        username: 'paramedico10',
        password: await argon2.hash('para123'),
        fullName: 'Lic. Gabriela Medina',
        role: 'paramedico',
        turno: '5',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        username: 'paramedico11',
        password: await argon2.hash('para123'),
        fullName: 'Dr. Manuel Rivera',
        role: 'paramedico',
        turno: '6',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        username: 'paramedico12',
        password: await argon2.hash('para123'),
        fullName: 'Enf. Alejandra Vargas',
        role: 'paramedico',
        turno: '6',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        username: 'operador1',
        password: await argon2.hash('oper123'),
        fullName: 'Juan Pérez Martínez',
        role: 'operador',
        turno: '1',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        username: 'operador2',
        password: await argon2.hash('oper123'),
        fullName: 'María González López',
        role: 'operador',
        turno: '1',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        username: 'operador3',
        password: await argon2.hash('oper123'),
        fullName: 'Pedro Rodríguez Cruz',
        role: 'operador',
        turno: '2',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        username: 'operador4',
        password: await argon2.hash('oper123'),
        fullName: 'Lucía Fernández Díaz',
        role: 'operador',
        turno: '2',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        username: 'operador5',
        password: await argon2.hash('oper123'),
        fullName: 'Antonio García Valdez',
        role: 'operador',
        turno: '3',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        username: 'operador6',
        password: await argon2.hash('oper123'),
        fullName: 'Isabel Moreno Santos',
        role: 'operador',
        turno: '3',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        username: 'operador7',
        password: await argon2.hash('oper123'),
        fullName: 'Raúl Martín Pérez',
        role: 'operador',
        turno: '4',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        username: 'operador8',
        password: await argon2.hash('oper123'),
        fullName: 'Carolina Jiménez Luna',
        role: 'operador',
        turno: '4',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        username: 'operador9',
        password: await argon2.hash('oper123'),
        fullName: 'Sergio Romero García',
        role: 'operador',
        turno: '5',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        username: 'operador10',
        password: await argon2.hash('oper123'),
        fullName: 'Verónica Aguilar Rojas',
        role: 'operador',
        turno: '5',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        username: 'operador11',
        password: await argon2.hash('oper123'),
        fullName: 'David Castro Mejía',
        role: 'operador',
        turno: '6',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        username: 'operador12',
        password: await argon2.hash('oper123'),
        fullName: 'Claudia Torres Núñez',
        role: 'operador',
        turno: '6',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    for (const userData of users) {
      const existingUser = await usersCollection.findOne({ username: userData.username });

      if (existingUser) {
        console.log(`   Usuario ${userData.username} ya existe, saltando...`);
      } else {
        await usersCollection.insertOne(userData);
        console.log(`   Usuario ${userData.username} creado`);
      }
    }

    console.log(`Usuarios procesados: ${users.length} usuarios en total`);

    console.log('\nSEEDING REPORTES...');
    const reportsCollection = getReportsCollection();

    console.log('   Limpiando reportes existentes...');
    await reportsCollection.deleteMany({});

    const { getNextFolio } = require('../models/collections');

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

    const reports: Partial<IReport>[] = [];
    const now = new Date();

    console.log('   Generando reportes de prueba...');

    for (let i = 0; i < 75; i++) {
      const fechaLlamada = new Date(now.getTime() - Math.random() * 45 * 24 * 60 * 60 * 1000);
      const fechaArribo = new Date(fechaLlamada.getTime() + Math.random() * 45 * 60 * 1000);
      const fechaCierre = Math.random() > 0.25 ? new Date(fechaArribo.getTime() + Math.random() * 240 * 60 * 1000) : null;

      const turno = (Math.floor(Math.random() * 6) + 1).toString() as '1' | '2' | '3' | '4' | '5' | '6';
      const tipo = Math.random() > 0.25
        ? (Math.random() > 0.45 ? 'prehospitalaria' : 'urbana')
        : Math.random() > 0.6 ? 'otro' : Math.random() > 0.4 ? 'privada' : 'falsaAlarma';

      const gravedad = Math.random() > 0.5
        ? 'alta'
        : Math.random() > 0.3 ? 'media' : 'baja';

      const esFalsaAlarma = tipo === 'falsaAlarma';
      const esPrivada = tipo === 'privada';
      const hayTraslado = tipo === 'prehospitalaria' && Math.random() > 0.15;

      const folio = tipo === 'prehospitalaria' || tipo === 'urbana' ? await getNextFolio() : null;

      const report: Partial<IReport> = {
        folio,
        tipo: tipo as any,
        gravedad: gravedad as any,
        fechaHoraLlamada: fechaLlamada,
        fechaHoraArribo: fechaArribo,
        fechaHoraCierre: fechaCierre,

        ubicacion: ubicaciones[Math.floor(Math.random() * ubicaciones.length)],
        delegacion: 'Cuajimalpa de Morelos',
        lugarOcurrencia: ['via_publica', 'hogar', 'trabajo', 'escuela', 'transporte_publico'][Math.floor(Math.random() * 5)],

        ambulancia: ambulancias[Math.floor(Math.random() * ambulancias.length)],
        entidad: entidades[Math.floor(Math.random() * entidades.length)],
        paramedico: parametricos[Math.floor(Math.random() * parametricos.length)],
        creadoPor: operadores[Math.floor(Math.random() * operadores.length)],
        turnoCreacion: turno,

        kilometros: Math.floor(Math.random() * 50) + 5,
        tiempoAtencionMin: Math.floor(Math.random() * 90) + 10,
        tiempoTrasladoMin: hayTraslado ? Math.floor(Math.random() * 45) + 5 : 0,

        esFalsaAlarma,
        esPrivada,
        motivoFalsaAlarma: esFalsaAlarma ? ['Llamada de broma', 'Error al marcar', 'Confusión de emergencia', 'Problema resuelto antes del arribo'][Math.floor(Math.random() * 4)] : undefined,
        motivoPrivada: esPrivada ? 'Ambulancia privada llegó primero al lugar' : undefined,

        ...(tipo === 'prehospitalaria' && {
          pacienteNombre: ['Juan García López', 'María Rodríguez', 'Carlos Hernández', 'Ana Martínez', 'Luis Torres', 'Patricia Morales'][Math.floor(Math.random() * 6)],
          pacienteEdad: Math.floor(Math.random() * 80) + 5,
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
          nivelConciencia: ['alerta', 'verbal', 'dolor', 'inconsciente'][Math.floor(Math.random() * 4)] as 'alerta' | 'verbal' | 'dolor' | 'inconsciente',
        }),

        ...(hayTraslado && {
          hayTraslado: true,
          hospital: hospitales[Math.floor(Math.random() * hospitales.length)],
          quienRecibe: `Dr. ${['González', 'Pérez', 'López', 'Martínez', 'Rodríguez'][Math.floor(Math.random() * 5)]}`,
        }),

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

        observaciones: `Reporte generado automáticamente para turno ${turno}`,
        casoAprobado: Math.random() > 0.2,
        requiereRevision: Math.random() > 0.85,
        createdAt: fechaLlamada,
        updatedAt: fechaCierre || fechaArribo,
      };

      reports.push(report);
    }

    for (const reportData of reports) {
      try {
        await reportsCollection.insertOne(reportData as IReport);
      } catch (error) {
        console.error('   Error al insertar reporte:', error);
      }
    }

    console.log(`Reportes insertados: ${reports.length} reportes generados`);

    console.log('\n' + '='.repeat(60));
    console.log('SEED COMPLETO FINALIZADO EXITOSAMENTE');
    console.log('='.repeat(60));

    console.log('\nRESUMEN DE DATOS GENERADOS:');

    console.log('\nUSUARIOS:');
    console.log('   • 2 Administradores');
    console.log('   • 6 Jefes de Turno (1 por turno)');
    console.log('   • 12 Paramédicos (2 por turno)');
    console.log('   • 12 Operadores (2 por turno)');
    console.log('   Total: 26 usuarios');

    const prehospitalarios = reports.filter(r => r.tipo === 'prehospitalaria').length;
    const urbanos = reports.filter(r => r.tipo === 'urbana').length;
    const otros = reports.filter(r => r.tipo === 'otro').length;
    const privados = reports.filter(r => r.tipo === 'privada').length;
    const falsas = reports.filter(r => r.tipo === 'falsaAlarma').length;

    console.log('\nREPORTES:');
    console.log(`   Prehospitalarios: ${prehospitalarios}`);
    console.log(`   Urbanos: ${urbanos}`);
    console.log(`   Otros: ${otros}`);
    console.log(`   Privados: ${privados}`);
    console.log(`   Falsas Alarmas: ${falsas}`);
    console.log(`   Total: ${reports.length} reportes`);

    console.log('\nCREDENCIALES PRINCIPALES:');
    console.log('   admin / admin123 (Administrador)');
    console.log('   jefe1 / jefe123 (Comandante Roberto Silva)');
    console.log('   paramedico1 / para123 (Dr. Carlos Mendoza)');
    console.log('   operador1 / oper123 (Juan Pérez Martínez)');

    console.log('\nEl sistema está listo para usar con datos completos!');
    console.log('='.repeat(60));

    await closeDB();
    process.exit(0);
  } catch (error) {
    console.error('Error crítico en el seed:', error);
    process.exit(1);
  }
};

seedAll();