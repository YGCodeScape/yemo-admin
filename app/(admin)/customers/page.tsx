'use client'

import React, { useState, useMemo } from 'react'
import {
  Users,
  Sparkles,
  Coins,
  TrendingUp,
  Search,
  Plus,
  Download,
  ShieldCheck,
  Lock,
  ChevronDown,
  ArrowUpDown,
  X,
  UserCheck,
  UserX,
} from 'lucide-react'
import { useAdminStore, Customer, MembershipTier } from '@/store/useAdminStore'
import { useAuthStore } from '@/store/useAuthStore'
import CustomerTableRow from '@/components/customers/CustomerTableRow'
import CustomerDetailDrawer from '@/components/customers/CustomerDetailDrawer'
import AdjustBeansModal from '@/components/customers/AdjustBeansModal'
import CustomerModal from '@/components/customers/CustomerModal'
import DeactivateCustomerModal from '@/components/customers/DeactivateCustomerModal'

type SortOption = 'beans_desc' | 'visits_desc' | 'spend_desc' | 'name_asc' | 'recent_visit'
type StatusFilter = 'all' | 'active' | 'inactive'

export default function CustomersPage() {
  const user = useAuthStore((s) => s.user)
  const authRole = user?.role || 'admin'

  // Interactive switcher for testing Option A (Admin full CRM vs Staff privacy view)
  const [activeRole, setActiveRole] = useState<'admin' | 'staff'>(authRole)
  const isAdmin = activeRole === 'admin'

  const {
    customers,
    addCustomer,
    adjustCustomerBeans,
    toggleCustomerStatus,
    showToast,
  } = useAdminStore()

  // State for search & filters
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTier, setSelectedTier] = useState<MembershipTier | 'all'>('all')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [dietaryFilter, setDietaryFilter] = useState<string>('all')
  const [sortBy, setSortBy] = useState<SortOption>('beans_desc')

  // Modals state
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false)
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false)
  const [isDeactivateModalOpen, setIsDeactivateModalOpen] = useState(false)
  const [targetCustomerForStatus, setTargetCustomerForStatus] = useState<Customer | null>(null)

  // Metrics calculations
  const totalDiners = customers.length
  const activeDiners = customers.filter((c) => c.status !== 'inactive').length
  const goldCount = customers.filter((c) => c.tier === 'gold').length
  const totalBeans = customers.reduce((sum, c) => sum + c.loyaltyBeans, 0)
  const avgVisits =
    totalDiners > 0
      ? (customers.reduce((sum, c) => sum + c.totalVisits, 0) / totalDiners).toFixed(1)
      : '0'

  // Unique dietary options list for filter dropdown
  const uniqueDietaryOptions = useMemo(() => {
    const set = new Set<string>()
    customers.forEach((c) => {
      if (c.dietaryPreference) {
        c.dietaryPreference.split(',').forEach((d: string) => set.add(d.trim()))
      }
    })
    return Array.from(set)
  }, [customers])

  // Filter & Sort Logic
  const filteredCustomers = useMemo(() => {
    return customers
      .filter((customer) => {
        // Status filter
        if (statusFilter === 'active' && customer.status === 'inactive') return false
        if (statusFilter === 'inactive' && customer.status !== 'inactive') return false

        // Search query across name, phone, email, notes, dietary, favorite item
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase()
          const matchName = customer.name.toLowerCase().includes(q)
          const matchPhone = customer.phone.toLowerCase().includes(q)
          const matchEmail = customer.email ? customer.email.toLowerCase().includes(q) : false
          const matchNotes = customer.notes ? customer.notes.toLowerCase().includes(q) : false
          const matchDiet = customer.dietaryPreference
            ? customer.dietaryPreference.toLowerCase().includes(q)
            : false
          const matchItem = customer.favoriteItem
            ? customer.favoriteItem.toLowerCase().includes(q)
            : false
          if (!matchName && !matchPhone && !matchEmail && !matchNotes && !matchDiet && !matchItem) {
            return false
          }
        }

        // Tier filter
        if (selectedTier !== 'all' && customer.tier !== selectedTier) {
          return false
        }

        // Dietary filter
        if (dietaryFilter !== 'all') {
          if (
            !customer.dietaryPreference ||
            !customer.dietaryPreference.toLowerCase().includes(dietaryFilter.toLowerCase())
          ) {
            return false
          }
        }

        return true
      })
      .sort((a, b) => {
        switch (sortBy) {
          case 'beans_desc':
            return b.loyaltyBeans - a.loyaltyBeans
          case 'visits_desc':
            return b.totalVisits - a.totalVisits
          case 'spend_desc':
            return b.lifetimeSpend - a.lifetimeSpend
          case 'name_asc':
            return a.name.localeCompare(b.name)
          case 'recent_visit':
            return new Date(b.lastVisit).getTime() - new Date(a.lastVisit).getTime()
          default:
            return 0
        }
      })
  }, [customers, searchQuery, selectedTier, statusFilter, dietaryFilter, sortBy])

  // CSV Export handler (Admin only)
  const handleExportCSV = () => {
    if (!isAdmin) return

    const headers = [
      'ID,Name,Phone,Email,Tier,Status,Loyalty Beans,Lifetime Spend,Total Visits,Last Visit,Favorite Item,Dietary,Notes',
    ]
    const rows = filteredCustomers.map((c) =>
      [
        `"${c.id}"`,
        `"${c.name}"`,
        `"${c.phone}"`,
        `"${c.email || ''}"`,
        `"${c.tier}"`,
        `"${c.status || 'active'}"`,
        c.loyaltyBeans,
        c.lifetimeSpend,
        c.totalVisits,
        `"${c.lastVisit}"`,
        `"${c.favoriteItem || ''}"`,
        `"${c.dietaryPreference || ''}"`,
        `"${(c.notes || '').replace(/"/g, '""')}"`,
      ].join(',')
    )

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n')
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', `yemo-customers-${new Date().toISOString().slice(0, 10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    showToast(`Exported ${filteredCustomers.length} customers to CSV`)
  }

  // Action handlers
  const handleView = (customer: Customer) => {
    setSelectedCustomer(customer)
    setIsDetailOpen(true)
  }

  const handleAdjustBeans = (customer: Customer) => {
    setSelectedCustomer(customer)
    setIsAdjustModalOpen(true)
  }

  const handleToggleStatusClick = (customer: Customer) => {
    setTargetCustomerForStatus(customer)
    setIsDeactivateModalOpen(true)
  }

  const handleOpenAdd = () => {
    setIsCustomerModalOpen(true)
  }

  return (
    <div className="min-h-screen bg-stone-100/60 p-6 md:p-8 space-y-6">
      {/* Top Header & Role Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl md:text-3xl font-extrabold text-[#2C1A0E] tracking-tight">
              Customer CRM & Loyalty
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">
              {activeDiners} Active / {totalDiners} Total
            </span>
          </div>
          <p className="text-stone-500 text-sm mt-1">
            Manage diner profiles, monitor visit frequency, award loyalty beans, and toggle account activation.
          </p>
        </div>

        {/* Live Role Switcher (Option A Demonstration) */}
        <div className="flex items-center gap-3">
          <div className="inline-flex items-center bg-white p-1 rounded-2xl border border-stone-200 shadow-2xs">
            <button
              onClick={() => setActiveRole('admin')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                isAdmin
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
              }`}
            >
              <ShieldCheck size={14} className={isAdmin ? 'text-amber-400' : 'text-stone-400'} />
              <span>Admin (Full CRM)</span>
            </button>
            <button
              onClick={() => setActiveRole('staff')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                !isAdmin
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
              }`}
            >
              <Lock size={14} className={!isAdmin ? 'text-blue-200' : 'text-stone-400'} />
              <span>Staff (Privacy View)</span>
            </button>
          </div>

          {isAdmin && (
            <button
              onClick={handleOpenAdd}
              className="flex items-center gap-2 px-4 py-2.5 bg-amber-700 hover:bg-amber-800 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors"
            >
              <Plus size={16} />
              <span>Register Diner</span>
            </button>
          )}
        </div>
      </div>

      {/* Staff Privacy Notice Alert */}
      {!isAdmin && (
        <div className="p-4 bg-linear-to-r from-blue-50 to-indigo-50/50 border border-blue-200 rounded-2xl flex items-start gap-3 shadow-2xs">
          <div className="p-2 bg-blue-100 text-blue-700 rounded-xl mt-0.5">
            <Lock size={16} />
          </div>
          <div className="flex-1 text-xs">
            <div className="font-bold text-blue-900 text-sm">
              Staff Operational View Active (Option A: Privacy Guard)
            </div>
            <p className="text-blue-800 mt-0.5 leading-relaxed">
              Customer contact numbers and email addresses are partially masked, and lifetime financial
              spend is hidden. You can view loyalty tier, bean points, dietary allergies, and favorite items to deliver
              personalized hospitality at the table.
            </p>
          </div>
        </div>
      )}

      {/* CRM Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Total Diners */}
        <div className="p-5 bg-white rounded-2xl border border-stone-200/80 shadow-2xs">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Active Diners</span>
            <div className="p-2 rounded-xl bg-stone-100 text-stone-700">
              <Users size={16} />
            </div>
          </div>
          <div className="text-2xl md:text-3xl font-extrabold text-stone-900">
            {activeDiners}
            <span className="text-xs text-stone-400 font-normal ml-2">/ {totalDiners} total</span>
          </div>
          <div className="text-[11px] text-stone-400 mt-1 font-medium">Enrolled café guests</div>
        </div>

        {/* Gold VIP Members */}
        <div className="p-5 bg-white rounded-2xl border border-stone-200/80 shadow-2xs">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-800">VIP Gold Members</span>
            <div className="p-2 rounded-xl bg-amber-100 text-amber-700">
              <Sparkles size={16} />
            </div>
          </div>
          <div className="text-2xl md:text-3xl font-extrabold text-amber-950">{goldCount}</div>
          <div className="text-[11px] text-amber-700 mt-1 font-medium">Top café patrons</div>
        </div>

        {/* Total Active Loyalty Beans */}
        <div className="p-5 bg-white rounded-2xl border border-stone-200/80 shadow-2xs">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700">Active Beans</span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <Coins size={16} />
            </div>
          </div>
          <div className="text-2xl md:text-3xl font-extrabold text-stone-900">
            {totalBeans.toLocaleString()}
          </div>
          <div className="text-[11px] text-stone-400 mt-1 font-medium">Available for rewards</div>
        </div>

        {/* Avg Visits Per Guest */}
        <div className="p-5 bg-white rounded-2xl border border-stone-200/80 shadow-2xs">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">Avg Visits</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <TrendingUp size={16} />
            </div>
          </div>
          <div className="text-2xl md:text-3xl font-extrabold text-stone-900">{avgVisits}</div>
          <div className="text-[11px] text-emerald-700 mt-1 font-medium">Repeat dining rate</div>
        </div>
      </div>

      {/* Filter & Action Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs space-y-4">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          {/* Real-time Search Input */}
          <div className="relative flex-1 max-w-lg">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by diner name, phone, email, notes, or dietary..."
              className="w-full pl-10 pr-9 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs md:text-sm text-stone-800 placeholder-stone-400 focus:outline-hidden focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Account Status Filter Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-stone-100 rounded-xl text-xs font-semibold">
            {(
              [
                { id: 'all', label: 'All Diners' },
                { id: 'active', label: 'Active Only' },
                { id: 'inactive', label: 'Deactivated' },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id)}
                className={`px-3 py-1.5 rounded-lg transition-all whitespace-nowrap ${
                  statusFilter === tab.id
                    ? 'bg-white text-stone-900 shadow-2xs font-bold'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tier Filter Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-stone-100 rounded-xl overflow-x-auto text-xs font-semibold">
            {(['all', 'gold', 'silver', 'bronze'] as const).map((tier) => (
              <button
                key={tier}
                onClick={() => setSelectedTier(tier)}
                className={`px-3 py-1.5 rounded-lg capitalize transition-all whitespace-nowrap ${
                  selectedTier === tier
                    ? 'bg-white text-stone-900 shadow-2xs font-bold'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                {tier === 'all' ? 'All Tiers' : `${tier} Tier`}
              </button>
            ))}
          </div>

          {/* Secondary Filters (Dietary & Sorting) */}
          <div className="flex items-center gap-2">
            {/* Dietary Dropdown */}
            <div className="relative">
              <select
                value={dietaryFilter}
                onChange={(e) => setDietaryFilter(e.target.value)}
                className="appearance-none pl-3 pr-8 py-2 bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded-xl text-xs font-semibold text-stone-700 cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-amber-500"
              >
                <option value="all">All Dietary Needs</option>
                {uniqueDietaryOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={14}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none"
              />
            </div>

            {/* Sort Selector */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="appearance-none pl-3 pr-8 py-2 bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded-xl text-xs font-semibold text-stone-700 cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-amber-500"
              >
                <option value="beans_desc">Sort: Highest Beans</option>
                <option value="visits_desc">Sort: Most Visits</option>
                {isAdmin && <option value="spend_desc">Sort: Highest Spend</option>}
                <option value="name_asc">Sort: Name (A-Z)</option>
                <option value="recent_visit">Sort: Recent Visit</option>
              </select>
              <ArrowUpDown
                size={13}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none"
              />
            </div>

            {/* Export CSV (Admin only) */}
            {isAdmin && (
              <button
                onClick={handleExportCSV}
                title="Export filtered customer list to CSV"
                className="flex items-center gap-1.5 px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold text-xs rounded-xl transition-colors shrink-0"
              >
                <Download size={14} />
                <span className="hidden sm:inline">Export CSV</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Customer Data Table (Row Format) */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-stone-50/80 border-b border-stone-200 text-[11px] font-bold text-stone-500 uppercase tracking-wider">
                <th className="py-3.5 px-4">Customer & Status</th>
                <th className="py-3.5 px-4">Membership</th>
                <th className="py-3.5 px-4">Contact</th>
                <th className="py-3.5 px-4">Loyalty Beans</th>
                <th className="py-3.5 px-4">{isAdmin ? 'Spend & Visits' : 'Visits'}</th>
                <th className="py-3.5 px-4">Favorite / Dietary</th>
                <th className="py-3.5 px-4">Last Visit</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredCustomers.length > 0 ? (
                filteredCustomers.map((customer) => (
                  <CustomerTableRow
                    key={customer.id}
                    customer={customer}
                    isAdmin={isAdmin}
                    onAdjustBeans={handleAdjustBeans}
                    onToggleStatus={handleToggleStatusClick}
                    onView={handleView}
                  />
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="py-16 text-center text-stone-400">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-14 h-14 rounded-2xl bg-stone-100 flex items-center justify-center text-stone-400 mb-3">
                        <Users size={24} />
                      </div>
                      <p className="text-base font-semibold text-stone-700">No diners found</p>
                      <p className="text-xs text-stone-400 mt-1 max-w-sm">
                        No customers match your search query or filter criteria. Try resetting the filters.
                      </p>
                      {(searchQuery || selectedTier !== 'all' || statusFilter !== 'all' || dietaryFilter !== 'all') && (
                        <button
                          onClick={() => {
                            setSearchQuery('')
                            setSelectedTier('all')
                            setStatusFilter('all')
                            setDietaryFilter('all')
                          }}
                          className="mt-4 px-4 py-1.5 text-xs font-semibold bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl transition-colors"
                        >
                          Clear All Filters
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="p-4 bg-stone-50/50 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-2">
          <span>
            Showing <strong className="text-stone-800">{filteredCustomers.length}</strong> of{' '}
            <strong className="text-stone-800">{customers.length}</strong> registered diners
          </span>
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>All profiles synced with floor ordering</span>
          </div>
        </div>
      </div>

      {/* Customer Detail Drawer */}
      <CustomerDetailDrawer
        customer={selectedCustomer}
        isOpen={isDetailOpen}
        isAdmin={isAdmin}
        onClose={() => setIsDetailOpen(false)}
        onAdjustBeans={(c) => {
          setIsDetailOpen(false)
          handleAdjustBeans(c)
        }}
        onToggleStatus={(c) => {
          setIsDetailOpen(false)
          handleToggleStatusClick(c)
        }}
      />

      {/* Adjust Loyalty Beans Modal (Admin Only) */}
      <AdjustBeansModal
        customer={selectedCustomer}
        isOpen={isAdjustModalOpen}
        onClose={() => setIsAdjustModalOpen(false)}
        onConfirm={(customerId, delta, reason) => {
          adjustCustomerBeans(customerId, delta, reason)
        }}
      />

      {/* Register New Diner Modal (Admin Only) */}
      <CustomerModal
        isOpen={isCustomerModalOpen}
        onClose={() => setIsCustomerModalOpen(false)}
        onSave={(data) => {
          addCustomer(data)
          showToast(`Registered new customer ${data.name}`)
        }}
      />

      {/* Activate / Deactivate Customer Modal (Admin Only) */}
      <DeactivateCustomerModal
        customer={targetCustomerForStatus}
        isOpen={isDeactivateModalOpen}
        onClose={() => setIsDeactivateModalOpen(false)}
        onConfirm={() => {
          if (targetCustomerForStatus) {
            toggleCustomerStatus(targetCustomerForStatus.id)
          }
        }}
      />
    </div>
  )
}
