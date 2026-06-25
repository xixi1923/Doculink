import React, { useEffect, useState } from 'react';
import { Database, Download, BookOpen, User, Clock, Search, FileText, Eye, Users, Activity, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import api from '@/api';

export default function ArchiveLogs() {
    const [logs, setLogs] = useState<any[]>([]);
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchLogs = async () => {
        setLoading(true);
        try {
            const res = await api.get(`/admin/books/logs?page=${page}`);
            if (res.data.logs) {
                setLogs(res.data.logs.data || []);
                setLastPage(res.data.logs.last_page || 1);
                setStats(res.data.stats);
            } else {
                setLogs(res.data.data || []);
                setLastPage(res.data.last_page || 1);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLogs();
    }, [page]);

    const filteredLogs = logs.filter(log =>
        log.book?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.user?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading && page === 1) return (
        <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <div className="w-10 h-10 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Accessing Reading Protocol...</p>
        </div>
    );

    return (
        <div className="space-y-12 animate-in fade-in zoom-in-95 duration-700">
            {/* Header Module */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-500">Interaction Analytics</p>
                    <h1 className="text-4xl font-black text-white tracking-tighter">User Reading Reports</h1>
                    <p className="text-[14px] font-medium text-slate-500">Monitoring real-time interactions across the digital resource library.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="px-5 py-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center gap-3">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                        <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Live Monitoring Active</span>
                    </div>
                </div>
            </div>

            {/* Summary Analytics */}
            {stats && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-slate-900 border border-slate-800 p-8 rounded-[2.5rem] relative overflow-hidden group">
                        <div className="relative z-10">
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4">Total Library Access</p>
                            <div className="flex items-baseline gap-2">
                                <h3 className="text-4xl font-black text-white">{stats.total_reads.toLocaleString()}</h3>
                                <span className="text-emerald-500 text-xs font-bold uppercase tracking-widest">Reads</span>
                            </div>
                        </div>
                        <Eye className="absolute -right-4 -bottom-4 text-white/5 group-hover:text-emerald-500/10 transition-colors" size={120} />
                    </div>
                    <div className="bg-slate-900 border border-slate-800 p-8 rounded-[2.5rem] relative overflow-hidden group">
                        <div className="relative z-10">
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4">Asset Transfers</p>
                            <div className="flex items-baseline gap-2">
                                <h3 className="text-4xl font-black text-white">{stats.total_downloads.toLocaleString()}</h3>
                                <span className="text-blue-500 text-xs font-bold uppercase tracking-widest">Downloads</span>
                            </div>
                        </div>
                        <Download className="absolute -right-4 -bottom-4 text-white/5 group-hover:text-blue-500/10 transition-colors" size={120} />
                    </div>
                    <div className="bg-slate-900 border border-slate-800 p-8 rounded-[2.5rem] relative overflow-hidden group">
                        <div className="relative z-10">
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4">Unique Readers</p>
                            <div className="flex items-baseline gap-2">
                                <h3 className="text-4xl font-black text-white">{stats.unique_users.toLocaleString()}</h3>
                                <span className="text-amber-500 text-xs font-bold uppercase tracking-widest">Users</span>
                            </div>
                        </div>
                        <Users className="absolute -right-4 -bottom-4 text-white/5 group-hover:text-amber-500/10 transition-colors" size={120} />
                    </div>
                </div>
            )}

            {/* Main Container */}
            <div className="bg-slate-900 border border-slate-800 rounded-[40px] shadow-2xl overflow-hidden flex flex-col min-h-[500px]">
                {/* Table Filter Bar */}
                <div className="px-10 py-7 border-b border-slate-800 bg-slate-900/50 flex items-center justify-between gap-6">
                    <div className="relative w-full max-w-sm">
                        <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" />
                        <input
                            type="text"
                            placeholder="Search by book or user..."
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
                                <th className="px-10 py-5">Operation</th>
                                <th className="px-10 py-5">Resource Details</th>
                                <th className="px-10 py-5">Reader Identity</th>
                                <th className="px-10 py-5 text-right pr-12">Timestamp</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/50 bg-slate-950/10">
                            {filteredLogs.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="py-32 text-center">
                                        <Database size={40} className="text-slate-800 mx-auto mb-6" />
                                        <p className="text-[11px] font-black text-slate-600 uppercase tracking-[0.2em]">No interaction logs discovered</p>
                                    </td>
                                </tr>
                            ) : (
                                filteredLogs.map((log) => (
                                    <tr key={log.id} className="hover:bg-slate-800/30 transition-all group">
                                        <td className="px-10 py-6">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-9 h-9 rounded-xl flex items-center justify-center border shadow-sm ${
                                                    log.action_type === 'read'
                                                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                                    : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                                                }`}>
                                                    {log.action_type === 'read' ? <Eye size={16} /> : <Download size={16} />}
                                                </div>
                                                <span className={`text-[10px] font-black uppercase tracking-widest ${log.action_type === 'read' ? 'text-emerald-500' : 'text-blue-500'}`}>
                                                    {log.action_type === 'read' ? 'Visual Read' : 'Core Sync'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-10 py-6">
                                            <div className="max-w-xs">
                                                <p className="text-[13px] font-black text-slate-200 truncate group-hover:text-emerald-400 transition-colors">
                                                    {log.book?.title || 'Unknown Manuscript'}
                                                </p>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="text-[9px] text-slate-500 font-bold uppercase tracking-tighter">REF: {log.book_id}</span>
                                                    <div className="w-1 h-1 bg-slate-700 rounded-full"></div>
                                                    <span className="text-[9px] text-slate-500 font-bold uppercase tracking-tighter truncate">{log.book?.isbn || 'N/A'}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-10 py-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 flex items-center justify-center shrink-0 group-hover:bg-emerald-500 group-hover:text-slate-950 transition-all">
                                                    <User size={16} />
                                                </div>
                                                <div className="min-w-0">
                                                    <span className="text-[13px] font-black text-slate-200 block group-hover:text-white transition-colors truncate">{log.user?.name || 'Anonymous'}</span>
                                                    <span className="text-[9px] font-bold text-slate-600 uppercase tracking-tighter lowercase truncate block">{log.user?.email}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-10 py-6 text-right pr-12">
                                            <div className="flex flex-col items-end">
                                                <span className="text-[11px] font-black text-slate-400">{new Date(log.downloaded_at).toLocaleDateString()}</span>
                                                <span className="text-[9px] text-slate-600 font-bold uppercase">{new Date(log.downloaded_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Footer / Pagination */}
                <div className="px-10 py-5 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Activity size={12} className="text-emerald-500" />
                        <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Active Reading Protocol Ledger</p>
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
                                // Simple logic to show current, first, last, and a few around current
                                if (
                                    pageNum === 1 ||
                                    pageNum === lastPage ||
                                    (pageNum >= page - 1 && pageNum <= page + 1)
                                ) {
                                    return (
                                        <button
                                            key={pageNum}
                                            onClick={() => setPage(pageNum)}
                                            className={`w-10 h-10 rounded-xl text-[11px] font-black transition-all ${
                                                page === pageNum
                                                ? 'bg-white text-slate-900 shadow-xl'
                                                : 'bg-slate-900 text-slate-500 border border-slate-800 hover:text-white'
                                            }`}
                                        >
                                            {pageNum}
                                        </button>
                                    );
                                } else if (
                                    pageNum === page - 2 ||
                                    pageNum === page + 2
                                ) {
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
                </div>
            </div>
        </div>
    );
}
