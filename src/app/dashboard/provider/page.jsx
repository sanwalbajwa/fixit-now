import Link from 'next/link'
import { redirect } from 'next/navigation'
import {
  Wrench, ClipboardList, CheckCircle2, Banknote,
  Zap, BadgeCheck, ShieldCheck, Star,
  Bell, User, Globe, ListPlus,
  CalendarDays, ArrowRight, Settings,
} from 'lucide-react'
import { getCurrentUser } from '@/lib/actions/auth'
import { getProviderBookings } from '@/lib/actions/bookings'
import { getMyProviderProfile, getMyServiceListings } from '@/lib/actions/provider'

/* ─── helpers ──────────────────────────────────────────────── */

function money(v) { return `PKR ${Number(v || 0).toLocaleString()}` }

function initials(name = '') {
  return name.split(' ').slice(0, 2).map((w) => w[0]?.toUpperCase() || '').join('')
}

function formatDate(date) {
  if (!date) return null
  return new Date(date).toLocaleDateString('en', { month: 'short', day: 'numeric' })
}

const STATUS = {
  pending:     { dot: 'bg-amber-400',   text: 'text-amber-700',   bg: 'bg-amber-50',   border: 'border-amber-200',  label: 'Pending'     },
  confirmed:   { dot: 'bg-[#009689]',   text: 'text-[#009689]',   bg: 'bg-[#009689]/8',border: 'border-[#009689]/30',label: 'Confirmed'  },
  in_progress: { dot: 'bg-violet-500',  text: 'text-violet-700',  bg: 'bg-violet-50',  border: 'border-violet-200', label: 'In Progress' },
  completed:   { dot: 'bg-emerald-500', text: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200',label: 'Completed'   },
  cancelled:   { dot: 'bg-rose-400',    text: 'text-rose-700',    bg: 'bg-rose-50',    border: 'border-rose-200',   label: 'Cancelled'   },
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

// Alternating teal/orange for icon tiles
const tileColor = (i) => i % 2 === 0
  ? 'bg-[#009689]/10 text-[#009689]'
  : 'bg-[#f97c66]/10 text-[#f97c66]'

const STATS = (pending, active, completed, earnings) => [
  {
    label: 'Pending Requests',
    value: pending,
    sub:   'Awaiting your response',
    icon:  <ClipboardList className="size-5" />,
    color: 'bg-[#f97c66]/10 text-[#f97c66]',
    num:   'text-[#f97c66]',
  },
  {
    label: 'Active Jobs',
    value: active,
    sub:   'Confirmed & in progress',
    icon:  <Zap className="size-5" />,
    color: 'bg-[#009689]/10 text-[#009689]',
    num:   'text-[#009689]',
  },
  {
    label: 'Completed',
    value: completed,
    sub:   'Jobs delivered',
    icon:  <CheckCircle2 className="size-5" />,
    color: 'bg-emerald-100 text-emerald-700',
    num:   'text-emerald-700',
  },
  {
    label: 'Total Earnings',
    value: money(earnings),
    sub:   'From completed bookings',
    icon:  <Banknote className="size-5" />,
    color: 'bg-[#f97c66]/10 text-[#f97c66]',
    num:   'text-[#f97c66]',
  },
]

const QUICK_ACTIONS = [
  { href: '/dashboard/provider/bookings',      icon: <ClipboardList className="size-5" />, label: 'Booking Requests', desc: 'Review & manage jobs'       },
  { href: '/dashboard/provider/services',      icon: <Settings      className="size-5" />, label: 'My Services',      desc: 'Publish & edit listings'    },
  { href: '/dashboard/provider/profile',       icon: <User          className="size-5" />, label: 'Edit Profile',     desc: 'Skills & availability'      },
  { href: '/dashboard/provider/notifications', icon: <Bell          className="size-5" />, label: 'Notifications',    desc: 'Booking activity'           },
  { href: '/dashboard/provider/services',      icon: <ListPlus      className="size-5" />, label: 'New Listing',      desc: 'Add a service offer'        },
  { href: '/services',                         icon: <Globe         className="size-5" />, label: 'Marketplace',      desc: 'View public listings'       },
]

/* ─── page ──────────────────────────────────────────────────── */
export default async function ProviderDashboard() {
  const user = await getCurrentUser()
  if (!user) redirect('/login')

  const [bookings, profileData, listings] = await Promise.all([
    getProviderBookings(),
    getMyProviderProfile(),
    getMyServiceListings(),
  ])

  const pending   = bookings.filter((b) => b.status === 'pending').length
  const active    = bookings.filter((b) => ['confirmed', 'in_progress'].includes(b.status)).length
  const completed = bookings.filter((b) => b.status === 'completed').length
  const earnings  = bookings
    .filter((b) => b.status === 'completed')
    .reduce((t, b) => t + Number(b.service_listings?.price || 0), 0)

  const provider = profileData.provider
  const name     = user.profile?.name || user.user_metadata?.name || user.email

  return (
    <div className="space-y-6">

      {/* ── Hero ─────────────────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#009689] via-teal-700 to-[#009689] p-7 text-white shadow-lg">
        <div className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full bg-white/10" />
        <div className="pointer-events-none absolute -bottom-8 left-1/3 h-36 w-36 rounded-full bg-white/10" />
        <div className="pointer-events-none absolute right-1/4 bottom-0 h-20 w-20 rounded-full bg-[#f97c66]/20" />

        <div className="relative flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold backdrop-blur-sm mb-3">
              <Wrench className="size-3.5" />
              Provider Dashboard
            </div>
            <h1 className="text-3xl font-bold leading-tight">
              Welcome back, {name.split(' ')[0]}!
            </h1>
            <p className="mt-2 text-teal-100 text-sm max-w-lg">
              Manage your booking requests, publish services, and grow your business.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 shrink-0">
            <Link
              href="/dashboard/provider/bookings"
              className="inline-flex items-center gap-2 rounded-xl bg-white/20 backdrop-blur-sm px-4 py-2 text-sm font-semibold hover:bg-white/30 transition-colors"
            >
              <ClipboardList className="size-4" /> View Requests
            </Link>
            <Link
              href="/dashboard/provider/services"
              className="inline-flex items-center gap-2 rounded-xl bg-[#f97c66] px-4 py-2 text-sm font-semibold text-white hover:bg-[#e0624e] transition-colors shadow-sm"
            >
              <ListPlus className="size-4" /> Add Service
            </Link>
          </div>
        </div>
      </div>

      {/* ── Stats ────────────────────────────────────────────── */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {STATS(pending, active, completed, earnings).map((s) => (
          <div key={s.label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-500">{s.label}</p>
              <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${s.color}`}>
                {s.icon}
              </div>
            </div>
            <p className={`mt-3 text-3xl font-bold ${s.num}`}>{s.value}</p>
            <p className="mt-0.5 text-xs text-slate-400">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* ── Quick Actions ─────────────────────────────────────── */}
      <div>
        <h2 className="mb-3 text-xs font-bold uppercase tracking-widest text-slate-400">Quick Actions</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {QUICK_ACTIONS.map(({ href, icon, label, desc }, i) => (
            <Link
              key={href + label}
              href={href}
              className="group flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all"
            >
              <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${tileColor(i)}`}>
                {icon}
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-slate-900 text-sm">{label}</p>
                <p className="text-xs text-slate-500 truncate">{desc}</p>
              </div>
              <ArrowRight className="ml-auto size-4 text-slate-300 group-hover:text-slate-500 group-hover:translate-x-0.5 transition-all shrink-0" />
            </Link>
          ))}
        </div>
      </div>

      {/* ── Bottom grid ───────────────────────────────────────── */}
      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">

        {/* Recent Requests */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
            <div>
              <h2 className="font-semibold text-slate-900">Recent Requests</h2>
              <p className="text-xs text-slate-400 mt-0.5">Newest customer bookings</p>
            </div>
            <Link href="/dashboard/provider/bookings" className="text-xs font-semibold text-[#009689] hover:text-[#007a6e]">
              View all
            </Link>
          </div>
          <div className="divide-y divide-slate-100">
            {bookings.length === 0 ? (
              <div className="flex flex-col items-center gap-3 py-12 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                  <ClipboardList className="size-6" />
                </div>
                <p className="text-sm text-slate-500">No requests yet.</p>
              </div>
            ) : (
              bookings.slice(0, 5).map((b, i) => (
                <div key={b.booking_id} className="flex items-center gap-4 px-5 py-3.5">
                  <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl font-bold text-xs select-none ${tileColor(i)}`}>
                    {initials(b.customers?.users?.name || b.customers?.users?.email || 'C')}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-900 truncate">
                      {b.service_listings?.title || 'Service request'}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <p className="text-xs text-slate-500 truncate">
                        {b.customers?.users?.name || b.customers?.users?.email || 'Customer'}
                      </p>
                      {b.service_date && (
                        <>
                          <span className="text-slate-300">·</span>
                          <span className="flex items-center gap-1 text-xs text-slate-400">
                            <CalendarDays className="size-3" />
                            {formatDate(b.service_date)}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                  <StatusPill status={b.status} />
                </div>
              ))
            )}
          </div>
        </div>

        {/* Status + Recent Services */}
        <div className="space-y-4">
          {/* Provider status */}
          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div className="border-b border-slate-100 px-5 py-4">
              <h2 className="font-semibold text-slate-900">Profile Status</h2>
            </div>
            <div className="p-5 space-y-4">
              <div className="flex items-center gap-3">
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${provider?.is_verified ? 'bg-[#009689]/10 text-[#009689]' : 'bg-[#f97c66]/10 text-[#f97c66]'}`}>
                  {provider?.is_verified ? <BadgeCheck className="size-5" /> : <ShieldCheck className="size-5" />}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    {provider?.is_verified ? 'Verified Provider' : 'Pending Verification'}
                  </p>
                  <p className="text-xs text-slate-400">
                    {provider?.is_verified ? 'Visible to all customers' : 'Under review by admin'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="rounded-xl bg-slate-50 p-3">
                  <div className="flex items-center justify-center gap-1">
                    <Star className="size-4 fill-amber-400 stroke-amber-400" />
                    <span className="font-bold text-slate-900">{Number(provider?.rating || 0).toFixed(1)}</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">Rating</p>
                </div>
                <div className="rounded-xl bg-slate-50 p-3">
                  <p className="font-bold text-[#009689]">{listings.length}</p>
                  <p className="text-xs text-slate-400 mt-0.5">Services</p>
                </div>
              </div>

              {provider?.skills && (
                <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">{provider.skills}</p>
              )}

              <Link
                href="/dashboard/provider/profile"
                className="flex w-full items-center justify-center gap-1.5 rounded-xl border-2 border-[#009689]/25 bg-[#009689]/5 py-2 text-sm font-semibold text-[#009689] hover:bg-[#009689]/10 transition-colors"
              >
                <User className="size-4" /> Edit Profile
              </Link>
            </div>
          </div>

          {/* Recent listings */}
          {listings.length > 0 && (
            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
              <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
                <h2 className="font-semibold text-slate-900">My Services</h2>
                <Link href="/dashboard/provider/services" className="text-xs font-semibold text-[#f97c66] hover:text-[#e0624e]">
                  Manage
                </Link>
              </div>
              <div className="divide-y divide-slate-100">
                {listings.slice(0, 3).map((l, i) => (
                  <div key={l.listing_id} className="flex items-center gap-3 px-5 py-3">
                    <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${tileColor(i)}`}>
                      <Wrench className="size-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-900 truncate">{l.title}</p>
                      <p className="text-xs text-slate-400">{l.service_categories?.category_name || 'Uncategorized'}</p>
                    </div>
                    <span className="text-xs font-semibold text-slate-700 shrink-0">
                      PKR {Number(l.price || 0).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
