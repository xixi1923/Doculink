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
  Hash,
  Heart,
  MessageSquare,
  Plus
} from 'lucide-react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import api, { toggleFavoriteApi, toggleLikeApi } from '@/api/authApi'
import { useAuthStore } from '@/store/authStore'

export default function BookDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { token } = useAuthStore()
  const [book, setBook] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [isFavorited, setIsFavorited] = useState(false)
  const [isLiked, setIsLiked] = useState(false)

  useEffect(() => {
    fetchBook()
  }, [id])

  const fetchBook = async () => {
    setLoading(true)
    try {
      const res = await api.get(`/books/${id}`)
      setBook(res.data)
      setIsFavorited(res.data.is_favorited)
      setIsLiked(res.data.is_liked)
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
      setBook({ ...book, favorites_count: res.favorited ? (book.favorites_count + 1) : (book.favorites_count - 1) })
    } catch (err) {
      console.error(err)
    }
  }

  const handleLike = async () => {
    if (!token) return alert('Please login to react.')
    try {
      const res = await toggleLikeApi({ book_id: Number(id) })
      setIsLiked(res.liked)
      setBook({ ...book, likes_count: res.likes_count })
    } catch (err) {
      console.error(err)
    }
  }

  const handleDownload = async () => {
    if (!token) return alert('Please login to download.')
    try {
      const res = await api.get(`/books/${id}/download`)
      window.open(res.data.url, '_blank')
      setBook({ ...book, download_count: (book.download_count || 0) + 1 })
    } catch (err) {
      console.error(err)
    }
  }

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-white">
        <Loader2 className="animate-spin text-teal-600 mb-4" size={40} />
        <p className="text-slate-500 font-black uppercase tracking-widest text-xs">Accessing Library Node...</p>
    </div>
  )

  if (!book) return <div className="p-20 text-center text-slate-900 font-bold">Book not found.</div>

  return (
    <div className="bg-white min-h-screen pb-20 font-sans text-slate-900">
      <div className="max-w-7xl mx-auto px-4 pt-10">

        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 mb-10">
          <Link to="/" className="hover:text-teal-600 transition-colors">Home</Link>
          <ChevronRight size={12} />
          <Link to="/books" className="hover:text-teal-600 transition-colors">Library</Link>
          <ChevronRight size={12} />
          <span className="text-slate-900">{book.category?.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

          {/* Left Column: Content */}
          <div className="lg:col-span-8 space-y-10">
            <div className="space-y-6">
                <div className="flex items-center gap-3">
                    <span className="px-3 py-1 bg-teal-50 text-teal-700 rounded-full text-[10px] font-black uppercase tracking-widest border border-teal-100">
                        Academic E-Book
                    </span>
                    <span className="flex items-center gap-1.5 text-[10px] font-black text-teal-600 uppercase tracking-widest">
                        <ShieldCheck size={14} /> Verified Node
                    </span>
                </div>

                <h1 className="text-4xl md:text-5xl font-black text-slate-900 leading-[1.1] tracking-tight">
                    {book.title}
                </h1>

                <div className="flex items-center gap-4 text-sm font-medium text-slate-500">
                    <span>By</span>
                    <span className="text-slate-900 font-bold">{book.author}</span>
                    <span>•</span>
                    <span>Released in {book.publication_year || 'N/A'}</span>
                </div>

                <div className="flex flex-wrap items-center gap-4 pt-4">
                    <button
                        onClick={handleDownload}
                        className="flex items-center gap-2 px-8 py-4 bg-teal-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-teal-600/20 hover:bg-teal-700 transition-all"
                    >
                        <Download size={18} /> Download Resource
                    </button>
                    <button
                        onClick={handleFavorite}
                        className={`flex items-center gap-2 px-6 py-4 border-2 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${isFavorited ? 'bg-amber-50 border-amber-200 text-amber-600 shadow-sm' : 'border-slate-100 text-slate-600 hover:bg-slate-50'}`}
                    >
                        <Bookmark size={18} className={isFavorited ? 'fill-current' : ''} />
                        {isFavorited ? 'Saved' : 'Save Asset'}
                    </button>
                    <button className="p-4 border-2 border-slate-100 rounded-2xl text-slate-400 hover:bg-slate-50 transition-all">
                        <Share2 size={20} />
                    </button>
                </div>
            </div>

            {/* Book Preview Area */}
            <div className="rounded-[40px] overflow-hidden bg-slate-900 aspect-video relative group border border-slate-800 shadow-2xl">
               <iframe
                  src={`https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(book.file_path)}`}
                  className="w-full h-full border-none"
                  title="Book Viewer"
               />
               <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                   <button
                      onClick={handleDownload}
                      className="p-3 bg-teal-600 text-white rounded-2xl shadow-xl hover:bg-teal-700 transition-all"
                   >
                       <Download size={22} />
                   </button>
               </div>
            </div>

            <div className="bg-slate-50/50 p-10 rounded-[48px] border border-slate-100/50">
               <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Abstract Summary</h3>
               <p className="text-[15px] text-slate-600 font-medium leading-relaxed">
                 {book.description || "No description provided for this academic resource. Please refer to the original file for full contents and research data."}
               </p>
            </div>
          </div>

          {/* Right Column: Sidebar */}
          <div className="lg:col-span-4 space-y-10">
            {/* About the Uploader */}
            <div className="bg-[#fcfdfe] p-10 rounded-[48px] border border-slate-100/50 shadow-sm space-y-8">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Contributor</h3>

                <div className="flex items-center gap-5">
                    <div className="w-20 h-20 rounded-[28px] bg-white border border-slate-100 shadow-sm flex items-center justify-center text-3xl font-black text-teal-600 overflow-hidden">
                         {book.uploader?.avatar ? <img src={book.uploader.avatar} className="w-full h-full object-cover" /> : book.uploader?.name?.charAt(0) || 'U'}
                    </div>
                    <div>
                         <h4 className="font-black text-lg text-slate-900 leading-tight">{book.uploader?.name || 'Anonymous'}</h4>
                         <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Librarian</p>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                    <button
                        onClick={handleLike}
                        className={`p-3 rounded-2xl text-center border transition-all ${isLiked ? 'bg-rose-50 border-rose-100 text-rose-500' : 'bg-slate-50 border-slate-100 text-slate-400 hover:bg-slate-100'}`}
                    >
                        <div className="flex justify-center mb-1"><Heart size={16} fill={isLiked ? 'currentColor' : 'none'} /></div>
                        <p className="text-xs font-black">{book.likes_count || 0}</p>
                        <p className="text-[7px] font-black uppercase tracking-widest opacity-60">Reacts</p>
                    </button>
                    <button className="p-3 bg-slate-50 border border-slate-100 rounded-2xl text-center text-slate-400 hover:bg-slate-100 transition-all">
                        <div className="flex justify-center mb-1"><MessageSquare size={16} /></div>
                        <p className="text-xs font-black text-slate-900">0</p>
                        <p className="text-[7px] font-black uppercase tracking-widest opacity-60">Comments</p>
                    </button>
                    <button
                        onClick={handleFavorite}
                        className={`p-3 rounded-2xl text-center border transition-all ${isFavorited ? 'bg-amber-50 border-amber-100 text-amber-600 shadow-sm' : 'bg-slate-50 border-slate-100 text-slate-400 hover:bg-slate-100'}`}
                    >
                        <div className="flex justify-center mb-1"><Bookmark size={16} className={isFavorited ? 'fill-current' : ''} /></div>
                        <p className="text-xs font-black text-slate-900">{book.favorites_count || 0}</p>
                        <p className="text-[7px] font-black uppercase tracking-widest opacity-60">Saves</p>
                    </button>
                </div>

                <p className="text-[13px] text-slate-500 font-medium leading-relaxed">
                    Verified librarian at the DocuLink global network. Focused on sharing high-quality textbooks and academic resources.
                </p>
            </div>

            {/* Technical Metadata */}
            <div className="space-y-6 px-4">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Metadata</h3>
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">ISBN</span>
                        <span className="text-xs font-bold text-slate-900">{book.isbn || 'N/A'}</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Publisher</span>
                        <span className="text-xs font-bold text-slate-900">{book.publisher || 'N/A'}</span>
                    </div>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
