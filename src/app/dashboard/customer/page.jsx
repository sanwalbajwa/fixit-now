import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/actions/auth'
import { getCustomerBookings } from '@/lib/actions/bookings'
import { getAllCategories, getVerifiedProviders } from '@/lib/actions/services'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

function money(value) {
  return `PKR ${Number(value || 0).toLocaleString()}`
}

export default async function CustomerDashboard() {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/login')
  }

  const [bookings, categories, providers] = await Promise.all([
    getCustomerBookings(),
    getAllCategories(),
    getVerifiedProviders({ sort_by: 'rating' }),
  ])

  const activeBookings = bookings.filter((booking) => !['completed', 'cancelled'].includes(booking.status))
  const completedBookings = bookings.filter((booking) => booking.status === 'completed')
  const totalSpent = completedBookings.reduce((total, booking) => total + Number(booking.service_listings?.price || 0), 0)

  return (
    <div className="space-y-8">
      <section className="rounded-3xl bg-gradient-to-br from-emerald-50 via-white to-sky-50 p-8 shadow-sm border">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">Customer Dashboard</p>
            <h1 className="mt-2 text-4xl font-heading font-bold text-slate-900">
              Welcome, {user.profile?.name || user.user_metadata?.name || user.email}! 👋
            </h1>
            <p className="mt-3 max-w-2xl text-slate-600">
              Book verified providers, track your requests, and keep a history of every completed service in one place.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link href="/dashboard/customer/services"><Button className="gradient-primary text-white">Browse Services</Button></Link>
            <Link href="/dashboard/customer/bookings"><Button variant="outline">My Bookings</Button></Link>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-slate-500">Active Bookings</p>
            <div className="mt-2 text-4xl font-bold text-slate-900">{activeBookings.length}</div>
            <p className="mt-1 text-sm text-slate-600">Jobs waiting for completion</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-slate-500">Completed</p>
            <div className="mt-2 text-4xl font-bold text-slate-900">{completedBookings.length}</div>
            <p className="mt-1 text-sm text-slate-600">Finished services</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-slate-500">Total Spent</p>
            <div className="mt-2 text-4xl font-bold text-slate-900">{money(totalSpent)}</div>
            <p className="mt-1 text-sm text-slate-600">Lifetime spending</p>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Start the next step in your service journey.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 md:grid-cols-2">
            <Link href="/dashboard/customer/services"><Button className="w-full gradient-primary text-white">🔍 Browse Services</Button></Link>
            <Link href="/dashboard/customer/bookings"><Button className="w-full" variant="outline">📋 View My Bookings</Button></Link>
            <Link href="/dashboard/customer/profile"><Button className="w-full" variant="outline">👤 Edit Profile</Button></Link>
            <Link href="/dashboard/customer/notifications"><Button className="w-full" variant="outline">🔔 Notifications</Button></Link>
            <Link href="/services"><Button className="w-full md:col-span-2" variant="outline">⭐ Public Provider Directory</Button></Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Popular Categories</CardTitle>
            <CardDescription>Most common services on the platform.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {categories.slice(0, 5).map((category) => (
              <div key={category.category_id} className="flex items-center justify-between rounded-xl border px-4 py-3">
                <div>
                  <p className="font-medium text-slate-900">{category.category_name}</p>
                  <p className="text-xs text-slate-500">Tap to explore providers</p>
                </div>
                <Badge variant="outline">{category.icon_url || '•'}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Bookings</CardTitle>
            <CardDescription>Your latest service history.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {bookings.length === 0 ? (
              <p className="text-sm text-slate-500">No bookings yet.</p>
            ) : (
              bookings.slice(0, 4).map((booking) => (
                <div key={booking.booking_id} className="rounded-xl border p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-slate-900">{booking.service_listings?.title || 'Booking'}</p>
                      <p className="text-sm text-slate-500">{booking.service_providers?.users?.name || 'Provider'}</p>
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
            <CardTitle>Featured Providers</CardTitle>
            <CardDescription>Highly rated verified professionals.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {providers.slice(0, 4).map((provider) => (
              <div key={provider.provider_id} className="rounded-xl border p-4">
                <p className="font-semibold text-slate-900">{provider.users?.name || provider.users?.email}</p>
                <p className="text-sm text-slate-500">{provider.skills || 'No skills listed'}</p>
                <div className="mt-3 flex items-center justify-between text-sm text-slate-600">
                  <span>Rating {Number(provider.rating || 0).toFixed(1)}</span>
                  <Link href={`/services/${provider.provider_id}`} className="font-semibold text-emerald-700 hover:text-emerald-800">View Profile</Link>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
    </div>
  )
}