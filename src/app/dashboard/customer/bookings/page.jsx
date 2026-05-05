import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getCurrentUser } from '@/lib/actions/auth'
import { getCustomerBookings, submitBookingRating } from '@/lib/actions/bookings'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import CheckoutButton from '@/components/CheckoutButton'

function badgeClass(status) {
  const map = {
    pending: 'bg-amber-100 text-amber-700 border-amber-200',
    confirmed: 'bg-sky-100 text-sky-700 border-sky-200',
    in_progress: 'bg-violet-100 text-violet-700 border-violet-200',
    completed: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    cancelled: 'bg-rose-100 text-rose-700 border-rose-200',
  }
  return map[status] || 'bg-slate-100 text-slate-700 border-slate-200'
}

function extractFromNotes(notes, label) {
  if (!notes) return null
  const match = String(notes).match(new RegExp(`\\[${label}\\]\\s*(.+)`, 'i'))
  return match?.[1] || null
}

export default async function CustomerBookingsPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/login')
  }

  const bookings = await getCustomerBookings()

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Bookings</CardTitle>
        <CardDescription>Track every service request from pending to completed.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {bookings.length === 0 ? (
          <p className="text-sm text-slate-500">No bookings yet. Browse providers to create your first request.</p>
        ) : (
          bookings.map((booking) => (
            <div key={booking.booking_id} className="rounded-xl border p-4 space-y-3">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-slate-900">{booking.service_listings?.title || 'Service booking'}</p>
                  <p className="text-sm text-slate-500">{booking.description || 'No description provided'}</p>
                </div>
                <Badge className={badgeClass(booking.status)}>{booking.status}</Badge>
              </div>
              <div className="grid gap-3 text-sm text-slate-600 md:grid-cols-3">
                <div>
                  <p className="font-medium text-slate-900">Provider</p>
                  <p>{booking.service_providers?.users?.name || booking.service_providers?.users?.email || 'Unknown'}</p>
                </div>
                <div>
                  <p className="font-medium text-slate-900">Service</p>
                  <p>PKR {Number(booking.service_listings?.price || 0).toLocaleString()}</p>
                </div>
                <div>
                  <p className="font-medium text-slate-900">Scheduled</p>
                  <p>
                    {booking.service_date ? new Date(booking.service_date).toLocaleDateString() : 'Not scheduled'}
                    {booking.service_time ? ` at ${booking.service_time}` : ''}
                  </p>
                </div>
              </div>

              <div className="text-sm text-slate-600">
                <p className="font-medium text-slate-900">Location</p>
                <p>{booking.service_location || extractFromNotes(booking.notes, 'Location') || 'Not provided'}</p>
              </div>

              {['confirmed', 'in_progress', 'accepted'].includes(booking.status) && (
                <div className="pt-2">
                  <Link href={`/dashboard/chat/${booking.booking_id}`}>
                    <button className="inline-flex h-9 items-center justify-center rounded-md bg-emerald-100 px-4 text-sm font-semibold text-emerald-800 hover:bg-emerald-200 transition-colors">
                      💬 Chat with Provider
                    </button>
                  </Link>
                </div>
              )}

              {booking.status === 'completed' && (
                <form action={submitBookingRating} className="space-y-3 rounded-xl border bg-slate-50 p-4">
                  <input type="hidden" name="booking_id" value={booking.booking_id} />
                  <p className="text-sm font-semibold text-slate-900">Rate this completed service</p>
                  <div className="grid gap-3 md:grid-cols-[180px_1fr]">
                    <select
                      name="rating"
                      required
                      className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm outline-none focus:border-slate-400"
                    >
                      <option value="">Choose rating</option>
                      <option value="5">5 - Excellent</option>
                      <option value="4">4 - Great</option>
                      <option value="3">3 - Good</option>
                      <option value="2">2 - Fair</option>
                      <option value="1">1 - Poor</option>
                    </select>
                    <input
                      name="review"
                      placeholder="Optional feedback"
                      className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm outline-none focus:border-slate-400"
                    />
                  </div>
                  <button type="submit" className="inline-flex h-9 items-center justify-center rounded-md bg-slate-900 px-3 text-sm font-medium text-white hover:bg-slate-800">Submit Rating</button>
                </form>
              )}

              {/* Payment Section */}
              {booking.status === 'completed' && (!booking.payments || booking.payments.length === 0 || booking.payments[0].status !== 'paid') && (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 space-y-3 mt-4">
                  <p className="text-sm font-semibold text-emerald-900">Payment Required</p>
                  <p className="text-sm text-emerald-700">Please complete the payment for your service: PKR {Number(booking.service_listings?.price || 0).toLocaleString()}</p>
                  <CheckoutButton bookingId={booking.booking_id} />
                </div>
              )}
              {booking.payments && booking.payments.length > 0 && booking.payments[0].status === 'paid' && (
                <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 mt-4">
                  <p className="text-sm font-semibold text-blue-900">Paid Successfully ✅</p>
                </div>
              )}
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}