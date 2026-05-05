import { redirect } from 'next/navigation'
import { signout, getCurrentUser } from '@/lib/actions/auth'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import AdminSidebar from '@/components/admin/AdminSidebar'

export default async function AdminLayout({ children }) {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/login')
  }

  const role = user.profile?.role || user.user_metadata?.role

  if (role !== 'admin') {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen bg-slate-50 lg:flex">
      <AdminSidebar />

      <div className="flex-1 min-w-0">
        <header className="sticky top-0 z-30 border-b bg-white/90 backdrop-blur">
          <div className="flex items-center justify-between px-4 py-4 lg:px-8">
            <div>
              <p className="text-sm text-slate-500">Admin Console</p>
              <div className="flex items-center gap-3">
                <h1 className="text-xl font-semibold text-slate-900">Dashboard Workflow</h1>
                <Badge className="bg-amber-100 text-amber-700 border-amber-200">Admin</Badge>
              </div>
            </div>

            <form action={signout}>
              <Button variant="outline">Sign Out</Button>
            </form>
          </div>
        </header>

        <main className="px-4 py-6 lg:px-8 lg:py-8">{children}</main>
      </div>
    </div>
  )
}