import React from 'react';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
  try {
    const token = localStorage.getItem('adminToken');
    const key = localStorage.getItem('adminKey');
    if (token || key) return children;
  } catch (e) {
    // ignore storage errors
  }
  return <Navigate to="/admin/login" replace />;
}
