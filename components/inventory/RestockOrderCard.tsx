'use client'

import React from 'react'
import {
  FileText,
  Building,
  Calendar,
  CheckCircle2,
  Clock,
  AlertCircle,
  XCircle,
  Truck,
  PackageCheck,
  ArrowRight,
  ShieldCheck,
  Boxes,
} from 'lucide-react'
import { RestockOrder, RestockStatus } from '@/store/useAdminStore'

interface RestockOrderCardProps {
  order: RestockOrder
  isAdmin: boolean
  onView: (order: RestockOrder) => void
  onMarkReceived: (id: string) => void
}

export default function RestockOrderCard({
  order,
  isAdmin,
  onView,
  onMarkReceived,
}: RestockOrderCardProps) {
  // Status Badge
  const renderStatusBadge = (st: RestockStatus) => {
    switch (st) {
      case 'received':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-2xs">
            <CheckCircle2 size={12} className="text-emerald-600" />
            <span>Received</span>
          </span>
        )
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200 shadow-2xs animate-pulse">
            <Clock size={12} className="text-amber-600" />
            <span>Pending Delivery</span>
          </span>
        )
      case 'partially_received':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-orange-50 text-orange-800 border border-orange-200 shadow-2xs">
            <AlertCircle size={12} className="text-orange-600" />
            <span>Partial</span>
          </span>
        )
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-stone-100 text-stone-600 border border-stone-200">
            <XCircle size={12} />
            <span>Cancelled</span>
          </span>
        )
    }
  }

  return (
    <div
      onClick={() => onView(order)}
      className="group bg-white border border-[#EDE2D5] rounded-3xl p-5 hover:border-[#D4B8A8] hover:shadow-md transition-all duration-200 flex flex-col justify-between cursor-pointer shadow-2xs"
    >
      <div>
        {/* Top Header: PO Number & Status Badge */}
        <div className="flex items-start justify-between gap-2 mb-3.5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#FAF5EE] text-[#8C4A28] border border-[#EADBCC] flex items-center justify-center flex-shrink-0">
              <FileText size={15} />
            </div>
            <div>
              <span className="font-mono font-bold text-[14px] text-[#2C1A0E] group-hover:text-[#C87D55] transition-colors leading-tight block">
                {order.poNumber}
              </span>
              <span className="text-[11px] text-[#A08878] flex items-center gap-1">
                <Calendar size={11} /> {order.orderDate}
              </span>
            </div>
          </div>
          <div>{renderStatusBadge(order.status)}</div>
        </div>

        {/* Vendor Partner */}
        <div className="mb-3">
          <div className="flex items-center gap-1.5">
            <Building size={14} className="text-[#A08878] flex-shrink-0" />
            <h3 className="font-bold text-[15px] text-[#2C1A0E] truncate">
              {order.supplier}
            </h3>
          </div>
          {order.supplierInvoiceNo && (
            <span className="text-[11px] font-mono text-[#A08878] block pl-5 mt-0.5">
              Invoice #{order.supplierInvoiceNo}
            </span>
          )}
        </div>

        {/* Supplies Line Items Preview */}
        <div className="p-3 bg-[#FAF7F4] border border-[#F2EAE0] rounded-2xl mb-4 space-y-1.5">
          <span className="text-[10px] font-bold text-[#A08878] uppercase tracking-wider block">
            Supplies in Shipment ({order.items.length})
          </span>
          <div className="space-y-1">
            {order.items.slice(0, 2).map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between text-[12px] text-[#7A614E]"
              >
                <span className="truncate pr-2 font-medium">• {item.itemName}</span>
                <span className="font-bold text-[#2C1A0E] flex-shrink-0">
                  {item.quantity} {item.unit}
                </span>
              </div>
            ))}
            {order.items.length > 2 && (
              <span className="text-[11px] font-semibold text-[#8C4A28] block pt-0.5">
                +{order.items.length - 2} additional items
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Financials & Actions */}
      <div>
        {/* Logistics & Cost row */}
        <div className="pt-3 border-t border-[#F2EAE0] flex items-center justify-between mb-4">
          <div>
            <span className="text-[10px] font-bold text-[#A08878] uppercase tracking-wider block">
              Total Order Value
            </span>
            <div className="text-[18px] font-bold text-[#8C4A28] leading-tight">
              ₹{order.totalAmount.toLocaleString('en-IN')}
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] text-[#A08878] uppercase font-bold block">
              Delivery
            </span>
            <span className="text-[11px] font-medium text-[#2C1A0E] flex items-center gap-1 justify-end">
              <Truck size={12} className="text-[#C87D55]" />
              <span className="truncate max-w-[120px]">
                {order.deliveryDate || 'Scheduled'}
              </span>
            </span>
          </div>
        </div>

        {/* Action Buttons Row */}
        <div
          className="flex items-center gap-2 pt-1"
          onClick={(e) => e.stopPropagation()}
        >
          {isAdmin && order.status === 'pending' ? (
            <>
              <button
                type="button"
                onClick={() => onMarkReceived(order.id)}
                className="flex-1 py-2 px-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-[12px] font-bold flex items-center justify-center gap-1.5 transition-all active:scale-95 shadow-2xs"
                title="Verify shipment arrival and increment inventory"
              >
                <PackageCheck size={14} />
                <span>Mark Received</span>
              </button>

              <button
                type="button"
                onClick={() => onView(order)}
                className="p-2 rounded-xl bg-[#FAF5EE] hover:bg-[#F2E7D8] text-[#8C4A28] border border-[#EADBCC] transition-all"
                title="View Invoice"
              >
                <ArrowRight size={14} />
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => onView(order)}
              className="w-full py-2 px-3 rounded-xl bg-[#FAF5EE] hover:bg-[#F2E7D8] text-[#8C4A28] border border-[#EADBCC] text-[12px] font-bold flex items-center justify-center gap-1.5 transition-all"
            >
              <span>View Full Invoice</span>
              <ArrowRight size={13} />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
