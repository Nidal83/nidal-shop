import { createClient } from '@/lib/supabase/server'
import ProductForm from '@/components/admin/ProductForm'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const [{ data: product }, { data: categories }] = await Promise.all([
    supabase.from('products').select('*').eq('id', id).single(),
    supabase.from('categories').select('*').order('name'),
  ])

  if (!product) notFound()

  return (
    <div>
      <Link href="/admin/products" className="inline-flex items-center gap-2 text-gray-400 hover:text-white text-sm mb-6 transition-colors">
        <ArrowLeft size={16} /> Back to Products
      </Link>
      <h1 className="text-3xl font-black uppercase tracking-tight text-white mb-8">
        Edit: {product.name}
      </h1>
      <ProductForm categories={categories ?? []} product={product} mode="edit" />
    </div>
  )
}
