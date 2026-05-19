import { Suspense } from 'react'
import Link from 'next/link'
import { getAllCategories, getVerifiedProviders } from '@/lib/actions/services'
import ProviderCard from '@/components/ProviderCard'
import ServicesSortFilter from '@/components/ServicesSortFilter'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import {
  Search, SlidersHorizontal, Star, X,
  CheckCircle2, Users,
} from 'lucide-react'

function withParams(basePath, currentParams, updates = {}) {
  const next = new URLSearchParams()
  Object.entries({
    category: currentParams?.category,
    rating: currentParams?.rating,
    sort: currentParams?.sort,
    q: currentParams?.q,
    availability: currentParams?.availability,
    min_price: currentParams?.min_price,
    max_price: currentParams?.max_price,
    ...updates,
  }).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') next.set(key, String(value))
  })
  const query = next.toString()
  return query ? `${basePath}?${query}` : basePath
}

const RATINGS = [4.5, 4.0, 3.5, 3.0]

async function ServicesContent({ searchParams }) {
  const categories = await getAllCategories()
  const providers = await getVerifiedProviders({
    category_id: searchParams?.category,
    min_rating: searchParams?.rating,
    sort_by: searchParams?.sort,
    search: searchParams?.q,
    availability: searchParams?.availability,
    min_price: searchParams?.min_price,
    max_price: searchParams?.max_price,
  })

  const selectedCategory = searchParams?.category
  const hasFilters = !!(selectedCategory || searchParams?.rating || searchParams?.q || searchParams?.availability || searchParams?.min_price || searchParams?.max_price)
  const selectedCategoryName = categories.find(c => c.category_id === selectedCategory)?.category_name

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      {/* ══════════════════════════════════════════════════════════
          HERO — light, dual-color
      ══════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#009689]/5 via-white to-[#f97c66]/5 py-16">
        <div className="pointer-events-none absolute -top-32 -right-32 h-80 w-80 rounded-full bg-[#009689] opacity-[0.08] blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -left-32 h-80 w-80 rounded-full bg-[#f97c66] opacity-[0.08] blur-3xl" />
        <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-[#f97c66] via-[#009689] to-[#f97c66]" />

        <div className="container relative mx-auto px-4 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">

            {/* dual-pill badge */}
            <div className="inline-flex items-center gap-0 rounded-full border border-slate-200 bg-white shadow-sm overflow-hidden mb-5">
              <span className="flex items-center gap-1.5 bg-[#009689]/10 px-4 py-1.5 text-sm font-semibold text-[#009689]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#009689] animate-pulse" />
                {providers.length}+ Verified Pros
              </span>
              <span className="flex items-center gap-1.5 bg-[#f97c66]/10 px-4 py-1.5 text-sm font-semibold text-[#f97c66]">
                Book Instantly
                <span className="h-1.5 w-1.5 rounded-full bg-[#f97c66] animate-pulse" />
              </span>
            </div>

            <h1 className="font-heading text-5xl font-bold text-slate-900 mb-4 leading-tight">
              Find Your Perfect{' '}
              <span className="text-[#009689]">Service</span>{' '}
              <span className="text-[#f97c66]">Provider</span>
            </h1>
            <p className="text-lg text-slate-600 mb-8">
              Browse verified professionals across 8 categories — ready to help today.
            </p>

            {/* Search bar */}
            <form action="/services" className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white p-2 shadow-lg shadow-slate-200/60">
              <Search className="ml-3 size-5 text-slate-400 shrink-0" />
              <input
                type="text"
                name="q"
                defaultValue={searchParams?.q || ''}
                placeholder="Search by service, skills, or provider name..."
                className="flex-1 py-3 px-3 text-slate-900 placeholder:text-slate-400 outline-none text-sm"
              />
              {searchParams?.category    && <input type="hidden" name="category"     value={searchParams.category}    />}
              {searchParams?.rating      && <input type="hidden" name="rating"       value={searchParams.rating}      />}
              {searchParams?.sort        && <input type="hidden" name="sort"         value={searchParams.sort}        />}
              {searchParams?.availability && <input type="hidden" name="availability" value={searchParams.availability} />}
              {searchParams?.min_price   && <input type="hidden" name="min_price"    value={searchParams.min_price}   />}
              {searchParams?.max_price   && <input type="hidden" name="max_price"    value={searchParams.max_price}   />}
              <button
                type="submit"
                className="shrink-0 rounded-xl bg-[#f97c66] px-6 py-3 text-sm font-bold text-white hover:bg-[#e0624e] transition-colors shadow-sm"
              >
                Search
              </button>
            </form>

            {/* quick stats */}
            <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm">
              {[
                { icon: <CheckCircle2 className="size-4 text-[#009689]" />, text: 'All providers verified' },
                { icon: <Star className="size-4 fill-amber-400 stroke-amber-400" />, text: '4.9 avg rating' },
                { icon: <Users className="size-4 text-[#f97c66]" />, text: '50K+ jobs done' },
              ].map(({ icon, text }) => (
                <span key={text} className="flex items-center gap-1.5 text-slate-600 font-medium">
                  {icon} {text}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          CONTENT — sidebar + grid
      ══════════════════════════════════════════════════════════ */}
      <div className="container mx-auto px-4 lg:px-8 py-12">
        <div className="grid lg:grid-cols-4 gap-8">

          {/* ── Sidebar ───────────────────────────────────────── */}
          <aside className="lg:col-span-1 space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

              {/* Header */}
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="size-4 text-slate-600" />
                  <h2 className="font-heading text-base font-bold text-slate-900">Filters</h2>
                </div>
                {hasFilters && (
                  <Link
                    href="/services"
                    className="flex items-center gap-1 text-xs font-medium text-rose-500 hover:text-rose-600 transition-colors"
                  >
                    <X className="size-3" /> Clear all
                  </Link>
                )}
              </div>

              {/* Categories */}
              <div className="space-y-1.5 mb-6">
                <p className="text-xs font-bold uppercase tracking-widest text-[#009689] mb-3">Categories</p>
                <Link href="/services">
                  <button
                    className={`w-full rounded-xl px-3 py-2 text-sm font-medium text-left transition-colors ${
                      !selectedCategory
                        ? 'bg-[#009689] text-white'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    All Services
                  </button>
                </Link>
                {categories.map((cat) => (
                  <Link
                    key={cat.category_id}
                    href={withParams('/services', searchParams, { category: cat.category_id })}
                  >
                    <button
                      className={`w-full rounded-xl px-3 py-2 text-sm font-medium text-left flex items-center gap-2 transition-colors ${
                        selectedCategory === cat.category_id
                          ? 'bg-[#009689] text-white'
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                      }`}
                    >
                      <span className="shrink-0">{cat.icon_url}</span>
                      {cat.category_name}
                    </button>
                  </Link>
                ))}
              </div>

              {/* Rating */}
              <div className="space-y-1.5 mb-6">
                <p className="text-xs font-bold uppercase tracking-widest text-[#f97c66] mb-3">Min. Rating</p>
                {RATINGS.map((r) => (
                  <Link key={r} href={withParams('/services', searchParams, { rating: r })}>
                    <button
                      className={`w-full rounded-xl px-3 py-2 text-sm font-medium text-left flex items-center gap-2 transition-colors ${
                        Number(searchParams?.rating) === r
                          ? 'bg-[#f97c66] text-white'
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                      }`}
                    >
                      <div className="flex gap-0.5">
                        {[1,2,3,4,5].map((s) => (
                          <Star key={s} className={`size-3 ${s <= Math.floor(r) ? 'fill-amber-400 stroke-amber-400' : 'stroke-slate-300'}`} />
                        ))}
                      </div>
                      {r}+ Stars
                    </button>
                  </Link>
                ))}
              </div>

              {/* Availability */}
              <div className="space-y-1.5 mb-6">
                <p className="text-xs font-bold uppercase tracking-widest text-[#009689] mb-3">Availability</p>
                {[
                  { value: 'available', label: 'Available Now', dot: 'bg-emerald-500' },
                  { value: 'busy',      label: 'Currently Busy', dot: 'bg-amber-500'  },
                ].map(({ value, label, dot }) => (
                  <Link key={value} href={withParams('/services', searchParams, { availability: value })}>
                    <button
                      className={`w-full rounded-xl px-3 py-2 text-sm font-medium text-left flex items-center gap-2 transition-colors ${
                        searchParams?.availability === value
                          ? 'bg-[#009689] text-white'
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                      }`}
                    >
                      <span className={`h-2 w-2 rounded-full ${dot}`} />
                      {label}
                    </button>
                  </Link>
                ))}
              </div>

              {/* Price range */}
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-[#f97c66] mb-3">Price Range (PKR)</p>
                <form action="/services" className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      name="min_price"
                      defaultValue={searchParams?.min_price || ''}
                      placeholder="Min"
                      className="h-9 rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-[#009689] focus:ring-2 focus:ring-[#009689]/20 transition-colors"
                    />
                    <input
                      type="number"
                      name="max_price"
                      defaultValue={searchParams?.max_price || ''}
                      placeholder="Max"
                      className="h-9 rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-[#009689] focus:ring-2 focus:ring-[#009689]/20 transition-colors"
                    />
                  </div>
                  {searchParams?.category     && <input type="hidden" name="category"     value={searchParams.category}     />}
                  {searchParams?.rating       && <input type="hidden" name="rating"       value={searchParams.rating}       />}
                  {searchParams?.sort         && <input type="hidden" name="sort"         value={searchParams.sort}         />}
                  {searchParams?.q            && <input type="hidden" name="q"            value={searchParams.q}            />}
                  {searchParams?.availability && <input type="hidden" name="availability" value={searchParams.availability} />}
                  <button
                    type="submit"
                    className="w-full rounded-xl border-2 border-[#f97c66]/30 bg-[#f97c66]/5 py-2 text-sm font-semibold text-[#f97c66] hover:bg-[#f97c66]/12 transition-colors"
                  >
                    Apply Price Filter
                  </button>
                </form>
              </div>
            </div>
          </aside>

          {/* ── Main content ──────────────────────────────────── */}
          <main className="lg:col-span-3">

            {/* Results header */}
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="font-heading text-2xl font-bold text-slate-900">
                  {selectedCategoryName ? `${selectedCategoryName} Providers` : 'All Providers'}
                </h2>
                <p className="text-sm text-slate-500 mt-0.5">
                  <span className="font-semibold text-[#009689]">{providers.length}</span> professionals found
                </p>
              </div>
              <ServicesSortFilter />
            </div>

            {/* Active filter chips */}
            {hasFilters && (
              <div className="mb-5 flex flex-wrap gap-2">
                {selectedCategoryName && (
                  <span className="flex items-center gap-1.5 rounded-full border border-[#009689]/20 bg-[#009689]/8 px-3 py-1 text-xs font-medium text-[#009689]">
                    {selectedCategoryName}
                    <Link href={withParams('/services', searchParams, { category: undefined })}>
                      <X className="size-3 hover:opacity-70" />
                    </Link>
                  </span>
                )}
                {searchParams?.rating && (
                  <span className="flex items-center gap-1.5 rounded-full border border-[#f97c66]/20 bg-[#f97c66]/8 px-3 py-1 text-xs font-medium text-[#f97c66]">
                    {searchParams.rating}+ Stars
                    <Link href={withParams('/services', searchParams, { rating: undefined })}>
                      <X className="size-3 hover:opacity-70" />
                    </Link>
                  </span>
                )}
                {searchParams?.availability && (
                  <span className="flex items-center gap-1.5 rounded-full border border-[#009689]/20 bg-[#009689]/8 px-3 py-1 text-xs font-medium text-[#009689]">
                    {searchParams.availability === 'available' ? 'Available Now' : 'Busy'}
                    <Link href={withParams('/services', searchParams, { availability: undefined })}>
                      <X className="size-3 hover:opacity-70" />
                    </Link>
                  </span>
                )}
                {(searchParams?.min_price || searchParams?.max_price) && (
                  <span className="flex items-center gap-1.5 rounded-full border border-[#f97c66]/20 bg-[#f97c66]/8 px-3 py-1 text-xs font-medium text-[#f97c66]">
                    PKR {searchParams.min_price || '0'} – {searchParams.max_price || '∞'}
                    <Link href={withParams('/services', searchParams, { min_price: undefined, max_price: undefined })}>
                      <X className="size-3 hover:opacity-70" />
                    </Link>
                  </span>
                )}
              </div>
            )}

            {/* Grid */}
            {providers.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {providers.map((provider) => (
                  <ProviderCard key={provider.provider_id} provider={provider} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white py-20 text-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-slate-100 mb-5">
                  <Search className="size-9 text-slate-400" />
                </div>
                <h3 className="font-heading text-xl font-bold text-slate-900 mb-2">No Providers Found</h3>
                <p className="text-sm text-slate-500 max-w-xs mb-6">
                  No providers match your current filters. Try adjusting your search.
                </p>
                <Link
                  href="/services"
                  className="inline-flex items-center gap-2 rounded-xl bg-[#f97c66] px-6 py-2.5 text-sm font-bold text-white hover:bg-[#e0624e] transition-colors"
                >
                  View All Providers
                </Link>
              </div>
            )}
          </main>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default function ServicesPage({ searchParams }) {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-[#009689]" />
          <p className="text-sm text-slate-500 font-medium">Loading providers...</p>
        </div>
      </div>
    }>
      <ServicesContent searchParams={searchParams} />
    </Suspense>
  )
}
