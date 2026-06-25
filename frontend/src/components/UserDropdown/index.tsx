import { useState, useRef, useEffect } from 'react'
import { User, Heart, Settings, LogOut, ChevronDown, ShieldCheck, LayoutDashboard } from 'lucide-react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import LogoutModal from '../LogoutModal'

export default function UserDropdown() {
  const [isOpen, setIsOpen] = useState(false)
  const [showLogoutModal, setShowLogoutModal] = useState(false)
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

  const isAdmin = user?.role === 'admin'

  const userMenuItems = [
    { label: 'My Workspace', icon: User, path: '/profile' },
    { label: 'Settings', icon: Settings, path: '/profile/settings' },
  ]

  const adminMenuItems = [
    { label: 'Admin Console', icon: LayoutDashboard, path: '/admin/dashboard' },
    { label: 'Personal Profile', icon: User, path: '/admin/profile' },
    { label: 'Security Settings', icon: Settings, path: '/admin/settings' },
  ]

  const menuItems = isAdmin ? adminMenuItems : userMenuItems

  const handleLogoutConfirm = () => {
    logout()
    navigate('/')
    setIsOpen(false)
    setShowLogoutModal(false)
  }

  const [imageError, setImageError] = useState(false)

  const userName = user?.name || user?.displayName || user?.email || 'User'
  const userAvatar = user?.avatar || user?.photoURL || undefined

  useEffect(() => {
    setImageError(false)
  }, [userAvatar])

  const initials = userName && userName !== 'User'
    ? userName.split(' ').filter(Boolean).map((n: string) => n[0]).join('').substring(0, 2).toUpperCase()
    : (user?.email ? user.email[0].toUpperCase() : 'U')

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-teal-500 group transition-all"
      >
        <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xs font-black text-teal-600 dark:text-teal-400 border border-slate-200 dark:border-slate-700 group-hover:border-teal-500 transition-all overflow-hidden select-none">
          {userAvatar && !imageError ? (
            <img
              src={userAvatar}
              alt={userName}
              className="w-full h-full object-cover"
              onError={() => setImageError(true)}
              referrerPolicy="no-referrer"
            />
          ) : (
            <span>{initials}</span>
          )}
        </div>
        <ChevronDown size={14} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-64 bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 overflow-hidden z-[60] animate-in fade-in zoom-in duration-200">
          <div className="p-4 bg-gray-50/50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800">
            <div className="flex items-center justify-between mb-1">
               <p className="font-bold text-gray-800 dark:text-white truncate max-w-[140px]">{userName}</p>
               {isAdmin && (
                 <span className="px-2 py-0.5 bg-teal-500 text-white text-[8px] font-black uppercase tracking-widest rounded-md">Admin</span>
               )}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.email}</p>
          </div>
          <div className="p-2">
            {menuItems.map((item) => (
              <Link
                key={item.label}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl transition-colors group"
              >
                <item.icon size={18} className="text-gray-400 dark:text-gray-500 group-hover:text-teal-500 transition-colors" />
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 group-hover:text-teal-500 transition-colors">
                  {item.label}
                </span>
              </Link>
            ))}

            <div className="h-px bg-gray-100 dark:bg-gray-800 my-2 mx-2" />
            <button
              onClick={() => { setShowLogoutModal(true); setIsOpen(false); }}
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

      <LogoutModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogoutConfirm}
      />
    </div>
  )
}
