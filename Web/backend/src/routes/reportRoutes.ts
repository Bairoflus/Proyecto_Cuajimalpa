import { Router } from 'express';
import {
  getReports,
  getReport,
  createReport,
  updateReport,
  deleteReport,
  approveReport,
  getAuditLogs,
} from '../controllers/reportController';
import { authMiddleware } from '../middleware/auth';
import { checkJefeOrAdmin } from '../middleware/roleCheck';

const router = Router();

// Todas las rutas requieren autenticación
router.use(authMiddleware);

// Rutas de reportes
router.get('/', getReports);

// Ruta para obtener bitácora de auditoría (solo jefe y admin) - debe ir antes de /:id
router.get('/audit/logs', checkJefeOrAdmin, getAuditLogs);

router.get('/:id', getReport);
router.post('/', createReport);
router.put('/:id', updateReport);
router.delete('/:id', checkJefeOrAdmin, deleteReport);

// Ruta especial para aprobar casos (solo jefe y admin)
router.patch('/:id/approve', checkJefeOrAdmin, approveReport);

export default router;


