'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard,
  ShoppingBag,
  Grid2X2,
  UtensilsCrossed,
  Layers,
  Package,
  History,
  Users,
  Award,
  BarChart3,
  Settings,
  LogOut,
  Shield,
  Coffee,
} from 'lucide-react'
import { useAuthStore, UserRole } from '@/store/useAuthStore'

interface NavItem {
  title: string
  href: string
  icon: React.ElementType
  badge?: string | number
  badgeColor?: string
  allowedRoles: UserRole[]
}

interface NavGroup {
  label: string
  items: NavItem[]
}

const NAV_GROUPS: NavGroup[] = [
  {
    label: 'OVERVIEW',
    items: [
      {
        title: 'Dashboard',
        href: '/dashboard',
        icon: LayoutDashboard,
        allowedRoles: ['admin', 'staff'],
      },
    ],
  },
  {
    label: 'OPERATIONS',
    items: [
      {
        title: 'Orders',
        href: '/orders',
        icon: ShoppingBag,
        badge: 8,
        badgeColor: 'bg-[#C87D55] text-white',
        allowedRoles: ['admin', 'staff'],
      },
      {
        title: 'Tables',
        href: '/tables',
        icon: Grid2X2,
        allowedRoles: ['admin', 'staff'],
      },
    ],
  },
  {
    label: 'CATALOG',
    items: [
      {
        title: 'Menu',
        href: '/menu',
        icon: UtensilsCrossed,
        allowedRoles: ['admin'],
      },
      {
        title: 'Categories',
        href: '/categories',
        icon: Layers,
        allowedRoles: ['admin'],
      },
    ],
  },
  {
    label: 'INVENTORY',
    items: [
      {
        title: 'Stock',
        href: '/inventory/stock',
        icon: Package,
        badge: '⚠2',
        badgeColor: 'bg-amber-500/20 text-amber-300 border border-amber-500/40',
        allowedRoles: ['admin'],
      },
      {
        title: 'Restock History',
        href: '/inventory/restock',
        icon: History,
        allowedRoles: ['admin'],
      },
    ],
  },
  {
    label: 'CUSTOMERS',
    items: [
      {
        title: 'Customers',
        href: '/customers',
        icon: Users,
        allowedRoles: ['admin'], // Hidden from staff to protect customer data
      },
      {
        title: 'Rewards',
        href: '/rewards',
        icon: Award,
        allowedRoles: ['admin', 'staff'], // Staff can scan QR to validate vouchers
      },
    ],
  },
  {
    label: 'INSIGHTS',
    items: [
      {
        title: 'Analytics',
        href: '/analytics',
        icon: BarChart3,
        allowedRoles: ['admin'],
      },
    ],
  },
  {
    label: 'SYSTEM',
    items: [
      {
        title: 'Settings',
        href: '/settings',
        icon: Settings,
        allowedRoles: ['admin'],
      },
    ],
  },
]

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)

  const userRole: UserRole = user?.role || 'admin'

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  return (
    <aside className="w-55 flex-shrink-0 bg-[#1E110A] text-[#E8D5C0] flex flex-col h-screen border-r border-[#2C1A0E] select-none">
      {/* ── Brand Logo Header ── */}
      <div className="p-4 pb-2 border-b border-white/5">
        <Link href="/dashboard" className="block group">
          <h1
            className="text-[26px] font-bold text-white tracking-tight leading-none transition-colors"
            style={{ fontFamily: '"Lily Script One", system-ui' }}>
            yemo cafe
          </h1>
        </Link>
      </div>

      {/* ── Scrollable Navigation Items ── */}
      <div className="flex-1 overflow-y-auto px-3.5 py-4 space-y-5 sidebar-scrollbar">
        {NAV_GROUPS.map((group) => {
          // Filter items based on user role
          const visibleItems = group.items.filter((item) =>
            item.allowedRoles.includes(userRole)
          )

          if (visibleItems.length === 0) return null

          return (
            <div key={group.label} className="space-y-1">
              <p className="px-2.5 text-[10px] font-bold tracking-[0.14em] text-[#7A5C48] uppercase mb-1.5">
                {group.label}
              </p>

              {visibleItems.map((item) => {
                const Icon = item.icon
                const isActive =
                  pathname === item.href ||
                  (item.href !== '/dashboard' && pathname?.startsWith(item.href))

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center justify-between px-3 py-2 rounded-xl text-[13px] font-medium transition-all ${
                      isActive
                        ? 'bg-[#C87D55] text-white shadow-sm font-semibold'
                        : 'text-[#C4A882] hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon
                        size={17}
                        className={isActive ? 'text-white' : 'text-[#A08878] group-hover:text-white'}
                      />
                      <span>{item.title}</span>
                    </div>

                    {item.badge && (
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                          isActive
                            ? 'bg-white/20 text-white'
                            : item.badgeColor || 'bg-white/10 text-white'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </Link>
                )
              })}
            </div>
          )
        })}
      </div>

      {/* ── Bottom Pinned Area ── */}
      <div className="p-3.5 border-t border-white/5 space-y-3 bg-[#180D07]">

        {/* User Profile Card */}
        <div className="flex items-center justify-between px-2.5 py-2 rounded-xl bg-white/[0.03]">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full bg-[#C87D55] flex items-center justify-center text-white font-bold text-[12px] flex-shrink-0 shadow-xs">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
            </div>
            <div className="min-w-0">
              <p className="text-[12px] font-bold text-white truncate leading-tight">
                {user?.name || 'Ananya Sharma'}
              </p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-[10px] text-[#A08878] font-mono">
                  {user?.staffId || 'ADM-001'}
                </span>
                <span className="text-[9px] px-1.5 py-0.2 rounded-full font-bold bg-[#C87D55]/20 text-[#E8A57F] uppercase tracking-wide flex items-center gap-0.5">
                  {userRole === 'admin' ? (
                    <>
                      <Shield size={9} />
                      Admin
                    </>
                  ) : (
                    <>
                      <Coffee size={9} />
                      Staff
                    </>
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-[12px] font-medium text-[#C4A882] hover:text-white hover:bg-red-500/10 hover:border-red-500/20 border border-transparent transition-all active:scale-[0.98]"
        >
          <LogOut size={14} className="text-[#A08878]" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  )
}
