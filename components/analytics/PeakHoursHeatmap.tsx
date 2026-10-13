'use client'

import React, { useState } from 'react'
import {
  Clock,
  Sun,
  Sunset,
  Moon,
  Users,
  Coffee,
  Sparkles,
  TrendingUp,
  AlertCircle,
} from 'lucide-react'
import { TimeRange } from './AnalyticsHeader'

interface HourlySlot {
  time: string
  label: string
  density: 'peak' | 'high' | 'medium' | 'low'
  orders: number
  revenue: number
  avgTableTime: string
  topCategory: string
  shiftStaff: number
}

const SLOTS: HourlySlot[] = [
  {
    time: '08:00 - 10:00',
    label: 'Morning Rush',
    density: 'high',
    orders: 58,
    revenue: 19400,
    avgTableTime: '22 mins',
    topCategory: 'Espresso & Croissants',
    shiftStaff: 2,
  },
  {
    time: '10:00 - 12:00',
    label: 'Coffee Meetings',
    density: 'medium',
    orders: 42,
    revenue: 16800,
    avgTableTime: '45 mins',
    topCategory: 'Pour Over & Sandwiches',
    shiftStaff: 2,
  },
  {
    time: '12:00 - 14:00',
    label: 'Lunch & Cowork',
    density: 'high',
    orders: 64,
    revenue: 26200,
    avgTableTime: '52 mins',
    topCategory: 'Savory Bowls & Cold Brew',
    shiftStaff: 3,
  },
  {
    time: '14:00 - 16:00',
    label: 'Afternoon Lull',
    density: 'low',
    orders: 28,
    revenue: 10500,
    avgTableTime: '38 mins',
    topCategory: 'Iced Tea & Cookies',
    shiftStaff: 1,
  },
  {
    time: '16:00 - 19:00',
    label: 'Evening Golden Peak',
    density: 'peak',
    orders: 98,
    revenue: 44800,
    avgTableTime: '48 mins',
    topCategory: 'Pastries & Specialty Lattes',
    shiftStaff: 3,
  },
  {
    time: '19:00 - 22:00',
    label: 'Nightcap & Desserts',
    density: 'medium',
    orders: 52,
    revenue: 21800,
    avgTableTime: '42 mins',
    topCategory: 'Tiramisu & Decaf Lattes',
    shiftStaff: 2,
  },
]

export default function PeakHoursHeatmap({ timeRange }: { timeRange: TimeRange }) {
  const [selectedSlot, setSelectedSlot] = useState<HourlySlot>(SLOTS[4]) // Default to evening peak

  const densityBadge = (density: HourlySlot['density']) => {
    switch (density) {
      case 'peak':
        return 'bg-rose-100 text-rose-800 border-rose-300 font-extrabold'
      case 'high':
        return 'bg-amber-100 text-amber-800 border-amber-300 font-bold'
      case 'medium':
        return 'bg-stone-100 text-stone-700 border-stone-200'
      case 'low':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200'
    }
  }

  const densityBarColor = (density: HourlySlot['density']) => {
    switch (density) {
      case 'peak':
        return 'bg-rose-500'
      case 'high':
        return 'bg-[#C87D55]'
      case 'medium':
        return 'bg-[#E0A96D]'
      case 'low':
        return 'bg-stone-300'
    }
  }

  return (
    <div className="bg-white p-5 md:p-6 rounded-3xl border border-[#EDE2D5] shadow-2xs space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h3
              className="text-lg md:text-xl font-bold text-[#2C1A0E]"
              style={{ fontFamily: '"Playfair Display", Georgia, serif' }}
            >
              Floor Traffic Density & Peak Hours
            </h3>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
              Shift Scheduling
            </span>
          </div>
          <p className="text-[12px] text-[#8C705B] mt-0.5">
            Identify dining surges across daytime intervals to optimize kitchen prep and floor staffing.
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 text-[11px] text-[#8C705B]">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> Peak Surge
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#C87D55]" /> High
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-stone-300" /> Steady
          </span>
        </div>
      </div>

      {/* Hourly Intervals Heatmap Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {SLOTS.map((slot, idx) => {
          const isSelected = selectedSlot.time === slot.time
          const percentage = Math.round((slot.orders / 100) * 100)

          return (
            <div
              key={idx}
              onClick={() => setSelectedSlot(slot)}
              className={`p-3.5 rounded-2xl border transition-all cursor-pointer text-left flex flex-col justify-between ${
                isSelected
                  ? 'bg-[#FAF5EE] border-[#C87D55] ring-2 ring-[#C87D55]/20 shadow-xs'
                  : 'bg-[#FDFBF7] border-[#F2EAE0] hover:border-[#E8DACB]'
              }`}
            >
              <div>
                <div className="flex items-center justify-between text-[11px] font-semibold text-[#8C705B] mb-1">
                  <span>{slot.time.split(' - ')[0]}</span>
                  <span
                    className={`px-1.5 py-0.5 rounded-md text-[9px] uppercase border ${densityBadge(
                      slot.density
                    )}`}
                  >
                    {slot.density}
                  </span>
                </div>
                <div className="text-[12px] font-bold text-[#2C1A0E] truncate">
                  {slot.label}
                </div>
              </div>

              <div className="mt-4 space-y-1.5">
                {/* Visual bar fill */}
                <div className="h-1.5 w-full bg-stone-200/70 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${percentage}%` }}
                    className={`h-full rounded-full ${densityBarColor(slot.density)}`}
                  />
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-extrabold text-[#2C1A0E]">{slot.orders} orders</span>
                  <span className="text-[#8C4A28] font-bold">₹{(slot.revenue / 1000).toFixed(1)}k</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Selected Slot Detailed Deep Dive & Staff Recommendation */}
      <div className="p-4 rounded-2xl bg-linear-to-r from-[#FAF5EE] to-[#F7EDE1]/60 border border-[#EADBCC] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-2xl bg-white border border-[#EDE2D5] flex items-center justify-center text-[#8C4A28] shadow-2xs shrink-0">
            <Clock size={18} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-[#2C1A0E]">
                {selectedSlot.label} ({selectedSlot.time})
              </span>
              <span
                className={`px-2 py-0.5 rounded-md text-[10px] uppercase border ${densityBadge(
                  selectedSlot.density
                )}`}
              >
                {selectedSlot.density}
              </span>
            </div>
            <p className="text-xs text-[#8C705B] mt-0.5">
              Top Orders: <strong className="text-[#2C1A0E]">{selectedSlot.topCategory}</strong> • Avg Table Dwell:{' '}
              <strong className="text-[#2C1A0E]">{selectedSlot.avgTableTime}</strong>
            </p>
          </div>
        </div>

        {/* Actionable Staffing Recommendation */}
        <div className="p-3 bg-white rounded-xl border border-[#EDE2D5] shadow-2xs flex items-center gap-3 shrink-0">
          <div className="text-left">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#A08878] block">
              Optimal Shift Setup
            </span>
            <span className="text-xs font-bold text-[#2C1A0E]">
              {selectedSlot.shiftStaff} Baristas on Floor
            </span>
          </div>
          <span className="px-2 py-1 bg-emerald-50 text-emerald-800 rounded-lg text-[10px] font-bold border border-emerald-200">
            Zero Queue
          </span>
        </div>
      </div>
    </div>
  )
}
