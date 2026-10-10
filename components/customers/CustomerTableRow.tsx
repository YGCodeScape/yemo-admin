'use client'

import React from 'react'
import {
  Sparkles,
  Phone,
  Mail,
  Coins,
  Heart,
  Calendar,
  Eye,
  AlertTriangle,
  Award,
  UserX,
  UserCheck,
  CheckCircle2,
  XCircle,
} from 'lucide-react'
import { Customer, MembershipTier } from '@/store/useAdminStore'

interface CustomerTableRowProps {
  customer: Customer
  isAdmin: boolean
  onAdjustBeans: (customer: Customer) => void
  onToggleStatus: (customer: Customer) => void
  onView: (customer: Customer) => void
}

export default function CustomerTableRow({
  customer,
  isAdmin,
  onAdjustBeans,
  onToggleStatus,
  onView,
}: CustomerTableRowProps) {
  const isInactive = customer.status === 'inactive'

  // Membership Tier badge
  const renderTierBadge = (tier: MembershipTier) => {
    switch (tier) {
      case 'gold':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-300 shadow-2xs">
            <Sparkles size={11} className="text-amber-600 fill-amber-500" />
            <span>Gold VIP</span>
          </span>
        )
      case 'silver':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-slate-800 border border-slate-300">
            <Award size={11} className="text-slate-600" />
            <span>Silver</span>
          </span>
        )
      case 'bronze':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
            <span>Bronze</span>
          </span>
        )
    }
  }

  // Privacy masking for staff view
  const maskedPhone = isAdmin
    ? customer.phone
    : customer.phone.slice(0, 9) + ' ••••'

  const maskedEmail = isAdmin
    ? customer.email
    : customer.email
    ? customer.email.charAt(0) + '••••@' + customer.email.split('@')[1]
    : null

  return (
    <tr
      onClick={() => onView(customer)}
      className={`border-b border-[#F2EAE0] hover:bg-[#FDFBF7] transition-colors cursor-pointer group ${
        isInactive ? 'bg-stone-50/60 opacity-80' : ''
      }`}
    >
      {/* ── Customer Identity & Status ── */}
      <td className="py-3.5 px-4">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-2xl font-bold text-[14px] flex items-center justify-center flex-shrink-0 shadow-2xs transition-colors ${
              isInactive
                ? 'bg-stone-300 text-stone-600'
                : 'bg-[#C87D55] text-white'
            }`}
          >
            {customer.avatar ? (
              <img
                src={customer.avatar}
                alt={customer.name}
                className="w-full h-full object-cover rounded-2xl"
              />
            ) : (
              customer.name.charAt(0).toUpperCase()
            )}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span
                className={`font-bold text-[14px] transition-colors truncate ${
                  isInactive
                    ? 'text-stone-500 line-through decoration-stone-400'
                    : 'text-[#2C1A0E] group-hover:text-[#C87D55]'
                }`}
              >
                {customer.name}
              </span>
              {/* Account Status Pill */}
              {isInactive ? (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-stone-200 text-stone-700 border border-stone-300">
                  <XCircle size={10} className="text-stone-500" />
                  <span>Deactivated</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  <span>Active</span>
                </span>
              )}
            </div>
            <span className="text-[11px] text-[#A08878] block">
              Joined {customer.memberSince}
            </span>
          </div>
        </div>
      </td>

      {/* ── Membership Tier ── */}
      <td className="py-3.5 px-4">{renderTierBadge(customer.tier)}</td>

      {/* ── Contact Info (Masked for Staff) ── */}
      <td className="py-3.5 px-4">
        <div className="space-y-0.5">
          <div className="flex items-center gap-1.5 text-[12px] font-mono text-[#2C1A0E]">
            <Phone size={11} className="text-[#A08878]" />
            <span>{maskedPhone}</span>
          </div>
          {maskedEmail && (
            <div className="flex items-center gap-1.5 text-[11px] text-[#8C705B] truncate max-w-[160px]">
              <Mail size={11} className="text-[#A08878]" />
              <span className="truncate">{maskedEmail}</span>
            </div>
          )}
        </div>
      </td>

      {/* ── Loyalty Beans Balance ── */}
      <td className="py-3.5 px-4">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[#FAF5EE] border border-[#EDE2D5]">
          <Coins size={14} className="text-amber-600" />
          <span className="font-bold text-[13px] text-[#8C4A28]">
            {customer.loyaltyBeans}
          </span>
          <span className="text-[10px] text-[#A08878]">Beans</span>
        </div>
      </td>

      {/* ── Visits & Spending (Spend hidden for staff) ── */}
      <td className="py-3.5 px-4">
        <div>
          {isAdmin ? (
            <>
              <div className="font-bold text-[13px] text-[#2C1A0E]">
                ₹{customer.lifetimeSpend.toLocaleString()}
              </div>
              <div className="text-[11px] text-[#A08878]">
                {customer.totalVisits} visits • Avg ₹{customer.avgOrderValue}
              </div>
            </>
          ) : (
            <div>
              <div className="font-bold text-[13px] text-[#2C1A0E]">
                {customer.totalVisits} Visits
              </div>
              <div className="text-[11px] text-[#A08878]">Repeat diner</div>
            </div>
          )}
        </div>
      </td>

      {/* ── Dietary & Preferences ── */}
      <td className="py-3.5 px-4">
        <div className="space-y-1 max-w-[190px]">
          {customer.favoriteItem && (
            <div className="flex items-center gap-1 text-[12px] text-[#2C1A0E] truncate">
              <Heart size={11} className="text-[#C87D55] flex-shrink-0" />
              <span className="truncate font-medium">{customer.favoriteItem}</span>
            </div>
          )}
          {customer.dietaryPreference && (
            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-amber-50 text-amber-900 border border-amber-200">
              <AlertTriangle size={10} className="text-amber-600 flex-shrink-0" />
              <span className="truncate">{customer.dietaryPreference}</span>
            </div>
          )}
        </div>
      </td>

      {/* ── Last Visit Date ── */}
      <td className="py-3.5 px-4">
        <div className="text-[12px] font-semibold text-[#2C1A0E] flex items-center gap-1">
          <Calendar size={11} className="text-[#A08878]" />
          {customer.lastVisit}
        </div>
        {customer.lastTableNumber && (
          <span className="text-[11px] text-[#A08878] block">
            Table {customer.lastTableNumber}
          </span>
        )}
      </td>

      {/* ── Actions Column ── */}
      <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-end gap-1.5">
          {isAdmin ? (
            <>
              {/* Quick Adjust Beans */}
              <button
                type="button"
                onClick={() => onAdjustBeans(customer)}
                disabled={isInactive}
                className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold flex items-center gap-1 transition-all active:scale-95 ${
                  isInactive
                    ? 'opacity-40 cursor-not-allowed bg-stone-100 text-stone-400 border border-stone-200'
                    : 'text-[#8C4A28] bg-[#FAF5EE] hover:bg-[#F2E7D8] border border-[#EADBCC]'
                }`}
                title={isInactive ? 'Account is deactivated' : 'Adjust Loyalty Beans (+/-)'}
              >
                <Coins size={12} className={isInactive ? 'text-stone-400' : 'text-amber-600'} />
                <span>Beans</span>
              </button>

              {/* Activate / Deactivate Account (Replacing Delete) */}
              {isInactive ? (
                <button
                  type="button"
                  onClick={() => onToggleStatus(customer)}
                  className="px-2.5 py-1.5 rounded-lg text-[11px] font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 flex items-center gap-1 transition-all shadow-2xs"
                  title="Reactivate Customer Account"
                >
                  <UserCheck size={13} className="text-emerald-600" />
                  <span>Activate</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => onToggleStatus(customer)}
                  className="px-2.5 py-1.5 rounded-lg text-[11px] font-semibold text-stone-600 hover:text-red-700 hover:bg-red-50 border border-stone-200 hover:border-red-200 flex items-center gap-1 transition-all"
                  title="Deactivate Customer Account"
                >
                  <UserX size={13} className="text-stone-400 hover:text-red-600" />
                  <span>Deactivate</span>
                </button>
              )}
            </>
          ) : (
            <button
              type="button"
              onClick={() => onView(customer)}
              className="px-3 py-1.5 rounded-lg text-[11px] font-semibold text-[#8C4A28] bg-[#FAF5EE] hover:bg-[#F2E7D8] border border-[#EADBCC] flex items-center gap-1 transition-all"
            >
              <Eye size={12} />
              <span>Profile</span>
            </button>
          )}
        </div>
      </td>
    </tr>
  )
}
