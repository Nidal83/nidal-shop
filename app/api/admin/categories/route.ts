import { NextRequest, NextResponse } from 'next/server'
import { requireRole } from '@/lib/auth'

export async function GET() {
  const { error, supabase } = await requireRole(['admin', 'sales'])
  if (error) return error

  const { data, error: dbError } = await supabase.from('categories').select('*').order('name')
  if (dbError) return NextResponse.json({ error: dbError.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  const { error, supabase } = await requireRole(['admin', 'sales'])
  if (error) return error

  const { name } = await req.json()
  if (!name?.trim()) return NextResponse.json({ error: 'Name is required' }, { status: 400 })

  const slug = name.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')

  const { data, error: dbError } = await supabase
    .from('categories')
    .insert({ name: name.trim(), slug })
    .select()
    .single()

  if (dbError) return NextResponse.json({ error: dbError.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}
