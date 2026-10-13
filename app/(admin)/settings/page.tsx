'use client'

import React, { useState } from 'react'
import {
  Store,
  UtensilsCrossed,
  Coins,
  Users,
  Printer,
  Sliders,
} from 'lucide-react'
import CafeProfileSettings from '@/components/settings/CafeProfileSettings'
import KitchenOrderSettings from '@/components/settings/KitchenOrderSettings'
import LoyaltyBeansSettings from '@/components/settings/LoyaltyBeansSettings'
import StaffManagementSettings from '@/components/settings/StaffManagementSettings'
import HardwareSystemSettings from '@/components/settings/HardwareSystemSettings'

type SettingsTab = 'profile' | 'orders' | 'loyalty' | 'staff' | 'hardware'

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile')

  const tabs: { id: SettingsTab; label: string; icon: React.ElementType; description: string }[] = [
    {
      id: 'profile',
      label: 'Café Profile',
      icon: Store,
      description: 'Brand identity, store address, hours & diner Wi-Fi',
    },
    {
      id: 'orders',
      label: 'Orders & Kitchen',
      icon: UtensilsCrossed,
      description: 'Table QR ordering, prep buffers, chime & GST taxes',
    },
    {
      id: 'loyalty',
      label: 'Loyalty & Beans',
      icon: Coins,
      description: 'Bean exchange rate, welcome bonuses & VIP tier rules',
    },
    {
      id: 'staff',
      label: 'Staff & Roles',
      icon: Users,
      description: 'Team permissions, shifts, and POS terminal PINs',
    },
    {
      id: 'hardware',
      label: 'Printers & Hardware',
      icon: Printer,
      description: 'Kitchen thermal printers, auto-KOT & cloud backup',
    },
  ]

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto pb-20">
      {/* ── Page Header ── */}
      <div className="bg-white p-5 md:p-6 rounded-3xl border border-[#EDE2D5] shadow-2xs">
        <div className="flex items-center gap-2.5">
          <span className="px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-[#FAF5EE] text-[#8C4A28] border border-[#EADBCC] flex items-center gap-1.5">
            <Sliders size={12} className="text-[#C87D55]" />
            <span>Café Administration</span>
          </span>
        </div>
        <h1
          className="text-2xl md:text-3xl font-bold text-[#2C1A0E] tracking-tight mt-1.5"
          style={{ fontFamily: '"Playfair Display", Georgia, serif' }}
        >
          Café Settings & Store Preferences
        </h1>
        <p className="text-[13px] text-[#8C705B] mt-1 max-w-2xl">
          Configure storefront branding, kitchen workflow, customer loyalty rules, staff PIN codes, and thermal printers.
        </p>
      </div>

      {/* ── Tab Selector Navigation Bar ── */}
      <div className="flex items-center gap-2 p-1.5 bg-white rounded-2xl border border-[#EDE2D5] shadow-2xs overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-[#8C4A28] text-white shadow-xs'
                  : 'text-[#8C705B] hover:text-[#2C1A0E] hover:bg-[#FAF5EE]'
              }`}
            >
              <Icon size={15} className={isActive ? 'text-amber-300' : 'text-[#A08878]'} />
              <span>{tab.label}</span>
            </button>
          )
        })}
      </div>

      {/* ── Tab Content Rendering ── */}
      <div>
        {activeTab === 'profile' && <CafeProfileSettings />}
        {activeTab === 'orders' && <KitchenOrderSettings />}
        {activeTab === 'loyalty' && <LoyaltyBeansSettings />}
        {activeTab === 'staff' && <StaffManagementSettings />}
        {activeTab === 'hardware' && <HardwareSystemSettings />}
      </div>

      {/* ── Subtle Café Footer ── */}
      <div className="pt-8 border-t border-[#EDE2D5] text-center text-[12px] text-[#A08878] space-y-1">
        <p>© 2026 Yemo Café Operations Engine · Bandra Flagship Store</p>
        <p className="font-semibold text-[#8C7362] tracking-wider uppercase text-[10px]">
          Seamless Hospitality · Handcrafted Coffee
        </p>
      </div>
    </div>
  )
}
