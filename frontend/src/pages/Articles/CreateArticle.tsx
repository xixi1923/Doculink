import React, { useState } from 'react'
import { 
  FileText, 
  Sparkles, 
  Image as ImageIcon, 
  Globe, 
  Eye, 
  HelpCircle,
  ArrowRight
} from 'lucide-react'

// ================= TYPES & INTERFACES =================
interface ArticleFormState {
  title: string;
  subtitle: string;
  category: string;
  content: string;
  isPublic: boolean;
}

export default function CreateArticle(): React.JSX.Element {
  const [form, setForm] = useState<ArticleFormState>({
    title: '',
    subtitle: '',
    category: 'STEM Foundations',
    content: '',
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
    // Trigger internal dispatch lifecycle hook
    console.log('Submitting generated educational article blueprint:', form)
  }

  return (
    <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6 font-sans text-slate-800 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom duration-500">
      
      {/* ================= HEADER CANVAS ================= */}
      <div className="mb-10">
        <span className="text-[10px] font-bold text-teal-600 uppercase tracking-widest bg-teal-500/10 px-3.5 py-1 rounded-full">
          Creator Studio
        </span>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight mt-3">Compose Educational Article</h1>
        <p className="text-xs text-slate-400 mt-0.5 font-medium">Publish research synopses, lecture insights, or provincial curriculum roadmaps.</p>
      </div>

      {/* ================= TWO-COLUMN LAYOUT ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* MAIN CREATION EDITOR FORM */}
        <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-xs p-6 md:p-8 space-y-5">
            
            {/* Category Dropdown and Status Indicators */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-0.5">Academic Category</label>
                <select 
                  name="category"
                  value={form.category}
                  onChange={handleInputChange}
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-xs text-slate-700 font-bold outline-none focus:border-teal-500/40 shadow-2xs"
                >
                  <option>STEM Foundations</option>
                  <option>High School (Bac II Prep)</option>
                  <option>IT & Software Engineering</option>
                  <option>Language & Literature</option>
                </select>
              </div>

              {/* Cover Image Placeholder Node */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-0.5">Hero Cover Media</label>
                <button type="button" className="w-full flex items-center justify-between bg-slate-50 border border-slate-100 border-dashed rounded-xl px-4 py-2.5 text-xs text-slate-400 hover:text-teal-500 hover:border-teal-500/30 transition-colors">
                  <span className="font-medium">Attach graphical cover file...</span>
                  <ImageIcon size={14} />
                </button>
              </div>
            </div>

            {/* Dynamic Core Text Fields */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-0.5">Article Headline</label>
              <input 
                type="text"
                name="title"
                value={form.title}
                onChange={handleInputChange}
                placeholder="e.g., A Deep Dive into Bac II Calculus Techniques"
                className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-extrabold text-slate-900 placeholder-slate-400 focus:border-teal-500/50 outline-none transition-colors"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-0.5">Brief Sub-summary</label>
              <input 
                type="text"
                name="subtitle"
                value={form.subtitle}
                onChange={handleInputChange}
                placeholder="Provide a quick snapshot summarizing your core educational insights..."
                className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:border-teal-500/50 outline-none transition-colors"
              />
            </div>

            {/* Markdown Rich Editor Block */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center ml-0.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Main Manuscript Content</label>
                <span className="text-[9px] text-slate-400 font-bold bg-slate-100 px-2 py-0.5 rounded-md uppercase tracking-wider">Supports Text Layouts</span>
              </div>
              <textarea 
                name="content"
                value={form.content}
                onChange={handleInputChange}
                rows={12}
                placeholder="Unleash your expertise here. Formulate structure using bold titles, itemized index nodes, or clear conceptual explanations..."
                className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-xs text-slate-800 placeholder-slate-400 focus:border-teal-500/50 outline-none transition-colors resize-none leading-relaxed"
                required
              ></textarea>
            </div>

          </div>

          {/* Form Action Controls Footprint */}
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
                  <span>{form.isPublic ? 'Public Discovery' : 'Draft Access Only'}</span>
                </p>
                <p className="text-[10px] text-slate-400 font-medium">Control asset indexing options inside peer search queues.</p>
              </div>
            </div>

            <button 
              type="submit"
              className="inline-flex items-center gap-1.5 bg-[#0b1329] hover:bg-slate-900 text-teal-400 px-5 py-2.5 rounded-xl font-extrabold text-xs uppercase tracking-wider transition-all shadow-xs border border-slate-800 transform hover:-translate-y-0.5"
            >
              <span>Publish Entry</span>
              <ArrowRight size={13} />
            </button>
          </div>
        </form>

        {/* COMPANION CREATOR UTILITY SIDEBAR */}
        <aside className="space-y-6">
          
          {/* Quick Composition Guide Card */}
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs space-y-4">
            <div className="flex items-center gap-2.5 text-slate-900 border-b border-slate-100 pb-3">
              <div className="w-7 h-7 bg-teal-500/10 text-teal-600 rounded-lg flex items-center justify-center shrink-0">
                <Sparkles size={14} />
              </div>
              <h3 className="text-xs font-black uppercase tracking-wider">Insight Guidelines</h3>
            </div>
            
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-[11px] text-slate-500 leading-relaxed font-light">
                <span className="mt-1 w-1.5 h-1.5 bg-teal-500 rounded-full shrink-0" />
                <span><strong>Be Comprehensive:</strong> Break complex formulas or programming syntax blocks into intuitive chunks.</span>
              </li>
              <li className="flex items-start gap-2 text-[11px] text-slate-500 leading-relaxed font-light">
                <span className="mt-1 w-1.5 h-1.5 bg-teal-500 rounded-full shrink-0" />
                <span><strong>Format Nicely:</strong> Use distinct newline headers to index chapter steps gracefully.</span>
              </li>
              <li className="flex items-start gap-2 text-[11px] text-slate-500 leading-relaxed font-light">
                <span className="mt-1 w-1.5 h-1.5 bg-teal-500 rounded-full shrink-0" />
                <span><strong>Provincial Outreach:</strong> Ensure explanations support general curriculum criteria so peers across provinces can extract immediate value.</span>
              </li>
            </ul>
          </div>

          {/* Quick Help Sandbox Frame */}
          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex gap-3 items-start">
            <HelpCircle size={16} className="text-slate-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-extrabold text-slate-950">Need a blueprint setup?</h4>
              <p className="text-[11px] text-slate-400 mt-0.5 leading-normal font-light">
                If you aren't sure how to present your structural notes, look at popular entries under the main asset dashboard to mirror your peers' structural layouts.
              </p>
            </div>
          </div>

        </aside>
        
      </div>
    </div>
  )
}