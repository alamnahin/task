import { PrismaClient } from '@prisma/client';
import { AppError } from '../utils/AppError';

const prisma = new PrismaClient();

export const userService = {
    async getAllUsers(page: number = 1, limit: number = 10) {
        const skip = (page - 1) * limit;

        const [users, total] = await Promise.all([
            prisma.user.findMany({
                skip,
                take: limit,
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                    status: true,
                    invitedAt: true,
                    createdAt: true,
                },
                orderBy: { createdAt: 'desc' },
            }),
            prisma.user.count(),
        ]);

        return {
            users,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    },

    async getUserById(id: string) {
        const user = await prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                status: true,
                invitedAt: true,
                createdAt: true,
            },
        });

        if (!user) {
            throw new AppError('User not found', 404);
        }

        return user;
    },

    async updateUserRole(userId: string, newRole: string) {
        const user = await prisma.user.findUnique({ where: { id: userId } });

        if (!user) {
            throw new AppError('User not found', 404);
        }

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: { role: newRole as any },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                status: true,
            },
        });

        return updatedUser;
    },

    async updateUserStatus(userId: string, newStatus: string) {
        const user = await prisma.user.findUnique({ where: { id: userId } });

        if (!user) {
            throw new AppError('User not found', 404);
        }

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: { status: newStatus as any },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                status: true,
            },
        });

        return updatedUser;
    },
};
