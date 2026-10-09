'use client'

import React from 'react'
import { Table, Order } from '@/store/useAdminStore'
import FloorTable from '@/components/tables/FloorTable'

interface FloorPlanProps {
  tables: Table[]
  orders: Order[]
  selectedTableId: string
  onSelectTable: (table: Table) => void
  onOpenQr: (table: Table) => void
}

export default function FloorPlan({
  tables,
  orders,
  selectedTableId,
  onSelectTable,
  onOpenQr,
}: FloorPlanProps) {
  // Sort tables sequentially (1 to 12)
  const sortedTables = [...tables].sort(
    (a, b) => parseInt(a.number) - parseInt(b.number)
  )

  return (
    <div className="w-full overflow-x-scroll rounded-3xl border border-[#E5D2BD] shadow-sm bg-[#F7F2EB]">
      {/* 
        Floor Plan Canvas: 
        Uses the realistic 3D architectural cafe background (16:9 aspect ratio)
        All walls, plants, sofas, counter, and kitchen are part of the background.
        Only real interactive tables are rendered over the open central floor space.
      */}
      <div className="relative min-w-[760px] w-full aspect-[16/11] overflow-hidden rounded-3xl select-none">
        {/* Architectural 3D Cafe Background */}
        <img
          src="/assets/cafe-floar-bg.png"
          alt="Café Floor Layout"
          className="absolute inset-0 w-full h-full object-fill pointer-events-none select-none"
        />

        {/* 
          Central Dining Floor Area:
          Carefully padded to precisely fit within the open beige tiled area:
          - Clears top banquettes and lamps (~13%)
          - Clears bottom barista espresso counter (~22%)
          - Clears left lounge sofa sets & rugs (~19%)
          - Clears right wall bench seating (~12%)
        */}
        <div className="absolute inset-0 pt-[12%] pb-[16%] pl-[16%] pr-[12%] flex items-center justify-center pointer-events-auto">
          <div className="grid grid-cols-4 grid-rows-3 gap-x-3 lg:gap-x-5 gap-y-2 lg:gap-y-4 w-full h-full max-w-4xl mx-auto items-center justify-items-center">
            {sortedTables.slice(0, 12).map((table) => {
              const linkedOrder = orders.find(
                (o) => o.tableNumber === table.number && o.status !== 'completed'
              )
              const isSelected = table.id === selectedTableId

              return (
                <div key={table.id} className="w-full flex items-center justify-center">
                  <FloorTable
                    number={table.number}
                    seats={table.capacity}
                    status={table.status}
                    orderId={linkedOrder?.id}
                    isSelected={isSelected}
                    onSelect={() => onSelectTable(table)}
                    onOpenQr={() => onOpenQr(table)}
                  />
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
