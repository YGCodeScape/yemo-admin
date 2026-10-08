'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuthStore } from '@/store/useAuthStore'
import Sidebar from '@/components/layout/Sidebar'
import TopBar from '@/components/layout/TopBar'
import { ShieldAlert, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

// Paths only accessible by Admin
const ADMIN_ONLY_PATHS = [
  '/customers',
  '/categories',
  '/inventory/restock',
  '/analytics',
  '/settings',
]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const user = useAuthStore((s) => s.user)
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted && !isAuthenticated) {
      router.push('/login')
    }
  }, [mounted, isAuthenticated, router])

  if (!mounted) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#FAF7F4]">
        <div className="w-8 h-8 border-3 border-[#C87D55]/30 border-t-[#C87D55] rounded-full animate-spin" />
      </div>
    )
  }

  // Prevent flicker before redirect
  if (!isAuthenticated) {
    return null
  }

  // Role Access Check for Staff
  const isRestrictedForStaff =
    user?.role === 'staff' &&
    ADMIN_ONLY_PATHS.some((path) => pathname?.startsWith(path))

  return (
    <div className="flex h-screen overflow-hidden bg-[#FAF7F4]">
      {/* ── Left Sidebar (240px fixed) ── */}
      <Sidebar />

      {/* ── Right Content Area ── */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Header */}
        <TopBar />

        {/* Scrollable Page Body */}
        <main className="flex-1 overflow-y-auto">
          {isRestrictedForStaff ? (
            <div className="h-full flex items-center justify-center p-8">
              <div className="max-w-md w-full bg-white border border-[#EDE2D5] rounded-3xl p-8 text-center shadow-sm">
                <div className="w-14 h-14 bg-amber-50 border border-amber-200 text-[#C87D55] rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <ShieldAlert size={28} />
                </div>
                <h2
                  className="text-[20px] font-bold text-[#2C1A0E] mb-2"
                  style={{ fontFamily: '"Playfair Display", Georgia, serif' }}
                >
                  Admin Access Required
                </h2>
                <p className="text-[13px] text-[#A08878] leading-relaxed mb-6">
                  This section contains sensitive café data reserved for Admins.
                  Your current account has <span className="font-bold text-[#2C1A0E]">Staff</span> permissions.
                </p>
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#2C1A0E] text-white text-[13px] font-bold hover:bg-[#1E110A] transition-all active:scale-95 shadow-sm"
                >
                  <ArrowLeft size={14} />
                  <span>Return to Dashboard</span>
                </Link>
              </div>
            </div>
          ) : (
            children
          )}
        </main>
      </div>
    </div>
  )
}
