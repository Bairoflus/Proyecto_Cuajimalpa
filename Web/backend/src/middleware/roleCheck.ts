import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';

export const checkRole = (allowedRoles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Usuario no autenticado' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: 'No tienes permisos para realizar esta acción' 
      });
    }

    next();
  };
};

// Middleware específico para jefes
export const checkJefeOrAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Usuario no autenticado' });
  }

  if (req.user.role !== 'jefe' && req.user.role !== 'admin') {
    return res.status(403).json({
      message: 'Solo jefes y administradores pueden realizar esta acción'
    });
  }

  next();
};

// Middleware específico para admins
export const checkAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Usuario no autenticado' });
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({
      message: 'Solo administradores pueden realizar esta acción'
    });
  }

  next();
};


