import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { getAdminOverviewData, toggleProviderVerification, updateBookingStatusAdmin } from '@/lib/actions/admin'

function StatCard({ label, value, description, tone = 'slate' }) {
  const tones = {
    slate: 'bg-slate-900 text-white',
    amber: 'bg-amber-500 text-white',
    emerald: 'bg-emerald-600 text-white',
    sky: 'bg-sky-600 text-white',
    rose: 'bg-rose-600 text-white',
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm text-slate-500">{label}</p>
            <div className="mt-2 text-3xl font-bold text-slate-900">{value}</div>
            <p className="mt-1 text-sm text-slate-600">{description}</p>
          </div>
          <div className={`rounded-2xl px-3 py-2 text-sm font-semibold ${tones[tone]}`}>{label}</div>
        </div>
      </CardContent>
    </Card>
  )
}

function formatDate(value) {
  if (!value) return 'Unknown'
  return new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(value))
}

function statusTone(status) {
  const map = {
    pending: 'bg-amber-100 text-amber-700 border-amber-200',
    confirmed: 'bg-sky-100 text-sky-700 border-sky-200',
    in_progress: 'bg-violet-100 text-violet-700 border-violet-200',
    completed: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    cancelled: 'bg-rose-100 text-rose-700 border-rose-200',
  }
  return map[status] || 'bg-slate-100 text-slate-700 border-slate-200'
}

export default async function AdminOverviewPage() {
  const data = await getAdminOverviewData()

  return (
    <div className="space-y-8">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <StatCard label="Users" value={data.stats.users} description="Total platform accounts" tone="slate" />
        <StatCard label="Providers" value={data.stats.providers} description={`${data.stats.verifiedProviders} verified, ${data.stats.pendingProviders} pending`} tone="amber" />
        <StatCard label="Bookings" value={data.stats.bookings} description={`${data.stats.pendingBookings} waiting, ${data.stats.completedBookings} completed`} tone="emerald" />
        <StatCard label="Categories" value={data.stats.categories} description="Service catalog groups" tone="sky" />
        <StatCard label="Listings" value={data.stats.listings} description="Active service listings" tone="rose" />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.4fr_0.9fr]">
        <Card>
          <CardHeader>
            <CardTitle>Admin Workflow</CardTitle>
            <CardDescription>Use these routes to review users, verify providers, moderate bookings, and maintain the catalog.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 md:grid-cols-2">
            <Link href="/dashboard/admin/users"><Button className="w-full">Manage Users</Button></Link>
            <Link href="/dashboard/admin/providers"><Button className="w-full" variant="outline">Verify Providers</Button></Link>
            <Link href="/dashboard/admin/bookings"><Button className="w-full" variant="outline">Review Bookings</Button></Link>
            <Link href="/dashboard/admin/services"><Button className="w-full" variant="outline">Manage Services</Button></Link>
            <Link href="/dashboard/admin/notifications"><Button className="w-full" variant="outline">View Notifications</Button></Link>
            <Link href="/dashboard/admin/profile"><Button className="w-full" variant="outline">Admin Profile</Button></Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Queue Summary</CardTitle>
            <CardDescription>Immediate work waiting for admin review.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between rounded-xl border bg-white p-4">
              <div>
                <p className="text-sm text-slate-500">Pending providers</p>
                <p className="text-2xl font-bold">{data.stats.pendingProviders}</p>
              </div>
              <Badge className="bg-amber-100 text-amber-700 border-amber-200">Review</Badge>
            </div>
            <div className="flex items-center justify-between rounded-xl border bg-white p-4">
              <div>
                <p className="text-sm text-slate-500">Pending bookings</p>
                <p className="text-2xl font-bold">{data.stats.pendingBookings}</p>
              </div>
              <Badge className="bg-sky-100 text-sky-700 border-sky-200">Monitor</Badge>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Users</CardTitle>
            <CardDescription>Latest accounts created on the platform.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {data.recentUsers.length === 0 ? (
              <p className="text-sm text-slate-500">No users found.</p>
            ) : (
              data.recentUsers.map((user) => (
                <div key={user.user_id} className="flex items-center justify-between rounded-xl border p-4">
                  <div>
                    <p className="font-semibold text-slate-900">{user.name || user.email}</p>
                    <p className="text-sm text-slate-500">{user.email}</p>
                  </div>
                  <Badge variant="outline">{user.role || 'customer'}</Badge>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pending Providers</CardTitle>
            <CardDescription>Approve or reject providers from the review queue.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {data.pendingProviders.length === 0 ? (
              <p className="text-sm text-slate-500">No providers pending approval.</p>
            ) : (
              data.pendingProviders.map((provider) => (
                <div key={provider.provider_id} className="rounded-xl border p-4 space-y-3">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-semibold text-slate-900">{provider.users?.name || provider.users?.email}</p>
                      <p className="text-sm text-slate-500">{provider.users?.email}</p>
                    </div>
                    <Badge className={statusTone(provider.is_verified ? 'confirmed' : 'pending')}>
                      {provider.is_verified ? 'Verified' : 'Pending'}
                    </Badge>
                  </div>
                  <p className="text-sm text-slate-600">Skills: {provider.skills || 'Not added yet'}</p>
                  <form action={toggleProviderVerification} className="flex gap-2">
                    <input type="hidden" name="provider_id" value={provider.provider_id} />
                    <button type="submit" name="is_verified" value="true" className="inline-flex h-9 items-center justify-center rounded-md bg-emerald-600 px-3 text-sm font-medium text-white hover:bg-emerald-700">Approve</button>
                    <button type="submit" name="is_verified" value="false" className="inline-flex h-9 items-center justify-center rounded-md border px-3 text-sm font-medium text-slate-700 hover:bg-slate-50">Reject</button>
                  </form>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </section>

      <Card>
        <CardHeader>
          <CardTitle>Recent Bookings</CardTitle>
          <CardDescription>Newest booking activity across the platform.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {data.recentBookings.length === 0 ? (
            <p className="text-sm text-slate-500">No bookings found.</p>
          ) : (
            data.recentBookings.map((booking) => (
              <div key={booking.booking_id} className="rounded-xl border p-4 space-y-3">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-slate-900">{booking.service_listings?.title || 'Service booking'}</p>
                    <p className="text-sm text-slate-500">{booking.description || 'No description provided'}</p>
                  </div>
                  <Badge className={statusTone(booking.status)}>{booking.status}</Badge>
                </div>
                <div className="grid gap-3 text-sm text-slate-600 md:grid-cols-3">
                  <div>
                    <p className="font-medium text-slate-900">Customer</p>
                    <p>{booking.customers?.users?.name || booking.customers?.users?.email || 'Unknown'}</p>
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">Provider</p>
                    <p>{booking.service_providers?.users?.name || booking.service_providers?.users?.email || 'Unknown'}</p>
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">Date</p>
                    <p>{formatDate(booking.service_date || booking.created_at)}</p>
                  </div>
                </div>
                <form action={updateBookingStatusAdmin} className="flex flex-wrap gap-2">
                  <input type="hidden" name="booking_id" value={booking.booking_id} />
                  <button type="submit" name="status" value="confirmed" className="inline-flex h-9 items-center justify-center rounded-md border px-3 text-sm font-medium text-slate-700 hover:bg-slate-50">Confirm</button>
                  <button type="submit" name="status" value="in_progress" className="inline-flex h-9 items-center justify-center rounded-md border px-3 text-sm font-medium text-slate-700 hover:bg-slate-50">In Progress</button>
                  <button type="submit" name="status" value="completed" className="inline-flex h-9 items-center justify-center rounded-md border px-3 text-sm font-medium text-slate-700 hover:bg-slate-50">Complete</button>
                  <button type="submit" name="status" value="cancelled" className="inline-flex h-9 items-center justify-center rounded-md border px-3 text-sm font-medium text-slate-700 hover:bg-slate-50">Cancel</button>
                </form>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  )
}