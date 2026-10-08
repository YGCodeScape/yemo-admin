'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, EyeOff, Lock, User, AlertCircle, Coffee } from 'lucide-react'
import { useAuthStore } from '@/store/useAuthStore'
import { mockLogin } from '@/lib/mockAuth'

export default function LoginPage() {
  const router = useRouter()
  const login = useAuthStore((s) => s.login)

  const [staffId, setStaffId] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!staffId.trim() || !password.trim()) {
      setError('Please enter your Staff ID and password.')
      return
    }
    setIsLoading(true)
    setError(null)

    const result = await mockLogin(staffId.trim(), password)

    if ('error' in result) {
      setError(result.error)
      setIsLoading(false)
      return
    }

    login(result.user)
    router.push('/dashboard')
  }

  return (
    <div className="h-screen flex">
      {/* ── LEFT PANEL ── */}
      <div className="hidden lg:flex lg:w-[44%] xl:w-[42%] relative flex-col bg-[#1E110A] overflow-hidden">
        {/* Café photo background */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-all duration-700"
          style={{ backgroundImage: "url('/assets/cafe_storefront.jpg')" }}
        />
        {/* Modern gradient overlay for readability and depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#1E110A]/85 via-[#1E110A]/45 to-[#1E110A]/95 backdrop-blur-[0.5px]" />

        {/* Content over photo */}
        <div className="relative z-10 flex flex-col h-full p-8">
          {/* Logo with wordmark */}
          <div className="flex items-center gap-3">
            <div className="relative w-12 h-12 rounded-2xl overflow-hidden flex items-center justify-center p-1.5 flex-shrink-0">
              <Image
                src="/icons/yemo-logo-bg.png"
                alt="Yemo Café Logo"
                width={60}
                height={60}
                className="object-cover rounded-2xl "
                priority
              />
            </div>
            <div>
              <h1
                className="text-[32px] font-bold text-white tracking-tight leading-none"
                style={{ fontFamily: '"Lily Script One", system-ui' }}
              >
                yemo
              </h1>
              <p className="text-[#C4A882] text-[11px] font-semibold tracking-wider uppercase mt-1">
                Café Admin Panel
              </p>
            </div>
          </div>

          {/* Center tagline */}
          <div className="flex-1 flex flex-col items-start justify-center">
            <p
              className="text-[38px] font-bold text-white leading-tight max-w-xs"
              style={{ fontFamily: '"Playfair Display", Georgia, serif' }}
            >
              Run your café effortlessly.
            </p>
            <p className="text-[#C4A882] text-[15px] mt-3 max-w-[260px] leading-relaxed">
              Everything you need to manage orders, staff, and your menu — in one place.
            </p>
          </div>

          {/* Feature pills */}
          <div className="flex flex-wrap gap-2 pb-2">
            {['● Live Order Tracking', '● Inventory Alerts', '● Real-time Analytics'].map((f) => (
              <span
                key={f}
                className="text-[12px] text-[#E8D5C0] bg-white/10 backdrop-blur-sm border border-white/15 px-3 py-1.5 rounded-full"
              >
                {f}
              </span>
            ))}
          </div>

          {/* Footer */}
          <p className="text-[#7A5C48] text-[11px] mt-4">
            Good Food · Good Vibes · Yemo
          </p>
        </div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div className="flex-1 flex flex-col bg-[#FAF7F4]">
        {/* Top bar */}
        <div className="flex justify-end px-8 pt-6">
          <p className="text-[12px] text-[#A08878]">
            Need help?{' '}
            <a href="mailto:contact@yemo.cafe" className="text-[#C87D55] font-medium hover:underline">
              contact@yemo.cafe
            </a>
          </p>
        </div>

        {/* Centered form */}
        <div className="flex-1 flex items-center justify-center px-6 py-8">
          <div className="w-full max-w-[400px]">
            {/* Header */}
            <div className="mb-7">
              {/* Mobile logo */}
              <div className="lg:hidden mb-5">
                <h2
                  className="text-[22px] font-bold text-[#2C1A0E]"
                  style={{ fontFamily: '"Playfair Display", Georgia, serif' }}
                >
                  yemo°
                </h2>
                <p className="text-[#A08878] text-[12px]">Café Admin Panel</p>
              </div>

              <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#C87D55] mb-1.5">
                Welcome Back
              </p>
              <h2
                className="text-[28px] font-bold text-[#2C1A0E] leading-tight"
                style={{ fontFamily: '"Playfair Display", Georgia, serif' }}
              >
                Sign in to Yemo Admin
              </h2>
              <p className="text-[#A08878] text-[13px] mt-1.5">
                Manage your café operations seamlessly.
              </p>
            </div>

            {/* Form card */}
            <div className="bg-white border border-[#EDE2D5] rounded-3xl p-7 shadow-sm">
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Staff ID */}
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-[#A08878] block mb-1.5">
                    Staff ID
                  </label>
                  <div className="relative">
                    <User
                      size={15}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A08878]"
                    />
                    <input
                      type="text"
                      value={staffId}
                      onChange={(e) => { setStaffId(e.target.value); setError(null) }}
                      placeholder="e.g. ADM-001 or STF-001"
                      autoComplete="username"
                      className="w-full pl-9 pr-4 py-3 bg-white border border-[#EBDCCF] rounded-xl text-[13px] text-[#2C1A0E] placeholder-[#C4B0A0] focus:outline-none focus:ring-2 focus:ring-[#C87D55]/30 focus:border-[#C87D55] transition-all font-medium uppercase"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-[#A08878] block mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <Lock
                      size={15}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A08878]"
                    />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => { setPassword(e.target.value); setError(null) }}
                      placeholder="••••••••••"
                      autoComplete="current-password"
                      className="w-full pl-9 pr-11 py-3 bg-white border border-[#EBDCCF] rounded-xl text-[13px] text-[#2C1A0E] placeholder-[#C4B0A0] focus:outline-none focus:ring-2 focus:ring-[#C87D55]/30 focus:border-[#C87D55] transition-all font-medium"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#A08878] hover:text-[#2C1A0E] transition-colors"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>

                {/* Error message */}
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      className="flex items-start gap-2.5 bg-red-50 border border-red-200 rounded-xl px-3.5 py-2.5"
                    >
                      <AlertCircle size={14} className="text-red-500 mt-0.5 flex-shrink-0" />
                      <p className="text-[12px] text-red-700 leading-relaxed">{error}</p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Sign In button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#2C1A0E] hover:bg-[#1A0E07] disabled:bg-[#6B5344] text-white py-3.5 rounded-full text-[14px] font-bold flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.98] mt-1"
                >
                  {isLoading ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                        className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full"
                      />
                      <span>Signing in…</span>
                    </>
                  ) : (
                    <span>Sign In →</span>
                  )}
                </button>

                {/* Divider */}
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-px bg-[#EDE2D5]" />
                </div>

                {/* Role indicator pills */}
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#EBDCCF] text-[#2C1A0E] text-[11px] font-bold rounded-full">
                      <User size={11} />
                      Admin Access
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#EBDCCF] text-[#2C1A0E] text-[11px] font-bold rounded-full">
                      <User size={11} />
                      Staff Access
                    </span>
                  </div>
                   {/* Security note */}
                    <div className="flex items-center justify-center gap-1.5 mt-5">
                      <Lock size={11} className="text-[#A08878]" />
                      <p className="text-[11px] text-[#A08878]">
                        Secured by Yemo Admin · All sessions are logged
                      </p>
                    </div>
                </div>
              </form>
            </div>

            {/* Dev hint */}
            <div className="mt-4 bg-amber-50 border border-amber-200 rounded-2xl p-3.5">
              <div className="flex items-center gap-1.5 mb-2">
                <Coffee size={13} className="text-amber-700" />
                <p className="text-[11px] font-bold text-amber-800 uppercase tracking-wide">
                  Dev Credentials
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-[11px] text-amber-700">
                  <span className="font-bold">Admin:</span> ADM-001 · admin@yemo
                </p>
                <p className="text-[11px] text-amber-700">
                  <span className="font-bold">Staff:</span> STF-001 · staff@yemo
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center pb-5">
          <p className="text-[11px] text-[#C4B0A0]">© 2025 Yemo Café. All rights reserved.</p>
        </div>
      </div>
    </div>
  )
}
