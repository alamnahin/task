import React from 'react';
import { Container, Grid, Paper, Typography, Box } from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import Navbar from '../components/Navbar';
import PeopleIcon from '@mui/icons-material/People';
import FolderIcon from '@mui/icons-material/Folder';
import PersonIcon from '@mui/icons-material/Person';

const Dashboard: React.FC = () => {
    const { user } = useSelector((state: RootState) => state.auth);

    return (
        <>
            <Navbar />
            <Container maxWidth="lg" sx={{ mt: 4 }}>
                <Typography variant="h4" gutterBottom>
                    Welcome, {user?.name}!
                </Typography>
                <Typography variant="body1" color="text.secondary" gutterBottom>
                    Role: {user?.role} | Status: {user?.status}
                </Typography>

                <Grid container spacing={3} sx={{ mt: 2 }}>
                    <Grid item xs={12} md={4}>
                        <Paper
                            elevation={3}
                            sx={{
                                p: 3,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                height: 150,
                                justifyContent: 'center',
                            }}
                        >
                            <PersonIcon sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
                            <Typography variant="h6">Profile</Typography>
                            <Typography variant="body2" color="text.secondary">
                                {user?.email}
                            </Typography>
                        </Paper>
                    </Grid>

                    {user?.role === 'ADMIN' && (
                        <Grid item xs={12} md={4}>
                            <Paper
                                elevation={3}
                                sx={{
                                    p: 3,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    height: 150,
                                    justifyContent: 'center',
                                    cursor: 'pointer',
                                }}
                                onClick={() => window.location.href = '/users'}
                            >
                                <PeopleIcon sx={{ fontSize: 48, color: 'secondary.main', mb: 1 }} />
                                <Typography variant="h6">User Management</Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Manage users and roles
                                </Typography>
                            </Paper>
                        </Grid>
                    )}

                    <Grid item xs={12} md={4}>
                        <Paper
                            elevation={3}
                            sx={{
                                p: 3,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                height: 150,
                                justifyContent: 'center',
                                cursor: 'pointer',
                            }}
                            onClick={() => window.location.href = '/projects'}
                        >
                            <FolderIcon sx={{ fontSize: 48, color: 'success.main', mb: 1 }} />
                            <Typography variant="h6">Projects</Typography>
                            <Typography variant="body2" color="text.secondary">
                                View and manage projects
                            </Typography>
                        </Paper>
                    </Grid>
                </Grid>

                <Box sx={{ mt: 4 }}>
                    <Paper elevation={3} sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            System Information
                        </Typography>
                        <Typography variant="body2" paragraph>
                            <strong>Your Permissions:</strong>
                        </Typography>
                        <ul>
                            <li>Create new projects</li>
                            <li>View all projects</li>
                            {user?.role === 'ADMIN' && (
                                <>
                                    <li>Edit and delete projects</li>
                                    <li>Manage users and roles</li>
                                    <li>Create user invites</li>
                                </>
                            )}
                        </ul>
                    </Paper>
                </Box>
            </Container>
        </>
    );
};

export default Dashboard;
