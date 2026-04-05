'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Profile, UserRole } from '@/lib/types'

const roleColors: Record<UserRole, string> = {
  admin: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  sales: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  customer: 'bg-zinc-700 text-gray-400 border-white/10',
}

export default function UsersManager({ initialUsers }: { initialUsers: Profile[] }) {
  const router = useRouter()
  const [users, setUsers] = useState(initialUsers)
  const [loading, setLoading] = useState<string | null>(null)

  async function handleRoleChange(userId: string, role: UserRole) {
    setLoading(userId)
    const res = await fetch(`/api/admin/users/${userId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role }),
    })
    if (res.ok) {
      setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, role } : u)))
    }
    setLoading(null)
    router.refresh()
  }

  return (
    <div className="bg-zinc-900 rounded-2xl border border-white/10 overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b border-white/10 text-left">
            <th className="px-6 py-4 text-gray-400 text-xs uppercase tracking-wider font-semibold">Email</th>
            <th className="px-4 py-4 text-gray-400 text-xs uppercase tracking-wider font-semibold">Role</th>
            <th className="px-4 py-4 text-gray-400 text-xs uppercase tracking-wider font-semibold">Joined</th>
            <th className="px-4 py-4 text-gray-400 text-xs uppercase tracking-wider font-semibold">Change Role</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {users.map((user) => (
            <tr key={user.id} className="hover:bg-white/2 transition-colors">
              <td className="px-6 py-4 text-white text-sm font-medium">{user.email}</td>
              <td className="px-4 py-4">
                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${roleColors[user.role]}`}>
                  {user.role}
                </span>
              </td>
              <td className="px-4 py-4 text-gray-400 text-sm">
                {user.created_at ? new Date(user.created_at).toLocaleDateString() : '—'}
              </td>
              <td className="px-4 py-4">
                <select
                  value={user.role}
                  onChange={(e) => handleRoleChange(user.id, e.target.value as UserRole)}
                  disabled={loading === user.id}
                  className="bg-zinc-800 border border-white/10 text-white text-sm rounded-lg px-3 py-1.5 outline-none focus:border-orange-500 disabled:opacity-50 transition-colors"
                >
                  <option value="customer">Customer</option>
                  <option value="sales">Sales</option>
                  <option value="admin">Admin</option>
                </select>
              </td>
            </tr>
          ))}
          {users.length === 0 && (
            <tr>
              <td colSpan={4} className="px-6 py-10 text-center text-gray-500 text-sm">
                No users yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
