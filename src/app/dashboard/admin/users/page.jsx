'use client'

import { useState, useEffect } from 'react'
import { Users, CheckCircle2, AlertCircle, UserCog } from 'lucide-react'
import { updateUserRole } from '@/lib/actions/admin'

function initials(name = '') {
  return name.split(' ').slice(0, 2).map(w => w[0]?.toUpperCase() || '').join('')
}

const ROLE_STYLE = {
  admin:    'bg-[#f97c66]/10 border-[#f97c66]/25 text-[#f97c66]',
  provider: 'bg-[#009689]/10 border-[#009689]/25 text-[#009689]',
  customer: 'bg-slate-100 border-slate-200 text-slate-600',
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState(null)
  const [message, setMessage] = useState(null)

  useEffect(() => { fetchUsers() }, [])

  async function fetchUsers() {
    try {
      const res = await fetch('/api/admin/users')
      if (!res.ok) throw new Error('Failed')
      setUsers(await res.json())
    } catch {
      setMessage({ type: 'error', text: 'Failed to load users' })
    } finally {
      setLoading(false)
    }
  }

  async function handleRoleUpdate(userId, role) {
    setUpdatingId(userId)
    setMessage(null)
    try {
      const fd = new FormData()
      fd.append('user_id', userId)
      fd.append('role', role)
      const result = await updateUserRole(fd)
      if (result?.error) {
        setMessage({ type: 'error', text: result.error })
      } else {
        setMessage({ type: 'success', text: `Role updated to ${role}` })
        setUsers(users.map(u => u.user_id === userId ? { ...u, role } : u))
        setTimeout(() => setMessage(null), 3000)
      }
    } catch {
      setMessage({ type: 'error', text: 'Update failed' })
    } finally {
      setUpdatingId(null)
    }
  }

  const roleCounts = users.reduce((acc, u) => {
    const r = u.role || 'customer'
    acc[r] = (acc[r] || 0) + 1
    return acc
  }, {})

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">User Management</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Promote or demote accounts by updating the app role.
          </p>
        </div>
        {!loading && (
          <div className="flex gap-3">
            {[
              { label: 'Customers', count: roleCounts.customer || 0, color: 'text-slate-600' },
              { label: 'Providers', count: roleCounts.provider || 0, color: 'text-[#009689]' },
              { label: 'Admins',    count: roleCounts.admin || 0,    color: 'text-[#f97c66]' },
            ].map(({ label, count, color }) => (
              <div key={label} className="hidden sm:block text-center rounded-xl border border-slate-200 bg-white px-4 py-2 shadow-sm">
                <p className={`text-xl font-bold ${color}`}>{count}</p>
                <p className="text-xs text-slate-400">{label}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Toast */}
      {message && (
        <div className={`flex items-center gap-2 rounded-xl border p-3 text-sm ${
          message.type === 'error'
            ? 'bg-rose-50 border-rose-200 text-rose-700'
            : 'bg-[#009689]/8 border-[#009689]/25 text-[#009689]'
        }`}>
          {message.type === 'error'
            ? <AlertCircle className="size-4 shrink-0" />
            : <CheckCircle2 className="size-4 shrink-0" />}
          {message.text}
        </div>
      )}

      {/* Content */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="flex items-center gap-2.5 border-b border-slate-100 px-5 py-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#009689]/10 text-[#009689]">
            <Users className="size-4" />
          </div>
          <div>
            <h2 className="font-semibold text-slate-900">All Users</h2>
            <p className="text-xs text-slate-400">{loading ? 'Loading…' : `${users.length} accounts`}</p>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16 gap-3">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-[#009689]" />
            <p className="text-sm text-slate-500">Loading users…</p>
          </div>
        ) : users.length === 0 ? (
          <p className="px-5 py-10 text-center text-sm text-slate-500">No users found.</p>
        ) : (
          <div className="divide-y divide-slate-100">
            {users.map((u, i) => (
              <div key={u.user_id} className="flex flex-wrap items-center gap-4 px-5 py-4 hover:bg-slate-50/60 transition-colors">

                {/* Avatar */}
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-bold select-none ${
                  i % 2 === 0 ? 'bg-[#009689]/10 text-[#009689]' : 'bg-[#f97c66]/10 text-[#f97c66]'
                }`}>
                  {initials(u.name || u.email)}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-semibold text-slate-900 text-sm">{u.name || u.email}</p>
                    <span className={`rounded-full border px-2 py-0.5 text-xs font-semibold ${ROLE_STYLE[u.role] || ROLE_STYLE.customer}`}>
                      {u.role || 'customer'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">{u.email}</p>
                  {u.phone && <p className="text-xs text-slate-400">{u.phone}</p>}
                </div>

                {/* Role actions */}
                <div className="flex gap-1.5 shrink-0">
                  {(u.role || 'customer') !== 'customer' && (
                    <button
                      disabled={updatingId === u.user_id}
                      onClick={() => handleRoleUpdate(u.user_id, 'customer')}
                      className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-40 transition-colors"
                    >
                      Customer
                    </button>
                  )}
                  {(u.role || 'customer') !== 'provider' && (
                    <button
                      disabled={updatingId === u.user_id}
                      onClick={() => handleRoleUpdate(u.user_id, 'provider')}
                      className="rounded-xl border border-[#009689]/25 bg-[#009689]/8 px-3 py-1.5 text-xs font-semibold text-[#009689] hover:bg-[#009689]/15 disabled:opacity-40 transition-colors"
                    >
                      Provider
                    </button>
                  )}
                  {(u.role || 'customer') !== 'admin' && (
                    <button
                      disabled={updatingId === u.user_id}
                      onClick={() => handleRoleUpdate(u.user_id, 'admin')}
                      className="rounded-xl border border-[#f97c66]/25 bg-[#f97c66]/8 px-3 py-1.5 text-xs font-semibold text-[#f97c66] hover:bg-[#f97c66]/15 disabled:opacity-40 transition-colors"
                    >
                      Admin
                    </button>
                  )}
                  {updatingId === u.user_id && (
                    <span className="flex items-center gap-1 px-2 text-xs text-slate-400">
                      <UserCog className="size-3.5 animate-pulse" /> Updating…
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
