import { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import {
  Search as SearchIcon,
  ChevronDown,
  FileText,
  Eye,
  Download,
  ArrowUpRight,
  Loader2
} from 'lucide-react'
import api from '@/api/authApi'

export default function Search() {
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q') || ''

  const [results, setResults] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('documents')
  const [showFilters] = useState(true)

  useEffect(() => {
    fetchResults()
  }, [query, activeTab])

  const fetchResults = async () => {
    setLoading(true)
    try {
      const endpoint = activeTab === 'documents' ? '/documents' : '/books'
      const res = await api.get(endpoint, { params: { search: query } })
      setResults(res.data.data || res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 font-sans text-slate-800 dark:text-gray-200">
      <div className="mb-10">
        <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          {query ? `Search results for "${query}"` : 'Explore Repository'}
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">
          Discover {results.length} relevant materials matching your criteria.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-10">
        {showFilters && (
          <aside className="w-full lg:w-64 space-y-8 shrink-0">
            <div className="bg-white dark:bg-slate-900 p-8 rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-sm">
              <h3 className="font-black text-xs text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-8">Refine By</h3>
              <div className="space-y-10">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-4 flex items-center justify-between">
                    Category <ChevronDown size={14} className="text-slate-300" />
                  </h4>
                  <div className="space-y-3">
                    {['Lecture Notes', 'Summaries', 'Exam Prep'].map(cat => (
                      <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                        <input type="checkbox" className="w-4 h-4 rounded border-slate-200 dark:border-slate-800 text-teal-600 focus:ring-teal-500/20" />
                        <span className="text-sm text-slate-500 dark:text-slate-400 group-hover:text-teal-600">{cat}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </aside>
        )}

        <main className="flex-grow space-y-6">
          <div className="flex items-center gap-6 border-b dark:border-slate-800 overflow-x-auto pb-px">
            {[
              { id: 'documents', label: 'Documents' },
              { id: 'books', label: 'Books' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-4 text-sm font-bold transition-all relative whitespace-nowrap ${
                  activeTab === tab.id ? 'text-teal-600' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                }`}
              >
                {tab.label}
                {activeTab === tab.id && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-600 rounded-full" />}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="animate-spin text-teal-500 mb-4" size={32} />
              <p className="text-sm text-slate-400 font-bold uppercase tracking-widest">Searching Database...</p>
            </div>
          ) : (
            <div className="space-y-6">
              {results.length > 0 ? results.map(doc => (
                <div key={doc.id} className="bg-white dark:bg-slate-900 rounded-[32px] border border-slate-100 dark:border-slate-800 p-6 shadow-sm hover:border-teal-500/30 transition-all group">
                  <div className="flex gap-6">
                    <div className="w-20 h-28 flex-shrink-0 bg-slate-50 dark:bg-slate-950 rounded-2xl flex items-center justify-center text-teal-600 border border-slate-100 dark:border-slate-800">
                      <FileText size={32} />
                    </div>
                    <div className="flex-grow min-w-0">
                      <Link to={`/${activeTab === 'books' ? 'books' : 'documents'}/${doc.id}`}>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-teal-600 transition-colors line-clamp-2">
                          {doc.title}
                        </h3>
                      </Link>
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-xs font-bold text-slate-500">{doc.user?.name || doc.author}</span>
                        <span className="text-slate-300">•</span>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{doc.category?.name || doc.book_category?.name}</span>
                      </div>
                      <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mb-4 leading-relaxed">
                        {doc.description || "No description provided for this academic resource."}
                      </p>
                      <div className="flex items-center justify-between">
                         <div className="flex items-center gap-4 text-slate-400">
                            <span className="flex items-center gap-1 text-[11px] font-bold"><Eye size={14} /> {doc.view_count || doc.views_count || 0} Views</span>
                            <span className="flex items-center gap-1 text-[11px] font-bold"><Download size={14} /> {doc.download_count || doc.downloads_count || 0} Downloads</span>
                         </div>
                         <Link to={`/${activeTab === 'books' ? 'books' : 'documents'}/${doc.id}`} className="flex items-center gap-2 px-4 py-2 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-teal-500 hover:text-white transition-all">
                           Open File <ArrowUpRight size={14} />
                         </Link>
                      </div>
                    </div>
                  </div>
                </div>
              )) : (
                <div className="text-center py-20 bg-slate-50 dark:bg-slate-900/50 rounded-[48px] border-2 border-dashed border-slate-200 dark:border-slate-800">
                  <SearchIcon size={48} className="text-slate-200 mx-auto mb-4" />
                  <p className="text-slate-500 font-bold tracking-tight">No results found for your search query.</p>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
