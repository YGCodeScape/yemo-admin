'use client'

import React from 'react'
import {
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Edit3,
  Trash2,
  Sliders,
  Eye,
  MapPin,
  Truck,
  Coffee,
  Milk,
  Package,
  Apple,
  Cookie,
  Flame,
} from 'lucide-react'
import { InventoryItem, InventoryCategory } from '@/store/useAdminStore'

interface InventoryTableRowProps {
  item: InventoryItem
  isAdmin: boolean
  onAdjustStock: (item: InventoryItem) => void
  onEdit: (item: InventoryItem) => void
  onDelete: (item: InventoryItem) => void
  onView: (item: InventoryItem) => void
}

export default function InventoryTableRow({
  item,
  isAdmin,
  onAdjustStock,
  onEdit,
  onDelete,
  onView,
}: InventoryTableRowProps) {
  // Category styling & Icon
  const getCategoryDetails = (cat: InventoryCategory) => {
    switch (cat) {
      case 'coffee_beans':
        return { label: 'Coffee Beans', icon: Coffee, color: 'text-amber-800 bg-amber-50 border-amber-200' }
      case 'dairy_milk':
        return { label: 'Dairy & Milk', icon: Milk, color: 'text-blue-800 bg-blue-50 border-blue-200' }
      case 'syrups':
        return { label: 'Syrups & Flavors', icon: Flame, color: 'text-purple-800 bg-purple-50 border-purple-200' }
      case 'bakery_dry':
        return { label: 'Bakery & Dry', icon: Cookie, color: 'text-stone-800 bg-stone-100 border-stone-200' }
      case 'produce':
        return { label: 'Fresh Produce', icon: Apple, color: 'text-emerald-800 bg-emerald-50 border-emerald-200' }
      case 'packaging':
        return { label: 'Packaging', icon: Package, color: 'text-orange-800 bg-orange-50 border-orange-200' }
    }
  }

  // Stock Status Badge
  const renderStatusBadge = () => {
    switch (item.status) {
      case 'out_of_stock':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-red-50 text-red-700 border border-red-200 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-red-600 animate-ping" />
            <span>Out of Stock</span>
          </span>
        )
      case 'low':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200 shadow-2xs">
            <AlertTriangle size={12} className="text-amber-600" />
            <span>Low Stock</span>
          </span>
        )
      case 'ok':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 size={12} className="text-emerald-600" />
            <span>Healthy</span>
          </span>
        )
    }
  }

  const categoryMeta = getCategoryDetails(item.category)
  const CategoryIcon = categoryMeta.icon

  // Calculate percentage bar
  const maxCap = item.maxCapacity || item.minThreshold * 2.5
  const percentage = Math.min(100, Math.round((item.currentStock / maxCap) * 100))

  const totalValue = Math.round(item.currentStock * item.costPerUnit)

  return (
    <tr
      onClick={() => onView(item)}
      className="border-b border-[#F2EAE0] hover:bg-[#FDFBF7] transition-colors cursor-pointer group"
    >
      {/* ── Item Name & SKU ── */}
      <td className="py-3.5 px-4">
        <div className="flex items-center gap-3">
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center border flex-shrink-0 ${categoryMeta.color}`}
          >
            <CategoryIcon size={16} />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-bold text-[14px] text-[#2C1A0E] group-hover:text-[#C87D55] transition-colors truncate">
                {item.name}
              </span>
            </div>
            <span className="text-[11px] font-mono text-[#A08878] block">
              {item.sku}
            </span>
          </div>
        </div>
      </td>

      {/* ── Category ── */}
      <td className="py-3.5 px-4">
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold border ${categoryMeta.color}`}
        >
          <span>{categoryMeta.label}</span>
        </span>
      </td>

      {/* ── Current Stock Level & Progress Bar ── */}
      <td className="py-3.5 px-4 min-w-[150px]">
        <div className="flex items-baseline justify-between mb-1">
          <span className="font-bold text-[14px] text-[#2C1A0E]">
            {item.currentStock}{' '}
            <span className="text-[11px] font-medium text-[#8C705B]">{item.unit}</span>
          </span>
          <span className="text-[11px] text-[#A08878]">
            Min: {item.minThreshold} {item.unit}
          </span>
        </div>
        {/* Progress bar */}
        <div className="w-full bg-[#EBDCCF]/60 h-2 rounded-full overflow-hidden">
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
      </td>

      {/* ── Stock Status ── */}
      <td className="py-3.5 px-4">
        {renderStatusBadge()}
      </td>

      {/* ── Storage Location ── */}
      <td className="py-3.5 px-4">
        <div className="flex items-center gap-1.5 text-[12px] text-[#7A614E]">
          <MapPin size={13} className="text-[#C87D55] flex-shrink-0" />
          <span className="truncate max-w-[130px]">
            {item.storageLocation || 'Main Storage'}
          </span>
        </div>
      </td>

      {/* ── Unit Cost & Total Value ── */}
      <td className="py-3.5 px-4">
        <div className="text-[13px] font-bold text-[#8C4A28]">
          ₹{totalValue.toLocaleString('en-IN')}
        </div>
        <div className="text-[10px] text-[#A08878]">
          ₹{item.costPerUnit}/{item.unit}
        </div>
      </td>

      {/* ── Supplier ── */}
      <td className="py-3.5 px-4">
        <div className="flex items-center gap-1.5 text-[12px] text-[#7A614E]">
          <Truck size={13} className="text-[#A08878] flex-shrink-0" />
          <span className="truncate max-w-[120px]">
            {item.supplier || 'Standard Supplier'}
          </span>
        </div>
      </td>

      {/* ── Actions Column ── */}
      <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-end gap-1">
          {isAdmin ? (
            <>
              {/* Quick Adjust Button */}
              <button
                type="button"
                onClick={() => onAdjustStock(item)}
                className="px-2.5 py-1.5 rounded-lg text-[11px] font-bold text-[#8C4A28] bg-[#FAF5EE] hover:bg-[#F2E7D8] border border-[#EADBCC] flex items-center gap-1 transition-all active:scale-95"
                title="Quick Stock Adjust (+/-)"
              >
                <Sliders size={12} />
                <span>Adjust</span>
              </button>

              {/* Edit Details */}
              <button
                type="button"
                onClick={() => onEdit(item)}
                className="p-1.5 rounded-lg text-[#8C705B] hover:text-[#2C1A0E] hover:bg-[#FAF5EE] border border-transparent hover:border-[#E8DACB] transition-all"
                title="Edit Supply Details"
              >
                <Edit3 size={14} />
              </button>

              {/* Delete */}
              <button
                type="button"
                onClick={() => onDelete(item)}
                className="p-1.5 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 border border-transparent hover:border-red-200 transition-all"
                title="Delete Supply"
              >
                <Trash2 size={14} />
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => onView(item)}
              className="px-3 py-1.5 rounded-lg text-[11px] font-semibold text-[#8C4A28] bg-[#FAF5EE] hover:bg-[#F2E7D8] border border-[#EADBCC] flex items-center gap-1 transition-all"
            >
              <Eye size={12} />
              <span>Details</span>
            </button>
          )}
        </div>
      </td>
    </tr>
  )
}
