import { useEffect, useState } from 'react'
import { getAdminDocuments, approveAdminDocument, rejectAdminDocument, deleteAdminDocument } from '@/api/adminApi'
import {
  FileText, CheckCircle2, XCircle, Trash2, Search,
  ExternalLink, Clock, Shield, Database, FolderOpen,
  ArrowUpRight, AlertCircle, Activity
} from 'lucide-react'

export default function AdminDocuments() {
  const [documents, setDocuments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchDocs()
  }, [])

  const fetchDocs = async () => {
    setLoading(true)
    try {
      const data = await getAdminDocuments()
      setDocuments(Array.isArray(data) ? data : [])
    } catch (err) { console.error(err) } finally { setLoading(false) }
  }

  const handleAction = async (id: number, action: 'approve' | 'reject' | 'delete') => {
    if (action === 'delete' && !confirm('Purge this asset from the mainframe?')) return
    try {
      if (action === 'approve') await approveAdminDocument(id)
      else if (action === 'reject') await rejectAdminDocument(id)
      else if (action === 'delete') await deleteAdminDocument(id)

      setDocuments(prev => prev.filter(doc => doc.id !== id))
    } catch (err) { alert('Protocol execution failed.') }
  }

  const filtered = documents.filter(doc => doc.title?.toLowerCase().includes(searchTerm.toLowerCase()))

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-32 space-y-4">
      <div className="w-10 h-10 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Auditing Assets...</p>
    </div>
  )

  return (
    <div className="space-y-12 animate-in fade-in zoom-in-95 duration-700">
      {/* Module Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-500">Resource Governance</p>
          <h1 className="text-4xl font-black text-white tracking-tighter">Asset Moderation</h1>
          <p className="text-[14px] font-medium text-slate-500">Review, authorize, or purge incoming knowledge nodes from the pipeline.</p>
        </div>
      </div>

      {/* Main Container */}
      <div className="bg-slate-900 border border-slate-800 rounded-[40px] shadow-2xl overflow-hidden flex flex-col min-h-[600px]">
        {/* Table Filter Bar */}
        <div className="px-10 py-7 border-b border-slate-800 bg-slate-900/50 flex items-center justify-between gap-6">
            <div className="relative w-full max-w-sm">
              <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" />
              <input
                type="text" placeholder="Query asset title..." value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-slate-950 border border-slate-800 focus:border-emerald-500/50 rounded-2xl text-[12px] font-bold text-slate-200 outline-none transition-all shadow-inner"
              />
            </div>
            <div className="flex items-center gap-6">
                <div className="flex items-center gap-3 bg-slate-950 px-5 py-2.5 rounded-2xl border border-slate-800">
                   <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse"></div>
                   <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pending Review: {filtered.length}</span>
                </div>
            </div>
        </div>

        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900/80 border-b border-slate-800 text-[10px] font-black text-slate-600 uppercase tracking-[0.2em]">
                <th className="px-10 py-5">Mainframe Asset</th>
                <th className="px-10 py-5">Uploader / Hub</th>
                <th className="px-10 py-5">Status</th>
                <th className="px-10 py-5 text-right pr-12">Protocol Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50 bg-slate-950/10">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-32 text-center">
                    <Database size={40} className="text-slate-800 mx-auto mb-6" />
                    <p className="text-[11px] font-black text-slate-600 uppercase tracking-[0.2em]">No assets staged in moderation queue</p>
                  </td>
                </tr>
              ) : (
                filtered.map((doc) => (
                  <tr key={doc.id} className="hover:bg-slate-800/30 transition-all group">
                    <td className="px-10 py-6">
                      <div className="flex items-center gap-4 min-w-0">
                        <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 text-emerald-500 flex items-center justify-center shrink-0 group-hover:bg-emerald-500 group-hover:text-slate-950 transition-all shadow-lg">
                          <FolderOpen size={18} />
                        </div>
                        <div className="min-w-0">
                          <span className="text-[14px] font-black text-slate-200 block group-hover:text-white transition-colors truncate max-w-[250px]">{doc.title}</span>
                          <span className="text-[10px] font-bold text-slate-600 uppercase tracking-tighter italic">{doc.category?.name || 'Unclassified'}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-6">
                      <div className="flex flex-col">
                        <span className="text-[13px] font-black text-slate-400">{doc.user?.name}</span>
                        <span className="text-[10px] font-bold text-slate-600 uppercase mt-0.5">{doc.university?.short_name || 'Global Node'}</span>
                      </div>
                    </td>
                    <td className="px-10 py-6">
                      <span className={`inline-block px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border ${
                        doc.status === 'pending' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                        doc.status === 'approved' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                        'bg-rose-500/10 text-rose-400 border-rose-500/20'
                      }`}>
                        {doc.status}
                      </span>
                    </td>
                    <td className="px-10 py-6 text-right pr-12">
                      <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300">
                        <a href={doc.file_path} target="_blank" className="p-2.5 bg-slate-900 border border-slate-800 text-slate-500 hover:text-emerald-400 rounded-2xl transition-all shadow-xl"><ExternalLink size={15} /></a>
                        <button onClick={() => handleAction(doc.id, 'approve')} className="p-2.5 bg-slate-900 border border-slate-800 text-slate-500 hover:text-emerald-400 rounded-2xl transition-all shadow-xl"><CheckCircle2 size={15} /></button>
                        <button onClick={() => handleAction(doc.id, 'reject')} className="p-2.5 bg-slate-900 border border-slate-800 text-slate-500 hover:text-amber-400 rounded-2xl transition-all shadow-xl"><XCircle size={15} /></button>
                        <button onClick={() => handleAction(doc.id, 'delete')} className="p-2.5 bg-slate-900 border border-slate-800 text-slate-500 hover:text-rose-400 rounded-2xl transition-all shadow-xl"><Trash2 size={15} /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="px-10 py-5 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
           <div className="flex items-center gap-2">
              <Activity size={12} className="text-emerald-500" />
              <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Mainframe Asset Moderation Interface</p>
           </div>
           <p className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em] bg-emerald-500/5 px-4 py-1.5 rounded-full border border-emerald-500/10">Active Queue: {filtered.length}</p>
        </div>
      </div>
    </div>
  )
}
