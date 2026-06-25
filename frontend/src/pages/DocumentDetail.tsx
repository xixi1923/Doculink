import React, { useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  Bookmark,
  ChevronLeft,
  Download,
  FileText,
  Loader2,
  Maximize2,
  Minimize2,
  MoreVertical,
  MessageSquare,
  Send,
  Share2,
  ThumbsUp,
  User as UserIcon,
  Eye,
} from 'lucide-react'
import api, { toggleDocumentLikeApi, toggleFavoriteApi } from '@/api/authApi'
import { useAuthStore } from '@/store/authStore'
import SendMessageModal from '@/components/SendMessageModal'

export default function DocumentDetail(): React.JSX.Element {
  const { id } = useParams()
  const { token } = useAuthStore()
  const [doc, setDoc] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'pdf' | 'discussion'>('pdf')
  const [newComment, setNewComment] = useState('')
  const [submittingComment, setSubmittingComment] = useState(false)
  const [isFavorited, setIsFavorited] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const [likesCount, setLikesCount] = useState(0)
  const [isPreviewExpanded, setIsPreviewExpanded] = useState(false)
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false)
  const commentInputRef = useRef<HTMLTextAreaElement | null>(null)

  useEffect(() => {
    void fetchDocument()
  }, [id])

  const fetchDocument = async () => {
    setLoading(true)
    try {
      const res = await api.get(`/documents/${id}`)
      const documentData = res.data
      setDoc(documentData)
      setIsFavorited(Boolean(documentData.is_favorited))
      setIsLiked(Boolean(documentData.is_liked))
      setLikesCount(documentData.likes_count || 0)
    } catch (err: any) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleLike = async () => {
    if (!token) return alert('Please login to like.')
    try {
      const res = await toggleDocumentLikeApi(Number(id))
      setIsLiked(Boolean(res.liked))
      setLikesCount((prev) => (res.liked ? prev + 1 : Math.max(0, prev - 1)))
      setDoc((prev: any) => (prev ? { ...prev, likes_count: res.likes_count ?? prev.likes_count } : prev))
    } catch (err: any) {
      console.error(err)
      alert('Failed to like document: ' + (err.response?.data?.message || 'Server error'))
    }
  }

  const handleFavorite = async () => {
    if (!token) return alert('Please login to save assets.')
    try {
      const res = await toggleFavoriteApi({ document_id: Number(id) })
      setIsFavorited(Boolean(res.favorited))
      setDoc((prev: any) => (prev ? { ...prev, favorites_count: res.favorites_count ?? prev.favorites_count } : prev))
    } catch (err: any) {
      console.error(err)
      alert('Failed to save document: ' + (err.response?.data?.message || 'Server error'))
    }
  }

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim() || submittingComment) return

    setSubmittingComment(true)
    try {
      const res = await api.post(`/documents/${id}/comment`, { content: newComment })
      setDoc((prev: any) =>
        prev
          ? {
              ...prev,
              comments: [res.data, ...(prev.comments || [])],
              comments_count: (prev.comments_count || 0) + 1,
            }
          : prev,
      )
      setNewComment('')
    } catch (err: any) {
      console.error(err)
      alert('Failed to post comment: ' + (err.response?.data?.message || 'Server error'))
    } finally {
      setSubmittingComment(false)
    }
  }

  const handleDownload = async () => {
    if (!token) return alert('Please login to download.')
    try {
      const res = await api.get(`/documents/${id}/download`)
      window.open(res.data.url, '_blank')
      setDoc((prev: any) => {
        if (!prev) return prev;
        const newDownloadCount = (prev.download_count || 0) + 1;
        // Also update uploader stats if they exist
        const newUserStats = prev.user?.stats ? {
          ...prev.user.stats,
          total_downloads: (prev.user.stats.total_downloads || 0) + 1
        } : prev.user?.stats;

        return {
          ...prev,
          download_count: newDownloadCount,
          user: prev.user ? { ...prev.user, stats: newUserStats } : prev.user
        }
      })
    } catch (err: any) {
      console.error(err)
    }
  }

  const renderFileViewer = () => {
    if (!doc?.file_path) return null

    const fileType = (doc.file_type || '').toLowerCase()
    const isImage = ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(fileType)
    const isPdf = fileType === 'pdf'
    const isOffice = ['docx', 'doc', 'pptx', 'ppt', 'xlsx', 'xls'].includes(fileType)

    if (isImage) {
      return (
        <div className={`w-full transition-all duration-500 ease-in-out ${isPreviewExpanded ? 'fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4' : 'h-[600px] flex items-center justify-center bg-slate-50 rounded-[32px] overflow-hidden relative group'}`}>
          <img src={doc.file_path} className="max-w-full max-h-full object-contain" alt={doc.title} />
          <div className={`absolute top-6 right-6 z-[110] flex gap-2 ${isPreviewExpanded ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} transition-opacity`}>
            <button
              onClick={() => setIsPreviewExpanded(!isPreviewExpanded)}
              className="p-3 bg-black/20 backdrop-blur-xl text-white rounded-2xl hover:bg-black/40 transition-all border border-white/10"
            >
              {isPreviewExpanded ? <Minimize2 size={22} /> : <Maximize2 size={22} />}
            </button>
          </div>
        </div>
      )
    }

    if (isPdf || isOffice) {
      return (
        <div className={`w-full transition-all duration-500 ease-in-out ${isPreviewExpanded ? 'fixed inset-0 z-[100] bg-slate-900' : 'h-[700px] relative bg-slate-100 rounded-3xl overflow-hidden shadow-sm'}`}>
          <div className="absolute top-4 right-4 z-10 flex gap-2">
            <button
              onClick={() => setIsPreviewExpanded(!isPreviewExpanded)}
              className="p-2.5 bg-black/40 backdrop-blur-md text-white rounded-xl hover:bg-black/60 transition-all border border-white/10"
            >
              {isPreviewExpanded ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
            </button>
            <button
              onClick={handleDownload}
              className="p-2.5 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition-all shadow-lg"
            >
              <Download size={18} />
            </button>
          </div>
          <iframe
            src={isOffice ? `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(doc.file_path)}` : `${doc.file_path}#toolbar=0`}
            className="w-full h-full border-none"
            title={isPdf ? 'PDF Viewer' : 'Document Viewer'}
          />
        </div>
      )
    }

    return (
      <div className="aspect-video bg-slate-50 rounded-[32px] flex flex-col items-center justify-center text-center p-12 border border-slate-100">
        <FileText size={64} className="text-teal-600/20 mb-6" />
        <h3 className="text-slate-900 font-black text-xl mb-2 uppercase tracking-tight">Format: {fileType.toUpperCase()}</h3>
        <p className="text-slate-500 text-sm max-w-xs font-medium mb-8">
          This format requires a local reader. Download the asset to view full content.
        </p>
        <button
          onClick={handleDownload}
          className="px-8 py-3 bg-teal-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-teal-700 transition-all shadow-lg shadow-teal-600/20"
        >
          Download to View
        </button>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <Loader2 className="animate-spin text-teal-600 mb-4" size={40} />
        <p className="text-xs text-slate-400 font-black uppercase tracking-[0.2em]">Syncing Matrix...</p>
      </div>
    )
  }

  if (!doc) return <div className="p-20 text-center text-slate-900 font-bold">Document not found.</div>

  return (
    <div className="bg-white min-h-screen font-sans text-slate-900 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-10">
        <Link to="/search" className="inline-flex items-center gap-2 text-[10px] font-black text-teal-600 uppercase tracking-widest mb-10 hover:opacity-70 transition-opacity">
          <ChevronLeft size={16} /> Back to Repository
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-8 space-y-6">
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 leading-[1.1] tracking-tight">{doc.title}</h1>
            <p className="text-slate-700 text-sm leading-relaxed mb-8">
              {doc.description || 'This academic resource has been uploaded to assist peers in their studies. No abstract summary provided by uploader.'}
            </p>

            <div className="flex flex-wrap items-center justify-between gap-6 pt-8 border-t border-slate-100">
              <div className="flex flex-wrap items-center gap-4 pt-4">
                <button
                  onClick={handleDownload}
                  className="flex items-center gap-2 px-8 py-4 bg-teal-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-teal-600/20 hover:bg-teal-700 transition-all"
                >
                  <Download size={18} /> Download PDF
                </button>
                <button
                  onClick={handleFavorite}
                  className={`flex items-center gap-2 px-6 py-4 border-2 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${isFavorited ? 'bg-amber-50 border-amber-200 text-amber-600 shadow-sm' : 'border-slate-100 text-slate-600 hover:bg-slate-50'}`}
                >
                  <Bookmark size={18} className={isFavorited ? 'fill-current' : ''} />
                  {isFavorited ? 'Saved' : 'Save Asset'}
                </button>
                <button className="p-4 border-2 border-slate-100 rounded-2xl text-slate-400 hover:bg-slate-50 transition-all">
                  <Share2 size={20} />
                </button>
              </div>
            </div>

            <div className="pt-12 space-y-8">
              <div className="flex gap-10 border-b border-slate-100 overflow-x-auto no-scrollbar">
                {[
                  { id: 'pdf', label: 'Original Paper' },
                  { id: 'discussion', label: `Discussion (${doc.comments_count || 0})` },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as 'pdf' | 'discussion')}
                    className={`pb-5 text-[11px] font-black uppercase tracking-[0.2em] transition-all relative whitespace-nowrap ${activeTab === tab.id ? 'text-teal-600' : 'text-slate-400 hover:text-slate-900'}`}
                  >
                    {tab.label}
                    {activeTab === tab.id && <div className="absolute bottom-0 left-0 right-0 h-1 bg-teal-600 rounded-full" />}
                  </button>
                ))}
              </div>

              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                {activeTab === 'pdf' && (
                  <div className="rounded-[32px] overflow-hidden border border-slate-100 shadow-sm">
                    {renderFileViewer()}
                  </div>
                )}

                {activeTab === 'discussion' && (
                  <div className="space-y-8">
                    {token ? (
                      <div className="bg-slate-50 p-8 rounded-[32px] border border-slate-100 focus-within:bg-white focus-within:border-teal-500/20 transition-all">
                        <form onSubmit={handleCommentSubmit}>
                          <textarea
                            ref={commentInputRef}
                            rows={4}
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Add to the discussion..."
                            className="w-full bg-transparent text-sm font-medium text-slate-900 placeholder-slate-400 outline-none resize-none leading-relaxed"
                          />
                          <div className="flex justify-end pt-4 mt-4 border-t border-slate-200/50">
                            <button
                              type="submit"
                              disabled={submittingComment || !newComment.trim()}
                              className="inline-flex items-center gap-2 px-8 py-3 bg-teal-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-teal-700 transition-all shadow-md shadow-teal-500/10"
                            >
                              {submittingComment ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                              Post Feedback
                            </button>
                          </div>
                        </form>
                      </div>
                    ) : (
                      <div className="bg-slate-50 rounded-[32px] p-10 text-center border border-dashed border-slate-200">
                        <p className="text-sm text-slate-500 mb-4 font-medium">Log in to contribute to the academic discussion.</p>
                        <Link to="/login" className="text-xs font-black text-teal-600 uppercase tracking-widest hover:underline">Sign In Now</Link>
                      </div>
                    )}

                    <div className="space-y-4">
                      {doc.comments?.map((comment: any) => (
                        <div key={comment.id} className="bg-white p-6 rounded-[28px] border border-slate-200 shadow-sm flex gap-4 items-start group">
                          <div className="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 shrink-0 overflow-hidden">
                            {comment.user?.avatar ? (
                              <img src={comment.user.avatar} className="w-full h-full rounded-2xl object-cover" alt={comment.user?.name || 'Comment author'} />
                            ) : (
                              <UserIcon size={18} />
                            )}
                          </div>
                          <div className="flex-grow">
                            <div className="flex justify-between items-center mb-2">
                              <div>
                                <h4 className="font-bold text-sm text-slate-900">{comment.user?.name}</h4>
                                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Contributor</p>
                              </div>
                              <span className="text-[10px] text-slate-400">{new Date(comment.created_at).toLocaleDateString()}</span>
                            </div>
                            <p className="text-sm text-slate-800 leading-relaxed font-medium">{comment.content}</p>
                          </div>
                          <button className="text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity">
                            <MoreVertical size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-10">
            <div className="bg-white rounded-[32px] border border-slate-200 p-8 shadow-sm relative overflow-hidden">
              <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-6">Original Uploader</h3>

              <div className="flex items-center justify-between mb-8">
                <Link to={doc.user?.username ? `/profile/${doc.user.username}` : `/user/${doc.user?.id}`} className="flex items-center gap-4 group">
                    <div className="w-14 h-14 rounded-[20px] bg-slate-100 flex items-center justify-center text-teal-600 font-black text-xl group-hover:scale-105 transition-transform duration-300 overflow-hidden shadow-sm">
                    {doc.user?.avatar ? <img src={doc.user.avatar} className="w-full h-full object-cover" alt={doc.user?.name || 'Uploader'} /> : doc.user?.name?.charAt(0) || 'U'}
                    </div>
                    <div>
                    <h4 className="font-bold text-slate-900 group-hover:text-teal-600 transition-colors">{doc.user?.name || 'Verified User'}</h4>
                    <p className="text-[11px] text-slate-500 font-medium">Joined {new Date(doc.user?.created_at).getFullYear()}</p>
                    </div>
                </Link>

                <button
                    onClick={() => setIsMessageModalOpen(true)}
                    className="p-3 bg-slate-50 text-teal-600 rounded-xl hover:bg-teal-600 hover:text-white transition-all shadow-sm border border-slate-100"
                    title="Send Message"
                >
                    <Send size={18} />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 bg-slate-50/50 rounded-2xl border border-slate-100 flex flex-col items-center justify-center gap-1">
                  <Eye size={16} className="text-slate-400" />
                  <p className="text-sm font-black text-slate-900">{doc.view_count || 0}</p>
                  <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Views</p>
                </div>

                <button
                  onClick={handleLike}
                  className={`p-4 rounded-2xl border transition-all flex flex-col items-center justify-center gap-1 ${isLiked ? 'bg-rose-50 border-rose-100 text-rose-600' : 'bg-slate-50/50 border-slate-100 text-slate-400 hover:bg-slate-100'}`}
                >
                  <ThumbsUp size={16} className={isLiked ? 'fill-current' : ''} />
                  <p className={`text-sm font-black ${isLiked ? 'text-rose-600' : 'text-slate-900'}`}>{likesCount}</p>
                  <p className="text-[8px] font-bold uppercase tracking-widest">Likes</p>
                </button>

                <div className="p-4 bg-slate-50/50 rounded-2xl border border-slate-100 flex flex-col items-center justify-center gap-1">
                  <MessageSquare size={16} className="text-slate-400" />
                  <p className="text-sm font-black text-slate-900">{doc.comments_count || 0}</p>
                  <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Comments</p>
                </div>

                <div className="p-4 bg-slate-50/50 rounded-2xl border border-slate-100 flex flex-col items-center justify-center gap-1">
                  <Download size={16} className="text-slate-400" />
                  <p className="text-sm font-black text-slate-900">{doc.download_count || 0}</p>
                  <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Downloads</p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-4">Related Papers</h3>
              <div className="space-y-4">
                {doc.related_documents && doc.related_documents.length > 0 ? (
                  doc.related_documents.map((rel: any) => (
                    <Link to={`/documents/${rel.id}`} key={rel.id} className="p-4 rounded-[28px] border border-slate-50 hover:bg-slate-50 transition-all cursor-pointer flex gap-4 group">
                      <div className="w-16 h-20 bg-slate-100 rounded-2xl shrink-0 flex items-center justify-center text-slate-300">
                        <FileText size={24} />
                      </div>
                      <div className="min-w-0 py-1 flex-grow">
                        <h4 className="font-bold text-sm text-slate-900 line-clamp-2 leading-snug group-hover:text-teal-600 transition-colors">{rel.title}</h4>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2 flex items-center gap-1.5">
                          <Download size={12} className="opacity-50" /> {rel.download_count || 0} Saves
                        </p>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="p-8 text-center bg-slate-50 rounded-[28px] border border-dashed border-slate-200">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">No related nodes found</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {doc.user && (
        <SendMessageModal
          isOpen={isMessageModalOpen}
          onClose={() => setIsMessageModalOpen(false)}
          recipientId={doc.user.id}
          recipientName={doc.user.name}
        />
      )}
    </div>
  )
}