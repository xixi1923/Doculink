import React, { useState } from 'react'
import { BookPlus, Send, AlertCircle, Info } from 'lucide-react'

export default function RequestBook(): React.JSX.Element {
  const [submitted, setSubmitted] = useState<boolean>(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  // ================= SUCCESS VIEW STATE =================
  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto py-20 px-4 text-center font-sans motion-safe:animate-in motion-safe:fade-in duration-300">
        <div className="w-16 h-16 bg-teal-500/10 text-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-teal-500/20">
          <Send size={24} />
        </div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mb-3">Request Successfully Broadcasted!</h1>
        <p className="text-xs text-slate-400 dark:text-slate-400 max-w-md mx-auto mb-8 leading-relaxed font-light">
          Your book blueprint details have been routed into the global repository stream.
          We'll notify you via your dashboard alerts the millisecond a peer maps the file.
        </p>
        <button
          onClick={() => setSubmitted(false)}
          className="px-6 py-2.5 bg-teal-500 text-white rounded-xl font-extrabold text-xs uppercase tracking-wider hover:bg-teal-600 transition-all shadow-sm shadow-teal-500/10 hover:-translate-y-0.5"
        >
          Request Another Asset
        </button>
      </div>
    )
  }

  // ================= DEFAULT INPUT FORM VIEW =================
  return (
    <div className="max-w-5xl mx-auto py-12 px-4 sm:px-6 font-sans text-slate-800 dark:text-slate-200 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom duration-500">
      <div className="flex flex-col lg:flex-row gap-10 items-start">

        {/* LEFT COLUMN: BRAND PROMISE & VALUE PROPOSITION */}
        <div className="flex-grow space-y-8 lg:pt-4">
          <div>
            <span className="text-[10px] font-bold text-teal-600 uppercase tracking-widest bg-teal-500/10 px-3.5 py-1 rounded-full">
              Sourcing Matrix
            </span>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-tight mt-4 mb-5">
              Missing reference sheets? <br />
              <span className="text-teal-500 font-extrabold">Let the community trace it.</span>
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed max-w-lg font-light">
              Log a targeted sourcing request. Our network of student contributors will review their local digital storage bins to locate the specific academic edition or layout notes you require.
            </p>
          </div>

          {/* Core Feature Meta Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl">
             <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800/60 shadow-xs">
                <div className="text-teal-500 mb-3"><AlertCircle size={18} /></div>
                <h3 className="text-xs font-extrabold text-slate-900 dark:text-white mb-1">Audit Details</h3>
                <p className="text-[11px] text-slate-400 dark:text-slate-500 font-light leading-normal">Double-check titles or edition numbers to eliminate confusion within global tracking queues.</p>
             </div>
             <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800/60 shadow-xs">
                <div className="text-teal-500 mb-3"><Info size={18} /></div>
                <h3 className="text-xs font-extrabold text-slate-900 dark:text-white mb-1">Instant Notification</h3>
                <p className="text-[11px] text-slate-400 dark:text-slate-500 font-light leading-normal">System webhooks push a high-priority ping directly to your profile layout the moment a match resolves.</p>
             </div>
          </div>
        </div>

        {/* RIGHT COLUMN: MAIN METADATA CAPTURE PANEL */}
        <div className="w-full lg:w-[420px] shrink-0">
          <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-2xl border border-slate-100 dark:border-slate-800/60 shadow-xs">
            <h2 className="text-sm font-black text-slate-900 dark:text-white mb-6 flex items-center gap-2 uppercase tracking-wide">
              <BookPlus className="text-teal-500" size={16} />
              <span>Asset Specifications</span>
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-0.5">Book Title</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Advanced Engineering Mathematics"
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-xl outline-none text-xs text-slate-800 dark:text-white placeholder-slate-400 focus:border-teal-500/40 transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-0.5">Author / Editor</label>
                <input
                  type="text"
                  placeholder="e.g. Erwin Kreyszig"
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-xl outline-none text-xs text-slate-800 dark:text-white placeholder-slate-400 focus:border-teal-500/40 transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-0.5">Edition Year</label>
                  <input
                    type="text"
                    placeholder="e.g. 10th Ed"
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-xl outline-none text-xs text-slate-800 dark:text-white placeholder-slate-400 focus:border-teal-500/40 transition-colors"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-0.5">Language Target</label>
                  <select className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-xl outline-none text-xs font-bold text-slate-700 dark:text-slate-300 focus:border-teal-500/40 transition-colors shadow-2xs">
                    <option>English</option>
                    <option>Khmer</option>
                    <option>French</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-0.5">ISBN Number (Optional)</label>
                <input
                  type="text"
                  placeholder="978-3-16-148410-0"
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-xl outline-none text-xs text-slate-800 dark:text-white placeholder-slate-400 focus:border-teal-500/40 transition-colors"
                />
              </div>

              {/* Submission Dispatch Handle */}
              <button
                type="submit"
                className="w-full py-3 bg-[#0b1329] text-teal-400 border border-slate-800 rounded-xl font-extrabold text-xs uppercase tracking-wider hover:bg-slate-900 transition-all shadow-xs mt-4 flex items-center justify-center gap-2 group transform hover:-translate-y-0.5"
              >
                <span>Broadcast Request</span>
                <Send size={13} className="transform transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  )
}