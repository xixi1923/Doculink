import React, { useState, useEffect, useRef } from 'react'
import {
  User,
  Lock,
  Eye,
  Globe,
  Trash2,
  ShieldAlert,
  BookOpen,
  Loader2,
  Sliders,
  AtSign,
  Facebook,
  Instagram,
  Link as LinkIcon,
  MapPin,
  GraduationCap,
  Music2,
  CheckCircle2,
  X
} from 'lucide-react'
import { getProfile, updateProfile, updateAvatar, changePasswordApi, deleteAccountApi, getUniversities } from '@/api/authApi'
import { User as UserType } from '@/types'
import { useAuthStore } from '@/store/authStore'

type SettingsTab = 'edit-profile' | 'account-security';

export default function Settings(): React.JSX.Element {
  const [activeTab, setActiveTab] = useState<SettingsTab>('edit-profile')
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [imageError, setImageError] = useState(false)
  const [profile, setProfile] = useState<Partial<any>>({
    name: '',
    username: '',
    email: '',
    bio: '',
    school: '',
    university_id: '',
    major: '',
    affiliation: '',
    country: '',
    academic_title: '',
    research_interests: '',
    social_links: {
      facebook: '',
      instagram: '',
      tiktok: '',
      website: ''
    }
  })
  const [universities, setUniversities] = useState<any[]>([])
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    new_password_confirmation: ''
  })
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { setAuth, token, logout } = useAuthStore()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileData, univsData] = await Promise.all([
          getProfile(),
          getUniversities()
        ])
        const user = profileData.user || profileData
        setProfile({
          name: user.name || '',
          username: user.username || '',
          email: user.email || '',
          bio: user.bio || '',
          school: user.school || '',
          university_id: user.university_id || '',
          major: user.major || '',
          affiliation: user.affiliation || '',
          country: user.country || '',
          academic_title: user.academic_title || '',
          research_interests: Array.isArray(user.research_interests) ? user.research_interests.join(', ') : '',
          social_links: {
            facebook: user.social_links?.facebook || '',
            instagram: user.social_links?.instagram || '',
            tiktok: user.social_links?.tiktok || '',
            website: user.social_links?.website || ''
          },
          avatar: user.avatar || undefined
        })
        setUniversities(univsData)

        // Sync with Auth Store to keep header updated
        if (token && user) {
          setAuth({
            ...user,
            id: user.id,
            name: user.name,
            email: user.email,
            avatar: user.avatar
          }, token)
        }
      } catch (error) {
        console.error('Failed to fetch profile', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  const handleSave = async () => {
    setIsSaving(true)
    setSaveSuccess(false)
    try {
      const payload = {
        ...profile,
        research_interests: profile.research_interests.split(',').map((s: string) => s.trim()).filter((s: string) => s !== '')
      }
      const response = await updateProfile(payload)
      const updatedUser = response.user

      setProfile({
        name: updatedUser.name || '',
        username: updatedUser.username || '',
        email: updatedUser.email || '',
        bio: updatedUser.bio || '',
        school: updatedUser.school || '',
        university_id: updatedUser.university_id || '',
        major: updatedUser.major || '',
        affiliation: updatedUser.affiliation || '',
        country: updatedUser.country || '',
        academic_title: updatedUser.academic_title || '',
        research_interests: Array.isArray(updatedUser.research_interests) ? updatedUser.research_interests.join(', ') : '',
        social_links: {
          facebook: updatedUser.social_links?.facebook || '',
          instagram: updatedUser.social_links?.instagram || '',
          tiktok: updatedUser.social_links?.tiktok || '',
          website: updatedUser.social_links?.website || ''
        },
        avatar: updatedUser.avatar || undefined
      })

      if (token && updatedUser) {
        setAuth({
          ...updatedUser,
          id: updatedUser.id,
          name: updatedUser.name || profile.name,
          email: updatedUser.email || profile.email,
          avatar: updatedUser.avatar
        }, token)
      }

      setSaveSuccess(true)
      setShowSuccessModal(true)
      setTimeout(() => setSaveSuccess(false), 3000)
    } catch (error: any) {
      console.error('Failed to update profile', error)
      alert(error.response?.data?.message || 'There was a problem saving your data!')
    } finally {
      setIsSaving(false)
    }
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (passwordData.new_password !== passwordData.new_password_confirmation) {
      alert('New passwords do not match!')
      return
    }

    setIsSaving(true)
    try {
      await changePasswordApi(passwordData)
      alert('Password has been changed successfully!')
      setPasswordData({
        current_password: '',
        new_password: '',
        new_password_confirmation: ''
      })
      setIsChangingPassword(false)
    } catch (error: any) {
      alert(error.response?.data?.message || 'Password change failed!')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm('Are you sure you want to delete this account? All data will be lost forever!')
    if (!confirmed) return

    setIsSaving(true)
    try {
      await deleteAccountApi()
      alert('Your account has been deleted!')
      logout()
      window.location.href = '/'
    } catch (error) {
      console.error('Failed to delete account', error)
      alert('Account deletion failed!')
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

      if (token && updatedUser) {
        setAuth({
          ...updatedUser,
          id: updatedUser.id,
          name: updatedUser.name || profile.name,
          email: updatedUser.email || profile.email,
          avatar: response.url || updatedUser.avatar
        }, token)
      }
    } catch (error: any) {
      console.error('Failed to upload avatar', error.response?.data || error.message)
      alert(`Avatar upload failed: ${error.response?.data?.message || error.message}`)
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-6 h-6 text-teal-600 animate-spin" />
      </div>
    )
  }

  const initials = profile.name
    ? profile.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase()
    : 'U'

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 font-sans text-slate-800 dark:text-slate-200">

      {/* ================= HEADER CONTROLS TABS ================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-gray-800 pb-4 mb-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-teal-50 dark:bg-teal-950/40 flex items-center justify-center text-teal-600">
            <Sliders size={16} />
          </div>
          <div>
            <h1 className="text-base font-semibold text-slate-900 dark:text-white">Workspace Configuration</h1>
            <p className="text-[11px] text-slate-400">Manage your identity layout definitions and parameters</p>
          </div>
        </div>

        {/* Tab Interaction Switches */}
        <div className="flex bg-slate-100 dark:bg-gray-800 p-1 rounded-lg self-start sm:self-center">
          <button
            onClick={() => setActiveTab('edit-profile')}
            className={`px-3 py-1.5 rounded text-xs font-medium transition-colors flex items-center gap-2 ${
              activeTab === 'edit-profile'
                ? 'bg-white dark:bg-gray-900 text-teal-600 shadow-xs'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800'
            }`}
          >
            <User size={14} />
            Edit Profile
          </button>
          <button
            onClick={() => setActiveTab('account-security')}
            className={`px-3 py-1.5 rounded text-xs font-medium transition-colors flex items-center gap-2 ${
              activeTab === 'account-security'
                ? 'bg-white dark:bg-gray-900 text-teal-600 shadow-xs'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800'
            }`}
          >
            <Lock size={14} />
            Account Security
          </button>
        </div>
      </div>

      {/* ================= INTERACTION SEGMENTS RENDERING ================= */}
      {activeTab === 'edit-profile' ? (
        <div className="space-y-6 animate-in fade-in duration-150">
          {/* Academia.edu Style Header Banner */}
          <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-xl p-6 shadow-xs flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
            <div className="flex flex-col md:flex-row items-center gap-4 text-center md:text-left">
              <div className="relative w-20 h-20 rounded-full bg-slate-50 border border-slate-200 dark:border-gray-700 flex items-center justify-center text-teal-600 text-xl font-semibold overflow-hidden shrink-0 shadow-inner">
                {profile.avatar && !imageError ? (
                  <img src={profile.avatar} alt={profile.name} className="w-full h-full object-cover" onError={() => setImageError(true)} />
                ) : (
                  <span>{initials}</span>
                )}
              </div>
              <div>
                <h1 className="text-base font-bold text-slate-900 dark:text-white">{profile.name || 'Scholar Account'}</h1>
                <p className="text-xs text-slate-400">{profile.university || profile.school || 'No Affiliation Linked'}</p>
                <div className="mt-2.5">
                  <input type="file" ref={fileInputRef} onChange={handleAvatarChange} accept="image/*" className="hidden" />
                  <button onClick={() => fileInputRef.current?.click()} className="px-2.5 py-1.5 border border-slate-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:bg-slate-50 rounded text-[11px] font-medium transition-colors">
                    Change Photo
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {saveSuccess && <span className="text-xs text-green-600 font-medium animate-pulse">Changes Saved</span>}
              <button onClick={handleSave} disabled={isSaving} className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded text-xs font-medium transition-colors flex items-center gap-2">
                {isSaving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                Save Profile
              </button>
            </div>
          </div>

          {/* Personal Info */}
          <section className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-xl p-6 shadow-xs">
            <div className="flex items-center gap-2 mb-4 border-b border-slate-100 dark:border-gray-800 pb-2.5">
              <User size={15} className="text-slate-400" />
              <h2 className="text-xs font-semibold text-slate-900 dark:text-white">Personal Information</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[11px] font-medium text-slate-400">Full Display Name</label>
                <input type="text" value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} className="w-full bg-slate-50 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded px-3 py-2 text-xs text-slate-800 dark:text-white outline-none focus:border-teal-600" />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-medium text-slate-400">Username (@)</label>
                <div className="relative">
                  <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={12} />
                  <input type="text" value={profile.username} onChange={(e) => setProfile({ ...profile, username: e.target.value })} className="w-full bg-slate-50 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded pl-8 pr-3 py-2 text-xs text-slate-800 dark:text-white outline-none focus:border-teal-600" placeholder="unique_username" />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-medium text-slate-400">Email Address</label>
                <input type="email" value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} className="w-full bg-slate-50 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded px-3 py-2 text-xs text-slate-800 dark:text-white outline-none focus:border-teal-600" />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-medium text-slate-400">Country / Region</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={12} />
                  <input type="text" value={profile.country} onChange={(e) => setProfile({ ...profile, country: e.target.value })} className="w-full bg-slate-50 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded pl-8 pr-3 py-2 text-xs text-slate-800 dark:text-white outline-none focus:border-teal-600" placeholder="e.g. Cambodia" />
                </div>
              </div>
              <div className="md:col-span-2 space-y-1">
                <label className="text-[11px] font-medium text-slate-400">Biography</label>
                <textarea rows={3} value={profile.bio} onChange={(e) => setProfile({ ...profile, bio: e.target.value })} placeholder="Tell us about yourself..." className="w-full bg-slate-50 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded px-3 py-2 text-xs text-slate-800 dark:text-white outline-none focus:border-teal-600 resize-none" />
              </div>
              <div className="md:col-span-2 space-y-1">
                <label className="text-[11px] font-medium text-slate-400">Research Interests (Comma separated)</label>
                <input type="text" value={profile.research_interests} onChange={(e) => setProfile({ ...profile, research_interests: e.target.value })} placeholder="e.g. Machine Learning, Physics, History" className="w-full bg-slate-50 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded px-3 py-2 text-xs text-slate-800 dark:text-white outline-none focus:border-teal-600" />
              </div>
            </div>
          </section>

          {/* Education Context Block */}
          <section className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-xl p-6 shadow-xs">
            <div className="flex items-center gap-2 mb-4 border-b border-slate-100 dark:border-gray-800 pb-2.5">
              <BookOpen size={15} className="text-slate-400" />
              <h2 className="text-xs font-semibold text-slate-900 dark:text-white">Education & Affiliations</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[11px] font-medium text-slate-400">University Affiliation</label>
                <select
                  value={profile.university_id}
                  onChange={(e) => setProfile({ ...profile, university_id: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded px-3 py-2 text-xs text-slate-800 dark:text-white outline-none focus:border-teal-600"
                >
                  <option value="">Select University</option>
                  {universities.map((u: any) => (
                    <option key={u.id} value={u.id}>{u.name}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-medium text-slate-400">Custom Affiliation (if not in list)</label>
                <input type="text" placeholder="e.g. Research Institute" value={profile.affiliation} onChange={(e) => setProfile({ ...profile, affiliation: e.target.value })} className="w-full bg-slate-50 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded px-3 py-2 text-xs text-slate-800 dark:text-white outline-none focus:border-teal-600" />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-medium text-slate-400">Academic Title</label>
                <div className="relative">
                  <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={12} />
                  <input type="text" placeholder="e.g. PhD Candidate, Professor" value={profile.academic_title} onChange={(e) => setProfile({ ...profile, academic_title: e.target.value })} className="w-full bg-slate-50 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded pl-8 pr-3 py-2 text-xs text-slate-800 dark:text-white outline-none focus:border-teal-600" />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-medium text-slate-400">Major / Field of Study</label>
                <input type="text" placeholder="e.g. Computer Science" value={profile.major} onChange={(e) => setProfile({ ...profile, major: e.target.value })} className="w-full bg-slate-50 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded px-3 py-2 text-xs text-slate-800 dark:text-white outline-none focus:border-teal-600" />
              </div>
            </div>
          </section>

          {/* Social Links */}
          <section className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-xl p-6 shadow-xs">
            <div className="flex items-center gap-2 mb-4 border-b border-slate-100 dark:border-gray-800 pb-2.5">
              <Globe size={15} className="text-slate-400" />
              <h2 className="text-xs font-semibold text-slate-900 dark:text-white">Social Presence</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[11px] font-medium text-slate-400 flex items-center gap-1"><Facebook size={10}/> Facebook URL</label>
                <input type="url" value={profile.social_links.facebook} onChange={(e) => setProfile({ ...profile, social_links: {...profile.social_links, facebook: e.target.value} })} className="w-full bg-slate-50 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded px-3 py-2 text-xs text-slate-800 dark:text-white outline-none focus:border-teal-600" placeholder="https://facebook.com/username" />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-medium text-slate-400 flex items-center gap-1"><Instagram size={10}/> Instagram URL</label>
                <input type="url" value={profile.social_links.instagram} onChange={(e) => setProfile({ ...profile, social_links: {...profile.social_links, instagram: e.target.value} })} className="w-full bg-slate-50 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded px-3 py-2 text-xs text-slate-800 dark:text-white outline-none focus:border-teal-600" placeholder="https://instagram.com/username" />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-medium text-slate-400 flex items-center gap-1"><Music2 size={10}/> TikTok URL</label>
                <input type="url" value={profile.social_links.tiktok} onChange={(e) => setProfile({ ...profile, social_links: {...profile.social_links, tiktok: e.target.value} })} className="w-full bg-slate-50 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded px-3 py-2 text-xs text-slate-800 dark:text-white outline-none focus:border-teal-600" placeholder="https://tiktok.com/@username" />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-medium text-slate-400 flex items-center gap-1"><LinkIcon size={10}/> Personal Website</label>
                <input type="url" value={profile.social_links.website} onChange={(e) => setProfile({ ...profile, social_links: {...profile.social_links, website: e.target.value} })} className="w-full bg-slate-50 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded px-3 py-2 text-xs text-slate-800 dark:text-white outline-none focus:border-teal-600" placeholder="https://yourwebsite.com" />
              </div>
            </div>
          </section>
        </div>
      ) : (
        /* ACCOUNT SECURITY AND PRIVACY WRAPPER PANEL */
        <div className="space-y-6 animate-in fade-in duration-150">

          {/* Security Management Credentials */}
          <section className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-xl p-6 shadow-xs">
            <div className="flex items-center gap-2 mb-4 border-b border-slate-100 dark:border-gray-800 pb-2.5">
              <Lock size={15} className="text-slate-400" />
              <h2 className="text-xs font-semibold text-slate-900 dark:text-white">Security Credentials</h2>
            </div>

            {!isChangingPassword ? (
              <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-gray-800/40 border border-slate-200 dark:border-gray-700 rounded">
                <div>
                  <h4 className="text-xs font-semibold text-slate-900 dark:text-white">Modify Master Password</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">Keep your repository account safe by updating your login validation keys.</p>
                </div>
                <button type="button" onClick={() => setIsChangingPassword(true)} className="px-3 py-1.5 border border-slate-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded text-xs font-medium hover:bg-slate-50">
                  Change Password
                </button>
              </div>
            ) : (
              <form onSubmit={handleChangePassword} className="border border-slate-200 dark:border-gray-700 rounded p-4 space-y-4 bg-slate-50/50 dark:bg-gray-800/20">
                <div className="flex justify-between items-center">
                  <h4 className="text-xs font-semibold text-slate-900 dark:text-white">Modify Master Password</h4>
                  <button type="button" onClick={() => setIsChangingPassword(false)} className="text-xs text-slate-400 hover:text-rose-600 font-medium">Cancel</button>
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-medium text-slate-400">Current Password</label>
                  <input type="password" required value={passwordData.current_password} onChange={(e) => setPasswordData({...passwordData, current_password: e.target.value})} className="w-full bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded px-3 py-1.5 text-xs outline-none focus:border-teal-600" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[11px] font-medium text-slate-400">New Password</label>
                    <input type="password" required value={passwordData.new_password} onChange={(e) => setPasswordData({...passwordData, new_password: e.target.value})} className="w-full bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded px-3 py-1.5 text-xs outline-none focus:border-teal-600" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-medium text-slate-400">Confirm New Password</label>
                    <input type="password" required value={passwordData.new_password_confirmation} onChange={(e) => setPasswordData({...passwordData, new_password_confirmation: e.target.value})} className="w-full bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded px-3 py-1.5 text-xs outline-none focus:border-teal-600" />
                  </div>
                </div>
                <button type="submit" disabled={isSaving} className="px-4 py-2 bg-teal-600 text-white font-medium text-xs rounded hover:bg-teal-700 transition-colors flex items-center justify-center gap-2">
                  {isSaving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  Update Access Key
                </button>
              </form>
            )}
          </section>

          {/* Privacy Parameters */}
          <section className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-xl p-6 shadow-xs">
            <div className="flex items-center gap-2 mb-4 border-b border-slate-100 dark:border-gray-800 pb-2.5">
              <Eye size={15} className="text-slate-400" />
              <h2 className="text-xs font-semibold text-slate-900 dark:text-white">Privacy & Index Discovery</h2>
            </div>
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-slate-50 dark:bg-gray-800/40 rounded border border-slate-100 dark:border-gray-800">
                <div>
                  <h4 className="text-xs font-semibold text-slate-900 dark:text-white">Workspace Visibility Matrix</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">Control who can discover your tracking indices and public catalogs.</p>
                </div>
                <select className="bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded text-xs px-3 py-1.5 outline-none focus:border-teal-600">
                  <option>Public (All Users)</option>
                  <option>Verified Colleagues Only</option>
                  <option>Private Workspace</option>
                </select>
              </div>

              <div className="flex items-center justify-between gap-4 p-4 bg-slate-50 dark:bg-gray-800/40 rounded border border-slate-100 dark:border-gray-800">
                <div>
                  <h4 className="text-xs font-semibold text-slate-900 dark:text-white">External Engine Indexing</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">Allow public web search tools to catalogue your shared academic files.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-9 h-5 bg-slate-200 dark:bg-gray-700 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-teal-600" />
                </label>
              </div>
            </div>
          </section>

          {/* Account Lifecycle Termination (Danger Zone) */}
          <section className="bg-white dark:bg-gray-900 border border-rose-200 dark:border-rose-950/40 rounded-xl p-6 shadow-xs">
            <div className="flex items-center gap-2 mb-3 border-b border-rose-50 dark:border-rose-950/10 pb-2.5">
              <Trash2 size={15} className="text-rose-500" />
              <h2 className="text-xs font-semibold text-rose-500">Danger Zone</h2>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h4 className="text-xs font-semibold text-slate-900 dark:text-white">Delete Account Repository Record</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">Permanently tear down your file tracking keys, logs, and storage assets. This action cannot be reversed.</p>
              </div>
              <button onClick={handleDeleteAccount} disabled={isSaving} className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded text-xs font-medium transition-colors shrink-0 shadow-xs">
                Delete Account
              </button>
            </div>
          </section>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] p-8 max-w-sm w-full shadow-2xl border border-slate-100 dark:border-gray-800 animate-in zoom-in-95 duration-300 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-teal-500/10 rounded-full blur-3xl" />

            <button
                onClick={() => setShowSuccessModal(false)}
                className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-600 transition-colors"
            >
                <X size={20} />
            </button>

            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-teal-50 dark:bg-teal-500/10 rounded-[2rem] flex items-center justify-center text-teal-600 mb-6 shadow-inner">
                <CheckCircle2 size={40} />
              </div>

              <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">Update Successful</h3>
              <p className="text-sm text-slate-500 dark:text-gray-400 font-medium leading-relaxed mb-8">
                Your scholar profile identity has been successfully synchronized with the DocuLink mainframe.
              </p>

              <button
                onClick={() => setShowSuccessModal(false)}
                className="w-full py-4 bg-teal-600 hover:bg-teal-700 text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] transition-all shadow-lg shadow-teal-500/20"
              >
                Return to Workspace
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
