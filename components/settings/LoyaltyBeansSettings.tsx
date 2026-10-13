'use client'

import React, { useState } from 'react'
import {
  Coins,
  Sparkles,
  Award,
  Gift,
  Calendar,
  Save,
  CheckCircle2,
  TrendingUp,
  Percent,
} from 'lucide-react'
import { useAdminStore } from '@/store/useAdminStore'

export default function LoyaltyBeansSettings() {
  const showToast = useAdminStore((s) => s.showToast)

  const [rules, setRules] = useState({
    spendPerBean: 20, // ₹20 = 1 Bean
    beanRupeeValue: 1.0, // 1 Bean = ₹1 discount
    welcomeBonus: 100, // 100 beans on enrollment
    minRedeemThreshold: 50, // Min 50 beans to redeem
    expirationDays: 365,
    silverThreshold: 300,
    goldThreshold: 600,
  })

  const [isSaved, setIsSaved] = useState(false)

  const handleChange = (key: keyof typeof rules, val: number) => {
    setRules((prev) => ({ ...prev, [key]: val }))
    setIsSaved(false)
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaved(true)
    showToast('Loyalty Beans & Tier thresholds updated successfully')
    setTimeout(() => setIsSaved(false), 3000)
  }

  // Live calculator demo
  const sampleBill = 400
  const beansEarned = Math.floor(sampleBill / rules.spendPerBean)
  const discountValue = beansEarned * rules.beanRupeeValue

  return (
    <form onSubmit={handleSave} className="space-y-6">
      {/* ── Bean Earning & Redemption Economy ── */}
      <div className="bg-white p-6 rounded-3xl border border-[#EDE2D5] shadow-2xs space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-[#F2EAE0]">
          <div className="w-9 h-9 rounded-xl bg-[#FAF5EE] text-[#8C4A28] border border-[#EADBCC] flex items-center justify-center">
            <Coins size={18} className="text-amber-600" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#2C1A0E]">
              Loyalty Bean Currency & Valuation
            </h3>
            <p className="text-[12px] text-[#8C705B]">
              Define earning ratio and monetary exchange value of Yemo Beans.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-[12px] font-bold text-[#2C1A0E] mb-1">
              Spend Needed to Earn 1 Bean (₹)
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-stone-400">
                ₹
              </span>
              <input
                type="number"
                min="5"
                max="100"
                value={rules.spendPerBean}
                onChange={(e) => handleChange('spendPerBean', Number(e.target.value))}
                className="w-full pl-8 pr-3.5 py-2.5 rounded-xl border border-[#EDE2D5] text-[13px] text-[#2C1A0E] font-bold focus:outline-hidden focus:border-[#C87D55]"
              />
            </div>
            <span className="text-[11px] text-[#A08878] mt-1 block">
              Diner earns 1 Bean for every ₹{rules.spendPerBean} spent on food & drinks.
            </span>
          </div>

          <div>
            <label className="block text-[12px] font-bold text-[#2C1A0E] mb-1">
              Redemption Value per 1 Bean (₹)
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-stone-400">
                ₹
              </span>
              <input
                type="number"
                step="0.1"
                min="0.1"
                max="5"
                value={rules.beanRupeeValue}
                onChange={(e) => handleChange('beanRupeeValue', Number(e.target.value))}
                className="w-full pl-8 pr-3.5 py-2.5 rounded-xl border border-[#EDE2D5] text-[13px] text-[#2C1A0E] font-bold focus:outline-hidden focus:border-[#C87D55]"
              />
            </div>
            <span className="text-[11px] text-[#A08878] mt-1 block">
              Every 1 Bean gives ₹{rules.beanRupeeValue} discount off the diner's bill.
            </span>
          </div>

          <div>
            <label className="block text-[12px] font-bold text-[#2C1A0E] mb-1">
              Welcome Bonus Beans for New Diners
            </label>
            <input
              type="number"
              min="0"
              max="500"
              value={rules.welcomeBonus}
              onChange={(e) => handleChange('welcomeBonus', Number(e.target.value))}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#EDE2D5] text-[13px] text-[#2C1A0E] font-bold focus:outline-hidden focus:border-[#C87D55]"
            />
            <span className="text-[11px] text-[#A08878] mt-1 block">
              Awarded instantly on first enrollment to incentivize return visits.
            </span>
          </div>

          <div>
            <label className="block text-[12px] font-bold text-[#2C1A0E] mb-1">
              Minimum Beans Threshold to Redeem
            </label>
            <input
              type="number"
              min="10"
              max="200"
              value={rules.minRedeemThreshold}
              onChange={(e) => handleChange('minRedeemThreshold', Number(e.target.value))}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#EDE2D5] text-[13px] text-[#2C1A0E] font-bold focus:outline-hidden focus:border-[#C87D55]"
            />
            <span className="text-[11px] text-[#A08878] mt-1 block">
              Prevents small micro-redemptions; promotes balance accumulation.
            </span>
          </div>
        </div>

        {/* Live Reward Simulator Preview */}
        <div className="p-4 rounded-2xl bg-[#FAF5EE] border border-[#EADBCC] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5 text-[#8C4A28]">
            <Sparkles size={16} className="text-[#C87D55]" />
            <div>
              <span className="font-bold block text-[#2C1A0E]">Live Earning Simulator</span>
              <span>
                A sample order of <strong className="text-[#2C1A0E]">₹{sampleBill}</strong> earns{' '}
                <strong className="text-[#2C1A0E]">{beansEarned} Beans</strong> (worth ₹{discountValue} discount).
              </span>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-amber-100 text-amber-900 border border-amber-300">
            {((discountValue / sampleBill) * 100).toFixed(1)}% Cashback Return
          </span>
        </div>
      </div>

      {/* ── Membership Tier Qualification Thresholds ── */}
      <div className="bg-white p-6 rounded-3xl border border-[#EDE2D5] shadow-2xs space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-[#F2EAE0]">
          <div className="w-9 h-9 rounded-xl bg-[#FAF5EE] text-[#8C4A28] border border-[#EADBCC] flex items-center justify-center">
            <Award size={18} />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#2C1A0E]">
              Membership Tier Qualifications & VIP Perks
            </h3>
            <p className="text-[12px] text-[#8C705B]">
              Define lifetime bean milestones required for tier upgrades.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Bronze Tier Card */}
          <div className="p-4 rounded-2xl bg-[#FDFBF7] border border-[#EDE2D5] space-y-2">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                Bronze Tier
              </span>
              <span className="text-xs font-bold text-stone-500">Entry</span>
            </div>
            <div className="text-lg font-extrabold text-[#2C1A0E] pt-1">
              0 - {rules.silverThreshold - 1} Beans
            </div>
            <p className="text-[11px] text-[#A08878] leading-relaxed">
              Base earning rate, standard table service, digital loyalty pass.
            </p>
          </div>

          {/* Silver Tier Card */}
          <div className="p-4 rounded-2xl bg-[#FDFBF7] border border-[#EDE2D5] space-y-2">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-slate-800 border border-slate-300">
                Silver Tier
              </span>
              <input
                type="number"
                min="100"
                max="500"
                value={rules.silverThreshold}
                onChange={(e) => handleChange('silverThreshold', Number(e.target.value))}
                className="w-20 px-2 py-0.5 rounded-lg border border-stone-300 text-xs font-bold text-right"
              />
            </div>
            <div className="text-lg font-extrabold text-[#2C1A0E] pt-1">
              {rules.silverThreshold}+ Lifetime Beans
            </div>
            <p className="text-[11px] text-[#A08878] leading-relaxed">
              +5% bonus beans on all orders, complimentary birthday beverage.
            </p>
          </div>

          {/* Gold VIP Card */}
          <div className="p-4 rounded-2xl bg-[#FDFBF7] border border-amber-200 space-y-2 bg-linear-to-b from-amber-50/50 to-transparent">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-300 shadow-2xs">
                Gold VIP Tier
              </span>
              <input
                type="number"
                min="400"
                max="1000"
                value={rules.goldThreshold}
                onChange={(e) => handleChange('goldThreshold', Number(e.target.value))}
                className="w-20 px-2 py-0.5 rounded-lg border border-amber-300 text-xs font-bold text-right"
              />
            </div>
            <div className="text-lg font-extrabold text-[#2C1A0E] pt-1">
              {rules.goldThreshold}+ Lifetime Beans
            </div>
            <p className="text-[11px] text-[#A08878] leading-relaxed">
              +10% bonus beans, priority booth seating, invitation to coffee cupping workshops.
            </p>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <button
          type="submit"
          className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#8C4A28] hover:bg-[#6E381C] text-white text-[13px] font-bold shadow-xs transition-all active:scale-95"
        >
          {isSaved ? <CheckCircle2 size={16} /> : <Save size={16} />}
          <span>{isSaved ? 'Rules Saved' : 'Save Loyalty Rules'}</span>
        </button>
      </div>
    </form>
  )
}
