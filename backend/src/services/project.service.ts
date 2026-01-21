import { PrismaClient, ProjectStatus } from '@prisma/client';
import { AppError } from '../utils/AppError';

const prisma = new PrismaClient();

export const projectService = {
    async createProject(data: { name: string; description?: string; createdBy: string }) {
        const project = await prisma.project.create({
            data: {
                name: data.name,
                description: data.description,
                createdBy: data.createdBy,
            },
            include: {
                creator: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        });

        return project;
    },

    async getAllProjects(includeDeleted: boolean = false) {
        const where = includeDeleted ? {} : { isDeleted: false };

        const projects = await prisma.project.findMany({
            where,
            include: {
                creator: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });

        return projects;
    },

    async getProjectById(id: string) {
        const project = await prisma.project.findUnique({
            where: { id },
            include: {
                creator: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        });

        if (!project) {
            throw new AppError('Project not found', 404);
        }

        if (project.isDeleted) {
            throw new AppError('Project has been deleted', 404);
        }

        return project;
    },

    async updateProject(
        id: string,
        data: { name?: string; description?: string; status?: ProjectStatus }
    ) {
        const project = await prisma.project.findUnique({ where: { id } });

        if (!project) {
            throw new AppError('Project not found', 404);
        }

        if (project.isDeleted) {
            throw new AppError('Cannot update deleted project', 400);
        }

        const updatedProject = await prisma.project.update({
            where: { id },
            data,
            include: {
                creator: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        });

        return updatedProject;
    },

    async deleteProject(id: string) {
        const project = await prisma.project.findUnique({ where: { id } });

        if (!project) {
            throw new AppError('Project not found', 404);
        }

        if (project.isDeleted) {
            throw new AppError('Project is already deleted', 400);
        }

        // Soft delete
        const deletedProject = await prisma.project.update({
            where: { id },
            data: {
                isDeleted: true,
                status: 'DELETED',
            },
        });

        return deletedProject;
    },
};
