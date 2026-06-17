import { useState, useRef, useEffect } from 'react'
import { User, FileText, Heart, Download, Settings, LogOut, ChevronDown } from 'lucide-react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'

export default function UserDropdown() {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const menuItems = [
    { label: 'Profile', icon: User, path: '/profile' },
    { label: 'My Documents', icon: FileText, path: '/profile/documents' },
    { label: 'Favorites', icon: Heart, path: '/profile/favorites' },
    { label: 'Downloads', icon: Download, path: '/profile/downloads' },
    { label: 'Settings', icon: Settings, path: '/profile/settings' },
  ]

  const handleLogout = () => {
    logout()
    navigate('/')
    setIsOpen(false)
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-primary group transition-all"
      >
        <div className="w-9 h-9 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-xs font-bold text-primary border border-gray-200 dark:border-gray-700 group-hover:border-primary transition-all overflow-hidden">
          {user?.avatar ? (
            <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
          ) : (
            user?.name?.substring(0, 2).toUpperCase() || 'SK'
          )}
        </div>
        <ChevronDown size={14} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-64 bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 overflow-hidden z-[60] animate-in fade-in zoom-in duration-200">
          <div className="p-4 bg-gray-50/50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800">
            <p className="font-bold text-gray-800 dark:text-white">{user?.name}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{user?.email}</p>
          </div>
          <div className="p-2">
            {menuItems.map((item) => (
              <Link
                key={item.label}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl transition-colors group"
              >
                <item.icon size={18} className="text-gray-400 dark:text-gray-500 group-hover:text-primary transition-colors" />
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 group-hover:text-primary transition-colors">
                  {item.label}
                </span>
              </Link>
            ))}
            <div className="h-px bg-gray-100 dark:bg-gray-800 my-2 mx-2" />
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-colors group"
            >
              <LogOut size={18} className="text-gray-400 dark:text-gray-500 group-hover:text-red-500 transition-colors" />
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 group-hover:text-red-500 transition-colors">
                Logout
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
