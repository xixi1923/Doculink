import React, { useState, useEffect, useRef } from 'react'
import {
  User,
  Shield,
  Lock,
  Loader2,
  Camera,
  CheckCircle2,
  AlertCircle
} from 'lucide-react'
import { getProfile, updateProfile, updateAvatar, changePasswordApi } from '@/api/authApi'
import { User as UserType } from '@/types'
import { useAuthStore } from '@/store/authStore'

export default function AdminSettings(): React.JSX.Element {
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const [imageError, setImageError] = useState(false)

  const [profile, setProfile] = useState<Partial<UserType>>({
    name: '',
    email: '',
    bio: '',
    school: '',
    university: '',
    major: ''
  })

  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    new_password_confirmation: ''
  })

  const fileInputRef = useRef<HTMLInputElement>(null)
  const { setAuth, token } = useAuthStore()

  useEffect(() => {
    const fetchProfile = async () => {
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
      } finally {
        setIsLoading(false)
      }
    }
    fetchProfile()
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

      if (token) {
        setAuth({
          uid: updatedUser.id.toString(),
          email: updatedUser.email,
          displayName: updatedUser.name,
          photoURL: updatedUser.avatar || null
        }, token)
      }

      setStatusMsg({ type: 'success', text: 'Admin identity updated successfully.' })
    } catch (error) {
      console.error('Failed to update admin profile', error)
      setStatusMsg({ type: 'error', text: 'Failed to update administrative records.' })
    } finally {
      setIsSaving(false)
    }
  }

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    if (passwordData.new_password !== passwordData.new_password_confirmation) {
      setStatusMsg({ type: 'error', text: 'New password confirmation mismatch.' })
      return
    }

    setIsSaving(true)
    try {
      await changePasswordApi(passwordData)
      setStatusMsg({ type: 'success', text: 'Security credentials updated.' })
      setPasswordData({
        current_password: '',
        new_password: '',
        new_password_confirmation: ''
      })
    } catch (error: any) {
      setStatusMsg({ type: 'error', text: error.response?.data?.message || 'Security update failed.' })
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
      setProfile(prev => ({ ...prev, avatar: response.url }))
      setImageError(false)

      if (token) {
        setAuth({
          uid: updatedUser.id.toString(),
          email: updatedUser.email,
          displayName: updatedUser.name,
          photoURL: response.url || null
        }, token)
      }
      setStatusMsg({ type: 'success', text: 'Administrative avatar updated.' })
    } catch (error) {
      console.error('Failed to upload avatar', error)
      setStatusMsg({ type: 'error', text: 'Avatar upload failed.' })
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="w-10 h-10 text-teal-500 animate-spin mb-4" />
        <p className="text-slate-400 font-black uppercase tracking-widest text-xs">Loading Security Console...</p>
      </div>
    )
  }

  const initials = profile.name
    ? profile.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
    : 'AD'

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Security & Identity</h1>
          <p className="text-slate-400 text-sm mt-1">Manage your administrative credentials and system persona.</p>
        </div>

        {statusMsg && (
          <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-[10px] font-black uppercase tracking-widest animate-in slide-in-from-right-4 duration-300 ${
            statusMsg.type === 'success' ? 'bg-teal-500/10 border-teal-500/20 text-teal-400' : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
          }`}>
            {statusMsg.type === 'success' ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
            {statusMsg.text}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column - Avatar & Core */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-center">
            <div className="relative inline-block mb-4 group">
              <div className="w-24 h-24 rounded-[32px] bg-slate-950 border-2 border-slate-800 flex items-center justify-center text-3xl font-black text-teal-500 shadow-2xl overflow-hidden">
                {profile.avatar && !imageError ? (
                  <img
                    src={profile.avatar}
                    alt={profile.name}
                    className="w-full h-full object-cover"
                    onError={() => setImageError(true)}
                  />
                ) : (
                  <span>{initials}</span>
                )}
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute -bottom-2 -right-2 p-2 bg-teal-500 text-slate-950 rounded-xl shadow-lg hover:scale-110 transition-transform"
              >
                <Camera size={14} />
              </button>
              <input type="file" ref={fileInputRef} onChange={handleAvatarChange} className="hidden" accept="image/*" />
            </div>
            <h3 className="text-white font-bold">{profile.name}</h3>
            <p className="text-teal-500 text-[10px] font-black uppercase tracking-widest mt-1">System Root Admin</p>
          </div>

          <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6">
            <div className="flex items-center gap-3 text-white mb-4">
              <Shield size={18} className="text-teal-500" />
              <h4 className="text-xs font-black uppercase tracking-widest">Admin Privacy</h4>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Your administrative actions are logged for security audits. Ensure your identity remains verified.
            </p>
          </div>
        </div>

        {/* Right Column - Forms */}
        <div className="md:col-span-2 space-y-6">
          {/* Identity Form */}
          <form onSubmit={handleProfileSave} className="bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-6">
            <div className="flex items-center gap-3 text-white">
              <User size={18} className="text-teal-500" />
              <h4 className="text-sm font-black uppercase tracking-widest">Administrative Identity</h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Full Name</label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile({...profile, name: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:border-teal-500/50 outline-none transition-colors"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Admin Email</label>
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({...profile, email: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:border-teal-500/50 outline-none transition-colors"
                />
              </div>
              <div className="sm:col-span-2 space-y-1.5">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Admin Bio / Role Description</label>
                <textarea
                  rows={3}
                  value={profile.bio}
                  onChange={(e) => setProfile({...profile, bio: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:border-teal-500/50 outline-none transition-colors resize-none"
                  placeholder="Describe your administrative focus..."
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSaving}
                className="px-8 py-3 bg-teal-500 text-slate-950 font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-teal-400 transition-all flex items-center gap-2"
              >
                {isSaving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                Sync Identity
              </button>
            </div>
          </form>

          {/* Security Form */}
          <form onSubmit={handlePasswordChange} className="bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-6">
            <div className="flex items-center gap-3 text-white">
              <Lock size={18} className="text-teal-500" />
              <h4 className="text-sm font-black uppercase tracking-widest">Access Key Rotation</h4>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Current Password</label>
                <input
                  type="password"
                  value={passwordData.current_password}
                  onChange={(e) => setPasswordData({...passwordData, current_password: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-teal-500/50"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">New Access Key</label>
                  <input
                    type="password"
                    value={passwordData.new_password}
                    onChange={(e) => setPasswordData({...passwordData, new_password: e.target.value})}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-teal-500/50"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Confirm New Key</label>
                  <input
                    type="password"
                    value={passwordData.new_password_confirmation}
                    onChange={(e) => setPasswordData({...passwordData, new_password_confirmation: e.target.value})}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-teal-500/50"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSaving}
                className="px-8 py-3 bg-slate-800 text-teal-500 border border-teal-500/20 font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-slate-700 transition-all flex items-center gap-2"
              >
                {isSaving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                Rotate Credentials
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
