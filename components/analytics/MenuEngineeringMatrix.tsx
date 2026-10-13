'use client'

import React, { useState } from 'react'
import {
  Sparkles,
  Star,
  Compass,
  Puzzle,
  TrendingDown,
  TrendingUp,
  Percent,
  ChevronRight,
  Info,
} from 'lucide-react'
import { TimeRange } from './AnalyticsHeader'

type MatrixCategory = 'stars' | 'plowhorses' | 'puzzles' | 'dogs'

interface MenuItemPerformance {
  name: string
  category: string
  price: number
  margin: number
  unitsSold: number
  revenue: number
  actionTip: string
}

const MATRIX_ITEMS: Record<MatrixCategory, { title: string; subtitle: string; icon: any; color: string; items: MenuItemPerformance[] }> = {
  stars: {
    title: 'Stars (High Profit, High Volume)',
    subtitle: 'Core café revenue drivers. Maintain consistency and protect taste recipes.',
    icon: Star,
    color: 'text-amber-500 fill-amber-400',
    items: [
      {
        name: 'Classic Cappuccino',
        category: 'Hot Coffee',
        price: 220,
        margin: 82,
        unitsSold: 310,
        revenue: 68200,
        actionTip: 'Top morning seller. Keep featured on counter display.',
      },
      {
        name: 'Iced Caramel Latte',
        category: 'Iced Coffee',
        price: 280,
        margin: 78,
        unitsSold: 240,
        revenue: 67200,
        actionTip: 'Strongest afternoon & evening iced favorite.',
      },
      {
        name: 'Tiramisu Slice',
        category: 'Bakery & Dessert',
        price: 290,
        margin: 74,
        unitsSold: 180,
        revenue: 52200,
        actionTip: 'Pairs with 38% of evening cappuccino orders.',
      },
    ],
  },
  plowhorses: {
    title: 'Plowhorses (Moderate Margin, High Volume)',
    subtitle: 'Popular staples. Consider subtle price adjustments (+₹10) or recipe portion tweaks.',
    icon: Compass,
    color: 'text-blue-500',
    items: [
      {
        name: 'Butter Croissant',
        category: 'Bakery',
        price: 140,
        margin: 56,
        unitsSold: 215,
        revenue: 30100,
        actionTip: 'Bundle as morning coffee combo to boost total ticket.',
      },
      {
        name: 'Bold Caffe Americano',
        category: 'Hot Coffee',
        price: 180,
        margin: 62,
        unitsSold: 195,
        revenue: 35100,
        actionTip: 'Offer single-origin bean upgrade (+₹40).',
      },
    ],
  },
  puzzles: {
    title: 'Puzzles (High Margin, Lower Volume)',
    subtitle: 'High profit potential. Increase visibility via barista recommendations or chalkboard.',
    icon: Puzzle,
    color: 'text-purple-500',
    items: [
      {
        name: '18-Hour Nitro Cold Brew',
        category: 'Cold Brews',
        price: 260,
        margin: 84,
        unitsSold: 85,
        revenue: 22100,
        actionTip: 'Sample small taster cups during 12 PM - 3 PM coworking hours.',
      },
      {
        name: 'Affogato al Caffè',
        category: 'Specialty',
        price: 250,
        margin: 79,
        unitsSold: 64,
        revenue: 16000,
        actionTip: 'Position as light dessert in QR menu recommendations.',
      },
    ],
  },
  dogs: {
    title: 'Underperformers (Lower Margin, Low Volume)',
    subtitle: 'Items tying up kitchen inventory. Consider replacing or reimagining.',
    icon: TrendingDown,
    color: 'text-stone-400',
    items: [
      {
        name: 'Chamomile Herbal Tisane',
        category: 'Teas',
        price: 160,
        margin: 48,
        unitsSold: 22,
        revenue: 3520,
        actionTip: 'Evaluate replacing with trending Matcha Latte or Boba brew.',
      },
    ],
  },
}

export default function MenuEngineeringMatrix({ timeRange }: { timeRange: TimeRange }) {
  const [activeTab, setActiveTab] = useState<MatrixCategory>('stars')

  const activeGroup = MATRIX_ITEMS[activeTab]

  const categoriesShare = [
    { name: 'Specialty Coffee & Lattes', share: 48, color: 'bg-[#C87D55]' },
    { name: 'Artisanal Bakery & Desserts', share: 24, color: 'bg-[#E0A96D]' },
    { name: 'Cold Brews & Tonics', share: 16, color: 'bg-[#8C4A28]' },
    { name: 'Savory & Sourdough Toasts', share: 12, color: 'bg-[#A08878]' },
  ]

  return (
    <div className="bg-white p-5 md:p-6 rounded-3xl border border-[#EDE2D5] shadow-2xs space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h3
              className="text-lg md:text-xl font-bold text-[#2C1A0E]"
              style={{ fontFamily: '"Playfair Display", Georgia, serif' }}
            >
              Menu Engineering & Profitability Matrix
            </h3>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#FAF5EE] text-[#8C4A28] border border-[#EDE2D5]">
              BCG Menu Matrix
            </span>
          </div>
          <p className="text-[12px] text-[#8C705B] mt-0.5">
            Optimize café margin by analyzing item popularity vs gross profit contribution.
          </p>
        </div>

        {/* Matrix Quadrant Switcher */}
        <div className="flex items-center gap-1.5 p-1 bg-[#FAF5EE] rounded-2xl border border-[#EDE2D5] text-[11px] font-semibold text-[#8C705B] overflow-x-auto">
          {(['stars', 'plowhorses', 'puzzles', 'dogs'] as MatrixCategory[]).map((tab) => {
            const group = MATRIX_ITEMS[tab]
            const Icon = group.icon
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl capitalize transition-all whitespace-nowrap ${
                  activeTab === tab
                    ? 'bg-white text-[#2C1A0E] font-bold shadow-2xs'
                    : 'hover:text-[#2C1A0E]'
                }`}
              >
                <Icon size={12} className={group.color} />
                <span>{tab}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Active Quadrant Details Banner */}
      <div className="p-4 rounded-2xl bg-[#FDFBF7] border border-[#F2EAE0] flex flex-col md:flex-row md:items-center justify-between gap-2 text-xs">
        <div>
          <h4 className="font-bold text-[#2C1A0E] text-sm flex items-center gap-2">
            <span>{activeGroup.title}</span>
          </h4>
          <p className="text-[#8C705B] mt-0.5">{activeGroup.subtitle}</p>
        </div>
      </div>

      {/* Items Table in Active Quadrant */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-[#F2EAE0] text-[#8C705B] font-bold uppercase tracking-wider text-[10px]">
              <th className="pb-3">Menu Item</th>
              <th className="pb-3">Price</th>
              <th className="pb-3">Gross Margin</th>
              <th className="pb-3">Volume Sold</th>
              <th className="pb-3">Gross Revenue</th>
              <th className="pb-3 text-right">Strategic Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F2EAE0]">
            {activeGroup.items.map((item, idx) => (
              <tr key={idx} className="hover:bg-[#FAF5EE]/60 transition-colors">
                <td className="py-3 font-bold text-[#2C1A0E]">
                  <div>{item.name}</div>
                  <span className="text-[10px] text-[#A08878] font-medium">{item.category}</span>
                </td>
                <td className="py-3 font-semibold text-[#2C1A0E]">₹{item.price}</td>
                <td className="py-3 font-bold text-emerald-700">
                  <span className="inline-flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                    <Percent size={11} />
                    {item.margin}%
                  </span>
                </td>
                <td className="py-3 font-semibold text-[#2C1A0E]">
                  {item.unitsSold} units
                </td>
                <td className="py-3 font-extrabold text-[#2C1A0E]">
                  ₹{item.revenue.toLocaleString()}
                </td>
                <td className="py-3 text-right">
                  <span className="text-[11px] text-[#8C4A28] font-medium bg-[#FAF5EE] px-2.5 py-1 rounded-xl border border-[#EDE2D5] inline-block">
                    {item.actionTip}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Category Contribution Distribution */}
      <div className="pt-4 border-t border-[#F2EAE0] space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-[#2C1A0E]">Category Revenue Share</span>
          <span className="text-[11px] text-[#8C705B]">100% Total Sales Contribution</span>
        </div>
        <div className="h-2.5 w-full bg-[#FAF5EE] rounded-full overflow-hidden flex gap-0.5">
          {categoriesShare.map((cat, i) => (
            <div
              key={i}
              style={{ width: `${cat.share}%` }}
              className={`${cat.color} h-full transition-all`}
              title={`${cat.name}: ${cat.share}%`}
            />
          ))}
        </div>
        <div className="flex flex-wrap gap-4 text-[11px] text-[#8C705B]">
          {categoriesShare.map((cat, i) => (
            <div key={i} className="flex items-center gap-1.5">
              <span className={`w-2.5 h-2.5 rounded-full ${cat.color}`} />
              <span>{cat.name} ({cat.share}%)</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
