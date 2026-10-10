'use client'

import React from 'react'
import Image from 'next/image'
import {
  X,
  Clock,
  Flame,
  Sparkles,
  Edit3,
  Trash2,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  Tag,
} from 'lucide-react'
import { MenuItem } from '@/store/useAdminStore'

interface MenuItemDrawerProps {
  item: MenuItem | null
  isOpen: boolean
  isAdmin: boolean
  onClose: () => void
  onEdit: (item: MenuItem) => void
  onDelete: (item: MenuItem) => void
  onToggleStock: (id: string) => void
}

export default function MenuItemDrawer({
  item,
  isOpen,
  isAdmin,
  onClose,
  onEdit,
  onDelete,
  onToggleStock,
}: MenuItemDrawerProps) {
  if (!isOpen || !item) return null

  const profit = item.price - (item.costPrice || 0)
  const marginPercent =
    item.price > 0 ? Math.round((profit / item.price) * 100) : 0

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-2xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white border-l border-[#EDE2D5] shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
          {/* Top Bar */}
          <div className="p-4 border-b border-[#EDE2D5] flex items-center justify-between bg-[#FDFBF7]">
            <span className="text-[12px] font-bold text-[#A08878] uppercase tracking-wider">
              Menu Item Details
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
            {/* High-Res Photo & Overlay Badges */}
            <div className="relative h-56 w-full rounded-2xl overflow-hidden bg-[#F5EFE6] border border-[#EDE2D5]">
              <Image
                src={item.image || '/assets/cafe_storefront.jpg'}
                alt={item.name}
                fill
                className="object-cover"
              />
              <div className="absolute top-3 left-3 flex gap-1.5">
                {item.badge === 'bestseller' && (
                  <span className="px-2.5 py-1 text-[11px] font-bold uppercase rounded-full bg-amber-500 text-white shadow-xs flex items-center gap-1">
                    <Flame size={12} className="fill-white" /> Bestseller
                  </span>
                )}
                {item.badge === 'seasonal' && (
                  <span className="px-2.5 py-1 text-[11px] font-bold uppercase rounded-full bg-purple-600 text-white shadow-xs flex items-center gap-1">
                    <Sparkles size={12} /> Seasonal
                  </span>
                )}
                {item.badge === 'new' && (
                  <span className="px-2.5 py-1 text-[11px] font-bold uppercase rounded-full bg-emerald-600 text-white shadow-xs">
                    New Item
                  </span>
                )}
              </div>

              {/* Status Ribbon */}
              <div className="absolute bottom-3 right-3">
                {item.isAvailable ? (
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500 text-white shadow-xs flex items-center gap-1">
                    <CheckCircle2 size={12} /> In Stock
                  </span>
                ) : (
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-stone-800 text-white shadow-xs flex items-center gap-1">
                    <XCircle size={12} /> Sold Out
                  </span>
                )}
              </div>
            </div>

            {/* Title & Price Header */}
            <div>
              <div className="flex items-start justify-between gap-3">
                <h2
                  className="text-[22px] font-bold text-[#2C1A0E] leading-snug"
                  style={{ fontFamily: '"Playfair Display", Georgia, serif' }}
                >
                  {item.name}
                </h2>
                <span className="text-[22px] font-bold text-[#8C4A28] flex-shrink-0">
                  ₹{item.price}
                </span>
              </div>
              <p className="mt-2 text-[13px] text-[#8C705B] leading-relaxed">
                {item.description}
              </p>
            </div>

            {/* Quick Specs Grid */}
            <div className="grid grid-cols-2 gap-3 p-3.5 bg-[#FAF5EE] border border-[#EDE2D5] rounded-2xl">
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-[#C87D55]" />
                <div>
                  <p className="text-[10px] text-[#A08878] uppercase font-bold">
                    Prep Time
                  </p>
                  <p className="text-[13px] font-bold text-[#2C1A0E]">
                    {item.prepTimeMinutes} mins
                  </p>
                </div>
              </div>

              <div>
                <p className="text-[10px] text-[#A08878] uppercase font-bold">
                  Dietary
                </p>
                <p className="text-[13px] font-bold text-[#2C1A0E]">
                  {item.dietary === 'veg'
                    ? '🌱 Vegetarian'
                    : item.dietary === 'vegan'
                    ? '🌿 100% Vegan'
                    : '🍗 Non-Vegetarian'}
                </p>
              </div>

              {item.calories && (
                <div>
                  <p className="text-[10px] text-[#A08878] uppercase font-bold">
                    Energy
                  </p>
                  <p className="text-[13px] font-bold text-[#2C1A0E]">
                    {item.calories} kcal
                  </p>
                </div>
              )}

              <div>
                <p className="text-[10px] text-[#A08878] uppercase font-bold">
                  Category
                </p>
                <p className="text-[13px] font-bold text-[#2C1A0E] capitalize">
                  {item.category.replace('_', ' ')}
                </p>
              </div>
            </div>

            {/* Ingredients Section */}
            {item.ingredients && item.ingredients.length > 0 && (
              <div>
                <h4 className="text-[12px] font-bold text-[#2C1A0E] uppercase tracking-wider mb-2">
                  Ingredients
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {item.ingredients.map((ing, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-lg text-[12px] font-medium bg-[#FAF5EE] text-[#7A614E] border border-[#EADBCC]"
                    >
                      {ing}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Allergens warning */}
            {item.allergens && item.allergens.length > 0 && (
              <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-xl">
                <span className="text-[11px] font-bold text-amber-900 block mb-0.5">
                  ⚠️ Allergen Notice
                </span>
                <p className="text-[11px] text-amber-800">
                  Contains: {item.allergens.join(', ')}
                </p>
              </div>
            )}

            {/* Admin Profit Insights (Hidden from staff) */}
            {isAdmin && item.costPrice && (
              <div className="p-3.5 bg-emerald-50/50 border border-emerald-200 rounded-2xl space-y-2">
                <div className="flex items-center gap-1.5 text-emerald-800 font-bold text-[12px]">
                  <ShieldCheck size={14} />
                  <span>Admin Cost & Profit Breakdown</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center pt-1">
                  <div className="p-2 bg-white rounded-xl border border-emerald-100">
                    <span className="text-[10px] text-[#A08878] block">Cost</span>
                    <span className="font-bold text-[13px] text-[#2C1A0E]">
                      ₹{item.costPrice}
                    </span>
                  </div>
                  <div className="p-2 bg-white rounded-xl border border-emerald-100">
                    <span className="text-[10px] text-[#A08878] block">Profit</span>
                    <span className="font-bold text-[13px] text-emerald-700">
                      ₹{profit}
                    </span>
                  </div>
                  <div className="p-2 bg-white rounded-xl border border-emerald-100">
                    <span className="text-[10px] text-[#A08878] block">Margin</span>
                    <span className="font-bold text-[13px] text-emerald-700">
                      +{marginPercent}%
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer Action Buttons */}
          <div className="p-4 border-t border-[#EDE2D5] bg-[#FDFBF7] flex items-center justify-between gap-3">
            {isAdmin ? (
              <>
                <button
                  type="button"
                  onClick={() => onToggleStock(item.id)}
                  className={`px-4 py-2.5 rounded-full text-[12px] font-bold border transition-all ${
                    item.isAvailable
                      ? 'border-stone-300 text-stone-700 hover:bg-stone-100'
                      : 'border-emerald-500 bg-emerald-50 text-emerald-700'
                  }`}
                >
                  {item.isAvailable ? 'Mark Sold Out' : 'Mark Available'}
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      onClose()
                      onDelete(item)
                    }}
                    className="p-2.5 rounded-full text-stone-400 hover:text-red-600 hover:bg-red-50 border border-transparent hover:border-red-200 transition-all"
                    title="Delete Item"
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
                    <span>Edit Item</span>
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
