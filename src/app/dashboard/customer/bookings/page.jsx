import { redirect } from 'next/navigation'
import Link from 'next/link'
import {
  ClipboardList, MessageCircle, Star, CreditCard,
  CheckCircle2, MapPin, CalendarDays, Clock,
  Wrench, User, Search,
  XCircle,
} from 'lucide-react'
import { getCurrentUser } from '@/lib/actions/auth'
import { cancelMyBooking, getCustomerBookings, submitBookingRating } from '@/lib/actions/bookings'
import CheckoutButton from '@/components/CheckoutButton'

/* ─── helpers ──────────────────────────────────────────────── */

const STATUS = {
  pending:     { bg: 'bg-amber-50',   border: 'border-amber-200',  dot: 'bg-amber-400',   text: 'text-amber-700',   label: 'Pending'     },
  confirmed:   { bg: 'bg-sky-50',     border: 'border-sky-200',    dot: 'bg-sky-500',      text: 'text-sky-700',     label: 'Confirmed'   },
  accepted:    { bg: 'bg-sky-50',     border: 'border-sky-200',    dot: 'bg-sky-500',      text: 'text-sky-700',     label: 'Confirmed'   },
  in_progress: { bg: 'bg-violet-50',  border: 'border-violet-200', dot: 'bg-violet-500',   text: 'text-violet-700',  label: 'In Progress' },
  completed:   { bg: 'bg-emerald-50', border: 'border-emerald-200',dot: 'bg-emerald-500',  text: 'text-emerald-700', label: 'Completed'   },
  cancelled:   { bg: 'bg-rose-50',    border: 'border-rose-200',   dot: 'bg-rose-400',     text: 'text-rose-700',    label: 'Cancelled'   },
}

function StatusPill({ status }) {
  const s = STATUS[status] || STATUS.pending
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${s.bg} ${s.border} ${s.text}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  )
}

function StarDisplay({ rating }) {
  const r = Number(rating || 0)
  return (
    <span className="inline-flex items-center gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className={`size-4 ${i < r ? 'fill-amber-400 stroke-amber-400' : 'fill-none stroke-slate-300'}`}
        />
      ))}
    </span>
  )
}

function extractFromNotes(notes, label) {
  if (!notes) return null
  const match = String(notes).match(new RegExp(`\\[${label}\\]\\s*(.+)`, 'i'))
  return match?.[1] || null
}

function formatDate(date) {
  if (!date) return null
  return new Date(date).toLocaleDateString('en', { weekday: 'short', month: 'short', day: 'numeric' })
}

function getUserRecord(source) {
  const user = source?.users
  if (Array.isArray(user)) return user[0] || null
  return user || null
}

/* ─── page ──────────────────────────────────────────────────── */
export default async function CustomerBookingsPage() {
  const user = await getCurrentUser()
  if (!user) redirect('/login')

  const bookings = await getCustomerBookings()
  const visibleBookings = bookings.filter((b) => b.status !== 'cancelled')
  const active    = visibleBookings.filter((b) => !['completed', 'cancelled'].includes(b.status)).length
  const completed = visibleBookings.filter((b) => b.status === 'completed').length

  return (
    <div className="space-y-6">

      {/* ── Header ───────────────────────────────────────────── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My Bookings</h1>
          <p className="text-sm text-slate-500">
            {active} active · {completed} completed
          </p>
        </div>
        <Link
          href="/dashboard/customer/services"
          className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 transition-colors"
        >
          <Search className="size-4" /> New Booking
        </Link>
      </div>

      {/* ── Empty state ───────────────────────────────────────── */}
      {visibleBookings.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed border-slate-200 bg-white py-20 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
            <ClipboardList className="size-8" />
          </div>
          <div>
            <p className="font-semibold text-slate-700">No bookings yet</p>
            <p className="text-sm text-slate-500 mt-1">Browse services to create your first booking.</p>
          </div>
          <Link
            href="/dashboard/customer/services"
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 transition-colors"
          >
            <Search className="size-4" /> Browse Services
          </Link>
        </div>
      )}

      {/* ── Booking cards ─────────────────────────────────────── */}
      <div className="space-y-4">
        {visibleBookings.map((booking) => {
          const s        = STATUS[booking.status] || STATUS.pending
          const location = booking.service_location || extractFromNotes(booking.notes, 'Location')
          const isPaid   = booking.payments?.length > 0 && booking.payments[0].status === 'paid'
          const hasRating = booking.ratings?.length > 0
          const canCancel = !['completed', 'cancelled'].includes(booking.status)
          const providerUser = getUserRecord(booking.service_providers)
          const providerName = providerUser?.name || providerUser?.email || 'Unknown provider'

          return (
            <div
              key={booking.booking_id}
              className={`rounded-2xl border-2 bg-white shadow-sm overflow-hidden ${s.border}`}
            >
              {/* colour bar */}
              <div className={`h-1 w-full ${s.dot}`} />

              <div className="p-5 space-y-4">
                {/* top row */}
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 text-white font-semibold">
                      {providerUser?.profile_image_url ? (
                        <img
                          src={providerUser.profile_image_url}
                          alt={providerName}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span>{providerName.charAt(0).toUpperCase() || <Wrench className="size-5" />}</span>
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">
                        {booking.service_listings?.title || 'Service booking'}
                      </p>
                      <p className="text-sm text-slate-500">
                        {booking.description || 'No description provided'}
                      </p>
                    </div>
                  </div>
                  <StatusPill status={booking.status} />
                </div>

                {/* meta chips */}
                <div className="flex flex-wrap gap-3 text-sm text-slate-600">
                  <div className="flex items-center gap-1.5">
                    <User className="size-4 text-slate-400" />
                    <span className="font-medium text-slate-800">
                      {providerName}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CreditCard className="size-4 text-slate-400" />
                    <span>PKR {Number(booking.service_listings?.price || 0).toLocaleString()}</span>
                  </div>
                  {booking.service_date && (
                    <div className="flex items-center gap-1.5">
                      <CalendarDays className="size-4 text-slate-400" />
                      <span>{formatDate(booking.service_date)}</span>
                    </div>
                  )}
                  {booking.service_time && (
                    <div className="flex items-center gap-1.5">
                      <Clock className="size-4 text-slate-400" />
                      <span>{booking.service_time}</span>
                    </div>
                  )}
                  {location && (
                    <div className="flex items-center gap-1.5">
                      <MapPin className="size-4 text-slate-400" />
                      <span className="truncate max-w-[200px]">{location}</span>
                    </div>
                  )}
                </div>

                {/* chat CTA */}
                {['confirmed', 'in_progress', 'accepted'].includes(booking.status) && (
                  <Link
                    href={`/dashboard/chat/${booking.booking_id}`}
                    className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 transition-colors"
                  >
                    <MessageCircle className="size-4" /> Chat with Provider
                  </Link>
                )}

                {canCancel && (
                  <form action={cancelMyBooking} className="pt-1">
                    <input type="hidden" name="booking_id" value={booking.booking_id} />
                    <button
                      type="submit"
                      className="inline-flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-100 transition-colors"
                    >
                      <XCircle className="size-4" /> Cancel Booking
                    </button>
                  </form>
                )}

                {/* ── Rating ──────────────────────────────────── */}
                {booking.status === 'completed' && hasRating && (
                  <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 space-y-1.5">
                    <div className="flex items-center gap-2">
                      <StarDisplay rating={booking.ratings[0].rating} />
                      <span className="text-sm font-semibold text-emerald-800">
                        {booking.ratings[0].rating}/5
                      </span>
                    </div>
                    {booking.ratings[0].review && (
                      <p className="text-sm text-emerald-700 italic">"{booking.ratings[0].review}"</p>
                    )}
                  </div>
                )}

                {booking.status === 'completed' && !hasRating && (
                  <form action={submitBookingRating} className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-3">
                    <input type="hidden" name="booking_id" value={booking.booking_id} />
                    <div className="flex items-center gap-2">
                      <Star className="size-4 text-amber-400 fill-amber-400" />
                      <p className="text-sm font-semibold text-slate-900">Rate this service</p>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-[160px_1fr]">
                      <select
                        name="rating"
                        required
                        className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                      >
                        <option value="">Select rating</option>
                        <option value="5">⭐⭐⭐⭐⭐  Excellent</option>
                        <option value="4">⭐⭐⭐⭐  Great</option>
                        <option value="3">⭐⭐⭐  Good</option>
                        <option value="2">⭐⭐  Fair</option>
                        <option value="1">⭐  Poor</option>
                      </select>
                      <input
                        name="review"
                        placeholder="Leave a comment (optional)"
                        className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                      />
                    </div>
                    <button
                      type="submit"
                      className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 transition-colors"
                    >
                      <Star className="size-3.5" /> Submit Rating
                    </button>
                  </form>
                )}

                {/* ── Payment ─────────────────────────────────── */}
                {booking.status === 'completed' && isPaid && (
                  <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">
                    <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
                    <p className="text-sm font-semibold text-emerald-800">Payment confirmed</p>
                  </div>
                )}

                {booking.status === 'completed' && !isPaid && (
                  <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 space-y-3">
                    <div className="flex items-center gap-2">
                      <CreditCard className="size-4 text-amber-600" />
                      <p className="text-sm font-semibold text-amber-900">Payment due</p>
                    </div>
                    <p className="text-sm text-amber-700">
                      PKR {Number(booking.service_listings?.price || 0).toLocaleString()} — complete payment to close this booking.
                    </p>
                    <CheckoutButton bookingId={booking.booking_id} />
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
