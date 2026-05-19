import Link from 'next/link'
import { Wrench } from 'lucide-react'

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full">
      {/* glass layer */}
      <div className="absolute inset-0 bg-white/75 backdrop-blur-xl border-b border-white/60 shadow-[0_2px_24px_rgba(0,0,0,0.07)]" />
      {/* subtle emerald top-line */}
      <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-emerald-400 via-emerald-500 to-emerald-400 opacity-80" />

      <nav className="relative container mx-auto flex h-18 items-center justify-between px-4 sm:px-6">

        {/* ── Logo ─────────────────────────────────────────────── */}
        <Link href="/" className="flex items-center gap-3 group">
          <img src="/Fix-it-logo.png" alt="FixItNow" className="h-14 w-auto" />
          <span className="font-accent text-2xl font-semibold text-slate-900 hidden sm:block tracking-wide group-hover:text-[#009689] transition-colors">
            FixItNow
          </span>
        </Link>

        {/* ── Nav links ─────────────────────────────────────────── */}
        <div className="hidden md:flex items-center gap-1">
          {[
            { href: '/services',     label: 'Browse Services' },
            { href: '#how-it-works', label: 'How It Works'    },
            { href: '#about',        label: 'About'           },
          ].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="relative px-4 py-2 text-sm font-medium text-slate-600 rounded-xl hover:text-[#009689] hover:bg-[#009689]/8 transition-all duration-150"
            >
              {label}
            </Link>
          ))}
        </div>

        {/* ── CTAs ─────────────────────────────────────────────── */}
        <div className="flex items-center gap-2">
          <Link
            href="/login"
            className="hidden sm:inline-flex items-center px-4 py-2 text-sm font-medium text-slate-700 rounded-xl hover:bg-slate-100 hover:text-slate-900 transition-colors"
          >
            Sign In
          </Link>
          <Link
            href="/register?role=customer"
            className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-xl border border-[#009689]/30 bg-[#009689]/8 text-[#009689] hover:bg-[#009689]/15 hover:border-[#009689]/50 transition-colors"
          >
            Book Services
          </Link>
          <Link
            href="/register?role=provider"
            className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-xl bg-[#f97c66] text-white hover:bg-[#e0624e] shadow-sm hover:shadow-md transition-all"
          >
            <Wrench className="size-3.5" />
            <span className="hidden xs:inline">Become Provider</span>
            <span className="xs:hidden">Join</span>
          </Link>
        </div>
      </nav>
    </header>
  )
}
