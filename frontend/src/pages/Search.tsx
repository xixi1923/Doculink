import { useState, useEffect } from 'react'
import { useSearchParams, Link, useNavigate } from 'react-router-dom'
import {
  Search as SearchIcon,
  ChevronDown,
  FileText,
  Eye,
  Download,
  ArrowUpRight,
  Loader2,
  Filter,
  Heart,
  MessageSquare,
  Bookmark,
  MoreHorizontal,
  GraduationCap,
  Calendar,
  Layers
} from 'lucide-react'
import api, { toggleDocumentLikeApi } from '@/api/authApi'
import { downloadDocument } from '@/api/documentApi'
import { useAuthStore } from '@/store/authStore'

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams()
  const { token } = useAuthStore()
  const navigate = useNavigate()
  const query = searchParams.get('q') || ''
  const catParam = searchParams.get('category') || ''

  const [results, setResults] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('all')
  const [selectedCategories, setSelectedCategories] = useState<string[]>(catParam ? [catParam] : [])

  useEffect(() => {
    fetchCategories()
  }, [])

  useEffect(() => {
    fetchResults()
  }, [query, activeTab, selectedCategories])

  const fetchCategories = async () => {
    try {
      const res = await api.get('/categories')
      setCategories(res.data)
    } catch (err) {
      console.error('Failed to fetch categories', err)
    }
  }

  const fetchResults = async () => {
    setLoading(true)
    try {
      let endpoint = '/documents'
      if (activeTab === 'recommended') {
        endpoint = '/recommendations'
      }

      const params: any = { search: query }

      if (selectedCategories.length > 0) {
        params.category_id = selectedCategories[0]
      }

      const res = await api.get(endpoint, { params })
      setResults(res.data.data || res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const toggleCategory = (id: string) => {
    const isSelected = selectedCategories.includes(id)
    const newSelected = isSelected ? [] : [id]
    setSelectedCategories(newSelected)

    const newParams = new URLSearchParams(searchParams)
    if (newSelected.length > 0) {
        newParams.set('category', id)
    } else {
        newParams.delete('category')
    }
    setSearchParams(newParams)
  }

  const handleLike = async (id: number, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!token) {
        return navigate('/login')
    }

    try {
        const res = await toggleDocumentLikeApi(id)
        setResults(prev => prev.map(item => {
            if (item.id === id) {
                return {
                    ...item,
                    is_liked: res.liked,
                    likes_count: res.liked ? (item.likes_count || 0) + 1 : Math.max(0, (item.likes_count || 0) - 1)
                }
            }
            return item
        }))
    } catch (err) {
        console.error('Failed to like', err)
    }
  }

  const handleDownload = async (id: number, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!token) {
        return navigate('/login')
    }

    try {
        const res = await downloadDocument(id.toString())
        if (res.url) {
            window.open(res.url, '_blank')
            // Optimistically update download count
            setResults(prev => prev.map(item => {
                if (item.id === id) {
                    return { ...item, download_count: (item.download_count || 0) + 1 }
                }
                return item
            }))
        }
    } catch (err) {
        console.error('Failed to download', err)
    }
  }

  const renderFilePreview = (doc: any) => {
    const type = (doc.file_type || '').toLowerCase()
    const isImage = ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(type)

    if (isImage && doc.file_path) {
      return (
        <img
          src={doc.file_path}
          alt=""
          className="w-full h-full object-cover rounded-2xl"
        />
      )
    }

    const typeColors: Record<string, string> = {
      pdf: 'text-rose-500 bg-rose-50 border-rose-100',
      docx: 'text-blue-500 bg-blue-50 border-blue-100',
      doc: 'text-blue-500 bg-blue-50 border-blue-100',
      pptx: 'text-orange-500 bg-orange-50 border-orange-100',
      ppt: 'text-orange-500 bg-orange-50 border-orange-100',
    }

    const colorClass = typeColors[type] || 'text-teal-500 bg-slate-50 border-slate-100'

    return (
      <div className={`w-full h-full flex flex-col items-center justify-center rounded-2xl border ${colorClass}`}>
        <FileText size={32} className="mb-2 opacity-40" />
        <span className="text-[9px] font-black uppercase tracking-widest">{type || 'FILE'}</span>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 font-sans text-slate-900 bg-white min-h-screen">

      {/* Header Section */}
      <div className="mb-12">
        <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">
          Explore Documents
        </h1>
        <p className="text-slate-500 font-medium">
          Discover {results.length} relevant papers and study materials
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-12">

        {/* SIDEBAR - REFINE BY */}
        <aside className="w-full lg:w-72 shrink-0">
          <div className="bg-[#fcfdfe] p-10 rounded-[48px] border border-slate-100/50 shadow-sm sticky top-8">
            <h3 className="font-black text-[10px] text-slate-400 uppercase tracking-[0.2em] mb-10">Refine By</h3>

            <div className="space-y-12">
              {/* Category Group */}
              <div>
                <button className="w-full flex items-center justify-between group mb-6">
                  <h4 className="text-sm font-black text-slate-900 uppercase tracking-wider">Category</h4>
                  <ChevronDown size={14} className="text-slate-300 group-hover:text-teal-500 transition-colors" />
                </button>
                <div className="space-y-4">
                  {categories.map(cat => (
                    <label key={cat.id} className="flex items-center gap-4 cursor-pointer group">
                      <div className="relative flex items-center justify-center">
                        <input
                            type="checkbox"
                            checked={selectedCategories.includes(cat.id.toString())}
                            onChange={() => toggleCategory(cat.id.toString())}
                            className="peer w-5 h-5 rounded-lg border-slate-200 text-teal-600 focus:ring-teal-500/20 transition-all appearance-none border-2 checked:bg-teal-500 checked:border-teal-500"
                        />
                        <div className="absolute text-white scale-0 peer-checked:scale-100 transition-transform pointer-events-none">
                            <svg className="w-3 h-3 fill-current" viewBox="0 0 20 20"><path d="M0 11l2-2 5 5L18 3l2 2L7 18z"/></svg>
                        </div>
                      </div>
                      <span className={`text-[13px] font-bold transition-colors ${selectedCategories.includes(cat.id.toString()) ? 'text-teal-600' : 'text-slate-500 group-hover:text-slate-900'}`}>
                        {cat.name}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* MAIN RESULTS AREA */}
        <main className="flex-grow space-y-8">

          {/* Tabs and Sort */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 gap-4">
            <div className="flex gap-8 overflow-x-auto no-scrollbar">
                {[
                { id: 'all', label: 'All Results' },
                { id: 'documents', label: 'Documents' },
                { id: 'recommended', label: 'Recommended For You' }
                ].map(tab => (
                <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`pb-5 text-[13px] font-black uppercase tracking-widest transition-all relative whitespace-nowrap ${
                    activeTab === tab.id ? 'text-teal-600' : 'text-slate-400 hover:text-slate-900'
                    }`}
                >
                    {tab.label}
                    {activeTab === tab.id && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-600 rounded-full" />}
                </button>
                ))}
            </div>

            <div className="flex items-center gap-2 pb-5">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                    <Filter size={12} /> Sort By:
                </span>
                <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest cursor-pointer hover:text-teal-600 transition-colors">Relevance</span>
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="animate-spin text-teal-600 mb-4" size={32} />
              <p className="text-xs text-slate-400 font-black uppercase tracking-widest">Querying Matrix...</p>
            </div>
          ) : (
            <div className="space-y-6">
              {results.length > 0 ? results.map(item => (
                <div key={item.id} className="bg-white rounded-[32px] border border-slate-100 p-8 flex flex-col sm:flex-row gap-8 hover:border-teal-500/20 hover:shadow-[0_20px_50px_-20px_rgba(0,0,0,0.05)] transition-all group relative">

                  {/* Thumbnail */}
                  <div className="w-full sm:w-44 h-44 shrink-0 rounded-3xl overflow-hidden bg-slate-50 border border-slate-100 shadow-sm relative">
                    {renderFilePreview(item)}
                  </div>

                  {/* Content */}
                  <div className="flex-grow min-w-0 flex flex-col">
                    <div className="flex items-start justify-between gap-4 mb-2">
                        <Link to={`/${activeTab === 'books' ? 'books' : 'documents'}/${item.id}`}>
                            <h3 className="text-xl font-black text-slate-900 group-hover:text-teal-600 transition-colors leading-tight line-clamp-2">
                                {item.title}
                            </h3>
                        </Link>
                        <button className="p-2 text-slate-300 hover:text-slate-600 transition-colors">
                            <MoreHorizontal size={20} />
                        </button>
                    </div>

                    <div className="flex items-center gap-3 mb-5 flex-wrap">
                        <Link to={item.user?.username ? `/profile/${item.user.username}` : (item.user?.id ? `/user/${item.user.id}` : '#')} className="flex items-center gap-2 group/user">
                             <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-black text-teal-600 overflow-hidden group-hover/user:border-teal-500 transition-all border border-transparent shrink-0">
                                {item.user?.avatar ? <img src={item.user.avatar} className="w-full h-full object-cover" crossOrigin="anonymous" /> : (item.user?.name?.charAt(0) || item.author?.charAt(0) || 'U')}
                             </div>
                             <span className="text-[11px] font-bold text-slate-800 group-hover/user:text-teal-600 transition-colors truncate max-w-[120px]">{item.user?.name || item.author}</span>
                        </Link>
                        <span className="text-slate-300">•</span>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.1em] truncate max-w-[150px]">
                             {item.user?.academic_title || item.university?.short_name || item.university?.name || 'Academic Institution'}
                        </span>
                    </div>

                    <p className="text-[13px] text-slate-500 font-medium line-clamp-2 leading-relaxed mb-8 flex-grow">
                      {item.description || "Access this verified academic resource to assist your study journey and curriculum requirements."}
                    </p>

                    <div className="flex items-center justify-between mt-auto pt-4">
                        <Link to={`/${activeTab === 'books' ? 'books' : 'documents'}/${item.id}`} className="px-6 py-3 bg-teal-500/10 text-teal-600 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-teal-600 hover:text-white transition-all flex items-center gap-2">
                            View Full Paper <ArrowUpRight size={14} />
                        </Link>

                        <div className="flex items-center gap-6 text-slate-400">
                             <div className="flex items-center gap-1.5" title="Views">
                                <Eye size={15} className="opacity-60" />
                                <span className="text-[11px] font-bold text-slate-700">{item.view_count || 0}</span>
                             </div>

                             <button
                                onClick={(e) => handleLike(item.id, e)}
                                className="flex items-center gap-1.5 group/icon"
                                title="Like"
                             >
                                <Heart
                                    size={15}
                                    className={`transition-all ${item.is_liked ? 'fill-rose-500 text-rose-500' : 'opacity-60 group-hover/icon:text-rose-500'} ${!item.is_liked && item.likes_count > 0 ? 'text-rose-500/70' : ''}`}
                                />
                                <span className={`text-[11px] font-bold ${item.is_liked ? 'text-rose-500' : 'text-slate-700'}`}>
                                    {item.likes_count || 0}
                                </span>
                             </button>

                             <Link
                                to={`/${activeTab === 'books' ? 'books' : 'documents'}/${item.id}#comments`}
                                className="flex items-center gap-1.5 group/icon"
                                title="Comments"
                             >
                                <MessageSquare size={15} className="opacity-60 group-hover/icon:text-teal-500 transition-colors" />
                                <span className="text-[11px] font-bold text-slate-700 group-hover/icon:text-teal-500 transition-colors">
                                    {item.comments_count || 0}
                                </span>
                             </Link>

                             <button
                                onClick={(e) => handleDownload(item.id, e)}
                                className="flex items-center gap-1.5 group/icon"
                                title="Download"
                             >
                                <Download size={14} className="opacity-60 group-hover/icon:text-teal-600 transition-colors" />
                                <span className={`text-[11px] font-bold transition-colors group-hover/icon:text-teal-600 ${item.download_count > 0 ? 'text-teal-600/70' : 'text-slate-700'}`}>
                                    {item.download_count || 0}
                                </span>
                             </button>
                        </div>
                    </div>
                  </div>
                </div>
              )) : (
                <div className="text-center py-32 bg-white rounded-[64px] border border-dashed border-slate-100">
                  <SearchIcon size={64} className="text-slate-100 mx-auto mb-6" />
                  <p className="text-slate-400 font-black uppercase tracking-[0.2em] text-xs">No records detected in this sector</p>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

// DOCULINK REPOSITORY EXPLORER
