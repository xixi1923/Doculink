import React, { useState } from 'react'
import { ChevronLeft, ChevronRight, Search, ChevronDown, BookOpen, ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'

// ================= TYPES & INTERFACES =================
interface BookItem {
  id: number;
  title: string;
  author: string;
  image: string;
  category: string;
  downloads?: string;
}

// Mock Database with rich assets matching image rows
const BOOKS: BookItem[] = [
  { id: 1, title: 'Build Your Dream Network', author: 'J. Kelly Hoey', image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=400', category: 'Career', downloads: '1.2k' },
  { id: 2, title: 'Visible Learning for Literacy', author: 'Douglas Fisher', image: 'https://images.unsplash.com/photo-1589998059171-988d887df646?auto=format&fit=crop&q=80&w=400', category: 'Education', downloads: '840' },
  { id: 3, title: 'The New Rules of Work', author: 'Alexandra Cavoulacos', image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=400', category: 'Business', downloads: '2.1k' },
  { id: 4, title: 'Pivot: The Only Move That Matters', author: 'Jenny Blake', image: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80&w=400', category: 'Self-Help', downloads: '930' },
  { id: 5, title: 'Learning & Development Practice', author: 'Nick Van Dam', image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=1000', category: 'Corporate', downloads: '1.5k' },
  { id: 6, title: 'Visible Learning System Insights', author: 'John Hattie', image: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&q=80&w=400', category: 'Research', downloads: '3.4k' }
]

export default function Books(): React.JSX.Element {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 selection:bg-primary/30 transition-colors duration-300">

      {/* ================= HERO SECTION - DARK SLATE ================= */}
      <div className="bg-[#111827] rounded-[48px] p-10 md:p-20 mb-16 relative overflow-hidden text-center shadow-2xl shadow-gray-900/10">
        <div className="relative z-10 max-w-3xl mx-auto space-y-6">
          <div className="space-y-4">
            <span className="text-[10px] font-black text-primary uppercase tracking-[0.4em] bg-white/5 border border-white/10 px-5 py-2 rounded-full backdrop-blur-sm">
              Premium E-Book Library
            </span>
            <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-tight">
              Curated <span className="text-primary italic">Education</span>
            </h1>
            <p className="text-gray-400 text-lg max-w-xl mx-auto font-medium leading-relaxed">
              Explore our collection of high-yield academic textbooks and research-backed pedagogical resources.
            </p>
          </div>
        </div>

        {/* Artistic Blurs */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-[100px]" />
      </div>

      {/* ================= WORKSPACE LAYOUT GRID ================= */}
      <div className="flex flex-col lg:flex-row gap-8 items-start">

        {/* SIDEBAR NAVIGATION FILTERS */}
        <aside className="w-full lg:w-60 shrink-0 space-y-6">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-[28px] border border-slate-100 dark:border-gray-800 shadow-sm transition-colors duration-300">
            <h3 className="font-bold text-[11px] mb-4 uppercase tracking-widest text-slate-400 dark:text-gray-500">
              Categories
            </h3>
            <ul className="space-y-1">
              {['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English Literature', 'Computer Science'].map((cat) => (
                <li key={cat}>
                  <button className="text-[13px] font-semibold text-slate-600 dark:text-gray-400 hover:text-teal-600 dark:hover:text-teal-400 transition-all flex items-center justify-between w-full py-1.5 rounded-lg group">
                    <span className="group-hover:translate-x-0.5 transition-transform">{cat}</span>
                    <span className="text-[10px] bg-slate-50 dark:bg-gray-800 text-slate-400 dark:text-gray-500 group-hover:bg-teal-50 dark:group-hover:bg-teal-500/10 group-hover:text-teal-600 dark:group-hover:text-teal-400 px-2 py-0.5 rounded-md font-bold transition-colors">
                      12
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Crowdsourced Request Box Alternative Widget */}
          <div className="bg-gradient-to-br from-teal-50/60 to-sky-50/40 dark:from-teal-500/5 dark:to-sky-500/5 p-6 rounded-[28px] border border-teal-100/50 dark:border-teal-500/20">
            <div className="w-10 h-10 bg-white dark:bg-gray-800 shadow-sm rounded-xl flex items-center justify-center text-teal-600 dark:text-teal-400 mb-4 transition-colors">
              <BookOpen size={20} />
            </div>
            <h4 className="font-extrabold text-slate-800 dark:text-white text-sm mb-1">Request a Book</h4>
            <p className="text-[11px] text-slate-500 dark:text-gray-400 leading-relaxed mb-4 font-light">
              Can't locate your academic edition? Request our global community network contributors.
            </p>
            <Link
              to="/request-book"
              className="w-full py-2.5 bg-teal-500 hover:bg-teal-600 text-white rounded-xl text-xs font-bold shadow-md shadow-teal-500/10 transition-all transform active:scale-98 flex items-center justify-center"
            >
              Request Now
            </Link>
          </div>
        </aside>

        {/* MAIN DECK PANEL GALLERY */}
        <main className="flex-grow w-full">
          <div className="flex items-center justify-between mb-6 px-1">
            <div>
              <h2 className="text-xl font-black text-slate-800 dark:text-white tracking-tight">Literature Courses</h2>
              <p className="text-[11px] text-slate-400 dark:text-gray-500 font-medium">Showing {BOOKS.length} high-yield resources available</p>
            </div>
            <div className="flex items-center gap-1 text-[11px] font-bold text-slate-400 dark:text-gray-500">
              Sort by: <span className="text-teal-500 dark:text-teal-400 cursor-pointer hover:underline flex items-center gap-0.5 ml-1">Popularity <ChevronDown size={12} /></span>
            </div>
          </div>

          {/* CARD MATRIX FRAME */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {BOOKS.map((book) => (
              <Link
                key={book.id}
                to={`/books/${book.id}`}
                className="bg-white dark:bg-gray-900 rounded-[24px] p-4 shadow-sm border border-slate-100/80 dark:border-gray-800 hover:shadow-xl dark:hover:shadow-teal-500/10 hover:-translate-y-1 transition-all duration-300 group flex flex-col justify-between"
              >
                <div>
                  {/* Aspect book cover placeholder frame wrapper */}
                  <div className="aspect-[3/4] rounded-[16px] overflow-hidden mb-4 shadow-sm relative bg-slate-50 dark:bg-gray-800">
                    <img
                      src={book.image}
                      alt={book.title}
                      className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                    />
                    {/* Floating Category tag pill badge component */}
                    <div className="absolute top-3 right-3 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md px-2.5 py-1 rounded-lg text-[9px] font-black text-teal-600 dark:text-teal-400 uppercase tracking-wider shadow-sm border border-slate-100/50 dark:border-gray-700">
                      {book.category}
                    </div>
                  </div>

                  {/* Typography information segment spacing styles */}
                  <div className="space-y-1 px-1">
                    <h3 className="font-extrabold text-sm text-slate-800 dark:text-gray-200 leading-snug line-clamp-2 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                      {book.title}
                    </h3>
                    <p className="text-slate-400 dark:text-gray-500 text-[11px] font-semibold">
                      By <span className="text-slate-500 dark:text-gray-400">{book.author}</span>
                    </p>
                  </div>
                </div>

                {/* Integrated Action Bottom Footer Strip layout row structure */}
                <div className="mt-5 pt-3.5 border-t border-slate-50 dark:border-gray-800 flex items-center justify-between gap-2 px-1">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-wide">Free Access</span>
                    <span className="text-[9px] text-slate-400 dark:text-gray-500 font-medium">{book.downloads} downloads</span>
                  </div>
                  <div className="bg-gradient-to-r from-teal-500 to-sky-500 hover:opacity-95 text-white px-4 py-2 rounded-xl text-[11px] font-bold transition-all shadow-md shadow-teal-500/10 flex items-center gap-1 group/btn">
                    Read Free
                    <ArrowUpRight size={12} className="group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* PREMIUM INTERACTIVE PAGINATION COMPONENT */}
          <div className="flex justify-center items-center gap-1.5 mb-8">
            <button className="p-2 rounded-xl border border-slate-100 dark:border-gray-800 text-slate-400 dark:text-gray-500 hover:bg-slate-50 dark:hover:bg-gray-800 transition-all active:scale-95">
              <ChevronLeft size={15} />
            </button>
            {[1, 2, 3, 4].map((page) => (
              <button
                key={page}
                className={`w-9 h-9 rounded-xl font-bold text-xs transition-all active:scale-95 ${
                  page === 1
                    ? 'bg-gradient-to-br from-teal-500 to-sky-500 text-white shadow-md shadow-teal-500/20'
                    : 'bg-white dark:bg-gray-900 text-slate-400 dark:text-gray-500 border border-slate-100 dark:border-gray-800 hover:bg-slate-50 dark:hover:bg-gray-800'
                }`}
              >
                {page}
              </button>
            ))}
            <button className="p-2 rounded-xl border border-slate-100 dark:border-gray-800 text-slate-400 dark:text-gray-500 hover:bg-slate-50 dark:hover:bg-gray-800 transition-all active:scale-95">
              <ChevronRight size={15} />
            </button>
          </div>
        </main>

      </div>
    </div>
  )
}
