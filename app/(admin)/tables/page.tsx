'use client'

import React, { useState } from 'react'
import {
  Calendar,
  Plus,
  QrCode,
  Download,
  Users,
  Grid2X2,
  Sparkles,
} from 'lucide-react'
import { useAdminStore, Table, TableStatus } from '@/store/useAdminStore'
import { useAuthStore } from '@/store/useAuthStore'
import FloorPlan from '@/components/tables/FloorPlan'
import TableDetailPanel from '@/components/tables/TableDetailPanel'
import TableCard from '@/components/tables/TableCard'
import TableQrModal from '@/components/tables/TableQrModal'
import AddTableModal from '@/components/tables/AddTableModal'

export default function TablesPage() {
  const user = useAuthStore((s) => s.user)
  const tables = useAdminStore((s) => s.tables)
  const orders = useAdminStore((s) => s.orders)
  const showToast = useAdminStore((s) => s.showToast)

  // View state: 'floor' | 'list' | 'qr'
  const [viewMode, setViewMode] = useState<'floor' | 'list' | 'qr'>('floor')

  // Selected table for the detail panel (defaults to Table 07 as in design)
  const defaultTable = tables.find((t) => t.number === '07') || tables[0]
  const [selectedTable, setSelectedTable] = useState<Table>(defaultTable)

  // Modals state
  const [selectedQrTable, setSelectedQrTable] = useState<Table | null>(null)
  const [isAddTableOpen, setIsAddTableOpen] = useState(false)

  // Synchronize selected table with store updates
  const activeSelectedTable = tables.find((t) => t.id === selectedTable.id) || selectedTable
  const activeOrder = orders.find(
    (o) => o.tableNumber === activeSelectedTable.number && o.status !== 'completed'
  )

  // Metric counts
  const availableCount = tables.filter((t) => t.status === 'available').length
  const occupiedCount = tables.filter((t) => t.status === 'occupied').length
  const orderingCount = tables.filter((t) => t.status === 'ordering').length
  const cleaningCount = tables.filter((t) => t.status === 'cleaning').length

  const occupiedPercent = Math.round((occupiedCount / (tables.length || 1)) * 100)
  const orderingPercent = Math.round((orderingCount / (tables.length || 1)) * 100)
  const availablePercent = Math.round((availableCount / (tables.length || 1)) * 100)

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-[1700px] mx-auto pb-24">
      {/* ── Top Header ── */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1
            className="text-[26px] sm:text-[32px] font-bold text-[#2C1A0E] tracking-tight leading-tight"
            style={{ fontFamily: '"Playfair Display", Georgia, serif' }}
          >
            Table Management
          </h1>
          <p className="text-[13px] text-[#A08878] mt-1 font-medium">
            Monitor table status, manage orders and keep your café running smoothly.
          </p>
        </div>

        {/* Right Header Badges & Add Table Button */}
        <div className="flex items-center gap-3">
          {user?.role === 'admin' && (
            <button
              onClick={() => setIsAddTableOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 bg-[#8C4A28] hover:bg-[#6F381D] text-white text-[12px] font-bold rounded-xl shadow-xs transition-all active:scale-95"
            >
              <Plus size={15} />
              <span>Add Table</span>
            </button>
          )}
        </div>
      </div>

      {/* ── Metric Snapshot Cards (4 Compact Cards) ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Tables */}
        <div className="bg-white border border-[#EDE2D5] rounded-2xl p-4 shadow-2xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#FAF5EE] border border-[#EBDCCF] flex items-center justify-center text-[#8C4A28] flex-shrink-0">
            <Grid2X2 size={18} />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase text-[#A08878] tracking-wider block">
              Total Tables
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-[22px] font-bold text-[#2C1A0E]">{tables.length}</span>
              <span className="text-[10px] text-[#A08878]">Seating</span>
            </div>
          </div>
        </div>

        {/* Occupied */}
        <div className="bg-white border border-[#EDE2D5] rounded-2xl p-4 shadow-2xs flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-red-500 flex-shrink-0 ml-1" />
          <div>
            <span className="text-[11px] font-bold uppercase text-[#A08878] tracking-wider block">
              Occupied
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-[22px] font-bold text-[#2C1A0E]">{occupiedCount}</span>
              <span className="text-[11px] font-semibold text-red-600">{occupiedPercent}%</span>
            </div>
          </div>
        </div>

        {/* Ordering */}
        <div className="bg-white border border-[#EDE2D5] rounded-2xl p-4 shadow-2xs flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-amber-400 animate-pulse flex-shrink-0 ml-1" />
          <div>
            <span className="text-[11px] font-bold uppercase text-[#A08878] tracking-wider block">
              Ordering
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-[22px] font-bold text-[#2C1A0E]">{orderingCount}</span>
              <span className="text-[11px] font-semibold text-amber-600">{orderingPercent}%</span>
            </div>
          </div>
        </div>

        {/* Available */}
        <div className="bg-white border border-[#EDE2D5] rounded-2xl p-4 shadow-2xs flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-emerald-500 flex-shrink-0 ml-1" />
          <div>
            <span className="text-[11px] font-bold uppercase text-[#A08878] tracking-wider block">
              Available
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-[22px] font-bold text-[#2C1A0E]">{availableCount}</span>
              <span className="text-[11px] font-semibold text-emerald-600">{availablePercent}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── View Filter Tabs & Legend Row ── */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* View Mode Tabs */}
        <div className="flex items-center bg-[#FAF5EE] border border-[#EBDCCF] p-1 rounded-2xl shadow-2xs">
          {[
            { id: 'floor', label: 'Floor View' },
            { id: 'list', label: 'Table List' },
            { id: 'qr', label: 'QR Management' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setViewMode(tab.id as 'floor' | 'list' | 'qr')}
              className={`px-4 py-1.5 rounded-xl text-[12px] font-bold transition-all ${
                viewMode === tab.id
                  ? 'bg-[#6C3E26] text-white shadow-xs'
                  : 'text-[#8C705B] hover:text-[#2C1A0E]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Status Legend */}
        <div className="flex items-center gap-4 text-[11px] font-semibold text-[#8C705B] bg-white border border-[#EDE2D5] px-4 py-2 rounded-xl shadow-2xs">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Available</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span>Ordering</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-500" />
            <span>Occupied</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-stone-400" />
            <span>Cleaning</span>
          </div>
        </div>
      </div>

      {/* ── MAIN CONTENT: Floor View (Floor Plan + Right Detail Panel) ── */}
      {viewMode === 'floor' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column (8 cols): Floor Plan Canvas */}
          <div className="lg:col-span-8">
            <FloorPlan
              tables={tables}
              orders={orders}
              selectedTableId={activeSelectedTable.id}
              onSelectTable={(tbl) => setSelectedTable(tbl)}
              onOpenQr={(tbl) => setSelectedQrTable(tbl)}
            />
          </div>

          {/* Right Column (4 cols): Selected Table Detail Sidebar */}
          <div className="lg:col-span-4 sticky top-20">
            <TableDetailPanel
              table={activeSelectedTable}
              activeOrder={activeOrder}
              onOpenQr={(tbl) => setSelectedQrTable(tbl)}
            />
          </div>
        </div>
      )}

      {/* ── Table List View ── */}
      {viewMode === 'list' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
          {tables.map((table) => {
            const linkedOrder = orders.find(
              (o) => o.tableNumber === table.number && o.status !== 'completed'
            )
            return (
              <TableCard
                key={table.id}
                table={table}
                activeOrder={linkedOrder}
                onOpenQr={(tbl) => setSelectedQrTable(tbl)}
              />
            )
          })}
        </div>
      )}

      {/* ── QR Management View ── */}
      {viewMode === 'qr' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-white border border-[#EDE2D5] rounded-2xl p-4">
            <div>
              <h3 className="text-[16px] font-bold text-[#2C1A0E]">
                All Table QR Stands
              </h3>
              <p className="text-[12px] text-[#A08878]">
                Batch preview and export physical table stand tent cards
              </p>
            </div>
            <button
              onClick={() => showToast('Exporting all 12 QR Stand PDFs... 🖨️')}
              className="px-4 py-2 bg-[#8C4A28] text-white rounded-xl text-[12px] font-bold shadow-xs flex items-center gap-1.5"
            >
              <Download size={14} />
              <span>Download All (PDF)</span>
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {tables.map((tbl) => (
              <div
                key={tbl.id}
                onClick={() => setSelectedQrTable(tbl)}
                className="bg-white border border-[#EDE2D5] rounded-2xl p-4 text-center cursor-pointer hover:border-[#C87D55] transition-all shadow-2xs hover:shadow-sm"
              >
                <div className="w-16 h-16 mx-auto mb-2 bg-[#FAF7F4] rounded-xl flex items-center justify-center border border-[#EBDCCF] text-[#8C4A28]">
                  <QrCode size={32} />
                </div>
                <h4 className="font-bold text-[14px] text-[#2C1A0E]">
                  Table {tbl.number}
                </h4>
                <p className="text-[10px] text-[#A08878]">{tbl.capacity} Seats</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Modals ── */}
      <TableQrModal
        table={selectedQrTable}
        onClose={() => setSelectedQrTable(null)}
      />

      <AddTableModal
        isOpen={isAddTableOpen}
        onClose={() => setIsAddTableOpen(false)}
      />
    </div>
  )
}
