'use client'

import React from 'react'
import {
  CheckCircle2,
  CookingPot,
  Truck,
  Eye,
  ArrowRight,
  Sparkles,
} from 'lucide-react'
import { Order, OrderStatus, useAdminStore } from '@/store/useAdminStore'
import { formatCurrency, formatTime, formatDate, timeAgo } from '@/lib/utils'

interface OrdersTableListProps {
  orders: Order[]
  highlightId: string | null
  onSelectOrder: (order: Order) => void
}

export default function OrdersTableList({
  orders,
  highlightId,
  onSelectOrder,
}: OrdersTableListProps) {
  const updateOrderStatus = useAdminStore((s) => s.updateOrderStatus)
  const showToast = useAdminStore((s) => s.showToast)

  const handleNextStatus = (e: React.MouseEvent, order: Order) => {
    e.stopPropagation()
    const nextMap: Record<OrderStatus, OrderStatus> = {
      new: 'confirmed',
      confirmed: 'preparing',
      preparing: 'on_the_way',
      on_the_way: 'served',
      served: 'completed',
      completed: 'completed',
    }
    const next = nextMap[order.status]
    updateOrderStatus(order.id, next)
    showToast(`Order #${order.id} status updated to ${next}`)
  }

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'confirmed':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Confirmed
          </span>
        )
      case 'preparing':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            Preparing
          </span>
        )
      case 'on_the_way':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
            <Truck size={11} className="text-blue-500" />
            On the way
          </span>
        )
      case 'served':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
            <CheckCircle2 size={11} className="text-purple-500" />
            Served
          </span>
        )
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-stone-100 text-stone-700 border border-stone-200">
            Completed
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
    <div className="bg-white border border-[#EDE2D5] rounded-2xl shadow-2xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#FDFAF6] border-b border-[#F2EAE1] text-[11px] font-bold text-[#A08878] uppercase tracking-wider">
              <th className="py-3.5 px-4 font-bold">Order ID</th>
              <th className="py-3.5 px-4 font-bold">Table</th>
              <th className="py-3.5 px-4 font-bold">Customer</th>
              <th className="py-3.5 px-4 font-bold">Items Summary</th>
              <th className="py-3.5 px-4 font-bold">Total</th>
              <th className="py-3.5 px-4 font-bold">Status</th>
              <th className="py-3.5 px-4 font-bold">Time</th>
              <th className="py-3.5 px-4 font-bold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#FAF5EE] text-[13px]">
            {orders.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-12 text-center text-[#A08878] italic">
                  No orders found matching the filter criteria.
                </td>
              </tr>
            ) : (
              orders.map((order) => {
                const isHighlighted = highlightId === order.id
                const summary = order.items
                  .map((it) => `${it.quantity > 1 ? `${it.quantity}× ` : ''}${it.name}`)
                  .join(', ')

                return (
                  <tr
                    key={order.id}
                    id={`order-row-${order.id}`}
                    onClick={() => onSelectOrder(order)}
                    className={`transition-all cursor-pointer ${
                      isHighlighted
                        ? 'bg-amber-50/80 border-l-4 border-l-[#C87D55] ring-1 ring-[#C87D55]/30'
                        : 'hover:bg-[#FCF9F6]'
                    }`}
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-[#2C1A0E]">
                      <div className="flex items-center gap-1.5">
                        <span>#{order.id}</span>
                        {isHighlighted && (
                          <span className="flex items-center gap-1 text-[9px] font-bold text-[#8C4A28] bg-amber-200/80 px-1.5 py-0.2 rounded-md">
                            <Sparkles size={10} />
                            Active Focus
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-semibold text-[#8C4A28]">
                      Table {order.tableNumber}
                    </td>

                    <td className="py-3.5 px-4 font-medium text-[#2C1A0E]">
                      {order.customerName || 'Café Guest'}
                    </td>

                    <td className="py-3.5 px-4 max-w-xs truncate text-[#5C4535]" title={summary}>
                      {summary}
                    </td>

                    <td className="py-3.5 px-4 font-bold text-[#2C1A0E]">
                      {formatCurrency(order.total)}
                    </td>

                    <td className="py-3.5 px-4">
                      {getStatusBadge(order.status)}
                    </td>

                    <td className="py-3.5 px-4 text-[#A08878] text-[12px]">
                      {timeAgo(order.createdAt)}
                    </td>

                    <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => onSelectOrder(order)}
                          className="p-1.5 text-[#8C7362] hover:text-[#2C1A0E] hover:bg-[#FAF5EE] rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye size={15} />
                        </button>

                        {order.status !== 'completed' && (
                          <button
                            onClick={(e) => handleNextStatus(e, order)}
                            className="px-2.5 py-1 bg-[#2C1A0E] hover:bg-[#C87D55] text-white text-[11px] font-bold rounded-lg flex items-center gap-1 transition-all shadow-2xs active:scale-95"
                          >
                            <span>Advance</span>
                            <ArrowRight size={11} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
