import { NextRequest, NextResponse } from 'next/server'
import { requireRole } from '@/lib/auth'

export async function GET(req: NextRequest) {
  const { error, supabase } = await requireRole(['admin', 'sales'])
  if (error) return error

  const page = parseInt(req.nextUrl.searchParams.get('page') ?? '1')
  const limit = parseInt(req.nextUrl.searchParams.get('limit') ?? '10')
  const from = (page - 1) * limit
  const to = from + limit - 1

  const { data, count, error: dbError } = await supabase
    .from('products')
    .select('*, categories(name)', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to)

  if (dbError) return NextResponse.json({ error: dbError.message }, { status: 500 })
  return NextResponse.json({ data, count, page, limit })
}

export async function POST(req: NextRequest) {
  const { error, supabase } = await requireRole(['admin', 'sales'])
  if (error) return error

  const body = await req.json()
  const { id, name, tagline, description, price, kampanj_price, category_id, brand, stock, images, features, is_active } = body

  if (!id || !name || !price) {
    return NextResponse.json({ error: 'id, name and price are required' }, { status: 400 })
  }

  const { data, error: dbError } = await supabase
    .from('products')
    .insert({ id, name, tagline, description, price, kampanj_price, category_id, brand, stock, images, features, is_active })
    .select()
    .single()

  if (dbError) return NextResponse.json({ error: dbError.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}
