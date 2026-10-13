'use client'

import React, { useState } from 'react'
import AnalyticsHeader, { TimeRange } from '@/components/analytics/AnalyticsHeader'
import AnalyticsMetricCards from '@/components/analytics/AnalyticsMetricCards'
import RevenueTrendsChart from '@/components/analytics/RevenueTrendsChart'
import SalesBreakdownSection from '@/components/analytics/SalesBreakdownSection'
import PeakHoursHeatmap from '@/components/analytics/PeakHoursHeatmap'
import MenuEngineeringMatrix from '@/components/analytics/MenuEngineeringMatrix'
import CustomerRetentionCard from '@/components/analytics/CustomerRetentionCard'
import { useAdminStore } from '@/store/useAdminStore'

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState<TimeRange>('7d')
  const showToast = useAdminStore((s) => s.showToast)

  // Export CSV Handler
  const handleExportCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [
        'Metric,Value,Period,Growth vs Previous',
        `Gross Revenue,₹142850,${timeRange},+14.2%`,
        `Net Profit Margin,68.4%,${timeRange},+2.1%`,
        `Average Order Value,₹384,${timeRange},+₹32`,
        `Table Dwell Time,38 mins,${timeRange},-2 mins`,
        `Repeat Patron Rate,42%,${timeRange},+4.8%`,
        `Dine-In Share,64%,${timeRange},+3.0%`,
        `Takeaway Share,26%,${timeRange},-1.2%`,
        `UPI Payment Share,58%,${timeRange},+6.5%`,
      ].join('\n')

    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', `yemo-analytics-report-${timeRange}-${new Date().toISOString().slice(0, 10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    showToast(`Exported Analytics Report (${timeRange.toUpperCase()})`)
  }

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-[1600px] mx-auto pb-16">
      {/* ── 1. Page Header with Time Range Filter & Export ── */}
      <AnalyticsHeader
        timeRange={timeRange}
        setTimeRange={setTimeRange}
        onExportCSV={handleExportCSV}
      />

      {/* ── 2. Top Executive KPI Cards (Gross Revenue, Margin, AOV, Table Turnover) ── */}
      <AnalyticsMetricCards timeRange={timeRange} />

      {/* ── 3. Revenue Trends, Target Benchmark & Growth Trajectory ── */}
      <RevenueTrendsChart timeRange={timeRange} />

      {/* ── 4. Order Channels (Dine-in vs Takeaway) & Payment Methods ── */}
      <SalesBreakdownSection timeRange={timeRange} />

      {/* ── 5. Floor Density & Peak Hours Heatmap (Shift Optimization) ── */}
      <PeakHoursHeatmap timeRange={timeRange} />

      {/* ── 6. Menu Engineering (Stars, Plowhorses, Puzzles, Dogs) ── */}
      <MenuEngineeringMatrix timeRange={timeRange} />

      {/* ── 7. Customer Loyalty, Repeat Cohorts & Retention Health ── */}
      <CustomerRetentionCard timeRange={timeRange} />

      {/* ── Subtle Café Footer ── */}
      <div className="pt-8 border-t border-[#EDE2D5] text-center text-[12px] text-[#A08878] space-y-1">
        <p>© 2026 Yemo Café Analytics Suite · Financials & Operations</p>
        <p className="font-semibold text-[#8C7362] tracking-wider uppercase text-[10px]">
          Driven by Data · Brewed with Passion
        </p>
      </div>
    </div>
  )
}
