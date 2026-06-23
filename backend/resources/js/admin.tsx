import './bootstrap';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Import Layout and Pages
import AdminLayout from './Admin/AdminLayout';
import AdminDashboardPage from './Admin/Dashboard';
import AdminUsersPage from './Admin/Users';
import AdminDocumentsPage from './Admin/Documents';
import AdminUniversitiesPage from './Admin/Universities';
import AdminLoginPage from './Admin/AdminLogin';

class AdminErrorBoundary extends React.Component<{children: React.ReactNode}, {hasError: boolean, error: any}> {
    constructor(props: any) {
        super(props);
        this.state = { hasError: false, error: null };
    }
    static getDerivedStateFromError(error: any) {
        return { hasError: true, error };
    }
    componentDidCatch(error: any, errorInfo: any) {
        console.error("Admin Panel Error:", error, errorInfo);
    }
    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-8 text-center">
                    <h1 className="text-2xl font-bold text-rose-500 mb-4">Admin Panel Error</h1>
                    <div className="bg-slate-900 p-6 rounded-2xl border border-rose-500/20 max-w-2xl">
                        <p className="text-rose-300 font-mono text-sm mb-4">
                            {this.state.error?.message || "An unknown error occurred"}
                        </p>
                        <button
                            onClick={() => window.location.href = '/'}
                            className="bg-teal-500 text-slate-950 px-8 py-3 rounded-xl font-black uppercase tracking-widest text-xs hover:bg-teal-400 transition-colors"
                        >
                            Restart Session
                        </button>
                    </div>
                </div>
            );
        }
        return this.props.children;
    }
}

function AdminAppMainRoot() {
    return (
        <AdminErrorBoundary>
            <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
                <Routes>
                    <Route path="/" element={<AdminLoginPage />} />
                    <Route path="/admin/login" element={<AdminLoginPage />} />
                    <Route path="/admin" element={<AdminLayout />}>
                        <Route index element={<Navigate to="dashboard" replace />} />
                        <Route path="dashboard" element={<AdminDashboardPage />} />
                        <Route path="users" element={<AdminUsersPage />} />
                        <Route path="documents" element={<AdminDocumentsPage />} />
                        <Route path="universities" element={<AdminUniversitiesPage />} />
                    </Route>
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </BrowserRouter>
        </AdminErrorBoundary>
    );
}

const container = document.getElementById('admin-root');
if (container) {
    const root = ReactDOM.createRoot(container);
    root.render(<AdminAppMainRoot />);
}
