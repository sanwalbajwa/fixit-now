'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/dashboard/admin', label: 'Overview', description: 'Snapshot and queues' },
  { href: '/dashboard/admin/users', label: 'Users', description: 'Roles and accounts' },
  { href: '/dashboard/admin/providers', label: 'Providers', description: 'Verification workflow' },
  { href: '/dashboard/admin/bookings', label: 'Bookings', description: 'Status management' },
  { href: '/dashboard/admin/services', label: 'Services', description: 'Catalog and categories' },
  { href: '/dashboard/admin/notifications', label: 'Notifications', description: 'Operational alerts' },
  { href: '/dashboard/admin/profile', label: 'Profile', description: 'Admin account settings' },
]

export default function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden lg:flex lg:w-80 lg:flex-col border-r bg-slate-950 text-white">
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-slate-950 font-bold">
            A
          </div>
          <div>
            <p className="text-lg font-semibold">FixItNow Admin</p>
            <p className="text-sm text-white/60">Operations control center</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'block rounded-2xl border px-4 py-3 transition-all',
                isActive
                  ? 'border-amber-400/40 bg-amber-400/10 text-white shadow-lg shadow-amber-400/10'
                  : 'border-white/10 bg-white/5 text-white/75 hover:bg-white/10 hover:text-white'
              )}
            >
              <div className="text-sm font-semibold">{item.label}</div>
              <div className="text-xs text-inherit/70 mt-0.5">{item.description}</div>
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-white/10 text-xs text-white/50">
        Admin role can manage users, verify providers, and moderate bookings.
      </div>
    </aside>
  )
}