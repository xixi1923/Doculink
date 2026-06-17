import { Star, ChevronRight, ChevronLeft, FileText, Download, Eye, MapPin, GraduationCap, Users, BookOpen } from 'lucide-react'
import { useParams } from 'react-router-dom'

const CATEGORIES = [
  { name: 'Exam Papers', icon: '📝', color: 'bg-teal-50', count: '1,200+ Files' },
  { name: 'Lecture Notes', icon: '📚', color: 'bg-purple-50', count: '3,450+ Files' },
  { name: 'Summaries', icon: '📋', color: 'bg-blue-50', count: '890+ Files' },
  { name: 'Assignments', icon: '✍️', color: 'bg-teal-50', count: '2,100+ Files' },
  { name: 'Thesis', icon: '🎓', color: 'bg-orange-50', count: '450+ Files' },
  { name: 'Presentations', icon: '💻', color: 'bg-purple-50', count: '670+ Files' },
  { name: 'Practicals', icon: '🧪', color: 'bg-blue-50', count: '320+ Files' },
  { name: 'Exercises', icon: '🔢', color: 'bg-teal-50', count: '1,500+ Files' },
]

const DOCUMENTS = [
  { id: 1, title: 'Introduction to Computer Science - Final Exam 2023', category: 'Exam Papers', type: 'PDF', views: '1.2k', downloads: '450', contributor: 'Sokha Meng', image: 'https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&q=80&w=400', contributorImage: 'https://i.pravatar.cc/150?u=1' },
  { id: 2, title: 'Advanced Calculus Lecture Notes - Week 1 to 12', category: 'Lecture Notes', type: 'PDF', views: '890', downloads: '230', contributor: 'Dara Sophea', image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=400', contributorImage: 'https://i.pravatar.cc/150?u=2' },
  { id: 3, title: 'Database Systems Design - Course Project Summary', category: 'Summaries', type: 'DOCX', views: '2.1k', downloads: '1.1k', contributor: 'Borith Keo', image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=400', contributorImage: 'https://i.pravatar.cc/150?u=3' },
  { id: 4, title: 'Macroeconomics 101 - Past Year Questions & Answers', category: 'Exam Papers', type: 'PDF', views: '3.4k', downloads: '2.5k', contributor: 'Srey Leak', image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=400', contributorImage: 'https://i.pravatar.cc/150?u=4' },
]

export default function UniversityDetail() {
  const { id } = useParams()

  // Mock University Data based on ID or fallback
  const universityInfo = {
    name: id === '1' ? 'Royal University of Phnom Penh' : 'Institute of Technology of Cambodia',
    location: 'Phnom Penh, Cambodia',
    students: '25,000+',
    documents: '12.4k',
    courses: '120+',
    rating: 4.8,
    image: id === '1'
      ? 'https://images.unsplash.com/photo-1541339907198-e087563f0283?auto=format&fit=crop&q=80&w=1200'
      : 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80&w=1200'
  }

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* ================= UNIVERSITY HERO SECTION ================= */}
      <div className="relative h-[400px] w-full overflow-hidden">
        <img src={universityInfo.image} alt={universityInfo.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                   <div className="bg-teal-500 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-[0.2em]">Verified Campus</div>
                   <div className="flex items-center gap-1 text-amber-400 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold border border-white/10">
                      <Star size={14} className="fill-amber-400" /> {universityInfo.rating}
                   </div>
                </div>
                <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight">{universityInfo.name}</h1>
                <div className="flex flex-wrap items-center gap-6 text-slate-300 text-sm font-medium">
                  <span className="flex items-center gap-2"><MapPin size={18} className="text-teal-400" /> {universityInfo.location}</span>
                  <span className="flex items-center gap-2"><Users size={18} className="text-teal-400" /> {universityInfo.students} Students</span>
                  <span className="flex items-center gap-2"><GraduationCap size={18} className="text-teal-400" /> {universityInfo.documents} Documents</span>
                </div>
              </div>

              <div className="flex gap-4">
                 <button className="bg-teal-500 hover:bg-teal-600 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-teal-500/20 active:scale-95">
                    Upload Material
                 </button>
                 <button className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/10 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all active:scale-95">
                    Follow Library
                 </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 -mt-24 relative z-20 mb-16">
           {[
             { label: 'Total Files', value: universityInfo.documents, icon: <FileText className="text-teal-500" /> },
             { label: 'Active Courses', value: universityInfo.courses, icon: <BookOpen className="text-teal-500" /> },
             { label: 'Weekly Views', value: '45.2k', icon: <Eye className="text-teal-500" /> },
             { label: 'Downloads', value: '12.8k', icon: <Download className="text-teal-500" /> }
           ].map((stat, i) => (
             <div key={i} className="bg-white p-6 rounded-[24px] shadow-xl shadow-slate-200/50 border border-slate-100 flex items-center gap-4">
                <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center">{stat.icon}</div>
                <div>
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                   <p className="text-xl font-black text-slate-900">{stat.value}</p>
                </div>
             </div>
           ))}
        </div>

        {/* Categories Section */}
        <div className="mb-20">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Browse by Category</h2>
            <button className="text-teal-500 text-xs font-black uppercase tracking-widest hover:underline">View All</button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {CATEGORIES.map((cat, idx) => (
              <div key={idx} className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer group text-center">
                <div className={`w-16 h-16 ${cat.color} rounded-[24px] flex items-center justify-center text-3xl mb-4 mx-auto group-hover:scale-110 transition-transform`}>
                  {cat.icon}
                </div>
                <h3 className="font-black text-slate-900 text-sm mb-1">{cat.name}</h3>
                <p className="text-[10px] text-slate-400 font-bold tracking-widest uppercase">{cat.count}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Highly Recommended Documents Section */}
        <div className="mb-20">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Highly Recommended</h2>
            <div className="flex gap-2">
               <button className="p-2 bg-white rounded-xl shadow-sm border border-slate-100 text-slate-400 hover:text-teal-500"><ChevronLeft size={20} /></button>
               <button className="p-2 bg-white rounded-xl shadow-sm border border-slate-100 text-slate-400 hover:text-teal-500"><ChevronRight size={20} /></button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {DOCUMENTS.map((doc) => (
              <div key={doc.id} className="bg-white rounded-[32px] overflow-hidden shadow-sm border border-slate-100 group flex flex-col hover:shadow-xl transition-all">
                <div className="relative h-52 bg-slate-50 flex items-center justify-center overflow-hidden">
                  <FileText size={64} className="text-slate-200 group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[9px] font-black text-teal-600 uppercase tracking-widest z-20 shadow-sm border border-slate-100">
                    {doc.category}
                  </div>
                  <div className="absolute inset-0 bg-teal-500/0 group-hover:bg-teal-500/5 transition-colors" />
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="font-black text-slate-800 mb-2 line-clamp-2 leading-tight h-10 group-hover:text-teal-500 transition-colors">{doc.title}</h3>
                  <div className="flex items-center gap-4 text-[10px] text-slate-400 font-bold mb-6 uppercase tracking-wider">
                    <span className="flex items-center gap-1"><Eye size={14} className="text-teal-500" /> {doc.views}</span>
                    <span className="flex items-center gap-1"><Download size={14} className="text-teal-500" /> {doc.downloads}</span>
                  </div>
                  <div className="mt-auto pt-4 border-t border-slate-50 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <img src={doc.contributorImage} className="w-6 h-6 rounded-full" alt={doc.contributor} />
                      <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">{doc.contributor}</span>
                    </div>
                    <button className="bg-slate-50 text-slate-400 p-2 rounded-xl hover:bg-teal-500 hover:text-white transition-all">
                      <Download size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Promo CTA Banner */}
        <div className="bg-[#0f172a] rounded-[48px] p-12 md:p-20 text-center relative overflow-hidden mb-20 shadow-2xl">
          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <h2 className="text-3xl md:text-5xl font-black text-white leading-tight">Empowering Students Through <span className="text-teal-400">Knowledge Sharing.</span></h2>
            <p className="text-slate-400 text-sm md:text-base leading-relaxed">
              Join thousands of {universityInfo.name} students sharing their best study resources. Together, we make learning accessible for everyone.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
               <button className="w-full sm:w-auto bg-teal-500 hover:bg-teal-600 text-white font-black uppercase tracking-widest text-[10px] px-10 py-4 rounded-2xl transition-all hover:scale-105 active:scale-95 shadow-xl shadow-teal-500/20">
                 Browse Latest Notes
               </button>
               <button className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white border border-white/10 font-black uppercase tracking-widest text-[10px] px-10 py-4 rounded-2xl transition-all">
                 Join Community
               </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
