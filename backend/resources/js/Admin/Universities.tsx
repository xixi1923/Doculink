import { useEffect, useState, useRef } from 'react'
import { Plus, Edit3, Trash2, Save, X, Building2, MapPin, Globe, Loader2, Hash, AlertCircle, Image as ImageIcon, Upload } from 'lucide-react'
import api from '@/api/authApi'

export default function AdminUniversities() {
  const [universities, setUniversities] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [activeUni, setActiveUni] = useState<any>(null)

  const [formData, setFormData] = useState({
    name: '',
    short_name: '',
    location: '',
    website: '',
    description: ''
  })

  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [coverFile, setCoverFile] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState<string>('')
  const [coverPreview, setCoverPreview] = useState<string>('')

  const logoInputRef = useRef<HTMLInputElement>(null)
  const coverInputRef = useRef<HTMLInputElement>(null)

  const [showForm, setShowForm] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchUniversities()
  }, [])

  const fetchUniversities = async () => {
    setLoading(true)
    try {
      const res = await api.get('/universities')
      setUniversities(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setActiveUni(null)
    setFormData({ name: '', short_name: '', location: '', website: '', description: '' })
    setLogoFile(null)
    setCoverFile(null)
    setLogoPreview('')
    setCoverPreview('')
    setError('')
    setShowForm(true)
  }

  const handleEdit = (uni: any) => {
    setActiveUni(uni)
    setFormData({
      name: uni.name,
      short_name: uni.short_name || '',
      location: uni.location || '',
      website: uni.website || '',
      description: uni.description || ''
    })
    setLogoPreview(uni.logo || '')
    setCoverPreview(uni.cover_image || '')
    setLogoFile(null)
    setCoverFile(null)
    setError('')
    setShowForm(true)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'logo' | 'cover') => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onloadend = () => {
      if (type === 'logo') {
        setLogoFile(file)
        setLogoPreview(reader.result as string)
      } else {
        setCoverFile(file)
        setCoverPreview(reader.result as string)
      }
    }
    reader.readAsDataURL(file)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setError('')

    const data = new FormData()
    data.append('name', formData.name)
    data.append('short_name', formData.short_name)
    data.append('location', formData.location)
    data.append('website', formData.website)
    data.append('description', formData.description)

    if (logoFile) data.append('logo', logoFile)
    if (coverFile) data.append('cover_image', coverFile)

    if (activeUni) {
        data.append('_method', 'PUT')
    }

    try {
      if (activeUni) {
        await api.post(`/universities/${activeUni.id}`, data, {
            headers: { 'Content-Type': 'multipart/form-data' }
        })
      } else {
        await api.post('/universities', data, {
            headers: { 'Content-Type': 'multipart/form-data' }
        })
      }
      fetchUniversities()
      setActiveUni(null)
      setShowForm(false)
    } catch (err: any) {
      console.error('Save Error:', err)
      setError(err.response?.data?.message || 'Failed to save university.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this university and all associated documents?')) return
    try {
      await api.delete(`/universities/${id}`)
      fetchUniversities()
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8 space-y-8 font-sans">
      {/* Header Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-teal-600">Institution management</p>
          <h1 className="mt-3 text-3xl font-black text-slate-900">Manage Universities</h1>
          <p className="text-sm text-slate-600 font-medium">Add and manage partner institutions and their digital repositories.</p>
        </div>
        <button
          onClick={resetForm}
          className="inline-flex items-center gap-2 rounded-3xl bg-teal-600 px-6 py-3 text-sm font-black uppercase tracking-widest text-white hover:bg-teal-700 transition-all shadow-lg shadow-teal-500/20 active:scale-95"
        >
          <Plus size={18} /> Add Institution
        </button>
      </div>

      {/* Main List */}
      <div className="grid grid-cols-1 gap-4">
        <section className="space-y-4">
           {loading ? (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               {[...Array(6)].map((_, i) => <div key={i} className="h-64 bg-white rounded-[32px] animate-pulse border border-slate-100" />)}
             </div>
           ) : universities.length > 0 ? (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               {universities.map(uni => (
                 <div key={uni.id} className="bg-white rounded-[32px] border border-slate-100 p-6 flex flex-col justify-between gap-6 hover:border-teal-500/40 hover:shadow-xl hover:shadow-slate-200/50 transition-all group">
                    <div>
                      <div className="flex items-start justify-between">
                         <div className="w-14 h-14 rounded-2xl overflow-hidden bg-slate-50 flex items-center justify-center text-teal-600 border border-slate-100 shrink-0 group-hover:bg-teal-600 group-hover:text-white transition-all duration-300">
                            {uni.logo ? (
                                <img src={uni.logo} alt="" className="w-full h-full object-cover" />
                            ) : (
                                <Building2 size={28} />
                            )}
                         </div>
                         <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleEdit(uni)}
                              className="p-2.5 rounded-xl text-slate-400 hover:text-teal-600 hover:bg-teal-50 transition-all"
                            >
                               <Edit3 size={18} />
                            </button>
                            <button
                              onClick={() => handleDelete(uni.id)}
                              className="p-2.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all"
                            >
                               <Trash2 size={18} />
                            </button>
                         </div>
                      </div>

                      <div className="mt-5">
                        <h3 className="font-bold text-lg text-slate-900 leading-tight group-hover:text-teal-600 transition-colors">{uni.name}</h3>
                        <span className="inline-block mt-1 px-2 py-0.5 bg-slate-100 text-slate-500 text-[10px] font-black rounded uppercase tracking-wider">{uni.short_name}</span>
                      </div>

                      <div className="mt-4 space-y-2.5">
                         <div className="flex items-center gap-2.5 text-xs font-bold text-slate-500 uppercase tracking-widest">
                            <MapPin size={14} className="text-teal-500" />
                            <span>{uni.location || 'Remote'}</span>
                         </div>
                         <div className="flex items-center gap-2.5 text-xs font-bold text-slate-500 uppercase tracking-widest">
                            <Globe size={14} className="text-teal-500" />
                            <span>{uni.website ? 'Active Digital Node' : 'Offline'}</span>
                         </div>
                      </div>
                    </div>

                    {uni.description && (
                      <p className="text-xs text-slate-500 font-medium line-clamp-2 leading-relaxed border-t border-slate-50 pt-4 italic">
                        "{uni.description}"
                      </p>
                    )}
                 </div>
               ))}
             </div>
           ) : (
              <div className="py-24 text-center bg-white rounded-[40px] border border-dashed border-slate-200 shadow-sm">
                <Building2 size={56} className="text-slate-100 mx-auto mb-6" />
                <p className="text-slate-400 font-bold uppercase text-xs tracking-[0.2em]">No institutions logged in matrix</p>
                <button onClick={resetForm} className="mt-6 text-teal-600 text-xs font-black uppercase tracking-widest hover:underline">Register First Node</button>
              </div>
           )}
        </section>
      </div>

      {/* Modal Popup */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-hidden">
           {/* Backdrop */}
           <div
             className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300"
             onClick={() => setShowForm(false)}
           />

           {/* Modal Content */}
           <div className="relative w-full max-w-xl bg-white rounded-[40px] shadow-2xl overflow-hidden flex flex-col max-h-full">
              <div className="flex items-center justify-between px-10 py-8 border-b border-slate-50 bg-slate-50/50 shrink-0">
                 <div>
                    <h2 className="text-2xl font-black text-slate-900">{activeUni ? 'Edit Institution' : 'New Node Registration'}</h2>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Configure database entry</p>
                 </div>
                 <button
                   onClick={() => setShowForm(false)}
                   className="p-3 rounded-2xl bg-white border border-slate-200 text-slate-400 hover:text-slate-900 hover:shadow-lg transition-all"
                 >
                    <X size={20} />
                 </button>
              </div>

              <form onSubmit={handleSubmit} className="p-10 space-y-6 overflow-y-auto overflow-x-hidden">
                 {/* Image Upload Row */}
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pb-2">
                    {/* Logo Upload */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Institutional Logo</label>
                        <div
                            onClick={() => logoInputRef.current?.click()}
                            className="relative group cursor-pointer aspect-square w-32 rounded-3xl border-2 border-dashed border-slate-200 bg-slate-50 flex flex-col items-center justify-center overflow-hidden hover:border-teal-500 hover:bg-teal-50/30 transition-all"
                        >
                            {logoPreview ? (
                                <>
                                    <img src={logoPreview} className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                        <Upload className="text-white" size={24} />
                                    </div>
                                </>
                            ) : (
                                <>
                                    <ImageIcon className="text-slate-300 group-hover:text-teal-500 transition-colors" size={32} />
                                    <span className="text-[10px] font-bold text-slate-400 mt-2 uppercase">Upload Logo</span>
                                </>
                            )}
                            <input type="file" ref={logoInputRef} className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'logo')} />
                        </div>
                    </div>

                    {/* Cover Image Upload */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Cover/Banner Image</label>
                        <div
                            onClick={() => coverInputRef.current?.click()}
                            className="relative group cursor-pointer aspect-[16/9] w-full rounded-3xl border-2 border-dashed border-slate-200 bg-slate-50 flex flex-col items-center justify-center overflow-hidden hover:border-teal-500 hover:bg-teal-50/30 transition-all"
                        >
                            {coverPreview ? (
                                <>
                                    <img src={coverPreview} className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                        <Upload className="text-white" size={24} />
                                    </div>
                                </>
                            ) : (
                                <>
                                    <ImageIcon className="text-slate-300 group-hover:text-teal-500 transition-colors" size={32} />
                                    <span className="text-[10px] font-bold text-slate-400 mt-2 uppercase">Upload Banner</span>
                                </>
                            )}
                            <input type="file" ref={coverInputRef} className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'cover')} />
                        </div>
                    </div>
                 </div>

                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-1.5 sm:col-span-2">
                       <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                          Official Name <span className="w-1 h-1 rounded-full bg-teal-500" />
                       </label>
                       <input
                          required
                          value={formData.name}
                          onChange={e => setFormData({...formData, name: e.target.value})}
                          className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-sm font-bold text-slate-900 outline-none focus:bg-white focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 transition-all"
                          placeholder="e.g. Royal University of Phnom Penh"
                       />
                    </div>

                    <div className="space-y-1.5">
                       <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Short Code</label>
                       <div className="relative">
                          <Hash className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                          <input
                             required
                             value={formData.short_name}
                             onChange={e => setFormData({...formData, short_name: e.target.value.toUpperCase()})}
                             className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-12 pr-5 py-4 text-sm font-bold text-slate-900 outline-none focus:bg-white focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 transition-all"
                             placeholder="RUPP"
                          />
                       </div>
                    </div>

                    <div className="space-y-1.5">
                       <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Location</label>
                       <input
                          value={formData.location}
                          onChange={e => setFormData({...formData, location: e.target.value})}
                          className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-sm font-bold text-slate-900 outline-none focus:bg-white focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 transition-all"
                          placeholder="Phnom Penh"
                       />
                    </div>

                    <div className="space-y-1.5 sm:col-span-2">
                       <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Digital Website (URL)</label>
                       <input
                          type="url"
                          value={formData.website}
                          onChange={e => setFormData({...formData, website: e.target.value})}
                          className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-sm font-bold text-slate-900 outline-none focus:bg-white focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 transition-all"
                          placeholder="https://www.example.edu.kh"
                       />
                    </div>

                    <div className="space-y-1.5 sm:col-span-2">
                       <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Institutional Profile</label>
                       <textarea
                          rows={3}
                          value={formData.description}
                          onChange={e => setFormData({...formData, description: e.target.value})}
                          className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-sm font-medium text-slate-800 outline-none focus:bg-white focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 transition-all resize-none"
                          placeholder="Summarize the institution's primary focus..."
                       />
                    </div>
                 </div>

                 {error && (
                   <div className="p-5 bg-rose-50 rounded-[24px] border border-rose-100 flex items-start gap-4">
                     <AlertCircle size={18} className="text-rose-500 shrink-0 mt-0.5" />
                     <p className="text-xs text-rose-600 font-bold leading-relaxed">{error}</p>
                   </div>
                 )}

                 <div className="flex gap-4 pt-4 shrink-0 bg-white">
                    <button
                      type="button"
                      onClick={() => setShowForm(false)}
                      className="flex-1 px-6 py-5 rounded-2xl border border-slate-200 text-sm font-bold text-slate-500 hover:bg-slate-50 transition-all active:scale-95"
                    >
                      Cancel
                    </button>
                    <button
                      disabled={isSaving}
                      className="flex-[2] inline-flex items-center justify-center gap-2 rounded-2xl bg-teal-600 px-6 py-5 text-sm font-black uppercase tracking-widest text-white hover:bg-teal-700 transition-all disabled:opacity-50 shadow-xl shadow-teal-600/20 active:scale-95"
                    >
                      {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                      {activeUni ? 'Save Changes' : 'Initialize Node'}
                    </button>
                 </div>
              </form>
           </div>
        </div>
      )}
    </div>
  )
}
