import { createClient } from '@/lib/supabase/server'
import { staticProducts } from '@/lib/products'
import { notFound } from 'next/navigation'
import ProductDetail from './ProductDetail'

export const revalidate = 60

export async function generateStaticParams() {
  return staticProducts.map((p) => ({ id: p.id }))
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  try {
    const supabase = await createClient()
    const { data } = await supabase.from('products').select('name, description').eq('id', id).single()
    if (data) return { title: `${data.name} — Nidal Watches`, description: data.description }
  } catch {}
  const fallback = staticProducts.find((p) => p.id === id)
  return fallback ? { title: `${fallback.name} — Nidal Watches`, description: fallback.description } : {}
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  let product = null
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('products')
      .select('*, categories(name)')
      .eq('id', id)
      .eq('is_active', true)
      .single()
    if (data) {
      product = { ...data, category: (data as { categories?: { name: string } }).categories?.name ?? '' }
    }
  } catch {}

  if (!product) {
    product = staticProducts.find((p) => p.id === id) ?? null
  }

  if (!product) notFound()
  return <ProductDetail product={product} />
}
