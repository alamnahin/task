import { Response, NextFunction } from 'express';
import { projectService } from '../services/project.service';
import { AuthRequest } from '../middleware/auth.middleware';
import { ProjectStatus } from '@prisma/client';

export const projectController = {
    async createProject(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const { name, description } = req.body;
            const project = await projectService.createProject({
                name,
                description,
                createdBy: req.user!.id,
            });
            res.status(201).json(project);
        } catch (error) {
            next(error);
        }
    },

    async getAllProjects(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const includeDeleted = req.query.includeDeleted === 'true';
            const projects = await projectService.getAllProjects(includeDeleted);
            res.json(projects);
        } catch (error) {
            next(error);
        }
    },

    async getProjectById(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const project = await projectService.getProjectById(id);
            res.json(project);
        } catch (error) {
            next(error);
        }
    },

    async updateProject(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const { name, description, status } = req.body;
            const project = await projectService.updateProject(id, {
                name,
                description,
                status: status as ProjectStatus | undefined,
            });
            res.json(project);
        } catch (error) {
            next(error);
        }
    },

    async deleteProject(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const project = await projectService.deleteProject(id);
            res.json({ message: 'Project deleted successfully', project });
        } catch (error) {
            next(error);
        }
    },
};
