import Link from 'next/link'
import {
  Users, Wrench, CalendarCheck, Layers, List,
  BadgeCheck, ShieldAlert, ArrowRight, Activity,
  CheckCircle2, Star, Bell, User,
} from 'lucide-react'
import { getAdminOverviewData, toggleProviderVerification, updateBookingStatusAdmin } from '@/lib/actions/admin'
import { ActivityAreaChart, BookingStatusChart, ProviderBarChart } from '@/components/admin/AdminCharts'

/* ─── helpers ──────────────────────────────────────────────────── */

function initials(name = '') {
  return name.split(' ').slice(0, 2).map(w => w[0]?.toUpperCase() || '').join('')
}

function formatDate(v) {
  if (!v) return '—'
  return new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric' }).format(new Date(v))
}

const STATUS = {
  pending:     { bg: 'bg-[#f97c66]/10', border: 'border-[#f97c66]/25', text: 'text-[#f97c66]',  dot: 'bg-[#f97c66]',   label: 'Pending'     },
  confirmed:   { bg: 'bg-[#009689]/10', border: 'border-[#009689]/25', text: 'text-[#009689]',  dot: 'bg-[#009689]',   label: 'Confirmed'   },
  in_progress: { bg: 'bg-violet-50',    border: 'border-violet-200',   text: 'text-violet-700', dot: 'bg-violet-500',  label: 'In Progress' },
  completed:   { bg: 'bg-emerald-50',   border: 'border-emerald-200',  text: 'text-emerald-700',dot: 'bg-emerald-500', label: 'Completed'   },
  cancelled:   { bg: 'bg-rose-50',      border: 'border-rose-200',     text: 'text-rose-700',   dot: 'bg-rose-400',    label: 'Cancelled'   },
}

const ROLE = {
  admin:    'bg-[#f97c66]/10 border-[#f97c66]/25 text-[#f97c66]',
  provider: 'bg-[#009689]/10 border-[#009689]/25 text-[#009689]',
  customer: 'bg-slate-100 border-slate-200 text-slate-600',
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

/* ─── Build 7-day activity data for the area chart ──────────────── */
function buildActivityData(recentBookings, recentUsers) {
  const days = []
  const now = new Date()
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now)
    d.setDate(d.getDate() - i)
    days.push({
      date: d.toLocaleDateString('en', { month: 'short', day: 'numeric' }),
      dateStr: d.toISOString().slice(0, 10),
      bookings: 0,
      users: 0,
    })
  }

  for (const b of recentBookings) {
    const ds = (b.created_at || '').slice(0, 10)
    const entry = days.find(d => d.dateStr === ds)
    if (entry) entry.bookings += 1
  }

  for (const u of recentUsers) {
    const ds = (u.created_at || '').slice(0, 10)
    const entry = days.find(d => d.dateStr === ds)
    if (entry) entry.users += 1
  }

  return days.map(({ date, bookings, users }) => ({ date, bookings, users }))
}

/* ─── page ───────────────────────────────────────────────────────── */
export default async function AdminOverviewPage() {
  const data = await getAdminOverviewData()
  const s = data.stats

  const activeBookings = Math.max(0, s.bookings - s.pendingBookings - s.completedBookings)
  const completionRate = s.bookings > 0 ? Math.round((s.completedBookings / s.bookings) * 100) : 0
  const verificationRate = s.providers > 0 ? Math.round((s.verifiedProviders / s.providers) * 100) : 0

  const bookingSegments = [
    { label: 'Pending',   value: s.pendingBookings,  color: '#f97c66' },
    { label: 'Active',    value: activeBookings,      color: '#009689' },
    { label: 'Completed', value: s.completedBookings, color: '#10b981' },
  ]

  const activityData = buildActivityData(data.recentBookings, data.recentUsers)

  const providerBarData = [
    { label: 'Providers', verified: s.verifiedProviders, pending: s.pendingProviders },
  ]

  return (
    <div className="space-y-6">

      {/* ══════════════════════════════════════════════════════════
          HERO — light platform summary
      ══════════════════════════════════════════════════════════ */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-7 text-slate-900 shadow-sm">
        <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-[#009689] opacity-10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 left-1/3 h-72 w-72 rounded-full bg-[#f97c66] opacity-10 blur-3xl" />
        <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-[#f97c66] via-[#009689] to-[#f97c66]" />

        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold mb-3">
              <Activity className="size-3.5 text-[#009689]" />
              Live Platform Data
            </div>
            <h1 className="text-3xl font-bold leading-tight">
              Platform <span className="text-[#009689]">Overview</span>
            </h1>
            <p className="mt-1.5 text-sm text-slate-600 max-w-md">
              Real-time snapshot of users, providers, bookings, and platform health.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 shrink-0">
            {[
              { val: s.users,    label: 'Total Users',    color: '#009689' },
              { val: s.bookings, label: 'Total Bookings', color: '#f97c66' },
              { val: s.listings, label: 'Live Listings',  color: '#10b981' },
            ].map(({ val, label, color }) => (
              <div key={label} className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-center backdrop-blur-sm">
                <p className="text-2xl font-bold" style={{ color }}>{val}</p>
                <p className="text-[11px] text-slate-500 mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* platform health strip */}
        <div className="relative mt-6 grid grid-cols-2 gap-4 border-t border-slate-200 pt-5 sm:grid-cols-4">
          {[
            { label: 'Completion Rate',   val: `${completionRate}%`,   color: '#10b981' },
            { label: 'Verification Rate', val: `${verificationRate}%`, color: '#009689' },
            { label: 'Pending Reviews',   val: s.pendingProviders,     color: '#f97c66' },
            { label: 'Active Bookings',   val: activeBookings,         color: '#8b5cf6' },
          ].map(({ label, val, color }) => (
            <div key={label} className="text-center">
              <p className="text-xl font-bold" style={{ color }}>{val}</p>
              <p className="text-xs text-slate-500 mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════
          STAT CARDS — 5 columns
      ══════════════════════════════════════════════════════════ */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {[
          { label: 'Users',      value: s.users,      sub: `${s.customers} customers`,                                          icon: <Users         className="size-5" />, tile: 'bg-[#009689]/10 text-[#009689]', num: 'text-[#009689]' },
          { label: 'Providers',  value: s.providers,  sub: `${s.verifiedProviders} verified · ${s.pendingProviders} pending`,   icon: <Wrench        className="size-5" />, tile: 'bg-[#f97c66]/10 text-[#f97c66]', num: 'text-[#f97c66]' },
          { label: 'Bookings',   value: s.bookings,   sub: `${s.pendingBookings} pending · ${s.completedBookings} done`,        icon: <CalendarCheck className="size-5" />, tile: 'bg-[#009689]/10 text-[#009689]', num: 'text-[#009689]' },
          { label: 'Categories', value: s.categories, sub: 'Service types',                                                     icon: <Layers        className="size-5" />, tile: 'bg-[#f97c66]/10 text-[#f97c66]', num: 'text-[#f97c66]' },
          { label: 'Listings',   value: s.listings,   sub: 'Active service offers',                                             icon: <List          className="size-5" />, tile: 'bg-[#009689]/10 text-[#009689]', num: 'text-[#009689]' },
        ].map((c) => (
          <div key={c.label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">{c.label}</p>
              <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${c.tile}`}>
                {c.icon}
              </div>
            </div>
            <p className={`text-3xl font-bold ${c.num}`}>{c.value}</p>
            <p className="mt-1 text-xs text-slate-400">{c.sub}</p>
          </div>
        ))}
      </div>

      {/* ══════════════════════════════════════════════════════════
          ACTIVITY CHART (full-width area chart)
      ══════════════════════════════════════════════════════════ */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#009689]/10 text-[#009689]">
              <Activity className="size-4" />
            </div>
            <div>
              <h2 className="font-semibold text-slate-900">7-Day Activity</h2>
              <p className="text-xs text-slate-400">Bookings and new users over the past week</p>
            </div>
          </div>
        </div>
        <ActivityAreaChart data={activityData} />
      </div>

      {/* ══════════════════════════════════════════════════════════
          CHARTS ROW — Booking donut + Provider bar + Quick actions
      ══════════════════════════════════════════════════════════ */}
      <div className="grid gap-6 xl:grid-cols-[1fr_0.8fr_1fr]">

        {/* ── Booking Status Donut ─────────────────────────────── */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#009689]/10 text-[#009689]">
                <CalendarCheck className="size-4" />
              </div>
              <div>
                <h2 className="font-semibold text-slate-900">Booking Status</h2>
                <p className="text-xs text-slate-400">Distribution across {s.bookings} bookings</p>
              </div>
            </div>
            <Link href="/dashboard/admin/bookings" className="text-xs font-semibold text-[#009689] hover:text-[#007a6e]">
              Manage →
            </Link>
          </div>
          <BookingStatusChart segments={bookingSegments} total={s.bookings} />
        </div>

        {/* ── Provider Verification ────────────────────────────── */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2.5 mb-5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#f97c66]/10 text-[#f97c66]">
              <BadgeCheck className="size-4" />
            </div>
            <div>
              <h2 className="font-semibold text-slate-900">Providers</h2>
              <p className="text-xs text-slate-400">{s.pendingProviders} pending review</p>
            </div>
          </div>

          <ProviderBarChart data={providerBarData} />

          <div className="mt-4 grid grid-cols-2 gap-3 text-center">
            <div className="rounded-xl border border-[#009689]/20 bg-[#009689]/5 px-3 py-3">
              <p className="text-xl font-bold text-[#009689]">{s.verifiedProviders}</p>
              <p className="text-[11px] text-slate-500 mt-0.5">Verified</p>
            </div>
            <div className="rounded-xl border border-[#f97c66]/20 bg-[#f97c66]/5 px-3 py-3">
              <p className="text-xl font-bold text-[#f97c66]">{s.pendingProviders}</p>
              <p className="text-[11px] text-slate-500 mt-0.5">Pending</p>
            </div>
          </div>

          {s.pendingProviders > 0 && (
            <Link
              href="/dashboard/admin/providers"
              className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-xl border-2 border-[#f97c66]/25 bg-[#f97c66]/5 py-2 text-sm font-semibold text-[#f97c66] hover:bg-[#f97c66]/10 transition-colors"
            >
              <ShieldAlert className="size-4" />
              Review {s.pendingProviders} pending
            </Link>
          )}
        </div>

        {/* ── Quick Actions ────────────────────────────────────── */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2.5 mb-5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
              <ArrowRight className="size-4" />
            </div>
            <div>
              <h2 className="font-semibold text-slate-900">Quick Actions</h2>
              <p className="text-xs text-slate-400">Jump to any section</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {[
              { href: '/dashboard/admin/users',         icon: Users,         label: 'Users',         color: 'bg-[#009689]/10 text-[#009689]' },
              { href: '/dashboard/admin/providers',     icon: Wrench,        label: 'Providers',     color: 'bg-[#f97c66]/10 text-[#f97c66]' },
              { href: '/dashboard/admin/bookings',      icon: CalendarCheck, label: 'Bookings',      color: 'bg-[#009689]/10 text-[#009689]' },
              { href: '/dashboard/admin/services',      icon: Layers,        label: 'Services',      color: 'bg-[#f97c66]/10 text-[#f97c66]' },
              { href: '/dashboard/admin/notifications', icon: Bell,          label: 'Alerts',        color: 'bg-[#009689]/10 text-[#009689]' },
              { href: '/dashboard/admin/profile',       icon: User,          label: 'Profile',       color: 'bg-[#f97c66]/10 text-[#f97c66]' },
            ].map(({ href, icon: Icon, label, color }) => (
              <Link
                key={href}
                href={href}
                className="group flex items-center gap-2.5 rounded-xl border border-slate-100 bg-slate-50/60 px-3 py-2.5 hover:border-slate-200 hover:bg-white hover:shadow-sm transition-all"
              >
                <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${color}`}>
                  <Icon className="size-3.5" />
                </div>
                <span className="text-xs font-semibold text-slate-700 group-hover:text-slate-900 truncate">{label}</span>
                <ArrowRight className="ml-auto size-3 text-slate-300 group-hover:text-slate-500 group-hover:translate-x-0.5 transition-all shrink-0" />
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════
          USERS + PENDING PROVIDERS
      ══════════════════════════════════════════════════════════ */}
      <div className="grid gap-6 xl:grid-cols-2">

        {/* Recent Users */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
            <div>
              <h2 className="font-semibold text-slate-900">Recent Users</h2>
              <p className="text-xs text-slate-400 mt-0.5">Latest accounts joined</p>
            </div>
            <Link href="/dashboard/admin/users" className="text-xs font-semibold text-[#009689] hover:text-[#007a6e]">
              View all
            </Link>
          </div>
          <div className="divide-y divide-slate-100">
            {data.recentUsers.length === 0 ? (
              <p className="px-5 py-8 text-center text-sm text-slate-500">No users yet.</p>
            ) : data.recentUsers.map((u, i) => (
              <div key={u.user_id} className="flex items-center gap-3 px-5 py-3 hover:bg-slate-50 transition-colors">
                <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-xs font-bold select-none ${
                  i % 2 === 0 ? 'bg-[#009689]/10 text-[#009689]' : 'bg-[#f97c66]/10 text-[#f97c66]'
                }`}>
                  {initials(u.name || u.email)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-900 truncate">{u.name || u.email}</p>
                  <p className="text-xs text-slate-400 truncate">{u.email}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className={`rounded-full border px-2 py-0.5 text-xs font-semibold ${ROLE[u.role] || ROLE.customer}`}>
                    {u.role || 'customer'}
                  </span>
                  <span className="hidden sm:block text-xs text-slate-400">{formatDate(u.created_at)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pending Providers */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
            <div>
              <h2 className="font-semibold text-slate-900">Pending Providers</h2>
              <p className="text-xs text-slate-400 mt-0.5">Awaiting verification</p>
            </div>
            <Link href="/dashboard/admin/providers" className="text-xs font-semibold text-[#f97c66] hover:text-[#e0624e]">
              View all
            </Link>
          </div>
          <div className="divide-y divide-slate-100">
            {data.pendingProviders.length === 0 ? (
              <div className="flex flex-col items-center gap-3 py-10 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50">
                  <CheckCircle2 className="size-6 text-emerald-500" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-700">All caught up!</p>
                  <p className="text-xs text-slate-400 mt-0.5">No providers pending review.</p>
                </div>
              </div>
            ) : data.pendingProviders.map((p) => (
              <div key={p.provider_id} className="px-5 py-4 hover:bg-slate-50 transition-colors space-y-3">
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#f97c66]/10 text-[#f97c66] text-xs font-bold select-none">
                    {initials(p.users?.name || p.users?.email || 'P')}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-semibold text-slate-900 truncate">
                        {p.users?.name || p.users?.email}
                      </p>
                      {p.rating > 0 && (
                        <div className="flex items-center gap-0.5 shrink-0">
                          <Star className="size-3 fill-amber-400 stroke-amber-400" />
                          <span className="text-xs font-semibold text-slate-600">{Number(p.rating).toFixed(1)}</span>
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 truncate">{p.users?.email}</p>
                    {p.skills && <p className="text-xs text-slate-500 mt-1 line-clamp-1">{p.skills}</p>}
                  </div>
                </div>
                <form action={toggleProviderVerification} className="flex gap-2">
                  <input type="hidden" name="provider_id" value={p.provider_id} />
                  <button
                    type="submit" name="is_verified" value="true"
                    className="flex-1 rounded-xl bg-[#009689] py-1.5 text-xs font-semibold text-white hover:bg-[#007a6e] transition-colors"
                  >
                    Approve
                  </button>
                  <button
                    type="submit" name="is_verified" value="false"
                    className="flex-1 rounded-xl border border-rose-200 bg-rose-50 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-100 transition-colors"
                  >
                    Reject
                  </button>
                </form>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════
          RECENT BOOKINGS TABLE
      ══════════════════════════════════════════════════════════ */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <div>
            <h2 className="font-semibold text-slate-900">Recent Bookings</h2>
            <p className="text-xs text-slate-400 mt-0.5">Latest platform activity</p>
          </div>
          <Link href="/dashboard/admin/bookings" className="text-xs font-semibold text-[#009689] hover:text-[#007a6e]">
            View all
          </Link>
        </div>

        {data.recentBookings.length === 0 ? (
          <p className="px-5 py-10 text-center text-sm text-slate-500">No bookings found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/80">
                  {['Service', 'Customer', 'Provider', 'Date', 'Status', 'Actions'].map((h) => (
                    <th key={h} className="px-5 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.recentBookings.map((b) => (
                  <tr key={b.booking_id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-5 py-3.5">
                      <p className="font-medium text-slate-900 line-clamp-1">
                        {b.service_listings?.title || 'Service booking'}
                      </p>
                      {b.service_listings?.price && (
                        <p className="text-xs font-semibold text-[#f97c66] mt-0.5">
                          PKR {Number(b.service_listings.price).toLocaleString()}
                        </p>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-slate-500 text-xs">
                      {b.customers?.users?.name || b.customers?.users?.email || '—'}
                    </td>
                    <td className="px-5 py-3.5 text-slate-500 text-xs">
                      {b.service_providers?.users?.name || b.service_providers?.users?.email || '—'}
                    </td>
                    <td className="px-5 py-3.5 text-xs text-slate-500">
                      {formatDate(b.service_date || b.created_at)}
                    </td>
                    <td className="px-5 py-3.5">
                      <StatusPill status={b.status} />
                    </td>
                    <td className="px-5 py-3.5">
                      <form action={updateBookingStatusAdmin} className="flex gap-1">
                        <input type="hidden" name="booking_id" value={b.booking_id} />
                        <button type="submit" name="status" value="confirmed"
                          className="rounded-lg border border-[#009689]/20 bg-[#009689]/5 px-2 py-1 text-[11px] font-semibold text-[#009689] hover:bg-[#009689]/12 transition-colors">
                          Confirm
                        </button>
                        <button type="submit" name="status" value="completed"
                          className="rounded-lg border border-emerald-200 bg-emerald-50 px-2 py-1 text-[11px] font-semibold text-emerald-700 hover:bg-emerald-100 transition-colors">
                          Done
                        </button>
                        <button type="submit" name="status" value="cancelled"
                          className="rounded-lg border border-rose-200 bg-rose-50 px-2 py-1 text-[11px] font-semibold text-rose-700 hover:bg-rose-100 transition-colors">
                          Cancel
                        </button>
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
