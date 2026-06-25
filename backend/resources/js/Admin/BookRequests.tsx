import React, { useEffect, useState } from 'react';
import { MessageCircle, Check, X, Clock, Trash2, User, Book, Search, Activity, CheckCircle, Loader2 } from 'lucide-react';
import api from '@/api';

export default function BookRequests() {
    const [requests, setRequests] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isUpdating, setIsUpdating] = useState<number | null>(null);
    const [page, setPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);

    const fetchRequests = async () => {
        setLoading(true);
        try {
            const res = await api.get(`/admin/book-requests?page=${page}`);
            setRequests(res.data.data || []);
            setLastPage(res.data.last_page || 1);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, [page]);

    const handleStatusUpdate = async (id: number, status: string) => {
        setIsUpdating(id);
        try {
            await api.patch(`/admin/book-requests/${id}/status`, { status });
            setRequests(prev => prev.map(r => r.id === id ? { ...r, status } : r));
        } catch (err) {
            console.error(err);
            alert('Failed to update status');
        } finally {
            setIsUpdating(null);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this request?')) return;
        try {
            await api.delete(`/admin/book-requests/${id}`);
            setRequests(prev => prev.filter(r => r.id !== id));
        } catch (err) {
            console.error(err);
        }
    };

    const filtered = requests.filter(r =>
        r.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.user?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return (
        <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <div className="w-10 h-10 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Querying Request Matrix...</p>
        </div>
    );

    return (
        <div className="space-y-12 animate-in fade-in zoom-in-95 duration-700">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-500">Archive Acquisitions</p>
                    <h1 className="text-4xl font-black text-white tracking-tighter">Manuscript Requests</h1>
                    <p className="text-[14px] font-medium text-slate-500">Manage user requests for new archive additions and document logs.</p>
                </div>
            </div>

            {/* Main Table Container */}
            <div className="bg-slate-900 border border-slate-800 rounded-[40px] shadow-2xl overflow-hidden flex flex-col min-h-[500px]">
                {/* Filter Bar */}
                <div className="px-10 py-7 border-b border-slate-800 bg-slate-900/50 flex items-center justify-between gap-6">
                    <div className="relative w-full max-w-sm">
                        <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" />
                        <input
                            type="text"
                            placeholder="Search requests or users..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-11 pr-4 py-3 bg-slate-950 border border-slate-800 focus:border-emerald-500/50 rounded-2xl text-[12px] font-bold text-slate-200 outline-none transition-all shadow-inner"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto flex-1">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-900/80 border-b border-slate-800 text-[10px] font-black text-slate-600 uppercase tracking-[0.2em]">
                                <th className="px-10 py-5">Requestor</th>
                                <th className="px-10 py-5">Manuscript Details</th>
                                <th className="px-10 py-5">Logged At</th>
                                <th className="px-10 py-5">Status</th>
                                <th className="px-10 py-5 text-right pr-12">Authorization</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/50 bg-slate-950/10">
                            {filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="py-32 text-center">
                                        <MessageCircle size={40} className="text-slate-800 mx-auto mb-6" />
                                        <p className="text-[11px] font-black text-slate-600 uppercase tracking-[0.2em]">No requests pending in archive</p>
                                    </td>
                                </tr>
                            ) : (
                                filtered.map((req) => (
                                    <tr key={req.id} className="hover:bg-slate-800/30 transition-all group">
                                        <td className="px-10 py-6">
                                            <div className="flex items-center gap-4 min-w-0">
                                                <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 text-emerald-500 flex items-center justify-center shrink-0 group-hover:bg-emerald-500 group-hover:text-slate-950 transition-all">
                                                    <User size={16} />
                                                </div>
                                                <div className="min-w-0">
                                                    <span className="text-[13px] font-black text-slate-200 block group-hover:text-white transition-colors truncate">{req.user?.name || 'Unknown User'}</span>
                                                    <span className="text-[9px] font-bold text-slate-600 uppercase tracking-tighter truncate block">{req.user?.email || 'N/A'}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-10 py-6">
                                            <div className="flex flex-col gap-0.5">
                                                <span className="text-[13px] font-black text-slate-200 line-clamp-1 group-hover:text-emerald-400 transition-colors">{req.title}</span>
                                                <span className="text-[10px] font-bold text-slate-500">By {req.author || 'Unknown'}</span>
                                                {req.description && (
                                                    <p className="text-[9px] text-slate-600 italic mt-1 line-clamp-1">"{req.description}"</p>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-10 py-6">
                                            <div className="flex items-center gap-2 text-slate-400 text-[11px] font-bold">
                                                <Clock size={12} className="text-emerald-500" />
                                                {new Date(req.created_at).toLocaleDateString()}
                                            </div>
                                        </td>
                                        <td className="px-10 py-6">
                                            <span className={`inline-block px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border ${
                                                req.status === 'pending' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                                                req.status === 'fulfilled' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                                'bg-rose-500/10 text-rose-400 border-rose-500/20'
                                            }`}>
                                                {req.status}
                                            </span>
                                        </td>
                                        <td className="px-10 py-6 text-right pr-12">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                                {req.status === 'pending' && (
                                                    <>
                                                        <button
                                                            disabled={isUpdating === req.id}
                                                            onClick={() => handleStatusUpdate(req.id, 'fulfilled')}
                                                            className="p-2 bg-emerald-600/10 border border-emerald-600/20 text-emerald-500 hover:bg-emerald-600 hover:text-slate-950 rounded-lg transition-all"
                                                            title="Approve"
                                                        >
                                                            {isUpdating === req.id ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                                                        </button>
                                                        <button
                                                            disabled={isUpdating === req.id}
                                                            onClick={() => handleStatusUpdate(req.id, 'rejected')}
                                                            className="p-2 bg-rose-600/10 border border-rose-600/20 text-rose-500 hover:bg-rose-600 hover:text-white rounded-lg transition-all"
                                                            title="Reject"
                                                        >
                                                            <X size={14} />
                                                        </button>
                                                    </>
                                                )}
                                                <button
                                                    onClick={() => handleDelete(req.id)}
                                                    className="p-2 bg-slate-800 border border-slate-700 text-slate-400 hover:bg-rose-500 hover:text-white rounded-lg transition-all"
                                                    title="Delete"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
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
                        <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Archive Acquisition Ledger • Secure Channel</p>
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

                    <div className="text-[10px] font-black text-slate-700 uppercase">
                        Active Nodes: {filtered.length}
                    </div>
                </div>
            </div>
        </div>
    );
}
