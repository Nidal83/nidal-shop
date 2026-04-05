import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import Image from 'next/image'
import { Plus } from 'lucide-react'
import ProductActions from './ProductActions'

const PAGE_SIZE = 10

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>
}) {
  const { page: pageStr } = await searchParams
  const page = Math.max(1, parseInt(pageStr ?? '1'))
  const from = (page - 1) * PAGE_SIZE
  const to = from + PAGE_SIZE - 1

  const supabase = await createClient()
  const { data: products, count } = await supabase
    .from('products')
    .select('*, categories(name)', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to)

  const totalPages = Math.ceil((count ?? 0) / PAGE_SIZE)

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tight text-white">Products</h1>
          <p className="text-gray-400 mt-1">{count ?? 0} total products</p>
        </div>
        <Link
          href="/admin/products/new"
          className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold px-5 py-3 rounded-xl transition-colors"
        >
          <Plus size={18} /> Add Product
        </Link>
      </div>

      <div className="bg-zinc-900 rounded-2xl border border-white/10 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10 text-left">
              <th className="px-6 py-4 text-gray-400 text-xs uppercase tracking-wider font-semibold">Product</th>
              <th className="px-4 py-4 text-gray-400 text-xs uppercase tracking-wider font-semibold">Price</th>
              <th className="px-4 py-4 text-gray-400 text-xs uppercase tracking-wider font-semibold">Kampanj</th>
              <th className="px-4 py-4 text-gray-400 text-xs uppercase tracking-wider font-semibold">Stock</th>
              <th className="px-4 py-4 text-gray-400 text-xs uppercase tracking-wider font-semibold">Status</th>
              <th className="px-4 py-4 text-gray-400 text-xs uppercase tracking-wider font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {products?.map((product) => (
              <tr key={product.id} className="hover:bg-white/2 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-zinc-800 shrink-0">
                      {product.images?.[0] && (
                        <Image
                          src={product.images[0]}
                          alt={product.name}
                          fill
                          className="object-cover"
                          sizes="48px"
                        />
                      )}
                    </div>
                    <div>
                      <p className="text-white font-semibold text-sm">{product.name}</p>
                      <p className="text-gray-500 text-xs">{(product as { categories?: { name: string } }).categories?.name ?? '—'}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4 text-white font-semibold text-sm">${product.price}</td>
                <td className="px-4 py-4">
                  {product.kampanj_price ? (
                    <span className="text-pink-400 font-semibold text-sm">${product.kampanj_price}</span>
                  ) : (
                    <span className="text-gray-600 text-sm">—</span>
                  )}
                </td>
                <td className="px-4 py-4 text-gray-300 text-sm">{product.stock}</td>
                <td className="px-4 py-4">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                    product.is_active
                      ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                      : 'bg-zinc-700 text-gray-400 border border-white/10'
                  }`}>
                    {product.is_active ? 'Active' : 'Hidden'}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <ProductActions productId={product.id} isActive={product.is_active} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-white/10 flex items-center justify-between">
            <p className="text-gray-400 text-sm">Page {page} of {totalPages}</p>
            <div className="flex gap-2">
              {page > 1 && (
                <Link
                  href={`/admin/products?page=${page - 1}`}
                  className="px-3 py-1 rounded-lg bg-zinc-800 text-gray-300 hover:text-white text-sm transition-colors"
                >
                  Previous
                </Link>
              )}
              {page < totalPages && (
                <Link
                  href={`/admin/products?page=${page + 1}`}
                  className="px-3 py-1 rounded-lg bg-zinc-800 text-gray-300 hover:text-white text-sm transition-colors"
                >
                  Next
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
