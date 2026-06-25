import React, { useEffect, useState } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  ShieldCheck, Users, FileText, Home, Bell, User, Settings,
  LogOut, Building2, BookOpen, Layers, CreditCard,
  Search, ChevronRight, Menu, X, Command, Cpu, LayoutPanelLeft,
  Database, Shield, AlertTriangle, Power
} from 'lucide-react';
import api from '@/api';

const navItems = [
  { group: 'Overview', items: [
    { label: 'System Dashboard', path: '/admin/dashboard', icon: LayoutPanelLeft, statKey: 'users_count' },
  ]},
  { group: 'Platform', items: [
    { label: 'User Mainframe', path: '/admin/users', icon: User, statKey: 'users_count' },
    { label: 'Asset Library', path: '/admin/documents', icon: FileText, statKey: 'documents_count' },
    { label: 'Inventory Archive', path: '/admin/books', icon: BookOpen, statKey: 'books_count' },
  ]},
  { group: 'Operations', items: [
    { label: 'Institutions', path: '/admin/universities', icon: Building2, statKey: 'universities_count' },
    { label: 'Classification', path: '/admin/categories', icon: Layers, statKey: 'categories_count' },
    { label: 'Subscriptions', path: '/admin/subscriptions', icon: CreditCard },
  ]}
]

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const performLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
  }

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (!token || !storedUser) {
      navigate('/', { replace: true }); return;
    }
    try {
      const parsedUser = JSON.parse(storedUser);
      if (parsedUser.role !== 'admin') { navigate('/', { replace: true }); return; }
      setUser(parsedUser); setLoading(false);
      api.get('/admin/dashboard').then(res => { if (res.data?.stats) setStats(res.data.stats); });
    } catch (e) { performLogout(); }
  }, [navigate]);

  if (loading) return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
      <div className="animate-spin w-10 h-10 border-2 border-emerald-500 border-t-transparent rounded-full mb-3"></div>
      <p className="text-slate-500 font-black uppercase tracking-widest text-[10px]">Accessing Mainframe...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0d1117] text-slate-200 font-sans antialiased selection:bg-emerald-500/30 flex flex-col">
      {/* Top Protocol Bar */}
      <header className="h-16 border-b border-slate-800 flex items-center justify-between px-12 shrink-0 bg-[#0d1117] z-[60]">
          <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-slate-950 shadow-lg border border-emerald-400/20">
                <Command size={18} />
              </div>
              <h1 className="text-sm font-black text-white uppercase tracking-widest">DocuLink <span className="text-emerald-500 font-bold ml-1">Admin Control</span></h1>
          </div>

          <div className="flex items-center gap-6">
              <div className="hidden md:flex items-center gap-2 text-[10px] font-black text-slate-600 uppercase tracking-widest bg-slate-900 px-4 py-1.5 rounded-full border border-slate-800">
                  <div className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse"></div> System Secure
              </div>
              <div className="h-4 w-[1px] bg-slate-800"></div>
              <p className="text-[11px] font-black text-slate-500 lowercase">{user?.email}</p>
          </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-[#0d1117] border-r border-slate-800 transform transition-transform duration-300 lg:relative lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="h-full flex flex-col p-8 pt-12 overflow-y-auto no-scrollbar">
            <nav className="space-y-10 pr-2">
              {navItems.map((group) => (
                <div key={group.group}>
                  <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] px-4 mb-5 leading-none">{group.group}</p>
                  <div className="space-y-1">
                    {group.items.map((item) => {
                      const Icon = item.icon;
                      const isActive = location.pathname === item.path;
                      return (
                        <NavLink key={item.path} to={item.path} className={`flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-300 group ${isActive ? 'bg-gradient-to-r from-emerald-500/10 to-transparent border border-emerald-500/20 text-white shadow-xl' : 'text-slate-500 hover:text-slate-200'}`}>
                          <Icon size={18} className={isActive ? 'text-emerald-500' : 'text-slate-600 group-hover:text-slate-400'} />
                          <span className="text-[13px] font-black tracking-tight">{item.label}</span>
                        </NavLink>
                      )
                    })}
                  </div>
                </div>
              ))}
            </nav>

            <div className="mt-12 space-y-3">
                <NavLink to="/admin/profile" className="w-full flex items-center gap-4 px-6 py-4 bg-slate-900 border border-slate-800 rounded-3xl text-slate-300 hover:text-white hover:border-emerald-500/30 transition-all shadow-xl">
                   <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                   <span className="text-[11px] font-black uppercase tracking-widest">Profile Settings</span>
                </NavLink>
                <button onClick={() => setShowLogoutConfirm(true)} className="w-full flex items-center gap-4 px-6 py-4 bg-rose-500/5 border border-rose-500/10 rounded-3xl text-rose-500 hover:bg-rose-500/10 transition-all active:scale-95">
                   <LogOut size={16} /> <span className="text-[11px] font-black uppercase tracking-widest">Terminate Session</span>
                </button>
            </div>
          </div>
        </aside>

        <main className="flex-1 overflow-y-auto p-12 lg:p-16 custom-scrollbar bg-[#0d1117]">
          <div className="max-w-[1400px] mx-auto"><Outlet /></div>
        </main>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-300">
           <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-[40px] p-10 shadow-2xl animate-in zoom-in-95 duration-300">
              <div className="w-16 h-16 bg-rose-500/10 text-rose-500 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-rose-500/20">
                 <Power size={32} />
              </div>
              <h3 className="text-2xl font-black text-white text-center tracking-tighter">Terminate Session?</h3>
              <p className="text-slate-500 text-center text-sm mt-3 font-medium">You are about to disconnect from the administrative mainframe. All unsaved protocol changes may be lost.</p>

              <div className="flex flex-col gap-3 mt-10">
                 <button onClick={performLogout} className="w-full py-4 bg-rose-600 hover:bg-rose-500 text-white font-black text-[11px] uppercase tracking-widest rounded-2xl transition-all shadow-xl shadow-rose-950/20">Confirm Disconnect</button>
                 <button onClick={() => setShowLogoutConfirm(false)} className="w-full py-4 bg-slate-800 hover:bg-slate-700 text-slate-300 font-black text-[11px] uppercase tracking-widest rounded-2xl transition-all">Abort</button>
              </div>
           </div>
        </div>
      )}
    </div>
  )
}
