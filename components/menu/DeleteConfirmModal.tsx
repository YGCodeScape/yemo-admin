'use client'

import React from 'react'
import { AlertTriangle, Trash2, X } from 'lucide-react'
import { MenuItem } from '@/store/useAdminStore'

interface DeleteConfirmModalProps {
  isOpen: boolean
  item: MenuItem | null
  onClose: () => void
  onConfirm: () => void
}

export default function DeleteConfirmModal({
  isOpen,
  item,
  onClose,
  onConfirm,
}: DeleteConfirmModalProps) {
  if (!isOpen || !item) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="w-full max-w-md bg-white rounded-3xl border border-[#EDE2D5] shadow-2xl p-6 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-red-50 border border-red-200 text-red-600 flex items-center justify-center flex-shrink-0">
            <Trash2 size={24} />
          </div>

          <div className="flex-1">
            <h3
              className="text-[18px] font-bold text-[#2C1A0E] mb-1.5"
              style={{ fontFamily: '"Playfair Display", Georgia, serif' }}
            >
              Delete Menu Item?
            </h3>
            <p className="text-[13px] text-[#8C705B] leading-relaxed">
              Are you sure you want to remove{' '}
              <span className="font-bold text-[#2C1A0E]">"{item.name}"</span> (₹{item.price}) from the café menu? This item will no longer appear on customer QR menus.
            </p>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-[#F2EAE0]">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-full border border-[#EDE2D5] text-[13px] font-bold text-[#7A614E] hover:bg-[#FAF5EE] transition-all"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm()
              onClose()
            }}
            className="px-5 py-2 rounded-full bg-red-600 text-white text-[13px] font-bold hover:bg-red-700 transition-all active:scale-95 shadow-sm"
          >
            Delete Item
          </button>
        </div>
      </div>
    </div>
  )
}
