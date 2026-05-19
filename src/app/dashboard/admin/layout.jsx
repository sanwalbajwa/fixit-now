import { redirect } from 'next/navigation'
import { signout, getCurrentUser } from '@/lib/actions/auth'
import { Button } from '@/components/ui/button'
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'
import AdminSidebar from '@/components/admin/AdminSidebar'
export default async function AdminLayout({ children }) {
  const user = await getCurrentUser()
  if (!user) redirect('/login')

  const role = user.profile?.role || user.user_metadata?.role
  if (role !== 'admin') redirect('/dashboard')

  return (
    <SidebarProvider>
      <AdminSidebar />

      <SidebarInset>
        {/* ── Top header ──────────────────────────────────────── */}
        <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-2 border-b border-slate-200 bg-white/90 backdrop-blur-xl shadow-sm">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1 text-slate-600 hover:text-slate-900" />
            <Separator orientation="vertical" className="mr-2 h-4" />
          </div>

          <div className="flex flex-1 items-center justify-between px-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Admin Console
              </p>
              <div className="flex items-center gap-2.5 mt-0.5">
                <h1 className="text-lg font-bold text-slate-900">FixItNow Dashboard</h1>
                <span className="inline-flex items-center rounded-full border border-[#009689]/25 bg-[#009689]/10 px-2.5 py-0.5 text-xs font-semibold text-[#009689]">
                  Admin
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <form action={signout}>
                <Button variant="outline" size="sm">Sign Out</Button>
              </form>
            </div>
          </div>
        </header>

        <main className="flex-1 px-4 py-6 lg:px-8 lg:py-8 bg-slate-50 min-h-[calc(100vh-4rem)]">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
