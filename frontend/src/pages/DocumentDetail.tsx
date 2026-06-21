import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  FileText,
  Download,
  Eye,
  MessageSquare,
  Share2,
  Bookmark,
  ChevronLeft,
  Calendar,
  Layers,
  Building2,
  ShieldCheck,
  User as UserIcon,
  Send,
  Loader2,
  MoreVertical
} from 'lucide-react'
import api, { toggleFavoriteApi } from '@/api/authApi'
import { useAuthStore } from '@/store/authStore'

export default function DocumentDetail(): React.JSX.Element {
  const { id } = useParams()
  const { user, token } = useAuthStore()
  const [doc, setDoc] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [newComment, setNewComment] = useState('')
  const [submittingComment, setSubmittingComment] = useState(false)
  const [isFavorited, setIsFavorited] = useState(false)

  useEffect(() => {
    fetchDocument()
  }, [id])

  const fetchDocument = async () => {
    setLoading(true)
    try {
      const res = await api.get(`/documents/${id}`)
      setDoc(res.data)
      setIsFavorited(res.data.is_favorited)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleFavorite = async () => {
    if (!token) return alert('Please login to save favorites.')
    try {
      const res = await toggleFavoriteApi({ document_id: Number(id) })
      setIsFavorited(res.favorited)
    } catch (err) {
      console.error(err)
    }
  }

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim() || submittingComment) return

    setSubmittingComment(true)
    try {
      const res = await api.post(`/documents/${id}/comment`, { content: newComment })
      setDoc({
        ...doc,
        comments: [res.data, ...(doc.comments || [])]
      })
      setNewComment('')
    } catch (err) {
      console.error(err)
    } finally {
      setSubmittingComment(false)
    }
  }

  const handleDownload = async () => {
    if (!token) return alert('Please login to download.')
    try {
      const res = await api.get(`/documents/${id}/download`)
      window.open(res.data.url, '_blank')
      setDoc({ ...doc, downloads_count: doc.downloads_count + 1 })
    } catch (err) {
      console.error(err)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-white">
        <Loader2 className="animate-spin text-teal-600 mb-4" size={32} />
        <p className="text-sm text-slate-500 font-bold uppercase tracking-widest">Opening Archive...</p>
      </div>
    )
  }

  if (!doc) return <div className="p-20 text-center text-slate-900 font-bold">Document not found.</div>

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 font-sans text-slate-900">

      <Link to="/search" className="inline-flex items-center gap-2 text-xs font-black text-teal-600 uppercase tracking-widest mb-8 hover:-translate-x-1 transition-transform">
        <ChevronLeft size={16} /> Back to Repository
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">

        {/* Main Preview & Discussion Column */}
        <div className="lg:col-span-2 space-y-8">

          {/* Header Card */}
          <div className="bg-white rounded-[32px] border border-slate-200 p-8 shadow-sm">
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <span className="px-3 py-1 bg-teal-50 text-teal-700 text-[10px] font-black uppercase tracking-widest rounded-full border border-teal-100">
                {doc.category?.name || 'Academic Material'}
              </span>
              <span className="text-[10px] text-slate-500 font-bold flex items-center gap-1">
                <Calendar size={14} /> {new Date(doc.created_at).toLocaleDateString()}
              </span>
              <span className="text-[10px] text-slate-500 font-bold flex items-center gap-1">
                <ShieldCheck size={14} className="text-teal-600" /> Verified Source
              </span>
            </div>

            <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-4 leading-tight">
              {doc.title}
            </h1>

            <p className="text-slate-700 text-sm leading-relaxed mb-8">
              {doc.description || "This academic resource has been uploaded to assist peers in their studies. No abstract summary provided by uploader."}
            </p>

            <div className="flex flex-wrap items-center justify-between gap-6 pt-8 border-t border-slate-100">
              <div className="flex items-center gap-4">
                <button
                  onClick={handleFavorite}
                  className={`flex items-center gap-1.5 text-xs font-bold transition-all px-4 py-2 rounded-xl ${isFavorited ? 'bg-amber-50 text-amber-600 border border-amber-200' : 'bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100'}`}
                >
                  <Bookmark size={16} className={isFavorited ? 'fill-current text-amber-500' : ''} />
                  {isFavorited ? 'Saved to Collection' : 'Save Document'}
                </button>
                <button className="flex items-center gap-1.5 text-xs font-bold transition-all px-4 py-2 rounded-xl bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100">
                  <Share2 size={16} />
                  Share
                </button>
              </div>

              <button
                onClick={handleDownload}
                className="inline-flex items-center gap-2 px-8 py-3 bg-teal-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-teal-700 transition-all shadow-lg shadow-teal-500/20"
              >
                <Download size={18} />
                Download Paper
              </button>
            </div>
          </div>

          {/* File Preview Placeholder */}
          <div className="aspect-[16/9] bg-[#0b1329] rounded-[32px] overflow-hidden flex flex-col items-center justify-center text-center p-12 border border-slate-800 relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 to-transparent pointer-events-none"></div>
            <FileText size={64} className="text-teal-500/40 mb-6" />
            <h3 className="text-white font-bold text-lg mb-2">Secure Document Preview</h3>
            <p className="text-slate-400 text-xs max-w-xs font-medium leading-relaxed mb-8">
              Full text auditing is restricted to verified network members. Please download the original asset for complete academic review.
            </p>
            <button
              onClick={handleDownload}
              className="px-6 py-3 bg-white/5 border border-white/10 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all"
            >
              Open in Reader Console
            </button>
          </div>

          {/* Discussion Layer */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 ml-2">
              <MessageSquare size={20} className="text-teal-600" />
              <h2 className="text-lg font-black text-slate-900 uppercase tracking-widest">Discussion Matrix</h2>
              <span className="text-xs font-bold text-slate-500">({doc.comments?.length || 0})</span>
            </div>

            {/* Comment Input */}
            {token ? (
              <div className="bg-white p-6 rounded-[28px] border border-slate-200 shadow-sm relative focus-within:border-teal-500/40 transition-all">
                <form onSubmit={handleCommentSubmit}>
                  <textarea
                    rows={4}
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Contribute to the academic discussion or ask a technical question..."
                    className="w-full bg-transparent text-sm text-slate-900 placeholder-slate-400 outline-none resize-none leading-relaxed"
                  />
                  <div className="flex justify-end pt-4 border-t border-slate-100 mt-4">
                    <button
                      type="submit"
                      disabled={submittingComment || !newComment.trim()}
                      className="inline-flex items-center gap-2 px-6 py-2.5 bg-teal-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-teal-700 transition-all shadow-md shadow-teal-500/10 disabled:opacity-50"
                    >
                      {submittingComment ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                      Post Feedback
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="bg-slate-50 rounded-[28px] p-8 text-center border border-dashed border-slate-200">
                <p className="text-sm text-slate-600 mb-4 font-medium">Please log in to participate in academic discussions.</p>
                <Link to="/login" className="text-xs font-black text-teal-600 uppercase tracking-widest hover:underline">Sign In Now</Link>
              </div>
            )}

            {/* Comments List */}
            <div className="space-y-4">
              {doc.comments?.map((comment: any) => (
                <div key={comment.id} className="bg-white p-6 rounded-[28px] border border-slate-200 shadow-sm flex gap-4 items-start group">
                  <div className="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 shrink-0">
                    {comment.user?.avatar ? (
                      <img src={comment.user.avatar} className="w-full h-full rounded-2xl object-cover" />
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
                    <p className="text-sm text-slate-800 leading-relaxed font-medium">
                      {comment.content}
                    </p>
                  </div>
                  <button className="text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity"><MoreVertical size={16} /></button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar Info Column */}
        <div className="space-y-8">

          {/* Uploader Card */}
          <div className="bg-white rounded-[32px] border border-slate-200 p-8 shadow-sm">
             <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-6">Original Uploader</h3>
             <Link to="/profile" className="flex items-center gap-4 group">
               <div className="w-14 h-14 rounded-[20px] bg-slate-100 flex items-center justify-center text-teal-600 font-black text-xl group-hover:scale-105 transition-transform duration-300 overflow-hidden">
                 {doc.user?.avatar ? <img src={doc.user.avatar} className="w-full h-full object-cover" /> : doc.user?.name?.charAt(0) || 'U'}
               </div>
               <div>
                 <h4 className="font-bold text-slate-900 group-hover:text-teal-600 transition-colors">{doc.user?.name || 'Verified User'}</h4>
                 <p className="text-[11px] text-slate-500 font-medium">Joined {new Date(doc.user?.created_at).getFullYear()}</p>
               </div>
             </Link>
             <div className="grid grid-cols-1 gap-4 mt-8">
                <div className="p-4 bg-slate-50 rounded-2xl text-center">
                  <p className="text-lg font-black text-slate-900">{doc.user?.documents_count || 0}</p>
                  <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Total Uploads</p>
                </div>
             </div>
          </div>

          {/* Asset Metadata */}
          <div className="bg-white rounded-[32px] border border-slate-200 p-8 shadow-sm">
             <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-6">Resource Metadata</h3>
             <div className="space-y-4">
               <div className="flex items-center justify-between text-sm">
                 <span className="flex items-center gap-2 text-slate-500 font-bold uppercase tracking-widest text-[10px]"><Layers size={14} /> Category</span>
                 <span className="font-black text-slate-900">{doc.category?.name}</span>
               </div>
               <div className="flex items-center justify-between text-sm">
                 <span className="flex items-center gap-2 text-slate-500 font-bold uppercase tracking-widest text-[10px]"><Building2 size={14} /> University</span>
                 <span className="font-black text-slate-900 text-right max-w-[150px] truncate">
                    {doc.university ? (doc.university.short_name || doc.university.name) : 'Not Specified'}
                 </span>
               </div>
               <div className="flex items-center justify-between text-sm">
                 <span className="flex items-center gap-2 text-slate-500 font-bold uppercase tracking-widest text-[10px]"><Eye size={14} /> Views</span>
                 <span className="font-black text-slate-900">{doc.view_count || 0}</span>
               </div>
               <div className="flex items-center justify-between text-sm">
                 <span className="flex items-center gap-2 text-slate-500 font-bold uppercase tracking-widest text-[10px]"><Download size={14} /> Downloads</span>
                 <span className="font-black text-slate-900">{doc.download_count || 0}</span>
               </div>
             </div>
          </div>

          {/* Related Documents Widget */}
          <div className="bg-[#101726] rounded-[32px] p-8 text-white relative overflow-hidden shadow-lg">
             <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/10 rounded-full blur-2xl"></div>
             <h3 className="text-lg font-black mb-6 tracking-tight">Academic Integrity</h3>
             <p className="text-slate-300 text-xs leading-relaxed mb-6 font-medium">
               All shared resources on DocuLink must adhere to our academic integrity policies. Plagiarism is strictly monitored and flagged.
             </p>
             <button className="w-full py-3.5 bg-white/10 border border-white/20 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white hover:bg-white/20 transition-all">
                Report Violation
             </button>
          </div>

        </div>
      </div>
    </div>
  )
}
