import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  BookOpen, Download, Share2, Bookmark, ArrowLeft,
  ShieldCheck, Lock, FileText, AlertCircle, Check, MessageSquare, Send, CornerDownRight, User as UserIcon, X
} from 'lucide-react'
import api from '@/api'
import { getImageUrl } from '@/utils/image'

export default function BookDetail() {
  const { slug } = useParams()
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [userStatus, setUserStatus] = useState<any>(null)
  const [isSaved, setIsSaved] = useState(false)
  const [showCopyFeedback, setShowCopyFeedback] = useState(false)
  const [commentContent, setCommentContent] = useState('')
  const [submittingComment, setSubmittingComment] = useState(false)
  const [replyTo, setReplyTo] = useState<any>(null)
  const [currentUser, setCurrentUser] = useState<any>(null)

  const fetchData = async () => {
    setLoading(true)
    try {
      const [bookRes, statusRes, profileRes] = await Promise.all([
        api.get(`/books/${slug}`),
        api.get('/subscription/status'),
        api.get('/profile').catch(() => ({ data: null }))
      ])
      setData(bookRes.data)
      setUserStatus(statusRes.data)
      setIsSaved(bookRes.data.is_favorited)
      setCurrentUser(profileRes.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!commentContent.trim() || !currentUser) return

    setSubmittingComment(true)
    try {
        await api.post(`/books/${data.book.id}/comment`, {
            content: commentContent,
            parent_id: replyTo?.id || null
        })
        setCommentContent('')
        setReplyTo(null)
        fetchData() // Refresh to show new comment
    } catch (err) {
        console.error('Failed to post comment', err)
    } finally {
        setSubmittingComment(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [slug])

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
        <div className="w-10 h-10 border-4 border-emerald-900/10 border-t-emerald-900 rounded-full animate-spin mb-4"></div>
        <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-900/40">Accessing Archive...</p>
      </div>
    )
  }

  if (!data?.book) return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4 text-center">
        <AlertCircle size={44} className="text-gray-200 mb-4" />
        <h2 className="text-xl font-black text-gray-900">Resource Not Found</h2>
        <p className="text-gray-500 text-sm mt-1">The requested node is missing or restricted.</p>
        <Link to="/books" className="mt-6 px-6 py-3 bg-gray-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest">Return to Library</Link>
    </div>
  )

  const { book, related } = data
  const isPremiumLocked = book.book_type === 'premium' && !userStatus?.is_premium

  const handleDownload = async () => {
    if (isPremiumLocked) return
    window.open(`${import.meta.env.VITE_API_URL || ''}/api/books/${book.id}/download`, '_blank')
  }

  const handleSave = async () => {
    try {
        const res = await api.post('/favorites/toggle', { book_id: book.id })
        setIsSaved(res.data.favorited)
    } catch (err) {
        console.error('Failed to save', err)
    }
  }

  const handleShare = async () => {
    const shareData = {
        title: book.title,
        text: `Check out this book on DocuLink: ${book.title}`,
        url: window.location.href
    }

    if (navigator.share) {
        try {
            await navigator.share(shareData)
        } catch (err) {
            console.log('Share cancelled')
        }
    } else {
        navigator.clipboard.writeText(window.location.href)
        setShowCopyFeedback(true)
        setTimeout(() => setShowCopyFeedback(false), 2000)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50/50 font-sans pb-16 antialiased">
      {/* Header Container */}
      <div className="bg-white border-b border-gray-100 pt-20 pb-10">
        <div className="container mx-auto px-6 max-w-6xl">
            <Link to="/books" className="inline-flex items-center gap-2 text-gray-400 hover:text-emerald-900 transition-colors text-[10px] font-black uppercase tracking-widest mb-8 group">
                <ArrowLeft size={13} className="group-hover:-translate-x-0.5 transition-transform" /> Return to Archive
            </Link>

            {/* Perfect intermediate width pairing (240px layout) */}
            <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-10 items-start">
                {/* Book Cover Element */}
                <div className="space-y-4 max-w-[240px] mx-auto md:mx-0">
                    <div className="aspect-[3/4] rounded-[2rem] overflow-hidden shadow-2xl border border-gray-100 relative bg-gray-50 group">
                        <img src={getImageUrl(book.cover_image)} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={book.title} />
                        {book.book_type === 'premium' && (
                            <div className="absolute top-4 right-4 bg-amber-400 text-slate-950 px-3 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest shadow-xl flex items-center gap-1.5">
                                <Lock size={11} /> Premium
                            </div>
                        )}
                    </div>

                    <div className="flex gap-2.5">
                        <button
                            onClick={handleShare}
                            className={`flex-1 py-3.5 rounded-2xl bg-gray-50 border border-gray-100 text-gray-400 flex items-center justify-center hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-100 transition-all relative ${showCopyFeedback ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : ''}`}
                        >
                            {showCopyFeedback ? <Check size={18} /> : <Share2 size={18} />}
                            {showCopyFeedback && <span className="absolute -top-9 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[9px] font-black py-1.5 px-2.5 rounded-lg uppercase tracking-widest animate-in fade-in slide-in-from-bottom-1">Copied!</span>}
                        </button>
                        <button
                            onClick={handleSave}
                            className={`flex-1 py-3.5 rounded-2xl border transition-all flex items-center justify-center ${
                                isSaved ? 'bg-emerald-600 border-emerald-600 text-white' : 'bg-gray-50 border-gray-100 text-gray-400 hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-100'
                            }`}
                        >
                            <Bookmark size={18} className={isSaved ? 'fill-current' : ''} />
                        </button>
                    </div>
                </div>

                {/* Information Metadata */}
                <div className="space-y-5 text-center md:text-left">
                    <div className="space-y-3">
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5">
                            <span className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-xl text-[9px] font-black uppercase tracking-widest border border-emerald-100/50">
                                {book.category?.name}
                            </span>
                            <div className="h-1 w-1 bg-gray-300 rounded-full"></div>
                            <span className="text-gray-400 text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5">
                                <FileText size={13} className="text-emerald-500" /> {book.file_size || '0 MB'}
                            </span>
                            <div className="h-1 w-1 bg-gray-300 rounded-full"></div>
                            <span className="text-gray-400 text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5">
                                <BookOpen size={13} className="text-emerald-500" /> {book.page_count || '0'} Pages
                            </span>
                        </div>
                        <h1 className="text-2xl md:text-4xl font-black text-gray-900 leading-tight tracking-tight">
                            {book.title}
                        </h1>
                        {book.subtitle && (
                            <p className="text-base font-bold text-gray-400 leading-relaxed italic">{book.subtitle}</p>
                        )}
                        <div className="flex items-center justify-center md:justify-start gap-2.5 pt-1">
                            <div className="w-7 h-7 rounded-full bg-emerald-900 flex items-center justify-center text-white text-[10px] font-black">
                                {book.author.charAt(0).toUpperCase()}
                            </div>
                            <p className="text-xs text-emerald-900 font-black uppercase tracking-[0.08em]">{book.author}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 py-5 border-y border-gray-100 text-left">
                        <div className="space-y-1">
                            <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Publisher Hub</p>
                            <p className="text-sm font-black text-gray-900">{book.publisher || 'Independent'}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">ISBN Node</p>
                            <p className="text-sm font-black text-gray-900 tracking-wider">{book.isbn || '000-000-000'}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Primary Language</p>
                            <p className="text-sm font-black text-gray-900 uppercase tracking-tighter">{book.language}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Archive Date</p>
                            <p className="text-sm font-black text-gray-900">{new Date(book.created_at).getFullYear()}</p>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3.5 pt-2 justify-center md:justify-start">
                        {isPremiumLocked ? (
                            <Link
                                to="/subscription/verify"
                                className="px-10 py-4 bg-amber-400 text-slate-950 rounded-2xl font-black uppercase tracking-[0.18em] text-[10px] hover:bg-amber-300 transition-all shadow-xl shadow-amber-400/20 active:scale-97 flex items-center justify-center gap-2.5"
                            >
                                <Lock size={16} /> Unlock Full Archive
                            </Link>
                        ) : (
                            <>
                                <Link
                                    to={`/books/${book.id}/read`}
                                    className="px-10 py-4 bg-emerald-900 text-white rounded-2xl font-black uppercase tracking-[0.18em] text-[10px] hover:bg-emerald-950 transition-all shadow-xl shadow-emerald-900/20 active:scale-97 flex items-center justify-center gap-2.5"
                                >
                                    <BookOpen size={16} /> Read Manuscript
                                </Link>
                                <button
                                    onClick={handleDownload}
                                    className="px-10 py-4 bg-white border-2 border-gray-100 text-gray-900 rounded-2xl font-black uppercase tracking-[0.18em] text-[10px] hover:bg-gray-50 hover:border-gray-200 transition-all shadow-sm active:scale-97 flex items-center justify-center gap-2.5"
                                >
                                    <Download size={16} /> Download Node
                                </button>
                            </>
                        )}
                    </div>

                    {isPremiumLocked && (
                        <div className="p-5 rounded-2xl bg-amber-50 border border-amber-100/50 flex gap-4 max-w-xl text-left mx-auto md:mx-0">
                            <div className="w-11 h-11 bg-amber-100 rounded-xl flex items-center justify-center text-amber-600 shrink-0">
                                <ShieldCheck size={22} />
                            </div>
                            <div>
                                <p className="text-[9px] font-black text-amber-900 uppercase tracking-[0.15em] mb-0.5">Premium Subscription Required</p>
                                <p className="text-xs font-medium text-amber-800 leading-relaxed">
                                    The uploader has restricted this document to verified academic nodes. Upgrade to DocuLink Elite to bypass encryption.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
      </div>

      {/* Main Container Core Panels */}
      <div className="container mx-auto px-6 py-10 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-10">
            {/* Left Box Layout */}
            <div className="space-y-10">
                <section className="bg-white p-8 md:p-10 rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/10 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-28 h-28 bg-emerald-50 rounded-full -mr-14 -mt-14"></div>
                    <div className="relative">
                        <h2 className="text-[10px] font-black text-emerald-900 uppercase tracking-[0.25em] mb-6 flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                            Abstract & Overview
                        </h2>
                        <div className="prose prose-slate max-w-none">
                            <p className="text-gray-600 text-sm md:text-[15px] leading-relaxed font-medium whitespace-pre-line">
                                {book.description || 'No detailed abstract has been logged for this resource node. Please consult the manuscript for full context.'}
                            </p>
                        </div>
                    </div>
                </section>

                {/* Comment Section */}
                <section className="bg-white p-8 md:p-10 rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/10">
                    <h2 className="text-[10px] font-black text-emerald-900 uppercase tracking-[0.25em] mb-8 flex items-center gap-2">
                        <MessageSquare size={14} className="text-emerald-500" />
                        Community Discussions
                    </h2>

                    {/* Comment Input */}
                    {currentUser ? (
                        <div className="mb-10">
                            <form onSubmit={handleCommentSubmit} className="space-y-4">
                                {replyTo && (
                                    <div className="flex items-center justify-between bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-100 animate-in slide-in-from-top-2">
                                        <p className="text-[10px] font-bold text-emerald-700">Replying to {replyTo.user?.name}</p>
                                        <button type="button" onClick={() => setReplyTo(null)} className="text-emerald-500 hover:text-emerald-700"><X size={14} /></button>
                                    </div>
                                )}
                                <div className="relative group">
                                    <textarea
                                        value={commentContent}
                                        onChange={(e) => setCommentContent(e.target.value)}
                                        placeholder={replyTo ? "Write your reply..." : "Log your thoughts or questions about this manuscript..."}
                                        className="w-full bg-gray-50 border border-gray-100 rounded-[1.5rem] p-5 text-sm font-medium outline-none focus:border-emerald-500/30 focus:bg-white transition-all min-h-[120px] resize-none"
                                    />
                                    <button
                                        disabled={submittingComment || !commentContent.trim()}
                                        type="submit"
                                        className="absolute bottom-4 right-4 p-3 bg-emerald-900 text-white rounded-2xl hover:bg-emerald-950 transition-all shadow-lg shadow-emerald-900/20 active:scale-95 disabled:opacity-50 disabled:scale-100"
                                    >
                                        <Send size={18} />
                                    </button>
                                </div>
                            </form>
                        </div>
                    ) : (
                        <div className="mb-10 p-6 bg-gray-50 rounded-3xl border border-dashed border-gray-200 text-center">
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Login required to participate in discussions</p>
                        </div>
                    )}

                    {/* Comments List */}
                    <div className="space-y-8">
                        {book.comments?.length === 0 ? (
                            <div className="py-12 text-center">
                                <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em]">No entries logged yet</p>
                            </div>
                        ) : (
                            book.comments?.map((comment: any) => (
                                <div key={comment.id} className="group/comment">
                                    <div className="flex gap-4">
                                        <div className="w-10 h-10 rounded-2xl bg-gray-100 flex items-center justify-center text-emerald-900 text-xs font-black shrink-0 border border-gray-200">
                                            {comment.user?.name?.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="flex-1 space-y-2">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <span className="text-xs font-black text-gray-900 uppercase tracking-tight">{comment.user?.name}</span>
                                                    {comment.user?.role === 'admin' && (
                                                        <span className="ml-2 px-2 py-0.5 bg-emerald-500 text-white text-[8px] font-black rounded-lg uppercase">Admin</span>
                                                    )}
                                                </div>
                                                <span className="text-[9px] font-bold text-gray-400 uppercase">{new Date(comment.created_at).toLocaleDateString()}</span>
                                            </div>
                                            <p className="text-sm text-gray-600 leading-relaxed font-medium">{comment.content}</p>
                                            <div className="flex items-center gap-4 pt-1">
                                                <button
                                                    onClick={() => { setReplyTo(comment); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                                                    className="text-[10px] font-black text-emerald-600 uppercase tracking-widest hover:underline"
                                                >
                                                    Reply
                                                </button>
                                            </div>

                                            {/* Replies */}
                                            {comment.replies?.length > 0 && (
                                                <div className="mt-4 space-y-6 pl-4 border-l-2 border-gray-50">
                                                    {comment.replies.map((reply: any) => (
                                                        <div key={reply.id} className="flex gap-3">
                                                            <div className="w-8 h-8 rounded-xl bg-gray-50 flex items-center justify-center text-emerald-700 text-[10px] font-black shrink-0 border border-gray-100">
                                                                {reply.user?.name?.charAt(0).toUpperCase()}
                                                            </div>
                                                            <div className="flex-1 space-y-1">
                                                                <div className="flex items-center justify-between">
                                                                    <div className="flex items-center gap-2">
                                                                        <span className="text-[11px] font-black text-gray-800 uppercase tracking-tight">{reply.user?.name}</span>
                                                                        {reply.user?.role === 'admin' && (
                                                                            <span className="px-1.5 py-0.5 bg-emerald-500 text-white text-[7px] font-black rounded-md uppercase">Admin</span>
                                                                        )}
                                                                    </div>
                                                                    <span className="text-[8px] font-bold text-gray-400 uppercase">{new Date(reply.created_at).toLocaleDateString()}</span>
                                                                </div>
                                                                <p className="text-xs text-gray-500 leading-relaxed font-medium">{reply.content}</p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </section>
            </div>

            {/* Right Aside Panel Layout */}
            <aside className="space-y-6">
                <div className="bg-emerald-900 p-6 md:p-8 rounded-[2rem] text-white shadow-2xl relative overflow-hidden group">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.25em] mb-6 flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></div>
                        Related Modules
                    </h3>
                    <div className="space-y-5">
                        {related.map((rel: any) => (
                            <Link to={`/books/${rel.slug || rel.id}`} key={rel.id} className="flex gap-3.5 group/item">
                                <div className="w-14 h-20 rounded-xl overflow-hidden bg-white/10 shrink-0 shadow-lg border border-white/5">
                                    <img src={getImageUrl(rel.cover_image)} className="w-full h-full object-cover opacity-80 group-hover/item:opacity-100 transition-all duration-500" alt="" />
                                </div>
                                <div className="flex flex-col justify-center min-w-0">
                                    <p className="text-[8px] font-black text-emerald-300 uppercase tracking-widest mb-1 opacity-60">{rel.category?.name || 'General'}</p>
                                    <h4 className="font-black text-sm text-white line-clamp-2 group-hover/item:text-emerald-400 transition-colors leading-snug">{rel.title}</h4>
                                    <p className="text-[9px] text-white/40 font-bold mt-1 truncate uppercase">By {rel.author}</p>
                                </div>
                            </Link>
                        ))}
                        {related.length === 0 && (
                            <div className="py-10 text-center border-2 border-dashed border-white/10 rounded-2xl">
                                <p className="text-[9px] text-white/20 font-black uppercase tracking-widest italic">No related nodes discovered</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="p-6 md:p-8 rounded-[2rem] bg-gray-900 text-white relative overflow-hidden">
                    <div className="relative z-10">
                        <h4 className="text-lg font-black tracking-tight mb-2">Security Protocol</h4>
                        <p className="text-white/40 text-[10px] leading-relaxed font-bold uppercase tracking-widest mb-6">All resources are encrypted and audited for academic integrity.</p>
                        <Link to="/subscription/verify" className="w-full py-3.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all block text-center">Verify Identity Node</Link>
                    </div>
                    <ShieldCheck size={100} className="absolute -right-6 -bottom-6 text-white/5 rotate-12" />
                </div>
            </aside>
        </div>
      </div>
    </div>
  )
}