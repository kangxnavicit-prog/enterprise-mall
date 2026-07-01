// Enterprise Mall - RoleGuard Component
// Route guard that restricts access based on user role

import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';

interface RoleGuardProps {
  requiredRole: 'EMPLOYEE' | 'ADMIN';
}

const RoleGuard: React.FC<RoleGuardProps> = ({ requiredRole }) => {
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default RoleGuard;
