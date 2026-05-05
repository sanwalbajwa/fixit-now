import { redirect } from 'next/navigation'
import { getCurrentUser, updateMyProfile } from '@/lib/actions/auth'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

export default async function CustomerProfilePage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>Update your account details and contact information.</CardDescription>
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
                placeholder="Street, area, and any landmark"
                className="h-11 w-full rounded-md border border-slate-200 bg-white px-3 text-sm outline-none focus:border-slate-400"
              />
            </div>

            <div className="md:col-span-2 flex items-center justify-between gap-3">
              <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">{user.profile?.role || user.user_metadata?.role || 'customer'}</Badge>
              <Button type="submit" className="gradient-primary text-white">Save Profile</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}