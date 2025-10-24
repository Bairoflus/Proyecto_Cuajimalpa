import { Request, Response } from 'express';
import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';
import { getUsersCollection, getAuditLogsCollection } from '../models/collections';
import { AuthRequest, IUser } from '../types';
import { mockUsers } from '../data/mockData';

// Login
export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    console.log('Login attempt:', { username, passwordLength: password?.length || 0 });

    // Validar campos
    if (!username || !password) {
      console.log('Missing credentials');
      return res.status(400).json({ message: 'Usuario y contraseña son requeridos' });
    }

    // Buscar usuario en la base de datos
    let user;
    let usingMockData = false;

    try {
      const usersCollection = getUsersCollection();
      user = await usersCollection.findOne({ username });
      console.log('Database query successful, user found:', user ? user.username : 'NOT FOUND');

      // Si no se encuentra en DB pero DB está disponible, realmente no existe
      if (!user) {
        console.log('User not found in database');
        // Log intento de login fallido
        await getAuditLogsCollection().insertOne({
          tipo: 'login',
          usuario: username,
          usuarioRole: 'unknown',
          accion: 'Intento de login fallido - usuario no encontrado',
          detalles: {},
          timestamp: new Date()
        });
        return res.status(401).json({ message: 'Credenciales inválidas' });
      }
    } catch (dbError) {
      console.error('Database error, falling back to mock data:', dbError instanceof Error ? dbError.message : String(dbError));
      // Solo usar mock data como último recurso
      usingMockData = true;
      user = mockUsers.find(u => u.username === username);
      console.log('Using mock data, user found:', user ? user.username : 'NOT FOUND');
    }

    if (!user) {
      console.log('User not found:', username);
      // Log intento de login fallido
      try {
        await getAuditLogsCollection().insertOne({
          tipo: 'login',
          usuario: username,
          usuarioRole: 'unknown',
          accion: 'Intento de login fallido - usuario no encontrado',
          detalles: {},
          timestamp: new Date()
        });
      } catch (logError) {
        console.error('Error logging login attempt:', logError);
      }
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    // Verificar contraseña
    let isValidPassword = false;

    if (usingMockData) {
      // Para datos mock, usar contraseñas simples
      const mockPasswords: Record<string, string> = {
        'admin': 'admin123',
        'jefe1': 'jefe123',
        'jefe2': 'jefe123',
        'operador1': 'oper123',
        'operador2': 'oper123',
        'paramedico1': 'para123',
        'paramedico2': 'para123'
      };
      isValidPassword = mockPasswords[username] === password;
      console.log('Mock password validation:', {
        expected: mockPasswords[username],
        provided: password,
        valid: isValidPassword
      });
    } else {
      // Hash real de argon2 desde la base de datos
      try {
        isValidPassword = await argon2.verify(user.password, password);
        console.log('Database password validation successful');
      } catch (passwordError) {
        console.error('Password verification error:', passwordError);
        isValidPassword = false;
      }
    }

    if (!isValidPassword) {
      console.log('Invalid password');
      // Log intento de login con contraseña incorrecta
      try {
        await getAuditLogsCollection().insertOne({
          tipo: 'login',
          usuario: username,
          usuarioRole: user.role,
          accion: 'Intento de login fallido - contraseña incorrecta',
          detalles: {},
          timestamp: new Date()
        });
      } catch (logError) {
        console.error('Error logging login attempt:', logError);
      }
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    console.log('Login successful for user:', username);

    // Log login exitoso
    try {
      await getAuditLogsCollection().insertOne({
        tipo: 'login',
        usuario: user.username,
        usuarioRole: user.role,
        accion: 'Login exitoso',
        detalles: {
          ip: req.ip,
          userAgent: req.get('User-Agent'),
          metodo: req.method,
          url: req.originalUrl
        },
        timestamp: new Date()
      });
    } catch (logError) {
      console.error('Error logging successful login:', logError);
    }

    // Generar token
    const jwtSecret = process.env.JWT_SECRET || 'default_secret';
    const token = jwt.sign(
      {
        id: user._id?.toString(),
        username: user.username,
        fullName: user.fullName,
        role: user.role,
        turno: user.turno,
      },
      jwtSecret,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user._id?.toString() || user._id,
        username: user.username,
        fullName: user.fullName,
        role: user.role,
        turno: user.turno,
      },
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

// Registro (solo para admin)
export const register = async (req: Request, res: Response) => {
  try {
    const { username, password, fullName, role, turno } = req.body;

    // Validar campos
    if (!username || !password || !fullName || !role || !turno) {
      return res.status(400).json({ message: 'Todos los campos son requeridos' });
    }

    // Verificar si el usuario ya existe
    const usersCollection = getUsersCollection();
    const existingUser = await usersCollection.findOne({ username });
    
    if (existingUser) {
      return res.status(400).json({ message: 'El usuario ya existe' });
    }

    // Encriptar contraseña con Argon2
    const hashedPassword = await argon2.hash(password);

    // Crear usuario
    const newUser: IUser = {
      username,
      password: hashedPassword,
      fullName,
      role,
      turno,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await usersCollection.insertOne(newUser);

    // Log creación de usuario
    try {
      await getAuditLogsCollection().insertOne({
        tipo: 'crear_usuario',
        recursoId: result.insertedId.toString(),
        recursoTipo: 'usuario',
        usuario: 'admin', // Solo admin puede crear usuarios
        usuarioRole: 'admin',
        accion: 'Usuario creado exitosamente',
        detalles: {
          valorNuevo: {
            username: newUser.username,
            fullName: newUser.fullName,
            role: newUser.role,
            turno: newUser.turno
          }
        },
        timestamp: new Date()
      });
    } catch (logError) {
      console.error('Error logging user creation:', logError);
    }

    res.status(201).json({
      message: 'Usuario creado exitosamente',
      user: {
        id: result.insertedId.toString(),
        username: newUser.username,
        fullName: newUser.fullName,
        role: newUser.role,
        turno: newUser.turno,
      },
    });
  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

// Obtener perfil del usuario autenticado
export const getProfile = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Usuario no autenticado' });
    }

    const usersCollection = getUsersCollection();
    const user = await usersCollection.findOne(
      { _id: new ObjectId(req.user.id) },
      { projection: { password: 0 } }
    );
    
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.json({
      id: user._id?.toString(),
      username: user.username,
      fullName: user.fullName,
      role: user.role,
      turno: user.turno,
    });
  } catch (error) {
    console.error('Error al obtener perfil:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

// Verificar token
export const verifyToken = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ valid: false });
    }

    res.json({ valid: true, user: req.user });
  } catch (error) {
    res.status(401).json({ valid: false });
  }
};

// Obtener personal disponible según rol
export const getAvailablePersonnel = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Usuario no autenticado' });
    }

    const { role, turno } = req.user;
    const fullName = (req.user as any).fullName || req.user.username;
    let personnel: any[] = [];

    try {
      const usersCollection = getUsersCollection();

      if (role === 'admin') {
        // Admin: puede ver todos los paramédicos y operadores
        const users = await usersCollection
          .find({ role: { $in: ['paramedico', 'operador'] } })
          .project({ fullName: 1, role: 1, turno: 1 })
          .toArray();

        personnel = users.map(u => ({
          id: u._id?.toString(),
          name: u.fullName,
          role: u.role,
          turno: u.turno
        }));
      } else if (role === 'jefe') {
        // Jefe: puede ver solo los de su turno
        const users = await usersCollection
          .find({
            role: { $in: ['paramedico', 'operador'] },
            turno: turno as '1' | '2'
          })
          .project({ fullName: 1, role: 1, turno: 1 })
          .toArray();

        personnel = users.map(u => ({
          id: u._id?.toString(),
          name: u.fullName,
          role: u.role,
          turno: u.turno
        }));
      } else if (role === 'paramedico' || role === 'operador') {
        // Paramédico/Operador: solo puede verse a sí mismo
        personnel = [{
          id: req.user.id,
          name: fullName,
          role: role,
          turno: turno
        }];
      }
    } catch (dbError) {
      // Si no hay DB, usar datos mock
      if (role === 'admin') {
        personnel = [
          { id: '1', name: 'Dr. Carlos Mendoza', role: 'paramedico', turno: '1' },
          { id: '2', name: 'Lic. Carmen Vega', role: 'paramedico', turno: '2' },
          { id: '3', name: 'Juan Pérez', role: 'operador', turno: '1' },
          { id: '4', name: 'María González', role: 'operador', turno: '2' }
        ];
      } else if (role === 'jefe') {
        personnel = turno === '1'
          ? [
              { id: '1', name: 'Dr. Carlos Mendoza', role: 'paramedico', turno: '1' },
              { id: '3', name: 'Juan Pérez', role: 'operador', turno: '1' }
            ]
          : [
              { id: '2', name: 'Lic. Carmen Vega', role: 'paramedico', turno: '2' },
              { id: '4', name: 'María González', role: 'operador', turno: '2' }
            ];
      } else {
        personnel = [{
          id: req.user.id,
          name: fullName,
          role: role,
          turno: turno
        }];
      }
    }

    res.json({ personnel });
  } catch (error) {
    console.error('Error al obtener personal:', error);
    res.status(500).json({ message: 'Error al obtener personal disponible' });
  }
};
