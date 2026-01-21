import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/auth.service';
import { AuthRequest } from '../middleware/auth.middleware';

export const authController = {
    async login(req: Request, res: Response, next: NextFunction) {
        try {
            const { email, password } = req.body;
            const result = await authService.login(email, password);
            res.json(result);
        } catch (error) {
            next(error);
        }
    },

    async createInvite(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const { email, role } = req.body;
            const result = await authService.createInvite(email, role, req.user!.id);
            res.status(201).json(result);
        } catch (error) {
            next(error);
        }
    },

    async registerViaInvite(req: Request, res: Response, next: NextFunction) {
        try {
            const { token, name, password } = req.body;
            const result = await authService.registerViaInvite(token, name, password);
            res.status(201).json(result);
        } catch (error) {
            next(error);
        }
    },

    async verifyInvite(req: Request, res: Response, next: NextFunction) {
        try {
            const { token } = req.params;
            const result = await authService.verifyInvite(token);
            res.json(result);
        } catch (error) {
            next(error);
        }
    },
};
