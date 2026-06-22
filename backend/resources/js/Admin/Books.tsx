import { useEffect, useState } from 'react'
import { BookOpen, Trash2, Edit3, Plus, Search, ExternalLink, Loader2, Filter } from 'lucide-react'
import { Link } from 'react-router-dom'
import api from '@/api/authApi'

export default function AdminBooks() {
  const [books, setBooks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState('')
  const [categories, setCategories] = useState<any[]>([])

  const fetchBooks = async () => {
    setLoading(true)
    try {
      const response = await api.get('/books')
      // Pagination handling
      setBooks(response.data.data || response.data)
    } catch (error) {
      console.error('Failed to load books', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories')
      setCategories(response.data)
    } catch (error) {
      console.error('Failed to load categories', error)
    }
  }

  useEffect(() => {
    fetchBooks()
    fetchCategories()
  }, [])

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this book? This action is irreversible.')) return

    try {
      await api.delete(`/books/${id}`)
      setBooks(books.filter(b => b.id !== id))
    } catch (error) {
      console.error('Delete failed', error)
      alert('Failed to delete the book.')
    }
  }

  const filteredBooks = books.filter(book =>
    (book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
     book.author.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (filterCategory === '' || book.category_id.toString() === filterCategory)
  )

  return (
    <div className="space-y-8 animate-in fade-in duration-500 font-sans">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-teal-600">Library Management</p>
          <h1 className="mt-3 text-3xl font-black text-slate-900">E-Book Archive</h1>
          <p className="text-sm text-slate-600 font-medium">Curate and moderate the academic book collection.</p>
        </div>
        <Link
          to="/admin/upload"
          className="inline-flex items-center gap-2 rounded-2xl bg-teal-600 px-6 py-3 text-sm font-black uppercase tracking-widest text-white hover:bg-teal-700 transition-all shadow-lg shadow-teal-600/20"
        >
          <Plus size={18} /> Add New Book
        </Link>
      </div>

      {/* Filters Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative group md:col-span-2">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-teal-600 transition-colors" size={18} />
          <input
            type="text"
            placeholder="Search by title or author..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-2xl py-3.5 pl-12 pr-4 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-teal-600/50 transition-all shadow-sm"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-2xl py-3.5 pl-12 pr-4 text-sm text-slate-900 outline-none focus:border-teal-600/50 appearance-none transition-all cursor-pointer shadow-sm"
          >
            <option value="">All Categories</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="animate-spin text-teal-600 mb-4" size={32} />
          <p className="text-sm text-slate-500 font-bold uppercase tracking-widest">Auditing Library...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {filteredBooks.length > 0 ? filteredBooks.map((book) => (
            <div key={book.id} className="bg-white border border-slate-200 rounded-[32px] p-5 flex gap-6 hover:border-teal-600/30 hover:shadow-md transition-all group">
              <div className="w-24 h-32 rounded-2xl overflow-hidden bg-slate-50 shrink-0 shadow-sm border border-slate-100">
                <img
                  src={book.cover_image || 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=200'}
                  className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                  alt={book.title}
                />
              </div>

              <div className="flex-grow min-w-0 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-4 mb-1">
                    <h3 className="font-bold text-slate-900 truncate text-lg group-hover:text-teal-600 transition-colors">
                      {book.title}
                    </h3>
                    <div className="flex gap-1 shrink-0">
                       <button
                        onClick={() => handleDelete(book.id)}
                        className="p-2 rounded-xl bg-slate-50 text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all border border-transparent hover:border-rose-100"
                       >
                         <Trash2 size={16} />
                       </button>
                    </div>
                  </div>
                  <p className="text-slate-600 text-xs font-semibold mb-3">By {book.author}</p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2 py-0.5 rounded-lg bg-teal-50 text-teal-700 text-[9px] font-black uppercase tracking-widest border border-teal-100">
                      {book.category?.name || 'General'}
                    </span>
                    <span className="px-2 py-0.5 rounded-lg bg-slate-100 text-slate-600 text-[9px] font-black uppercase tracking-widest border border-slate-200">
                      {book.download_count || 0} Downloads
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-4">
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                    Added {new Date(book.created_at).toLocaleDateString()}
                  </span>
                  <Link
                    to={`/books/${book.id}`}
                    className="flex items-center gap-1.5 text-xs font-black text-teal-600 uppercase tracking-widest hover:underline"
                  >
                    View Node <ExternalLink size={14} />
                  </Link>
                </div>
              </div>
            </div>
          )) : (
            <div className="col-span-full py-20 text-center bg-slate-50 rounded-[40px] border border-dashed border-slate-200">
              <BookOpen size={48} className="text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500 font-bold tracking-tight uppercase text-xs">No books matched your criteria</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
