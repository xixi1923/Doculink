import React, { useState } from 'react'
import { Upload, FileText, X, CheckCircle2, Info, ArrowRight, ShieldCheck, Globe, EyeOff, Lock, ArrowUpRight } from 'lucide-react'

// ================= TYPES & INTERFACES =================
interface VisibilityOption {
  id: 'public' | 'unlisted' | 'private';
  label: string;
  icon: React.ComponentType<{ size: number; className?: string }>;
  desc: string;
}

interface GuidelineItem {
  title: string;
  desc: string;
}

export default function UploadDocument(): React.JSX.Element {
  const [file, setFile] = useState<File | null>(null)
  const [dragActive, setDragActive] = useState<boolean>(false)
  const [step, setStep] = useState<number>(1)
  const [visibility, setVisibility] = useState<string>('public')

  const visibilityOptions: VisibilityOption[] = [
    { id: 'public', label: 'Public', icon: Globe, desc: 'Anyone can see and download' },
    { id: 'unlisted', label: 'Unlisted', icon: EyeOff, desc: 'Anyone with the link can view' },
    { id: 'private', label: 'Private', icon: Lock, desc: 'Only you can see this document' },
  ]

  const guidelines: GuidelineItem[] = [
    { title: 'High Quality Assets', desc: 'Ensure text layouts are legible and images are clear.' },
    { title: 'Original Content', desc: 'Only upload materials or summaries you have authored.' }
  ]

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0])
      setStep(2)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
      setStep(2)
    }
  }

  return (
    <div className="max-w-6xl mx-auto py-10 px-4 sm:px-6 text-slate-800 font-sans selection:bg-teal-500 selection:text-white">

      {/* ================= HEADER SECTION ================= */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 border-b border-slate-100 pb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Share Your Knowledge</h1>
          <p className="text-slate-400 mt-1 text-xs sm:text-sm font-medium">Help fellow students by uploading high-yield study materials.</p>
        </div>
        <div className="flex items-center gap-3 bg-gradient-to-br from-teal-50 to-sky-50 px-5 py-3 rounded-2xl border border-teal-100/40 shrink-0">
           <ShieldCheck size={22} className="text-teal-600" />
           <div>
              <p className="font-black text-[10px] text-slate-800 uppercase tracking-widest">Safe & Secure</p>
              <p className="text-[11px] text-teal-700 font-bold">Vetted Storage System</p>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* ================= LEFT MAIN INTERACTIVE PANEL ================= */}
        <div className="lg:col-span-8 space-y-6">

          {/* Premium Step Navigation Pill Indicators */}
          <div className="flex items-center gap-3 bg-slate-50 border border-slate-100 p-2.5 rounded-2xl max-w-fit">
             {[1, 2].map((i: number) => (
               <div key={i} className="flex items-center gap-2">
                  <div className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                    step === i
                      ? 'bg-gradient-to-r from-teal-500 to-sky-500 text-white shadow-md shadow-teal-500/10'
                      : step > i ? 'bg-emerald-50 text-emerald-600' : 'text-slate-400'
                  }`}>
                    {step > i ? <CheckCircle2 size={13} className="stroke-[3]" /> : <span>0{i}</span>}
                    <span className="text-[11px] uppercase tracking-wider">{i === 1 ? 'Select File' : 'Document Info'}</span>
                  </div>
                  {i < 2 && <div className="w-4 h-0.5 bg-slate-200 rounded-full" />}
               </div>
             ))}
          </div>

          {/* STEP 1: INITIAL FILE INTAKE ZONE */}
          {step === 1 ? (
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`relative aspect-video md:aspect-[21/9] rounded-[28px] border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-center p-8 text-center group cursor-pointer ${
                dragActive
                  ? 'border-teal-500 bg-teal-50/40 scale-[1.005]'
                  : 'border-slate-200 bg-white hover:border-teal-500/50 hover:bg-slate-50/50 shadow-xs'
              }`}
            >
              <div className="w-14 h-14 bg-teal-50 text-teal-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-105 transition-transform shadow-xs">
                <Upload size={24} className="stroke-[2.5]" />
              </div>
              <h2 className="text-base font-extrabold text-slate-800 mb-1 tracking-tight">Select a document to upload</h2>
              <p className="text-slate-400 text-xs mb-6 font-medium">Or drag and drop your PDF or DOCX file format here</p>

              <label className="px-6 py-2.5 bg-gradient-to-r from-teal-500 to-sky-500 hover:opacity-95 text-white rounded-xl font-bold text-xs uppercase tracking-wider shadow-sm shadow-teal-500/10 transition-all cursor-pointer">
                Choose File
                <input type="file" className="hidden" onChange={handleFileChange} accept=".pdf,.doc,.docx" />
              </label>
            </div>
          ) : (

            // STEP 2: METADATA FORM INTERFACE
            <div className="bg-white rounded-[28px] border border-slate-100 p-6 sm:p-8 shadow-sm shadow-slate-200/50 animate-in fade-in zoom-in-98 duration-300">
               {/* Attached Asset Meta Summary Bar */}
               <div className="flex items-center justify-between mb-6 pb-5 border-b border-slate-100">
                  <div className="flex items-center gap-3 min-w-0">
                     <div className="w-10 h-10 bg-teal-50 text-teal-600 rounded-xl flex items-center justify-center shrink-0">
                       <FileText size={20} />
                     </div>
                     <div className="min-w-0">
                        <h3 className="font-bold text-sm text-slate-800 truncate pr-2">{file?.name}</h3>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                          {((file?.size || 0) / 1024) > 1024
                            ? `${((file?.size || 0) / (1024 * 1024)).toFixed(1)} MB`
                            : `${((file?.size || 0) / 1024).toFixed(0)} KB`} • Document Source
                        </p>
                     </div>
                  </div>
                  <button
                    onClick={() => { setFile(null); setStep(1); }}
                    className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                  >
                    <X size={16} />
                  </button>
               </div>

               {/* Meta Entry Form Field Matrices */}
               <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Document Title</label>
                    <input
                      type="text"
                      placeholder="e.g. Mathematics Grade 12 National Exam Prep Summary"
                      className="w-full px-4 py-3 bg-slate-50/70 border border-slate-200/60 focus:border-teal-500 focus:bg-white rounded-xl outline-none text-xs text-slate-800 font-medium transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Category</label>
                      <div className="relative">
                        <select className="w-full px-4 py-3 bg-slate-50/70 border border-slate-200/60 focus:border-teal-500 focus:bg-white rounded-xl outline-none text-xs text-slate-800 font-semibold transition-all appearance-none cursor-pointer">
                          <option>Summaries</option>
                          <option>Lecture Notes</option>
                          <option>Exam Prep</option>
                        </select>
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">School / University</label>
                      <input
                        type="text"
                        placeholder="e.g. RUPP, ITC, or High School"
                        className="w-full px-4 py-3 bg-slate-50/70 border border-slate-200/60 focus:border-teal-500 focus:bg-white rounded-xl outline-none text-xs text-slate-800 font-medium transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Description</label>
                    <textarea
                      rows={4}
                      placeholder="Briefly describe what chapters or concepts this study deck covers..."
                      className="w-full px-4 py-3 bg-slate-50/70 border border-slate-200/60 focus:border-teal-500 focus:bg-white rounded-xl outline-none text-xs text-slate-800 font-medium resize-none transition-all"
                    ></textarea>
                  </div>

                  <button
                    type="button"
                    className="w-full py-3 bg-gradient-to-r from-teal-500 to-sky-500 hover:opacity-95 text-white rounded-xl font-bold text-xs uppercase tracking-wider shadow-md shadow-teal-500/10 transition-all flex items-center justify-center gap-2 mt-2"
                  >
                    Complete Content Upload <ArrowRight size={14} />
                  </button>
               </form>
            </div>
          )}
        </div>

        {/* ================= RIGHT ASIDE UTILITIES / POLICY ================= */}
        <div className="lg:col-span-4 space-y-6">

           {/* Dynamic Visibility Scope Selector Cards */}
           <div className="bg-white p-5 rounded-[24px] border border-slate-100 shadow-sm shadow-slate-200/50 space-y-4">
              <h3 className="font-extrabold text-slate-800 text-xs uppercase tracking-wider">
                 Access Permissions
              </h3>
              <div className="space-y-2">
                {visibilityOptions.map((opt: VisibilityOption) => {
                  const IconComponent = opt.icon;
                  const isSelected = visibility === opt.id;
                  return (
                    <label
                      key={opt.id}
                      className={`flex items-start gap-3 p-3.5 rounded-xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'border-teal-500 bg-teal-50/30'
                          : 'border-slate-100 bg-white hover:border-slate-200'
                      }`}
                    >
                      <input
                        type="radio"
                        name="visibility"
                        className="hidden"
                        checked={isSelected}
                        onChange={() => setVisibility(opt.id)}
                      />
                      <IconComponent size={16} className={`mt-0.5 shrink-0 ${isSelected ? 'text-teal-600' : 'text-slate-400'}`} />
                      <div className="min-w-0">
                        <p className={`text-xs font-bold ${isSelected ? 'text-teal-700' : 'text-slate-700'}`}>{opt.label}</p>
                        <p className="text-[10px] text-slate-400 font-medium mt-0.5">{opt.desc}</p>
                      </div>
                    </label>
                  );
                })}
              </div>
           </div>

           {/* Core Moderation Guidelines Checklist Box */}
           <div className="bg-white p-5 rounded-[24px] border border-slate-100 shadow-sm shadow-slate-200/50 space-y-4">
              <h3 className="font-extrabold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5">
                <Info size={14} className="text-teal-600" /> Upload Rules
              </h3>
              <div className="space-y-4">
                 {guidelines.map((item: GuidelineItem, idx: number) => (
                   <div key={idx} className="flex gap-3 items-start">
                      <div className="w-4 h-4 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center text-[9px] font-black shrink-0 mt-0.5">
                        ✓
                      </div>
                      <div>
                         <p className="text-xs font-bold text-slate-700 leading-none">{item.title}</p>
                         <p className="text-[11px] text-slate-400 mt-1 leading-normal font-normal">{item.desc}</p>
                      </div>
                   </div>
                 ))}
              </div>
           </div>

           {/* Brand Consistency Reward Card Asset */}
           <div className="bg-[#1a1b2f] rounded-[24px] p-6 text-white shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />

              <h4 className="font-extrabold text-sm mb-1.5 tracking-tight">Earn Creator Points</h4>
              <p className="text-[11px] text-slate-400 mb-5 leading-relaxed font-light">
                Top verified uploaders get featured prominently on the university directory panels and unlock access modifiers.
              </p>
              <div className="inline-flex items-center gap-1 text-teal-400 font-bold text-[11px] uppercase tracking-wider cursor-pointer hover:text-teal-300 transition-colors group">
                Learn rewards system
                <ArrowUpRight size={12} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
           </div>

        </div>
      </div>
    </div>
  )
}