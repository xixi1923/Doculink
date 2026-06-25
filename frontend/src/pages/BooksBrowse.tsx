import { useEffect, useState } from 'react'
import {
  Search, Filter, BookOpen, Clock, Star, ArrowRight,
  Lock, CheckCircle2, Bookmark, LayoutGrid, List, Loader2
} from 'lucide-react'
import { Link } from 'react-router-dom'
import api from '@/api'
import { getImageUrl } from '@/utils/image'

export default function BooksBrowse() {
  const [books, setBooks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [categories, setCategories] = useState<any[]>([])
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedType, setSelectedType] = useState('all')

  const fetchBooks = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (search) params.append('search', search)
      if (selectedCategory) params.append('category_id', selectedCategory)
      if (selectedType !== 'all') params.append('book_type', selectedType)

      const res = await api.get(`/books?${params.toString()}`)
      setBooks(res.data.data || res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    const res = await api.get('/categories')
    setCategories(res.data)
  }

  useEffect(() => {
    fetchBooks()
    fetchCategories()
  }, [selectedCategory, selectedType])

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-20">
      {/* Hero Header */}
      <div className="bg-slate-900 text-white pt-32 pb-20 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-[120px] -mr-48 -mt-48"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
             <span className="px-4 py-1.5 bg-teal-500/20 border border-teal-500/30 rounded-full text-teal-400 text-[10px] font-black uppercase tracking-widest">
                Resource Library
             </span>
             <h1 className="text-5xl md:text-6xl font-black mt-6 tracking-tight">Explore the <span className="text-teal-400">Knowledge</span> Archive.</h1>
             <p className="text-slate-400 text-lg mt-6 leading-relaxed max-w-2xl">
                Access thousands of academic books, research papers, and exclusive premium resources curated for your educational journey.
             </p>

             {/* Search Bar */}
             <div className="mt-10 flex flex-col md:flex-row gap-4">
                <div className="flex-grow relative group">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-teal-500 transition-colors" size={20} />
                    <input
                        type="text"
                        placeholder="Search by title, author, or keywords..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && fetchBooks()}
                        className="w-full bg-white/5 border border-white/10 rounded-[2rem] py-5 pl-16 pr-8 text-white outline-none focus:bg-white/10 focus:border-teal-500 transition-all placeholder:text-slate-600 font-medium"
                    />
                </div>
                <button
                    onClick={fetchBooks}
                    className="px-10 py-5 bg-teal-500 text-slate-950 rounded-[2rem] font-black uppercase tracking-widest text-xs hover:bg-teal-400 transition-all shadow-xl shadow-teal-500/20 active:scale-95"
                >
                    Find Book
                </button>
             </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-10">
            {/* Sidebar Filters */}
            <aside className="space-y-8">
                <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 shadow-sm">
                    <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-6 flex items-center gap-3">
                        <Filter size={16} className="text-teal-600" /> Filter Criteria
                    </h3>

                    <div className="space-y-8">
                        {/* Type Toggle */}
                        <div className="space-y-3">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Access Protocol</p>
                            <div className="flex flex-col gap-2">
                                {['all', 'free', 'premium'].map(type => (
                                    <button
                                        key={type}
                                        onClick={() => setSelectedType(type)}
                                        className={`flex items-center justify-between px-5 py-3 rounded-2xl text-xs font-bold capitalize transition-all ${
                                            selectedType === type ? 'bg-slate-900 text-white shadow-lg' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                                        }`}
                                    >
                                        {type === 'all' ? 'Learning Hub' : type} {type === 'premium' && <Lock size={12} />}
                                        {selectedType === type && <CheckCircle2 size={14} className="text-teal-400" />}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Categories */}
                        <div className="space-y-3">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Knowledge Domains</p>
                            <div className="flex flex-col gap-1 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                                <button
                                    onClick={() => setSelectedCategory('')}
                                    className={`text-left px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                                        selectedCategory === '' ? 'text-teal-600 bg-teal-50/50' : 'text-slate-500 hover:bg-slate-50'
                                    }`}
                                >
                                    All Categories
                                </button>
                                {categories.map(cat => (
                                    <button
                                        key={cat.id}
                                        onClick={() => setSelectedCategory(cat.id.toString())}
                                        className={`text-left px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                                            selectedCategory === cat.id.toString() ? 'text-teal-600 bg-teal-50/50' : 'text-slate-500 hover:bg-slate-50'
                                        }`}
                                    >
                                        {cat.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-teal-600 to-teal-800 rounded-[2.5rem] p-8 text-white shadow-xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-700"></div>
                    <h4 className="text-xl font-black leading-tight">Go Premium Access.</h4>
                    <p className="text-teal-100 text-xs mt-3 leading-relaxed font-medium">Unlock exclusive textbooks, research papers, and downloads.</p>
                    <Link to="/subscription/verify" className="mt-6 inline-flex items-center gap-2 bg-white text-slate-950 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-teal-50 transition-all active:scale-95">
                        Upgrade Now <ArrowRight size={14} />
                    </Link>
                </div>
            </aside>

            {/* Book Grid */}
            <main className="space-y-8">
                <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                        Found <span className="text-slate-950">{books.length}</span> resources in Learning Hub
                    </p>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="aspect-[3/4] bg-white rounded-[2.5rem] border border-slate-200 animate-pulse"></div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {books.map(book => (
                            <Link
                                to={`/books/${book.slug}`}
                                key={book.id}
                                className="bg-white rounded-[2.5rem] border border-slate-200 p-6 hover:shadow-2xl hover:shadow-slate-200/50 hover:border-teal-500/30 transition-all group flex flex-col"
                            >
                                <div className="aspect-[3/4] rounded-3xl overflow-hidden bg-slate-100 relative mb-6 shadow-sm">
                                    <img src={getImageUrl(book.cover_image)} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={book.title} />

                                    <div className="absolute top-4 right-4">
                                        <div className={`px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest backdrop-blur-md border ${
                                            book.book_type === 'premium' ? 'bg-amber-500/20 border-amber-500/30 text-amber-200' : 'bg-emerald-500/20 border-emerald-500/30 text-emerald-200'
                                        }`}>
                                            {book.book_type === 'premium' ? 'Subscription Elite' : 'Free Access'}
                                        </div>
                                    </div>

                                    <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center text-slate-900 shadow-xl scale-75 group-hover:scale-100 transition-transform">
                                            <BookOpen size={24} />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex-grow">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-[9px] font-black text-teal-600 uppercase tracking-widest">{book.category?.name || 'Knowledge'}</span>
                                        <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{book.language}</span>
                                    </div>
                                    <h3 className="font-bold text-slate-900 leading-tight group-hover:text-teal-600 transition-colors line-clamp-2">{book.title}</h3>
                                    <p className="text-xs text-slate-500 font-medium mt-2">{book.author}</p>
                                </div>

                                <div className="mt-6 pt-6 border-t border-slate-50 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400">
                                            <Clock size={12} /> {new Date(book.created_at).getFullYear()}
                                        </div>
                                    </div>
                                    <div className="p-2 rounded-xl text-slate-300 hover:text-rose-500 transition-colors">
                                        <Bookmark size={16} />
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}

                {books.length === 0 && !loading && (
                    <div className="py-32 text-center bg-white rounded-[3rem] border border-dashed border-slate-200 shadow-sm">
                        <BookOpen size={64} className="mx-auto text-slate-100 mb-6" />
                        <h3 className="text-xl font-black text-slate-900">Zero Results Found.</h3>
                        <p className="text-slate-500 font-medium mt-2">Adjust your search parameters and try again.</p>
                        <button onClick={() => { setSearch(''); setSelectedCategory(''); setSelectedType('all'); fetchBooks(); }} className="mt-8 text-teal-600 font-black uppercase tracking-widest text-[10px] hover:underline">Reset Filters</button>
                    </div>
                )}
            </main>
        </div>
      </div>
    </div>
  )
}
