import { create } from 'zustand'

export type OrderStatus = 'new' | 'confirmed' | 'preparing' | 'on_the_way' | 'served' | 'completed'
export type TableStatus = 'available' | 'ordering' | 'occupied' | 'cleaning' | 'reserved'
export type StockStatus = 'ok' | 'low' | 'out_of_stock'

export interface OrderItem {
  name: string
  quantity: number
  price: number
}

export interface Order {
  id: string
  tableNumber: string
  customerName?: string
  items: OrderItem[]
  total: number
  status: OrderStatus
  createdAt: string
  updatedAt: string
}

export interface Table {
  id: string
  number: string
  capacity: number
  status: TableStatus
  currentOrderId?: string
  qrCode?: string
}

export interface StockItem {
  id: string
  name: string
  unit: string
  currentStock: number
  minThreshold: number
  status: StockStatus
  lastUpdated: string
}

export interface ActivityItem {
  id: string
  type: 'order' | 'table' | 'stock' | 'customer' | 'product'
  message: string
  timestamp: string
}

interface AdminState {
  // Sidebar
  isSidebarCollapsed: boolean
  toggleSidebar: () => void

  // Orders
  orders: Order[]
  updateOrderStatus: (orderId: string, status: OrderStatus) => void
  cancelOrder: (orderId: string) => void

  // Tables
  tables: Table[]
  updateTableStatus: (tableId: string, status: TableStatus) => void

  // Activity feed
  recentActivity: ActivityItem[]
  addActivity: (item: Omit<ActivityItem, 'id' | 'timestamp'>) => void

  // Toast
  toastMessage: string | null
  showToast: (msg: string) => void
  hideToast: () => void
}

// --- Mock seed data ---
const MOCK_ORDERS: Order[] = [
  {
    id: 'YMO-1048', tableNumber: '07', customerName: 'Ananya Sharma', items: [{ name: 'Cappuccino', quantity: 2, price: 220 }],
    total: 440, status: 'preparing', createdAt: new Date(Date.now() - 8 * 60000).toISOString(), updatedAt: new Date().toISOString(),
  },
  {
    id: 'YMO-1047', tableNumber: '03', customerName: 'Rohan Mehta', items: [{ name: 'Iced Latte', quantity: 1, price: 280 }, { name: 'Croissant', quantity: 1, price: 120 }],
    total: 400, status: 'confirmed', createdAt: new Date(Date.now() - 12 * 60000).toISOString(), updatedAt: new Date().toISOString(),
  },
  {
    id: 'YMO-1046', tableNumber: '12', customerName: 'Priya Verma', items: [{ name: 'Matcha Latte', quantity: 1, price: 320 }],
    total: 320, status: 'on_the_way', createdAt: new Date(Date.now() - 15 * 60000).toISOString(), updatedAt: new Date().toISOString(),
  },
  {
    id: 'YMO-1045', tableNumber: '05', customerName: 'Sameer Sen', items: [{ name: 'Cold Coffee', quantity: 1, price: 260 }, { name: 'Bagel', quantity: 1, price: 140 }],
    total: 400, status: 'preparing', createdAt: new Date(Date.now() - 18 * 60000).toISOString(), updatedAt: new Date().toISOString(),
  },
  {
    id: 'YMO-1044', tableNumber: '09', customerName: 'Vikram Rao', items: [{ name: 'Cappuccino', quantity: 1, price: 220 }, { name: 'Croissant', quantity: 1, price: 120 }],
    total: 340, status: 'confirmed', createdAt: new Date(Date.now() - 22 * 60000).toISOString(), updatedAt: new Date().toISOString(),
  },
  {
    id: 'YMO-1043', tableNumber: '02', customerName: 'Kabir Patel', items: [{ name: 'Mocha', quantity: 1, price: 260 }, { name: 'Doughnut', quantity: 1, price: 120 }],
    total: 380, status: 'served', createdAt: new Date(Date.now() - 32 * 60000).toISOString(), updatedAt: new Date().toISOString(),
  },
  {
    id: 'YMO-1042', tableNumber: '07', customerName: 'Anushka Roy', items: [{ name: 'Cold Brew', quantity: 2, price: 240 }, { name: 'Cheesecake', quantity: 1, price: 160 }],
    total: 640, status: 'completed', createdAt: new Date(Date.now() - 48 * 60000).toISOString(), updatedAt: new Date().toISOString(),
  },
  {
    id: 'YMO-1041', tableNumber: '01', customerName: 'Rhea Shah', items: [{ name: 'Vanilla Latte', quantity: 1, price: 280 }, { name: 'Sandwich', quantity: 1, price: 210 }],
    total: 490, status: 'completed', createdAt: new Date(Date.now() - 65 * 60000).toISOString(), updatedAt: new Date().toISOString(),
  },
  {
    id: 'YMO-1040', tableNumber: '04', customerName: 'Aman Verma', items: [{ name: 'Americano', quantity: 1, price: 180 }],
    total: 180, status: 'completed', createdAt: new Date(Date.now() - 90 * 60000).toISOString(), updatedAt: new Date().toISOString(),
  },
  {
    id: 'YMO-1039', tableNumber: '11', customerName: 'Pooja Nair', items: [{ name: 'Caramel Latte', quantity: 1, price: 300 }, { name: 'Croissant', quantity: 1, price: 120 }],
    total: 420, status: 'completed', createdAt: new Date(Date.now() - 120 * 60000).toISOString(), updatedAt: new Date().toISOString(),
  },
]

const MOCK_TABLES: Table[] = [
  { id: 't1', number: '01', capacity: 2, status: 'available' },
  { id: 't2', number: '02', capacity: 4, status: 'occupied', currentOrderId: 'YMO-1043' },
  { id: 't3', number: '03', capacity: 2, status: 'ordering', currentOrderId: 'YMO-1047' },
  { id: 't4', number: '04', capacity: 4, status: 'ordering' },
  { id: 't5', number: '05', capacity: 2, status: 'occupied', currentOrderId: 'YMO-1045' },
  { id: 't6', number: '06', capacity: 6, status: 'occupied' },
  { id: 't7', number: '07', capacity: 2, status: 'ordering', currentOrderId: 'YMO-1048' },
  { id: 't8', number: '08', capacity: 4, status: 'available' },
  { id: 't9', number: '09', capacity: 2, status: 'ordering', currentOrderId: 'YMO-1044' },
  { id: 't10', number: '10', capacity: 4, status: 'ordering' },
  { id: 't11', number: '11', capacity: 2, status: 'available' },
  { id: 't12', number: '12', capacity: 4, status: 'cleaning' },
]

const MOCK_ACTIVITY: ActivityItem[] = [
  { id: 'a1', type: 'order', message: 'Order #YMO-1048 marked Preparing', timestamp: new Date(Date.now() - 3 * 60000).toISOString() },
  { id: 'a2', type: 'table', message: 'Table 07 order received', timestamp: new Date(Date.now() - 4 * 60000).toISOString() },
  { id: 'a3', type: 'product', message: 'Iced Latte price updated to ₹280', timestamp: new Date(Date.now() - 18 * 60000).toISOString() },
  { id: 'a4', type: 'customer', message: 'Rahul redeemed 150 Yemo Beans', timestamp: new Date(Date.now() - 31 * 60000).toISOString() },
  { id: 'a5', type: 'customer', message: 'New customer registered', timestamp: new Date(Date.now() - 41 * 60000).toISOString() },
]

export const useAdminStore = create<AdminState>()((set, get) => ({
  isSidebarCollapsed: false,
  toggleSidebar: () => set((s) => ({ isSidebarCollapsed: !s.isSidebarCollapsed })),

  orders: MOCK_ORDERS,
  updateOrderStatus: (orderId, status) =>
    set((s) => ({
      orders: s.orders.map((o) =>
        o.id === orderId ? { ...o, status, updatedAt: new Date().toISOString() } : o
      ),
    })),

  cancelOrder: (orderId) =>
    set((s) => ({
      orders: s.orders.filter((o) => o.id !== orderId),
    })),

  tables: MOCK_TABLES,
  updateTableStatus: (tableId, status) =>
    set((s) => ({
      tables: s.tables.map((t) => (t.id === tableId ? { ...t, status } : t)),
    })),

  recentActivity: MOCK_ACTIVITY,
  addActivity: (item) =>
    set((s) => ({
      recentActivity: [
        { ...item, id: `a${Date.now()}`, timestamp: new Date().toISOString() },
        ...s.recentActivity.slice(0, 19),
      ],
    })),

  toastMessage: null,
  showToast: (msg) => {
    set({ toastMessage: msg })
    setTimeout(() => {
      if (get().toastMessage === msg) set({ toastMessage: null })
    }, 3000)
  },
  hideToast: () => set({ toastMessage: null }),
}))
