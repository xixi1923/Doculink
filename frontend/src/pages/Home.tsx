import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  FileText,
  Search,
  TrendingUp,
  Download,
  Eye,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  GraduationCap,
  Layers
} from 'lucide-react'
import { getCategories } from '@/api/categoryApi'
import { getDocuments } from '@/api/documentApi'
import { getHomeStats } from '@/api/statsApi'
import { Category, Document, HomeStats } from '@/types'

// ================= UI HELPERS =================
const getCategoryUI = (slug: string) => {
  const ui: Record<string, { icon: string; color: string }> = {
    'exam-papers': { icon: '📝', color: 'bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400' },
    'lecture-notes': { icon: '📚', color: 'bg-violet-500/10 text-violet-600 dark:bg-violet-500/20 dark:text-violet-400' },
    'summaries': { icon: '📋', color: 'bg-sky-500/10 text-sky-600 dark:bg-sky-500/20 dark:text-sky-400' },
    'assignments': { icon: '✍️', color: 'bg-teal-500/10 text-teal-600 dark:bg-teal-500/20 dark:text-teal-400' },
    'thesis': { icon: '🎓', color: 'bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400' },
    'presentations': { icon: '💻', color: 'bg-purple-500/10 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400' },
  }
  return ui[slug] || { icon: '📄', color: 'bg-slate-500/10 text-slate-600 dark:bg-gray-500/20 dark:text-gray-400' }
}

const formatNumber = (num: number | undefined) => {
  if (num === undefined || num === null) return '0'
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k'
  }
  return num.toString()
}

const getDocumentImage = (id: number) => {
  const images = [
    'https://images.unsplash.com/photo-1576086213369-97a306dca664?auto=format&fit=crop&q=80&w=400',
    'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=400',
    'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=400',
    'https://images.unsplash.com/photo-1532187875605-2fe358a3d4f2?auto=format&fit=crop&q=80&w=400',
  ]
  return images[id % images.length]
}

export default function Home(): React.JSX.Element {
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [categories, setCategories] = useState<Category[]>([])
  const [documents, setDocuments] = useState<Document[]>([])
  const [stats, setStats] = useState<HomeStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [cats, docs, homeStats] = await Promise.all([
          getCategories(),
          getDocuments({}),
          getHomeStats()
        ])
        setCategories(cats)
        setDocuments(docs)
        setStats(homeStats)
      } catch (error) {
        console.error('Failed to fetch data', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  return (
    <div className="bg-slate-50/50 dark:bg-gray-950 min-h-screen pb-16 text-slate-800 dark:text-gray-200 font-sans selection:bg-teal-500 selection:text-white transition-colors duration-300">

      {/* ================= HERO HUB SEARCH CONSOLE ================= */}
      <div className="max-w-7xl mx-auto pt-6 px-4 sm:px-6 lg:px-8 mb-12">
        <div className="bg-[#0b1329] rounded-[32px] p-8 md:p-16 relative overflow-hidden text-center shadow-xl shadow-slate-950/10">
          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <div className="space-y-3">
              <span className="text-[10px] md:text-xs font-bold text-teal-400 uppercase tracking-widest bg-white/5 border border-white/10 px-3.5 py-1 rounded-full backdrop-blur-sm">
                Academic Document Portal
              </span>
              <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight leading-tight">
                Discover <span className="text-teal-400 italic font-serif font-normal">Knowledge</span> Shared by Peers
              </h1>
              <p className="text-slate-400 text-sm md:text-base max-w-lg mx-auto font-medium leading-relaxed">
                Join 150,000+ students sharing course notes, high-yield summaries, and previous exams across Cambodia.
              </p>
            </div>

            {/* Input Action Group Container */}
            <div className="relative max-w-xl mx-auto">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 flex items-center pointer-events-none">
                <Search size={20} />
              </div>
              <input
                type="text"
                placeholder="Search by title, author, or school subject..."
                value={searchQuery}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-24 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 outline-none focus:bg-white/10 focus:border-teal-500/50 transition-all text-xs font-medium backdrop-blur-md"
              />
              <button className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-lg font-bold text-[11px] uppercase tracking-wider transition-all">
                Search
              </button>
            </div>

            {/* Dynamic Search Pills */}
            <div className="flex flex-wrap justify-center gap-1.5 pt-1">
              {['Mathematics', 'Computer Science', 'Physics', 'Chemistry', 'Finance'].map((tag) => (
                <button
                  key={tag}
                  className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-slate-400 text-[10px] font-bold uppercase tracking-wider hover:text-white hover:border-teal-500/30 transition-all"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Ambient Lighting Background Accents */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-teal-500/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-sky-500/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ================= BROWSE CATEGORIES MODULE =================            <div className="mb-14">
          <div className="flex items-end justify-between mb-6 px-1">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Browse by Material Type</h2>
              <p className="text-sm text-slate-600 font-medium">Categorized resource index grids</p>
            </div>
            <Link to="/search" className="text-sm font-bold text-teal-600 hover:text-teal-700 transition-colors flex items-center gap-0.5 group">
              View all formats <ChevronRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {isLoading ? (
              [...Array(6)].map((_, i) => (
                <div key={i} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 animate-pulse min-h-[140px] flex flex-col items-center justify-center">
                  <div className="w-11 h-11 bg-slate-100 rounded-xl mb-3" />
                  <div className="h-4 bg-slate-100 rounded w-20 mb-2" />
                  <div className="h-3 bg-slate-100 rounded w-12" />
                </div>
              ))
            ) : (
              categories.map((cat) => {
                const ui = getCategoryUI(cat.slug)
                return (
                  <Link
                    to={`/search?category=${cat.id}`}
                    key={cat.id}
                    className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md hover:border-teal-500/20 hover:-translate-y-0.5 transition-all cursor-pointer group text-center flex flex-col items-center justify-center min-h-[140px]"
                  >
                    <div className={`w-11 h-11 ${ui.color} rounded-xl flex items-center justify-center text-xl mb-3 group-hover:scale-105 transition-transform`}>
                      {ui.icon}
                    </div>
                    <h3 className="font-bold text-slate-900 text-sm mb-0.5 truncate w-full">{cat.name}</h3>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wide">{cat.documents_count || 0}+ Files</p>
                  </Link>
                )
              })
            )}
          </div>
        </div>

        {/* ================= RECOMMENDED STORAGE GALLERY ================= */}
        <div className="mb-14">
          <div className="flex items-end justify-between mb-6 px-1">
            <div className="flex items-center gap-2">
               <Sparkles size={20} className="text-teal-600" />
               <div>
                 <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Recommended for You</h2>
                 <p className="text-sm text-slate-600 font-medium">Curated base entries from your curriculum match</p>
               </div>
            </div>
            <div className="flex gap-1.5">
              <button className="p-1.5 bg-white rounded-lg border border-slate-200 text-slate-400 hover:text-slate-800 transition-colors"><ChevronLeft size={16} /></button>
              <button className="p-1.5 bg-teal-600 rounded-lg text-white hover:bg-teal-700 transition-all"><ChevronRight size={16} /></button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {isLoading ? (
              [...Array(4)].map((_, i) => (
                <div key={i} className="bg-white rounded-[24px] overflow-hidden border border-slate-100 flex flex-col w-full animate-pulse min-h-[400px]">
                  <div className="aspect-[4/3] bg-slate-100" />
                  <div className="p-5 flex-grow space-y-4">
                    <div className="h-6 bg-slate-100 rounded w-3/4" />
                    <div className="h-4 bg-slate-100 rounded w-1/2" />
                    <div className="pt-4 border-t border-slate-100 flex justify-between">
                      <div className="w-6 h-6 bg-slate-100 rounded-full" />
                      <div className="w-20 h-4 bg-slate-100 rounded" />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              documents.slice(0, 4).map((doc) => (
                <Link to={`/documents/${doc.id}`} key={doc.id} className="group flex">
                  <div className="bg-white rounded-[24px] overflow-hidden border border-slate-200 flex flex-col w-full hover:shadow-xl hover:border-teal-500/20 hover:-translate-y-1 transition-all duration-300 min-h-[400px]">

                    {/* Aspect Document Face Frame */}
                    <div className="relative aspect-[4/3] overflow-hidden bg-slate-50">
                      <img src={getDocumentImage(doc.id)} alt={doc.title} className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-700" />
                      <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-2.5 py-0.5 rounded-md text-[10px] font-bold text-teal-700 uppercase tracking-wider shadow-sm border border-slate-100">
                        {doc.category?.name || 'Document'}
                      </div>
                      {/* Compact Interactive Download Button */}
                      <div className="absolute bottom-3 right-3 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                         <div className="w-8 h-8 bg-teal-600 text-white rounded-lg flex items-center justify-center shadow-md hover:bg-teal-700"><Download size={14} /></div>
                      </div>
                    </div>

                    {/* Body Copy Blocks */}
                    <div className="p-5 flex flex-col flex-grow justify-between">
                      <h3 className="font-bold text-lg text-slate-900 line-clamp-2 leading-tight group-hover:text-teal-600 transition-colors">
                        {doc.title}
                      </h3>

                      <div className="pt-4 border-t border-slate-100 flex items-center justify-between mt-4">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <div className="w-6 h-6 bg-slate-100 rounded-full flex items-center justify-center text-[11px] font-bold text-slate-700 shrink-0">
                             {doc.user?.name?.charAt(0) || 'U'}
                          </div>
                          <span className="text-xs font-bold text-slate-700 truncate">{doc.user?.name || 'Anonymous'}</span>
                        </div>
                        <div className="flex items-center gap-2.5 text-[10px] font-bold text-slate-500 uppercase tracking-wide shrink-0">
                          <span className="flex items-center gap-0.5"><Eye size={12} /> {formatNumber(doc.views_count)}</span>
                          <span className="flex items-center gap-0.5"><FileText size={12} /> {doc.file_type?.toUpperCase()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* ================= COMMUNITY CALL-TO-ACTION BANNER ================= */}
        <div className="bg-[#101726] rounded-[24px] p-8 md:p-14 text-center relative overflow-hidden mb-14 shadow-xl shadow-slate-950/5">
          <div className="relative z-10 max-w-xl mx-auto space-y-5">
            <h2 className="text-xl md:text-3xl font-black text-white leading-tight">Can't find the paper you're looking for?</h2>
            <p className="text-slate-400 text-xs md:text-sm leading-relaxed font-light">
              Our academic grid is community-driven. Submit a missing file requirement and peer networks will map and upload it directly.
            </p>
            <div className="flex flex-wrap justify-center gap-3 pt-2">
               <Link to="/upload" className="bg-teal-500 hover:bg-teal-600 text-white font-bold uppercase tracking-wider text-[10px] px-6 py-2.5 rounded-xl transition-all shadow-md shadow-teal-500/10">
                 Request a document
               </Link>
               <button className="bg-white/5 hover:bg-white/10 text-white font-bold uppercase tracking-wider text-[10px] px-6 py-2.5 rounded-xl transition-all border border-white/10">
                 Join contributor network
               </button>
            </div>
          </div>
          <div className="absolute top-0 right-0 w-80 h-80 bg-teal-500/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-500/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl" />
        </div>

        {/* ================= INSIGHTS DATA PANELS ROW ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">

           {/* Tier 1: Campus Ranking Library Metrics */}
           <div className="bg-white dark:bg-gray-900 rounded-[24px] p-6 border border-slate-100 dark:border-gray-800 shadow-xs flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-lg mb-5 flex items-center gap-2">
                   <GraduationCap size={20} className="text-teal-500" /> Top Universities
                </h3>
                <div className="space-y-4">
                   {isLoading ? (
                      [...Array(5)].map((_, i) => (
                        <div key={i} className="h-8 bg-slate-50 dark:bg-gray-800 animate-pulse rounded-lg" />
                      ))
                   ) : (
                     stats?.top_universities.map((uni, i) => (
                        <div key={i} className="flex items-center justify-between group cursor-pointer text-sm">
                           <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-slate-50 dark:bg-gray-800 text-slate-500 dark:text-gray-400 group-hover:bg-teal-500 group-hover:text-white rounded-lg flex items-center justify-center font-bold transition-all text-xs">
                                 {i+1}
                              </div>
                              <span className="font-bold text-slate-600 dark:text-gray-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">{uni.university}</span>
                           </div>
                           <span className="text-[11px] font-bold text-slate-300 dark:text-gray-600 uppercase tracking-wider">{formatNumber(uni.documents_count)} Docs</span>
                        </div>
                     ))
                   )}
                </div>
              </div>
              <Link to="/universities" className="w-full text-center py-2.5 bg-slate-50 dark:bg-gray-800/50 hover:bg-slate-100 dark:hover:bg-gray-800 rounded-xl font-bold text-xs text-slate-500 dark:text-gray-400 mt-6 transition-colors border border-transparent dark:border-gray-700">Browse Campuses</Link>
           </div>

           {/* Tier 2: Realtime Trending Nodes */}
           <div className="bg-white dark:bg-gray-900 rounded-[24px] p-6 border border-slate-100 dark:border-gray-800 shadow-xs flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-lg mb-5 flex items-center gap-2">
                   <TrendingUp size={20} className="text-teal-500" /> Trending Now
                </h3>
                <div className="space-y-3">
                   {isLoading ? (
                      [...Array(4)].map((_, i) => (
                        <div key={i} className="h-14 bg-slate-50 dark:bg-gray-800 animate-pulse rounded-xl" />
                      ))
                   ) : (
                     documents.sort((a, b) => b.views_count - a.views_count).slice(0, 4).map((doc, i) => (
                        <Link to={`/documents/${doc.id}`} key={i} className="p-3 rounded-xl bg-slate-50/70 dark:bg-gray-800/50 hover:bg-white dark:hover:bg-gray-800 hover:shadow-sm transition-all border border-transparent hover:border-slate-100 dark:hover:border-gray-700 cursor-pointer flex gap-3 items-center">
                           <div className="w-9 h-9 bg-white dark:bg-gray-900 rounded-lg shadow-xs flex items-center justify-center text-slate-400 dark:text-gray-500 shrink-0">
                              <FileText size={16} />
                           </div>
                           <div className="min-w-0">
                              <p className="font-bold text-slate-700 dark:text-gray-200 text-sm truncate">{doc.title}</p>
                              <p className="text-[10px] text-teal-600 dark:text-teal-400 font-bold uppercase tracking-wider mt-0.5">{formatNumber(doc.views_count)} Views</p>
                           </div>
                        </Link>
                     ))
                   )}
                </div>
              </div>
              <button className="w-full text-center py-2.5 bg-slate-50 dark:bg-gray-800/50 hover:bg-slate-100 dark:hover:bg-gray-800 rounded-xl font-bold text-xs text-slate-500 dark:text-gray-400 mt-6 transition-colors border border-transparent dark:border-gray-700">View Analytics</button>
           </div>

           {/* Tier 3: Core Network Proof Card */}
           <div className="bg-[#0b1329] rounded-[24px] p-6 text-white flex flex-col justify-between items-center text-center relative overflow-hidden min-h-[300px]">
              <div className="relative z-10 w-full flex flex-col items-center my-auto space-y-4">
                <div className="w-12 h-12 bg-teal-500/20 rounded-xl flex items-center justify-center text-teal-400 mb-2">
                   <Layers size={24} />
                </div>
                <div>
                  <h3 className="text-3xl font-black tracking-tight leading-none">{formatNumber(stats?.total_docs || 0)}</h3>
                  <p className="text-slate-400 font-bold uppercase tracking-wider text-[9px] mt-1">Verified Documents Matrix</p>
                </div>
                <div className="w-full h-px bg-white/5" />

                <div className="flex -space-x-2.5">
                   {[1,2,3,4,5].map((i) => (
                      <img key={i} src={`https://i.pravatar.cc/150?u=${i+20}`} className="w-7 h-7 rounded-full border-2 border-[#0b1329] object-cover shadow-sm" alt="User network member" />
                   ))}
                </div>
                <p className="text-[11px] font-light text-slate-400 max-w-xs leading-normal">
                  Join thousands of local students pooling revision material files together.
                </p>
              </div>
              <div className="absolute top-0 right-0 w-44 h-44 bg-teal-500/5 rounded-full blur-2xl" />
           </div>

        </div>
      </div>
    </div>
  )
}
