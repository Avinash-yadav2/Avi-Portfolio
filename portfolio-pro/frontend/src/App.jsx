// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';

// Import Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

// Secure Route Wrapper
const ProtectedRoute = ({ children }) => {
    const { isAdmin, loading } = useAuth();
    
    if (loading) return <div className="h-screen w-screen bg-[#050505] text-white flex items-center justify-center">Authenticating...</div>;
    return isAdmin ? children : <Navigate to="/login" replace />;
};

function App() {
    return (
        <ThemeProvider>
            <AuthProvider>
                <Router>
                    <Routes>
                        {/* Public Portfolio Route */}
                        <Route path="/" element={<Home />} />
                        
                        {/* Admin Login Route */}
                        <Route path="/login" element={<Login />} />
                        
                        {/* Secure CMS Route */}
                        <Route 
                            path="/dashboard/*" 
                            element={
                                <ProtectedRoute>
                                    <Dashboard />
                                </ProtectedRoute>
                            } 
                        />
                    </Routes>
                </Router>
            </AuthProvider>
        </ThemeProvider>
    );
}

export default App;