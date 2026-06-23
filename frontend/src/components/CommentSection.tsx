import React, { useState } from 'react'
import { MessageSquare, ThumbsUp, Send, MoreVertical, Edit2, Trash2, CornerDownRight, Loader2, MessageCircle } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import {
    updateCommentApi,
    deleteCommentApi,
    replyCommentApi,
    toggleCommentLikeApi
} from '@/api/authApi'
import SendMessageModal from './SendMessageModal'

interface CommentProps {
    comment: any;
    onUpdate: () => void;
    isReply?: boolean;
}

const CommentItem = ({ comment, onUpdate, isReply = false }: CommentProps) => {
    const { user } = useAuthStore()
    const navigate = useNavigate()
    const [isEditing, setIsEditing] = useState(false)
    const [editContent, setEditContent] = useState(comment.content)
    const [showReplyForm, setShowReplyForm] = useState(false)
    const [replyContent, setReplyContent] = useState('')
    const [submitting, setSubmitting] = useState(false)
    const [showOptions, setShowOptions] = useState(false)
    const [isMessageModalOpen, setIsMessageModalOpen] = useState(false)
    const [imageError, setImageError] = useState(false)

    const isOwner = user?.id == comment.user_id

    const handleUpdate = async () => {
        if (!editContent.trim()) return
        try {
            await updateCommentApi(comment.id, editContent)
            setIsEditing(false)
            onUpdate()
        } catch (error: any) {
            console.error(error)
            alert('Failed to update comment: ' + (error.response?.data?.message || 'Server error'))
        }
    }

    const handleDelete = async () => {
        if (!window.confirm('Delete this comment?')) return
        try {
            await deleteCommentApi(comment.id)
            onUpdate()
        } catch (error: any) {
            console.error(error)
            alert('Failed to delete comment: ' + (error.response?.data?.message || 'Server error'))
        }
    }

    const handleReply = async () => {
        if (!replyContent.trim()) return
        setSubmitting(true)
        try {
            const res = await replyCommentApi(comment.id, replyContent)
            console.log('Reply Comment Response:', res)
            setReplyContent('')
            setShowReplyForm(false)
            onUpdate()
        } catch (error: any) {
            console.error('Reply Comment Error:', error.response?.data)
            alert('Failed to post reply: ' + (error.response?.data?.message || 'Server error'))
        } finally {
            setSubmitting(false)
        }
    }

    const handleLike = async () => {
        try {
            const res = await toggleCommentLikeApi(comment.id)
            console.log('Like Comment Response:', res)
            onUpdate()
        } catch (error: any) {
            console.error('Like Comment Error:', error.response?.data)
            alert('Failed to like comment: ' + (error.response?.data?.message || 'Server error'))
        }
    }

    return (
        <div className={`flex gap-3 ${isReply ? 'ml-10 mt-4 relative' : 'mt-6'}`}>
            {isReply && (
                <div className="absolute -left-6 top-5 w-5 h-px bg-slate-200 dark:bg-slate-700"></div>
            )}

            <Link to={comment.user?.username ? `/profile/${comment.user.username}` : `/user/${comment.user_id}`} className="shrink-0 relative z-10">
                <div className="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden border border-slate-200 dark:border-slate-700 select-none shadow-sm">
                    {comment.user?.avatar && !imageError ? (
                        <img
                            src={comment.user.avatar}
                            className="w-full h-full object-cover"
                            onError={() => setImageError(true)}
                        />
                    ) : (
                        <span className="font-bold text-teal-600 uppercase text-xs">
                            {comment.user?.name ? comment.user.name.split(' ').map((n: any) => n[0]).join('').substring(0, 2) : 'U'}
                        </span>
                    )}
                </div>
            </Link>

            <div className="flex-grow min-w-0">
                <div className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl px-4 py-3 relative group border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-all shadow-sm">
                    <div className="flex justify-between items-start mb-1">
                        <div className="flex items-center gap-2">
                            {isReply && <CornerDownRight size={12} className="text-slate-400" />}
                            <Link to={comment.user?.username ? `/profile/${comment.user.username}` : `/user/${comment.user_id}`} className="text-sm font-black text-slate-900 dark:text-white hover:text-teal-600 transition-colors">
                                {comment.user?.name}
                            </Link>
                            {user?.id !== comment.user_id && (
                                <button
                                    onClick={() => setIsMessageModalOpen(true)}
                                    className="text-slate-400 hover:text-teal-600 transition-colors"
                                    title="Send Message"
                                >
                                    <MessageCircle size={14} />
                                </button>
                            )}
                        </div>
                        {isOwner && (
                            <div className="relative">
                                <button onClick={() => setShowOptions(!showOptions)} className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                                    <MoreVertical size={14} />
                                </button>
                                {showOptions && (
                                    <div className="absolute right-0 mt-1 w-32 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-100 dark:border-slate-700 z-50 py-1 animate-in fade-in zoom-in duration-200">
                                        <button onClick={() => { setIsEditing(true); setShowOptions(false); }} className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                                            <Edit2 size={12} /> Edit
                                        </button>
                                        <button onClick={() => { handleDelete(); setShowOptions(false); }} className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors">
                                            <Trash2 size={12} /> Delete
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {isEditing ? (
                        <div className="space-y-2 mt-2">
                            <textarea
                                value={editContent}
                                onChange={(e) => setEditContent(e.target.value)}
                                className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-sm outline-none focus:border-teal-500 transition-all min-h-[100px]"
                            />
                            <div className="flex gap-2 justify-end">
                                <button onClick={() => setIsEditing(false)} className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[10px] font-black uppercase tracking-widest rounded-lg hover:bg-slate-200 transition-colors">Cancel</button>
                                <button onClick={handleUpdate} className="px-3 py-1.5 bg-teal-500 text-white text-[10px] font-black uppercase tracking-widest rounded-lg hover:bg-teal-600 transition-colors shadow-lg shadow-teal-500/20">Save Changes</button>
                            </div>
                        </div>
                    ) : (
                        <p className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
                            {comment.content}
                        </p>
                    )}
                </div>

                <div className="flex items-center gap-4 mt-2 ml-2">
                    <button onClick={handleLike} className={`flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest transition-colors ${comment.is_liked ? 'text-teal-600' : 'text-slate-400 hover:text-slate-600'}`}>
                        <ThumbsUp size={12} fill={comment.is_liked ? 'currentColor' : 'none'} className={comment.is_liked ? 'animate-bounce' : ''} />
                        {comment.likes_count > 0 && comment.likes_count} Like
                    </button>
                    <button
                        onClick={() => {
                            if (!user) return navigate('/login');
                            setShowReplyForm(!showReplyForm);
                        }}
                        className={`flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest transition-colors ${showReplyForm ? 'text-teal-600' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                        <MessageSquare size={12} />
                        Reply
                    </button>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{new Date(comment.created_at).toLocaleDateString()}</span>
                </div>

                {showReplyForm && (
                    <div className="mt-4 ml-4 flex gap-3 animate-in slide-in-from-top-2 fade-in duration-200">
                        <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden shrink-0 border border-slate-200 dark:border-slate-700 shadow-sm">
                            {user?.avatar ? (
                                <img src={user.avatar} className="w-full h-full object-cover" />
                            ) : (
                                <span className="text-[10px] font-black text-teal-600 uppercase">{user?.name?.[0]}</span>
                            )}
                        </div>
                        <div className="flex-grow relative">
                            <input
                                autoFocus
                                value={replyContent}
                                onChange={(e) => setReplyContent(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleReply()}
                                placeholder={`Reply to ${comment.user?.name}...`}
                                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
                            />
                            <button
                                onClick={handleReply}
                                disabled={submitting || !replyContent.trim()}
                                className="absolute right-2 top-1/2 -translate-y-1/2 text-teal-600 disabled:opacity-30 hover:scale-110 active:scale-95 transition-all"
                            >
                                {submitting ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                            </button>
                        </div>
                    </div>
                )}

                {/* Replies with Vertical line */}
                {comment.replies && comment.replies.length > 0 && (
                    <div className="relative">
                        <div className="absolute left-5 top-0 bottom-0 w-px bg-slate-100 dark:bg-slate-800/50"></div>
                        {comment.replies.map((reply: any) => (
                            <CommentItem key={reply.id} comment={reply} onUpdate={onUpdate} isReply={true} />
                        ))}
                    </div>
                )}
            </div>
            <SendMessageModal
                isOpen={isMessageModalOpen}
                onClose={() => setIsMessageModalOpen(false)}
                recipientId={comment.user_id}
                recipientName={comment.user?.name || 'User'}
            />
        </div>
    )
}

export default function CommentSection({ comments, onUpdate }: { comments: any[], onUpdate: () => void }) {
    // Build tree from flat list to support deep nesting
    const commentMap = new Map();

    // First pass: create copies and initialize replies
    comments.forEach(c => {
        commentMap.set(c.id, { ...c, replies: [] });
    });

    const topLevelComments: any[] = [];

    // Second pass: associate children with parents
    comments.forEach(c => {
        const comment = commentMap.get(c.id);
        if (c.parent_id && commentMap.has(c.parent_id)) {
            commentMap.get(c.parent_id).replies.push(comment);
        } else if (!c.parent_id) {
            topLevelComments.push(comment);
        }
    });

    return (
        <div className="space-y-6">
            {topLevelComments.map(comment => (
                <CommentItem key={comment.id} comment={comment} onUpdate={onUpdate} />
            ))}
        </div>
    )
}
