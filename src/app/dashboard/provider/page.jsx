import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/actions/auth'
import { getProviderBookings } from '@/lib/actions/bookings'
import { getMyProviderProfile, getMyServiceListings } from '@/lib/actions/provider'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

function money(value) {
  return `PKR ${Number(value || 0).toLocaleString()}`
}

export default async function ProviderDashboard() {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/login')
  }

  const [bookings, profileData, listings] = await Promise.all([
    getProviderBookings(),
    getMyProviderProfile(),
    getMyServiceListings(),
  ])

  const activeBookings = bookings.filter((booking) => ['pending', 'confirmed', 'in_progress'].includes(booking.status))
  const completedBookings = bookings.filter((booking) => booking.status === 'completed')
  const earnings = completedBookings.reduce((total, booking) => total + Number(booking.service_listings?.price || 0), 0)
  const provider = profileData.provider

  return (
    <div className="space-y-8">
      <section className="rounded-3xl bg-gradient-to-br from-orange-50 via-white to-amber-50 p-8 shadow-sm border">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-700">Provider Dashboard</p>
            <h1 className="mt-2 text-4xl font-heading font-bold text-slate-900">
              Welcome, {user.profile?.name || user.user_metadata?.name || user.email}! 🔧
            </h1>
            <p className="mt-3 max-w-2xl text-slate-600">
              Manage your requests, publish services, and track earnings from completed work.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link href="/dashboard/provider/bookings"><Button className="gradient-primary text-white">View Requests</Button></Link>
            <Link href="/dashboard/provider/services"><Button variant="outline">Manage Services</Button></Link>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-slate-500">Pending Requests</p>
            <div className="mt-2 text-4xl font-bold text-slate-900">{bookings.filter((booking) => booking.status === 'pending').length}</div>
            <p className="mt-1 text-sm text-slate-600">New booking requests</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-slate-500">Active Jobs</p>
            <div className="mt-2 text-4xl font-bold text-slate-900">{activeBookings.length}</div>
            <p className="mt-1 text-sm text-slate-600">In progress or confirmed</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-slate-500">Completed</p>
            <div className="mt-2 text-4xl font-bold text-slate-900">{completedBookings.length}</div>
            <p className="mt-1 text-sm text-slate-600">Jobs completed</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-slate-500">Earnings</p>
            <div className="mt-2 text-4xl font-bold text-slate-900">{money(earnings)}</div>
            <p className="mt-1 text-sm text-slate-600">From completed bookings</p>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Direct access to the provider workflow.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 md:grid-cols-2">
            <Link href="/dashboard/provider/bookings"><Button className="w-full gradient-primary text-white">📋 View Booking Requests</Button></Link>
            <Link href="/dashboard/provider/services"><Button className="w-full" variant="outline">⚙️ Manage Services</Button></Link>
            <Link href="/dashboard/provider/profile"><Button className="w-full" variant="outline">👤 Edit Profile</Button></Link>
            <Link href="/dashboard/provider/notifications"><Button className="w-full" variant="outline">🔔 Notifications</Button></Link>
            <Link href="/services"><Button className="w-full md:col-span-2" variant="outline">🌐 Public Marketplace</Button></Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Status</CardTitle>
            <CardDescription>Verification and account details.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Badge className={provider?.is_verified ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : 'bg-amber-100 text-amber-700 border-amber-200'}>
              {provider?.is_verified ? 'Verified' : 'Pending Verification'}
            </Badge>
            <div className="rounded-xl border p-4 text-sm text-slate-600">
              <p className="font-medium text-slate-900">Skills</p>
              <p className="mt-1">{provider?.skills || 'No skills added yet.'}</p>
            </div>
            <div className="rounded-xl border p-4 text-sm text-slate-600">
              <p className="font-medium text-slate-900">Services Published</p>
              <p className="mt-1">{listings.length}</p>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Requests</CardTitle>
            <CardDescription>Newest customer bookings waiting on action.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {bookings.length === 0 ? (
              <p className="text-sm text-slate-500">No booking requests yet.</p>
            ) : (
              bookings.slice(0, 4).map((booking) => (
                <div key={booking.booking_id} className="rounded-xl border p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-slate-900">{booking.service_listings?.title || 'Booking'}</p>
                      <p className="text-sm text-slate-500">{booking.customers?.users?.name || booking.customers?.users?.email || 'Customer'}</p>
                    </div>
                    <Badge variant="outline">{booking.status}</Badge>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Services</CardTitle>
            <CardDescription>Your published listings.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {listings.length === 0 ? (
              <p className="text-sm text-slate-500">No service listings yet.</p>
            ) : (
              listings.slice(0, 4).map((listing) => (
                <div key={listing.listing_id} className="rounded-xl border p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-slate-900">{listing.title}</p>
                      <p className="text-sm text-slate-500">{listing.service_categories?.category_name || 'Uncategorized'}</p>
                    </div>
                    <Badge variant="outline">PKR {Number(listing.price || 0).toLocaleString()}</Badge>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  )
}