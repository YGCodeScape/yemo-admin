'use client'

import React, { useState, useMemo } from 'react'
import {
  Plus,
  Search,
  Filter,
  Package,
  AlertTriangle,
  XCircle,
  CheckCircle2,
  TrendingDown,
  DollarSign,
  Shield,
  Eye,
  Info,
  MapPin,
  Sliders,
} from 'lucide-react'
import {
  useAdminStore,
  InventoryItem,
  InventoryCategory,
} from '@/store/useAdminStore'
import { useAuthStore } from '@/store/useAuthStore'
import InventoryTableRow from '@/components/inventory/InventoryTableRow'
import InventoryModal from '@/components/inventory/InventoryModal'
import AdjustStockModal from '@/components/inventory/AdjustStockModal'
import DeleteInventoryModal from '@/components/inventory/DeleteInventoryModal'
import InventoryDetailDrawer from '@/components/inventory/InventoryDetailDrawer'

export default function StockPage() {
  const user = useAuthStore((s) => s.user)
  const authRole = user?.role || 'admin'

  // Simulated role toggle for live interactive testing (defaults to user's real role)
  const [activeRole, setActiveRole] = useState<'admin' | 'staff'>(authRole)
  const isAdmin = activeRole === 'admin'

  // Store data & actions
  const inventory = useAdminStore((s) => s.inventory)
  const addInventoryItem = useAdminStore((s) => s.addInventoryItem)
  const updateInventoryItem = useAdminStore((s) => s.updateInventoryItem)
  const deleteInventoryItem = useAdminStore((s) => s.deleteInventoryItem)
  const adjustInventoryStock = useAdminStore((s) => s.adjustInventoryStock)
  const toastMessage = useAdminStore((s) => s.toastMessage)

  // Filters state
  const [statusFilter, setStatusFilter] = useState<'all' | 'low' | 'out_of_stock' | 'ok'>('all')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [locationFilter, setLocationFilter] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<'stock_asc' | 'stock_desc' | 'name' | 'value_desc'>('stock_asc')

  // Modals state
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null)
  const [adjustingItem, setAdjustingItem] = useState<InventoryItem | null>(null)
  const [deletingItem, setDeletingItem] = useState<InventoryItem | null>(null)
  const [drawerItem, setDrawerItem] = useState<InventoryItem | null>(null)

  // Unique locations for filter
  const uniqueLocations = useMemo(() => {
    const locs = new Set<string>()
    inventory.forEach((i) => {
      if (i.storageLocation) locs.add(i.storageLocation)
    })
    return Array.from(locs)
  }, [inventory])

  // Summary counts and asset valuation
  const summary = useMemo(() => {
    const total = inventory.length
    const lowCount = inventory.filter((i) => i.status === 'low').length
    const outCount = inventory.filter((i) => i.status === 'out_of_stock').length
    const healthyCount = inventory.filter((i) => i.status === 'ok').length
    const totalValue = inventory.reduce(
      (acc, curr) => acc + curr.currentStock * curr.costPerUnit,
      0
    )
    return { total, lowCount, outCount, healthyCount, totalValue }
  }, [inventory])

  // Filtered & Sorted inventory items
  const filteredItems = useMemo(() => {
    return inventory
      .filter((item) => {
        // Status filter
        if (statusFilter !== 'all' && item.status !== statusFilter) return false

        // Category filter
        if (categoryFilter !== 'all' && item.category !== categoryFilter) return false

        // Location filter
        if (locationFilter !== 'all' && item.storageLocation !== locationFilter) return false

        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase()
          const matchesName = item.name.toLowerCase().includes(q)
          const matchesSku = item.sku.toLowerCase().includes(q)
          const matchesSupplier = item.supplier?.toLowerCase().includes(q)
          const matchesLocation = item.storageLocation?.toLowerCase().includes(q)
          if (!matchesName && !matchesSku && !matchesSupplier && !matchesLocation) {
            return false
          }
        }
        return true
      })
      .sort((a, b) => {
        if (sortBy === 'stock_asc') return a.currentStock - b.currentStock
        if (sortBy === 'stock_desc') return b.currentStock - a.currentStock
        if (sortBy === 'value_desc') {
          return b.currentStock * b.costPerUnit - a.currentStock * a.costPerUnit
        }
        return a.name.localeCompare(b.name)
      })
  }, [inventory, statusFilter, categoryFilter, locationFilter, searchQuery, sortBy])

  // CRUD Handlers
  const handleOpenAddModal = () => {
    if (!isAdmin) return
    setEditingItem(null)
    setIsAddEditModalOpen(true)
  }

  const handleOpenEditModal = (item: InventoryItem) => {
    if (!isAdmin) return
    setEditingItem(item)
    setIsAddEditModalOpen(true)
  }

  const handleSaveItem = (data: Omit<InventoryItem, 'id' | 'lastUpdated' | 'status'>) => {
    if (editingItem) {
      updateInventoryItem(editingItem.id, data)
    } else {
      addInventoryItem(data)
    }
  }

  const handleConfirmAdjust = (id: string, newQty: number, reason: string) => {
    adjustInventoryStock(id, newQty, reason)
  }

  const handleConfirmDelete = () => {
    if (deletingItem) {
      deleteInventoryItem(deletingItem.id)
      setDeletingItem(null)
    }
  }

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
              Inventory & Stock Management
            </h1>
            <span className="px-3 py-1 rounded-full text-[12px] font-bold bg-[#FAF5EE] text-[#8C4A28] border border-[#EDE2D5]">
              {summary.total} Tracked Items
            </span>
          </div>
          <p className="text-[13px] text-[#8C705B] mt-1.5">
            Monitor café raw beans, dairy, syrups, pastry ingredients, and packaging in real-time.
          </p>
        </div>

        {/* Role Switcher Pill & Action */}
        <div className="flex items-center gap-3">
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
              title="Full CRUD access: Add, adjust quantities, edit, and delete supplies"
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

          {/* "+ Add Inventory Supply" Button (Admin Only) */}
          {isAdmin && (
            <button
              onClick={handleOpenAddModal}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#C87D55] text-white text-[13px] font-bold hover:bg-[#B36841] transition-all active:scale-95 shadow-xs"
            >
              <Plus size={16} />
              <span>Add Supply</span>
            </button>
          )}
        </div>
      </div>

      {/* ── Staff View Only Banner (Shown when in staff view) ── */}
      {!isAdmin && (
        <div className="p-3.5 bg-amber-50/80 border border-amber-200/90 rounded-2xl flex items-center justify-between text-amber-900 text-[13px]">
          <div className="flex items-center gap-2.5">
            <Info size={17} className="text-[#C87D55] flex-shrink-0" />
            <span>
              <strong className="font-bold">Staff View Active:</strong> You have view-only access to inventory. Restocking supplies, adjusting stock counts, and deleting items requires Admin permissions.
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
        {/* Total Items */}
        <div className="bg-white border border-[#EDE2D5] rounded-2xl p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-bold text-[#A08878] uppercase tracking-wider">
              Total Supplies
            </span>
            <div className="w-8 h-8 rounded-xl bg-[#FAF5EE] text-[#8C4A28] flex items-center justify-center">
              <Package size={16} />
            </div>
          </div>
          <div className="mt-2 text-[24px] font-bold text-[#2C1A0E] leading-none">
            {summary.total}
          </div>
          <span className="text-[11px] text-[#A08878] mt-1 block">Across 6 categories</span>
        </div>

        {/* Low Stock Warning */}
        <div className="bg-white border border-[#EDE2D5] rounded-2xl p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-bold text-[#A08878] uppercase tracking-wider">
              Low Stock Alerts
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <AlertTriangle size={16} />
            </div>
          </div>
          <div className="mt-2 text-[24px] font-bold text-amber-700 leading-none">
            {summary.lowCount}
          </div>
          <span className="text-[11px] text-amber-700 mt-1 block">Below safety threshold</span>
        </div>

        {/* Out of Stock */}
        <div className="bg-white border border-[#EDE2D5] rounded-2xl p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-bold text-[#A08878] uppercase tracking-wider">
              Out of Stock
            </span>
            <div className="w-8 h-8 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
              <XCircle size={16} />
            </div>
          </div>
          <div className="mt-2 text-[24px] font-bold text-red-700 leading-none">
            {summary.outCount}
          </div>
          <span className="text-[11px] text-red-600 mt-1 block">Requires immediate order</span>
        </div>

        {/* Total Stock Valuation */}
        <div className="bg-white border border-[#EDE2D5] rounded-2xl p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-bold text-[#A08878] uppercase tracking-wider">
              Stock Valuation
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <DollarSign size={16} />
            </div>
          </div>
          <div className="mt-2 text-[24px] font-bold text-[#2C1A0E] leading-none">
            ₹{Math.round(summary.totalValue).toLocaleString('en-IN')}
          </div>
          <span className="text-[11px] text-[#A08878] mt-1 block">Active on-premise inventory</span>
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
          <span>All Supplies</span>
          <span
            className={`px-1.5 py-0.2 rounded-full text-[10px] ${
              statusFilter === 'all'
                ? 'bg-white/20 text-white'
                : 'bg-[#EDE2D5] text-[#7A614E]'
            }`}
          >
            {summary.total}
          </span>
        </button>

        <button
          onClick={() => setStatusFilter('low')}
          className={`px-4 py-2 rounded-xl text-[13px] font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
            statusFilter === 'low'
              ? 'bg-amber-600 text-white shadow-2xs'
              : 'text-amber-800 hover:bg-amber-50'
          }`}
        >
          <AlertTriangle size={13} />
          <span>Low Stock Alert</span>
          <span
            className={`px-1.5 py-0.2 rounded-full text-[10px] ${
              statusFilter === 'low'
                ? 'bg-white/20 text-white'
                : 'bg-amber-100 text-amber-900'
            }`}
          >
            {summary.lowCount}
          </span>
        </button>

        <button
          onClick={() => setStatusFilter('out_of_stock')}
          className={`px-4 py-2 rounded-xl text-[13px] font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
            statusFilter === 'out_of_stock'
              ? 'bg-red-600 text-white shadow-2xs'
              : 'text-red-800 hover:bg-red-50'
          }`}
        >
          <XCircle size={13} />
          <span>Out of Stock</span>
          <span
            className={`px-1.5 py-0.2 rounded-full text-[10px] ${
              statusFilter === 'out_of_stock'
                ? 'bg-white/20 text-white'
                : 'bg-red-100 text-red-900'
            }`}
          >
            {summary.outCount}
          </span>
        </button>

        <button
          onClick={() => setStatusFilter('ok')}
          className={`px-4 py-2 rounded-xl text-[13px] font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
            statusFilter === 'ok'
              ? 'bg-emerald-700 text-white shadow-2xs'
              : 'text-emerald-800 hover:bg-emerald-50'
          }`}
        >
          <CheckCircle2 size={13} />
          <span>Healthy Stock</span>
          <span
            className={`px-1.5 py-0.2 rounded-full text-[10px] ${
              statusFilter === 'ok'
                ? 'bg-white/20 text-white'
                : 'bg-emerald-100 text-emerald-900'
            }`}
          >
            {summary.healthyCount}
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
            placeholder="Search by ingredient, SKU, supplier, shelf..."
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
          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 bg-[#FAF7F4] border border-[#EBDCCF] rounded-xl text-[12px] font-bold text-[#7A614E] focus:outline-none focus:ring-2 focus:ring-[#C87D55]/30"
          >
            <option value="all">Category: All</option>
            <option value="coffee_beans">☕ Coffee Beans</option>
            <option value="dairy_milk">🥛 Dairy & Milk</option>
            <option value="syrups">🍯 Syrups & Sauces</option>
            <option value="bakery_dry">🥐 Bakery & Dry</option>
            <option value="produce">🍓 Fresh Produce</option>
            <option value="packaging">📦 Packaging</option>
          </select>

          {/* Location Filter */}
          <select
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            className="px-3 py-2 bg-[#FAF7F4] border border-[#EBDCCF] rounded-xl text-[12px] font-bold text-[#7A614E] focus:outline-none focus:ring-2 focus:ring-[#C87D55]/30"
          >
            <option value="all">Location: All</option>
            {uniqueLocations.map((loc) => (
              <option key={loc} value={loc}>
                📍 {loc}
              </option>
            ))}
          </select>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) =>
              setSortBy(
                e.target.value as 'stock_asc' | 'stock_desc' | 'name' | 'value_desc'
              )
            }
            className="px-3 py-2 bg-[#FAF7F4] border border-[#EBDCCF] rounded-xl text-[12px] font-bold text-[#7A614E] focus:outline-none focus:ring-2 focus:ring-[#C87D55]/30"
          >
            <option value="stock_asc">Sort: Stock (Low → High)</option>
            <option value="stock_desc">Sort: Stock (High → Low)</option>
            <option value="value_desc">Sort: Asset Value (High → Low)</option>
            <option value="name">Sort: Name (A-Z)</option>
          </select>
        </div>
      </div>

      {/* ── Inventory Supplies Table ── */}
      {filteredItems.length === 0 ? (
        <div className="bg-white border border-[#EDE2D5] rounded-3xl p-12 text-center shadow-sm">
          <div className="w-16 h-16 bg-[#FAF5EE] border border-[#EDE2D5] text-[#8C4A28] rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Package size={28} />
          </div>
          <h3
            className="text-[20px] font-bold text-[#2C1A0E] mb-1"
            style={{ fontFamily: '"Playfair Display", Georgia, serif' }}
          >
            No inventory supplies found
          </h3>
          <p className="text-[13px] text-[#A08878] max-w-sm mx-auto mb-5">
            No items matched your search query or selected category/status filters. Try clearing your search or filters.
          </p>
          <button
            onClick={() => {
              setSearchQuery('')
              setStatusFilter('all')
              setCategoryFilter('all')
              setLocationFilter('all')
            }}
            className="px-5 py-2.5 rounded-full bg-[#FAF5EE] border border-[#EADBCC] text-[13px] font-bold text-[#8C4A28] hover:bg-[#F2E7D8] transition-all"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="bg-white border border-[#EDE2D5] rounded-3xl overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#EDE2D5] bg-[#FAF7F4] text-[11px] font-bold uppercase tracking-wider text-[#A08878]">
                  <th className="py-3.5 px-4">Supply & SKU</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Current Stock Level</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Storage Location</th>
                  <th className="py-3.5 px-4">Valuation</th>
                  <th className="py-3.5 px-4">Supplier</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((item) => (
                  <InventoryTableRow
                    key={item.id}
                    item={item}
                    isAdmin={isAdmin}
                    onAdjustStock={(itm) => setAdjustingItem(itm)}
                    onEdit={handleOpenEditModal}
                    onDelete={(itm) => setDeletingItem(itm)}
                    onView={(itm) => setDrawerItem(itm)}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Modals & Drawers ── */}
      {/* Quick Adjust Stock Modal (Admin Only) */}
      <AdjustStockModal
        isOpen={!!adjustingItem}
        item={adjustingItem}
        onClose={() => setAdjustingItem(null)}
        onConfirm={handleConfirmAdjust}
      />

      {/* Add / Edit Inventory Modal (Admin Only) */}
      <InventoryModal
        isOpen={isAddEditModalOpen}
        initialItem={editingItem}
        onClose={() => {
          setIsAddEditModalOpen(false)
          setEditingItem(null)
        }}
        onSave={handleSaveItem}
      />

      {/* Delete Confirmation Modal (Admin Only) */}
      <DeleteInventoryModal
        isOpen={!!deletingItem}
        item={deletingItem}
        onClose={() => setDeletingItem(null)}
        onConfirm={handleConfirmDelete}
      />

      {/* Detail Inspection Drawer (Admin & Staff) */}
      <InventoryDetailDrawer
        item={drawerItem}
        isOpen={!!drawerItem}
        isAdmin={isAdmin}
        onClose={() => setDrawerItem(null)}
        onAdjustStock={(itm) => {
          setDrawerItem(null)
          setAdjustingItem(itm)
        }}
        onEdit={(itm) => {
          setDrawerItem(null)
          handleOpenEditModal(itm)
        }}
        onDelete={(itm) => {
          setDrawerItem(null)
          setDeletingItem(itm)
        }}
      />
    </div>
  )
}
