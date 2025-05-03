import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Dashboard from '../pages/admin/Dashboard';
import Users from '../pages/admin/Users';
import Medicaments from '../pages/admin/Medicaments';
import Orders from '../pages/admin/Orders';
import Stats from '../pages/admin/Stats';
import CreateAdmin from '../pages/admin/CreateAdmin';

const AdminRoutes = () => {
  const { isAuthenticated, isAdmin } = useAuth();

  if (!isAuthenticated || !isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/users" element={<Users />} />
      <Route path="/medicaments" element={<Medicaments />} />
      <Route path="/orders" element={<Orders />} />
      <Route path="/stats" element={<Stats />} />
      <Route path="/create" element={<CreateAdmin />} />
      <Route path="*" element={<Navigate to="/admin" replace />} />
    </Routes>
  );
};

export default AdminRoutes; 