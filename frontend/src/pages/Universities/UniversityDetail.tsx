import React, { useState, useEffect } from 'react'
import { Star, ChevronRight, ChevronLeft, FileText, Download, Eye, MapPin, GraduationCap, Users, BookOpen, Loader2 } from 'lucide-react'
import { useParams } from 'react-router-dom'
import { getUniversityDetail } from '@/api/authApi'

interface Doc {
  id: number;
  title: string;
  category: { name: string };
  user: { name: string, avatar: string | null };
  file_path: string;
  views?: string;
  downloads?: string;
}

export default function UniversityDetail() {
  const { id } = useParams()
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<any>(null)

  useEffect(() => {
    fetchUniversity()
  }, [id])

  const fetchUniversity = async () => {
    setLoading(true)
    try {
      if (id) {
        const res = await getUniversityDetail(id)
        setData(res)
      }
    } catch (error) {
      console.error('Failed to fetch university', error)
      // Fallback to mock data logic handled in render
    } finally {
      setLoading(false)
    }
  }

  // Fallback / Default values
  const universityInfo = data?.university || {
    name: id === '1' ? 'Royal University of Phnom Penh' : 'Institute of Technology of Cambodia',
    location: 'Phnom Penh, Cambodia',
    students_count: '25,000+',
    documents_count: '12.4k',
    courses: '120+',
    rating: 4.8,
    image: id === '1'
      ? 'https://images.unsplash.com/photo-1541339907198-e087563f0283?auto=format&fit=crop&q=80&w=1200'
      : 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80&w=1200'
  }

  const categories = data?.categories || [
    { name: 'Exam Papers', icon: '📝', color: 'bg-teal-50', count: '1,200+ Files' },
    { name: 'Lecture Notes', icon: '📚', color: 'bg-purple-50', count: '3,450+ Files' },
    { name: 'Summaries', icon: '📋', color: 'bg-blue-50', count: '890+ Files' },
    { name: 'Assignments', icon: '✍️', color: 'bg-teal-50', count: '2,100+ Files' },
  ]

  const documents = data?.documents?.map((d: any) => ({
    id: d.id,
    title: d.title,
    category: d.category?.name || 'General',
    views: '0',
    downloads: '0',
    contributor: d.user?.name || 'Anonymous',
    contributorImage: d.user?.avatar || `https://i.pravatar.cc/150?u=${d.user?.id}`
  })) || [
    { id: 1, title: 'Introduction to Computer Science - Final Exam 2023', category: 'Exam Papers', views: '1.2k', downloads: '450', contributor: 'Sokha Meng', contributorImage: 'https://i.pravatar.cc/150?u=1' },
    { id: 2, title: 'Advanced Calculus Lecture Notes - Week 1 to 12', category: 'Lecture Notes', views: '890', downloads: '230', contributor: 'Dara Sophea', contributorImage: 'https://i.pravatar.cc/150?u=2' },
    { id: 3, title: 'Database Systems Design - Course Project Summary', category: 'Summaries', views: '2.1k', downloads: '1.1k', contributor: 'Borith Keo', contributorImage: 'https://i.pravatar.cc/150?u=3' },
    { id: 4, title: 'Macroeconomics 101 - Past Year Questions & Answers', category: 'Exam Papers', views: '3.4k', downloads: '2.5k', contributor: 'Srey Leak', contributorImage: 'https://i.pravatar.cc/150?u=4' },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <Loader2 className="w-10 h-10 text-teal-500 animate-spin" />
      </div>
    )
  }

  return (
    <div className="bg-slate-50 min-h-screen font-sans">
      {/* ================= UNIVERSITY HERO SECTION ================= */}
      <div className="relative h-[450px] w-full overflow-hidden">
        <img src={universityInfo.image} alt={universityInfo.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-20">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                   <div className="bg-teal-500 text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-[0.2em] shadow-lg shadow-teal-500/20">Verified Campus</div>
                   <div className="flex items-center gap-1.5 text-amber-400 bg-white/10 backdrop-blur-xl px-4 py-1.5 rounded-full text-xs font-black border border-white/10">
                      <Star size={14} className="fill-amber-400" /> {universityInfo.rating}
                   </div>
                </div>
                <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-none">{universityInfo.name}</h1>
                <div className="flex flex-wrap items-center gap-8 text-slate-300 text-[13px] font-black uppercase tracking-widest">
                  <span className="flex items-center gap-2.5"><MapPin size={18} className="text-teal-400" /> {universityInfo.location}</span>
                  <span className="flex items-center gap-2.5"><Users size={18} className="text-teal-400" /> {universityInfo.students_count} Students</span>
                  <span className="flex items-center gap-2.5"><GraduationCap size={18} className="text-teal-400" /> {universityInfo.documents_count} Documents</span>
                </div>
              </div>

              <div className="flex gap-4">
                 <button className="bg-teal-500 hover:bg-teal-600 text-white px-10 py-5 rounded-[20px] font-black text-xs uppercase tracking-widest transition-all shadow-2xl shadow-teal-500/30 active:scale-95 hover:-translate-y-1">
                    Upload Material
                 </button>
                 <button className="bg-white/10 hover:bg-white/20 backdrop-blur-xl text-white border border-white/10 px-10 py-5 rounded-[20px] font-black text-xs uppercase tracking-widest transition-all active:scale-95 hover:-translate-y-1">
                    Follow Library
                 </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 -mt-28 relative z-20 mb-20">
           {[
             { label: 'Total Files', value: universityInfo.documents_count, icon: <FileText className="text-teal-500" /> },
             { label: 'Active Courses', value: universityInfo.courses || '120+', icon: <BookOpen className="text-teal-500" /> },
             { label: 'Weekly Views', value: '45.2k', icon: <Eye className="text-teal-500" /> },
             { label: 'Downloads', value: '12.8k', icon: <Download className="text-teal-500" /> }
           ].map((stat, i) => (
             <div key={i} className="bg-white p-8 rounded-[32px] shadow-2xl shadow-slate-200/60 border border-slate-100 flex items-center gap-5 transition-transform hover:-translate-y-1">
                <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center shadow-inner">{stat.icon}</div>
                <div>
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                   <p className="text-2xl font-black text-slate-900 leading-none">{stat.value}</p>
                </div>
             </div>
           ))}
        </div>

        {/* Categories Section */}
        <div className="mb-24">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Browse by Category</h2>
            <button className="text-teal-500 text-xs font-black uppercase tracking-widest hover:underline decoration-2 underline-offset-8">View All</button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {categories.map((cat: any, idx: number) => (
              <div key={idx} className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all cursor-pointer group text-center">
                <div className={`w-20 h-20 ${cat.color} rounded-[28px] flex items-center justify-center text-4xl mb-6 mx-auto group-hover:scale-110 transition-transform shadow-sm`}>
                  {cat.icon}
                </div>
                <h3 className="font-black text-slate-900 text-base mb-2">{cat.name}</h3>
                <p className="text-[11px] text-slate-400 font-bold tracking-[0.15em] uppercase">{cat.count}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Highly Recommended Documents Section */}
        <div className="mb-24">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Highly Recommended</h2>
            <div className="flex gap-3">
               <button className="p-3 bg-white rounded-2xl shadow-sm border border-slate-100 text-slate-400 hover:text-teal-500 hover:shadow-md transition-all active:scale-95"><ChevronLeft size={22} /></button>
               <button className="p-3 bg-white rounded-2xl shadow-sm border border-slate-100 text-slate-400 hover:text-teal-500 hover:shadow-md transition-all active:scale-95"><ChevronRight size={22} /></button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {documents.map((doc: any) => (
              <div key={doc.id} className="bg-white rounded-[40px] overflow-hidden shadow-sm border border-slate-100 group flex flex-col hover:shadow-2xl transition-all hover:-translate-y-1">
                <div className="relative h-56 bg-slate-50 flex items-center justify-center overflow-hidden">
                  <FileText size={72} className="text-slate-200 group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute top-5 left-5 bg-white/90 backdrop-blur-xl px-4 py-1.5 rounded-full text-[10px] font-black text-teal-600 uppercase tracking-widest z-20 shadow-sm border border-slate-100">
                    {doc.category}
                  </div>
                  <div className="absolute inset-0 bg-teal-500/0 group-hover:bg-teal-500/5 transition-colors" />
                </div>
                <div className="p-8 flex flex-col flex-grow">
                  <h3 className="font-black text-slate-800 mb-3 line-clamp-2 leading-tight h-12 group-hover:text-teal-500 transition-colors text-lg">{doc.title}</h3>
                  <div className="flex items-center gap-5 text-[11px] text-slate-400 font-black mb-8 uppercase tracking-[0.1em]">
                    <span className="flex items-center gap-1.5"><Eye size={16} className="text-teal-500" /> {doc.views}</span>
                    <span className="flex items-center gap-1.5"><Download size={16} className="text-teal-500" /> {doc.downloads}</span>
                  </div>
                  <div className="mt-auto pt-6 border-t border-slate-50 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img src={doc.contributorImage} className="w-8 h-8 rounded-full border-2 border-slate-100" alt={doc.contributor} />
                      <span className="text-[11px] font-black text-slate-600 uppercase tracking-widest">{doc.contributor}</span>
                    </div>
                    <button className="bg-slate-50 text-slate-400 p-3 rounded-2xl hover:bg-teal-500 hover:text-white transition-all shadow-sm">
                      <Download size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Promo CTA Banner */}
        <div className="bg-[#0f172a] rounded-[64px] p-16 md:p-24 text-center relative overflow-hidden mb-24 shadow-[0_40px_100px_-20px_rgba(15,23,42,0.4)]">
          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
          <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 blur-[120px] rounded-full" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/10 blur-[120px] rounded-full" />

          <div className="relative z-10 max-w-3xl mx-auto space-y-8">
            <h2 className="text-4xl md:text-6xl font-black text-white leading-tight tracking-tighter">Empowering Students Through <span className="text-teal-400">Knowledge Sharing.</span></h2>
            <p className="text-slate-400 text-base md:text-lg leading-relaxed font-medium">
              Join thousands of {universityInfo.name} students sharing their best study resources. Together, we make learning accessible for everyone.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-5 pt-6">
               <button className="w-full sm:w-auto bg-teal-500 hover:bg-teal-600 text-white font-black uppercase tracking-widest text-xs px-12 py-5 rounded-[20px] transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-teal-500/40">
                 Browse Latest Notes
               </button>
               <button className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white border border-white/10 font-black uppercase tracking-widest text-xs px-12 py-5 rounded-[20px] transition-all hover:scale-105 active:scale-95">
                 Join Community
               </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
