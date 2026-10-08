'use client'

import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowRight, Utensils, CheckCircle2, Clock, Truck, ChevronRight } from 'lucide-react'
import { useAdminStore, OrderStatus } from '@/store/useAdminStore'
import { timeAgo } from '@/lib/utils'

export default function LiveOrdersTable() {
  const router = useRouter()
  const orders = useAdminStore((s) => s.orders)
  const updateOrderStatus = useAdminStore((s) => s.updateOrderStatus)
  const showToast = useAdminStore((s) => s.showToast)

  const activeOrders = orders.filter((o) => o.status !== 'completed')

  const handleNextStatus = (orderId: string, currentStatus: OrderStatus) => {
    let nextStatus: OrderStatus = 'completed'
    let actionLabel = 'Order completed'

    if (currentStatus === 'new' || currentStatus === 'confirmed') {
      nextStatus = 'preparing'
      actionLabel = 'Order is now Preparing in Kitchen 🍳'
    } else if (currentStatus === 'preparing') {
      nextStatus = 'on_the_way'
      actionLabel = 'Order is On the way to table ☕'
    } else if (currentStatus === 'on_the_way') {
      nextStatus = 'served'
      actionLabel = 'Order Marked as Served 🎉'
    }

    updateOrderStatus(orderId, nextStatus)
    showToast(actionLabel)
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
            <Truck size={10} className="text-blue-500" />
            On the way
          </span>
        )
      case 'served':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
            <CheckCircle2 size={10} className="text-purple-500" />
            Served
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

  const getActionButton = (orderId: string, status: OrderStatus) => {
    if (status === 'confirmed') {
      return (
        <button
          onClick={() => handleNextStatus(orderId, status)}
          className="px-3 py-1.5 bg-[#2C1A0E] hover:bg-[#1A0E07] text-white text-[11px] font-bold rounded-xl transition-all shadow-2xs active:scale-95"
        >
          Start Preparing
        </button>
      )
    }
    if (status === 'preparing') {
      return (
        <button
          onClick={() => handleNextStatus(orderId, status)}
          className="px-3 py-1.5 bg-[#C87D55] hover:bg-[#A9623D] text-white text-[11px] font-bold rounded-xl transition-all shadow-2xs active:scale-95"
        >
          Bring to Table
        </button>
      )
    }
    if (status === 'on_the_way') {
      return (
        <button
          onClick={() => handleNextStatus(orderId, status)}
          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold rounded-xl transition-all shadow-2xs active:scale-95"
        >
          Mark Served
        </button>
      )
    }
    return (
      <span className="text-[11px] font-semibold text-[#A08878] italic">
        Ready
      </span>
    )
  }

  return (
    <div className="bg-white border border-[#EDE2D5] rounded-2xl p-5 shadow-2xs">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <h3 className="text-[15px] font-bold text-[#2C1A0E]">
            Live Orders
          </h3>
          <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            {activeOrders.length} active
          </span>
        </div>

        <Link
          href="/orders"
          className="text-[12px] font-semibold text-[#8C4A28] hover:text-[#2C1A0E] flex items-center gap-1 group transition-colors"
        >
          <span>View all orders</span>
          <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      {/* Orders Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#F2EAE1] text-[11px] font-bold text-[#A08878] uppercase tracking-wider">
              <th className="pb-2.5 font-bold">Order ID</th>
              <th className="pb-2.5 font-bold">Table</th>
              <th className="pb-2.5 font-bold">Items</th>
              <th className="pb-2.5 font-bold">Status</th>
              <th className="pb-2.5 font-bold">Time</th>
              <th className="pb-2.5 font-bold text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#FAF5EE] text-[12px]">
            {activeOrders.slice(0, 5).map((order) => {
              const summaryItems = order.items
                .map((it) => `${it.quantity > 1 ? `${it.quantity}× ` : ''}${it.name}`)
                .join(', ')

              return (
                <tr
                  key={order.id}
                  onClick={() => router.push(`/orders?highlight=${order.id}`)}
                  className="hover:bg-[#FAF5EE] transition-all cursor-pointer group"
                >
                  <td className="py-3 font-mono font-bold text-[#2C1A0E] group-hover:text-[#8C4A28] flex items-center gap-1.5">
                    <span>#{order.id}</span>
                    <ChevronRight size={12} className="opacity-0 group-hover:opacity-100 text-[#C87D55] transition-opacity" />
                  </td>
                  <td className="py-3 font-semibold text-[#8C4A28]">
                    Table {order.tableNumber}
                  </td>
                  <td className="py-3 max-w-[200px] truncate text-[#4A3324] font-medium" title={summaryItems}>
                    {summaryItems}
                  </td>
                  <td className="py-3">
                    {getStatusBadge(order.status)}
                  </td>
                  <td className="py-3 text-[#A08878] text-[11px]">
                    {timeAgo(order.createdAt)}
                  </td>
                  <td className="py-3 text-right" onClick={(e) => e.stopPropagation()}>
                    {getActionButton(order.id, order.status)}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
