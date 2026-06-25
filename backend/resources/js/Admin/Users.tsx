import { useEffect, useState } from 'react'
import { getAdminUsers, deleteAdminUser, toggleAdminUserStatus } from '@/api/adminApi'
import {
  Users,
  Trash2,
  RefreshCw,
  ShieldCheck,
  Search,
  Mail,
  Clock,
  Lock
} from 'lucide-react'

export default function AdminUsers() {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [page, setPage] = useState(1)
  const [lastPage, setLastPage] = useState(1)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getAdminUsers(page)
        setUsers(response.data || response || [])
        setLastPage(response.last_page || 1)
      } catch (error) {
        console.error('Failed to load users', error)
        setUsers([])
      } finally {
        setLoading(false)
      }
    }
    fetchUsers()
  }, [page])

  const handleToggle = async (id: number) => {
    try {
      await toggleAdminUserStatus(id)
      setUsers((current) =>
        current.map((user) =>
          user.id === id ? { ...user, role: user.role === 'admin' ? 'student' : 'admin' } : user,
        ),
      )
    } catch (error) {
      console.error('Toggle failed', error)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this user permanently from the mainframe?')) return
    try {
      await deleteAdminUser(id)
      setUsers((current) => current.filter((user) => user.id !== id))
    } catch (error) {
      console.error('Delete failed', error)
    }
  }

  const filteredUsers = users.filter(user =>
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-4">
        <div className="w-10 h-10 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Mapping Identity Nodes...</p>
      </div>
    )
  }

  return (
    <div className="space-y-10 animate-in fade-in zoom-in-95 duration-700">
      {/* Header Module */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-black text-white tracking-tighter">User Management</h1>
          <p className="text-[14px] font-medium text-slate-500">Audit system credentials, toggle privileges, or safely clear identities.</p>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-[40px] shadow-2xl overflow-hidden flex flex-col min-h-[500px]">
        {/* Table Filter Bar */}
        <div className="px-8 py-6 border-b border-slate-800 bg-slate-900/50 flex items-center justify-between gap-6">
            <div className="relative w-full max-w-sm">
              <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" />
              <input
                type="text"
                placeholder="Search by identity name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 bg-slate-950 border border-slate-800 focus:border-emerald-500/50 rounded-xl text-[12px] font-bold text-slate-200 outline-none transition-all shadow-inner"
              />
            </div>
            <div className="flex items-center gap-4 text-[10px] font-black text-slate-500 uppercase tracking-widest bg-slate-950 px-4 py-2 rounded-xl border border-slate-800">
                <span>Total Nodes: <span className="text-emerald-500">{filteredUsers.length}</span></span>
            </div>
        </div>

        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-900/80 border-b border-slate-800 text-[10px] font-black text-slate-600 uppercase tracking-[0.2em]">
                <th className="px-10 py-5">Mainframe Identity</th>
                <th className="px-10 py-5">Access Email</th>
                <th className="px-10 py-5">Tier</th>
                <th className="px-10 py-5">Expiry Node</th>
                <th className="px-10 py-5 text-right pr-12">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50 bg-slate-950/10">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-24 text-center">
                    <div className="w-12 h-12 bg-slate-900 border border-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-700">
                      <Users size={24} />
                    </div>
                    <p className="text-[11px] font-black text-slate-600 uppercase tracking-[0.2em]">No identity nodes discovered in this sector</p>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => {
                  const isAdmin = user.role?.toLowerCase() === 'admin';
                  return (
                    <tr key={user.id} className="hover:bg-slate-800/30 transition-all group">
                      <td className="px-10 py-6">
                        <div className="flex items-center gap-4 min-w-0">
                          <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 font-black text-[12px] border ${
                            isAdmin
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-lg shadow-emerald-950/40'
                              : 'bg-slate-900 text-slate-500 border-slate-800'
                          }`}>
                            {isAdmin ? <ShieldCheck size={18} /> : user.name?.[0].toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <span className="text-[14px] font-black text-slate-200 block group-hover:text-white transition-colors">{user.name}</span>
                            <span className="text-[10px] font-bold text-slate-600 uppercase tracking-tighter">UID: {user.id.toString().padStart(4, '0')}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-10 py-6">
                        <div className="flex items-center gap-2 text-slate-400 font-bold text-[13px] tracking-tight">
                          <Mail size={13} className="text-slate-700" />
                          <span>{user.email}</span>
                        </div>
                      </td>
                      <td className="px-10 py-6">
                        <span className={`inline-block px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border ${
                          user.is_premium ? 'bg-amber-400/10 text-amber-500 border-amber-500/20' : 'bg-slate-800 text-slate-500 border-slate-700'
                        }`}>
                          {user.is_premium ? 'Elite Node' : 'Standard'}
                        </span>
                      </td>
                      <td className="px-10 py-6">
                        {user.premium_until ? (
                            <div className="flex flex-col">
                                <div className="flex items-center gap-2 text-slate-400 font-bold text-[12px]">
                                    <Clock size={13} className="text-slate-700" />
                                    <span>{new Date(user.premium_until).toLocaleDateString()}</span>
                                </div>
                                {new Date(user.premium_until) < new Date() && (
                                    <span className="text-[8px] font-black text-rose-500 uppercase tracking-tighter mt-1">Node Expired</span>
                                )}
                            </div>
                        ) : (
                            <span className="text-[10px] font-bold text-slate-700 uppercase">Perpetual</span>
                        )}
                      </td>
                      <td className="px-10 py-6 text-right pr-12">
                         <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0">
                            <button
                              onClick={() => handleToggle(user.id)}
                              title={isAdmin ? "Demote Privilege" : "Elevate to Admin"}
                              className="p-2.5 bg-slate-900 border border-slate-800 hover:border-emerald-500/50 hover:bg-emerald-500/10 text-slate-500 hover:text-emerald-400 rounded-2xl transition-all shadow-xl"
                            >
                              <RefreshCw size={15} />
                            </button>
                            <button
                              onClick={() => handleDelete(user.id)}
                              title="Purge Identity"
                              className="p-2.5 bg-slate-900 border border-slate-800 hover:border-rose-500/50 hover:bg-rose-500/10 text-slate-500 hover:text-rose-400 rounded-2xl transition-all shadow-xl"
                            >
                              <Trash2 size={15} />
                            </button>
                         </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="px-10 py-5 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
           <div className="flex items-center gap-2">
              <Lock size={12} className="text-slate-700" />
              <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Encrypted Identity Database</p>
           </div>

           {lastPage > 1 && (
              <div className="flex items-center gap-2">
                  <button
                      disabled={page === 1}
                      onClick={() => setPage(p => p - 1)}
                      className="px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-[11px] font-black text-slate-400 hover:text-white disabled:opacity-20 transition-all"
                  >
                      « Previous
                  </button>

                  {[...Array(lastPage)].map((_, i) => {
                      const pageNum = i + 1;
                      if (pageNum === 1 || pageNum === lastPage || (pageNum >= page - 1 && pageNum <= page + 1)) {
                          return (
                              <button
                                  key={pageNum}
                                  onClick={() => setPage(pageNum)}
                                  className={`w-10 h-10 rounded-xl text-[11px] font-black transition-all ${
                                      page === pageNum ? 'bg-white text-slate-900 shadow-xl' : 'bg-slate-900 text-slate-500 border border-slate-800 hover:text-white'
                                  }`}
                              >
                                  {pageNum}
                              </button>
                          );
                      } else if (pageNum === page - 2 || pageNum === page + 2) {
                          return <span key={pageNum} className="text-slate-700">...</span>;
                      }
                      return null;
                  })}

                  <button
                      disabled={page === lastPage}
                      onClick={() => setPage(p => p + 1)}
                      className="px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-[11px] font-black text-slate-400 hover:text-white disabled:opacity-20 transition-all"
                  >
                      Next »
                  </button>
              </div>
           )}

           <p className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em] bg-emerald-500/5 px-4 py-1.5 rounded-full border border-emerald-500/10">Active Segments: {filteredUsers.length}</p>
        </div>
      </div>
    </div>
  )
}
