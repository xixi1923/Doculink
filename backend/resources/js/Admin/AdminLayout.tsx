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
  const [loading, setLoading] = useState(true);
  const [loadingStats, setLoadingStats] = useState(true);

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
  }

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (!token || !storedUser) {
      console.log('No token or user found, redirecting...');
      navigate('/', { replace: true });
      return;
    }

    try {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setLoading(false);

      api.get('/admin/dashboard')
        .then(res => {
          if (res.data && res.data.stats) {
            setStats(res.data.stats);
          }
        })
        .catch(err => {
          if (err.response?.status !== 401) {
            console.error('Failed to load dashboard stats:', err);
          }
        })
        .finally(() => setLoadingStats(false));
    } catch (e) {
      console.error('Failed to parse user data:', e);
      logout();
    }
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
        <div className="animate-spin w-10 h-10 border-4 border-teal-500 border-t-transparent rounded-full mb-4"></div>
        <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Initializing Admin Session...</p>
      </div>
    );
  }

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
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-teal-500 text-white shrink-0 overflow-hidden border-2 border-teal-400/30">
                {user?.avatar ? (
                  <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
                ) : (
                  <ShieldCheck size={20} />
                )}
              </div>
              <div className="min-w-0">
                <p className="text-xs uppercase tracking-[0.35em] text-teal-300">Signed in as</p>
                <p className="text-base font-semibold truncate leading-tight">{user?.name || 'Administrator'}</p>
                <p className="text-sm text-slate-300 truncate">{user?.email}</p>
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
