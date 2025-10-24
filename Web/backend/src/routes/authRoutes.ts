import { Router } from 'express';
import { login, register, getProfile, verifyToken, getAvailablePersonnel } from '../controllers/authController';
import { authMiddleware } from '../middleware/auth';
import { checkRole } from '../middleware/roleCheck';

const router = Router();

// Rutas públicas
router.post('/login', login);

// Rutas protegidas
router.post('/register', authMiddleware, checkRole(['admin']), register);
router.get('/profile', authMiddleware, getProfile);
router.get('/verify', authMiddleware, verifyToken);
router.get('/personnel', authMiddleware, getAvailablePersonnel);

export default router;


