import { Link, useLocation } from 'react-router-dom'
import { Bell, MessageSquare } from 'lucide-react'
import { useAuthStore } from '../store/authStore'
import CreateMenu from './CreateMenu'
import UserDropdown from './UserDropdown'
import ThemeToggle from './ThemeToggle'

export default function Navbar() {
  const location = useLocation()
  const { token } = useAuthStore()

  const navLinks = [
    { label: 'Documents', path: '/search' },
    { label: 'Books', path: '/books' },
    { label: 'Universities', path: '/universities' },
    { label: 'Trending', path: '/trending' },
  ]

  return (
    <nav className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm border-b dark:border-gray-800 sticky top-0 z-50 transition-all duration-300">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between gap-8">
        <div className="flex items-center gap-12">
          <Link to="/" className="text-2xl font-black text-primary flex-shrink-0 tracking-tighter flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/20">
              D
            </div>
            DocuLink
          </Link>

          <div className="hidden xl:flex items-center gap-8 text-[11px] font-black uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.path}
                className={`transition-all hover:text-primary relative group ${
                  location.pathname === link.path ? 'text-primary' : ''
                }`}
              >
                {link.label}
                <span className={`absolute -bottom-2 left-0 h-0.5 bg-primary rounded-full transition-all duration-300 ${
                  location.pathname === link.path ? 'w-full' : 'w-0 group-hover:w-full'
                }`} />
              </Link>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4 md:gap-8 flex-shrink-0">
          <ThemeToggle />

          {token ? (
            <div className="flex items-center gap-4 md:gap-6">
              <CreateMenu />
              <div className="flex items-center gap-1">
                <Link
                  to="/messages"
                  className="text-gray-400 dark:text-gray-500 hover:text-primary relative p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl transition-all"
                >
                  <MessageSquare size={22} />
                  <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-primary border-2 border-white dark:border-gray-900 rounded-full"></span>
                </Link>
                <Link
                  to="/notifications"
                  className="text-gray-400 dark:text-gray-500 hover:text-primary relative p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl transition-all"
                >
                  <Bell size={22} />
                  <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-red-500 border-2 border-white dark:border-gray-900 rounded-full"></span>
                </Link>
              </div>
              <div className="h-8 w-px bg-gray-100 dark:bg-gray-800 hidden md:block"></div>
              <UserDropdown />
            </div>
          ) : (
            <div className="flex items-center gap-4 md:gap-6">
              <Link to="/login" className="text-gray-500 dark:text-gray-400 hover:text-primary font-black text-xs uppercase tracking-widest transition-colors">
                Log in
              </Link>
              <Link
                to="/register"
                className="bg-primary text-white px-8 py-3 rounded-2xl hover:bg-primary-dark transition-all font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-105 active:scale-95"
              >
                Join for free
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
