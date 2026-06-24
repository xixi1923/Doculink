import React from 'react'
import { Shield, Eye, Lock, Cookie, Mail, Calendar, type LucideIcon } from 'lucide-react'

// ================= TYPES & INTERFACES =================
interface PolicySection {
  title: string;
  content: string;
  icon: LucideIcon;
}

export default function PrivacyPolicy(): React.JSX.Element {
  // ================= LEGAL CLAUSE REGISTRY =================
  const sections: PolicySection[] = [
    {
      title: 'Information We Collect',
      content: 'We collect information that you provide directly to us when you create an account, upload a document, or communicate with us. This may include your name, email address, school information, and profile picture.',
      icon: Eye
    },
    {
      title: 'How We Use Your Information',
      content: 'We use the information we collect to provide, maintain, and improve our services, to communicate with you, and to personalize your experience on DocuLink.',
      icon: Shield
    },
    {
      title: 'Data Security',
      content: 'We take reasonable measures to help protect information about you from loss, theft, misuse and unauthorized access, disclosure, alteration and destruction.',
      icon: Lock
    },
    {
      title: 'Cookies & Local Storage',
      content: 'Most web browsers are set to accept cookies by default. If you prefer, you can usually choose to set your browser parameters to remove or reject browser cookies.',
      icon: Cookie
    }
  ]

  return (
    <div className="max-w-4xl mx-auto py-16 px-4 sm:px-6 font-sans text-slate-800 dark:text-slate-200 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom duration-500">
      
      {/* ================= HEADER CANVAS ================= */}
      <div className="mb-12">
        <span className="text-[10px] font-bold text-teal-600 uppercase tracking-widest bg-teal-500/10 px-3.5 py-1 rounded-full">
          Legal Framework
        </span>
        <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight mt-4 mb-3">Privacy Policy</h1>
        
        <div className="flex items-center gap-1.5 text-slate-400 dark:text-slate-500 text-[10px] font-bold uppercase tracking-wider">
          <Calendar size={12} />
          <span>Last updated: June 18, 2026</span>
        </div>
      </div>

      {/* ================= MAIN CLAUSE CONTAINER ================= */}
      <div className="space-y-6">
        
        {/* Policy Overview Intro Block */}
        <div className="bg-slate-50 dark:bg-slate-950 p-6 md:p-8 rounded-2xl border border-slate-100 dark:border-slate-800/80">
          <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed font-normal">
            At DocuLink, we take your data governance seriously. This compliance directive itemizes exactly how we collect, map, securely isolate, and safeguard your user metrics when utilizing our global repository dashboard tools.
          </p>
        </div>

        {/* Mapped Policy Paragraph Cards */}
        {sections.map((section) => (
          <section 
            key={section.title} 
            className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-2xl border border-slate-100 dark:border-slate-800/60 shadow-2xs flex flex-col sm:flex-row gap-5 items-start transition-all duration-200 hover:border-slate-200 dark:hover:border-slate-800 group"
          >
            {/* Visual Icon Node Anchor */}
            <div className="p-2.5 bg-slate-50 dark:bg-slate-950 text-slate-400 group-hover:text-teal-500 border border-slate-100 dark:border-slate-800 rounded-xl shrink-0 transition-colors">
              <section.icon size={16} />
            </div>

            {/* Core Segment Body */}
            <div className="space-y-2">
              <h2 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
                {section.title}
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed font-light">
                {section.content}
              </p>
            </div>
          </section>
        ))}

        {/* ================= CUSTOM COMPLIANCE CONTACT TRAY ================= */}
        <div className="pt-8 border-t border-slate-100 dark:border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-4">
           <div className="flex items-center gap-2.5 text-slate-400 dark:text-slate-500 text-xs">
             <Mail size={14} className="text-teal-500" />
             <span className="font-light">For any direct privacy inquiries, reach our auditing pipeline at</span>
           </div>
           
           <a 
             href="mailto:privacy@doculink.com" 
             className="bg-[#0b1329] border border-slate-800 text-teal-400 px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all duration-150 hover:bg-slate-900 shadow-xs"
           >
             privacy@doculink.com
           </a>
        </div>

      </div>
    </div>
  )
}