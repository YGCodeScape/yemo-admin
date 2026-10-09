'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  QrCode,
  Users,
  Clock,
  MoreVertical,
  Trash2,
  Receipt,
  ArrowRight,
  CheckCircle2,
  Sparkles,
} from 'lucide-react'
import { Table, TableStatus, Order, useAdminStore } from '@/store/useAdminStore'
import { useAuthStore } from '@/store/useAuthStore'
import { formatCurrency, timeAgo } from '@/lib/utils'

interface TableCardProps {
  table: Table
  activeOrder?: Order
  onOpenQr: (table: Table) => void
}

export default function TableCard({
  table,
  activeOrder,
  onOpenQr,
}: TableCardProps) {
  const user = useAuthStore((s) => s.user)
  const updateTableStatus = useAdminStore((s) => s.updateTableStatus)
  const deleteTable = useAdminStore((s) => s.deleteTable)
  const showToast = useAdminStore((s) => s.showToast)

  const [showMenu, setShowMenu] = useState(false)

  const handleStatusSelect = (status: TableStatus) => {
    updateTableStatus(table.id, status)
    showToast(`Table ${table.number} marked as ${status}`)
    setShowMenu(false)
  }

  const handleDelete = () => {
    if (confirm(`Remove Table ${table.number} from café floor?`)) {
      deleteTable(table.id)
      showToast(`Table ${table.number} removed`)
    }
  }

  const getStatusBadge = (status: TableStatus) => {
    switch (status) {
      case 'available':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Available
          </span>
        )
      case 'ordering':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            Ordering
          </span>
        )
      case 'occupied':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-red-50 text-red-700 border border-red-200">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
            Occupied
          </span>
        )
      case 'cleaning':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-stone-100 text-stone-700 border border-stone-200">
            Cleaning
          </span>
        )
      case 'reserved':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
            Reserved
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-stone-100 text-stone-700">
            {status}
          </span>
        )
    }
  }

  return (
    <div className="bg-white border border-[#EDE2D5] rounded-2xl p-5 shadow-2xs hover:shadow-sm transition-all flex flex-col justify-between relative group">
      {/* ── Top Row: Number, Capacity & Options ── */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <h3
              className="text-[20px] font-bold text-[#2C1A0E] tracking-tight leading-none"
              style={{ fontFamily: '"Playfair Display", Georgia, serif' }}
            >
              Table {table.number}
            </h3>
            <span className="text-[10px] font-bold text-[#8C7362] bg-[#FAF5EE] px-2 py-0.5 rounded-lg border border-[#EBDCCF] flex items-center gap-1">
              <Users size={11} className="text-[#A08878]" />
              {table.capacity} seats
            </span>
          </div>

          <div className="flex items-center gap-1 relative">
            {/* View QR Code Button */}
            <button
              onClick={() => onOpenQr(table)}
              className="p-1.5 bg-[#FAF5EE] border border-[#EBDCCF] text-[#8C4A28] hover:text-[#2C1A0E] hover:bg-[#F2ECE5] rounded-xl transition-all shadow-2xs"
              title="Show QR Code Stand"
            >
              <QrCode size={15} />
            </button>

            {/* Quick Status Options Dropdown Toggle */}
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-1.5 text-[#8C7362] hover:text-[#2C1A0E] hover:bg-[#FAF7F4] rounded-lg transition-colors"
              aria-label="Table options"
            >
              <MoreVertical size={15} />
            </button>

            {/* Status Dropdown Menu */}
            {showMenu && (
              <div className="absolute top-9 right-0 w-44 bg-white border border-[#EDE2D5] rounded-2xl shadow-xl z-20 p-1.5 space-y-1 text-[12px]">
                <p className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#A08878]">
                  Change Status
                </p>
                <button
                  onClick={() => handleStatusSelect('available')}
                  className="w-full text-left px-2.5 py-1.5 rounded-xl hover:bg-emerald-50 text-emerald-800 font-semibold flex items-center gap-2"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>Available</span>
                </button>
                <button
                  onClick={() => handleStatusSelect('occupied')}
                  className="w-full text-left px-2.5 py-1.5 rounded-xl hover:bg-red-50 text-red-800 font-semibold flex items-center gap-2"
                >
                  <span className="w-2 h-2 rounded-full bg-red-500" />
                  <span>Occupied</span>
                </button>
                <button
                  onClick={() => handleStatusSelect('cleaning')}
                  className="w-full text-left px-2.5 py-1.5 rounded-xl hover:bg-stone-100 text-stone-800 font-semibold flex items-center gap-2"
                >
                  <span className="w-2 h-2 rounded-full bg-stone-400" />
                  <span>Cleaning</span>
                </button>
                <button
                  onClick={() => handleStatusSelect('reserved')}
                  className="w-full text-left px-2.5 py-1.5 rounded-xl hover:bg-blue-50 text-blue-800 font-semibold flex items-center gap-2"
                >
                  <span className="w-2 h-2 rounded-full bg-blue-500" />
                  <span>Reserved</span>
                </button>

                {user?.role === 'admin' && (
                  <div className="pt-1 border-t border-[#F2ECE5]">
                    <button
                      onClick={handleDelete}
                      className="w-full text-left px-2.5 py-1.5 rounded-xl hover:bg-red-50 text-red-600 font-bold flex items-center gap-2 text-[11px]"
                    >
                      <Trash2 size={12} />
                      <span>Delete Table</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Status Pill */}
        <div className="mb-4">{getStatusBadge(table.status)}</div>
      </div>

      {/* ── Middle: Active Order Details or Empty State ── */}
      <div className="my-2">
        {activeOrder ? (
          <Link
            href={`/orders?highlight=${activeOrder.id}`}
            className="block p-3 rounded-xl bg-[#FAF5EE] border border-[#EBDCCF] hover:border-[#C87D55] transition-all group/order"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-mono font-bold text-[12px] text-[#2C1A0E]">
                #{activeOrder.id}
              </span>
              <span className="text-[12px] font-bold text-[#8C4A28]">
                {formatCurrency(activeOrder.total)}
              </span>
            </div>
            <p className="text-[11px] text-[#5C4535] truncate font-medium">
              {activeOrder.items
                .map((it) => `${it.quantity > 1 ? `${it.quantity}× ` : ''}${it.name}`)
                .join(', ')}
            </p>
            <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-[#EBDCCF]/60 text-[10px] text-[#8C7362]">
              <span>{timeAgo(activeOrder.createdAt)}</span>
              <span className="font-bold text-[#C87D55] flex items-center gap-0.5 group-hover/order:translate-x-0.5 transition-transform">
                <span>View Order</span>
                <ArrowRight size={10} />
              </span>
            </div>
          </Link>
        ) : (
          <div className="h-20 rounded-xl bg-[#FAF7F4] border border-dashed border-[#EBDCCF] flex items-center justify-center text-center p-3">
            <p className="text-[11px] text-[#A08878] italic">
              {table.status === 'available'
                ? 'Ready for incoming guests'
                : table.status === 'cleaning'
                ? 'Staff cleaning in progress'
                : 'No active order assigned'}
            </p>
          </div>
        )}
      </div>

      {/* ── Bottom Quick Actions ── */}
      <div className="pt-3 border-t border-[#F2ECE5] flex items-center justify-between text-[11px]">
        {table.status === 'occupied' ? (
          <button
            onClick={() => handleStatusSelect('cleaning')}
            className="w-full py-1.5 bg-[#FAF5EE] hover:bg-[#F2ECE5] text-[#8C4A28] border border-[#EBDCCF] rounded-xl font-bold transition-all text-center"
          >
            Mark for Cleaning
          </button>
        ) : table.status === 'cleaning' ? (
          <button
            onClick={() => handleStatusSelect('available')}
            className="w-full py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold transition-all text-center shadow-2xs"
          >
            Mark Available
          </button>
        ) : (
          <button
            onClick={() => onOpenQr(table)}
            className="w-full py-1.5 bg-white hover:bg-[#FAF5EE] text-[#2C1A0E] border border-[#EBDCCF] rounded-xl font-bold transition-all flex items-center justify-center gap-1.5"
          >
            <QrCode size={13} className="text-[#8C4A28]" />
            <span>Table Stand QR</span>
          </button>
        )}
      </div>
    </div>
  )
}
