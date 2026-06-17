import {
  FileText,
  ThumbsUp,
  MessageSquare,
  MoreHorizontal,
  Bookmark,
  User,
  Bell,
  Mail,
  Users,
  PlusCircle,
  ArrowUpRight,
  Search,
  EyeOff,
  Flag,
  Send
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { useState, useRef, useEffect } from 'react'

const MOCK_COMMENTS = [
  {
    id: 1,
    user: { name: 'Sokea M.', avatar: 'https://i.pravatar.cc/150?u=sokea' },
    text: 'Great findings! The role of mitochondria in cancer is often overlooked.',
    time: '2h ago',
    likes: 4,
    replies: [
      { id: 101, user: { name: 'Jacques P.', avatar: 'https://i.pravatar.cc/150?u=jacques' }, text: 'Indeed, metabolic flexibility is key.', time: '1h ago' }
    ]
  }
]

const TRENDING_POSTS = [
  {
    id: 1,
    title: 'Warburg and Beyond: The Power of Mitochondrial Metabolism to Collaborate or Replace Fermentative Glycolysis in Cancer',
    author: 'Jacques Pouysségur',
    source: 'Cancers',
    abstract: 'A defining hallmark of tumor phenotypes is uncontrolled cell proliferation, while fermentative glycolysis has long been considered as one of the major metabolic pathway...',
    thumbnail: 'https://images.unsplash.com/photo-1532187875605-1ef6c237ddc4?auto=format&fit=crop&q=80&w=400&h=500',
    uploader: {
      name: 'Jacques P.',
      avatar: 'https://i.pravatar.cc/150?u=jacques',
      id: 'jacques'
    },
    likes: 124,
    comments: 12,
    isLiked: false
  },
  {
    id: 2,
    title: 'Mitochondrial gateways to cancer',
    author: 'Oliver Kepp',
    source: '2010, Molecular Aspects of Medicine',
    abstract: 'Abstract: Mitochondria are required for cellular survival, yet can also orchestrate cell death. The peculiar biochemical properties of these organelles, which are intimately linked...',
    thumbnail: 'https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&q=80&w=400&h=500',
    uploader: {
      name: 'Oliver K.',
      avatar: 'https://i.pravatar.cc/150?u=oliver',
      id: 'oliver'
    },
    likes: 89,
    comments: 5,
    isLiked: true
  }
]

const CONTINUE_READING = [
  { id: 1, title: 'Why High Achievers Can\'t Relax When Rest Feels Unsafe to the Nervous System', author: 'Sogol (SJ) Johnson' },
  { id: 2, title: 'Intercellular Communication in Tumor Biology: A Role for Mitochondrial Transfer', author: 'Michael Berridge' },
  { id: 3, title: 'Revisiting concepts of mitochondrial transport and energy metabolism in health...', author: 'SALVATORE PASSARELLA' },
]

export default function Trending() {
  const [posts, setPosts] = useState(TRENDING_POSTS)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeMenu, setActiveMenu] = useState<number | null>(null)
  const [expandedComments, setExpandedComments] = useState<number | null>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveMenu(null)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const toggleLike = (postId: number) => {
    setPosts(posts.map(post =>
      post.id === postId
        ? { ...post, isLiked: !post.isLiked, likes: post.isLiked ? post.likes - 1 : post.likes + 1 }
        : post
    ))
  }

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.author.toLowerCase().includes(searchQuery.toLowerCase())
  )

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

          {filteredPosts.length > 0 ? (
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
                <div className="flex gap-6">
                  {/* Thumbnail */}
                  <div className="w-32 h-44 flex-shrink-0 bg-gray-50 dark:bg-gray-900 rounded-lg overflow-hidden border dark:border-gray-700 shadow-sm">
                    <img src={post.thumbnail} alt="Paper thumbnail" className="w-full h-full object-cover" />
                  </div>

                  {/* Content */}
                  <div className="flex-grow min-w-0">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white leading-tight mb-1 hover:text-primary cursor-pointer transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                      by <Link to={`/profile/${post.uploader.id}`} className="font-bold text-gray-900 dark:text-gray-200 hover:underline hover:text-primary transition-colors">{post.author}</Link>
                    </p>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">{post.source}</p>

                    <p className="text-sm text-gray-500 dark:text-gray-500 line-clamp-3 mb-4 leading-relaxed">
                      {post.abstract} <span className="text-primary font-bold cursor-pointer hover:underline">Read more</span>
                    </p>

                    <div className="flex flex-wrap gap-2">
                      <Link to={`/documents/${post.id}`} className="flex items-center gap-1.5 px-4 py-2 border dark:border-gray-600 rounded-lg text-sm font-bold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all">
                        View Full Paper <ArrowUpRight size={14} />
                      </Link>
                      <button className="flex items-center gap-1.5 px-4 py-2 border dark:border-gray-600 rounded-lg text-sm font-bold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all">
                        <Bookmark size={14} /> Save to library
                      </button>
                    </div>
                  </div>
                </div>

                {/* Social Actions */}
                <div className="mt-6 pt-4 border-t dark:border-gray-700 flex items-center gap-6">
                  <button
                    onClick={() => toggleLike(post.id)}
                    className={`flex items-center gap-2 text-sm font-bold transition-all ${
                      post.isLiked ? 'text-primary scale-105' : 'text-gray-500 dark:text-gray-400 hover:text-primary'
                    }`}
                  >
                    <ThumbsUp size={18} fill={post.isLiked ? 'currentColor' : 'none'} />
                    Like
                    {post.likes > 0 && <span className="ml-0.5 text-xs opacity-70">{post.likes}</span>}
                  </button>
                  <button
                    onClick={() => setExpandedComments(expandedComments === post.id ? null : post.id)}
                    className={`flex items-center gap-2 text-sm font-bold transition-all ${
                      expandedComments === post.id ? 'text-primary' : 'text-gray-500 dark:text-gray-400 hover:text-primary'
                    }`}
                  >
                    <MessageSquare size={18} />
                    Comment
                    {post.comments > 0 && <span className="ml-0.5 text-xs opacity-70">{post.comments}</span>}
                  </button>

                  <div className="ml-auto flex items-center gap-3">
                     <Link to={`/profile/${post.uploader.id}`} className="flex items-center gap-2 group">
                        <div className="w-8 h-8 rounded-full overflow-hidden border dark:border-gray-700">
                          <img src={post.uploader.avatar} alt={post.uploader.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="hidden sm:block">
                           <p className="text-xs font-bold text-gray-900 dark:text-gray-200 group-hover:text-primary transition-colors">{post.uploader.name}</p>
                           <p className="text-[10px] text-gray-400 font-bold uppercase">Uploader</p>
                        </div>
                     </Link>
                     <button className="px-3 py-1 bg-primary text-white text-xs font-bold rounded-full hover:bg-primary-dark transition-all">
                       Follow
                     </button>
                  </div>
                </div>

                {/* Expanded Comments Section */}
                {expandedComments === post.id && (
                  <div className="mt-6 pt-6 border-t dark:border-gray-700 animate-in fade-in slide-in-from-top-4 duration-300">
                    <div className="flex gap-3 mb-8">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs shrink-0">
                        SK
                      </div>
                      <div className="flex-grow relative">
                        <input
                          type="text"
                          placeholder="Write a comment..."
                          className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                        />
                        <button className="absolute right-2 top-1/2 -translate-y-1/2 text-primary">
                          <Send size={16} />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-6">
                      {MOCK_COMMENTS.map((comment) => (
                        <div key={comment.id} className="space-y-4">
                          <div className="flex gap-3">
                            <img src={comment.user.avatar} alt={comment.user.name} className="w-8 h-8 rounded-full" />
                            <div className="flex-grow">
                              <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-3">
                                <h4 className="text-xs font-bold text-gray-900 dark:text-white mb-1">{comment.user.name}</h4>
                                <p className="text-sm text-gray-700 dark:text-gray-300">{comment.text}</p>
                              </div>
                              <div className="flex items-center gap-4 mt-2 px-2">
                                <button className="text-[10px] font-bold text-gray-500 hover:text-primary uppercase tracking-wider">Like</button>
                                <button className="text-[10px] font-bold text-gray-500 hover:text-primary uppercase tracking-wider">Reply</button>
                                <span className="text-[10px] text-gray-400 uppercase font-medium">{comment.time}</span>
                              </div>
                            </div>
                          </div>

                          {/* Replies */}
                          {comment.replies.map((reply) => (
                            <div key={reply.id} className="flex gap-3 ml-11">
                              <img src={reply.user.avatar} alt={reply.user.name} className="w-6 h-6 rounded-full" />
                              <div className="flex-grow">
                                <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-3">
                                  <h4 className="text-xs font-bold text-gray-900 dark:text-white mb-1">{reply.user.name}</h4>
                                  <p className="text-sm text-gray-700 dark:text-gray-300">{reply.text}</p>
                                </div>
                                <div className="flex items-center gap-4 mt-2 px-2">
                                  <button className="text-[10px] font-bold text-gray-500 hover:text-primary uppercase tracking-wider">Like</button>
                                  <button className="text-[10px] font-bold text-gray-500 hover:text-primary uppercase tracking-wider">Reply</button>
                                  <span className="text-[10px] text-gray-400 uppercase font-medium">{reply.time}</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
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
              {CONTINUE_READING.map((item) => (
                <div key={item.id} className="group cursor-pointer">
                  <h4 className="text-sm font-bold text-gray-900 dark:text-gray-200 leading-tight group-hover:text-primary transition-colors line-clamp-2 mb-1">
                    {item.title}
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">{item.author}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-primary to-primary-dark p-6 rounded-2xl text-white shadow-lg shadow-primary/20">
             <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4">
               <FileText size={24} />
             </div>
             <h3 className="text-lg font-extrabold mb-1 tracking-tight">Expand your reach</h3>
             <p className="text-xs opacity-90 mb-6 leading-relaxed">Upload your papers and connect with 100k+ students in Cambodia.</p>
             <button className="w-full py-3 bg-white text-primary rounded-xl font-bold text-sm shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98]">
               Upload Now
             </button>
          </div>
        </div>

      </div>
    </div>
  )
}
