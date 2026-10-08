'use client'

import React from 'react'
import { TrendingUp, TrendingDown } from 'lucide-react'

interface MetricCardProps {
  label: string
  value: string | number
  delta?: string
  deltaType?: 'positive' | 'negative' | 'neutral'
  subtitle?: string
  icon: React.ReactNode
  sparklineData?: number[]
  sparklineColor?: string
}

export default function MetricCard({
  label,
  value,
  delta,
  deltaType = 'positive',
  subtitle,
  icon,
  sparklineData = [12, 14, 13, 16, 15, 18, 20],
  sparklineColor = '#C87D55',
}: MetricCardProps) {
  // Generate smooth SVG sparkline path
  const min = Math.min(...sparklineData)
  const max = Math.max(...sparklineData)
  const range = max - min || 1
  const width = 80
  const height = 32

  const points = sparklineData
    .map((val, idx) => {
      const x = (idx / (sparklineData.length - 1)) * width
      const y = height - ((val - min) / range) * (height - 6) - 3
      return `${x.toFixed(1)},${y.toFixed(1)}`
    })
    .join(' ')

  return (
    <div className="bg-white border border-[#EDE2D5] rounded-2xl p-4 shadow-2xs hover:shadow-xs transition-shadow relative overflow-hidden flex flex-col justify-between">
      {/* Top Header Row */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#FAF5EE] border border-[#EBDCCF] flex items-center justify-center text-[#8C4A28] shadow-2xs flex-shrink-0">
            {icon}
          </div>
          <span className="text-[12px] font-semibold text-[#8C7362] tracking-wide uppercase">
            {label}
          </span>
        </div>

        {/* Mini Sparkline Curve */}
        <div className="w-16 h-8 flex items-center justify-end opacity-85">
          <svg width={width} height={height} className="overflow-visible">
            <polyline
              fill="none"
              stroke={sparklineColor}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={points}
            />
          </svg>
        </div>
      </div>

      {/* Main Metric Value & Trend Row */}
      <div className="mt-1">
        <h3
          className="text-[26px] font-bold text-[#2C1A0E] tracking-tight leading-tight"
          style={{ fontFamily: '"Montserrat", sans-serif' }}
        >
          {value}
        </h3>

        <div className="flex items-center gap-2 mt-1.5">
          {delta && (
            <span
              className={`inline-flex items-center gap-1 text-[11px] font-bold px-1.5 py-0.5 rounded-md ${
                deltaType === 'positive'
                  ? 'bg-emerald-50 text-emerald-700'
                  : deltaType === 'negative'
                  ? 'bg-red-50 text-red-700'
                  : 'bg-amber-50 text-amber-700'
              }`}
            >
              {deltaType === 'positive' ? (
                <TrendingUp size={11} />
              ) : deltaType === 'negative' ? (
                <TrendingDown size={11} />
              ) : null}
              {delta}
            </span>
          )}

          {subtitle && (
            <span className="text-[11px] text-[#A08878] font-medium truncate">
              {subtitle}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
