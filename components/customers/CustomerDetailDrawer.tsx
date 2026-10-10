'use client'

import React from 'react'
import {
  X,
  Sparkles,
  Phone,
  Mail,
  Coins,
  Heart,
  Calendar,
  AlertTriangle,
  Award,
  Clock,
  TrendingUp,
  Receipt,
  Lock,
  UserCheck,
  UserX,
  XCircle,
} from 'lucide-react'
import { Customer, MembershipTier } from '@/store/useAdminStore'

interface CustomerDetailDrawerProps {
  customer: Customer | null
  isOpen: boolean
  isAdmin: boolean
  onClose: () => void
  onAdjustBeans: (customer: Customer) => void
  onToggleStatus: (customer: Customer) => void
}

export default function CustomerDetailDrawer({
  customer,
  isOpen,
  isAdmin,
  onClose,
  onAdjustBeans,
  onToggleStatus,
}: CustomerDetailDrawerProps) {
  if (!isOpen || !customer) return null

  const isInactive = customer.status === 'inactive'

  // Helper tier badge
  const renderTierBadge = (tier: MembershipTier) => {
    switch (tier) {
      case 'gold':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300 shadow-2xs">
            <Sparkles size={12} className="text-amber-600 fill-amber-500" />
            <span>Gold VIP Member</span>
          </span>
        )
      case 'silver':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-800 border border-slate-300">
            <Award size={12} className="text-slate-600" />
            <span>Silver Member</span>
          </span>
        )
      case 'bronze':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
            <span>Bronze Member</span>
          </span>
        )
    }
  }

  // Masked helpers
  const displayPhone = isAdmin
    ? customer.phone
    : customer.phone.length > 5
    ? customer.phone.slice(0, 7) + ' ••••'
    : '••••••••••'

  const displayEmail = !customer.email
    ? null
    : isAdmin
    ? customer.email
    : customer.email.replace(/(.{2})(.*)(?=@)/, '$1••••')

  // Mock visit timeline
  const avgCheck =
    customer.avgOrderValue ||
    (customer.totalVisits > 0
      ? Math.round(customer.lifetimeSpend / customer.totalVisits)
      : 350)

  const recentVisits = [
    {
      date: customer.lastVisit,
      time: '14:20',
      table: customer.lastTableNumber || 'T-04',
      items: [customer.favoriteItem || 'Espresso Tonic', 'Almond Croissant'],
      amount: avgCheck,
      beansEarned: 25,
    },
    {
      date: '2026-10-02',
      time: '18:45',
      table: 'T-07',
      items: [customer.favoriteItem || 'Cappuccino', 'Tiramisu Slice'],
      amount: Math.round(avgCheck * 0.9),
      beansEarned: 20,
    },
    {
      date: '2026-09-24',
      time: '11:15',
      table: 'T-02',
      items: ['Cold Brew', 'Avocado Sourdough'],
      amount: Math.round(avgCheck * 1.1),
      beansEarned: 30,
    },
  ]

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-stone-900/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col border-l border-stone-200">
          {/* Header */}
          <div className="p-6 border-b border-stone-100 flex items-start justify-between bg-stone-50/50">
            <div className="flex items-center gap-4">
              <div
                className={`w-14 h-14 rounded-2xl font-bold text-xl flex items-center justify-center border-2 shadow-inner ${
                  isInactive
                    ? 'bg-stone-200 text-stone-600 border-stone-300'
                    : 'bg-amber-100 text-amber-900 border-amber-200'
                }`}
              >
                {customer.avatar ? (
                  <img
                    src={customer.avatar}
                    alt={customer.name}
                    className="w-full h-full object-cover rounded-2xl"
                  />
                ) : (
                  customer.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .slice(0, 2)
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2
                    className={`text-xl font-bold ${
                      isInactive ? 'text-stone-500 line-through' : 'text-stone-900'
                    }`}
                  >
                    {customer.name}
                  </h2>
                </div>
                <div className="mt-1 flex items-center gap-2">
                  {renderTierBadge(customer.tier)}
                  {isInactive ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-stone-200 text-stone-700">
                      <XCircle size={11} />
                      <span>Deactivated</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      <span>Active Diner</span>
                    </span>
                  )}
                </div>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-xl transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Inactive Notice */}
            {isInactive && (
              <div className="p-3.5 bg-stone-100 border border-stone-300 rounded-xl flex items-start gap-2.5 text-xs text-stone-700">
                <XCircle size={16} className="text-stone-500 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-stone-900">Account Deactivated</div>
                  <p className="mt-0.5 text-stone-600">
                    This customer's loyalty earnings and redemptions are paused. Profile data and points history remain preserved.
                  </p>
                </div>
              </div>
            )}

            {/* Privacy Notification Banner if Staff */}
            {!isAdmin && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl flex items-center gap-2 text-xs text-blue-700">
                <Lock size={14} className="shrink-0 text-blue-500" />
                <span>
                  Staff View: Guest phone, email, and lifetime financial spend are masked for privacy compliance.
                </span>
              </div>
            )}

            {/* Loyalty Beans Overview Card */}
            <div className="p-4 rounded-2xl bg-linear-to-br from-amber-500/10 via-amber-500/5 to-transparent border border-amber-200/80">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-amber-800 uppercase tracking-wider">
                    Loyalty Bean Balance
                  </span>
                  <div className="text-3xl font-extrabold text-amber-950 mt-1 flex items-center gap-2">
                    <Coins size={28} className="text-amber-500 fill-amber-400" />
                    <span>{customer.loyaltyBeans.toLocaleString()}</span>
                    <span className="text-xs font-normal text-amber-700">beans</span>
                  </div>
                </div>

                {isAdmin && !isInactive && (
                  <button
                    onClick={() => onAdjustBeans(customer)}
                    className="px-3.5 py-2 text-xs font-semibold bg-amber-600 hover:bg-amber-700 text-white rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                  >
                    <Coins size={14} />
                    <span>Adjust Points</span>
                  </button>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-amber-200/60 flex items-center justify-between text-xs text-stone-600">
                <span>Member since {customer.memberSince}</span>
                <span className="font-medium text-stone-800">
                  Total Visits: {customer.totalVisits}
                </span>
              </div>
            </div>

            {/* Financial Overview (Admin Only) */}
            {isAdmin ? (
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 bg-stone-50 border border-stone-200/80 rounded-xl">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-stone-500 mb-1">
                    <TrendingUp size={13} className="text-emerald-600" />
                    <span>Lifetime Spend</span>
                  </div>
                  <div className="text-lg font-bold text-stone-900">
                    ₹{customer.lifetimeSpend.toLocaleString()}
                  </div>
                </div>
                <div className="p-3.5 bg-stone-50 border border-stone-200/80 rounded-xl">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-stone-500 mb-1">
                    <Receipt size={13} className="text-amber-600" />
                    <span>Average Check</span>
                  </div>
                  <div className="text-lg font-bold text-stone-900">
                    ₹{avgCheck.toLocaleString()}
                  </div>
                </div>
              </div>
            ) : null}

            {/* Contact Details */}
            <div className="p-4 bg-stone-50/70 border border-stone-200/60 rounded-xl space-y-2.5">
              <h3 className="text-xs font-bold text-stone-600 uppercase tracking-wider mb-2">
                Contact Information
              </h3>
              <div className="flex items-center gap-3 text-sm text-stone-700">
                <Phone size={15} className="text-stone-400 shrink-0" />
                <span className="font-mono text-stone-800">{displayPhone}</span>
                {isAdmin && (
                  <a
                    href={`tel:${customer.phone}`}
                    className="ml-auto text-xs text-amber-700 hover:text-amber-800 font-medium hover:underline"
                  >
                    Call
                  </a>
                )}
              </div>
              {displayEmail && (
                <div className="flex items-center gap-3 text-sm text-stone-700">
                  <Mail size={15} className="text-stone-400 shrink-0" />
                  <span className="font-mono text-stone-800">{displayEmail}</span>
                  {isAdmin && (
                    <a
                      href={`mailto:${customer.email}`}
                      className="ml-auto text-xs text-amber-700 hover:text-amber-800 font-medium hover:underline"
                    >
                      Email
                    </a>
                  )}
                </div>
              )}
              <div className="flex items-center gap-3 text-sm text-stone-700">
                <Calendar size={15} className="text-stone-400 shrink-0" />
                <span>
                  Last visited:{' '}
                  <span className="font-medium text-stone-900">{customer.lastVisit}</span>
                </span>
              </div>
            </div>

            {/* Dietary Restrictions Alert */}
            {customer.dietaryPreference && (
              <div className="p-3.5 bg-amber-50/90 border border-amber-200 rounded-xl flex items-start gap-2.5">
                <AlertTriangle size={18} className="text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-amber-900 uppercase tracking-wider">
                    Dietary Alerts & Allergies
                  </div>
                  <div className="text-sm font-semibold text-amber-950 mt-0.5">
                    {customer.dietaryPreference}
                  </div>
                  <p className="text-[11px] text-amber-800 mt-0.5">
                    Verify order ingredients before serving at the table.
                  </p>
                </div>
              </div>
            )}

            {/* Favorite Order Item */}
            {customer.favoriteItem && (
              <div className="p-4 bg-stone-50 border border-stone-200/80 rounded-xl">
                <div className="flex items-center gap-2 text-xs font-bold text-stone-500 uppercase tracking-wider">
                  <Heart size={14} className="text-rose-500 fill-rose-500" />
                  <span>Favorite Order</span>
                </div>
                <div className="mt-1.5 flex items-center justify-between">
                  <span className="text-sm font-bold text-stone-900">{customer.favoriteItem}</span>
                  <span className="text-xs text-stone-500">Ordered regularly</span>
                </div>
              </div>
            )}

            {/* Hospitality & Service Notes */}
            {customer.notes && (
              <div className="p-4 bg-stone-50 border border-stone-200/80 rounded-xl">
                <div className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-1">
                  Service & Hospitality Notes
                </div>
                <p className="text-sm text-stone-700 leading-relaxed italic">
                  "{customer.notes}"
                </p>
              </div>
            )}

            {/* Dining Timeline */}
            <div>
              <h3 className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <Clock size={13} />
                <span>Recent Café Visits</span>
              </h3>
              <div className="space-y-2.5">
                {recentVisits.map((visit, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl border border-stone-200/70 bg-white hover:bg-stone-50/50 transition-colors"
                  >
                    <div className="flex items-center justify-between text-xs text-stone-500">
                      <span className="font-semibold text-stone-800">
                        {visit.date} • {visit.time}
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-stone-100 font-mono text-[11px] font-semibold text-stone-700">
                        {visit.table}
                      </span>
                    </div>
                    <div className="mt-1.5 text-xs text-stone-700 flex flex-wrap gap-1">
                      {visit.items.map((item, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded-md bg-amber-50/80 text-amber-900 border border-amber-200/50 text-[11px]"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                    <div className="mt-2 pt-2 border-t border-stone-100 flex items-center justify-between text-xs">
                      {isAdmin ? (
                        <span className="font-bold text-stone-900">₹{visit.amount}</span>
                      ) : (
                        <span className="text-stone-400">Order Completed</span>
                      )}
                      <span className="text-amber-700 font-semibold flex items-center gap-1">
                        <Coins size={11} className="text-amber-500" />
                        +{visit.beansEarned} beans
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer - No edit button, only Deactivate/Reactivate if admin, and Close */}
          <div className="p-4 border-t border-stone-100 bg-stone-50/80 flex items-center gap-3">
            {isAdmin && (
              <button
                onClick={() => onToggleStatus(customer)}
                className={`flex-1 py-2.5 px-4 rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2 ${
                  isInactive
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    : 'bg-red-50 hover:bg-red-100 text-red-700 border border-red-200'
                }`}
              >
                {isInactive ? (
                  <>
                    <UserCheck size={16} />
                    <span>Reactivate Account</span>
                  </>
                ) : (
                  <>
                    <UserX size={16} />
                    <span>Deactivate Account</span>
                  </>
                )}
              </button>
            )}
            <button
              onClick={onClose}
              className={`py-2.5 px-4 bg-stone-200 hover:bg-stone-300 text-stone-800 rounded-xl text-sm font-semibold transition-colors ${
                isAdmin ? 'w-24' : 'w-full'
              }`}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
