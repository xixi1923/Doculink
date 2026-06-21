import { useEffect, useState } from 'react'
import { getAdminDashboard } from '@/api/adminApi'
import { Activity, FolderOpen, Users, Layers, CheckCircle2, Clock, XCircle, BookOpen, Building2 } from 'lucide-react'

export default function AdminDashboard() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    setLoading(true)
    setError(null)
    try {
      const dashboard = await getAdminDashboard()
      setData(dashboard)
    } catch (err) {
      console.error('Failed to load admin dashboard', err)
      setError('Unable to load dashboard data. Please refresh or check your permissions.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto py-20 px-4 text-center">
        <div className="animate-spin w-10 h-10 border-4 border-teal-500 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Loading admin dashboard...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto py-20 px-4 text-center">
        <p className="text-slate-600 font-bold mb-4">{error}</p>
        <button
          onClick={fetchData}
          className="rounded-3xl bg-teal-600 px-5 py-3 text-sm font-semibold text-white hover:bg-teal-700 transition-all"
        >
          Retry
        </button>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="max-w-7xl mx-auto py-20 px-4 text-center">
        <p className="text-slate-600 font-bold">Unable to load dashboard data.</p>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8 space-y-8">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-teal-600">Admin Panel</p>
          <h1 className="mt-3 text-3xl font-black text-slate-900">Site overview</h1>
          <p className="text-sm text-slate-500">Manage users, documents, and categories from one place.</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {[
          { label: 'Users', value: data.stats.users_count, icon: Users },
          { label: 'Documents', value: data.stats.documents_count, icon: FolderOpen },
          { label: 'Books', value: data.stats.books_count, icon: BookOpen },
          { label: 'Universities', value: data.stats.universities_count, icon: Building2 },
          { label: 'Approved', value: data.stats.approved_documents, icon: CheckCircle2 },
        ].map((item) => (
          <div key={item.label} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-slate-500 uppercase tracking-[0.2em]">{item.label}</p>
                <p className="mt-4 text-3xl font-black text-slate-900">{item.value}</p>
              </div>
              <div className="rounded-3xl bg-teal-500/10 text-teal-600 p-4">
                <item.icon size={24} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4 text-slate-500">
            <Activity size={18} />
            <p className="text-sm font-semibold uppercase tracking-[0.2em]">Recent activity</p>
          </div>
          <div className="space-y-3">
            <div className="rounded-3xl border border-slate-100 bg-slate-50 p-4">
              <p className="text-slate-900 font-semibold">Pending documents</p>
              <p className="mt-2 text-2xl font-black text-teal-600">{data.stats.pending_documents}</p>
            </div>
            <div className="rounded-3xl border border-slate-100 bg-slate-50 p-4">
              <p className="text-slate-900 font-semibold">Rejected documents</p>
              <p className="mt-2 text-2xl font-black text-rose-500">{data.stats.rejected_documents}</p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4 text-slate-500">
            <Clock size={18} />
            <p className="text-sm font-semibold uppercase tracking-[0.2em]">Recent uploads</p>
          </div>
          <div className="space-y-4">
            {data.recent_documents.length === 0 ? (
              <p className="text-sm text-slate-500">No recent documents found.</p>
            ) : (
              data.recent_documents.map((doc: any) => (
                <div key={doc.id} className="rounded-3xl border border-slate-100 p-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="font-bold text-slate-900">{doc.title}</p>
                      <p className="text-sm text-slate-500">{doc.user?.name || 'Unknown uploader'} · {doc.category?.name || 'Uncategorized'}</p>
                    </div>
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{doc.status}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
