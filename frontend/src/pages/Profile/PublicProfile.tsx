import React, { useState, useEffect } from 'react'
import {
  BookOpen,
  FileText,
  Upload,
  MessageCircle,
  ThumbsUp,
  GraduationCap,
  ChevronDown,
  Facebook,
  Instagram,
  Music2,
  Link as LinkIcon,
  MapPin,
  Briefcase,
  Eye,
  Download,
  Layers
} from 'lucide-react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { getUserProfile, getPublicProfileApi } from '@/api/authApi'
import { useAuthStore } from '@/store/authStore'
import { FollowButton } from '@/components/FollowButton'
import SendMessageModal from '@/components/SendMessageModal'

export default function PublicProfile(): React.JSX.Element {
  const { user: currentUser } = useAuthStore()
  const { id, username } = useParams()
  const navigate = useNavigate()
  const [profileData, setProfileData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'all' | 'documents' | 'books'>('all')
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false)
  const [imageError, setImageError] = useState(false)

  useEffect(() => {
    fetchData()
    setImageError(false)
  }, [id, username])

  const fetchData = async () => {
    setIsLoading(true)
    try {
      let data;
      if (username) {
        data = await getPublicProfileApi(username)
      } else if (id) {
        data = await getUserProfile(id)
      } else {
        return
      }
      setProfileData(data)
    } catch (error) {
      console.error('Failed to fetch profile', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto py-32 text-center">
        <div className="animate-spin w-6 h-6 border-2 border-slate-200 border-t-teal-600 rounded-full mx-auto mb-4"></div>
        <p className="text-slate-400 text-xs font-medium tracking-wide">Assembling Scholar Profile...</p>
      </div>
    )
  }

  if (!profileData) return <div className="p-20 text-center font-medium text-slate-500 text-sm">Scholar profile not found.</div>

  const { user, stats } = profileData
  const initials = user.name ? user.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase() : 'U'

  const getFilteredItems = () => {
    const docs = user.documents || []
    const bks = user.books || []
    if (activeTab === 'documents') return docs
    if (activeTab === 'books') return bks
    return [...docs, ...bks]
  }

  const currentItems = getFilteredItems()

  return (
    <div className="max-w-6xl mx-auto py-6 px-4 sm:px-6 lg:px-8 font-sans text-slate-800 dark:text-gray-200 antialiased">

      {/* ================= HERO BACKGROUND COVER BANNER ================= */}
      {/* Removed overflow-hidden from here so avatar pops out cleanly */}
      <div className="relative h-48 w-full bg-linear-to-r from-teal-500/10 via-emerald-500/5 to-slate-100 dark:to-gray-900 rounded-3xl mb-16 border border-slate-100 dark:border-gray-800/40">
        {/* Pattern inside an absolute wrapper to keep it contained */}
        <div className="absolute inset-0 bg-[radial-gradient(#0d9488_1px,transparent_1px)] [background-size:16px_16px] opacity-25 rounded-3xl overflow-hidden"></div>

        {/* Absolute Profile Avatar Placement */}
        <div className="absolute -bottom-10 left-8 z-10">
          <div className="w-28 h-28 rounded-full border-4 border-white dark:border-gray-950 bg-slate-50 dark:bg-gray-900 overflow-hidden shadow-md flex items-center justify-center shrink-0">
            {user.avatar && !imageError ? (
              <img src={user.avatar} className="w-full h-full object-cover" alt={user.name} onError={() => setImageError(true)} />
            ) : (
              <span className="text-3xl font-bold tracking-tight text-teal-600/80">{initials}</span>
            )}
          </div>
        </div>
      </div>

      {/* ================= SPLIT GRID LAYOUT STRUCTURE ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start pt-2">

        {/* --- LEFT SIDEBAR INFO MATRIX --- */}
        <div className="lg:col-span-4 space-y-6">
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight mb-2">
              {user.name}
            </h1>

            <div className="space-y-1.5 text-xs text-slate-500 dark:text-gray-400 font-medium">
              <p className="flex items-center gap-2 text-teal-600 dark:text-teal-400 font-semibold">
                <GraduationCap size={14} />
                {user.academic_title || 'Scholar'}
              </p>
              <p className="flex items-center gap-2">
                <Briefcase size={14} className="text-slate-400 shrink-0" />
                <span className="truncate">{user.affiliation || user.university?.name || 'Academic Institution'}</span>
              </p>
              {user.country && (
                <p className="flex items-center gap-2">
                  <MapPin size={14} className="text-slate-400 shrink-0" />
                  <span>{user.country}</span>
                </p>
              )}
            </div>
          </div>

          {/* ACTIONS CONTROL PANEL */}
          <div className="flex items-center gap-2.5 w-full pt-1">
            {currentUser?.id !== user.id ? (
              <>
                <div className="flex-1">
                  <FollowButton
                    userId={user.id}
                    userName={user.name}
                    variant="primary"
                    onFollowChange={(newFollowing) => {
                      setProfileData((prev: any) => {
                        if (!prev) return prev;
                        const currentFollowers = prev.stats.followers_count || 0;
                        return {
                          ...prev,
                          stats: {
                            ...prev.stats,
                            is_following: newFollowing,
                            followers_count: newFollowing ? currentFollowers + 1 : Math.max(0, currentFollowers - 1)
                          }
                        };
                      })
                    }}
                  />
                </div>
                <button
                  onClick={() => {
                    if (!currentUser) return navigate('/login')
                    setIsMessageModalOpen(true)
                  }}
                  className="py-2 px-4 rounded-xl border border-slate-200 dark:border-gray-800 text-slate-700 dark:text-gray-300 text-xs font-semibold bg-white dark:bg-gray-900 hover:bg-slate-50 dark:hover:bg-gray-800 shadow-2xs active:scale-98 transition-all h-9 flex items-center justify-center gap-1.5"
                >
                  <MessageCircle size={14} className="text-slate-400" />
                  <span>Message</span>
                </button>
              </>
            ) : (
              <Link
                to="/profile/settings"
                className="w-full py-2 px-4 rounded-xl border border-slate-200 dark:border-gray-800 text-slate-700 dark:text-gray-300 text-xs font-semibold bg-white dark:bg-gray-900 hover:bg-slate-50 dark:hover:bg-gray-800 text-center shadow-2xs active:scale-98 transition-all h-9 flex items-center justify-center"
              >
                Edit Dashboard Settings
              </Link>
            )}
          </div>

          {/* SOCIAL LINKS GROUP */}
          {user.social_links && Object.values(user.social_links).some(link => link) && (
            <div className="flex gap-3 pt-1">
              {user.social_links.facebook && (
                <a href={user.social_links.facebook} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-lg border border-slate-100 dark:border-gray-800/60 flex items-center justify-center text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 hover:bg-slate-50 dark:hover:bg-gray-900 transition-all">
                  <Facebook size={14} />
                </a>
              )}
              {user.social_links.instagram && (
                <a href={user.social_links.instagram} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-lg border border-slate-100 dark:border-gray-800/60 flex items-center justify-center text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 hover:bg-slate-50 dark:hover:bg-gray-900 transition-all">
                  <Instagram size={14} />
                </a>
              )}
              {user.social_links.tiktok && (
                <a href={user.social_links.tiktok} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-lg border border-slate-100 dark:border-gray-800/60 flex items-center justify-center text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 hover:bg-slate-50 dark:hover:bg-gray-900 transition-all">
                  <Music2 size={14} />
                </a>
              )}
              {user.social_links.website && (
                <a href={user.social_links.website} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-lg border border-slate-100 dark:border-gray-800/60 flex items-center justify-center text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 hover:bg-slate-50 dark:hover:bg-gray-900 transition-all">
                  <LinkIcon size={14} />
                </a>
              )}
            </div>
          )}

          {/* STATS ANALYTICS LIST */}
          <div className="w-full bg-slate-50/60 dark:bg-gray-900/40 border border-slate-100 dark:border-gray-800/50 rounded-2xl p-4 text-xs space-y-3 shadow-2xs">
            <div className="flex justify-between items-center">
              <span className="text-slate-400 font-medium">Followers</span>
              <span className="font-bold text-slate-800 dark:text-white bg-white dark:bg-gray-800 px-2 py-0.5 rounded border border-slate-100 dark:border-gray-700">{Math.max(0, stats.followers_count || 0).toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400 font-medium">Following</span>
              <span className="font-bold text-slate-800 dark:text-white bg-white dark:bg-gray-800 px-2 py-0.5 rounded border border-slate-100 dark:border-gray-700">{stats.following_count?.toLocaleString() || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400 font-medium">Total Uploads</span>
              <span className="font-bold text-slate-800 dark:text-white bg-white dark:bg-gray-800 px-2 py-0.5 rounded border border-slate-100 dark:border-gray-700">{stats.total_uploads?.toLocaleString() || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400 font-medium">Total Downloads</span>
              <span className="font-bold text-teal-600 dark:text-teal-400 bg-teal-500/5 px-2 py-0.5 rounded border border-teal-500/10">{stats.total_downloads?.toLocaleString() || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400 font-medium">Public Portfolio Views</span>
              <span className="font-bold text-slate-800 dark:text-white bg-white dark:bg-gray-800 px-2 py-0.5 rounded border border-slate-100 dark:border-gray-700">{stats.total_views?.toLocaleString() || 0}</span>
            </div>
          </div>

          {/* INTERESTS TAGS */}
          {user.research_interests && user.research_interests.length > 0 && (
            <div className="w-full">
              <h4 className="text-[10px] font-bold text-slate-400 dark:text-gray-500 uppercase tracking-widest mb-2.5">Research Core Focus</h4>
              <div className="flex flex-wrap gap-1.5">
                {user.research_interests.map((interest: string, index: number) => (
                  <span key={index} className="px-2 py-1 bg-slate-100 dark:bg-gray-800 rounded-md text-[10px] font-semibold text-slate-600 dark:text-gray-300 border border-slate-200/20">
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* BIOGRAPHY BOX */}
          <div className="w-full text-xs leading-relaxed text-slate-600 dark:text-gray-400">
            <h4 className="text-[10px] font-bold text-slate-400 dark:text-gray-500 uppercase tracking-widest mb-2.5">Biography</h4>
            <div className="bg-slate-50/30 dark:bg-gray-900/10 p-3.5 rounded-2xl border border-dashed border-slate-200 dark:border-gray-800">
              <p className={user.bio ? "whitespace-pre-line text-slate-600 dark:text-gray-300" : "italic text-slate-400"}>
                {user.bio || "No educational bio details submitted."}
              </p>
            </div>
          </div>
        </div>

        {/* --- RIGHT PANEL CONTENT CORE STREAM --- */}
        <div className="lg:col-span-8 space-y-6">

          {/* HORIZONTAL CONTRIBUTE FILTER TABS */}
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-gray-800/80 pb-2">
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-gray-900 p-0.5 rounded-xl">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === 'all'
                    ? 'bg-white dark:bg-gray-800 text-teal-600 shadow-2xs'
                    : 'text-slate-500 dark:text-gray-400 hover:text-slate-800'
                }`}
              >
                All Papers
              </button>
              <button
                onClick={() => setActiveTab('documents')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === 'documents'
                    ? 'bg-white dark:bg-gray-800 text-teal-600 shadow-2xs'
                    : 'text-slate-500 dark:text-gray-400 hover:text-slate-800'
                }`}
              >
                Research ({user.documents?.length || 0})
              </button>
              <button
                onClick={() => setActiveTab('books')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === 'books'
                    ? 'bg-white dark:bg-gray-800 text-teal-600 shadow-2xs'
                    : 'text-slate-500 dark:text-gray-400 hover:text-slate-800'
                }`}
              >
                Literature ({user.books?.length || 0})
              </button>
            </div>

            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Layers size={12} />
              <span>Catalog Index</span>
            </div>
          </div>

          {/* DATA STREAM REPEATER CARDS */}
          <div className="space-y-4">
            {currentItems && currentItems.length > 0 ? (
              currentItems.map((item: any) => {
                const isBook = !!item.isbn || !!item.uploaded_by;
                return (
                  <div key={item.id} className="bg-white dark:bg-gray-900 border border-slate-100 dark:border-gray-800/80 rounded-2xl p-5 hover:border-teal-500/30 dark:hover:border-teal-400/20 transition-all duration-200 group flex gap-5 items-start">

                    {/* Compact Modern Academic Doc Frame */}
                    <div className="w-12 h-16 bg-slate-50 dark:bg-gray-800 border border-slate-200 dark:border-gray-700/60 rounded-xl p-1.5 shrink-0 flex flex-col justify-between group-hover:bg-teal-500/5 transition-colors">
                      <div className="space-y-1">
                        <div className="h-0.5 w-full bg-slate-300 dark:bg-gray-600 rounded-sm" />
                        <div className="h-0.5 w-4/5 bg-slate-300 dark:bg-gray-600 rounded-sm" />
                        <div className="h-0.5 w-3/5 bg-slate-300 dark:bg-gray-600 rounded-sm" />
                      </div>
                      <div className="text-slate-400 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors flex justify-end">
                        {isBook ? <BookOpen size={13} /> : <FileText size={13} />}
                      </div>
                    </div>

                    <div className="flex-grow min-w-0">
                      <Link to={`/${isBook ? 'books' : 'documents'}/${item.id}`}>
                        <h4 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors leading-snug mb-1">
                          {item.title}
                        </h4>
                      </Link>

                      <div className="flex items-center gap-2 text-[11px] text-slate-400 dark:text-gray-500 font-medium mb-2">
                        <span className="text-teal-600/90 dark:text-teal-400/90 font-semibold text-[10px] bg-teal-500/5 px-1.5 py-0.5 rounded">{isBook ? 'Book' : 'Research Paper'}</span>
                        <span>•</span>
                        <span>{new Date(item.created_at).getFullYear()}</span>
                        {item.category && (
                          <>
                            <span>•</span>
                            <span className="truncate">{item.category.name}</span>
                          </>
                        )}
                      </div>

                      <p className="text-xs text-slate-500 dark:text-gray-400 line-clamp-2 max-w-2xl leading-relaxed mb-3.5">
                        {item.description || "No index abstract documentation loaded."}
                      </p>

                      {/* Lower Analytics Handles Grid */}
                      <div className="flex items-center gap-4 text-[10px] text-slate-400 dark:text-gray-500 font-semibold border-t border-slate-50 dark:border-gray-800/40 pt-2.5">
                         <Link to={`/${isBook ? 'books' : 'documents'}/${item.id}`} className="text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1">
                           <ThumbsUp size={11} />
                           <span>{item.likes_count || 0} Recs</span>
                         </Link>
                         <span className="flex items-center gap-1"><Eye size={11} /> {item.view_count || 0} Views</span>
                         <span className="flex items-center gap-1"><Download size={11} /> {item.download_count || 0} Downloads</span>
                      </div>
                    </div>

                  </div>
                )
              })
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed border-slate-200 dark:border-gray-800/60 rounded-3xl bg-slate-50/50 dark:bg-gray-900/20">
                <div className="w-12 h-12 bg-white dark:bg-gray-900 rounded-2xl flex items-center justify-center text-slate-300 dark:text-gray-700 shadow-xs mb-3">
                   <Upload size={18} />
                </div>
                <h4 className="text-xs font-bold text-slate-700 dark:text-gray-300 mb-1">Index Pipeline Empty</h4>
                <p className="text-[11px] text-slate-400 max-w-xs mx-auto">This contributor has not uploaded publications to this category yet.</p>
              </div>
            )}
          </div>

        </div>

      </div>

      <SendMessageModal
        isOpen={isMessageModalOpen}
        onClose={() => setIsMessageModalOpen(false)}
        recipientId={user.id}
        recipientName={user.name}
      />
    </div>
  )
}