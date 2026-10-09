'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  QrCode,
  Download,
  Printer,
  RefreshCw,
  ExternalLink,
  Sparkles,
} from 'lucide-react'
import { Table, useAdminStore } from '@/store/useAdminStore'

interface TableQrModalProps {
  table: Table | null
  onClose: () => void
}

export default function TableQrModal({ table, onClose }: TableQrModalProps) {
  const showToast = useAdminStore((s) => s.showToast)

  if (!table) return null

  const tableUrl = `https://yemo.cafe/table/${table.number}`

  const handleDownload = () => {
    showToast(`Downloading Table ${table.number} QR Stand PNG... 📥`)
  }

  const handlePrint = () => {
    showToast(`Sending Table ${table.number} Tent Card to printer... 🖨️`)
  }

  const handleRegenerate = () => {
    showToast(`QR Code token regenerated for Table ${table.number} 🔄`)
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
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl border border-[#EDE2D5] z-10 text-center"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#FAF5EE] border border-[#EBDCCF] flex items-center justify-center text-[#2C1A0E] hover:bg-[#F2ECE5] transition-all"
            aria-label="Close"
          >
            <X size={15} />
          </button>

          {/* Table Header */}
          <div className="mb-4">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#C87D55]">
              Physical Table Stand
            </span>
            <h2
              className="text-[24px] font-bold text-[#2C1A0E] leading-tight mt-0.5"
              style={{ fontFamily: '"Playfair Display", Georgia, serif' }}
            >
              Table {table.number}
            </h2>
            <p className="text-[11px] text-[#A08878] font-medium">
              Capacity: {table.capacity} Guests · Dine-in
            </p>
          </div>

          {/* QR Stand Card Mockup */}
          <div className="bg-[#FAF7F4] border-2 border-[#EBDCCF] rounded-2xl p-6 shadow-inner mx-auto max-w-[240px] flex flex-col items-center relative overflow-hidden">
            {/* Top Café Header */}
            <h3
              className="text-[18px] font-bold text-[#2C1A0E] tracking-tight leading-none mb-1"
              style={{ fontFamily: '"Lily Script One", system-ui' }}
            >
              yemo
            </h3>
            <p className="text-[9px] font-bold text-[#8C4A28] uppercase tracking-widest mb-3">
              Scan To Order &amp; Pay
            </p>

            {/* QR Visual */}
            <div className="bg-white p-3 rounded-xl border border-[#EDE2D5] shadow-xs relative">
              <div className="w-36 h-36 relative flex items-center justify-center bg-white">
                {/* SVG QR Code Simulation */}
                <svg viewBox="0 0 100 100" className="w-full h-full text-[#2C1A0E]">
                  <rect width="100" height="100" fill="#FFFFFF" />
                  {/* Top-left position marker */}
                  <rect x="5" y="5" width="26" height="26" fill="#2C1A0E" rx="3" />
                  <rect x="9" y="9" width="18" height="18" fill="#FFFFFF" rx="2" />
                  <rect x="13" y="13" width="10" height="10" fill="#C87D55" rx="1.5" />

                  {/* Top-right position marker */}
                  <rect x="69" y="5" width="26" height="26" fill="#2C1A0E" rx="3" />
                  <rect x="73" y="9" width="18" height="18" fill="#FFFFFF" rx="2" />
                  <rect x="77" y="13" width="10" height="10" fill="#C87D55" rx="1.5" />

                  {/* Bottom-left position marker */}
                  <rect x="5" y="69" width="26" height="26" fill="#2C1A0E" rx="3" />
                  <rect x="9" y="73" width="18" height="18" fill="#FFFFFF" rx="2" />
                  <rect x="13" y="77" width="10" height="10" fill="#C87D55" rx="1.5" />

                  {/* Simulated QR data grid */}
                  <rect x="36" y="8" width="8" height="8" fill="#2C1A0E" />
                  <rect x="48" y="12" width="6" height="6" fill="#2C1A0E" />
                  <rect x="58" y="8" width="6" height="6" fill="#2C1A0E" />
                  <rect x="36" y="22" width="6" height="6" fill="#2C1A0E" />
                  <rect x="46" y="20" width="8" height="8" fill="#2C1A0E" />
                  <rect x="58" y="22" width="6" height="6" fill="#2C1A0E" />

                  {/* Center pattern */}
                  <rect x="36" y="36" width="28" height="28" fill="#2C1A0E" rx="2" />
                  <circle cx="50" cy="50" r="8" fill="#FFFFFF" />
                  <circle cx="50" cy="50" r="5" fill="#C87D55" />

                  {/* Bottom & side data */}
                  <rect x="8" y="36" width="6" height="6" fill="#2C1A0E" />
                  <rect x="18" y="42" width="8" height="8" fill="#2C1A0E" />
                  <rect x="72" y="36" width="8" height="8" fill="#2C1A0E" />
                  <rect x="84" y="44" width="6" height="6" fill="#2C1A0E" />
                  <rect x="36" y="72" width="6" height="6" fill="#2C1A0E" />
                  <rect x="48" y="76" width="8" height="8" fill="#2C1A0E" />
                  <rect x="62" y="72" width="6" height="6" fill="#2C1A0E" />
                  <rect x="74" y="78" width="8" height="8" fill="#2C1A0E" />
                  <rect x="86" y="72" width="6" height="6" fill="#2C1A0E" />
                </svg>
              </div>
            </div>

            {/* Bottom Table Indicator */}
            <div className="mt-3 bg-[#2C1A0E] text-white px-3 py-1 rounded-full text-[11px] font-bold">
              Table {table.number}
            </div>
          </div>

          {/* Deep link info */}
          <div className="mt-3 text-[11px] text-[#A08878] font-mono break-all bg-[#FAF5EE] p-2 rounded-xl border border-[#EBDCCF]">
            {tableUrl}
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2.5 mt-4">
            <button
              onClick={handleDownload}
              className="py-2.5 bg-[#2C1A0E] hover:bg-[#1A0E07] text-white rounded-xl text-[12px] font-bold flex items-center justify-center gap-1.5 transition-all shadow-2xs active:scale-95"
            >
              <Download size={13} />
              <span>Save PNG</span>
            </button>
            <button
              onClick={handlePrint}
              className="py-2.5 bg-white border border-[#EBDCCF] hover:bg-[#FAF5EE] text-[#2C1A0E] rounded-xl text-[12px] font-bold flex items-center justify-center gap-1.5 transition-all shadow-2xs active:scale-95"
            >
              <Printer size={13} />
              <span>Print Stand</span>
            </button>
          </div>

          {/* Regenerate Token */}
          <button
            onClick={handleRegenerate}
            className="w-full mt-2.5 py-1.5 text-[11px] font-semibold text-[#8C4A28] hover:text-[#2C1A0E] flex items-center justify-center gap-1 transition-colors"
          >
            <RefreshCw size={11} />
            <span>Regenerate QR security token</span>
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
