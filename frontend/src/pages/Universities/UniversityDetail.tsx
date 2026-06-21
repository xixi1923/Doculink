import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  Building2,
  MapPin,
  Globe,
  FileText,
  Users,
  ArrowRight,
  ShieldCheck,
  Upload,
  BookOpen,
  Download,
  ChevronRight
} from 'lucide-react'
import api from '@/api/authApi'

export default function UniversityDetail() {
  const { id } = useParams()
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get(`/universities/${id}`)
      .then(res => setData(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
       <div className="animate-spin w-10 h-10 border-4 border-teal-500 border-t-transparent rounded-full"></div>
    </div>
  )

  if (!data) return <div className="p-20 text-center text-slate-500">University not found.</div>

  const { university, documents, stats } = data

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 selection:bg-teal-500/30">

      {/* ================= HEADER SECTION ================= */}
      <div className="relative h-[400px] w-full overflow-hidden">
        <img
          src={university.cover_image || 'https://images.unsplash.com/photo-1541339907198-e08756c83f2d?auto=format&fit=crop&q=80&w=1000'}
          className="absolute inset-0 w-full h-full object-cover"
          alt={university.name}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

        <div className="absolute inset-x-0 bottom-0 pb-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex flex-col md:flex-row items-end justify-between gap-8">
              <div className="space-y-4 max-w-4xl">
                 <div className="flex items-center gap-4">
                    <div className="w-20 h-20 bg-white p-2 rounded-2xl shadow-2xl border-4 border-white/10 flex items-center justify-center">
                       {university.logo ? <img src={university.logo} className="w-full h-full object-contain" /> : <Building2 className="text-teal-600" size={32} />}
                    </div>
                    <div className="bg-teal-500 text-white text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-lg flex items-center gap-1.5 shadow-lg shadow-teal-500/20">
                      <ShieldCheck size={12} /> Verified Campus
                    </div>
                 </div>

                 <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-tight uppercase">
                    {university.name}
                 </h1>

                 <div className="flex flex-wrap items-center gap-6 text-slate-300 text-[11px] font-black uppercase tracking-[0.2em]">
                    <span className="flex items-center gap-2"><MapPin size={16} className="text-teal-400" /> {university.location}</span>
                    {university.website && (
                      <a href={university.website} target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-teal-400 transition-colors">
                        <Globe size={16} className="text-teal-400" /> Institution Website
                      </a>
                    )}
                 </div>
              </div>

              <div className="flex gap-4 mb-2">
                 <Link to="/upload" className="bg-teal-500 hover:bg-teal-600 text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl shadow-teal-500/20 flex items-center gap-2 group">
                   Upload Material <Upload size={16} className="group-hover:-translate-y-0.5 transition-transform" />
                 </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================= STATS GRID ================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 -mt-10 relative z-20">
         <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {[
              { label: 'Total Documents', value: stats.total_documents, icon: FileText },
              { label: 'Total Contributors', value: stats.total_contributors, icon: Users },
              { label: 'Total Downloads', value: stats.total_downloads, icon: Download },
            ].map((stat, i) => (
              <div key={i} className="bg-white dark:bg-slate-900 rounded-[32px] p-6 md:p-8 shadow-2xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 flex items-center gap-5 group hover:border-teal-500/30 transition-all">
                 <div className="w-12 h-12 rounded-2xl bg-teal-50 dark:bg-teal-900/20 flex items-center justify-center text-teal-600 group-hover:scale-110 transition-transform">
                    <stat.icon size={24} />
                 </div>
                 <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                    <p className="text-xl md:text-2xl font-black text-slate-900 dark:text-white leading-none">{stat.value}</p>
                 </div>
              </div>
            ))}
         </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Repository Column */}
        <div className="lg:col-span-2 space-y-12">
           <section>
              <div className="flex items-center justify-between mb-8">
                 <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">University Repository</h2>
                 <Link to="/search" className="text-[10px] font-black text-teal-600 uppercase tracking-[0.2em] hover:text-teal-700 transition-colors flex items-center gap-1">
                   Search Filter <ChevronRight size={14} />
                 </Link>
              </div>

              <div className="space-y-4">
                 {documents && documents.length > 0 ? documents.map((doc: any) => (
                    <Link to={`/documents/${doc.id}`} key={doc.id} className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 flex items-center gap-5 hover:border-teal-500/30 transition-all group shadow-sm">
                       <div className="w-14 h-14 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-teal-600 shrink-0">
                          <FileText size={28} />
                       </div>
                       <div className="flex-grow min-w-0">
                          <h4 className="font-bold text-slate-900 dark:text-white truncate group-hover:text-teal-600 transition-colors">{doc.title}</h4>
                          <p className="text-[11px] text-slate-400 font-medium mt-1">
                             By {doc.user?.name} • {doc.category?.name} • {doc.download_count || 0} Downloads
                          </p>
                       </div>
                       <ArrowRight size={18} className="text-slate-300 group-hover:text-teal-600 group-hover:translate-x-1 transition-all" />
                    </Link>
                 )) : (
                    <div className="p-12 text-center bg-slate-50 dark:bg-slate-900 rounded-[32px] border border-dashed border-slate-200 dark:border-slate-800">
                       <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No documents uploaded for this institution yet.</p>
                    </div>
                 )}
              </div>
           </section>
        </div>

        {/* Sidebar info */}
        <aside className="space-y-8">
           <div className="bg-white dark:bg-slate-900 rounded-[32px] border border-slate-100 dark:border-slate-800 p-8 shadow-sm">
              <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest mb-4">About {university.short_name}</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-6">
                {university.description || "No institution description provided. Access official course materials, student-contributed notes, and research archives for this institution."}
              </p>
              <div className="w-full h-px bg-slate-100 dark:bg-slate-800 mb-6" />
              <div className="flex items-center justify-between text-xs">
                 <span className="text-slate-400 font-bold">Location</span>
                 <span className="font-black text-slate-900 dark:text-white">{university.location}</span>
              </div>
           </div>

           <div className="bg-[#0b1329] rounded-[32px] p-8 text-white relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/10 rounded-full blur-2xl"></div>
             <h3 className="text-lg font-black mb-4 tracking-tight">Institution Contributor?</h3>
             <p className="text-slate-400 text-xs leading-relaxed mb-6 font-light">
               Help your fellow peers from {university.short_name} by sharing your lecture notes and exam preparations.
             </p>
             <Link to="/upload" className="inline-block px-8 py-3 bg-white text-slate-950 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-teal-400 transition-all">
               Contribute Now
             </Link>
           </div>
        </aside>
      </div>

    </div>
  )
}
