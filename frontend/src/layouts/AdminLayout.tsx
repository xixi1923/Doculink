import { NavLink, Outlet, Link, useNavigate } from 'react-router-dom'
import { ShieldCheck, Users, FileText, Layers, Home, Bell, User, Settings, LogOut } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useAuthStore } from '../store/authStore'
import { getAdminDashboard } from '@/api/adminApi'

const navItems = [
  { label: 'Dashboard', path: 'dashboard', icon: Home, statKey: 'users_count' },
  { label: 'Users', path: 'users', icon: Users, statKey: 'users_count' },
  { label: 'Documents', path: 'documents', icon: FileText, statKey: 'documents_count' },
  { label: 'Categories', path: 'categories', icon: Layers, statKey: 'categories_count' },
  { label: 'My Profile', path: 'profile', icon: User },
  { label: 'Security Settings', path: 'settings', icon: Settings },
]

export default function AdminLayout() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  const [stats, setStats] = useState<Record<string, number>>({})
  const [loadingStats, setLoadingStats] = useState(true)
  const [statsError, setStatsError] = useState<string | null>(null)

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  useEffect(() => {
    let isMounted = true
    getAdminDashboard()
      .then((dashboardData) => {
        if (!isMounted) return
        setStats(dashboardData.stats)
      })
      .catch((error) => {
        console.error('Failed to load admin stats', error)
        if (!isMounted) return
        setStatsError('Failed to load admin stats. Please refresh.')
      })
      .finally(() => {
        if (!isMounted) return
        setLoadingStats(false)
      })

    return () => {
      isMounted = false
    }
  }, [])

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="bg-gradient-to-r from-slate-900 via-teal-900 to-slate-900 text-white py-6 shadow-2xl">
        <div className="container mx-auto flex flex-col gap-4 md:flex-row md:items-center md:justify-between px-4">
          <div>
            <p className="text-sm uppercase tracking-[0.4em] text-teal-300 mb-2">Admin Console</p>
            <h1 className="text-3xl font-black tracking-tight">DocuLink Control Center</h1>
            <p className="mt-2 text-sm text-slate-300 max-w-2xl">
              Manage users, document approvals, and site analytics from one secure admin interface.
            </p>
          </div>
          <Link to="profile" className="rounded-3xl border border-white/10 bg-white/5 px-5 py-4 shadow-lg shadow-teal-950/20 max-w-sm hover:bg-white/10 transition-all group">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-teal-300">Signed in as</p>
                <p className="text-base font-semibold group-hover:text-teal-300 transition-colors">{user?.name || 'Administrator'}</p>
                <p className="text-sm text-slate-300 truncate">{user?.email}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-teal-500 text-white shadow-inner shadow-teal-900/30">
                <ShieldCheck size={20} />
              </div>
            </div>
          </Link>
        </div>
      </div>

      <div className="container mx-auto grid min-h-[calc(100vh-220px)] gap-6 xl:grid-cols-[300px_minmax(0,1fr)] px-4 py-8">
        <aside className="rounded-[32px] border border-slate-800 bg-slate-900/90 p-6 shadow-2xl shadow-slate-950/40 sticky top-6 self-start">
          <div className="mb-10">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-3xl bg-teal-500 text-slate-950 flex items-center justify-center text-xl font-black">
                A
              </div>
              <div>
                <p className="text-base font-black tracking-tight text-white">Admin Menu</p>
                <p className="text-xs text-slate-400">Core moderation tools</p>
              </div>
            </div>
          </div>

          <nav className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon
              const statValue = item.statKey ? stats[item.statKey] : undefined
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center justify-between gap-3 rounded-3xl px-4 py-3 text-sm font-semibold transition-all ${
                      isActive ? 'bg-teal-500 text-slate-950 shadow-lg shadow-teal-500/20' : 'text-slate-200 hover:bg-slate-800'
                    }`
                  }
                >
                  <span className="flex items-center gap-3">
                    <Icon size={18} className="text-teal-300" />
                    <span>{item.label}</span>
                  </span>
                  {statValue !== undefined && (
                    <span className="rounded-full bg-slate-800 px-2.5 py-1 text-[10px] uppercase tracking-[0.2em] text-slate-300">
                      {loadingStats ? '...' : statValue}
                    </span>
                  )}
                </NavLink>
              )
            })}

            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 rounded-3xl px-4 py-3 text-sm font-semibold text-rose-400 hover:bg-rose-500/10 transition-all mt-4"
            >
              <LogOut size={18} />
              <span>Sign Out</span>
            </button>
          </nav>
          {statsError && (
            <div className="mt-6 rounded-3xl border border-rose-500/20 bg-rose-950/90 p-4 text-sm text-rose-200">
              {statsError}
            </div>
          )}

          <div className="mt-8 rounded-3xl border border-teal-500/20 bg-slate-950/80 p-4">
            <div className="flex items-center gap-3 text-teal-300">
              <Bell size={18} />
              <p className="text-sm font-semibold uppercase tracking-[0.2em]">Admin Alerts</p>
            </div>
            <p className="mt-3 text-sm text-slate-400">
              New reports, risks, and moderation requests appear here. This section is reserved for site control actions only.
            </p>
          </div>
        </aside>

        <main className="rounded-[32px] border border-slate-800 bg-slate-900/95 p-8 shadow-2xl shadow-slate-950/40">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
