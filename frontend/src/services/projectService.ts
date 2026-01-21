import api from './api';

export interface ProjectData {
    name: string;
    description?: string;
}

export interface UpdateProjectData {
    name?: string;
    description?: string;
    status?: string;
}

export const projectService = {
    async createProject(data: ProjectData) {
        const response = await api.post('/projects', data);
        return response.data;
    },

    async getAllProjects(includeDeleted: boolean = false) {
        const response = await api.get(`/projects?includeDeleted=${includeDeleted}`);
        return response.data;
    },

    async getProjectById(id: string) {
        const response = await api.get(`/projects/${id}`);
        return response.data;
    },

    async updateProject(id: string, data: UpdateProjectData) {
        const response = await api.patch(`/projects/${id}`, data);
        return response.data;
    },

    async deleteProject(id: string) {
        const response = await api.delete(`/projects/${id}`);
        return response.data;
    },
};
