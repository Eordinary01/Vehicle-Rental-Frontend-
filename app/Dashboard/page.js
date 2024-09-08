// components/Dashboard.js
"use client"

import React from 'react';
import { useAuth } from '@/app/context/authContext';
import UserDashboard from '../components/UserDashboard';
import AdminDashboard from '../components/AdminDashboard';

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div>
      {user.role === 'admin' ? <AdminDashboard /> : <UserDashboard />}
    </div>
  );
};

export default Dashboard;