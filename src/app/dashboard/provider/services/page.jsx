import { redirect } from 'next/navigation'
import {
  Wrench, Plus, Search, SlidersHorizontal,
  Tag, BadgeCheck, ShieldCheck, Star,
  Droplets, Zap, Sparkles, Paintbrush,
  Wind, Sofa, Cpu, PackageOpen,
} from 'lucide-react'
import { getCurrentUser } from '@/lib/actions/auth'
import { getAllCategories } from '@/lib/actions/services'
import { createServiceListing, getMyServiceListings, getMyProviderProfile } from '@/lib/actions/provider'

/* ─── helpers ──────────────────────────────────────────────── */

const CAT_ICONS = {
  plumbing:   <Droplets   className="size-4" />,
  electrical: <Zap        className="size-4" />,
  cleaning:   <Sparkles   className="size-4" />,
  painting:   <Paintbrush className="size-4" />,
  carpentry:  <Sofa       className="size-4" />,
  ac:         <Wind       className="size-4" />,
  appliance:  <Cpu        className="size-4" />,
  furniture:  <Sofa       className="size-4" />,
  default:    <Wrench     className="size-4" />,
}

function catIcon(name = '') {
  const key = Object.keys(CAT_ICONS).find(
    (k) => k !== 'default' && name.toLowerCase().includes(k)
  )
  return CAT_ICONS[key] || CAT_ICONS.default
}

function initials(name = '') {
  return name.split(' ').slice(0, 2).map((w) => w[0]?.toUpperCase() || '').join('')
}

// Alternate teal/orange for icon tiles by index
const tileColor = (i) => i % 2 === 0
  ? 'bg-[#009689]/10 text-[#009689]'
  : 'bg-[#f97c66]/10 text-[#f97c66]'

/* ─── page ──────────────────────────────────────────────────── */
export default async function ProviderServicesPage({ searchParams }) {
  const user = await getCurrentUser()
  if (!user) redirect('/login')

  const sp = await searchParams

  const [categories, listings, profileData] = await Promise.all([
    getAllCategories(),
    getMyServiceListings(),
    getMyProviderProfile(),
  ])

  const provider = profileData.provider
  const name     = profileData.user?.profile?.name || profileData.user?.user_metadata?.name || profileData.user?.email || ''

  const query    = String(sp?.q || '').toLowerCase().trim()
  const selCat   = String(sp?.category || '')
  const minPrice = sp?.min_price ? Number(sp.min_price) : null
  const maxPrice = sp?.max_price ? Number(sp.max_price) : null

  const filtered = listings.filter((l) => {
    if (selCat && l.category_id !== selCat) return false
    if (minPrice !== null && Number(l.price || 0) < minPrice) return false
    if (maxPrice !== null && Number(l.price || 0) > maxPrice) return false
    if (query) {
      const hay = [l.title, l.description, l.service_categories?.category_name]
        .filter(Boolean).join(' ').toLowerCase()
      if (!hay.includes(query)) return false
    }
    return true
  })

  return (
    <div className="space-y-6">

      {/* ── Header ───────────────────────────────────────────── */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">My Services</h1>
        <p className="text-sm text-slate-500 mt-0.5">
          <span className="font-semibold text-[#009689]">{listings.length}</span>{' '}
          listing{listings.length !== 1 ? 's' : ''} published
        </p>
      </div>

      {/* ── Create form ───────────────────────────────────────── */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="flex items-center gap-3 border-b border-slate-100 px-6 py-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#009689]/10 text-[#009689]">
            <Plus className="size-4" />
          </div>
          <div>
            <h2 className="font-semibold text-slate-900">Create Service Listing</h2>
            <p className="text-xs text-slate-400">Publish a new offer so customers can book you.</p>
          </div>
        </div>

        <form action={createServiceListing} className="p-6 grid gap-4 md:grid-cols-2">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Title</label>
            <input
              name="title"
              placeholder="e.g. Plumbing Repair & Inspection"
              required
              className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-[#009689] focus:ring-2 focus:ring-[#009689]/20 transition"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Category</label>
            <select
              name="category_id"
              required
              className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-[#009689] focus:ring-2 focus:ring-[#009689]/20 transition"
            >
              <option value="">Select category</option>
              {categories.map((c) => (
                <option key={c.category_id} value={c.category_id}>{c.category_name}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Starting Price (PKR)</label>
            <input
              name="price"
              type="number"
              min="0"
              placeholder="e.g. 2500"
              required
              className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-[#009689] focus:ring-2 focus:ring-[#009689]/20 transition"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Short Description</label>
            <input
              name="description"
              placeholder="Brief summary of the service"
              className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-[#009689] focus:ring-2 focus:ring-[#009689]/20 transition"
            />
          </div>

          <div className="md:col-span-2">
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-xl bg-[#f97c66] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#e0624e] transition-colors shadow-sm"
            >
              <Plus className="size-4" /> Publish Listing
            </button>
          </div>
        </form>
      </div>

      {/* ── Listings + profile grid ───────────────────────────── */}
      <div className="grid gap-6 lg:grid-cols-[1fr_300px]">

        {/* Listings */}
        <div className="space-y-4">
          {/* filter bar */}
          <form action="/dashboard/provider/services" className="flex flex-wrap gap-2">
            <div className="relative flex-1 min-w-[160px]">
              <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
              <input
                name="q"
                defaultValue={sp?.q || ''}
                placeholder="Search listings…"
                className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 text-sm outline-none focus:border-[#009689] focus:ring-2 focus:ring-[#009689]/20"
              />
            </div>
            <select
              name="category"
              defaultValue={sp?.category || ''}
              className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-[#009689]"
            >
              <option value="">All categories</option>
              {categories.map((c) => (
                <option key={c.category_id} value={c.category_id}>{c.category_name}</option>
              ))}
            </select>
            <input
              type="number" min="0" name="min_price"
              defaultValue={sp?.min_price || ''}
              placeholder="Min PKR"
              className="h-10 w-24 rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-[#009689]"
            />
            <input
              type="number" min="0" name="max_price"
              defaultValue={sp?.max_price || ''}
              placeholder="Max PKR"
              className="h-10 w-24 rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-[#009689]"
            />
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <SlidersHorizontal className="size-4" /> Filter
            </button>
          </form>

          {/* empty state */}
          {filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed border-slate-200 bg-white py-16 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#009689]/10 text-[#009689]">
                <PackageOpen className="size-7" />
              </div>
              <div>
                <p className="font-semibold text-slate-700">No listings found</p>
                <p className="text-sm text-slate-500 mt-1">
                  {listings.length === 0 ? 'Create your first listing above.' : 'Try adjusting your filters.'}
                </p>
              </div>
            </div>
          )}

          {/* listing cards */}
          <div className="grid gap-3">
            {filtered.map((l, i) => (
              <div
                key={l.listing_id}
                className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${tileColor(i)}`}>
                  {catIcon(l.service_categories?.category_name || '')}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <p className="font-semibold text-slate-900">{l.title}</p>
                    <span className="inline-flex items-center gap-1 rounded-full bg-[#f97c66]/10 border border-[#f97c66]/20 px-2.5 py-0.5 text-xs font-semibold text-[#f97c66]">
                      <Tag className="size-3" />
                      PKR {Number(l.price || 0).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">{l.service_categories?.category_name || 'Uncategorized'}</p>
                  {l.description && (
                    <p className="text-sm text-slate-600 mt-1.5 line-clamp-2">{l.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Profile summary */}
        <div className="h-fit rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="border-b border-slate-100 px-5 py-4">
            <h2 className="font-semibold text-slate-900">Provider Profile</h2>
          </div>
          <div className="p-5 space-y-4">
            {/* avatar + name */}
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#009689] to-teal-700 text-white font-bold text-sm select-none">
                {initials(name)}
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-slate-900 truncate">{name}</p>
                <p className="text-xs text-slate-400 truncate">{profileData.user?.email}</p>
              </div>
            </div>

            {/* badges */}
            <div className="flex flex-wrap gap-2">
              <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
                provider?.is_verified
                  ? 'bg-[#009689]/10 border-[#009689]/20 text-[#009689]'
                  : 'bg-[#f97c66]/10 border-[#f97c66]/20 text-[#f97c66]'
              }`}>
                {provider?.is_verified ? <BadgeCheck className="size-3" /> : <ShieldCheck className="size-3" />}
                {provider?.is_verified ? 'Verified' : 'Pending'}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-xs font-semibold text-slate-600">
                <Star className="size-3 fill-amber-400 stroke-amber-400" />
                {Number(provider?.rating || 0).toFixed(1)}
              </span>
            </div>

            {/* skills */}
            {provider?.skills ? (
              <p className="text-xs text-slate-600 leading-relaxed line-clamp-4">{provider.skills}</p>
            ) : (
              <p className="text-xs text-slate-400 italic">No skills description added yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
