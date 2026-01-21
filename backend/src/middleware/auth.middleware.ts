import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from '../utils/AppError';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface AuthRequest extends Request {
    user?: {
        id: string;
        email: string;
        role: string;
        status: string;
    };
}

export const authenticate = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const token = req.headers.authorization?.replace('Bearer ', '');

        if (!token) {
            throw new AppError('Authentication required', 401);
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
            id: string;
            email: string;
            role: string;
        };

        // Verify user still exists and is active
        const user = await prisma.user.findUnique({
            where: { id: decoded.id },
        });

        if (!user) {
            throw new AppError('User no longer exists', 401);
        }

        if (user.status === 'INACTIVE') {
            throw new AppError('User account is deactivated', 401);
        }

        req.user = {
            id: user.id,
            email: user.email,
            role: user.role,
            status: user.status,
        };

        next();
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            return next(new AppError('Invalid token', 401));
        }
        next(error);
    }
};

export const authorize = (...roles: string[]) => {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return next(new AppError('You do not have permission to perform this action', 403));
        }
        next();
    };
};
