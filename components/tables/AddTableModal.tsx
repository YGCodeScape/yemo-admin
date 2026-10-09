'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Plus, Users, Grid2X2 } from 'lucide-react'
import { TableStatus, useAdminStore } from '@/store/useAdminStore'

interface AddTableModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function AddTableModal({ isOpen, onClose }: AddTableModalProps) {
  const tables = useAdminStore((s) => s.tables)
  const addTable = useAdminStore((s) => s.addTable)
  const showToast = useAdminStore((s) => s.showToast)

  // Suggest next table number
  const nextNumber = String(tables.length + 1).padStart(2, '0')

  const [tableNumber, setTableNumber] = useState(nextNumber)
  const [capacity, setCapacity] = useState<number>(4)
  const [status, setStatus] = useState<TableStatus>('available')

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!tableNumber.trim()) return

    addTable({
      number: tableNumber.trim().padStart(2, '0'),
      capacity,
      status,
    })

    showToast(`Table ${tableNumber} created and added to café floor! 🎉`)
    onClose()
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/50 backdrop-blur-2xs"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 10 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 10 }}
          className="relative w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-[#EDE2D5] z-10"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-[#F2ECE5] mb-5">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#FAF5EE] border border-[#EBDCCF] flex items-center justify-center text-[#8C4A28]">
                <Grid2X2 size={16} />
              </div>
              <div>
                <h2
                  className="text-[18px] font-bold text-[#2C1A0E] leading-tight"
                  style={{ fontFamily: '"Playfair Display", Georgia, serif' }}
                >
                  Add New Café Table
                </h2>
                <p className="text-[11px] text-[#A08878]">
                  Expand dining floor capacity
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-[#FAF5EE] border border-[#EBDCCF] flex items-center justify-center text-[#2C1A0E] hover:bg-[#F2ECE5] transition-all"
            >
              <X size={15} />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Table Number */}
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#A08878] block mb-1">
                Table Number / Identifier
              </label>
              <input
                type="text"
                value={tableNumber}
                onChange={(e) => setTableNumber(e.target.value)}
                placeholder="e.g. 13"
                required
                className="w-full px-3.5 py-2.5 bg-[#FAF7F4] border border-[#EBDCCF] rounded-xl text-[14px] font-bold text-[#2C1A0E] focus:outline-none focus:ring-2 focus:ring-[#C87D55]/30 focus:border-[#C87D55]"
              />
            </div>

            {/* Seating Capacity Selector */}
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#A08878] block mb-2">
                Seating Capacity
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[2, 4, 6, 8].map((cap) => (
                  <button
                    key={cap}
                    type="button"
                    onClick={() => setCapacity(cap)}
                    className={`py-2.5 rounded-xl border text-[12px] font-bold flex flex-col items-center justify-center transition-all ${
                      capacity === cap
                        ? 'bg-[#2C1A0E] text-white border-[#2C1A0E] shadow-2xs'
                        : 'bg-white border-[#EBDCCF] text-[#6B5344] hover:bg-[#FAF5EE]'
                    }`}
                  >
                    <span>{cap}</span>
                    <span className="text-[9px] font-normal opacity-80">Guests</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Initial Status */}
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#A08878] block mb-1">
                Initial Floor Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as TableStatus)}
                className="w-full px-3.5 py-2.5 bg-[#FAF7F4] border border-[#EBDCCF] rounded-xl text-[13px] font-semibold text-[#2C1A0E] focus:outline-none focus:ring-2 focus:ring-[#C87D55]/30"
              >
                <option value="available">🟢 Available for Guests</option>
                <option value="reserved">🔵 Reserved for Booking</option>
                <option value="cleaning">⚪ Cleaning in Progress</option>
              </select>
            </div>

            {/* Submit */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3 bg-[#C87D55] hover:bg-[#B36942] text-white rounded-xl text-[13px] font-bold flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-98"
              >
                <Plus size={15} />
                <span>Create Table &amp; Generate QR</span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
