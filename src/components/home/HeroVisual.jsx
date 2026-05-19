import { BadgeCheck, Star, CheckCircle2, MapPin, Clock } from 'lucide-react'

const TAGS = ['Pipe Repair', 'Leak Fixing', 'Installation']

export default function HeroVisual() {
  return (
    <div className="relative w-full max-w-[420px] mx-auto select-none">

      {/* ambient glow */}
      <div className="pointer-events-none absolute inset-0 -z-10 rounded-3xl bg-[#009689] opacity-8 blur-3xl scale-110" />

      {/* floating badge — top right */}
      <div className="absolute -top-5 -right-4 z-10 flex items-center gap-2 rounded-2xl bg-white px-3.5 py-2.5 shadow-xl shadow-black/10 border border-slate-100">
        <div className="flex">
          {[1,2,3,4,5].map((s) => (
            <Star key={s} className="size-3.5 fill-amber-400 stroke-amber-400" />
          ))}
        </div>
        <span className="text-sm font-bold text-black">4.9</span>
        <span className="text-xs text-slate-400">avg rating</span>
      </div>

      {/* floating badge — left */}
      <div className="absolute -left-6 top-1/3 z-10 flex items-center gap-1.5 rounded-2xl bg-slate-900 px-3.5 py-2 shadow-xl">
        <span className="h-1.5 w-1.5 rounded-full bg-[#009689] animate-pulse" />
        <span className="text-xs font-bold text-white">1,000+ Pros</span>
      </div>

      {/* main provider card */}
      <div className="rounded-3xl bg-white shadow-2xl shadow-black/12 border border-slate-100 overflow-hidden">
        <div className="h-1 w-full bg-[#009689]" />

        <div className="p-6 space-y-5">
          {/* provider header */}
          <div className="flex items-start gap-4">
            <div className="relative shrink-0">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-900 text-white text-xl font-bold">
                AH
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-white">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
              </span>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <p className="font-bold text-black text-lg leading-tight">Ali Hassan</p>
                <BadgeCheck className="size-4.5 shrink-0 text-[#009689]" />
              </div>
              <div className="flex items-center gap-1 mt-0.5 text-sm text-slate-400">
                <MapPin className="size-3.5 shrink-0" />
                Master Plumber · Lahore
              </div>
            </div>

            <div className="text-right shrink-0">
              <p className="text-xs text-slate-400">Starting at</p>
              <p className="font-bold text-black text-lg">PKR 1,500</p>
            </div>
          </div>

          {/* rating + availability */}
          <div className="flex items-center justify-between gap-2 rounded-2xl bg-slate-50 px-4 py-3">
            <div className="flex items-center gap-1.5">
              <div className="flex">
                {[1,2,3,4,5].map((s) => (
                  <Star key={s} className="size-4 fill-amber-400 stroke-amber-400" />
                ))}
              </div>
              <span className="text-sm font-bold text-black">4.9</span>
              <span className="text-xs text-slate-400">(127 reviews)</span>
            </div>
            <span className="flex items-center gap-1 rounded-full border border-slate-200 bg-white px-2.5 py-0.5 text-xs font-medium text-slate-600">
              <Clock className="size-3" />
              Available now
            </span>
          </div>

          {/* service tags */}
          <div className="flex flex-wrap gap-2">
            {TAGS.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* book button */}
          <button className="w-full rounded-xl bg-[#009689] py-3 text-sm font-bold text-white hover:bg-[#007a6e] transition-colors">
            Book Now — Instant Confirmation
          </button>
        </div>
      </div>

      {/* booking confirmed card */}
      <div className="mt-4 flex items-center gap-4 rounded-2xl bg-white border border-slate-100 p-4 shadow-lg">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50">
          <CheckCircle2 className="size-5 text-emerald-600" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-black">Booking Confirmed!</p>
          <p className="text-xs text-slate-400 truncate">Pipe repair · Today at 3:00 PM · Lahore</p>
        </div>
        <span className="shrink-0 rounded-full border border-emerald-100 bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
          Just now
        </span>
      </div>

      {/* trust strip */}
      <div className="mt-4 grid grid-cols-3 gap-3">
        {[
          { val: '< 2 min', label: 'To book'     },
          { val: '50K+',    label: 'Jobs done'   },
          { val: '98%',     label: 'Satisfaction' },
        ].map(({ val, label }) => (
          <div key={label} className="rounded-2xl border border-slate-100 bg-white py-3 text-center shadow-sm">
            <p className="font-heading text-base font-bold text-black">{val}</p>
            <p className="text-xs text-slate-400 mt-0.5">{label}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
