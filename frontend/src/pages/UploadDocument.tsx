import React, { useState, useEffect } from 'react'
import {
  UploadCloud,
  FileText,
  BookOpen,
  CheckCircle2,
  Loader2,
  AlertCircle,
  ChevronRight,
  ArrowLeft
} from 'lucide-react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { getCategories } from '@/api/categoryApi'
import api from '@/api/authApi'
import { useAuthStore } from '@/store/authStore'

type UploadType = 'document' | 'book';

export default function UploadDocument(): React.JSX.Element {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { user } = useAuthStore()
  const isAdmin = user?.role === 'admin'
  const [uploadType, setUploadType] = useState<UploadType>((searchParams.get('type') as UploadType) || 'document')
  const [categories, setCategories] = useState<any[]>([])
  const [universities, setUniversities] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState<string[]>([])

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category_id: '',
    university_id: searchParams.get('university_id') || '',
    subject: '',
    resource_level: '',
    publisher: '',
    publication_year: '',
    isbn: '',
    author: '',
  })
  const [file, setFile] = useState<File | null>(null)
  const [cover, setCover] = useState<File | null>(null)

  useEffect(() => {
    getCategories().then(setCategories)
    api.get('/universities').then(res => setUniversities(res.data))
  }, [])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCover(e.target.files[0])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) return setError('Please select a file to upload.')

    setLoading(true)
    setError('')
    setFieldErrors([])

    const data = new FormData()

    // Append fields
    Object.entries(formData).forEach(([key, value]) => {
        if (value) data.append(key, value)
    })

    // Append files
    data.append('file', file)
    if (cover) data.append('cover', cover)

    try {
      const endpoint = uploadType === 'document' ? '/documents' : '/books'
      await api.post(endpoint, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      setIsSuccess(true)
      setTimeout(() => navigate(uploadType === 'document' ? '/profile' : '/books'), 3000)
    } catch (err: any) {
      console.error('Upload Error:', err)
      const validationErrors = err.response?.data?.errors
      if (validationErrors) {
        const messages = Object.values(validationErrors).flat().map((message: any) => String(message))
        setFieldErrors(messages)
        setError('Please correct the highlighted fields below.')
      } else {
        setError(err.response?.data?.message || 'Upload failed. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-8 animate-in fade-in zoom-in duration-500">
        <div className="w-20 h-20 bg-teal-500/10 text-teal-600 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-teal-500/10">
          <CheckCircle2 size={40} />
        </div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Upload Successful!</h1>
        <p className="text-slate-600 max-w-sm font-medium">
          Your academic asset has been logged into the DocuLink matrix. It will be visible once processed.
        </p>
        <p className="text-teal-700 font-bold text-xs uppercase tracking-widest mt-8 flex items-center gap-2">
          Redirecting to your workspace <Loader2 size={14} className="animate-spin" />
        </p>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto py-10 px-4 sm:px-6 font-sans">
      <Link to="/" className="inline-flex items-center gap-2 text-xs font-black text-slate-500 uppercase tracking-widest mb-10 hover:text-teal-700 transition-colors">
        <ArrowLeft size={16} /> Back to Hub
      </Link>

      <div className="mb-12">
        <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-3">Asset Submission</h1>
        <p className="text-slate-600 font-medium text-sm">Contribute your educational resources to the global network.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

        {/* Step Navigation / Info */}
        <aside className="space-y-6">
          <div className="bg-white rounded-[32px] border border-slate-100 p-8 shadow-sm">
            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-8">Submission Mode</h3>
            <div className="space-y-3">
              <button
                type="button"
                onClick={() => setUploadType('document')}
                className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all ${uploadType === 'document' ? 'bg-teal-600 border-teal-600 text-white shadow-lg shadow-teal-600/20' : 'bg-slate-50 border-transparent text-slate-600 hover:bg-slate-100'}`}
              >
                <div className="flex items-center gap-3">
                  <FileText size={20} />
                  <span className="font-bold text-sm">Course Document</span>
                </div>
                <ChevronRight size={16} />
              </button>

              {isAdmin && (
                <button
                  type="button"
                  onClick={() => setUploadType('book')}
                  className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all ${uploadType === 'book' ? 'bg-teal-600 border-teal-600 text-white shadow-lg shadow-teal-600/20' : 'bg-slate-50 border-transparent text-slate-600 hover:bg-slate-100'}`}
                >
                  <div className="flex items-center gap-3">
                    <BookOpen size={20} />
                    <span className="font-bold text-sm">Full E-Book</span>
                  </div>
                  <ChevronRight size={16} />
                </button>
              )}
            </div>

            {!isAdmin && (
              <p className="mt-6 text-[10px] text-slate-500 leading-relaxed font-medium">
                Note: Full book uploads are restricted to Administrative roles to maintain library quality and copyright compliance.
              </p>
            )}
          </div>
        </aside>

        {/* Upload Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-8">

            {/* File Dropzone */}
            <div className="relative group">
              <input
                type="file"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                accept={uploadType === 'document' ? '.pdf,.docx,.pptx,.png,.jpg,.jpeg' : '.pdf,.epub'}
              />
              <div className={`p-12 rounded-[40px] border-2 border-dashed transition-all flex flex-col items-center justify-center text-center ${file ? 'bg-teal-50 border-teal-600/50' : 'bg-slate-50 border-slate-200 group-hover:border-teal-600/30'}`}>
                <div className={`w-16 h-16 rounded-3xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110 ${file ? 'bg-teal-600 text-white' : 'bg-white text-slate-400'}`}>
                  {file ? <CheckCircle2 size={32} /> : <UploadCloud size={32} />}
                </div>
                {file ? (
                  <div>
                    <p className="text-slate-900 font-bold text-sm">{file.name}</p>
                    <p className="text-teal-700 text-[10px] font-black uppercase tracking-widest mt-1">Ready for Mapping</p>
                  </div>
                ) : (
                  <div>
                    <p className="text-slate-900 font-bold mb-1 text-sm">Click or drag academic file</p>
                    <p className="text-slate-500 text-[10px] font-medium uppercase tracking-widest">Supports PDF, DOCX, EPUB (Max 50MB)</p>
                  </div>
                )}
              </div>
            </div>

            {/* Metadata Fields */}
            <div className="bg-white rounded-[32px] border border-slate-100 p-8 shadow-sm space-y-6">
               <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2">Resource Metadata</h3>

               <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-1">Title</label>
                  <input
                    required
                    value={formData.title}
                    onChange={e => setFormData({...formData, title: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-teal-600/20 outline-none transition-all"
                    placeholder="Enter descriptive resource title..."
                  />
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-1">Category</label>
                    <select
                      required
                      value={formData.category_id}
                      onChange={e => setFormData({...formData, category_id: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-teal-600/20 outline-none appearance-none"
                    >
                      <option value="">Select Category</option>
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-1">University or School</label>
                    <select
                      value={formData.university_id}
                      onChange={e => setFormData({...formData, university_id: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-teal-600/20 outline-none appearance-none"
                    >
                      <option value="">Select University or School (Optional)</option>
                      {universities.map(uni => (
                        <option key={uni.id} value={uni.id}>{uni.name}</option>
                      ))}
                    </select>
                  </div>

                  {uploadType === 'book' ? (
                    <>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-1">Author</label>
                        <input
                          required
                          value={formData.author}
                          onChange={e => setFormData({...formData, author: e.target.value})}
                          className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold text-slate-900 outline-none focus:ring-2 focus:ring-teal-600/20"
                          placeholder="Original author name"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-1">Publisher</label>
                        <input
                          value={formData.publisher}
                          onChange={e => setFormData({...formData, publisher: e.target.value})}
                          className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold text-slate-900 outline-none focus:ring-2 focus:ring-teal-600/20"
                          placeholder="Publishing house..."
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-1">ISBN</label>
                        <input
                          value={formData.isbn}
                          onChange={e => setFormData({...formData, isbn: e.target.value})}
                          className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold text-slate-900 outline-none focus:ring-2 focus:ring-teal-600/20"
                          placeholder="International Standard Book Number"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-1">Release Year</label>
                        <input
                          type="number"
                          value={formData.publication_year}
                          onChange={e => setFormData({...formData, publication_year: e.target.value})}
                          className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold text-slate-900 outline-none focus:ring-2 focus:ring-teal-600/20"
                          placeholder="e.g. 2024"
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-1">Subject / Course</label>
                        <input
                          value={formData.subject}
                          onChange={e => setFormData({...formData, subject: e.target.value})}
                          className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold text-slate-900 outline-none focus:ring-2 focus:ring-teal-600/20"
                          placeholder="e.g. Data Structures"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-1">Resource Level</label>
                        <select
                          value={formData.resource_level}
                          onChange={e => setFormData({...formData, resource_level: e.target.value})}
                          className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-teal-600/20 outline-none appearance-none"
                        >
                          <option value="">Select Level (Optional)</option>
                          <option value="High School">High School</option>
                          <option value="Year 1">Year 1</option>
                          <option value="Year 2">Year 2</option>
                          <option value="Year 3">Year 3</option>
                          <option value="Year 4">Year 4</option>
                          <option value="Master">Master</option>
                          <option value="PhD">PhD</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    </>
                  )}
               </div>

               <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-1">Abstract / Description</label>
                  <textarea
                    rows={4}
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold text-slate-900 outline-none resize-none focus:ring-2 focus:ring-teal-600/20"
                    placeholder="Provide a brief summary of the contents..."
                  />
               </div>

               {uploadType === 'book' && (
                 <div className="space-y-1.5 pt-4">
                   <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-1">Cover Artwork (Optional)</label>
                   <div className="flex items-center gap-4">
                      <div className={`w-20 h-28 rounded-xl border-2 border-dashed flex items-center justify-center shrink-0 ${cover ? 'border-teal-600 bg-teal-50' : 'border-slate-200'}`}>
                         {cover ? <img src={URL.createObjectURL(cover)} className="w-full h-full rounded-xl object-cover" alt="" /> : <BookOpen size={24} className="text-slate-300" />}
                      </div>
                      <input
                        type="file"
                        id="cover-upload"
                        className="hidden"
                        onChange={handleCoverChange}
                        accept="image/*"
                      />
                      <label htmlFor="cover-upload" className="px-6 py-3 bg-slate-100 text-slate-700 rounded-xl text-[10px] font-black uppercase tracking-widest cursor-pointer hover:bg-teal-600 hover:text-white transition-all">
                        Browse Artwork
                      </label>
                   </div>
                 </div>
               )}
            </div>

            {error && (
              <div className="p-5 bg-rose-50 border border-rose-100 rounded-[24px] space-y-3 text-sm font-bold text-rose-600">
                <div className="flex items-center gap-3">
                  <AlertCircle size={20} />
                  <span>{error}</span>
                </div>
                {fieldErrors.length > 0 && (
                  <ul className="list-disc list-inside space-y-1 text-rose-700 font-normal">
                    {fieldErrors.map((message, index) => (
                      <li key={index}>{message}</li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-grow bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white font-black uppercase tracking-widest text-xs py-5 rounded-[24px] shadow-xl shadow-teal-600/20 transition-all flex items-center justify-center gap-3"
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : <UploadCloud size={20} />}
                {loading ? 'Submitting to Matrix...' : `Broadcast ${uploadType}`}
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  )
}
