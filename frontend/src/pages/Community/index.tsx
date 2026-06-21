import { useState, useEffect } from 'react'
import { MessageSquare, Eye, Clock, User as UserIcon, PlusCircle, ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import api from '@/api/authApi'

export default function Community() {
  const [questions, setQuestions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/community/questions')
      .then(res => setQuestions(res.data.data || []))
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 py-12 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <span className="text-[10px] font-black text-teal-600 uppercase tracking-widest bg-teal-500/10 px-3.5 py-1 rounded-full">
              Knowledge Exchange
            </span>
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight mt-4">Community Q&A</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">Tap into the academic network for crowd-sourced breakdowns and solutions.</p>
          </div>
          <Link
            to="/community/ask"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#0b1329] dark:bg-teal-500 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:opacity-90 transition-all shadow-xl shadow-slate-950/10"
          >
            <PlusCircle size={18} />
            Ask a Question
          </Link>
        </div>

        <div className="space-y-4">
          {loading ? (
            [1, 2, 3].map(i => <div key={i} className="h-32 bg-slate-50 dark:bg-slate-900 rounded-[32px] animate-pulse border border-slate-100 dark:border-slate-800" />)
          ) : questions.length > 0 ? (
            questions.map((q) => (
              <Link
                key={q.id}
                to={`/community/questions/${q.slug}`}
                className="bg-white dark:bg-slate-900 p-8 rounded-[32px] border border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center gap-6 hover:border-teal-500/30 transition-all group shadow-sm"
              >
                <div className="flex flex-col items-center justify-center min-w-[80px] h-20 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 group-hover:bg-teal-500 group-hover:text-white transition-all">
                  <span className="text-2xl font-black">{q.answers_count}</span>
                  <span className="text-[9px] font-black uppercase tracking-widest opacity-60">Answers</span>
                </div>

                <div className="flex-grow min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-[9px] font-black uppercase tracking-widest rounded-lg border border-slate-200 dark:border-slate-700">
                      {q.category?.name || 'General Query'}
                    </span>
                    <span className="text-[10px] text-slate-400 font-bold flex items-center gap-1">
                      <Clock size={12} /> {new Date(q.created_at).toLocaleDateString()}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-teal-600 transition-colors leading-tight truncate">
                    {q.title}
                  </h3>

                  <div className="flex items-center gap-4 mt-4">
                    <div className="flex items-center gap-2">
                       <div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                          <UserIcon size={12} className="text-slate-400" />
                       </div>
                       <span className="text-xs text-slate-500 font-bold">{q.user?.name}</span>
                    </div>
                    <span className="text-slate-300">•</span>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-1">
                       <Eye size={12} /> {q.views} Views
                    </span>
                  </div>
                </div>

                <div className="hidden sm:block">
                   <div className="w-12 h-12 rounded-full border border-slate-100 dark:border-slate-800 flex items-center justify-center text-slate-300 group-hover:text-teal-600 group-hover:border-teal-500/30 transition-all">
                      <ChevronRight size={20} />
                   </div>
                </div>
              </Link>
            )
          )) : (
            <div className="text-center py-24 bg-slate-50 dark:bg-slate-900/50 rounded-[48px] border-2 border-dashed border-slate-200 dark:border-slate-800">
              <MessageSquare size={48} className="text-slate-200 mx-auto mb-6" />
              <p className="text-slate-500 font-black uppercase tracking-widest text-xs">The community is waiting for its first question.</p>
              <Link to="/community/ask" className="mt-8 inline-block px-8 py-3 bg-teal-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-teal-600 transition-all">
                Broadcast first query
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
