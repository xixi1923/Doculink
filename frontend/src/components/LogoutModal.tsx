import React from 'react'
import { createPortal } from 'react-dom'
import { LogOut, X } from 'lucide-react'

interface LogoutModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
}

export default function LogoutModal({ isOpen, onClose, onConfirm }: LogoutModalProps) {
  if (!isOpen) return null

  // We wrap the modal in a Portal to render it at the root body layer, escaping parent layout clips
  return createPortal(
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">

      {/* Clickable Background Overlay */}
      <div
        className="absolute inset-0 cursor-default"
        onClick={onClose}
      />

      {/* Centered Modal Content Card */}
      <div className="relative w-full max-w-sm bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-gray-800 p-6 md:p-8 transform transition-all duration-200 animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">

        {/* Upper Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-gray-800 transition-colors"
          aria-label="Close modal"
        >
          <X size={16} />
        </button>

        {/* Modal Body Info */}
        <div className="text-center mt-2">
          <div className="w-12 h-12 bg-teal-50 dark:bg-teal-950/30 text-teal-600 dark:text-teal-400 rounded-full flex items-center justify-center mx-auto mb-4">
            <LogOut size={22} />
          </div>

          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
            Confirm Logout
          </h3>
          <p className="text-slate-500 dark:text-gray-400 text-xs leading-relaxed max-w-xs mx-auto">
            Are you sure you want to log out of DocuLink? You will need to re-authenticate to manage your uploads or save workspace resources.
          </p>

          {/* Action Choice Buttons */}
          <div className="flex flex-col sm:flex-row gap-2 mt-6">
            <button
              onClick={onClose}
              className="w-full order-2 sm:order-1 py-2 px-4 border border-slate-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-slate-700 dark:text-gray-300 rounded-md text-xs font-medium hover:bg-slate-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="w-full order-1 sm:order-2 py-2 px-4 bg-teal-600 hover:bg-teal-700 text-white rounded-md text-xs font-medium shadow-sm transition-colors"
            >
              Log Out
            </button>
          </div>
        </div>

      </div>
    </div>,
    document.body // Renders directly into <body> to stay on top of the entire screen
  )
}