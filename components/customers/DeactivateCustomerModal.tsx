'use client'

import React from 'react'
import { UserX, UserCheck, AlertCircle } from 'lucide-react'
import { Customer } from '@/store/useAdminStore'

interface DeactivateCustomerModalProps {
  isOpen: boolean
  customer: Customer | null
  onClose: () => void
  onConfirm: () => void
}

export default function DeactivateCustomerModal({
  isOpen,
  customer,
  onClose,
  onConfirm,
}: DeactivateCustomerModalProps) {
  if (!isOpen || !customer) return null

  const isCurrentlyActive = customer.status !== 'inactive'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="w-full max-w-md bg-white rounded-3xl border border-[#EDE2D5] shadow-2xl p-6 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-start gap-4">
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 border ${
              isCurrentlyActive
                ? 'bg-amber-50 border-amber-200 text-amber-700'
                : 'bg-emerald-50 border-emerald-200 text-emerald-700'
            }`}
          >
            {isCurrentlyActive ? <UserX size={24} /> : <UserCheck size={24} />}
          </div>

          <div className="flex-1">
            <h3
              className="text-[18px] font-bold text-[#2C1A0E] mb-1.5"
              style={{ fontFamily: '"Playfair Display", Georgia, serif' }}
            >
              {isCurrentlyActive
                ? 'Deactivate Customer Account?'
                : 'Reactivate Customer Account?'}
            </h3>
            <p className="text-[13px] text-[#8C705B] leading-relaxed">
              {isCurrentlyActive ? (
                <>
                  Are you sure you want to deactivate{' '}
                  <strong className="text-[#2C1A0E]">"{customer.name}"</strong>?
                  Their loyalty bean balance ({customer.loyaltyBeans} Beans) and dining history will remain safe, but their account cannot earn or redeem rewards until reactivated.
                </>
              ) : (
                <>
                  Reactivate account for{' '}
                  <strong className="text-[#2C1A0E]">"{customer.name}"</strong>?
                  They will immediately be able to earn and redeem loyalty beans at any table.
                </>
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-[#EDE2D5]">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-[13px] font-semibold text-[#8C705B] hover:text-[#2C1A0E] hover:bg-[#FAF5EE] transition-all"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm()
              onClose()
            }}
            className={`px-5 py-2.5 rounded-xl text-[13px] font-bold text-white shadow-xs transition-all ${
              isCurrentlyActive
                ? 'bg-amber-700 hover:bg-amber-800'
                : 'bg-emerald-600 hover:bg-emerald-700'
            }`}
          >
            {isCurrentlyActive ? 'Deactivate Account' : 'Reactivate Account'}
          </button>
        </div>
      </div>
    </div>
  )
}
