'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Sidebar, SidebarContent, SidebarFooter, SidebarHeader,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem,
  SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarRail,
} from '@/components/ui/sidebar'
import {
  LayoutDashboard, Users, Wrench, CalendarCheck,
  Layers, Bell, User, Shield,
} from 'lucide-react'

const navItems = [
  { href: '/dashboard/admin',               icon: LayoutDashboard, label: 'Overview',      desc: 'Snapshot & queues'    },
  { href: '/dashboard/admin/users',         icon: Users,           label: 'Users',          desc: 'Roles & accounts'     },
  { href: '/dashboard/admin/providers',     icon: Wrench,          label: 'Providers',      desc: 'Verification workflow'},
  { href: '/dashboard/admin/bookings',      icon: CalendarCheck,   label: 'Bookings',       desc: 'Status management'    },
  { href: '/dashboard/admin/services',      icon: Layers,          label: 'Services',       desc: 'Catalog & categories' },
  { href: '/dashboard/admin/notifications', icon: Bell,            label: 'Notifications',  desc: 'Operational alerts'   },
  { href: '/dashboard/admin/profile',       icon: User,            label: 'Profile',        desc: 'Admin account'        },
]

export default function AdminSidebar() {
  const pathname = usePathname()

  return (
    // Wrap in a div that overrides the sidebar CSS variables to force dark theme
    <div style={{
      '--sidebar':                    'oklch(0.10 0.025 264)',
      '--sidebar-foreground':         'oklch(0.97 0.003 247)',
      '--sidebar-accent':             'oklch(0.16 0.03 264)',
      '--sidebar-accent-foreground':  'oklch(0.97 0.003 247)',
      '--sidebar-border':             'oklch(1 0 0 / 8%)',
      '--sidebar-primary':            '#009689',
      '--sidebar-primary-foreground': '#ffffff',
      '--sidebar-ring':               '#009689',
    }}>
      <Sidebar collapsible="icon" variant="sidebar">

        {/* ── Brand header ──────────────────────────────────── */}
        <SidebarHeader className="border-b border-white/8 pb-4">
          <div className="flex items-center gap-3 px-2 py-1">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#009689] to-teal-700 shadow-lg shadow-[#009689]/30">
              <span className="font-accent text-base font-bold text-white">F</span>
            </div>
            <div className="min-w-0 group-data-[collapsible=icon]:hidden">
              <p className="text-sm font-bold leading-none">
                <span className="text-[#009689]">Fixit</span>
                <span className="text-[#f97c66]">Now</span>
                <span className="ml-1.5 text-white/40 font-normal text-xs">Admin</span>
              </p>
              <p className="text-[10px] text-white/35 mt-0.5 leading-none">Operations center</p>
            </div>
          </div>
        </SidebarHeader>

        {/* ── Nav ───────────────────────────────────────────── */}
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel className="text-white/30 text-[10px] uppercase tracking-widest px-4">
              Navigation
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {navItems.map((item) => {
                  const Icon = item.icon
                  const active = pathname === item.href
                  return (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton
                        asChild
                        isActive={active}
                        tooltip={item.label}
                        className={
                          active
                            ? 'bg-[#009689]/20 text-white border border-[#009689]/30 hover:bg-[#009689]/25'
                            : 'text-white/60 hover:bg-white/6 hover:text-white border border-transparent'
                        }
                      >
                        <Link href={item.href} className="flex items-center gap-3">
                          <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-colors ${
                            active ? 'bg-[#009689] text-white' : 'bg-white/8 text-white/60'
                          }`}>
                            <Icon className="size-3.5" />
                          </div>
                          <span className="font-medium">{item.label}</span>
                          {active && (
                            <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[#009689] shrink-0" />
                          )}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        {/* ── Footer ────────────────────────────────────────── */}
        <SidebarFooter className="border-t border-white/8 pt-4">
          <div className="group-data-[collapsible=icon]:hidden rounded-xl border border-white/8 bg-white/5 px-3 py-2.5 mx-2">
            <div className="flex items-center gap-2 mb-1">
              <Shield className="size-3.5 text-[#009689]" />
              <p className="text-xs font-semibold text-white/60">Admin Access</p>
            </div>
            <p className="text-[10px] text-white/30 leading-relaxed">
              Manage users, verify providers, moderate bookings.
            </p>
          </div>
        </SidebarFooter>

        <SidebarRail />
      </Sidebar>
    </div>
  )
}
