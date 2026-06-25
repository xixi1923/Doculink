import React, { useState, useEffect, useRef } from 'react'
import {
  User,
  Shield,
  Lock,
  Loader2,
  Camera,
  CheckCircle2,
  AlertCircle,
  Key,
  Database,
  Fingerprint
} from 'lucide-react'
import { getProfile, updateProfile, updateAvatar, changePasswordApi } from '@/api/authApi'

export default function AdminSettings(): React.JSX.Element {
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const [imageError, setImageError] = useState(false)

  const [profile, setProfile] = useState<any>({
    name: '',
    email: '',
    bio: '',
    school: '',
    university: '',
    major: '',
    avatar: undefined
  })

  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    new_password_confirmation: ''
  })

  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const data = await getProfile()
        setProfile({
          name: data.name || '',
          email: data.email || '',
          bio: data.bio || '',
          school: data.school || '',
          university: data.university || '',
          major: data.major || '',
          avatar: data.avatar || undefined
        })
      } catch (error) {
        console.error('Failed to fetch admin profile', error)
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
           const data = JSON.parse(storedUser);
           setProfile({
            name: data.name || '',
            email: data.email || '',
            bio: data.bio || '',
            avatar: data.avatar || undefined
          });
        }
      } finally {
        setIsLoading(false)
      }
    }
    fetchProfileData()
  }, [])

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setStatusMsg(null)
    try {
      const response = await updateProfile(profile)
      const updatedUser = response.user
      setProfile({
        name: updatedUser.name || '',
        email: updatedUser.email || '',
        bio: updatedUser.bio || '',
        school: updatedUser.school || '',
        university: updatedUser.university || '',
        major: updatedUser.major || '',
        avatar: updatedUser.avatar || undefined
      })
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setStatusMsg({ type: 'success', text: 'Administrative identity nodes synchronized.' })
    } catch (error) {
      console.error('Failed to update admin profile', error)
      setStatusMsg({ type: 'error', text: 'Mainframe rejection. Check identity integrity.' })
    } finally {
      setIsSaving(false)
    }
  }

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    if (passwordData.new_password !== passwordData.new_password_confirmation) {
      setStatusMsg({ type: 'error', text: 'Access key confirmation mismatch.' })
      return
    }

    setIsSaving(true)
    try {
      await changePasswordApi(passwordData)
      setStatusMsg({ type: 'success', text: 'Security credentials rotated successfully.' })
      setPasswordData({ current_password: '', new_password: '', new_password_confirmation: '' })
    } catch (error: any) {
      setStatusMsg({ type: 'error', text: error.response?.data?.message || 'Access key rotation failed.' })
    } finally {
      setIsSaving(false)
    }
  }

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const formData = new FormData()
    formData.append('avatar', file)
    setIsSaving(true)
    try {
      const response = await updateAvatar(formData)
      const updatedUser = response.user
      setProfile((prev: any) => ({ ...prev, avatar: response.url }))
      setImageError(false)
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setStatusMsg({ type: 'success', text: 'Biometric visual node updated.' })
    } catch (error) {
      console.error('Failed to upload avatar', error)
      setStatusMsg({ type: 'error', text: 'Asset transmission failed.' })
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-4">
        <div className="w-10 h-10 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Accessing Security Console...</p>
      </div>
    )
  }

  const initials = profile.name
    ? profile.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase()
    : 'AD'

  return (
    <div className="space-y-10 animate-in fade-in zoom-in-95 duration-700 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tighter">Setting Protocol</h1>
          <p className="text-[14px] font-medium text-slate-500">Manage administrative identities and encryption access keys.</p>
        </div>

        {statusMsg && (
          <div className={`flex items-center gap-2.5 px-6 py-3 rounded-2xl border text-[10px] font-black uppercase tracking-widest animate-in slide-in-from-right-4 duration-300 shadow-xl ${
            statusMsg.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
          }`}>
            {statusMsg.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
            {statusMsg.text}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Avatar & Core */}
        <div className="lg:col-span-1 space-y-8">
          <div className="bg-slate-900 border border-slate-800 rounded-[40px] p-8 text-center shadow-2xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative inline-block mb-6">
              <div className="w-32 h-32 rounded-[40px] bg-slate-950 border-2 border-slate-800 flex items-center justify-center text-4xl font-black text-emerald-500 shadow-2xl overflow-hidden group-hover:border-emerald-500/30 transition-all duration-500">
                {profile.avatar && !imageError ? (
                  <img src={profile.avatar} alt={profile.name} className="w-full h-full object-cover" onError={() => setImageError(true)} />
                ) : (
                  <span>{initials}</span>
                )}
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute -bottom-2 -right-2 p-3 bg-emerald-600 text-slate-950 rounded-2xl shadow-xl hover:bg-emerald-500 transition-all active:scale-95 border border-emerald-400/30"
              >
                <Camera size={16} />
              </button>
              <input type="file" ref={fileInputRef} onChange={handleAvatarChange} className="hidden" accept="image/*" />
            </div>
            <h3 className="text-xl font-black text-white tracking-tight leading-none">{profile.name}</h3>
            <div className="mt-3 flex items-center justify-center gap-2">
               <Fingerprint size={12} className="text-emerald-500" />
               <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">System Root Admin</p>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-[40px] p-8 shadow-sm">
            <div className="flex items-center gap-3 text-white mb-6">
              <Shield size={20} className="text-emerald-500" />
              <h4 className="text-[11px] font-black uppercase tracking-widest">Privacy Directive</h4>
            </div>
            <p className="text-[12px] text-slate-500 leading-relaxed font-medium">
              Administrative actions are audited via immutable ledger. Node identity rotation is recommended every 90 days.
            </p>
            <div className="mt-8 pt-8 border-t border-slate-800 space-y-4">
                <div className="flex items-center gap-3">
                   <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                   <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">TLS 1.3 Active</span>
                </div>
                <div className="flex items-center gap-3">
                   <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                   <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">AES-256 Storage</span>
                </div>
            </div>
          </div>
        </div>

        {/* Right Column - Forms */}
        <div className="lg:col-span-2 space-y-8">
          {/* Identity Form */}
          <form onSubmit={handleProfileSave} className="bg-slate-900 border border-slate-800 rounded-[40px] p-10 space-y-8 shadow-2xl">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-white">
                  <Database size={20} className="text-emerald-500" />
                  <h4 className="text-[11px] font-black uppercase tracking-widest">Identity Node Metadata</h4>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-1">Official Name</label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile({...profile, name: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 text-[13px] font-black text-white outline-none focus:border-emerald-500/50 transition-all shadow-inner"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-1">Network Email</label>
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({...profile, email: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 text-[13px] font-black text-white outline-none focus:border-emerald-500/50 transition-all shadow-inner"
                />
              </div>
              <div className="sm:col-span-2 space-y-2">
                <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-1">Administrative Abstract (Bio)</label>
                <textarea
                  rows={4}
                  value={profile.bio}
                  onChange={(e) => setProfile({...profile, bio: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 text-[13px] font-medium text-slate-300 outline-none focus:border-emerald-500/50 transition-all resize-none shadow-inner"
                  placeholder="Summarize your administrative focus area..."
                />
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="submit"
                disabled={isSaving}
                className="px-10 py-4 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black text-[10px] uppercase tracking-widest rounded-2xl transition-all flex items-center gap-3 shadow-xl shadow-emerald-950/20 border border-emerald-400/30 active:scale-95 disabled:opacity-50"
              >
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Database size={16} />}
                Synchronize Identity
              </button>
            </div>
          </form>

          {/* Security Form */}
          <form onSubmit={handlePasswordChange} className="bg-slate-900 border border-slate-800 rounded-[40px] p-10 space-y-8 shadow-2xl">
            <div className="flex items-center gap-3 text-white">
              <Key size={20} className="text-emerald-500" />
              <h4 className="text-[11px] font-black uppercase tracking-widest">Access Key Rotation</h4>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-1">Current Password</label>
                <input
                  type="password"
                  value={passwordData.current_password}
                  onChange={(e) => setPasswordData({...passwordData, current_password: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 text-[13px] font-black text-white outline-none focus:border-emerald-500/50 shadow-inner"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-1">New Access Key</label>
                  <input
                    type="password"
                    value={passwordData.new_password}
                    onChange={(e) => setPasswordData({...passwordData, new_password: e.target.value})}
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 text-[13px] font-black text-white outline-none focus:border-emerald-500/50 shadow-inner"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-1">Confirm New Key</label>
                  <input
                    type="password"
                    value={passwordData.new_password_confirmation}
                    onChange={(e) => setPasswordData({...passwordData, new_password_confirmation: e.target.value})}
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 text-[13px] font-black text-white outline-none focus:border-emerald-500/50 shadow-inner"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="submit"
                disabled={isSaving}
                className="px-10 py-4 bg-slate-950 text-emerald-500 border border-emerald-500/30 font-black text-[10px] uppercase tracking-widest rounded-2xl hover:bg-slate-900 transition-all flex items-center gap-3 shadow-xl active:scale-95 disabled:opacity-50"
              >
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock size={16} />}
                Rotate Access Credentials
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
