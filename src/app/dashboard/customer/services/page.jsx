import Link from 'next/link'
import { redirect } from 'next/navigation'
import {
  Search, Star, BadgeCheck, SlidersHorizontal,
  Wrench, Zap, Droplets, Paintbrush, Wind,
  Sparkles, Sofa, Cpu, ChevronRight, MapPin,
  Phone, Users,
} from 'lucide-react'
import { getCurrentUser } from '@/lib/actions/auth'
import { getAllCategories, getVerifiedProviders } from '@/lib/actions/services'

/* ─── helpers ──────────────────────────────────────────────── */

function withParams(base, current, updates = {}) {
  const next = new URLSearchParams()
  Object.entries({ ...current, ...updates }).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') next.set(k, String(v))
  })
  const q = next.toString()
  return q ? `${base}?${q}` : base
}

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

function StarRow({ rating, size = 'size-3.5' }) {
  const r = Number(rating || 0)
  return (
    <span className="inline-flex items-center gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className={`${size} ${i < Math.round(r) ? 'fill-amber-400 stroke-amber-400' : 'fill-none stroke-slate-300'}`}
        />
      ))}
    </span>
  )
}

const AVAIL_STYLE = {
  available: 'bg-emerald-100 text-emerald-700',
  busy:      'bg-rose-100 text-rose-700',
}

/* ─── page ──────────────────────────────────────────────────── */
export default async function CustomerServicesPage({ searchParams }) {
  const user = await getCurrentUser()
  if (!user) redirect('/login')

  const sp = await searchParams

  const [categories, providers] = await Promise.all([
    getAllCategories(),
    getVerifiedProviders({
      category_id:  sp?.category,
      min_rating:   sp?.rating,
      sort_by:      sp?.sort,
      search:       sp?.q,
      availability: sp?.availability,
      min_price:    sp?.min_price,
      max_price:    sp?.max_price,
    }),
  ])

  const activeCategory = categories.find((c) => c.category_id === sp?.category)

  return (
    <div className="space-y-6">

      {/* ── Page header ──────────────────────────────────────── */}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Browse Services</h1>
          <p className="text-sm text-slate-500">
            {providers.length} verified provider{providers.length !== 1 ? 's' : ''} available
            {activeCategory ? ` in ${activeCategory.category_name}` : ''}
          </p>
        </div>
        {(sp?.q || sp?.category || sp?.rating) && (
          <Link
            href="/dashboard/customer/services"
            className="text-sm font-medium text-rose-600 hover:text-rose-700"
          >
            Clear filters
          </Link>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-[260px_1fr]">

        {/* ── Sidebar ──────────────────────────────────────────── */}
        <aside className="space-y-5 h-fit">

          {/* Search */}
          <form action="/dashboard/customer/services" className="space-y-3">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
              <input
                name="q"
                defaultValue={sp?.q || ''}
                placeholder="Search providers or skills…"
                className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 text-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
              />
            </div>

            {/* Availability */}
            <div>
              <p className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500">Availability</p>
              <select
                name="availability"
                defaultValue={sp?.availability || ''}
                className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-emerald-400"
              >
                <option value="">Any status</option>
                <option value="available">Available now</option>
                <option value="busy">Busy</option>
              </select>
            </div>

            {/* Price range */}
            <div>
              <p className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500">Price Range (PKR)</p>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number" min="0" name="min_price"
                  defaultValue={sp?.min_price || ''}
                  placeholder="Min"
                  className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-emerald-400"
                />
                <input
                  type="number" min="0" name="max_price"
                  defaultValue={sp?.max_price || ''}
                  placeholder="Max"
                  className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-emerald-400"
                />
              </div>
            </div>

            {/* Sort */}
            <div>
              <p className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500">Sort By</p>
              <select
                name="sort"
                defaultValue={sp?.sort || ''}
                className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-emerald-400"
              >
                <option value="">Default</option>
                <option value="rating">Highest Rated</option>
                <option value="reviews">Most Reviewed</option>
              </select>
            </div>

            {sp?.category && <input type="hidden" name="category" value={sp.category} />}
            {sp?.rating   && <input type="hidden" name="rating"   value={sp.rating}   />}

            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 transition-colors"
            >
              <SlidersHorizontal className="size-4" /> Apply Filters
            </button>
          </form>

          {/* Categories */}
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">Categories</p>
            <div className="rounded-xl border bg-white overflow-hidden divide-y">
              <Link
                href="/dashboard/customer/services"
                className={`flex items-center gap-2.5 px-3 py-2.5 text-sm transition-colors hover:bg-slate-50 ${!sp?.category ? 'bg-emerald-50 font-semibold text-emerald-700' : 'text-slate-700'}`}
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                  <Wrench className="size-3.5" />
                </span>
                All Services
              </Link>
              {categories.map((cat) => (
                <Link
                  key={cat.category_id}
                  href={withParams('/dashboard/customer/services', sp, { category: cat.category_id })}
                  className={`flex items-center gap-2.5 px-3 py-2.5 text-sm transition-colors hover:bg-slate-50 ${sp?.category === cat.category_id ? 'bg-emerald-50 font-semibold text-emerald-700' : 'text-slate-700'}`}
                >
                  <span className={`flex h-7 w-7 items-center justify-center rounded-lg ${sp?.category === cat.category_id ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>
                    {catIcon(cat.category_name)}
                  </span>
                  {cat.category_name}
                </Link>
              ))}
            </div>
          </div>

          {/* Min rating */}
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">Minimum Rating</p>
            <div className="space-y-1.5">
              {[4.5, 4.0, 3.5].map((r) => (
                <Link
                  key={r}
                  href={withParams('/dashboard/customer/services', sp, { rating: r })}
                  className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-sm transition-colors hover:bg-amber-50 hover:border-amber-200 ${Number(sp?.rating) === r ? 'border-amber-300 bg-amber-50 font-semibold text-amber-700' : 'border-slate-200 text-slate-600'}`}
                >
                  <StarRow rating={r} />
                  <span>{r}+ Stars</span>
                </Link>
              ))}
            </div>
          </div>
        </aside>

        {/* ── Provider grid ──────────────────────────────────── */}
        <section>
          {providers.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed border-slate-200 bg-white py-20 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                <Users className="size-8" />
              </div>
              <div>
                <p className="font-semibold text-slate-700">No providers found</p>
                <p className="text-sm text-slate-500">Try adjusting your filters or search term.</p>
              </div>
              <Link
                href="/dashboard/customer/services"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Clear all filters
              </Link>
            </div>
          ) : (
            <div className="grid gap-4 xl:grid-cols-2">
              {providers.map((provider) => {
                const name    = provider.users?.name || provider.users?.email || 'Provider'
                const rating  = Number(provider.rating || 0).toFixed(1)
                const reviews = provider.total_reviews || 0
                const avail   = provider.availability || ''
                return (
                  <div
                    key={provider.provider_id}
                    className="group flex flex-col gap-4 rounded-2xl border bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
                  >
                    {/* top row */}
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 text-white font-bold text-sm select-none">
                        {initials(name)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <p className="font-semibold text-slate-900 truncate">{name}</p>
                          <BadgeCheck className="size-4 text-emerald-500 shrink-0" />
                        </div>
                        <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                          <div className="flex items-center gap-1">
                            <StarRow rating={rating} />
                            <span className="text-xs font-semibold text-slate-700">{rating}</span>
                            <span className="text-xs text-slate-400">({reviews})</span>
                          </div>
                          {avail && (
                            <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${AVAIL_STYLE[avail] || 'bg-slate-100 text-slate-600'}`}>
                              {avail}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* skills */}
                    <p className="text-sm text-slate-600 line-clamp-2">
                      {provider.skills || 'Professional home services provider.'}
                    </p>

                    {/* meta */}
                    {provider.users?.phone && (
                      <div className="flex items-center gap-1.5 text-xs text-slate-500">
                        <Phone className="size-3.5" />
                        {provider.users.phone}
                      </div>
                    )}

                    {/* actions */}
                    <div className="flex gap-2 pt-1">
                      <Link
                        href={`/services/${provider.provider_id}`}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        View Profile <ChevronRight className="size-3.5" />
                      </Link>
                      <Link
                        href={`/dashboard/customer/book/${provider.provider_id}`}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 py-2 text-sm font-semibold text-white hover:bg-emerald-700 transition-colors"
                      >
                        Book Now
                      </Link>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
