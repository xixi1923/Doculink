import { useEffect, useState } from 'react'
import { getAdminSubscriptions, verifyAdminSubscription } from '@/api/adminApi'
import {
  CreditCard, CheckCircle2, XCircle, Eye, Search,
  Clock, Shield, Database, Zap, User, ExternalLink,
  ArrowUpRight, AlertCircle, Activity, LayoutGrid, Image as ImageIcon,
  Loader2
} from 'lucide-react'

export default function AdminSubscriptions() {
  const [subscriptions, setSubscriptions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedImg, setSelectedImg] = useState<string | null>(null)
  const [rejectModal, setRejectModal] = useState<{ show: boolean, id: number | null }>({ show: false, id: null })
  const [adminNote, setAdminNote] = useState('')
  const [isVerifying, setIsVerifying] = useState(false)
  const [page, setPage] = useState(1)
  const [lastPage, setLastPage] = useState(1)

  useEffect(() => {
    fetchSubs()
  }, [page])

  const fetchSubs = async () => {
    setLoading(true)
    try {
      const response = await getAdminSubscriptions(page)
      // Handle paginated response structure safely
      const items = response.data && Array.isArray(response.data) ? response.data :
                    Array.isArray(response) ? response : [];
      setSubscriptions(items)
      setLastPage(response.last_page || 1)
    } catch (err) {
      console.error(err)
      setSubscriptions([])
    } finally { setLoading(false) }
  }

  const handleVerify = async (id: number, status: 'approved' | 'rejected') => {
    if (status === 'rejected' && !rejectModal.show) {
        setRejectModal({ show: true, id });
        setAdminNote('');
        return;
    }

    setIsVerifying(true);
    try {
      await verifyAdminSubscription(id, { status, admin_note: adminNote })
      setSubscriptions(prev => prev.map(s => s.id === id ? { ...s, status, admin_note: adminNote } : s))
      setRejectModal({ show: false, id: null });
      setAdminNote('');
    } catch (err) {
        alert('Action failed. Please try again.')
    } finally {
        setIsVerifying(false);
    }
  }

  const getImageUrl = (path: string | null) => {
    if (!path) return '';
    if (path.startsWith('http') || path.startsWith('blob:') || path.startsWith('data:')) return path;
    const baseUrl = window.location.origin; // Assuming public storage if not absolute
    return `${baseUrl}${path}`;
  };

  const filtered = subscriptions.filter(s =>
    s.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.user?.email?.toLowerCase().includes(searchTerm.toLowerCase())
  )

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
            <div className="flex items-center gap-4 text-[10px] font-black text-slate-500 uppercase tracking-widest bg-slate-950 px-4 py-2 rounded-xl border border-slate-800">
                <span>Total Staged: <span className="text-emerald-500">{filtered.length}</span></span>
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
                         <span className="text-[13px] font-black text-slate-300 uppercase tracking-tight">{sub.plan_type || 'Subscription Elite'}</span>
                      </div>
                    </td>
                    <td className="px-10 py-6">
                      {sub.screenshot_url ? (
                        <button onClick={() => setSelectedImg(getImageUrl(sub.screenshot_url))} className="group/btn relative flex items-center gap-3 p-2 bg-slate-950 border border-slate-800 rounded-2xl hover:border-emerald-500/40 transition-all">
                           <div className="w-10 h-10 rounded-xl overflow-hidden border border-slate-800 bg-slate-900 flex items-center justify-center">
                             <img src={getImageUrl(sub.screenshot_url)} className="w-full h-full object-cover" />
                           </div>
                           <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest group-hover/btn:text-emerald-400">View Proof</span>
                        </button>
                      ) : (
                        <span className="text-[10px] font-black text-slate-700 uppercase tracking-tighter">No Image Logged</span>
                      )}
                    </td>
                    <td className="px-10 py-6">
                      <div className="flex flex-col gap-1">
                          <span className={`inline-block px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border w-fit ${
                            sub.status === 'pending' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                            sub.status === 'approved' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                            'bg-rose-500/10 text-rose-400 border-rose-500/20'
                          }`}>
                            {sub.status}
                          </span>
                          {sub.admin_note && (
                              <p className="text-[9px] text-slate-500 font-bold italic truncate max-w-[150px]">"{sub.admin_note}"</p>
                          )}
                      </div>
                    </td>
                    <td className="px-10 py-6 text-right pr-12">
                      <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all">
                        {sub.status === 'pending' && (
                          <>
                            <button
                                disabled={isVerifying}
                                onClick={() => handleVerify(sub.id, 'approved')}
                                className="px-4 py-2 bg-emerald-600/10 border border-emerald-600/20 text-emerald-500 hover:bg-emerald-600 hover:text-slate-950 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all disabled:opacity-50"
                            >
                                Authorize
                            </button>
                            <button
                                disabled={isVerifying}
                                onClick={() => handleVerify(sub.id, 'rejected')}
                                className="px-4 py-2 bg-rose-600/10 border border-rose-600/20 text-rose-500 hover:bg-rose-600 hover:text-white rounded-xl text-[9px] font-black uppercase tracking-widest transition-all disabled:opacity-50"
                            >
                                Reject
                            </button>
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

           {lastPage > 1 && (
              <div className="flex items-center gap-2">
                  <button
                      disabled={page === 1}
                      onClick={() => setPage(p => p - 1)}
                      className="px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-[11px] font-black text-slate-400 hover:text-white disabled:opacity-20 transition-all"
                  >
                      « Previous
                  </button>

                  {[...Array(lastPage)].map((_, i) => {
                      const pageNum = i + 1;
                      if (pageNum === 1 || pageNum === lastPage || (pageNum >= page - 1 && pageNum <= page + 1)) {
                          return (
                              <button
                                  key={pageNum}
                                  onClick={() => setPage(pageNum)}
                                  className={`w-10 h-10 rounded-xl text-[11px] font-black transition-all ${
                                      page === pageNum ? 'bg-white text-slate-900 shadow-xl' : 'bg-slate-900 text-slate-500 border border-slate-800 hover:text-white'
                                  }`}
                              >
                                  {pageNum}
                              </button>
                          );
                      } else if (pageNum === page - 2 || pageNum === page + 2) {
                          return <span key={pageNum} className="text-slate-700">...</span>;
                      }
                      return null;
                  })}

                  <button
                      disabled={page === lastPage}
                      onClick={() => setPage(p => p + 1)}
                      className="px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-[11px] font-black text-slate-400 hover:text-white disabled:opacity-20 transition-all"
                  >
                      Next »
                  </button>
              </div>
           )}

           <div className="flex items-center gap-4 text-[10px] font-black text-slate-500 uppercase tracking-widest bg-emerald-500/5 px-4 py-1.5 rounded-full border border-emerald-500/10">
                <span>Total Staged: <span className="text-emerald-500">{filtered.length}</span></span>
            </div>
        </div>
      </div>

      {/* Image Viewer Modal */}
      {selectedImg && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/90 backdrop-blur-xl animate-in fade-in duration-300" onClick={() => setSelectedImg(null)}>
           <div className="relative w-full max-w-[320px] sm:max-w-[380px] flex flex-col items-center animate-in zoom-in-95 duration-500" onClick={e => e.stopPropagation()}>
              <button
                onClick={() => setSelectedImg(null)}
                className="absolute -top-14 right-0 p-3 bg-white/10 hover:bg-rose-500 hover:text-white rounded-full text-white transition-all backdrop-blur-md border border-white/10 shadow-2xl"
              >
                <XCircle size={24} />
              </button>

              {/* Phone Frame Mockup */}
              <div className="w-full bg-slate-950 rounded-[3rem] p-3 border-4 border-slate-800 shadow-[0_0_80px_rgba(0,0,0,0.5)] relative overflow-hidden">
                {/* Notch / Dynamic Island Effect */}
                <div className="absolute top-6 left-1/2 -translate-x-1/2 w-24 h-6 bg-slate-900 rounded-full z-20" />

                <div className="relative rounded-[2.2rem] overflow-hidden bg-slate-900 aspect-[9/19]">
                    <img src={selectedImg} className="w-full h-full object-cover" alt="Proof of Payment" />
                </div>
              </div>

              <div className="mt-8 flex flex-col items-center gap-2">
                 <p className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.4em] drop-shadow-sm">Identity Verified Node</p>
                 <p className="text-[9px] font-bold text-white/30 uppercase tracking-widest">KHQR Transaction Ledger • Screenshot Artifact</p>
              </div>
           </div>
        </div>
      )}

      {/* Rejection Note Modal */}
      {rejectModal.show && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-300">
            <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-[40px] p-10 shadow-2xl animate-in zoom-in-95 duration-300">
                <div className="w-16 h-16 bg-rose-500/10 text-rose-500 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-rose-500/20">
                    <AlertCircle size={32} />
                </div>
                <h3 className="text-2xl font-black text-white text-center tracking-tighter">Confirm Rejection</h3>
                <p className="text-slate-500 text-center text-sm mt-3 font-medium">Please provide a brief explanation for rejecting this payment node.</p>

                <div className="mt-8 space-y-4">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Auditor Feedback</label>
                    <textarea
                        value={adminNote}
                        onChange={(e) => setAdminNote(e.target.value)}
                        placeholder="e.g. Screenshot blurred or transaction not found in ledger..."
                        className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 text-[13px] font-medium text-slate-300 outline-none focus:border-rose-500/50 transition-all min-h-[120px] resize-none shadow-inner"
                    />
                </div>

                <div className="flex flex-col gap-3 mt-10">
                    <button
                        disabled={isVerifying}
                        onClick={() => handleVerify(rejectModal.id!, 'rejected')}
                        className="w-full py-4 bg-rose-600 hover:bg-rose-500 text-white font-black text-[11px] uppercase tracking-widest rounded-2xl transition-all shadow-xl shadow-rose-950/20 disabled:opacity-50"
                    >
                        {isVerifying ? <Loader2 className="animate-spin mx-auto" size={16} /> : 'Finalize Rejection'}
                    </button>
                    <button
                        onClick={() => setRejectModal({ show: false, id: null })}
                        className="w-full py-4 bg-slate-800 hover:bg-slate-700 text-slate-300 font-black text-[11px] uppercase tracking-widest rounded-2xl transition-all"
                    >
                        Abort
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  )
}
