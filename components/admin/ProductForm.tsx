'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Category, Product } from '@/lib/types'
import { Plus, X } from 'lucide-react'

interface Props {
  categories: Category[]
  product?: Partial<Product>
  mode: 'create' | 'edit'
}

export default function ProductForm({ categories, product, mode }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [form, setForm] = useState({
    id: product?.id ?? '',
    name: product?.name ?? '',
    tagline: product?.tagline ?? '',
    description: product?.description ?? '',
    price: product?.price?.toString() ?? '',
    kampanj_price: product?.kampanj_price?.toString() ?? '',
    category_id: product?.category_id ?? '',
    brand: product?.brand ?? '',
    stock: product?.stock?.toString() ?? '0',
    images: product?.images ?? [''],
    features: product?.features ?? [''],
    is_active: product?.is_active ?? true,
  })

  function setField<K extends keyof typeof form>(key: K, value: typeof form[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  function updateImage(i: number, val: string) {
    const imgs = [...form.images]
    imgs[i] = val
    setField('images', imgs)
  }

  function updateFeature(i: number, val: string) {
    const feats = [...form.features]
    feats[i] = val
    setField('features', feats)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const body = {
      ...form,
      price: parseFloat(form.price),
      kampanj_price: form.kampanj_price ? parseFloat(form.kampanj_price) : null,
      stock: parseInt(form.stock),
      images: form.images.filter(Boolean),
      features: form.features.filter(Boolean),
      category_id: form.category_id || null,
    }

    const url = mode === 'create' ? '/api/admin/products' : `/api/admin/products/${product!.id}`
    const method = mode === 'create' ? 'POST' : 'PUT'

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    const data = await res.json()
    if (!res.ok) {
      setError(data.error ?? 'Something went wrong')
      setLoading(false)
      return
    }

    router.push('/admin/products')
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
      {/* ID — only for create */}
      {mode === 'create' && (
        <Field label="Product ID (slug, e.g. nidal-elite)">
          <input
            required
            value={form.id}
            onChange={(e) => setField('id', e.target.value.toLowerCase().replace(/\s+/g, '-'))}
            placeholder="nidal-elite"
            className={inputCls}
          />
        </Field>
      )}

      <div className="grid grid-cols-2 gap-4">
        <Field label="Name">
          <input required value={form.name} onChange={(e) => setField('name', e.target.value)} placeholder="Nidal Elite" className={inputCls} />
        </Field>
        <Field label="Brand">
          <input value={form.brand} onChange={(e) => setField('brand', e.target.value)} placeholder="Nidal" className={inputCls} />
        </Field>
      </div>

      <Field label="Tagline">
        <input value={form.tagline} onChange={(e) => setField('tagline', e.target.value)} placeholder="Bold. Iconic." className={inputCls} />
      </Field>

      <Field label="Description">
        <textarea
          rows={4}
          value={form.description}
          onChange={(e) => setField('description', e.target.value)}
          placeholder="Product description..."
          className={inputCls + ' resize-none'}
        />
      </Field>

      <div className="grid grid-cols-3 gap-4">
        <Field label="Price ($)">
          <input required type="number" step="0.01" min="0" value={form.price} onChange={(e) => setField('price', e.target.value)} placeholder="349.00" className={inputCls} />
        </Field>
        <Field label="Kampanj Price ($) — optional">
          <input type="number" step="0.01" min="0" value={form.kampanj_price} onChange={(e) => setField('kampanj_price', e.target.value)} placeholder="249.00" className={inputCls} />
        </Field>
        <Field label="Stock">
          <input required type="number" min="0" value={form.stock} onChange={(e) => setField('stock', e.target.value)} placeholder="50" className={inputCls} />
        </Field>
      </div>

      <Field label="Category">
        <select value={form.category_id} onChange={(e) => setField('category_id', e.target.value)} className={inputCls}>
          <option value="">— No category —</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </Field>

      {/* Images */}
      <div>
        <label className="block text-gray-400 text-sm font-medium mb-2">Images (URLs)</label>
        <div className="space-y-2">
          {form.images.map((img, i) => (
            <div key={i} className="flex gap-2">
              <input
                value={img}
                onChange={(e) => updateImage(i, e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className={inputCls + ' flex-1'}
              />
              {form.images.length > 1 && (
                <button type="button" onClick={() => setField('images', form.images.filter((_, j) => j !== i))}
                  className="p-2 text-gray-500 hover:text-red-400 transition-colors">
                  <X size={16} />
                </button>
              )}
            </div>
          ))}
          <button type="button" onClick={() => setField('images', [...form.images, ''])}
            className="flex items-center gap-1 text-orange-400 hover:text-orange-300 text-sm transition-colors">
            <Plus size={14} /> Add image
          </button>
        </div>
      </div>

      {/* Features */}
      <div>
        <label className="block text-gray-400 text-sm font-medium mb-2">Features</label>
        <div className="space-y-2">
          {form.features.map((feat, i) => (
            <div key={i} className="flex gap-2">
              <input
                value={feat}
                onChange={(e) => updateFeature(i, e.target.value)}
                placeholder="Sapphire crystal glass"
                className={inputCls + ' flex-1'}
              />
              {form.features.length > 1 && (
                <button type="button" onClick={() => setField('features', form.features.filter((_, j) => j !== i))}
                  className="p-2 text-gray-500 hover:text-red-400 transition-colors">
                  <X size={16} />
                </button>
              )}
            </div>
          ))}
          <button type="button" onClick={() => setField('features', [...form.features, ''])}
            className="flex items-center gap-1 text-orange-400 hover:text-orange-300 text-sm transition-colors">
            <Plus size={14} /> Add feature
          </button>
        </div>
      </div>

      {/* Visibility */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => setField('is_active', !form.is_active)}
          className={`relative w-12 h-6 rounded-full transition-colors ${form.is_active ? 'bg-orange-500' : 'bg-zinc-700'}`}
        >
          <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${form.is_active ? 'left-7' : 'left-1'}`} />
        </button>
        <span className="text-gray-300 text-sm">{form.is_active ? 'Active (visible in store)' : 'Hidden from store'}</span>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl px-4 py-3 text-sm">{error}</div>
      )}

      <div className="flex gap-4">
        <button
          type="submit"
          disabled={loading}
          className="bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-bold px-8 py-3 rounded-xl transition-colors"
        >
          {loading ? 'Saving...' : mode === 'create' ? 'Create Product' : 'Save Changes'}
        </button>
        <button type="button" onClick={() => router.back()}
          className="bg-zinc-800 hover:bg-zinc-700 text-gray-300 font-semibold px-8 py-3 rounded-xl transition-colors">
          Cancel
        </button>
      </div>
    </form>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-gray-400 text-sm font-medium mb-2">{label}</label>
      {children}
    </div>
  )
}

const inputCls = 'w-full bg-zinc-800 border border-white/10 focus:border-orange-500 rounded-xl px-4 py-3 text-white placeholder-gray-600 outline-none transition-colors'
