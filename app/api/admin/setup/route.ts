import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/service'

// One-time admin setup endpoint
// POST /api/admin/setup with { email, password, secret }
// Only works if no admin exists yet
export async function POST(req: NextRequest) {
  const { email, password, secret } = await req.json()

  if (secret !== process.env.ADMIN_SETUP_SECRET) {
    return NextResponse.json({ error: 'Invalid setup secret' }, { status: 403 })
  }

  const supabase = createServiceClient()

  // Check if any admin already exists
  const { data: existing } = await supabase
    .from('profiles')
    .select('id')
    .eq('role', 'admin')
    .limit(1)

  if (existing && existing.length > 0) {
    return NextResponse.json({ error: 'Admin already exists' }, { status: 409 })
  }

  // Create auth user
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  })

  if (authError) {
    return NextResponse.json({ error: authError.message }, { status: 500 })
  }

  // Promote to admin
  const { error: profileError } = await supabase
    .from('profiles')
    .update({ role: 'admin' })
    .eq('id', authData.user.id)

  if (profileError) {
    return NextResponse.json({ error: profileError.message }, { status: 500 })
  }

  return NextResponse.json({ success: true, message: `Admin created: ${email}` })
}
