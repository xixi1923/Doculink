import React, { useState } from 'react'
import { 
  HelpCircle, 
  Sparkles, 
  Paperclip, 
  Globe, 
  Eye, 
  ArrowRight,
  MessageSquare,
  BookOpen
} from 'lucide-react'

// ================= TYPES & INTERFACES =================
interface QuestionFormState {
  title: string;
  details: string;
  subject: string;
  isPublic: boolean;
}

export default function AskQuestion(): React.JSX.Element {
  const [form, setForm] = useState<QuestionFormState>({
    title: '',
    details: '',
    subject: 'IT & Software Engineering',
    isPublic: true
  })

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleToggleChange = () => {
    setForm(prev => ({ ...prev, isPublic: !prev.isPublic }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Trigger downstream community socket or REST dispatch lifecycle hook
    console.log('Dispatching new community academic query handle:', form)
  }

  return (
    <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6 font-sans text-slate-800 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom duration-500">
      
      {/* ================= HEADER CANVAS ================= */}
      <div className="mb-10">
        <span className="text-[10px] font-bold text-teal-600 uppercase tracking-widest bg-teal-500/10 px-3.5 py-1 rounded-full">
          Community Forum
        </span>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight mt-3">Ask the Community</h1>
        <p className="text-xs text-slate-400 mt-0.5 font-medium">Stuck on an assignment or lecture concept? Tap into the network for fast crowd-sourced breakdowns.</p>
      </div>

      {/* ================= TWO-COLUMN INTERACTIVE SPLIT ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* CORE DISCUSSIONS INPUT BOARD */}
        <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-xs p-6 md:p-8 space-y-5">
            
            {/* Subject Routing and Attachment Triggers */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-0.5">Target Domain / Subject</label>
                <select 
                  name="subject"
                  value={form.subject}
                  onChange={handleInputChange}
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-xs text-slate-700 font-bold outline-none focus:border-teal-500/40 shadow-2xs"
                >
                  <option>IT & Software Engineering</option>
                  <option>STEM Foundations</option>
                  <option>High School (Bac II Prep)</option>
                  <option>General Academic Queries</option>
                </select>
              </div>

              {/* Graphical Diagnostic Snap Uploader */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-0.5">Reference Image (Optional)</label>
                <button type="button" className="w-full flex items-center justify-between bg-slate-50 border border-slate-100 border-dashed rounded-xl px-4 py-2.5 text-xs text-slate-400 hover:text-teal-500 hover:border-teal-500/30 transition-colors">
                  <span className="font-medium">Attach exercise snapshot...</span>
                  <Paperclip size={14} />
                </button>
              </div>
            </div>

            {/* Title / Primary Query Statement */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-0.5">Your Question</label>
              <input 
                type="text"
                name="title"
                value={form.title}
                onChange={handleInputChange}
                placeholder="Be specific — e.g., How do I resolve an Uncaught ReferenceError loop inside Vite hot reloads?"
                className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-extrabold text-slate-900 placeholder-slate-400 focus:border-teal-500/50 outline-none transition-colors"
                required
              />
            </div>

            {/* Contextual Technical Explanation Deep Canvas */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center ml-0.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Contextual Details & Code Blocks</label>
                <span className="text-[9px] text-slate-400 font-bold bg-slate-100 px-2 py-0.5 rounded-md uppercase tracking-wider">Markdown Aided</span>
              </div>
              <textarea 
                name="details"
                value={form.details}
                onChange={handleInputChange}
                rows={10}
                placeholder="Paste code segments, console stack traces, compilation errors, or specify exact platform rules and parameters you are attempting to fulfill..."
                className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-xs text-slate-800 placeholder-slate-400 focus:border-teal-500/50 outline-none transition-colors resize-none leading-relaxed"
                required
              ></textarea>
            </div>

          </div>

          {/* Bottom Dispatch Controls Tray */}
          <div className="flex items-center justify-between bg-slate-50 border border-slate-100 rounded-2xl p-4">
            <div className="flex items-center gap-3">
              <label className="relative inline-flex items-center cursor-pointer shrink-0">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={form.isPublic}
                  onChange={handleToggleChange}
                />
                <div className="w-9 h-5 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-teal-500"></div>
              </label>
              <div>
                <p className="text-xs font-extrabold text-slate-900 flex items-center gap-1">
                  {form.isPublic ? <Globe size={12} className="text-teal-500" /> : <Eye size={12} className="text-slate-400" />}
                  <span>{form.isPublic ? 'Visible to Network' : 'Private Routing Only'}</span>
                </p>
                <p className="text-[10px] text-slate-400 font-medium">Control who can locate your query item across global indexes.</p>
              </div>
            </div>

            <button 
              type="submit"
              className="inline-flex items-center gap-1.5 bg-[#0b1329] hover:bg-slate-900 text-teal-400 px-5 py-2.5 rounded-xl font-extrabold text-xs uppercase tracking-wider transition-all shadow-xs border border-slate-800 transform hover:-translate-y-0.5"
            >
              <span>Broadcast Question</span>
              <ArrowRight size={13} />
            </button>
          </div>
        </form>

        {/* SIDEBAR INTUITION & COMMUNITY GUIDELINES CARD */}
        <aside className="space-y-6">
          
          {/* Question Optimization Instructions */}
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs space-y-4">
            <div className="flex items-center gap-2.5 text-slate-900 border-b border-slate-100 pb-3">
              <div className="w-7 h-7 bg-teal-500/10 text-teal-600 rounded-lg flex items-center justify-center shrink-0">
                <Sparkles size={14} />
              </div>
              <h3 className="text-xs font-black uppercase tracking-wider">Drafting the Perfect Query</h3>
            </div>
            
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-[11px] text-slate-500 leading-relaxed font-light">
                <span className="mt-1 w-1.5 h-1.5 bg-teal-500 rounded-full shrink-0" />
                <span><strong>Isolate the Problem:</strong> Detail what you expected to take place versus what the runtime engine or asset calculation actually returned.</span>
              </li>
              <li className="flex items-start gap-2 text-[11px] text-slate-500 leading-relaxed font-light">
                <span className="mt-1 w-1.5 h-1.5 bg-teal-500 rounded-full shrink-0" />
                <span><strong>Share Assets:</strong> Mention the specific handbook section, database connection setup, or framework version you are target modeling.</span>
              </li>
              <li className="flex items-start gap-2 text-[11px] text-slate-500 leading-relaxed font-light">
                <span className="mt-1 w-1.5 h-1.5 bg-teal-500 rounded-full shrink-0" />
                <span><strong>Stay Courteous:</strong> Remember that peers across university departments vote and structure answers on their own personal clock!</span>
              </li>
            </ul>
          </div>

          {/* Quick Metrics Help Node Frame */}
          <div className="bg-[#0b1329] text-white rounded-2xl p-5 border border-slate-800 shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/5 rounded-full blur-xl translate-x-1/4 -translate-y-1/4" />
            <div className="relative z-10 space-y-3">
              <div className="flex gap-2 items-center text-teal-400">
                <MessageSquare size={16} />
                <h4 className="text-xs font-black uppercase tracking-wider">Fast Response Rates</h4>
              </div>
              <p className="text-[11px] text-slate-400 leading-normal font-light">
                Over <strong>82%</strong> of structured code and STEM foundation questions logged into the DocuLink matrix receive structural tracking support within the first 4 hours of submission.
              </p>
            </div>
          </div>

        </aside>
        
      </div>
    </div>
  )
}