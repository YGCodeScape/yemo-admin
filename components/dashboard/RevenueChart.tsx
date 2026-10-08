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
} from 'recharts'
import { TrendingUp } from 'lucide-react'

// Hourly Revenue Mock Dataset (9 AM - 9 PM)
const TODAY_DATA = [
  { time: '9 AM', revenue: 4800 },
  { time: '11 AM', revenue: 7600 },
  { time: '1 PM', revenue: 14200 },
  { time: '3 PM', revenue: 11800 },
  { time: '5 PM', revenue: 16400 },
  { time: '7 PM', revenue: 18420 },
  { time: '9 PM', revenue: 17200 },
]

const WEEK_DATA = [
  { time: 'Mon', revenue: 14200 },
  { time: 'Tue', revenue: 16800 },
  { time: 'Wed', revenue: 18420 },
  { time: 'Thu', revenue: 15600 },
  { time: 'Fri', revenue: 21300 },
  { time: 'Sat', revenue: 26800 },
  { time: 'Sun', revenue: 24500 },
]

const MONTH_DATA = [
  { time: 'Week 1', revenue: 98000 },
  { time: 'Week 2', revenue: 114000 },
  { time: 'Week 3', revenue: 122000 },
  { time: 'Week 4', revenue: 135400 },
]

export default function RevenueChart() {
  const [activeTab, setActiveTab] = useState<'Today' | 'Week' | 'Month'>('Today')

  const chartData =
    activeTab === 'Today'
      ? TODAY_DATA
      : activeTab === 'Week'
      ? WEEK_DATA
      : MONTH_DATA

  const currentRevenue =
    activeTab === 'Today'
      ? '₹18,420'
      : activeTab === 'Week'
      ? '₹1,37,620'
      : '₹4,69,400'

  return (
    <div className="bg-white border border-[#EDE2D5] rounded-2xl p-5 shadow-2xs flex flex-col justify-between">
      {/* Chart Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#C87D55]" />
            <h3 className="text-[15px] font-bold text-[#2C1A0E]">
              Revenue Overview
            </h3>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-[20px] font-bold text-[#2C1A0E]">
              {currentRevenue}
            </span>
            <span className="text-[11px] font-medium text-[#8C7362] bg-[#FAF5EE] px-2 py-0.5 rounded-md border border-[#EBDCCF]">
              {activeTab === 'Today' ? "Today's revenue" : `${activeTab}ly total`}
            </span>
          </div>
        </div>

        {/* Time Tabs (Today | Week | Month) */}
        <div className="flex items-center bg-[#FAF5EE] border border-[#EBDCCF] p-0.5 rounded-xl">
          {(['Today', 'Week', 'Month'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1 text-[11px] font-semibold rounded-lg transition-all ${
                activeTab === tab
                  ? 'bg-white text-[#2C1A0E] shadow-2xs font-bold'
                  : 'text-[#8C7362] hover:text-[#2C1A0E]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Recharts Area Chart with Warm Gradient */}
      <div className="w-full h-56 mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="yemoRevenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#C87D55" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#C87D55" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F2EAE1" />
            <XAxis
              dataKey="time"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#A08878', fontSize: 11, fontWeight: 500 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#A08878', fontSize: 11 }}
              tickFormatter={(val) => `₹${val >= 1000 ? `${val / 1000}k` : val}`}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-[#2C1A0E] text-white px-3 py-1.5 rounded-xl shadow-lg border border-[#4A2E1D] text-[12px]">
                      <span className="text-[#D4B8A8] text-[10px] block">
                        {payload[0].payload.time}
                      </span>
                      <span className="font-bold text-white text-[13px]">
                        ₹{Number(payload[0].value).toLocaleString('en-IN')}
                      </span>
                    </div>
                  )
                }
                return null
              }}
            />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#C87D55"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#yemoRevenueGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
