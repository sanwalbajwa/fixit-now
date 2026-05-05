import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { getAdminUsers, updateUserRole } from '@/lib/actions/admin'

export default async function AdminUsersPage() {
  const users = await getAdminUsers()

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Management</CardTitle>
        <CardDescription>Promote or demote accounts by updating the app role.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {users.length === 0 ? (
          <p className="text-sm text-slate-500">No users found.</p>
        ) : (
          users.map((user) => (
            <div key={user.user_id} className="rounded-xl border p-4 space-y-4">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="font-semibold text-slate-900">{user.name || user.email}</p>
                  <p className="text-sm text-slate-500">{user.email}</p>
                  <p className="text-sm text-slate-500">{user.phone || 'No phone provided'}</p>
                </div>
                <Badge variant="outline">{user.role || 'customer'}</Badge>
              </div>

              <form action={updateUserRole} className="flex flex-wrap gap-2">
                <input type="hidden" name="user_id" value={user.user_id} />
                <button type="submit" name="role" value="customer" className="inline-flex h-9 items-center justify-center rounded-md border px-3 text-sm font-medium text-slate-700 hover:bg-slate-50">Customer</button>
                <button type="submit" name="role" value="provider" className="inline-flex h-9 items-center justify-center rounded-md border px-3 text-sm font-medium text-slate-700 hover:bg-slate-50">Provider</button>
                <button type="submit" name="role" value="admin" className="inline-flex h-9 items-center justify-center rounded-md bg-slate-900 px-3 text-sm font-medium text-white hover:bg-slate-800">Admin</button>
              </form>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}