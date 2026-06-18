import React, { useState, useEffect } from 'react'
import {
  User as UserIcon,
  BookOpen,
  Heart,
  FileText,
  Settings as SettingsIcon,
  LogOut,
  ArrowUpRight,
  ShieldCheck
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { getProfile } from '@/api/authApi'
import { User } from '@/types'
import { useAuthStore } from '@/store/authStore'

type TabType = 'uploads' | 'favorites' | 'books';

export default function Profile(): React.JSX.Element {
  const authUser = useAuthStore((state) => state.user)
  const [activeTab, setActiveTab] = useState<TabType>('uploads')
  const [backendUser, setBackendUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getProfile()
        setBackendUser(userData)
      } catch (error) {
        console.error('Failed to fetch profile', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUser()
  }, [])

  const [imageError, setImageError] = useState(false)

  const user = backendUser
    ? {
        ...backendUser,
        avatar: backendUser.avatar || authUser?.photoURL || undefined,
        name: backendUser.name || authUser?.displayName || authUser?.email || 'User',
      }
    : authUser
    ? {
        id: 0,
        name: authUser.displayName || authUser.email || 'User',
        email: authUser.email || '',
        avatar: authUser.photoURL || undefined,
        role: 'student' as const,
        school: undefined,
        university: undefined,
        major: undefined,
        bio: undefined,
        followers_count: 0,
        following_count: 0,
        documents_count: 0,
      }
    : null

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto py-20 px-4 text-center">
        <div className="animate-spin w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-slate-400 dark:text-gray-500 font-bold uppercase tracking-widest text-xs">Loading Profile...</p>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto py-20 px-4 text-center">
        <p className="text-slate-600 dark:text-gray-400 font-bold">Please log in to view your profile.</p>
      </div>
    )
  }

  const initials = user.name
    ? user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
    : 'U'

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8 font-sans text-slate-800 dark:text-gray-200 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom duration-500">

      {/* ================= PROFILE HEADER ================= */}
      <div className="bg-white dark:bg-gray-900 rounded-[32px] shadow-sm border border-slate-100 dark:border-gray-800 overflow-hidden mb-8">
        {/* Deep Dark Banner */}
        <div className="h-48 bg-[#0b1329] relative">
          <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl" />
        </div>

        <div className="px-6 sm:px-10 pb-10">
          <div className="relative flex flex-col md:flex-row items-end md:items-center gap-6 -mt-16 mb-8">
            {/* Avatar */}
            <div className="w-32 h-32 rounded-full border-4 border-white dark:border-gray-900 bg-[#0b1329] shadow-lg flex items-center justify-center text-4xl font-black text-teal-400 shrink-0 transform transition-transform duration-300 hover:scale-105 overflow-hidden select-none">
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

            {/* Name & Title */}
            <div className="flex-grow pt-4 md:pt-16">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                  {user.name}
                </h1>
                <span className="bg-[#f0fdf4] dark:bg-emerald-500/10 text-[#16a34a] dark:text-emerald-400 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg border border-emerald-100 dark:border-emerald-500/20 flex items-center gap-1">
                  <ShieldCheck size={12} /> Verified Student
                </span>
              </div>
              <p className="text-[11px] text-slate-400 dark:text-gray-500 font-black uppercase tracking-widest mt-1.5">
                {user.school || user.university || 'Unspecified Education'} • {user.major || 'General Studies'}
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4 md:pt-16">
              <Link to="/profile/settings" className="px-6 py-2.5 rounded-xl border border-slate-200 dark:border-gray-700 font-black text-[10px] uppercase tracking-widest text-slate-600 dark:text-gray-400 hover:bg-slate-50 dark:hover:bg-gray-800 transition-all flex items-center gap-2">
                <SettingsIcon size={14} /> Edit Profile
              </Link>
            </div>
          </div>

          {/* Metrics Row */}
          <div className="flex flex-wrap gap-10 py-6 border-t border-slate-50 dark:border-gray-800">
            <div className="flex items-center gap-2.5 group cursor-pointer">
              <span className="font-black text-xl text-slate-900 dark:text-white group-hover:text-teal-500 transition-colors">
                {user.followers_count || 0}
              </span>
              <span className="text-slate-400 dark:text-gray-500 text-[10px] font-black uppercase tracking-widest">Followers</span>
            </div>
            <div className="flex items-center gap-2.5 group cursor-pointer">
              <span className="font-black text-xl text-slate-900 dark:text-white group-hover:text-teal-500 transition-colors">
                {user.following_count || 0}
              </span>
              <span className="text-slate-400 dark:text-gray-500 text-[10px] font-black uppercase tracking-widest">Following</span>
            </div>
            <div className="flex items-center gap-2.5 group cursor-pointer">
              <span className="font-black text-xl text-slate-900 dark:text-white group-hover:text-teal-500 transition-colors">
                {user.documents_count || 0}
              </span>
              <span className="text-slate-400 dark:text-gray-500 text-[10px] font-black uppercase tracking-widest">Uploads</span>
            </div>
          </div>

          {/* Bio */}
          <div className="pt-6 border-t border-slate-50 dark:border-gray-800">
            <h3 className="text-[10px] font-black text-slate-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-2.5">About Contributor</h3>
            <p className="text-slate-600 dark:text-gray-400 text-sm max-w-3xl leading-relaxed font-medium opacity-80">
              {user.bio || "This contributor hasn't added a bio yet. Stay tuned for updates on their academic journey!"}
            </p>
          </div>
        </div>
      </div>

      {/* ================= CONTENT SECTION ================= */}
      <div className="flex flex-col md:flex-row gap-8">

        {/* Sidebar Nav */}
        <aside className="w-full md:w-64 shrink-0">
          <div className="bg-white dark:bg-gray-900 p-4 rounded-[24px] border border-slate-100 dark:border-gray-800 shadow-sm space-y-1.5">
            <button
              onClick={() => setActiveTab('uploads')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${
                activeTab === 'uploads'
                  ? 'bg-teal-500/10 text-teal-600 dark:bg-teal-500/20 dark:text-teal-400'
                  : 'text-slate-400 dark:text-gray-500 hover:text-slate-600 dark:hover:text-gray-300 hover:bg-slate-50 dark:hover:bg-gray-800'
              }`}
            >
              <FileText size={16} />
              <span>My Uploads</span>
            </button>

            <button
              onClick={() => setActiveTab('favorites')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${
                activeTab === 'favorites'
                  ? 'bg-teal-500/10 text-teal-600 dark:bg-teal-500/20 dark:text-teal-400'
                  : 'text-slate-400 dark:text-gray-500 hover:text-slate-600 dark:hover:text-gray-300 hover:bg-slate-50 dark:hover:bg-gray-800'
              }`}
            >
              <Heart size={16} />
              <span>Favorites</span>
            </button>

            <button
              onClick={() => setActiveTab('books')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${
                activeTab === 'books'
                  ? 'bg-teal-500/10 text-teal-600 dark:bg-teal-500/20 dark:text-teal-400'
                  : 'text-slate-400 dark:text-gray-500 hover:text-slate-600 dark:hover:text-gray-300 hover:bg-slate-50 dark:hover:bg-gray-800'
              }`}
            >
              <BookOpen size={16} />
              <span>Saved Books</span>
            </button>

            <div className="pt-4 mt-4 border-t border-slate-100 dark:border-gray-800">
              <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-all duration-200">
                <LogOut size={16} />
                <span>Log Out</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-grow">
          <div className="bg-white dark:bg-gray-900 p-12 rounded-[24px] border border-slate-100 dark:border-gray-800 shadow-sm flex flex-col items-center justify-center min-h-[400px] text-center group">
            <div className="w-16 h-16 bg-slate-50 dark:bg-gray-800 border border-slate-100 dark:border-gray-700 rounded-2xl flex items-center justify-center text-slate-300 dark:text-gray-600 transform transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
              <FileText size={28} />
            </div>
            <h4 className="text-sm text-slate-900 dark:text-white font-black uppercase tracking-widest mb-2">No document assets mapped yet</h4>
            <p className="text-xs text-slate-400 dark:text-gray-500 max-w-xs font-medium leading-relaxed mb-8">
              Your catalogued item directory under the "<span className="capitalize text-teal-600 dark:text-teal-400">{activeTab}</span>" filter is currently empty.
            </p>

            <button className="inline-flex items-center gap-2 px-6 py-3 bg-teal-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-teal-600 transition-all shadow-lg shadow-teal-500/20 group/btn">
              <span>Upload first document</span>
              <ArrowUpRight size={14} className="transform transition-transform duration-300 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
            </button>
          </div>
        </main>

      </div>
    </div>
  )
}
