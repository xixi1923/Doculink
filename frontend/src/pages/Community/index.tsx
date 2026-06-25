import { useState, useEffect, useRef } from 'react'
import {
  MessageSquare,
  Eye,
  Clock,
  User as UserIcon,
  Plus,
  ChevronRight,
  Search,
  TrendingUp,
  MessageCircle,
  HelpCircle,
  Hash,
  ArrowRight,
  Filter,
  Send,
  MoreVertical,
  Paperclip,
  Smile,
  Loader2
} from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import api from '@/api/authApi'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

interface Category {
  id: number;
  name: string;
}

export default function Community() {
  const navigate = useNavigate()
  const [questions, setQuestions] = useState<any[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetchCategories()
  }, [])

  useEffect(() => {
    fetchQuestions()
  }, [selectedCategory])

  const fetchCategories = async () => {
    try {
      const res = await api.get('/categories')
      setCategories(res.data)
    } catch (err) {
      console.error('Failed to fetch categories', err)
    }
  }

  const fetchQuestions = async () => {
    setLoading(true)
    try {
      const params: any = {}
      if (selectedCategory) params.category_id = selectedCategory
      if (search) params.search = search

      const res = await api.get('/community/questions', { params })
      // Chat style: Newest at bottom
      setQuestions((res.data.data || []).reverse())
    } catch (err) {
      console.error('Failed to fetch questions', err)
    } finally {
      setLoading(false)
      setTimeout(() => {
        if (scrollRef.current) {
          scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
      }, 100)
    }
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    fetchQuestions()
  }

  return (
    <div className="flex h-[calc(100vh-80px)] bg-slate-50 dark:bg-slate-950 overflow-hidden font-sans">

      {/* SIDEBAR: CHANNELS */}
      <aside className="hidden lg:flex flex-col w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center text-white shadow-md">
              <MessageCircle size={18} />
            </div>
            <h2 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">Matrix Channels</h2>
          </div>
          <button className="text-slate-400 hover:text-teal-500 transition-colors">
            <Filter size={16} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-1 custom-scrollbar">
          <button
            onClick={() => setSelectedCategory(null)}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all group",
              selectedCategory === null
                ? "bg-teal-50 text-teal-600 dark:bg-teal-900/20"
                : "text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800"
            )}
          >
            <Hash size={16} className={selectedCategory === null ? "text-teal-500" : "text-slate-300 group-hover:text-slate-400"} />
            Global Broadcast
          </button>

          <div className="pt-4 pb-2 px-4">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Academic Domains</span>
          </div>

          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all group",
                selectedCategory === cat.id
                  ? "bg-teal-50 text-teal-600 dark:bg-teal-900/20"
                  : "text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800"
              )}
            >
              <Hash size={16} className={selectedCategory === cat.id ? "text-teal-500" : "text-slate-300 group-hover:text-slate-400"} />
              {cat.name}
            </button>
          ))}
        </div>

        <div className="p-6 bg-slate-50 dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800">
           <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm">
             <div className="flex items-center gap-2 mb-2">
                <TrendingUp size={14} className="text-teal-500" />
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Response Rate</span>
             </div>
             <p className="text-[10px] text-slate-500 font-bold leading-relaxed">Questions are usually resolved within <span className="text-teal-500">4.2 hours</span>.</p>
           </div>
        </div>
      </aside>

      {/* MAIN CHAT AREA */}
      <main className="flex-1 flex flex-col min-w-0 relative bg-white dark:bg-slate-900 lg:bg-slate-50 lg:dark:bg-slate-950">

        {/* CHAT HEADER */}
        <header className="h-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-6 z-10 sticky top-0">
          <div className="flex items-center gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Hash size={18} className="text-teal-500" />
                <h1 className="text-base font-black text-slate-900 dark:text-white uppercase tracking-tight">
                  {selectedCategory ? categories.find(c => c.id === selectedCategory)?.name : 'Global Feed'}
                </h1>
              </div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                {questions.length} Active Conversations
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
             <form onSubmit={handleSearchSubmit} className="hidden md:flex items-center bg-slate-100 dark:bg-slate-800 rounded-xl px-4 py-2 border border-slate-200 dark:border-slate-700 focus-within:ring-2 focus-within:ring-teal-500/20 transition-all">
                <Search size={14} className="text-slate-400" />
                <input
                  type="text"
                  placeholder="Find a topic..."
                  className="bg-transparent border-none text-xs w-64 focus:ring-0 text-slate-900 dark:text-white font-medium ml-2"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
             </form>
             <Link
              to="/community/ask"
              className="w-10 h-10 bg-[#0b1329] dark:bg-teal-500 text-white rounded-xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-lg shadow-teal-500/20"
              title="Broadcast New Question"
            >
              <Plus size={22} />
            </Link>
          </div>
        </header>

        {/* MESSAGES / QUESTIONS FEED */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8 scroll-smooth custom-scrollbar"
        >
          {loading && questions.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full space-y-4">
              <Loader2 size={32} className="text-teal-500 animate-spin" />
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Synchronizing Stream...</p>
            </div>
          ) : questions.length > 0 ? (
            <div className="max-w-4xl mx-auto w-full space-y-8">
              {questions.map((q) => (
                <div key={q.id} className="group animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="flex gap-4">
                    <Link to={`/profile/${q.user?.username}`} className="shrink-0">
                      <div className="w-11 h-11 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 overflow-hidden flex items-center justify-center group-hover:border-teal-500/50 transition-all shadow-sm">
                        {q.user?.avatar ? (
                          <img
                            src={q.user.avatar}
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                            alt={q.user.name}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-teal-50 text-teal-600 font-black text-sm uppercase">
                            {q.user?.name?.charAt(0)}
                          </div>
                        )}
                      </div>
                    </Link>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-xs font-black text-slate-900 dark:text-white hover:text-teal-600 cursor-pointer">{q.user?.name}</span>
                        <span className="text-[10px] text-slate-400 font-bold">{new Date(q.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>

                      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl rounded-tl-none p-6 shadow-sm hover:shadow-md transition-all group-hover:border-teal-500/20">
                        <Link to={`/community/questions/${q.slug}`} className="block">
                          <h3 className="text-base md:text-lg font-extrabold text-slate-800 dark:text-slate-200 leading-snug mb-3 group-hover:text-teal-600 transition-colors">
                            {q.title}
                          </h3>
                          <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed font-medium">
                            {q.content}
                          </p>
                        </Link>

                        {q.image_path && (
                          <div className="mt-4 rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-800 max-w-full">
                             <img
                              src={q.image_path}
                              className="w-full h-auto max-h-[400px] object-contain bg-slate-50 dark:bg-slate-950"
                              alt="Attachment"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                        )}

                        <div className="flex items-center justify-between mt-6 pt-5 border-t border-slate-50 dark:border-slate-800/50">
                          <div className="flex items-center gap-5">
                            <Link
                              to={`/community/questions/${q.slug}`}
                              className="flex items-center gap-1.5 text-teal-600 hover:text-teal-700 transition-colors"
                            >
                              <MessageSquare size={14} />
                              <span className="text-[10px] font-black uppercase tracking-widest">{q.answers_count} Answers</span>
                            </Link>
                            <div className="flex items-center gap-1.5 text-slate-400">
                              <Eye size={14} />
                              <span className="text-[10px] font-bold">{q.views} Views</span>
                            </div>
                          </div>

                          <Link
                            to={`/community/questions/${q.slug}`}
                            className="px-6 py-2.5 bg-teal-500 text-white hover:bg-teal-600 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-teal-500/20 active:scale-95 border border-teal-400/20"
                          >
                            Contribute Answer
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-6">
              <div className="w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-[40px] flex items-center justify-center border-4 border-white dark:border-slate-900 shadow-xl">
                <HelpCircle size={48} className="text-slate-300" />
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">The Feed is Silent</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 max-w-xs leading-relaxed font-medium">Be the first to broadcast a query in this channel and start a meaningful conversation.</p>
              </div>
            </div>
          )}
        </div>

        {/* INPUT TRAY (STYLIZED CHAT BAR) */}
        <div className="px-6 pb-8 pt-2 bg-white dark:bg-slate-900 lg:bg-slate-50 lg:dark:bg-slate-950">
           <div
             onClick={() => navigate('/community/ask')}
             className="max-w-4xl mx-auto w-full bg-white dark:bg-slate-900 rounded-[32px] p-2 pl-6 border border-slate-200 dark:border-slate-800 shadow-xl flex items-center gap-4 cursor-pointer hover:border-teal-500/30 transition-all group"
           >
              <div className="flex items-center gap-4 flex-1 text-slate-400 text-[11px] font-black uppercase tracking-widest">
                <MessageCircle size={18} className="text-teal-500" />
                <span>Broadcast a question to the community...</span>
              </div>
              <div className="flex items-center gap-2 pr-2">
                 <button className="p-3 bg-[#0b1329] dark:bg-teal-500 text-white rounded-2xl shadow-lg group-hover:scale-105 transition-transform active:scale-95">
                    <Send size={18} />
                 </button>
              </div>
           </div>
        </div>

      </main>
    </div>
  )
}
