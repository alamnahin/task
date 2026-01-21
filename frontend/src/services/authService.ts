import api from './api';

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterData {
    token: string;
    name: string;
    password: string;
}

export interface InviteData {
    email: string;
    role: string;
}

export const authService = {
    async login(credentials: LoginCredentials) {
        const response = await api.post('/auth/login', credentials);
        return response.data;
    },

    async createInvite(data: InviteData) {
        const response = await api.post('/auth/invite', data);
        return response.data;
    },

    async registerViaInvite(data: RegisterData) {
        const response = await api.post('/auth/register-via-invite', data);
        return response.data;
    },

    async verifyInvite(token: string) {
        const response = await api.get(`/auth/verify-invite/${token}`);
        return response.data;
    },
};
