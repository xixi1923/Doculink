import React, { useEffect, useState } from 'react';
import { NavLink, Outlet, Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, Users, FileText, Home, Bell, User, Settings, LogOut, Building2, BookOpen } from 'lucide-react';
import api from '@/api';

const navItems = [
  { label: 'Dashboard', path: 'dashboard', icon: Home, statKey: 'users_count' },
  { label: 'Users', path: 'users', icon: Users, statKey: 'users_count' },
  { label: 'Documents', path: 'documents', icon: FileText, statKey: 'documents_count' },
  { label: 'Books', path: 'books', icon: BookOpen, statKey: 'books_count' },
  { label: 'Universities', path: 'universities', icon: Building2, statKey: 'universities_count' },
  { label: 'My Profile', path: 'profile', icon: User },
  { label: 'Security Settings', path: 'settings', icon: Settings },
]

export default function AdminLayout() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState<any>({});
  const [loadingStats, setLoadingStats] = useState(true);

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/admin/login';
  }

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (!token || !storedUser) {
      navigate('/admin/login', { replace: true });
      return;
    }

    setUser(JSON.parse(storedUser));

    api.get('/admin/dashboard')
      .then(res => setStats(res.data.stats))
      .catch(err => {
        // If it's a 401, the interceptor will handle the redirect
        if (err.response?.status !== 401) {
          console.error('Failed to load dashboard stats:', err);
        }
      })
      .finally(() => setLoadingStats(false));
  }, [navigate]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="bg-gradient-to-r from-slate-900 via-teal-900 to-slate-900 text-white py-6 shadow-2xl">
        <div className="container mx-auto flex flex-col gap-4 md:flex-row md:items-center md:justify-between px-4">
          <div>
            <p className="text-sm uppercase tracking-[0.4em] text-teal-300 mb-2">Admin Console</p>
            <h1 className="text-3xl font-black tracking-tight">DocuLink Control Center</h1>
            <p className="mt-2 text-sm text-slate-300 max-w-2xl">
              Manage users, document library, and site analytics from one secure admin interface.
            </p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/5 px-5 py-4 shadow-lg shadow-teal-950/20 max-w-sm">
            <div className="flex items-center justify-between gap-4">
              <div className="min-w-0">
                <p className="text-xs uppercase tracking-[0.35em] text-teal-300">Signed in as</p>
                <p className="text-base font-semibold truncate">{user?.name || 'Administrator'}</p>
                <p className="text-sm text-slate-300 truncate">{user?.email}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-teal-500 text-white shrink-0">
                <ShieldCheck size={20} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto grid min-h-[calc(100vh-220px)] gap-6 xl:grid-cols-[300px_minmax(0,1fr)] px-4 py-8">
        <aside className="rounded-[32px] border border-slate-800 bg-slate-900/90 p-6 shadow-2xl sticky top-6 self-start">
          <nav className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon
              const statValue = item.statKey ? stats[item.statKey] : undefined
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center justify-between gap-3 rounded-3xl px-4 py-3 text-sm font-semibold transition-all ${
                      isActive ? 'bg-teal-500 text-slate-950 shadow-lg' : 'text-slate-200 hover:bg-slate-800'
                    }`
                  }
                >
                  <span className="flex items-center gap-3">
                    <Icon size={18} className="text-teal-300" />
                    <span>{item.label}</span>
                  </span>
                  {statValue !== undefined && (
                    <span className="rounded-full bg-slate-800 px-2.5 py-1 text-[10px] uppercase text-slate-300">
                      {loadingStats ? '...' : statValue}
                    </span>
                  )}
                </NavLink>
              )
            })}

            <button
              onClick={logout}
              className="w-full flex items-center gap-3 rounded-3xl px-4 py-3 text-sm font-semibold text-rose-400 hover:bg-rose-500/10 transition-all mt-4"
            >
              <LogOut size={18} />
              <span>Sign Out</span>
            </button>
          </nav>
        </aside>

        <main className="rounded-[32px] border border-slate-800 bg-slate-900/95 p-8 shadow-2xl overflow-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
