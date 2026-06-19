import { useEffect, useState } from 'react'
import { getAdminDocuments, approveAdminDocument, rejectAdminDocument, deleteAdminDocument } from '@/api/adminApi'
import { FileCheck, XCircle, Trash2, Clock } from 'lucide-react'

export default function AdminDocuments() {
  const [documents, setDocuments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        setDocuments(await getAdminDocuments())
      } catch (error) {
        console.error('Failed to load documents', error)
      } finally {
        setLoading(false)
      }
    }

    fetchDocuments()
  }, [])

  const updateDocument = async (id: number, action: 'approve' | 'reject' | 'delete') => {
    try {
      if (action === 'approve') await approveAdminDocument(id)
      if (action === 'reject') await rejectAdminDocument(id)
      if (action === 'delete') await deleteAdminDocument(id)

      setDocuments((current) => current.filter((doc) => doc.id !== id))
    } catch (error) {
      console.error('Action failed', error)
    }
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto py-20 px-4 text-center">
        <div className="animate-spin w-10 h-10 border-4 border-teal-500 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Loading documents...</p>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-6">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-teal-600">Document moderation</p>
          <h1 className="mt-3 text-3xl font-black text-slate-900">Review uploaded resources</h1>
        </div>
      </div>

      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-slate-200 text-left text-sm text-slate-600">
          <thead className="bg-slate-50 text-[10px] uppercase tracking-[0.2em] text-slate-400">
            <tr>
              <th className="px-6 py-4">Title</th>
              <th className="px-6 py-4">Uploader</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {documents.map((doc) => (
              <tr key={doc.id} className="hover:bg-slate-50">
                <td className="px-6 py-4 font-semibold text-slate-900">{doc.title}</td>
                <td className="px-6 py-4">{doc.user?.name || 'Unknown'}</td>
                <td className="px-6 py-4">{doc.category?.name || 'None'}</td>
                <td className="px-6 py-4 uppercase tracking-[0.1em]">{doc.status}</td>
                <td className="px-6 py-4 flex flex-wrap gap-2">
                  <button
                    onClick={() => updateDocument(doc.id, 'approve')}
                    className="inline-flex items-center gap-2 rounded-2xl border border-emerald-100 bg-emerald-50 px-3 py-2 text-xs font-bold uppercase tracking-[0.2em] text-emerald-600 hover:bg-emerald-100 transition-all"
                  >
                    <FileCheck size={14} /> Approve
                  </button>
                  <button
                    onClick={() => updateDocument(doc.id, 'reject')}
                    className="inline-flex items-center gap-2 rounded-2xl border border-amber-100 bg-amber-50 px-3 py-2 text-xs font-bold uppercase tracking-[0.2em] text-amber-600 hover:bg-amber-100 transition-all"
                  >
                    <XCircle size={14} /> Reject
                  </button>
                  <button
                    onClick={() => updateDocument(doc.id, 'delete')}
                    className="inline-flex items-center gap-2 rounded-2xl border border-rose-100 bg-rose-50 px-3 py-2 text-xs font-bold uppercase tracking-[0.2em] text-rose-600 hover:bg-rose-100 transition-all"
                  >
                    <Trash2 size={14} /> Delete
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
