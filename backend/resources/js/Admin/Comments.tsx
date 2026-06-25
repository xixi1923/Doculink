import React, { useEffect, useState } from 'react';
import { MessageSquare, Trash2, User, Clock, Search, Activity, Loader2, ExternalLink, MessageCircle, AlertTriangle, X } from 'lucide-react';
import api from '@/api';
import { Link } from 'react-router-dom';

export default function AdminComments() {
    const [comments, setComments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [deleteModal, setDeleteModal] = useState<{ show: boolean, id: number | null }>({ show: false, id: null });
    const [isDeleting, setIsDeleting] = useState(false);

    const fetchComments = async () => {
        setLoading(true);
        try {
            const res = await api.get(`/admin/comments?page=${page}`);
            setComments(res.data.data || []);
            setLastPage(res.data.last_page || 1);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchComments();
    }, [page]);

    const confirmDelete = async () => {
        if (!deleteModal.id) return;
        setIsDeleting(true);
        try {
            await api.delete(`/comments/${deleteModal.id}`);
            setComments(prev => prev.filter(c => c.id !== deleteModal.id));
            setDeleteModal({ show: false, id: null });
        } catch (err) {
            console.error(err);
            alert('Failed to delete comment');
        } finally {
            setIsDeleting(false);
        }
    };

    const filtered = comments.filter(c =>
        c.content?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.user?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading && page === 1) return (
        <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <div className="w-10 h-10 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Querying Comment Ledger...</p>
        </div>
    );

    return (
        <div className="space-y-12 animate-in fade-in zoom-in-95 duration-700">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-500">Community Moderation</p>
                    <h1 className="text-4xl font-black text-white tracking-tighter">User Discussions</h1>
                    <p className="text-[14px] font-medium text-slate-500">Monitor and manage user interactions across the digital resource library.</p>
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
                            placeholder="Filter by content or username..."
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
                                <th className="px-10 py-5">Author</th>
                                <th className="px-10 py-5">Comment Content</th>
                                <th className="px-10 py-5">Target Resource</th>
                                <th className="px-10 py-5 text-right pr-12">Authorization</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/50 bg-slate-950/10">
                            {filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="py-32 text-center">
                                        <MessageCircle size={40} className="text-slate-800 mx-auto mb-6" />
                                        <p className="text-[11px] font-black text-slate-600 uppercase tracking-[0.2em]">No discussion entries logged</p>
                                    </td>
                                </tr>
                            ) : (
                                filtered.map((comment) => (
                                    <tr key={comment.id} className="hover:bg-slate-800/30 transition-all group">
                                        <td className="px-10 py-6">
                                            <div className="flex items-center gap-4 min-w-0">
                                                <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 text-emerald-500 flex items-center justify-center shrink-0 group-hover:bg-emerald-500 group-hover:text-slate-950 transition-all">
                                                    <User size={16} />
                                                </div>
                                                <div className="min-w-0">
                                                    <span className="text-[13px] font-black text-slate-200 block group-hover:text-white transition-colors truncate">{comment.user?.name || 'Anonymous'}</span>
                                                    <span className="text-[9px] font-bold text-slate-600 uppercase tracking-tighter truncate block">{new Date(comment.created_at).toLocaleDateString()}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-10 py-6">
                                            <div className="max-w-md">
                                                <p className="text-[13px] font-medium text-slate-400 leading-relaxed line-clamp-2 italic">"{comment.content}"</p>
                                            </div>
                                        </td>
                                        <td className="px-10 py-6">
                                            <div className="flex flex-col gap-0.5 max-w-[200px]">
                                                <span className="text-[12px] font-black text-slate-300 truncate">{comment.commentable?.title || 'Unknown Asset'}</span>
                                                <span className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">{comment.commentable_type.split('\\').pop()} Node</span>
                                            </div>
                                        </td>
                                        <td className="px-10 py-6 text-right pr-12">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                                <Link
                                                    to={comment.commentable_type.includes('Book') ? `/admin/books` : `/admin/documents`}
                                                    className="p-2 bg-emerald-600/10 border border-emerald-600/20 text-emerald-500 hover:bg-emerald-600 hover:text-slate-950 rounded-lg transition-all"
                                                    title="View Origin"
                                                >
                                                    <ExternalLink size={14} />
                                                </Link>
                                                <button
                                                    onClick={() => setDeleteModal({ show: true, id: comment.id })}
                                                    className="p-2 bg-rose-600/10 border border-rose-600/20 text-rose-500 hover:bg-rose-600 hover:text-white rounded-lg transition-all"
                                                    title="Delete Entry"
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

                {/* Footer / Pagination */}
                <div className="px-10 py-5 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Activity size={12} className="text-emerald-500" />
                        <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Global Discussion Ledger • Moderation Feed</p>
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
                        Logged entries: {filtered.length}
                    </div>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {deleteModal.show && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-[40px] p-10 shadow-2xl animate-in zoom-in-95 duration-300">
                        <div className="w-16 h-16 bg-rose-500/10 text-rose-500 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-rose-500/20">
                            <AlertTriangle size={32} />
                        </div>
                        <h3 className="text-2xl font-black text-white text-center tracking-tighter">Purge Entry?</h3>
                        <p className="text-slate-500 text-center text-sm mt-3 font-medium">Are you sure you want to purge this comment from the database? This action is permanent and cannot be reversed.</p>

                        <div className="flex flex-col gap-3 mt-10">
                            <button
                                disabled={isDeleting}
                                onClick={confirmDelete}
                                className="w-full py-4 bg-rose-600 hover:bg-rose-500 text-white font-black text-[11px] uppercase tracking-widest rounded-2xl transition-all shadow-xl shadow-rose-950/20 disabled:opacity-50"
                            >
                                {isDeleting ? <Loader2 size={16} className="animate-spin mx-auto" /> : 'Confirm Purge'}
                            </button>
                            <button
                                onClick={() => setDeleteModal({ show: false, id: null })}
                                className="w-full py-4 bg-slate-800 hover:bg-slate-700 text-slate-300 font-black text-[11px] uppercase tracking-widest rounded-2xl transition-all"
                            >
                                Abort
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
