import { useState, useEffect } from 'react'
import { Search, X, Clock, ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { getSearchHistoryApi } from '@/api/documentApi'

interface SearchModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('')
  const [history, setHistory] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    if (isOpen) {
      fetchHistory()
      // Focus the input when modal opens
      setTimeout(() => {
        document.getElementById('global-search-input')?.focus()
      }, 100)

      const handleEsc = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose()
      }
      window.addEventListener('keydown', handleEsc)
      return () => window.removeEventListener('keydown', handleEsc)
    }
  }, [isOpen])

  const fetchHistory = async () => {
    setLoading(true)
    try {
      const data = await getSearchHistoryApi()
      setHistory(data)
    } catch (err) {
      console.error('Failed to fetch search history', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e?: React.FormEvent, searchTerms?: string) => {
    e?.preventDefault()
    const finalQuery = searchTerms || query
    if (finalQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(finalQuery.trim())}`)
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-20 px-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="w-full max-w-2xl bg-white dark:bg-gray-900 rounded-[2rem] shadow-2xl border border-slate-100 dark:border-gray-800 overflow-hidden animate-in zoom-in-95 duration-300">

        {/* Search Input Area */}
        <form onSubmit={handleSearch} className="p-6 border-b border-slate-50 dark:border-gray-800 flex items-center gap-4">
          <div className="w-12 h-12 bg-teal-50 dark:bg-teal-500/10 rounded-2xl flex items-center justify-center text-teal-600 shrink-0">
            <Search size={24} />
          </div>
          <input
            id="global-search-input"
            type="text"
            placeholder="Search documents, books, or authors..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-grow bg-transparent text-lg font-bold text-slate-900 dark:text-white outline-none placeholder:text-slate-300 dark:placeholder:text-gray-600"
          />
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X size={24} />
          </button>
        </form>

        {/* Search Results / History */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {query.trim() ? (
            <div className="space-y-2">
              <button
                onClick={() => handleSearch()}
                className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-teal-50 dark:hover:bg-teal-500/5 text-teal-600 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <Search size={18} />
                  <span className="font-bold">Search for "{query}"</span>
                </div>
                <ArrowRight size={18} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
              </button>
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Recent Searches</h4>
              </div>

              {loading && history.length === 0 ? (
                <div className="py-8 text-center">
                  <div className="animate-spin w-5 h-5 border-2 border-teal-500 border-t-transparent rounded-full mx-auto mb-2"></div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Accessing History...</p>
                </div>
              ) : history.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {history.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleSearch(undefined, item.keyword)}
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-gray-800 transition-all text-left"
                    >
                      <Clock size={14} className="text-slate-300" />
                      <span className="text-[13px] font-bold text-slate-700 dark:text-gray-300 truncate">{item.keyword}</span>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center">
                  <div className="w-12 h-12 bg-slate-50 dark:bg-gray-800 rounded-2xl flex items-center justify-center text-slate-200 mx-auto mb-4">
                    <Clock size={24} />
                  </div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">No search history logged</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-gray-800/50 flex items-center justify-between">
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Doculink Global Index</p>
           <div className="flex items-center gap-4">
              <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest flex items-center gap-1.5">
                <span className="px-1.5 py-0.5 rounded border border-slate-200 dark:border-gray-700">ESC</span> to close
              </span>
           </div>
        </div>
      </div>
    </div>
  )
}
