import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import UserDashboard from './pages/UserDashboard';
import TechnicianDashboard from './pages/TechnicianDashboard';
import AdminDashboard from './pages/AdminDashboard';
import './App.css';

// Protected Route component
const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    
    if (!token) {
        return <Navigate to="/login" replace />;
    }
    return children;
};

// Role-based routing - redirects to appropriate dashboard
const RoleBasedRedirect = () => {
    const role = localStorage.getItem('role');
    
    switch(role) {
        case 'USER':
            return <Navigate to="/user-dashboard" replace />;
        case 'TECHNICIAN':
            return <Navigate to="/technician-dashboard" replace />;
        case 'ADMIN':
            return <Navigate to="/admin-dashboard" replace />;
        default:
            return <Navigate to="/login" replace />;
    }
};

function App() {
    return (
        <Router>
            <div className="App">
                <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<HomePage />} />
                    <Route path="/login" element={<LoginPage />} />
                    
                    {/* Role-specific dashboards */}
                    <Route 
                        path="/user-dashboard" 
                        element={
                            <ProtectedRoute>
                                <UserDashboard />
                            </ProtectedRoute>
                        } 
                    />
                    
                    <Route 
                        path="/technician-dashboard" 
                        element={
                            <ProtectedRoute>
                                <TechnicianDashboard />
                            </ProtectedRoute>
                        } 
                    />
                    
                    <Route 
                        path="/admin-dashboard" 
                        element={
                            <ProtectedRoute>
                                <AdminDashboard />
                            </ProtectedRoute>
                        } 
                    />
                    
                    {/* Default dashboard redirect based on role */}
                    <Route path="/dashboard" element={<RoleBasedRedirect />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;