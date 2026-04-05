import { createClient } from '@/lib/supabase/server'
import ProductForm from '@/components/admin/ProductForm'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default async function NewProductPage() {
  const supabase = await createClient()
  const { data: categories } = await supabase.from('categories').select('*').order('name')

  return (
    <div>
      <Link href="/admin/products" className="inline-flex items-center gap-2 text-gray-400 hover:text-white text-sm mb-6 transition-colors">
        <ArrowLeft size={16} /> Back to Products
      </Link>
      <h1 className="text-3xl font-black uppercase tracking-tight text-white mb-8">New Product</h1>
      <ProductForm categories={categories ?? []} mode="create" />
    </div>
  )
}
