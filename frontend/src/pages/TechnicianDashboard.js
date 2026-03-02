import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    Container, Grid, Paper, Typography, Box, 
    AppBar, Toolbar, Button, Badge, Card, CardContent,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Chip, TextField, MenuItem, Alert, Dialog, DialogTitle,
    DialogContent, DialogActions
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import LogoutIcon from '@mui/icons-material/Logout';
import AssignmentIcon from '@mui/icons-material/Assignment';
import BuildIcon from '@mui/icons-material/Build';
import api from '../services/api';

function TechnicianDashboard() {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [assignedTickets, setAssignedTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [resolutionNotes, setResolutionNotes] = useState('');
    const navigate = useNavigate();

    const username = localStorage.getItem('username') || 'Technician';
    const userId = 2; // Technician ID

    // Role check for TECHNICIAN dashboard
    useEffect(() => {
        const role = localStorage.getItem('role');
        if (role !== 'TECHNICIAN') {
            navigate('/login');
        }
    }, [navigate]);

    // Role check
    useEffect(() => {
        const role = localStorage.getItem('role');
        if (role !== 'TECHNICIAN') {
            navigate('/login');
        }
    }, [navigate]);

    // Fetch data on component load
    useEffect(() => {
        fetchTechnicianData();
    }, []);

    const fetchTechnicianData = async () => {
        try {
            // Fetch notifications
            const notifResponse = await api.get(`/notifications?userId=${userId}`);
            setNotifications(notifResponse.data);
            
            const countResponse = await api.get(`/notifications/unread-count?userId=${userId}`);
            setUnreadCount(countResponse.data);
            
            // Mock data for assigned tickets
            setAssignedTickets([
                { id: 101, title: 'Projector not working', category: 'EQUIPMENT', priority: 'HIGH', location: 'Room 201', status: 'OPEN', created: '2026-03-02' },
                { id: 102, title: 'AC not cooling', category: 'FACILITY', priority: 'MEDIUM', location: 'Lab 101', status: 'IN_PROGRESS', created: '2026-03-01' },
                { id: 103, title: 'Network issue', category: 'NETWORK', priority: 'HIGH', location: 'Library', status: 'OPEN', created: '2026-03-02' },
                { id: 104, title: 'Broken chair', category: 'FACILITY', priority: 'LOW', location: 'Room 105', status: 'RESOLVED', created: '2026-02-28' },
                { id: 105, title: 'Computer not booting', category: 'EQUIPMENT', priority: 'HIGH', location: 'Lab 102', status: 'OPEN', created: '2026-03-02' },
                { id: 106, title: 'Light flickering', category: 'FACILITY', priority: 'LOW', location: 'Hallway', status: 'IN_PROGRESS', created: '2026-03-01' },
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
        localStorage.removeItem('role');
        navigate('/');
    };

    const handleStatusUpdate = (ticketId, newStatus) => {
        setAssignedTickets(prev =>
            prev.map(ticket =>
                ticket.id === ticketId ? { ...ticket, status: newStatus } : ticket
            )
        );
        
        // Show success message
        setError('');
    };

    const handleOpenDialog = (ticket) => {
        setSelectedTicket(ticket);
        setResolutionNotes('');
        setOpenDialog(true);
    };

    const handleResolveTicket = () => {
        if (selectedTicket) {
            handleStatusUpdate(selectedTicket.id, 'RESOLVED');
            setOpenDialog(false);
            // Here you would also save the resolution notes to backend
            console.log(`Resolution notes for ticket ${selectedTicket.id}: ${resolutionNotes}`);
        }
    };

    const getPriorityChip = (priority) => {
        const colors = {
            'HIGH': 'error',
            'MEDIUM': 'warning',
            'LOW': 'success'
        };
        return <Chip label={priority} color={colors[priority]} size="small" />;
    };

    const getStatusChip = (status) => {
        const colors = {
            'OPEN': 'error',
            'IN_PROGRESS': 'warning',
            'RESOLVED': 'success',
            'CLOSED': 'default'
        };
        return <Chip label={status} color={colors[status]} size="small" />;
    };

    // Calculate stats
    const openTickets = assignedTickets.filter(t => t.status === 'OPEN').length;
    const inProgressTickets = assignedTickets.filter(t => t.status === 'IN_PROGRESS').length;
    const resolvedToday = assignedTickets.filter(t => t.status === 'RESOLVED').length;
    const totalAssigned = assignedTickets.length;

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static" sx={{ bgcolor: '#ed6c02' }}>
                <Toolbar>
                    <BuildIcon sx={{ mr: 2 }} />
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        🔧 Technician Dashboard - UniCore 360
                    </Typography>
                    <Badge badgeContent={unreadCount} color="error">
                        <NotificationsIcon />
                    </Badge>
                    <Typography variant="body1" sx={{ ml: 2, mr: 2 }}>
                        {username} (Technician)
                    </Typography>
                    <Button color="inherit" onClick={handleLogout} startIcon={<LogoutIcon />}>
                        Logout
                    </Button>
                </Toolbar>
            </AppBar>

            <Container maxWidth="xl" sx={{ mt: 4 }}>
                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                {loading ? (
                    <Typography>Loading dashboard...</Typography>
                ) : (
                    <Grid container spacing={3}>
                        {/* Stats Cards */}
                        <Grid item xs={12} md={3}>
                            <Card sx={{ bgcolor: '#ffebee' }}>
                                <CardContent>
                                    <Typography variant="h4" color="error">{openTickets}</Typography>
                                    <Typography variant="body2">Open Tickets</Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <Card sx={{ bgcolor: '#fff3e0' }}>
                                <CardContent>
                                    <Typography variant="h4" color="warning">{inProgressTickets}</Typography>
                                    <Typography variant="body2">In Progress</Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <Card sx={{ bgcolor: '#e8f5e9' }}>
                                <CardContent>
                                    <Typography variant="h4" color="success">{resolvedToday}</Typography>
                                    <Typography variant="body2">Resolved</Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <Card sx={{ bgcolor: '#e3f2fd' }}>
                                <CardContent>
                                    <Typography variant="h4" color="info">{totalAssigned}</Typography>
                                    <Typography variant="body2">Total Assigned</Typography>
                                </CardContent>
                            </Card>
                        </Grid>

                        {/* Welcome Card */}
                        <Grid item xs={12}>
                            <Paper sx={{ p: 2, bgcolor: '#fff3e0' }}>
                                <Typography variant="h6">Welcome, Technician {username}!</Typography>
                                <Typography variant="body2">You have {openTickets} open tickets requiring attention.</Typography>
                            </Paper>
                        </Grid>

                        {/* Assigned Tickets Table */}
                        <Grid item xs={12}>
                            <Paper sx={{ p: 2 }}>
                                <Typography variant="h6" gutterBottom>
                                    <AssignmentIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                                    My Assigned Tickets
                                </Typography>
                                <TableContainer>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>ID</TableCell>
                                                <TableCell>Title</TableCell>
                                                <TableCell>Category</TableCell>
                                                <TableCell>Priority</TableCell>
                                                <TableCell>Location</TableCell>
                                                <TableCell>Status</TableCell>
                                                <TableCell>Created</TableCell>
                                                <TableCell>Actions</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {assignedTickets.map((ticket) => (
                                                <TableRow key={ticket.id} 
                                                    sx={{ 
                                                        bgcolor: ticket.priority === 'HIGH' && ticket.status === 'OPEN' ? '#ffebee' : 'inherit'
                                                    }}
                                                >
                                                    <TableCell>#{ticket.id}</TableCell>
                                                    <TableCell>{ticket.title}</TableCell>
                                                    <TableCell>{ticket.category}</TableCell>
                                                    <TableCell>{getPriorityChip(ticket.priority)}</TableCell>
                                                    <TableCell>{ticket.location}</TableCell>
                                                    <TableCell>{getStatusChip(ticket.status)}</TableCell>
                                                    <TableCell>{ticket.created}</TableCell>
                                                    <TableCell>
                                                        <Box sx={{ display: 'flex', gap: 1 }}>
                                                            {ticket.status === 'OPEN' && (
                                                                <Button 
                                                                    size="small" 
                                                                    variant="contained" 
                                                                    color="warning"
                                                                    onClick={() => handleStatusUpdate(ticket.id, 'IN_PROGRESS')}
                                                                >
                                                                    Start
                                                                </Button>
                                                            )}
                                                            {ticket.status === 'IN_PROGRESS' && (
                                                                <Button 
                                                                    size="small" 
                                                                    variant="contained" 
                                                                    color="success"
                                                                    onClick={() => handleOpenDialog(ticket)}
                                                                >
                                                                    Resolve
                                                                </Button>
                                                            )}
                                                            <Button size="small" variant="outlined">Details</Button>
                                                        </Box>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Paper>
                        </Grid>

                        {/* Priority Summary */}
                        <Grid item xs={12} md={6}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>Priority Summary</Typography>
                                    <Box sx={{ mt: 2 }}>
                                        <Typography variant="body2">
                                            High Priority: {assignedTickets.filter(t => t.priority === 'HIGH').length}
                                        </Typography>
                                        <Typography variant="body2">
                                            Medium Priority: {assignedTickets.filter(t => t.priority === 'MEDIUM').length}
                                        </Typography>
                                        <Typography variant="body2">
                                            Low Priority: {assignedTickets.filter(t => t.priority === 'LOW').length}
                                        </Typography>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>

                        {/* Recent Activity */}
                        <Grid item xs={12} md={6}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>Recent Activity</Typography>
                                    <Box sx={{ mt: 2 }}>
                                        <Typography variant="body2">• Ticket #103 started - Network issue</Typography>
                                        <Typography variant="body2">• Ticket #101 resolved - Projector fixed</Typography>
                                        <Typography variant="body2">• New ticket #107 assigned - AC repair</Typography>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                )}

                {/* Resolution Notes Dialog */}
                <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
                    <DialogTitle>Add Resolution Notes</DialogTitle>
                    <DialogContent>
                        <Typography variant="subtitle2" gutterBottom>
                            Ticket: {selectedTicket?.title} (#{selectedTicket?.id})
                        </Typography>
                        <TextField
                            autoFocus
                            margin="dense"
                            label="Resolution Notes"
                            fullWidth
                            multiline
                            rows={4}
                            value={resolutionNotes}
                            onChange={(e) => setResolutionNotes(e.target.value)}
                            placeholder="Describe how you fixed the issue..."
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
                        <Button onClick={handleResolveTicket} variant="contained" color="success">
                            Mark as Resolved
                        </Button>
                    </DialogActions>
                </Dialog>
            </Container>
        </Box>
    );
}

export default TechnicianDashboard;