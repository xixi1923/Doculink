import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ChevronLeft,
  ChevronRight,
  X,
  List,
  Search,
  Type,
  Maximize2
} from 'lucide-react'

export default function BookReader() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [currentPage, setCurrentPage] = useState(1)
  const totalPages = 525

  const nextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages))
  const prevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1))

  const progress = (currentPage / totalPages) * 100

  return (
    <div className="fixed inset-0 bg-[#f3f3f3] z-[100] flex flex-col font-sans">

      {/* Reader Header */}
      <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4 shadow-sm">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-xs font-medium text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ChevronLeft size={18} />
          Back to store
        </button>

        <h1 className="text-sm font-bold text-gray-800 absolute left-1/2 -translate-x-1/2 hidden md:block">
          Build Your Dream Network: A Novel
        </h1>

        <div className="flex items-center gap-5 text-gray-500">
          <button className="hover:text-gray-900 transition-colors"><List size={20} /></button>
          <button className="hover:text-gray-900 transition-colors"><Search size={20} /></button>
          <button className="hover:text-gray-900 transition-colors"><Type size={20} /></button>
          <div className="w-px h-6 bg-gray-200 mx-1"></div>
          <button
            onClick={() => navigate(-1)}
            className="hover:text-gray-900 transition-colors flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider"
          >
             Close <X size={18} />
          </button>
        </div>
      </header>

      {/* Reader Content Area */}
      <main className="flex-grow relative flex items-center justify-center p-4 md:p-10 overflow-hidden">

        {/* Navigation Arrows */}
        <button
          onClick={prevPage}
          disabled={currentPage === 1}
          className="absolute left-4 md:left-10 w-12 h-12 rounded-full bg-white shadow-md border border-gray-100 flex items-center justify-center text-gray-400 hover:text-primary hover:scale-110 transition-all disabled:opacity-30 disabled:hover:scale-100 z-10"
        >
          <ChevronLeft size={24} />
        </button>

        <button
          onClick={nextPage}
          disabled={currentPage === totalPages}
          className="absolute right-4 md:right-10 w-12 h-12 rounded-full bg-white shadow-md border border-gray-100 flex items-center justify-center text-gray-400 hover:text-primary hover:scale-110 transition-all disabled:opacity-30 disabled:hover:scale-100 z-10"
        >
          <ChevronRight size={24} />
        </button>

        {/* Book Page Wrapper */}
        <div className="bg-white shadow-2xl h-full aspect-[1/1.4] max-h-[85vh] relative overflow-hidden transition-all duration-300">
           {/* In a real app, this would be an image of the current page or PDF canvas */}
           <div className="absolute inset-0 p-12 md:p-20 flex flex-col">
              <div className="mb-8 flex justify-center">
                 <img
                   src="https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=400"
                   className="w-full opacity-10 blur-[2px] absolute inset-0 object-cover"
                   alt="watermark"
                 />
              </div>

              <div className="relative z-10 h-full overflow-y-auto pr-4 scrollbar-hide">
                 <h2 className="text-2xl font-serif text-gray-800 mb-8 border-b border-gray-100 pb-4">Chapter {Math.ceil(currentPage / 20)}</h2>
                 <p className="text-gray-700 leading-loose text-lg font-serif first-letter:text-5xl first-letter:font-bold first-letter:mr-3 first-letter:float-left first-letter:mt-1">
                   Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                 </p>
                 <p className="text-gray-700 leading-loose text-lg font-serif mt-6">
                   Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.
                 </p>
                 <p className="text-gray-700 leading-loose text-lg font-serif mt-6">
                    Page {currentPage} content of {totalPages}.
                 </p>
              </div>
           </div>
        </div>
      </main>

      {/* Reader Footer / Progress */}
      <footer className="h-20 bg-white border-t border-gray-200 px-6 flex flex-col justify-center gap-3">
        <div className="max-w-4xl mx-auto w-full group relative">
          <input
            type="range"
            min="1"
            max={totalPages}
            value={currentPage}
            onChange={(e) => setCurrentPage(parseInt(e.target.value))}
            className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
          />
          {/* Progress fill */}
          <div
            className="absolute top-[11px] left-0 h-1 bg-primary rounded-l-lg pointer-events-none"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="text-center">
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
            Location {currentPage} of {totalPages} • {Math.round(progress)}%
          </p>
        </div>
      </footer>
    </div>
  )
}
