import { useEffect, useState } from 'react'
import { getAdminDashboard } from '@/api/adminApi'
import {
  Activity, FolderOpen, Users, CheckCircle2, Clock,
  BookOpen, Building2, TrendingUp, DollarSign,
  Zap, Star, Shield, ArrowUpRight, BarChart3,
  ChevronRight, ExternalLink, Globe, Lock
} from 'lucide-react'

export default function AdminDashboard() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await getAdminDashboard()
      setData(response)
    } catch (err: any) {
      if (err.response?.status !== 401) {
        setError('System telemetry restricted. Access denied.')
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-32 space-y-4">
      <div className="w-12 h-12 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Auditing Mainframe...</p>
    </div>
  )

  if (error) return (
    <div className="py-20 text-center space-y-6">
      <div className="w-16 h-16 bg-rose-500/10 text-rose-500 rounded-full flex items-center justify-center mx-auto border border-rose-500/20">
        <Lock size={32} />
      </div>
      <p className="text-sm font-bold text-rose-400">{error}</p>
      <button onClick={fetchData} className="px-8 py-3 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-500/20 transition-all shadow-xl shadow-black/20">Initialize Recovery</button>
    </div>
  )

  const stats = data?.stats || {}
  const recent_documents = Array.isArray(data?.recent_documents) ? data.recent_documents : []
  const top_viewed_books = Array.isArray(data?.top_viewed_books) ? data.top_viewed_books : []

  const statCards = [
    { label: 'Network Identities', value: stats.users_count || 0, icon: Users, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { label: 'Financial Matrix', value: `$${Number(stats.total_revenue || 0).toLocaleString()}`, icon: DollarSign, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { label: 'Active Protocols', value: stats.active_subscribers || 0, icon: Zap, color: 'text-amber-400', bg: 'bg-amber-500/10' },
    { label: 'Resource Nodes', value: stats.books_count || 0, icon: BookOpen, color: 'text-blue-400', bg: 'bg-blue-500/10' },
  ]

  return (
    <div className="space-y-12 animate-in fade-in zoom-in-95 duration-700">
      {/* Dynamic Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-black text-white tracking-tighter">System Overview</h1>
          <p className="text-[14px] font-medium text-slate-500">Global telemetry stream for DocuLink infrastructure.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-5 py-2.5 bg-slate-900 border border-slate-800 rounded-2xl shadow-inner">
             <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest leading-none mb-1.5">Last Sync</p>
             <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                <p className="text-[12px] font-black text-emerald-500 uppercase tracking-tighter">Live Status</p>
             </div>
          </div>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <div key={stat.label} className="group bg-slate-900 border border-slate-800/50 p-6 rounded-[32px] hover:border-emerald-500/30 transition-all hover:bg-slate-800/30">
            <div className="flex items-center justify-between mb-6">
                <div className={`p-3.5 rounded-2xl ${stat.bg} ${stat.color} border border-white/5`}>
                    <stat.icon size={22} />
                </div>
                <div className="w-10 h-10 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center text-slate-600 group-hover:text-emerald-400 group-hover:border-emerald-500/30 transition-all duration-500">
                    <ArrowUpRight size={16} />
                </div>
            </div>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none">{stat.label}</p>
            <p className="text-4xl font-black text-white mt-3 tracking-tighter leading-none">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Resource Distribution */}
        <div className="lg:col-span-1 space-y-8">
           <div className="bg-slate-900 border border-slate-800 p-8 rounded-[40px] space-y-8 shadow-2xl">
              <div className="flex items-center justify-between">
                <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <BarChart3 size={16} className="text-emerald-500" /> Archive Split
                </h3>
              </div>

              <div className="space-y-8">
                  <div className="space-y-3">
                      <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                          <span className="text-slate-500">Premium Nodes</span>
                          <span className="text-emerald-400">{stats.premium_books || 0} Assets</span>
                      </div>
                      <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                          <div className="h-full bg-amber-400 rounded-full shadow-[0_0_12px_rgba(251,191,36,0.5)] transition-all duration-1000" style={{ width: `${(stats.premium_books / (stats.books_count || 1)) * 100}%` }} />
                      </div>
                  </div>

                  <div className="space-y-3">
                      <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                          <span className="text-slate-500">Public Protocol</span>
                          <span className="text-emerald-400">{stats.free_books || 0} Assets</span>
                      </div>
                      <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500 rounded-full shadow-[0_0_12px_rgba(16,185,129,0.5)] transition-all duration-1000" style={{ width: `${(stats.free_books / (stats.books_count || 1)) * 100}%` }} />
                      </div>
                  </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-8 border-t border-slate-800/50">
                  <div className="text-center p-5 bg-slate-950 rounded-[28px] border border-slate-800/50 group hover:border-emerald-500/20 transition-all">
                      <p className="text-2xl font-black text-white">{stats.approved_documents || 0}</p>
                      <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mt-1.5 group-hover:text-emerald-500 transition-colors">Approved</p>
                  </div>
                  <div className="text-center p-5 bg-slate-950 rounded-[28px] border border-slate-800/50 group hover:border-rose-500/20 transition-all">
                      <p className="text-2xl font-black text-rose-500">{stats.pending_documents || 0}</p>
                      <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mt-1.5 group-hover:text-rose-400 transition-colors">Pending</p>
                  </div>
              </div>
           </div>

           <div className="bg-gradient-to-br from-emerald-900 to-slate-950 p-8 rounded-[40px] text-white border border-emerald-500/20 relative overflow-hidden group">
              <Shield size={80} className="absolute -right-6 -bottom-6 text-white/5 group-hover:scale-125 transition-transform duration-1000" />
              <h3 className="text-xl font-black leading-none tracking-tight">Encryption Active</h3>
              <p className="text-emerald-100/40 text-[11px] mt-4 leading-relaxed font-medium">DocuLink system orchestration layer is fully synchronized and protected.</p>
              <button className="mt-8 w-full py-3 bg-white/5 border border-white/10 hover:bg-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all">Node Health Protocol</button>
           </div>
        </div>

        {/* Right Column: Trending & Recent Data */}
        <div className="lg:col-span-2 space-y-8">
           {/* Popular Nodes Widget */}
           <div className="bg-slate-900 border border-slate-800 p-8 rounded-[40px] shadow-sm">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2.5">
                    <TrendingUp size={18} className="text-emerald-500" /> Popular Sub-Nodes
                </h3>
                <button className="text-[10px] font-black text-emerald-500 uppercase tracking-widest hover:text-emerald-400 transition-colors flex items-center gap-1.5">Platform Hits <ChevronRight size={12} /></button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {top_viewed_books.map((book: any, i: number) => (
                      <div key={book.id} className="flex items-center justify-between p-5 bg-slate-950 border border-slate-800/50 hover:border-emerald-500/30 transition-all rounded-[28px] group">
                          <div className="flex items-center gap-4 min-w-0">
                              <div className="w-10 h-10 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-center text-[11px] font-black text-slate-500 group-hover:bg-emerald-500 group-hover:text-slate-950 transition-all">0{i + 1}</div>
                              <div className="min-w-0">
                                  <p className="text-[13px] font-black text-white truncate group-hover:text-emerald-400 transition-colors">{book.title}</p>
                                  <p className="text-[10px] font-bold text-slate-500 uppercase truncate mt-0.5 tracking-tighter">{book.author}</p>
                              </div>
                          </div>
                          <div className="text-right shrink-0">
                              <p className="text-[14px] font-black text-white leading-none tracking-tighter">{book.view_count.toLocaleString()}</p>
                              <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mt-1">Hits</p>
                          </div>
                      </div>
                  ))}
              </div>
           </div>

           {/* Recent Logged Activity Widget */}
           <div className="bg-slate-900 border border-slate-800 rounded-[40px] shadow-sm overflow-hidden flex flex-col min-h-[400px]">
              <div className="px-8 py-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
                  <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2.5">
                    <Clock size={18} className="text-emerald-500" /> Recent Protocol Stream
                  </h3>
              </div>
              <div className="overflow-x-auto flex-1">
                  <table className="w-full text-left">
                      <thead className="bg-slate-900 border-b border-slate-800">
                        <tr className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em]">
                          <th className="px-8 py-5">Mainframe Asset</th>
                          <th className="px-8 py-5">Node Origin</th>
                          <th className="px-8 py-5 text-right pr-12">Encryption</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/50 bg-slate-950/20">
                          {recent_documents.map((doc: any) => (
                              <tr key={doc.id} className="hover:bg-slate-800/30 transition-all group">
                                  <td className="px-8 py-6">
                                      <div className="flex items-center gap-4 min-w-0">
                                          <div className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-800 text-slate-500 flex items-center justify-center shrink-0 group-hover:bg-emerald-500 group-hover:text-slate-950 group-hover:border-emerald-500 transition-all">
                                              <FolderOpen size={16} />
                                          </div>
                                          <span className="text-[13px] font-black text-slate-200 truncate max-w-[200px]">{doc.title}</span>
                                      </div>
                                  </td>
                                  <td className="px-8 py-6">
                                      <div className="flex flex-col">
                                          <span className="text-[12px] font-bold text-slate-300 leading-none">{doc.user?.name || 'External'}</span>
                                          <span className="text-[10px] font-bold text-slate-500 uppercase mt-1.5 tracking-tighter italic">{doc.category?.name}</span>
                                      </div>
                                  </td>
                                  <td className="px-8 py-6 text-right pr-12">
                                      <span className={`inline-block px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border ${
                                          doc.status === 'approved' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                      }`}>
                                          {doc.status}
                                      </span>
                                  </td>
                              </tr>
                          ))}
                      </tbody>
                  </table>
              </div>
           </div>
        </div>
      </div>
    </div>
  )
}
