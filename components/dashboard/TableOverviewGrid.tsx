'use client'

import React from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { useAdminStore, TableStatus } from '@/store/useAdminStore'

export default function TableOverviewGrid() {
  const tables = useAdminStore((s) => s.tables)
  const updateTableStatus = useAdminStore((s) => s.updateTableStatus)
  const showToast = useAdminStore((s) => s.showToast)

  // Cycle table status on click for quick testing
  const handleToggleStatus = (tableId: string, currentStatus: TableStatus, tableNum: string) => {
    const statuses: TableStatus[] = ['available', 'ordering', 'occupied', 'cleaning']
    const nextIdx = (statuses.indexOf(currentStatus) + 1) % statuses.length
    const nextStatus = statuses[nextIdx]
    updateTableStatus(tableId, nextStatus)
    showToast(`Table ${tableNum} is now ${nextStatus}`)
  }

  const getStatusColor = (status: TableStatus) => {
    switch (status) {
      case 'available':
        return 'bg-emerald-500 text-white ring-2 ring-emerald-200'
      case 'occupied':
        return 'bg-red-500 text-white ring-2 ring-red-200'
      case 'ordering':
        return 'bg-amber-400 text-amber-950 ring-2 ring-amber-200 animate-pulse'
      case 'cleaning':
        return 'bg-stone-400 text-white ring-2 ring-stone-200'
      default:
        return 'bg-stone-300 text-stone-700'
    }
  }

  return (
    <div className="bg-white border border-[#EDE2D5] rounded-2xl p-5 shadow-2xs flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-[15px] font-bold text-[#2C1A0E]">
            Table Overview
          </h3>
          <p className="text-[11px] text-[#A08878] mt-0.5">
            Click table to cycle status
          </p>
        </div>

        <Link
          href="/tables"
          className="text-[12px] font-semibold text-[#8C4A28] hover:text-[#2C1A0E] flex items-center gap-1 group transition-colors"
        >
          <span>View all tables</span>
          <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      {/* 4x3 Dot Grid */}
      <div className="grid grid-cols-4 gap-3 py-2">
        {tables.slice(0, 12).map((tbl) => (
          <button
            key={tbl.id}
            onClick={() => handleToggleStatus(tbl.id, tbl.status, tbl.number)}
            className={`w-11 h-11 rounded-full mx-auto flex items-center justify-center font-bold text-[12px] transition-all hover:scale-105 active:scale-95 shadow-2xs cursor-pointer ${getStatusColor(
              tbl.status
            )}`}
            title={`Table ${tbl.number}: ${tbl.status}`}
          >
            {tbl.number}
          </button>
        ))}
      </div>

      {/* Legend */}
      <div className="pt-4 border-t border-[#F2EAE1] flex flex-wrap items-center justify-between gap-2 text-[10px] font-semibold text-[#8C7362]">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          <span>Available</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
          <span>Ordering</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
          <span>Occupied</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-stone-400" />
          <span>Cleaning</span>
        </div>
      </div>
    </div>
  )
}
