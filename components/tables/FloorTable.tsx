'use client'

import React from 'react'
import { QrCode } from 'lucide-react'
import { TableStatus } from '@/store/useAdminStore'

interface FloorTableProps {
  number: string
  seats: number
  status: TableStatus
  orderId?: string
  isSelected?: boolean
  onSelect?: () => void
  onOpenQr?: () => void
}

export default function FloorTable({
  number,
  seats,
  status,
  orderId,
  isSelected,
  onSelect,
  onOpenQr,
}: FloorTableProps) {
  // Status Indicator Dot
  const getStatusDot = (st: TableStatus) => {
    switch (st) {
      case 'available':
        return 'bg-emerald-500'
      case 'ordering':
        return 'bg-amber-400 animate-pulse'
      case 'occupied':
        return 'bg-red-500'
      case 'cleaning':
        return 'bg-stone-400'
      default:
        return 'bg-blue-500'
    }
  }

  // Status Badge Pill
  const getStatusBadge = (st: TableStatus) => {
    switch (st) {
      case 'available':
        return (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#EAF7ED] text-[#1E7E34] border border-[#BCE8C7]">
            Available
          </span>
        )
      case 'ordering':
        return (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FEF5E7] text-[#B87002] border border-[#FDE1B5]">
            Ordering
          </span>
        )
      case 'occupied':
        return (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FDEAE8] text-[#D32F2F] border border-[#F8BFBA]">
            Occupied
          </span>
        )
      case 'cleaning':
        return (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#F3F4F6] text-[#4B5563] border border-[#E5E7EB]">
            Cleaning
          </span>
        )
      default:
        return (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">
            {st}
          </span>
        )
    }
  }

  // Chairs layout based on capacity
  const chairCountTopBottom = seats >= 6 ? 3 : seats >= 4 ? 2 : 1

  return (
    <div
      onClick={onSelect}
      className={`relative flex flex-col items-center justify-center p-0.5 cursor-pointer select-none group transition-all duration-200 ${
        isSelected ? 'scale-105 z-20' : 'hover:scale-[1.02] z-10'
      }`}
    >
      {/* ── Top Chairs ── */}
      <div className="flex items-center justify-around w-4/5 mb-[-3px] z-0">
        {[...Array(chairCountTopBottom)].map((_, i) => (
          <div
            key={`top-${i}`}
            className="w-6 sm:w-7 h-2 sm:h-2.5 bg-[#DFCFBE] border border-[#C2AB94] rounded-t-md shadow-2xs group-hover:bg-[#D4C1AE] transition-colors"
          />
        ))}
      </div>

      {/* ── Table Base Card ── */}
      <div
        className={`relative z-10 w-[110px] sm:w-[130px] lg:w-[115px] bg-[#FFFDFB]/95 backdrop-blur-xs border rounded-2xl p-2 sm:p-2.5 transition-all shadow-md ${
          isSelected
            ? 'border-[#C87D55] ring-3 ring-[#C87D55]/35 shadow-lg bg-[#FFFDFB]'
            : 'border-[#E2CEBC] hover:border-[#C87D55]/60 hover:shadow-lg'
        }`}
      >
        <div className="flex flex-col space-y-1">
          {/* Header Row: Table Number & Icons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${getStatusDot(status)}`} />
              <span className="font-bold text-[13px] sm:text-[14px] text-[#2C1A0E] tracking-tight leading-none">
                {number}
              </span>
            </div>

            <div className="flex items-center gap-0.5">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onOpenQr?.()
                }}
                className="p-1 text-[#8C705B] hover:text-[#2C1A0E] hover:bg-black/5 rounded-md transition-colors"
                title="View Table QR"
              >
                <QrCode size={12} />
              </button>
            </div>
          </div>

          {/* Seating Capacity */}
          <div className="text-[10px] font-medium text-[#8C705B]">
            {seats} Seats
          </div>

          {/* Status Pill Badge */}
          <div className="pt-0.5 flex justify-start">
            {getStatusBadge(status)}
          </div>
        </div>
      </div>

      {/* ── Bottom Chairs ── */}
      <div className="flex items-center justify-around w-4/5 mt-[-3px] z-0">
        {[...Array(chairCountTopBottom)].map((_, i) => (
          <div
            key={`bot-${i}`}
            className="w-6 sm:w-7 h-2 sm:h-2.5 bg-[#DFCFBE] border border-[#C2AB94] rounded-b-md shadow-2xs group-hover:bg-[#D4C1AE] transition-colors"
          />
        ))}
      </div>
    </div>
  )
}
