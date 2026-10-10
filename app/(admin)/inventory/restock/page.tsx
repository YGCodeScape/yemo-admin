'use client'

import React, { useState, useMemo } from 'react'
import {
  Plus,
  Search,
  FileText,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Building,
  DollarSign,
  Shield,
  Eye,
  Info,
  Zap,
} from 'lucide-react'
import {
  useAdminStore,
  RestockOrder,
} from '@/store/useAdminStore'
import { useAuthStore } from '@/store/useAuthStore'
import RestockOrderCard from '@/components/inventory/RestockOrderCard'
import RestockModal from '@/components/inventory/RestockModal'
import RestockDetailDrawer from '@/components/inventory/RestockDetailDrawer'

export default function RestockPage() {
  const user = useAuthStore((s) => s.user)
  const authRole = user?.role || 'admin'

  // Simulated role toggle for live interactive testing (defaults to user's real role)
  const [activeRole, setActiveRole] = useState<'admin' | 'staff'>(authRole)
  const isAdmin = activeRole === 'admin'

  // Store data & actions
  const restockOrders = useAdminStore((s) => s.restockOrders)
  const inventory = useAdminStore((s) => s.inventory)
  const addRestockOrder = useAdminStore((s) => s.addRestockOrder)
  const updateRestockStatus = useAdminStore((s) => s.updateRestockStatus)
  const createRestockFromLowStock = useAdminStore((s) => s.createRestockFromLowStock)
  const toastMessage = useAdminStore((s) => s.toastMessage)

  // Filters state
  const [statusFilter, setStatusFilter] = useState<'all' | 'received' | 'pending' | 'partially_received'>('all')
  const [supplierFilter, setSupplierFilter] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<'date_desc' | 'date_asc' | 'amount_desc' | 'po_asc'>('date_desc')

  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [drawerOrder, setDrawerOrder] = useState<RestockOrder | null>(null)

  // Unique suppliers for filter dropdown
  const uniqueSuppliers = useMemo(() => {
    const supps = new Set<string>()
    restockOrders.forEach((o) => supps.add(o.supplier))
    return Array.from(supps)
  }, [restockOrders])

  // Low stock supplies count in café inventory
  const lowStockCount = useMemo(() => {
    return inventory.filter((i) => i.status === 'low' || i.status === 'out_of_stock').length
  }, [inventory])

  // Summary Metrics
  const summary = useMemo(() => {
    const totalOrders = restockOrders.length
    const receivedOrders = restockOrders.filter((o) => o.status === 'received').length
    const pendingOrders = restockOrders.filter((o) => o.status === 'pending').length
    const partialOrders = restockOrders.filter((o) => o.status === 'partially_received').length
    const totalSpend = restockOrders.reduce((acc, curr) => acc + curr.totalAmount, 0)
    return {
      totalOrders,
      receivedOrders,
      pendingOrders,
      partialOrders,
      totalSpend,
    }
  }, [restockOrders])

  // Filtered & Sorted orders
  const filteredOrders = useMemo(() => {
    return restockOrders
      .filter((order) => {
        // Status filter
        if (statusFilter !== 'all' && order.status !== statusFilter) return false

        // Supplier filter
        if (supplierFilter !== 'all' && order.supplier !== supplierFilter) return false

        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase()
          const matchesPo = order.poNumber.toLowerCase().includes(q)
          const matchesSupplier = order.supplier.toLowerCase().includes(q)
          const matchesInv = order.supplierInvoiceNo?.toLowerCase().includes(q)
          const matchesItems = order.items.some((i) =>
            i.itemName.toLowerCase().includes(q)
          )
          if (!matchesPo && !matchesSupplier && !matchesInv && !matchesItems) {
            return false
          }
        }
        return true
      })
      .sort((a, b) => {
        if (sortBy === 'amount_desc') return b.totalAmount - a.totalAmount
        if (sortBy === 'po_asc') return a.poNumber.localeCompare(b.poNumber)
        if (sortBy === 'date_asc') return a.orderDate.localeCompare(b.orderDate)
        return b.orderDate.localeCompare(a.orderDate)
      })
  }, [restockOrders, statusFilter, supplierFilter, searchQuery, sortBy])

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      {/* ── Toast Notification ── */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#2C1A0E] text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 animate-in slide-in-from-bottom duration-200 border border-white/10 text-[13px] font-medium">
          <CheckCircle2 size={16} className="text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ── Top Header Row ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1
              className="text-[28px] font-bold text-[#2C1A0E] tracking-tight leading-none"
              style={{ fontFamily: '"Playfair Display", Georgia, serif' }}
            >
              Restock History & Purchase Orders
            </h1>
            <span className="px-3 py-1 rounded-full text-[12px] font-bold bg-[#FAF5EE] text-[#8C4A28] border border-[#EDE2D5]">
              {summary.totalOrders} Shipments
            </span>
          </div>
          <p className="text-[13px] text-[#8C705B] mt-1.5">
            Audit incoming vendor deliveries, invoices, receiving sign-offs, and supply restocking logs.
          </p>
        </div>

        {/* Role Switcher Pill & Admin Actions */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Live RBAC Role Testing Toggle */}
          <div className="flex items-center bg-[#FAF5EE] p-1 rounded-full border border-[#EDE2D5] text-[12px] font-semibold">
            <button
              type="button"
              onClick={() => setActiveRole('admin')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all ${
                isAdmin
                  ? 'bg-[#2C1A0E] text-white shadow-xs'
                  : 'text-[#8C705B] hover:text-[#2C1A0E]'
              }`}
              title="Full CRUD access: Log deliveries, create POs, and verify receipts"
            >
              <Shield size={13} />
              <span>Admin (CRUD)</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveRole('staff')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all ${
                !isAdmin
                  ? 'bg-[#2C1A0E] text-white shadow-xs'
                  : 'text-[#8C705B] hover:text-[#2C1A0E]'
              }`}
              title="Read-only view for staff members"
            >
              <Eye size={13} />
              <span>Staff (View Only)</span>
            </button>
          </div>

          {/* Admin Action Buttons */}
          {isAdmin && (
            <div className="flex items-center gap-2">
              {/* Smart 1-Click Restock Button for Low Items */}
              {lowStockCount > 0 && (
                <button
                  type="button"
                  onClick={createRestockFromLowStock}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-amber-500 hover:bg-amber-600 text-white text-[12px] font-bold transition-all active:scale-95 shadow-xs"
                  title="Generate a draft purchase order for all low-stock items"
                >
                  <Zap size={14} className="fill-white" />
                  <span>Restock Low Supplies ({lowStockCount})</span>
                </button>
              )}

              {/* Log New Restock */}
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#C87D55] text-white text-[13px] font-bold hover:bg-[#B36841] transition-all active:scale-95 shadow-xs"
              >
                <Plus size={16} />
                <span>Log New Restock</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── Staff View Only Banner (Shown when in staff view) ── */}
      {!isAdmin && (
        <div className="p-3.5 bg-amber-50/80 border border-amber-200/90 rounded-2xl flex items-center justify-between text-amber-900 text-[13px]">
          <div className="flex items-center gap-2.5">
            <Info size={17} className="text-[#C87D55] flex-shrink-0" />
            <span>
              <strong className="font-bold">Staff View Active:</strong> You have view-only access to restock history and vendor invoices. Generating purchase orders and marking shipments as received requires Admin permissions.
            </span>
          </div>
          <button
            onClick={() => setActiveRole('admin')}
            className="text-[12px] font-bold text-[#8C4A28] underline hover:text-[#2C1A0E] flex-shrink-0 ml-4"
          >
            Switch to Admin
          </button>
        </div>
      )}

      {/* ── 4 Stats Metric Cards ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* Cumulative Restock Spend */}
        <div className="bg-white border border-[#EDE2D5] rounded-2xl p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-bold text-[#A08878] uppercase tracking-wider">
              Total Spend
            </span>
            <div className="w-8 h-8 rounded-xl bg-[#FAF5EE] text-[#8C4A28] flex items-center justify-center">
              <DollarSign size={16} />
            </div>
          </div>
          <div className="mt-2 text-[24px] font-bold text-[#2C1A0E] leading-none">
            ₹{summary.totalSpend.toLocaleString('en-IN')}
          </div>
          <span className="text-[11px] text-[#A08878] mt-1 block">
            Across {summary.totalOrders} purchase orders
          </span>
        </div>

        {/* Completed Deliveries */}
        <div className="bg-white border border-[#EDE2D5] rounded-2xl p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-bold text-[#A08878] uppercase tracking-wider">
              Received Shipments
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 size={16} />
            </div>
          </div>
          <div className="mt-2 text-[24px] font-bold text-emerald-700 leading-none">
            {summary.receivedOrders}
          </div>
          <span className="text-[11px] text-emerald-600 mt-1 block">
            Audited & stocked in storage
          </span>
        </div>

        {/* Pending Shipments */}
        <div className="bg-white border border-[#EDE2D5] rounded-2xl p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-bold text-[#A08878] uppercase tracking-wider">
              Pending Deliveries
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock size={16} />
            </div>
          </div>
          <div className="mt-2 text-[24px] font-bold text-amber-700 leading-none">
            {summary.pendingOrders}
          </div>
          <span className="text-[11px] text-amber-700 mt-1 block">
            Scheduled for arrival
          </span>
        </div>

        {/* Active Suppliers */}
        <div className="bg-white border border-[#EDE2D5] rounded-2xl p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-bold text-[#A08878] uppercase tracking-wider">
              Active Vendors
            </span>
            <div className="w-8 h-8 rounded-xl bg-[#FAF5EE] text-[#8C4A28] flex items-center justify-center">
              <Building size={16} />
            </div>
          </div>
          <div className="mt-2 text-[24px] font-bold text-[#2C1A0E] leading-none">
            {uniqueSuppliers.length}
          </div>
          <span className="text-[11px] text-[#A08878] mt-1 block">
            Verified café partners
          </span>
        </div>
      </div>

      {/* ── Status Tab Pills ── */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-[#EDE2D5]">
        <button
          onClick={() => setStatusFilter('all')}
          className={`px-4 py-2 rounded-xl text-[13px] font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
            statusFilter === 'all'
              ? 'bg-[#2C1A0E] text-white shadow-2xs'
              : 'text-[#8C705B] hover:text-[#2C1A0E] hover:bg-[#FAF5EE]'
          }`}
        >
          <span>All Orders</span>
          <span
            className={`px-1.5 py-0.2 rounded-full text-[10px] ${
              statusFilter === 'all'
                ? 'bg-white/20 text-white'
                : 'bg-[#EDE2D5] text-[#7A614E]'
            }`}
          >
            {summary.totalOrders}
          </span>
        </button>

        <button
          onClick={() => setStatusFilter('received')}
          className={`px-4 py-2 rounded-xl text-[13px] font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
            statusFilter === 'received'
              ? 'bg-emerald-700 text-white shadow-2xs'
              : 'text-emerald-800 hover:bg-emerald-50'
          }`}
        >
          <CheckCircle2 size={13} />
          <span>Received & Verified</span>
          <span
            className={`px-1.5 py-0.2 rounded-full text-[10px] ${
              statusFilter === 'received'
                ? 'bg-white/20 text-white'
                : 'bg-emerald-100 text-emerald-900'
            }`}
          >
            {summary.receivedOrders}
          </span>
        </button>

        <button
          onClick={() => setStatusFilter('pending')}
          className={`px-4 py-2 rounded-xl text-[13px] font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
            statusFilter === 'pending'
              ? 'bg-amber-600 text-white shadow-2xs'
              : 'text-amber-800 hover:bg-amber-50'
          }`}
        >
          <Clock size={13} />
          <span>Pending Delivery</span>
          <span
            className={`px-1.5 py-0.2 rounded-full text-[10px] ${
              statusFilter === 'pending'
                ? 'bg-white/20 text-white'
                : 'bg-amber-100 text-amber-900'
            }`}
          >
            {summary.pendingOrders}
          </span>
        </button>

        <button
          onClick={() => setStatusFilter('partially_received')}
          className={`px-4 py-2 rounded-xl text-[13px] font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
            statusFilter === 'partially_received'
              ? 'bg-orange-600 text-white shadow-2xs'
              : 'text-orange-800 hover:bg-orange-50'
          }`}
        >
          <AlertTriangle size={13} />
          <span>Partially Received</span>
          <span
            className={`px-1.5 py-0.2 rounded-full text-[10px] ${
              statusFilter === 'partially_received'
                ? 'bg-white/20 text-white'
                : 'bg-orange-100 text-orange-900'
            }`}
          >
            {summary.partialOrders}
          </span>
        </button>
      </div>

      {/* ── Filters & Search Control Bar ── */}
      <div className="bg-white border border-[#EDE2D5] rounded-2xl p-4 shadow-2xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A08878]"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search PO #, vendor, or supply item..."
            className="w-full pl-10 pr-4 py-2 bg-[#FAF7F4] border border-[#EBDCCF] rounded-xl text-[13px] text-[#2C1A0E] placeholder-[#B59F8F] focus:outline-none focus:ring-2 focus:ring-[#C87D55]/25 focus:border-[#C87D55]"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-bold text-[#A08878] hover:text-[#2C1A0E]"
            >
              Clear
            </button>
          )}
        </div>

        {/* Dropdowns */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Supplier Filter */}
          <select
            value={supplierFilter}
            onChange={(e) => setSupplierFilter(e.target.value)}
            className="px-3 py-2 bg-[#FAF7F4] border border-[#EBDCCF] rounded-xl text-[12px] font-bold text-[#7A614E] focus:outline-none focus:ring-2 focus:ring-[#C87D55]/30"
          >
            <option value="all">Vendor: All</option>
            {uniqueSuppliers.map((sup) => (
              <option key={sup} value={sup}>
                🏢 {sup}
              </option>
            ))}
          </select>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) =>
              setSortBy(
                e.target.value as 'date_desc' | 'date_asc' | 'amount_desc' | 'po_asc'
              )
            }
            className="px-3 py-2 bg-[#FAF7F4] border border-[#EBDCCF] rounded-xl text-[12px] font-bold text-[#7A614E] focus:outline-none focus:ring-2 focus:ring-[#C87D55]/30"
          >
            <option value="date_desc">Sort: Date (Newest First)</option>
            <option value="date_asc">Sort: Date (Oldest First)</option>
            <option value="amount_desc">Sort: Cost (High → Low)</option>
            <option value="po_asc">Sort: PO Number</option>
          </select>
        </div>
      </div>

      {/* ── Purchase Orders Grid View (Cards Layout) ── */}
      {filteredOrders.length === 0 ? (
        <div className="bg-white border border-[#EDE2D5] rounded-3xl p-12 text-center shadow-sm">
          <div className="w-16 h-16 bg-[#FAF5EE] border border-[#EDE2D5] text-[#8C4A28] rounded-2xl flex items-center justify-center mx-auto mb-4">
            <FileText size={28} />
          </div>
          <h3
            className="text-[20px] font-bold text-[#2C1A0E] mb-1"
            style={{ fontFamily: '"Playfair Display", Georgia, serif' }}
          >
            No purchase orders found
          </h3>
          <p className="text-[13px] text-[#A08878] max-w-sm mx-auto mb-5">
            No restock shipments match your query or filters. Try clearing your search parameters or logging a new delivery.
          </p>
          <button
            onClick={() => {
              setSearchQuery('')
              setStatusFilter('all')
              setSupplierFilter('all')
            }}
            className="px-5 py-2.5 rounded-full bg-[#FAF5EE] border border-[#EADBCC] text-[13px] font-bold text-[#8C4A28] hover:bg-[#F2E7D8] transition-all"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredOrders.map((order) => (
            <RestockOrderCard
              key={order.id}
              order={order}
              isAdmin={isAdmin}
              onView={(ord) => setDrawerOrder(ord)}
              onMarkReceived={(id) => updateRestockStatus(id, 'received')}
            />
          ))}
        </div>
      )}

      {/* ── Modals & Drawers ── */}
      {/* Log Restock Modal (Admin Only) */}
      <RestockModal
        isOpen={isModalOpen}
        inventory={inventory}
        onClose={() => setIsModalOpen(false)}
        onSave={(newOrder) => addRestockOrder(newOrder)}
      />

      {/* Invoice & Receiving Verification Drawer (Admin & Staff) */}
      <RestockDetailDrawer
        order={drawerOrder}
        isOpen={!!drawerOrder}
        isAdmin={isAdmin}
        onClose={() => setDrawerOrder(null)}
        onMarkReceived={(id) => updateRestockStatus(id, 'received')}
      />
    </div>
  )
}
