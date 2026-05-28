import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getCurrentUser, signout } from '@/lib/actions/auth'
import { getMyChatThreads } from '@/lib/actions/chat'
import ChatLauncher from '@/components/chat/ChatLauncher'
import { Button } from '@/components/ui/button'

export default async function ProviderLayout({ children }) {
  const user = await getCurrentUser()
  if (!user) redirect('/login')

  const role = user.profile?.role || user.user_metadata?.role
  if (role !== 'provider') redirect('/dashboard')

  const chatThreads = await getMyChatThreads()

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur-xl shadow-sm">
        <div className="container mx-auto flex flex-col gap-4 px-4 py-4 lg:flex-row lg:items-center lg:justify-between">

          {/* Brand */}
          <div className="flex items-center gap-3">
            <a href="/" className="flex items-center gap-3">
              <img src="/Fix-it-logo.png" alt="FixItNow" className="h-10 w-auto" />
              <div>
                <span className="font-accent text-2xl font-bold text-gradient hidden sm:inline">FixItNow</span>
                <p className="text-[10px] text-slate-400 leading-none mt-0.5">Provider workspace</p>
              </div>
            </a>
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
      <ChatLauncher initialThreads={chatThreads} currentUserId={user.id} />
    </div>
  )
}
