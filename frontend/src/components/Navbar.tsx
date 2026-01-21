import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { logout } from '../store/slices/authSlice';
import LogoutIcon from '@mui/icons-material/Logout';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import FolderIcon from '@mui/icons-material/Folder';

const Navbar: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user } = useSelector((state: RootState) => state.auth);

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 0, mr: 4 }}>
                    RBAC Admin
                </Typography>
                <Box sx={{ flexGrow: 1, display: 'flex', gap: 2 }}>
                    <Button color="inherit" startIcon={<DashboardIcon />} onClick={() => navigate('/dashboard')}>
                        Dashboard
                    </Button>
                    {user?.role === 'ADMIN' && (
                        <Button color="inherit" startIcon={<PeopleIcon />} onClick={() => navigate('/users')}>
                            Users
                        </Button>
                    )}
                    <Button color="inherit" startIcon={<FolderIcon />} onClick={() => navigate('/projects')}>
                        Projects
                    </Button>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography variant="body2">
                        {user?.name} ({user?.role})
                    </Typography>
                    <Button color="inherit" startIcon={<LogoutIcon />} onClick={handleLogout}>
                        Logout
                    </Button>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
