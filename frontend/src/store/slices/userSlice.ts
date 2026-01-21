import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { userService } from '../../services/userService';

interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    status: string;
    invitedAt?: string;
    createdAt: string;
}

interface UserState {
    users: User[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    } | null;
    loading: boolean;
    error: string | null;
}

const initialState: UserState = {
    users: [],
    pagination: null,
    loading: false,
    error: null,
};

export const fetchUsers = createAsyncThunk(
    'users/fetchAll',
    async ({ page, limit }: { page: number; limit: number }, { rejectWithValue }) => {
        try {
            const data = await userService.getAllUsers(page, limit);
            return data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch users');
        }
    }
);

export const updateUserRole = createAsyncThunk(
    'users/updateRole',
    async ({ id, role }: { id: string; role: string }, { rejectWithValue }) => {
        try {
            const data = await userService.updateUserRole(id, role);
            return data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update role');
        }
    }
);

export const updateUserStatus = createAsyncThunk(
    'users/updateStatus',
    async ({ id, status }: { id: string; status: string }, { rejectWithValue }) => {
        try {
            const data = await userService.updateUserStatus(id, status);
            return data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update status');
        }
    }
);

const userSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch users
            .addCase(fetchUsers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUsers.fulfilled, (state, action) => {
                state.loading = false;
                state.users = action.payload.users;
                state.pagination = action.payload.pagination;
            })
            .addCase(fetchUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Update role
            .addCase(updateUserRole.fulfilled, (state, action) => {
                const index = state.users.findIndex(u => u.id === action.payload.id);
                if (index !== -1) {
                    state.users[index] = { ...state.users[index], ...action.payload };
                }
            })
            // Update status
            .addCase(updateUserStatus.fulfilled, (state, action) => {
                const index = state.users.findIndex(u => u.id === action.payload.id);
                if (index !== -1) {
                    state.users[index] = { ...state.users[index], ...action.payload };
                }
            });
    },
});

export const { clearError } = userSlice.actions;
export default userSlice.reducer;
