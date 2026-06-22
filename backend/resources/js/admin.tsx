import './bootstrap';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './Admin/AdminLayout';
import Dashboard from './Admin/Dashboard';
import Users from './Admin/Users';
import Documents from './Admin/Documents';
import Universities from './Admin/Universities';
import AdminLogin from './Admin/AdminLogin';

function AdminApp() {
    return (
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <Routes>
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin" element={<AdminLayout />}>
                    <Route index element={<Navigate to="dashboard" replace />} />
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="users" element={<Users />} />
                    <Route path="documents" element={<Documents />} />
                    <Route path="universities" element={<Universities />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

const root = document.getElementById('admin-root');
if (root) {
    ReactDOM.createRoot(root).render(<AdminApp />);
}
