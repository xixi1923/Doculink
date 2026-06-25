import { useEffect, useState } from 'react'
import { getAdminCategories, createAdminCategory, updateAdminCategory, deleteAdminCategory } from '@/api/adminApi'
import {
  Plus, Edit3, Trash2, Save, X, Layers,
  Search, ChevronRight, LayoutGrid, Info,
  Settings2, Activity
} from 'lucide-react'

export default function AdminCategories() {
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState<any>(null)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getAdminCategories()
        setCategories(Array.isArray(data) ? data : [])
      } catch (err) {
        console.error('Failed to load categories', err)
      } finally {
        setLoading(false)
      }
    }
    fetchCategories()
  }, [])

  const resetForm = () => {
    setActiveCategory(null)
    setName('')
    setDescription('')
    setError('')
  }

  const handleEdit = (category: any) => {
    setActiveCategory(category)
    setName(category.name)
    setDescription(category.description || '')
    setError('')
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Purge this category from system memory?')) return
    try {
      await deleteAdminCategory(id)
      setCategories((current) => current.filter((c) => c.id !== id))
    } catch (err) {
      setError('System rejection. Integrity violation.')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) { setError('Title is mandatory.'); return; }

    try {
      if (activeCategory) {
        const updated = await updateAdminCategory(activeCategory.id, { name, description })
        setCategories((current) => current.map((c) => (c.id === updated.id ? updated : c)))
      } else {
        const created = await createAdminCategory({ name, description })
        setCategories((current) => [created, ...current])
      }
      resetForm()
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Protocol failure during save.')
    }
  }

  const filtered = categories.filter(c => c.name?.toLowerCase().includes(searchTerm.toLowerCase()))

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-32 space-y-4">
      <div className="w-10 h-10 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Mapping Classifications...</p>
    </div>
  )

  return (
    <div className="space-y-12 animate-in fade-in zoom-in-95 duration-700">
      {/* Module Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-500">System Architecture</p>
          <h1 className="text-4xl font-black text-white tracking-tighter">Category Management</h1>
          <p className="text-[14px] font-medium text-slate-500">Define and moderate resource category nodes for global orchestration.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-6 py-2.5 bg-slate-900 border border-slate-800 rounded-2xl">
             <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest leading-none mb-1">Active Segments</p>
             <p className="text-[12px] font-black text-emerald-500">{categories.length} Nodes</p>
          </div>
        </div>
      </div>

      <div className="grid gap-8 xl:grid-cols-[400px_minmax(0,1fr)]">
        {/* Editor Form Section */}
        <section className="bg-slate-900 border border-slate-800 rounded-[40px] p-8 shadow-2xl space-y-8 h-fit sticky top-8">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/10 rounded-xl text-emerald-500 border border-emerald-500/20">
               <Settings2 size={18} />
            </div>
            <h2 className="text-lg font-black text-white tracking-tight">{activeCategory ? 'Modify Protocol' : 'Initialize Node'}</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Category Title</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 text-[13px] font-black text-white outline-none focus:border-emerald-500/50 transition-all shadow-inner"
                placeholder="e.g. Theoretical Physics"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Node Abstract</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 text-[13px] font-medium text-slate-300 outline-none focus:border-emerald-500/50 transition-all min-h-[120px] resize-none shadow-inner"
                placeholder="Brief summary of this knowledge sector..."
              />
            </div>

            {error && (
              <div className="p-4 bg-rose-500/5 border border-rose-500/20 rounded-2xl flex items-center gap-3 text-rose-400">
                <X size={14} />
                <p className="text-[11px] font-bold">{error}</p>
              </div>
            )}

            <div className="flex flex-col gap-3 pt-4">
              <button className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black text-[10px] uppercase tracking-widest rounded-2xl transition-all shadow-xl shadow-emerald-950/20 flex items-center justify-center gap-2 border border-emerald-400/30">
                <Save size={14} /> {activeCategory ? 'Commit Changes' : 'Add New Category'}
              </button>
              {activeCategory && (
                <button type="button" onClick={resetForm} className="w-full py-4 bg-slate-950 border border-slate-800 text-slate-500 font-black text-[10px] uppercase tracking-widest rounded-2xl hover:text-white transition-all">
                  Abort Session
                </button>
              )}
            </div>
          </form>
        </section>

        {/* Registry List Section */}
        <section className="bg-slate-900 border border-slate-800 rounded-[40px] shadow-2xl overflow-hidden flex flex-col min-h-[600px]">
          <div className="px-8 py-6 border-b border-slate-800 bg-slate-900/50 flex items-center justify-between gap-6">
            <div className="relative w-full max-w-sm">
              <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" />
              <input
                type="text"
                placeholder="Filter registry nodes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 bg-slate-950 border border-slate-800 focus:border-emerald-500/50 rounded-xl text-[12px] font-bold text-slate-200 outline-none transition-all"
              />
            </div>
          </div>

          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-900/80 border-b border-slate-800 text-[10px] font-black text-slate-600 uppercase tracking-[0.2em]">
                  <th className="px-10 py-5">Mainframe Node</th>
                  <th className="px-10 py-5">Abstract</th>
                  <th className="px-10 py-5 text-right pr-12">Orchestration</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50 bg-slate-950/10">
                {filtered.map((category) => (
                  <tr key={category.id} className="hover:bg-slate-800/30 transition-all group">
                    <td className="px-10 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-2xl bg-slate-900 border border-slate-800 text-emerald-500 flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-slate-950 transition-all">
                          <LayoutGrid size={18} />
                        </div>
                        <span className="text-[14px] font-black text-white">{category.name}</span>
                      </div>
                    </td>
                    <td className="px-10 py-6">
                      <p className="text-[12px] text-slate-500 font-medium line-clamp-1 max-w-[300px]">
                        {category.description || 'No system metadata provided.'}
                      </p>
                    </td>
                    <td className="px-10 py-6 text-right pr-12">
                      <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all">
                        <button onClick={() => handleEdit(category)} className="p-2.5 bg-slate-900 border border-slate-800 text-slate-500 hover:text-emerald-400 rounded-2xl transition-all shadow-xl">
                          <Edit3 size={15} />
                        </button>
                        <button onClick={() => handleDelete(category.id)} className="p-2.5 bg-slate-900 border border-slate-800 text-slate-500 hover:text-rose-400 rounded-2xl transition-all shadow-xl">
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="px-10 py-5 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
             <div className="flex items-center gap-2">
                <Activity size={12} className="text-emerald-500" />
                <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Mainframe Specialized Data Nodes</p>
             </div>
             <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Total segments: {filtered.length}</p>
          </div>
        </section>
      </div>
    </div>
  )
}
