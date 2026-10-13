'use client'

import React from 'react'
import {
  Calendar,
  Download,
  TrendingUp,
  Sparkles,
  ChevronDown,
  Printer,
  FileSpreadsheet,
} from 'lucide-react'

export type TimeRange = 'today' | '7d' | '30d' | 'month' | '90d'

interface AnalyticsHeaderProps {
  timeRange: TimeRange
  setTimeRange: (range: TimeRange) => void
  onExportCSV: () => void
}

export default function AnalyticsHeader({
  timeRange,
  setTimeRange,
  onExportCSV,
}: AnalyticsHeaderProps) {
  const rangeLabels: Record<TimeRange, string> = {
    today: 'Today',
    '7d': 'Last 7 Days',
    '30d': 'Last 30 Days',
    month: 'This Month',
    '90d': 'Last 90 Days',
  }

  const comparisonLabels: Record<TimeRange, string> = {
    today: 'vs yesterday',
    '7d': 'vs previous 7 days',
    '30d': 'vs previous 30 days',
    month: 'vs last month',
    '90d': 'vs previous quarter',
  }

  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-5 md:p-6 rounded-3xl border border-[#EDE2D5] shadow-2xs">
      <div>
        <div className="flex items-center gap-2.5">
          <span className="px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-[#FAF5EE] text-[#8C4A28] border border-[#EADBCC] flex items-center gap-1.5">
            <Sparkles size={12} className="text-[#C87D55]" />
            <span>Executive Insights</span>
          </span>
          <span className="text-[12px] text-[#A08878] font-medium hidden sm:inline">
            Comparing {comparisonLabels[timeRange]}
          </span>
        </div>
        <h1
          className="text-2xl md:text-3xl font-bold text-[#2C1A0E] tracking-tight mt-1.5"
          style={{ fontFamily: '"Playfair Display", Georgia, serif' }}
        >
          Business Analytics & Growth
        </h1>
        <p className="text-[13px] text-[#8C705B] mt-1 max-w-2xl">
          Track café revenue trends, customer lifetime value, peak floor velocity, and menu profitability.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2.5">
        {/* Timeframe Presets */}
        <div className="inline-flex items-center bg-[#FAF5EE] p-1 rounded-2xl border border-[#EDE2D5] text-[12px] font-semibold text-[#8C705B]">
          {(['today', '7d', '30d', 'month', '90d'] as TimeRange[]).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap ${
                timeRange === range
                  ? 'bg-white text-[#2C1A0E] font-bold shadow-2xs'
                  : 'hover:text-[#2C1A0E]'
              }`}
            >
              {rangeLabels[range]}
            </button>
          ))}
        </div>

        {/* Export Report Button */}
        <button
          onClick={onExportCSV}
          className="flex items-center gap-2 px-3.5 py-2 bg-[#2C1A0E] hover:bg-[#432817] text-white text-[12px] font-semibold rounded-2xl shadow-2xs transition-all active:scale-95"
          title="Export CSV dataset for current date range"
        >
          <FileSpreadsheet size={15} className="text-amber-400" />
          <span>Export Report</span>
        </button>
      </div>
    </div>
  )
}
