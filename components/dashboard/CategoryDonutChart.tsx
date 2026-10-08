'use client'

import React from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'

const CATEGORY_DATA = [
  { name: 'Beverages', value: 45, color: '#2C1A0E' },
  { name: 'Food', value: 32, color: '#8C4A28' },
  { name: 'Bakery', value: 15, color: '#C87D55' },
  { name: 'Others', value: 8, color: '#D4B8A8' },
]

export default function CategoryDonutChart() {
  return (
    <div className="bg-white border border-[#EDE2D5] rounded-2xl p-5 shadow-2xs flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-[15px] font-bold text-[#2C1A0E]">
          Sales by Category
        </h3>
        <span className="text-[11px] font-semibold text-[#8C7362] bg-[#FAF5EE] px-2 py-0.5 rounded-md border border-[#EBDCCF]">
          Today
        </span>
      </div>

      {/* Donut Chart with Centered Total */}
      <div className="relative w-full h-44 my-1 flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-[#2C1A0E] text-white px-2.5 py-1 rounded-xl text-[11px] shadow-lg">
                      <span className="font-bold">{payload[0].name}: </span>
                      <span>{payload[0].value}%</span>
                    </div>
                  )
                }
                return null
              }}
            />
            <Pie
              data={CATEGORY_DATA}
              innerRadius={50}
              outerRadius={70}
              paddingAngle={3}
              dataKey="value"
            >
              {CATEGORY_DATA.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        {/* Center Text Callout */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-[16px] font-bold text-[#2C1A0E] leading-none">
            ₹18,420
          </span>
          <span className="text-[10px] text-[#A08878] font-medium mt-0.5">
            Total Sales
          </span>
        </div>
      </div>

      {/* Legend Rows */}
      <div className="grid grid-cols-2 gap-2 pt-3 border-t border-[#F2EAE1] text-[11px]">
        {CATEGORY_DATA.map((item) => (
          <div key={item.name} className="flex items-center justify-between pr-2">
            <div className="flex items-center gap-1.5">
              <span
                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-[#6B5344] font-medium truncate">
                {item.name}
              </span>
            </div>
            <span className="font-bold text-[#2C1A0E]">{item.value}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}
