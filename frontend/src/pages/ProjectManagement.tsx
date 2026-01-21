import React, { useEffect, useState } from 'react';
import {
    Container,
    Paper,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Chip,
    Box,
    IconButton,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store';
import {
    fetchProjects,
    createProject,
    updateProject,
    deleteProject,
} from '../store/slices/projectSlice';
import Navbar from '../components/Navbar';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const ProjectManagement: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { projects, loading } = useSelector((state: RootState) => state.projects);
    const { user } = useSelector((state: RootState) => state.auth);

    const [createDialog, setCreateDialog] = useState(false);
    const [editDialog, setEditDialog] = useState(false);
    const [selectedProject, setSelectedProject] = useState<any>(null);
    const [formData, setFormData] = useState({ name: '', description: '', status: 'ACTIVE' });

    useEffect(() => {
        dispatch(fetchProjects(false));
    }, [dispatch]);

    const handleCreate = async () => {
        await dispatch(createProject({ name: formData.name, description: formData.description }));
        setCreateDialog(false);
        setFormData({ name: '', description: '', status: 'ACTIVE' });
    };

    const handleEdit = async () => {
        if (selectedProject) {
            await dispatch(
                updateProject({
                    id: selectedProject.id,
                    data: {
                        name: formData.name,
                        description: formData.description,
                        status: formData.status,
                    },
                })
            );
            setEditDialog(false);
            setSelectedProject(null);
            setFormData({ name: '', description: '', status: 'ACTIVE' });
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this project?')) {
            await dispatch(deleteProject(id));
        }
    };

    const openEditDialog = (project: any) => {
        setSelectedProject(project);
        setFormData({
            name: project.name,
            description: project.description || '',
            status: project.status,
        });
        setEditDialog(true);
    };

    const isAdmin = user?.role === 'ADMIN';

    return (
        <>
            <Navbar />
            <Container maxWidth="lg" sx={{ mt: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h4">Project Management</Typography>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => setCreateDialog(true)}
                    >
                        Create Project
                    </Button>
                </Box>

                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell>Description</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Created By</TableCell>
                                <TableCell>Created At</TableCell>
                                {isAdmin && <TableCell>Actions</TableCell>}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={isAdmin ? 6 : 5} align="center">
                                        Loading...
                                    </TableCell>
                                </TableRow>
                            ) : projects.filter(p => !p.isDeleted).length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={isAdmin ? 6 : 5} align="center">
                                        No projects found
                                    </TableCell>
                                </TableRow>
                            ) : (
                                projects
                                    .filter(p => !p.isDeleted)
                                    .map((project) => (
                                        <TableRow key={project.id}>
                                            <TableCell>{project.name}</TableCell>
                                            <TableCell>{project.description || '-'}</TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={project.status}
                                                    color={
                                                        project.status === 'ACTIVE'
                                                            ? 'success'
                                                            : project.status === 'ARCHIVED'
                                                                ? 'warning'
                                                                : 'default'
                                                    }
                                                    size="small"
                                                />
                                            </TableCell>
                                            <TableCell>{project.creator.name}</TableCell>
                                            <TableCell>{new Date(project.createdAt).toLocaleDateString()}</TableCell>
                                            {isAdmin && (
                                                <TableCell>
                                                    <IconButton
                                                        size="small"
                                                        color="primary"
                                                        onClick={() => openEditDialog(project)}
                                                    >
                                                        <EditIcon />
                                                    </IconButton>
                                                    <IconButton
                                                        size="small"
                                                        color="error"
                                                        onClick={() => handleDelete(project.id)}
                                                    >
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </TableCell>
                                            )}
                                        </TableRow>
                                    ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>

                {/* Create Dialog */}
                <Dialog open={createDialog} onClose={() => setCreateDialog(false)} maxWidth="sm" fullWidth>
                    <DialogTitle>Create New Project</DialogTitle>
                    <DialogContent>
                        <TextField
                            fullWidth
                            label="Project Name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            margin="normal"
                        />
                        <TextField
                            fullWidth
                            label="Description"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            margin="normal"
                            multiline
                            rows={3}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setCreateDialog(false)}>Cancel</Button>
                        <Button onClick={handleCreate} variant="contained">
                            Create
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Edit Dialog */}
                <Dialog open={editDialog} onClose={() => setEditDialog(false)} maxWidth="sm" fullWidth>
                    <DialogTitle>Edit Project</DialogTitle>
                    <DialogContent>
                        <TextField
                            fullWidth
                            label="Project Name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            margin="normal"
                        />
                        <TextField
                            fullWidth
                            label="Description"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            margin="normal"
                            multiline
                            rows={3}
                        />
                        <FormControl fullWidth margin="normal">
                            <InputLabel>Status</InputLabel>
                            <Select
                                value={formData.status}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                            >
                                <MenuItem value="ACTIVE">ACTIVE</MenuItem>
                                <MenuItem value="ARCHIVED">ARCHIVED</MenuItem>
                            </Select>
                        </FormControl>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setEditDialog(false)}>Cancel</Button>
                        <Button onClick={handleEdit} variant="contained">
                            Save
                        </Button>
                    </DialogActions>
                </Dialog>
            </Container>
        </>
    );
};

export default ProjectManagement;
