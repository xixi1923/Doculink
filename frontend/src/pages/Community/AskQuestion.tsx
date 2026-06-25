import React, { useState, useEffect, useRef } from 'react'
import { 
  Sparkles,
  Paperclip, 
  Globe, 
  Eye, 
  ArrowRight,
  MessageSquare,
  Loader2,
  X,
  CheckCircle2,
  AlertCircle,
  Image as ImageIcon
} from 'lucide-react'
import api from '@/api/authApi'
import { useNavigate } from 'react-router-dom'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// ================= TYPES & INTERFACES =================
interface Category {
  id: number;
  name: string;
}

interface QuestionFormState {
  title: string;
  content: string;
  category_id: string;
  isPublic: boolean;
}

export default function AskQuestion(): React.JSX.Element {
  const navigate = useNavigate()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [form, setForm] = useState<QuestionFormState>({
    title: '',
    content: '',
    category_id: '',
    isPublic: true
  })

  const [categories, setCategories] = useState<Category[]>([])
  const [image, setImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const res = await api.get('/categories')
      setCategories(res.data)
      if (res.data.length > 0) {
        setForm(prev => ({ ...prev, category_id: res.data[0].id.toString() }))
      }
    } catch (err) {
      console.error('Failed to fetch categories', err)
    }
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleToggleChange = () => {
    setForm(prev => ({ ...prev, isPublic: !prev.isPublic }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setError('Image size should be less than 2MB')
        return
      }
      setImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
      setError(null)
    }
  }

  const removeImage = () => {
    setImage(null)
    setImagePreview(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title.trim() || !form.content.trim()) {
      setError('Please fill in all required fields.')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('title', form.title)
      formData.append('content', form.content)
      formData.append('category_id', form.category_id)
      formData.append('is_public', form.isPublic ? '1' : '0')

      if (image) {
        formData.append('image', image)
      }

      const res = await api.post('/community/questions', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      setSuccess(true)
      setTimeout(() => {
        navigate(`/community/questions/${res.data.slug}`)
      }, 1500)
    } catch (err: any) {
      console.error('Failed to post question', err)
      setError(err.response?.data?.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6 font-sans text-slate-800 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom duration-500">
      
      {/* ================= HEADER CANVAS ================= */}
      <div className="mb-10">
        <span className="text-[10px] font-bold text-teal-600 uppercase tracking-widest bg-teal-500/10 px-3.5 py-1 rounded-full">
          Community Forum
        </span>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight mt-3">Ask the Community</h1>
        <p className="text-xs text-slate-400 mt-0.5 font-medium">Stuck on an assignment or lecture concept? Tap into the network for fast crowd-sourced breakdowns.</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-600 text-sm animate-in fade-in slide-in-from-top-2">
          <AlertCircle size={18} />
          <p className="font-medium">{error}</p>
          <button onClick={() => setError(null)} className="ml-auto hover:bg-red-100 p-1 rounded-lg transition-colors">
            <X size={16} />
          </button>
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 bg-teal-50 border border-teal-100 rounded-xl flex items-center gap-3 text-teal-600 text-sm animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 size={18} />
          <p className="font-medium">Question broadcasted successfully! Redirecting...</p>
        </div>
      )}

      {/* ================= TWO-COLUMN INTERACTIVE SPLIT ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* CORE DISCUSSIONS INPUT BOARD */}
        <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 md:p-8 space-y-5">
            
            {/* Subject Routing and Attachment Triggers */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-0.5">Target Domain / Subject</label>
                <select 
                  name="category_id"
                  value={form.category_id}
                  onChange={handleInputChange}
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-xs text-slate-700 font-bold outline-none focus:border-teal-500/40 shadow-sm transition-all focus:ring-2 focus:ring-teal-500/10"
                >
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              {/* Graphical Diagnostic Snap Uploader */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-0.5">Reference Image (Optional)</label>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className={cn(
                    "w-full flex items-center justify-between bg-slate-50 border border-slate-100 border-dashed rounded-xl px-4 py-2.5 text-xs transition-all hover:bg-slate-100",
                    image ? "text-teal-600 border-teal-500/30 bg-teal-50" : "text-slate-400 hover:text-teal-500 hover:border-teal-500/30"
                  )}
                >
                  <span className="font-medium truncate max-w-[180px]">
                    {image ? image.name : "Attach exercise snapshot..."}
                  </span>
                  <Paperclip size={14} />
                </button>
              </div>
            </div>

            {/* Image Preview Area */}
            {imagePreview && (
              <div className="relative inline-block mt-2">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="h-32 w-auto rounded-xl border border-slate-200 object-cover shadow-sm"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute -top-2 -right-2 bg-white text-slate-500 rounded-full p-1 shadow-md border border-slate-100 hover:text-red-500 transition-colors"
                >
                  <X size={14} />
                </button>
              </div>
            )}

            {/* Title / Primary Query Statement */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-0.5">Your Question</label>
              <input 
                type="text"
                name="title"
                value={form.title}
                onChange={handleInputChange}
                placeholder="Be specific — e.g., How do I resolve an Uncaught ReferenceError loop inside Vite hot reloads?"
                className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-extrabold text-slate-900 placeholder-slate-400 focus:border-teal-500/50 outline-none transition-all focus:ring-2 focus:ring-teal-500/10"
                required
              />
            </div>

            {/* Contextual Technical Explanation Deep Canvas */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center ml-0.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Contextual Details & Code Blocks</label>
                <span className="text-[9px] text-slate-400 font-bold bg-slate-100 px-2 py-0.5 rounded-md uppercase tracking-wider">Markdown Aided</span>
              </div>
              <textarea 
                name="content"
                value={form.content}
                onChange={handleInputChange}
                rows={10}
                placeholder="Paste code segments, console stack traces, compilation errors, or specify exact platform rules and parameters you are attempting to fulfill..."
                className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-xs text-slate-800 placeholder-slate-400 focus:border-teal-500/50 outline-none transition-all resize-none leading-relaxed focus:ring-2 focus:ring-teal-500/10"
                required
              ></textarea>
            </div>

          </div>

          {/* Bottom Dispatch Controls Tray */}
          <div className="flex items-center justify-between bg-slate-50 border border-slate-100 rounded-2xl p-4">
            <div className="flex items-center gap-3">
              <label className="relative inline-flex items-center cursor-pointer shrink-0">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={form.isPublic}
                  onChange={handleToggleChange}
                />
                <div className="w-9 h-5 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-teal-500"></div>
              </label>
              <div>
                <p className="text-xs font-extrabold text-slate-900 flex items-center gap-1">
                  {form.isPublic ? <Globe size={12} className="text-teal-500" /> : <Eye size={12} className="text-slate-400" />}
                  <span>{form.isPublic ? 'Visible to Network' : 'Private Routing Only'}</span>
                </p>
                <p className="text-[10px] text-slate-400 font-medium">Control who can locate your query item across global indexes.</p>
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className={cn(
                "inline-flex items-center gap-2 bg-[#0b1329] hover:bg-slate-900 text-teal-400 px-6 py-3 rounded-xl font-extrabold text-xs uppercase tracking-wider transition-all shadow-md border border-slate-800 transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none",
                loading && "pl-5"
              )}
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Broadcasting...</span>
                </>
              ) : (
                <>
                  <span>Broadcast Question</span>
                  <ArrowRight size={13} />
                </>
              )}
            </button>
          </div>
        </form>

        {/* SIDEBAR INTUITION & COMMUNITY GUIDELINES CARD */}
        <aside className="space-y-6">
          
          {/* Question Optimization Instructions */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
            <div className="flex items-center gap-2.5 text-slate-900 border-b border-slate-100 pb-4">
              <div className="w-8 h-8 bg-teal-500/10 text-teal-600 rounded-lg flex items-center justify-center shrink-0">
                <Sparkles size={16} />
              </div>
              <h3 className="text-xs font-black uppercase tracking-wider">Drafting the Perfect Query</h3>
            </div>
            
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-[11px] text-slate-500 leading-relaxed">
                <div className="mt-1 w-1.5 h-1.5 bg-teal-500 rounded-full shrink-0" />
                <p><strong>Isolate the Problem:</strong> Detail what you expected to take place versus what the runtime engine or asset calculation actually returned.</p>
              </li>
              <li className="flex items-start gap-3 text-[11px] text-slate-500 leading-relaxed">
                <div className="mt-1 w-1.5 h-1.5 bg-teal-500 rounded-full shrink-0" />
                <p><strong>Share Assets:</strong> Mention the specific handbook section, database connection setup, or framework version you are target modeling.</p>
              </li>
              <li className="flex items-start gap-3 text-[11px] text-slate-500 leading-relaxed">
                <div className="mt-1 w-1.5 h-1.5 bg-teal-500 rounded-full shrink-0" />
                <p><strong>Stay Courteous:</strong> Remember that peers across university departments vote and structure answers on their own personal clock!</p>
              </li>
            </ul>
          </div>

          {/* Quick Metrics Help Node Frame */}
          <div className="bg-[#0b1329] text-white rounded-2xl p-6 border border-slate-800 shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/5 rounded-full blur-xl translate-x-1/4 -translate-y-1/4" />
            <div className="relative z-10 space-y-4">
              <div className="flex gap-2.5 items-center text-teal-400">
                <MessageSquare size={18} />
                <h4 className="text-xs font-black uppercase tracking-wider">Fast Response Rates</h4>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Over <strong className="text-white">82%</strong> of structured code and STEM foundation questions logged into the DocuLink matrix receive structural tracking support within the first 4 hours of submission.
              </p>
              <div className="pt-2">
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-teal-500 h-full w-[82%]" />
                </div>
              </div>
            </div>
          </div>

        </aside>
        
      </div>
    </div>
  )
}
