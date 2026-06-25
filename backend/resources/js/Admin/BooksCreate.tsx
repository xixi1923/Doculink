import { useEffect, useState, useRef } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import {
  Upload, X, CheckCircle2, AlertCircle, FileText, Hash, Globe,
  Shield, Tag as TagIcon, ArrowLeft, Loader2, BookOpen
} from 'lucide-react'
import api from '@/api/authApi'
import axios from 'axios'

export default function AdminBooksCreate() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [categories, setCategories] = useState<any[]>([])
  const [universities, setUniversities] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    author: '',
    description: '',
    publisher: '',
    isbn: '',
    language: 'English',
    category_id: '',
    university_id: '',
    book_type: 'free',
    status: 'published',
    is_featured: false,
    tags: ''
  })

  const [existingFiles, setExistingFiles] = useState({
    cover_image: '',
    pdf_url: '',
    file_path: '',
    file_size: ''
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
        filename: file.name,
        file_type: file.type,
        folder: folder
      });

      await axios.create().put(data.upload_url, file, {
        headers: { 'Content-Type': file.type }
      });

      return data;
    } catch (err) {
      console.error('R2 Upload Error:', err);
      throw new Error('Failed to upload file to Cloudflare.');
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const [catsRes, unisRes] = await Promise.all([
          api.get('/categories'),
          api.get('/universities')
        ])
        setCategories(Array.isArray(catsRes.data) ? catsRes.data : [])
        setUniversities(Array.isArray(unisRes.data) ? unisRes.data : [])

        if (id) {
          const bookRes = await api.get(`/books/${id}`)
          const book = bookRes.data.book || bookRes.data
          setFormData({
            title: book.title || '',
            subtitle: book.subtitle || '',
            author: book.author || '',
            description: book.description || '',
            publisher: book.publisher || '',
            isbn: book.isbn || '',
            language: book.language || 'English',
            category_id: book.category_id?.toString() || '',
            university_id: book.university_id?.toString() || '',
            book_type: book.book_type || 'free',
            status: book.status || 'published',
            is_featured: !!book.is_featured,
            tags: Array.isArray(book.tags) ? book.tags.join(', ') : ''
          })
          setCoverPreview(book.cover_image || '')
          setExistingFiles({
            cover_image: book.cover_image || '',
            pdf_url: book.pdf_url || '',
            file_path: book.file_path || '',
            file_size: book.file_size || ''
          })
        }
      } catch (err) {
        console.error('Failed to fetch data', err)
        setError('Failed to load required data.')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [id])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'cover' | 'pdf') => {
    const file = e.target.files?.[0]
    if (!file) return

    if (type === 'cover') {
      setCoverFile(file)
      const reader = new FileReader()
      reader.onloadend = () => setCoverPreview(reader.result as string)
      reader.readAsDataURL(file)
    } else {
      setPdfFile(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setError(null)

    try {
      let coverUrl = existingFiles.cover_image;
      let finalPdfUrl = existingFiles.pdf_url;
      let finalFilePath = existingFiles.file_path;
      let finalFileSize = existingFiles.file_size;

      if (coverFile) {
        const result = await uploadToR2(coverFile, 'books/covers');
        coverUrl = result.public_url;
      }
      if (pdfFile) {
        const result = await uploadToR2(pdfFile, 'books/pdfs');
        finalPdfUrl = result.public_url;
        finalFilePath = result.file_path;
        finalFileSize = (pdfFile.size / 1024 / 1024).toFixed(2) + ' MB';
      }

      const payload = {
        ...formData,
        cover_image: coverUrl,
        pdf_url: finalPdfUrl,
        file_path: finalFilePath,
        file_size: finalFileSize,
      };

      if (!payload.pdf_url || !payload.file_path) {
          throw new Error('PDF manuscript is required for the archive.');
      }

      if (id) {
        await api.post(`/admin/books/${id}`, payload)
      } else {
        await api.post('/admin/books', payload)
      }
      navigate('/admin/books')
    } catch (err: any) {
      console.error('FULL BOOK SAVE ERROR:', err.response?.data || err);
      const errorMsg = err.response?.data?.message || err.response?.data?.error || err.message || 'Failed to save book.';
      const detailedError = err.response?.data?.errors ? Object.values(err.response.data.errors).flat()[0] : null;
      setError(detailedError ? `${errorMsg}: ${detailedError}` : errorMsg);
    } finally {
      setIsSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="animate-spin text-teal-600 mb-4" size={32} />
        <p className="text-sm text-slate-500 font-bold uppercase tracking-widest">Synchronizing Registry...</p>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <Link to="/admin/books" className="inline-flex items-center gap-2 text-xs font-black text-slate-500 uppercase tracking-widest mb-4 hover:text-teal-600 transition-colors">
            <ArrowLeft size={14} /> Back to Library
          </Link>
          <h1 className="text-3xl font-black text-slate-900">{id ? 'Modify Protocol' : 'Add New Book'}</h1>
          <p className="text-sm text-slate-600 font-medium">Configure database entry and secure storage assets.</p>
        </div>
      </div>

      <div className="bg-white rounded-[40px] border border-slate-200 shadow-sm overflow-hidden">
        <form onSubmit={handleSubmit} className="p-10 space-y-10">
          {error && (
            <div className="p-5 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-4 text-rose-600">
              <AlertCircle size={20} />
              <p className="text-sm font-bold">{error}</p>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Sidebar: Files */}
            <div className="lg:col-span-1 space-y-8">
              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                  <FileText size={14} className="text-teal-600" /> Cover Artwork
                </label>
                <div
                  onClick={() => coverInputRef.current?.click()}
                  className="aspect-[3/4] rounded-3xl border-2 border-dashed border-slate-200 bg-slate-50 flex flex-col items-center justify-center overflow-hidden cursor-pointer hover:border-teal-500 hover:bg-teal-50/50 transition-all group relative"
                >
                  {coverPreview ? (
                    <img src={getImageUrl(coverPreview)} className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-center p-6">
                      <Upload className="mx-auto text-slate-300 group-hover:text-teal-500 transition-colors mb-3" size={32} />
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Select Image</p>
                    </div>
                  )}
                  <input ref={coverInputRef} type="file" className="hidden" accept="image/*" onChange={e => handleFileChange(e, 'cover')} />
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                  <Upload size={14} className="text-teal-600" /> PDF Manuscript
                </label>
                <div
                  onClick={() => pdfInputRef.current?.click()}
                  className={`p-6 rounded-3xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all ${
                    pdfFile ? 'border-emerald-500 bg-emerald-50/30' : 'border-slate-200 bg-slate-50 hover:border-teal-500 hover:bg-teal-50/50'
                  }`}
                >
                  {pdfFile ? (
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-white">
                        <CheckCircle2 size={20} />
                      </div>
                      <div>
                        <p className="text-xs font-black text-emerald-700 truncate max-w-[150px]">{pdfFile.name}</p>
                        <p className="text-[9px] font-bold text-emerald-600 uppercase">File Staged</p>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center">
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Select PDF Document</p>
                    </div>
                  )}
                  <input ref={pdfInputRef} type="file" className="hidden" accept="application/pdf" onChange={e => handleFileChange(e, 'pdf')} />
                </div>
                {id && !pdfFile && (
                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest text-center mt-2">Leave empty to keep existing file</p>
                )}
              </div>
            </div>

            {/* Main: Details */}
            <div className="lg:col-span-2 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Main Title</label>
                  <input
                    required
                    value={formData.title}
                    onChange={e => setFormData({...formData, title: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-sm font-bold text-slate-900 outline-none focus:bg-white focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 transition-all"
                    placeholder="Enter book title"
                  />
                </div>
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Subtitle / Tagline</label>
                  <input
                    value={formData.subtitle}
                    onChange={e => setFormData({...formData, subtitle: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-sm font-bold text-slate-900 outline-none focus:bg-white focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 transition-all"
                    placeholder="Brief descriptive subtitle"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Lead Author</label>
                  <input
                    required
                    value={formData.author}
                    onChange={e => setFormData({...formData, author: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-sm font-bold text-slate-900 outline-none focus:bg-white focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 transition-all"
                    placeholder="Author name"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Publisher</label>
                  <input
                    value={formData.publisher}
                    onChange={e => setFormData({...formData, publisher: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-sm font-bold text-slate-900 outline-none focus:bg-white focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 transition-all"
                    placeholder="Publishing house"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">ISBN Identifier</label>
                  <div className="relative">
                    <Hash className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                    <input
                      value={formData.isbn}
                      onChange={e => setFormData({...formData, isbn: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-12 pr-5 py-4 text-sm font-bold text-slate-900 outline-none focus:bg-white focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 transition-all"
                      placeholder="ISBN-13"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Language</label>
                  <div className="relative">
                    <Globe className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                    <input
                      value={formData.language}
                      onChange={e => setFormData({...formData, language: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-12 pr-5 py-4 text-sm font-bold text-slate-900 outline-none focus:bg-white focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 transition-all"
                      placeholder="English, Khmer, etc."
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Abstract & Overview (Description)</label>
                <textarea
                  rows={4}
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-100 rounded-3xl px-6 py-5 text-sm font-medium text-slate-700 outline-none focus:bg-white focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 transition-all resize-none"
                  placeholder="Write a detailed summary and overview of the book contents..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Archive Category</label>
                  <select
                    required
                    value={formData.category_id}
                    onChange={e => setFormData({...formData, category_id: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-sm font-bold text-slate-900 outline-none focus:bg-white focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 transition-all appearance-none"
                  >
                    <option value="">Select Category</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Institutional Affiliation</label>
                  <select
                    value={formData.university_id}
                    onChange={e => setFormData({...formData, university_id: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-sm font-bold text-slate-900 outline-none focus:bg-white focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 transition-all appearance-none"
                  >
                    <option value="">None / General</option>
                    {universities.map(uni => (
                      <option key={uni.id} value={uni.id}>{uni.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Access Protocol</label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setFormData({...formData, book_type: 'free'})}
                      className={`flex-1 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                        formData.book_type === 'free' ? 'bg-teal-500 text-slate-900 shadow-lg shadow-teal-500/20' : 'bg-slate-100 text-slate-400'
                      }`}
                    >
                      Free Tier
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({...formData, book_type: 'premium'})}
                      className={`flex-1 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                        formData.book_type === 'premium' ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/20' : 'bg-slate-100 text-slate-400'
                      }`}
                    >
                      Premium Access
                    </button>
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Search Keywords (Comma separated)</label>
                <div className="relative">
                  <TagIcon className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                  <input
                    value={formData.tags}
                    onChange={e => setFormData({...formData, tags: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-12 pr-5 py-4 text-sm font-bold text-slate-900 outline-none focus:bg-white focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 transition-all"
                    placeholder="mathematics, calculus, stem"
                  />
                </div>
              </div>

              <div className="flex items-center gap-8 pt-4">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className={`w-12 h-6 rounded-full relative transition-all duration-300 ${formData.is_featured ? 'bg-teal-500' : 'bg-slate-200'}`}>
                    <input
                      type="checkbox"
                      className="hidden"
                      checked={formData.is_featured}
                      onChange={e => setFormData({...formData, is_featured: e.target.checked})}
                    />
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 shadow-sm ${formData.is_featured ? 'left-7' : 'left-1'}`} />
                  </div>
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest group-hover:text-slate-900 transition-colors">Feature on Homepage</span>
                </label>

                <div className="flex items-center gap-4">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Entry Status:</span>
                  <select
                    value={formData.status}
                    onChange={e => setFormData({...formData, status: e.target.value})}
                    className="bg-transparent text-[10px] font-black uppercase tracking-widest text-teal-600 outline-none cursor-pointer"
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft Mode</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-10 flex gap-4">
            <button
              type="button"
              onClick={() => navigate('/admin/books')}
              className="flex-1 px-8 py-5 rounded-3xl border border-slate-200 text-sm font-bold text-slate-500 hover:bg-slate-50 transition-all active:scale-95"
            >
              Cancel
            </button>
            <button
              disabled={isSaving}
              className="flex-[2] inline-flex items-center justify-center gap-3 rounded-3xl bg-teal-600 px-10 py-5 text-sm font-black uppercase tracking-widest text-white hover:bg-teal-700 transition-all shadow-xl shadow-teal-600/20 active:scale-95 disabled:opacity-50"
            >
              {isSaving ? <Loader2 className="animate-spin" size={20} /> : <Shield size={20} />}
              {id ? 'Update Secure Entry' : 'Add New Book'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
