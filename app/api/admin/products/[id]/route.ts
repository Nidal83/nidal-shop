import { NextRequest, NextResponse } from 'next/server'
import { requireRole } from '@/lib/auth'

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { error, supabase } = await requireRole(['admin', 'sales'])
  if (error) return error

  const body = await req.json()
  const { name, tagline, description, price, kampanj_price, category_id, brand, stock, images, features, is_active } = body

  const { data, error: dbError } = await supabase
    .from('products')
    .update({ name, tagline, description, price, kampanj_price, category_id, brand, stock, images, features, is_active })
    .eq('id', id)
    .select()
    .single()

  if (dbError) return NextResponse.json({ error: dbError.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { error, role, supabase } = await requireRole(['admin', 'sales'])
  if (error) return error

  // Only admins can delete
  if (role !== 'admin') {
    return NextResponse.json({ error: 'Only admins can delete products' }, { status: 403 })
  }

  const { error: dbError } = await supabase.from('products').delete().eq('id', id)
  if (dbError) return NextResponse.json({ error: dbError.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
