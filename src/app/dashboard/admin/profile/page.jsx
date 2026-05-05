import { redirect } from 'next/navigation'
import { getCurrentUser, updateMyProfile } from '@/lib/actions/auth'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

export default async function AdminProfilePage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/login')
  }

  const role = user.profile?.role || user.user_metadata?.role

  if (role !== 'admin') {
    redirect('/dashboard')
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Admin Profile</CardTitle>
        <CardDescription>Manage your account details for the admin workspace.</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={updateMyProfile} className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Name</label>
            <input
              name="name"
              defaultValue={user.profile?.name || user.user_metadata?.name || ''}
              required
              className="h-11 w-full rounded-md border border-slate-200 bg-white px-3 text-sm outline-none focus:border-slate-400"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Email</label>
            <input
              value={user.email || ''}
              disabled
              className="h-11 w-full rounded-md border border-slate-200 bg-slate-50 px-3 text-sm text-slate-500"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Phone</label>
            <input
              name="phone"
              defaultValue={user.profile?.phone || user.user_metadata?.phone || ''}
              className="h-11 w-full rounded-md border border-slate-200 bg-white px-3 text-sm outline-none focus:border-slate-400"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">City</label>
            <input
              name="city"
              defaultValue={user.user_metadata?.city || ''}
              placeholder="Your city"
              className="h-11 w-full rounded-md border border-slate-200 bg-white px-3 text-sm outline-none focus:border-slate-400"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium text-slate-700">Address</label>
            <input
              name="address"
              defaultValue={user.user_metadata?.address || ''}
              placeholder="Office or mailing address"
              className="h-11 w-full rounded-md border border-slate-200 bg-white px-3 text-sm outline-none focus:border-slate-400"
            />
          </div>

          <div className="md:col-span-2 flex items-center justify-between gap-3">
            <Badge className="bg-amber-100 text-amber-700 border-amber-200">Admin</Badge>
            <Button type="submit" className="bg-slate-900 text-white hover:bg-slate-800">Save Profile</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
