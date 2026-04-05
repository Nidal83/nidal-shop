'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Category } from '@/lib/types'
import { Plus, Pencil, Trash2, Check, X } from 'lucide-react'

export default function CategoryManager({ initialCategories }: { initialCategories: Category[] }) {
  const router = useRouter()
  const [categories, setCategories] = useState(initialCategories)
  const [newName, setNewName] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleCreate() {
    if (!newName.trim()) return
    setLoading(true)
    const res = await fetch('/api/admin/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newName.trim() }),
    })
    const data = await res.json()
    if (res.ok) {
      setCategories((prev) => [...prev, data])
      setNewName('')
    }
    setLoading(false)
    router.refresh()
  }

  async function handleEdit(id: string) {
    if (!editName.trim()) return
    setLoading(true)
    const res = await fetch(`/api/admin/categories/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: editName.trim() }),
    })
    const data = await res.json()
    if (res.ok) {
      setCategories((prev) => prev.map((c) => (c.id === id ? data : c)))
      setEditingId(null)
    }
    setLoading(false)
    router.refresh()
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this category? Products will be unassigned.')) return
    setLoading(true)
    await fetch(`/api/admin/categories/${id}`, { method: 'DELETE' })
    setCategories((prev) => prev.filter((c) => c.id !== id))
    setLoading(false)
    router.refresh()
  }

  return (
    <div className="max-w-xl space-y-4">
      {/* Add new */}
      <div className="bg-zinc-900 rounded-2xl border border-white/10 p-5">
        <h2 className="text-white font-bold text-sm uppercase tracking-wider mb-4">Add Category</h2>
        <div className="flex gap-3">
          <input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
            placeholder="e.g. Limited Edition"
            className="flex-1 bg-zinc-800 border border-white/10 focus:border-orange-500 rounded-xl px-4 py-3 text-white placeholder-gray-600 outline-none transition-colors text-sm"
          />
          <button
            onClick={handleCreate}
            disabled={loading || !newName.trim()}
            className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-bold px-5 py-3 rounded-xl transition-colors text-sm"
          >
            <Plus size={16} /> Add
          </button>
        </div>
      </div>

      {/* List */}
      <div className="bg-zinc-900 rounded-2xl border border-white/10 overflow-hidden">
        {categories.length === 0 ? (
          <p className="text-gray-500 text-sm p-6 text-center">No categories yet.</p>
        ) : (
          <ul className="divide-y divide-white/5">
            {categories.map((cat) => (
              <li key={cat.id} className="flex items-center gap-4 px-5 py-4">
                {editingId === cat.id ? (
                  <>
                    <input
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleEdit(cat.id)}
                      autoFocus
                      className="flex-1 bg-zinc-800 border border-orange-500 rounded-xl px-3 py-2 text-white outline-none text-sm"
                    />
                    <button onClick={() => handleEdit(cat.id)} disabled={loading}
                      className="p-2 text-green-400 hover:text-green-300 transition-colors">
                      <Check size={16} />
                    </button>
                    <button onClick={() => setEditingId(null)}
                      className="p-2 text-gray-500 hover:text-white transition-colors">
                      <X size={16} />
                    </button>
                  </>
                ) : (
                  <>
                    <div className="flex-1">
                      <p className="text-white font-medium text-sm">{cat.name}</p>
                      <p className="text-gray-600 text-xs font-mono">{cat.slug}</p>
                    </div>
                    <button onClick={() => { setEditingId(cat.id); setEditName(cat.name) }}
                      className="p-2 text-gray-500 hover:text-white transition-colors">
                      <Pencil size={15} />
                    </button>
                    <button onClick={() => handleDelete(cat.id)} disabled={loading}
                      className="p-2 text-gray-500 hover:text-red-400 transition-colors">
                      <Trash2 size={15} />
                    </button>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
