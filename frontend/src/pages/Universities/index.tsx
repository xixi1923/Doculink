import React, { useState } from 'react'
import { MapPin, GraduationCap, ChevronDown, Star, ArrowUpRight, Search, Filter } from 'lucide-react'
import { Link } from 'react-router-dom'

// ================= TYPES & INTERFACES =================
interface UniversityItem {
  id: number;
  name: string;
  location: string;
  documents: string;
  rating: number;
  image: string;
  isFeatured?: boolean;
}

interface ContributorItem {
  id: number;
  name: string;
  uploads: number;
  avatar: string;
}

// Mock Database
const UNIVERSITIES: UniversityItem[] = [
  { id: 1, name: 'Royal University of Phnom Penh', location: 'PHNOM PENH', documents: '12K', rating: 4.8, image: 'https://images.unsplash.com/photo-1541339907198-e087563f0283?auto=format&fit=crop&q=80&w=400', isFeatured: true },
  { id: 2, name: 'Institute of Technology of Cambodia', location: 'PHNOM PENH', documents: '8K', rating: 4.7, image: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80&w=400', isFeatured: true },
  { id: 3, name: 'National University of Management', location: 'PHNOM PENH', documents: '5K', rating: 4.5, image: 'https://images.unsplash.com/photo-1523050853063-bd75160b3324?auto=format&fit=crop&q=80&w=400' },
  { id: 4, name: 'Paññāsāstra University of Cambodia', location: 'PHNOM PENH', documents: '6K', rating: 4.6, image: 'https://images.unsplash.com/photo-1492538368677-f6e0afe31dcc?auto=format&fit=crop&q=80&w=400' },
  { id: 5, name: 'Zaman University', location: 'PHNOM PENH', documents: '3K', rating: 4.4, image: 'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?auto=format&fit=crop&q=80&w=400' },
  { id: 6, name: 'Norton University', location: 'PHNOM PENH', documents: '4K', rating: 4.3, image: 'https://images.unsplash.com/photo-1519452635265-7b1fbfd1e4e0?auto=format&fit=crop&q=80&w=400' }
]

const CONTRIBUTORS: ContributorItem[] = [
  { id: 1, name: 'Arun Vatt', uploads: 450, avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120' },
  { id: 2, name: 'Srey Leak', uploads: 380, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120' },
  { id: 3, name: 'Norith Chan', uploads: 290, avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=120' },
  { id: 4, name: 'Piseth Keo', uploads: 210, avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=120' },
  { id: 5, name: 'Chitra Hour', uploads: 185, avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=120' },
  { id: 6, name: 'Dara Sam', uploads: 140, avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=120' }
]

export default function Universities(): React.JSX.Element {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredUniversities = UNIVERSITIES.filter(uni =>
    uni.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const featuredUniversities = UNIVERSITIES.filter(uni => uni.isFeatured)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-slate-800 font-sans selection:bg-teal-500 selection:text-white">

      {/* ================= PREMIUM BRAND HERO HEADER ================= */}
      <div className="bg-[#0b1329] rounded-[32px] p-8 md:p-14 mb-12 relative overflow-hidden text-center shadow-xl shadow-slate-950/10">
        <div className="relative z-10 max-w-2xl mx-auto space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight">
              Discover Your <span className="text-teal-400 italic font-serif font-normal">Campus Hub</span>
            </h1>
            <p className="text-slate-400 text-xs md:text-sm max-w-md mx-auto font-normal leading-relaxed">
              Explore shared lecture summaries and academic materials from top Cambodian institutions.
            </p>
          </div>

          {/* Premium Search Bar */}
          <div className="relative max-w-lg mx-auto group">
            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-slate-500 group-focus-within:text-teal-400 transition-colors">
              <Search size={18} />
            </div>
            <input
              type="text"
              placeholder="Search your university..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500/50 transition-all placeholder:text-slate-500"
            />
          </div>

          {/* Inline Pills Filter row component */}
          <div className="flex flex-wrap justify-center gap-2">
            {['All Cities', 'Top Rated', 'Featured', 'Newest'].map((filter) => (
              <button
                key={filter}
                className="px-3.5 py-1.5 bg-white/5 border border-white/10 rounded-full text-white text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 hover:bg-white/10 hover:border-teal-500/40 transition-all"
              >
                {filter} <ChevronDown size={11} className="text-slate-400" />
              </button>
            ))}
          </div>
        </div>

        {/* Radial blur ambient background flares */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-sky-500/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-500/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl" />
      </div>

      {/* ================= FEATURED UNIVERSITIES ================= */}
      {!searchQuery && (
        <div className="mb-16">
          <div className="flex items-center gap-2 mb-6 px-1">
             <div className="w-1.5 h-6 bg-teal-500 rounded-full" />
             <h2 className="text-lg font-black text-slate-900 tracking-tight">Featured for You</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {featuredUniversities.map(uni => (
              <Link to={`/universities/${uni.id}`} key={uni.id} className="relative h-64 rounded-[32px] overflow-hidden group shadow-lg">
                <img src={uni.image} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={uni.name} />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                   <span className="bg-teal-500 text-white text-[9px] font-black px-2 py-1 rounded-md uppercase tracking-widest mb-2 inline-block">Featured</span>
                   <h3 className="text-white text-xl font-black leading-tight mb-2">{uni.name}</h3>
                   <div className="flex items-center gap-4 text-slate-300 text-[11px] font-bold">
                      <span className="flex items-center gap-1"><MapPin size={12} /> {uni.location}</span>
                      <span className="flex items-center gap-1"><GraduationCap size={12} /> {uni.documents} Documents</span>
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
              {searchQuery ? `Search results for "${searchQuery}"` : 'Explore All Universities'}
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
                  src={uni.image}
                  alt={uni.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-xl text-[10px] font-black text-slate-800 flex items-center gap-1 shadow-sm border border-slate-100">
                  <Star size={11} className="fill-amber-400 text-amber-400" /> {uni.rating}
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
                    <span>{uni.documents}</span>
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
            {CONTRIBUTORS.map((contributor: ContributorItem) => (
              <div
                key={contributor.id}
                className="bg-white/5 p-4 rounded-[24px] border border-white/5 text-center group cursor-pointer hover:bg-white/10 transition-all"
              >
                <div className="w-14 h-14 rounded-2xl overflow-hidden mx-auto mb-3 border-2 border-white/10 group-hover:border-teal-500 transition-all">
                  <img src={contributor.avatar} alt={contributor.name} className="w-full h-full object-cover" />
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