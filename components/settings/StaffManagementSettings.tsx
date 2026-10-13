'use client'

import React, { useState } from 'react'
import {
  Users,
  ShieldCheck,
  UserPlus,
  KeyRound,
  CheckCircle2,
  XCircle,
  Clock,
  Phone,
  Mail,
  MoreVertical,
  X,
  Lock,
} from 'lucide-react'
import { useAdminStore } from '@/store/useAdminStore'

interface StaffMember {
  id: string
  name: string
  staffId: string
  role: 'admin' | 'staff'
  designation: string
  shift: 'Morning' | 'Evening' | 'Full Day'
  phone: string
  email: string
  posPin: string
  status: 'active' | 'inactive'
}

const INITIAL_STAFF: StaffMember[] = [
  {
    id: 's-1',
    name: 'Yash Deshmukh',
    staffId: 'YMO-ADM-01',
    role: 'admin',
    designation: 'Café Owner & Director',
    shift: 'Full Day',
    phone: '+91 98201 00001',
    email: 'yash@yemocafe.in',
    posPin: '8890',
    status: 'active',
  },
  {
    id: 's-2',
    name: 'Aarav Sharma',
    staffId: 'YMO-STF-02',
    role: 'staff',
    designation: 'Head Barista & Roaster',
    shift: 'Morning',
    phone: '+91 98201 22334',
    email: 'aarav.sharma@yemocafe.in',
    posPin: '1244',
    status: 'active',
  },
  {
    id: 's-3',
    name: 'Kavita Sen',
    staffId: 'YMO-STF-03',
    role: 'staff',
    designation: 'Floor Supervisor',
    shift: 'Evening',
    phone: '+91 98334 55667',
    email: 'kavita.sen@yemocafe.in',
    posPin: '3391',
    status: 'active',
  },
  {
    id: 's-4',
    name: 'Ritesh Roy',
    staffId: 'YMO-STF-04',
    role: 'staff',
    designation: 'Pastry & Kitchen Lead',
    shift: 'Morning',
    phone: '+91 97654 88990',
    email: 'ritesh.roy@yemocafe.in',
    posPin: '4420',
    status: 'active',
  },
  {
    id: 's-5',
    name: 'Siddharth Dave',
    staffId: 'YMO-STF-05',
    role: 'staff',
    designation: 'Barista Apprentice',
    shift: 'Evening',
    phone: '+91 98190 11223',
    email: 'siddharth@yemocafe.in',
    posPin: '5512',
    status: 'inactive',
  },
]

export default function StaffManagementSettings() {
  const showToast = useAdminStore((s) => s.showToast)
  const [staffList, setStaffList] = useState<StaffMember[]>(INITIAL_STAFF)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // New staff form state
  const [newName, setNewName] = useState('')
  const [newDesignation, setNewDesignation] = useState('Junior Barista')
  const [newRole, setNewRole] = useState<'admin' | 'staff'>('staff')
  const [newShift, setNewShift] = useState<'Morning' | 'Evening' | 'Full Day'>('Morning')
  const [newPhone, setNewPhone] = useState('+91 ')
  const [newEmail, setNewEmail] = useState('')
  const [newPin, setNewPin] = useState('1234')

  const toggleStatus = (id: string) => {
    setStaffList((prev) =>
      prev.map((s) => {
        if (s.id === id) {
          const nextStatus = s.status === 'active' ? 'inactive' : 'active'
          showToast(`${s.name}'s account is now ${nextStatus}`)
          return { ...s, status: nextStatus }
        }
        return s
      })
    )
  }

  const handleAddStaff = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newName.trim()) return

    const newMember: StaffMember = {
      id: `s-${Date.now()}`,
      name: newName.trim(),
      staffId: `YMO-STF-0${staffList.length + 1}`,
      role: newRole,
      designation: newDesignation.trim(),
      shift: newShift,
      phone: newPhone.trim(),
      email: newEmail.trim() || `${newName.toLowerCase().replace(/\s+/g, '.')}@yemocafe.in`,
      posPin: newPin || '1234',
      status: 'active',
    }

    setStaffList([newMember, ...staffList])
    showToast(`Added team member "${newMember.name}"`)
    setIsModalOpen(false)
    setNewName('')
    setNewPhone('+91 ')
  }

  return (
    <div className="space-y-6">
      {/* ── Header & Action Card ── */}
      <div className="bg-white p-6 rounded-3xl border border-[#EDE2D5] shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-[#F2EAE0]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#FAF5EE] text-[#8C4A28] border border-[#EADBCC] flex items-center justify-center">
              <Users size={18} />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#2C1A0E]">
                Café Team & Role Permissions
              </h3>
              <p className="text-[12px] text-[#8C705B]">
                Staff credentials, shift rotations, and floor terminal PIN access.
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#8C4A28] hover:bg-[#6E381C] text-white text-[12px] font-bold rounded-2xl shadow-2xs transition-all active:scale-95 shrink-0"
          >
            <UserPlus size={15} />
            <span>Add Team Member</span>
          </button>
        </div>

        {/* Staff Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#F2EAE0] text-[#8C705B] font-bold uppercase tracking-wider text-[10px]">
                <th className="pb-3 px-2">Staff Member</th>
                <th className="pb-3 px-2">Role & Title</th>
                <th className="pb-3 px-2">Assigned Shift</th>
                <th className="pb-3 px-2">POS Quick PIN</th>
                <th className="pb-3 px-2">Contact</th>
                <th className="pb-3 px-2 text-right">Status & Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F2EAE0]">
              {staffList.map((member) => {
                const isInactive = member.status === 'inactive'
                return (
                  <tr
                    key={member.id}
                    className={`hover:bg-[#FAF5EE]/50 transition-colors ${
                      isInactive ? 'opacity-60 bg-stone-50/40' : ''
                    }`}
                  >
                    {/* Identity */}
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-[#FAF5EE] border border-[#EDE2D5] text-[#8C4A28] font-bold text-xs flex items-center justify-center">
                          {member.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-[#2C1A0E]">{member.name}</div>
                          <span className="text-[10px] text-[#A08878] font-mono">
                            {member.staffId}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Role & Title */}
                    <td className="py-3 px-2">
                      <div className="font-semibold text-[#2C1A0E]">{member.designation}</div>
                      <span
                        className={`inline-block px-1.5 py-0.2 rounded text-[10px] font-bold uppercase mt-0.5 ${
                          member.role === 'admin'
                            ? 'bg-amber-100 text-amber-900 border border-amber-300'
                            : 'bg-stone-100 text-stone-700 border border-stone-200'
                        }`}
                      >
                        {member.role}
                      </span>
                    </td>

                    {/* Shift */}
                    <td className="py-3 px-2">
                      <span className="font-medium text-[#2C1A0E] flex items-center gap-1">
                        <Clock size={12} className="text-[#C87D55]" />
                        {member.shift}
                      </span>
                    </td>

                    {/* POS PIN */}
                    <td className="py-3 px-2">
                      <span className="font-mono text-xs font-bold text-[#8C4A28] bg-[#FAF5EE] px-2 py-0.5 rounded-md border border-[#EDE2D5]">
                        {member.posPin}
                      </span>
                    </td>

                    {/* Contact */}
                    <td className="py-3 px-2">
                      <div className="text-[11px] text-[#2C1A0E] font-mono">{member.phone}</div>
                      <div className="text-[10px] text-[#A08878] truncate max-w-[140px]">
                        {member.email}
                      </div>
                    </td>

                    {/* Action */}
                    <td className="py-3 px-2 text-right">
                      {member.role !== 'admin' ? (
                        <button
                          type="button"
                          onClick={() => toggleStatus(member.id)}
                          className={`px-3 py-1 rounded-xl text-[11px] font-bold border transition-all ${
                            isInactive
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                              : 'bg-stone-100 text-stone-700 border-stone-200 hover:bg-red-50 hover:text-red-700 hover:border-red-200'
                          }`}
                        >
                          {isInactive ? 'Activate' : 'Deactivate'}
                        </button>
                      ) : (
                        <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                          Primary Admin
                        </span>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Add Staff Modal ── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white rounded-3xl border border-[#EDE2D5] shadow-2xl p-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-[#F2EAE0]">
              <div className="flex items-center gap-2">
                <UserPlus size={18} className="text-[#8C4A28]" />
                <h3 className="text-base font-bold text-[#2C1A0E]">
                  Add New Café Team Member
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-xl text-stone-400 hover:text-stone-700"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddStaff} className="space-y-4 pt-4 text-xs">
              <div>
                <label className="block font-bold text-[#2C1A0E] mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Meera Nair"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#EDE2D5] text-[13px] text-[#2C1A0E] focus:outline-hidden focus:border-[#C87D55]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#2C1A0E] mb-1">Designation</label>
                  <input
                    type="text"
                    value={newDesignation}
                    onChange={(e) => setNewDesignation(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#EDE2D5] text-[13px] text-[#2C1A0E] focus:outline-hidden focus:border-[#C87D55]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#2C1A0E] mb-1">Role Permission</label>
                  <select
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value as 'admin' | 'staff')}
                    className="w-full px-3 py-2 rounded-xl border border-[#EDE2D5] text-[13px] text-[#2C1A0E] bg-white focus:outline-hidden focus:border-[#C87D55]"
                  >
                    <option value="staff">Staff (Floor Operations)</option>
                    <option value="admin">Admin (Full Control)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#2C1A0E] mb-1">Shift</label>
                  <select
                    value={newShift}
                    onChange={(e) => setNewShift(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-[#EDE2D5] text-[13px] text-[#2C1A0E] bg-white focus:outline-hidden focus:border-[#C87D55]"
                  >
                    <option value="Morning">Morning (8 AM - 4 PM)</option>
                    <option value="Evening">Evening (3 PM - 11 PM)</option>
                    <option value="Full Day">Full Day</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-[#2C1A0E] mb-1">POS Terminal PIN</label>
                  <input
                    type="text"
                    maxLength={4}
                    value={newPin}
                    onChange={(e) => setNewPin(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#EDE2D5] text-[13px] text-[#2C1A0E] font-mono font-bold focus:outline-hidden focus:border-[#C87D55]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#2C1A0E] mb-1">Phone Number</label>
                <input
                  type="text"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#EDE2D5] text-[13px] text-[#2C1A0E] font-mono focus:outline-hidden focus:border-[#C87D55]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#F2EAE0]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-stone-600 hover:bg-stone-100 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#8C4A28] hover:bg-[#6E381C] text-white font-bold"
                >
                  Register Staff
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
