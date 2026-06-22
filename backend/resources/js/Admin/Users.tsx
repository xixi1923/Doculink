import { useEffect, useState } from 'react'
import { getAdminUsers, deleteAdminUser, toggleAdminUserStatus } from '@/api/adminApi'
import { Users, Trash2, RefreshCw } from 'lucide-react'

export default function AdminUsers() {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setUsers(await getAdminUsers())
      } catch (error) {
        console.error('Failed to load users', error)
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

  const handleToggle = async (id: number) => {
    try {
      await toggleAdminUserStatus(id)
      setUsers((current) =>
        current.map((user) =>
          user.id === id ? { ...user, role: user.role === 'admin' ? 'student' : user.role } : user,
        ),
      )
    } catch (error) {
      console.error('Toggle failed', error)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this user?')) return
    try {
      await deleteAdminUser(id)
      setUsers((current) => current.filter((user) => user.id !== id))
    } catch (error) {
      console.error('Delete failed', error)
    }
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto py-20 px-4 text-center">
        <div className="animate-spin w-10 h-10 border-4 border-teal-500 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Loading users...</p>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-6">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-teal-600">User management</p>
          <h1 className="mt-3 text-3xl font-black text-slate-900">Manage registered users</h1>
        </div>
      </div>

      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-slate-200 text-left text-sm text-slate-600">
          <thead className="bg-slate-50 text-[10px] uppercase tracking-[0.2em] text-slate-400">
            <tr>
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Email</th>
              <th className="px-6 py-4">Role</th>
              <th className="px-6 py-4">Joined</th>
              <th className="px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-slate-50">
                <td className="px-6 py-4 font-semibold text-slate-900">{user.name}</td>
                <td className="px-6 py-4">{user.email}</td>
                <td className="px-6 py-4 uppercase tracking-[0.1em]">{user.role}</td>
                <td className="px-6 py-4">{new Date(user.created_at).toLocaleDateString()}</td>
                <td className="px-6 py-4 flex flex-wrap gap-2">
                  <button
                    onClick={() => handleToggle(user.id)}
                    className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold uppercase tracking-[0.2em] text-slate-600 hover:bg-slate-100 transition-all"
                  >
                    <RefreshCw size={14} />
                    {user.role === 'admin' ? 'Demote' : 'Promote'}
                  </button>
                  <button
                    onClick={() => handleDelete(user.id)}
                    className="inline-flex items-center gap-2 rounded-2xl border border-rose-100 bg-rose-50 px-3 py-2 text-xs font-bold uppercase tracking-[0.2em] text-rose-600 hover:bg-rose-100 transition-all"
                  >
                    <Trash2 size={14} />
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
