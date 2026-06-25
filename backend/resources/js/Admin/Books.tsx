import { useEffect, useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  BookOpen, Trash2, Edit3, Plus, Search, ExternalLink, Loader2, Filter,
  Upload, X, Check, AlertCircle, ChevronRight, FileText, LayoutGrid
} from 'lucide-react'
import api from '@/api/authApi'
import axios from 'axios'

export default function AdminBooks() {
  const [books, setBooks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState('')
  const [categories, setCategories] = useState<any[]>([])
  const [universities, setUniversities] = useState<any[]>([])

  // Form State
  const [showModal, setShowModal] = useState(false)
  const [formStep, setFormStep] = useState(1)
  const [isSaving, setIsSaving] = useState(false)
  const [activeBook, setActiveBook] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [imgErrors, setImgErrors] = useState<Record<string, boolean>>({})

  const [formData, setFormData] = useState({
    title: '', subtitle: '', author: '', description: '',
    publisher: '', isbn: '', language: 'English', category_id: '',
    university_id: '', book_type: 'free', status: 'published',
    is_featured: false, tags: '', page_count: ''
  })

  const [coverFile, setCoverFile] = useState<File | null>(null)
  const [pdfFile, setPdfFile] = useState<File | null>(null)
  const [coverPreview, setCoverPreview] = useState<string>('')

  const coverInputRef = useRef<HTMLInputElement>(null)
  const pdfInputRef = useRef<HTMLInputElement>(null)

  const getImageUrl = (path: string | null) => {
    if (!path) return '';
    if (path.startsWith('http') || path.startsWith('blob:') || path.startsWith('data:')) return path;
    const baseUrl = import.meta.env.VITE_R2_PUBLIC_URL || 'https://pub-b5c74841fa6f4115940d4354956c0d0d.r2.dev';
    return `${baseUrl}/${path}`.replace(/([^:]\/)\/+/g, "$1");
  };

  const uploadToR2 = async (file: File, folder: string) => {
    try {
      const { data } = await api.post('/admin/generate-presigned-url', {
        filename: file.name, file_type: file.type, folder: folder
      });
      await axios.create().put(data.upload_url, file, { headers: { 'Content-Type': file.type } });
      return data;
    } catch (err) {
      throw new Error('Failed to upload file to Cloudflare.');
    }
  };

  const fetchBooks = async () => {
    setLoading(true)
    try {
      const response = await api.get('/admin/books')
      setBooks(response.data.data || response.data || [])
    } catch (error) { console.error(error) } finally { setLoading(false) }
  }

  useEffect(() => {
    fetchBooks()
    api.get('/categories').then(res => setCategories(Array.isArray(res.data) ? res.data : []))
    api.get('/universities').then(res => setUniversities(Array.isArray(res.data) ? res.data : []))
  }, [])

  const resetForm = () => {
    setFormData({
      title: '', subtitle: '', author: '', description: '',
      publisher: '', isbn: '', language: 'English', category_id: '',
      university_id: '', book_type: 'free', status: 'published', is_featured: false, tags: '', page_count: ''
    })
    setCoverFile(null); setPdfFile(null); setCoverPreview(''); setActiveBook(null); setError(null); setFormStep(1);
  }

  const handleEdit = (book: any) => {
    setActiveBook(book)
    setFormData({
      title: book.title || '', subtitle: book.subtitle || '', author: book.author || '',
      description: book.description || '', publisher: book.publisher || '', isbn: book.isbn || '',
      language: book.language || 'English', category_id: book.category_id?.toString() || '',
      university_id: book.university_id?.toString() || '', book_type: book.book_type || 'free',
      status: book.status || 'published', is_featured: !!book.is_featured,
      tags: Array.isArray(book.tags) ? book.tags.join(', ') : '', page_count: book.page_count?.toString() || ''
    })
    setCoverPreview(book.cover_image || '')
    setFormStep(1); setShowModal(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to purge this record from the database?')) return
    try {
      await api.delete(`/admin/books/${id}`)
      setBooks(books.filter(b => b.id !== id))
    } catch (error) { alert('Failed to delete asset.') }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'cover' | 'pdf') => {
    const file = e.target.files?.[0]
    if (!file) return
    if (type === 'cover') {
      setCoverFile(file)
      const reader = new FileReader(); reader.onloadend = () => setCoverPreview(reader.result as string);
      reader.readAsDataURL(file)
    } else { setPdfFile(file) }
  }

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    setIsSaving(true); setError(null);

    if (!formData.title || !formData.author || !formData.category_id) {
        setError('Core fields (Title, Author, Category) are mandatory.'); setFormStep(1); setIsSaving(false); return;
    }

    try {
      let coverUrl = coverPreview;
      let pdfData: any = null;

      if (coverFile) {
        const result = await uploadToR2(coverFile, 'books/covers');
        coverUrl = result.public_url;
      }
      if (pdfFile) {
        pdfData = await uploadToR2(pdfFile, 'books/pdfs');
      }

      const payload = {
        ...formData,
        cover_image: coverUrl,
        pdf_url: pdfData ? pdfData.public_url : (activeBook ? activeBook.pdf_url : ''),
        file_path: pdfData ? pdfData.file_path : (activeBook ? activeBook.file_path : ''),
        file_size: pdfFile ? (pdfFile.size / 1024 / 1024).toFixed(2) + ' MB' : (activeBook ? activeBook.file_size : ''),
      };

      if (!payload.pdf_url || !payload.file_path) {
          throw new Error('PDF manuscript document is mandatory for registration.');
      }

      if (activeBook) {
          await api.post(`/admin/books/${activeBook.id}`, payload);
      } else {
          await api.post('/admin/books', payload);
      }

      setShowModal(false);
      await fetchBooks();
      resetForm();
    } catch (err: any) {
      console.error('BOOK SAVE ERROR:', err.response?.data || err);
      const errorMsg = err.response?.data?.message || err.response?.data?.error || err.message || 'Failed to securely transit records.';
      const detailedError = err.response?.data?.errors ? Object.values(err.response.data.errors).flat()[0] : null;
      setError(detailedError ? `${errorMsg}: ${detailedError}` : errorMsg);
    } finally { setIsSaving(false) }
  }

  const filteredBooks = Array.isArray(books) ? books.filter(book =>
    ((book?.title?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
     (book?.author?.toLowerCase() || '').includes(searchTerm.toLowerCase())) &&
    (filterCategory === '' || book?.category_id?.toString() === filterCategory)
  ) : []

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 font-sans bg-[#0b0f19] min-h-screen text-slate-100">

      {/* Top Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-800/80 pb-5">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Inventory Archive</h1>
          <p className="text-sm text-slate-400 mt-1">Audit system storage nodes, curate assets, or manage digital library metadata.</p>
        </div>
        <button
          onClick={() => { resetForm(); setShowModal(true); }}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#00b289] hover:bg-[#009b76] px-4 py-2.5 text-sm font-semibold text-white shadow-md transition-all active:scale-[0.98]"
        >
          <Plus size={16} /> Add Entry Node
        </button>
      </div>

      {/* Filter Block */}
      <div className="flex flex-col sm:flex-row gap-3 bg-[#111827] p-4 rounded-xl border border-slate-800/80 shadow-lg">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
          <input
            type="text"
            placeholder="Search by asset identity name, author, or ISBN..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#0b0f19] border border-slate-800 rounded-lg py-2.5 pl-10 pr-4 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-[#00b289] focus:ring-1 focus:ring-[#00b289]/20 transition-all"
          />
        </div>
        <div className="relative w-full sm:w-64">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="w-full bg-[#0b0f19] border border-slate-800 rounded-lg py-2.5 pl-10 pr-8 text-sm text-slate-300 focus:outline-none focus:border-[#00b289] appearance-none cursor-pointer"
          >
            <option value="">All Categories</option>
            {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
          </select>
        </div>
      </div>

      {/* Main Grid View */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 space-y-3">
          <Loader2 className="animate-spin text-[#00b289]" size={32} />
          <p className="text-xs font-medium text-slate-500 tracking-wider">Syncing secure database channels...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredBooks.map((book) => (
            <div key={book.id} className="bg-[#111827] border border-slate-800/80 rounded-xl p-5 flex flex-col justify-between shadow-md hover:border-slate-700/80 transition-all relative group overflow-hidden">
              {book.book_type === 'premium' && (
                <div className="absolute top-0 right-0 bg-[#00b289] text-white px-3 py-1 rounded-bl-lg text-[10px] font-bold uppercase tracking-wider shadow-sm">
                  Premium
                </div>
              )}

              <div className="flex gap-4">
                <div className="w-20 h-28 rounded-lg overflow-hidden bg-[#0b0f19] shrink-0 border border-slate-800 flex items-center justify-center shadow-inner">
                  {book.cover_image && !imgErrors[book.id] ? (
                    <img src={getImageUrl(book.cover_image)} className="w-full h-full object-cover" alt={book.title} onError={() => setImgErrors(prev => ({ ...prev, [book.id]: true }))} />
                  ) : (
                    <BookOpen size={24} className="text-slate-600" />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-base text-white truncate group-hover:text-[#00b289] transition-colors">{book.title}</h3>
                  <p className="text-xs text-slate-400 mt-0.5 truncate">by {book.author}</p>

                  <div className="flex flex-wrap gap-1.5 mt-3">
                    <span className="px-2 py-0.5 rounded bg-[#1f2937] text-slate-300 text-[11px] font-medium border border-slate-700">
                      {book.category?.name || 'General'}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[11px] font-medium border ${
                      book.status === 'published' ? 'bg-green-950/40 text-[#00b289] border-green-900/60' : 'bg-[#1f2937] text-slate-400 border-slate-700'
                    }`}>
                      {book.status}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between mt-5 pt-3 border-t border-slate-800/60">
                <div className="flex gap-1">
                  <button onClick={() => handleEdit(book)} className="p-1.5 rounded-md text-slate-400 hover:text-[#00b289] hover:bg-[#1f2937] transition-colors"><Edit3 size={16} /></button>
                  <button onClick={() => handleDelete(book.id)} className="p-1.5 rounded-md text-slate-400 hover:text-red-400 hover:bg-[#1f2937] transition-colors"><Trash2 size={16} /></button>
                </div>
                {book.pdf_url && (
                  <a href={book.pdf_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs font-medium text-[#00b289] hover:text-[#009b76]">
                    View Asset <ExternalLink size={12} />
                  </a>
                )}
              </div>
            </div>
          ))}

          {filteredBooks.length === 0 && (
            <div className="col-span-full py-16 text-center bg-[#111827] border border-slate-800 rounded-xl shadow-sm">
              <LayoutGrid size={40} className="text-slate-700 mx-auto mb-3" />
              <p className="text-slate-400 font-medium text-sm">No storage registry modules discovered.</p>
            </div>
          )}
        </div>
      )}

      {/* Expanded Modal Workspace Frame (Now max-w-4xl for broad visibility) */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="relative w-full max-w-4xl bg-[#111827] border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">

            {/* Modal Header & Progress Tracker */}
            <div className="px-8 pt-6 pb-4 border-b border-slate-800 shrink-0">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-xl font-bold text-white tracking-tight">{activeBook ? 'Update Asset Core Structure' : 'Initialize Asset Entry'}</h2>
                <button onClick={() => setShowModal(false)} className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"><X size={20} /></button>
              </div>

              {/* 3-Step Clear Functional Progress Stepper Line */}
              <div className="flex items-center justify-between relative max-w-2xl mx-auto py-2">
                <div className="absolute top-[23px] left-0 right-0 h-[2px] bg-slate-800 -z-10" />

                {/* Step 1 Control */}
                <button type="button" onClick={() => setFormStep(1)} className="flex flex-col items-center gap-2 focus:outline-none">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all ${
                    formStep === 1 ? 'bg-[#00b289] border-[#00b289] text-white shadow-lg shadow-[#00b289]/20' : 'bg-[#00b289] border-[#00b289] text-white'
                  }`}>
                    {formStep > 1 ? <Check size={16} /> : '1'}
                  </div>
                  <span className={`text-[11px] font-semibold tracking-wider uppercase ${formStep === 1 ? 'text-[#00b289] font-bold' : 'text-slate-400'}`}>1. Identities</span>
                </button>

                {/* Step 2 Control */}
                <button type="button" disabled={!formData.title} onClick={() => setFormStep(2)} className="flex flex-col items-center gap-2 focus:outline-none disabled:opacity-40">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all ${
                    formStep === 2 ? 'bg-[#00b289] border-[#00b289] text-white shadow-lg shadow-[#00b289]/20' :
                    formStep > 2 ? 'bg-[#00b289] border-[#00b289] text-white' : 'bg-[#0b0f19] border-slate-700 text-slate-500'
                  }`}>
                    {formStep > 2 ? <Check size={16} /> : '2'}
                  </div>
                  <span className={`text-[11px] font-semibold tracking-wider uppercase ${formStep === 2 ? 'text-[#00b289] font-bold' : 'text-slate-400'}`}>2. Metadata</span>
                </button>

                {/* Step 3 Control */}
                <button type="button" disabled={!formData.title} onClick={() => setFormStep(3)} className="flex flex-col items-center gap-2 focus:outline-none disabled:opacity-40">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all ${
                    formStep === 3 ? 'bg-[#00b289] border-[#00b289] text-white shadow-lg shadow-[#00b289]/20' : 'bg-[#0b0f19] border-slate-700 text-slate-500'
                  }`}>
                    3
                  </div>
                  <span className={`text-[11px] font-semibold tracking-wider uppercase ${formStep === 3 ? 'text-[#00b289] font-bold' : 'text-slate-500'}`}>3. File Storage</span>
                </button>
              </div>
            </div>

            {/* Modal Body Contents */}
            <div className="flex-1 overflow-y-auto p-8 bg-[#0b0f19]/40">
              {error && (
                <div className="mb-6 p-4 bg-red-950/40 border border-red-900/60 rounded-lg flex items-center gap-2.5 text-red-400 text-sm">
                  <AlertCircle size={18} className="shrink-0" />
                  <p className="font-medium">{error}</p>
                </div>
              )}

              {/* STEP 1: Core Identities Content */}
              {formStep === 1 && (
                <div className="space-y-5 max-w-2xl mx-auto py-4 animate-in fade-in duration-150">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Asset Node Title *</label>
                    <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full bg-[#0b0f19] border border-slate-800 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-[#00b289] focus:ring-1 focus:ring-[#00b289]/20" placeholder="e.g. Distributed Operating Systems" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Sub-Identity Edition Descriptor</label>
                    <input type="text" value={formData.subtitle} onChange={e => setFormData({...formData, subtitle: e.target.value})} className="w-full bg-[#0b0f19] border border-slate-800 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-[#00b289]" placeholder="e.g. Volume III: Architecture Strategies" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Lead Origin Author / Creator *</label>
                    <input required type="text" value={formData.author} onChange={e => setFormData({...formData, author: e.target.value})} className="w-full bg-[#0b0f19] border border-slate-800 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-[#00b289]" placeholder="e.g. Dr. Sasa Hamamichi" />
                  </div>
                </div>
              )}

              {/* STEP 2: Secondary Attributes & Metadata */}
              {formStep === 2 && (
                <div className="space-y-5 max-w-2xl mx-auto py-4 animate-in fade-in duration-150">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Classification Category *</label>
                      <select required value={formData.category_id} onChange={e => setFormData({...formData, category_id: e.target.value})} className="w-full bg-[#0b0f19] border border-slate-800 rounded-lg px-4 py-3 text-sm text-slate-300 focus:outline-none focus:border-[#00b289]">
                        <option value="">Choose Classification</option>
                        {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Registry Security Status</label>
                      <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full bg-[#0b0f19] border border-slate-800 rounded-lg px-4 py-3 text-sm text-slate-300 focus:outline-none focus:border-[#00b289]">
                        <option value="published">Published Live</option>
                        <option value="draft">System Draft</option>
                        <option value="archived">Cold Storage</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">ISBN-13 Serial Identity</label>
                      <input type="text" value={formData.isbn} onChange={e => setFormData({...formData, isbn: e.target.value})} className="w-full bg-[#0b0f19] border border-slate-800 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-[#00b289]" placeholder="978-..." />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Total Page Metrics</label>
                      <input type="number" value={formData.page_count} onChange={e => setFormData({...formData, page_count: e.target.value})} className="w-full bg-[#0b0f19] border border-slate-800 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-[#00b289]" placeholder="e.g. 540" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Indexing Meta Keywords (Comma Separated)</label>
                    <input type="text" value={formData.tags} onChange={e => setFormData({...formData, tags: e.target.value})} className="w-full bg-[#0b0f19] border border-slate-800 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-[#00b289]" placeholder="e.g. networking, servers, design-patterns" />
                  </div>
                </div>
              )}

              {/* STEP 3: Isolated File Storage Elements (Enlarged Layout Dropblocks) */}
              {formStep === 3 && (
                <div className="animate-in fade-in duration-150 max-w-4xl mx-auto py-2">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                    {/* Big Cover Art Box */}
                    <div className="md:col-span-1">
                      <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Cover Art Frame</label>
                      <div
                        onClick={() => coverInputRef.current?.click()}
                        className="aspect-[3/4] w-full rounded-xl border-2 border-dashed border-slate-700 bg-[#0b0f19] flex flex-col items-center justify-center overflow-hidden cursor-pointer hover:border-[#00b289] hover:bg-teal-950/10 transition-all shadow-inner group"
                      >
                        {coverPreview ? (
                          <img src={getImageUrl(coverPreview)} className="w-full h-full object-cover" alt="Preview" />
                        ) : (
                          <div className="text-center p-6">
                            <Upload className="mx-auto text-slate-500 group-hover:text-[#00b289] mb-3 transition-colors" size={32} />
                            <p className="text-sm font-semibold text-slate-300">Upload Cover Image</p>
                            <p className="text-xs text-slate-500 mt-1">PNG, JPG format standard</p>
                          </div>
                        )}
                        <input ref={coverInputRef} type="file" className="hidden" accept="image/*" onChange={e => handleFileChange(e, 'cover')} />
                      </div>
                    </div>

                    {/* Giant PDF Upload Block Container */}
                    <div className="md:col-span-2 flex flex-col justify-between space-y-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Manuscript Source Document (PDF)</label>
                        <div
                          onClick={() => pdfInputRef.current?.click()}
                          className={`py-12 px-8 rounded-xl border-2 border-dashed text-center cursor-pointer transition-all shadow-sm group ${
                            pdfFile ? 'border-teal-600 bg-teal-950/20' : 'border-slate-700 bg-[#0b0f19] hover:border-[#00b289]'
                          }`}
                        >
                          {pdfFile ? (
                            <div className="flex items-center gap-4 text-left max-w-md mx-auto">
                              <div className="w-12 h-12 bg-teal-900/50 text-[#00b289] rounded-xl flex items-center justify-center shrink-0 shadow-md">
                                <FileText size={24} />
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="text-sm font-bold text-slate-200 truncate">{pdfFile.name}</p>
                                <p className="text-xs text-[#00b289] font-medium mt-0.5">Manuscript Packaged Securely</p>
                              </div>
                            </div>
                          ) : (
                            <div className="max-w-sm mx-auto">
                              <Upload className="mx-auto text-slate-500 group-hover:text-[#00b289] mb-3 transition-colors" size={36} />
                              <p className="text-sm font-bold text-slate-200">Select cluster document file payload</p>
                              <p className="text-xs text-slate-500 mt-1.5">Supports high-density architecture digital (.pdf) asset nodes</p>
                            </div>
                          )}
                          <input ref={pdfInputRef} type="file" className="hidden" accept="application/pdf" onChange={e => handleFileChange(e, 'pdf')} />
                        </div>
                      </div>

                      {/* Featured Checkbox Option Panel */}
                      <div className="p-4 bg-[#0b0f19] rounded-xl border border-slate-800/80">
                        <label className="flex items-center gap-3.5 cursor-pointer group">
                          <input type="checkbox" checked={formData.is_featured} onChange={e => setFormData({...formData, is_featured: e.target.checked})} className="w-5 h-5 rounded text-[#00b289] border-slate-700 bg-[#0b0f19] focus:ring-[#00b289]/40" />
                          <div className="flex flex-col">
                            <span className="text-sm font-semibold text-slate-300 group-hover:text-slate-100 transition-colors">Promote to Mainframe Feed</span>
                            <span className="text-xs text-slate-500">Highlight entry context prominently inside active dashboard discovery nodes.</span>
                          </div>
                        </label>
                      </div>
                    </div>

                  </div>
                </div>
              )}
            </div>

            {/* Modal Controls Footer */}
            <div className="px-8 py-5 bg-[#1f2937]/30 border-t border-slate-800 flex items-center justify-between shrink-0">
              <button
                type="button"
                onClick={() => formStep === 1 ? setShowModal(false) : setFormStep(prev => prev - 1)}
                className="px-4 py-2 text-sm font-semibold text-slate-400 hover:text-white transition-colors"
              >
                {formStep === 1 ? 'Cancel Operation' : `Back to Phase ${formStep - 1}`}
              </button>

              {formStep < 3 ? (
                <button
                  type="button"
                  onClick={() => setFormStep(prev => prev + 1)}
                  className="px-5 py-2.5 bg-[#00b289] hover:bg-[#009b76] text-white font-semibold text-sm rounded-lg flex items-center gap-1.5 shadow-md transition-all active:scale-[0.98]"
                >
                  Next Phase <ChevronRight size={16} />
                </button>
              ) : (
                <button
                  disabled={isSaving}
                  onClick={() => handleSubmit()}
                  className="px-6 py-2.5 bg-[#00b289] hover:bg-[#009b76] text-white font-semibold text-sm rounded-lg flex items-center gap-2 shadow-md transition-all active:scale-[0.98] disabled:opacity-50"
                >
                  {isSaving ? <Loader2 className="animate-spin" size={16} /> : null} Commit Database Matrix
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
