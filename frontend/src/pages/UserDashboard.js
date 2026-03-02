import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    Container, Grid, Paper, Typography, Box, 
    AppBar, Toolbar, Button, Badge, Card, CardContent,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Chip, TextField, MenuItem, Alert
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import LogoutIcon from '@mui/icons-material/Logout';
import BookIcon from '@mui/icons-material/Book';
import ReportIcon from '@mui/icons-material/Report';
import SearchIcon from '@mui/icons-material/Search';
import api from '../services/api';

function UserDashboard() {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [myBookings, setMyBookings] = useState([]);
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const username = localStorage.getItem('username') || 'User';
    const userId = 1; // Hardcoded for testing

    // Role check for USER dashboard
    useEffect(() => {
        const role = localStorage.getItem('role');
        if (role !== 'USER') {
            navigate('/login');
        }
    }, [navigate]);

    // ✅ Role check - this is correct
    useEffect(() => {
        const role = localStorage.getItem('role');
        if (role !== 'USER') {
            navigate('/login');
        }
    }, [navigate]);

    // ✅ Fetch data when component loads
    useEffect(() => {
        fetchUserData();
    }, []);

    const fetchUserData = async () => {
        try {
            // Fetch notifications
            const notifResponse = await api.get(`/notifications?userId=${userId}`);
            setNotifications(notifResponse.data);
            
            const countResponse = await api.get(`/notifications/unread-count?userId=${userId}`);
            setUnreadCount(countResponse.data);
            
            // Mock data for bookings (to be replaced with real API)
            setMyBookings([
                { id: 1, resource: 'Conference Room A', date: '2026-03-15', time: '10:00-12:00', status: 'APPROVED' },
                { id: 2, resource: 'Lab 101', date: '2026-03-16', time: '14:00-16:00', status: 'PENDING' },
                { id: 3, resource: 'Projector', date: '2026-03-17', time: '09:00-11:00', status: 'APPROVED' },
            ]);
            
            // Mock data for resources
            setResources([
                { id: 1, name: 'Conference Room A', type: 'ROOM', capacity: 20, location: 'Building 1', status: 'AVAILABLE' },
                { id: 2, name: 'Lab 101', type: 'LAB', capacity: 30, location: 'Building 2', status: 'AVAILABLE' },
                { id: 3, name: 'Projector', type: 'EQUIPMENT', capacity: null, location: 'AV Room', status: 'AVAILABLE' },
                { id: 4, name: 'Meeting Room B', type: 'ROOM', capacity: 10, location: 'Building 1', status: 'MAINTENANCE' },
            ]);
        } catch (err) {
            setError('Failed to fetch data');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        localStorage.removeItem('role'); // ✅ Also remove role
        navigate('/');
    };

    const getStatusChip = (status) => {
        const colors = {
            'APPROVED': 'success',
            'PENDING': 'warning',
            'REJECTED': 'error',
            'CANCELLED': 'default',
            'AVAILABLE': 'success',
            'MAINTENANCE': 'error',
            'BOOKED': 'warning'
        };
        return <Chip label={status} color={colors[status] || 'default'} size="small" />;
    };

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static" sx={{ bgcolor: '#1976d2' }}>
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        👤 User Dashboard - UniCore 360
                    </Typography>
                    <Badge badgeContent={unreadCount} color="error">
                        <NotificationsIcon />
                    </Badge>
                    <Typography variant="body1" sx={{ ml: 2, mr: 2 }}>
                        {username}
                    </Typography>
                    <Button color="inherit" onClick={handleLogout} startIcon={<LogoutIcon />}>
                        Logout
                    </Button>
                </Toolbar>
            </AppBar>

            <Container maxWidth="xl" sx={{ mt: 4 }}>
                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                {loading ? (
                    <Typography>Loading...</Typography>
                ) : (
                    <Grid container spacing={3}>
                        {/* Welcome Card */}
                        <Grid item xs={12}>
                            <Paper sx={{ p: 3, bgcolor: '#e3f2fd' }}>
                                <Typography variant="h5">Welcome back, {username}!</Typography>
                                <Typography variant="body1">Manage your bookings, browse facilities, and report issues.</Typography>
                            </Paper>
                        </Grid>

                        {/* Quick Actions */}
                        <Grid item xs={12} md={4}>
                            <Card>
                                <CardContent>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                        <SearchIcon color="primary" sx={{ mr: 1 }} />
                                        <Typography variant="h6">Browse & Book</Typography>
                                    </Box>
                                    <Typography variant="body2" color="text.secondary" paragraph>
                                        Search available facilities and make booking requests.
                                    </Typography>
                                    <Button variant="contained" fullWidth>Browse Resources</Button>
                                </CardContent>
                            </Card>
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <Card>
                                <CardContent>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                        <BookIcon color="primary" sx={{ mr: 1 }} />
                                        <Typography variant="h6">My Bookings</Typography>
                                    </Box>
                                    <Typography variant="body2" color="text.secondary" paragraph>
                                        View status of your booking requests.
                                    </Typography>
                                    <Button variant="contained" fullWidth>View Bookings</Button>
                                </CardContent>
                            </Card>
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <Card>
                                <CardContent>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                        <ReportIcon color="primary" sx={{ mr: 1 }} />
                                        <Typography variant="h6">Report Issue</Typography>
                                    </Box>
                                    <Typography variant="body2" color="text.secondary" paragraph>
                                        Submit incident tickets with image attachments.
                                    </Typography>
                                    <Button variant="contained" fullWidth>New Ticket</Button>
                                </CardContent>
                            </Card>
                        </Grid>

                        {/* My Bookings Table */}
                        <Grid item xs={12}>
                            <Paper sx={{ p: 2 }}>
                                <Typography variant="h6" gutterBottom>My Recent Bookings</Typography>
                                <TableContainer>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Resource</TableCell>
                                                <TableCell>Date</TableCell>
                                                <TableCell>Time</TableCell>
                                                <TableCell>Status</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {myBookings.map((booking) => (
                                                <TableRow key={booking.id}>
                                                    <TableCell>{booking.resource}</TableCell>
                                                    <TableCell>{booking.date}</TableCell>
                                                    <TableCell>{booking.time}</TableCell>
                                                    <TableCell>{getStatusChip(booking.status)}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Paper>
                        </Grid>

                        {/* Available Resources */}
                        <Grid item xs={12}>
                            <Paper sx={{ p: 2 }}>
                                <Typography variant="h6" gutterBottom>Available Resources</Typography>
                                <TableContainer>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Name</TableCell>
                                                <TableCell>Type</TableCell>
                                                <TableCell>Capacity</TableCell>
                                                <TableCell>Location</TableCell>
                                                <TableCell>Status</TableCell>
                                                <TableCell>Action</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {resources.map((resource) => (
                                                <TableRow key={resource.id}>
                                                    <TableCell>{resource.name}</TableCell>
                                                    <TableCell>{resource.type}</TableCell>
                                                    <TableCell>{resource.capacity || '-'}</TableCell>
                                                    <TableCell>{resource.location}</TableCell>
                                                    <TableCell>{getStatusChip(resource.status)}</TableCell>
                                                    <TableCell>
                                                        <Button size="small" variant="outlined">Book</Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Paper>
                        </Grid>

                        {/* Notifications Section */}
                        <Grid item xs={12}>
                            <Paper sx={{ p: 2 }}>
                                <Typography variant="h6" gutterBottom>Recent Notifications</Typography>
                                {notifications.length === 0 ? (
                                    <Typography color="text.secondary">No notifications</Typography>
                                ) : (
                                    notifications.slice(0, 3).map((notif) => (
                                        <Paper key={notif.id} sx={{ p: 2, mb: 1, bgcolor: notif.read ? 'white' : '#e3f2fd' }}>
                                            <Typography variant="subtitle1">{notif.title}</Typography>
                                            <Typography variant="body2">{notif.message}</Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                {new Date(notif.createdAt).toLocaleString()}
                                            </Typography>
                                        </Paper>
                                    ))
                                )}
                            </Paper>
                        </Grid>
                    </Grid>
                )}
            </Container>
        </Box>
    );
}

export default UserDashboard;