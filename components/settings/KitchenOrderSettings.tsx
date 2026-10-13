'use client'

import React, { useState } from 'react'
import {
  QrCode,
  Volume2,
  Clock,
  Percent,
  Save,
  CheckCircle2,
} from 'lucide-react'
import { useAdminStore } from '@/store/useAdminStore'

export default function KitchenOrderSettings() {
  const showToast = useAdminStore((s) => s.showToast)

  const [settings, setSettings] = useState({
    qrOrderingEnabled: true,
    requireGuestName: true,
    autoAcceptOrders: true,
    audioChimeEnabled: true,
    prepBufferMinutes: 15,
    surgeBufferMinutes: 5,
    gstRate: 5,
    enableServiceCharge: false,
    serviceChargeRate: 5,
    roundOffFinalBill: true,
  })

  const [isSaved, setIsSaved] = useState(false)

  const handleToggle = (key: keyof typeof settings) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }))
    setIsSaved(false)
  }

  const handleNumberChange = (key: keyof typeof settings, val: number) => {
    setSettings((prev) => ({ ...prev, [key]: val }))
    setIsSaved(false)
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaved(true)
    showToast('Kitchen, Ordering & Tax rules updated successfully')
    setTimeout(() => setIsSaved(false), 3000)
  }

  return (
    <form onSubmit={handleSave} className="space-y-6">
      {/* ── Table QR Digital Ordering Rules ── */}
      <div className="bg-white p-6 rounded-3xl border border-[#EDE2D5] shadow-2xs space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-[#F2EAE0]">
          <div className="w-9 h-9 rounded-xl bg-[#FAF5EE] text-[#8C4A28] border border-[#EADBCC] flex items-center justify-center">
            <QrCode size={18} />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#2C1A0E]">
              Table QR & Contactless Dining
            </h3>
            <p className="text-[12px] text-[#8C705B]">
              Control whether guests can order directly from table QR codes.
            </p>
          </div>
        </div>

        <div className="space-y-3.5 divide-y divide-[#F2EAE0]">
          {/* Toggle 1: QR Ordering */}
          <div className="flex items-center justify-between pt-2">
            <div>
              <div className="text-[13px] font-bold text-[#2C1A0E]">
                Enable Direct Table QR Ordering
              </div>
              <p className="text-[11px] text-[#A08878]">
                Allows diners to scan the acrylic QR stand on their table and order food directly.
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleToggle('qrOrderingEnabled')}
              className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                settings.qrOrderingEnabled ? 'bg-[#8C4A28]' : 'bg-stone-300'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  settings.qrOrderingEnabled ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Toggle 2: Require Guest Name */}
          <div className="flex items-center justify-between pt-3.5">
            <div>
              <div className="text-[13px] font-bold text-[#2C1A0E]">
                Require Guest Name on QR Cart
              </div>
              <p className="text-[11px] text-[#A08878]">
                Asks diner for their name for personalized table delivery and loyalty bean matching.
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleToggle('requireGuestName')}
              className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                settings.requireGuestName ? 'bg-[#8C4A28]' : 'bg-stone-300'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  settings.requireGuestName ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Toggle 3: Auto-Accept to Kitchen */}
          <div className="flex items-center justify-between pt-3.5">
            <div>
              <div className="text-[13px] font-bold text-[#2C1A0E]">
                Auto-Route Orders to Kitchen Display
              </div>
              <p className="text-[11px] text-[#A08878]">
                Instantly places confirmed table orders into the barista queue without manual staff approval.
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleToggle('autoAcceptOrders')}
              className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                settings.autoAcceptOrders ? 'bg-[#8C4A28]' : 'bg-stone-300'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  settings.autoAcceptOrders ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* ── Kitchen Prep Time & Sound Notifications ── */}
      <div className="bg-white p-6 rounded-3xl border border-[#EDE2D5] shadow-2xs space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-[#F2EAE0]">
          <div className="w-9 h-9 rounded-xl bg-[#FAF5EE] text-[#8C4A28] border border-[#EADBCC] flex items-center justify-center">
            <Clock size={18} />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#2C1A0E]">
              Kitchen Prep Timings & Floor Audio Alerts
            </h3>
            <p className="text-[12px] text-[#8C705B]">
              Standard order turnaround buffer and kitchen notification bells.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-[12px] font-bold text-[#2C1A0E] mb-1">
              Standard Prep Buffer Time (Minutes)
            </label>
            <input
              type="number"
              min="5"
              max="60"
              value={settings.prepBufferMinutes}
              onChange={(e) => handleNumberChange('prepBufferMinutes', Number(e.target.value))}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#EDE2D5] text-[13px] text-[#2C1A0E] font-bold focus:outline-hidden focus:border-[#C87D55]"
            />
            <span className="text-[11px] text-[#A08878] mt-1 block">
              Estimated waiting time shown to guests upon order confirmation.
            </span>
          </div>

          <div>
            <label className="block text-[12px] font-bold text-[#2C1A0E] mb-1">
              Peak Hours Surge Buffer (+ Minutes)
            </label>
            <input
              type="number"
              min="0"
              max="30"
              value={settings.surgeBufferMinutes}
              onChange={(e) => handleNumberChange('surgeBufferMinutes', Number(e.target.value))}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#EDE2D5] text-[13px] text-[#2C1A0E] font-bold focus:outline-hidden focus:border-[#C87D55]"
            />
            <span className="text-[11px] text-[#A08878] mt-1 block">
              Automatically added during peak floor rush (4:00 PM - 7:00 PM).
            </span>
          </div>

          <div className="md:col-span-2 pt-2 border-t border-[#F2EAE0] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Volume2 size={16} className="text-[#C87D55]" />
              <div>
                <span className="text-[13px] font-bold text-[#2C1A0E] block">
                  Kitchen Speaker Audio Chime
                </span>
                <span className="text-[11px] text-[#A08878]">
                  Plays a distinct pleasant coffeehouse chime on POS tablet when a new order arrives.
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => handleToggle('audioChimeEnabled')}
              className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                settings.audioChimeEnabled ? 'bg-[#8C4A28]' : 'bg-stone-300'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  settings.audioChimeEnabled ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* ── Tax & Service Charge Configuration ── */}
      <div className="bg-white p-6 rounded-3xl border border-[#EDE2D5] shadow-2xs space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-[#F2EAE0]">
          <div className="w-9 h-9 rounded-xl bg-[#FAF5EE] text-[#8C4A28] border border-[#EADBCC] flex items-center justify-center">
            <Percent size={18} />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#2C1A0E]">
              GST Tax & Service Charge Rules
            </h3>
            <p className="text-[12px] text-[#8C705B]">
              Configure Goods and Services Tax compliance and optional service charge.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-[12px] font-bold text-[#2C1A0E] mb-1">
              Food & Beverage GST Rate (%)
            </label>
            <input
              type="number"
              min="0"
              max="28"
              value={settings.gstRate}
              onChange={(e) => handleNumberChange('gstRate', Number(e.target.value))}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#EDE2D5] text-[13px] text-[#2C1A0E] font-bold focus:outline-hidden focus:border-[#C87D55]"
            />
            <span className="text-[11px] text-[#A08878] mt-1 block">
              Standard Indian Restaurant GST: 5% (2.5% CGST + 2.5% SGST).
            </span>
          </div>

          <div>
            <label className="block text-[12px] font-bold text-[#2C1A0E] mb-1">
              Optional Service Charge Rate (%)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                disabled={!settings.enableServiceCharge}
                min="0"
                max="15"
                value={settings.serviceChargeRate}
                onChange={(e) => handleNumberChange('serviceChargeRate', Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#EDE2D5] text-[13px] text-[#2C1A0E] font-bold disabled:bg-stone-100 disabled:text-stone-400 focus:outline-hidden focus:border-[#C87D55]"
              />
              <button
                type="button"
                onClick={() => handleToggle('enableServiceCharge')}
                className={`px-3 py-2.5 rounded-xl text-[12px] font-bold whitespace-nowrap transition-colors ${
                  settings.enableServiceCharge
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : 'bg-stone-100 text-stone-600 border border-stone-200'
                }`}
              >
                {settings.enableServiceCharge ? 'Active' : 'Disabled'}
              </button>
            </div>
            <span className="text-[11px] text-[#A08878] mt-1 block">
              Voluntary hospitality service charge distributed to staff pool.
            </span>
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
          <span>{isSaved ? 'Rules Saved' : 'Save Kitchen & Ordering Rules'}</span>
        </button>
      </div>
    </form>
  )
}
