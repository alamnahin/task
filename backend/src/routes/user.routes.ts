import { Router } from 'express';
import { body } from 'express-validator';
import { userController } from '../controllers/user.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { validate } from '../middleware/validation.middleware';

const router = Router();

// All user routes require authentication and admin role
router.use(authenticate);
router.use(authorize('ADMIN'));

// Get all users (with pagination)
router.get('/', userController.getAllUsers);

// Get user by ID
router.get('/:id', userController.getUserById);

// Update user role
router.patch(
    '/:id/role',
    validate([
        body('role').isIn(['ADMIN', 'MANAGER', 'STAFF']).withMessage('Valid role is required'),
    ]),
    userController.updateUserRole
);

// Update user status
router.patch(
    '/:id/status',
    validate([
        body('status').isIn(['ACTIVE', 'INACTIVE']).withMessage('Valid status is required'),
    ]),
    userController.updateUserStatus
);

export default router;
