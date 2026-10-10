'use client'

import React, { useState, useEffect } from 'react'
import { X, Sliders, Plus, Minus, ArrowRight, CheckCircle2, AlertTriangle } from 'lucide-react'
import { InventoryItem } from '@/store/useAdminStore'

interface AdjustStockModalProps {
  isOpen: boolean
  item: InventoryItem | null
  onClose: () => void
  onConfirm: (id: string, newQuantity: number, reason: string) => void
}

export default function AdjustStockModal({
  isOpen,
  item,
  onClose,
  onConfirm,
}: AdjustStockModalProps) {
  const [newQuantity, setNewQuantity] = useState<number>(0)
  const [reason, setReason] = useState<string>('Routine Restock')

  useEffect(() => {
    if (item) {
      setNewQuantity(item.currentStock)
      setReason('Routine Restock')
    }
  }, [item, isOpen])

  if (!isOpen || !item) return null

  const handleQuickAdd = (delta: number) => {
    setNewQuantity((prev) => Math.max(0, parseFloat((prev + delta).toFixed(2))))
    if (delta > 0 && reason === 'Physical Stock Audit Correction') {
      setReason('Routine Restock')
    } else if (delta < 0 && reason === 'Routine Restock') {
      setReason('Waste / Spoilage / Damage')
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onConfirm(item.id, newQuantity, reason)
    onClose()
  }

  const diff = parseFloat((newQuantity - item.currentStock).toFixed(2))

  // Preview next status
  const previewStatus =
    newQuantity <= 0 ? 'out_of_stock' : newQuantity <= item.minThreshold ? 'low' : 'ok'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="w-full max-w-lg bg-white rounded-3xl border border-[#EDE2D5] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4.5 border-b border-[#EDE2D5] flex items-center justify-between bg-[#FDFBF7]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#FAF5EE] text-[#8C4A28] border border-[#EADBCC] flex items-center justify-center">
              <Sliders size={18} />
            </div>
            <div>
              <h3
                className="text-[18px] font-bold text-[#2C1A0E] leading-tight"
                style={{ fontFamily: '"Playfair Display", Georgia, serif' }}
              >
                Quick Stock Adjustment
              </h3>
              <p className="text-[12px] text-[#A08878] font-mono">{item.sku}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#A08878] hover:text-[#2C1A0E] hover:bg-black/5 rounded-full transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Target Item summary banner */}
          <div className="p-4 bg-[#FAF5EE] border border-[#EDE2D5] rounded-2xl flex items-center justify-between">
            <div>
              <p className="text-[14px] font-bold text-[#2C1A0E]">{item.name}</p>
              <p className="text-[11px] text-[#8C705B]">
                Threshold: {item.minThreshold} {item.unit} • Location: {item.storageLocation}
              </p>
            </div>
            <div className="text-right">
              <span className="text-[11px] text-[#A08878] block">Current</span>
              <span className="text-[18px] font-bold text-[#2C1A0E]">
                {item.currentStock} {item.unit}
              </span>
            </div>
          </div>

          {/* Quick Delta Buttons */}
          <div>
            <label className="block text-[11px] font-bold text-[#A08878] uppercase tracking-wider mb-2">
              Quick Adjustment Buttons
            </label>
            <div className="grid grid-cols-6 gap-2">
              {[-5, -1, 1, 5, 10, 25].map((delta) => (
                <button
                  key={delta}
                  type="button"
                  onClick={() => handleQuickAdd(delta)}
                  className={`py-2 rounded-xl text-[12px] font-bold transition-all border ${
                    delta < 0
                      ? 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100'
                      : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                  }`}
                >
                  {delta > 0 ? `+${delta}` : delta}
                </button>
              ))}
            </div>
          </div>

          {/* New Quantity Input */}
          <div>
            <label className="block text-[12px] font-bold text-[#2C1A0E] mb-1.5">
              New Total Quantity ({item.unit}) *
            </label>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => handleQuickAdd(-1)}
                className="w-11 h-11 rounded-2xl border border-[#EDE2D5] bg-[#FAF5EE] text-[#2C1A0E] flex items-center justify-center font-bold hover:bg-[#F2E7D8]"
              >
                <Minus size={18} />
              </button>
              <input
                type="number"
                required
                step="any"
                min={0}
                value={newQuantity}
                onChange={(e) => setNewQuantity(parseFloat(e.target.value) || 0)}
                className="flex-1 px-4 py-2.5 bg-white border border-[#EBDCCF] rounded-2xl text-[18px] font-bold text-[#2C1A0E] text-center focus:outline-none focus:ring-2 focus:ring-[#C87D55]/30 focus:border-[#C87D55]"
              />
              <button
                type="button"
                onClick={() => handleQuickAdd(1)}
                className="w-11 h-11 rounded-2xl border border-[#EDE2D5] bg-[#FAF5EE] text-[#2C1A0E] flex items-center justify-center font-bold hover:bg-[#F2E7D8]"
              >
                <Plus size={18} />
              </button>
            </div>
          </div>

          {/* Adjustment Reason */}
          <div>
            <label className="block text-[12px] font-bold text-[#2C1A0E] mb-1.5">
              Reason for Adjustment *
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-[#EBDCCF] rounded-xl text-[13px] text-[#2C1A0E] focus:outline-none focus:ring-2 focus:ring-[#C87D55]/30"
            >
              <option value="Routine Restock">📦 Routine Restock (Shipment Received)</option>
              <option value="Physical Stock Audit Correction">📋 Physical Audit Count Correction</option>
              <option value="Daily Barista Consumption">☕ Daily Barista Prep / Kitchen Usage</option>
              <option value="Waste / Spoilage / Damage">⚠️ Damaged / Expired / Spilled</option>
            </select>
          </div>

          {/* Change Comparison Preview */}
          <div className="p-3.5 bg-[#FAF7F4] border border-[#EDE2D5] rounded-2xl flex items-center justify-between text-[12px]">
            <div className="flex items-center gap-2">
              <span className="text-[#8C705B]">
                {item.currentStock} {item.unit}
              </span>
              <ArrowRight size={14} className="text-[#A08878]" />
              <span className="font-bold text-[#2C1A0E]">
                {newQuantity} {item.unit}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span
                className={`font-bold px-2 py-0.5 rounded-full text-[10px] ${
                  diff > 0
                    ? 'bg-emerald-100 text-emerald-800'
                    : diff < 0
                    ? 'bg-red-100 text-red-800'
                    : 'bg-stone-100 text-stone-600'
                }`}
              >
                {diff > 0 ? `+${diff}` : diff} {item.unit}
              </span>

              {previewStatus === 'ok' && (
                <span className="text-emerald-700 font-bold flex items-center gap-1">
                  <CheckCircle2 size={13} /> Healthy
                </span>
              )}
              {previewStatus === 'low' && (
                <span className="text-amber-700 font-bold flex items-center gap-1">
                  <AlertTriangle size={13} /> Low Stock
                </span>
              )}
              {previewStatus === 'out_of_stock' && (
                <span className="text-red-700 font-bold">Out of Stock</span>
              )}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-2 border-t border-[#EDE2D5] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-full border border-[#EDE2D5] text-[13px] font-bold text-[#7A614E] hover:bg-[#FAF5EE] transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-full bg-[#2C1A0E] text-white text-[13px] font-bold hover:bg-[#1E110A] transition-all active:scale-95 shadow-sm"
            >
              Confirm Adjustment
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
