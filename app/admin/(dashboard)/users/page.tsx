import { createClient } from '@/lib/supabase/server'
import UsersManager from './UsersManager'

export default async function AdminUsersPage() {
  const supabase = await createClient()
  const { data: users } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-black uppercase tracking-tight text-white">Users</h1>
        <p className="text-gray-400 mt-1">{users?.length ?? 0} registered users</p>
      </div>
      <UsersManager initialUsers={users ?? []} />
    </div>
  )
}
