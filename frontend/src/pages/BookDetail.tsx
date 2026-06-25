import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  BookOpen, Download, Share2, Bookmark, ArrowLeft,
  ShieldCheck, Lock, CheckCircle2, Star, Clock, FileText,
  Globe, Hash, Loader2, AlertCircle
} from 'lucide-react'
import api from '@/api'
import { getImageUrl } from '@/utils/image'

export default function BookDetail() {
  const { slug } = useParams()
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [userStatus, setUserStatus] = useState<any>(null)

  const fetchData = async () => {
    setLoading(true)
    try {
      const [bookRes, statusRes] = await Promise.all([
        api.get(`/books/${slug}`),
        api.get('/subscription/status')
      ])
      setData(bookRes.data)
      setUserStatus(statusRes.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [slug])

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
        <div className="w-10 h-10 border-4 border-emerald-900/10 border-t-emerald-900 rounded-full animate-spin mb-4"></div>
        <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-900/40">Loading Archive...</p>
      </div>
    )
  }

  if (!data?.book) return <div className="p-20 text-center text-slate-900 font-bold">Book not found</div>

  const { book, related } = data
  const isPremiumLocked = book.book_type === 'premium' && !userStatus?.is_premium

  const handleDownload = async () => {
    if (isPremiumLocked) return
    window.open(`${import.meta.env.VITE_API_URL || ''}/api/books/${book.id}/download`, '_blank')
  }

  return (
    <div className="min-h-screen bg-gray-50/50 font-sans pb-20 antialiased">
      {/* Compact Header */}
      <div className="bg-white border-b border-gray-100 pt-24 pb-12">
        <div className="container mx-auto px-6">
            <Link to="/books" className="inline-flex items-center gap-2 text-gray-400 hover:text-emerald-900 transition-colors text-[10px] font-black uppercase tracking-widest mb-8">
                <ArrowLeft size={14} /> Return to Archive
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-10 items-start">
                {/* Book Cover */}
                <div className="space-y-4">
                    <div className="aspect-[3/4] rounded-2xl overflow-hidden shadow-lg border border-gray-100 relative bg-gray-50">
                        <img src={getImageUrl(book.cover_image)} className="w-full h-full object-cover" alt={book.title} />
                        {book.book_type === 'premium' && (
                            <div className="absolute top-4 right-4 bg-amber-400 text-slate-950 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest shadow-sm">
                                Premium 🔒
                            </div>
                        )}
                    </div>

                    <div className="flex gap-2">
                        <button className="flex-1 py-3 rounded-xl bg-gray-50 border border-gray-100 text-gray-400 flex items-center justify-center hover:bg-gray-100 transition-all">
                            <Share2 size={16} />
                        </button>
                        <button className="flex-1 py-3 rounded-xl bg-gray-50 border border-gray-100 text-gray-400 flex items-center justify-center hover:bg-gray-100 transition-all">
                            <Bookmark size={16} />
                        </button>
                    </div>
                </div>

                {/* Information */}
                <div className="space-y-6">
                    <div>
                        <div className="flex flex-wrap items-center gap-2 mb-4">
                            <span className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-lg text-[9px] font-black uppercase tracking-widest border border-emerald-100">
                                {book.category?.name}
                            </span>
                            <span className="text-gray-400 text-[9px] font-bold uppercase tracking-widest">
                                {book.file_size} · {book.page_count} Pages
                            </span>
                        </div>
                        <h1 className="text-2xl md:text-3xl font-black text-gray-900 leading-tight tracking-tight">
                            {book.title}
                        </h1>
                        {book.subtitle && (
                            <p className="text-lg font-bold text-gray-400 mt-2 italic">{book.subtitle}</p>
                        )}
                        <p className="text-sm text-emerald-700 font-black mt-3 uppercase tracking-widest">By {book.author}</p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-5 border-y border-gray-50">
                        <div className="space-y-1">
                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Publisher</p>
                            <p className="text-xs font-bold text-gray-900">{book.publisher || 'N/A'}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">ISBN</p>
                            <p className="text-xs font-bold text-gray-900">{book.isbn || 'N/A'}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Language</p>
                            <p className="text-xs font-bold text-gray-900">{book.language}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Released</p>
                            <p className="text-xs font-bold text-gray-900">{new Date(book.created_at).getFullYear()}</p>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 pt-2">
                        {isPremiumLocked ? (
                            <Link
                                to="/subscription/verify"
                                className="px-10 py-4 bg-amber-400 text-slate-950 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-amber-300 transition-all shadow-lg shadow-amber-400/20 active:scale-95 flex items-center justify-center gap-2.5"
                            >
                                <Lock size={16} /> Subscribe to Unlock
                            </Link>
                        ) : (
                            <>
                                <Link
                                    to={`/books/${book.id}/read`}
                                    className="px-10 py-4 bg-emerald-900 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-emerald-800 transition-all shadow-xl shadow-emerald-900/20 active:scale-95 flex items-center justify-center gap-2.5"
                                >
                                    <BookOpen size={16} /> Read Manuscript
                                </Link>
                                <button
                                    onClick={handleDownload}
                                    className="px-10 py-4 bg-white border border-gray-200 text-gray-900 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-gray-50 transition-all shadow-sm active:scale-95 flex items-center justify-center gap-2.5"
                                >
                                    <Download size={16} /> Download PDF
                                </button>
                            </>
                        )}
                    </div>

                    {isPremiumLocked && (
                        <div className="p-5 rounded-2xl bg-amber-50 border border-amber-100 flex gap-4 max-w-xl">
                            <ShieldCheck className="text-amber-600 shrink-0" size={20} />
                            <div>
                                <p className="text-[10px] font-black text-amber-900 uppercase tracking-widest mb-1">Premium Exclusive</p>
                                <p className="text-[11px] font-medium text-amber-800 leading-relaxed">
                                    Unlock full access and offline downloads with a premium membership.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-16">
            {/* Left Column */}
            <div className="space-y-10">
                <section className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                    <h2 className="text-xs font-black text-gray-900 uppercase tracking-widest mb-6 flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-emerald-900 rounded-full"></div>
                        Abstract & Overview
                    </h2>
                    <div className="prose prose-slate max-w-none">
                        <p className="text-gray-600 text-base leading-relaxed font-medium whitespace-pre-line">
                            {book.description || 'No detailed description available for this resource.'}
                        </p>
                    </div>
                </section>

                <section>
                    <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4 ml-1">Metadata Tags</h2>
                    <div className="flex flex-wrap gap-2">
                        {book.tags?.map((tag: string) => (
                            <span key={tag} className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-[9px] font-black uppercase tracking-widest text-gray-500 hover:text-emerald-700 hover:border-emerald-200 transition-all cursor-default">
                                {tag}
                            </span>
                        ))}
                    </div>
                </section>
            </div>

            {/* Right Column: Related */}
            <aside className="space-y-8">
                <h3 className="text-xs font-black text-gray-900 uppercase tracking-widest flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-emerald-900 rounded-full"></div>
                    Related Modules
                </h3>
                <div className="space-y-5">
                    {related.map((rel: any) => (
                        <Link to={`/books/${rel.slug}`} key={rel.id} className="flex gap-4 group p-3 rounded-2xl hover:bg-white transition-all hover:shadow-sm border border-transparent hover:border-gray-100">
                            <div className="w-16 h-22 rounded-xl overflow-hidden bg-gray-50 shrink-0 shadow-sm border border-gray-100">
                                <img src={getImageUrl(rel.cover_image)} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="" />
                            </div>
                            <div className="flex flex-col justify-center min-w-0">
                                <p className="text-[8px] font-black text-emerald-700 uppercase tracking-tighter mb-1">{rel.category?.name}</p>
                                <h4 className="font-bold text-[13px] text-gray-900 line-clamp-1 group-hover:text-emerald-900 transition-colors leading-tight">{rel.title}</h4>
                                <p className="text-[10px] text-gray-400 font-medium mt-0.5 truncate">{rel.author}</p>
                            </div>
                        </Link>
                    ))}
                    {related.length === 0 && <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest italic ml-2">No related nodes</p>}
                </div>
            </aside>
        </div>
      </div>
    </div>
  )
}
