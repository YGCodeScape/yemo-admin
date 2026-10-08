'use client'

import React from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts'
import { Clock } from 'lucide-react'

// Hourly Orders Activity Mock Data
const HOURLY_ORDERS = [
  { hour: '09', orders: 28 },
  { hour: '10', orders: 36 },
  { hour: '11', orders: 52 },
  { hour: '12', orders: 48 },
  { hour: '13', orders: 42 },
  { hour: '14', orders: 54 },
  { hour: '15', orders: 68 }, // Peak lunch/coffee hour!
  { hour: '16', orders: 56 },
  { hour: '17', orders: 38 },
  { hour: '18', orders: 44 },
  { hour: '19', orders: 58 },
  { hour: '20', orders: 46 },
  { hour: '21', orders: 34 },
]

export default function OrderActivityChart() {
  return (
    <div className="bg-white border border-[#EDE2D5] rounded-2xl p-5 shadow-2xs flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#8C4A28]" />
            <h3 className="text-[15px] font-bold text-[#2C1A0E]">
              Order Activity
            </h3>
          </div>
          <p className="text-[12px] text-[#A08878] mt-0.5">
            Orders by Hour · Peak at 3:00 PM
          </p>
        </div>

        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#8C4A28] bg-[#FAF5EE] border border-[#EBDCCF] px-2.5 py-1 rounded-xl">
          <Clock size={12} />
          <span>Real-time</span>
        </div>
      </div>

      {/* Bar Chart */}
      <div className="w-full h-56 mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={HOURLY_ORDERS} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F2EAE1" />
            <XAxis
              dataKey="hour"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#A08878', fontSize: 11, fontWeight: 500 }}
              tickFormatter={(val) => `${val}`}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#A08878', fontSize: 11 }}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-[#2C1A0E] text-white px-3 py-1.5 rounded-xl shadow-lg border border-[#4A2E1D] text-[12px]">
                      <span className="text-[#D4B8A8] text-[10px] block">
                        Hour: {payload[0].payload.hour}:00
                      </span>
                      <span className="font-bold text-white text-[13px]">
                        {payload[0].value} orders
                      </span>
                    </div>
                  )
                }
                return null
              }}
            />
            <Bar
              dataKey="orders"
              fill="#8C4A28"
              radius={[6, 6, 0, 0]}
              maxBarSize={22}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
