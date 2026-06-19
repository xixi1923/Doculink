import React, { useState, useEffect } from 'react'
import {
  ShieldCheck,
  Settings as SettingsIcon,
  Mail,
  Calendar,
  User as UserIcon,
  Activity,
  Award,
  Clock
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { getProfile } from '@/api/authApi'
import { User } from '@/types'
import { useAuthStore } from '@/store/authStore'

export default function AdminProfile(): React.JSX.Element {
  const authUser = useAuthStore((state) => state.user)
  const [backendUser, setBackendUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [imageError, setImageError] = useState(false)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getProfile()
        setBackendUser(userData)
      } catch (error) {
        console.error('Failed to fetch admin profile', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUser()
  }, [])

  const user = backendUser || (authUser ? {
    id: 0,
    name: authUser.displayName || 'Administrator',
    email: authUser.email || '',
    role: 'admin' as const,
    avatar: authUser.photoURL || undefined,
  } : null)

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="animate-spin w-10 h-10 border-4 border-teal-500 border-t-transparent rounded-full mb-4"></div>
        <p className="text-slate-400 font-black uppercase tracking-widest text-xs">Accessing Secure Profile...</p>
      </div>
    )
  }

  if (!user) return null

  const initials = user.name
    ? user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
    : 'AD'

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header / Banner */}
      <div className="relative overflow-hidden rounded-[32px] bg-slate-950 border border-slate-800">
        <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-teal-500/5 rounded-full blur-2xl -ml-10 -mb-10"></div>

        <div className="relative p-8 md:p-12 flex flex-col md:flex-row gap-8 items-center md:items-start text-center md:text-left">
          {/* Avatar */}
          <div className="w-32 h-32 rounded-[40px] bg-slate-900 border-2 border-teal-500/30 flex items-center justify-center text-4xl font-black text-teal-400 shadow-2xl overflow-hidden shrink-0">
            {user.avatar && !imageError ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="w-full h-full object-cover"
                onError={() => setImageError(true)}
              />
            ) : (
              <span>{initials}</span>
            )}
          </div>

          <div className="flex-grow">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-2">
              <h1 className="text-3xl font-black text-white tracking-tight">{user.name}</h1>
              <span className="px-3 py-1 bg-teal-500/20 text-teal-300 text-[10px] font-black uppercase tracking-widest rounded-full border border-teal-500/30 flex items-center gap-1.5">
                <ShieldCheck size={12} /> System Administrator
              </span>
            </div>
            <p className="text-slate-400 text-sm font-medium mb-6 flex items-center justify-center md:justify-start gap-2">
              <Mail size={14} className="text-teal-500/60" /> {user.email}
            </p>

            <div className="flex flex-wrap justify-center md:justify-start gap-4">
              <Link
                to="/admin/settings"
                className="px-6 py-2.5 bg-teal-500 text-slate-950 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-teal-400 transition-all shadow-lg shadow-teal-500/20 flex items-center gap-2"
              >
                <SettingsIcon size={14} /> Edit Admin Profile
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Stats/Info */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-slate-900/50 rounded-3xl border border-slate-800 p-6">
            <h3 className="text-[10px] font-black text-teal-500 uppercase tracking-[0.2em] mb-4">System Stats</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider flex items-center gap-2">
                  <Activity size={14} className="text-teal-500" /> Activity Rank
                </span>
                <span className="text-sm font-black text-white">Legend</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider flex items-center gap-2">
                  <Clock size={14} className="text-teal-500" /> Joined
                </span>
                <span className="text-sm font-black text-white">Oct 2023</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider flex items-center gap-2">
                  <Award size={14} className="text-teal-500" /> Access
                </span>
                <span className="text-sm font-black text-white">Root Level</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-900/50 rounded-3xl border border-slate-800 p-6">
            <h3 className="text-[10px] font-black text-teal-500 uppercase tracking-[0.2em] mb-4">Admin Permissions</h3>
            <div className="flex flex-wrap gap-2">
              {['User Control', 'System Analytics', 'Asset Moderation', 'Audit Logs', 'API Access'].map(tag => (
                <span key={tag} className="px-3 py-1 bg-slate-800 text-slate-300 text-[9px] font-black uppercase tracking-wider rounded-lg border border-slate-700">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right Content */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-slate-900/50 rounded-3xl border border-slate-800 p-8">
            <h3 className="text-sm font-black text-white uppercase tracking-widest mb-4">Biography</h3>
            <p className="text-slate-400 text-sm leading-relaxed font-medium">
              {user.bio || "No biography provided. As a system administrator, your profile oversees the entire DocuLink ecosystem, ensuring data integrity and platform security for all students and contributors."}
            </p>
          </div>

          <div className="bg-slate-900/50 rounded-3xl border border-slate-800 p-8">
            <h3 className="text-sm font-black text-white uppercase tracking-widest mb-6">Security Overview</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-500 flex items-center justify-center">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Two-Factor Auth</p>
                  <p className="text-xs font-bold text-teal-400">Enabled & Secured</p>
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-500 flex items-center justify-center">
                  <Clock size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Last Access</p>
                  <p className="text-xs font-bold text-white">2 minutes ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
