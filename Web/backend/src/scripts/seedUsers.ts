import argon2 from 'argon2';
import dotenv from 'dotenv';
import { connectDB, closeDB } from '../config/database';
import { getUsersCollection, createIndexes } from '../models/collections';
import { IUser } from '../types';

dotenv.config();

const seedUsers = async () => {
  try {
    await connectDB();
    
    console.log('Conectado a MongoDB');

    // Crear índices
    await createIndexes();

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
        password: await argon2.hash('paramedico123'),
        fullName: 'Dr. Carlos Mendoza',
        role: 'paramedico',
        turno: '1',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        username: 'paramedico2',
        password: await argon2.hash('paramedico123'),
        fullName: 'Lic. Carmen Vega',
        role: 'paramedico',
        turno: '1',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        username: 'paramedico3',
        password: await argon2.hash('paramedico123'),
        fullName: 'Dr. Fernando Jiménez',
        role: 'paramedico',
        turno: '2',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        username: 'paramedico4',
        password: await argon2.hash('paramedico123'),
        fullName: 'Enf. Sofía Ramírez',
        role: 'paramedico',
        turno: '2',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        username: 'paramedico5',
        password: await argon2.hash('paramedico123'),
        fullName: 'Dr. Luis González',
        role: 'paramedico',
        turno: '3',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        username: 'paramedico6',
        password: await argon2.hash('paramedico123'),
        fullName: 'Lic. Elena Castro',
        role: 'paramedico',
        turno: '3',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        username: 'paramedico7',
        password: await argon2.hash('paramedico123'),
        fullName: 'Dr. Ricardo Flores',
        role: 'paramedico',
        turno: '4',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        username: 'paramedico8',
        password: await argon2.hash('paramedico123'),
        fullName: 'Enf. Diana Herrera',
        role: 'paramedico',
        turno: '4',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        username: 'paramedico9',
        password: await argon2.hash('paramedico123'),
        fullName: 'Dr. Arturo Sánchez',
        role: 'paramedico',
        turno: '5',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        username: 'paramedico10',
        password: await argon2.hash('paramedico123'),
        fullName: 'Lic. Gabriela Medina',
        role: 'paramedico',
        turno: '5',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        username: 'paramedico11',
        password: await argon2.hash('paramedico123'),
        fullName: 'Dr. Manuel Rivera',
        role: 'paramedico',
        turno: '6',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        username: 'paramedico12',
        password: await argon2.hash('paramedico123'),
        fullName: 'Enf. Alejandra Vargas',
        role: 'paramedico',
        turno: '6',
        createdAt: new Date(),
        updatedAt: new Date(),
      },

      {
        username: 'operador1',
        password: await argon2.hash('operador123'),
        fullName: 'Juan Pérez Martínez',
        role: 'operador',
        turno: '1',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        username: 'operador2',
        password: await argon2.hash('operador123'),
        fullName: 'María González López',
        role: 'operador',
        turno: '1',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        username: 'operador3',
        password: await argon2.hash('operador123'),
        fullName: 'Pedro Rodríguez Cruz',
        role: 'operador',
        turno: '2',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        username: 'operador4',
        password: await argon2.hash('operador123'),
        fullName: 'Lucía Fernández Díaz',
        role: 'operador',
        turno: '2',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        username: 'operador5',
        password: await argon2.hash('operador123'),
        fullName: 'Antonio García Valdez',
        role: 'operador',
        turno: '3',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        username: 'operador6',
        password: await argon2.hash('operador123'),
        fullName: 'Isabel Moreno Santos',
        role: 'operador',
        turno: '3',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        username: 'operador7',
        password: await argon2.hash('operador123'),
        fullName: 'Raúl Martín Pérez',
        role: 'operador',
        turno: '4',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        username: 'operador8',
        password: await argon2.hash('operador123'),
        fullName: 'Carolina Jiménez Luna',
        role: 'operador',
        turno: '4',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        username: 'operador9',
        password: await argon2.hash('operador123'),
        fullName: 'Sergio Romero García',
        role: 'operador',
        turno: '5',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        username: 'operador10',
        password: await argon2.hash('operador123'),
        fullName: 'Verónica Aguilar Rojas',
        role: 'operador',
        turno: '5',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        username: 'operador11',
        password: await argon2.hash('operador123'),
        fullName: 'David Castro Mejía',
        role: 'operador',
        turno: '6',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        username: 'operador12',
        password: await argon2.hash('operador123'),
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
        console.log(`Usuario ${userData.username} ya existe, saltando...`);
      } else {
        await usersCollection.insertOne(userData);
        console.log(`Usuario ${userData.username} creado`);
      }
    }

    console.log('\nSeed de usuarios completado');
    console.log('\n=== CREDENCIALES DE PRUEBA ===');
    console.log('\nADMINISTRADORES:');
    console.log('  admin / admin123 (Turno 1)');

    console.log('\nJEFES DE TURNO:');
    console.log('  jefe1 / jefe123 (Turno 1 - Comandante Roberto Silva)');
    console.log('  jefe2 / jefe123 (Turno 2 - Comandante Ana López)');
    console.log('  jefe3 / jefe123 (Turno 3 - Comandante Miguel Torres)');
    console.log('  jefe4 / jefe123 (Turno 4 - Comandante Laura Ruiz)');
    console.log('  jefe5 / jefe123 (Turno 5 - Comandante José Hernández)');
    console.log('  jefe6 / jefe123 (Turno 6 - Comandante Patricia Morales)');

    console.log('\nPARAMEDICOS:');
    console.log('  paramedico1-12 / paramedico123 (2 por turno, turnos 1-6)');
    console.log('  Ejemplos: paramedico1 (Dr. Carlos Mendoza), paramedico5 (Dr. Luis González)');

    console.log('\nOPERADORES:');
    console.log('  operador1-12 / operador123 (2 por turno, turnos 1-6)');
    console.log('  Ejemplos: operador1 (Juan Pérez), operador5 (Antonio García)');

    console.log('\nRESUMEN: 26 usuarios creados');
    console.log('  - 1 Administrador');
    console.log('  - 6 Jefes de Turno (1 por turno)');
    console.log('  - 12 Paramédicos (2 por turno)');
    console.log('  - 12 Operadores (2 por turno)');
    console.log('=================================\n');

    await closeDB();
    process.exit(0);
  } catch (error) {
    console.error('Error al poblar la base de datos:', error);
    process.exit(1);
  }
};

seedUsers();
