import { Router } from 'express';
import { body } from 'express-validator';
import { projectController } from '../controllers/project.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { validate } from '../middleware/validation.middleware';

const router = Router();

// All project routes require authentication
router.use(authenticate);

// Create project (all authenticated users)
router.post(
    '/',
    validate([
        body('name').notEmpty().withMessage('Project name is required'),
        body('description').optional(),
    ]),
    projectController.createProject
);

// Get all projects
router.get('/', projectController.getAllProjects);

// Get project by ID
router.get('/:id', projectController.getProjectById);

// Update project (Admin only)
router.patch(
    '/:id',
    authorize('ADMIN'),
    validate([
        body('name').optional().notEmpty().withMessage('Project name cannot be empty'),
        body('description').optional(),
        body('status')
            .optional()
            .isIn(['ACTIVE', 'ARCHIVED', 'DELETED'])
            .withMessage('Valid status is required'),
    ]),
    projectController.updateProject
);

// Delete project (Admin only - soft delete)
router.delete('/:id', authorize('ADMIN'), projectController.deleteProject);

export default router;
