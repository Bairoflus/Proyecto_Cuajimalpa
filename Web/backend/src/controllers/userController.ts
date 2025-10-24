import { Response } from 'express';
import { ObjectId } from 'mongodb';
import argon2 from 'argon2';
import { AuthRequest, IUser } from '../types';
import { getUsersCollection } from '../models/collections';
import { mockUsers } from '../data/mockData';

// Array mutable como fallback cuando no hay MongoDB
let memoryUsers = [...mockUsers] as any[];

// Obtener todos los usuarios (admin ve todos, jefe ve solo su turno)
export const getUsers = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Usuario no autenticado' });
    }

    if (req.user.role !== 'admin' && req.user.role !== 'jefe') {
      return res.status(403).json({ message: 'No tienes permiso para ver usuarios' });
    }

    const { page = '1', perPage = '25', role, turno, fullName } = req.query;
    const pageNum = parseInt(page as string);
    const perPageNum = parseInt(perPage as string);
    const skip = (pageNum - 1) * perPageNum;

    let users: any[] = [];
    let total = 0;
    let usingDatabase = true;

    try {
      const usersCollection = getUsersCollection();

      // Crear filtro
      let filter: any = {};

      // Si es jefe, solo puede ver usuarios de su turno (paramédicos y operadores)
      if (req.user.role === 'jefe') {
        filter.turno = req.user.turno;
        filter.role = { $in: ['paramedico', 'operador'] };
      }

      // Aplicar filtros adicionales de query params
      if (role && req.user.role === 'admin') filter.role = role;
      if (turno && req.user.role === 'admin') filter.turno = turno;

      // Búsqueda por nombre completo, username o email (case-insensitive)
      if (fullName) {
        const searchRegex = new RegExp(fullName as string, 'i');
        filter.$or = [
          { fullName: searchRegex },
          { username: searchRegex },
          { email: searchRegex }
        ];
      }

      total = await usersCollection.countDocuments(filter);
      const dbUsers = await usersCollection
        .find(filter, { projection: { password: 0 } })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(perPageNum)
        .toArray();

      users = dbUsers.map(user => ({
        ...user,
        id: user._id?.toString(),
        _id: user._id?.toString()
      }));

      console.log(`MongoDB: Encontrados ${users.length} usuarios de ${total} total`);
    } catch (dbError) {
      console.warn('Error de MongoDB, usando datos en memoria:', dbError instanceof Error ? dbError.message : String(dbError));
      usingDatabase = false;

      let filteredUsers = [...memoryUsers];

      // Si es jefe, solo puede ver usuarios de su turno (paramédicos y operadores)
      if (req.user.role === 'jefe') {
        const jefeRole = req.user.role;
        const jefeTurno = req.user.turno;
        filteredUsers = filteredUsers.filter(u =>
          u.turno === jefeTurno &&
          (u.role === 'paramedico' || u.role === 'operador')
        );
      }

      // Aplicar filtros adicionales de query params
      if (role && req.user.role === 'admin') {
        filteredUsers = filteredUsers.filter(u => u.role === role);
      }
      if (turno && req.user.role === 'admin') {
        filteredUsers = filteredUsers.filter(u => u.turno === turno);
      }

      // Búsqueda por nombre completo, username o email (case-insensitive)
      if (fullName) {
        const searchTerm = (fullName as string).toLowerCase();
        filteredUsers = filteredUsers.filter(u =>
          (u.fullName && u.fullName.toLowerCase().includes(searchTerm)) ||
          (u.username && u.username.toLowerCase().includes(searchTerm)) ||
          (u.email && u.email.toLowerCase().includes(searchTerm))
        );
      }

      total = filteredUsers.length;
      users = filteredUsers
        .slice(skip, skip + perPageNum)
        .map(({ password, ...user }) => user);

      console.log(`Memoria: Encontrados ${users.length} usuarios de ${total} total`);
    }

    res.json({
      data: users,
      total,
      page: pageNum,
      perPage: perPageNum,
      source: usingDatabase ? 'MongoDB' : 'Memory'
    });
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

// Obtener un usuario por ID (admin ve todos, jefe ve su turno)
export const getUser = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Usuario no autenticado' });
    }

    if (req.user.role !== 'admin' && req.user.role !== 'jefe') {
      return res.status(403).json({ message: 'No tienes permiso para ver este usuario' });
    }

    let user: any = null;
    let usingDatabase = true;

    try {
      const usersCollection = getUsersCollection();
      const dbUser = await usersCollection.findOne(
        { _id: new ObjectId(req.params.id) },
        { projection: { password: 0 } }
      );

      if (dbUser) {
        user = {
          ...dbUser,
          id: dbUser._id?.toString(),
          _id: dbUser._id?.toString()
        };
      }
    } catch (dbError) {
      console.warn('Error de MongoDB, buscando en memoria:', dbError instanceof Error ? dbError.message : String(dbError));
      usingDatabase = false;
      const memUser = memoryUsers.find(u => u._id === req.params.id);
      if (memUser) {
        const { password, ...userWithoutPassword } = memUser;
        user = userWithoutPassword;
      }
    }

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Si es jefe, verificar que el usuario sea de su turno y sea paramédico u operador
    if (req.user.role === 'jefe') {
      if (user.turno !== req.user.turno || (user.role !== 'paramedico' && user.role !== 'operador')) {
        return res.status(403).json({ message: 'No tienes permiso para ver este usuario' });
      }
    }

    res.json({
      data: user,
      source: usingDatabase ? 'MongoDB' : 'Memory'
    });
  } catch (error) {
    console.error('Error al obtener usuario:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

// Crear un nuevo usuario (solo admin)
export const createUser = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Usuario no autenticado' });
    }

    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'No tienes permiso para crear usuarios' });
    }

    const { username, password, fullName, role, turno } = req.body;

    // Validar campos
    if (!username || !password || !fullName || !role || !turno) {
      return res.status(400).json({ message: 'Todos los campos son requeridos' });
    }

    // Validar rol
    if (!['admin', 'jefe', 'paramedico', 'operador'].includes(role)) {
      return res.status(400).json({ message: 'Rol inválido' });
    }

    // Validar turno
    if (!['1', '2', '3', '4', '5', '6'].includes(turno)) {
      return res.status(400).json({ message: 'Turno inválido' });
    }

    let createdUser: any = null;
    let usingDatabase = true;

    try {
      const usersCollection = getUsersCollection();

      // Verificar si el usuario ya existe
      const existingUser = await usersCollection.findOne({ username });
      if (existingUser) {
        return res.status(400).json({ message: 'El usuario ya existe' });
      }

      // Encriptar contraseña
      const hashedPassword = await argon2.hash(password);

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

      createdUser = {
        id: result.insertedId.toString(),
        _id: result.insertedId.toString(),
        username: newUser.username,
        fullName: newUser.fullName,
        role: newUser.role,
        turno: newUser.turno,
        createdAt: newUser.createdAt,
        updatedAt: newUser.updatedAt
      };

      console.log('MongoDB: Nuevo usuario creado:', result.insertedId.toString());
    } catch (dbError) {
      console.warn('Error de MongoDB, guardando en memoria:', dbError instanceof Error ? dbError.message : String(dbError));
      usingDatabase = false;

      // Verificar si ya existe en memoria
      if (memoryUsers.find(u => u.username === username)) {
        return res.status(400).json({ message: 'El usuario ya existe' });
      }

      const memoryId = `usr_${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`;
      const hashedPassword = await argon2.hash(password);

      const newUser = {
        _id: memoryId,
        id: memoryId,
        username,
        password: hashedPassword,
        fullName,
        role,
        turno,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      memoryUsers.push(newUser);
      const { password: _, ...userWithoutPassword } = newUser;
      createdUser = userWithoutPassword;

      console.log('Memoria: Nuevo usuario creado:', memoryId, 'Total usuarios:', memoryUsers.length);
    }

    res.status(201).json({
      data: createdUser,
      message: 'Usuario creado exitosamente',
      source: usingDatabase ? 'MongoDB' : 'Memory'
    });
  } catch (error) {
    console.error('Error al crear usuario:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

// Actualizar un usuario (solo admin)
export const updateUser = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Usuario no autenticado' });
    }

    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'No tienes permiso para actualizar usuarios' });
    }

    let user: any = null;
    let usingDatabase = true;

    try {
      const usersCollection = getUsersCollection();
      user = await usersCollection.findOne({ _id: new ObjectId(req.params.id) });
    } catch (dbError) {
      console.warn('Error de MongoDB, buscando en memoria:', dbError instanceof Error ? dbError.message : String(dbError));
      usingDatabase = false;
      user = memoryUsers.find(u => u._id === req.params.id);
    }

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const { username, password, fullName, role, turno } = req.body;

    // Validar rol si se proporciona
    if (role && !['admin', 'jefe', 'paramedico', 'operador'].includes(role)) {
      return res.status(400).json({ message: 'Rol inválido' });
    }

    // Validar turno si se proporciona
    if (turno && !['1', '2', '3', '4', '5', '6'].includes(turno)) {
      return res.status(400).json({ message: 'Turno inválido' });
    }

    const updateData: any = {
      updatedAt: new Date(),
    };

    if (username !== undefined) updateData.username = username;
    if (fullName !== undefined) updateData.fullName = fullName;
    if (role !== undefined) updateData.role = role;
    if (turno !== undefined) updateData.turno = turno;
    if (password) {
      updateData.password = await argon2.hash(password);
    }

    let updatedUser: any = null;

    if (usingDatabase) {
      try {
        const usersCollection = getUsersCollection();

        // Si se actualiza username, verificar que no exista
        if (username && username !== user.username) {
          const existingUser = await usersCollection.findOne({ username });
          if (existingUser) {
            return res.status(400).json({ message: 'El nombre de usuario ya existe' });
          }
        }

        await usersCollection.updateOne(
          { _id: new ObjectId(req.params.id) },
          { $set: updateData }
        );

        const dbUser = await usersCollection.findOne(
          { _id: new ObjectId(req.params.id) },
          { projection: { password: 0 } }
        );

        if (dbUser) {
          updatedUser = {
            ...dbUser,
            id: dbUser._id?.toString(),
            _id: dbUser._id?.toString()
          };
        }

        console.log('MongoDB: Usuario actualizado:', req.params.id);
      } catch (dbError) {
        console.warn('Error al actualizar en MongoDB:', dbError);
        usingDatabase = false;
      }
    }

    if (!usingDatabase) {
      // Si se actualiza username, verificar que no exista en memoria
      if (username && username !== user.username) {
        const existingUser = memoryUsers.find(u => u.username === username);
        if (existingUser) {
          return res.status(400).json({ message: 'El nombre de usuario ya existe' });
        }
      }

      const userIndex = memoryUsers.findIndex(u => u._id === req.params.id);
      if (userIndex !== -1) {
        memoryUsers[userIndex] = {
          ...memoryUsers[userIndex],
          ...updateData,
        };
        const { password: _, ...userWithoutPassword } = memoryUsers[userIndex];
        updatedUser = userWithoutPassword;
        console.log('Memoria: Usuario actualizado:', req.params.id);
      }
    }

    if (!updatedUser) {
      return res.status(404).json({ message: 'Usuario no encontrado para actualizar' });
    }

    res.json({
      data: updatedUser,
      message: 'Usuario actualizado exitosamente',
      source: usingDatabase ? 'MongoDB' : 'Memory'
    });
  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

// Eliminar un usuario (solo admin)
export const deleteUser = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Usuario no autenticado' });
    }

    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'No tienes permiso para eliminar usuarios' });
    }

    // Prevenir que el admin se elimine a sí mismo
    if (req.user.id === req.params.id) {
      return res.status(400).json({ message: 'No puedes eliminar tu propia cuenta' });
    }

    let deleted = false;
    let usingDatabase = true;

    try {
      const usersCollection = getUsersCollection();
      const result = await usersCollection.deleteOne({ _id: new ObjectId(req.params.id) });
      deleted = result.deletedCount > 0;

      if (deleted) {
        console.log('MongoDB: Usuario eliminado:', req.params.id);
      }
    } catch (dbError) {
      console.warn('Error de MongoDB, eliminando de memoria:', dbError instanceof Error ? dbError.message : String(dbError));
      usingDatabase = false;

      const userIndex = memoryUsers.findIndex(u => u._id === req.params.id);
      if (userIndex !== -1) {
        memoryUsers.splice(userIndex, 1);
        deleted = true;
        console.log('Memoria: Usuario eliminado:', req.params.id, 'Total usuarios:', memoryUsers.length);
      }
    }

    if (!deleted) {
      return res.status(404).json({ message: 'Usuario no encontrado para eliminar' });
    }

    res.json({
      data: { id: req.params.id },
      message: 'Usuario eliminado exitosamente',
      source: usingDatabase ? 'MongoDB' : 'Memory'
    });
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

// Cambiar contraseña (usuario autenticado o admin)
export const changePassword = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Usuario no autenticado' });
    }

    const { oldPassword, newPassword } = req.body;
    const targetUserId = req.params.id || req.user.id;

    // Validar campos
    if (!newPassword) {
      return res.status(400).json({ message: 'La nueva contraseña es requerida' });
    }

    // Si no es admin y está cambiando contraseña de otro usuario
    if (req.user.role !== 'admin' && targetUserId !== req.user.id) {
      return res.status(403).json({ message: 'No tienes permiso para cambiar la contraseña de otro usuario' });
    }

    // Si no es admin, requiere la contraseña antigua
    if (req.user.role !== 'admin' && !oldPassword) {
      return res.status(400).json({ message: 'La contraseña actual es requerida' });
    }

    let user: any = null;
    let usingDatabase = true;

    try {
      const usersCollection = getUsersCollection();
      user = await usersCollection.findOne({ _id: new ObjectId(targetUserId) });
    } catch (dbError) {
      console.warn('Error de MongoDB, buscando en memoria:', dbError instanceof Error ? dbError.message : String(dbError));
      usingDatabase = false;
      user = memoryUsers.find(u => u._id === targetUserId);
    }

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Si no es admin, verificar contraseña antigua
    if (req.user.role !== 'admin') {
      let isValidPassword = false;

      if (usingDatabase) {
        try {
          isValidPassword = await argon2.verify(user.password, oldPassword);
        } catch (error) {
          isValidPassword = false;
        }
      } else {
        // Para datos mock
        const mockPasswords: Record<string, string> = {
          'admin': 'admin123',
          'jefe1': 'jefe123',
          'jefe2': 'jefe123',
          'operador1': 'oper123',
          'operador2': 'oper123',
          'paramedico1': 'para123',
          'paramedico2': 'para123'
        };
        isValidPassword = mockPasswords[user.username] === oldPassword;
      }

      if (!isValidPassword) {
        return res.status(401).json({ message: 'Contraseña actual incorrecta' });
      }
    }

    // Encriptar nueva contraseña
    const hashedPassword = await argon2.hash(newPassword);

    if (usingDatabase) {
      try {
        const usersCollection = getUsersCollection();
        await usersCollection.updateOne(
          { _id: new ObjectId(targetUserId) },
          { $set: { password: hashedPassword, updatedAt: new Date() } }
        );
        console.log('MongoDB: Contraseña actualizada para usuario:', targetUserId);
      } catch (dbError) {
        console.warn('Error al actualizar contraseña en MongoDB:', dbError);
        usingDatabase = false;
      }
    }

    if (!usingDatabase) {
      const userIndex = memoryUsers.findIndex(u => u._id === targetUserId);
      if (userIndex !== -1) {
        memoryUsers[userIndex].password = hashedPassword;
        memoryUsers[userIndex].updatedAt = new Date();
        console.log('Memoria: Contraseña actualizada para usuario:', targetUserId);
      }
    }

    res.json({
      message: 'Contraseña actualizada exitosamente',
      source: usingDatabase ? 'MongoDB' : 'Memory'
    });
  } catch (error) {
    console.error('Error al cambiar contraseña:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};
