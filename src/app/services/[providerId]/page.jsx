import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getProviderById } from '@/lib/actions/services'
import { getCurrentUser, signout } from '@/lib/actions/auth'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Star, MapPin, CheckCircle, Briefcase, Phone, Mail,
  Award, ArrowLeft, Clock, BadgeCheck, ChevronRight,
} from 'lucide-react'

function CustomerDetailNav() {
  return (
    <nav className="border-b bg-white/90 backdrop-blur">
      <div className="container mx-auto flex flex-col gap-4 px-4 py-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3">
          <a href="/" className="flex items-center gap-3">
            <img src="/Fix-it-logo.png" alt="FixItNow" className="h-10 w-auto" />
            <span className="font-accent text-2xl font-bold text-gradient hidden sm:inline">FixItNow</span>
          </a>
          <div className="text-xs text-slate-500">Customer workspace</div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link href="/dashboard/customer"><Button variant="ghost" size="sm">Overview</Button></Link>
          <Link href="/dashboard/customer/services"><Button variant="ghost" size="sm">Browse Services</Button></Link>
          <Link href="/dashboard/customer/bookings"><Button variant="ghost" size="sm">My Bookings</Button></Link>
          <Link href="/dashboard/customer/notifications"><Button variant="ghost" size="sm">Notifications</Button></Link>
          <Link href="/dashboard/customer/profile"><Button variant="ghost" size="sm">Profile</Button></Link>
          <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">Customer</Badge>
          <form action={signout}><Button variant="outline" size="sm">Sign Out</Button></form>
        </div>
      </div>
    </nav>
  )
}

function resolveUserRecord(user) {
  if (Array.isArray(user)) return user[0] || null
  return user || null
}

export default async function ProviderDetailPage({ params }) {
  const { providerId } = await params
  const currentUser = await getCurrentUser()
  const provider = await getProviderById(providerId)

  if (!provider) notFound()

  const role = currentUser?.profile?.role || currentUser?.user_metadata?.role || null
  const isCustomer = role === 'customer'
  const backHref = isCustomer ? '/dashboard/customer/services' : '/services'

  const providerUser = resolveUserRecord(provider.users)
  const providerName = providerUser?.name || providerUser?.profile?.name || providerUser?.user_metadata?.name || providerUser?.email || 'Provider'
  const providerInitial = providerName?.charAt(0)?.toUpperCase() || 'P'
  const listings = provider.service_listings || []
  const ratings = provider.ratings || []

  const categories = [...new Set(listings.map(l => l.service_categories?.category_name).filter(Boolean))]

  const avgRating = provider.rating ? provider.rating.toFixed(1) : '0.0'

  return (
    <>
      {isCustomer ? <CustomerDetailNav /> : <Navbar />}

      <div className="min-h-screen bg-slate-50">

        {/* ══════════════════════════════════════════════════════════
            HERO — provider header
        ══════════════════════════════════════════════════════════ */}
        <section className="relative overflow-hidden bg-gradient-to-br from-[#009689]/5 via-white to-[#f97c66]/5 py-12">
          <div className="pointer-events-none absolute -top-32 -right-32 h-80 w-80 rounded-full bg-[#009689] opacity-[0.08] blur-3xl" />
          <div className="pointer-events-none absolute -bottom-32 -left-32 h-80 w-80 rounded-full bg-[#f97c66] opacity-[0.08] blur-3xl" />
          <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-[#f97c66] via-[#009689] to-[#f97c66]" />

          <div className="container relative mx-auto px-4 lg:px-8">
            <Link
              href={backHref}
              className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-[#009689] hover:text-[#007a6e] transition-colors"
            >
              <ArrowLeft className="size-4" /> Back to Services
            </Link>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg md:p-8">
              <div className="flex flex-col gap-6 md:flex-row md:items-start">

                {/* Avatar */}
                <div className="relative shrink-0">
                  {providerUser?.profile_image_url ? (
                    <img
                      src={providerUser.profile_image_url}
                      alt={providerName}
                      className="h-28 w-28 rounded-2xl object-cover border-2 border-[#009689]/20"
                    />
                  ) : (
                    <div className="flex h-28 w-28 items-center justify-center rounded-2xl bg-gradient-to-br from-[#009689] to-teal-700 text-white text-5xl font-bold">
                      {providerInitial}
                    </div>
                  )}
                  {provider.is_verified && (
                    <div className="absolute -bottom-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-[#009689] shadow-md">
                      <CheckCircle className="size-5 text-white" />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 space-y-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h1 className="font-heading text-3xl font-bold text-slate-900">
                          {providerName}
                        </h1>
                        {provider.is_verified && (
                          <BadgeCheck className="size-6 text-[#009689] shrink-0" />
                        )}
                      </div>

                      {/* Rating row */}
                      <div className="mt-2 flex flex-wrap items-center gap-4">
                        <div className="flex items-center gap-1.5">
                          <div className="flex">
                            {[1,2,3,4,5].map((s) => (
                              <Star key={s} className={`size-5 ${s <= Math.round(Number(avgRating)) ? 'fill-amber-400 stroke-amber-400' : 'stroke-slate-300'}`} />
                            ))}
                          </div>
                          <span className="font-bold text-xl text-slate-900">{avgRating}</span>
                          <span className="text-slate-500 text-sm">({provider.total_reviews || 0} reviews)</span>
                        </div>

                        <span className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm font-semibold ${
                          provider.availability === 'available'
                            ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                            : 'bg-amber-50 border-amber-200 text-amber-700'
                        }`}>
                          <span className={`h-2 w-2 rounded-full ${provider.availability === 'available' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                          {provider.availability === 'available' ? 'Available Now' : 'Currently Busy'}
                        </span>
                      </div>
                    </div>

                    {/* Book CTA — top right */}
                    <Link href={`/dashboard/customer/book/${provider.provider_id}`}>
                      <button className="shrink-0 rounded-xl bg-[#f97c66] px-6 py-3 text-sm font-bold text-white shadow-md shadow-[#f97c66]/25 hover:bg-[#e0624e] hover:scale-[1.02] transition-all">
                        Book Now
                      </button>
                    </Link>
                  </div>

                  {/* Category badges */}
                  {categories.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {categories.map((cat, i) => (
                        <span
                          key={i}
                          className={`rounded-full border px-3 py-0.5 text-xs font-medium ${
                            i % 2 === 0
                              ? 'bg-[#009689]/10 border-[#009689]/20 text-[#009689]'
                              : 'bg-[#f97c66]/10 border-[#f97c66]/20 text-[#f97c66]'
                          }`}
                        >
                          {cat}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Contact */}
                  <div className="flex flex-wrap gap-4">
                    {providerUser?.email && (
                      <span className="flex items-center gap-1.5 text-sm text-slate-500">
                        <Mail className="size-4 text-[#009689]" /> {providerUser.email}
                      </span>
                    )}
                    {providerUser?.phone && (
                      <span className="flex items-center gap-1.5 text-sm text-slate-500">
                        <Phone className="size-4 text-[#f97c66]" /> {providerUser.phone}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════
            BODY — content + sidebar
        ══════════════════════════════════════════════════════════ */}
        <div className="container mx-auto px-4 lg:px-8 py-12">
          <div className="grid lg:grid-cols-3 gap-8">

            {/* ── Main ──────────────────────────────────────────── */}
            <div className="lg:col-span-2 space-y-6">

              {/* About */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#009689]/10">
                    <Briefcase className="size-4 text-[#009689]" />
                  </div>
                  <h2 className="font-heading text-lg font-bold text-slate-900">About</h2>
                </div>
                <p className="text-slate-600 leading-relaxed text-sm">
                  {provider.skills || 'No description available.'}
                </p>
              </div>

              {/* Services */}
              {listings.length > 0 && (
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex items-center gap-2 mb-5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#f97c66]/10">
                      <ChevronRight className="size-4 text-[#f97c66]" />
                    </div>
                    <h2 className="font-heading text-lg font-bold text-slate-900">Services Offered</h2>
                  </div>
                  <div className="space-y-3">
                    {listings.map((listing, i) => (
                      <div
                        key={listing.listing_id}
                        className="flex items-start justify-between gap-4 rounded-xl border border-slate-100 bg-slate-50 p-4 hover:bg-slate-100 transition-colors"
                      >
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-slate-900 text-sm">{listing.title}</h3>
                          {listing.description && (
                            <p className="text-xs text-slate-500 mt-1 leading-relaxed">{listing.description}</p>
                          )}
                          {listing.service_categories && (
                            <span className={`mt-2 inline-block rounded-full border px-2.5 py-0.5 text-xs font-medium ${
                              i % 2 === 0
                                ? 'bg-[#009689]/10 border-[#009689]/20 text-[#009689]'
                                : 'bg-[#f97c66]/10 border-[#f97c66]/20 text-[#f97c66]'
                            }`}>
                              {listing.service_categories.category_name}
                            </span>
                          )}
                        </div>
                        {listing.price && (
                          <div className="shrink-0 text-right">
                            <p className="text-[10px] text-slate-400 leading-none mb-0.5">Starting at</p>
                            <p className="font-bold text-[#f97c66] text-lg leading-none">
                              PKR {listing.price.toLocaleString()}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Reviews */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#009689]/10">
                    <Star className="size-4 text-[#009689]" />
                  </div>
                  <h2 className="font-heading text-lg font-bold text-slate-900">
                    Customer Reviews
                    <span className="ml-2 text-sm font-normal text-slate-400">({ratings.length})</span>
                  </h2>
                </div>

                {ratings.length > 0 ? (
                  <div className="space-y-5">
                    {ratings.map((rating) => (
                      <div key={rating.rating_id} className="border-b border-slate-100 pb-5 last:border-0 last:pb-0">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex gap-0.5">
                            {[1,2,3,4,5].map((s) => (
                              <Star key={s} className={`size-4 ${s <= rating.rating ? 'fill-amber-400 stroke-amber-400' : 'stroke-slate-300'}`} />
                            ))}
                          </div>
                          <span className="text-sm font-semibold text-slate-700">{rating.rating}/5</span>
                        </div>
                        {rating.review && (
                          <p className="text-sm text-slate-600 leading-relaxed mb-1.5">{rating.review}</p>
                        )}
                        <p className="text-xs text-slate-400">
                          {new Date(rating.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center py-10 text-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 mb-4">
                      <Award className="size-7 text-slate-400" />
                    </div>
                    <p className="text-sm font-medium text-slate-500">No reviews yet.</p>
                    <p className="text-xs text-slate-400 mt-1">Be the first to review this provider!</p>
                  </div>
                )}
              </div>
            </div>

            {/* ── Sidebar ───────────────────────────────────────── */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-4">

                {/* Book card */}
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h3 className="font-heading text-lg font-bold text-slate-900 mb-4">Book This Provider</h3>

                  {/* trust chips */}
                  <div className="space-y-2 mb-5">
                    <div className="flex items-center gap-2.5 rounded-xl bg-[#009689]/5 border border-[#009689]/15 px-3 py-2.5">
                      <BadgeCheck className="size-4 text-[#009689] shrink-0" />
                      <span className="text-sm font-medium text-[#009689]">Verified Professional</span>
                    </div>
                    <div className="flex items-center gap-2.5 rounded-xl bg-[#f97c66]/5 border border-[#f97c66]/15 px-3 py-2.5">
                      <Star className="size-4 text-[#f97c66] shrink-0 fill-[#f97c66]" />
                      <span className="text-sm font-medium text-[#f97c66]">
                        {provider.total_reviews || 0}+ Happy Customers
                      </span>
                    </div>
                    <div className="flex items-center gap-2.5 rounded-xl bg-slate-50 border border-slate-100 px-3 py-2.5">
                      <Clock className="size-4 text-slate-400 shrink-0" />
                      <span className="text-sm text-slate-600">Responds within 2 hours</span>
                    </div>
                  </div>

                  <Link href={`/dashboard/customer/book/${provider.provider_id}`}>
                    <button className="w-full rounded-xl bg-[#f97c66] py-3.5 text-sm font-bold text-white shadow-md shadow-[#f97c66]/25 hover:bg-[#e0624e] hover:scale-[1.01] transition-all">
                      Book Appointment
                    </button>
                  </Link>
                </div>

                {/* Quick stats */}
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { val: avgRating, label: 'Rating',   color: 'text-[#f97c66]' },
                    { val: provider.total_reviews || 0, label: 'Reviews',  color: 'text-[#009689]' },
                    { val: listings.length,             label: 'Services', color: 'text-[#f97c66]' },
                    { val: provider.availability === 'available' ? 'Yes' : 'No', label: 'Available', color: 'text-[#009689]' },
                  ].map(({ val, label, color }) => (
                    <div key={label} className="rounded-xl border border-slate-200 bg-white p-3 text-center shadow-sm">
                      <p className={`font-heading text-xl font-bold ${color}`}>{val}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  )
}
