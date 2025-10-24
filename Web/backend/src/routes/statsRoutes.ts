import { Router } from 'express';
import { getStats } from '../controllers/statsController';
import { authMiddleware } from '../middleware/auth';
import { checkAdmin } from '../middleware/roleCheck';

const router = Router();

// Solo admins pueden ver estadísticas completas
router.get('/', authMiddleware, checkAdmin, getStats);

export default router;
