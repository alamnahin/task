import { Request, Response, NextFunction } from 'express';
import { userService } from '../services/user.service';

export const userController = {
    async getAllUsers(req: Request, res: Response, next: NextFunction) {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const result = await userService.getAllUsers(page, limit);
            res.json(result);
        } catch (error) {
            next(error);
        }
    },

    async getUserById(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const user = await userService.getUserById(id);
            res.json(user);
        } catch (error) {
            next(error);
        }
    },

    async updateUserRole(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const { role } = req.body;
            const user = await userService.updateUserRole(id, role);
            res.json(user);
        } catch (error) {
            next(error);
        }
    },

    async updateUserStatus(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const { status } = req.body;
            const user = await userService.updateUserStatus(id, status);
            res.json(user);
        } catch (error) {
            next(error);
        }
    },
};
