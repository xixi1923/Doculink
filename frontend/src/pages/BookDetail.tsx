import {
  BookOpen,
  Download,
  Share2,
  Bookmark,
  Star,
  ChevronRight,
  Eye,
  Clock,
  ShieldCheck,
  MoreHorizontal,
  FileText,
  User,
  ArrowRight
} from 'lucide-react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'

const RELATED_BOOKS = [
  { id: 2, title: 'Visible Learning for Literacy', author: 'Douglas Fisher', image: 'https://images.unsplash.com/photo-1589998059171-988d887df646?auto=format&fit=crop&q=80&w=200' },
  { id: 3, title: 'The New Rules of Work', author: 'Alexandra Cavoulacos', image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=200' },
  { id: 4, title: 'Pivot: The Only Move That Matters', author: 'Jenny Blake', image: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80&w=200' },
]

export default function BookDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('summary')

  return (
    <div className="bg-[#f8fafc] min-h-screen pb-20">
      <div className="max-w-7xl mx-auto px-4 pt-10">

        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 mb-8">
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <ChevronRight size={12} />
          <Link to="/books" className="hover:text-primary transition-colors">Books</Link>
          <ChevronRight size={12} />
          <span className="text-slate-900">Education</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

          {/* Left Column: Book Cover & Quick Actions */}
          <div className="lg:col-span-4 space-y-8">
            <div className="bg-white rounded-[40px] p-8 shadow-sm border border-slate-100 sticky top-24">
              <div className="aspect-[3/4] rounded-[32px] overflow-hidden shadow-2xl mb-8 relative group">
                <img
                  src="https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=600"
                  alt="Book Cover"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>

              <div className="space-y-4">
                <button
                  onClick={() => navigate(`/books/${id}/read`)}
                  className="w-full py-4 bg-[#2dd4bf] text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-[#2dd4bf]/20 hover:bg-[#26bba8] transition-all flex items-center justify-center gap-3"
                >
                  <BookOpen size={20} /> Read Online Free
                </button>
                <div className="grid grid-cols-2 gap-3">
                  <button className="py-3.5 bg-slate-50 text-slate-600 rounded-2xl font-bold text-[11px] uppercase tracking-wider hover:bg-slate-100 transition-all flex items-center justify-center gap-2">
                    <Download size={16} /> PDF
                  </button>
                  <button className="py-3.5 bg-slate-50 text-slate-600 rounded-2xl font-bold text-[11px] uppercase tracking-wider hover:bg-slate-100 transition-all flex items-center justify-center gap-2">
                    <Bookmark size={16} /> Save
                  </button>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-slate-50 flex items-center justify-between">
                <div className="text-center flex-grow border-r border-slate-50">
                  <p className="text-lg font-black text-slate-900">4.8</p>
                  <div className="flex justify-center text-amber-400 mb-1">
                    {[...Array(5)].map((_, i) => <Star key={i} size={10} className="fill-amber-400" />)}
                  </div>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Rating</p>
                </div>
                <div className="text-center flex-grow">
                  <p className="text-lg font-black text-slate-900">1.2k</p>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-2">Readers</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Content & Details */}
          <div className="lg:col-span-8 space-y-10">

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 bg-teal-50 text-teal-600 rounded-full text-[10px] font-black uppercase tracking-widest">Academic Edition</span>
                <span className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  <ShieldCheck size={14} className="text-emerald-500" /> Verified Content
                </span>
              </div>
              <h1 className="text-3xl md:text-5xl font-black text-slate-900 leading-tight">
                Build Your Dream Network: Forging Powerful Relationships in a Hyper-Connected World
              </h1>
              <div className="flex items-center gap-4 pt-2">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-100">
                  <img src="https://i.pravatar.cc/150?u=author" className="w-full h-full object-cover" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Written by</p>
                  <p className="text-sm font-black text-slate-800">J. Kelly Hoey</p>
                </div>
                <div className="ml-auto flex items-center gap-6">
                  <button className="text-slate-400 hover:text-primary transition-colors"><Share2 size={20} /></button>
                  <button className="text-slate-400 hover:text-primary transition-colors"><MoreHorizontal size={20} /></button>
                </div>
              </div>
            </div>

            {/* Content Tabs */}
            <div className="space-y-8">
              <div className="flex gap-8 border-b border-slate-200">
                {['Summary', 'Details', 'Reviews', 'Community'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab.toLowerCase())}
                    className={`pb-4 text-[11px] font-black uppercase tracking-[0.2em] transition-all relative ${
                      activeTab === tab.toLowerCase() ? 'text-primary' : 'text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    {tab}
                    {activeTab === tab.toLowerCase() && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
                    )}
                  </button>
                ))}
              </div>

              <div className="prose prose-slate max-w-none">
                <p className="text-slate-600 leading-relaxed text-lg font-light">
                  Build Your Dream Network is a practical, modern guide to professional networking. J. Kelly Hoey argues that traditional networking—handing out business cards at crowded mixers—is obsolete. Instead, she provides a new roadmap for building genuine, powerful connections in our hyper-connected, digital age.
                </p>
                <p className="text-slate-600 leading-relaxed text-lg font-light mt-4">
                  Whether you are a student looking for your first internship, an entrepreneur seeking investors, or a professional aiming for the C-suite, this book provides actionable strategies to leverage both online and offline platforms to achieve your career goals.
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-4">
                <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Language</p>
                  <p className="font-black text-slate-800">English</p>
                </div>
                <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Pages</p>
                  <p className="font-black text-slate-800">256 Pages</p>
                </div>
                <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Published</p>
                  <p className="font-black text-slate-800">2017</p>
                </div>
                <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Format</p>
                  <p className="font-black text-slate-800">PDF / EPUB</p>
                </div>
              </div>
            </div>

            {/* Related Books Section */}
            <div className="pt-12">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-black text-slate-900 tracking-tight">You might also like</h3>
                <button className="text-[10px] font-black text-primary uppercase tracking-widest flex items-center gap-1">See collection <ArrowRight size={14} /></button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {RELATED_BOOKS.map((book) => (
                  <Link to={`/books/${book.id}`} key={book.id} className="group">
                    <div className="bg-white p-4 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-xl transition-all">
                      <div className="aspect-[3/4] rounded-[24px] overflow-hidden mb-4 shadow-sm">
                        <img src={book.image} alt={book.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                      </div>
                      <h4 className="font-extrabold text-xs text-slate-800 leading-snug line-clamp-2 mb-1 group-hover:text-primary transition-colors">{book.title}</h4>
                      <p className="text-[10px] text-slate-400 font-bold">{book.author}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Community Quote Banner */}
            <div className="bg-[#111827] rounded-[40px] p-10 md:p-14 text-white relative overflow-hidden">
               <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                  <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-white/10 shrink-0">
                    <img src="https://i.pravatar.cc/150?u=student1" className="w-full h-full object-cover" />
                  </div>
                  <div className="space-y-4">
                    <div className="flex gap-1 text-amber-400">
                      {[...Array(5)].map((_, i) => <Star key={i} size={14} className="fill-amber-400" />)}
                    </div>
                    <p className="text-lg font-medium italic text-slate-300 leading-relaxed">
                      "This book changed how I approach internships. The section on networking via LinkedIn was particularly helpful for my final year prep."
                    </p>
                    <p className="text-xs font-black uppercase tracking-widest text-primary">— Sothea R., RUPP Alumni</p>
                  </div>
               </div>
               <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
