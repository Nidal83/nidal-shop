import { NextRequest, NextResponse } from 'next/server'
import { requireRole } from '@/lib/auth'

export async function PATCH(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { error, supabase } = await requireRole(['admin', 'sales'])
  if (error) return error

  const { data: product } = await supabase.from('products').select('is_active').eq('id', id).single()
  if (!product) return NextResponse.json({ error: 'Product not found' }, { status: 404 })

  const { data, error: dbError } = await supabase
    .from('products')
    .update({ is_active: !product.is_active })
    .eq('id', id)
    .select()
    .single()

  if (dbError) return NextResponse.json({ error: dbError.message }, { status: 500 })
  return NextResponse.json(data)
}
