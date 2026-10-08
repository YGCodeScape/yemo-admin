'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  Receipt,
  User,
  Clock,
  Printer,
  Ban,
  CheckCircle2,
  Truck,
  CookingPot,
  ArrowRight,
} from 'lucide-react'
import { Order, OrderStatus, useAdminStore } from '@/store/useAdminStore'
import { formatCurrency, formatTime, formatDate } from '@/lib/utils'

interface OrderDetailDrawerProps {
  order: Order | null
  onClose: () => void
}

export default function OrderDetailDrawer({
  order,
  onClose,
}: OrderDetailDrawerProps) {
  const updateOrderStatus = useAdminStore((s) => s.updateOrderStatus)
  const cancelOrder = useAdminStore((s) => s.cancelOrder)
  const showToast = useAdminStore((s) => s.showToast)

  if (!order) return null

  const handleStatusChange = (newStatus: OrderStatus) => {
    updateOrderStatus(order.id, newStatus)
    showToast(`Order #${order.id} status updated to ${newStatus}`)
  }

  const handleCancel = () => {
    if (confirm(`Are you sure you want to cancel order #${order.id}?`)) {
      cancelOrder(order.id)
      showToast(`Order #${order.id} has been cancelled`)
      onClose()
    }
  }

  const handlePrint = () => {
    showToast(`Printing receipt for Order #${order.id}... 🖨️`)
  }

  const steps: { key: OrderStatus; label: string; icon: React.ElementType }[] = [
    { key: 'confirmed', label: 'Confirmed', icon: CheckCircle2 },
    { key: 'preparing', label: 'Preparing', icon: CookingPot },
    { key: 'on_the_way', label: 'On the way', icon: Truck },
    { key: 'served', label: 'Served', icon: CheckCircle2 },
    { key: 'completed', label: 'Completed', icon: CheckCircle2 },
  ]

  const currentStepIndex = steps.findIndex((s) => s.key === order.status)

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex justify-end">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/40 backdrop-blur-2xs"
        />

        {/* Drawer Content */}
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 28, stiffness: 280 }}
          className="relative w-full max-w-md bg-white h-full shadow-2xl border-l border-[#EDE2D5] z-10 flex flex-col justify-between overflow-hidden"
        >
          {/* Header */}
          <div className="p-6 border-b border-[#F2ECE5] flex items-center justify-between bg-[#FDFAF6]">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-[18px] text-[#2C1A0E]">
                  #{order.id}
                </span>
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#FAF5EE] text-[#8C4A28] border border-[#EBDCCF]">
                  Table {order.tableNumber}
                </span>
              </div>
              <p className="text-[11px] text-[#A08878] mt-0.5">
                {formatDate(order.createdAt)} at {formatTime(order.createdAt)}
              </p>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white border border-[#EBDCCF] flex items-center justify-center text-[#2C1A0E] hover:bg-[#FAF5EE] transition-all"
            >
              <X size={16} />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 sidebar-scrollbar">
            {/* Status Progress Stepper */}
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-[#A08878] mb-3">
                Order Timeline
              </p>
              <div className="flex items-center justify-between relative">
                {/* Connecting Line */}
                <div className="absolute top-3 left-4 right-4 h-0.5 bg-[#F0E6DC] -z-0" />
                <div
                  className="absolute top-3 left-4 h-0.5 bg-[#C87D55] transition-all duration-300 -z-0"
                  style={{
                    width: `${Math.max(
                      0,
                      (Math.min(currentStepIndex, steps.length - 1) /
                        (steps.length - 1)) *
                        100
                    )}%`,
                  }}
                />

                {steps.map((st, idx) => {
                  const isDone = idx <= currentStepIndex
                  const isCurrent = idx === currentStepIndex

                  return (
                    <div key={st.key} className="flex flex-col items-center relative z-10">
                      <button
                        onClick={() => handleStatusChange(st.key)}
                        className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                          isDone
                            ? 'bg-[#C87D55] text-white shadow-xs'
                            : 'bg-white border-2 border-[#D8C7B8] text-[#A08878]'
                        } ${isCurrent ? 'ring-4 ring-[#C87D55]/20 scale-110' : ''}`}
                        title={`Set to ${st.label}`}
                      >
                        <span className="text-[10px] font-bold">{idx + 1}</span>
                      </button>
                      <span
                        className={`text-[9px] font-semibold mt-1.5 ${
                          isDone ? 'text-[#2C1A0E]' : 'text-[#B09988]'
                        }`}
                      >
                        {st.label}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Customer Details Card */}
            <div className="bg-[#FAF5EE] rounded-2xl p-4 border border-[#EBDCCF] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-white border border-[#EBDCCF] flex items-center justify-center text-[#8C4A28] font-bold text-[13px]">
                  <User size={16} />
                </div>
                <div>
                  <p className="text-[13px] font-bold text-[#2C1A0E]">
                    {order.customerName || 'Café Guest'}
                  </p>
                  <p className="text-[11px] text-[#8C7362]">
                    Dine-in · Table {order.tableNumber}
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                Verified
              </span>
            </div>

            {/* Order Items Breakdown */}
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#A08878]">
                  Order Items
                </p>
                <span className="text-[11px] text-[#8C7362] font-semibold">
                  {order.items.reduce((acc, it) => acc + it.quantity, 0)} items total
                </span>
              </div>

              <div className="border border-[#EDE2D5] rounded-2xl divide-y divide-[#F2ECE5] overflow-hidden bg-white">
                {order.items.map((item, i) => (
                  <div key={i} className="p-3.5 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="w-6 h-6 rounded-lg bg-[#FAF5EE] text-[#8C4A28] text-[11px] font-bold flex items-center justify-center border border-[#EBDCCF]">
                        {item.quantity}×
                      </span>
                      <div>
                        <p className="text-[13px] font-bold text-[#2C1A0E]">
                          {item.name}
                        </p>
                        <p className="text-[10px] text-[#A08878]">
                          {formatCurrency(item.price)} each
                        </p>
                      </div>
                    </div>
                    <span className="font-bold text-[13px] text-[#2C1A0E]">
                      {formatCurrency(item.price * item.quantity)}
                    </span>
                  </div>
                ))}

                {/* Subtotal & Total */}
                <div className="p-3.5 bg-[#FCF9F6] space-y-1.5 text-[12px]">
                  <div className="flex justify-between text-[#8C7362]">
                    <span>Subtotal</span>
                    <span>{formatCurrency(order.total)}</span>
                  </div>
                  <div className="flex justify-between text-[#8C7362]">
                    <span>Taxes &amp; Café Surcharge (incl.)</span>
                    <span>₹0</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-[#EBDCCF] text-[15px] font-bold text-[#2C1A0E]">
                    <span>Total Amount</span>
                    <span>{formatCurrency(order.total)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="p-4 border-t border-[#EDE2D5] bg-[#FDFAF6] space-y-2">
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrint}
                className="flex-1 py-2.5 bg-white border border-[#EBDCCF] hover:bg-[#FAF5EE] text-[#2C1A0E] text-[12px] font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-2xs active:scale-95"
              >
                <Printer size={14} />
                <span>Print Bill</span>
              </button>

              {order.status !== 'completed' ? (
                <button
                  onClick={() => {
                    const nextMap: Record<OrderStatus, OrderStatus> = {
                      new: 'confirmed',
                      confirmed: 'preparing',
                      preparing: 'on_the_way',
                      on_the_way: 'served',
                      served: 'completed',
                      completed: 'completed',
                    }
                    handleStatusChange(nextMap[order.status])
                  }}
                  className="flex-1 py-2.5 bg-[#C87D55] hover:bg-[#B36942] text-white text-[12px] font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-2xs active:scale-95"
                >
                  <span>Advance Status</span>
                  <ArrowRight size={14} />
                </button>
              ) : (
                <span className="flex-1 py-2.5 bg-emerald-100 text-emerald-800 text-[12px] font-bold rounded-xl flex items-center justify-center gap-1.5">
                  <CheckCircle2 size={14} />
                  <span>Order Closed</span>
                </span>
              )}
            </div>

            {order.status !== 'completed' && (
              <button
                onClick={handleCancel}
                className="w-full py-2 text-[11px] font-bold text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl transition-all"
              >
                Cancel / Void Order
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
