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
  Table as Sheet
} from 'lucide-react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { getProfile } from '@/api/authApi'
import { deleteDocument } from '@/api/documentApi'
import { useAuthStore } from '@/store/authStore'

type TabType = 'uploads' | 'fav_docs' | 'fav_books' | 'analytics' | 'followers';

export default function MyProfile(): React.JSX.Element | null {
  const { user: currentUser, logout } = useAuthStore()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [activeTab, setActiveTab] = useState<TabType>('uploads')
  const [profileData, setProfileData] = useState<any>(null)
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

  useEffect(() => {
    // Scroll to content immediately when tab changes
    if (contentRef.current) {
      // Use requestAnimationFrame to ensure DOM is fully updated before scrolling
      requestAnimationFrame(() => {
        contentRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      })
    }
  }, [activeTab])

  const [imageError, setImageError] = useState(false)

  const fetchData = async () => {
    setIsLoading(true)
    try {
      const data = await getProfile()
      setProfileData(data)
    } catch (error) {
      console.error('Failed to fetch profile', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteDocument = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this document? This action cannot be undone.')) return

    try {
      await deleteDocument(id)
      fetchData()
    } catch (error) {
      console.error('Failed to delete document', error)
      alert('Failed to delete document.')
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

  const getFileIcon = (fileType: string) => {
    const type = fileType?.toLowerCase();
    if (['pdf', 'doc', 'docx', 'txt', 'rtf'].includes(type)) return <FileText size={14} />;
    if (['ppt', 'pptx'].includes(type)) return <Presentation size={14} />;
    if (['xls', 'xlsx', 'csv'].includes(type)) return <Sheet size={14} />;
    if (['png', 'jpg', 'jpeg', 'gif', 'svg', 'webp'].includes(type)) return <FileImage size={14} />;
    if (['mp4', 'mov', 'avi', 'mkv'].includes(type)) return <FileVideo size={14} />;
    if (['mp3', 'wav', 'ogg'].includes(type)) return <FileAudio size={14} />;
    if (['zip', 'rar', '7z', 'tar', 'gz'].includes(type)) return <FileArchive size={14} />;
    if (['js', 'ts', 'jsx', 'tsx', 'py', 'java', 'cpp', 'c', 'html', 'css', 'php'].includes(type)) return <FileCode size={14} />;
    return <FileText size={14} />;
  }

  return (
    <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8 font-sans text-slate-800 dark:text-gray-200">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start">

        {/* Left Side Column - Profile Headshot and Core Stats */}
        <div className="md:col-span-4 flex flex-col items-center md:items-start text-center md:text-left">
          {/* Circular Profile Frame */}
          <div className="w-36 h-36 rounded-full border border-slate-200 dark:border-gray-700 bg-slate-50 overflow-hidden shadow-sm mb-4 flex items-center justify-center shrink-0">
            {user.avatar && !imageError ? (
              <img
                src={user.avatar}
                className="w-full h-full object-cover"
                alt={user.name}
                onError={() => setImageError(true)}
                referrerPolicy="no-referrer"
              />
            ) : (
              <span className="text-4xl font-light text-slate-400">{initials}</span>
            )}
          </div>

          {/* Identity Info */}
          <h1 className="text-2xl font-normal text-slate-900 dark:text-white leading-tight mb-1">
            {user.name}
          </h1>
          <p className="text-xs text-slate-500 dark:text-gray-400 mb-5 flex items-center gap-1">
            <span>{user.university?.name || '+ Add an Affiliation'}</span>
            {user.major && <span>• {user.major}</span>}
          </p>

          {/* Contextual Action Work Buttons */}
          <div className="flex gap-2.5 w-full max-w-sm mb-6">
            <Link
              to="/upload"
              className="flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors bg-teal-600 hover:bg-teal-700 text-white flex items-center justify-center gap-1.5 shadow-sm"
            >
              <Upload size={15} /> Upload
            </Link>
            <Link
              to="/profile/settings"
              className="flex-1 py-2 px-4 rounded-md border border-slate-300 dark:border-gray-600 text-slate-700 dark:text-gray-300 text-sm font-medium hover:bg-slate-50 dark:hover:bg-gray-800 transition-colors flex items-center justify-center gap-1.5"
            >
              <Edit2 size={14} /> Edit profile
            </Link>
          </div>

          {/* Quick Stats Grid Stack */}
          <div className="w-full max-w-sm text-xs space-y-3 pb-6 border-b border-slate-200 dark:border-gray-700 mb-6">
            <div className="flex justify-between items-center cursor-pointer" onClick={() => setActiveTab('followers')}>
              <span className="text-slate-500">Followers</span>
              <span className="font-semibold text-teal-600 dark:text-teal-400">{stats.followers_count || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500">Following</span>
              <span className="font-semibold text-teal-600 dark:text-teal-400">{stats.following_count || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500">Public Views</span>
              <span className="font-semibold text-teal-600 dark:text-teal-400">{stats.total_views || 0}</span>
            </div>
          </div>

          {/* Utilities Menu Tray Block */}
          <div className="w-full max-w-sm flex flex-col gap-1.5 mb-6">
            <button onClick={() => setActiveTab('analytics')} className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium flex items-center gap-2 ${activeTab === 'analytics' ? 'bg-teal-50 text-teal-600' : 'text-slate-500 hover:bg-slate-50'}`}>
              <BarChart3 size={14} /> View Analytics Dashboard
            </button>
            <button onClick={handleLogout} className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium text-rose-500 hover:bg-rose-50 flex items-center gap-2">
              <LogOut size={14} /> Sign Out Workspace
            </button>
          </div>
        </div>

        {/* Right Side Column - Main Feed Elements */}
        <div className="md:col-span-8 flex flex-col gap-6">

          {/* Scholar Thought Share Box container */}
          <div className="border border-slate-200 dark:border-gray-800 rounded-lg p-4 bg-white dark:bg-gray-900 shadow-sm flex items-center gap-4">
            <div className="w-8 h-8 rounded-full bg-slate-100 overflow-hidden shrink-0 flex items-center justify-center">
              {user.avatar && !imageError ? (
                <img src={user.avatar} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              ) : (
                <span className="text-xs text-slate-400">{initials}</span>
              )}
            </div>
            <input
              type="text"
              placeholder="Share a thought with other scholars..."
              className="flex-grow bg-transparent border border-slate-200 dark:border-gray-700 rounded px-3 py-1.5 text-xs text-slate-600 dark:text-gray-300 focus:outline-none focus:border-teal-600"
            />
          </div>

          {/* Segment Section Divider and Horizontal Action Switchers */}
          <div className="flex justify-between items-center border-b border-slate-200 dark:border-gray-700 pb-2 mt-4">
            <h3 className="text-base font-semibold text-slate-800 dark:text-gray-200">
              {activeTab === 'uploads' ? 'My Uploads' :
               activeTab === 'fav_docs' ? 'Saved Assets' :
               activeTab === 'fav_books' ? 'My Library' :
               activeTab === 'analytics' ? 'Performance Analytics' :
               'Community Network'}
            </h3>
            {activeTab === 'uploads' && (
              <button className="text-xs text-teal-600 dark:text-teal-400 font-medium hover:underline flex items-center gap-1">
                <Edit2 size={12} /> Edit Uploads
              </button>
            )}
          </div>

          {/* Secondary Sub-navigation Horizontal Selector Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-600 dark:text-gray-400">
            <button
              onClick={() => setActiveTab('uploads')}
              className={`px-3 py-1.5 rounded-full transition-all ${
                activeTab === 'uploads' ? 'bg-teal-50 text-teal-600 font-medium' : 'hover:bg-slate-100 dark:hover:bg-gray-800'
              }`}
            >
              All Uploads ({ (user.documents?.length || 0) + (user.books?.length || 0) })
            </button>
            <button
              onClick={() => setActiveTab('fav_docs')}
              className={`px-3 py-1.5 rounded-full transition-all ${
                activeTab === 'fav_docs' ? 'bg-teal-50 text-teal-600 font-medium' : 'hover:bg-slate-100 dark:hover:bg-gray-800'
              }`}
            >
              Saved Assets ({user.favorites?.filter((f: any) => f.document_id).length || 0})
            </button>
            <button
              onClick={() => setActiveTab('fav_books')}
              className={`px-3 py-1.5 rounded-full transition-all ${
                activeTab === 'fav_books' ? 'bg-teal-50 text-teal-600 font-medium' : 'hover:bg-slate-100 dark:hover:bg-gray-800'
              }`}
            >
              Library ({user.favorites?.filter((f: any) => f.book_id).length || 0})
            </button>
            <button className="px-3 py-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-gray-800 flex items-center gap-1 text-slate-400">
              More Content <ChevronDown size={12} />
            </button>
          </div>

          {/* Conditional Activity Feed Render Window */}
          <div className="mt-2 scroll-mt-8" ref={contentRef}>
            {activeTab === 'analytics' ? (
              <div className="space-y-6">
                <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wider">Learning Impact</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border border-slate-100 dark:border-gray-700">
                    <Eye className="text-teal-600 mb-2" size={20} />
                    <p className="text-xl font-bold text-slate-900 dark:text-white">{stats.total_views || 0}</p>
                    <p className="text-[10px] text-slate-400 uppercase font-medium">Total Paper Views</p>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border border-slate-100 dark:border-gray-700">
                    <Download className="text-teal-600 mb-2" size={20} />
                    <p className="text-xl font-bold text-slate-900 dark:text-white">{stats.total_downloads || 0}</p>
                    <p className="text-[10px] text-slate-400 uppercase font-medium">Resource Downloads</p>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border border-slate-100 dark:border-gray-700">
                    <ThumbsUp className="text-teal-600 mb-2" size={20} />
                    <p className="text-xl font-bold text-slate-900 dark:text-white">{stats.total_likes || 0}</p>
                    <p className="text-[10px] text-slate-400 uppercase font-medium">Peer Appreciations</p>
                  </div>
                </div>
              </div>
            ) : activeTab === 'followers' ? (
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wider">Community Network</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {user.followers?.length > 0 ? user.followers.map((f: any) => (
                    <Link to={f.follower?.username ? `/profile/${f.follower.username}` : `/user/${f.follower_id}`} key={f.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-transparent hover:border-slate-200 transition-all">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-teal-50 flex items-center justify-center text-teal-600 font-bold text-xs overflow-hidden">
                          {f.follower?.avatar ? <img src={f.follower.avatar} className="w-full h-full object-cover" referrerPolicy="no-referrer" /> : f.follower?.name?.[0]}
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-slate-900 dark:text-white">{f.follower?.name}</p>
                          <p className="text-[10px] text-slate-400">@{f.follower?.username || f.follower?.name?.split(' ')?.[0]?.toLowerCase()}</p>
                        </div>
                      </div>
                    </Link>
                  )) : (
                    <p className="text-slate-400 text-xs py-4 font-medium">No active scholars in your immediate network tracking yet.</p>
                  )}
                </div>
              </div>
            ) : currentItems.length > 0 ? (
              <div className="space-y-8">
                {currentItems.map((item: any) => {
                  const isBook = item.itemType === 'book'
                  return (
                    <div key={item.id} className="flex gap-4 items-start pb-6 border-b border-slate-100 dark:border-gray-800 last:border-0">

                      {/* Standard Document Icon Placeholder Block Frame */}
                      <div className="w-14 h-18 bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded p-0.5 shadow-sm shrink-0 flex flex-col justify-between overflow-hidden">
                        {item.thumbnail || item.cover_image ? (
                          <img src={item.thumbnail || item.cover_image} className="w-full h-full object-cover rounded" alt="" referrerPolicy="no-referrer" />
                        ) : (
                          <div className="p-1 h-full flex flex-col justify-between">
                            <div className="space-y-1">
                              <div className={`h-1 w-full rounded ${
                                ['pdf', 'doc', 'docx'].includes(item.file_type?.toLowerCase()) ? 'bg-blue-400' :
                                ['ppt', 'pptx'].includes(item.file_type?.toLowerCase()) ? 'bg-orange-400' :
                                ['xls', 'xlsx'].includes(item.file_type?.toLowerCase()) ? 'bg-green-400' :
                                'bg-slate-100 dark:bg-slate-700'
                              }`} />
                              <div className="h-1 w-5/6 bg-slate-100 dark:bg-slate-700 rounded" />
                              <div className="h-1 w-4/6 bg-slate-100 dark:bg-slate-700 rounded" />
                            </div>
                            <div className="flex justify-end text-slate-300">
                              {isBook ? <BookOpen size={14} /> : getFileIcon(item.file_type)}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Content Core Body */}
                      <div className="flex-grow min-w-0">
                        <Link to={`/${isBook ? 'books' : 'documents'}/${item.id}`}>
                          <h4 className="text-base font-normal text-slate-900 dark:text-white hover:text-teal-600 transition-colors mb-1 truncate">
                            {item.title || "Document Title"}
                          </h4>
                        </Link>

                        <p className="text-xs text-slate-400 dark:text-gray-500 mb-2">
                          {isBook ? `Author: ${item.author || 'Unknown'}` : `Geosciences • ${item.view_count || 0} Views`}
                        </p>

                        <div className="flex items-center gap-3 text-xs text-teal-600 dark:text-teal-400 font-medium">
                          <Link to={`/${isBook ? 'books' : 'documents'}/${item.id}`} className="hover:underline flex items-center gap-1">
                            <Eye size={12} /> View Page
                          </Link>
                          <span className="text-slate-300">|</span>
                          <span className="text-slate-500 font-normal text-[11px] flex items-center gap-1">
                            <ThumbsUp size={11} /> {item.likes_count || 0} recommendations
                          </span>
                        </div>
                      </div>

                      {/* Explicit Interactive Context Commands Frame */}
                      {activeTab === 'uploads' && (
                        <button
                          onClick={() => handleDeleteDocument(item.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded transition-all shrink-0 self-start"
                          title="Remove Document"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center border border-dashed border-slate-200 dark:border-gray-800 rounded-xl">
                <div className="w-12 h-12 bg-slate-50 dark:bg-gray-800 rounded-full flex items-center justify-center text-slate-300 mb-3">
                   {activeTab === 'uploads' ? <Upload size={20} /> : <Heart size={20} />}
                </div>
                <h4 className="text-sm font-medium text-slate-800 dark:text-white mb-1">No publications matching</h4>
                <p className="text-xs text-slate-400 max-w-xs mb-4">This section is currently empty. Add or update items to build your academic stream repository.</p>
                {activeTab === 'uploads' && (
                  <Link to="/upload" className="px-4 py-2 bg-teal-600 text-white rounded text-xs font-medium hover:bg-teal-700 transition-all shadow-sm">
                    Upload Publication
                  </Link>
                )}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  )
}