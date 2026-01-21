import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Employees from './pages/Employees';
import LeaveRequests from './pages/LeaveRequests';
import MedicalCertificates from './pages/MedicalCertificates';
import Payslips from './pages/Payslips';
import TimeTracking from './pages/TimeTracking';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar se tem token no localStorage
    const token = localStorage.getItem('@RHPlus:token');
    setIsAuthenticated(!!token);
    setLoading(false);
  }, []);

  if (loading) {
    return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>Carregando...</div>;
  }

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />
      <Route path="/employees" element={isAuthenticated ? <Employees /> : <Navigate to="/login" />} />
      <Route path="/leave-requests" element={isAuthenticated ? <LeaveRequests /> : <Navigate to="/login" />} />
      <Route path="/medical-certificates" element={isAuthenticated ? <MedicalCertificates /> : <Navigate to="/login" />} />
      <Route path="/payslips" element={isAuthenticated ? <Payslips /> : <Navigate to="/login" />} />
      <Route path="/time-tracking" element={isAuthenticated ? <TimeTracking /> : <Navigate to="/login" />} />
    </Routes>
  );
}

export default App;