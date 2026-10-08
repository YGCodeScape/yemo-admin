'use client'

import React, { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import {
  Search,
  ShoppingBag,
  Sparkles,
  Clock,
  CheckCircle2,
  CookingPot,
} from 'lucide-react'
import { useAdminStore, Order, OrderStatus } from '@/store/useAdminStore'
import OrdersTableList from '@/components/orders/OrdersTableList'
import OrderDetailDrawer from '@/components/orders/OrderDetailDrawer'

function OrdersContent() {
  const searchParams = useSearchParams()
  const orders = useAdminStore((s) => s.orders)

  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [highlightId, setHighlightId] = useState<string | null>(null)

  // Handle URL deep-linking query param: e.g. /orders?highlight=YMO-1048
  useEffect(() => {
    const targetId = searchParams.get('highlight') || searchParams.get('order')
    if (targetId) {
      setHighlightId(targetId)

      // Find the order
      const targetOrder = orders.find(
        (o) => o.id.toLowerCase() === targetId.toLowerCase()
      )
      if (targetOrder) {
        setSelectedOrder(targetOrder)
      }

      // Smooth scroll to the highlighted row after render
      setTimeout(() => {
        const el = document.getElementById(`order-row-${targetId}`)
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }
      }, 350)
    }
  }, [searchParams, orders])

  // Filter orders based on search and status tab
  const filteredOrders = orders.filter((order) => {
    // 1. Status Filter
    if (statusFilter === 'active' && order.status === 'completed') return false
    if (statusFilter !== 'all' && statusFilter !== 'active' && order.status !== statusFilter) return false

    // 2. Search Query Filter
    if (!searchQuery.trim()) return true
    const q = searchQuery.toLowerCase()
    const matchesId = order.id.toLowerCase().includes(q)
    const matchesTable = `table ${order.tableNumber}`.toLowerCase().includes(q)
    const matchesCustomer = (order.customerName || '').toLowerCase().includes(q)
    const matchesItems = order.items.some((it) => it.name.toLowerCase().includes(q))

    return matchesId || matchesTable || matchesCustomer || matchesItems
  })

  const activeCount = orders.filter((o) => o.status !== 'completed').length
  const preparingCount = orders.filter((o) => o.status === 'preparing').length
  const completedCount = orders.filter((o) => o.status === 'completed').length

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-[1600px] mx-auto pb-20">
      {/* ── Top Header ── */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1
              className="text-[26px] sm:text-[30px] font-bold text-[#2C1A0E] tracking-tight leading-tight"
              style={{ fontFamily: '"Playfair Display", Georgia, serif' }}
            >
              Orders Management
            </h1>
            <span className="text-[12px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              {activeCount} live active
            </span>
          </div>
          <p className="text-[13px] text-[#A08878] mt-1 font-medium">
            Track incoming café table orders, update kitchen status, and inspect bill receipts.
          </p>
        </div>

        {/* Order Count Summary Pill */}
        <div className="flex items-center gap-2 bg-white border border-[#EDE2D5] px-3.5 py-2 rounded-xl text-[12px] font-semibold text-[#8C7362] shadow-2xs">
          <ShoppingBag size={14} className="text-[#C87D55]" />
          <span>{orders.length} Total Orders Tracked</span>
        </div>
      </div>

      {/* ── Search & Filter Controls ── */}
      <div className="bg-white border border-[#EDE2D5] rounded-2xl p-4 shadow-2xs flex flex-wrap items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[260px] max-w-md">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A08878]"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Order ID, Table #, Customer or item..."
            className="w-full pl-10 pr-4 py-2 bg-[#FAF7F4] border border-[#EBDCCF] rounded-xl text-[13px] text-[#2C1A0E] placeholder-[#B59F8F] focus:outline-none focus:ring-2 focus:ring-[#C87D55]/25 focus:border-[#C87D55] transition-all font-medium"
          />
        </div>

        {/* Status Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 text-[12px]">
          {[
            { id: 'all', label: 'All Orders', count: orders.length },
            { id: 'active', label: 'Active', count: activeCount },
            { id: 'preparing', label: 'Preparing', count: preparingCount },
            { id: 'completed', label: 'Completed', count: completedCount },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
                statusFilter === tab.id
                  ? 'bg-[#FAF5EE] text-[#8C4A28] border border-[#EBDCCF]'
                  : 'text-[#8C7362] hover:bg-[#FAF7F4] hover:text-[#2C1A0E]'
              }`}
            >
              <span>{tab.label}</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white border border-[#EBDCCF] text-[#8C7362]">
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Highlight Notification Banner (if redirected from Dashboard) ── */}
      {highlightId && (
        <div className="bg-amber-50/80 border border-amber-200/90 rounded-2xl p-3.5 flex items-center justify-between gap-3 text-[12px]">
          <div className="flex items-center gap-2.5 text-amber-950">
            <Sparkles size={16} className="text-[#C87D55]" />
            <span className="font-semibold">
              Currently focusing on Order <span className="font-mono font-bold">#{highlightId}</span> from Dashboard.
            </span>
          </div>
          <button
            onClick={() => setHighlightId(null)}
            className="text-[11px] font-bold text-amber-800 hover:underline"
          >
            Clear Highlight
          </button>
        </div>
      )}

      {/* ── Main Orders Table List View ── */}
      <OrdersTableList
        orders={filteredOrders}
        highlightId={highlightId}
        onSelectOrder={(order) => setSelectedOrder(order)}
      />

      {/* ── Slide-Over Order Detail Drawer ── */}
      <OrderDetailDrawer
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
      />
    </div>
  )
}

export default function OrdersPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 flex items-center justify-center">
          <div className="w-8 h-8 border-3 border-[#C87D55]/30 border-t-[#C87D55] rounded-full animate-spin" />
        </div>
      }
    >
      <OrdersContent />
    </Suspense>
  )
}
