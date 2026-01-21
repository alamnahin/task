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
    TablePagination,
    Alert,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store';
import { fetchUsers, updateUserRole, updateUserStatus } from '../store/slices/userSlice';
import { authService } from '../services/authService';
import Navbar from '../components/Navbar';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

const UserManagement: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { users, pagination, loading } = useSelector((state: RootState) => state.users);

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [inviteDialog, setInviteDialog] = useState(false);
    const [inviteData, setInviteData] = useState({ email: '', role: 'STAFF' });
    const [inviteResult, setInviteResult] = useState<string | null>(null);
    const [inviteError, setInviteError] = useState<string | null>(null);

    useEffect(() => {
        dispatch(fetchUsers({ page: page + 1, limit: rowsPerPage }));
    }, [dispatch, page, rowsPerPage]);

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleRoleChange = async (userId: string, newRole: string) => {
        await dispatch(updateUserRole({ id: userId, role: newRole }));
    };

    const handleStatusChange = async (userId: string, currentStatus: string) => {
        const newStatus = currentStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
        await dispatch(updateUserStatus({ id: userId, status: newStatus }));
    };

    const handleInvite = async () => {
        try {
            setInviteError(null);
            const result = await authService.createInvite(inviteData);
            setInviteResult(result.inviteLink);
            setInviteData({ email: '', role: 'STAFF' });
        } catch (error: any) {
            setInviteError(error.response?.data?.message || 'Failed to create invite');
        }
    };

    const closeInviteDialog = () => {
        setInviteDialog(false);
        setInviteResult(null);
        setInviteError(null);
    };

    return (
        <>
            <Navbar />
            <Container maxWidth="lg" sx={{ mt: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h4">User Management</Typography>
                    <Button
                        variant="contained"
                        startIcon={<PersonAddIcon />}
                        onClick={() => setInviteDialog(true)}
                    >
                        Invite User
                    </Button>
                </Box>

                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell>Role</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Created At</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={6} align="center">
                                        Loading...
                                    </TableCell>
                                </TableRow>
                            ) : users.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} align="center">
                                        No users found
                                    </TableCell>
                                </TableRow>
                            ) : (
                                users.map((user) => (
                                    <TableRow key={user.id}>
                                        <TableCell>{user.name}</TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell>
                                            <FormControl size="small" sx={{ minWidth: 120 }}>
                                                <Select
                                                    value={user.role}
                                                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                                >
                                                    <MenuItem value="ADMIN">ADMIN</MenuItem>
                                                    <MenuItem value="MANAGER">MANAGER</MenuItem>
                                                    <MenuItem value="STAFF">STAFF</MenuItem>
                                                </Select>
                                            </FormControl>
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={user.status}
                                                color={user.status === 'ACTIVE' ? 'success' : 'default'}
                                                size="small"
                                            />
                                        </TableCell>
                                        <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                                        <TableCell>
                                            <Button
                                                size="small"
                                                variant="outlined"
                                                onClick={() => handleStatusChange(user.id, user.status)}
                                            >
                                                {user.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                    {pagination && (
                        <TablePagination
                            component="div"
                            count={pagination.total}
                            page={page}
                            onPageChange={handleChangePage}
                            rowsPerPage={rowsPerPage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                    )}
                </TableContainer>

                {/* Invite Dialog */}
                <Dialog open={inviteDialog} onClose={closeInviteDialog}>
                    <DialogTitle>Invite New User</DialogTitle>
                    <DialogContent>
                        {inviteError && (
                            <Alert severity="error" sx={{ mb: 2 }}>
                                {inviteError}
                            </Alert>
                        )}
                        {inviteResult ? (
                            <Box>
                                <Alert severity="success" sx={{ mb: 2 }}>
                                    Invite created successfully!
                                </Alert>
                                <TextField
                                    fullWidth
                                    label="Invite Link"
                                    value={inviteResult}
                                    InputProps={{ readOnly: true }}
                                    multiline
                                    rows={3}
                                />
                                <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                                    Share this link with the user to complete registration
                                </Typography>
                            </Box>
                        ) : (
                            <Box>
                                <TextField
                                    fullWidth
                                    label="Email"
                                    type="email"
                                    value={inviteData.email}
                                    onChange={(e) => setInviteData({ ...inviteData, email: e.target.value })}
                                    margin="normal"
                                />
                                <FormControl fullWidth margin="normal">
                                    <InputLabel>Role</InputLabel>
                                    <Select
                                        value={inviteData.role}
                                        onChange={(e) => setInviteData({ ...inviteData, role: e.target.value })}
                                    >
                                        <MenuItem value="ADMIN">ADMIN</MenuItem>
                                        <MenuItem value="MANAGER">MANAGER</MenuItem>
                                        <MenuItem value="STAFF">STAFF</MenuItem>
                                    </Select>
                                </FormControl>
                            </Box>
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={closeInviteDialog}>Close</Button>
                        {!inviteResult && (
                            <Button onClick={handleInvite} variant="contained">
                                Create Invite
                            </Button>
                        )}
                    </DialogActions>
                </Dialog>
            </Container>
        </>
    );
};

export default UserManagement;
