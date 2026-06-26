import React, { useState, useEffect } from 'react'
import {
  ChevronLeft,
  ChevronRight,
  Search,
  BookOpen,
  ArrowUpRight,
  Loader2,
  Lock,
  Star,
  Download,
  Filter,
  ArrowRight,
  X,
  Plus,
  CheckCircle
} from 'lucide-react'
import { Link } from 'react-router-dom'
import api from '@/api/authApi'
import { getImageUrl } from '@/utils/image'

interface BookItem {
  id: number;
  title: string;
  author: string;
  cover_image: string;
  category_id: number;
  category?: { name: string };
  download_count?: number;
  book_type: 'free' | 'premium';
}

export default function Books(): React.JSX.Element {
  const [books, setBooks] = useState<BookItem[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState<number | null>(null)
  const [activeType, setActiveType] = useState<'all' | 'free' | 'premium'>('all')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  // Request Book State
  const [showRequestModal, setShowRequestModal] = useState(false)
  const [showSuccessPopup, setShowSuccessPopup] = useState(false)
  const [requestData, setRequestData] = useState({ title: '', author: '', description: '' })
  const [submittingRequest, setSubmittingRequest] = useState(false)

  useEffect(() => {
    fetchCategories()
  }, [])

  const handleRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmittingRequest(true)
    try {
      await api.post('/books/request', requestData)
      setShowRequestModal(false)
      setShowSuccessPopup(true)
      setRequestData({ title: '', author: '', description: '' })
    } catch (err) {
      console.error(err)
      alert('Failed to submit request. Please try again.')
    } finally {
      setSubmittingRequest(false)
    }
  }

  useEffect(() => {
    fetchBooks()
  }, [page, activeCategory, activeType])

  const fetchCategories = async () => {
    try {
      const res = await api.get('/categories')
      setCategories(res.data)
    } catch (err) {
      console.error(err)
    }
  }

  const fetchBooks = async () => {
    setLoading(true)
    try {
      const params: any = { page }
      if (activeCategory) params.category_id = activeCategory
      if (activeType !== 'all') params.book_type = activeType
      if (search) params.search = search

      const res = await api.get('/books', { params })
      setBooks(res.data.data || [])
      setTotalPages(res.data.last_page || 1)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (page === 1) {
      fetchBooks()
    } else {
      setPage(1)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 selection:bg-primary/30 transition-colors duration-300">

      {/* ================= HERO SECTION ================= */}
      <div className="bg-slate-900 rounded-[32px] p-8 md:p-14 mb-12 relative overflow-hidden shadow-2xl">
        <div className="relative z-10 max-w-3xl mx-auto text-center">
            <span className="inline-block px-4 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-[10px] font-black uppercase tracking-widest mb-6">
                Premium Digital Archive
            </span>
            <h1 className="text-3xl md:text-5xl font-black text-white leading-tight tracking-tight">
                Discover your next <span className="text-emerald-500 italic font-medium">Favorite</span> Book.
            </h1>
            <p className="text-slate-400 text-xs md:text-sm mt-6 font-medium leading-relaxed max-w-xl mx-auto">
                Explore our vast collection of academic resources, research materials, and premium documents curated just for your journey.
            </p>

            <form onSubmit={handleSearch} className="mt-10 flex flex-col sm:flex-row gap-3 max-w-xl mx-auto">
                <div className="flex-grow relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-emerald-500 transition-colors" size={18} />
                    <input
                        type="text"
                        placeholder="Find books by title, author, or ISBN..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-slate-700 outline-none focus:border-emerald-500/50 focus:bg-white/10 transition-all font-medium text-sm"
                    />
                </div>
                <button type="submit" className="px-10 py-4 bg-emerald-600 text-white rounded-2xl font-black uppercase tracking-widest text-[11px] hover:bg-emerald-500 transition-all shadow-xl shadow-emerald-950/20 active:scale-95">
                    Find Books
                </button>
            </form>
        </div>

        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-teal-500/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-[100px]" />
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">

        {/* SIDEBAR NAVIGATION FILTERS */}
        <aside className="w-full lg:w-60 shrink-0 space-y-6">
          {/* Access Protocol Filter */}
          <div className="bg-white dark:bg-gray-900 p-6 rounded-[28px] border border-slate-100 dark:border-gray-800 shadow-sm">
            <h3 className="font-bold text-[10px] mb-4 uppercase tracking-[0.2em] text-slate-400 dark:text-gray-500">
              Access Protocol
            </h3>
            <div className="flex flex-col gap-2">
                {[
                    { id: 'all', name: 'Learning Hub', icon: <BookOpen size={14} /> },
                    { id: 'free', name: 'Free Access', icon: <div className="w-2 h-2 rounded-full bg-emerald-500" /> },
                    { id: 'premium', name: 'Elite Tier', icon: <Lock size={12} className="text-amber-500" /> }
                ].map((type) => (
                    <button
                        key={type.id}
                        onClick={() => { setActiveType(type.id as any); setPage(1); }}
                        className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-black transition-all ${
                            activeType === type.id
                            ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/20'
                            : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-gray-800 border border-transparent hover:border-slate-100'
                        }`}
                    >
                        {type.icon}
                        {type.name}
                    </button>
                ))}
            </div>
          </div>

          {/* Categories Filter */}
          <div className="bg-white dark:bg-gray-900 p-6 rounded-[28px] border border-slate-100 dark:border-gray-800 shadow-sm">
            <h3 className="font-bold text-[10px] mb-4 uppercase tracking-[0.2em] text-slate-400 dark:text-gray-500">
              Knowledge Domains
            </h3>
            <ul className="space-y-1 mb-6">
              <li>
                <button
                  onClick={() => { setActiveCategory(null); setPage(1); }}
                  className={`text-xs font-bold flex items-center justify-between w-full py-2.5 px-4 rounded-xl transition-all ${!activeCategory ? 'text-emerald-600 bg-emerald-50/50' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-gray-800'}`}
                >
                  All Domains
                </button>
              </li>
              {categories.map((cat) => (
                <li key={cat.id}>
                  <button
                    onClick={() => { setActiveCategory(cat.id); setPage(1); }}
                    className={`text-xs font-bold flex items-center justify-between w-full py-2.5 px-4 rounded-xl transition-all ${activeCategory === cat.id ? 'text-emerald-600 bg-emerald-50/50' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-gray-800'}`}
                  >
                    <span>{cat.name}</span>
                  </button>
                </li>
              ))}
            </ul>

            <div className="pt-6 border-t border-slate-50 dark:border-gray-800">
                <button
                    onClick={() => setShowRequestModal(true)}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-500/20 hover:bg-emerald-100 dark:hover:bg-emerald-500/20 transition-all group"
                >
                    <div className="w-8 h-8 rounded-xl bg-white dark:bg-gray-900 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                        <Plus size={14} className="text-emerald-600" />
                    </div>
                    <div className="text-left">
                        <p className="text-[10px] font-black uppercase tracking-widest leading-none">Request</p>
                        <p className="text-[9px] font-bold opacity-60 mt-1">New Book</p>
                    </div>
                </button>
            </div>
          </div>
        </aside>

        {/* MAIN DECK PANEL GALLERY */}
        <main className="flex-grow w-full">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="animate-spin text-teal-500 mb-4" size={32} />
              <p className="text-sm text-slate-400 font-bold uppercase tracking-widest">Indexing Archive...</p>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-8 px-1">
                <div>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight">Resource Library</h2>
                  <div className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-1 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                    Synchronized Assets: {books.length} Nodes Discovery
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                {books.map((book) => (
                  <Link
                    key={book.id}
                    to={`/books/${book.id}`}
                    className="bg-white dark:bg-gray-900 rounded-[24px] p-4 shadow-sm border border-slate-100/80 dark:border-gray-800 hover:shadow-xl dark:hover:shadow-teal-500/10 hover:-translate-y-1 transition-all duration-300 group flex flex-col justify-between"
                  >
                    <div>
                      <div className="aspect-[3/4] rounded-[16px] overflow-hidden mb-4 shadow-sm relative bg-slate-50 dark:bg-gray-800">
                        <img
                          src={getImageUrl(book.cover_image) || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=400'}
                          alt={book.title}
                          className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                        />
                        <div className="absolute top-3 right-3 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md px-2.5 py-1 rounded-lg text-[9px] font-black text-teal-600 dark:text-teal-400 uppercase tracking-wider shadow-sm border border-slate-100/50 dark:border-gray-700">
                          {book.category?.name}
                        </div>
                        {book.book_type === 'premium' && (
                            <div className="absolute top-3 left-3 bg-amber-400 text-slate-950 px-2 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest flex items-center gap-1 shadow-sm">
                                <Lock size={10} /> Premium
                            </div>
                        )}
                      </div>

                      <div className="space-y-1 px-1">
                        <h3 className="font-extrabold text-sm text-slate-800 dark:text-gray-200 leading-snug line-clamp-2 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                          {book.title}
                        </h3>
                        <p className="text-slate-400 dark:text-gray-500 text-[11px] font-semibold">
                          By <span className="text-slate-500 dark:text-gray-400">{book.author}</span>
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 pt-3.5 border-t border-slate-50 dark:border-gray-800 flex items-center justify-between gap-2 px-1">
                      <div className="flex flex-col">
                        <span className={`text-[10px] font-black uppercase tracking-wide ${book.book_type === 'premium' ? 'text-amber-600' : 'text-emerald-600'}`}>
                            {book.book_type === 'premium' ? 'Subscription Elite' : 'Free Access'}
                        </span>
                        <span className="text-[9px] text-slate-400 dark:text-gray-500 font-medium">{book.download_count || 0} downloads</span>
                      </div>
                      <div className={`px-4 py-2 rounded-xl text-[11px] font-bold transition-all shadow-md flex items-center gap-1 group/btn ${book.book_type === 'premium' ? 'bg-amber-400 text-slate-950 hover:bg-amber-300 shadow-amber-400/10' : 'bg-gradient-to-r from-teal-500 to-sky-500 text-white hover:opacity-95 shadow-teal-500/10'}`}>
                        {book.book_type === 'premium' ? 'Access Elite' : 'Read Free'}
                        <ArrowUpRight size={12} className="group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-12 pb-10">
                  <button
                    disabled={page === 1}
                    onClick={() => setPage(prev => prev - 1)}
                    className="p-3 rounded-2xl border border-slate-100 bg-white text-slate-400 hover:text-emerald-700 transition-all disabled:opacity-20"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setPage(i + 1)}
                      className={`w-10 h-10 rounded-2xl font-black text-xs transition-all ${
                        page === i + 1
                          ? 'bg-slate-900 text-white shadow-xl shadow-slate-950/20'
                          : 'bg-white text-slate-400 border border-slate-100 hover:bg-slate-50'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    disabled={page === totalPages}
                    onClick={() => setPage(prev => prev + 1)}
                    className="p-3 rounded-2xl border border-slate-100 bg-white text-slate-400 hover:text-emerald-700 transition-all disabled:opacity-20"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              )}
            </>
          )}
        </main>

      </div>

      {/* REQUEST MODAL */}
      {showRequestModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setShowRequestModal(false)}></div>
          <div className="relative bg-white dark:bg-gray-900 w-full max-w-lg rounded-[32px] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="p-8">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white">Request Manuscript</h3>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Submit an acquisition request to our archive</p>
                </div>
                <button onClick={() => setShowRequestModal(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-gray-800 rounded-full transition-colors">
                    <X className="text-slate-400" size={20} />
                </button>
              </div>

              <form onSubmit={handleRequestSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Book Title</label>
                  <input
                    required
                    type="text"
                    value={requestData.title}
                    onChange={(e) => setRequestData({ ...requestData, title: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-gray-800 border border-slate-100 dark:border-gray-700 rounded-2xl px-5 py-3.5 text-sm font-bold outline-none focus:border-emerald-500/50 transition-all text-slate-900 dark:text-white"
                    placeholder="e.g. Advanced Quantum Mechanics"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Author / Publisher</label>
                  <input
                    type="text"
                    value={requestData.author}
                    onChange={(e) => setRequestData({ ...requestData, author: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-gray-800 border border-slate-100 dark:border-gray-700 rounded-2xl px-5 py-3.5 text-sm font-bold outline-none focus:border-emerald-500/50 transition-all text-slate-900 dark:text-white"
                    placeholder="e.g. J.J. Sakurai"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Additional Context (Optional)</label>
                  <textarea
                    rows={3}
                    value={requestData.description}
                    onChange={(e) => setRequestData({ ...requestData, description: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-gray-800 border border-slate-100 dark:border-gray-700 rounded-2xl px-5 py-3.5 text-sm font-bold outline-none focus:border-emerald-500/50 transition-all resize-none text-slate-900 dark:text-white"
                    placeholder="Tell us why this book is important or provide a link if possible..."
                  />
                </div>

                <div className="pt-4">
                  <button
                    disabled={submittingRequest}
                    type="submit"
                    className="w-full py-4 bg-slate-900 dark:bg-emerald-600 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] hover:opacity-90 transition-all shadow-xl shadow-slate-950/20 disabled:opacity-50"
                  >
                    {submittingRequest ? 'Transmitting Request...' : 'Initialize Request'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* SUCCESS POPUP */}
      {showSuccessPopup && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-md" onClick={() => setShowSuccessPopup(false)}></div>
            <div className="relative bg-white dark:bg-gray-900 w-full max-w-sm rounded-[40px] p-10 shadow-2xl animate-in zoom-in-95 duration-300 text-center">
                <div className="w-20 h-20 bg-emerald-500/10 text-emerald-500 rounded-[28px] flex items-center justify-center mx-auto mb-8 border border-emerald-500/20">
                    <CheckCircle size={40} strokeWidth={2.5} />
                </div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Request Transmitted</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-4 font-medium leading-relaxed">
                    Your manuscript acquisition request has been successfully logged in our archive. Our curators will review it shortly.
                </p>
                <button
                    onClick={() => setShowSuccessPopup(false)}
                    className="mt-10 w-full py-4 bg-slate-900 dark:bg-emerald-600 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] hover:opacity-90 transition-all shadow-xl shadow-slate-950/20"
                >
                    Acknowledge
                </button>
            </div>
        </div>
      )}
    </div>
  )
}
