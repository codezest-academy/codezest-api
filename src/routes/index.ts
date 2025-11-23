import { Router } from 'express';
import languageRoutes from '../presentation/routes/language.routes';
import moduleRoutes from '../presentation/routes/module.routes';
import materialRoutes from '../presentation/routes/material.routes';

const router = Router();

/**
 * API Routes
 *
 * Routes will be organized by feature modules:
 * - /languages - Programming languages management
 * - /modules - Course modules
 * - /materials - Learning materials
 * - /assignments - Assignments
 * - /quizzes - Quizzes and questions
 * - /progress - User progress tracking
 * - /enrollments - Course enrollments
 * - /analytics - Analytics and insights
 */

// Feature routes
router.use('/languages', languageRoutes);
router.use('/modules', moduleRoutes);
router.use('/materials', materialRoutes);

// TODO: Add route modules as they are implemented
// router.use('/assignments', assignmentRoutes);
// router.use('/quizzes', quizRoutes);
// router.use('/progress', progressRoutes);
// router.use('/enrollments', enrollmentRoutes);
// router.use('/analytics', analyticsRoutes);

export default router;
