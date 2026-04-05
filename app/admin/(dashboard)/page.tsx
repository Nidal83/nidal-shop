import { createClient } from '@/lib/supabase/server'
import { Package, Tag, Users, TrendingUp } from 'lucide-react'

async function getStats() {
  const supabase = await createClient()
  const [products, categories, users, kampanj] = await Promise.all([
    supabase.from('products').select('id, is_active', { count: 'exact' }),
    supabase.from('categories').select('id', { count: 'exact' }),
    supabase.from('profiles').select('id', { count: 'exact' }),
    supabase.from('products').select('id').not('kampanj_price', 'is', null).eq('is_active', true),
  ])
  return {
    totalProducts: products.count ?? 0,
    activeProducts: products.data?.filter((p) => p.is_active).length ?? 0,
    totalCategories: categories.count ?? 0,
    totalUsers: users.count ?? 0,
    kampanjProducts: kampanj.data?.length ?? 0,
  }
}

export default async function AdminDashboardPage() {
  const stats = await getStats()

  const cards = [
    { label: 'Total Products', value: stats.totalProducts, sub: `${stats.activeProducts} active`, icon: <Package size={24} />, color: 'text-orange-400' },
    { label: 'Categories', value: stats.totalCategories, sub: 'product categories', icon: <Tag size={24} />, color: 'text-blue-400' },
    { label: 'Users', value: stats.totalUsers, sub: 'registered users', icon: <Users size={24} />, color: 'text-green-400' },
    { label: 'Kampanj Active', value: stats.kampanjProducts, sub: 'on sale now', icon: <TrendingUp size={24} />, color: 'text-pink-400' },
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-black uppercase tracking-tight text-white">Dashboard</h1>
        <p className="text-gray-400 mt-1">Welcome back to Nidal Admin</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {cards.map((card) => (
          <div key={card.label} className="bg-zinc-900 rounded-2xl border border-white/10 p-6">
            <div className={`mb-3 ${card.color}`}>{card.icon}</div>
            <div className="text-3xl font-black text-white mb-1">{card.value}</div>
            <div className="text-white font-semibold text-sm">{card.label}</div>
            <div className="text-gray-500 text-xs mt-1">{card.sub}</div>
          </div>
        ))}
      </div>

      <div className="bg-zinc-900 rounded-2xl border border-white/10 p-6">
        <h2 className="text-white font-bold uppercase tracking-wider text-sm mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { href: '/admin/products/new', label: 'Add Product', color: 'bg-orange-500 hover:bg-orange-600' },
            { href: '/admin/categories', label: 'Manage Categories', color: 'bg-zinc-700 hover:bg-zinc-600' },
            { href: '/admin/users', label: 'Manage Users', color: 'bg-zinc-700 hover:bg-zinc-600' },
          ].map((action) => (
            <a
              key={action.href}
              href={action.href}
              className={`${action.color} text-white font-semibold text-sm py-3 px-4 rounded-xl transition-colors text-center`}
            >
              {action.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
