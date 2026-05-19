import { redirect } from 'next/navigation'
import {
  User, Mail, Phone, MapPin, Building2,
  ShieldCheck, Save, Lock,
} from 'lucide-react'
import { getCurrentUser, updateMyProfile } from '@/lib/actions/auth'
import Link from 'next/link'

/* ─── helpers ──────────────────────────────────────────────── */

function initials(name = '') {
  return name.split(' ').slice(0, 2).map((w) => w[0]?.toUpperCase() || '').join('')
}

function Field({ label, icon, children }) {
  return (
    <div className="space-y-1.5">
      <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500">
        {icon}
        {label}
      </label>
      {children}
    </div>
  )
}

/* ─── page ──────────────────────────────────────────────────── */
export default async function CustomerProfilePage() {
  const user = await getCurrentUser()
  if (!user) redirect('/login')

  const name  = user.profile?.name  || user.user_metadata?.name  || ''
  const phone = user.profile?.phone || user.user_metadata?.phone || ''
  const city  = user.user_metadata?.city    || ''
  const address = user.user_metadata?.address || ''
  const role  = user.profile?.role  || user.user_metadata?.role  || 'customer'

  return (
    <div className="space-y-6">

      {/* ── Profile hero ─────────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-600 to-emerald-800 p-6 text-white shadow-md">
        {/* decorative circles */}
        <div className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white/5" />
        <div className="pointer-events-none absolute -bottom-6 -left-6 h-32 w-32 rounded-full bg-white/5" />

        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
          {/* avatar */}
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-white/20 text-2xl font-bold backdrop-blur-sm select-none">
            {initials(name) || <User className="size-8" />}
          </div>

          {/* meta */}
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold leading-tight truncate">
              {name || 'Your Profile'}
            </h1>
            <p className="mt-0.5 text-emerald-100 text-sm truncate">{user.email}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-white/20 px-2.5 py-0.5 text-xs font-semibold capitalize">
                <ShieldCheck className="size-3" />
                {role}
              </span>
              {phone && (
                <span className="inline-flex items-center gap-1 rounded-full bg-white/20 px-2.5 py-0.5 text-xs font-medium">
                  <Phone className="size-3" />
                  {phone}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Edit form ─────────────────────────────────────────── */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="border-b border-slate-100 px-6 py-4">
          <h2 className="font-semibold text-slate-900">Personal Information</h2>
          <p className="text-sm text-slate-500 mt-0.5">Update your contact details and address.</p>
        </div>

        <form action={updateMyProfile} className="p-6 grid gap-5 md:grid-cols-2">

          <Field label="Full Name" icon={<User className="size-3.5 text-slate-400" />}>
            <input
              name="name"
              defaultValue={name}
              required
              placeholder="e.g. Ali Hassan"
              className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition"
            />
          </Field>

          <Field label="Email Address" icon={<Mail className="size-3.5 text-slate-400" />}>
            <input
              value={user.email || ''}
              disabled
              className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-400 cursor-not-allowed"
            />
          </Field>

          <Field label="Phone Number" icon={<Phone className="size-3.5 text-slate-400" />}>
            <input
              name="phone"
              defaultValue={phone}
              placeholder="e.g. 0300-1234567"
              className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition"
            />
          </Field>

          <Field label="City" icon={<Building2 className="size-3.5 text-slate-400" />}>
            <input
              name="city"
              defaultValue={city}
              placeholder="e.g. Lahore"
              className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition"
            />
          </Field>

          <div className="space-y-1.5 md:col-span-2">
            <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500">
              <MapPin className="size-3.5 text-slate-400" />
              Address
            </label>
            <input
              name="address"
              defaultValue={address}
              placeholder="Street, area, and any landmark"
              className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition"
            />
          </div>

          {/* footer */}
          <div className="md:col-span-2 flex items-center justify-between gap-3 pt-2 border-t border-slate-100">
            <Link
              href="/forgot-password"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-700"
            >
              <Lock className="size-4" /> Change password
            </Link>
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 transition-colors"
            >
              <Save className="size-4" /> Save Profile
            </button>
          </div>
        </form>
      </div>

      {/* ── Account info ─────────────────────────────────────── */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="border-b border-slate-100 px-6 py-4">
          <h2 className="font-semibold text-slate-900">Account Details</h2>
        </div>
        <div className="px-6 py-4 grid gap-3 sm:grid-cols-2 text-sm">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-0.5">User ID</p>
            <p className="text-slate-600 font-mono text-xs truncate">{user.id}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-0.5">Account Role</p>
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold capitalize text-emerald-700">
              <ShieldCheck className="size-3" />
              {role}
            </span>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-0.5">Member Since</p>
            <p className="text-slate-600">
              {new Date(user.created_at).toLocaleDateString('en', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-0.5">Last Sign In</p>
            <p className="text-slate-600">
              {user.last_sign_in_at
                ? new Date(user.last_sign_in_at).toLocaleDateString('en', { month: 'short', day: 'numeric', year: 'numeric' })
                : '—'}
            </p>
          </div>
        </div>
      </div>

    </div>
  )
}
