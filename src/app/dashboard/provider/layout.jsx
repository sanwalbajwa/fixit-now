import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getCurrentUser, signout } from '@/lib/actions/auth'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export default async function ProviderLayout({ children }) {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/login')
  }

  const role = user.profile?.role || user.user_metadata?.role

  if (role !== 'provider') {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="border-b bg-white/90 backdrop-blur">
        <div className="container mx-auto flex flex-col gap-4 px-4 py-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center space-x-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg gradient-primary">
              <span className="font-accent text-xl font-bold text-white">F</span>
            </div>
            <div>
              <span className="font-accent text-2xl font-bold text-gradient">FixItNow</span>
              <div className="text-xs text-slate-500">Provider workspace</div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Link href="/dashboard/provider"><Button variant="ghost" size="sm">Overview</Button></Link>
            <Link href="/dashboard/provider/bookings"><Button variant="ghost" size="sm">Requests</Button></Link>
            <Link href="/dashboard/provider/services"><Button variant="ghost" size="sm">My Services</Button></Link>
            <Link href="/dashboard/provider/notifications"><Button variant="ghost" size="sm">Notifications</Button></Link>
            <Link href="/dashboard/provider/profile"><Button variant="ghost" size="sm">Profile</Button></Link>
            <Badge className="bg-amber-100 text-amber-700 border-amber-200">Provider</Badge>
            <form action={signout}><Button variant="outline" size="sm">Sign Out</Button></form>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  )
}