import Link from 'next/link'
import {
  Wrench, MapPin, Mail, Phone,
  Github, Twitter, Instagram,
  ArrowRight,
} from 'lucide-react'

const LINKS = {
  Services: [
    { label: 'Plumbing',    href: '/services' },
    { label: 'Electrical',  href: '/services' },
    { label: 'Cleaning',    href: '/services' },
    { label: 'Carpentry',   href: '/services' },
    { label: 'AC Repair',   href: '/services' },
  ],
  Company: [
    { label: 'About Us',   href: '#about'      },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Careers',    href: '#'           },
    { label: 'Blog',       href: '#'           },
  ],
  Legal: [
    { label: 'Privacy Policy',   href: '#' },
    { label: 'Terms of Service', href: '#' },
    { label: 'Refund Policy',    href: '#' },
  ],
}

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300">

      {/* ── Top accent line ───────────────────────────────────── */}
      <div className="h-[3px] bg-gradient-to-r from-[#f97c66] via-[#009689] to-[#f97c66]" />

      <div className="container mx-auto px-4 sm:px-6 py-14">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[1.8fr_1fr_1fr_1fr]">

          {/* ── Brand ─────────────────────────────────────────── */}
          <div className="space-y-5">
            <Link href="/" className="inline-flex items-center gap-3 group">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 shadow-md group-hover:bg-emerald-500 transition-colors">
                <Wrench className="size-5 text-white" />
              </div>
              <span className="font-accent text-2xl font-semibold text-white tracking-wide">
                FixItNow
              </span>
            </Link>

            <p className="text-sm leading-relaxed text-slate-400 max-w-xs">
              Your trusted platform for on-demand home services. Connect with verified professionals instantly, anytime.
            </p>

            {/* contact chips */}
            <div className="space-y-2 text-sm text-slate-400">
              <div className="flex items-center gap-2">
                <MapPin className="size-3.5 shrink-0 text-[#009689]" />
                <span>Lahore, Pakistan</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="size-3.5 shrink-0 text-[#009689]" />
                <span>support@fixitnow.pk</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="size-3.5 shrink-0 text-[#009689]" />
                <span>0300-1234567</span>
              </div>
            </div>

            {/* socials */}
            <div className="flex gap-2 pt-1">
              {[
                { icon: <Github   className="size-4" />, href: '#' },
                { icon: <Twitter  className="size-4" />, href: '#' },
                { icon: <Instagram className="size-4" />, href: '#' },
              ].map(({ icon, href }, i) => (
                <Link
                  key={i}
                  href={href}
                  className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-800 text-slate-400 hover:bg-[#009689] hover:text-white transition-all"
                >
                  {icon}
                </Link>
              ))}
            </div>
          </div>

          {/* ── Link columns ──────────────────────────────────── */}
          {Object.entries(LINKS).map(([section, links]) => (
            <div key={section}>
              <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-[#009689]">
                {section}
              </h3>
              <ul className="space-y-2.5">
                {links.map(({ label, href }) => (
                  <li key={label}>
                    <Link
                      href={href}
                      className="group inline-flex items-center gap-1 text-sm text-slate-400 hover:text-white transition-colors"
                    >
                      <ArrowRight className="size-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-[#009689]" />
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* ── Bottom bar ────────────────────────────────────────── */}
        <div className="mt-12 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} FixItNow. All rights reserved.</p>
          <p>
            Built with{' '}
            <span className="text-[#009689] font-medium">Next.js + Supabase</span>
            {' '}by{' '}
            <span className="text-slate-300 font-medium">Muhammad Yar Sanwal</span>
          </p>
        </div>
      </div>
    </footer>
  )
}
