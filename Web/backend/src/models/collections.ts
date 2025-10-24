import { Collection } from 'mongodb';
import { getDB } from '../config/database';
import { IUser, IReport, IAuditLog } from '../types';

// Nombres de las colecciones
export const COLLECTIONS = {
  USERS: 'users',
  REPORTS: 'reports',
  COUNTERS: 'counters',
  AUDIT_LOGS: 'audit_logs',
};

// Helper para obtener la colección de usuarios
export const getUsersCollection = (): Collection<IUser> => {
  return getDB().collection<IUser>(COLLECTIONS.USERS);
};

// Helper para obtener la colección de reportes
export const getReportsCollection = (): Collection<IReport> => {
  return getDB().collection<IReport>(COLLECTIONS.REPORTS);
};

// Helper para obtener la colección de contadores
export const getCountersCollection = (): Collection<any> => {
  return getDB().collection(COLLECTIONS.COUNTERS);
};

// Helper para obtener la colección de auditoría
export const getAuditLogsCollection = (): Collection<IAuditLog> => {
  return getDB().collection<IAuditLog>(COLLECTIONS.AUDIT_LOGS);
};

// Función para generar el siguiente folio
export const getNextFolio = async (): Promise<string> => {
  const countersCollection = getCountersCollection();

  const result = await countersCollection.findOneAndUpdate(
    { _id: 'reportFolio' },
    { $inc: { sequence: 1 } },
    { upsert: true, returnDocument: 'after' }
  );

  const sequence = result?.sequence || 1;

  // Formato: CUAJ-YYYY-NNNNNN (ej: CUAJ-2025-000001)
  const year = new Date().getFullYear();
  const folio = `CUAJ-${year}-${sequence.toString().padStart(6, '0')}`;

  return folio;
};

// Función para crear índices
export const createIndexes = async () => {
  try {
    const db = getDB();

    // Verificar y crear índices para usuarios
    try {
      await db.collection(COLLECTIONS.USERS).createIndex({ username: 1 }, { unique: true });
    } catch (e: any) {
      if (e.codeName !== 'IndexKeySpecsConflict') throw e;
    }

    try {
      await db.collection(COLLECTIONS.USERS).createIndex({ role: 1 });
    } catch (e: any) {
      if (e.codeName !== 'IndexKeySpecsConflict') throw e;
    }

    try {
      await db.collection(COLLECTIONS.USERS).createIndex({ turno: 1 });
    } catch (e: any) {
      if (e.codeName !== 'IndexKeySpecsConflict') throw e;
    }

    // Verificar y crear índices para reportes
    try {
      await db.collection(COLLECTIONS.REPORTS).createIndex({ folio: 1 }, {
        unique: true,
        partialFilterExpression: { folio: { $exists: true, $type: 'string' } }
      });
    } catch (e: any) {
      if (e.codeName !== 'IndexKeySpecsConflict') throw e;
    }

    try {
      await db.collection(COLLECTIONS.REPORTS).createIndex({ creadoPor: 1 });
    } catch (e: any) {
      if (e.codeName !== 'IndexKeySpecsConflict') throw e;
    }

    try {
      await db.collection(COLLECTIONS.REPORTS).createIndex({ turnoCreacion: 1 });
    } catch (e: any) {
      if (e.codeName !== 'IndexKeySpecsConflict') throw e;
    }

    try {
      await db.collection(COLLECTIONS.REPORTS).createIndex({ tipo: 1 });
    } catch (e: any) {
      if (e.codeName !== 'IndexKeySpecsConflict') throw e;
    }

    try {
      await db.collection(COLLECTIONS.REPORTS).createIndex({ gravedad: 1 });
    } catch (e: any) {
      if (e.codeName !== 'IndexKeySpecsConflict') throw e;
    }

    try {
      await db.collection(COLLECTIONS.REPORTS).createIndex({ casoAprobado: 1 });
    } catch (e: any) {
      if (e.codeName !== 'IndexKeySpecsConflict') throw e;
    }

    try {
      await db.collection(COLLECTIONS.REPORTS).createIndex({ createdAt: -1 });
    } catch (e: any) {
      if (e.codeName !== 'IndexKeySpecsConflict') throw e;
    }

    // Verificar y crear índices para auditoría
    try {
      await db.collection(COLLECTIONS.AUDIT_LOGS).createIndex({ reporteId: 1 });
    } catch (e: any) {
      if (e.codeName !== 'IndexKeySpecsConflict') throw e;
    }

    try {
      await db.collection(COLLECTIONS.AUDIT_LOGS).createIndex({ usuario: 1 });
    } catch (e: any) {
      if (e.codeName !== 'IndexKeySpecsConflict') throw e;
    }

    try {
      await db.collection(COLLECTIONS.AUDIT_LOGS).createIndex({ tipo: 1 });
    } catch (e: any) {
      if (e.codeName !== 'IndexKeySpecsConflict') throw e;
    }

    try {
      await db.collection(COLLECTIONS.AUDIT_LOGS).createIndex({ timestamp: -1 });
    } catch (e: any) {
      if (e.codeName !== 'IndexKeySpecsConflict') throw e;
    }

    console.log('Índices creados exitosamente');
  } catch (error) {
    console.error('Error al crear índices:', error);
  }
};


