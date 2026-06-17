import { Home, Search, MessageSquare, User, Bell } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

export default function BottomNav() {
  const location = useLocation()
  const { token } = useAuthStore()

  const navItems = [
    { label: 'Home', path: '/', icon: Home },
    { label: 'Search', path: '/search', icon: Search },
    { label: 'Chat', path: '/messages', icon: MessageSquare },
    { label: 'Alerts', path: '/notifications', icon: Bell },
    { label: 'Profile', path: token ? '/profile' : '/login', icon: User },
  ]

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 px-6 py-3 flex justify-between items-center z-50 pb-safe shadow-[0_-4px_10px_rgba(0,0,0,0.03)] transition-colors">
      {navItems.map((item) => {
        const Icon = item.icon
        const isActive = location.pathname === item.path
        return (
          <Link
            key={item.label}
            to={item.path}
            className={`flex flex-col items-center gap-1 transition-all ${
              isActive ? 'text-primary scale-110' : 'text-gray-400 dark:text-gray-500'
            }`}
          >
            <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
            <span className={`text-[10px] font-bold uppercase tracking-widest ${isActive ? 'opacity-100' : 'opacity-0'}`}>
              {item.label}
            </span>
          </Link>
        )
      })}
    </div>
  )
}
