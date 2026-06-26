import { useEffect, useState, useRef } from 'react'
import { Plus, Edit3, Trash2, Save, X, Building2, MapPin, Globe, Loader2, Hash, AlertCircle, Image as ImageIcon, Upload, Shield, Search, Activity, MoreVertical, Link } from 'lucide-react'
import api from '@/api/authApi'
import axios from 'axios'

export default function AdminUniversities() {
  const [universities, setUniversities] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [activeUni, setActiveUni] = useState<any>(null)
  const [searchTerm, setSearchTerm] = useState('')

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
  const [imgErrors, setImgErrors] = useState<Record<string, boolean>>({})

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
      return data.public_url;
    } catch (err) {
      console.error('R2 Upload Error:', err);
      throw new Error('Failed to upload file to Cloudflare.');
    }
  };

  useEffect(() => {
    fetchUniversities()
  }, [])

  const fetchUniversities = async () => {
    setLoading(true)
    try {
      const res = await api.get('/universities')
      setUniversities(Array.isArray(res.data) ? res.data : [])
    } catch (err) {
      console.error(err)
      setUniversities([])
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
    const previewUrl = URL.createObjectURL(file);
    if (type === 'logo') {
      setLogoFile(file)
      setLogoPreview(previewUrl)
    } else {
      setCoverFile(file)
      setCoverPreview(previewUrl)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setError('')
    try {
      let finalLogo = activeUni?.logo || '';
      let finalCover = activeUni?.cover_image || '';

      if (logoFile) {
        finalLogo = await uploadToR2(logoFile, 'universities/logos');
      }
      if (coverFile) {
        finalCover = await uploadToR2(coverFile, 'universities/covers');
      }

      const payload = {
        ...formData,
        logo: finalLogo,
        cover_image: finalCover
      };

      if (activeUni) {
        await api.put(`/universities/${activeUni.id}`, payload);
      } else {
        await api.post('/universities', payload);
      }

      await fetchUniversities()
      setShowForm(false)
    } catch (err: any) {
      console.error('SAVE ERROR:', err.response?.data || err);
      const errorMsg = err.response?.data?.message || err.response?.data?.error || err.message || 'Failed to save university.';
      const detailedError = err.response?.data?.errors ? Object.values(err.response.data.errors).flat()[0] : null;
      setError(detailedError ? `${errorMsg}: ${detailedError}` : errorMsg);
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Purge this institution and all associated repositories?')) return
    try {
      await api.delete(`/universities/${id}`)
      fetchUniversities()
    } catch (err) {
      console.error(err)
    }
  }

  const filteredUniversities = universities.filter(uni =>
    uni.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    uni.short_name?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-4">
        <div className="w-10 h-10 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Scanning Network Hubs...</p>
      </div>
    )
  }

  return (
    <div className="space-y-10 animate-in fade-in zoom-in-95 duration-700">
      {/* Header Module */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-500">Infrastructure Layer</p>
          <h1 className="text-4xl font-black text-white tracking-tighter">Institutional Hubs</h1>
          <p className="text-[14px] font-medium text-slate-500">Manage partner universities and their secure digital vaults.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={resetForm}
            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-slate-950 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl shadow-emerald-950/20 flex items-center gap-2 active:scale-95 border border-emerald-400/30"
          >
            <Plus size={14} /> Add New Node
          </button>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-[40px] shadow-2xl overflow-hidden flex flex-col min-h-[500px]">
        {/* Table Filter Bar */}
        <div className="px-8 py-6 border-b border-slate-800 bg-slate-900/50 flex items-center justify-between gap-6">
            <div className="relative w-full max-w-sm">
              <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" />
              <input
                type="text"
                placeholder="Search identity name or registry code..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 bg-slate-950 border border-slate-800 focus:border-emerald-500/50 rounded-xl text-[12px] font-bold text-slate-200 outline-none transition-all shadow-inner"
              />
            </div>
            <div className="flex items-center gap-4 text-[10px] font-black text-slate-500 uppercase tracking-widest bg-slate-950 px-4 py-2 rounded-xl border border-slate-800">
                <span>Total Hubs: <span className="text-emerald-500">{filteredUniversities.length}</span></span>
            </div>
        </div>

        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-900/80 border-b border-slate-800 text-[10px] font-black text-slate-600 uppercase tracking-[0.2em]">
                <th className="px-10 py-5">Mainframe Identity</th>
                <th className="px-10 py-5">Short Name</th>
                <th className="px-10 py-5">Location Hub</th>
                <th className="px-10 py-5">Vault Access</th>
                <th className="px-10 py-5 text-right pr-12">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50 bg-slate-950/10">
              {filteredUniversities.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-24 text-center">
                    <div className="w-12 h-12 bg-slate-900 border border-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-700">
                      <Building2 size={24} />
                    </div>
                    <p className="text-[11px] font-black text-slate-600 uppercase tracking-[0.2em]">No institutional nodes synchronized in this sector</p>
                  </td>
                </tr>
              ) : (
                filteredUniversities.map((uni) => (
                  <tr key={uni.id} className="hover:bg-slate-800/30 transition-all group">
                    <td className="px-10 py-6">
                      <div className="flex items-center gap-4 min-w-0">
                        <div className="w-12 h-12 rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden flex items-center justify-center shrink-0 group-hover:border-emerald-500/30 transition-all shadow-inner">
                          {uni.logo && !imgErrors[uni.id] ? (
                            <img
                              src={getImageUrl(uni.logo)}
                              alt=""
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                              onError={() => setImgErrors(prev => ({ ...prev, [uni.id]: true }))}
                            />
                          ) : (
                            <Building2 size={20} className="text-slate-700" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <span className="text-[14px] font-black text-slate-200 block group-hover:text-white transition-colors truncate max-w-[250px]">{uni.name}</span>
                          <span className="text-[10px] font-bold text-slate-600 uppercase tracking-tighter">Node ID: {uni.id.toString().padStart(4, '0')}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-6">
                      <span className="inline-block px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-emerald-500 text-[11px] font-black uppercase tracking-widest shadow-lg">
                        {uni.short_name || 'NODE'}
                      </span>
                    </td>
                    <td className="px-10 py-6">
                      <div className="flex items-center gap-2 text-slate-400 font-bold text-[12px] tracking-tight">
                        <MapPin size={13} className="text-slate-700" />
                        <span>{uni.location || 'Global Hub'}</span>
                      </div>
                    </td>
                    <td className="px-10 py-6">
                      <div className="flex items-center gap-2">
                        {uni.website ? (
                          <a
                            href={uni.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 bg-emerald-500/5 hover:bg-emerald-500/10 border border-emerald-500/10 hover:border-emerald-500/20 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-emerald-400 transition-all"
                          >
                            <Globe size={12} />
                            Active Node
                          </a>
                        ) : (
                          <div className="flex items-center gap-1.5 bg-slate-800/50 border border-slate-700/50 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-500">
                            <Shield size={12} className="opacity-40" />
                            Cold Hub
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-10 py-6 text-right pr-12">
                       <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0">
                          <button
                            onClick={() => handleEdit(uni)}
                            className="p-2.5 bg-slate-900 border border-slate-800 hover:border-emerald-500/50 hover:bg-emerald-500/10 text-slate-500 hover:text-emerald-400 rounded-2xl transition-all shadow-xl"
                          >
                            <Edit3 size={15} />
                          </button>
                          <button
                            onClick={() => handleDelete(uni.id)}
                            className="p-2.5 bg-slate-900 border border-slate-800 hover:border-rose-500/50 hover:bg-rose-500/10 text-slate-500 hover:text-rose-400 rounded-2xl transition-all shadow-xl"
                          >
                            <Trash2 size={15} />
                          </button>
                       </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="px-10 py-5 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
           <div className="flex items-center gap-2">
              <Shield size={12} className="text-slate-700" />
              <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Encrypted Hub Repository Index</p>
           </div>
           <p className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em] bg-emerald-500/5 px-4 py-1.5 rounded-full border border-emerald-500/10">Active Segments: {filteredUniversities.length}</p>
        </div>
      </div>

      {/* Modal Popup (Existing Form) */}
      {showForm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-8 overflow-hidden">
           <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl transition-opacity duration-300" onClick={() => setShowForm(false)} />

           <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-[50px] shadow-[0_0_100px_rgba(0,0,0,0.6)] overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-300">
              <div className="flex items-center justify-between px-12 py-10 border-b border-slate-800 bg-slate-900/50 shrink-0">
                 <div>
                    <div className="flex items-center gap-2.5 mb-2">
                       <Shield size={16} className="text-emerald-500" />
                       <p className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.3em]">System Registry</p>
                    </div>
                    <h2 className="text-3xl font-black text-white tracking-tighter">{activeUni ? 'Modify Protocol' : 'Register New Node'}</h2>
                 </div>
                 <button
                   onClick={() => setShowForm(false)}
                   className="p-4 rounded-3xl bg-slate-950 border border-slate-800 text-slate-600 hover:text-white hover:border-slate-700 transition-all shadow-xl"
                 >
                    <X size={20} />
                 </button>
              </div>

              <form onSubmit={handleSubmit} className="p-12 space-y-8 overflow-y-auto custom-scrollbar bg-slate-950/10">
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Identity Logo</label>
                        <div
                            onClick={() => logoInputRef.current?.click()}
                            className="relative group cursor-pointer aspect-square w-32 rounded-[32px] border-2 border-dashed border-slate-800 bg-slate-950 flex flex-col items-center justify-center overflow-hidden hover:border-emerald-500/50 transition-all shadow-inner"
                        >
                            {logoPreview ? (
                                <>
                                    <img src={getImageUrl(logoPreview)} className="w-full h-full object-cover" key={logoPreview} />
                                    <div className="absolute inset-0 bg-emerald-900/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                                        <Upload className="text-white" size={24} />
                                    </div>
                                </>
                            ) : (
                                <>
                                    <ImageIcon className="text-slate-800 group-hover:text-emerald-500/50 transition-colors" size={32} />
                                    <span className="text-[10px] font-black text-slate-700 mt-2 uppercase">Upload</span>
                                </>
                            )}
                            <input type="file" ref={logoInputRef} className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'logo')} />
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Banner Asset</label>
                        <div
                            onClick={() => coverInputRef.current?.click()}
                            className="relative group cursor-pointer aspect-[16/9] w-full rounded-[32px] border-2 border-dashed border-slate-800 bg-slate-950 flex flex-col items-center justify-center overflow-hidden hover:border-emerald-500/50 transition-all shadow-inner"
                        >
                            {coverPreview ? (
                                <>
                                    <img src={getImageUrl(coverPreview)} className="w-full h-full object-cover" key={coverPreview} />
                                    <div className="absolute inset-0 bg-emerald-900/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                                        <Upload className="text-white" size={24} />
                                    </div>
                                </>
                            ) : (
                                <>
                                    <ImageIcon className="text-slate-800 group-hover:text-emerald-500/50 transition-colors" size={32} />
                                    <span className="text-[10px] font-black text-slate-700 mt-2 uppercase">Upload Banner</span>
                                </>
                            )}
                            <input type="file" ref={coverInputRef} className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'cover')} />
                        </div>
                    </div>
                 </div>

                 <div className="space-y-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Official Institutional Title</label>
                       <input
                          required
                          value={formData.name}
                          onChange={e => setFormData({...formData, name: e.target.value})}
                          className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 text-[13px] font-black text-white outline-none focus:border-emerald-500/50 transition-all shadow-inner"
                          placeholder="e.g. Royal University of Technology"
                       />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Short Name</label>
                           <div className="relative">
                              <Hash className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-700" size={14} />
                              <input
                                 required
                                 value={formData.short_name}
                                 onChange={e => setFormData({...formData, short_name: e.target.value.toUpperCase()})}
                                 className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-12 pr-6 py-4 text-[13px] font-black text-white outline-none focus:border-emerald-500/50 transition-all shadow-inner"
                                 placeholder="RUPP"
                              />
                           </div>
                        </div>

                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Geospatial Origin</label>
                           <input
                              value={formData.location}
                              onChange={e => setFormData({...formData, location: e.target.value})}
                              className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 text-[13px] font-black text-white outline-none focus:border-emerald-500/50 transition-all shadow-inner"
                              placeholder="Phnom Penh Hub"
                           />
                        </div>
                    </div>

                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Digital Access Hub (URL)</label>
                       <input
                          type="url"
                          value={formData.website}
                          onChange={e => setFormData({...formData, website: e.target.value})}
                          className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 text-[13px] font-black text-white outline-none focus:border-emerald-500/50 transition-all shadow-inner"
                          placeholder="https://repo.institution.edu.kh"
                       />
                    </div>

                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Historical Abstract</label>
                       <textarea
                          rows={3}
                          value={formData.description}
                          onChange={e => setFormData({...formData, description: e.target.value})}
                          className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 text-[13px] font-medium text-slate-300 outline-none focus:border-emerald-500/50 transition-all resize-none shadow-inner"
                          placeholder="Describe the node purpose and archive specialization..."
                       />
                    </div>
                 </div>

                 {error && (
                   <div className="p-5 bg-rose-500/5 rounded-[24px] border border-rose-500/20 flex items-start gap-4">
                     <AlertCircle size={18} className="text-rose-500 shrink-0 mt-0.5" />
                     <p className="text-[11px] text-rose-300 font-bold leading-relaxed">{error}</p>
                   </div>
                 )}

                 <div className="flex gap-4 pt-4 shrink-0">
                    <button
                      type="button"
                      onClick={() => setShowForm(false)}
                      className="flex-1 px-8 py-5 rounded-[24px] bg-slate-900 border border-slate-800 text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-white transition-all shadow-xl"
                    >
                      Abort
                    </button>
                    <button
                      disabled={isSaving}
                      className="flex-[2] inline-flex items-center justify-center gap-3 rounded-[24px] bg-emerald-600 px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-950 hover:bg-emerald-500 transition-all disabled:opacity-50 shadow-[0_0_40px_rgba(5,150,105,0.3)] border border-emerald-400/30"
                    >
                      {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                      {activeUni ? 'Commit Changes' : 'Initialize Node'}
                    </button>
                 </div>
              </form>
           </div>
        </div>
      )}
    </div>
  )
}
