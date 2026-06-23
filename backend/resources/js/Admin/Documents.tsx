import { useEffect, useState } from 'react'
import { getAdminDocuments, approveAdminDocument, rejectAdminDocument, deleteAdminDocument } from '@/api/adminApi'
import { FileCheck, XCircle, Trash2, Clock, FileText } from 'lucide-react'

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
              <tr key={doc.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-5">
                  <div className="flex items-center gap-4 bg-slate-50/50 p-3 rounded-2xl border border-slate-100 w-fit pr-8">
                    <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 shrink-0">
                      <FileText size={20} />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="font-bold text-slate-900 truncate max-w-[200px] leading-tight">
                        {doc.title}
                        {doc.extension && !doc.title.endsWith(doc.extension) ? `.${doc.extension}` : ''}
                      </span>
                      <span className="text-[11px] font-medium text-slate-400 mt-0.5">
                        {doc.file_size || '125.85 KB'}
                      </span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <div className="flex flex-col">
                    <span className="font-semibold text-slate-900">{doc.user?.name || 'Unknown'}</span>
                    <span className="text-[10px] text-slate-400 uppercase tracking-widest">{doc.user?.email}</span>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-wider">
                    {doc.category?.name || 'General'}
                  </span>
                </td>
                <td className="px-6 py-5 text-center">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                    doc.status === 'pending' ? 'bg-amber-50 text-amber-600 border border-amber-100' :
                    doc.status === 'approved' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                    'bg-rose-50 text-rose-600 border border-rose-100'
                  }`}>
                    {doc.status}
                  </span>
                </td>
                <td className="px-6 py-5">
                  <div className="flex items-center gap-2">
                    {doc.status === 'pending' && (
                      <>
                        <button
                          onClick={() => updateDocument(doc.id, 'approve')}
                          className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                          title="Approve"
                        >
                          <FileCheck size={18} />
                        </button>
                        <button
                          onClick={() => updateDocument(doc.id, 'reject')}
                          className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Reject"
                        >
                          <XCircle size={18} />
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => updateDocument(doc.id, 'delete')}
                      className="p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-600 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
