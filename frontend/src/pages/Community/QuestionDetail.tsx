import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { MessageSquare, Eye, Clock, User as UserIcon, ArrowLeft, Send, Loader2, MessageCircle, X } from 'lucide-react'
import api from '@/api/authApi'
import { useAuthStore } from '@/store/authStore'
import SendMessageModal from '@/components/SendMessageModal'

export default function QuestionDetail() {
  const { slug } = useParams()
  const { user } = useAuthStore()
  const [question, setQuestion] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [answerContent, setAnswerContent] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [messageRecipient, setMessageRecipient] = useState<{id: number, name: string} | null>(null)

  useEffect(() => {
    fetchQuestion()
  }, [slug])

  const fetchQuestion = () => {
    api.get(`/community/questions/${slug}`)
      .then(res => setQuestion(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }

  const handleAnswerSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!answerContent.trim()) return

    setSubmitting(true)
    api.post(`/community/questions/${question.id}/answers`, { content: answerContent })
      .then(() => {
        setAnswerContent('')
        fetchQuestion()
      })
      .catch(err => console.error(err))
      .finally(() => setSubmitting(false))
  }

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-white dark:bg-slate-950">
        <div className="animate-spin w-10 h-10 border-4 border-teal-500 border-t-transparent rounded-full mb-4"></div>
        <p className="text-slate-400 font-black uppercase tracking-widest text-xs">Accessing Knowledge Matrix...</p>
    </div>
  )

  if (!question) return <div className="p-20 text-center text-slate-500 font-bold">Question not found.</div>

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <Link to="/community" className="inline-flex items-center gap-2 text-[10px] font-black text-teal-600 uppercase tracking-widest mb-8 hover:-translate-x-1 transition-transform">
          <ArrowLeft size={16} /> Back to Q&A Feed
        </Link>

        <article className="bg-white dark:bg-slate-900 rounded-[40px] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden mb-12">
           <div className="p-8 md:p-14">
             <div className="flex items-center gap-3 mb-8">
                <span className="px-3 py-1 bg-teal-50 dark:bg-teal-900/20 text-teal-600 text-[10px] font-black uppercase tracking-widest rounded-full border border-teal-100 dark:border-teal-800">
                  {question.category?.name || 'Academic Query'}
                </span>
                <span className="text-[10px] text-slate-400 font-bold flex items-center gap-1">
                   {new Date(question.created_at).toLocaleDateString()}
                </span>
             </div>

             <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-8 leading-tight">
               {question.title}
             </h1>

             <div className="flex items-center justify-between mb-10 pb-10 border-b border-slate-50 dark:border-gray-800">
                <Link to={question.user?.username ? `/profile/${question.user.username}` : `/user/${question.user?.id}`} className="flex items-center gap-4 group">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden border border-slate-200 dark:border-slate-700 group-hover:border-teal-500 transition-all shrink-0">
                    {question.user?.avatar ? (
                      <img src={question.user.avatar} className="w-full h-full object-cover" crossOrigin="anonymous" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-teal-50 text-teal-600 font-bold">
                        {question.user?.name?.charAt(0) || 'U'}
                      </div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-black text-slate-900 dark:text-white leading-none mb-1 group-hover:text-teal-600 transition-colors truncate">{question.user?.name}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest truncate">
                      {question.user?.academic_title || 'Question Author'}
                    </p>
                  </div>
                </Link>

                {user?.id !== question.user?.id && (
                    <button
                        onClick={() => setMessageRecipient({ id: question.user.id, name: question.user.name })}
                        className="p-3 bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-teal-600 rounded-2xl transition-all"
                        title="Send Private Message"
                    >
                        <MessageCircle size={20} />
                    </button>
                )}
             </div>

             <div className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed text-base font-medium">
               {question.content}
             </div>
           </div>
        </article>

        {/* Answers Section */}
        <section className="space-y-8">
          <div className="flex items-center gap-3 ml-4">
             <MessageSquare size={20} className="text-teal-500" />
             <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-widest">
               {question.answers?.length || 0} Peer Responses
             </h3>
          </div>

          <div className="space-y-6">
            {question.answers?.map((ans: any) => (
              <div key={ans.id} className="bg-white dark:bg-slate-900 p-8 rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                      <Link to={ans.user?.username ? `/profile/${ans.user.username}` : `/user/${ans.user?.id}`} className="flex items-center gap-3 group">
                        <div className="w-8 h-8 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center overflow-hidden border border-slate-200 dark:border-slate-700 group-hover:border-teal-500 transition-all shrink-0">
                          {ans.user?.avatar ? (
                            <img src={ans.user.avatar} className="w-full h-full object-cover" crossOrigin="anonymous" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-teal-50 text-teal-600 text-[10px] font-bold">
                              {ans.user?.name?.charAt(0) || 'U'}
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-black text-slate-900 dark:text-white group-hover:text-teal-600 transition-colors truncate">{ans.user?.name}</p>
                          <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest truncate">
                            {ans.user?.affiliation || 'Academic Contributor'}
                          </p>
                        </div>
                      </Link>
                      {user?.id !== ans.user?.id && (
                        <button
                            onClick={() => setMessageRecipient({ id: ans.user.id, name: ans.user.name })}
                            className="text-slate-400 hover:text-teal-600 transition-colors"
                        >
                            <MessageCircle size={14} />
                        </button>
                      )}
                  </div>
                </div>
                <div className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed whitespace-pre-wrap font-medium">
                  {ans.content}
                </div>
              </div>
            ))}
          </div>

          {/* Answer Input */}
          {user ? (
            <div className="mt-16 bg-white dark:bg-slate-900 p-8 md:p-12 rounded-[48px] border border-slate-100 dark:border-slate-800 shadow-2xl shadow-slate-200/50 dark:shadow-none">
              <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-[0.2em] mb-8 text-center">Share your breakdown</h4>
              <form onSubmit={handleAnswerSubmit}>
                <textarea
                  rows={6}
                  value={answerContent}
                  onChange={(e) => setAnswerContent(e.target.value)}
                  placeholder="Provide an academic solution or helpful insight..."
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-3xl p-8 text-sm text-slate-800 dark:text-white focus:border-teal-500 outline-none transition-all resize-none mb-6 font-medium"
                />
                <div className="flex justify-center">
                  <button
                    type="submit"
                    disabled={submitting || !answerContent.trim()}
                    className="inline-flex items-center gap-3 px-12 py-4 bg-[#0b1329] dark:bg-teal-500 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:opacity-90 transition-all shadow-xl shadow-slate-950/10 disabled:opacity-50"
                  >
                    {submitting ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
                    Post Answer
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="bg-slate-50 dark:bg-slate-900/50 border border-dashed border-slate-200 dark:border-slate-800 p-12 rounded-[48px] text-center">
              <p className="text-sm text-slate-500 mb-6 font-medium">Log in to contribute to this discussion matrix.</p>
              <Link to="/login" className="px-8 py-3 bg-teal-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-teal-600 transition-all">Sign In Now</Link>
            </div>
          )}
        </section>
      </div>
      <SendMessageModal
        isOpen={!!messageRecipient}
        onClose={() => setMessageRecipient(null)}
        recipientId={messageRecipient?.id || ''}
        recipientName={messageRecipient?.name || ''}
      />
    </div>
  )
}
