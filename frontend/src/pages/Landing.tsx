import React from 'react'
import { Link } from 'react-router-dom'
import {
  PlayCircle,
  Users,
  GraduationCap,
  BookOpen,
  CheckCircle2,
  ArrowRight,
  Award,
  FileText,
  Star
} from 'lucide-react'

// ================= TYPES & INTERFACES =================
interface StatItem {
  label: string;
  value: string;
}

interface FeatureItem {
  title: string;
  desc: string;
  icon: React.ComponentType<{ size: number | string; className?: string }>;
  gradient: string;
}

interface DocumentDeck {
  category: string;
  colors: string[];
}

interface WorkflowItem {
  text: string;
  desc: string;
}

interface TestimonialItem {
  quote: string;
  name: string;
  role: string;
  avatar: string;
}

// ================= MOCK DATABASE =================
const STATISTICS: StatItem[] = [
  { label: 'Active Users', value: '15K+' },
  { label: 'Success Rate', value: '75%' },
  { label: 'Total Documents', value: '35K+' },
  { label: 'Partner Schools', value: '26+' },
  { label: 'Verified Uploaders', value: '160+' },
]

const CORE_FEATURES: FeatureItem[] = [
  {
    title: 'Free Documents',
    desc: 'Access thousands of notes and exam preps from various subjects without any hidden costs.',
    icon: BookOpen,
    gradient: 'from-sky-500 to-sky-400'
  },
  {
    title: 'High Quality Content',
    desc: 'Our dedicated moderation team ensures that all uploaded documents meet strict educational standards.',
    icon: GraduationCap,
    gradient: 'from-teal-500 to-emerald-400'
  },
  {
    title: 'Community Driven',
    desc: 'Find reliable academic resources shared by qualified students and educators.',
    icon: Users,
    gradient: 'from-violet-500 to-indigo-400'
  },
]

const POPULAR_DECKS: DocumentDeck[] = [
  { category: "High School (Bac II Prep)", colors: ["bg-amber-500/10 text-amber-600 border-amber-500/20 dark:bg-amber-500/20 dark:text-amber-400 dark:border-amber-500/30", "bg-orange-500/10 text-orange-600 border-orange-500/20 dark:bg-orange-500/20 dark:text-orange-400 dark:border-orange-500/30", "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:bg-emerald-500/20 dark:text-emerald-400 dark:border-emerald-500/30", "bg-teal-500/10 text-teal-600 border-teal-500/20 dark:bg-teal-500/20 dark:text-teal-400 dark:border-teal-500/30"] },
  { category: "STEM Foundations", colors: ["bg-sky-500/10 text-sky-600 border-sky-500/20 dark:bg-sky-500/20 dark:text-sky-400 dark:border-sky-500/30", "bg-indigo-500/10 text-indigo-600 border-indigo-500/20 dark:bg-indigo-500/20 dark:text-indigo-400 dark:border-indigo-500/30", "bg-violet-500/10 text-violet-600 border-violet-500/20 dark:bg-violet-500/20 dark:text-violet-400 dark:border-violet-500/30", "bg-purple-500/10 text-purple-600 border-purple-500/20 dark:bg-purple-500/20 dark:text-purple-400 dark:border-purple-500/30"] }
]

const WORKFLOW_STEPS: WorkflowItem[] = [
  { text: 'Search by School & Major', desc: 'Filter documents directly matching your campus.' },
  { text: 'Find Trusted Contributors', desc: 'See materials uploaded by verified peers and instructors.' },
  { text: 'Fast PDF/DOCX Exports', desc: 'One-click clean layouts ready to read anywhere.' },
  { text: 'Verified Study Decks', desc: 'Materials vetted by active community moderators.' }
]

const TESTIMONIALS: TestimonialItem[] = [
  {
    quote: "DocuLink completely shifted the way I prepare for exams. Finding structured summaries from older students at RUPP saved me weeks of manual referencing.",
    name: "Sokha Meng",
    role: "Computer Science Student, RUPP",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150"
  },
  {
    quote: "Uploading my math guides here allowed me to reach thousands of high schoolers across provinces. The community appreciation on this app is beautiful.",
    name: "Channi Vatt",
    role: "Top Contributor / Educator",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150"
  }
]

export default function Landing(): React.JSX.Element {
  return (
    <div className="overflow-x-hidden bg-slate-50/50 dark:bg-gray-950 text-slate-800 dark:text-gray-200 font-sans selection:bg-teal-500 selection:text-white transition-colors duration-300">

      {/* ================= HERO SECTION ================= */}
      <section className="bg-[#0b1329] text-white rounded-b-[40px] md:rounded-b-[64px] pt-12 pb-24 md:pb-32 relative overflow-hidden shadow-xl">
        {/* Soft Ambient Slow-Pulsing Lights */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-sky-500/10 rounded-full -translate-y-1/2 -translate-x-1/2 blur-3xl animate-pulse duration-[10s]" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-teal-500/10 rounded-full translate-y-1/3 translate-x-1/3 blur-3xl animate-pulse duration-[8s]" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center gap-12 relative z-10">

          {/* Animated Hero Left Block */}
          <div className="lg:w-1/2 space-y-6 text-center lg:text-left motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-left duration-700 ease-out">
            <span className="inline-flex items-center gap-1.5 bg-white/5 border border-white/10 px-3.5 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase text-teal-400 transition-colors duration-300 hover:border-teal-500/30">
              ✨ Share & Learn Together
            </span>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-black leading-tight tracking-tight">
              Studying <span className="text-teal-400 italic font-serif font-normal">Smarter</span> is Now Inside <span className="underline decoration-teal-400 decoration-wavy decoration-2 underline-offset-4">DocuLink</span>
            </h1>
            <p className="text-xs md:text-sm text-slate-400 max-w-xl mx-auto lg:mx-0 leading-relaxed font-light">
              Access premium educational resources, share high-yield notes, and download comprehensive study guides created by top students nationwide.
            </p>
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
              <Link
                to="/register"
                className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transform transition-all duration-300 shadow-md shadow-teal-500/10 hover:-translate-y-0.5 active:translate-y-0"
              >
                Join for Free
              </Link>
              <button className="flex items-center gap-2.5 font-bold group text-slate-300 hover:text-teal-400 transition-all duration-300 text-xs uppercase tracking-wider">
                <PlayCircle size={32} className="text-slate-400 group-hover:text-teal-400 group-hover:scale-110 transition-all duration-300" />
                <span>Watch how it works</span>
              </button>
            </div>
          </div>

          {/* Animated Hero Right Visual Frame */}
          <div className="lg:w-5/12 ml-auto relative w-full max-w-md lg:max-w-none motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-right duration-700 ease-out delay-100">
            <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl border border-white/10 aspect-[4/3] bg-slate-900 group">
              <img
                src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=600"
                alt="Student learning collaboratively"
                className="w-full h-full object-cover opacity-90 transform transition-transform duration-700 ease-out group-hover:scale-105"
              />
            </div>

            {/* Floating Glassmorphism Badge 1 with float micro-animation */}
            <div className="absolute top-6 -left-6 bg-[#0b1329]/95 backdrop-blur-md p-3 rounded-xl border border-white/10 shadow-xl hidden xl:flex items-center gap-3 animate-bounce duration-[5s]">
              <div className="w-8 h-8 bg-teal-500/20 text-teal-400 rounded-lg flex items-center justify-center shadow-xs">
                <CheckCircle2 size={16} />
              </div>
              <div>
                <p className="font-extrabold text-[11px] text-white">Verified Documents</p>
                <p className="text-[9px] text-slate-400 font-medium">10K+ High-Quality Notes</p>
              </div>
            </div>

            {/* Floating Glassmorphism Badge 2 with pulse alternate micro-animation */}
            <div className="absolute bottom-6 -right-6 bg-[#0b1329]/95 backdrop-blur-md p-3 rounded-xl border border-white/10 shadow-xl hidden xl:flex items-center gap-3 animate-pulse">
              <div className="w-8 h-8 bg-amber-500/20 text-amber-400 rounded-lg flex items-center justify-center shadow-xs">
                <Award size={16} />
              </div>
              <div>
                <p className="font-extrabold text-[11px] text-white">Top Rated Platform</p>
                <p className="text-[9px] text-slate-400 font-medium">By 15K+ Active Students</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= STATISTICS SECTION ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 -mt-10 mb-14 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom duration-700 delay-200">
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-slate-100 dark:border-gray-800 p-6 md:p-8 shadow-md transition-shadow duration-300 hover:shadow-lg dark:hover:shadow-gray-900/50">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 text-center divide-y md:divide-y-0 md:divide-x divide-slate-100 dark:divide-gray-800">
            {STATISTICS.map((stat, idx) => (
              <div key={stat.label} className={`flex flex-col justify-center transition-all duration-300 hover:scale-105 ${idx > 0 ? 'pt-4 md:pt-0' : ''}`}>
                <p className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-0.5">{stat.value}</p>
                <p className="text-[10px] font-bold text-slate-400 dark:text-gray-500 uppercase tracking-wide">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= CORE VALUES SECTION ================= */}
      <section className="py-14 bg-slate-50/50 dark:bg-gray-950/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-[10px] font-bold text-teal-600 dark:text-teal-400 uppercase tracking-widest bg-teal-500/10 dark:bg-teal-500/20 px-3.5 py-1 rounded-full">
            Why Choose Us
          </span>
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight mt-4 mb-2">
            What is DocuLink?
          </h2>
          <p className="text-slate-400 dark:text-gray-500 text-xs max-w-md mx-auto mb-10 leading-relaxed font-medium">
            We are a collaborative student ecosystem built to simplify knowledge transmission and save critical exam revision time.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {CORE_FEATURES.map((feature, idx) => (
              <div
                key={feature.title}
                className={`bg-white dark:bg-gray-900 p-6 rounded-2xl border border-slate-100 dark:border-gray-800 shadow-xs transition-all duration-300 text-left flex flex-col justify-between hover:shadow-md dark:hover:shadow-gray-900/50 hover:-translate-y-1 group motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom duration-500`}
              >
                <div>
                  {/* Dynamic internal icon tilt effect on container hover */}
                  <div className={`w-10 h-10 bg-gradient-to-br ${feature.gradient} text-white rounded-xl flex items-center justify-center mb-5 shadow-xs transform transition-transform duration-300 ease-out group-hover:rotate-6 group-hover:scale-105`}>
                    <feature.icon size={20} />
                  </div>
                  <h3 className="text-sm font-extrabold text-slate-900 dark:text-white mb-2 transition-colors duration-300 group-hover:text-teal-500 dark:group-hover:text-teal-400">{feature.title}</h3>
                  <p className="text-slate-500 dark:text-gray-400 text-xs leading-relaxed font-light">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= POPULAR RESOURCE DECKS ================= */}
      <section className="py-14 bg-white dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-8 px-1">
            <div>
              <span className="text-[10px] font-bold text-teal-600 dark:text-teal-400 uppercase tracking-widest">Explore Materials</span>
              <h2 className="text-base font-black text-slate-900 dark:text-white tracking-tight">Popular Resource Decks</h2>
            </div>
            <button className="flex items-center gap-0.5 text-[11px] font-bold text-teal-500 hover:text-teal-600 transition-all duration-300 group">
              <span>See All Decks</span>
              <ArrowRight size={12} className="transform transition-transform duration-300 ease-out group-hover:translate-x-1" />
            </button>
          </div>

          <div className="space-y-8">
            {POPULAR_DECKS.map((row, rIdx) => (
              <div key={rIdx} className="space-y-3">
                <h3 className="text-[10px] font-bold text-slate-400 dark:text-gray-500 tracking-wider uppercase">{row.category}</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {row.colors.map((styleClasses, cIdx) => (
                    <div
                      key={cIdx}
                      className="group bg-white dark:bg-gray-900 rounded-xl p-3 border border-slate-100 dark:border-gray-800 shadow-xs transition-all duration-300 hover:shadow-md dark:hover:shadow-gray-900/50 hover:border-slate-200 dark:hover:border-gray-700 cursor-pointer flex items-center gap-3 transform hover:-translate-y-0.5"
                    >
                      {/* Icon scaling down animation loop wrapper */}
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center border text-sm ${styleClasses} shrink-0 transform transition-transform duration-300 ease-out group-hover:scale-105 group-hover:rotate-3`}>
                        <FileText size={16} />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xs font-extrabold text-slate-850 dark:text-gray-200 truncate transition-colors duration-300 group-hover:text-teal-500 dark:group-hover:text-teal-400">Curriculum Asset #{cIdx + 1}</h4>
                        <p className="text-[9px] text-slate-400 dark:text-gray-500 font-bold uppercase tracking-wider mt-0.5">Verified Entry</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= STUDENT WORKFLOW SECTION ================= */}
      <section className="py-14 bg-slate-50/50 dark:bg-gray-950/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-12">

            {/* Image block hover push container */}
            <div className="lg:w-1/2 w-full group">
               <div className="w-full aspect-[16/10] rounded-2xl overflow-hidden bg-slate-100 dark:bg-gray-800 border border-slate-200/60 dark:border-gray-700/60 shadow-sm transform transition-all duration-500 group-hover:shadow-xl group-hover:scale-[1.01]">
                 <img
                   src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=600"
                   alt="Students working together"
                   className="w-full h-full object-cover transform transition-transform duration-700 ease-out group-hover:scale-102"
                 />
               </div>
            </div>

            <div className="lg:w-1/2 space-y-5">
              <div className="inline-flex items-center gap-1 text-teal-600 dark:text-teal-400 font-bold text-[10px] uppercase tracking-widest">
                <span className="w-6 h-[2px] bg-teal-500 dark:bg-teal-400 inline-block mr-1 animate-pulse" />
                Built For Students
              </div>
              <h2 className="text-xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
                Collaborative Systems Engineered for Faster Preparation
              </h2>
              <p className="text-slate-400 dark:text-gray-500 text-xs leading-relaxed font-normal">
                Locate high-yield lecture summaries and structured assignment assets tailored specifically to your active school curriculum or university platform rules.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                {WORKFLOW_STEPS.map((item) => (
                  <div key={item.text} className="flex gap-2.5 items-start group/item">
                    <div className="mt-0.5 w-4 h-4 bg-teal-500/10 dark:bg-teal-500/20 text-teal-600 dark:text-teal-400 rounded-md flex items-center justify-center shrink-0 transform transition-transform duration-300 group-hover/item:scale-110 group-hover/item:rotate-12">
                      <CheckCircle2 size={11} className="stroke-[3]" />
                    </div>
                    <div>
                      <h4 className="text-xs font-extrabold text-slate-950 dark:text-gray-200 transition-colors duration-300 group-hover/item:text-teal-500 dark:group-hover/item:text-teal-400">{item.text}</h4>
                      <p className="text-[10px] text-slate-400 dark:text-gray-500 font-medium mt-0.5 leading-normal">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= TESTIMONIALS SECTION ================= */}
      <section className="py-14 bg-white dark:bg-gray-950">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="mb-10">
            <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-widest bg-amber-500/10 dark:bg-amber-500/20 px-3.5 py-1 rounded-full">
              Testimonials
            </span>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mt-4">What Our Users Say</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
            {TESTIMONIALS.map((t, idx) => (
              <div key={idx} className="bg-slate-50/50 dark:bg-gray-900/50 border border-slate-100 dark:border-gray-800 p-5 rounded-2xl flex flex-col justify-between transition-all duration-300 hover:shadow-md dark:hover:shadow-gray-900/50 hover:bg-white dark:hover:bg-gray-800 hover:border-slate-200 dark:hover:border-gray-700">
                <div>
                  <div className="flex gap-0.5 text-amber-400 mb-3">
                    {[...Array(5)].map((_, i) => <Star key={i} size={11} className="fill-amber-400 text-amber-400 transform transition-transform duration-300 hover:scale-120" />)}
                  </div>
                  <p className="text-slate-600 dark:text-gray-400 text-xs leading-relaxed italic mb-5">"{t.quote}"</p>
                </div>
                <div className="flex items-center gap-2.5 border-t border-slate-100 dark:border-gray-800 pt-3">
                  <img src={t.avatar} alt={t.name} className="w-8 h-8 rounded-full object-cover shrink-0 border border-slate-200 dark:border-gray-700 transition-transform duration-300 hover:scale-105" />
                  <div>
                    <h4 className="text-xs font-extrabold text-slate-900 dark:text-white leading-tight">{t.name}</h4>
                    <p className="text-[9px] text-slate-400 dark:text-gray-500 font-bold uppercase tracking-wider">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= HIGH IMPACT CTA SECTION ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="bg-[#0b1329] rounded-[24px] p-8 md:p-14 text-center text-white relative overflow-hidden shadow-xl shadow-slate-950/5 group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/5 rounded-full blur-2xl transform transition-transform duration-[8s] group-hover:scale-110" />

          <div className="relative z-10 max-w-md mx-auto space-y-4">
            <h2 className="text-xl md:text-3xl font-black tracking-tight leading-tight">Ready to excel in your study journey?</h2>
            <p className="text-xs text-slate-400 font-light leading-relaxed">
              Join thousands of dedicated Cambodian peers who are swapping notes and scoring higher today.
            </p>
            <div className="pt-2">
               <Link
                 to="/register"
                 className="inline-block bg-teal-500 hover:bg-teal-600 text-white px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transform transition-all duration-300 shadow-md shadow-teal-500/10 hover:-translate-y-0.5 active:translate-y-0"
               >
                 Sign Up Instantly
               </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}
