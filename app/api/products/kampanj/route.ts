import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('products')
    .select('*, categories(name)')
    .eq('is_active', true)
    .not('kampanj_price', 'is', null)
    .order('kampanj_price', { ascending: true })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const products = data?.map((p) => ({
    ...p,
    category: (p as { categories?: { name: string } }).categories?.name ?? '',
    isKampanj: true,
  }))

  return NextResponse.json({ data: products })
}
