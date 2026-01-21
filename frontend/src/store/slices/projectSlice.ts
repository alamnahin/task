import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { projectService, ProjectData, UpdateProjectData } from '../../services/projectService';

interface Project {
    id: string;
    name: string;
    description?: string;
    status: string;
    isDeleted: boolean;
    createdBy: string;
    createdAt: string;
    updatedAt: string;
    creator: {
        id: string;
        name: string;
        email: string;
    };
}

interface ProjectState {
    projects: Project[];
    loading: boolean;
    error: string | null;
}

const initialState: ProjectState = {
    projects: [],
    loading: false,
    error: null,
};

export const fetchProjects = createAsyncThunk(
    'projects/fetchAll',
    async (includeDeleted: boolean = false, { rejectWithValue }) => {
        try {
            const data = await projectService.getAllProjects(includeDeleted);
            return data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch projects');
        }
    }
);

export const createProject = createAsyncThunk(
    'projects/create',
    async (data: ProjectData, { rejectWithValue }) => {
        try {
            const response = await projectService.createProject(data);
            return response;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to create project');
        }
    }
);

export const updateProject = createAsyncThunk(
    'projects/update',
    async ({ id, data }: { id: string; data: UpdateProjectData }, { rejectWithValue }) => {
        try {
            const response = await projectService.updateProject(id, data);
            return response;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update project');
        }
    }
);

export const deleteProject = createAsyncThunk(
    'projects/delete',
    async (id: string, { rejectWithValue }) => {
        try {
            await projectService.deleteProject(id);
            return id;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to delete project');
        }
    }
);

const projectSlice = createSlice({
    name: 'projects',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch projects
            .addCase(fetchProjects.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProjects.fulfilled, (state, action) => {
                state.loading = false;
                state.projects = action.payload;
            })
            .addCase(fetchProjects.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Create project
            .addCase(createProject.fulfilled, (state, action) => {
                state.projects.unshift(action.payload);
            })
            // Update project
            .addCase(updateProject.fulfilled, (state, action) => {
                const index = state.projects.findIndex(p => p.id === action.payload.id);
                if (index !== -1) {
                    state.projects[index] = action.payload;
                }
            })
            // Delete project
            .addCase(deleteProject.fulfilled, (state, action) => {
                const index = state.projects.findIndex(p => p.id === action.payload);
                if (index !== -1) {
                    state.projects[index].isDeleted = true;
                    state.projects[index].status = 'DELETED';
                }
            });
    },
});

export const { clearError } = projectSlice.actions;
export default projectSlice.reducer;
