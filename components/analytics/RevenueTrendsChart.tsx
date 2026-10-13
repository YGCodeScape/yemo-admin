'use client'

import React, { useState } from 'react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  ReferenceLine,
} from 'recharts'
import { IndianRupee, ShoppingBag, Percent, Sparkles } from 'lucide-react'
import { TimeRange } from './AnalyticsHeader'

type ChartMetric = 'revenue' | 'orders' | 'profit'

interface DataPoint {
  label: string
  revenue: number
  orders: number
  profit: number
  targetRevenue: number
}

const DATA_BY_RANGE: Record<TimeRange, DataPoint[]> = {
  today: [
    { label: '8 AM', revenue: 1400, orders: 4, profit: 980, targetRevenue: 1200 },
    { label: '10 AM', revenue: 3800, orders: 11, profit: 2600, targetRevenue: 3000 },
    { label: '12 PM', revenue: 6200, orders: 17, profit: 4200, targetRevenue: 5500 },
    { label: '2 PM', revenue: 8900, orders: 23, profit: 6050, targetRevenue: 8000 },
    { label: '4 PM', revenue: 12400, orders: 31, profit: 8400, targetRevenue: 11000 },
    { label: '6 PM', revenue: 16800, orders: 39, profit: 11400, targetRevenue: 15000 },
    { label: '8 PM', revenue: 18420, orders: 42, profit: 12480, targetRevenue: 18000 },
  ],
  '7d': [
    { label: 'Mon', revenue: 16200, orders: 44, profit: 11000, targetRevenue: 15000 },
    { label: 'Tue', revenue: 17800, orders: 48, profit: 12100, targetRevenue: 16000 },
    { label: 'Wed', revenue: 18420, orders: 49, profit: 12590, targetRevenue: 16500 },
    { label: 'Thu', revenue: 19100, orders: 51, profit: 13050, targetRevenue: 17000 },
    { label: 'Fri', revenue: 23400, orders: 62, profit: 16000, targetRevenue: 20000 },
    { label: 'Sat', revenue: 28900, orders: 76, profit: 19800, targetRevenue: 24000 },
    { label: 'Sun', revenue: 26800, orders: 70, profit: 18300, targetRevenue: 23000 },
  ],
  '30d': [
    { label: 'Oct 1-5', revenue: 84200, orders: 226, profit: 57600, targetRevenue: 75000 },
    { label: 'Oct 6-10', revenue: 92400, orders: 248, profit: 63200, targetRevenue: 82000 },
    { label: 'Oct 11-15', revenue: 98100, orders: 261, profit: 67100, targetRevenue: 88000 },
    { label: 'Oct 16-20', revenue: 91500, orders: 242, profit: 62600, targetRevenue: 85000 },
    { label: 'Oct 21-25', revenue: 104200, orders: 279, profit: 71400, targetRevenue: 92000 },
    { label: 'Oct 26-30', revenue: 112500, orders: 301, profit: 77200, targetRevenue: 98000 },
  ],
  month: [
    { label: 'Week 1', revenue: 108400, orders: 289, profit: 74200, targetRevenue: 98000 },
    { label: 'Week 2', revenue: 118600, orders: 316, profit: 81200, targetRevenue: 105000 },
    { label: 'Week 3', revenue: 124200, orders: 331, profit: 85000, targetRevenue: 110000 },
    { label: 'Week 4', revenue: 138200, orders: 368, profit: 94800, targetRevenue: 120000 },
  ],
  '90d': [
    { label: 'August', revenue: 482000, orders: 1280, profit: 329000, targetRevenue: 440000 },
    { label: 'September', revenue: 524000, orders: 1395, profit: 358000, targetRevenue: 470000 },
    { label: 'October', revenue: 576400, orders: 1530, profit: 395000, targetRevenue: 510000 },
  ],
}

export default function RevenueTrendsChart({ timeRange }: { timeRange: TimeRange }) {
  const [metric, setMetric] = useState<ChartMetric>('revenue')

  const chartData = DATA_BY_RANGE[timeRange]

  // Formatter helpers
  const formatYAxis = (val: number) => {
    if (metric === 'orders') return `${val}`
    if (val >= 100000) return `₹${(val / 100000).toFixed(1)}L`
    if (val >= 1000) return `₹${(val / 1000).toFixed(0)}k`
    return `₹${val}`
  }

  const metricConfig = {
    revenue: {
      name: 'Gross Revenue',
      stroke: '#C87D55',
      fill: 'url(#revenueGradient)',
      icon: IndianRupee,
    },
    orders: {
      name: 'Orders Count',
      stroke: '#8C4A28',
      fill: 'url(#ordersGradient)',
      icon: ShoppingBag,
    },
    profit: {
      name: 'Net Profit',
      stroke: '#16A34A',
      fill: 'url(#profitGradient)',
      icon: Percent,
    },
  }[metric]

  // Peak calculation
  const peakPoint = chartData.reduce((max, cur) =>
    cur[metric] > max[metric] ? cur : max
  )

  return (
    <div className="bg-white p-5 md:p-6 rounded-3xl border border-[#EDE2D5] shadow-2xs space-y-4">
      {/* Chart Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2
              className="text-lg md:text-xl font-bold text-[#2C1A0E]"
              style={{ fontFamily: '"Playfair Display", Georgia, serif' }}
            >
              Revenue & Growth Velocity
            </h2>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
              +14.2% Growth
            </span>
          </div>
          <p className="text-[12px] text-[#8C705B] mt-0.5">
            Interactive multi-period financial trajectory with benchmark comparison.
          </p>
        </div>

        {/* Metric Selector Tabs */}
        <div className="inline-flex items-center bg-[#FAF5EE] p-1 rounded-2xl border border-[#EDE2D5] text-[11px] font-semibold text-[#8C705B]">
          <button
            onClick={() => setMetric('revenue')}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              metric === 'revenue'
                ? 'bg-white text-[#2C1A0E] font-bold shadow-2xs'
                : 'hover:text-[#2C1A0E]'
            }`}
          >
            Gross Revenue
          </button>
          <button
            onClick={() => setMetric('profit')}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              metric === 'profit'
                ? 'bg-white text-[#2C1A0E] font-bold shadow-2xs'
                : 'hover:text-[#2C1A0E]'
            }`}
          >
            Net Profit
          </button>
          <button
            onClick={() => setMetric('orders')}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              metric === 'orders'
                ? 'bg-white text-[#2C1A0E] font-bold shadow-2xs'
                : 'hover:text-[#2C1A0E]'
            }`}
          >
            Orders Volume
          </button>
        </div>
      </div>

      {/* Peak Performance Pill */}
      <div className="p-3 bg-[#FAF5EE] border border-[#EADBCC] rounded-2xl flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2 text-[#8C4A28] font-medium">
          <Sparkles size={14} className="text-[#C87D55]" />
          <span>
            Period Peak:{' '}
            <strong className="text-[#2C1A0E] font-bold">{peakPoint.label}</strong> with{' '}
            <strong className="text-[#2C1A0E]">
              {metric === 'orders' ? `${peakPoint.orders} Orders` : `₹${peakPoint[metric].toLocaleString()}`}
            </strong>
          </span>
        </div>
        <span className="text-[11px] text-[#A08878]">
          Dashed line represents planned target
        </span>
      </div>

      {/* Recharts Area Container */}
      <div className="h-[280px] w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
            <defs>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#C87D55" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#C87D55" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="profitGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#16A34A" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#16A34A" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="ordersGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8C4A28" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#8C4A28" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F2EAE0" />
            <XAxis
              dataKey="label"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: '#8C705B' }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: '#8C705B' }}
              tickFormatter={formatYAxis}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  const val = payload[0].value as number
                  return (
                    <div className="bg-[#2C1A0E] text-white p-3 rounded-2xl shadow-xl border border-[#432817] text-xs space-y-1">
                      <div className="font-bold text-[#EADBCC]">{label}</div>
                      <div className="text-sm font-extrabold text-amber-400">
                        {metric === 'orders' ? `${val} orders` : `₹${val.toLocaleString()}`}
                      </div>
                      <div className="text-[10px] text-stone-300">
                        Target:{' '}
                        {metric === 'orders'
                          ? `${Math.round(val * 0.9)} orders`
                          : `₹${(payload[0].payload as DataPoint).targetRevenue.toLocaleString()}`}
                      </div>
                    </div>
                  )
                }
                return null
              }}
            />

            {/* Target Baseline */}
            {metric === 'revenue' && (
              <ReferenceLine
                stroke="#D97706"
                strokeDasharray="4 4"
                strokeOpacity={0.5}
                label={{ value: 'Target', fill: '#D97706', fontSize: 10, position: 'right' }}
              />
            )}

            <Area
              type="monotone"
              dataKey={metric}
              stroke={metricConfig.stroke}
              strokeWidth={2.5}
              fill={metricConfig.fill}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
