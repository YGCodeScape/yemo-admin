'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { X, Plus, Trash2, Sparkles, Image as ImageIcon } from 'lucide-react'
import {
  MenuItem,
  MenuCategory,
  DietaryType,
  ItemBadge,
} from '@/store/useAdminStore'

interface MenuModalProps {
  isOpen: boolean
  initialItem?: MenuItem | null
  onClose: () => void
  onSave: (data: Omit<MenuItem, 'id' | 'createdAt' | 'updatedAt'>) => void
}

// Available high-res café product images
const PRESET_IMAGES = [
  { label: 'Cappuccino', src: '/products/cappuccino.jpg' },
  { label: 'Caramel Latte', src: '/products/caramel-latte.jpg' },
  { label: 'Vanilla Latte', src: '/products/vanilla-latte.jpg' },
  { label: 'Mocha', src: '/products/mocha.jpg' },
  { label: 'Americano', src: '/products/americano.jpg' },
  { label: 'Nitro Cold Brew', src: '/products/cold-brew.jpg' },
  { label: 'Berry Mojito', src: '/products/berry-mojito.jpg' },
  { label: 'Butter Croissant', src: '/products/croissant.jpg' },
  { label: 'Choco Croissant', src: '/products/choco-croissant.jpg' },
  { label: 'Glazed Doughnut', src: '/products/doughnut.jpg' },
  { label: 'NY Cheesecake', src: '/products/cheesecake.jpg' },
  { label: 'Herb Sandwich', src: '/products/sandwich.jpg' },
]

export default function MenuModal({
  isOpen,
  initialItem,
  onClose,
  onSave,
}: MenuModalProps) {
  const [name, setName] = useState('')
  const [category, setCategory] = useState<MenuCategory>('coffee')
  const [price, setPrice] = useState<number>(200)
  const [costPrice, setCostPrice] = useState<number>(60)
  const [description, setDescription] = useState('')
  const [image, setImage] = useState('/products/cappuccino.jpg')
  const [isAvailable, setIsAvailable] = useState(true)
  const [dietary, setDietary] = useState<DietaryType>('veg')
  const [prepTimeMinutes, setPrepTimeMinutes] = useState<number>(5)
  const [badge, setBadge] = useState<ItemBadge | undefined>(undefined)
  const [ingredientInput, setIngredientInput] = useState('')
  const [ingredients, setIngredients] = useState<string[]>([])
  const [calories, setCalories] = useState<number | undefined>(undefined)
  const [allergensInput, setAllergensInput] = useState('')

  useEffect(() => {
    if (initialItem) {
      setName(initialItem.name)
      setCategory(initialItem.category)
      setPrice(initialItem.price)
      setCostPrice(initialItem.costPrice || 50)
      setDescription(initialItem.description)
      setImage(initialItem.image)
      setIsAvailable(initialItem.isAvailable)
      setDietary(initialItem.dietary)
      setPrepTimeMinutes(initialItem.prepTimeMinutes)
      setBadge(initialItem.badge)
      setIngredients(initialItem.ingredients || [])
      setCalories(initialItem.calories)
      setAllergensInput(initialItem.allergens ? initialItem.allergens.join(', ') : '')
    } else {
      // Defaults for new item
      setName('')
      setCategory('coffee')
      setPrice(220)
      setCostPrice(65)
      setDescription('')
      setImage('/products/cappuccino.jpg')
      setIsAvailable(true)
      setDietary('veg')
      setPrepTimeMinutes(5)
      setBadge(undefined)
      setIngredients(['Espresso', 'Steamed Milk'])
      setCalories(140)
      setAllergensInput('Dairy')
    }
  }, [initialItem, isOpen])

  if (!isOpen) return null

  const handleAddIngredient = () => {
    if (ingredientInput.trim() && !ingredients.includes(ingredientInput.trim())) {
      setIngredients([...ingredients, ingredientInput.trim()])
      setIngredientInput('')
    }
  }

  const handleRemoveIngredient = (ing: string) => {
    setIngredients(ingredients.filter((i) => i !== ing))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    const allergensList = allergensInput
      .split(',')
      .map((a) => a.trim())
      .filter(Boolean)

    onSave({
      name: name.trim(),
      category,
      price: Number(price),
      costPrice: Number(costPrice) || undefined,
      description: description.trim(),
      image,
      isAvailable,
      dietary,
      prepTimeMinutes: Number(prepTimeMinutes) || 5,
      badge: badge || undefined,
      ingredients,
      calories: calories ? Number(calories) : undefined,
      allergens: allergensList.length > 0 ? allergensList : undefined,
    })
    onClose()
  }

  const profit = price - (costPrice || 0)
  const marginPercent = price > 0 ? Math.round((profit / price) * 100) : 0

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl border border-[#EDE2D5] shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4.5 border-b border-[#EDE2D5] flex items-center justify-between bg-[#FDFBF7]">
          <div>
            <h2
              className="text-[19px] font-bold text-[#2C1A0E]"
              style={{ fontFamily: '"Playfair Display", Georgia, serif' }}
            >
              {initialItem ? 'Edit Menu Item' : 'Add New Menu Item'}
            </h2>
            <p className="text-[12px] text-[#A08878]">
              {initialItem
                ? `Update details for "${initialItem.name}"`
                : 'Create a new beverage, pastry, or food item for your café.'}
            </p>
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
          {/* Row 1: Item Name & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[12px] font-bold text-[#2C1A0E] mb-1.5">
                Item Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Vanilla Bean Oat Latte"
                className="w-full px-3.5 py-2.5 bg-white border border-[#EBDCCF] rounded-xl text-[13px] text-[#2C1A0E] focus:outline-none focus:ring-2 focus:ring-[#C87D55]/30 focus:border-[#C87D55]"
              />
            </div>

            <div>
              <label className="block text-[12px] font-bold text-[#2C1A0E] mb-1.5">
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as MenuCategory)}
                className="w-full px-3.5 py-2.5 bg-white border border-[#EBDCCF] rounded-xl text-[13px] text-[#2C1A0E] focus:outline-none focus:ring-2 focus:ring-[#C87D55]/30 focus:border-[#C87D55]"
              >
                <option value="coffee">☕ Coffee</option>
                <option value="cold_brew">🧊 Cold Brew & Refreshers</option>
                <option value="bakery">🥐 Bakery & Pastry</option>
                <option value="food">🥪 Sandwiches & Bites</option>
              </select>
            </div>
          </div>

          {/* Row 2: Pricing & Margin preview */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-3.5 bg-[#FAF5EE] border border-[#EDE2D5] rounded-2xl">
            <div>
              <label className="block text-[11px] font-bold text-[#2C1A0E] mb-1">
                Selling Price (₹) *
              </label>
              <input
                type="number"
                required
                min={0}
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full px-3 py-2 bg-white border border-[#EBDCCF] rounded-xl text-[13px] font-bold text-[#8C4A28] focus:outline-none focus:ring-2 focus:ring-[#C87D55]/30"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#2C1A0E] mb-1">
                Cost Price (₹)
              </label>
              <input
                type="number"
                min={0}
                value={costPrice}
                onChange={(e) => setCostPrice(Number(e.target.value))}
                className="w-full px-3 py-2 bg-white border border-[#EBDCCF] rounded-xl text-[13px] text-[#7A614E] focus:outline-none focus:ring-2 focus:ring-[#C87D55]/30"
              />
            </div>

            <div className="flex flex-col justify-center">
              <span className="text-[10px] font-bold text-[#8C705B] uppercase tracking-wider">
                Gross Margin
              </span>
              <div className="mt-0.5 flex items-baseline gap-1.5">
                <span className="text-[14px] font-bold text-emerald-700">
                  ₹{profit}
                </span>
                <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.2 rounded-full">
                  +{marginPercent}%
                </span>
              </div>
            </div>
          </div>

          {/* Row 3: Dietary, Prep Time, Badge */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-[12px] font-bold text-[#2C1A0E] mb-1.5">
                Dietary Preference
              </label>
              <select
                value={dietary}
                onChange={(e) => setDietary(e.target.value as DietaryType)}
                className="w-full px-3.5 py-2.5 bg-white border border-[#EBDCCF] rounded-xl text-[13px] text-[#2C1A0E] focus:outline-none focus:ring-2 focus:ring-[#C87D55]/30"
              >
                <option value="veg">🌱 Vegetarian</option>
                <option value="vegan">🌿 Vegan (100% Plant)</option>
                <option value="non_veg">🍗 Non-Vegetarian</option>
              </select>
            </div>

            <div>
              <label className="block text-[12px] font-bold text-[#2C1A0E] mb-1.5">
                Prep Time (mins)
              </label>
              <input
                type="number"
                min={1}
                max={60}
                value={prepTimeMinutes}
                onChange={(e) => setPrepTimeMinutes(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-white border border-[#EBDCCF] rounded-xl text-[13px] text-[#2C1A0E] focus:outline-none focus:ring-2 focus:ring-[#C87D55]/30"
              />
            </div>

            <div>
              <label className="block text-[12px] font-bold text-[#2C1A0E] mb-1.5">
                Promotional Badge
              </label>
              <select
                value={badge || ''}
                onChange={(e) =>
                  setBadge(e.target.value ? (e.target.value as ItemBadge) : undefined)
                }
                className="w-full px-3.5 py-2.5 bg-white border border-[#EBDCCF] rounded-xl text-[13px] text-[#2C1A0E] focus:outline-none focus:ring-2 focus:ring-[#C87D55]/30"
              >
                <option value="">None (Standard)</option>
                <option value="bestseller">🔥 Bestseller</option>
                <option value="seasonal">✨ Seasonal Special</option>
                <option value="new">🆕 New Addition</option>
                <option value="chef_special">👨‍🍳 Chef Special</option>
              </select>
            </div>
          </div>

          {/* Row 4: Image Selector (Presets Gallery) */}
          <div>
            <label className="block text-[12px] font-bold text-[#2C1A0E] mb-1.5">
              Select Item Photo
            </label>
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 max-h-32 overflow-y-auto p-2 bg-[#FDFBF7] border border-[#EBDCCF] rounded-2xl">
              {PRESET_IMAGES.map((preset) => (
                <button
                  key={preset.src}
                  type="button"
                  onClick={() => setImage(preset.src)}
                  className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                    image === preset.src
                      ? 'border-[#C87D55] ring-2 ring-[#C87D55]/40 scale-95 shadow-sm'
                      : 'border-transparent opacity-75 hover:opacity-100 hover:border-[#D9C4B0]'
                  }`}
                  title={preset.label}
                >
                  <Image
                    src={preset.src}
                    alt={preset.label}
                    fill
                    className="object-cover"
                  />
                  {image === preset.src && (
                    <div className="absolute inset-0 bg-[#C87D55]/20 flex items-center justify-center">
                      <span className="w-4 h-4 rounded-full bg-[#C87D55] text-white text-[9px] flex items-center justify-center font-bold">
                        ✓
                      </span>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Row 5: Description */}
          <div>
            <label className="block text-[12px] font-bold text-[#2C1A0E] mb-1.5">
              Description
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Flavor notes, roast profile, origin, or culinary highlights..."
              className="w-full px-3.5 py-2 bg-white border border-[#EBDCCF] rounded-xl text-[13px] text-[#2C1A0E] focus:outline-none focus:ring-2 focus:ring-[#C87D55]/30"
            />
          </div>

          {/* Row 6: Ingredients Tags */}
          <div>
            <label className="block text-[12px] font-bold text-[#2C1A0E] mb-1.5">
              Ingredients
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={ingredientInput}
                onChange={(e) => setIngredientInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    handleAddIngredient()
                  }
                }}
                placeholder="e.g. Oat Milk, Espresso"
                className="flex-1 px-3 py-1.5 bg-white border border-[#EBDCCF] rounded-xl text-[12px]"
              />
              <button
                type="button"
                onClick={handleAddIngredient}
                className="px-3 py-1.5 rounded-xl bg-[#FAF5EE] text-[#8C4A28] border border-[#EADBCC] text-[12px] font-bold hover:bg-[#F2E7D8]"
              >
                <Plus size={14} className="inline mr-1" /> Add
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {ingredients.map((ing) => (
                <span
                  key={ing}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] bg-[#FAF5EE] text-[#7A614E] border border-[#EADBCC]"
                >
                  <span>{ing}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveIngredient(ing)}
                    className="text-stone-400 hover:text-red-500"
                  >
                    <X size={11} />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Row 7: Calories, Allergens & In Stock Switch */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-[#F2EAE0]">
            <div>
              <label className="block text-[11px] font-bold text-[#2C1A0E] mb-1">
                Calories (kcal)
              </label>
              <input
                type="number"
                min={0}
                value={calories || ''}
                onChange={(e) =>
                  setCalories(e.target.value ? Number(e.target.value) : undefined)
                }
                placeholder="e.g. 180"
                className="w-full px-3 py-1.5 bg-white border border-[#EBDCCF] rounded-xl text-[12px]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#2C1A0E] mb-1">
                Allergens (comma separated)
              </label>
              <input
                type="text"
                value={allergensInput}
                onChange={(e) => setAllergensInput(e.target.value)}
                placeholder="e.g. Dairy, Gluten"
                className="w-full px-3 py-1.5 bg-white border border-[#EBDCCF] rounded-xl text-[12px]"
              />
            </div>

            <div className="flex items-center justify-between sm:justify-start sm:gap-3 sm:pt-4">
              <span className="text-[12px] font-bold text-[#2C1A0E]">
                Active In Stock
              </span>
              <button
                type="button"
                onClick={() => setIsAvailable(!isAvailable)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                  isAvailable ? 'bg-emerald-500' : 'bg-stone-300'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                    isAvailable ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Form Actions */}
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
              {initialItem ? 'Save Changes' : 'Create Item'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
