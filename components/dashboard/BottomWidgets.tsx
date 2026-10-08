'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  AlertTriangle,
  ArrowRight,
  Coffee,
  CheckCircle,
  Clock,
  Sparkles,
  ShoppingBag,
} from 'lucide-react'
import { useAdminStore } from '@/store/useAdminStore'
import { timeAgo } from '@/lib/utils'

// ── 1. Popular Categories Cards ──
export function PopularCategoriesCards() {
  const categories = [
    {
      name: 'Beverages',
      share: '45% of total sales',
      image: '/products/cappuccino.jpg',
    },
    {
      name: 'Food',
      share: '32% of total sales',
      image: '/products/sandwich.jpg',
    },
    {
      name: 'Bakery',
      share: '15% of total sales',
      image: '/products/croissant.jpg',
    },
  ]

  return (
    <div className="bg-white border border-[#EDE2D5] rounded-2xl p-5 shadow-2xs">
      <div className="flex items-center justify-between mb-3.5">
        <h3 className="text-[15px] font-bold text-[#2C1A0E]">
          Popular Categories
        </h3>
        <Link
          href="/categories"
          className="text-[12px] font-semibold text-[#8C4A28] hover:text-[#2C1A0E] flex items-center gap-1 group transition-colors"
        >
          <span>View all</span>
          <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {categories.map((cat) => (
          <div
            key={cat.name}
            className="group relative rounded-xl overflow-hidden border border-[#EBDCCF] bg-[#FAF5EE] p-3 flex flex-col justify-between hover:border-[#C87D55] transition-all"
          >
            <div className="w-12 h-12 rounded-lg overflow-hidden relative mb-2 shadow-2xs">
              <Image
                src={cat.image}
                alt={cat.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform"
              />
            </div>
            <div>
              <p className="text-[13px] font-bold text-[#2C1A0E]">{cat.name}</p>
              <p className="text-[10px] text-[#8C7362] font-medium mt-0.5 truncate">
                {cat.share}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── 2. Yemo Beans & Rewards Card ──
export function BeansRewardsCard() {
  return (
    <div className="bg-white border border-[#EDE2D5] rounded-2xl p-5 shadow-2xs flex flex-col justify-between relative overflow-hidden">
      <div>
        <div className="flex items-center gap-2 mb-3">
          <div className="w-7 h-7 rounded-lg bg-[#FAF5EE] border border-[#EBDCCF] flex items-center justify-center text-[#8C4A28]">
            <Coffee size={15} />
          </div>
          <h3 className="text-[14px] font-bold text-[#2C1A0E]">
            Yemo Beans &amp; Rewards
          </h3>
        </div>

        <div className="flex items-baseline gap-6 my-2">
          <div>
            <span className="text-[26px] font-bold text-[#2C1A0E] tracking-tight">
              2,840
            </span>
            <p className="text-[11px] text-[#A08878] font-medium">
              Beans issued today
            </p>
          </div>
          <div>
            <span className="text-[26px] font-bold text-[#C87D55] tracking-tight">
              18
            </span>
            <p className="text-[11px] text-[#A08878] font-medium">
              Voucher redemptions
            </p>
          </div>
        </div>
      </div>

      <div className="pt-3 border-t border-[#F2EAE1] flex items-center justify-between">
        <span className="text-[11px] text-[#8C7362] font-medium">
          Counter pass scans active
        </span>
        <Link
          href="/rewards"
          className="text-[11px] font-bold text-[#8C4A28] hover:underline flex items-center gap-1"
        >
          <span>View details →</span>
        </Link>
      </div>
    </div>
  )
}

// ── 3. Recent Activity Live Feed ──
export function RecentActivityFeed() {
  const recentActivity = useAdminStore((s) => s.recentActivity)

  return (
    <div className="bg-white border border-[#EDE2D5] rounded-2xl p-5 shadow-2xs">
      <div className="flex items-center justify-between mb-3.5">
        <h3 className="text-[15px] font-bold text-[#2C1A0E]">
          Recent Activity
        </h3>
        <span className="text-[11px] font-semibold text-[#8C4A28] bg-[#FAF5EE] px-2 py-0.5 rounded-md border border-[#EBDCCF]">
          Live Feed
        </span>
      </div>

      <div className="space-y-3">
        {recentActivity.slice(0, 5).map((act) => (
          <div key={act.id} className="flex items-start gap-2.5 text-[12px]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C87D55] mt-1.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-[#3A2417] font-medium leading-snug truncate">
                {act.message}
              </p>
              <span className="text-[10px] text-[#A08878]">
                {timeAgo(act.timestamp)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── 4. Needs Attention (Stock Warnings) ──
export function NeedsAttentionCard() {
  const showToast = useAdminStore((s) => s.showToast)

  return (
    <div className="bg-white border border-[#EDE2D5] rounded-2xl p-5 shadow-2xs flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <AlertTriangle size={16} className="text-amber-600" />
            <h3 className="text-[15px] font-bold text-[#2C1A0E]">
              Needs Attention
            </h3>
          </div>
          <Link
            href="/inventory/stock"
            className="text-[11px] font-bold text-[#8C4A28] hover:underline"
          >
            View all
          </Link>
        </div>

        <div className="space-y-2.5">
          {/* Low Stock Item 1 */}
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-amber-50/70 border border-amber-200/80">
            <div>
              <p className="text-[12px] font-bold text-amber-950">
                Almond Milk
              </p>
              <p className="text-[10px] font-semibold text-amber-700">
                Only 3 portions left
              </p>
            </div>
            <button
              onClick={() => showToast('Restock purchase order logged for Almond Milk')}
              className="px-2.5 py-1 bg-white border border-amber-300 rounded-lg text-[10px] font-bold text-amber-900 hover:bg-amber-100 transition-all shadow-2xs active:scale-95"
            >
              Update stock
            </button>
          </div>

          {/* Out of Stock Item 2 */}
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-red-50/70 border border-red-200/80">
            <div>
              <p className="text-[12px] font-bold text-red-950">
                Chocolate Croissant
              </p>
              <p className="text-[10px] font-semibold text-red-700">
                Out of stock
              </p>
            </div>
            <button
              onClick={() => showToast('Chocolate Croissant temporarily hidden from menu')}
              className="px-2.5 py-1 bg-white border border-red-300 rounded-lg text-[10px] font-bold text-red-900 hover:bg-red-100 transition-all shadow-2xs active:scale-95"
            >
              Hide item
            </button>
          </div>
        </div>
      </div>

      <div className="pt-3 border-t border-[#F2EAE1] flex items-center gap-2 text-[11px] text-emerald-700 font-medium mt-3">
        <CheckCircle size={13} className="text-emerald-600" />
        <span>All other items look good</span>
      </div>
    </div>
  )
}
