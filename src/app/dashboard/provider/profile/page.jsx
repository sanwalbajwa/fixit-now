import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/actions/auth'
import { getMyProviderProfile, updateProviderProfile } from '@/lib/actions/provider'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

export default async function ProviderProfilePage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/login')
  }

  const profileData = await getMyProviderProfile()
  const provider = profileData.provider

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile</CardTitle>
        <CardDescription>Review and update the public details customers will see.</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={updateProviderProfile} className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Name</label>
            <input
              name="name"
              required
              defaultValue={user.profile?.name || user.user_metadata?.name || ''}
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
            <label className="text-sm font-medium text-slate-700">Availability</label>
            <select
              name="availability"
              defaultValue={provider?.availability || 'available'}
              className="h-11 w-full rounded-md border border-slate-200 bg-white px-3 text-sm outline-none focus:border-slate-400"
            >
              <option value="available">Available</option>
              <option value="busy">Busy</option>
            </select>
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

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Address</label>
            <input
              name="address"
              defaultValue={user.user_metadata?.address || ''}
              placeholder="Street, area, and landmark"
              className="h-11 w-full rounded-md border border-slate-200 bg-white px-3 text-sm outline-none focus:border-slate-400"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium text-slate-700">Skills</label>
            <textarea
              name="skills"
              rows={4}
              defaultValue={provider?.skills || ''}
              placeholder="Describe your skills and specialties"
              className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-slate-400"
            />
          </div>

          <div className="md:col-span-2 flex items-center justify-between gap-3">
            <Badge className={provider?.is_verified ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : 'bg-amber-100 text-amber-700 border-amber-200'}>
              {provider?.is_verified ? 'Verified' : 'Pending Verification'}
            </Badge>
            <Button type="submit" className="gradient-primary text-white">Save Profile</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}