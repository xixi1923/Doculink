import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import {
  ChevronLeft,
  ChevronRight,
  X,
  Share2,
  Download,
  ThumbsUp,
  AlertTriangle,
  Loader2,
  Lock,
  Maximize2,
  Bookmark,
  BookOpen
} from 'lucide-react'
import api from '@/api'

export default function BookReader() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [book, setBook] = useState<any>(null)
  const [userStatus, setUserStatus] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)

  const fetchData = async () => {
    setLoading(true)
    try {
      const [bookRes, statusRes] = await Promise.all([
        api.get(`/books/${id}`),
        api.get('/subscription/status')
      ])
      setBook(bookRes.data.book || bookRes.data)
      setUserStatus(statusRes.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [id])

  if (loading) {
    return (
      <div className="fixed inset-0 bg-white z-[100] flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-emerald-900/10 border-t-emerald-900 rounded-full animate-spin mb-6"></div>
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-900 animate-pulse">Synchronizing Manuscript...</p>
      </div>
    )
  }

  if (!book) {
      return (
        <div className="fixed inset-0 bg-slate-950 z-[100] flex flex-col items-center justify-center p-6 text-center">
            <h1 className="text-2xl font-black text-white">Manuscript Not Found</h1>
            <button onClick={() => navigate('/books')} className="mt-6 text-teal-500 font-bold uppercase tracking-widest text-xs hover:underline">Return to Library</button>
        </div>
      )
  }

  const isPremiumLocked = book.book_type === 'premium' && !userStatus?.is_premium

  if (isPremiumLocked) {
      return (
        <div className="fixed inset-0 bg-slate-950 z-[100] flex flex-col items-center justify-center p-8 text-center">
            <div className="w-20 h-20 bg-amber-500 rounded-[2rem] flex items-center justify-center text-slate-950 mb-8 shadow-2xl shadow-amber-500/20">
                <Lock size={32} />
            </div>
            <h1 className="text-3xl font-black text-white tracking-tight">Access Protocol Required</h1>
            <p className="text-slate-400 mt-4 max-w-md font-medium leading-relaxed">
                This manuscript is classified as <span className="text-amber-500 font-bold">Premium Tier</span>.
                Upgrade your educational node to unlock full access.
            </p>
            <div className="flex gap-4 mt-10">
                <button onClick={() => navigate(-1)} className="px-8 py-4 bg-slate-800 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-slate-700 transition-all">
                    Go Back
                </button>
                <Link to="/subscription/verify" className="px-8 py-4 bg-teal-500 text-slate-950 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-teal-400 transition-all shadow-xl shadow-teal-500/20">
                    Upgrade Now
                </Link>
            </div>
        </div>
      )
  }

  const totalPages = book.page_count || 48

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable full-screen mode: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  }

  const handleNextPage = () => {
    if (currentPage < totalPages - (currentPage === 1 ? 0 : 1)) {
      setCurrentPage(prev => prev === 1 ? prev + 1 : prev + 2)
    }
  }

  const handleBackPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev === 2 ? 1 : prev - 2)
    }
  }

  const handleDownload = () => {
    window.open(`${import.meta.env.VITE_API_URL || ''}/api/books/${book.id}/download`, '_blank')
  }

  return (
    <div className="fixed inset-0 bg-slate-50 z-[100] flex flex-col font-sans overflow-hidden">
      {/* Top Overlay Header */}
      <div className="absolute top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-md z-50 flex items-center justify-between px-8 border-b border-slate-200">
        <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-emerald-900 rounded-xl flex items-center justify-center shadow-lg border border-emerald-800">
                <BookOpen size={20} className="text-white" />
            </div>
            <div>
                <span className="text-slate-900 font-black text-sm uppercase tracking-[0.2em] block">DocuLink Archive</span>
                <span className="text-slate-400 text-[9px] font-bold uppercase tracking-widest">Digital Manuscript Node</span>
            </div>
        </div>
        <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2.5 rounded-full bg-slate-100 hover:bg-rose-500 hover:text-white text-slate-500 transition-all border border-slate-200"
            >
              <X size={20} />
            </button>
        </div>
      </div>

      {/* Main Content Area: Flipbook 2-Page Spread */}
      <div className="flex-grow relative flex items-center justify-center px-4 md:px-12 pt-16 pb-28">

        {/* Flipbook Container (2-Page View) */}
        <div className={`w-full max-w-6xl aspect-[1.4/1] bg-white shadow-[0_30px_60px_-15px_rgba(0,0,0,0.2)] rounded-sm overflow-hidden relative flex transition-all duration-500 border border-slate-200 ${currentPage === 1 ? 'max-w-3xl' : ''}`}>
            {currentPage === 1 ? (
                 <div className="flex-1 bg-white relative overflow-hidden group/page">
                    <iframe
                        src={`https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(book.pdf_url)}#page=1`}
                        className="w-full h-full border-none"
                        title="Cover Page"
                    />
                    <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-black/5 to-transparent pointer-events-none"></div>
                    <div className="absolute bottom-0 right-0 w-12 h-12 bg-gradient-to-tl from-gray-200 to-transparent opacity-50 pointer-events-none"></div>
                </div>
            ) : (
                <>
                    {/* Left Page */}
                    <div className="flex-1 bg-white border-r border-gray-100 relative overflow-hidden group/page">
                        <iframe
                            src={`https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(book.pdf_url)}#page=${currentPage}`}
                            className="w-full h-full border-none"
                            title="Left Page"
                        />
                        <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-black/5 to-transparent pointer-events-none"></div>
                        <div className="absolute bottom-0 left-0 w-12 h-12 bg-gradient-to-tr from-gray-200 to-transparent opacity-50 pointer-events-none"></div>
                    </div>

                    {/* Middle Spine Shadow */}
                    <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-12 bg-gradient-to-r from-black/10 via-black/20 to-black/10 z-10 pointer-events-none"></div>

                    {/* Right Page */}
                    <div className="flex-1 bg-white relative overflow-hidden group/page">
                        <iframe
                            src={`https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(book.pdf_url)}#page=${currentPage + 1}`}
                            className="w-full h-full border-none"
                            title="Right Page"
                        />
                        <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-black/5 to-transparent pointer-events-none"></div>
                        <div className="absolute bottom-0 right-0 w-12 h-12 bg-gradient-to-tl from-gray-200 to-transparent opacity-50 pointer-events-none"></div>
                    </div>
                </>
            )}

            {/* Publisher Badge */}
            <div className="absolute top-4 right-4 bg-emerald-500/10 text-emerald-700 text-[9px] font-black px-2 py-0.5 rounded tracking-tighter z-20">
                {book.publisher || 'Official Release'}
            </div>
        </div>

        {/* Floating Page Label */}
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 bg-slate-900/90 backdrop-blur-md text-white text-[11px] font-bold px-4 py-1.5 rounded-full z-30 shadow-xl border border-white/10">
            {currentPage === 1 ? `1 / ${totalPages}` : `${currentPage} - ${currentPage + 1} / ${totalPages}`}
        </div>
      </div>

      {/* Flipbook Style Bottom Toolbar */}
      <div className="absolute bottom-0 left-0 right-0 bg-white text-slate-900 z-50 border-t border-slate-200">
        <div className="h-20 flex items-center justify-between px-8">

          <div className="flex flex-col justify-center min-w-[200px]">
            <h2 className="text-sm font-black text-slate-900 truncate tracking-tight">{book.title}</h2>
            <p className="text-[10px] font-bold text-slate-400 mt-0.5 truncate uppercase tracking-widest">
                Release Index: {new Date(book.created_at).toLocaleDateString()}
            </p>
          </div>

          {/* Navigation Controls Group */}
          <div className="flex items-center gap-2">
            <button
                onClick={handleBackPage}
                disabled={currentPage <= 1}
                className="p-3 rounded-xl bg-slate-100 text-slate-600 hover:bg-emerald-900 hover:text-white transition-all disabled:opacity-20 disabled:hover:bg-slate-100 disabled:hover:text-slate-600"
            >
                <ChevronLeft size={20} />
            </button>
            <div className="w-[1px] h-6 bg-slate-200 mx-1"></div>
            <button
                onClick={handleNextPage}
                disabled={currentPage >= totalPages}
                className="p-3 rounded-xl bg-slate-100 text-slate-600 hover:bg-emerald-900 hover:text-white transition-all disabled:opacity-20 disabled:hover:bg-slate-100 disabled:hover:text-slate-600"
            >
                <ChevronRight size={20} />
            </button>
          </div>

          <div className="flex items-center gap-1 sm:gap-2">
            <button className="flex flex-col items-center justify-center w-14 h-14 rounded-xl hover:bg-slate-50 transition-colors group">
                <ThumbsUp size={18} className="text-slate-400 group-hover:text-emerald-700 transition-colors" />
                <span className="text-[9px] font-black uppercase mt-1 text-slate-400 group-hover:text-emerald-700">Like</span>
            </button>
            <button className="flex flex-col items-center justify-center w-14 h-14 rounded-xl hover:bg-slate-50 transition-colors group">
                <Share2 size={18} className="text-slate-400 group-hover:text-emerald-700 transition-colors" />
                <span className="text-[9px] font-black uppercase mt-1 text-slate-400 group-hover:text-emerald-700">Share</span>
            </button>
            <button onClick={handleDownload} className="flex flex-col items-center justify-center w-14 h-14 rounded-xl hover:bg-slate-50 transition-colors group">
                <Download size={18} className="text-slate-400 group-hover:text-emerald-700 transition-colors" />
                <span className="text-[9px] font-black uppercase mt-1 text-slate-400 group-hover:text-emerald-700">Save</span>
            </button>
            <div className="w-[1px] h-8 bg-slate-200 mx-4"></div>
            <button onClick={toggleFullscreen} className="p-3 rounded-xl hover:bg-slate-50 text-slate-400 hover:text-slate-900 transition-colors">
                <Maximize2 size={20} />
            </button>
          </div>
        </div>

        {/* Dynamic Scrubbing Progress Bar */}
        <div className="h-1.5 w-full bg-slate-100 cursor-pointer group/progress relative">
            <div
                className="h-full bg-emerald-900 transition-all duration-300 relative"
                style={{ width: `${(currentPage / totalPages) * 100}%` }}
            >
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-emerald-700 rounded-full shadow-lg scale-0 group-hover/progress:scale-100 transition-transform"></div>
            </div>
            {/* Page Bubble on Hover */}
            <div className="absolute bottom-4 opacity-0 group-hover/progress:opacity-100 transition-opacity bg-emerald-900 text-white text-[10px] font-black px-2 py-1 rounded pointer-events-none" style={{ left: `${(currentPage / totalPages) * 100}%`, transform: 'translateX(-50%)' }}>
                PAGE {currentPage}
            </div>
        </div>
      </div>
    </div>
  )
}
