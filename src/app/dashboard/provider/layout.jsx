import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getCurrentUser, signout } from '@/lib/actions/auth'
import { Button } from '@/components/ui/button'

export default async function ProviderLayout({ children }) {
  const user = await getCurrentUser()
  if (!user) redirect('/login')

  const role = user.profile?.role || user.user_metadata?.role
  if (role !== 'provider') redirect('/dashboard')

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur-xl shadow-sm">
        <div className="container mx-auto flex flex-col gap-4 px-4 py-4 lg:flex-row lg:items-center lg:justify-between">

          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#009689] to-teal-700 shadow-sm">
              <span className="font-accent text-lg font-bold text-white">F</span>
            </div>
            <div>
              <span className="font-accent text-xl font-bold">
                <span className="text-[#009689]">Fixit</span><span className="text-[#f97c66]">Now</span>
              </span>
              <p className="text-[10px] text-slate-400 leading-none mt-0.5">Provider workspace</p>
            </div>
          </div>

          {/* Nav + actions */}
          <div className="flex flex-wrap items-center gap-1.5">
            {[
              { href: '/dashboard/provider',              label: 'Overview'      },
              { href: '/dashboard/provider/bookings',     label: 'Requests'      },
              { href: '/dashboard/provider/services',     label: 'My Services'   },
              { href: '/dashboard/provider/notifications',label: 'Notifications' },
              { href: '/dashboard/provider/profile',      label: 'Profile'       },
            ].map(({ href, label }) => (
              <Link key={href} href={href}>
                <Button variant="ghost" size="sm" className="text-slate-600 hover:text-[#009689] hover:bg-[#009689]/8">
                  {label}
                </Button>
              </Link>
            ))}

            <span className="ml-1 inline-flex items-center rounded-full border border-[#f97c66]/25 bg-[#f97c66]/10 px-2.5 py-0.5 text-xs font-semibold text-[#f97c66]">
              Provider
            </span>

            <form action={signout}>
              <Button variant="outline" size="sm" className="ml-1">Sign Out</Button>
            </form>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  )
}
