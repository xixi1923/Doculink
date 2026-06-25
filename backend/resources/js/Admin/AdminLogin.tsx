import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Eye, EyeOff, Loader2, AlertCircle, Command, Lock, Mail, Activity } from 'lucide-react';
import api from '@/api';

export default function AdminLogin() {
  const [email, setEmail] = useState('admin@doculink.com');
  const [password, setPassword] = useState('password');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    if (token && user) {
      try {
        const userData = JSON.parse(user);
        if (userData.role === 'admin') navigate('/admin/dashboard', { replace: true });
      } catch (e) {}
    }
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError(null);
    try {
      const response = await api.post('/login', { email, password });
      const { user, access_token } = response.data;
      if (user.role !== 'admin') throw new Error('Access Denied. Root privileges required.');
      localStorage.setItem('token', access_token);
      localStorage.setItem('user', JSON.stringify(user));
      window.location.href = '/admin/dashboard';
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Transmission failed.');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-[#0d1117] flex items-center justify-center p-6 font-sans selection:bg-emerald-500/30">
      <div className="w-full max-w-lg">
        {/* Branding */}
        <div className="text-center mb-12 animate-in fade-in slide-in-from-top-8 duration-700">
          <div className="inline-flex h-20 w-20 items-center justify-center rounded-[2.5rem] bg-gradient-to-br from-emerald-500 to-teal-700 text-slate-950 shadow-2xl shadow-emerald-500/20 mb-8 border border-emerald-400/30">
            <Command size={40} />
          </div>
          <h1 className="text-4xl font-black text-white tracking-tighter">DocuLink <span className="text-emerald-500">Mainframe</span></h1>
          <p className="text-slate-500 mt-3 font-medium uppercase tracking-[0.3em] text-[10px]">Restricted Administrative Access</p>
        </div>

        {/* Login Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-[50px] p-12 shadow-[0_30px_100px_rgba(0,0,0,0.6)] animate-in zoom-in-95 duration-700">
          <form onSubmit={handleLogin} className="space-y-8">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Access Identity (Email)</label>
              <div className="relative group">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-emerald-500 transition-colors" size={16} />
                <input
                  type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-5 pl-14 pr-6 text-[13px] font-black text-white outline-none focus:border-emerald-500/50 transition-all shadow-inner"
                  placeholder="admin@mainframe.sys"
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Encryption Key (Password)</label>
              <div className="relative group">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-emerald-500 transition-colors" size={16} />
                <input
                  type={showPassword ? 'text' : 'password'} required value={password} onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-5 pl-14 pr-16 text-[13px] font-black text-white outline-none focus:border-emerald-500/50 transition-all shadow-inner"
                  placeholder="••••••••"
                />
                <button
                  type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-600 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-rose-500/5 border border-rose-500/20 rounded-[28px] p-5 flex items-center gap-4 text-rose-400 animate-in shake duration-300">
                <AlertCircle size={20} />
                <p className="text-[12px] font-black uppercase tracking-tight">{error}</p>
              </div>
            )}

            <button
              disabled={loading} type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-slate-950 py-5 rounded-[28px] font-black text-[11px] uppercase tracking-[0.2em] transition-all shadow-[0_0_50px_rgba(5,150,105,0.2)] flex items-center justify-center gap-3 border border-emerald-400/30 active:scale-95"
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : <Activity size={18} />}
              Initialize Session
            </button>
          </form>
        </div>

        <div className="flex items-center justify-center gap-4 mt-12">
            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
            <p className="text-slate-600 text-[9px] font-black uppercase tracking-[0.4em]">Protocol Version 4.0.2 Stable</p>
        </div>
      </div>
    </div>
  );
}
