'use client'

import React, { useState, useMemo } from 'react'
import {
  Plus,
  Search,
  Filter,
  Coffee,
  CheckCircle2,
  XCircle,
  TrendingUp,
  Shield,
  Eye,
  Info,
} from 'lucide-react'
import {
  useAdminStore,
  MenuItem,
  MenuCategory,
  DietaryType,
} from '@/store/useAdminStore'
import { useAuthStore } from '@/store/useAuthStore'
import MenuItemCard from '@/components/menu/MenuItemCard'
import MenuModal from '@/components/menu/MenuModal'
import DeleteConfirmModal from '@/components/menu/DeleteConfirmModal'
import MenuItemDrawer from '@/components/menu/MenuItemDrawer'

export default function MenuPage() {
  const user = useAuthStore((s) => s.user)
  // Actual auth role
  const authRole = user?.role || 'admin'

  // Simulated role toggle for live interactive testing (defaults to user's real role)
  const [activeRole, setActiveRole] = useState<'admin' | 'staff'>(authRole)
  const isAdmin = activeRole === 'admin'

  // Store data & actions
  const menuItems = useAdminStore((s) => s.menuItems)
  const addMenuItem = useAdminStore((s) => s.addMenuItem)
  const updateMenuItem = useAdminStore((s) => s.updateMenuItem)
  const deleteMenuItem = useAdminStore((s) => s.deleteMenuItem)
  const toggleMenuItemAvailability = useAdminStore((s) => s.toggleMenuItemAvailability)
  const toastMessage = useAdminStore((s) => s.toastMessage)

  // Filters & Search state
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedDietary, setSelectedDietary] = useState<string>('all')
  const [availabilityFilter, setAvailabilityFilter] = useState<'all' | 'in_stock' | 'out_of_stock'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<'name' | 'price_asc' | 'price_desc' | 'prep_time'>('name')

  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null)
  const [deletingItem, setDeletingItem] = useState<MenuItem | null>(null)
  const [drawerItem, setDrawerItem] = useState<MenuItem | null>(null)

  // Category counts
  const counts = useMemo(() => {
    return {
      all: menuItems.length,
      coffee: menuItems.filter((i) => i.category === 'coffee').length,
      cold_brew: menuItems.filter((i) => i.category === 'cold_brew').length,
      bakery: menuItems.filter((i) => i.category === 'bakery').length,
      food: menuItems.filter((i) => i.category === 'food').length,
      inStock: menuItems.filter((i) => i.isAvailable).length,
      outOfStock: menuItems.filter((i) => !i.isAvailable).length,
    }
  }, [menuItems])

  // Filtered & Sorted items
  const filteredItems = useMemo(() => {
    return menuItems
      .filter((item) => {
        // Category filter
        if (selectedCategory !== 'all' && item.category !== selectedCategory) {
          return false
        }
        // Dietary filter
        if (selectedDietary !== 'all' && item.dietary !== selectedDietary) {
          return false
        }
        // Availability filter
        if (availabilityFilter === 'in_stock' && !item.isAvailable) return false
        if (availabilityFilter === 'out_of_stock' && item.isAvailable) return false
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase()
          const matchesName = item.name.toLowerCase().includes(q)
          const matchesDesc = item.description.toLowerCase().includes(q)
          const matchesIng = item.ingredients?.some((ing) =>
            ing.toLowerCase().includes(q)
          )
          if (!matchesName && !matchesDesc && !matchesIng) return false
        }
        return true
      })
      .sort((a, b) => {
        if (sortBy === 'price_asc') return a.price - b.price
        if (sortBy === 'price_desc') return b.price - a.price
        if (sortBy === 'prep_time') return a.prepTimeMinutes - b.prepTimeMinutes
        return a.name.localeCompare(b.name)
      })
  }, [menuItems, selectedCategory, selectedDietary, availabilityFilter, searchQuery, sortBy])

  // CRUD Handlers
  const handleOpenAddModal = () => {
    if (!isAdmin) return
    setEditingItem(null)
    setIsModalOpen(true)
  }

  const handleOpenEditModal = (item: MenuItem) => {
    if (!isAdmin) return
    setEditingItem(item)
    setIsModalOpen(true)
  }

  const handleSaveItem = (data: Omit<MenuItem, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingItem) {
      updateMenuItem(editingItem.id, data)
    } else {
      addMenuItem(data)
    }
  }

  const handleDeleteItem = () => {
    if (deletingItem) {
      deleteMenuItem(deletingItem.id)
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
              Menu Management
            </h1>
            <span className="px-3 py-1 rounded-full text-[12px] font-bold bg-[#FAF5EE] text-[#8C4A28] border border-[#EDE2D5]">
              {menuItems.length} Total Items
            </span>
          </div>
          <p className="text-[13px] text-[#8C705B] mt-1.5">
            Organize café beverages, bakery delights, and snacks across all digital customer QR codes.
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
              title="Full CRUD access: Add, edit, delete, and stock management"
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

          {/* "+ Add New Item" Button (Admin Only) */}
          {isAdmin && (
            <button
              onClick={handleOpenAddModal}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#C87D55] text-white text-[13px] font-bold hover:bg-[#B36841] transition-all active:scale-95 shadow-xs"
            >
              <Plus size={16} />
              <span>Add New Item</span>
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
              <strong className="font-bold">Staff View Active:</strong> You have view-only access to the menu. Modifying prices, adding new items, and deleting recipes are restricted to Admins.
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
              Total Items
            </span>
            <div className="w-8 h-8 rounded-xl bg-[#FAF5EE] text-[#8C4A28] flex items-center justify-center">
              <Coffee size={16} />
            </div>
          </div>
          <div className="mt-2 text-[24px] font-bold text-[#2C1A0E] leading-none">
            {counts.all}
          </div>
          <span className="text-[11px] text-[#A08878] mt-1 block">Across 4 categories</span>
        </div>

        {/* Active In Stock */}
        <div className="bg-white border border-[#EDE2D5] rounded-2xl p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-bold text-[#A08878] uppercase tracking-wider">
              In Stock
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 size={16} />
            </div>
          </div>
          <div className="mt-2 text-[24px] font-bold text-emerald-700 leading-none">
            {counts.inStock}
          </div>
          <span className="text-[11px] text-emerald-600 mt-1 block">
            {Math.round((counts.inStock / (counts.all || 1)) * 100)}% available
          </span>
        </div>

        {/* Sold Out / 86'd */}
        <div className="bg-white border border-[#EDE2D5] rounded-2xl p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-bold text-[#A08878] uppercase tracking-wider">
              Sold Out / 86'd
            </span>
            <div className="w-8 h-8 rounded-xl bg-stone-100 text-stone-600 flex items-center justify-center">
              <XCircle size={16} />
            </div>
          </div>
          <div className="mt-2 text-[24px] font-bold text-[#2C1A0E] leading-none">
            {counts.outOfStock}
          </div>
          <span className="text-[11px] text-[#A08878] mt-1 block">Hidden on live QR</span>
        </div>

        {/* Average Price */}
        <div className="bg-white border border-[#EDE2D5] rounded-2xl p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-bold text-[#A08878] uppercase tracking-wider">
              Avg. Price
            </span>
            <div className="w-8 h-8 rounded-xl bg-[#FAF5EE] text-[#8C4A28] flex items-center justify-center">
              <TrendingUp size={16} />
            </div>
          </div>
          <div className="mt-2 text-[24px] font-bold text-[#2C1A0E] leading-none">
            ₹
            {Math.round(
              menuItems.reduce((acc, curr) => acc + curr.price, 0) /
                (menuItems.length || 1)
            )}
          </div>
          <span className="text-[11px] text-[#A08878] mt-1 block">Standard ticket size</span>
        </div>
      </div>

      {/* ── Category Tabs Bar ── */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-[#EDE2D5]">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-4 py-2 rounded-xl text-[13px] font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
            selectedCategory === 'all'
              ? 'bg-[#2C1A0E] text-white shadow-2xs'
              : 'text-[#8C705B] hover:text-[#2C1A0E] hover:bg-[#FAF5EE]'
          }`}
        >
          <span>All Items</span>
          <span
            className={`px-1.5 py-0.2 rounded-full text-[10px] ${
              selectedCategory === 'all'
                ? 'bg-white/20 text-white'
                : 'bg-[#EDE2D5] text-[#7A614E]'
            }`}
          >
            {counts.all}
          </span>
        </button>

        <button
          onClick={() => setSelectedCategory('coffee')}
          className={`px-4 py-2 rounded-xl text-[13px] font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
            selectedCategory === 'coffee'
              ? 'bg-[#2C1A0E] text-white shadow-2xs'
              : 'text-[#8C705B] hover:text-[#2C1A0E] hover:bg-[#FAF5EE]'
          }`}
        >
          <span>☕ Coffee</span>
          <span
            className={`px-1.5 py-0.2 rounded-full text-[10px] ${
              selectedCategory === 'coffee'
                ? 'bg-white/20 text-white'
                : 'bg-[#EDE2D5] text-[#7A614E]'
            }`}
          >
            {counts.coffee}
          </span>
        </button>

        <button
          onClick={() => setSelectedCategory('cold_brew')}
          className={`px-4 py-2 rounded-xl text-[13px] font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
            selectedCategory === 'cold_brew'
              ? 'bg-[#2C1A0E] text-white shadow-2xs'
              : 'text-[#8C705B] hover:text-[#2C1A0E] hover:bg-[#FAF5EE]'
          }`}
        >
          <span>🧊 Cold Brew & Refreshers</span>
          <span
            className={`px-1.5 py-0.2 rounded-full text-[10px] ${
              selectedCategory === 'cold_brew'
                ? 'bg-white/20 text-white'
                : 'bg-[#EDE2D5] text-[#7A614E]'
            }`}
          >
            {counts.cold_brew}
          </span>
        </button>

        <button
          onClick={() => setSelectedCategory('bakery')}
          className={`px-4 py-2 rounded-xl text-[13px] font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
            selectedCategory === 'bakery'
              ? 'bg-[#2C1A0E] text-white shadow-2xs'
              : 'text-[#8C705B] hover:text-[#2C1A0E] hover:bg-[#FAF5EE]'
          }`}
        >
          <span>🥐 Bakery & Pastry</span>
          <span
            className={`px-1.5 py-0.2 rounded-full text-[10px] ${
              selectedCategory === 'bakery'
                ? 'bg-white/20 text-white'
                : 'bg-[#EDE2D5] text-[#7A614E]'
            }`}
          >
            {counts.bakery}
          </span>
        </button>

        <button
          onClick={() => setSelectedCategory('food')}
          className={`px-4 py-2 rounded-xl text-[13px] font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
            selectedCategory === 'food'
              ? 'bg-[#2C1A0E] text-white shadow-2xs'
              : 'text-[#8C705B] hover:text-[#2C1A0E] hover:bg-[#FAF5EE]'
          }`}
        >
          <span>🥪 Sandwiches & Bites</span>
          <span
            className={`px-1.5 py-0.2 rounded-full text-[10px] ${
              selectedCategory === 'food'
                ? 'bg-white/20 text-white'
                : 'bg-[#EDE2D5] text-[#7A614E]'
            }`}
          >
            {counts.food}
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
            placeholder="Search items, ingredients, or descriptions..."
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
          {/* Dietary Filter */}
          <select
            value={selectedDietary}
            onChange={(e) => setSelectedDietary(e.target.value)}
            className="px-3 py-2 bg-[#FAF7F4] border border-[#EBDCCF] rounded-xl text-[12px] font-bold text-[#7A614E] focus:outline-none focus:ring-2 focus:ring-[#C87D55]/30"
          >
            <option value="all">Diet: All</option>
            <option value="veg">🌱 Veg Only</option>
            <option value="vegan">🌿 Vegan Only</option>
            <option value="non_veg">🍗 Non-Veg</option>
          </select>

          {/* Availability Filter */}
          <select
            value={availabilityFilter}
            onChange={(e) =>
              setAvailabilityFilter(e.target.value as 'all' | 'in_stock' | 'out_of_stock')
            }
            className="px-3 py-2 bg-[#FAF7F4] border border-[#EBDCCF] rounded-xl text-[12px] font-bold text-[#7A614E] focus:outline-none focus:ring-2 focus:ring-[#C87D55]/30"
          >
            <option value="all">Stock: All</option>
            <option value="in_stock">🟢 In Stock</option>
            <option value="out_of_stock">🔴 Sold Out</option>
          </select>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) =>
              setSortBy(
                e.target.value as 'name' | 'price_asc' | 'price_desc' | 'prep_time'
              )
            }
            className="px-3 py-2 bg-[#FAF7F4] border border-[#EBDCCF] rounded-xl text-[12px] font-bold text-[#7A614E] focus:outline-none focus:ring-2 focus:ring-[#C87D55]/30"
          >
            <option value="name">Sort: Name (A-Z)</option>
            <option value="price_asc">Sort: Price (Low → High)</option>
            <option value="price_desc">Sort: Price (High → Low)</option>
            <option value="prep_time">Sort: Prep Time</option>
          </select>
        </div>
      </div>

      {/* ── Main Content Area (Grid View Only) ── */}
      {filteredItems.length === 0 ? (
        <div className="bg-white border border-[#EDE2D5] rounded-3xl p-12 text-center shadow-sm">
          <div className="w-16 h-16 bg-[#FAF5EE] border border-[#EDE2D5] text-[#8C4A28] rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Coffee size={28} />
          </div>
          <h3
            className="text-[20px] font-bold text-[#2C1A0E] mb-1"
            style={{ fontFamily: '"Playfair Display", Georgia, serif' }}
          >
            No menu items found
          </h3>
          <p className="text-[13px] text-[#A08878] max-w-sm mx-auto mb-5">
            No items matched your search query or selected filters. Try clearing your filters or adding a new item.
          </p>
          <button
            onClick={() => {
              setSearchQuery('')
              setSelectedCategory('all')
              setSelectedDietary('all')
              setAvailabilityFilter('all')
            }}
            className="px-5 py-2.5 rounded-full bg-[#FAF5EE] border border-[#EADBCC] text-[13px] font-bold text-[#8C4A28] hover:bg-[#F2E7D8] transition-all"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {filteredItems.map((item) => (
            <MenuItemCard
              key={item.id}
              item={item}
              isAdmin={isAdmin}
              onEdit={handleOpenEditModal}
              onDelete={(itm) => setDeletingItem(itm)}
              onView={(itm) => setDrawerItem(itm)}
              onToggleStock={(id) => toggleMenuItemAvailability(id)}
            />
          ))}
        </div>
      )}

      {/* ── Modals & Drawers ── */}
      {/* Create / Edit Modal (Admin Only) */}
      <MenuModal
        isOpen={isModalOpen}
        initialItem={editingItem}
        onClose={() => {
          setIsModalOpen(false)
          setEditingItem(null)
        }}
        onSave={handleSaveItem}
      />

      {/* Delete Confirmation Modal (Admin Only) */}
      <DeleteConfirmModal
        isOpen={!!deletingItem}
        item={deletingItem}
        onClose={() => setDeletingItem(null)}
        onConfirm={handleDeleteItem}
      />

      {/* Item Detail Drawer (Admin & Staff) */}
      <MenuItemDrawer
        item={drawerItem}
        isOpen={!!drawerItem}
        isAdmin={isAdmin}
        onClose={() => setDrawerItem(null)}
        onEdit={(itm) => {
          setDrawerItem(null)
          handleOpenEditModal(itm)
        }}
        onDelete={(itm) => {
          setDrawerItem(null)
          setDeletingItem(itm)
        }}
        onToggleStock={(id) => toggleMenuItemAvailability(id)}
      />
    </div>
  )
}
