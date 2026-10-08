'use client'

import React, { useState, useEffect } from 'react'
import {
  IndianRupee,
  ShoppingBag,
  Activity,
  Users,
  Calendar,
  Sparkles,
} from 'lucide-react'
import { useAuthStore } from '@/store/useAuthStore'
import { useAdminStore } from '@/store/useAdminStore'
import MetricCard from '@/components/dashboard/MetricCard'
import RevenueChart from '@/components/dashboard/RevenueChart'
import OrderActivityChart from '@/components/dashboard/OrderActivityChart'
import LiveOrdersTable from '@/components/dashboard/LiveOrdersTable'
import TableOverviewGrid from '@/components/dashboard/TableOverviewGrid'
import CategoryDonutChart from '@/components/dashboard/CategoryDonutChart'
import PopularItemsList from '@/components/dashboard/PopularItemsList'
import {
  PopularCategoriesCards,
  BeansRewardsCard,
  RecentActivityFeed,
  NeedsAttentionCard,
} from '@/components/dashboard/BottomWidgets'

export default function DashboardPage() {
  const user = useAuthStore((s) => s.user)
  const orders = useAdminStore((s) => s.orders)
  const toastMessage = useAdminStore((s) => s.toastMessage)

  const [greeting, setGreeting] = useState('Good evening')
  const [formattedDate, setFormattedDate] = useState('')

  useEffect(() => {
    const hour = new Date().getHours()
    if (hour < 12) setGreeting('Good morning')
    else if (hour < 17) setGreeting('Good afternoon')
    else setGreeting('Good evening')

    setFormattedDate(
      new Date().toLocaleDateString('en-IN', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    )
  }, [])

  const activeOrdersCount = orders.filter((o) => o.status !== 'completed').length

  return (
    <div className="p-2 lg:p-8 space-y-6 max-w-[1600px] mx-auto pb-16">
      {/* ── Toast Notification Banner ── */}
      {toastMessage && (
        <div className="fixed top-20 right-8 z-50 bg-[#2C1A0E] text-white px-4 py-2.5 rounded-2xl shadow-xl border border-[#4A2E1D] text-[13px] font-medium flex items-center gap-2 animate-bounce">
          <Sparkles size={15} className="text-[#C87D55]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ── ROW 1: Page Header with Greetings & Live Status ── */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1
            className="text-[26px] sm:text-[30px] font-bold text-[#2C1A0E] tracking-tight leading-tight"
            style={{ fontFamily: '"Playfair Display", Georgia, serif' }}
          >
            {greeting}, {user?.name?.split(' ')[0] || 'staff'}
          </h1>
          <p className="text-[13px] text-[#A08878] mt-1 font-medium">
            Here&apos;s what&apos;s happening at your café today.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Café Status Live Pill */}
          <div className="flex items-center gap-2 bg-white border border-[#EDE2D5] px-3.5 py-1.5 rounded-full text-[12px] font-semibold text-[#2C1A0E] shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Café is open</span>
            <span className="text-[#A08878] text-[11px] font-normal">
              9:00 AM – 11:00 PM
            </span>
          </div>
        </div>
      </div>

      {/* ── ROW 2: 4 Business Snapshot Metric Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* Metric 1: Today's Sales */}
        <MetricCard
          label="Today's Sales"
          value="₹18,420"
          delta="+12.4% vs yesterday"
          deltaType="positive"
          icon={<IndianRupee size={16} />}
          sparklineData={[12, 14, 13, 16, 15, 18, 20]}
          sparklineColor="#C87D55"
        />

        {/* Metric 2: Total Orders */}
        <MetricCard
          label="Total Orders"
          value="42"
          delta="+18% vs yesterday"
          deltaType="positive"
          icon={<ShoppingBag size={16} />}
          sparklineData={[10, 12, 15, 20, 28, 36, 42]}
          sparklineColor="#8C4A28"
        />

        {/* Metric 3: Active Orders */}
        <MetricCard
          label="Active Orders"
          value={String(activeOrdersCount).padStart(2, '0')}
          subtitle="Currently in progress"
          icon={<Activity size={16} />}
          sparklineData={[4, 6, 8, 7, 9, 8, 8]}
          sparklineColor="#D97706"
        />

        {/* Metric 4: Customers */}
        <MetricCard
          label="Customers"
          value="126"
          delta="+18 new today"
          deltaType="positive"
          icon={<Users size={16} />}
          sparklineData={[20, 35, 50, 75, 95, 110, 126]}
          sparklineColor="#16A34A"
        />
      </div>

      {/* ── ROW 3: Two Column Charts (Revenue Line & Hourly Orders Bar) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-7">
          <RevenueChart />
        </div>
        <div className="lg:col-span-5">
          <OrderActivityChart />
        </div>
      </div>

      {/* ── ROW 4: Operational Section (Live Orders, Table Grid, Donut & Popular) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column (7 cols): Live Orders & Popular Categories */}
        <div className="lg:col-span-7 space-y-5">
          <LiveOrdersTable />
          <PopularCategoriesCards />
        </div>

        {/* Right Column (5 cols): Table Grid & Category Donut */}
        <div className="lg:col-span-5 space-y-5">
          <TableOverviewGrid />
          <CategoryDonutChart />
        </div>
      </div>

      {/* ── ROW 5: Bottom Information Grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-4">
          <PopularItemsList />
        </div>
        <div className="lg:col-span-4 space-y-5">
          <BeansRewardsCard />
          <NeedsAttentionCard />
        </div>
        <div className="lg:col-span-4">
          <RecentActivityFeed />
        </div>
      </div>

      {/* ── Subtle Café Footer ── */}
      <div className="pt-8 border-t border-[#EDE2D5] text-center text-[12px] text-[#A08878] space-y-1">
        <p>© 2025 Yemo Café. Brewed with love.</p>
        <p className="font-semibold text-[#8C7362] tracking-wider uppercase text-[10px]">
          Good Food · Good Vibes · Yemo
        </p>
      </div>
    </div>
  )
}
