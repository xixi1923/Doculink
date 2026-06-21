import React from 'react'
import { LogOut, X, AlertCircle } from 'lucide-react'

interface LogoutModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
}

export default function LogoutModal({ isOpen, onClose, onConfirm }: LogoutModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-sm bg-white dark:bg-slate-900 rounded-[32px] shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-8 text-center">
          <div className="w-16 h-16 bg-rose-50 dark:bg-rose-500/10 text-rose-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <LogOut size={32} />
          </div>

          <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight mb-2">End Session?</h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium leading-relaxed">
            Are you sure you want to log out of the DocuLink matrix? You will need to re-authenticate to upload or save resources.
          </p>

          <div className="grid grid-cols-2 gap-3 mt-10">
            <button
              onClick={onClose}
              className="py-3.5 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-100 dark:hover:bg-slate-750 transition-all"
            >
              Stay Logged In
            </button>
            <button
              onClick={onConfirm}
              className="py-3.5 bg-rose-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-rose-600 shadow-lg shadow-rose-500/20 transition-all"
            >
              Confirm Logout
            </button>
          </div>
        </div>

        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
        >
          <X size={20} />
        </button>
      </div>
    </div>
  )
}
