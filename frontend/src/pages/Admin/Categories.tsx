import { useEffect, useState } from 'react'
import { getCategories } from '@/api/categoryApi'
import { createCategory, updateCategory, deleteCategory } from '@/api/categoryAdminApi'
import { Plus, Edit3, Trash2, Save, X } from 'lucide-react'

export default function AdminCategories() {
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState<any>(null)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setCategories(await getCategories())
      } catch (err) {
        console.error('Failed to load categories', err)
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  const resetForm = () => {
    setActiveCategory(null)
    setName('')
    setDescription('')
    setError('')
  }

  const handleEdit = (category: any) => {
    setActiveCategory(category)
    setName(category.name)
    setDescription(category.description || '')
    setError('')
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this category?')) return

    try {
      await deleteCategory(id)
      setCategories((current) => current.filter((category) => category.id !== id))
    } catch (err) {
      console.error(err)
      setError('Could not delete category.')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim()) {
      setError('Category name is required.')
      return
    }

    try {
      if (activeCategory) {
        const updated = await updateCategory(activeCategory.id, { name, description })
        setCategories((current) => current.map((category) => (category.id === updated.id ? updated : category)))
      } else {
        const created = await createCategory({ name, description })
        setCategories((current) => [created, ...current])
      }
      resetForm()
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to save category.')
    }
  }

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-6">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-teal-600">Category management</p>
          <h1 className="mt-3 text-3xl font-black text-slate-900">Manage categories</h1>
          <p className="text-sm text-slate-500">Create, update, and delete document categories.</p>
        </div>
        <button
          onClick={resetForm}
          className="inline-flex items-center gap-2 rounded-3xl border border-slate-200 bg-slate-50 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100 transition-all"
        >
          <Plus size={16} /> New Category
        </button>
      </div>

      <div className="grid gap-6 xl:grid-cols-[420px_minmax(0,1fr)]">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Create / Edit category</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-semibold text-slate-700">Category name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-2 w-full rounded-3xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                placeholder="Enter category name"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-700">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mt-2 w-full min-h-[140px] rounded-3xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                placeholder="Add an optional category description"
              />
            </div>

            {error && <p className="text-sm text-rose-500">{error}</p>}

            <div className="flex flex-wrap gap-3">
              <button className="inline-flex items-center gap-2 rounded-3xl bg-teal-600 px-5 py-3 text-sm font-semibold text-white hover:bg-teal-700 transition-all">
                <Save size={16} /> {activeCategory ? 'Save Changes' : 'Create Category'}
              </button>
              {activeCategory && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="inline-flex items-center gap-2 rounded-3xl border border-slate-200 bg-slate-50 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100 transition-all"
                >
                  <X size={16} /> Cancel
                </button>
              )}
            </div>
          </form>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-900">Category list</h2>
            <span className="text-sm text-slate-500">{categories.length} items</span>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[...Array(4)].map((_, index) => (
                <div key={index} className="h-20 rounded-3xl bg-slate-100 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {categories.map((category) => (
                <div key={category.id} className="rounded-3xl border border-slate-100 bg-slate-50 p-4 flex items-start justify-between gap-4">
                  <div>
                    <p className="font-semibold text-slate-900">{category.name}</p>
                    <p className="text-sm text-slate-500">{category.description || 'No description'}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleEdit(category)}
                      className="rounded-3xl bg-white border border-slate-200 px-3 py-2 text-slate-700 hover:bg-slate-100 transition-all"
                    >
                      <Edit3 size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(category.id)}
                      className="rounded-3xl bg-white border border-rose-100 px-3 py-2 text-rose-600 hover:bg-rose-50 transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
