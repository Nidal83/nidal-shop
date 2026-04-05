import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('products')
    .select('*, categories(name)')
    .eq('id', id)
    .eq('is_active', true)
    .single()

  if (error || !data) return NextResponse.json({ error: 'Product not found' }, { status: 404 })

  return NextResponse.json({
    ...data,
    category: (data as { categories?: { name: string } }).categories?.name ?? '',
  })
}
