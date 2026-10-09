'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  QrCode,
  MoreHorizontal,
  Clock,
  PlusCircle,
  Eye,
  RefreshCw,
  ShoppingBag,
  ArrowRight,
  Coffee,
  CheckCircle2,
  Sparkles,
} from 'lucide-react'
import { Table, TableStatus, Order, useAdminStore } from '@/store/useAdminStore'
import { formatCurrency, timeAgo } from '@/lib/utils'

interface TableDetailPanelProps {
  table: Table
  activeOrder?: Order
  onOpenQr: (table: Table) => void
}

export default function TableDetailPanel({
  table,
  activeOrder,
  onOpenQr,
}: TableDetailPanelProps) {
  const router = useRouter()
  const updateTableStatus = useAdminStore((s) => s.updateTableStatus)
  const showToast = useAdminStore((s) => s.showToast)

  const handleStatusChange = (status: TableStatus) => {
    updateTableStatus(table.id, status)
    showToast(`Table ${table.number} marked as ${status}`)
  }

  const getStatusBadge = (st: TableStatus) => {
    switch (st) {
      case 'available':
        return (
          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#EAF7ED] text-[#228B45] border border-[#C5ECD0] flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Available
          </span>
        )
      case 'ordering':
        return (
          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#FEF5E7] text-[#C27803] border border-[#FDE1B5] flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            Ordering
          </span>
        )
      case 'occupied':
        return (
          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#FDEAE8] text-[#D32F2F] border border-[#F9C5C1] flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
            Occupied
          </span>
        )
      case 'cleaning':
        return (
          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#F3F4F6] text-[#4B5563] border border-[#E5E7EB] flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-stone-400" />
            Cleaning
          </span>
        )
      default:
        return (
          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700">
            {st}
          </span>
        )
    }
  }

  return (
    <div className="bg-white border border-[#EDE2D5] rounded-3xl p-6 shadow-sm space-y-6">
      {/* ── 1. Header Row ── */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2.5">
            <h2
              className="text-[24px] font-bold text-[#2C1A0E] tracking-tight leading-none"
              style={{ fontFamily: '"Playfair Display", Georgia, serif' }}
            >
              Table {table.number}
            </h2>
            {getStatusBadge(table.status)}
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onOpenQr(table)}
              className="p-1.5 bg-[#FAF5EE] border border-[#EBDCCF] text-[#8C4A28] hover:text-[#2C1A0E] rounded-xl transition-all shadow-2xs"
              title="Show QR Code"
            >
              <QrCode size={16} />
            </button>
          </div>
        </div>

        <p className="text-[12px] text-[#A08878] font-medium">
          {table.capacity} Seats · Indoor Café Dining
        </p>
      </div>

      {/* ── 2. Table Photo & Active Order Summary ── */}
      <div className="space-y-3">
        <div className="flex gap-3 items-stretch">
          {/* Active Order Preview Card */}
          <div className="flex-1 min-w-0 bg-[#FAF7F4] border border-[#EBDCCF] rounded-2xl p-3.5 flex flex-col justify-between">
            {activeOrder ? (
              <>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[12px] font-mono font-bold text-[#2C1A0E]">
                      Order #{activeOrder.id}
                    </span>
                    <ArrowRight size={13} className="text-[#8C4A28]" />
                  </div>
                  <p className="text-[11px] font-bold text-[#8C4A28]">
                    {activeOrder.items.length} items · {formatCurrency(activeOrder.total)}
                  </p>
                </div>
                <div className="flex items-center gap-1 text-[10px] text-[#A08878] pt-1 border-t border-[#EBDCCF]/60">
                  <Clock size={11} />
                  <span>Since {timeAgo(activeOrder.createdAt)}</span>
                </div>
              </>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center">
                <span className="text-[11px] font-semibold text-[#8C705B]">No active order</span>
                <span className="text-[10px] text-[#A08878]">Table ready for guest seating</span>
              </div>
            )}
          </div>
        </div>

        {/* View Full Order Button */}
        {activeOrder ? (
          <button
            onClick={() => router.push(`/orders?highlight=${activeOrder.id}`)}
            className="w-full py-3 bg-[#6C3E26] hover:bg-[#522E1B] text-white rounded-2xl text-[13px] font-bold flex items-center justify-center gap-2 shadow-xs transition-all active:scale-[0.98]"
          >
            <span>View Full Order</span>
            <ArrowRight size={14} />
          </button>
        ) : (
          <button
            onClick={() => onOpenQr(table)}
            className="w-full py-3 bg-[#FAF5EE] hover:bg-[#F2ECE5] text-[#8C4A28] border border-[#EBDCCF] rounded-2xl text-[13px] font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
          >
            <QrCode size={15} />
            <span>Show QR Stand Stand</span>
          </button>
        )}
      </div>

      {/* ── 3. Quick Actions (2x2 Grid) ── */}
      <div>
        <p className="text-[11px] font-bold uppercase tracking-wider text-[#A08878] mb-2.5">
          Quick Actions
        </p>
        <div className="grid grid-cols-2 gap-2.5 text-[12px] font-bold">
          <button
            onClick={() => handleStatusChange(table.status === 'occupied' ? 'cleaning' : 'occupied')}
            className="p-3 bg-[#FAF7F4] hover:bg-[#F2ECE5] border border-[#EBDCCF] text-[#2C1A0E] rounded-xl flex items-center gap-2 transition-all shadow-2xs active:scale-95 text-left"
          >
            <Clock size={15} className="text-[#8C4A28]" />
            <span>Change Status</span>
          </button>

          <button
            onClick={() => onOpenQr(table)}
            className="p-3 bg-[#FAF7F4] hover:bg-[#F2ECE5] border border-[#EBDCCF] text-[#2C1A0E] rounded-xl flex items-center gap-2 transition-all shadow-2xs active:scale-95 text-left"
          >
            <QrCode size={15} className="text-[#8C4A28]" />
            <span>Scan QR</span>
          </button>

          <button
            onClick={() => showToast(`Creating order for Table ${table.number} ☕`)}
            className="p-3 bg-[#FAF7F4] hover:bg-[#F2ECE5] border border-[#EBDCCF] text-[#2C1A0E] rounded-xl flex items-center gap-2 transition-all shadow-2xs active:scale-95 text-left"
          >
            <ShoppingBag size={15} className="text-[#8C4A28]" />
            <span>Add Order</span>
          </button>

          <button
            onClick={() => showToast(`Inspecting live telemetry for Table ${table.number}`)}
            className="p-3 bg-[#FAF7F4] hover:bg-[#F2ECE5] border border-[#EBDCCF] text-[#2C1A0E] rounded-xl flex items-center gap-2 transition-all shadow-2xs active:scale-95 text-left"
          >
            <Eye size={15} className="text-[#8C4A28]" />
            <span>View Details</span>
          </button>
        </div>
      </div>

      {/* ── 4. Table Status Stepper Flow ── */}
      <div>
        <p className="text-[11px] font-bold uppercase tracking-wider text-[#A08878] mb-2">
          Table Status Flow
        </p>
        <div className="flex items-center justify-between gap-1 bg-[#FAF7F4] p-1.5 rounded-2xl border border-[#EBDCCF]">
          {(['available', 'ordering', 'occupied', 'cleaning'] as TableStatus[]).map((st) => (
            <button
              key={st}
              onClick={() => handleStatusChange(st)}
              className={`px-2 py-1.5 rounded-xl text-[10px] font-bold transition-all capitalize flex items-center gap-1 ${
                table.status === st
                  ? 'bg-white shadow-2xs text-[#2C1A0E] border border-[#EBDCCF]'
                  : 'text-[#8C705B] hover:text-[#2C1A0E]'
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  st === 'available'
                    ? 'bg-emerald-500'
                    : st === 'ordering'
                    ? 'bg-amber-400'
                    : st === 'occupied'
                    ? 'bg-red-500'
                    : 'bg-stone-400'
                }`}
              />
              <span>{st}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── 5. Recent Orders List ── */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="text-[11px] font-bold uppercase tracking-wider text-[#A08878]">
            Recent Orders (Table {table.number})
          </p>
          <Link
            href="/orders"
            className="text-[11px] font-bold text-[#8C4A28] hover:underline"
          >
            View All →
          </Link>
        </div>

        <div className="space-y-2.5">
          {/* Item 1 */}
          <div className="flex items-center justify-between p-2.5 rounded-xl border border-[#EDE2D5] bg-[#FCFAF7]">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl overflow-hidden relative border border-[#EBDCCF] bg-white flex-shrink-0">
                <Image
                  src="/products/cappuccino.jpg"
                  alt="Cappuccino"
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <p className="text-[12px] font-bold text-[#2C1A0E]">Cappuccino</p>
                <p className="text-[10px] text-[#A08878]">₹160 × 1 · 8 min ago</p>
              </div>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
              Preparing
            </span>
          </div>

          {/* Item 2 */}
          <div className="flex items-center justify-between p-2.5 rounded-xl border border-[#EDE2D5] bg-[#FCFAF7]">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl overflow-hidden relative border border-[#EBDCCF] bg-white flex-shrink-0">
                <Image
                  src="/products/croissant.jpg"
                  alt="Croissant"
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <p className="text-[12px] font-bold text-[#2C1A0E]">Croissant</p>
                <p className="text-[10px] text-[#A08878]">₹120 × 1 · 12 min ago</p>
              </div>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              Confirmed
            </span>
          </div>
        </div>
      </div>

      {/* ── 6. Guest Happiness Banner ── */}
      <div className="bg-[#FAF5EE] border border-[#EBDCCF] rounded-2xl p-3.5 flex items-center gap-3">
        <div className="w-8 h-8 rounded-xl bg-white border border-[#EBDCCF] flex items-center justify-center text-[#8C4A28] flex-shrink-0 shadow-2xs">
          <Coffee size={15} />
        </div>
        <div className="min-w-0">
          <p className="text-[12px] font-bold text-[#2C1A0E]">
            Happy Guests = Better Days
          </p>
          <p className="text-[10px] text-[#8C705B] truncate">
            Keep the table experience smooth and quick!
          </p>
        </div>
      </div>
    </div>
  )
}
