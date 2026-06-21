import React, { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Search, ChevronDown, BookOpen, ArrowUpRight, Loader2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import api from '@/api/authApi'

interface BookItem {
  id: number;
  title: string;
  author: string;
  cover_image: string;
  category_id: number;
  category?: { name: string };
  downloads_count?: number;
}

export default function Books(): React.JSX.Element {
  const [books, setBooks] = useState<BookItem[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState<number | null>(null)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    fetchCategories()
    fetchBooks()
  }, [page, activeCategory])

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
    setPage(1)
    fetchBooks()
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 selection:bg-primary/30 transition-colors duration-300">

      {/* ================= HERO SECTION ================= */}
      <div className="bg-[#111827] rounded-[48px] p-10 md:p-20 mb-16 relative overflow-hidden text-center shadow-2xl shadow-gray-900/10">
        <div className="relative z-10 max-w-3xl mx-auto space-y-6">
          <div className="space-y-4">
            <span className="text-[10px] font-black text-teal-400 uppercase tracking-[0.4em] bg-white/5 border border-white/10 px-5 py-2 rounded-full backdrop-blur-sm">
              Premium E-Book Library
            </span>
            <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-tight">
              Curated <span className="text-teal-500 italic">Education</span>
            </h1>
            <p className="text-gray-400 text-lg max-w-xl mx-auto font-medium leading-relaxed">
              Explore our collection of high-yield academic textbooks and research-backed pedagogical resources.
            </p>
          </div>

          <form onSubmit={handleSearch} className="max-w-md mx-auto relative group">
            <input
              type="text"
              placeholder="Search by title or author..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white/10 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-gray-500 outline-none focus:border-teal-500/50 transition-all backdrop-blur-md"
            />
            <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-teal-400 transition-colors" />
          </form>
        </div>

        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-teal-500/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-[100px]" />
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">

        {/* SIDEBAR NAVIGATION FILTERS */}
        <aside className="w-full lg:w-60 shrink-0 space-y-6">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-[28px] border border-slate-100 dark:border-gray-800 shadow-sm">
            <h3 className="font-bold text-[11px] mb-4 uppercase tracking-widest text-slate-400 dark:text-gray-500">
              Categories
            </h3>
            <ul className="space-y-1">
              <li>
                <button
                  onClick={() => { setActiveCategory(null); setPage(1); }}
                  className={`text-[13px] font-semibold flex items-center justify-between w-full py-2 px-3 rounded-xl transition-all ${!activeCategory ? 'bg-teal-50 dark:bg-teal-500/10 text-teal-600 dark:text-teal-400' : 'text-slate-600 dark:text-gray-400 hover:bg-slate-50 dark:hover:bg-gray-800'}`}
                >
                  All Books
                </button>
              </li>
              {categories.map((cat) => (
                <li key={cat.id}>
                  <button
                    onClick={() => { setActiveCategory(cat.id); setPage(1); }}
                    className={`text-[13px] font-semibold flex items-center justify-between w-full py-2 px-3 rounded-xl transition-all ${activeCategory === cat.id ? 'bg-teal-50 dark:bg-teal-500/10 text-teal-600 dark:text-teal-400' : 'text-slate-600 dark:text-gray-400 hover:bg-slate-50 dark:hover:bg-gray-800'}`}
                  >
                    <span>{cat.name}</span>
                  </button>
                </li>
              ))}
            </ul>
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
              <div className="flex items-center justify-between mb-6 px-1">
                <div>
                  <h2 className="text-xl font-black text-slate-800 dark:text-white tracking-tight">Literature Courses</h2>
                  <p className="text-[11px] text-slate-400 dark:text-gray-500 font-medium">Showing {books.length} resources available</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {books.map((book) => (
                  <Link
                    key={book.id}
                    to={`/books/${book.id}`}
                    className="bg-white dark:bg-gray-900 rounded-[24px] p-4 shadow-sm border border-slate-100/80 dark:border-gray-800 hover:shadow-xl dark:hover:shadow-teal-500/10 hover:-translate-y-1 transition-all duration-300 group flex flex-col justify-between"
                  >
                    <div>
                      <div className="aspect-[3/4] rounded-[16px] overflow-hidden mb-4 shadow-sm relative bg-slate-50 dark:bg-gray-800">
                        <img
                          src={book.cover_image || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=400'}
                          alt={book.title}
                          className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                        />
                        <div className="absolute top-3 right-3 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md px-2.5 py-1 rounded-lg text-[9px] font-black text-teal-600 dark:text-teal-400 uppercase tracking-wider shadow-sm border border-slate-100/50 dark:border-gray-700">
                          {book.category?.name}
                        </div>
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
                        <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-wide">Free Access</span>
                        <span className="text-[9px] text-slate-400 dark:text-gray-500 font-medium">{book.downloads_count || 0} downloads</span>
                      </div>
                      <div className="bg-gradient-to-r from-teal-500 to-sky-500 hover:opacity-95 text-white px-4 py-2 rounded-xl text-[11px] font-bold transition-all shadow-md shadow-teal-500/10 flex items-center gap-1 group/btn">
                        Read Free
                        <ArrowUpRight size={12} className="group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-1.5 mb-8">
                  <button
                    disabled={page === 1}
                    onClick={() => setPage(prev => prev - 1)}
                    className="p-2 rounded-xl border border-slate-100 dark:border-gray-800 text-slate-400 dark:text-gray-500 hover:bg-slate-50 dark:hover:bg-gray-800 transition-all disabled:opacity-30"
                  >
                    <ChevronLeft size={15} />
                  </button>
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setPage(i + 1)}
                      className={`w-9 h-9 rounded-xl font-bold text-xs transition-all ${
                        page === i + 1
                          ? 'bg-gradient-to-br from-teal-500 to-sky-500 text-white shadow-md shadow-teal-500/20'
                          : 'bg-white dark:bg-gray-900 text-slate-400 dark:text-gray-500 border border-slate-100 dark:border-gray-800 hover:bg-slate-50 dark:hover:bg-gray-800'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    disabled={page === totalPages}
                    onClick={() => setPage(prev => prev + 1)}
                    className="p-2 rounded-xl border border-slate-100 dark:border-gray-800 text-slate-400 dark:text-gray-500 hover:bg-slate-50 dark:hover:bg-gray-800 transition-all disabled:opacity-30"
                  >
                    <ChevronRight size={15} />
                  </button>
                </div>
              )}
            </>
          )}
        </main>

      </div>
    </div>
  )
}
