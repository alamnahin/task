import api from './api';

export const userService = {
    async getAllUsers(page: number = 1, limit: number = 10) {
        const response = await api.get(`/users?page=${page}&limit=${limit}`);
        return response.data;
    },

    async getUserById(id: string) {
        const response = await api.get(`/users/${id}`);
        return response.data;
    },

    async updateUserRole(id: string, role: string) {
        const response = await api.patch(`/users/${id}/role`, { role });
        return response.data;
    },

    async updateUserStatus(id: string, status: string) {
        const response = await api.patch(`/users/${id}/status`, { status });
        return response.data;
    },
};
