import { AdminUser } from '@/store/useAuthStore'

// ─────────────────────────────────────────────────────────
// MOCK CREDENTIALS — swap this for real Supabase auth later
// Admin:  ID = ADM-001  | password = admin@yemo
// Staff:  ID = STF-001  | password = staff@yemo
// ─────────────────────────────────────────────────────────

interface MockCredential {
  staffId: string
  password: string
  user: AdminUser
}

const MOCK_CREDENTIALS: MockCredential[] = [
  {
    staffId: 'ADM-001',
    password: 'admin@yemo',
    user: {
      id: 'usr-admin-001',
      name: 'Ananya Sharma',
      staffId: 'ADM-001',
      role: 'admin',
      avatar: '/assets/user-avatar.jpg',
      phone: '+91 90828 02412',
    },
  },
  {
    staffId: 'STF-001',
    password: 'staff@yemo',
    user: {
      id: 'usr-staff-001',
      name: 'Rohan Mehta',
      staffId: 'STF-001',
      role: 'staff',
      avatar: '/assets/user-avatar.jpg',
      phone: '+91 98765 43210',
    },
  },
]

export async function mockLogin(
  staffId: string,
  password: string
): Promise<{ user: AdminUser } | { error: string }> {
  // Simulate network delay
  await new Promise((r) => setTimeout(r, 700))

  const match = MOCK_CREDENTIALS.find(
    (c) =>
      c.staffId.toLowerCase() === staffId.trim().toLowerCase() &&
      c.password === password
  )

  if (!match) {
    return { error: 'Invalid Staff ID or password. Please try again.' }
  }

  return { user: match.user }
}
