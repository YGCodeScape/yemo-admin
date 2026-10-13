'use client'

import React from 'react'
import {
  IndianRupee,
  Percent,
  Receipt,
  Clock,
  ArrowUpRight,
} from 'lucide-react'
import { TimeRange } from './AnalyticsHeader'

interface MetricData {
  grossRevenue: string
  revenueGrowth: string
  revenueTarget: string
  profitMargin: string
  cogsRatio: string
  marginGrowth: string
  aov: string
  aovGrowth: string
  itemsPerOrder: string
  tableDwellTime: string
  tableTurns: string
  occupancyRate: string
}

const METRIC_VALUES: Record<TimeRange, MetricData> = {
  today: {
    grossRevenue: '₹18,420',
    revenueGrowth: '+12.4%',
    revenueTarget: '92% of daily ₹20K goal',
    profitMargin: '67.8%',
    cogsRatio: '32.2% COGS',
    marginGrowth: '+1.8%',
    aov: '₹378',
    aovGrowth: '+₹24',
    itemsPerOrder: '2.2 items / bill',
    tableDwellTime: '36 mins',
    tableTurns: '2.6 turns / table',
    occupancyRate: '82% peak load',
  },
  '7d': {
    grossRevenue: '₹1,37,620',
    revenueGrowth: '+14.2%',
    revenueTarget: '106% of weekly target',
    profitMargin: '68.4%',
    cogsRatio: '31.6% COGS',
    marginGrowth: '+2.1%',
    aov: '₹384',
    aovGrowth: '+₹32',
    itemsPerOrder: '2.4 items / bill',
    tableDwellTime: '38 mins',
    tableTurns: '2.4 turns / table',
    occupancyRate: '78% floor avg',
  },
  '30d': {
    grossRevenue: '₹5,48,900',
    revenueGrowth: '+16.8%',
    revenueTarget: '112% of monthly target',
    profitMargin: '69.1%',
    cogsRatio: '30.9% COGS',
    marginGrowth: '+2.7%',
    aov: '₹392',
    aovGrowth: '+₹38',
    itemsPerOrder: '2.5 items / bill',
    tableDwellTime: '40 mins',
    tableTurns: '2.3 turns / table',
    occupancyRate: '76% floor avg',
  },
  month: {
    grossRevenue: '₹4,69,400',
    revenueGrowth: '+15.1%',
    revenueTarget: '96% of MTD target',
    profitMargin: '68.8%',
    cogsRatio: '31.2% COGS',
    marginGrowth: '+2.3%',
    aov: '₹388',
    aovGrowth: '+₹35',
    itemsPerOrder: '2.4 items / bill',
    tableDwellTime: '39 mins',
    tableTurns: '2.4 turns / table',
    occupancyRate: '77% floor avg',
  },
  '90d': {
    grossRevenue: '₹15,82,400',
    revenueGrowth: '+18.4%',
    revenueTarget: 'Quarterly milestone beat',
    profitMargin: '69.5%',
    cogsRatio: '30.5% COGS',
    marginGrowth: '+3.4%',
    aov: '₹395',
    aovGrowth: '+₹42',
    itemsPerOrder: '2.5 items / bill',
    tableDwellTime: '41 mins',
    tableTurns: '2.2 turns / table',
    occupancyRate: '75% floor avg',
  },
}

export default function AnalyticsMetricCards({ timeRange }: { timeRange: TimeRange }) {
  const data = METRIC_VALUES[timeRange]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {/* ── 1. Gross Revenue ── */}
      <div className="bg-white p-5 rounded-3xl border border-[#EDE2D5] shadow-2xs hover:border-[#C87D55]/50 transition-all group">
        <div className="flex items-center justify-between text-[#8C705B] mb-2">
          <span className="text-[11px] font-bold uppercase tracking-wider">Gross Revenue</span>
          <div className="w-8 h-8 rounded-xl bg-[#FAF5EE] text-[#8C4A28] border border-[#EADBCC] flex items-center justify-center">
            <IndianRupee size={15} />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span
            className="text-2xl sm:text-3xl font-extrabold text-[#2C1A0E]"
            style={{ fontFamily: '"Playfair Display", Georgia, serif' }}
          >
            {data.grossRevenue}
          </span>
          <span className="inline-flex items-center text-[11px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-md border border-emerald-200">
            <ArrowUpRight size={11} />
            {data.revenueGrowth}
          </span>
        </div>
        <div className="text-[11px] text-[#A08878] mt-2 font-medium flex items-center justify-between">
          <span>{data.revenueTarget}</span>
          <span className="text-emerald-700 font-bold">On Track</span>
        </div>
      </div>

      {/* ── 2. Net Profit Margin ── */}
      <div className="bg-white p-5 rounded-3xl border border-[#EDE2D5] shadow-2xs hover:border-[#C87D55]/50 transition-all group">
        <div className="flex items-center justify-between text-[#8C705B] mb-2">
          <span className="text-[11px] font-bold uppercase tracking-wider">Net Profit Margin</span>
          <div className="w-8 h-8 rounded-xl bg-[#FAF5EE] text-[#8C4A28] border border-[#EADBCC] flex items-center justify-center">
            <Percent size={15} />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span
            className="text-2xl sm:text-3xl font-extrabold text-[#2C1A0E]"
            style={{ fontFamily: '"Playfair Display", Georgia, serif' }}
          >
            {data.profitMargin}
          </span>
          <span className="inline-flex items-center text-[11px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-md border border-emerald-200">
            <ArrowUpRight size={11} />
            {data.marginGrowth}
          </span>
        </div>
        <div className="text-[11px] text-[#A08878] mt-2 font-medium flex items-center justify-between">
          <span>{data.cogsRatio}</span>
          <span className="text-[#8C4A28] font-bold">High Efficiency</span>
        </div>
      </div>

      {/* ── 3. Average Order Value (AOV) ── */}
      <div className="bg-white p-5 rounded-3xl border border-[#EDE2D5] shadow-2xs hover:border-[#C87D55]/50 transition-all group">
        <div className="flex items-center justify-between text-[#8C705B] mb-2">
          <span className="text-[11px] font-bold uppercase tracking-wider">Average Order Value</span>
          <div className="w-8 h-8 rounded-xl bg-[#FAF5EE] text-[#8C4A28] border border-[#EADBCC] flex items-center justify-center">
            <Receipt size={15} />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span
            className="text-2xl sm:text-3xl font-extrabold text-[#2C1A0E]"
            style={{ fontFamily: '"Playfair Display", Georgia, serif' }}
          >
            {data.aov}
          </span>
          <span className="inline-flex items-center text-[11px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-md border border-emerald-200">
            <ArrowUpRight size={11} />
            {data.aovGrowth}
          </span>
        </div>
        <div className="text-[11px] text-[#A08878] mt-2 font-medium flex items-center justify-between">
          <span>{data.itemsPerOrder}</span>
          <span className="text-[#8C705B] font-bold">Combos driving up</span>
        </div>
      </div>

      {/* ── 4. Table Velocity & Dwell Time ── */}
      <div className="bg-white p-5 rounded-3xl border border-[#EDE2D5] shadow-2xs hover:border-[#C87D55]/50 transition-all group">
        <div className="flex items-center justify-between text-[#8C705B] mb-2">
          <span className="text-[11px] font-bold uppercase tracking-wider">Table Dwell & Velocity</span>
          <div className="w-8 h-8 rounded-xl bg-[#FAF5EE] text-[#8C4A28] border border-[#EADBCC] flex items-center justify-center">
            <Clock size={15} />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span
            className="text-2xl sm:text-3xl font-extrabold text-[#2C1A0E]"
            style={{ fontFamily: '"Playfair Display", Georgia, serif' }}
          >
            {data.tableDwellTime}
          </span>
          <span className="text-[12px] font-bold text-[#8C4A28]">
            {data.tableTurns}
          </span>
        </div>
        <div className="text-[11px] text-[#A08878] mt-2 font-medium flex items-center justify-between">
          <span>{data.occupancyRate}</span>
          <span className="text-emerald-700 font-bold">Optimal Pace</span>
        </div>
      </div>
    </div>
  )
}
