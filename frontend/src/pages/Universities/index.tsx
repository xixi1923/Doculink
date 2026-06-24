import React, { useState, useEffect } from 'react'
import { MapPin, GraduationCap, Star, ArrowUpRight, Search, Filter, Loader2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import api from '@/api/authApi'

// ================= TYPES & INTERFACES =================
interface UniversityItem {
  id: number;
  name: string;
  location: string;
  documents_count: number;
  rating?: number;
  image?: string;
  cover_image?: string;
  logo?: string;
  is_featured?: boolean;
}

interface ContributorItem {
  id: number;
  name: string;
  uploads: number;
  avatar: string;
}

export default function Universities(): React.JSX.Element {
  const [searchQuery, setSearchQuery] = useState('')
  const [universities, setUniversities] = useState<UniversityItem[]>([])
  const [contributors, setContributors] = useState<ContributorItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const [uniRes, contRes] = await Promise.all([
          api.get('/universities'),
          api.get('/stats/top-contributors')
        ])
        setUniversities(uniRes.data)
        setContributors(contRes.data)
      } catch (err) {
        console.error('Failed to fetch university data', err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const filteredUniversities = universities.filter(uni =>
    uni.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const featuredUniversities = universities.filter(uni => uni.is_featured).slice(0, 2)
  // Fallback if no featured universities marked
  const displayFeatured = featuredUniversities.length > 0
    ? featuredUniversities
    : universities.slice(0, 2)

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <Loader2 className="animate-spin text-teal-600 mb-4" size={32} />
        <p className="text-xs text-slate-400 font-black uppercase tracking-widest">Loading Institution Matrix...</p>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-slate-800 font-sans selection:bg-teal-500 selection:text-white">

      {/* ================= PREMIUM BRAND HERO HEADER ================= */}
      <div className="bg-[#0b1329] rounded-[32px] p-8 md:p-14 mb-12 relative overflow-hidden text-center shadow-xl shadow-slate-950/10">
        <div className="relative z-10 max-w-2xl mx-auto space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight">
              Discover Your <span className="text-teal-400 italic font-serif font-normal">Education Hub</span>
            </h1>
            <p className="text-slate-400 text-xs md:text-sm max-w-md mx-auto font-normal leading-relaxed">
              Explore shared lecture summaries, notes, and academic materials from top Cambodian schools, high schools, and universities.
            </p>
          </div>

          {/* Premium Search Bar */}
          <div className="relative max-w-lg mx-auto group">
            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-slate-500 group-focus-within:text-teal-400 transition-colors">
              <Search size={18} />
            </div>
            <input
              type="text"
              placeholder="Search your school, high school or university..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500/50 transition-all placeholder:text-slate-500"
            />
          </div>
        </div>

        {/* Radial blur ambient background flares */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-sky-500/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-500/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl" />
      </div>

      {/* ================= FEATURED UNIVERSITIES ================= */}
      {!searchQuery && displayFeatured.length > 0 && (
        <div className="mb-16">
          <div className="flex items-center gap-2 mb-6 px-1">
             <div className="w-1.5 h-6 bg-teal-500 rounded-full" />
             <h2 className="text-lg font-black text-slate-900 tracking-tight">Featured for You</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {displayFeatured.map(uni => (
              <Link to={`/universities/${uni.id}`} key={uni.id} className="relative h-64 rounded-[32px] overflow-hidden group shadow-lg">
                <img
                  src={uni.cover_image || 'https://images.unsplash.com/photo-1541339907198-e087563f0283?auto=format&fit=crop&q=80&w=600'}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  alt={uni.name}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                   <span className="bg-teal-500 text-white text-[9px] font-black px-2 py-1 rounded-md uppercase tracking-widest mb-2 inline-block">Featured</span>
                   <h3 className="text-white text-xl font-black leading-tight mb-2">{uni.name}</h3>
                   <div className="flex items-center gap-4 text-slate-300 text-[11px] font-bold">
                      <span className="flex items-center gap-1"><MapPin size={12} /> {uni.location}</span>
                      <span className="flex items-center gap-1"><GraduationCap size={12} /> {uni.documents_count} Documents</span>
                   </div>
                </div>
                <div className="absolute top-6 right-6 bg-white/20 backdrop-blur-md text-white p-2 rounded-xl border border-white/20 opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
                   <ArrowUpRight size={20} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* ================= UNIVERSITIES CARDS SYSTEM ================= */}
      <div className="mb-12">
        <div className="flex items-end justify-between mb-6 px-1">
          <div>
            <h2 className="text-base font-black text-slate-900 tracking-tight">
              {searchQuery ? `Search results for "${searchQuery}"` : 'Explore All Educational Institutions'}
            </h2>
            <p className="text-[11px] text-slate-400 font-medium">
              {filteredUniversities.length} Institutions found
            </p>
          </div>
          <button className="text-[11px] font-bold text-teal-500 hover:text-teal-600 transition-colors flex items-center gap-0.5 group">
            <Filter size={12} /> Sort & Filter
          </button>
        </div>

        {/* Grid Engine */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredUniversities.map((uni: UniversityItem) => (
            <div
              key={uni.id}
              className="bg-white rounded-[28px] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden group"
            >
              <div className="h-48 relative overflow-hidden bg-slate-50">
                <img
                  src={uni.cover_image || 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80&w=400'}
                  alt={uni.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-xl text-[10px] font-black text-slate-800 flex items-center gap-1 shadow-sm border border-slate-100">
                  <Star size={11} className="fill-amber-400 text-amber-400" /> {uni.rating || '4.5'}
                </div>
              </div>

              <div className="p-6">
                <h3 className="font-black text-sm text-slate-950 mb-3 group-hover:text-teal-500 transition-colors">
                  <Link to={`/universities/${uni.id}`}>{uni.name}</Link>
                </h3>

                <div className="flex items-center gap-4 text-slate-400 text-[10px] font-bold tracking-wide uppercase mb-6">
                  <div className="flex items-center gap-1">
                    <MapPin size={12} className="text-teal-500" />
                    <span>{uni.location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <GraduationCap size={12} className="text-teal-500" />
                    <span>{uni.documents_count}</span>
                  </div>
                </div>

                <Link
                  to={`/universities/${uni.id}`}
                  className="flex items-center justify-center gap-2 w-full py-3 bg-slate-50 text-slate-900 rounded-2xl font-black text-[10px] uppercase tracking-widest border border-slate-100 group-hover:bg-teal-500 group-hover:text-white group-hover:border-transparent transition-all shadow-sm"
                >
                  Enter Library <ArrowUpRight size={14} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ================= CONTRIBUTORS SHELF SLIDER ================= */}
      <div className="bg-[#0f172a] rounded-[32px] p-8 mb-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h2 className="text-lg font-black text-white tracking-tight">Top Contributors</h2>
              <p className="text-slate-400 text-[11px] font-medium">Students and mentors sharing high-yield lecture resources.</p>
            </div>
            <button className="text-teal-400 text-[10px] font-black uppercase tracking-[0.2em] border-b border-teal-400/20 pb-0.5">Leaderboard</button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
            {contributors.map((contributor: ContributorItem) => (
              <div
                key={contributor.id}
                onClick={() => contributor.id && (window.location.href = `/user/${contributor.id}`)}
                className="bg-white/5 p-4 rounded-[24px] border border-white/5 text-center group cursor-pointer hover:bg-white/10 transition-all"
              >
                <div className="w-14 h-14 rounded-2xl overflow-hidden mx-auto mb-3 border-2 border-white/10 group-hover:border-teal-500 transition-all">
                  <img src={contributor.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(contributor.name)}&background=random`} alt={contributor.name} className="w-full h-full object-cover" />
                </div>
                <p className="font-bold text-white text-xs truncate mb-1">{contributor.name}</p>
                <div className="bg-teal-500/10 text-teal-400 text-[9px] font-black py-1 px-2 rounded-full inline-block uppercase tracking-wider">
                  {contributor.uploads} Docs
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
