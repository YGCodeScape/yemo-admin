'use client'

import React, { useState } from 'react'
import {
  Printer,
  Database,
  RefreshCw,
  Save,
  CheckCircle2,
} from 'lucide-react'
import { useAdminStore } from '@/store/useAdminStore'

export default function HardwareSystemSettings() {
  const showToast = useAdminStore((s) => s.showToast)

  const [hardware, setHardware] = useState({
    printerName: 'Epson TM-T82III (80mm ESC/POS)',
    autoPrintKOT: true,
    autoPrintReceipt: false,
    lowStockEmailAlerts: true,
    dailyBackupEnabled: true,
  })

  const [isSaved, setIsSaved] = useState(false)
  const [isTestPrinting, setIsTestPrinting] = useState(false)

  const handleToggle = (key: keyof typeof hardware) => {
    setHardware((prev) => ({ ...prev, [key]: !prev[key] }))
    setIsSaved(false)
  }

  const handleTestPrint = () => {
    setIsTestPrinting(true)
    setTimeout(() => {
      setIsTestPrinting(false)
      showToast('Test Kitchen Order Ticket sent to thermal printer!')
    }, 1200)
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaved(true)
    showToast('Hardware & System configurations saved')
    setTimeout(() => setIsSaved(false), 3000)
  }

  return (
    <form onSubmit={handleSave} className="space-y-6">
      {/* ── Thermal Printer & Hardware ── */}
      <div className="bg-white p-6 rounded-3xl border border-[#EDE2D5] shadow-2xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#F2EAE0]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#FAF5EE] text-[#8C4A28] border border-[#EADBCC] flex items-center justify-center">
              <Printer size={18} />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#2C1A0E]">
                Kitchen Thermal POS Printers
              </h3>
              <p className="text-[12px] text-[#8C705B]">
                ESC/POS network printing for baristas and kitchen prep tickets.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Printer Online</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-[12px] font-bold text-[#2C1A0E] mb-1">
              Active Barista Counter Printer
            </label>
            <input
              type="text"
              value={hardware.printerName}
              readOnly
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#EDE2D5] text-[13px] text-[#2C1A0E] bg-stone-50 font-mono"
            />
          </div>

          <div className="flex items-end">
            <button
              type="button"
              onClick={handleTestPrint}
              disabled={isTestPrinting}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-[#FAF5EE] hover:bg-[#F2E7D8] text-[#8C4A28] border border-[#EADBCC] transition-all flex items-center justify-center gap-2"
            >
              <RefreshCw size={14} className={isTestPrinting ? 'animate-spin' : ''} />
              <span>{isTestPrinting ? 'Sending Ticket...' : 'Send Test Print Slip'}</span>
            </button>
          </div>

          <div className="md:col-span-2 space-y-3.5 pt-2 border-t border-[#F2EAE0]">
            {/* Auto Print KOT */}
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[13px] font-bold text-[#2C1A0E] block">
                  Auto-Print KOT (Kitchen Order Ticket)
                </span>
                <span className="text-[11px] text-[#A08878]">
                  Immediately prints ticket at the barista station when a customer places an order.
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleToggle('autoPrintKOT')}
                className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                  hardware.autoPrintKOT ? 'bg-[#8C4A28]' : 'bg-stone-300'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    hardware.autoPrintKOT ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Auto Print Receipt */}
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[13px] font-bold text-[#2C1A0E] block">
                  Auto-Print Tax Invoice upon Settlement
                </span>
                <span className="text-[11px] text-[#A08878]">
                  Prints paper tax receipt automatically when order payment is marked completed.
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleToggle('autoPrintReceipt')}
                className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                  hardware.autoPrintReceipt ? 'bg-[#8C4A28]' : 'bg-stone-300'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    hardware.autoPrintReceipt ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── System Health & Database Backup ── */}
      <div className="bg-white p-6 rounded-3xl border border-[#EDE2D5] shadow-2xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#F2EAE0]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#FAF5EE] text-[#8C4A28] border border-[#EADBCC] flex items-center justify-center">
              <Database size={18} />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#2C1A0E]">
                Cloud Database & Offline State
              </h3>
              <p className="text-[12px] text-[#8C705B]">
                Supabase real-time floor synchronization and nightly backup snapshots.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-[#FDFBF7] border border-[#EDE2D5] space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#A08878] block">
              Cloud Database Node
            </span>
            <div className="text-sm font-extrabold text-[#2C1A0E] flex items-center gap-2">
              <span>ap-south-1 (Mumbai Region)</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
            </div>
            <p className="text-[11px] text-[#A08878] pt-1">
              Real-time floor status latency: <strong>24ms</strong>.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#FDFBF7] border border-[#EDE2D5] space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#A08878] block">
              Automated Snapshots
            </span>
            <div className="text-sm font-extrabold text-[#2C1A0E]">
              Daily at 03:00 AM IST
            </div>
            <p className="text-[11px] text-[#A08878] pt-1">
              Encrypted backup stored across geo-redundant storage.
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
          <span>{isSaved ? 'Settings Saved' : 'Save Hardware & System'}</span>
        </button>
      </div>
    </form>
  )
}
