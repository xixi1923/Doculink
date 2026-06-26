import React, { useState, useEffect, useRef } from 'react'
import {
  BookOpen,
  Heart,
  FileText,
  Settings as SettingsIcon,
  LogOut,
  ShieldCheck,
  Upload,
  Trash2,
  Bell,
  Users,
  Eye,
  Download,
  ThumbsUp,
  BarChart3,
  ChevronDown,
  Edit2,
  FileCode,
  FileImage,
  FileVideo,
  FileAudio,
  FileArchive,
  Presentation,
  Table as Sheet,
  Zap,
  Calendar,
  ChevronRight
} from 'lucide-react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { getProfile } from '@/api/authApi'
import { deleteDocument } from '@/api/documentApi'
import { useAuthStore } from '@/store/authStore'
import api from '@/api'
import { getImageUrl } from '@/utils/image'

type TabType = 'uploads' | 'fav_docs' | 'fav_books' | 'analytics' | 'followers';
export default function MyProfile(): React.JSX.Element | null {
  const { user: currentUser, logout } = useAuthStore()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [activeTab, setActiveTab] = useState<TabType>('uploads')
  const [profileData, setProfileData] = useState<any>(null)
  const [subscriptionStatus, setSubscriptionStatus] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!currentUser) {
        navigate('/login')
        return
    }
    fetchData()

    // Handle initial tab from query param
    const tabParam = searchParams.get('tab')
    if (tabParam === 'saved') {
      setActiveTab('fav_docs')
    } else if (tabParam === 'analytics') {
      setActiveTab('analytics')
    } else if (tabParam === 'uploads') {
      setActiveTab('uploads')
    }
  }, [currentUser, navigate, searchParams])

  const fetchData = async () => {
    setIsLoading(true)
    try {
      const [pData, subData] = await Promise.all([
        getProfile(),
        api.get('/subscription/status')
      ])
      setProfileData(pData)
      setSubscriptionStatus(subData.data)
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
      <div className="max-w-6xl mx-auto py-20 px-4 text-center">
        <div className="animate-spin w-8 h-8 border-4 border-slate-200 border-t-teal-600 rounded-full mx-auto mb-4"></div>
        <p className="text-slate-400 font-medium text-xs tracking-wide">Accessing Workspace...</p>
      </div>
    )
  }

  if (!profileData) return null

  const { user, stats } = profileData
  const initials = user.name ? user.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase() : 'U'

  const getTabContent = () => {
    if (activeTab === 'uploads') {
      const docs = user.documents || []
      const books = user.books || []
      return [...docs.map((d: any) => ({...d, itemType: 'doc'})), ...books.map((b: any) => ({...b, itemType: 'book'}))].sort((a: any, b: any) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      )
    }
    if (activeTab === 'fav_docs') return user.favorites?.filter((f: any) => f.document_id && f.document).map((f: any) => ({...f.document, itemType: 'doc'})) || []
    if (activeTab === 'fav_books') return user.favorites?.filter((f: any) => f.book_id && f.book).map((f: any) => ({...f.book, itemType: 'book'})) || []
    return []
  }

  const currentItems = getTabContent()

  return (
    <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8 font-sans text-slate-800 dark:text-gray-200">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start">


        {/* Left Side Column */}
        <div className="md:col-span-4 flex flex-col items-center md:items-start text-center md:text-left">
          <div className="w-36 h-36 rounded-full border border-slate-200 dark:border-gray-700 bg-slate-50 overflow-hidden shadow-sm mb-4 flex items-center justify-center shrink-0">
            {user.avatar ? (
              <img src={getImageUrl(user.avatar)} className="w-full h-full object-cover" alt={user.name} />
            ) : (
              <span className="text-4xl font-light text-slate-400">{initials}</span>
            )}
          </div>

          <h1 className="text-2xl font-black text-slate-900 dark:text-white leading-tight mb-1">
            {user.name}
          </h1>
          <p className="text-xs text-slate-500 dark:text-gray-400 mb-6 flex items-center gap-1">
            <span>{user.university?.name || 'Independent Scholar'}</span>
          </p>

          {/* Subscription Badge */}
          <div className="w-full max-w-sm mb-8">
            <div className={`p-5 rounded-[2rem] border ${subscriptionStatus?.is_premium ? 'bg-amber-50 border-amber-100 text-amber-900' : 'bg-slate-50 border-slate-100 text-slate-500'}`}>
                <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-black uppercase tracking-widest">Protocol Level</span>
                    {subscriptionStatus?.is_premium ? <Zap size={14} className="text-amber-500" /> : <ShieldCheck size={14} />}
                </div>
                <p className="font-black text-lg">{subscriptionStatus?.is_premium ? 'Premium Elite' : 'Standard Node'}</p>
                {subscriptionStatus?.is_premium && (
                    <p className="text-[10px] font-bold mt-2 opacity-60 flex items-center gap-1">
                        <Calendar size={10} /> Valid until {new Date(subscriptionStatus.premium_until).toLocaleDateString()}
                    </p>
                )}
                {!subscriptionStatus?.is_premium && (
                    <Link to="/subscription/verify" className="inline-flex items-center gap-1.5 mt-3 text-[10px] font-black text-teal-600 uppercase tracking-widest hover:underline">
                        Upgrade Access <ChevronRight size={10} />
                    </Link>
                )}
            </div>
          </div>

          <div className="flex gap-2.5 w-full max-w-sm mb-8">
            <Link to="/upload" className="flex-1 py-3 px-4 rounded-xl text-xs font-black uppercase tracking-widest bg-teal-600 hover:bg-teal-700 text-white flex items-center justify-center gap-2 shadow-lg shadow-teal-600/10">
              <Upload size={14} /> Upload
            </Link>
            <Link to="/profile/settings" className="flex-1 py-3 px-4 rounded-xl border border-slate-200 dark:border-gray-700 text-slate-700 dark:text-gray-300 text-xs font-black uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-gray-800 transition-all flex items-center justify-center gap-2">
              <Edit2 size={13} /> Settings
            </Link>
          </div>

          <div className="w-full max-w-sm flex flex-col gap-1.5 mb-10">
            <button onClick={() => setActiveTab('analytics')} className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${activeTab === 'analytics' ? 'bg-teal-50 text-teal-600 shadow-sm' : 'text-slate-500 hover:bg-slate-50'}`}>
              <BarChart3 size={15} /> Analytics Data
            </button>
            <button onClick={handleLogout} className="w-full text-left px-4 py-3 rounded-xl text-xs font-bold text-rose-500 hover:bg-rose-50 flex items-center gap-2 transition-all">
              <LogOut size={15} /> Logout Account
            </button>
          </div>
        </div>


        {/* Right Side Column */}
        <div className="md:col-span-8 flex flex-col gap-8">
          <div className="flex items-center gap-4 bg-white dark:bg-gray-900 border border-slate-100 dark:border-gray-800 p-6 rounded-[2.5rem] shadow-sm">
             <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-300">
                {user.avatar ? <img src={getImageUrl(user.avatar)} className="w-full h-full rounded-full object-cover" /> : <ShieldCheck size={24} />}
             </div>
             <p className="text-slate-400 font-medium italic text-sm">"Knowledge is a collective matrix, shared for all."</p>
          </div>

          <div className="flex items-center gap-2 bg-slate-100/50 p-1.5 rounded-2xl w-fit">
            {[
              { id: 'uploads', label: 'My Uploads', count: (user.documents?.length || 0) + (user.books?.length || 0) },
              { id: 'fav_docs', label: 'Saved Docs', count: user.favorites?.filter((f: any) => f.document_id).length || 0 },
              { id: 'fav_books', label: 'Saved Books', count: user.favorites?.filter((f: any) => f.book_id).length || 0 },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  activeTab === tab.id ? 'bg-white text-teal-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>

          <div className="mt-4">
             {activeTab === 'analytics' ? (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 animate-in slide-in-from-bottom-4 duration-500">
                  {[
                    { label: 'Network Views', val: stats.total_views, icon: Eye },
                    { id: 'downloads', label: 'Node Transfers', val: stats.total_downloads, icon: Download },
                    { id: 'likes', label: 'Peer Rating', val: stats.total_likes, icon: ThumbsUp },
                  ].map(s => (
                    <div key={s.label} className="bg-white dark:bg-gray-800 p-8 rounded-[2.5rem] border border-slate-100 dark:border-gray-700 shadow-sm">
                       <s.icon className="text-teal-500 mb-4" size={24} />
                       <p className="text-3xl font-black text-slate-900 dark:text-white">{s.val || 0}</p>
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{s.label}</p>
                    </div>
                  ))}
                </div>
             ) : currentItems.length > 0 ? (
                <div className="space-y-6">
                   {currentItems.map((item: any) => (
                      <Link
                        to={`/${item.itemType === 'book' ? 'books' : 'documents'}/${item.slug || item.id}`}
                        key={item.id}
                        className="flex gap-6 items-center p-6 bg-white dark:bg-gray-900 border border-slate-100 dark:border-gray-800 rounded-[2rem] hover:shadow-xl hover:shadow-slate-200/40 hover:border-teal-500/30 transition-all group"
                      >
                         <div className="w-16 h-22 bg-slate-50 rounded-xl overflow-hidden shrink-0 border border-slate-100">
                            {item.cover_image || item.thumbnail ? (
                                <img src={getImageUrl(item.cover_image || item.thumbnail)} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-slate-300">
                                    <FileText size={24} />
                                </div>
                            )}
                         </div>
                         <div className="flex-grow min-w-0">
                            <div className="flex items-center gap-2 mb-1.5">

                                <span className="text-[8px] font-black text-teal-600 uppercase tracking-widest bg-teal-50 px-2 py-0.5 rounded">{item.category?.name || 'General'}</span>
                                <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{item.itemType === 'book' ? 'E-Book' : 'Document'}</span>
                            </div>
                            <h4 className="font-bold text-slate-900 dark:text-white group-hover:text-teal-600 transition-colors truncate">{item.title}</h4>
                            <p className="text-xs text-slate-500 mt-1">{item.itemType === 'book' ? item.author : `${item.view_count || 0} Views`}</p>
                         </div>
                         <ChevronRight className="text-slate-300 group-hover:text-teal-500 transition-colors" size={20} />
                      </Link>
                   ))}
                </div>
             ) : (
                <div className="py-24 text-center bg-slate-50/50 rounded-[3rem] border border-dashed border-slate-200">
                   <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-slate-200 mx-auto shadow-sm mb-6">
                      <FileText size={32} />
                   </div>
                   <h3 className="text-lg font-black text-slate-900">Zero data found.</h3>
                   <p className="text-xs font-medium text-slate-500 mt-1">Start contributing to the academic matrix.</p>
                </div>
             )}
          </div>
        </div>
      </div>
    </div>
  )
}
