import { useState, useRef, useEffect } from 'react'
import { Plus, FileText, MessageSquare, ChevronDown } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function CreateMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const items = [
    { label: 'Upload Document', icon: FileText, path: '/upload', color: 'text-blue-500' },
    { label: 'Community Feed', icon: MessageSquare, path: '/community', color: 'text-purple-500' },
  ]

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-full font-bold hover:bg-primary-dark transition-all shadow-lg shadow-primary/20"
      >
        <Plus size={20} />
        <span>Create</span>
        <ChevronDown size={16} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-56 bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 overflow-hidden z-[60] animate-in fade-in zoom-in duration-200">
          <div className="p-2">
            {items.map((item) => (
              <button
                key={item.label}
                onClick={() => {
                  navigate(item.path)
                  setIsOpen(false)
                }}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl transition-colors group"
              >
                <item.icon size={18} className={item.color} />
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 group-hover:text-primary transition-colors">
                  {item.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
