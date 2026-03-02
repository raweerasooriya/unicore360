import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Container, Typography, Box, Paper } from '@mui/material';

function HomePage() {
    return (
        <Container maxWidth="md">
            <Box sx={{ mt: 8, textAlign: 'center' }}>
                <Paper elevation={3} sx={{ p: 5 }}>
                    <Typography variant="h2" component="h1" gutterBottom color="primary">
                        🏛️ UniCore 360
                    </Typography>
                    
                    <Typography variant="h5" component="h2" gutterBottom sx={{ mb: 4 }}>
                        Smart Campus Operations Hub
                    </Typography>
                    
                    <Typography variant="body1" paragraph sx={{ mb: 4 }}>
                        Manage facilities, bookings, incident tickets, and more - all in one place.
                    </Typography>
                    
                    <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'center' }}>
                        <Button 
                            component={Link} 
                            to="/login" 
                            variant="contained" 
                            color="primary" 
                            size="large"
                        >
                            Login to Access Dashboard
                        </Button>
                    </Box>
                    
                    <Box sx={{ mt: 6, display: 'flex', justifyContent: 'space-around' }}>
                        <Box>
                            <Typography variant="h4" color="primary">🏢</Typography>
                            <Typography variant="body2">Facilities</Typography>
                        </Box>
                        <Box>
                            <Typography variant="h4" color="primary">📅</Typography>
                            <Typography variant="body2">Bookings</Typography>
                        </Box>
                        <Box>
                            <Typography variant="h4" color="primary">🎫</Typography>
                            <Typography variant="body2">Tickets</Typography>
                        </Box>
                        <Box>
                            <Typography variant="h4" color="primary">🔔</Typography>
                            <Typography variant="body2">Notifications</Typography>
                        </Box>
                    </Box>
                </Paper>
            </Box>
        </Container>
    );
}

export default HomePage;