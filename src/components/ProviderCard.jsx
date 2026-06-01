import Link from 'next/link'
import { Star, CheckCircle, Briefcase, MapPin } from 'lucide-react'

const catColor = (i) =>
  i % 2 === 0
    ? 'bg-[#009689]/10 text-[#009689] border-[#009689]/20'
    : 'bg-[#f97c66]/10 text-[#f97c66] border-[#f97c66]/20'

export default function ProviderCard({ provider }) {
  const user = Array.isArray(provider.users) ? provider.users[0] : provider.users
  const listings = provider.service_listings || []
  const primaryListing = listings[0]
  const city = provider.provider_city || ''

  const categories = [...new Set(listings.map(l => l.service_categories?.category_name).filter(Boolean))]

  return (
    <div className="group flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-lg hover:-translate-y-0.5 hover:border-[#009689]/30 transition-all">

      {/* ── Header ─────────────────────────────────────────── */}
      <div className="flex items-start gap-4">
        <div className="relative shrink-0">
          {user?.profile_image_url ? (
            <img
              src={user.profile_image_url}
              alt={user?.name}
              className="h-14 w-14 rounded-2xl object-cover border-2 border-[#009689]/20"
            />
          ) : (
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#009689] to-teal-700 text-white text-xl font-bold">
              {user?.name?.charAt(0)?.toUpperCase() || 'P'}
            </div>
          )}
          {provider.is_verified && (
            <div className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#009689]">
              <CheckCircle className="size-3 text-white" />
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-heading text-lg font-bold text-slate-900 truncate">
            {user?.name || user?.email?.split('@')[0] || 'Provider'}
          </h3>
          <div className="flex items-center gap-1.5 mt-0.5">
            <Star className="size-4 fill-amber-400 stroke-amber-400" />
            <span className="font-semibold text-sm text-slate-900">
              {provider.rating ? provider.rating.toFixed(1) : '0.0'}
            </span>
            <span className="text-xs text-slate-400">
              ({provider.total_reviews || 0} reviews)
            </span>
          </div>
        </div>

        <span className={`shrink-0 flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
          provider.availability === 'available'
            ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
            : 'bg-amber-50 border-amber-200 text-amber-700'
        }`}>
          <span className={`h-1.5 w-1.5 rounded-full ${provider.availability === 'available' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
          {provider.availability === 'available' ? 'Available' : 'Busy'}
        </span>
      </div>

      {/* ── Categories ─────────────────────────────────────── */}
      {categories.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {categories.slice(0, 3).map((cat, idx) => (
            <span key={idx} className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${catColor(idx)}`}>
              {cat}
            </span>
          ))}
          {categories.length > 3 && (
            <span className="rounded-full border border-slate-200 px-2.5 py-0.5 text-xs font-medium text-slate-500">
              +{categories.length - 3}
            </span>
          )}
        </div>
      )}

      {/* ── Skills ─────────────────────────────────────────── */}
      {provider.skills && (
        <div className="flex items-start gap-2">
          <Briefcase className="size-3.5 text-slate-400 mt-0.5 shrink-0" />
          <p className="text-sm text-slate-600 line-clamp-2">{provider.skills}</p>
        </div>
      )}

      {city && (
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <MapPin className="size-3.5 text-slate-400" />
          <span className="line-clamp-1">{city}</span>
        </div>
      )}

      {/* ── Primary listing ─────────────────────────────────── */}
      {primaryListing && (
        <div className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
          <div className="flex items-start justify-between gap-2">
            <p className="flex-1 text-sm font-medium text-slate-900 line-clamp-1">
              {primaryListing.title}
            </p>
            {primaryListing.price && (
              <div className="shrink-0 text-right">
                <p className="text-[10px] text-slate-400 leading-none mb-0.5">from</p>
                <p className="font-bold text-[#f97c66] text-base leading-none">
                  PKR {primaryListing.price.toLocaleString()}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Actions ─────────────────────────────────────────── */}
      <div className="mt-auto flex gap-2 pt-1">
        <Link href={`/services/${provider.provider_id}`} className="flex-1">
          <button className="w-full rounded-xl border-2 border-[#009689]/30 bg-[#009689]/5 py-2.5 text-sm font-semibold text-[#009689] hover:bg-[#009689]/12 transition-colors">
            View Profile
          </button>
        </Link>
        <Link href={`/dashboard/customer/book/${provider.provider_id}`} className="flex-1">
          <button className="w-full rounded-xl bg-[#f97c66] py-2.5 text-sm font-bold text-white shadow-sm shadow-[#f97c66]/20 hover:bg-[#e0624e] transition-colors">
            Book Now
          </button>
        </Link>
      </div>
    </div>
  )
}
