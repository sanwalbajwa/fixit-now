'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

const showcaseItems = [
  {
    title: 'Weekend Repairs',
    image: 'https://images.unsplash.com/photo-1581141849291-1125c7b692b5?q=80&w=1000&auto=format&fit=crop',
    tag: 'All-round handyman',
    accent: 'from-amber-400 via-orange-400 to-rose-400',
    description: 'A friendly all-round fixer for quick home repairs, small installs, and furniture assembly.',
    stats: ['30 min arrival', '4.9/5 rating', 'Verified pros'],
  },
  {
    title: 'Precision Electrical Work',
    image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=1000&auto=format&fit=crop',
    tag: 'Electrician',
    accent: 'from-sky-500 via-cyan-400 to-emerald-400',
    description: 'Ideal for switches, wiring, panel work, and urgent electrical troubleshooting at home.',
    stats: ['Panel checks', 'Safety first', 'Home visits'],
  },
  {
    title: 'Toolbox On Demand',
    image: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?q=80&w=1000&auto=format&fit=crop',
    tag: 'Skilled technician',
    accent: 'from-emerald-500 via-teal-400 to-lime-400',
    description: 'A dependable service vibe for plumbing, appliance support, and maintenance requests.',
    stats: ['Fast booking', 'Clear pricing', 'Trusted support'],
  },
]

export default function HandymanShowcase() {
  const [activeIndex, setActiveIndex] = useState(0)

  const activeItem = useMemo(() => showcaseItems[activeIndex], [activeIndex])

  return (
    <div className="relative mx-auto w-full max-w-3xl">
      <div className={`absolute -inset-6 rounded-[2rem] bg-gradient-to-br ${activeItem.accent} opacity-20 blur-3xl`} />

      <div className="relative overflow-hidden rounded-[2rem] border border-white/70 bg-white/95 shadow-[0_30px_80px_rgba(15,23,42,0.15)] backdrop-blur">
        <div className="grid gap-6 p-4 lg:grid-cols-[1.15fr_0.85fr] lg:p-6">
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
              <Badge className="border-white/20 bg-white/15 text-white backdrop-blur">Handyman-ready</Badge>
              <Badge className={`border-0 bg-gradient-to-r ${activeItem.accent} text-white shadow-lg`}>
                {activeItem.tag}
              </Badge>
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
              <p className="text-sm uppercase tracking-[0.28em] text-white/65">Featured work</p>
              <h3 className="mt-2 text-3xl font-bold leading-tight lg:text-4xl">{activeItem.title}</h3>
              <p className="mt-3 max-w-md text-sm leading-6 text-white/85">{activeItem.description}</p>

              <div className="mt-5 flex flex-wrap gap-2">
                {activeItem.stats.map((item) => (
                  <span key={item} className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-medium text-white/90 backdrop-blur">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>

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
                        ? 'border-emerald-500/30 bg-emerald-50 shadow-lg shadow-emerald-100'
                        : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl">
                      <Image src={item.image} alt={item.title} fill sizes="64px" className="object-cover" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="truncate font-semibold text-slate-900">{item.title}</p>
                        {isActive && <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />}
                      </div>
                      <p className="mt-1 text-sm text-slate-500">{item.tag}</p>
                    </div>
                  </button>
                )
              })}
            </div>

            <div className="rounded-2xl bg-slate-950 p-5 text-white">
              <p className="text-sm font-medium text-white/65">Book the right pro faster</p>
              <p className="mt-2 text-lg font-semibold leading-snug">Pick a specialist, preview the style, and book from the same page.</p>
              <div className="mt-4 flex flex-wrap gap-3">
                <Link href="/register?role=customer">
                  <Button className="bg-white text-slate-950 hover:bg-slate-100">Book Now</Button>
                </Link>
                <Link href="/services">
                  <Button variant="outline" className="border-white/20 bg-white/5 text-white hover:bg-white/10 hover:text-white">
                    Browse Services
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