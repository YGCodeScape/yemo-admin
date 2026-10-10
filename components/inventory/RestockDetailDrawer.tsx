'use client'

import React from 'react'
import {
  X,
  FileText,
  Building,
  Calendar,
  CheckCircle2,
  Clock,
  Truck,
  PackageCheck,
  Printer,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react'
import { RestockOrder } from '@/store/useAdminStore'

interface RestockDetailDrawerProps {
  order: RestockOrder | null
  isOpen: boolean
  isAdmin: boolean
  onClose: () => void
  onMarkReceived: (id: string) => void
}

export default function RestockDetailDrawer({
  order,
  isOpen,
  isAdmin,
  onClose,
  onMarkReceived,
}: RestockDetailDrawerProps) {
  if (!isOpen || !order) return null

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-2xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-lg bg-white border-l border-[#EDE2D5] shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
          {/* Header */}
          <div className="p-4.5 border-b border-[#EDE2D5] flex items-center justify-between bg-[#FDFBF7]">
            <div className="flex items-center gap-2">
              <FileText size={16} className="text-[#8C4A28]" />
              <span className="text-[12px] font-bold text-[#A08878] uppercase tracking-wider">
                Purchase Order & Invoice
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrint}
                className="p-1.5 text-[#8C705B] hover:text-[#2C1A0E] hover:bg-black/5 rounded-lg transition-colors"
                title="Print Invoice"
              >
                <Printer size={16} />
              </button>
              <button
                onClick={onClose}
                className="p-1.5 text-[#A08878] hover:text-[#2C1A0E] rounded-full hover:bg-black/5 transition-colors"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Drawer Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Invoice Top Hero */}
            <div className="p-5 bg-[#FAF5EE] border border-[#EDE2D5] rounded-3xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[14px] font-bold text-[#8C4A28]">
                  {order.poNumber}
                </span>
                {order.status === 'received' && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
                    <CheckCircle2 size={13} className="text-emerald-600" />
                    <span>Received & Verified</span>
                  </span>
                )}
                {order.status === 'pending' && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800">
                    <Clock size={13} className="text-amber-600" />
                    <span>Pending Delivery</span>
                  </span>
                )}
                {order.status === 'partially_received' && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-orange-100 text-orange-800">
                    <AlertCircle size={13} />
                    <span>Partially Received</span>
                  </span>
                )}
              </div>

              <div className="pt-1">
                <span className="text-[11px] text-[#A08878] uppercase font-bold block">
                  Vendor Partner
                </span>
                <h3
                  className="text-[20px] font-bold text-[#2C1A0E]"
                  style={{ fontFamily: '"Playfair Display", Georgia, serif' }}
                >
                  {order.supplier}
                </h3>
                {order.supplierInvoiceNo && (
                  <p className="text-[12px] font-mono text-[#8C705B]">
                    Supplier Ref: #{order.supplierInvoiceNo}
                  </p>
                )}
              </div>

              {/* Order Metadata Grid */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#E5D2BD] text-[12px]">
                <div>
                  <span className="text-[#A08878] block text-[10px] uppercase font-bold">
                    Order Date
                  </span>
                  <span className="font-medium text-[#2C1A0E]">
                    {order.orderDate}
                  </span>
                </div>
                <div>
                  <span className="text-[#A08878] block text-[10px] uppercase font-bold">
                    Delivery Arrival
                  </span>
                  <span className="font-medium text-[#2C1A0E]">
                    {order.deliveryDate || 'Scheduled'}
                  </span>
                </div>
              </div>
            </div>

            {/* Itemized Supplies Breakdown Table */}
            <div>
              <h4 className="text-[12px] font-bold text-[#2C1A0E] uppercase tracking-wider mb-2.5">
                Itemized Supplies Breakdown
              </h4>
              <div className="border border-[#EDE2D5] rounded-2xl overflow-hidden shadow-2xs">
                <table className="w-full text-left border-collapse text-[12px]">
                  <thead>
                    <tr className="bg-[#FAF7F4] border-b border-[#EDE2D5] text-[#A08878] font-bold uppercase text-[10px]">
                      <th className="py-2.5 px-3.5">Supply Item</th>
                      <th className="py-2.5 px-3 text-center">Qty</th>
                      <th className="py-2.5 px-3 text-right">Rate</th>
                      <th className="py-2.5 px-3.5 text-right">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items.map((item, idx) => (
                      <tr
                        key={idx}
                        className="border-b border-[#F2EAE0] last:border-0 hover:bg-[#FAF7F4]"
                      >
                        <td className="py-2.5 px-3.5 font-medium text-[#2C1A0E]">
                          {item.itemName}
                        </td>
                        <td className="py-2.5 px-3 text-center font-bold text-[#7A614E]">
                          {item.quantity} {item.unit}
                        </td>
                        <td className="py-2.5 px-3 text-right text-[#A08878]">
                          ₹{item.unitCost}
                        </td>
                        <td className="py-2.5 px-3.5 text-right font-bold text-[#8C4A28]">
                          ₹{item.totalCost.toLocaleString('en-IN')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Total Financial Summary */}
            <div className="p-4 bg-white border border-[#EDE2D5] rounded-2xl space-y-2 text-[13px]">
              <div className="flex items-center justify-between text-[#7A614E]">
                <span>Supplies Subtotal:</span>
                <span>₹{order.totalAmount.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex items-center justify-between text-[#7A614E]">
                <span>Delivery & Logistics:</span>
                <span className="text-emerald-700 font-semibold">Included</span>
              </div>
              <div className="pt-2 border-t border-[#EDE2D5] flex items-center justify-between text-[16px] font-bold text-[#2C1A0E]">
                <span>Total Billed Amount:</span>
                <span className="text-[#8C4A28] text-[20px]">
                  ₹{order.totalAmount.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Quality Checks & Notes */}
            {order.notes && (
              <div className="p-4 bg-[#FAF7F4] border border-[#EDE2D5] rounded-2xl space-y-1">
                <span className="text-[11px] font-bold text-[#2C1A0E] uppercase tracking-wider block">
                  Quality Audit & Receiving Remarks
                </span>
                <p className="text-[12px] text-[#7A614E] leading-relaxed">
                  {order.notes}
                </p>
              </div>
            )}

            {/* Sign-off by staff */}
            <div className="flex items-center justify-between text-[12px] text-[#8C705B] px-1">
              <span className="flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-emerald-600" />
                <span>Audited By: <strong>{order.receivedBy || 'Duty Staff'}</strong></span>
              </span>
              <span>Yemo Café Main Branch</span>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="p-4 border-t border-[#EDE2D5] bg-[#FDFBF7] flex items-center justify-between gap-3">
            {isAdmin && order.status === 'pending' ? (
              <button
                type="button"
                onClick={() => {
                  onMarkReceived(order.id)
                  onClose()
                }}
                className="w-full py-2.5 rounded-full bg-emerald-700 hover:bg-emerald-800 text-white text-[13px] font-bold flex items-center justify-center gap-2 shadow-sm transition-all active:scale-95"
              >
                <PackageCheck size={16} />
                <span>Verify Shipment & Update Stock</span>
              </button>
            ) : (
              <div className="w-full flex items-center justify-between">
                <span className="text-[11px] text-[#A08878]">
                  Archived Purchase Order Record
                </span>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2 rounded-full bg-[#2C1A0E] text-white text-[12px] font-bold"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
