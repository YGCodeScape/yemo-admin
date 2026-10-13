'use client'

import React from 'react'
import { Coins, Repeat, Award } from 'lucide-react'
import { TimeRange } from './AnalyticsHeader'

export default function CustomerRetentionCard({ timeRange }: { timeRange: TimeRange }) {
  return (
    <div className="bg-white p-5 md:p-6 rounded-3xl border border-[#EDE2D5] shadow-2xs space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h3
              className="text-lg md:text-xl font-bold text-[#2C1A0E]"
              style={{ fontFamily: '"Playfair Display", Georgia, serif' }}
            >
              Customer Loyalty & Retention Health
            </h3>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#FAF5EE] text-[#8C4A28] border border-[#EDE2D5]">
              LTV Metrics
            </span>
          </div>
          <p className="text-[12px] text-[#8C705B] mt-0.5">
            {timeRange === 'today' ? 'Daily' : timeRange === '90d' ? 'Quarterly' : 'Period'} repeat patron return velocity, membership tier impact, and beans economy.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Metric 1: Retention Ratio */}
        <div className="p-4 rounded-2xl bg-[#FDFBF7] border border-[#F2EAE0] space-y-2">
          <div className="flex items-center justify-between text-[#8C705B] text-xs">
            <span className="font-bold">Patron Retention</span>
            <Repeat size={15} className="text-[#C87D55]" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-[#2C1A0E]">42%</span>
            <span className="text-xs text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded-md border border-emerald-200">
              +4.8% vs last mo
            </span>
          </div>
          <p className="text-[11px] text-[#A08878]">
            42% of orders are from repeat guests. Average return frequency is <strong>4.8 days</strong>.
          </p>
        </div>

        {/* Metric 2: Loyalty Beans Circulation */}
        <div className="p-4 rounded-2xl bg-[#FDFBF7] border border-[#F2EAE0] space-y-2">
          <div className="flex items-center justify-between text-[#8C705B] text-xs">
            <span className="font-bold">Beans Redemption</span>
            <Coins size={15} className="text-amber-500 fill-amber-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-[#2C1A0E]">69.2%</span>
            <span className="text-xs text-[#8C4A28] font-semibold bg-[#FAF5EE] px-1.5 py-0.5 rounded-md border border-[#EDE2D5]">
              High Engagement
            </span>
          </div>
          <p className="text-[11px] text-[#A08878]">
            <strong>10,240</strong> of 14,800 issued beans redeemed for rewards, proving high program loyalty.
          </p>
        </div>

        {/* Metric 3: VIP Tier Revenue Impact */}
        <div className="p-4 rounded-2xl bg-[#FDFBF7] border border-[#F2EAE0] space-y-2">
          <div className="flex items-center justify-between text-[#8C705B] text-xs">
            <span className="font-bold">Gold VIP Contribution</span>
            <Award size={15} className="text-amber-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-[#2C1A0E]">48%</span>
            <span className="text-xs text-stone-600 font-semibold bg-stone-100 px-1.5 py-0.5 rounded-md">
              Top 20% Diners
            </span>
          </div>
          <p className="text-[11px] text-[#A08878]">
            Gold VIP members generate nearly half of total café sales with an average check of <strong>₹420</strong>.
          </p>
        </div>
      </div>
    </div>
  )
}
