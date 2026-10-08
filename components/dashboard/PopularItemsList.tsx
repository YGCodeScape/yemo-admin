'use client'

import React, { useState } from 'react'
import Image from 'next/image'

interface PopularItem {
  rank: number
  name: string
  sold: number
  maxSold: number
  image: string
}

const POPULAR_TODAY: PopularItem[] = [
  { rank: 1, name: 'Iced Latte', sold: 48, maxSold: 48, image: '/products/vanilla-latte.jpg' },
  { rank: 2, name: 'Cappuccino', sold: 41, maxSold: 48, image: '/products/cappuccino.jpg' },
  { rank: 3, name: 'Cold Coffee', sold: 29, maxSold: 48, image: '/products/cold-brew.jpg' },
  { rank: 4, name: 'Croissant', sold: 24, maxSold: 48, image: '/products/croissant.jpg' },
  { rank: 5, name: 'Matcha Latte', sold: 18, maxSold: 48, image: '/products/americano.jpg' },
]

const POPULAR_WEEK: PopularItem[] = [
  { rank: 1, name: 'Cappuccino', sold: 294, maxSold: 294, image: '/products/cappuccino.jpg' },
  { rank: 2, name: 'Iced Latte', sold: 268, maxSold: 294, image: '/products/vanilla-latte.jpg' },
  { rank: 3, name: 'Croissant', sold: 192, maxSold: 294, image: '/products/croissant.jpg' },
  { rank: 4, name: 'Cold Coffee', sold: 164, maxSold: 294, image: '/products/cold-brew.jpg' },
  { rank: 5, name: 'Cheesecake', sold: 118, maxSold: 294, image: '/products/cheesecake.jpg' },
]

export default function PopularItemsList() {
  const [filter, setFilter] = useState<'Today' | 'This Week'>('Today')

  const items = filter === 'Today' ? POPULAR_TODAY : POPULAR_WEEK

  return (
    <div className="bg-white border border-[#EDE2D5] rounded-2xl p-5 shadow-2xs">
      {/* Header with Time Filter */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[15px] font-bold text-[#2C1A0E]">
          Popular Items
        </h3>

        <div className="flex items-center bg-[#FAF5EE] border border-[#EBDCCF] p-0.5 rounded-xl text-[10px]">
          {(['Today', 'This Week'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-2 py-0.5 font-bold rounded-lg transition-all ${
                filter === tab
                  ? 'bg-white text-[#2C1A0E] shadow-2xs'
                  : 'text-[#8C7362] hover:text-[#2C1A0E]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Ranked Items */}
      <div className="space-y-3.5">
        {items.map((item) => {
          const percent = Math.round((item.sold / item.maxSold) * 100)

          return (
            <div key={item.name} className="flex items-center gap-3">
              {/* Rank Number */}
              <span className="w-4 text-[12px] font-bold text-[#A08878] text-center">
                {item.rank}
              </span>

              {/* Product Thumbnail */}
              <div className="w-9 h-9 rounded-xl overflow-hidden bg-[#FAF5EE] border border-[#EBDCCF] relative flex-shrink-0">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Name & Progress Bar */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[12px] font-bold text-[#2C1A0E] truncate">
                    {item.name}
                  </span>
                  <span className="text-[11px] font-semibold text-[#8C4A28] ml-2 flex-shrink-0">
                    {item.sold} sold
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full h-1.5 bg-[#FAF5EE] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#C87D55] rounded-full transition-all duration-500"
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
