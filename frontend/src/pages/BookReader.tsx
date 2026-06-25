import { useEffect, useState, useRef } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import {
  ChevronLeft,
  ChevronRight,
  X,
  Share2,
  Download,
  ThumbsUp,
  Maximize2,
  BookOpen,
  Lock,
  Bookmark,
  Check
} from 'lucide-react'
import HTMLFlipBook from 'react-pageflip'
import { Document, Page, pdfjs } from 'react-pdf'
import api from '@/api'

// Initialize the pdfjs worker for performance
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`

export default function BookReader() {
  const { id } = useParams()
  const navigate = useNavigate()
  const flipBookRef = useRef<any>(null)

  const [book, setBook] = useState<any>(null)
  const [userStatus, setUserStatus] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [numPages, setNumPages] = useState<number>(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [isLiked, setIsLiked] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const [showCopyFeedback, setShowCopyFeedback] = useState(false)

  const fetchData = async () => {
    setLoading(true)
    try {
      const [bookRes, statusRes] = await Promise.all([
        api.get(`/books/${id}`),
        api.get('/subscription/status')
      ])
      const bookData = bookRes.data.book || bookRes.data
      setBook(bookData)
      setUserStatus(statusRes.data)
      setIsSaved(bookRes.data.is_favorited || false)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [id])

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages)
  }

  const onPageFlip = (e: any) => {
    setCurrentPage(e.data + 1)
  }

  const handleNextPage = () => {
    if (flipBookRef.current) {
      flipBookRef.current.pageFlip().flipNext()
    }
  }

  const handleBackPage = () => {
    if (flipBookRef.current) {
      flipBookRef.current.pageFlip().flipPrev()
    }
  }

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable full-screen mode: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  }

  const handleDownload = () => {
    window.open(`${import.meta.env.VITE_API_URL || ''}/api/books/${book.id}/download`, '_blank')
  }

  const handleLike = async () => {
    try {
        const res = await api.post('/likes/toggle', { book_id: book.id })
        setIsLiked(res.data.liked)
    } catch (err) {
        console.error(err)
    }
  }

  const handleSave = async () => {
    try {
        const res = await api.post('/favorites/toggle', { book_id: book.id })
        setIsSaved(res.data.favorited)
    } catch (err) {
        console.error(err)
    }
  }

  const handleShare = async () => {
    const shareUrl = window.location.href.replace('/read', '') // point back to details page
    const shareData = {
        title: book.title,
        text: `Read this book on DocuLink: ${book.title}`,
        url: shareUrl
    }

    if (navigator.share) {
        try {
            await navigator.share(shareData)
        } catch (err) {
            console.log('Share cancelled')
        }
    } else {
        navigator.clipboard.writeText(shareUrl)
        setShowCopyFeedback(true)
        setTimeout(() => setShowCopyFeedback(false), 2000)
    }
  }

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
          This manuscript is classified as <span className="text-amber-500 font-bold">Premium Tier</span>. Upgrade your educational node to unlock full access.
        </p>
        <div className="flex gap-4 mt-10">
          <button onClick={() => navigate(-1)} className="px-8 py-4 bg-slate-800 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-slate-700 transition-all">Go Back</button>
          <Link to="/subscription/verify" className="px-8 py-4 bg-teal-500 text-slate-950 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-teal-400 transition-all shadow-xl shadow-teal-500/20">Upgrade Now</Link>
        </div>
      </div>
    )
  }

  return (
    /* Removed global select-none to ensure custom touch gestures process clearly */
    <div className="fixed inset-0 bg-slate-100 z-[100] flex flex-col font-sans overflow-hidden">
      {/* Top Overlay Header */}
      <div className="absolute top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-md z-50 flex items-center justify-between px-8 border-b border-slate-200 select-none">
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
          <button onClick={() => navigate(-1)} className="p-2.5 rounded-full bg-slate-100 hover:bg-rose-500 hover:text-white text-slate-500 transition-all border border-slate-200">
            <X size={20} />
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-grow relative flex items-center justify-center px-4 md:px-12 pt-20 pb-28">
        <Document
          file={book.pdf_url}
          onLoadSuccess={onDocumentLoadSuccess}
          loading={
            <div className="text-sm font-bold uppercase tracking-widest text-slate-400 animate-pulse select-none">
              Parsing Document Nodes...
            </div>
          }
        >
          {numPages > 0 && (
            <div
              className="relative transition-transform duration-500 ease-out"
              style={{
                transform: currentPage === 1 ? 'translateX(-225px)' : 'translateX(0px)'
              }}
            >
              {/* Central Spine Elements */}
              {currentPage > 1 && (
                <>
                  <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-[2px] bg-black/10 z-50 pointer-events-none" />
                  <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-16 bg-gradient-to-r from-black/5 via-black/15 to-black/5 z-40 pointer-events-none" />
                </>
              )}

              {/* @ts-ignore */}
              <HTMLFlipBook
                width={450}
                height={600}
                size="fixed"
                minWidth={300}
                maxWidth={600}
                minHeight={400}
                maxHeight={800}
                showCover={true}
                onFlip={onPageFlip}
                ref={flipBookRef}
                /* Added cursor-grab for visual dragging indication */
                className="overflow-hidden cursor-grab active:cursor-grabbing"
                style={{}}
                startPage={0}
                drawShadow={true}
                flippingTime={1000}
                usePortrait={false}
                startZIndex={0}
                autoSize={true}
                maxShadowOpacity={0.3}
                mobileScrollSupport={true}
                clickEventForward={true}
                /* Added sweep threshold so mouse sweeps activate flipping smoothly */
                swipeDistance={30}
              >
                {Array.from(new Array(numPages), (_, index) => (
                  <div
                    key={`page_${index + 1}`}
                    className="bg-white relative shadow-2xl h-full w-full flex items-center justify-center border border-slate-200/60 select-none"
                  >
                    {/* Inner wrapper pointer-events-none lets mouse clicks/drags fall directly to react-pageflip */}
                    <div className="pointer-events-none">
                      <Page
                        pageNumber={index + 1}
                        width={450}
                        renderAnnotationLayer={false}
                        renderTextLayer={false}
                        loading=""
                      />
                    </div>
                    {/* Page Numbering */}
                    <div className={`absolute bottom-3 text-[10px] font-bold text-slate-400 ${index % 2 === 0 ? 'left-6' : 'right-6'}`}>
                      {index + 1}
                    </div>
                  </div>
                ))}
              </HTMLFlipBook>
            </div>
          )}
        </Document>

        {/* Floating Page Label */}
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 bg-slate-900/90 backdrop-blur-md text-white text-[11px] font-bold px-4 py-1.5 rounded-full z-30 shadow-xl border border-white/10 select-none">
          Page {currentPage} of {numPages || '...'}
        </div>
      </div>

      {/* Flipbook Style Bottom Toolbar */}
      <div className="absolute bottom-0 left-0 right-0 bg-white text-slate-900 z-50 border-t border-slate-200 select-none">
        <div className="h-20 flex items-center justify-between px-8">
          <div className="flex flex-col justify-center min-w-[200px]">
            <h2 className="text-sm font-black text-slate-900 truncate tracking-tight">{book.title}</h2>
            <p className="text-[10px] font-bold text-slate-400 mt-0.5 truncate uppercase tracking-widest">
              Release Index: {book.created_at ? new Date(book.created_at).toLocaleDateString() : 'N/A'}
            </p>
          </div>

          {/* Navigation Controls (As displayed in image_23ed0b.png) */}
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
              disabled={currentPage >= numPages}
              className="p-3 rounded-xl bg-slate-100 text-slate-600 hover:bg-emerald-900 hover:text-white transition-all disabled:opacity-20 disabled:hover:bg-slate-100 disabled:hover:text-slate-600"
            >
              <ChevronRight size={20} />
            </button>
          </div>

          <div className="flex items-center gap-1 sm:gap-2">
            <button onClick={handleLike} className="flex flex-col items-center justify-center w-14 h-14 rounded-xl hover:bg-slate-50 transition-colors group">
              <ThumbsUp size={18} className={`transition-colors ${isLiked ? 'text-emerald-600 fill-current' : 'text-slate-400 group-hover:text-emerald-700'}`} />
              <span className={`text-[9px] font-black uppercase mt-1 transition-colors ${isLiked ? 'text-emerald-600' : 'text-slate-400 group-hover:text-emerald-700'}`}>Like</span>
            </button>
            <button onClick={handleShare} className="flex flex-col items-center justify-center w-14 h-14 rounded-xl hover:bg-slate-50 transition-colors group relative">
              {showCopyFeedback ? <Check size={18} className="text-emerald-600" /> : <Share2 size={18} className="text-slate-400 group-hover:text-emerald-700 transition-colors" />}
              <span className="text-[9px] font-black uppercase mt-1 text-slate-400 group-hover:text-emerald-700">Share</span>
              {showCopyFeedback && <span className="absolute -top-12 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[9px] font-black py-2 px-3 rounded-lg uppercase tracking-widest animate-in fade-in slide-in-from-bottom-2">Copied Link!</span>}
            </button>
            <button onClick={handleSave} className="flex flex-col items-center justify-center w-14 h-14 rounded-xl hover:bg-slate-50 transition-colors group">
              <Bookmark size={18} className={`transition-colors ${isSaved ? 'text-emerald-600 fill-current' : 'text-slate-400 group-hover:text-emerald-700'}`} />
              <span className={`text-[9px] font-black uppercase mt-1 transition-colors ${isSaved ? 'text-emerald-600' : 'text-slate-400 group-hover:text-emerald-700'}`}>{isSaved ? 'Saved' : 'Save'}</span>
            </button>
            <div className="w-[1px] h-8 bg-slate-200 mx-4"></div>
            <button onClick={toggleFullscreen} className="p-3 rounded-xl hover:bg-slate-50 text-slate-400 hover:text-slate-900 transition-colors">
              <Maximize2 size={20} />
            </button>
          </div>
        </div>

        {/* Scrubbing Progress Bar */}
        <div className="h-1.5 w-full bg-slate-100 relative">
          <div
            className="h-full bg-emerald-900 transition-all duration-300"
            style={{ width: `${numPages > 0 ? (currentPage / numPages) * 100 : 0}%` }}
          />
        </div>
      </div>
    </div>
  )
}