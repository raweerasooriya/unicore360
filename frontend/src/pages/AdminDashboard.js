import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    Container, Grid, Paper, Typography, Box, 
    AppBar, Toolbar, Button, Badge, Card, CardContent,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Chip, TextField, MenuItem, Alert, Tabs, Tab, IconButton,
    Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import LogoutIcon from '@mui/icons-material/Logout';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import BookOnlineIcon from '@mui/icons-material/BookOnline';
import AssignmentIcon from '@mui/icons-material/Assignment';
import BarChartIcon from '@mui/icons-material/BarChart';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import api from '../services/api';

function TabPanel({ children, value, index }) {
    return (
        <div hidden={value !== index}>
            {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
        </div>
    );
}

function AdminDashboard() {
    const [tabValue, setTabValue] = useState(0);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [openDialog, setOpenDialog] = useState(false);
    const [dialogType, setDialogType] = useState('');
    const navigate = useNavigate();

    const username = localStorage.getItem('username') || 'Admin';
    const userId = 3; // Admin ID

    // Role check for ADMIN dashboard
    useEffect(() => {
        const role = localStorage.getItem('role');
        if (role !== 'ADMIN') {
            navigate('/login');
        }
    }, [navigate]);

    // ✅ ROLE CHECK - Place this HERE, inside the component
    useEffect(() => {
        const role = localStorage.getItem('role');
        if (role !== 'ADMIN') {  // Changed from 'USER' to 'ADMIN'
            navigate('/login');
        }
    }, [navigate]);

    // Mock data
    const [resources, setResources] = useState([
        { id: 1, name: 'Conference Room A', type: 'ROOM', capacity: 20, location: 'Building 1', status: 'ACTIVE' },
        { id: 2, name: 'Lab 101', type: 'LAB', capacity: 30, location: 'Building 2', status: 'ACTIVE' },
        { id: 3, name: 'Projector', type: 'EQUIPMENT', capacity: null, location: 'AV Room', status: 'MAINTENANCE' },
    ]);

    const [users, setUsers] = useState([
        { id: 1, name: 'John Student', email: 'john@uni.edu', role: 'USER', bookings: 5, tickets: 2 },
        { id: 2, name: 'Jane Tech', email: 'jane@uni.edu', role: 'TECHNICIAN', bookings: 0, tickets: 8 },
        { id: 3, name: 'Admin User', email: 'admin@uni.edu', role: 'ADMIN', bookings: 3, tickets: 0 },
    ]);

    const [bookings, setBookings] = useState([
        { id: 1, user: 'John Student', resource: 'Conference Room A', date: '2026-03-15', time: '10:00-12:00', status: 'PENDING' },
        { id: 2, user: 'John Student', resource: 'Lab 101', date: '2026-03-16', time: '14:00-16:00', status: 'APPROVED' },
        { id: 3, user: 'Jane Smith', resource: 'Projector', date: '2026-03-17', time: '09:00-11:00', status: 'PENDING' },
    ]);

    const [tickets, setTickets] = useState([
        { id: 1, title: 'Projector not working', user: 'John Student', priority: 'HIGH', status: 'OPEN', assignedTo: null },
        { id: 2, title: 'AC not cooling', user: 'Jane Smith', priority: 'MEDIUM', status: 'IN_PROGRESS', assignedTo: 'Jane Tech' },
        { id: 3, title: 'Network issue', user: 'Bob Wilson', priority: 'HIGH', status: 'OPEN', assignedTo: null },
    ]);

    useEffect(() => {
        fetchAdminData();
    }, []);

    const fetchAdminData = async () => {
        try {
            const notifResponse = await api.get(`/notifications?userId=${userId}`);
            setNotifications(notifResponse.data);
            
            const countResponse = await api.get(`/notifications/unread-count?userId=${userId}`);
            setUnreadCount(countResponse.data);
        } catch (err) {
            setError('Failed to fetch data');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        localStorage.removeItem('role');
        navigate('/');
    };

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    const handleOpenDialog = (type) => {
        setDialogType(type);
        setOpenDialog(true);
    };

    const handleApproveBooking = (id) => {
        setBookings(prev =>
            prev.map(booking =>
                booking.id === id ? { ...booking, status: 'APPROVED' } : booking
            )
        );
    };

    const handleRejectBooking = (id) => {
        setBookings(prev =>
            prev.map(booking =>
                booking.id === id ? { ...booking, status: 'REJECTED' } : booking
            )
        );
    };

    const handleAssignTicket = (ticketId, techId) => {
        setTickets(prev =>
            prev.map(ticket =>
                ticket.id === ticketId ? { ...ticket, assignedTo: 'Jane Tech' } : ticket
            )
        );
    };

    const getStatusChip = (status) => {
        const colors = {
            'ACTIVE': 'success',
            'MAINTENANCE': 'warning',
            'INACTIVE': 'error',
            'PENDING': 'warning',
            'APPROVED': 'success',
            'REJECTED': 'error',
            'OPEN': 'error',
            'IN_PROGRESS': 'warning',
            'RESOLVED': 'success'
        };
        return <Chip label={status} color={colors[status] || 'default'} size="small" />;
    };

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static" sx={{ bgcolor: '#2e3b4e' }}>
                <Toolbar>
                    <DashboardIcon sx={{ mr: 2 }} />
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        👑 Admin Dashboard - UniCore 360
                    </Typography>
                    <Badge badgeContent={unreadCount} color="error">
                        <NotificationsIcon />
                    </Badge>
                    <Typography variant="body1" sx={{ ml: 2, mr: 2 }}>
                        {username} (Admin)
                    </Typography>
                    <Button color="inherit" onClick={handleLogout} startIcon={<LogoutIcon />}>
                        Logout
                    </Button>
                </Toolbar>
            </AppBar>

            <Container maxWidth="xl" sx={{ mt: 4 }}>
                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                {/* Analytics Cards */}
                <Grid container spacing={3} sx={{ mb: 4 }}>
                    <Grid item xs={12} md={3}>
                        <Card sx={{ bgcolor: '#e3f2fd' }}>
                            <CardContent>
                                <Typography variant="h4">{resources.length}</Typography>
                                <Typography>Total Resources</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <Card sx={{ bgcolor: '#c8e6c9' }}>
                            <CardContent>
                                <Typography variant="h4">{users.length}</Typography>
                                <Typography>Total Users</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <Card sx={{ bgcolor: '#fff3e0' }}>
                            <CardContent>
                                <Typography variant="h4">{bookings.filter(b => b.status === 'PENDING').length}</Typography>
                                <Typography>Pending Bookings</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <Card sx={{ bgcolor: '#ffebee' }}>
                            <CardContent>
                                <Typography variant="h4">{tickets.filter(t => t.status === 'OPEN').length}</Typography>
                                <Typography>Open Tickets</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

                {/* Analytics Charts (Mock) */}
                <Paper sx={{ p: 3, mb: 4 }}>
                    <Typography variant="h6" gutterBottom>
                        <BarChartIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                        Analytics Overview
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                            <Typography variant="subtitle2">Top Used Resources</Typography>
                            <Box sx={{ bgcolor: '#f5f5f5', p: 2, borderRadius: 1 }}>
                                <Typography>• Conference Room A (45 bookings)</Typography>
                                <Typography>• Lab 101 (32 bookings)</Typography>
                                <Typography>• Projector (28 bookings)</Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Typography variant="subtitle2">Peak Booking Hours</Typography>
                            <Box sx={{ bgcolor: '#f5f5f5', p: 2, borderRadius: 1 }}>
                                <Typography>• 10:00 - 12:00 (Most popular)</Typography>
                                <Typography>• 14:00 - 16:00</Typography>
                                <Typography>• 09:00 - 11:00</Typography>
                            </Box>
                        </Grid>
                    </Grid>
                </Paper>

                {/* Main Tabs */}
                <Paper sx={{ width: '100%' }}>
                    <Tabs value={tabValue} onChange={handleTabChange} aria-label="admin tabs">
                        <Tab icon={<MeetingRoomIcon />} label="Resources" />
                        <Tab icon={<PeopleIcon />} label="Users" />
                        <Tab icon={<BookOnlineIcon />} label="Bookings" />
                        <Tab icon={<AssignmentIcon />} label="Tickets" />
                    </Tabs>

                    {/* Resources Tab */}
                    <TabPanel value={tabValue} index={0}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                            <Typography variant="h6">Manage Resources</Typography>
                            <Button 
                                variant="contained" 
                                startIcon={<AddIcon />}
                                onClick={() => handleOpenDialog('resource')}
                            >
                                Add Resource
                            </Button>
                        </Box>
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Name</TableCell>
                                        <TableCell>Type</TableCell>
                                        <TableCell>Capacity</TableCell>
                                        <TableCell>Location</TableCell>
                                        <TableCell>Status</TableCell>
                                        <TableCell>Actions</TableCell>
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
                                                <IconButton size="small" color="primary">
                                                    <EditIcon />
                                                </IconButton>
                                                <IconButton size="small" color="error">
                                                    <DeleteIcon />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </TabPanel>

                    {/* Users Tab */}
                    <TabPanel value={tabValue} index={1}>
                        <Typography variant="h6" gutterBottom>Manage Users</Typography>
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Name</TableCell>
                                        <TableCell>Email</TableCell>
                                        <TableCell>Role</TableCell>
                                        <TableCell>Bookings</TableCell>
                                        <TableCell>Tickets</TableCell>
                                        <TableCell>Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {users.map((user) => (
                                        <TableRow key={user.id}>
                                            <TableCell>{user.name}</TableCell>
                                            <TableCell>{user.email}</TableCell>
                                            <TableCell>
                                                <Chip 
                                                    label={user.role} 
                                                    color={user.role === 'ADMIN' ? 'error' : user.role === 'TECHNICIAN' ? 'warning' : 'primary'}
                                                    size="small"
                                                />
                                            </TableCell>
                                            <TableCell>{user.bookings}</TableCell>
                                            <TableCell>{user.tickets}</TableCell>
                                            <TableCell>
                                                <Button size="small" variant="outlined">Edit Role</Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </TabPanel>

                    {/* Bookings Tab */}
                    <TabPanel value={tabValue} index={2}>
                        <Typography variant="h6" gutterBottom>Manage Bookings</Typography>
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>User</TableCell>
                                        <TableCell>Resource</TableCell>
                                        <TableCell>Date</TableCell>
                                        <TableCell>Time</TableCell>
                                        <TableCell>Status</TableCell>
                                        <TableCell>Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {bookings.map((booking) => (
                                        <TableRow key={booking.id}>
                                            <TableCell>{booking.user}</TableCell>
                                            <TableCell>{booking.resource}</TableCell>
                                            <TableCell>{booking.date}</TableCell>
                                            <TableCell>{booking.time}</TableCell>
                                            <TableCell>{getStatusChip(booking.status)}</TableCell>
                                            <TableCell>
                                                {booking.status === 'PENDING' && (
                                                    <>
                                                        <Button 
                                                            size="small" 
                                                            color="success"
                                                            onClick={() => handleApproveBooking(booking.id)}
                                                        >
                                                            Approve
                                                        </Button>
                                                        <Button 
                                                            size="small" 
                                                            color="error"
                                                            onClick={() => handleRejectBooking(booking.id)}
                                                        >
                                                            Reject
                                                        </Button>
                                                    </>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </TabPanel>

                    {/* Tickets Tab */}
                    <TabPanel value={tabValue} index={3}>
                        <Typography variant="h6" gutterBottom>Manage Tickets</Typography>
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Title</TableCell>
                                        <TableCell>User</TableCell>
                                        <TableCell>Priority</TableCell>
                                        <TableCell>Status</TableCell>
                                        <TableCell>Assigned To</TableCell>
                                        <TableCell>Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {tickets.map((ticket) => (
                                        <TableRow key={ticket.id}>
                                            <TableCell>{ticket.title}</TableCell>
                                            <TableCell>{ticket.user}</TableCell>
                                            <TableCell>
                                                <Chip 
                                                    label={ticket.priority} 
                                                    color={ticket.priority === 'HIGH' ? 'error' : ticket.priority === 'MEDIUM' ? 'warning' : 'success'}
                                                    size="small"
                                                />
                                            </TableCell>
                                            <TableCell>{getStatusChip(ticket.status)}</TableCell>
                                            <TableCell>{ticket.assignedTo || 'Unassigned'}</TableCell>
                                            <TableCell>
                                                {!ticket.assignedTo && (
                                                    <Button size="small" variant="outlined">Assign</Button>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </TabPanel>
                </Paper>

                {/* Add Resource Dialog */}
                <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                    <DialogTitle>Add New Resource</DialogTitle>
                    <DialogContent>
                        <TextField margin="dense" label="Name" fullWidth />
                        <TextField margin="dense" label="Type" select fullWidth>
                            <MenuItem value="ROOM">Room</MenuItem>
                            <MenuItem value="LAB">Lab</MenuItem>
                            <MenuItem value="EQUIPMENT">Equipment</MenuItem>
                        </TextField>
                        <TextField margin="dense" label="Capacity" type="number" fullWidth />
                        <TextField margin="dense" label="Location" fullWidth />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
                        <Button variant="contained">Add</Button>
                    </DialogActions>
                </Dialog>
            </Container>
        </Box>
    );
}

export default AdminDashboard;