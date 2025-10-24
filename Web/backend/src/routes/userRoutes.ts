import { Router } from 'express';
import {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  changePassword,
} from '../controllers/userController';
import { authMiddleware } from '../middleware/auth';
import { checkRole } from '../middleware/roleCheck';

const router = Router();

// Todas las rutas requieren autenticación
router.use(authMiddleware);

// Rutas de gestión de usuarios (admin ve todos, jefe ve su turno)
router.get('/', checkRole(['admin', 'jefe']), getUsers);
router.get('/:id', checkRole(['admin', 'jefe']), getUser);
router.post('/', checkRole(['admin']), createUser);
router.put('/:id', checkRole(['admin']), updateUser);
router.delete('/:id', checkRole(['admin']), deleteUser);

// Cambiar contraseña (usuario autenticado o admin)
router.patch('/:id/password', changePassword);
router.patch('/password', changePassword); // Para cambiar propia contraseña

export default router;
