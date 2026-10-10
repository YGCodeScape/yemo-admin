'use client'

import Image from 'next/image'
import { Search, Bell, ChevronDown, Calendar } from 'lucide-react'

export default function TopBar() {
  const currentDate = new Date().toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })

  return (
    <header className="h-16 bg-[#FAF7F4] border-b border-[#EDE2D5] px-8 flex items-center sticky top-0 z-30">
      {/* ── Indicators & Store Pill ── */}
      <div className="w-full flex items-center justify-between gap-4">

        <div className="flex items-center gap-4">
           {/* Date Display */}
          <span suppressHydrationWarning
            className="hidden md:inline-flex items-center gap-1.5 text-[12px] font-medium text-[#A08878] bg-white border border-[#EDE2D5] px-3 py-1.5 rounded-full shadow-2xs"
          >
            <Calendar size={13} className="text-[#A08878]" />
            <span>{currentDate}</span>
          </span>

            {/* Café Status Live Pill */}
            <div className="flex items-center gap-2 bg-white border border-[#EDE2D5] px-3.5 py-1.5 rounded-full text-[12px] font-semibold text-[#2C1A0E] shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Café is open</span>
              <span className="text-[#A08878] text-[11px] font-normal ">
                9:00 AM - 11:00 PM
              </span>
            </div>
        </div>

        <div className="flex items-center gap-4">
              {/* Notifications Bell */}
            <button
              className="relative p-2 bg-white border border-[#EDE2D5] rounded-xl text-[#2C1A0E] hover:bg-[#FAF5EE] transition-all shadow-2xs active:scale-95"
              aria-label="Notifications"
            >
              <Bell size={17} className="text-[#6B5344]" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#C87D55] text-white text-[9px] font-bold rounded-full flex items-center justify-center ring-2 ring-[#FAF7F4]">
                1
              </span>

            </button>

            {/* Café Branch Pill */}
            <div className="flex items-center gap-2.5 bg-white border border-[#EDE2D5] rounded-xl px-3 py-1.5 shadow-2xs cursor-pointer hover:border-[#D4B8A8] transition-all">
              <div className="w-7 h-7 rounded-lg bg-[#FAF5EE] border border-[#EBDCCF] flex items-center justify-center text-[#8C4A28] font-bold text-[11px] overflow-hidden">
                <Image 
                  src="/assets/cafe_storefront.jpg"
                  alt="Yemo Logo"
                  width={28}
                  height={28}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-left leading-tight hidden lg:block">
                <p className="text-[12px] font-bold text-[#2C1A0E]">Yemo Café</p>
                <p className="text-[10px] text-[#A08878]">Main Branch</p>
              </div>
              <ChevronDown size={14} className="text-[#A08878] ml-0.5" />
            </div>
        </div>

      </div>
    </header>
  )
}
// inside topbBar cafe status live pill instead of showing static opening and cloasing hours show the current live time, and the live glow dot should be with the current time. with clock icon with it. 