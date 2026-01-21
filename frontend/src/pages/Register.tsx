import React, { useState, useEffect } from 'react';
import {
    Container,
    Paper,
    TextField,
    Button,
    Typography,
    Box,
    Alert,
} from '@mui/material';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { registerViaInvite, clearError } from '../store/slices/authSlice';
import { AppDispatch, RootState } from '../store';
import { authService } from '../services/authService';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

const Register: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const [searchParams] = useSearchParams();
    const { loading, error } = useSelector((state: RootState) => state.auth);

    const [inviteInfo, setInviteInfo] = useState<any>(null);
    const [verifying, setVerifying] = useState(true);
    const [verifyError, setVerifyError] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        password: '',
        confirmPassword: '',
    });

    const token = searchParams.get('token');

    useEffect(() => {
        const verifyToken = async () => {
            if (!token) {
                setVerifyError('Invalid or missing token');
                setVerifying(false);
                return;
            }

            try {
                const data = await authService.verifyInvite(token);
                setInviteInfo(data);
                setVerifying(false);
            } catch (err: any) {
                setVerifyError(err.response?.data?.message || 'Invalid invite token');
                setVerifying(false);
            }
        };

        verifyToken();
    }, [token]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (error) dispatch(clearError());
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            alert('Passwords do not match');
            return;
        }

        const result = await dispatch(
            registerViaInvite({
                token: token!,
                name: formData.name,
                password: formData.password,
            })
        );

        if (registerViaInvite.fulfilled.match(result)) {
            navigate('/dashboard');
        }
    };

    if (verifying) {
        return (
            <Container maxWidth="sm" sx={{ mt: 8 }}>
                <Paper elevation={3} sx={{ p: 4 }}>
                    <Typography variant="h5" align="center">
                        Verifying invite...
                    </Typography>
                </Paper>
            </Container>
        );
    }

    if (verifyError) {
        return (
            <Container maxWidth="sm" sx={{ mt: 8 }}>
                <Paper elevation={3} sx={{ p: 4 }}>
                    <Alert severity="error">{verifyError}</Alert>
                    <Button
                        fullWidth
                        variant="contained"
                        sx={{ mt: 2 }}
                        onClick={() => navigate('/login')}
                    >
                        Go to Login
                    </Button>
                </Paper>
            </Container>
        );
    }

    return (
        <Container maxWidth="sm" sx={{ mt: 8 }}>
            <Paper elevation={3} sx={{ p: 4 }}>
                <Typography variant="h4" align="center" gutterBottom>
                    Complete Registration
                </Typography>
                <Alert severity="info" sx={{ mb: 2 }}>
                    Email: {inviteInfo?.email} | Role: {inviteInfo?.role}
                </Alert>
                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}
                <Box component="form" onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        label="Full Name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        margin="normal"
                        required
                    />
                    <TextField
                        fullWidth
                        label="Password"
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        margin="normal"
                        required
                        helperText="At least 6 characters"
                    />
                    <TextField
                        fullWidth
                        label="Confirm Password"
                        name="confirmPassword"
                        type="password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        margin="normal"
                        required
                    />
                    <Button
                        fullWidth
                        type="submit"
                        variant="contained"
                        size="large"
                        startIcon={<PersonAddIcon />}
                        disabled={loading}
                        sx={{ mt: 3 }}
                    >
                        {loading ? 'Registering...' : 'Register'}
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
};

export default Register;
