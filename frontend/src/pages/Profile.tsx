import React, { useState, useEffect } from 'react'
import {
  BookOpen,
  Heart,
  FileText,
  Settings as SettingsIcon,
  LogOut,
  ArrowUpRight,
  ShieldCheck,
  Download,
  Upload
} from 'lucide-react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { getProfile, getUserProfile } from '@/api/authApi'
import { useAuthStore } from '@/store/authStore'
import { useFollow } from '@/hooks/useFollow'
import FollowButton from '@/components/FollowButton'

type TabType = 'uploads' | 'fav_docs' | 'fav_books';

export default function Profile(): React.JSX.Element {
  const { user: currentUser, logout } = useAuthStore()
  const { id: userId } = useParams()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<TabType>('uploads')
  const [profileData, setProfileData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { relationship, loading: relationshipLoading } = useFollow(userId)

  const getDocumentImage = (id: number) => {
    const images = [
      'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=400',
      'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=400',
      'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=400',
      'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=400',
    ]
    return images[id % images.length]
  }

  useEffect(() => {
    fetchData()
  }, [userId])

  const fetchData = async () => {
    setIsLoading(true)
    try {
      const data = userId ? await getUserProfile(userId) : await getProfile()
      setProfileData(data)
    } catch (error) {
      console.error('Failed to fetch profile', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto py-20 px-4 text-center">
        <div className="animate-spin w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-slate-400 dark:text-gray-500 font-bold uppercase tracking-widest text-xs">Accessing Workspace...</p>
      </div>
    )
  }

  if (!profileData) {
    return (
      <div className="max-w-7xl mx-auto py-20 px-4 text-center">
        <p className="text-slate-600 dark:text-gray-400 font-bold">Please log in to view your profile.</p>
      </div>
    )
  }

  const { user, stats } = profileData
  const initials = user.name ? user.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase() : 'U'

  // Use relationship stats if available, otherwise fall back to profile stats
  const displayFollowersCount = relationship?.followers_count ?? stats?.followers_count ?? 0
  const displayFollowingCount = relationship?.following_count ?? stats?.following_count ?? 0

  // Filter content based on active tab
  const getTabContent = () => {
    if (activeTab === 'uploads') {
      const docs = user.documents || []
      const books = user.books || []
      return [...docs, ...books].sort((a: any, b: any) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      )
    }
    if (activeTab === 'fav_docs') return user.favorites?.filter((f: any) => f.document_id).map((f: any) => f.document) || []
    if (activeTab === 'fav_books') return user.favorites?.filter((f: any) => f.book_id).map((f: any) => f.book) || []
    return []
  }

  const currentItems = getTabContent()

  // Filter tabs based on whether it's the current user or someone else
  const tabs = userId && Number(userId) !== currentUser?.id
    ? [{ id: 'uploads', label: 'Contributions', icon: Upload }]
    : [
        { id: 'uploads', label: 'My Uploads', icon: Upload },
        { id: 'fav_docs', label: 'Saved Documents', icon: FileText },
        { id: 'fav_books', label: 'Saved Books', icon: BookOpen },
      ];

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8 font-sans text-slate-800 dark:text-gray-200 animate-in fade-in slide-in-from-bottom duration-500">

      {/* ================= PROFILE HEADER ================= */}
      <div className="bg-white dark:bg-gray-900 rounded-[32px] shadow-sm border border-slate-100 dark:border-gray-800 overflow-hidden mb-8">
        <div className="h-40 bg-[#0b1329] relative">
          <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl" />
        </div>

        <div className="px-6 sm:px-10 pb-10">
          <div className="relative flex flex-col md:flex-row items-end md:items-center gap-6 -mt-12 mb-8">
            {/* Avatar */}
            <div className="w-24 h-24 rounded-3xl border-4 border-white dark:border-gray-900 bg-slate-100 dark:bg-slate-800 shadow-lg flex items-center justify-center text-3xl font-black text-teal-600 shrink-0 overflow-hidden">
              {user.avatar ? <img src={user.avatar} className="w-full h-full object-cover" alt="" crossOrigin="anonymous" /> : <span>{initials}</span>}
            </div>

            {/* Name & Title */}
            <div className="flex-grow pt-4">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">{user.name}</h1>
                <span className="bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg border border-emerald-100 dark:border-emerald-500/20 flex items-center gap-1">
                  <ShieldCheck size={12} /> Verified {user.role}
                </span>
              </div>
              <p className="text-[10px] text-slate-400 dark:text-gray-500 font-black uppercase tracking-widest mt-1.5">
                {user.university?.name || 'Academic Institution Not Set'} • {user.major || 'Field of Study Not Set'}
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              {!userId || Number(userId) === currentUser?.id ? (
                <Link to="/profile/settings" className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-gray-700 font-black text-[10px] uppercase tracking-widest text-slate-600 dark:text-gray-400 hover:bg-slate-50 dark:hover:bg-gray-800 transition-all flex items-center gap-2">
                  <SettingsIcon size={14} /> Settings
                </Link>
              ) : (
                <>
                  <FollowButton userId={userId || ''} userName={user.name} variant="primary" />
                  <Link to={`/messages?user=${userId}`} className="px-5 py-2.5 rounded-xl border border-teal-500 text-teal-500 font-black text-[10px] uppercase tracking-widest hover:bg-teal-500/5 transition-all">
                    Message
                  </Link>
                </>
              )}
            </div>
          </div>

            <div className="flex gap-10 py-6 border-t border-slate-50 dark:border-gray-800">
            <div className="flex items-center gap-2.5">
              <span className="font-black text-xl text-slate-900 dark:text-white">{stats.total_uploads}</span>
              <span className="text-slate-400 dark:text-gray-500 text-[10px] font-black uppercase tracking-widest">Total Uploads</span>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="font-black text-xl text-slate-900 dark:text-white">{stats.total_downloads}</span>
              <span className="text-slate-400 dark:text-gray-500 text-[10px] font-black uppercase tracking-widest">Total Downloads</span>
            </div>
            {userId && (
              <>
                <div className="flex items-center gap-2.5">
                  <span className="font-black text-xl text-slate-900 dark:text-white">{displayFollowersCount}</span>
                  <span className="text-slate-400 dark:text-gray-500 text-[10px] font-black uppercase tracking-widest">Followers</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="font-black text-xl text-slate-900 dark:text-white">{displayFollowingCount}</span>
                  <span className="text-slate-400 dark:text-gray-500 text-[10px] font-black uppercase tracking-widest">Following</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Nav */}
        <aside className="w-full md:w-64 shrink-0">
          <div className="bg-white dark:bg-gray-900 p-3 rounded-[28px] border border-slate-100 dark:border-gray-800 shadow-sm space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  activeTab === tab.id
                    ? 'bg-teal-500/10 text-teal-600 dark:text-teal-400'
                    : 'text-slate-400 dark:text-gray-500 hover:bg-slate-50 dark:hover:bg-gray-800'
                }`}
              >
                <tab.icon size={16} />
                <span>{tab.label}</span>
              </button>
            ))}

            {(!userId || Number(userId) === currentUser?.id) && (
              <div className="pt-4 mt-4 border-t border-slate-50 dark:border-gray-800">
                <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-all">
                  <LogOut size={16} />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-grow">
          <div className="bg-white dark:bg-gray-900 p-8 rounded-[32px] border border-slate-100 dark:border-gray-800 shadow-sm min-h-[400px]">
            {currentItems.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {currentItems.map((item: any) => {
                  const isBookItem = activeTab === 'fav_books' || (activeTab === 'uploads' && 'author' in item)
                  return (
                    <Link
                      to={`/${isBookItem ? 'books' : 'documents'}/${item.id}`}
                      key={item.id}
                      className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-transparent hover:border-teal-500/30 transition-all flex items-center gap-4 group"
                    >
                      <div className="w-14 h-14 rounded-xl bg-white dark:bg-gray-800 overflow-hidden flex items-center justify-center text-teal-600 shrink-0 border border-slate-100 dark:border-gray-700">
                        {item.cover_image || item.thumbnail ? (
                          <img src={item.cover_image || item.thumbnail} className="w-full h-full object-cover" alt="" />
                        ) : (
                          <img src={getDocumentImage(item.id)} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" alt="" />
                        )}
                      </div>
                      <div className="min-w-0 flex-grow">
                        <div className="flex items-center justify-between gap-2">
                           <h4 className="font-bold text-sm text-slate-900 dark:text-white truncate group-hover:text-teal-600 transition-colors">{item.title}</h4>
                           <span className="shrink-0 text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-slate-400">
                             {isBookItem ? 'Book' : 'Doc'}
                           </span>
                        </div>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">
                          {isBookItem ? `By ${item.author}` : `${item.view_count || 0} Views`}
                        </p>
                      </div>
                    </Link>
                  )
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full py-12 text-center">
                <div className="w-16 h-16 bg-slate-50 dark:bg-gray-800 rounded-2xl flex items-center justify-center text-slate-300 mb-4">
                   {activeTab === 'uploads' ? <Upload size={28} /> : <Heart size={28} />}
                </div>
                <h4 className="text-sm text-slate-900 dark:text-white font-black uppercase tracking-widest mb-1">No items found</h4>
                <p className="text-xs text-slate-400 max-w-xs font-medium">You haven't added any items to this section yet.</p>
                {activeTab === 'uploads' && (
                  <Link to="/upload" className="mt-8 px-6 py-2.5 bg-teal-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-teal-600 transition-all shadow-lg shadow-teal-500/20">
                    Upload Now
                  </Link>
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
