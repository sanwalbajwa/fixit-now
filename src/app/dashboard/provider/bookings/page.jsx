import { redirect } from 'next/navigation'
import Link from 'next/link'
import {
  ClipboardList, User, CalendarDays, Clock,
  MapPin, FileText, MessageCircle, CheckCircle2,
  XCircle, ThumbsUp,
} from 'lucide-react'
import { getCurrentUser } from '@/lib/actions/auth'
import { getProviderBookings } from '@/lib/actions/bookings'
import { updateProviderBookingStatus } from '@/lib/actions/provider'

/* ─── helpers ──────────────────────────────────────────────── */

const STATUS = {
  pending:     { bg: 'bg-[#f97c66]/8',   border: 'border-[#f97c66]/30',  dot: 'bg-[#f97c66]',   text: 'text-[#f97c66]',  label: 'Pending'     },
  confirmed:   { bg: 'bg-[#009689]/8',   border: 'border-[#009689]/30',  dot: 'bg-[#009689]',   text: 'text-[#009689]',  label: 'Confirmed'   },
  accepted:    { bg: 'bg-[#009689]/8',   border: 'border-[#009689]/30',  dot: 'bg-[#009689]',   text: 'text-[#009689]',  label: 'Confirmed'   },
  in_progress: { bg: 'bg-violet-50',     border: 'border-violet-200',    dot: 'bg-violet-500',  text: 'text-violet-700', label: 'In Progress' },
  completed:   { bg: 'bg-emerald-50',    border: 'border-emerald-200',   dot: 'bg-emerald-500', text: 'text-emerald-700',label: 'Completed'   },
  cancelled:   { bg: 'bg-rose-50',       border: 'border-rose-200',      dot: 'bg-rose-400',    text: 'text-rose-700',   label: 'Cancelled'   },
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

function extractFromNotes(notes, label) {
  if (!notes) return null
  const match = String(notes).match(new RegExp(`\\[${label}\\]\\s*(.+)`, 'i'))
  return match?.[1] || null
}

function stripMetaNotes(notes) {
  if (!notes) return ''

  return String(notes)
    .split(/\r?\n/)
    .map((line) => line.replace(/^\[(time|location)\]\s*/i, '').trim())
    .filter((line) => line.length > 0)
    .join('\n')
}

function formatDate(date) {
  if (!date) return null
  return new Date(date).toLocaleDateString('en', { weekday: 'short', month: 'short', day: 'numeric' })
}

function initials(name = '') {
  return name.split(' ').slice(0, 2).map((w) => w[0]?.toUpperCase() || '').join('')
}

function getUserRecord(source) {
  const user = source?.users
  if (Array.isArray(user)) return user[0] || null
  return user || null
}

/* ─── page ──────────────────────────────────────────────────── */
export default async function ProviderBookingsPage() {
  const user = await getCurrentUser()
  if (!user) redirect('/login')

  const bookings = await getProviderBookings()
  const visibleBookings = bookings.filter((b) => b.status !== 'cancelled')

  const pending   = visibleBookings.filter((b) => b.status === 'pending').length
  const active    = visibleBookings.filter((b) => ['confirmed', 'accepted', 'in_progress'].includes(b.status)).length
  const completed = visibleBookings.filter((b) => b.status === 'completed').length

  return (
    <div className="space-y-6">

      {/* ── Header ───────────────────────────────────────────── */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Booking Requests</h1>
        <p className="text-sm text-slate-500 mt-0.5">
          <span className="font-semibold text-[#f97c66]">{pending}</span> pending ·{' '}
          <span className="font-semibold text-[#009689]">{active}</span> active ·{' '}
          <span className="font-semibold text-emerald-600">{completed}</span> completed
        </p>
      </div>

      {/* ── Empty state ───────────────────────────────────────── */}
      {visibleBookings.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed border-slate-200 bg-white py-20 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#009689]/10 text-[#009689]">
            <ClipboardList className="size-8" />
          </div>
          <div>
            <p className="font-semibold text-slate-700">No booking requests yet</p>
            <p className="text-sm text-slate-500 mt-1">Customers will appear here when they book your services.</p>
          </div>
        </div>
      )}

      {/* ── Booking cards ─────────────────────────────────────── */}
      <div className="space-y-4">
        {visibleBookings.map((booking, i) => {
          const s        = STATUS[booking.status] || STATUS.pending
          const customerUser = getUserRecord(booking.customers)
          const customer = customerUser?.name || customerUser?.email || 'Customer'
          const location = booking.service_location || extractFromNotes(booking.notes, 'Location')
          const canChat  = ['confirmed', 'in_progress', 'accepted'].includes(booking.status)

          // Alternate avatar color per card
          const avatarColor = i % 2 === 0
            ? 'bg-[#009689]/10 text-[#009689]'
            : 'bg-[#f97c66]/10 text-[#f97c66]'

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
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl font-bold text-sm select-none ${avatarColor}`}>
                      {initials(customer)}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">
                        {booking.service_listings?.title || 'Service request'}
                      </p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <User className="size-3.5 text-slate-400" />
                        <span className="text-sm text-slate-500">{customer}</span>
                      </div>
                    </div>
                  </div>
                  <StatusPill status={booking.status} />
                </div>

                {/* meta chips */}
                <div className="flex flex-wrap gap-3 text-sm text-slate-600">
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

                {/* description + notes */}
                {(booking.description || booking.notes) && (
                  <div className="rounded-xl bg-slate-50 p-3 space-y-1.5">
                    {booking.description && (
                      <div className="flex gap-2 text-sm">
                        <FileText className="size-4 text-slate-400 shrink-0 mt-0.5" />
                        <span className="text-slate-600">{booking.description}</span>
                      </div>
                    )}
                    {stripMetaNotes(booking.notes) && (
                      <p className="text-xs text-slate-500 pl-6 whitespace-pre-line">{stripMetaNotes(booking.notes)}</p>
                    )}
                  </div>
                )}

                {/* chat */}
                {canChat && (
                  <Link
                    href={`/dashboard/chat/${booking.booking_id}`}
                    className="inline-flex items-center gap-2 rounded-xl bg-[#009689] px-4 py-2 text-sm font-semibold text-white hover:bg-[#007a6e] transition-colors"
                  >
                    <MessageCircle className="size-4" /> Message Customer
                  </Link>
                )}

                {/* action buttons */}
                {booking.status !== 'completed' && booking.status !== 'cancelled' && (
                  <div className="flex flex-wrap gap-2 pt-1 border-t border-slate-100">
                    {booking.status === 'pending' && (
                      <form action={updateProviderBookingStatus}>
                        <input type="hidden" name="booking_id" value={booking.booking_id} />
                        <input type="hidden" name="status" value="accepted" />
                        <button
                          type="submit"
                          className="inline-flex items-center gap-1.5 rounded-xl bg-[#009689] px-4 py-2 text-sm font-semibold text-white hover:bg-[#007a6e] transition-colors"
                        >
                          <ThumbsUp className="size-4" /> Confirm
                        </button>
                      </form>
                    )}

                    {['confirmed', 'accepted', 'in_progress'].includes(booking.status) && (
                      <form action={updateProviderBookingStatus}>
                        <input type="hidden" name="booking_id" value={booking.booking_id} />
                        <input type="hidden" name="status" value="completed" />
                        <button
                          type="submit"
                          className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 transition-colors"
                        >
                          <CheckCircle2 className="size-4" /> Mark Complete
                        </button>
                      </form>
                    )}

                    <form action={updateProviderBookingStatus}>
                      <input type="hidden" name="booking_id" value={booking.booking_id} />
                      <input type="hidden" name="status" value="cancelled" />
                      <button
                        type="submit"
                        className="inline-flex items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-100 transition-colors"
                      >
                        <XCircle className="size-4" /> Cancel
                      </button>
                    </form>
                  </div>
                )}

                {/* terminal states */}
                {booking.status === 'completed' && (
                  <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">
                    <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
                    <p className="text-sm font-semibold text-emerald-800">Job completed</p>
                  </div>
                )}
                {booking.status === 'cancelled' && (
                  <div className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3">
                    <XCircle className="size-4 text-rose-500 shrink-0" />
                    <p className="text-sm font-semibold text-rose-700">Booking cancelled</p>
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
