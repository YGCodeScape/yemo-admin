'use client'

import React, { useState } from 'react'
import { X, Plus, Trash2, FilePlus, Calculator, Truck } from 'lucide-react'
import {
  RestockOrder,
  RestockOrderItem,
  RestockStatus,
  InventoryItem,
} from '@/store/useAdminStore'

interface RestockModalProps {
  isOpen: boolean
  inventory: InventoryItem[]
  onClose: () => void
  onSave: (order: Omit<RestockOrder, 'id' | 'poNumber' | 'orderDate'>) => void
}

const COMMON_SUPPLIERS = [
  'Blue Tokai Roasters',
  'Country Delight Dairy',
  'Oatly India',
  'Monin Gourmet Syrups',
  'President Dairy',
  'EcoPack India',
  'Callebaut Belgium',
  'Golden Mill Foods',
  'Hydroponics Hub',
  'Mahabaleshwar Fresh',
]

export default function RestockModal({
  isOpen,
  inventory,
  onClose,
  onSave,
}: RestockModalProps) {
  const [supplier, setSupplier] = useState('Blue Tokai Roasters')
  const [customSupplier, setCustomSupplier] = useState('')
  const [supplierInvoiceNo, setSupplierInvoiceNo] = useState('')
  const [status, setStatus] = useState<RestockStatus>('received')
  const [deliveryDate, setDeliveryDate] = useState('Today (Verified)')
  const [receivedBy, setReceivedBy] = useState('ADM-001 Ananya')
  const [notes, setNotes] = useState('')

  // Order Items
  const [items, setItems] = useState<RestockOrderItem[]>([
    {
      inventoryItemId: inventory[0]?.id || '',
      itemName: inventory[0]?.name || 'Arabica Signature Espresso Beans',
      quantity: 10,
      unit: inventory[0]?.unit || 'kg',
      unitCost: inventory[0]?.costPerUnit || 950,
      totalCost: 9500,
    },
  ])

  if (!isOpen) return null

  const handleItemChange = (index: number, invId: string) => {
    const selected = inventory.find((i) => i.id === invId)
    if (!selected) return

    setItems((prev) =>
      prev.map((item, idx) => {
        if (idx !== index) return item
        const cost = selected.costPerUnit
        return {
          inventoryItemId: selected.id,
          itemName: selected.name,
          quantity: item.quantity,
          unit: selected.unit,
          unitCost: cost,
          totalCost: Math.round(item.quantity * cost),
        }
      })
    )
  }

  const handleQuantityChange = (index: number, qty: number) => {
    setItems((prev) =>
      prev.map((item, idx) => {
        if (idx !== index) return item
        const q = Math.max(0, qty)
        return {
          ...item,
          quantity: q,
          totalCost: Math.round(q * item.unitCost),
        }
      })
    )
  }

  const handleCostChange = (index: number, cost: number) => {
    setItems((prev) =>
      prev.map((item, idx) => {
        if (idx !== index) return item
        const c = Math.max(0, cost)
        return {
          ...item,
          unitCost: c,
          totalCost: Math.round(item.quantity * c),
        }
      })
    )
  }

  const handleAddItem = () => {
    const defaultInv = inventory[0]
    setItems([
      ...items,
      {
        inventoryItemId: defaultInv?.id,
        itemName: defaultInv?.name || 'Supply Item',
        quantity: 5,
        unit: defaultInv?.unit || 'kg',
        unitCost: defaultInv?.costPerUnit || 500,
        totalCost: (defaultInv?.costPerUnit || 500) * 5,
      },
    ])
  }

  const handleRemoveItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, idx) => idx !== index))
    }
  }

  const totalAmount = items.reduce((acc, curr) => acc + curr.totalCost, 0)
  const finalSupplier =
    supplier === 'Other' && customSupplier.trim() ? customSupplier.trim() : supplier

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!finalSupplier) return

    onSave({
      supplier: finalSupplier,
      supplierInvoiceNo: supplierInvoiceNo.trim() || undefined,
      items,
      totalAmount,
      status,
      deliveryDate: deliveryDate.trim() || undefined,
      receivedBy: receivedBy.trim() || 'ADM-001',
      notes: notes.trim() || undefined,
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl border border-[#EDE2D5] shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4.5 border-b border-[#EDE2D5] flex items-center justify-between bg-[#FDFBF7]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#FAF5EE] text-[#8C4A28] border border-[#EADBCC] flex items-center justify-center">
              <FilePlus size={18} />
            </div>
            <div>
              <h2
                className="text-[19px] font-bold text-[#2C1A0E]"
                style={{ fontFamily: '"Playfair Display", Georgia, serif' }}
              >
                Log New Restock Order
              </h2>
              <p className="text-[12px] text-[#A08878]">
                Record vendor deliveries and automatically update inventory stock balances.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#A08878] hover:text-[#2C1A0E] hover:bg-black/5 rounded-full transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Row 1: Supplier & Invoice Number */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-[12px] font-bold text-[#2C1A0E] mb-1.5">
                Vendor / Supplier *
              </label>
              <select
                value={supplier}
                onChange={(e) => setSupplier(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-[#EBDCCF] rounded-xl text-[13px] text-[#2C1A0E] focus:outline-none focus:ring-2 focus:ring-[#C87D55]/30 focus:border-[#C87D55]"
              >
                {COMMON_SUPPLIERS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
                <option value="Other">+ Other Vendor</option>
              </select>
              {supplier === 'Other' && (
                <input
                  type="text"
                  required
                  placeholder="Enter vendor name..."
                  value={customSupplier}
                  onChange={(e) => setCustomSupplier(e.target.value)}
                  className="mt-2 w-full px-3.5 py-2 bg-white border border-[#EBDCCF] rounded-xl text-[13px]"
                />
              )}
            </div>

            <div>
              <label className="block text-[12px] font-bold text-[#2C1A0E] mb-1.5">
                Vendor Invoice #
              </label>
              <input
                type="text"
                value={supplierInvoiceNo}
                onChange={(e) => setSupplierInvoiceNo(e.target.value)}
                placeholder="e.g. INV-8921"
                className="w-full px-3.5 py-2.5 bg-white border border-[#EBDCCF] rounded-xl text-[13px] font-mono text-[#2C1A0E] focus:outline-none focus:ring-2 focus:ring-[#C87D55]/30"
              />
            </div>
          </div>

          {/* Row 2: Status, Date, Received By */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-3.5 bg-[#FAF5EE] border border-[#EDE2D5] rounded-2xl">
            <div>
              <label className="block text-[11px] font-bold text-[#2C1A0E] mb-1">
                Shipment Status *
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as RestockStatus)}
                className="w-full px-3 py-2 bg-white border border-[#EBDCCF] rounded-xl text-[12px] font-bold text-[#2C1A0E]"
              >
                <option value="received">🟢 Received & Verified</option>
                <option value="pending">🟡 Pending / In-Transit</option>
                <option value="partially_received">🟠 Partially Received</option>
              </select>
              <span className="text-[10px] text-[#A08878] mt-1 block">
                {status === 'received'
                  ? '⚡ Auto-adds to stock upon saving'
                  : 'Does not increment stock until verified'}
              </span>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#2C1A0E] mb-1">
                Delivery / Arrival Date
              </label>
              <input
                type="text"
                value={deliveryDate}
                onChange={(e) => setDeliveryDate(e.target.value)}
                placeholder="e.g. Today 10:00 AM"
                className="w-full px-3 py-2 bg-white border border-[#EBDCCF] rounded-xl text-[12px]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#2C1A0E] mb-1">
                Received By (Staff ID)
              </label>
              <input
                type="text"
                value={receivedBy}
                onChange={(e) => setReceivedBy(e.target.value)}
                placeholder="e.g. ADM-001 Ananya"
                className="w-full px-3 py-2 bg-white border border-[#EBDCCF] rounded-xl text-[12px]"
              />
            </div>
          </div>

          {/* Row 3: Itemized Supplies List */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-[12px] font-bold text-[#2C1A0E] uppercase tracking-wider">
                Supply Items in this Shipment
              </label>
              <button
                type="button"
                onClick={handleAddItem}
                className="text-[12px] font-bold text-[#8C4A28] hover:text-[#2C1A0E] flex items-center gap-1"
              >
                <Plus size={14} /> Add Another Item
              </button>
            </div>

            <div className="space-y-2.5">
              {items.map((item, index) => (
                <div
                  key={index}
                  className="p-3 bg-white border border-[#EBDCCF] rounded-2xl flex flex-col sm:flex-row items-center gap-2.5 shadow-2xs"
                >
                  {/* Select Inventory Item */}
                  <div className="flex-1 w-full sm:w-auto">
                    <select
                      value={item.inventoryItemId}
                      onChange={(e) => handleItemChange(index, e.target.value)}
                      className="w-full px-3 py-1.5 bg-[#FAF7F4] border border-[#EBDCCF] rounded-xl text-[12px] font-medium text-[#2C1A0E]"
                    >
                      {inventory.map((inv) => (
                        <option key={inv.id} value={inv.id}>
                          {inv.name} ({inv.currentStock} {inv.unit} in stock)
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Quantity & Unit */}
                  <div className="w-full sm:w-32 flex items-center gap-1">
                    <input
                      type="number"
                      min={1}
                      step="any"
                      value={item.quantity}
                      onChange={(e) =>
                        handleQuantityChange(index, parseFloat(e.target.value) || 0)
                      }
                      className="w-20 px-2.5 py-1.5 bg-[#FAF7F4] border border-[#EBDCCF] rounded-xl text-[12px] font-bold text-center"
                    />
                    <span className="text-[12px] font-medium text-[#7A614E]">
                      {item.unit}
                    </span>
                  </div>

                  {/* Unit Cost */}
                  <div className="w-full sm:w-32 flex items-center gap-1">
                    <span className="text-[12px] text-[#A08878]">@ ₹</span>
                    <input
                      type="number"
                      min={0}
                      step="any"
                      value={item.unitCost}
                      onChange={(e) =>
                        handleCostChange(index, parseFloat(e.target.value) || 0)
                      }
                      className="w-20 px-2 py-1.5 bg-[#FAF7F4] border border-[#EBDCCF] rounded-xl text-[12px] font-bold text-center"
                    />
                  </div>

                  {/* Line Total */}
                  <div className="w-full sm:w-28 text-right font-bold text-[13px] text-[#8C4A28]">
                    ₹{item.totalCost.toLocaleString('en-IN')}
                  </div>

                  {/* Remove Item */}
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(index)}
                    disabled={items.length === 1}
                    className="p-1.5 text-stone-400 hover:text-red-500 disabled:opacity-30 rounded-lg transition-colors"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Row 4: Total Cost Calculation Banner */}
          <div className="p-4 bg-[#FAF5EE] border border-[#EDE2D5] rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calculator size={18} className="text-[#C87D55]" />
              <span className="text-[13px] font-bold text-[#2C1A0E]">
                Total Shipment Order Value:
              </span>
            </div>
            <div className="text-[22px] font-bold text-[#8C4A28]">
              ₹{totalAmount.toLocaleString('en-IN')}
            </div>
          </div>

          {/* Row 5: Notes & Inspection Remarks */}
          <div>
            <label className="block text-[12px] font-bold text-[#2C1A0E] mb-1.5">
              Receiving Notes & Quality Checks
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Temperature checks passed, intact security seals, packaging in pristine condition."
              className="w-full px-3.5 py-2 bg-white border border-[#EBDCCF] rounded-xl text-[13px] text-[#2C1A0E]"
            />
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-[#EDE2D5] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-full border border-[#EDE2D5] text-[13px] font-bold text-[#7A614E] hover:bg-[#FAF5EE] transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-full bg-[#2C1A0E] text-white text-[13px] font-bold hover:bg-[#1E110A] transition-all active:scale-95 shadow-sm"
            >
              Save Restock Order
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
