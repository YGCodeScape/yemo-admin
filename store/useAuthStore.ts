import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type UserRole = 'admin' | 'staff'

export interface AdminUser {
  id: string
  name: string
  email?: string
  staffId: string
  role: UserRole
  avatar?: string
  phone?: string
}

interface AuthState {
  user: AdminUser | null
  isAuthenticated: boolean
  isLoading: boolean

  // Actions
  login: (user: AdminUser) => void
  logout: () => void
  setLoading: (loading: boolean) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      login: (user) => set({ user, isAuthenticated: true }),
      logout: () => set({ user: null, isAuthenticated: false }),
      setLoading: (loading) => set({ isLoading: loading }),
    }),
    {
      name: 'yemo_admin_auth',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)
