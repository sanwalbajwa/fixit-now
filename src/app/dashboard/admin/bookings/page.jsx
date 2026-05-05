import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { getAdminBookings, updateBookingStatusAdmin } from '@/lib/actions/admin'

function statusClass(status) {
  const map = {
    pending: 'bg-amber-100 text-amber-700 border-amber-200',
    confirmed: 'bg-sky-100 text-sky-700 border-sky-200',
    in_progress: 'bg-violet-100 text-violet-700 border-violet-200',
    completed: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    cancelled: 'bg-rose-100 text-rose-700 border-rose-200',
  }
  return map[status] || 'bg-slate-100 text-slate-700 border-slate-200'
}

function formatDate(value) {
  if (!value) return 'Unknown'
  return new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(value))
}

export default async function AdminBookingsPage() {
  const bookings = await getAdminBookings()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Booking Moderation</CardTitle>
        <CardDescription>Track service jobs and move them through the workflow.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {bookings.length === 0 ? (
          <p className="text-sm text-slate-500">No bookings found.</p>
        ) : (
          bookings.map((booking) => (
            <div key={booking.booking_id} className="rounded-xl border p-4 space-y-4">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="font-semibold text-slate-900">{booking.service_listings?.title || 'Booking'}</p>
                  <p className="text-sm text-slate-500">{booking.description || 'No description provided'}</p>
                </div>
                <Badge className={statusClass(booking.status)}>{booking.status}</Badge>
              </div>

              <div className="grid gap-4 text-sm text-slate-600 md:grid-cols-3">
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
                <button type="submit" name="status" value="pending" className="inline-flex h-9 items-center justify-center rounded-md border px-3 text-sm font-medium text-slate-700 hover:bg-slate-50">Pending</button>
                <button type="submit" name="status" value="confirmed" className="inline-flex h-9 items-center justify-center rounded-md border px-3 text-sm font-medium text-slate-700 hover:bg-slate-50">Confirmed</button>
                <button type="submit" name="status" value="in_progress" className="inline-flex h-9 items-center justify-center rounded-md border px-3 text-sm font-medium text-slate-700 hover:bg-slate-50">In Progress</button>
                <button type="submit" name="status" value="completed" className="inline-flex h-9 items-center justify-center rounded-md border px-3 text-sm font-medium text-slate-700 hover:bg-slate-50">Completed</button>
                <button type="submit" name="status" value="cancelled" className="inline-flex h-9 items-center justify-center rounded-md border px-3 text-sm font-medium text-slate-700 hover:bg-slate-50">Cancelled</button>
              </form>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}