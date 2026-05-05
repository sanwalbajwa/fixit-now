import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getCurrentUser, signout } from '@/lib/actions/auth'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export default async function CustomerLayout({ children }) {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/login')
  }

  const role = user.profile?.role || user.user_metadata?.role

  if (role !== 'customer') {
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
              <div className="text-xs text-slate-500">Customer workspace</div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Link href="/dashboard/customer"><Button variant="ghost" size="sm">Overview</Button></Link>
            <Link href="/dashboard/customer/services"><Button variant="ghost" size="sm">Browse Services</Button></Link>
            <Link href="/dashboard/customer/bookings"><Button variant="ghost" size="sm">My Bookings</Button></Link>
            <Link href="/dashboard/customer/notifications"><Button variant="ghost" size="sm">Notifications</Button></Link>
            <Link href="/dashboard/customer/profile"><Button variant="ghost" size="sm">Profile</Button></Link>
            <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">Customer</Badge>
            <form action={signout}><Button variant="outline" size="sm">Sign Out</Button></form>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  )
}