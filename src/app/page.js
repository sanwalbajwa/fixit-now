import Link from 'next/link'
import {
  Wrench, Zap, Sparkles, Hammer, Paintbrush, Wind, Bug, Plug,
  Search, CalendarCheck, CheckCircle2, Star, BadgeCheck,
  Shield, Clock, Tag, Headphones,
  ArrowRight, Users,
} from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import HeroVisual from '@/components/home/HeroVisual'

const SERVICES = [
  { name: 'Plumbing',     icon: <Wrench     className="size-6" />, desc: 'Pipe repairs, leak fixing & installations' },
  { name: 'Electrical',   icon: <Zap        className="size-6" />, desc: 'Wiring, repairs & panel work'              },
  { name: 'Cleaning',     icon: <Sparkles   className="size-6" />, desc: 'Home, office & deep cleaning'              },
  { name: 'Carpentry',    icon: <Hammer     className="size-6" />, desc: 'Furniture, doors & custom woodwork'        },
  { name: 'Painting',     icon: <Paintbrush className="size-6" />, desc: 'Interior, exterior & wall treatment'       },
  { name: 'AC Repair',    icon: <Wind       className="size-6" />, desc: 'Installation, repair & maintenance'        },
  { name: 'Pest Control', icon: <Bug        className="size-6" />, desc: 'Termite, mosquito & general pest'          },
  { name: 'Appliances',   icon: <Plug       className="size-6" />, desc: 'Fridge, washing machine & microwave'       },
]

const STEPS = [
  { icon: <Search        className="size-5" />, title: 'Browse & Filter', desc: 'Search by service type, location, and price to find the right professional.' },
  { icon: <CalendarCheck className="size-5" />, title: 'Book Instantly',  desc: 'Pick a date and time, describe the job, and confirm in under 2 minutes.'    },
  { icon: <CheckCircle2  className="size-5" />, title: 'Job Done Right',  desc: 'Your verified provider arrives on time. Rate and pay securely when done.'   },
]

const BENEFITS = [
  { icon: <BadgeCheck className="size-5" />, title: 'Verified Professionals', desc: 'Every provider is background-checked and reviewed by real customers before listing.'   },
  { icon: <Zap        className="size-5" />, title: 'Lightning Fast Booking', desc: 'Find, compare, and confirm a provider in under 2 minutes — no phone calls needed.'    },
  { icon: <Tag        className="size-5" />, title: 'Transparent Pricing',    desc: 'See clear rates upfront. No hidden fees or surprise charges after the job.'            },
  { icon: <Headphones className="size-5" />, title: '24/7 Customer Support',  desc: 'Our team is always on standby to resolve issues and keep bookings on track.'           },
  { icon: <Star       className="size-5" />, title: 'Ratings & Reviews',      desc: 'Real reviews from verified customers help you choose the best pro every time.'         },
  { icon: <Shield     className="size-5" />, title: 'Secure Payments',        desc: 'Pay online through a secure gateway — funds held safely until the job is complete.'   },
]

export default function Home() {
  return (
    <>
      <Navbar />

      {/* ══════════════════════════════════════════════════════════
          HERO
      ══════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-white pt-16 pb-28 lg:pb-36">
        {/* subtle radial glow */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_-10%,rgba(0,150,137,0.07),transparent)]" />

        <div className="container relative mx-auto px-4 lg:px-8">
          <div className="grid items-center gap-14 lg:grid-cols-2">

            {/* Left */}
            <div className="space-y-8">
              {/* eyebrow */}
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-1.5 shadow-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-[#009689] animate-pulse" />
                <span className="text-sm font-medium text-slate-600">Pakistan's #1 Home Services Platform</span>
              </div>

              {/* headline */}
              <h1 className="font-heading text-5xl font-bold leading-[1.1] text-black lg:text-6xl xl:text-7xl">
                Book trusted<br />home pros.{' '}
                <span className="text-[#009689]">Instantly.</span>
              </h1>

              {/* sub */}
              <p className="max-w-xl text-lg leading-relaxed text-slate-500">
                Connect with skilled, background-checked professionals for plumbing, electrical, cleaning, carpentry, and more. Clear pricing. Fast booking. Every time.
              </p>

              {/* CTAs */}
              <div className="flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/register?role=customer"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#009689] px-8 py-3.5 text-base font-bold text-white shadow-lg shadow-[#009689]/20 hover:bg-[#007a6e] hover:scale-[1.02] transition-all"
                >
                  Book a Service <ArrowRight className="size-4" />
                </Link>
                <Link
                  href="/register?role=provider"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-slate-200 bg-white px-8 py-3.5 text-base font-semibold text-slate-800 hover:border-slate-300 hover:bg-slate-50 transition-all"
                >
                  Become a Provider
                </Link>
              </div>

              {/* trust chips */}
              <div className="flex flex-wrap gap-2">
                {['Verified pros', 'Upfront pricing', 'Same-day support', 'Secure payments'].map((label) => (
                  <span key={label} className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-600 shadow-sm">
                    <CheckCircle2 className="size-3.5 text-[#009689]" />
                    {label}
                  </span>
                ))}
              </div>

              {/* stats */}
              <div className="grid grid-cols-3 gap-4 border-t border-slate-100 pt-8">
                {[
                  { num: '1,000+',  label: 'Verified providers' },
                  { num: '50K+',    label: 'Happy customers'    },
                  { num: '4.9 / 5', label: 'Average rating'     },
                ].map(({ num, label }) => (
                  <div key={label}>
                    <p className="font-heading text-3xl font-bold text-black lg:text-4xl">{num}</p>
                    <p className="mt-1 text-sm text-slate-400">{label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right */}
            <div className="flex items-center justify-center">
              <HeroVisual />
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          STATS STRIP
      ══════════════════════════════════════════════════════════ */}
      <section className="border-y border-slate-100 bg-white py-10">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-2 gap-px lg:grid-cols-4 overflow-hidden rounded-2xl bg-slate-100">
            {[
              { num: '1,000+',  label: 'Verified providers' },
              { num: '50,000+', label: 'Jobs completed'      },
              { num: '4.9 / 5', label: 'Customer rating'     },
              { num: '8+',      label: 'Service categories'  },
            ].map(({ num, label }) => (
              <div key={label} className="flex flex-col items-center justify-center gap-1 bg-white py-8 text-center">
                <p className="font-heading text-3xl font-bold text-black">{num}</p>
                <p className="text-sm font-medium text-slate-400">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          SERVICES
      ══════════════════════════════════════════════════════════ */}
      <section id="services" className="py-24 bg-[#f7f7f7]">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">What we fix</p>
            <h2 className="font-heading text-4xl font-bold text-black lg:text-5xl">
              Everything your home needs
            </h2>
            <p className="mt-4 text-lg text-slate-500">
              Hundreds of verified providers across 8 categories — ready to help today.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {SERVICES.map((svc) => (
              <Link
                key={svc.name}
                href="/services"
                className="group flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-700 group-hover:bg-[#009689] group-hover:text-white transition-colors">
                  {svc.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-black">{svc.name}</h3>
                  <p className="mt-1 text-sm text-slate-400 leading-relaxed">{svc.desc}</p>
                </div>
                <div className="mt-auto flex items-center gap-1 text-xs font-semibold text-slate-300 group-hover:text-[#009689] transition-colors">
                  View providers <ArrowRight className="size-3.5" />
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-10 flex justify-center">
            <Link
              href="/services"
              className="inline-flex items-center gap-2 rounded-xl bg-[#009689] px-7 py-3 text-sm font-bold text-white shadow-md shadow-[#009689]/20 hover:bg-[#007a6e] transition-colors"
            >
              Browse all providers <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          HOW IT WORKS
      ══════════════════════════════════════════════════════════ */}
      <section id="how-it-works" className="py-24 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">Simple process</p>
            <h2 className="font-heading text-4xl font-bold text-black lg:text-5xl">
              From search to done — in minutes
            </h2>
            <p className="mt-4 text-lg text-slate-500">
              Our streamlined flow gets you professional help without the hassle.
            </p>
          </div>

          <div className="relative grid gap-8 md:grid-cols-3 max-w-4xl mx-auto">
            {/* connector line */}
            <div className="pointer-events-none absolute top-12 left-[calc(16.67%+1.5rem)] right-[calc(16.67%+1.5rem)] hidden h-px bg-slate-200 md:block" />

            {STEPS.map((step, i) => (
              <div key={step.title} className="flex flex-col items-center text-center gap-5">
                <div className="relative flex h-24 w-24 items-center justify-center rounded-full border-2 border-slate-200 bg-white shadow-sm">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-900 text-white">
                    {step.icon}
                  </div>
                  <span className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-[#009689] text-[11px] font-bold text-white shadow-sm">
                    {i + 1}
                  </span>
                </div>
                <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm w-full">
                  <h3 className="font-semibold text-black mb-2">{step.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          WHY FIXITNOW
      ══════════════════════════════════════════════════════════ */}
      <section id="about" className="py-24 bg-[#f7f7f7]">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid gap-14 lg:grid-cols-[1fr_1.2fr] lg:items-start">

            {/* Left copy */}
            <div className="space-y-6 lg:sticky lg:top-24">
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Why FixItNow</p>
              <h2 className="font-heading text-4xl font-bold text-black lg:text-5xl leading-tight">
                The smarter way to get home work done.
              </h2>
              <p className="text-lg text-slate-500 leading-relaxed">
                From emergency fixes to routine maintenance — find trustworthy pros, compare options, and book with confidence every time.
              </p>

              <div className="flex flex-wrap gap-3 pt-2">
                {[
                  { num: '50K+', label: 'Jobs done'    },
                  { num: '98%',  label: 'Satisfaction'  },
                  { num: '< 2m', label: 'To book'       },
                ].map(({ num, label }) => (
                  <div key={label} className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-center shadow-sm">
                    <p className="font-heading text-2xl font-bold text-black">{num}</p>
                    <p className="text-xs font-medium text-slate-400 mt-0.5">{label}</p>
                  </div>
                ))}
              </div>

              <div className="flex gap-3 pt-2">
                <Link
                  href="/register?role=customer"
                  className="inline-flex items-center gap-2 rounded-xl bg-[#009689] px-6 py-3 text-sm font-bold text-white shadow-md shadow-[#009689]/20 hover:bg-[#007a6e] transition-colors"
                >
                  Get started <ArrowRight className="size-4" />
                </Link>
                <Link
                  href="#how-it-works"
                  className="inline-flex items-center gap-2 rounded-xl border-2 border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  See how it works
                </Link>
              </div>
            </div>

            {/* Right benefits grid */}
            <div className="grid gap-3 sm:grid-cols-2">
              {BENEFITS.map((b) => (
                <div
                  key={b.title}
                  className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                    {b.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-black text-sm">{b.title}</h3>
                    <p className="mt-1 text-sm text-slate-400 leading-relaxed">{b.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          FOR PROVIDERS — dark section for contrast
      ══════════════════════════════════════════════════════════ */}
      <section className="py-24 bg-slate-950">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">

            {/* Left */}
            <div className="space-y-6">
              <p className="text-xs font-bold uppercase tracking-widest text-slate-500">For Professionals</p>
              <h2 className="font-heading text-4xl font-bold text-white leading-tight lg:text-5xl">
                Grow your business with{' '}
                <span className="text-[#009689]">FixItNow.</span>
              </h2>
              <p className="text-lg text-slate-400 leading-relaxed max-w-lg">
                Join our network of skilled providers and reach thousands of customers actively looking for your expertise — on your own schedule.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/register?role=provider"
                  className="inline-flex items-center gap-2 rounded-xl bg-[#009689] px-6 py-3 text-sm font-bold text-white hover:bg-[#007a6e] transition-colors"
                >
                  Register as Provider <ArrowRight className="size-4" />
                </Link>
                <Link
                  href="/services"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10 transition-colors"
                >
                  <Users className="size-4" /> View marketplace
                </Link>
              </div>
            </div>

            {/* Right */}
            <div className="grid gap-4">
              {[
                { n: '01', title: 'Set your own schedule', desc: 'Accept jobs when you want. Full control over your availability at all times.' },
                { n: '02', title: 'Grow your client base',  desc: 'Get discovered by thousands of customers actively searching for your skill.'  },
                { n: '03', title: 'Fast, secure payouts',   desc: 'Get paid directly once a booking is completed — no chasing invoices.'         },
              ].map((p) => (
                <div key={p.n} className="flex items-start gap-5 rounded-2xl border border-white/8 bg-white/5 p-5">
                  <span className="font-heading text-5xl font-bold text-white/10 leading-none select-none shrink-0">
                    {p.n}
                  </span>
                  <div>
                    <h3 className="font-semibold text-white">{p.title}</h3>
                    <p className="mt-1 text-sm text-slate-400 leading-relaxed">{p.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          FINAL CTA — brand teal background
      ══════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden py-28 bg-[#009689]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(255,255,255,0.12),transparent)]" />
        <div className="pointer-events-none absolute bottom-0 right-0 h-80 w-80 rounded-full bg-white opacity-5 blur-3xl" />

        <div className="container relative mx-auto px-4 lg:px-8 text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-white/50 mb-5">Get started today</p>
          <h2 className="font-heading text-4xl font-bold text-white lg:text-5xl xl:text-6xl max-w-3xl mx-auto leading-tight">
            Your home deserves the best care.
          </h2>
          <p className="mt-5 text-lg text-white/70 max-w-2xl mx-auto leading-relaxed">
            Join thousands of homeowners across Pakistan who trust FixItNow to connect them with verified professionals — quickly, safely, and affordably.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-6">
            {[
              { icon: <BadgeCheck className="size-4" />, text: 'Verified providers' },
              { icon: <Shield     className="size-4" />, text: 'Secure payments'    },
              { icon: <Star       className="size-4" />, text: '4.9/5 rating'       },
              { icon: <Clock      className="size-4" />, text: '24/7 support'       },
            ].map(({ icon, text }) => (
              <span key={text} className="flex items-center gap-1.5 text-sm font-medium text-white/70">
                {icon} {text}
              </span>
            ))}
          </div>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/register?role=customer"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-8 py-4 text-base font-bold text-[#009689] shadow-lg hover:bg-slate-50 hover:scale-[1.02] transition-all"
            >
              Book a Service <ArrowRight className="size-5" />
            </Link>
            <Link
              href="/register?role=provider"
              className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-white/25 bg-white/10 px-8 py-4 text-base font-bold text-white hover:bg-white/20 transition-all"
            >
              Become a Provider
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}
