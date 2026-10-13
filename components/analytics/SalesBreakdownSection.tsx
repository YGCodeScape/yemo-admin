'use client'

import React from 'react'
import {
  Coffee,
  ShoppingBag,
  QrCode,
  CreditCard,
  Smartphone,
  Banknote,
  Zap,
} from 'lucide-react'
import { TimeRange } from './AnalyticsHeader'

export default function SalesBreakdownSection({ timeRange }: { timeRange: TimeRange }) {
  const channels = [
    {
      name: 'Dine-In Seating',
      percentage: 64,
      revenue: '₹88,076',
      avgTicket: '₹412',
      color: 'bg-[#C87D55]',
      textColor: 'text-[#8C4A28]',
      icon: Coffee,
      orders: 214,
    },
    {
      name: 'Takeaway & Grab-n-Go',
      percentage: 26,
      revenue: '₹35,781',
      avgTicket: '₹320',
      color: 'bg-[#E0A96D]',
      textColor: 'text-amber-800',
      icon: ShoppingBag,
      orders: 112,
    },
    {
      name: 'QR Self-Order at Table',
      percentage: 10,
      revenue: '₹13,762',
      avgTicket: '₹390',
      color: 'bg-[#735543]',
      textColor: 'text-[#4A2E1D]',
      icon: QrCode,
      orders: 35,
    },
  ]

  const paymentModes = [
    {
      name: 'UPI / QR Payments',
      percentage: 58,
      share: '₹79,820',
      speed: 'Instant (3s)',
      icon: Smartphone,
      accent: 'text-emerald-700 bg-emerald-50 border-emerald-200',
    },
    {
      name: 'Credit / Debit Cards',
      percentage: 28,
      share: '₹38,530',
      speed: 'POS Tap (6s)',
      icon: CreditCard,
      accent: 'text-blue-700 bg-blue-50 border-blue-200',
    },
    {
      name: 'Cash Tendered',
      percentage: 14,
      share: '₹19,270',
      speed: 'Counter register',
      icon: Banknote,
      accent: 'text-amber-700 bg-amber-50 border-amber-200',
    },
  ]

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
      {/* ── Left Card: Dining Channel Split (7 cols) ── */}
      <div className="lg:col-span-7 bg-white p-5 md:p-6 rounded-3xl border border-[#EDE2D5] shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3
              className="text-lg font-bold text-[#2C1A0E]"
              style={{ fontFamily: '"Playfair Display", Georgia, serif' }}
            >
              Order Channels & Dining Flow
            </h3>
            <p className="text-[12px] text-[#8C705B] mt-0.5">
              Revenue distribution by order origin and service type for {timeRange === 'today' ? 'today' : `the last ${timeRange}`}.
            </p>
          </div>
          <span className="text-[11px] font-bold text-[#8C4A28] px-2.5 py-1 bg-[#FAF5EE] rounded-xl border border-[#EDE2D5]">
            361 Total Orders
          </span>
        </div>

        {/* Stacked Visual Bar */}
        <div className="h-3.5 w-full bg-[#FAF5EE] rounded-full overflow-hidden flex p-0.5 gap-0.5 border border-[#EDE2D5]">
          {channels.map((ch, idx) => (
            <div
              key={idx}
              style={{ width: `${ch.percentage}%` }}
              className={`${ch.color} rounded-sm transition-all`}
              title={`${ch.name}: ${ch.percentage}%`}
            />
          ))}
        </div>

        {/* Channels List Breakdown */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          {channels.map((ch, idx) => {
            const Icon = ch.icon
            return (
              <div
                key={idx}
                className="p-3.5 rounded-2xl bg-[#FDFBF7] border border-[#F2EAE0] hover:border-[#E8DACB] transition-all space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="w-8 h-8 rounded-xl bg-white border border-[#EDE2D5] flex items-center justify-center text-[#8C4A28] shadow-2xs">
                    <Icon size={15} />
                  </div>
                  <span className="text-xs font-extrabold text-[#2C1A0E]">
                    {ch.percentage}%
                  </span>
                </div>
                <div>
                  <div className="text-[12px] font-bold text-[#2C1A0E] truncate">
                    {ch.name}
                  </div>
                  <div className="text-[11px] text-[#A08878] mt-0.5">
                    {ch.orders} orders
                  </div>
                </div>
                <div className="pt-2 border-t border-[#F2EAE0] flex items-center justify-between text-[11px]">
                  <span className="font-extrabold text-[#2C1A0E]">{ch.revenue}</span>
                  <span className="text-[#8C705B]">Avg {ch.avgTicket}</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* ── Right Card: Payment Modes & Kitchen Velocity (5 cols) ── */}
      <div className="lg:col-span-5 bg-white p-5 md:p-6 rounded-3xl border border-[#EDE2D5] shadow-2xs space-y-4">
        <div>
          <h3
            className="text-lg font-bold text-[#2C1A0E]"
            style={{ fontFamily: '"Playfair Display", Georgia, serif' }}
          >
            Payment Settlement & Prep Speed
          </h3>
          <p className="text-[12px] text-[#8C705B] mt-0.5">
            Checkout preferences and kitchen order turnaround.
          </p>
        </div>

        {/* Payment Methods */}
        <div className="space-y-2.5">
          {paymentModes.map((m, idx) => {
            const Icon = m.icon
            return (
              <div
                key={idx}
                className="p-2.5 rounded-2xl bg-[#FDFBF7] border border-[#F2EAE0] flex items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <div className={`p-2 rounded-xl border ${m.accent}`}>
                    <Icon size={14} />
                  </div>
                  <div>
                    <span className="font-bold text-[#2C1A0E] block">{m.name}</span>
                    <span className="text-[10px] text-[#A08878]">{m.speed}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-extrabold text-[#2C1A0E] block">{m.share}</span>
                  <span className="text-[10px] text-stone-500 font-semibold">
                    {m.percentage}% share
                  </span>
                </div>
              </div>
            )
          })}
        </div>

        {/* Velocity Pill */}
        <div className="p-3 bg-linear-to-r from-amber-50 to-orange-50/50 border border-amber-200/80 rounded-2xl flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-amber-900 font-medium">
            <Zap size={15} className="text-amber-600 fill-amber-500" />
            <div>
              <span className="font-bold block text-[#2C1A0E]">Avg Prep Velocity: 6.2 mins</span>
              <span className="text-[10px] text-amber-800">45 seconds faster than weekly avg</span>
            </div>
          </div>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
            98% On Time
          </span>
        </div>
      </div>
    </div>
  )
}
