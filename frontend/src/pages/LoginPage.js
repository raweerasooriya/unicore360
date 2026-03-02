import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    Container, Paper, TextField, Button, Typography, Box, 
    Alert, MenuItem, FormControl, InputLabel, Select, 
    Card, CardContent, Avatar, Divider 
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import PersonIcon from '@mui/icons-material/Person';
import BuildIcon from '@mui/icons-material/Build';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import api from '../services/api';

function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('USER');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('role');  // ✅ MAKE SURE THIS LINE IS THERE
    navigate('/');
    };

    // Predefined credentials for each role (for testing)
    const roleCredentials = {
        'USER': { username: 'user', password: 'user123', path: '/user-dashboard' },
        'TECHNICIAN': { username: 'tech', password: 'tech123', path: '/technician-dashboard' },
        'ADMIN': { username: 'admin', password: 'admin123', path: '/admin-dashboard' }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        // For demo purposes - check against predefined credentials
        const creds = roleCredentials[role];
        
        if (username === creds.username && password === creds.password) {
            // Create basic auth token
            const token = btoa(`${username}:${password}`);
            
            // Store in localStorage
            localStorage.setItem('token', token);
            localStorage.setItem('username', username);
            localStorage.setItem('role', role);
            
            // Redirect to appropriate dashboard
            navigate(creds.path);
        } else {
            setError(`Invalid credentials for ${role} role. Try ${creds.username}/${creds.password}`);
        }
        
        setLoading(false);
    };

    const getRoleIcon = () => {
        switch(role) {
            case 'USER': return <PersonIcon sx={{ fontSize: 40 }} />;
            case 'TECHNICIAN': return <BuildIcon sx={{ fontSize: 40 }} />;
            case 'ADMIN': return <AdminPanelSettingsIcon sx={{ fontSize: 40 }} />;
            default: return <PersonIcon />;
        }
    };

    const getRoleColor = () => {
        switch(role) {
            case 'USER': return '#1976d2';
            case 'TECHNICIAN': return '#ed6c02';
            case 'ADMIN': return '#2e3b4e';
            default: return '#1976d2';
        }
    };

    return (
        <Container maxWidth="sm">
            <Box sx={{ 
                mt: 8, 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center' 
            }}>
                <Paper 
                    elevation={3} 
                    sx={{ 
                        p: 4, 
                        width: '100%',
                        borderTop: `5px solid ${getRoleColor()}`
                    }}
                >
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
                        <Avatar sx={{ bgcolor: getRoleColor(), width: 60, height: 60, mb: 2 }}>
                            <LockOutlinedIcon />
                        </Avatar>
                        <Typography component="h1" variant="h4" gutterBottom>
                            UniCore 360
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Smart Campus Operations Hub
                        </Typography>
                    </Box>

                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {error}
                        </Alert>
                    )}

                    <form onSubmit={handleLogin}>
                        {/* Role Selection Card */}
                        <Card sx={{ mb: 3, bgcolor: '#f5f5f5' }}>
                            <CardContent>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                    <Box sx={{ 
                                        bgcolor: getRoleColor(), 
                                        borderRadius: '50%', 
                                        width: 50, 
                                        height: 50, 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        justifyContent: 'center',
                                        color: 'white',
                                        mr: 2
                                    }}>
                                        {getRoleIcon()}
                                    </Box>
                                    <Box>
                                        <Typography variant="h6">
                                            Login as {role}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Select your role and enter credentials
                                        </Typography>
                                    </Box>
                                </Box>

                                <FormControl fullWidth sx={{ mt: 2 }}>
                                    <InputLabel>Select Role</InputLabel>
                                    <Select
                                        value={role}
                                        label="Select Role"
                                        onChange={(e) => {
                                            setRole(e.target.value);
                                            setError('');
                                            // Auto-fill credentials for demo
                                            const creds = roleCredentials[e.target.value];
                                            setUsername(creds.username);
                                            setPassword(creds.password);
                                        }}
                                    >
                                        <MenuItem value="USER">
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                <PersonIcon sx={{ mr: 1, color: '#1976d2' }} />
                                                <Typography>User (Student/Staff)</Typography>
                                            </Box>
                                        </MenuItem>
                                        <MenuItem value="TECHNICIAN">
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                <BuildIcon sx={{ mr: 1, color: '#ed6c02' }} />
                                                <Typography>Technician</Typography>
                                            </Box>
                                        </MenuItem>
                                        <MenuItem value="ADMIN">
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                <AdminPanelSettingsIcon sx={{ mr: 1, color: '#2e3b4e' }} />
                                                <Typography>Administrator</Typography>
                                            </Box>
                                        </MenuItem>
                                    </Select>
                                </FormControl>
                            </CardContent>
                        </Card>

                        <TextField
                            fullWidth
                            label="Username"
                            variant="outlined"
                            margin="normal"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            InputProps={{
                                startAdornment: <PersonIcon sx={{ mr: 1, color: 'gray' }} />,
                            }}
                        />

                        <TextField
                            fullWidth
                            label="Password"
                            type="password"
                            variant="outlined"
                            margin="normal"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            size="large"
                            sx={{ 
                                mt: 3, 
                                mb: 2,
                                bgcolor: getRoleColor(),
                                '&:hover': {
                                    bgcolor: getRoleColor(),
                                    filter: 'brightness(90%)'
                                }
                            }}
                            disabled={loading}
                        >
                            {loading ? 'Logging in...' : `Sign in as ${role}`}
                        </Button>

                        <Divider sx={{ my: 2 }}>
                            <Typography variant="caption" color="text.secondary">
                                Demo Credentials
                            </Typography>
                        </Divider>

                        <Box sx={{ display: 'flex', justifyContent: 'space-around', mt: 2 }}>
                            <Box textAlign="center">
                                <PersonIcon sx={{ color: '#1976d2', fontSize: 30 }} />
                                <Typography variant="caption" display="block">
                                    User
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    user/user123
                                </Typography>
                            </Box>
                            <Box textAlign="center">
                                <BuildIcon sx={{ color: '#ed6c02', fontSize: 30 }} />
                                <Typography variant="caption" display="block">
                                    Technician
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    tech/tech123
                                </Typography>
                            </Box>
                            <Box textAlign="center">
                                <AdminPanelSettingsIcon sx={{ color: '#2e3b4e', fontSize: 30 }} />
                                <Typography variant="caption" display="block">
                                    Admin
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    admin/admin123
                                </Typography>
                            </Box>
                        </Box>
                    </form>
                </Paper>
            </Box>
        </Container>
    );
}

export default LoginPage;