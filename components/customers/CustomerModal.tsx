'use client'

import React, { useState, useEffect } from 'react'
import { X, UserPlus, Sparkles, Coins, Phone, Mail, User } from 'lucide-react'
import { Customer, MembershipTier } from '@/store/useAdminStore'

interface CustomerModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: Omit<Customer, 'id' | 'memberSince'>) => void
}

export default function CustomerModal({
  isOpen,
  onClose,
  onSave,
}: CustomerModalProps) {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('+91 ')
  const [email, setEmail] = useState('')
  const [tier, setTier] = useState<MembershipTier>('bronze')
  const [loyaltyBeans, setLoyaltyBeans] = useState<number>(100)
  const [totalVisits, setTotalVisits] = useState<number>(1)
  const [lifetimeSpend, setLifetimeSpend] = useState<number>(350)
  const [favoriteItem, setFavoriteItem] = useState('Classic Cappuccino')
  const [dietaryPreference, setDietaryPreference] = useState('🌱 Vegetarian')
  const [notes, setNotes] = useState('')

  useEffect(() => {
    if (isOpen) {
      setName('')
      setPhone('+91 ')
      setEmail('')
      setTier('bronze')
      setLoyaltyBeans(100)
      setTotalVisits(1)
      setLifetimeSpend(350)
      setFavoriteItem('Classic Cappuccino')
      setDietaryPreference('🌱 Vegetarian')
      setNotes('')
    }
  }, [isOpen])

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !phone.trim()) return

    onSave({
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim() || undefined,
      tier,
      loyaltyBeans: Number(loyaltyBeans) || 0,
      totalVisits: Number(totalVisits) || 1,
      lifetimeSpend: Number(lifetimeSpend) || 0,
      avgOrderValue: Math.round((Number(lifetimeSpend) || 350) / (Number(totalVisits) || 1)),
      favoriteItem: favoriteItem.trim() || 'Classic Cappuccino',
      dietaryPreference: dietaryPreference.trim() || undefined,
      notes: notes.trim() || undefined,
      lastVisit: 'Today',
      status: 'active',
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl border border-[#EDE2D5] shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4.5 border-b border-[#EDE2D5] flex items-center justify-between bg-[#FDFBF7]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#FAF5EE] text-[#8C4A28] border border-[#EADBCC] flex items-center justify-center">
              <UserPlus size={18} />
            </div>
            <div>
              <h2
                className="text-[19px] font-bold text-[#2C1A0E]"
                style={{ fontFamily: '"Playfair Display", Georgia, serif' }}
              >
                Register New Diner
              </h2>
              <p className="text-[12px] text-[#A08878]">
                Enroll a café guest into Yemo membership and loyalty.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-[#A08878] hover:text-[#2C1A0E] hover:bg-[#FAF5EE] transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Name */}
            <div>
              <label className="block text-[12px] font-bold text-[#2C1A0E] mb-1">
                Full Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Maya Deshmukh"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-[#EDE2D5] text-[13px] text-[#2C1A0E] placeholder:text-[#C5B4A5] focus:outline-hidden focus:border-[#C87D55] focus:ring-1 focus:ring-[#C87D55]"
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-[12px] font-bold text-[#2C1A0E] mb-1">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-[#EDE2D5] text-[13px] text-[#2C1A0E] font-mono placeholder:text-[#C5B4A5] focus:outline-hidden focus:border-[#C87D55] focus:ring-1 focus:ring-[#C87D55]"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-[12px] font-bold text-[#2C1A0E] mb-1">
                Email Address <span className="text-stone-400 font-normal">(optional)</span>
              </label>
              <div className="relative">
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="guest@example.com"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-[#EDE2D5] text-[13px] text-[#2C1A0E] placeholder:text-[#C5B4A5] focus:outline-hidden focus:border-[#C87D55] focus:ring-1 focus:ring-[#C87D55]"
                />
              </div>
            </div>

            {/* Membership Tier */}
            <div>
              <label className="block text-[12px] font-bold text-[#2C1A0E] mb-1">
                Membership Tier
              </label>
              <select
                value={tier}
                onChange={(e) => setTier(e.target.value as MembershipTier)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#EDE2D5] text-[13px] text-[#2C1A0E] bg-white focus:outline-hidden focus:border-[#C87D55]"
              >
                <option value="bronze">Bronze (Welcome Tier)</option>
                <option value="silver">Silver (Regular Diner)</option>
                <option value="gold">Gold VIP (Top Patron)</option>
              </select>
            </div>

            {/* Welcome Loyalty Beans */}
            <div>
              <label className="block text-[12px] font-bold text-[#2C1A0E] mb-1">
                Welcome Loyalty Beans
              </label>
              <div className="relative">
                <Coins size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-amber-600" />
                <input
                  type="number"
                  min="0"
                  value={loyaltyBeans}
                  onChange={(e) => setLoyaltyBeans(Number(e.target.value))}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-[#EDE2D5] text-[13px] text-[#2C1A0E] font-bold focus:outline-hidden focus:border-[#C87D55]"
                />
              </div>
            </div>

            {/* Favorite Item */}
            <div>
              <label className="block text-[12px] font-bold text-[#2C1A0E] mb-1">
                Favorite Order Item
              </label>
              <input
                type="text"
                value={favoriteItem}
                onChange={(e) => setFavoriteItem(e.target.value)}
                placeholder="e.g. Cortado & Almond Croissant"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#EDE2D5] text-[13px] text-[#2C1A0E] placeholder:text-[#C5B4A5] focus:outline-hidden focus:border-[#C87D55]"
              />
            </div>
          </div>

          {/* Dietary Preference */}
          <div>
            <label className="block text-[12px] font-bold text-[#2C1A0E] mb-1">
              Dietary Preference / Allergy Warnings
            </label>
            <input
              type="text"
              value={dietaryPreference}
              onChange={(e) => setDietaryPreference(e.target.value)}
              placeholder="e.g. Nut Allergy, Lactose Intolerant, 100% Vegan"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#EDE2D5] text-[13px] text-[#2C1A0E] placeholder:text-[#C5B4A5] focus:outline-hidden focus:border-[#C87D55]"
            />
          </div>

          {/* Hospitality Notes */}
          <div>
            <label className="block text-[12px] font-bold text-[#2C1A0E] mb-1">
              Service & Hospitality Notes
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Prefers oat milk; likes booth seating near plants."
              className="w-full px-3.5 py-2 rounded-xl border border-[#EDE2D5] text-[13px] text-[#2C1A0E] placeholder:text-[#C5B4A5] focus:outline-hidden focus:border-[#C87D55]"
            />
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#EDE2D5]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-[13px] font-semibold text-[#8C705B] hover:text-[#2C1A0E] hover:bg-[#FAF5EE] transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl text-[13px] font-bold text-white bg-[#8C4A28] hover:bg-[#6E381C] shadow-xs transition-all"
            >
              Register Diner
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
