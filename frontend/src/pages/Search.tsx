import { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import {
  Filter,
  Search as SearchIcon,
  SlidersHorizontal,
  ChevronDown,
  FileText,
  ThumbsUp,
  Eye,
  ArrowUpRight,
  MoreHorizontal,
  Image as ImageIcon,
  User as UserIcon,
  UploadCloud,
  MessageSquare,
  Heart,
  Send,
  CornerDownRight
} from 'lucide-react'

/**
 * Search Page
 * Designed to provide a clean, Academia-inspired interface for filtering
 * academic documents and research papers.
 */
export default function Search() {
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q') || ''

  // UI State
  const [activeTab, setActiveTab] = useState('all')
  const [showFilters, setShowFilters] = useState(true)
  const [expandedComments, setExpandedComments] = useState<number | null>(null)
  const [newComment, setNewComment] = useState('')
  const [replyingTo, setReplyingTo] = useState<{commentId: number, name: string} | null>(null)

  // Mock results state to allow interactivity
  const [allResults, setAllResults] = useState([
    {
      id: 1,
      type: 'document',
      title: 'Chemistry Grade 12 - Chapter 1 Summary: Atomic Structure and Bonding',
      school: 'Preah Sisowath High School',
      category: 'Summaries',
      author: 'Sovann R.',
      uploader: { id: 'sovann', avatar: 'https://i.pravatar.cc/150?u=sovann' },
      likes: 120,
      views: '2.4k',
      isLiked: false,
      abstract: 'A comprehensive summary of the first chapter of Grade 12 Chemistry, covering periodic trends, orbital hybridization, and molecular geometry...',
      thumbnail: 'https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6?auto=format&fit=crop&q=80&w=200&h=280',
      comments: [
        { id: 101, user: 'Dara S.', avatar: 'https://i.pravatar.cc/150?u=dara', text: 'This summary is amazing! Helped me pass my quiz.', time: '2h ago', replies: [] },
        { id: 102, user: 'Sophea K.', avatar: 'https://i.pravatar.cc/150?u=sophea', text: 'Could you add the practice questions too?', time: '5h ago', replies: [
          { id: 103, user: 'Sovann R.', avatar: 'https://i.pravatar.cc/150?u=sovann', text: 'Sure! I will upload them tomorrow.', time: '1h ago' }
        ] }
      ]
    },
    {
      id: 2,
      type: 'document',
      title: 'Physics National Exam Prep 2024: Mechanics and Thermodynamics',
      school: 'Bak Touk High School',
      category: 'Exam Prep',
      author: 'Vibol M.',
      uploader: { id: 'vibol', avatar: 'https://i.pravatar.cc/150?u=vibol' },
      likes: 85,
      views: '1.8k',
      isLiked: true,
      abstract: 'Targeted preparation for the upcoming national exam. Includes previous year questions, formula sheets, and common mistakes to avoid in mechanics...',
      thumbnail: '',
      comments: []
    },
    {
      id: 3,
      type: 'book',
      title: 'Advanced Mathematics for Grade 12',
      author: 'Dr. Kim S.',
      school: 'Ministry of Education',
      category: 'Textbooks',
      uploader: { id: 'admin', avatar: 'https://i.pravatar.cc/150?u=admin' },
      likes: 450,
      views: '12k',
      isLiked: false,
      abstract: 'Official textbook for high school students. Covers calculus, statistics, and advanced geometry with solved examples.',
      thumbnail: '',
      comments: [
        { id: 301, user: 'Admin', avatar: 'https://i.pravatar.cc/150?u=admin', text: 'New digital edition updated.', time: '1d ago', replies: [] }
      ]
    },
    {
      id: 4,
      type: 'author',
      title: 'Dr. Sarah Connor',
      school: 'Royal University of Phnom Penh',
      category: 'Authors',
      author: 'Sarah Connor',
      uploader: { id: 'sarah', avatar: 'https://i.pravatar.cc/150?u=sarah' },
      likes: 1200,
      views: '45k',
      isLiked: false,
      abstract: 'Senior researcher and professor specializing in Cambodian educational reforms and digital literacy.',
      thumbnail: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200&h=200',
      comments: []
    }
  ])

  const handleLike = (id: number) => {
    setAllResults(prev => prev.map(item => {
      if (item.id === id) {
        return {
          ...item,
          likes: item.isLiked ? item.likes - 1 : item.likes + 1,
          isLiked: !item.isLiked
        }
      }
      return item
    }))
  }

  const handleAddComment = (postId: number) => {
    if (!newComment.trim()) return;

    setAllResults(prev => prev.map(post => {
      if (post.id === postId) {
        if (replyingTo) {
          // Add as reply
          return {
            ...post,
            comments: post.comments.map(c => {
              if (c.id === replyingTo.commentId) {
                return {
                  ...c,
                  replies: [...(c.replies || []), {
                    id: Date.now(),
                    user: 'You',
                    avatar: 'https://i.pravatar.cc/150?u=you',
                    text: newComment,
                    time: 'Just now'
                  }]
                }
              }
              return c;
            })
          }
        } else {
          // Add as top-level comment
          return {
            ...post,
            comments: [...post.comments, {
              id: Date.now(),
              user: 'You',
              avatar: 'https://i.pravatar.cc/150?u=you',
              text: newComment,
              time: 'Just now',
              replies: []
            }]
          }
        }
      }
      return post;
    }))
    setNewComment('')
    setReplyingTo(null)
  }

  const results = allResults.filter(res => {
    const tab = activeTab.replace(' results', '');
    if (tab === 'all') return true;
    if (tab === 'documents') return res.type === 'document';
    if (tab === 'books') return res.type === 'book';
    if (tab === 'authors') return res.type === 'author';
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      {/* Search Header */}
      <div className="mb-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">
              {query ? `Search results for "${query}"` : 'Explore Documents'}
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1 font-medium">
              Discover {results.length} relevant papers and study materials
            </p>
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl text-sm font-bold text-gray-600 dark:text-gray-300 hover:text-primary transition-all shadow-sm md:hidden"
          >
            <Filter size={18} />
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-10">
        {/* Filters Sidebar - Modern & Minimal */}
        {showFilters && (
          <aside className="w-full lg:w-64 space-y-8 shrink-0 animate-in fade-in slide-in-from-left-4 duration-500">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-[32px] border border-gray-100 dark:border-gray-700 shadow-sm">
              <h3 className="font-black text-xs text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-8">Refine By</h3>

              <div className="space-y-10">
                {/* Category Filter */}
                <div>
                  <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-4 flex items-center justify-between">
                    Category <ChevronDown size={14} className="text-gray-300" />
                  </h4>
                  <div className="space-y-3">
                    {['Lecture Notes', 'Summaries', 'Exam Prep', 'Textbooks'].map(cat => (
                      <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                        <input type="checkbox" className="w-4 h-4 rounded border-gray-200 dark:border-gray-600 text-primary focus:ring-primary/20 transition-all bg-transparent" />
                        <span className="text-sm text-gray-500 dark:text-gray-400 group-hover:text-primary transition-colors">{cat}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Level Filter */}
                <div>
                  <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-4 flex items-center justify-between">
                    Education Level <ChevronDown size={14} className="text-gray-300" />
                  </h4>
                  <div className="space-y-3">
                    {['Grade 10', 'Grade 11', 'Grade 12', 'University'].map(lvl => (
                      <label key={lvl} className="flex items-center gap-3 cursor-pointer group">
                        <input type="checkbox" className="w-4 h-4 rounded border-gray-200 dark:border-gray-600 text-primary focus:ring-primary/20 transition-all bg-transparent" />
                        <span className="text-sm text-gray-500 dark:text-gray-400 group-hover:text-primary transition-colors">{lvl}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Year Filter */}
                <div>
                  <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-4 flex items-center justify-between">
                    Release Year <ChevronDown size={14} className="text-gray-300" />
                  </h4>
                  <select className="w-full bg-gray-50 dark:bg-gray-900 border-none rounded-xl px-4 py-2.5 text-xs font-bold text-gray-500 dark:text-gray-400 focus:ring-2 focus:ring-primary/10 transition-all appearance-none">
                    <option>Any Year</option>
                    <option>2024</option>
                    <option>2023</option>
                    <option>2022</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Support Widget */}
            <div className="bg-primary/5 dark:bg-primary/10 p-8 rounded-[32px] border border-primary/10">
               <h4 className="font-bold text-gray-900 dark:text-white text-sm mb-2">Can't find it?</h4>
               <p className="text-xs text-gray-500 dark:text-gray-400 mb-4 leading-relaxed">Let our community help you find the specific study material you need.</p>
               <Link to="/request-book" className="text-xs font-black text-primary hover:underline uppercase tracking-widest">Request Paper</Link>
            </div>
          </aside>
        )}

        {/* Results Feed */}
        <main className="flex-grow space-y-6">
          {/* Tab Navigation */}
          <div className="flex items-center gap-6 border-b dark:border-gray-800 overflow-x-auto pb-px">
            {['All Results', 'Documents', 'Books', 'Authors'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab.toLowerCase())}
                className={`pb-4 text-sm font-bold transition-all relative whitespace-nowrap ${
                  activeTab === tab.toLowerCase().replace(' results', '') || (activeTab === 'all' && tab === 'All Results')
                    ? 'text-primary'
                    : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'
                }`}
              >
                {tab}
                {(activeTab === tab.toLowerCase().replace(' results', '') || (activeTab === 'all' && tab === 'All Results')) && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
                )}
              </button>
            ))}
            <div className="ml-auto flex items-center gap-2 text-[11px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest pb-4">
              <SlidersHorizontal size={14} />
              Sort by: <span className="text-gray-900 dark:text-gray-200 cursor-pointer hover:text-primary transition-colors">Relevance</span>
            </div>
          </div>

          {/* Results List */}
          <div className="space-y-6">
            {results.map(doc => (
              <div key={doc.id} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden hover:border-primary/30 transition-all group">
                <div className="p-6">
                  <div className="flex gap-6">
                    {/* Thumbnail placeholder - Interactive for missing images */}
                    <div className={`w-24 h-32 flex-shrink-0 bg-gray-50 dark:bg-gray-900 rounded-lg overflow-hidden border dark:border-gray-700 shadow-sm flex items-center justify-center relative group/img ${doc.type === 'author' ? 'rounded-full h-24 w-24 my-4' : ''}`}>
                      {doc.thumbnail ? (
                        <img src={doc.thumbnail} alt={doc.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <div className="flex flex-col items-center gap-1.5 text-gray-300 dark:text-gray-600 p-2 text-center">
                          {doc.type === 'author' ? <UserIcon size={24} /> : <ImageIcon size={24} />}
                          <span className="text-[8px] font-black uppercase tracking-widest">{doc.type}</span>
                          <div className="absolute inset-0 bg-primary/0 group-hover/img:bg-primary/5 flex items-center justify-center transition-all cursor-pointer">
                            <UploadCloud size={18} className="opacity-0 group-hover/img:opacity-100 text-primary transition-opacity" />
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex-grow min-w-0">
                      <div className="flex justify-between items-start gap-4 mb-1">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white leading-tight hover:text-primary transition-colors cursor-pointer line-clamp-2">
                          {doc.title}
                        </h3>
                        <button className="text-gray-300 dark:text-gray-600 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                          <MoreHorizontal size={20} />
                        </button>
                      </div>

                      <div className="flex items-center gap-3 mb-3">
                        <Link to={`/profile/${doc.uploader.id}`} className="flex items-center gap-1.5 hover:text-primary transition-colors">
                           <div className="w-5 h-5 rounded-full overflow-hidden">
                             <img src={doc.uploader.avatar} alt={doc.author} className="w-full h-full object-cover" />
                           </div>
                           <span className="text-xs font-bold text-gray-600 dark:text-gray-300">{doc.author}</span>
                        </Link>
                        <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">•</span>
                        <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">{doc.school}</span>
                      </div>

                      <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed mb-4">
                        {doc.abstract}
                      </p>

                      <div className="flex items-center gap-6">
                        <Link to={doc.type === 'author' ? `/profile/${doc.uploader.id}` : `/documents/${doc.id}`} className="flex items-center gap-1.5 px-4 py-2 bg-primary text-white rounded-xl text-xs font-bold hover:bg-primary-dark transition-all shadow-md shadow-primary/10">
                          {doc.type === 'author' ? 'View Profile' : 'View Full Paper'} <ArrowUpRight size={14} />
                        </Link>
                        <div className="flex items-center gap-4 text-gray-400 dark:text-gray-600">
                          <button
                            onClick={() => handleLike(doc.id)}
                            className={`flex items-center gap-1.5 text-[11px] font-bold transition-colors hover:text-primary ${doc.isLiked ? 'text-primary' : ''}`}
                          >
                            <Heart size={16} className={doc.isLiked ? 'fill-primary' : ''} />
                            {doc.likes}
                          </button>
                          <button
                            onClick={() => setExpandedComments(expandedComments === doc.id ? null : doc.id)}
                            className={`flex items-center gap-1.5 text-[11px] font-bold hover:text-primary transition-colors ${expandedComments === doc.id ? 'text-primary' : ''}`}
                          >
                            <MessageSquare size={16} />
                            {doc.comments.length + doc.comments.reduce((acc: number, c: any) => acc + (c.replies?.length || 0), 0)}
                          </button>
                          <span className="flex items-center gap-1.5 text-[11px] font-bold">
                            <Eye size={16} />
                            {doc.views}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Collapsible Comments Section */}
                  {expandedComments === doc.id && (
                    <div className="mt-8 pt-8 border-t dark:border-gray-700 animate-in slide-in-from-top-2 duration-300">
                      <h4 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-6">Comments</h4>

                      <div className="space-y-6 mb-8">
                        {doc.comments.map((comment: any) => (
                          <div key={comment.id} className="space-y-4">
                            <div className="flex gap-3">
                              <Link to={`/profile/${comment.user.toLowerCase().replace(' ', '')}`}>
                                <img src={comment.avatar} alt="" className="w-8 h-8 rounded-full flex-shrink-0 hover:ring-2 hover:ring-primary/20 transition-all" />
                              </Link>
                              <div className="flex-grow">
                                <div className="bg-gray-50 dark:bg-gray-900/50 p-3 rounded-2xl">
                                  <div className="flex justify-between items-center mb-1">
                                    <Link to={`/profile/${comment.user.toLowerCase().replace(' ', '')}`} className="text-xs font-bold text-gray-900 dark:text-white hover:text-primary transition-colors">
                                      {comment.user}
                                    </Link>
                                    <span className="text-[10px] text-gray-400">{comment.time}</span>
                                  </div>
                                  <p className="text-sm text-gray-600 dark:text-gray-400">{comment.text}</p>
                                </div>
                                <button
                                  onClick={() => setReplyingTo({ commentId: comment.id, name: comment.user })}
                                  className="text-[10px] font-bold text-gray-400 hover:text-primary mt-1 ml-2 transition-colors"
                                >
                                  Reply
                                </button>
                              </div>
                            </div>

                            {/* Replies */}
                            {comment.replies?.map((reply: any) => (
                              <div key={reply.id} className="flex gap-3 ml-10">
                                <CornerDownRight size={14} className="text-gray-300 mt-2" />
                                <Link to={`/profile/${reply.user.toLowerCase().replace(' ', '')}`}>
                                  <img src={reply.avatar} alt="" className="w-6 h-6 rounded-full flex-shrink-0 hover:ring-2 hover:ring-primary/20 transition-all" />
                                </Link>
                                <div className="flex-grow bg-gray-50 dark:bg-gray-900/50 p-2.5 rounded-xl">
                                  <div className="flex justify-between items-center mb-0.5">
                                    <Link to={`/profile/${reply.user.toLowerCase().replace(' ', '')}`} className="text-xs font-bold text-gray-900 dark:text-white hover:text-primary transition-colors">
                                      {reply.user}
                                    </Link>
                                    <span className="text-[10px] text-gray-400">{reply.time}</span>
                                  </div>
                                  <p className="text-xs text-gray-600 dark:text-gray-400">{reply.text}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        ))}
                      </div>

                      {/* Add Comment Input */}
                      <div className="relative">
                        {replyingTo && (
                          <div className="flex items-center justify-between bg-primary/5 px-3 py-1.5 rounded-t-lg border-x border-t border-primary/10">
                            <span className="text-[10px] font-bold text-primary">Replying to {replyingTo.name}</span>
                            <button onClick={() => setReplyingTo(null)} className="text-[10px] font-bold text-gray-400 hover:text-red-500">Cancel</button>
                          </div>
                        )}
                        <div className="flex items-center gap-3">
                          <img src="https://i.pravatar.cc/150?u=you" alt="" className="w-8 h-8 rounded-full" />
                          <div className="flex-grow relative">
                            <input
                              type="text"
                              value={newComment}
                              onChange={(e) => setNewComment(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && handleAddComment(doc.id)}
                              placeholder={replyingTo ? "Write a reply..." : "Add a comment..."}
                              className={`w-full bg-gray-50 dark:bg-gray-900 border-gray-100 dark:border-gray-700 focus:ring-primary/20 focus:border-primary text-sm ${replyingTo ? 'rounded-b-xl rounded-t-none' : 'rounded-xl'}`}
                            />
                            <button
                              onClick={() => handleAddComment(doc.id)}
                              className="absolute right-2 top-1/2 -translate-y-1/2 text-primary hover:text-primary-dark p-1.5 transition-colors"
                            >
                              <Send size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  )
}
