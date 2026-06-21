import {
  BookOpen,
  Download,
  Share2,
  Bookmark,
  Star,
  ChevronRight,
  Eye,
  ShieldCheck,
  MoreHorizontal,
  ArrowRight,
  Loader2,
  Calendar,
  Layers,
  Hash
} from 'lucide-react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import api, { toggleFavoriteApi } from '@/api/authApi'
import { useAuthStore } from '@/store/authStore'

export default function BookDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { token } = useAuthStore()
  const [book, setBook] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('summary')
  const [isFavorited, setIsFavorited] = useState(false)

  useEffect(() => {
    fetchBook()
  }, [id])

  const fetchBook = async () => {
    setLoading(true)
    try {
      const res = await api.get(`/books/${id}`)
      setBook(res.data)
      setIsFavorited(res.data.is_favorited)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleFavorite = async () => {
    if (!token) return alert('Please login to save favorites.')
    try {
      const res = await toggleFavoriteApi({ book_id: Number(id) })
      setIsFavorited(res.favorited)
    } catch (err) {
      console.error(err)
    }
  }

  const handleDownload = async () => {
    if (!token) return alert('Please login to download.')
    try {
      const res = await api.get(`/books/${id}/download`)
      window.open(res.data.url, '_blank')
    } catch (err) {
      console.error(err)
    }
  }

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-white dark:bg-slate-950">
        <Loader2 className="animate-spin text-teal-500 mb-4" size={40} />
        <p className="text-slate-400 font-black uppercase tracking-widest text-xs">Opening Library Node...</p>
    </div>
  )

  if (!book) return <div className="p-20 text-center text-slate-500 font-bold">Book not found.</div>

  return (
    <div className="bg-white dark:bg-slate-950 min-h-screen pb-20 font-sans text-slate-800 dark:text-gray-200">
      <div className="max-w-7xl mx-auto px-4 pt-10">

        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 mb-8">
          <Link to="/" className="hover:text-teal-500 transition-colors">Home</Link>
          <ChevronRight size={12} />
          <Link to="/books" className="hover:text-teal-500 transition-colors">Library</Link>
          <ChevronRight size={12} />
          <span className="text-slate-900 dark:text-white">{book.category?.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

          {/* Left Column: Book Cover */}
          <div className="lg:col-span-4 space-y-8">
            <div className="bg-white dark:bg-slate-900 rounded-[40px] p-8 shadow-sm border border-slate-100 dark:border-slate-800 sticky top-24">
              <div className="aspect-[3/4] rounded-[32px] overflow-hidden shadow-2xl mb-8 relative group bg-slate-50 dark:bg-slate-950">
                <img
                  src={book.cover_image || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=600'}
                  alt={book.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>

              <div className="space-y-4">
                <button
                  onClick={() => navigate(`/books/${id}/read`)}
                  className="w-full py-4 bg-teal-500 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-teal-500/20 hover:bg-teal-600 transition-all flex items-center justify-center gap-3"
                >
                  <BookOpen size={20} /> Read Online
                </button>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={handleDownload}
                    className="py-3.5 bg-slate-50 dark:bg-gray-800 text-slate-600 dark:text-gray-300 rounded-2xl font-bold text-[11px] uppercase tracking-wider hover:bg-slate-100 dark:hover:bg-gray-700 transition-all flex items-center justify-center gap-2"
                  >
                    <Download size={16} /> Download
                  </button>
                  <button
                    onClick={handleFavorite}
                    className={`py-3.5 rounded-2xl font-bold text-[11px] uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${isFavorited ? 'bg-amber-50 text-amber-500 border border-amber-100 shadow-sm' : 'bg-slate-50 dark:bg-gray-800 text-slate-600 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-gray-700'}`}
                  >
                    <Bookmark size={16} className={isFavorited ? 'fill-current text-amber-500' : ''} />
                    {isFavorited ? 'Saved' : 'Save'}
                  </button>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-slate-50 dark:border-slate-800 flex items-center justify-between">
                <div className="text-center flex-grow border-r border-slate-50 dark:border-slate-800">
                  <p className="text-lg font-black text-slate-900 dark:text-white flex items-center justify-center gap-1">
                    <Eye size={16} className="text-teal-500" /> {book.view_count || 0}
                  </p>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Views</p>
                </div>
                <div className="text-center flex-grow">
                  <p className="text-lg font-black text-slate-900 dark:text-white flex items-center justify-center gap-1">
                    <Download size={16} className="text-teal-500" /> {book.download_count || 0}
                  </p>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Downloads</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Content */}
          <div className="lg:col-span-8 space-y-10">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400 rounded-full text-[10px] font-black uppercase tracking-widest border border-teal-100 dark:border-teal-800">
                  Academic E-Book
                </span>
                <span className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  <ShieldCheck size={14} className="text-emerald-500" /> Curated Repository
                </span>
              </div>
              <h1 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white leading-tight">
                {book.title}
              </h1>
              <div className="flex items-center gap-4 pt-2">
                <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-teal-600 font-bold">
                  {book.author?.charAt(0)}
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Written by</p>
                  <p className="text-sm font-black text-slate-800 dark:text-white">{book.author}</p>
                </div>
                <div className="ml-auto flex items-center gap-6">
                  <button className="text-slate-400 hover:text-teal-500 transition-colors"><Share2 size={20} /></button>
                  <button className="text-slate-400 hover:text-teal-500 transition-colors"><MoreHorizontal size={20} /></button>
                </div>
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
               <div className="p-5 rounded-[28px] bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-gray-800">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-1.5"><Layers size={12} /> Category</p>
                  <p className="text-sm font-black text-slate-900 dark:text-white truncate">{book.category?.name}</p>
               </div>
               <div className="p-5 rounded-[28px] bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-gray-800">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-1.5"><Calendar size={12} /> Published</p>
                  <p className="text-sm font-black text-slate-900 dark:text-white">{book.publication_year || 'N/A'}</p>
               </div>
               <div className="p-5 rounded-[28px] bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-gray-800">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-1.5"><Hash size={12} /> ISBN</p>
                  <p className="text-sm font-black text-slate-900 dark:text-white truncate">{book.isbn || 'N/A'}</p>
               </div>
               <div className="p-5 rounded-[28px] bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-gray-800">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-1.5"><BookOpen size={12} /> Publisher</p>
                  <p className="text-sm font-black text-slate-900 dark:text-white truncate">{book.publisher || 'N/A'}</p>
               </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-8 md:p-12 rounded-[40px] border border-slate-100 dark:border-gray-800 shadow-sm">
               <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-[0.2em] mb-6">Abstract Summary</h3>
               <div className="prose prose-slate dark:prose-invert max-w-none text-slate-600 dark:text-gray-400 font-medium leading-relaxed">
                 {book.description || "No description provided for this academic resource. Please refer to the original file for full contents and research data."}
               </div>
            </div>

            {/* Academic Integrity Banner */}
            <div className="bg-[#111827] rounded-[40px] p-10 md:p-14 text-white relative overflow-hidden">
               <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
                  <div className="w-16 h-16 rounded-2xl bg-teal-500/20 text-teal-400 flex items-center justify-center shrink-0">
                    <ShieldCheck size={32} />
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-lg font-black tracking-tight">Verified Academic Library</h4>
                    <p className="text-sm text-slate-400 leading-relaxed font-medium">
                      All books in our library are curated for academic relevance and verified by the DocuLink administrative team.
                    </p>
                  </div>
               </div>
               <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
