import { Router } from 'express';
import { MaterialController } from '../controllers/material.controller';
import { authMiddleware } from '../../middleware/auth.middleware';
import { requireRole } from '../../middleware/rbac.middleware';
import { UserRole } from '@prisma/client';

const router = Router();
const controller = new MaterialController();

/**
 * Material Routes
 * Base path: /api/v1/materials
 */

// Public routes
router.get('/', controller.getAll);
router.get('/module/:moduleId', controller.getByModuleId);
router.get('/:id', controller.getById);

// Protected routes (require authentication)
router.post('/', authMiddleware, requireRole([UserRole.ADMIN, UserRole.USER]), controller.create);

router.put('/:id', authMiddleware, requireRole([UserRole.ADMIN, UserRole.USER]), controller.update);

router.delete('/:id', authMiddleware, requireRole([UserRole.ADMIN]), controller.delete);

router.post(
  '/module/:moduleId/reorder',
  authMiddleware,
  requireRole([UserRole.ADMIN, UserRole.USER]),
  controller.reorder
);

export default router;
