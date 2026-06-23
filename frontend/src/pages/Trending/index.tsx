import {
  FileText,
  ThumbsUp,
  MessageSquare,
  MoreHorizontal,
  Bookmark,
  PlusCircle,
  ArrowUpRight,
  Search,
  EyeOff,
  Flag,
  Send,
  Loader2,
  ChevronUp,
  ChevronDown,
  UserPlus,
  UserCheck,
  MessageCircle,
  Share2,
  Check
} from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useState, useRef, useEffect } from 'react'
import { getTrendingDocuments, getDocumentById, addDocumentComment } from '@/api/documentApi'
import { toggleDocumentLikeApi, toggleFavoriteApi, replyCommentApi } from '@/api/authApi'
import { useAuthStore } from '@/store/authStore'
import CommentSection from '@/components/CommentSection'
import FollowButton from '@/components/FollowButton'

export default function Trending() {
  const { user, token } = useAuthStore()
  const navigate = useNavigate()
  const [posts, setPosts] = useState<any[]>([])
  const [continueReading, setContinueReading] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeMenu, setActiveMenu] = useState<number | null>(null)
  const [expandedComments, setExpandedComments] = useState<number | null>(null)
  const [postComments, setPostComments] = useState<Record<number, any[]>>({})
  const [newCommentText, setNewCommentText] = useState<Record<number, string>>({})
  const [sharedPostId, setSharedPostId] = useState<number | null>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetchTrending()
  }, [])

  const handleShare = (postId: number) => {
    const url = `${window.location.origin}/documents/${postId}`
    navigator.clipboard.writeText(url)
    setSharedPostId(postId)
    setTimeout(() => setSharedPostId(null), 2000)
  }

  const fetchTrending = async () => {
    setLoading(true)
    try {
      const data = await getTrendingDocuments()
      setPosts(data)
      // Set the first 3 as continue reading if they exist
      setContinueReading(data.slice(0, 3))
    } catch (error) {
      console.error('Failed to fetch trending data', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchCommentsForPost = async (postId: number) => {
    try {
        const fullDoc = await getDocumentById(postId.toString())
        setPostComments(prev => ({ ...prev, [postId]: fullDoc.comments || [] }))
        setPosts(prev => prev.map(p => p.id === postId ? { ...p, comments_count: fullDoc.comments_count } : p))
    } catch (error) {
        console.error('Failed to fetch comments', error)
    }
  }

  const handleToggleComments = (postId: number) => {
    if (expandedComments === postId) {
        setExpandedComments(null)
    } else {
        setExpandedComments(postId)
        if (!postComments[postId]) {
            fetchCommentsForPost(postId)
        }
    }
  }

  const handleAddComment = async (postId: number) => {
    const text = newCommentText[postId]
    if (!text?.trim() || !token) return

    try {
        const res = await addDocumentComment(postId.toString(), text)
        console.log('Add Comment Response:', res)
        setPostComments(prev => ({
            ...prev,
            [postId]: [res, ...(prev[postId] || [])]
        }))
        setNewCommentText(prev => ({ ...prev, [postId]: '' }))
        // Update count in post list
        setPosts(prev => prev.map(p => p.id === postId ? { ...p, comments_count: (p.comments_count || 0) + 1 } : p))
    } catch (error: any) {
        console.error('Add Comment Error:', error.response?.data)
        alert('Failed to add comment: ' + (error.response?.data?.message || 'Server error'))
    }
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveMenu(null)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLike = async (postId: number) => {
    if (!token) return navigate('/login')
    try {
      const res = await toggleDocumentLikeApi(postId)
      console.log('Like Document Response:', res)
      setPosts(prevPosts => prevPosts.map(post => {
        if (post.id === postId) {
          const currentCount = Number(post.likes_count || 0)
          return {
            ...post,
            is_liked: res.liked,
            likes_count: res.liked ? currentCount + 1 : Math.max(0, currentCount - 1)
          }
        }
        return post
      }))
    } catch (error: any) {
      console.error('Like Document Error:', error.response?.data)
      alert('Failed to like: ' + (error.response?.data?.message || 'Server error'))
    }
  }

  const handleToggleFavorite = async (postId: number) => {
    if (!token) return navigate('/login')
    try {
      const res = await toggleFavoriteApi({ document_id: postId })
      setPosts(prevPosts => prevPosts.map(post =>
        post.id === postId
          ? { ...post, is_favorited: res.favorited }
          : post
      ))
    } catch (error: any) {
      console.error(error)
      alert('Failed to save to library: ' + (error.response?.data?.message || 'Server error'))
    }
  }

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (post.user?.name || '').toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getDocumentImage = (id: number) => {
    const images = [
      'https://images.unsplash.com/photo-1576086213369-97a306dca664?auto=format&fit=crop&q=80&w=400',
      'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=400',
      'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=400',
      'https://images.unsplash.com/photo-1532187875605-2fe358a3d4f2?auto=format&fit=crop&q=80&w=400',
    ]
    return images[id % images.length]
  }

  return (
    <div className="max-w-6xl mx-auto py-6 px-4">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* Center Feed - Posts */}
        <div className="lg:col-span-8 space-y-6">
          {/* Search Bar */}
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={20} />
            <input
              type="text"
              placeholder="Search trending papers, authors or topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl shadow-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-gray-900 dark:text-white"
            />
          </div>

          {loading ? (
             <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="animate-spin text-primary mb-4" size={32} />
                <p className="text-gray-400 font-bold uppercase text-xs tracking-widest">Fetching trending papers...</p>
             </div>
          ) : filteredPosts.length > 0 ? (
            filteredPosts.map((post) => (
              <div key={post.id} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden transition-colors">
              <div className="p-4 flex items-center justify-between border-b dark:border-gray-700 relative">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Recommended for you</span>
                <div className="relative" ref={activeMenu === post.id ? menuRef : null}>
                  <button
                    onClick={() => setActiveMenu(activeMenu === post.id ? null : post.id)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1 rounded-full hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
                  >
                    <MoreHorizontal size={20} />
                  </button>

                  {activeMenu === post.id && (
                    <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 z-50 py-2 overflow-hidden animate-in fade-in zoom-in duration-200">
                      <button className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all">
                        <EyeOff size={18} />
                        I'm not interested in this
                      </button>
                      <button className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all">
                        <Flag size={18} />
                        Report post
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-6">
                <div className="flex flex-col sm:flex-row gap-6">
                  {/* Thumbnail */}
                  <div className="w-32 h-44 flex-shrink-0 bg-gray-50 dark:bg-gray-900 rounded-lg overflow-hidden border dark:border-gray-700 shadow-sm">
                    <img src={post.thumbnail || getDocumentImage(post.id)} alt="Paper thumbnail" className="w-full h-full object-cover" />
                  </div>

                  {/* Content */}
                  <div className="flex-grow min-w-0">
                    <Link to={`/documents/${post.id}`}>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white leading-tight mb-1 hover:text-primary cursor-pointer transition-colors line-clamp-2">
                        {post.title}
                        </h3>
                    </Link>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                      by <Link to={post.user?.username ? `/profile/${post.user.username}` : `/user/${post.user?.id}`} className="font-bold text-gray-900 dark:text-gray-200 hover:underline hover:text-primary transition-colors">{post.user?.name}</Link>
                    </p>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
                        {post.category?.name} • {post.user?.academic_title || post.university?.short_name || post.university?.name || 'Academic Institution'}
                    </p>

                    <p className="text-sm text-gray-500 dark:text-gray-500 line-clamp-3 mb-4 leading-relaxed">
                      {post.description || "Access the full paper for detailed academic research and peer analysis."} <Link to={`/documents/${post.id}`} className="text-primary font-bold cursor-pointer hover:underline">Read more</Link>
                    </p>

                    <div className="flex flex-wrap gap-2">
                      <Link to={`/documents/${post.id}`} className="flex items-center gap-1.5 px-4 py-2 border dark:border-gray-600 rounded-lg text-sm font-bold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all">
                        View Full Paper <ArrowUpRight size={14} />
                      </Link>
                      <button
                        onClick={() => handleToggleFavorite(post.id)}
                        className={`flex items-center gap-1.5 px-4 py-2 border rounded-lg text-sm font-bold transition-all ${
                            post.is_favorited
                            ? 'bg-primary/10 border-primary text-primary'
                            : 'dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'
                        }`}
                      >
                        <Bookmark size={14} fill={post.is_favorited ? "currentColor" : "none"} />
                        {post.is_favorited ? 'Saved' : 'Save to library'}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Social Actions */}
                <div className="mt-6 pt-4 border-t dark:border-gray-700 flex items-center gap-4 flex-wrap">
                  {/* Like Button Section */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleLike(post.id)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                        post.is_liked
                          ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/20'
                          : 'bg-gray-50 dark:bg-gray-900 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                      }`}
                    >
                      <ThumbsUp size={16} fill={post.is_liked ? "currentColor" : "none"} />
                      {post.is_liked ? 'Liked' : 'Like'}
                      {(post.likes_count || 0) > 0 && (
                        <span className={`ml-1 text-xs ${post.is_liked ? 'text-white' : 'text-gray-500'}`}>
                          {post.likes_count}
                        </span>
                      )}
                    </button>
                  </div>

                  {/* Comment Button */}
                  <button
                    onClick={() => handleToggleComments(post.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                      expandedComments === post.id
                        ? 'bg-primary text-white'
                        : 'bg-gray-50 dark:bg-gray-900 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    <MessageCircle size={16} />
                    Comment
                    {(post.comments_count || 0) > 0 && <span className="ml-0.5 text-xs opacity-70">{post.comments_count}</span>}
                  </button>

                  {/* Share Button */}
                  <button
                    onClick={() => handleShare(post.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all bg-gray-50 dark:bg-gray-900 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 ${sharedPostId === post.id ? 'text-teal-600' : ''}`}
                  >
                    {sharedPostId === post.id ? <Check size={16} /> : <Share2 size={16} />}
                    {sharedPostId === post.id ? 'Copied' : 'Share'}
                  </button>

                  {/* Author & Follow */}
                  <div className="ml-auto flex items-center gap-3">
                     <Link to={post.user?.username ? `/profile/${post.user.username}` : `/user/${post.user?.id}`} className="flex items-center gap-2 group">
                        <div className="w-8 h-8 rounded-full overflow-hidden border dark:border-gray-700 bg-gray-100 flex items-center justify-center shrink-0">
                          {post.user?.avatar ? (
                              <img src={post.user.avatar} alt={post.user.name} className="w-full h-full object-cover" />
                          ) : (
                              <span className="text-[10px] font-bold text-primary">{post.user?.name?.[0]}</span>
                          )}
                        </div>
                        <div className="hidden sm:block min-w-0">
                           <p className="text-xs font-bold text-gray-900 dark:text-gray-200 group-hover:text-primary transition-colors truncate max-w-[100px]">{post.user?.name}</p>
                           <p className="text-[10px] text-gray-400 font-bold uppercase truncate">
                             {post.user?.academic_title || 'Uploader'}
                           </p>
                        </div>
                     </Link>
                     <FollowButton userId={post.user?.id} userName={post.user?.name} variant="secondary" />
                  </div>
                </div>

                {/* Expanded Comments Section */}
                {expandedComments === post.id && (
                  <div className="mt-6 pt-6 border-t dark:border-gray-700 animate-in fade-in slide-in-from-top-4 duration-300">
                    {token ? (
                        <div className="flex gap-3 mb-8">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-[10px] shrink-0 overflow-hidden">
                                {user?.avatar ? <img src={user.avatar} className="w-full h-full object-cover" /> : user?.name?.[0] || 'U'}
                            </div>
                            <div className="flex-grow relative">
                                <input
                                    type="text"
                                    placeholder="Write a comment..."
                                    value={newCommentText[post.id] || ''}
                                    onChange={(e) => setNewCommentText(prev => ({ ...prev, [post.id]: e.target.value }))}
                                    onKeyDown={(e) => e.key === 'Enter' && handleAddComment(post.id)}
                                    className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all dark:text-white"
                                />
                                <button
                                    onClick={() => handleAddComment(post.id)}
                                    disabled={!newCommentText[post.id]?.trim()}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 text-primary disabled:opacity-30"
                                >
                                    <Send size={16} />
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="mb-6 p-4 bg-slate-50 dark:bg-slate-900 rounded-xl text-center">
                            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Login to participate in the discussion</p>
                        </div>
                    )}

                    {!postComments[post.id] ? (
                        <div className="flex justify-center py-4">
                            <Loader2 className="animate-spin text-primary" size={20} />
                        </div>
                    ) : (
                        <CommentSection comments={postComments[post.id]} onUpdate={() => fetchCommentsForPost(post.id)} />
                    )}
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-12 text-center">
            <div className="w-16 h-16 bg-gray-50 dark:bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search size={32} className="text-gray-300" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">No papers found</h3>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Try adjusting your search terms to find what you're looking for.</p>
            <button
              onClick={() => setSearchQuery('')}
              className="mt-6 text-primary font-bold hover:underline"
            >
              Clear search
            </button>
          </div>
        )}
        </div>

        {/* Right Sidebar - Recommendations */}
        <div className="hidden lg:block lg:col-span-4 space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-gray-900 dark:text-white">Continue Reading</h3>
              <Link to="#" className="text-[10px] font-bold uppercase tracking-widest text-primary hover:underline">View all</Link>
            </div>

            <div className="space-y-6">
              {continueReading.length > 0 ? continueReading.map((item) => (
                <div key={item.id} className="group cursor-pointer" onClick={() => navigate(`/documents/${item.id}`)}>
                  <h4 className="text-sm font-bold text-gray-900 dark:text-gray-200 leading-tight group-hover:text-primary transition-colors line-clamp-2 mb-1">
                    {item.title}
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">by {item.user?.name}</p>
                </div>
              )) : (
                <p className="text-xs text-gray-400">No recent activity found.</p>
              )}
            </div>
          </div>

          <div className="bg-gradient-to-br from-primary to-primary-dark p-6 rounded-2xl text-white shadow-lg shadow-primary/20">
             <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4">
               <FileText size={24} />
             </div>
             <h3 className="text-lg font-extrabold mb-1 tracking-tight">Expand your reach</h3>
             <p className="text-xs opacity-90 mb-6 leading-relaxed">Upload your papers and connect with 100k+ students in Cambodia.</p>
             <button onClick={() => navigate('/upload')} className="w-full py-3 bg-white text-primary rounded-xl font-bold text-sm shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98]">
               Upload Now
             </button>
          </div>
        </div>

      </div>
    </div>
  )
}
