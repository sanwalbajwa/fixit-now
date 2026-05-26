import { redirect } from 'next/navigation'
import Link from 'next/link'
import {
  User, Mail, Phone, MapPin, Building2,
  BadgeCheck, ShieldCheck, Star, Save,
  Lock, Wrench, Clock4,
} from 'lucide-react'
import { getCurrentUser } from '@/lib/actions/auth'
import { getMyProviderProfile, updateProviderProfile } from '@/lib/actions/provider'

/* ─── helpers ──────────────────────────────────────────────── */

function initials(name = '') {
  return name.split(' ').slice(0, 2).map((w) => w[0]?.toUpperCase() || '').join('')
}

function Field({ label, icon, children, span2 = false }) {
  return (
    <div className={`space-y-1.5 ${span2 ? 'md:col-span-2' : ''}`}>
      <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500">
        {icon}
        {label}
      </label>
      {children}
    </div>
  )
}

/* ─── page ──────────────────────────────────────────────────── */
export default async function ProviderProfilePage() {
  const user = await getCurrentUser()
  if (!user) redirect('/login')

  const profileData = await getMyProviderProfile()
  const provider = profileData.provider

  const name    = user.profile?.name    || user.user_metadata?.name    || ''
  const phone   = user.profile?.phone   || user.user_metadata?.phone   || ''
  const city    = user.user_metadata?.city    || ''
  const address = user.user_metadata?.address || ''
  const profileImageUrl = user.profile?.profile_image_url || user.user_metadata?.profile_image_url || ''

  return (
    <div className="space-y-6">

      {/* ── Profile hero ─────────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#009689] via-teal-700 to-[#009689] p-6 text-white shadow-md">
        <div className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white/10" />
        <div className="pointer-events-none absolute -bottom-6 -left-6 h-32 w-32 rounded-full bg-[#f97c66]/20" />

        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
          {/* avatar */}
          <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-white/20 text-2xl font-bold backdrop-blur-sm select-none ring-1 ring-white/20">
            {profileImageUrl ? (
              <img src={profileImageUrl} alt={name || 'Profile photo'} className="h-full w-full object-cover" />
            ) : (
              initials(name) || <Wrench className="size-8" />
            )}
          </div>

          {/* meta */}
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold leading-tight truncate">
              {name || 'Your Profile'}
            </h1>
            <p className="mt-0.5 text-teal-100 text-sm truncate">{user.email}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-white/20 px-2.5 py-0.5 text-xs font-semibold">
                {provider?.is_verified
                  ? <BadgeCheck className="size-3" />
                  : <ShieldCheck className="size-3" />}
                {provider?.is_verified ? 'Verified Provider' : 'Pending Verification'}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-white/20 px-2.5 py-0.5 text-xs font-semibold">
                <Star className="size-3 fill-amber-200 stroke-amber-200" />
                {Number(provider?.rating || 0).toFixed(1)} rating
              </span>
              {provider?.availability && (
                <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                  provider.availability === 'available' ? 'bg-emerald-500/30' : 'bg-[#f97c66]/30'
                }`}>
                  <Clock4 className="size-3" />
                  {provider.availability === 'available' ? 'Available' : 'Busy'}
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
          <p className="text-sm text-slate-500 mt-0.5">Update your contact details visible to customers.</p>
        </div>

        <form action={updateProviderProfile} encType="multipart/form-data" className="p-6 grid gap-5 md:grid-cols-2">

          <Field label="Profile Picture" icon={<User className="size-3.5 text-slate-400" />}>
            <input
              name="profile_image"
              type="file"
              accept="image/*"
              className="block w-full cursor-pointer rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-emerald-50 file:px-3 file:py-1.5 file:text-sm file:font-semibold file:text-emerald-700 hover:file:bg-emerald-100"
            />
            <p className="text-xs text-slate-400">Upload a JPG, PNG, or WEBP image.</p>
          </Field>

          <Field label="Full Name" icon={<User className="size-3.5 text-slate-400" />}>
            <input
              name="name"
              defaultValue={name}
              required
              placeholder="e.g. Ali Hassan"
              className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-[#009689] focus:ring-2 focus:ring-[#009689]/20 transition"
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
              className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-[#009689] focus:ring-2 focus:ring-[#009689]/20 transition"
            />
          </Field>

          <Field label="Availability" icon={<Clock4 className="size-3.5 text-slate-400" />}>
            <select
              name="availability"
              defaultValue={provider?.availability || 'available'}
              className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-[#009689] focus:ring-2 focus:ring-[#009689]/20 transition"
            >
              <option value="available">Available — accepting new jobs</option>
              <option value="busy">Busy — not taking new bookings</option>
            </select>
          </Field>

          <Field label="City" icon={<Building2 className="size-3.5 text-slate-400" />}>
            <input
              name="city"
              defaultValue={city}
              placeholder="e.g. Lahore"
              className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-[#009689] focus:ring-2 focus:ring-[#009689]/20 transition"
            />
          </Field>

          <Field label="Address" icon={<MapPin className="size-3.5 text-slate-400" />}>
            <input
              name="address"
              defaultValue={address}
              placeholder="Street, area, and any landmark"
              className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-[#009689] focus:ring-2 focus:ring-[#009689]/20 transition"
            />
          </Field>

          <Field label="Skills & Specialties" icon={<Wrench className="size-3.5 text-slate-400" />} span2>
            <textarea
              name="skills"
              rows={4}
              defaultValue={provider?.skills || ''}
              placeholder="Describe your skills, specialties, years of experience, and certifications…"
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#009689] focus:ring-2 focus:ring-[#009689]/20 transition resize-none"
            />
          </Field>

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
              className="inline-flex items-center gap-2 rounded-xl bg-[#f97c66] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#e0624e] transition-colors shadow-sm"
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
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-0.5">Verification Status</p>
            <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
              provider?.is_verified
                ? 'bg-[#009689]/10 border-[#009689]/20 text-[#009689]'
                : 'bg-[#f97c66]/10 border-[#f97c66]/20 text-[#f97c66]'
            }`}>
              {provider?.is_verified ? <BadgeCheck className="size-3" /> : <ShieldCheck className="size-3" />}
              {provider?.is_verified ? 'Verified' : 'Pending'}
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
