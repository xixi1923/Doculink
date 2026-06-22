import { useEffect, useState } from 'react'
import { Plus, Edit3, Trash2, Save, X, Building2, MapPin, Globe, Loader2, Hash } from 'lucide-react'
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
    setError('')
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
    setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setError('')

    try {
      if (activeUni) {
        await api.put(`/universities/${activeUni.id}`, formData)
      } else {
        await api.post('/universities', formData)
      }
      fetchUniversities()
      resetForm()
    } catch (err: any) {
      console.error('Save Error:', err)
      const message = err.response?.data?.message || 'Failed to save university.'
      const errors = err.response?.data?.errors
        ? Object.values(err.response.data.errors).flat().join(' ')
        : ''
      setError(`${message} ${errors}`)
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
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-teal-600">Institution management</p>
          <h1 className="mt-3 text-3xl font-black text-slate-900">Manage Universities</h1>
          <p className="text-sm text-slate-600 font-medium">Add and manage partner institutions and their digital repositories.</p>
        </div>
        <button
          onClick={resetForm}
          className="inline-flex items-center gap-2 rounded-3xl bg-teal-600 px-6 py-3 text-sm font-black uppercase tracking-widest text-white hover:bg-teal-700 transition-all shadow-lg shadow-teal-500/20"
        >
          <Plus size={18} /> Add Institution
        </button>
      </div>

      <div className="grid gap-8 xl:grid-cols-[450px_minmax(0,1fr)]">

        {/* Form Column */}
        <section className="bg-white rounded-[32px] border border-slate-200 p-8 shadow-sm h-fit sticky top-8">
           <h2 className="text-xl font-bold text-slate-900 mb-6">{activeUni ? 'Update Institution' : 'New Institution Record'}</h2>
           <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1.5">
                 <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Official Name</label>
                 <input
                    required
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-sm font-bold text-slate-900 outline-none focus:border-teal-500 transition-colors"
                    placeholder="e.g. Royal University of Phnom Penh"
                 />
              </div>
              <div className="space-y-1.5">
                 <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Abbreviation / Short Name</label>
                 <div className="relative">
                    <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                    <input
                       required
                       value={formData.short_name}
                       onChange={e => setFormData({...formData, short_name: e.target.value.toUpperCase()})}
                       className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-10 pr-4 py-3 text-sm font-bold text-slate-900 outline-none focus:border-teal-500 transition-colors"
                       placeholder="e.g. RUPP"
                    />
                 </div>
              </div>
              <div className="space-y-1.5">
                 <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Geographic Location</label>
                 <input
                    value={formData.location}
                    onChange={e => setFormData({...formData, location: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-sm font-bold text-slate-900 outline-none focus:border-teal-500 transition-colors"
                    placeholder="e.g. Phnom Penh, Cambodia"
                 />
              </div>
              <div className="space-y-1.5">
                 <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Official Website</label>
                 <input
                    type="url"
                    value={formData.website}
                    onChange={e => setFormData({...formData, website: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-sm font-bold text-slate-900 outline-none focus:border-teal-500 transition-colors"
                    placeholder="https://example.edu.kh"
                 />
              </div>
              <div className="space-y-1.5">
                 <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Description</label>
                 <textarea
                    rows={4}
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-sm font-medium text-slate-800 outline-none focus:border-teal-500 transition-colors resize-none"
                    placeholder="Institutional overview and mission..."
                 />
              </div>

              {error && (
                <div className="p-4 bg-rose-50 rounded-2xl border border-rose-100 flex items-start gap-3">
                  <AlertCircle size={16} className="text-rose-500 shrink-0 mt-0.5" />
                  <p className="text-xs text-rose-600 font-bold leading-relaxed">{error}</p>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                 <button
                   disabled={isSaving}
                   className="flex-grow inline-flex items-center justify-center gap-2 rounded-2xl bg-teal-600 px-6 py-4 text-xs font-black uppercase tracking-widest text-white hover:bg-teal-700 transition-all disabled:opacity-50 shadow-lg shadow-teal-600/20"
                 >
                   {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                   {activeUni ? 'Sync Changes' : 'Initialize Record'}
                 </button>
                 {activeUni && (
                   <button
                     type="button"
                     onClick={resetForm}
                     className="px-6 py-4 rounded-2xl border border-slate-200 text-slate-500 hover:bg-slate-50 transition-all"
                   >
                     <X size={18} />
                   </button>
                 )}
              </div>
           </form>
        </section>

        {/* List Column */}
        <section className="space-y-4">
           {loading ? (
             [...Array(4)].map((_, i) => <div key={i} className="h-24 bg-white rounded-[24px] animate-pulse border border-slate-100" />)
           ) : universities.length > 0 ? universities.map(uni => (
             <div key={uni.id} className="bg-white rounded-[28px] border border-slate-100 p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-teal-500/20 transition-all shadow-sm group">
                <div className="flex items-center gap-5">
                   <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center text-teal-600 border border-slate-100 shrink-0 group-hover:scale-105 transition-transform">
                      <Building2 size={32} />
                   </div>
                   <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-slate-900 group-hover:text-teal-600 transition-colors">{uni.name}</h3>
                        <span className="px-1.5 py-0.5 bg-slate-100 text-slate-500 text-[9px] font-black rounded uppercase tracking-tighter">{uni.short_name}</span>
                      </div>
                      <div className="flex flex-wrap gap-4 mt-1 text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                         <span className="flex items-center gap-1.5"><MapPin size={14} className="text-teal-500" /> {uni.location || 'Remote'}</span>
                         <span className="flex items-center gap-1.5"><Globe size={14} className="text-teal-500" /> {uni.website ? 'Digital Node Active' : 'No Web Presence'}</span>
                      </div>
                   </div>
                </div>
                <div className="flex items-center gap-2">
                   <button
                     onClick={() => handleEdit(uni)}
                     className="p-3 rounded-2xl bg-slate-50 text-slate-400 hover:text-teal-600 hover:bg-teal-50 transition-all border border-transparent hover:border-teal-100"
                   >
                      <Edit3 size={20} />
                   </button>
                   <button
                     onClick={() => handleDelete(uni.id)}
                     className="p-3 rounded-2xl bg-slate-50 text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all border border-transparent hover:border-rose-100"
                   >
                      <Trash2 size={20} />
                   </button>
                </div>
             </div>
           )) : (
              <div className="py-20 text-center bg-slate-50 rounded-[40px] border border-dashed border-slate-200">
                <Building2 size={48} className="text-slate-200 mx-auto mb-4" />
                <p className="text-slate-400 font-bold uppercase text-xs">No institutions logged in matrix</p>
              </div>
           )}
        </section>

      </div>
    </div>
  )
}

import { AlertCircle } from 'lucide-react'
