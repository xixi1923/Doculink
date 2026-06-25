import React, { useState, useEffect } from 'react'
import {
  ShieldCheck,
  Settings as SettingsIcon,
  Mail,
  Calendar,
  User as UserIcon,
  Activity,
  Award,
  Clock,
  ExternalLink,
  ChevronRight,
  Shield,
  Cpu
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { getProfile } from '@/api/authApi'

export default function AdminProfile(): React.JSX.Element {
  const [backendUser, setBackendUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [imageError, setImageError] = useState(false)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getProfile()
        setBackendUser(userData)
      } catch (error) {
        console.error('Failed to fetch admin profile', error)
        const storedUser = localStorage.getItem('user');
        if (storedUser) setBackendUser(JSON.parse(storedUser));
      } finally {
        setIsLoading(false)
      }
    }
    fetchUser()
  }, [])

  const user = backendUser;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-4">
        <div className="w-12 h-12 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Decoding Identity...</p>
      </div>
    )
  }

  if (!user) return (
      <div className="flex flex-col items-center justify-center py-32">
          <p className="text-rose-400 font-black uppercase text-xs tracking-widest">Protocol Sync Failure</p>
          <button onClick={() => window.location.reload()} className="mt-6 text-emerald-500 text-[10px] font-black uppercase tracking-widest hover:underline">Restart Registry</button>
      </div>
  );

  const initials = user.name
    ? user.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase()
    : 'AD'

  return (
    <div className="space-y-10 animate-in fade-in zoom-in-95 duration-700">
      {/* Profile Identity Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-[50px] overflow-hidden shadow-2xl">
        <div className="h-40 bg-gradient-to-br from-emerald-900 via-slate-950 to-slate-950 relative border-b border-slate-800">
            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
            <div className="absolute inset-0 bg-emerald-500/5 backdrop-blur-[2px]"></div>
        </div>
        <div className="px-12 pb-10">
            <div className="relative flex flex-col md:flex-row md:items-end justify-between -mt-16 gap-8">
                <div className="flex flex-col md:flex-row items-center md:items-end gap-6">
                    <div className="w-40 h-40 rounded-[40px] bg-slate-900 p-2 shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-slate-800 relative group">
                        <div className="w-full h-full rounded-[34px] bg-slate-950 border border-slate-800 overflow-hidden flex items-center justify-center text-5xl font-black text-emerald-500 shadow-inner">
                            {user.avatar && !imageError ? (
                                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" onError={() => setImageError(true)} />
                            ) : (
                                <span>{initials}</span>
                            )}
                        </div>
                    </div>
                    <div className="text-center md:text-left pb-4">
                        <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                            <h1 className="text-3xl font-black text-white tracking-tighter leading-none">{user.name}</h1>
                            <div className="w-6 h-6 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center border border-emerald-500/20">
                                <ShieldCheck size={14} />
                            </div>
                        </div>
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                            <span className="text-[11px] font-black text-slate-500 uppercase tracking-[0.2em]">{user.role || 'Superuser'}</span>
                            <div className="w-1 h-1 rounded-full bg-slate-800"></div>
                            <div className="flex items-center gap-1.5">
                               <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                               <span className="text-[11px] font-black text-emerald-500 uppercase tracking-widest">Core Access Active</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex gap-3 self-center md:pb-4">
                    <Link to="/admin/settings" className="px-8 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-slate-950 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl shadow-emerald-950/40 flex items-center gap-2.5 border border-emerald-400/30 active:scale-95">
                        <SettingsIcon size={16} /> Sync Credentials
                    </Link>
                </div>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Quick Info */}
        <div className="lg:col-span-1 space-y-8">
            <div className="bg-slate-900 border border-slate-800 p-8 rounded-[40px] shadow-sm">
                <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
                    <Activity size={18} className="text-emerald-500" /> Identity Telemetry
                </h3>
                <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 bg-slate-950 rounded-3xl border border-slate-800/50">
                        <div className="flex items-center gap-4">
                            <div className="p-2.5 rounded-xl bg-slate-900 text-slate-600 border border-slate-800"><Mail size={16} /></div>
                            <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Network Link</span>
                        </div>
                        <span className="text-xs font-bold text-slate-200">{user.email}</span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-slate-950 rounded-3xl border border-slate-800/50">
                        <div className="flex items-center gap-4">
                            <div className="p-2.5 rounded-xl bg-slate-900 text-slate-600 border border-slate-800"><Calendar size={16} /></div>
                            <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest"> रजिस्ट्री Registry</span>
                        </div>
                        <span className="text-xs font-bold text-slate-200">Oct 2023</span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-slate-950 rounded-3xl border border-slate-800/50">
                        <div className="flex items-center gap-4">
                            <div className="p-2.5 rounded-xl bg-slate-900 text-slate-600 border border-slate-800"><Award size={16} /></div>
                            <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Clearance</span>
                        </div>
                        <span className="text-[11px] font-black text-emerald-500 uppercase tracking-[0.2em]">Root Level</span>
                    </div>
                </div>
            </div>

            <div className="bg-gradient-to-br from-emerald-900/40 to-slate-950 p-8 rounded-[40px] text-white border border-emerald-500/20 shadow-2xl relative overflow-hidden group">
                <Clock size={80} className="absolute -right-6 -bottom-6 text-white/5 group-hover:scale-110 transition-transform duration-1000" />
                <h3 className="text-lg font-black leading-none tracking-tight">Access Log</h3>
                <p className="text-emerald-100/40 text-[11px] mt-4 leading-relaxed font-medium">Session initialized successfully. Identity token expiration in 24 hours.</p>
                <button className="mt-8 w-full py-3 bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/20 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all">Audit Trails</button>
            </div>
        </div>

        {/* Right Column: Detailed Bio */}
        <div className="lg:col-span-2 space-y-8">
            <div className="bg-slate-900 border border-slate-800 p-10 rounded-[40px] shadow-sm relative overflow-hidden">
                <Shield size={120} className="absolute -left-10 -top-10 text-white/5 rotate-12" />
                <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
                    <UserIcon size={18} className="text-emerald-500" /> Profile Abstract
                </h3>
                <p className="text-[15px] text-slate-400 leading-relaxed font-medium italic relative z-10">
                    "{user.bio || "Root-level orchestration initialized. Authorization granted for identity node management, repository integrity auditing, and global metadata synchronization. Security tokens are currently in stable state."}"
                </p>

                <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 gap-6 pt-10 border-t border-slate-800 relative z-10">
                    <div>
                        <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em]">Workgroup</p>
                        <p className="text-xs font-black text-white mt-2">Core Tech Architecture</p>
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em]">Deployment</p>
                        <p className="text-xs font-black text-white mt-2">Node Segment 01</p>
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em]">Status</p>
                        <div className="flex items-center gap-2 mt-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                            <p className="text-xs font-black text-emerald-500 uppercase">Synchronized</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-10 rounded-[40px] shadow-sm">
                <div className="flex items-center justify-between mb-8">
                    <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-3">
                       <Cpu size={18} className="text-emerald-500" /> System Capabilities
                    </h3>
                    <ExternalLink size={14} className="text-slate-700" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {['Identity Orchestration', 'Mainframe Library Sync', 'Full Registry Purge', 'Infrastructure Metrics', 'Core Configuration', 'API Stream Management'].map(cap => (
                        <div key={cap} className="flex items-center justify-between p-5 bg-slate-950 border border-slate-800/50 hover:border-emerald-500/30 transition-all rounded-3xl group cursor-default">
                            <span className="text-[12px] font-black text-slate-400 group-hover:text-emerald-400 transition-colors">{cap}</span>
                            <ChevronRight size={14} className="text-slate-800 group-hover:text-emerald-700" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
      </div>
    </div>
  )
}
