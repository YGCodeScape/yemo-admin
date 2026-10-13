'use client'

import React, { useState } from 'react'
import {
  Store,
  Phone,
  Mail,
  MapPin,
  Clock,
  Wifi,
  Save,
  CheckCircle2,
  FileText,
} from 'lucide-react'
import { useAdminStore } from '@/store/useAdminStore'

export default function CafeProfileSettings() {
  const showToast = useAdminStore((s) => s.showToast)

  const [form, setForm] = useState({
    name: 'Yemo Artisanal Café & Roastery',
    legalName: 'Yemo Hospitality Ventures Pvt Ltd',
    tagline: 'Brewed with Love · Good Food · Good Vibes',
    gstin: '27AABCY9820K1Z8',
    phone: '+91 98201 44321',
    email: 'contact@yemocafe.in',
    website: 'https://yemocafe.in',
    address: 'Shop 4 & 5, Silver Pearl, Waterfield Road, Bandra West, Mumbai - 400050',
    openTime: '08:00',
    closeTime: '22:30',
    wifiSsid: 'Yemo_Patrons_HighSpeed',
    wifiPass: 'brewandbytes2026',
    instagram: '@yemo.cafe',
  })

  const [isSaved, setIsSaved] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setIsSaved(false)
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaved(true)
    showToast('Café Profile and Operations updated successfully')
    setTimeout(() => setIsSaved(false), 3000)
  }

  return (
    <form onSubmit={handleSave} className="space-y-6">
      {/* ── Brand & Identity Card ── */}
      <div className="bg-white p-6 rounded-3xl border border-[#EDE2D5] shadow-2xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#F2EAE0]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#FAF5EE] text-[#8C4A28] border border-[#EADBCC] flex items-center justify-center">
              <Store size={18} />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#2C1A0E]">
                Café Brand & Legal Identity
              </h3>
              <p className="text-[12px] text-[#8C705B]">
                Public brand name, tax details, and official receipts header.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-[12px] font-bold text-[#2C1A0E] mb-1">
              Public Café Brand Name
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#EDE2D5] text-[13px] text-[#2C1A0E] focus:outline-hidden focus:border-[#C87D55]"
            />
          </div>

          <div>
            <label className="block text-[12px] font-bold text-[#2C1A0E] mb-1">
              Legal Registered Entity
            </label>
            <input
              type="text"
              name="legalName"
              value={form.legalName}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#EDE2D5] text-[13px] text-[#2C1A0E] focus:outline-hidden focus:border-[#C87D55]"
            />
          </div>

          <div>
            <label className="block text-[12px] font-bold text-[#2C1A0E] mb-1">
              Café Brand Tagline
            </label>
            <input
              type="text"
              name="tagline"
              value={form.tagline}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#EDE2D5] text-[13px] text-[#2C1A0E] focus:outline-hidden focus:border-[#C87D55]"
            />
          </div>

          <div>
            <label className="block text-[12px] font-bold text-[#2C1A0E] mb-1">
              GSTIN / Tax ID Number
            </label>
            <div className="relative">
              <FileText size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                name="gstin"
                value={form.gstin}
                onChange={handleChange}
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-[#EDE2D5] text-[13px] text-[#2C1A0E] font-mono focus:outline-hidden focus:border-[#C87D55]"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── Contact & Location ── */}
      <div className="bg-white p-6 rounded-3xl border border-[#EDE2D5] shadow-2xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#F2EAE0]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#FAF5EE] text-[#8C4A28] border border-[#EADBCC] flex items-center justify-center">
              <MapPin size={18} />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#2C1A0E]">
                Contact & Physical Location
              </h3>
              <p className="text-[12px] text-[#8C705B]">
                Storefront location displayed on diner bills and digital menus.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-[12px] font-bold text-[#2C1A0E] mb-1">
              Storefront Phone Number
            </label>
            <div className="relative">
              <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-[#EDE2D5] text-[13px] text-[#2C1A0E] font-mono focus:outline-hidden focus:border-[#C87D55]"
              />
            </div>
          </div>

          <div>
            <label className="block text-[12px] font-bold text-[#2C1A0E] mb-1">
              Customer Support Email
            </label>
            <div className="relative">
              <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-[#EDE2D5] text-[13px] text-[#2C1A0E] focus:outline-hidden focus:border-[#C87D55]"
              />
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="block text-[12px] font-bold text-[#2C1A0E] mb-1">
              Physical Street Address
            </label>
            <textarea
              rows={2}
              name="address"
              value={form.address}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#EDE2D5] text-[13px] text-[#2C1A0E] focus:outline-hidden focus:border-[#C87D55]"
            />
          </div>
        </div>
      </div>

      {/* ── Operational Hours & Guest Wi-Fi ── */}
      <div className="bg-white p-6 rounded-3xl border border-[#EDE2D5] shadow-2xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#F2EAE0]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#FAF5EE] text-[#8C4A28] border border-[#EADBCC] flex items-center justify-center">
              <Clock size={18} />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#2C1A0E]">
                Operating Hours & Guest Hospitality
              </h3>
              <p className="text-[12px] text-[#8C705B]">
                Daily opening hours and diner Wi-Fi credentials for QR landing page.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-[12px] font-bold text-[#2C1A0E] mb-1">
              Opening Time (Doors Open)
            </label>
            <input
              type="time"
              name="openTime"
              value={form.openTime}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#EDE2D5] text-[13px] text-[#2C1A0E] focus:outline-hidden focus:border-[#C87D55]"
            />
          </div>

          <div>
            <label className="block text-[12px] font-bold text-[#2C1A0E] mb-1">
              Closing Time (Last Call)
            </label>
            <input
              type="time"
              name="closeTime"
              value={form.closeTime}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#EDE2D5] text-[13px] text-[#2C1A0E] focus:outline-hidden focus:border-[#C87D55]"
            />
          </div>

          <div>
            <label className="block text-[12px] font-bold text-[#2C1A0E] mb-1">
              Diner Guest Wi-Fi Network (SSID)
            </label>
            <div className="relative">
              <Wifi size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                name="wifiSsid"
                value={form.wifiSsid}
                onChange={handleChange}
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-[#EDE2D5] text-[13px] text-[#2C1A0E] focus:outline-hidden focus:border-[#C87D55]"
              />
            </div>
          </div>

          <div>
            <label className="block text-[12px] font-bold text-[#2C1A0E] mb-1">
              Wi-Fi Security Password
            </label>
            <input
              type="text"
              name="wifiPass"
              value={form.wifiPass}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#EDE2D5] text-[13px] text-[#2C1A0E] font-mono focus:outline-hidden focus:border-[#C87D55]"
            />
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
          <span>{isSaved ? 'Changes Saved' : 'Save Café Profile'}</span>
        </button>
      </div>
    </form>
  )
}
