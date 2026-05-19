'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'

const showcaseItems = [
  {
    title: 'Weekend Repairs',
    image: 'https://images.unsplash.com/photo-1581141849291-1125c7b692b5?q=80&w=1000&auto=format&fit=crop',
    tag: 'Handyman',
    accent: 'from-emerald-400 via-teal-400 to-emerald-600',
    description: 'Quick fixes, furniture assembly, and on-site repairs handled by trusted, verified professionals.',
    stats: ['30 min response', '4.9/5 rating', 'Verified pros'],
  },
  {
    title: 'Precision Electrical',
    image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=1000&auto=format&fit=crop',
    tag: 'Electrician',
    accent: 'from-emerald-500 via-emerald-400 to-teal-500',
    description: 'Switches, wiring, panel upgrades, and urgent electrical work done safely by licensed pros.',
    stats: ['Panel checks', 'Safety first', 'Home visits'],
  },
  {
    title: 'Plumbing & More',
    image: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?q=80&w=1000&auto=format&fit=crop',
    tag: 'Plumber',
    accent: 'from-teal-500 via-emerald-500 to-emerald-400',
    description: 'Leak fixes, pipe repairs, appliance support, and maintenance — booked in minutes.',
    stats: ['Fast booking', 'Clear pricing', 'Trusted work'],
  },
]

export default function HandymanShowcase() {
  const [activeIndex, setActiveIndex] = useState(0)
  const activeItem = useMemo(() => showcaseItems[activeIndex], [activeIndex])

  return (
    <div className="relative mx-auto w-full max-w-3xl">
      <div className={`absolute -inset-6 rounded-[2rem] bg-gradient-to-br ${activeItem.accent} opacity-15 blur-3xl`} />

      <div className="relative overflow-hidden rounded-[2rem] border border-white/70 bg-white/95 shadow-[0_30px_80px_rgba(15,23,42,0.12)] backdrop-blur">
        <div className="grid gap-6 p-4 lg:grid-cols-[1.15fr_0.85fr] lg:p-6">

          {/* ── Main image ──────────────────────────────────── */}
          <div className="relative min-h-[28rem] overflow-hidden rounded-[1.6rem] bg-slate-950">
            <Image
              src={activeItem.image}
              alt={activeItem.title}
              fill
              priority={activeIndex === 0}
              sizes="(max-width: 1024px) 100vw, 60vw"
              className="object-cover transition duration-500 hover:scale-[1.02]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/10 to-transparent" />

            <div className="absolute left-4 right-4 top-4 flex items-center justify-between gap-3">
              <span className="rounded-full border border-white/20 bg-white/15 px-3 py-1 text-xs font-medium text-white backdrop-blur">
                FixItNow Verified
              </span>
              <span className={`rounded-full border-0 bg-gradient-to-r ${activeItem.accent} px-3 py-1 text-xs font-semibold text-white shadow-lg`}>
                {activeItem.tag}
              </span>
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
              <p className="text-xs uppercase tracking-[0.2em] text-white/60">Featured work</p>
              <h3 className="mt-2 text-3xl font-bold leading-tight lg:text-4xl">{activeItem.title}</h3>
              <p className="mt-3 max-w-md text-sm leading-6 text-white/80">{activeItem.description}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {activeItem.stats.map((s) => (
                  <span key={s} className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-medium text-white/90 backdrop-blur">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* ── Sidebar ─────────────────────────────────────── */}
          <div className="flex flex-col justify-between gap-5">
            <div className="space-y-3">
              {showcaseItems.map((item, index) => {
                const isActive = index === activeIndex
                return (
                  <button
                    key={item.title}
                    type="button"
                    onClick={() => setActiveIndex(index)}
                    className={`flex w-full items-center gap-4 rounded-2xl border p-3 text-left transition-all duration-300 ${
                      isActive
                        ? 'border-emerald-400/40 bg-emerald-50 shadow-md shadow-emerald-100'
                        : 'border-slate-200 bg-white hover:border-emerald-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl">
                      <Image src={item.image} alt={item.title} fill sizes="56px" className="object-cover" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="truncate text-sm font-semibold text-slate-900">{item.title}</p>
                        {isActive && <span className="h-2 w-2 rounded-full bg-emerald-500 shrink-0" />}
                      </div>
                      <p className="mt-0.5 text-xs text-slate-500">{item.tag}</p>
                    </div>
                  </button>
                )
              })}
            </div>

            <div className="rounded-2xl bg-slate-950 p-5 text-white">
              <p className="text-xs font-medium text-white/60 uppercase tracking-wider">Ready to book?</p>
              <p className="mt-2 text-base font-semibold leading-snug">Pick a specialist and book in under 2 minutes.</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Link href="/register?role=customer">
                  <Button size="sm" className="bg-emerald-500 text-white hover:bg-emerald-600">Book Now</Button>
                </Link>
                <Link href="/services">
                  <Button size="sm" variant="outline" className="border-white/20 bg-white/5 text-white hover:bg-white/10 hover:text-white">
                    Browse
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
