import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/database';
import { createIndexes } from './models/collections';
import authRoutes from './routes/authRoutes';
import reportRoutes from './routes/reportRoutes';
import userRoutes from './routes/userRoutes';
import statsRoutes from './routes/statsRoutes';

// Cargar variables de entorno
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5002;

// Middleware
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:5173',
    'http://localhost:5174',
    /^http:\/\/192\.168\.\d+\.\d+:\d+$/,  // Permitir cualquier IP de red local
    /^http:\/\/10\.\d+\.\d+\.\d+:\d+$/,   // Permitir redes 10.x.x.x
    /^http:\/\/172\.16\.\d+\.\d+:\d+$/    // Permitir redes 172.16.x.x
  ],
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logger middleware (desarrollo)
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
  });
}

// Rutas
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Backend de Cuajimalpa funcionando correctamente',
    timestamp: new Date().toISOString(),
  });
});

// Endpoint de debug para troubleshooting
app.get('/api/debug', (req, res) => {
  const { mockUsers } = require('./data/mockData');
  res.json({
    status: 'ok',
    message: 'Debug endpoint funcionando',
    environment: process.env.NODE_ENV || 'development',
    port: PORT,
    timestamp: new Date().toISOString(),
    mockUsersAvailable: mockUsers.map((u: any) => ({
      username: u.username,
      role: u.role,
      turno: u.turno,
      fullName: u.fullName
    })),
    availableCredentials: {
      admin: 'admin123',
      jefe1: 'jefe123',
      jefe2: 'jefe123',
      operador1: 'oper123',
      operador2: 'oper123',
      paramedico1: 'para123',
      paramedico2: 'para123'
    }
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/users', userRoutes);
app.use('/api/stats', statsRoutes);

// Ruta 404
app.use((req, res) => {
  res.status(404).json({ message: 'Ruta no encontrada' });
});

// Manejo de errores global
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    message: err.message || 'Error interno del servidor',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

// Conectar a la base de datos e iniciar servidor
const startServer = async () => {
  try {
    console.log('Intentando conectar a MongoDB...');
    let mongoConnected = false;

    try {
      await connectDB();
      await createIndexes();
      mongoConnected = true;
      console.log('MongoDB conectado exitosamente');
    } catch (dbError) {
      console.warn('No se pudo conectar a MongoDB, funcionando sin base de datos');
      console.warn('Para funcionalidad completa, inicia MongoDB localmente');
      console.warn('Error:', dbError instanceof Error ? dbError.message : String(dbError));
    }

    app.listen(PORT, () => {
      console.log('=================================');
      console.log(`Servidor corriendo en http://localhost:${PORT}`);
      console.log(`Health check: http://localhost:${PORT}/api/health`);
      console.log(`Auth API: http://localhost:${PORT}/api/auth`);
      console.log(`Reports API: http://localhost:${PORT}/api/reports`);
      console.log(`Users API: http://localhost:${PORT}/api/users`);
      console.log(`Stats API: http://localhost:${PORT}/api/stats`);
      console.log(`Logs API: http://localhost:${PORT}/api/logs`);
      console.log(`Ambiente: ${process.env.NODE_ENV || 'development'}`);
      console.log(`Base de datos: ${mongoConnected ? 'MongoDB conectada' : 'Modo mock/sin BD'}`);
      console.log('=================================');
    });
  } catch (error) {
    console.error('Error crítico al iniciar el servidor:', error);
    process.exit(1);
  }
};

startServer();

