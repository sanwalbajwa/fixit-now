import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getCurrentUser } from '@/lib/actions/auth'
import { getProviderBookings } from '@/lib/actions/bookings'
import { updateProviderBookingStatus } from '@/lib/actions/provider'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

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

export default async function ProviderBookingsPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/login')
  }

  const bookings = await getProviderBookings()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Booking Requests</CardTitle>
        <CardDescription>Review customer requests and move them through the delivery flow.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {bookings.length === 0 ? (
          <p className="text-sm text-slate-500">No requests yet.</p>
        ) : (
          bookings.map((booking) => (
            <div key={booking.booking_id} className="rounded-xl border p-4 space-y-3">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-slate-900">{booking.service_listings?.title || 'Service request'}</p>
                  <p className="text-sm text-slate-500">{booking.customers?.users?.name || booking.customers?.users?.email || 'Customer'}</p>
                </div>
                <Badge className={badgeClass(booking.status)}>{booking.status}</Badge>
              </div>

              <div className="grid gap-3 text-sm text-slate-600 md:grid-cols-3">
                <div>
                  <p className="font-medium text-slate-900">Date</p>
                  <p>
                    {booking.service_date ? new Date(booking.service_date).toLocaleDateString() : 'Not scheduled'}
                    {booking.service_time ? ` at ${booking.service_time}` : ''}
                  </p>
                </div>
                <div>
                  <p className="font-medium text-slate-900">Description</p>
                  <p>{booking.description || 'No description provided'}</p>
                </div>
                <div>
                  <p className="font-medium text-slate-900">Location</p>
                  <p>{booking.service_location || extractFromNotes(booking.notes, 'Location') || 'No location shared'}</p>
                </div>
              </div>

              <div className="text-sm text-slate-600">
                <p className="font-medium text-slate-900">Notes</p>
                <p>{booking.notes || 'No extra notes'}</p>
              </div>

              {['confirmed', 'in_progress', 'accepted'].includes(booking.status) && (
                <div className="pt-1 pb-2">
                  <Link href={`/dashboard/chat/${booking.booking_id}`}>
                    <button className="inline-flex h-9 items-center justify-center rounded-md border border-emerald-300 bg-emerald-50 px-4 text-sm font-semibold text-emerald-800 hover:bg-emerald-100 transition-colors">
                      💬 Message Customer
                    </button>
                  </Link>
                </div>
              )}

              <form action={updateProviderBookingStatus} className="flex flex-wrap gap-2">
                <input type="hidden" name="booking_id" value={booking.booking_id} />
                <button type="submit" name="status" value="confirmed" className="inline-flex h-9 items-center justify-center rounded-md border px-3 text-sm font-medium text-slate-700 hover:bg-slate-50">Confirm</button>
                <button type="submit" name="status" value="in_progress" className="inline-flex h-9 items-center justify-center rounded-md border px-3 text-sm font-medium text-slate-700 hover:bg-slate-50">Start Work</button>
                <button type="submit" name="status" value="completed" className="inline-flex h-9 items-center justify-center rounded-md border px-3 text-sm font-medium text-slate-700 hover:bg-slate-50">Mark Complete</button>
                <button type="submit" name="status" value="cancelled" className="inline-flex h-9 items-center justify-center rounded-md border px-3 text-sm font-medium text-slate-700 hover:bg-slate-50">Cancel</button>
              </form>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}