'use client'

import React from 'react'
import {
  X,
  MapPin,
  Truck,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Sliders,
  Edit3,
  Trash2,
  Boxes,
  DollarSign,
  TrendingDown,
} from 'lucide-react'
import { InventoryItem } from '@/store/useAdminStore'

interface InventoryDetailDrawerProps {
  item: InventoryItem | null
  isOpen: boolean
  isAdmin: boolean
  onClose: () => void
  onAdjustStock: (item: InventoryItem) => void
  onEdit: (item: InventoryItem) => void
  onDelete: (item: InventoryItem) => void
}

export default function InventoryDetailDrawer({
  item,
  isOpen,
  isAdmin,
  onClose,
  onAdjustStock,
  onEdit,
  onDelete,
}: InventoryDetailDrawerProps) {
  if (!isOpen || !item) return null

  const totalValue = Math.round(item.currentStock * item.costPerUnit)
  const maxCap = item.maxCapacity || item.minThreshold * 2.5
  const percentage = Math.min(100, Math.round((item.currentStock / maxCap) * 100))

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-2xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white border-l border-[#EDE2D5] shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
          {/* Header */}
          <div className="p-4.5 border-b border-[#EDE2D5] flex items-center justify-between bg-[#FDFBF7]">
            <span className="text-[12px] font-bold text-[#A08878] uppercase tracking-wider">
              Supply Specifications
            </span>
            <button
              onClick={onClose}
              className="p-1.5 text-[#A08878] hover:text-[#2C1A0E] rounded-full hover:bg-black/5 transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Drawer Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Title & SKU */}
            <div>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#FAF5EE] text-[#8C4A28] border border-[#EADBCC] inline-block mb-1.5">
                {item.sku}
              </span>
              <h2
                className="text-[22px] font-bold text-[#2C1A0E] leading-snug"
                style={{ fontFamily: '"Playfair Display", Georgia, serif' }}
              >
                {item.name}
              </h2>
              <p className="text-[12px] text-[#8C705B] mt-0.5 capitalize">
                Category: {item.category.replace('_', ' ')}
              </p>
            </div>

            {/* Current Stock Banner */}
            <div className="p-4.5 bg-[#FAF5EE] border border-[#EDE2D5] rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-[#A08878] uppercase tracking-wider">
                  Available Balance
                </span>
                {item.status === 'ok' && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-full">
                    <CheckCircle2 size={12} /> Healthy Stock
                  </span>
                )}
                {item.status === 'low' && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                    <AlertTriangle size={12} /> Low Stock Warning
                  </span>
                )}
                {item.status === 'out_of_stock' && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-red-700 bg-red-100 px-2 py-0.5 rounded-full">
                    <XCircle size={12} /> Out of Stock
                  </span>
                )}
              </div>

              <div className="flex items-baseline justify-between">
                <div className="text-[32px] font-bold text-[#2C1A0E] leading-none">
                  {item.currentStock}{' '}
                  <span className="text-[16px] font-normal text-[#8C705B]">
                    {item.unit}
                  </span>
                </div>
                <span className="text-[12px] text-[#A08878]">
                  Cap: {maxCap} {item.unit}
                </span>
              </div>

              {/* Visual meter */}
              <div className="w-full bg-[#E5D2BD]/60 h-2.5 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    item.status === 'out_of_stock'
                      ? 'bg-red-500 w-full'
                      : item.status === 'low'
                      ? 'bg-amber-500'
                      : 'bg-emerald-500'
                  }`}
                  style={{
                    width: item.status === 'out_of_stock' ? '100%' : `${percentage}%`,
                  }}
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-[#7A614E] pt-1">
                <span>Alert Threshold: {item.minThreshold} {item.unit}</span>
                <span>Storage Fill: {percentage}%</span>
              </div>
            </div>

            {/* Quick Specs Grid */}
            <div className="grid grid-cols-2 gap-3 p-3.5 bg-white border border-[#EDE2D5] rounded-2xl">
              <div>
                <span className="text-[10px] font-bold text-[#A08878] uppercase block">
                  Unit Cost
                </span>
                <span className="text-[14px] font-bold text-[#8C4A28]">
                  ₹{item.costPerUnit} / {item.unit}
                </span>
              </div>

              <div>
                <span className="text-[10px] font-bold text-[#A08878] uppercase block">
                  Total Valuation
                </span>
                <span className="text-[14px] font-bold text-[#2C1A0E]">
                  ₹{totalValue.toLocaleString('en-IN')}
                </span>
              </div>

              <div>
                <span className="text-[10px] font-bold text-[#A08878] uppercase block">
                  Storage Location
                </span>
                <span className="text-[13px] font-medium text-[#2C1A0E] flex items-center gap-1">
                  <MapPin size={12} className="text-[#C87D55]" />
                  {item.storageLocation || 'Main Hub'}
                </span>
              </div>

              <div>
                <span className="text-[10px] font-bold text-[#A08878] uppercase block">
                  Primary Supplier
                </span>
                <span className="text-[13px] font-medium text-[#2C1A0E] flex items-center gap-1">
                  <Truck size={12} className="text-[#A08878]" />
                  {item.supplier || 'Standard Vendor'}
                </span>
              </div>
            </div>

            {/* Restock & Audit History */}
            <div className="p-4 bg-[#FAF7F4] border border-[#EDE2D5] rounded-2xl space-y-2.5">
              <span className="text-[11px] font-bold text-[#2C1A0E] uppercase tracking-wider block">
                Restock & Audit Timelines
              </span>
              <div className="flex items-center justify-between text-[12px]">
                <span className="text-[#8C705B]">Last Restocked:</span>
                <span className="font-semibold text-[#2C1A0E]">
                  {item.lastRestockedDate || 'Recently recorded'}
                </span>
              </div>
              <div className="flex items-center justify-between text-[12px]">
                <span className="text-[#8C705B]">Last System Update:</span>
                <span className="font-semibold text-[#2C1A0E]">
                  {new Date(item.lastUpdated).toLocaleTimeString('en-IN', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="p-4 border-t border-[#EDE2D5] bg-[#FDFBF7] flex items-center justify-between gap-3">
            {isAdmin ? (
              <>
                <button
                  type="button"
                  onClick={() => {
                    onClose()
                    onAdjustStock(item)
                  }}
                  className="px-4 py-2.5 rounded-full bg-[#FAF5EE] text-[#8C4A28] border border-[#EADBCC] text-[12px] font-bold hover:bg-[#F2E7D8] flex items-center gap-1.5 transition-all"
                >
                  <Sliders size={13} />
                  <span>Adjust Stock</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      onClose()
                      onDelete(item)
                    }}
                    className="p-2.5 rounded-full text-stone-400 hover:text-red-600 hover:bg-red-50 border border-transparent hover:border-red-200 transition-all"
                    title="Delete Supply"
                  >
                    <Trash2 size={16} />
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      onClose()
                      onEdit(item)
                    }}
                    className="px-5 py-2.5 rounded-full bg-[#2C1A0E] text-white text-[13px] font-bold hover:bg-[#1E110A] transition-all flex items-center gap-1.5 shadow-sm active:scale-95"
                  >
                    <Edit3 size={14} />
                    <span>Edit Supply</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="w-full flex items-center justify-between">
                <span className="text-[11px] text-[#A08878]">
                  Staff View • Read Only
                </span>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2 rounded-full bg-[#2C1A0E] text-white text-[12px] font-bold"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
