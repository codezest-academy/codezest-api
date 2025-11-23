import { Router } from 'express';
import { LanguageController } from '../controllers/language.controller';
import { authMiddleware } from '../../middleware/auth.middleware';
import { requireRole } from '../../middleware/rbac.middleware';
import { UserRole } from '@prisma/client';

const router = Router();
const controller = new LanguageController();

/**
 * Language Routes
 * Base path: /api/v1/languages
 */

// Public routes
router.get('/', controller.getAll);
router.get('/slug/:slug', controller.getBySlug);
router.get('/:id', controller.getById);

// Protected routes (require authentication)
router.post('/', authMiddleware, requireRole([UserRole.ADMIN, UserRole.USER]), controller.create);

router.put('/:id', authMiddleware, requireRole([UserRole.ADMIN, UserRole.USER]), controller.update);

router.delete('/:id', authMiddleware, requireRole([UserRole.ADMIN]), controller.delete);

router.post(
  '/:id/activate',
  authMiddleware,
  requireRole([UserRole.ADMIN, UserRole.USER]),
  controller.activate
);

router.post(
  '/:id/deactivate',
  authMiddleware,
  requireRole([UserRole.ADMIN, UserRole.USER]),
  controller.deactivate
);

export default router;
