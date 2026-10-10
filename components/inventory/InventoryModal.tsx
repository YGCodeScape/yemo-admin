'use client'

import React, { useState, useEffect } from 'react'
import { X, PackagePlus, Edit3 } from 'lucide-react'
import { InventoryItem, InventoryCategory } from '@/store/useAdminStore'

interface InventoryModalProps {
  isOpen: boolean
  initialItem?: InventoryItem | null
  onClose: () => void
  onSave: (data: Omit<InventoryItem, 'id' | 'lastUpdated' | 'status'>) => void
}

export default function InventoryModal({
  isOpen,
  initialItem,
  onClose,
  onSave,
}: InventoryModalProps) {
  const [sku, setSku] = useState('')
  const [name, setName] = useState('')
  const [category, setCategory] = useState<InventoryCategory>('coffee_beans')
  const [currentStock, setCurrentStock] = useState<number>(10)
  const [unit, setUnit] = useState<string>('kg')
  const [minThreshold, setMinThreshold] = useState<number>(5)
  const [maxCapacity, setMaxCapacity] = useState<number>(25)
  const [costPerUnit, setCostPerUnit] = useState<number>(500)
  const [supplier, setSupplier] = useState('')
  const [storageLocation, setStorageLocation] = useState('')

  useEffect(() => {
    if (initialItem) {
      setSku(initialItem.sku)
      setName(initialItem.name)
      setCategory(initialItem.category)
      setCurrentStock(initialItem.currentStock)
      setUnit(initialItem.unit)
      setMinThreshold(initialItem.minThreshold)
      setMaxCapacity(initialItem.maxCapacity || initialItem.minThreshold * 3)
      setCostPerUnit(initialItem.costPerUnit)
      setSupplier(initialItem.supplier || '')
      setStorageLocation(initialItem.storageLocation || '')
    } else {
      setSku(`YMO-${Date.now().toString().slice(-4)}`)
      setName('')
      setCategory('coffee_beans')
      setCurrentStock(10)
      setUnit('kg')
      setMinThreshold(5)
      setMaxCapacity(25)
      setCostPerUnit(650)
      setSupplier('Blue Tokai Roasters')
      setStorageLocation('Barista Bar B-01')
    }
  }, [initialItem, isOpen])

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    onSave({
      sku: sku.trim() || `YMO-${Date.now().toString().slice(-4)}`,
      name: name.trim(),
      category,
      currentStock: Number(currentStock),
      unit: unit.trim() || 'kg',
      minThreshold: Number(minThreshold),
      maxCapacity: Number(maxCapacity) || undefined,
      costPerUnit: Number(costPerUnit),
      supplier: supplier.trim() || undefined,
      storageLocation: storageLocation.trim() || undefined,
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl border border-[#EDE2D5] shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4.5 border-b border-[#EDE2D5] flex items-center justify-between bg-[#FDFBF7]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#FAF5EE] text-[#8C4A28] border border-[#EADBCC] flex items-center justify-center">
              {initialItem ? <Edit3 size={18} /> : <PackagePlus size={18} />}
            </div>
            <div>
              <h2
                className="text-[19px] font-bold text-[#2C1A0E]"
                style={{ fontFamily: '"Playfair Display", Georgia, serif' }}
              >
                {initialItem ? 'Edit Supply Item' : 'Add New Inventory Item'}
              </h2>
              <p className="text-[12px] text-[#A08878]">
                {initialItem
                  ? `Update supply details and parameters for ${initialItem.name}`
                  : 'Track café ingredients, beans, syrups, milk, and packaging stock.'}
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
        <form onSubmit={handleSubmit} className="p-6 space-y-4.5 max-h-[75vh] overflow-y-auto">
          {/* Row 1: Item Name & SKU */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-[12px] font-bold text-[#2C1A0E] mb-1.5">
                Item / Ingredient Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Colombian Supremo Beans"
                className="w-full px-3.5 py-2.5 bg-white border border-[#EBDCCF] rounded-xl text-[13px] text-[#2C1A0E] focus:outline-none focus:ring-2 focus:ring-[#C87D55]/30 focus:border-[#C87D55]"
              />
            </div>

            <div>
              <label className="block text-[12px] font-bold text-[#2C1A0E] mb-1.5">
                SKU / Code *
              </label>
              <input
                type="text"
                required
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                placeholder="e.g. YMO-COF-03"
                className="w-full px-3.5 py-2.5 bg-white border border-[#EBDCCF] rounded-xl text-[13px] font-mono text-[#2C1A0E] focus:outline-none focus:ring-2 focus:ring-[#C87D55]/30 focus:border-[#C87D55]"
              />
            </div>
          </div>

          {/* Row 2: Category & Unit */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[12px] font-bold text-[#2C1A0E] mb-1.5">
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as InventoryCategory)}
                className="w-full px-3.5 py-2.5 bg-white border border-[#EBDCCF] rounded-xl text-[13px] text-[#2C1A0E] focus:outline-none focus:ring-2 focus:ring-[#C87D55]/30"
              >
                <option value="coffee_beans">☕ Coffee Beans & Grounds</option>
                <option value="dairy_milk">🥛 Dairy & Plant Milk</option>
                <option value="syrups">🍯 Syrups & Flavoring Sauces</option>
                <option value="bakery_dry">🥐 Bakery & Dry Ingredients</option>
                <option value="produce">🍓 Fresh Produce & Fruit</option>
                <option value="packaging">📦 Packaging & Disposables</option>
              </select>
            </div>

            <div>
              <label className="block text-[12px] font-bold text-[#2C1A0E] mb-1.5">
                Unit of Measurement *
              </label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-[#EBDCCF] rounded-xl text-[13px] text-[#2C1A0E] focus:outline-none focus:ring-2 focus:ring-[#C87D55]/30"
              >
                <option value="kg">Kilograms (kg)</option>
                <option value="L">Liters (L)</option>
                <option value="bottles">Bottles</option>
                <option value="pcs">Pieces (pcs)</option>
                <option value="packs">Packs / Pouches</option>
                <option value="boxes">Boxes</option>
              </select>
            </div>
          </div>

          {/* Row 3: Stock Counts & Limits */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-[#FAF5EE] border border-[#EDE2D5] rounded-2xl">
            <div>
              <label className="block text-[11px] font-bold text-[#2C1A0E] mb-1">
                Current Stock ({unit}) *
              </label>
              <input
                type="number"
                required
                step="any"
                min={0}
                value={currentStock}
                onChange={(e) => setCurrentStock(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 bg-white border border-[#EBDCCF] rounded-xl text-[13px] font-bold text-[#2C1A0E] focus:outline-none focus:ring-2 focus:ring-[#C87D55]/30"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#2C1A0E] mb-1">
                Min. Safety Threshold ({unit}) *
              </label>
              <input
                type="number"
                required
                step="any"
                min={0}
                value={minThreshold}
                onChange={(e) => setMinThreshold(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 bg-white border border-[#EBDCCF] rounded-xl text-[13px] font-bold text-amber-800 focus:outline-none focus:ring-2 focus:ring-[#C87D55]/30"
              />
              <span className="text-[10px] text-[#A08878] mt-0.5 block">
                Triggers Low Stock alert
              </span>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#2C1A0E] mb-1">
                Max Storage Capacity ({unit})
              </label>
              <input
                type="number"
                step="any"
                min={0}
                value={maxCapacity}
                onChange={(e) => setMaxCapacity(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 bg-white border border-[#EBDCCF] rounded-xl text-[13px] text-[#7A614E] focus:outline-none focus:ring-2 focus:ring-[#C87D55]/30"
              />
              <span className="text-[10px] text-[#A08878] mt-0.5 block">
                For shelf utilization
              </span>
            </div>
          </div>

          {/* Row 4: Pricing, Location & Supplier */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-[12px] font-bold text-[#2C1A0E] mb-1.5">
                Cost Per Unit (₹) *
              </label>
              <input
                type="number"
                required
                min={0}
                step="any"
                value={costPerUnit}
                onChange={(e) => setCostPerUnit(parseFloat(e.target.value) || 0)}
                className="w-full px-3.5 py-2.5 bg-white border border-[#EBDCCF] rounded-xl text-[13px] font-bold text-[#8C4A28] focus:outline-none focus:ring-2 focus:ring-[#C87D55]/30"
              />
            </div>

            <div>
              <label className="block text-[12px] font-bold text-[#2C1A0E] mb-1.5">
                Storage Shelf / Location
              </label>
              <input
                type="text"
                value={storageLocation}
                onChange={(e) => setStorageLocation(e.target.value)}
                placeholder="e.g. Walk-in Chiller C-2"
                className="w-full px-3.5 py-2.5 bg-white border border-[#EBDCCF] rounded-xl text-[13px] text-[#2C1A0E] focus:outline-none focus:ring-2 focus:ring-[#C87D55]/30"
              />
            </div>

            <div>
              <label className="block text-[12px] font-bold text-[#2C1A0E] mb-1.5">
                Supplier / Vendor
              </label>
              <input
                type="text"
                value={supplier}
                onChange={(e) => setSupplier(e.target.value)}
                placeholder="e.g. Blue Tokai Roasters"
                className="w-full px-3.5 py-2.5 bg-white border border-[#EBDCCF] rounded-xl text-[13px] text-[#2C1A0E] focus:outline-none focus:ring-2 focus:ring-[#C87D55]/30"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-[#EDE2D5] flex items-center justify-end gap-3">
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
              {initialItem ? 'Save Changes' : 'Create Inventory Item'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
