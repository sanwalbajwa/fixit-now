import Link from 'next/link'
import { redirect } from 'next/navigation'
import {
  Search, ClipboardList, UserCircle, Bell, Star, ArrowRight,
  CalendarClock, CheckCircle2, CreditCard, BadgeCheck,
  ChevronRight, Wrench, Zap, Droplets, Paintbrush,
  Wind, Sparkles, Sofa, Cpu, ShieldCheck, LayoutGrid,
} from 'lucide-react'
import { getCurrentUser } from '@/lib/actions/auth'
import { getCustomerBookings } from '@/lib/actions/bookings'
import { getAllCategories, getVerifiedProviders } from '@/lib/actions/services'
import { Badge } from '@/components/ui/badge'

/* ─── helpers ────────────────────────────────────────────────── */

function money(value) {
  return `PKR ${Number(value || 0).toLocaleString()}`
}

const STATUS_STYLE = {
  pending:     { bg: 'bg-amber-100',   text: 'text-amber-700',   dot: 'bg-amber-500'   },
  confirmed:   { bg: 'bg-sky-100',     text: 'text-sky-700',     dot: 'bg-sky-500'     },
  in_progress: { bg: 'bg-violet-100',  text: 'text-violet-700',  dot: 'bg-violet-500'  },
  completed:   { bg: 'bg-emerald-100', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  cancelled:   { bg: 'bg-rose-100',    text: 'text-rose-700',    dot: 'bg-rose-500'    },
}

function StatusBadge({ status }) {
  const s = STATUS_STYLE[status] || STATUS_STYLE.pending
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${s.bg} ${s.text}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
      {status.replace('_', ' ')}
    </span>
  )
}

const CATEGORY_ICONS = {
  plumbing:    <Droplets   className="size-5" />,
  electrical:  <Zap        className="size-5" />,
  cleaning:    <Sparkles   className="size-5" />,
  painting:    <Paintbrush className="size-5" />,
  carpentry:   <Sofa       className="size-5" />,
  ac:          <Wind       className="size-5" />,
  appliance:   <Cpu        className="size-5" />,
  furniture:   <Sofa       className="size-5" />,
  default:     <Wrench     className="size-5" />,
}

function categoryIcon(name = '') {
  const key = Object.keys(CATEGORY_ICONS).find((k) =>
    k !== 'default' && name.toLowerCase().includes(k)
  )
  return CATEGORY_ICONS[key] || CATEGORY_ICONS.default
}

const CATEGORY_COLORS = [
  'bg-blue-50   text-blue-600   border-blue-100',
  'bg-amber-50  text-amber-600  border-amber-100',
  'bg-emerald-50 text-emerald-600 border-emerald-100',
  'bg-violet-50 text-violet-600 border-violet-100',
  'bg-rose-50   text-rose-600   border-rose-100',
  'bg-sky-50    text-sky-600    border-sky-100',
]

function initials(name = '') {
  return name.split(' ').slice(0, 2).map((w) => w[0]?.toUpperCase() || '').join('')
}

/* ─── quick-action cards config ──────────────────────────────── */
const QUICK_ACTIONS = [
  {
    href: '/dashboard/customer/services',
    icon: <Search className="size-6" />,
    label: 'Browse Services',
    desc: 'Find verified providers near you',
    accent: 'bg-emerald-500',
    ring: 'ring-emerald-100',
  },
  {
    href: '/dashboard/customer/bookings',
    icon: <ClipboardList className="size-6" />,
    label: 'My Bookings',
    desc: 'Track active and past requests',
    accent: 'bg-sky-500',
    ring: 'ring-sky-100',
  },
  {
    href: '/dashboard/customer/profile',
    icon: <UserCircle className="size-6" />,
    label: 'Edit Profile',
    desc: 'Update your contact and address',
    accent: 'bg-violet-500',
    ring: 'ring-violet-100',
  },
  {
    href: '/dashboard/customer/notifications',
    icon: <Bell className="size-6" />,
    label: 'Notifications',
    desc: 'Booking updates and alerts',
    accent: 'bg-amber-500',
    ring: 'ring-amber-100',
  },
  {
    href: '/services',
    icon: <LayoutGrid className="size-6" />,
    label: 'Provider Directory',
    desc: 'Public listing of all professionals',
    accent: 'bg-rose-500',
    ring: 'ring-rose-100',
    wide: true,
  },
]

/* ─── page ────────────────────────────────────────────────────── */
export default async function CustomerDashboard() {
  const user = await getCurrentUser()
  if (!user) redirect('/login')

  const [bookings, categories, providers] = await Promise.all([
    getCustomerBookings(),
    getAllCategories(),
    getVerifiedProviders({ sort_by: 'rating' }),
  ])

  const activeBookings    = bookings.filter((b) => !['completed', 'cancelled'].includes(b.status))
  const completedBookings = bookings.filter((b) => b.status === 'completed')
  const totalSpent        = completedBookings.reduce((t, b) => t + Number(b.service_listings?.price || 0), 0)
  const firstName         = (user.profile?.name || user.user_metadata?.name || user.email || '').split(' ')[0]

  return (
    <div className="space-y-8">

      {/* ── Hero ───────────────────────────────────────────────── */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-600 to-emerald-800 p-8 text-white shadow-lg">
        {/* decorative circles */}
        <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/5" />
        <div className="pointer-events-none absolute -bottom-10 -right-4 h-44 w-44 rounded-full bg-white/5" />
        <div className="pointer-events-none absolute bottom-0 left-32 h-28 w-28 rounded-full bg-white/5" />

        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold tracking-widest uppercase">
              <ShieldCheck className="size-3.5" /> Customer Dashboard
            </span>
            <h1 className="mt-3 text-4xl font-heading font-bold">
              Welcome back, {firstName}!
            </h1>
            <p className="mt-2 max-w-xl text-emerald-100">
              Book verified professionals, track your service requests, and manage everything in one place.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/dashboard/customer/services"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-emerald-700 shadow hover:bg-emerald-50 transition-colors"
            >
              <Search className="size-4" /> Browse Services
            </Link>
            <Link
              href="/dashboard/customer/bookings"
              className="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/20 transition-colors"
            >
              <ClipboardList className="size-4" /> My Bookings
            </Link>
          </div>
        </div>
      </section>

      {/* ── Stat cards ─────────────────────────────────────────── */}
      <section className="grid gap-4 md:grid-cols-3">
        <div className="flex items-center gap-4 rounded-2xl border bg-white p-5 shadow-sm">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-sky-100 text-sky-600">
            <CalendarClock className="size-6" />
          </div>
          <div>
            <p className="text-sm text-slate-500">Active Bookings</p>
            <p className="text-3xl font-bold text-slate-900">{activeBookings.length}</p>
            <p className="text-xs text-slate-400 mt-0.5">Jobs in progress</p>
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-2xl border bg-white p-5 shadow-sm">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
            <CheckCircle2 className="size-6" />
          </div>
          <div>
            <p className="text-sm text-slate-500">Completed</p>
            <p className="text-3xl font-bold text-slate-900">{completedBookings.length}</p>
            <p className="text-xs text-slate-400 mt-0.5">Finished services</p>
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-2xl border bg-white p-5 shadow-sm">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-violet-100 text-violet-600">
            <CreditCard className="size-6" />
          </div>
          <div>
            <p className="text-sm text-slate-500">Total Spent</p>
            <p className="text-2xl font-bold text-slate-900">{money(totalSpent)}</p>
            <p className="text-xs text-slate-400 mt-0.5">Lifetime payments</p>
          </div>
        </div>
      </section>

      {/* ── Quick Actions + Categories ──────────────────────────── */}
      <section className="grid gap-6 lg:grid-cols-3">

        {/* Quick actions */}
        <div className="lg:col-span-2 space-y-3">
          <h2 className="text-lg font-semibold text-slate-900">Quick Actions</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {QUICK_ACTIONS.map((action) => (
              <Link
                key={action.href}
                href={action.href}
                className={`group flex items-center gap-4 rounded-2xl border bg-white p-4 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5 ${action.wide ? 'sm:col-span-2' : ''}`}
              >
                <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${action.accent} text-white ring-4 ${action.ring}`}>
                  {action.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-900 group-hover:text-emerald-700 transition-colors">{action.label}</p>
                  <p className="text-xs text-slate-500 truncate">{action.desc}</p>
                </div>
                <ChevronRight className="size-4 text-slate-300 group-hover:text-emerald-500 transition-colors shrink-0" />
              </Link>
            ))}
          </div>
        </div>

        {/* Popular Categories */}
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-slate-900">Popular Categories</h2>
          <div className="rounded-2xl border bg-white shadow-sm divide-y overflow-hidden">
            {categories.slice(0, 6).map((cat, i) => (
              <Link
                key={cat.category_id}
                href="/dashboard/customer/services"
                className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors group"
              >
                <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border ${CATEGORY_COLORS[i % CATEGORY_COLORS.length]}`}>
                  {categoryIcon(cat.category_name)}
                </div>
                <span className="flex-1 text-sm font-medium text-slate-700 group-hover:text-emerald-700 transition-colors">
                  {cat.category_name}
                </span>
                <ChevronRight className="size-4 text-slate-300 group-hover:text-emerald-500 transition-colors" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Recent Bookings + Featured Providers ───────────────── */}
      <section className="grid gap-6 xl:grid-cols-2">

        {/* Recent Bookings */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">Recent Bookings</h2>
            <Link
              href="/dashboard/customer/bookings"
              className="inline-flex items-center gap-1 text-sm font-medium text-emerald-600 hover:text-emerald-700"
            >
              View all <ArrowRight className="size-3.5" />
            </Link>
          </div>

          <div className="rounded-2xl border bg-white shadow-sm overflow-hidden">
            {bookings.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-3 py-12 text-center px-6">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                  <ClipboardList className="size-7" />
                </div>
                <p className="font-medium text-slate-700">No bookings yet</p>
                <p className="text-sm text-slate-500">Browse our services to make your first booking.</p>
                <Link
                  href="/dashboard/customer/services"
                  className="mt-1 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 transition-colors"
                >
                  <Search className="size-4" /> Browse Services
                </Link>
              </div>
            ) : (
              <ul className="divide-y">
                {bookings.slice(0, 4).map((booking) => (
                  <li key={booking.booking_id} className="flex items-center gap-4 px-4 py-3.5 hover:bg-slate-50 transition-colors">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                      <Wrench className="size-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="truncate font-medium text-slate-900">
                        {booking.service_listings?.title || 'Service booking'}
                      </p>
                      <p className="text-xs text-slate-500 truncate">
                        {booking.service_providers?.users?.name || 'Provider'} •{' '}
                        {booking.service_date
                          ? new Date(booking.service_date).toLocaleDateString('en', { month: 'short', day: 'numeric' })
                          : 'No date set'}
                      </p>
                    </div>
                    <StatusBadge status={booking.status} />
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Featured Providers */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">Top Providers</h2>
            <Link
              href="/services"
              className="inline-flex items-center gap-1 text-sm font-medium text-emerald-600 hover:text-emerald-700"
            >
              See all <ArrowRight className="size-3.5" />
            </Link>
          </div>

          <div className="rounded-2xl border bg-white shadow-sm overflow-hidden">
            {providers.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-3 py-12 text-center px-6">
                <p className="text-sm text-slate-500">No verified providers yet.</p>
              </div>
            ) : (
              <ul className="divide-y">
                {providers.slice(0, 4).map((provider) => {
                  const name    = provider.users?.name || provider.users?.email || 'Provider'
                  const rating  = Number(provider.rating || 0).toFixed(1)
                  const reviews = provider.total_reviews || 0
                  return (
                    <li key={provider.provider_id} className="flex items-center gap-4 px-4 py-3.5 hover:bg-slate-50 transition-colors">
                      {/* avatar */}
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 text-white text-sm font-bold select-none">
                        {initials(name)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <p className="truncate font-medium text-slate-900">{name}</p>
                          {provider.is_verified && (
                            <BadgeCheck className="size-4 shrink-0 text-emerald-500" />
                          )}
                        </div>
                        <p className="text-xs text-slate-500 truncate">{provider.skills || 'Professional services'}</p>
                      </div>
                      <div className="shrink-0 text-right">
                        <div className="flex items-center gap-1 text-amber-500">
                          <Star className="size-3.5 fill-amber-400 stroke-amber-500" />
                          <span className="text-sm font-semibold text-slate-700">{rating}</span>
                        </div>
                        <p className="text-xs text-slate-400">{reviews} review{reviews !== 1 ? 's' : ''}</p>
                      </div>
                      <Link
                        href={`/services/${provider.provider_id}`}
                        className="ml-1 shrink-0 inline-flex items-center justify-center h-8 w-8 rounded-lg border border-emerald-200 text-emerald-600 hover:bg-emerald-50 transition-colors"
                      >
                        <ChevronRight className="size-4" />
                      </Link>
                    </li>
                  )
                })}
              </ul>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
