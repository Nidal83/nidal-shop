import { createClient } from '@/lib/supabase/server'
import CategoryManager from './CategoryManager'

export default async function AdminCategoriesPage() {
  const supabase = await createClient()
  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .order('name')

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-black uppercase tracking-tight text-white">Categories</h1>
        <p className="text-gray-400 mt-1">{categories?.length ?? 0} categories</p>
      </div>
      <CategoryManager initialCategories={categories ?? []} />
    </div>
  )
}
