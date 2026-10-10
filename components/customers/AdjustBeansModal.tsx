'use client'

import React, { useState } from 'react'
import { X, Coins, Plus, Minus, ArrowRight, Sparkles } from 'lucide-react'
import { Customer } from '@/store/useAdminStore'

interface AdjustBeansModalProps {
  isOpen: boolean
  customer: Customer | null
  onClose: () => void
  onConfirm: (id: string, delta: number, reason: string) => void
}

export default function AdjustBeansModal({
  isOpen,
  customer,
  onClose,
  onConfirm,
}: AdjustBeansModalProps) {
  const [delta, setDelta] = useState<number>(100)
  const [reason, setReason] = useState<string>('Birthday Celebration Gift')

  if (!isOpen || !customer) return null

  const handleQuickDelta = (amount: number) => {
    setDelta(amount)
    if (amount < 0 && reason === 'Birthday Celebration Gift') {
      setReason('Points Redemption Correction')
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onConfirm(customer.id, delta, reason)
    onClose()
  }

  const newBalance = Math.max(0, customer.loyaltyBeans + delta)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="w-full max-w-md bg-white rounded-3xl border border-[#EDE2D5] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4.5 border-b border-[#EDE2D5] flex items-center justify-between bg-[#FDFBF7]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center">
              <Coins size={18} />
            </div>
            <div>
              <h3
                className="text-[18px] font-bold text-[#2C1A0E] leading-tight"
                style={{ fontFamily: '"Playfair Display", Georgia, serif' }}
              >
                Adjust Loyalty Beans
              </h3>
              <p className="text-[12px] text-[#A08878]">{customer.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#A08878] hover:text-[#2C1A0E] hover:bg-black/5 rounded-full transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Current balance card */}
          <div className="p-4 bg-[#FAF5EE] border border-[#EDE2D5] rounded-2xl flex items-center justify-between">
            <div>
              <span className="text-[11px] text-[#A08878] uppercase font-bold block">
                Current Beans Balance
              </span>
              <span className="text-[22px] font-bold text-[#8C4A28]">
                {customer.loyaltyBeans} Beans
              </span>
            </div>
            <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-200 uppercase">
              {customer.tier} Tier
            </span>
          </div>

          {/* Quick Delta Buttons */}
          <div>
            <label className="block text-[11px] font-bold text-[#A08878] uppercase tracking-wider mb-2">
              Quick Adjustment
            </label>
            <div className="grid grid-cols-6 gap-2">
              {[-100, -50, 50, 100, 200, 500].map((amount) => (
                <button
                  key={amount}
                  type="button"
                  onClick={() => handleQuickDelta(amount)}
                  className={`py-2 rounded-xl text-[12px] font-bold transition-all border ${
                    delta === amount
                      ? 'bg-[#2C1A0E] text-white border-[#2C1A0E] shadow-2xs'
                      : amount < 0
                      ? 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100'
                      : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                  }`}
                >
                  {amount > 0 ? `+${amount}` : amount}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Delta Input */}
          <div>
            <label className="block text-[12px] font-bold text-[#2C1A0E] mb-1.5">
              Beans to Credit / Deduct *
            </label>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setDelta((prev) => prev - 50)}
                className="w-11 h-11 rounded-2xl border border-[#EDE2D5] bg-[#FAF5EE] text-[#2C1A0E] flex items-center justify-center font-bold hover:bg-[#F2E7D8]"
              >
                <Minus size={18} />
              </button>
              <input
                type="number"
                required
                value={delta}
                onChange={(e) => setDelta(parseInt(e.target.value) || 0)}
                className="flex-1 px-4 py-2.5 bg-white border border-[#EBDCCF] rounded-2xl text-[18px] font-bold text-[#8C4A28] text-center focus:outline-none focus:ring-2 focus:ring-[#C87D55]/30 focus:border-[#C87D55]"
              />
              <button
                type="button"
                onClick={() => setDelta((prev) => prev + 50)}
                className="w-11 h-11 rounded-2xl border border-[#EDE2D5] bg-[#FAF5EE] text-[#2C1A0E] flex items-center justify-center font-bold hover:bg-[#F2E7D8]"
              >
                <Plus size={18} />
              </button>
            </div>
          </div>

          {/* Reason Selection */}
          <div>
            <label className="block text-[12px] font-bold text-[#2C1A0E] mb-1.5">
              Adjustment Reason *
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-[#EBDCCF] rounded-xl text-[13px] text-[#2C1A0E] focus:outline-none focus:ring-2 focus:ring-[#C87D55]/30"
            >
              <option value="Birthday Celebration Gift">🎂 Birthday Celebration Gift</option>
              <option value="Service Recovery Apology">🙏 Service Recovery Courtesy / Apology</option>
              <option value="Special Campaign Bonus">✨ Special Promotion / Weekend Bonus</option>
              <option value="Points Redemption Correction">📋 Points Redemption Correction</option>
              <option value="Manual Admin Credit">⚙️ Manual Admin Loyalty Adjustment</option>
            </select>
          </div>

          {/* Balance Preview */}
          <div className="p-3.5 bg-[#FAF7F4] border border-[#EDE2D5] rounded-2xl flex items-center justify-between text-[12px]">
            <div className="flex items-center gap-2">
              <span className="text-[#8C705B]">
                {customer.loyaltyBeans} Beans
              </span>
              <ArrowRight size={14} className="text-[#A08878]" />
              <span className="font-bold text-[#8C4A28] text-[14px]">
                {newBalance} Beans
              </span>
            </div>

            <span
              className={`font-bold px-2.5 py-0.5 rounded-full text-[11px] ${
                delta >= 0
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-red-100 text-red-800'
              }`}
            >
              {delta >= 0 ? `+${delta}` : delta} Beans
            </span>
          </div>

          {/* Footer Actions */}
          <div className="pt-2 border-t border-[#EDE2D5] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-full border border-[#EDE2D5] text-[13px] font-bold text-[#7A614E] hover:bg-[#FAF5EE] transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-full bg-[#2C1A0E] text-white text-[13px] font-bold hover:bg-[#1E110A] transition-all active:scale-95 shadow-sm"
            >
              Save Points
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
