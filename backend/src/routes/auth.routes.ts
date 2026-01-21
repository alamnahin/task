import { Router } from 'express';
import { body } from 'express-validator';
import { authController } from '../controllers/auth.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { validate } from '../middleware/validation.middleware';

const router = Router();

// Login
router.post(
    '/login',
    validate([
        body('email').isEmail().withMessage('Valid email is required'),
        body('password').notEmpty().withMessage('Password is required'),
    ]),
    authController.login
);

// Create invite (Admin only)
router.post(
    '/invite',
    authenticate,
    authorize('ADMIN'),
    validate([
        body('email').isEmail().withMessage('Valid email is required'),
        body('role').isIn(['ADMIN', 'MANAGER', 'STAFF']).withMessage('Valid role is required'),
    ]),
    authController.createInvite
);

// Register via invite
router.post(
    '/register-via-invite',
    validate([
        body('token').notEmpty().withMessage('Token is required'),
        body('name').notEmpty().withMessage('Name is required'),
        body('password')
            .isLength({ min: 6 })
            .withMessage('Password must be at least 6 characters'),
    ]),
    authController.registerViaInvite
);

// Verify invite token
router.get('/verify-invite/:token', authController.verifyInvite);

export default router;
