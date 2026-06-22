import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Eye, EyeOff, Loader2, AlertCircle } from 'lucide-react';
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
        if (userData.role === 'admin') {
          navigate('/admin/dashboard', { replace: true });
        }
      } catch (e) {}
    }
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // In a real scenario, this would call your Laravel login route
      // For now, we'll simulate the login process as requested
      const response = await api.post('/login', { email, password });

      const { user, access_token } = response.data;

      if (user.role !== 'admin') {
        throw new Error('Unauthorized. Admin access only.');
      }

      localStorage.setItem('token', access_token);
      localStorage.setItem('user', JSON.stringify(user));

      window.location.href = '/admin/dashboard';
    } catch (err: any) {
      console.error('Admin Login Error:', err);
      setError(err.response?.data?.message || err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-md">
        {/* Logo Section */}
        <div className="text-center mb-8">
          <div className="inline-flex h-20 w-20 items-center justify-center rounded-[2.5rem] bg-teal-500 text-white shadow-2xl shadow-teal-500/20 mb-6">
            <ShieldCheck size={40} />
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">DocuLink Admin</h1>
          <p className="text-slate-400 mt-2 font-medium">Restricted Access Control Center</p>
        </div>

        {/* Login Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 shadow-2xl">
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-teal-500 uppercase tracking-[0.2em] ml-1">
                Admin Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-sm font-bold text-white outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500/20 transition-all"
                placeholder="admin@doculink.com"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-teal-500 uppercase tracking-[0.2em] ml-1">
                Security Key
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-sm font-bold text-white outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500/20 transition-all"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-teal-500 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-rose-500/10 border border-rose-500/20 rounded-2xl p-4 flex items-start gap-3">
                <AlertCircle size={18} className="text-rose-500 shrink-0 mt-0.5" />
                <p className="text-xs text-rose-200 font-bold leading-relaxed">{error}</p>
              </div>
            )}

            <button
              disabled={loading}
              type="submit"
              className="w-full bg-teal-500 hover:bg-teal-400 disabled:opacity-50 disabled:cursor-not-allowed text-slate-950 py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-lg shadow-teal-500/20 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Authenticating...
                </>
              ) : (
                'Initialize Session'
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center mt-8 text-slate-500 text-xs font-bold uppercase tracking-widest">
          Secure Terminal v4.0.2
        </p>
      </div>
    </div>
  );
}
