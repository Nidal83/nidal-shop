'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Pencil, Trash2, Eye, EyeOff } from 'lucide-react'

export default function ProductActions({
  productId,
  isActive,
}: {
  productId: string
  isActive: boolean
}) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleToggle() {
    setLoading(true)
    await fetch(`/api/admin/products/${productId}/toggle`, { method: 'PATCH' })
    router.refresh()
    setLoading(false)
  }

  async function handleDelete() {
    if (!confirm(`Delete product "${productId}"? This cannot be undone.`)) return
    setLoading(true)
    await fetch(`/api/admin/products/${productId}`, { method: 'DELETE' })
    router.refresh()
    setLoading(false)
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handleToggle}
        disabled={loading}
        title={isActive ? 'Hide product' : 'Show product'}
        className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-gray-400 hover:text-white transition-colors disabled:opacity-50"
      >
        {isActive ? <EyeOff size={15} /> : <Eye size={15} />}
      </button>
      <Link
        href={`/admin/products/${productId}/edit`}
        className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-gray-400 hover:text-white transition-colors"
      >
        <Pencil size={15} />
      </Link>
      <button
        onClick={handleDelete}
        disabled={loading}
        className="p-2 rounded-lg bg-zinc-800 hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition-colors disabled:opacity-50"
      >
        <Trash2 size={15} />
      </button>
    </div>
  )
}
