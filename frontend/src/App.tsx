import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { store } from './store';
import PrivateRoute from './components/PrivateRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import UserManagement from './pages/UserManagement';
import ProjectManagement from './pages/ProjectManagement';

const theme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#1976d2',
        },
        secondary: {
            main: '#dc004e',
        },
    },
});

const App: React.FC = () => {
    return (
        <Provider store={store}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <BrowserRouter>
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route element={<PrivateRoute />}>
                            <Route path="/dashboard" element={<Dashboard />} />
                            <Route path="/users" element={<UserManagement />} />
                            <Route path="/projects" element={<ProjectManagement />} />
                        </Route>
                        <Route path="/" element={<Navigate to="/dashboard" />} />
                    </Routes>
                </BrowserRouter>
            </ThemeProvider>
        </Provider>
    );
};

export default App;
