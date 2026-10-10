'use client'

import React from 'react'
import Image from 'next/image'
import {
  Clock,
  Sparkles,
  Flame,
  Check,
  X,
  Edit3,
  Trash2,
  Eye,
  MoreVertical,
} from 'lucide-react'
import { MenuItem } from '@/store/useAdminStore'

interface MenuItemCardProps {
  item: MenuItem
  isAdmin: boolean
  onEdit: (item: MenuItem) => void
  onDelete: (item: MenuItem) => void
  onView: (item: MenuItem) => void
  onToggleStock: (id: string) => void
}

export default function MenuItemCard({
  item,
  isAdmin,
  onEdit,
  onDelete,
  onView,
  onToggleStock,
}: MenuItemCardProps) {
  // Dietary icon & label
  const renderDietaryIcon = () => {
    switch (item.dietary) {
      case 'veg':
        return (
          <span
            className="w-4 h-4 border border-emerald-600 rounded-xs flex items-center justify-center p-0.5 bg-white shadow-2xs"
            title="Vegetarian"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
          </span>
        )
      case 'vegan':
        return (
          <span
            className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200"
            title="100% Plant-Based Vegan"
          >
            🌿 Vegan
          </span>
        )
      case 'non_veg':
        return (
          <span
            className="w-4 h-4 border border-red-600 rounded-xs flex items-center justify-center p-0.5 bg-white shadow-2xs"
            title="Non-Vegetarian"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-red-600" />
          </span>
        )
    }
  }

  // Badge rendering
  const renderBadge = () => {
    if (!item.badge) return null
    switch (item.badge) {
      case 'bestseller':
        return (
          <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full bg-amber-500 text-white shadow-xs flex items-center gap-1">
            <Flame size={10} className="fill-white" /> Bestseller
          </span>
        )
      case 'seasonal':
        return (
          <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full bg-purple-600 text-white shadow-xs flex items-center gap-1">
            <Sparkles size={10} /> Seasonal
          </span>
        )
      case 'new':
        return (
          <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full bg-emerald-600 text-white shadow-xs">
            New
          </span>
        )
      case 'chef_special':
        return (
          <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full bg-[#C87D55] text-white shadow-xs">
            Chef Special
          </span>
        )
    }
  }

  return (
    <div
      onClick={() => onView(item)}
      className={`group relative bg-white border rounded-2xl overflow-hidden transition-all duration-200 flex flex-col cursor-pointer hover:shadow-md hover:border-[#D9C4B0] ${
        item.isAvailable
          ? 'border-[#EDE2D5]'
          : 'border-stone-200 opacity-85 bg-stone-50/50'
      }`}
    >
      {/* ── Top Photo Section ── */}
      <div className="relative h-44 w-full bg-[#F5EFE6] overflow-hidden">
        <Image
          src={item.image || '/assets/cafe_storefront.jpg'}
          alt={item.name}
          fill
          className={`object-cover transition-transform duration-300 group-hover:scale-105 ${
            !item.isAvailable ? 'grayscale-[40%]' : ''
          }`}
        />

        {/* Top Badges Overlay */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
          <div className="flex items-center gap-1.5">
            {renderDietaryIcon()}
            {renderBadge()}
          </div>

          {/* Availability Pill */}
          {!item.isAvailable && (
            <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-stone-900/80 backdrop-blur-xs text-white border border-stone-700">
              Sold Out
            </span>
          )}
        </div>

        {/* Prep Time Tag */}
        <div className="absolute bottom-2 left-2.5 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-xs text-white text-[10px] font-medium flex items-center gap-1">
          <Clock size={10} />
          <span>{item.prepTimeMinutes} mins</span>
        </div>
      </div>

      {/* ── Content Body ── */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Header Row: Title & Price */}
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-bold text-[15px] text-[#2C1A0E] group-hover:text-[#C87D55] transition-colors leading-snug line-clamp-1">
              {item.name}
            </h3>
            <span className="text-[15px] font-bold text-[#8C4A28] flex-shrink-0">
              ₹{item.price}
            </span>
          </div>

          {/* Description */}
          <p className="mt-1 text-[12px] text-[#8C705B] line-clamp-2 leading-relaxed">
            {item.description}
          </p>

          {/* Ingredients Preview */}
          {item.ingredients && item.ingredients.length > 0 && (
            <div className="mt-2.5 flex flex-wrap gap-1">
              {item.ingredients.slice(0, 3).map((ing, i) => (
                <span
                  key={i}
                  className="px-1.5 py-0.5 rounded text-[10px] bg-[#FAF5EE] text-[#7A614E] border border-[#EADBCC]"
                >
                  {ing}
                </span>
              ))}
              {item.ingredients.length > 3 && (
                <span className="px-1 text-[10px] text-[#A08878] self-center">
                  +{item.ingredients.length - 3} more
                </span>
              )}
            </div>
          )}
        </div>

        {/* ── Footer Row: Stock Switch & Admin Actions ── */}
        <div
          className="mt-4 pt-3 border-t border-[#F2EAE0] flex items-center justify-between"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Stock Toggle / Indicator */}
          {isAdmin ? (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onToggleStock(item.id)}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  item.isAvailable ? 'bg-emerald-500' : 'bg-stone-300'
                }`}
                title={item.isAvailable ? 'Click to mark Sold Out' : 'Click to mark In Stock'}
              >
                <span
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                    item.isAvailable ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
              <span
                className={`text-[11px] font-semibold ${
                  item.isAvailable ? 'text-emerald-700' : 'text-stone-500'
                }`}
              >
                {item.isAvailable ? 'In Stock' : 'Out of Stock'}
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              <span
                className={`w-2 h-2 rounded-full ${
                  item.isAvailable ? 'bg-emerald-500' : 'bg-stone-400'
                }`}
              />
              <span
                className={`text-[11px] font-semibold ${
                  item.isAvailable ? 'text-emerald-700' : 'text-stone-500'
                }`}
              >
                {item.isAvailable ? 'Available' : 'Unavailable'}
              </span>
            </div>
          )}

          {/* Action Buttons: Admin has Edit & Delete, Staff has View Details */}
          <div className="flex items-center gap-1">
            {isAdmin ? (
              <>
                <button
                  type="button"
                  onClick={() => onEdit(item)}
                  className="p-1.5 rounded-lg text-[#8C705B] hover:text-[#2C1A0E] hover:bg-[#FAF5EE] border border-transparent hover:border-[#E8DACB] transition-all"
                  title="Edit Menu Item"
                >
                  <Edit3 size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(item)}
                  className="p-1.5 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 border border-transparent hover:border-red-200 transition-all"
                  title="Delete Item"
                >
                  <Trash2 size={14} />
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => onView(item)}
                className="px-2.5 py-1 rounded-lg text-[11px] font-semibold text-[#8C4A28] bg-[#FAF5EE] hover:bg-[#F2E7D8] border border-[#EADBCC] flex items-center gap-1 transition-all"
              >
                <Eye size={12} />
                <span>Details</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
