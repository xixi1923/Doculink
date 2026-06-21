import { useState, useEffect } from 'react'
import { Search, MapPin, Building2, FileText } from 'lucide-react'
import { Link } from 'react-router-dom'
import api from '@/api/authApi'

interface University {
  id: number;
  name: string;
  short_name: string;
  location: string;
  logo: string;
  cover_image: string;
  documents_count: number;
}

export default function Universities() {
  const [universities, setUniversities] = useState<University[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    api.get('/universities')
      .then(res => setUniversities(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }, [])

  const filteredUniversities = universities.filter(u =>
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.short_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.location.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 pb-20 selection:bg-teal-500/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">

        {/* ================= HERO HUB ================= */}
        <div className="bg-[#0b1329] rounded-[48px] p-10 md:p-20 relative overflow-hidden text-center shadow-2xl mb-12">
          <div className="relative z-10 max-w-4xl mx-auto space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-tight">
                Discover Your <span className="text-teal-400 italic">Education Hub</span>
              </h1>
              <p className="text-slate-400 text-sm md:text-base max-w-2xl mx-auto font-medium leading-relaxed">
                Explore shared lecture summaries, notes, and academic materials from top Cambodian institutions.
              </p>
            </div>

            <div className="relative max-w-2xl mx-auto group">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-teal-400 transition-colors" size={20} />
              <input
                type="text"
                placeholder="Search your school, high school or university..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-full py-5 pl-16 pr-6 text-white placeholder-slate-500 outline-none focus:border-teal-500/50 transition-all backdrop-blur-md text-sm"
              />
            </div>
          </div>

          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-teal-500/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-[120px]" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-[100px]" />
        </div>

        {/* ================= UNIVERSITY GRID ================= */}
        <div className="mb-8 flex items-center gap-3">
          <div className="w-1 h-5 bg-teal-500 rounded-full"></div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Browse Institutions</h2>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="h-80 rounded-[40px] bg-slate-100 dark:bg-slate-900 animate-pulse" />
            <div className="h-80 rounded-[40px] bg-slate-100 dark:bg-slate-900 animate-pulse" />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {filteredUniversities.map((uni) => (
              <Link
                key={uni.id}
                to={`/universities/${uni.id}`}
                className="group relative h-[380px] rounded-[40px] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500"
              >
                <img
                  src={uni.cover_image || 'https://images.unsplash.com/photo-1541339907198-e08756c83f2d?auto=format&fit=crop&q=80&w=1000'}
                  alt={uni.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                <div className="absolute inset-x-0 bottom-0 p-8 flex flex-col justify-end">
                   <h3 className="text-2xl md:text-3xl font-black text-white mb-2 tracking-tight group-hover:text-teal-400 transition-colors">
                     {uni.name} ({uni.short_name})
                   </h3>

                   <div className="flex flex-wrap items-center gap-4 text-slate-300 text-[10px] font-black uppercase tracking-widest">
                      <span className="flex items-center gap-1.5"><MapPin size={14} className="text-teal-400" /> {uni.location}</span>
                      <span className="flex items-center gap-1.5"><FileText size={14} className="text-teal-400" /> {uni.documents_count} Shared Documents</span>
                   </div>
                </div>
              </Link>
            ))}
          </div>
        )}

      </div>
    </div>
  )
}
