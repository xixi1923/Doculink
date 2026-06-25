import { useEffect, useState } from 'react'
import { getAdminSubscriptions, verifyAdminSubscription } from '@/api/adminApi'
import {
  CreditCard, CheckCircle2, XCircle, Eye, Search,
  Clock, Shield, Database, Zap, User, ExternalLink,
  ArrowUpRight, AlertCircle, Activity, LayoutGrid, Image as ImageIcon
} from 'lucide-react'

export default function AdminSubscriptions() {
  const [subscriptions, setSubscriptions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedImg, setSelectedImg] = useState<string | null>(null)

  useEffect(() => {
    fetchSubs()
  }, [])

  const fetchSubs = async () => {
    setLoading(true)
    try {
      const data = await getAdminSubscriptions()
      setSubscriptions(Array.isArray(data) ? data : [])
    } catch (err) { console.error(err) } finally { setLoading(false) }
  }

  const handleVerify = async (id: number, status: 'approved' | 'rejected') => {
    try {
      await verifyAdminSubscription(id, { status })
      setSubscriptions(prev => prev.map(s => s.id === id ? { ...s, status } : s))
    } catch (err) { alert('Action failed. Please try again.') }
  }

  const filtered = subscriptions.filter(s => s.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()))

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-32 space-y-4">
      <div className="w-10 h-10 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Accessing Protocol Registry...</p>
    </div>
  )

  return (
    <div className="space-y-12 animate-in fade-in zoom-in-95 duration-700">
      {/* Module Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-500">Financial Orchestration</p>
          <h1 className="text-4xl font-black text-white tracking-tighter">Subscription Protocol</h1>
          <p className="text-[14px] font-medium text-slate-500">Verify KHQR payment screenshots and manage premium access levels.</p>
        </div>
      </div>

      {/* Main Container */}
      <div className="bg-slate-900 border border-slate-800 rounded-[40px] shadow-2xl overflow-hidden flex flex-col min-h-[600px]">
        {/* Table Filter Bar */}
        <div className="px-10 py-7 border-b border-slate-800 bg-slate-900/50 flex items-center justify-between gap-6">
            <div className="relative w-full max-w-sm">
              <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" />
              <input
                type="text" placeholder="Query identity..." value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-slate-950 border border-slate-800 focus:border-emerald-500/50 rounded-2xl text-[12px] font-bold text-slate-200 outline-none transition-all shadow-inner"
              />
            </div>
        </div>

        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900/80 border-b border-slate-800 text-[10px] font-black text-slate-600 uppercase tracking-[0.2em]">
                <th className="px-10 py-5">Network Identity</th>
                <th className="px-10 py-5">Plan / Node</th>
                <th className="px-10 py-5">Proof of Payment</th>
                <th className="px-10 py-5">Status</th>
                <th className="px-10 py-5 text-right pr-12">Authorization</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50 bg-slate-950/10">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-32 text-center">
                    <CreditCard size={40} className="text-slate-800 mx-auto mb-6" />
                    <p className="text-[11px] font-black text-slate-600 uppercase tracking-[0.2em]">No subscription requests staged</p>
                  </td>
                </tr>
              ) : (
                filtered.map((sub) => (
                  <tr key={sub.id} className="hover:bg-slate-800/30 transition-all group">
                    <td className="px-10 py-6">
                      <div className="flex items-center gap-4 min-w-0">
                        <div className="w-11 h-11 rounded-2xl bg-slate-900 border border-slate-800 text-emerald-500 flex items-center justify-center shrink-0 shadow-lg group-hover:bg-emerald-500 group-hover:text-slate-950 transition-all">
                          <User size={18} />
                        </div>
                        <div className="min-w-0">
                          <span className="text-[14px] font-black text-slate-200 block group-hover:text-white transition-colors truncate">{sub.user?.name}</span>
                          <span className="text-[10px] font-bold text-slate-600 uppercase tracking-tighter lowercase">{sub.user?.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-6">
                      <div className="flex items-center gap-2">
                         <div className="p-1.5 bg-amber-500/10 rounded-lg text-amber-500 border border-amber-500/20"><Zap size={12} /></div>
                         <span className="text-[13px] font-black text-slate-300 uppercase tracking-tight">{sub.plan_name || 'Premium Access'}</span>
                      </div>
                    </td>
                    <td className="px-10 py-6">
                      {sub.payment_proof ? (
                        <button onClick={() => setSelectedImg(sub.payment_proof)} className="group/btn relative flex items-center gap-3 p-2 bg-slate-950 border border-slate-800 rounded-2xl hover:border-emerald-500/40 transition-all">
                           <div className="w-10 h-10 rounded-xl overflow-hidden border border-slate-800">
                             <img src={sub.payment_proof} className="w-full h-full object-cover" />
                           </div>
                           <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest group-hover/btn:text-emerald-400">Scan QR</span>
                        </button>
                      ) : (
                        <span className="text-[10px] font-black text-slate-700 uppercase">No proof detected</span>
                      )}
                    </td>
                    <td className="px-10 py-6">
                      <span className={`inline-block px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border ${
                        sub.status === 'pending' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                        sub.status === 'approved' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                        'bg-rose-500/10 text-rose-400 border-rose-500/20'
                      }`}>
                        {sub.status}
                      </span>
                    </td>
                    <td className="px-10 py-6 text-right pr-12">
                      <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all">
                        {sub.status === 'pending' && (
                          <>
                            <button onClick={() => handleVerify(sub.id, 'approved')} className="px-4 py-2 bg-emerald-600/10 border border-emerald-600/20 text-emerald-500 hover:bg-emerald-600 hover:text-slate-950 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all">Authorize</button>
                            <button onClick={() => handleVerify(sub.id, 'rejected')} className="px-4 py-2 bg-rose-600/10 border border-rose-600/20 text-rose-500 hover:bg-rose-600 hover:text-white rounded-xl text-[9px] font-black uppercase tracking-widest transition-all">Reject</button>
                          </>
                        )}
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
              <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Financial Identity Verification Protocol</p>
           </div>
        </div>
      </div>

      {/* Image Viewer Modal */}
      {selectedImg && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-8 bg-black/90 backdrop-blur-md animate-in fade-in duration-300" onClick={() => setSelectedImg(null)}>
           <div className="relative max-w-2xl w-full flex flex-col items-center">
              <button className="absolute -top-12 right-0 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all"><XCircle size={24} /></button>
              <img src={selectedImg} className="w-full rounded-[40px] shadow-2xl border border-white/10" />
              <p className="mt-6 text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">Protocol Verification: Payment Screenshot</p>
           </div>
        </div>
      )}
    </div>
  )
}
