import { create } from 'zustand'

export type OrderStatus = 'new' | 'confirmed' | 'preparing' | 'on_the_way' | 'served' | 'completed'
export type TableStatus = 'available' | 'ordering' | 'occupied' | 'cleaning' | 'reserved'
export type StockStatus = 'ok' | 'low' | 'out_of_stock'

export type MenuCategory = 'coffee' | 'cold_brew' | 'bakery' | 'food'
export type DietaryType = 'veg' | 'non_veg' | 'vegan'
export type ItemBadge = 'bestseller' | 'seasonal' | 'new' | 'chef_special'

export interface MenuItem {
  id: string
  name: string
  category: MenuCategory
  price: number
  costPrice?: number
  description: string
  image: string
  isAvailable: boolean
  dietary: DietaryType
  prepTimeMinutes: number
  badge?: ItemBadge
  rating?: number
  reviewsCount?: number
  ingredients?: string[]
  calories?: number
  allergens?: string[]
  createdAt?: string
  updatedAt?: string
}

export type InventoryCategory =
  | 'coffee_beans'
  | 'dairy_milk'
  | 'syrups'
  | 'bakery_dry'
  | 'produce'
  | 'packaging'

export interface InventoryItem {
  id: string
  sku: string
  name: string
  category: InventoryCategory
  currentStock: number
  unit: string // 'kg', 'L', 'bottles', 'pcs', 'packs'
  minThreshold: number
  maxCapacity?: number
  costPerUnit: number
  supplier?: string
  storageLocation?: string
  status: StockStatus
  lastUpdated: string
  lastRestockedDate?: string
}

export type RestockStatus = 'received' | 'pending' | 'partially_received' | 'cancelled'

export interface RestockOrderItem {
  inventoryItemId?: string
  itemName: string
  quantity: number
  unit: string
  unitCost: number
  totalCost: number
}

export interface RestockOrder {
  id: string
  poNumber: string
  supplier: string
  supplierInvoiceNo?: string
  items: RestockOrderItem[]
  totalAmount: number
  status: RestockStatus
  orderDate: string
  deliveryDate?: string
  receivedBy?: string
  notes?: string
}

export type MembershipTier = 'gold' | 'silver' | 'bronze'

export interface Customer {
  id: string
  name: string
  phone: string
  email?: string
  avatar?: string
  tier: MembershipTier
  loyaltyBeans: number
  totalVisits: number
  lifetimeSpend: number
  avgOrderValue: number
  favoriteItem: string
  dietaryPreference?: string
  notes?: string
  memberSince: string
  lastVisit: string
  lastTableNumber?: string
  status: 'active' | 'inactive'
}

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

  // Menu Items (CRUD)
  menuItems: MenuItem[]
  addMenuItem: (item: Omit<MenuItem, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateMenuItem: (id: string, updates: Partial<MenuItem>) => void
  deleteMenuItem: (id: string) => void
  toggleMenuItemAvailability: (id: string) => void

  // Inventory Stock (CRUD)
  inventory: InventoryItem[]
  addInventoryItem: (item: Omit<InventoryItem, 'id' | 'lastUpdated' | 'status'>) => void
  updateInventoryItem: (id: string, updates: Partial<InventoryItem>) => void
  deleteInventoryItem: (id: string) => void
  adjustInventoryStock: (id: string, newQuantity: number, reason?: string) => void

  // Restock & Purchase Orders (CRUD)
  restockOrders: RestockOrder[]
  addRestockOrder: (order: Omit<RestockOrder, 'id' | 'poNumber' | 'orderDate'>) => void
  updateRestockStatus: (id: string, status: RestockStatus) => void
  createRestockFromLowStock: () => void

  // Customers CRM (CRUD)
  customers: Customer[]
  addCustomer: (customer: Omit<Customer, 'id' | 'memberSince'>) => void
  updateCustomer: (id: string, updates: Partial<Customer>) => void
  deleteCustomer: (id: string) => void
  adjustCustomerBeans: (id: string, delta: number, reason?: string) => void
  toggleCustomerStatus: (id: string) => void

  // Orders
  orders: Order[]
  updateOrderStatus: (orderId: string, status: OrderStatus) => void
  cancelOrder: (orderId: string) => void

  // Tables
  tables: Table[]
  updateTableStatus: (tableId: string, status: TableStatus) => void
  addTable: (table: Omit<Table, 'id'>) => void
  deleteTable: (tableId: string) => void

  // Activity feed
  recentActivity: ActivityItem[]
  addActivity: (item: Omit<ActivityItem, 'id' | 'timestamp'>) => void

  // Toast
  toastMessage: string | null
  showToast: (msg: string) => void
  hideToast: () => void
}

const calcStockStatus = (qty: number, minThreshold: number): StockStatus => {
  if (qty <= 0) return 'out_of_stock'
  if (qty <= minThreshold) return 'low'
  return 'ok'
}

// --- Mock seed data ---
export const MOCK_INVENTORY: InventoryItem[] = [
  {
    id: 'inv-1',
    sku: 'YMO-COF-01',
    name: 'Arabica Signature Espresso Beans',
    category: 'coffee_beans',
    currentStock: 18.5,
    unit: 'kg',
    minThreshold: 8.0,
    maxCapacity: 30.0,
    costPerUnit: 950,
    supplier: 'Blue Tokai Roasters',
    storageLocation: 'Barista Bar B-01',
    status: 'ok',
    lastUpdated: new Date(Date.now() - 2 * 3600000).toISOString(),
    lastRestockedDate: '2026-10-06',
  },
  {
    id: 'inv-2',
    sku: 'YMO-COF-02',
    name: 'Ethiopia Yirgacheffe Single Origin',
    category: 'coffee_beans',
    currentStock: 2.2,
    unit: 'kg',
    minThreshold: 5.0,
    maxCapacity: 15.0,
    costPerUnit: 1250,
    supplier: 'Monsoon Coffee Co.',
    storageLocation: 'Barista Bar B-01',
    status: 'low',
    lastUpdated: new Date(Date.now() - 5 * 3600000).toISOString(),
    lastRestockedDate: '2026-09-28',
  },
  {
    id: 'inv-3',
    sku: 'YMO-DRY-01',
    name: 'Farm Fresh Whole Milk (Cow)',
    category: 'dairy_milk',
    currentStock: 28,
    unit: 'L',
    minThreshold: 15,
    maxCapacity: 50,
    costPerUnit: 68,
    supplier: 'Country Delight Dairy',
    storageLocation: 'Walk-in Chiller C-2',
    status: 'ok',
    lastUpdated: new Date(Date.now() - 1 * 3600000).toISOString(),
    lastRestockedDate: '2026-10-09',
  },
  {
    id: 'inv-4',
    sku: 'YMO-DRY-02',
    name: 'Barista Edition Oat Milk',
    category: 'dairy_milk',
    currentStock: 3,
    unit: 'L',
    minThreshold: 10,
    maxCapacity: 24,
    costPerUnit: 240,
    supplier: 'Oatly India',
    storageLocation: 'Walk-in Chiller C-2',
    status: 'low',
    lastUpdated: new Date(Date.now() - 4 * 3600000).toISOString(),
    lastRestockedDate: '2026-10-02',
  },
  {
    id: 'inv-5',
    sku: 'YMO-SYR-01',
    name: 'Madagascar Vanilla Syrup 750ml',
    category: 'syrups',
    currentStock: 5,
    unit: 'bottles',
    minThreshold: 2,
    maxCapacity: 12,
    costPerUnit: 620,
    supplier: 'Monin Gourmet Syrups',
    storageLocation: 'Syrup Rack S-1',
    status: 'ok',
    lastUpdated: new Date(Date.now() - 8 * 3600000).toISOString(),
    lastRestockedDate: '2026-09-25',
  },
  {
    id: 'inv-6',
    sku: 'YMO-SYR-02',
    name: 'Salted Caramel Drizzle Sauce 1L',
    category: 'syrups',
    currentStock: 0,
    unit: 'bottles',
    minThreshold: 3,
    maxCapacity: 10,
    costPerUnit: 750,
    supplier: 'Torani Syrups',
    storageLocation: 'Syrup Rack S-1',
    status: 'out_of_stock',
    lastUpdated: new Date(Date.now() - 12 * 3600000).toISOString(),
    lastRestockedDate: '2026-09-18',
  },
  {
    id: 'inv-7',
    sku: 'YMO-BAK-01',
    name: 'French Butter 82% Fat (Block)',
    category: 'bakery_dry',
    currentStock: 14,
    unit: 'kg',
    minThreshold: 6,
    maxCapacity: 25,
    costPerUnit: 580,
    supplier: 'President Dairy',
    storageLocation: 'Pastry Fridge P-1',
    status: 'ok',
    lastUpdated: new Date(Date.now() - 6 * 3600000).toISOString(),
    lastRestockedDate: '2026-10-07',
  },
  {
    id: 'inv-8',
    sku: 'YMO-BAK-02',
    name: 'Belgian Dark Chocolate Batons 70%',
    category: 'bakery_dry',
    currentStock: 1.5,
    unit: 'kg',
    minThreshold: 4.0,
    maxCapacity: 10.0,
    costPerUnit: 890,
    supplier: 'Callebaut Belgium',
    storageLocation: 'Dry Storage Room A',
    status: 'low',
    lastUpdated: new Date(Date.now() - 3 * 3600000).toISOString(),
    lastRestockedDate: '2026-09-29',
  },
  {
    id: 'inv-9',
    sku: 'YMO-BAK-03',
    name: 'Organic Unbleached Pastry Flour T55',
    category: 'bakery_dry',
    currentStock: 45,
    unit: 'kg',
    minThreshold: 20,
    maxCapacity: 80,
    costPerUnit: 65,
    supplier: 'Golden Mill Foods',
    storageLocation: 'Dry Storage Room A',
    status: 'ok',
    lastUpdated: new Date(Date.now() - 18 * 3600000).toISOString(),
    lastRestockedDate: '2026-10-04',
  },
  {
    id: 'inv-10',
    sku: 'YMO-PRO-01',
    name: 'Fresh Garden Mint Leaves',
    category: 'produce',
    currentStock: 0.8,
    unit: 'kg',
    minThreshold: 1.5,
    maxCapacity: 3.0,
    costPerUnit: 120,
    supplier: 'Hydroponics Hub',
    storageLocation: 'Salad & Herbs Crisper',
    status: 'low',
    lastUpdated: new Date(Date.now() - 30 * 60000).toISOString(),
    lastRestockedDate: '2026-10-08',
  },
  {
    id: 'inv-11',
    sku: 'YMO-PRO-02',
    name: 'Fresh Wild Berries (Mixed Punnet)',
    category: 'produce',
    currentStock: 0,
    unit: 'kg',
    minThreshold: 2.0,
    maxCapacity: 5.0,
    costPerUnit: 340,
    supplier: 'Mahabaleshwar Fresh',
    storageLocation: 'Fruit Chiller Drawer',
    status: 'out_of_stock',
    lastUpdated: new Date(Date.now() - 20 * 60000).toISOString(),
    lastRestockedDate: '2026-10-05',
  },
  {
    id: 'inv-12',
    sku: 'YMO-PKG-01',
    name: 'Double-Wall Kraft Takeaway Cups 12oz',
    category: 'packaging',
    currentStock: 650,
    unit: 'pcs',
    minThreshold: 200,
    maxCapacity: 1200,
    costPerUnit: 4.5,
    supplier: 'EcoPack India',
    storageLocation: 'Packaging Shelf PK-1',
    status: 'ok',
    lastUpdated: new Date(Date.now() - 14 * 3600000).toISOString(),
    lastRestockedDate: '2026-10-01',
  },
  {
    id: 'inv-13',
    sku: 'YMO-PKG-02',
    name: 'Biodegradable Sip Lids 12oz',
    category: 'packaging',
    currentStock: 65,
    unit: 'pcs',
    minThreshold: 200,
    maxCapacity: 1000,
    costPerUnit: 2.2,
    supplier: 'EcoPack India',
    storageLocation: 'Packaging Shelf PK-1',
    status: 'low',
    lastUpdated: new Date(Date.now() - 14 * 3600000).toISOString(),
    lastRestockedDate: '2026-10-01',
  },
]

export const MOCK_RESTOCK_ORDERS: RestockOrder[] = [
  {
    id: 'ro-1',
    poNumber: 'PO-2026-104',
    supplier: 'Country Delight Dairy',
    supplierInvoiceNo: 'CD-INV-8902',
    items: [
      {
        inventoryItemId: 'inv-3',
        itemName: 'Farm Fresh Whole Milk (Cow)',
        quantity: 30,
        unit: 'L',
        unitCost: 68,
        totalCost: 2040,
      },
    ],
    totalAmount: 2040,
    status: 'received',
    orderDate: '2026-10-10',
    deliveryDate: '2026-10-10 09:30 AM',
    receivedBy: 'STF-001 Rahul',
    notes: 'Chilled crates inspected, temperature verified at 3.8°C.',
  },
  {
    id: 'ro-2',
    poNumber: 'PO-2026-103',
    supplier: 'Blue Tokai Roasters',
    supplierInvoiceNo: 'BT-DL-4410',
    items: [
      {
        inventoryItemId: 'inv-1',
        itemName: 'Arabica Signature Espresso Beans',
        quantity: 20,
        unit: 'kg',
        unitCost: 950,
        totalCost: 19000,
      },
    ],
    totalAmount: 19000,
    status: 'received',
    orderDate: '2026-10-09',
    deliveryDate: '2026-10-09 11:15 AM',
    receivedBy: 'ADM-001 Ananya',
    notes: 'Batch roast date: Oct 8th. Fresh nitrogen-flushed valve bags intact.',
  },
  {
    id: 'ro-3',
    poNumber: 'PO-2026-105',
    supplier: 'Oatly India',
    items: [
      {
        inventoryItemId: 'inv-4',
        itemName: 'Barista Edition Oat Milk',
        quantity: 15,
        unit: 'L',
        unitCost: 240,
        totalCost: 3600,
      },
    ],
    totalAmount: 3600,
    status: 'pending',
    orderDate: '2026-10-10',
    deliveryDate: 'Expected Today, 5:00 PM',
    receivedBy: 'Unassigned',
    notes: 'Urgent low stock order. Courier dispatch tracking #BLR-90412.',
  },
  {
    id: 'ro-4',
    poNumber: 'PO-2026-106',
    supplier: 'EcoPack India',
    items: [
      {
        inventoryItemId: 'inv-12',
        itemName: 'Double-Wall Kraft Takeaway Cups 12oz',
        quantity: 500,
        unit: 'pcs',
        unitCost: 4.5,
        totalCost: 2250,
      },
      {
        inventoryItemId: 'inv-13',
        itemName: 'Biodegradable Sip Lids 12oz',
        quantity: 400,
        unit: 'pcs',
        unitCost: 2.2,
        totalCost: 880,
      },
    ],
    totalAmount: 3130,
    status: 'pending',
    orderDate: '2026-10-10',
    deliveryDate: 'Expected Tomorrow, 11:00 AM',
    notes: 'Eco-friendly kraft bulk carton shipment.',
  },
  {
    id: 'ro-5',
    poNumber: 'PO-2026-102',
    supplier: 'Monin Gourmet Syrups',
    supplierInvoiceNo: 'MN-IND-319',
    items: [
      {
        inventoryItemId: 'inv-5',
        itemName: 'Madagascar Vanilla Syrup 750ml',
        quantity: 6,
        unit: 'bottles',
        unitCost: 620,
        totalCost: 3720,
      },
    ],
    totalAmount: 3720,
    status: 'received',
    orderDate: '2026-10-06',
    deliveryDate: '2026-10-07 02:20 PM',
    receivedBy: 'ADM-001 Ananya',
    notes: 'Glass bottles checked for seals and expiration.',
  },
  {
    id: 'ro-6',
    poNumber: 'PO-2026-101',
    supplier: 'President Dairy',
    supplierInvoiceNo: 'PR-INV-1104',
    items: [
      {
        inventoryItemId: 'inv-7',
        itemName: 'French Butter 82% Fat (Block)',
        quantity: 20,
        unit: 'kg',
        unitCost: 580,
        totalCost: 11600,
      },
    ],
    totalAmount: 11600,
    status: 'received',
    orderDate: '2026-10-04',
    deliveryDate: '2026-10-05 10:00 AM',
    receivedBy: 'ADM-001 Ananya',
    notes: 'Refrigerated transport delivery. Certified 82% fat butter.',
  },
]

export const MOCK_CUSTOMERS: Customer[] = [
  {
    id: 'c-1',
    name: 'Ananya Sharma',
    phone: '+91 98201 44321',
    email: 'ananya.sharma@gmail.com',
    tier: 'gold',
    loyaltyBeans: 680,
    totalVisits: 34,
    lifetimeSpend: 12850,
    avgOrderValue: 378,
    favoriteItem: 'Cappuccino & French Croissant',
    dietaryPreference: '🌱 Vegetarian',
    notes: 'Prefers oat milk in coffee; likes window banquette table.',
    memberSince: '2026-03-15',
    lastVisit: 'Today',
    lastTableNumber: '07',
    status: 'active',
  },
  {
    id: 'c-2',
    name: 'Rohan Mehta',
    phone: '+91 98112 55678',
    email: 'rohan.mehta@yahoo.com',
    tier: 'gold',
    loyaltyBeans: 520,
    totalVisits: 28,
    lifetimeSpend: 10400,
    avgOrderValue: 371,
    favoriteItem: 'Iced Caramel Latte',
    dietaryPreference: 'Vegetarian',
    notes: 'Freelance designer; works on laptop during weekday afternoons.',
    memberSince: '2026-04-10',
    lastVisit: 'Today',
    lastTableNumber: '03',
    status: 'active',
  },
  {
    id: 'c-3',
    name: 'Priya Verma',
    phone: '+91 97405 66789',
    email: 'priya.verma@outlook.com',
    tier: 'silver',
    loyaltyBeans: 340,
    totalVisits: 16,
    lifetimeSpend: 5820,
    avgOrderValue: 364,
    favoriteItem: '18-Hour Nitro Cold Brew',
    dietaryPreference: '🌿 100% Vegan',
    notes: 'Strict vegan; allergic to cow milk & dairy contamination.',
    memberSince: '2026-06-02',
    lastVisit: 'Today',
    lastTableNumber: '12',
    status: 'active',
  },
  {
    id: 'c-4',
    name: 'Kabir Patel',
    phone: '+91 99203 11223',
    email: 'kabir.patel@gmail.com',
    tier: 'silver',
    loyaltyBeans: 290,
    totalVisits: 14,
    lifetimeSpend: 4950,
    avgOrderValue: 353,
    favoriteItem: 'Artisan Dark Mocha',
    dietaryPreference: 'Vegetarian',
    notes: 'Prefers extra hot temperature.',
    memberSince: '2026-05-18',
    lastVisit: 'Yesterday',
    lastTableNumber: '02',
    status: 'active',
  },
  {
    id: 'c-5',
    name: 'Sameer Sen',
    phone: '+91 98334 77889',
    email: 'sameer.sen@rediffmail.com',
    tier: 'silver',
    loyaltyBeans: 210,
    totalVisits: 11,
    lifetimeSpend: 3880,
    avgOrderValue: 352,
    favoriteItem: 'Bold Caffe Americano',
    dietaryPreference: 'Vegan',
    memberSince: '2026-07-22',
    lastVisit: 'Yesterday',
    lastTableNumber: '05',
    status: 'active',
  },
  {
    id: 'c-6',
    name: 'Anushka Roy',
    phone: '+91 97654 33221',
    email: 'anushka.roy@gmail.com',
    tier: 'gold',
    loyaltyBeans: 890,
    totalVisits: 42,
    lifetimeSpend: 16320,
    avgOrderValue: 388,
    favoriteItem: 'NY Cheesecake & Cold Brew',
    dietaryPreference: 'Vegetarian',
    notes: 'Café founding member. Birthday on Oct 14th.',
    memberSince: '2026-01-20',
    lastVisit: '3 days ago',
    lastTableNumber: '07',
    status: 'active',
  },
  {
    id: 'c-7',
    name: 'Vikram Rao',
    phone: '+91 98901 22334',
    email: 'vikram.rao@gmail.com',
    tier: 'bronze',
    loyaltyBeans: 140,
    totalVisits: 7,
    lifetimeSpend: 2450,
    avgOrderValue: 350,
    favoriteItem: 'Pain au Chocolat',
    dietaryPreference: 'Vegetarian',
    notes: 'Enjoys booth seating near plants.',
    memberSince: '2026-08-11',
    lastVisit: '2 days ago',
    lastTableNumber: '09',
    status: 'active',
  },
  {
    id: 'c-8',
    name: 'Rhea Shah',
    phone: '+91 98190 88776',
    email: 'rhea.shah@gmail.com',
    tier: 'silver',
    loyaltyBeans: 310,
    totalVisits: 15,
    lifetimeSpend: 5400,
    avgOrderValue: 360,
    favoriteItem: 'Vanilla Bean Oat Latte',
    dietaryPreference: '🌿 Vegan',
    notes: '⚠️ Mild tree nut allergy notice.',
    memberSince: '2026-05-30',
    lastVisit: '4 days ago',
    lastTableNumber: '01',
    status: 'active',
  },
  {
    id: 'c-9',
    name: 'Aman Verma',
    phone: '+91 98711 00998',
    email: 'aman.verma@techhub.in',
    tier: 'bronze',
    loyaltyBeans: 90,
    totalVisits: 5,
    lifetimeSpend: 1620,
    avgOrderValue: 324,
    favoriteItem: 'Caffe Americano',
    dietaryPreference: 'Vegan',
    memberSince: '2026-09-01',
    lastVisit: '5 days ago',
    lastTableNumber: '04',
    status: 'inactive',
  },
  {
    id: 'c-10',
    name: 'Pooja Nair',
    phone: '+91 99887 66554',
    email: 'pooja.nair@gmail.com',
    tier: 'bronze',
    loyaltyBeans: 180,
    totalVisits: 9,
    lifetimeSpend: 3150,
    avgOrderValue: 350,
    favoriteItem: 'Wild Berry Sparkling Mojito',
    dietaryPreference: 'Vegan',
    memberSince: '2026-08-04',
    lastVisit: '1 week ago',
    lastTableNumber: '11',
    status: 'active',
  },
]

export const MOCK_MENU_ITEMS: MenuItem[] = [
  {
    id: 'm-1',
    name: 'Classic Cappuccino',
    category: 'coffee',
    price: 220,
    costPrice: 65,
    description: 'Rich double espresso topped with silky, aerated whole milk foam and a dusting of cocoa.',
    image: '/products/cappuccino.jpg',
    isAvailable: true,
    dietary: 'veg',
    prepTimeMinutes: 5,
    badge: 'bestseller',
    rating: 4.9,
    reviewsCount: 142,
    ingredients: ['Espresso', 'Whole Milk', 'Milk Foam', 'Cocoa Powder'],
    calories: 120,
    allergens: ['Dairy'],
  },
  {
    id: 'm-2',
    name: 'Caramel Macchiato Latte',
    category: 'coffee',
    price: 300,
    costPrice: 90,
    description: 'Freshly steamed milk with Madagascar vanilla syrup, marked with espresso and artisan caramel drizzle.',
    image: '/products/caramel-latte.jpg',
    isAvailable: true,
    dietary: 'veg',
    prepTimeMinutes: 6,
    badge: 'bestseller',
    rating: 4.8,
    reviewsCount: 98,
    ingredients: ['Espresso', 'Vanilla Syrup', 'Steamed Milk', 'Caramel Sauce'],
    calories: 240,
    allergens: ['Dairy'],
  },
  {
    id: 'm-3',
    name: 'Vanilla Bean Oat Latte',
    category: 'coffee',
    price: 280,
    costPrice: 85,
    description: 'Smooth espresso paired with creamy oat milk and natural ground vanilla bean paste.',
    image: '/products/vanilla-latte.jpg',
    isAvailable: true,
    dietary: 'vegan',
    prepTimeMinutes: 5,
    rating: 4.7,
    reviewsCount: 64,
    ingredients: ['Espresso', 'Oat Milk', 'Natural Vanilla Paste'],
    calories: 170,
    allergens: ['Oats'],
  },
  {
    id: 'm-4',
    name: 'Artisan Dark Mocha',
    category: 'coffee',
    price: 260,
    costPrice: 80,
    description: 'Single-origin espresso blended with 70% dark Belgian cocoa and velvety steamed milk.',
    image: '/products/mocha.jpg',
    isAvailable: true,
    dietary: 'veg',
    prepTimeMinutes: 6,
    badge: 'new',
    rating: 4.85,
    reviewsCount: 52,
    ingredients: ['Espresso', 'Belgian Dark Chocolate', 'Steamed Milk', 'Chocolate Shavings'],
    calories: 290,
    allergens: ['Dairy'],
  },
  {
    id: 'm-5',
    name: 'Bold Caffe Americano',
    category: 'coffee',
    price: 180,
    costPrice: 40,
    description: 'Double shot of signature dark roast espresso poured over hot purified mineral water.',
    image: '/products/americano.jpg',
    isAvailable: true,
    dietary: 'vegan',
    prepTimeMinutes: 3,
    rating: 4.6,
    reviewsCount: 88,
    ingredients: ['Espresso', 'Purified Hot Water'],
    calories: 15,
  },
  {
    id: 'm-6',
    name: '18-Hour Nitro Cold Brew',
    category: 'cold_brew',
    price: 240,
    costPrice: 60,
    description: 'Slow-steeped Arabica coffee beans infused with food-grade nitrogen for a creamy, draft-beer texture.',
    image: '/products/cold-brew.jpg',
    isAvailable: true,
    dietary: 'vegan',
    prepTimeMinutes: 2,
    badge: 'bestseller',
    rating: 4.95,
    reviewsCount: 175,
    ingredients: ['Slow-Steeped Arabica Coffee', 'Nitrogen'],
    calories: 10,
  },
  {
    id: 'm-7',
    name: 'Wild Berry Sparkling Mojito',
    category: 'cold_brew',
    price: 250,
    costPrice: 70,
    description: 'Muddled fresh blackberries, raspberries, fresh garden mint, lime, and sparkling soda.',
    image: '/products/berry-mojito.jpg',
    isAvailable: true,
    dietary: 'vegan',
    prepTimeMinutes: 4,
    badge: 'seasonal',
    rating: 4.75,
    reviewsCount: 46,
    ingredients: ['Fresh Blackberries', 'Raspberries', 'Mint Leaves', 'Lime Juice', 'Sparkling Soda'],
    calories: 110,
  },
  {
    id: 'm-8',
    name: 'French Butter Croissant',
    category: 'bakery',
    price: 120,
    costPrice: 45,
    description: 'Flaky, golden, honeycombed all-butter puff pastry baked fresh in-house every morning.',
    image: '/products/croissant.jpg',
    isAvailable: true,
    dietary: 'veg',
    prepTimeMinutes: 2,
    badge: 'bestseller',
    rating: 4.9,
    reviewsCount: 210,
    ingredients: ['Flour', 'French Butter', 'Yeast', 'Milk', 'Sea Salt'],
    calories: 260,
    allergens: ['Dairy', 'Gluten'],
  },
  {
    id: 'm-9',
    name: 'Pain au Chocolat (Choco Croissant)',
    category: 'bakery',
    price: 160,
    costPrice: 55,
    description: 'Crisp French pastry wrapped around two sticks of rich, molten semi-sweet dark chocolate.',
    image: '/products/choco-croissant.jpg',
    isAvailable: true,
    dietary: 'veg',
    prepTimeMinutes: 2,
    rating: 4.8,
    reviewsCount: 89,
    ingredients: ['Puff Pastry', 'Belgian Dark Chocolate Batons', 'Butter'],
    calories: 310,
    allergens: ['Dairy', 'Gluten'],
  },
  {
    id: 'm-10',
    name: 'Vanilla Glazed Doughnut',
    category: 'bakery',
    price: 120,
    costPrice: 35,
    description: 'Light and airy brioche yeast doughnut dipped in real vanilla bean glaze.',
    image: '/products/doughnut.jpg',
    isAvailable: true,
    dietary: 'veg',
    prepTimeMinutes: 2,
    rating: 4.65,
    reviewsCount: 77,
    ingredients: ['Brioche Dough', 'Vanilla Glaze', 'Cane Sugar'],
    calories: 220,
    allergens: ['Dairy', 'Gluten'],
  },
  {
    id: 'm-11',
    name: 'New York Baked Cheesecake',
    category: 'bakery',
    price: 190,
    costPrice: 75,
    description: 'Velvety cream cheese filling over a buttery graham cracker crust with strawberry reduction.',
    image: '/products/cheesecake.jpg',
    isAvailable: false,
    dietary: 'veg',
    prepTimeMinutes: 2,
    badge: 'chef_special',
    rating: 4.9,
    reviewsCount: 112,
    ingredients: ['Cream Cheese', 'Graham Crackers', 'Butter', 'Strawberry Coulis'],
    calories: 380,
    allergens: ['Dairy', 'Gluten'],
  },
  {
    id: 'm-12',
    name: 'Gourmet Grilled Herb Sandwich',
    category: 'food',
    price: 210,
    costPrice: 80,
    description: 'Toasted artisan sourdough with sun-dried tomatoes, basil pesto, bocconcini mozzarella, and fresh arugula.',
    image: '/products/sandwich.jpg',
    isAvailable: true,
    dietary: 'veg',
    prepTimeMinutes: 8,
    badge: 'bestseller',
    rating: 4.85,
    reviewsCount: 94,
    ingredients: ['Sourdough Bread', 'Basil Pesto', 'Mozzarella', 'Sun-Dried Tomatoes', 'Arugula'],
    calories: 340,
    allergens: ['Dairy', 'Gluten', 'Nuts'],
  },
]

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

  // Menu items CRUD
  menuItems: MOCK_MENU_ITEMS,
  addMenuItem: (item) => {
    const newItem: MenuItem = {
      ...item,
      id: `m-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    set((s) => ({
      menuItems: [newItem, ...s.menuItems],
      recentActivity: [
        {
          id: `a${Date.now()}`,
          type: 'product',
          message: `Added new menu item: ${newItem.name} (₹${newItem.price})`,
          timestamp: new Date().toISOString(),
        },
        ...s.recentActivity,
      ],
    }))
    get().showToast(`Added "${newItem.name}" to menu`)
  },

  updateMenuItem: (id, updates) => {
    set((s) => ({
      menuItems: s.menuItems.map((item) =>
        item.id === id
          ? { ...item, ...updates, updatedAt: new Date().toISOString() }
          : item
      ),
      recentActivity: [
        {
          id: `a${Date.now()}`,
          type: 'product',
          message: `Updated item "${updates.name || s.menuItems.find((i) => i.id === id)?.name || ''}"`,
          timestamp: new Date().toISOString(),
        },
        ...s.recentActivity,
      ],
    }))
    get().showToast('Menu item updated successfully')
  },

  deleteMenuItem: (id) => {
    const target = get().menuItems.find((i) => i.id === id)
    set((s) => ({
      menuItems: s.menuItems.filter((i) => i.id !== id),
      recentActivity: [
        {
          id: `a${Date.now()}`,
          type: 'product',
          message: `Removed "${target?.name || 'Item'}" from menu`,
          timestamp: new Date().toISOString(),
        },
        ...s.recentActivity,
      ],
    }))
    get().showToast(`Deleted "${target?.name || 'Item'}" from menu`)
  },

  toggleMenuItemAvailability: (id) => {
    const target = get().menuItems.find((i) => i.id === id)
    if (!target) return
    const nextState = !target.isAvailable
    set((s) => ({
      menuItems: s.menuItems.map((item) =>
        item.id === id ? { ...item, isAvailable: nextState, updatedAt: new Date().toISOString() } : item
      ),
    }))
    get().showToast(
      `${target.name} is now ${nextState ? 'Available (In Stock)' : 'Sold Out / 86’d'}`
    )
  },

  // Inventory Stock CRUD
  inventory: MOCK_INVENTORY,
  addInventoryItem: (item) => {
    const status = calcStockStatus(item.currentStock, item.minThreshold)
    const newItem: InventoryItem = {
      ...item,
      id: `inv-${Date.now()}`,
      status,
      lastUpdated: new Date().toISOString(),
    }
    set((s) => ({
      inventory: [newItem, ...s.inventory],
      recentActivity: [
        {
          id: `a${Date.now()}`,
          type: 'stock',
          message: `Added inventory item: ${newItem.name} (${newItem.currentStock} ${newItem.unit})`,
          timestamp: new Date().toISOString(),
        },
        ...s.recentActivity,
      ],
    }))
    get().showToast(`Added "${newItem.name}" to inventory`)
  },

  updateInventoryItem: (id, updates) => {
    set((s) => ({
      inventory: s.inventory.map((item) => {
        if (item.id !== id) return item
        const updated = { ...item, ...updates, lastUpdated: new Date().toISOString() }
        updated.status = calcStockStatus(updated.currentStock, updated.minThreshold)
        return updated
      }),
      recentActivity: [
        {
          id: `a${Date.now()}`,
          type: 'stock',
          message: `Updated inventory item: ${updates.name || s.inventory.find((i) => i.id === id)?.name || ''}`,
          timestamp: new Date().toISOString(),
        },
        ...s.recentActivity,
      ],
    }))
    get().showToast('Inventory item updated')
  },

  deleteInventoryItem: (id) => {
    const target = get().inventory.find((i) => i.id === id)
    set((s) => ({
      inventory: s.inventory.filter((i) => i.id !== id),
      recentActivity: [
        {
          id: `a${Date.now()}`,
          type: 'stock',
          message: `Removed inventory supply: ${target?.name || 'Item'}`,
          timestamp: new Date().toISOString(),
        },
        ...s.recentActivity,
      ],
    }))
    get().showToast(`Deleted "${target?.name || 'Supply'}" from inventory`)
  },

  adjustInventoryStock: (id, newQuantity, reason) => {
    const target = get().inventory.find((i) => i.id === id)
    if (!target) return
    const diff = newQuantity - target.currentStock
    const diffText = diff > 0 ? `+${diff}` : `${diff}`
    set((s) => ({
      inventory: s.inventory.map((item) => {
        if (item.id !== id) return item
        const updatedQty = Math.max(0, newQuantity)
        return {
          ...item,
          currentStock: updatedQty,
          status: calcStockStatus(updatedQty, item.minThreshold),
          lastUpdated: new Date().toISOString(),
          lastRestockedDate: diff > 0 ? new Date().toISOString().split('T')[0] : item.lastRestockedDate,
        }
      }),
      recentActivity: [
        {
          id: `a${Date.now()}`,
          type: 'stock',
          message: `Adjusted ${target.name} stock (${diffText} ${target.unit})${reason ? ` • ${reason}` : ''}`,
          timestamp: new Date().toISOString(),
        },
        ...s.recentActivity,
      ],
    }))
    get().showToast(`Updated stock: ${target.name} (${newQuantity} ${target.unit})`)
  },

  // Restock Orders
  restockOrders: MOCK_RESTOCK_ORDERS,
  addRestockOrder: (order) => {
    const nextPoNum = `PO-2026-${107 + get().restockOrders.length}`
    const newOrder: RestockOrder = {
      ...order,
      id: `ro-${Date.now()}`,
      poNumber: nextPoNum,
      orderDate: new Date().toISOString().split('T')[0],
    }

    let updatedInventory = get().inventory
    if (order.status === 'received') {
      order.items.forEach((oi) => {
        if (oi.inventoryItemId) {
          updatedInventory = updatedInventory.map((inv) => {
            if (inv.id !== oi.inventoryItemId) return inv
            const newQty = inv.currentStock + oi.quantity
            return {
              ...inv,
              currentStock: newQty,
              status: calcStockStatus(newQty, inv.minThreshold),
              lastUpdated: new Date().toISOString(),
              lastRestockedDate: new Date().toISOString().split('T')[0],
            }
          })
        }
      })
    }

    set((s) => ({
      restockOrders: [newOrder, ...s.restockOrders],
      inventory: updatedInventory,
      recentActivity: [
        {
          id: `a${Date.now()}`,
          type: 'stock',
          message: `Created Restock Order #${nextPoNum} for ${order.supplier} (₹${order.totalAmount})`,
          timestamp: new Date().toISOString(),
        },
        ...s.recentActivity,
      ],
    }))
    get().showToast(`Restock order #${nextPoNum} registered`)
  },

  updateRestockStatus: (id, status) => {
    const target = get().restockOrders.find((r) => r.id === id)
    if (!target) return

    let updatedInventory = get().inventory
    if (status === 'received' && target.status !== 'received') {
      target.items.forEach((oi) => {
        if (oi.inventoryItemId) {
          updatedInventory = updatedInventory.map((inv) => {
            if (inv.id !== oi.inventoryItemId) return inv
            const newQty = inv.currentStock + oi.quantity
            return {
              ...inv,
              currentStock: newQty,
              status: calcStockStatus(newQty, inv.minThreshold),
              lastUpdated: new Date().toISOString(),
              lastRestockedDate: new Date().toISOString().split('T')[0],
            }
          })
        }
      })
    }

    set((s) => ({
      restockOrders: s.restockOrders.map((r) =>
        r.id === id ? { ...r, status, deliveryDate: status === 'received' ? 'Today (Just now)' : r.deliveryDate } : r
      ),
      inventory: updatedInventory,
      recentActivity: [
        {
          id: `a${Date.now()}`,
          type: 'stock',
          message: `Restock Order #${target.poNumber} marked as ${status}`,
          timestamp: new Date().toISOString(),
        },
        ...s.recentActivity,
      ],
    }))
    get().showToast(`Order #${target.poNumber} marked as ${status}`)
  },

  createRestockFromLowStock: () => {
    const lowItems = get().inventory.filter((i) => i.status === 'low' || i.status === 'out_of_stock')
    if (lowItems.length === 0) {
      get().showToast('All supplies are currently healthy!')
      return
    }

    const itemsToRestock: RestockOrderItem[] = lowItems.map((inv) => {
      const restockQty = Math.max(
        inv.minThreshold * 2 - inv.currentStock,
        inv.minThreshold
      )
      return {
        inventoryItemId: inv.id,
        itemName: inv.name,
        quantity: Math.round(restockQty),
        unit: inv.unit,
        unitCost: inv.costPerUnit,
        totalCost: Math.round(restockQty * inv.costPerUnit),
      }
    })

    const total = itemsToRestock.reduce((acc, curr) => acc + curr.totalCost, 0)
    const nextPoNum = `PO-2026-${107 + get().restockOrders.length}`

    const newOrder: RestockOrder = {
      id: `ro-${Date.now()}`,
      poNumber: nextPoNum,
      supplier: 'Consolidated Café Roasters & Suppliers',
      items: itemsToRestock,
      totalAmount: total,
      status: 'pending',
      orderDate: new Date().toISOString().split('T')[0],
      deliveryDate: 'Expected Tomorrow',
      receivedBy: 'Unassigned',
      notes: `Automated order for ${lowItems.length} low-stock supplies.`,
    }

    set((s) => ({
      restockOrders: [newOrder, ...s.restockOrders],
      recentActivity: [
        {
          id: `a${Date.now()}`,
          type: 'stock',
          message: `Automated Restock PO #${nextPoNum} generated for ${lowItems.length} low-stock supplies`,
          timestamp: new Date().toISOString(),
        },
        ...s.recentActivity,
      ],
    }))
    get().showToast(`Generated PO #${nextPoNum} for ${lowItems.length} low items`)
  },

  // Customers
  customers: MOCK_CUSTOMERS,
  addCustomer: (customer) => {
    const newCust: Customer = {
      ...customer,
      id: `c-${Date.now()}`,
      memberSince: new Date().toISOString().split('T')[0],
      status: customer.status || 'active',
    }
    set((s) => ({
      customers: [newCust, ...s.customers],
      recentActivity: [
        {
          id: `a${Date.now()}`,
          type: 'customer',
          message: `Registered new café member: ${newCust.name}`,
          timestamp: new Date().toISOString(),
        },
        ...s.recentActivity,
      ],
    }))
    get().showToast(`Added customer "${newCust.name}"`)
  },

  updateCustomer: (id, updates) => {
    set((s) => ({
      customers: s.customers.map((c) =>
        c.id === id ? { ...c, ...updates } : c
      ),
      recentActivity: [
        {
          id: `a${Date.now()}`,
          type: 'customer',
          message: `Updated profile for ${updates.name || s.customers.find((c) => c.id === id)?.name || ''}`,
          timestamp: new Date().toISOString(),
        },
        ...s.recentActivity,
      ],
    }))
    get().showToast('Customer profile updated')
  },

  deleteCustomer: (id) => {
    const target = get().customers.find((c) => c.id === id)
    set((s) => ({
      customers: s.customers.filter((c) => c.id !== id),
      recentActivity: [
        {
          id: `a${Date.now()}`,
          type: 'customer',
          message: `Removed diner record: ${target?.name || 'Customer'}`,
          timestamp: new Date().toISOString(),
        },
        ...s.recentActivity,
      ],
    }))
    get().showToast(`Deleted "${target?.name || 'Customer'}"`)
  },

  adjustCustomerBeans: (id, delta, reason) => {
    const target = get().customers.find((c) => c.id === id)
    if (!target) return
    const newBeans = Math.max(0, target.loyaltyBeans + delta)
    const deltaText = delta > 0 ? `+${delta}` : `${delta}`
    set((s) => ({
      customers: s.customers.map((c) =>
        c.id === id ? { ...c, loyaltyBeans: newBeans } : c
      ),
      recentActivity: [
        {
          id: `a${Date.now()}`,
          type: 'customer',
          message: `Adjusted ${target.name}'s loyalty beans (${deltaText} Beans)${reason ? ` • ${reason}` : ''}`,
          timestamp: new Date().toISOString(),
        },
        ...s.recentActivity,
      ],
    }))
    get().showToast(`Updated ${target.name}: ${newBeans} Beans (${deltaText})`)
  },

  toggleCustomerStatus: (id) => {
    const target = get().customers.find((c) => c.id === id)
    if (!target) return
    const newStatus: 'active' | 'inactive' = target.status === 'inactive' ? 'active' : 'inactive'
    set((s) => ({
      customers: s.customers.map((c) =>
        c.id === id ? { ...c, status: newStatus } : c
      ),
      recentActivity: [
        {
          id: `a${Date.now()}`,
          type: 'customer',
          message: `${newStatus === 'active' ? 'Activated' : 'Deactivated'} diner account: ${target.name}`,
          timestamp: new Date().toISOString(),
        },
        ...s.recentActivity,
      ],
    }))
    get().showToast(
      newStatus === 'active'
        ? `Activated account for ${target.name}`
        : `Deactivated account for ${target.name}`
    )
  },

  // Orders
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

  // Tables
  tables: MOCK_TABLES,
  updateTableStatus: (tableId, status) =>
    set((s) => ({
      tables: s.tables.map((t) => (t.id === tableId ? { ...t, status } : t)),
    })),

  addTable: (table) =>
    set((s) => ({
      tables: [...s.tables, { ...table, id: `t${Date.now()}` }],
    })),

  deleteTable: (tableId) =>
    set((s) => ({
      tables: s.tables.filter((t) => t.id !== tableId),
    })),

  // Activity Feed
  recentActivity: MOCK_ACTIVITY,
  addActivity: (item) =>
    set((s) => ({
      recentActivity: [
        { ...item, id: `a${Date.now()}`, timestamp: new Date().toISOString() },
        ...s.recentActivity.slice(0, 19),
      ],
    })),

  // Toast
  toastMessage: null,
  showToast: (msg) => {
    set({ toastMessage: msg })
    setTimeout(() => {
      if (get().toastMessage === msg) set({ toastMessage: null })
    }, 3200)
  },
  hideToast: () => set({ toastMessage: null }),
}))
