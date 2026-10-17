import {
  Mess,
  AppUser,
  Vendor,
  Item,
  PurchaseOrder,
  StockTransaction,
  ConsumptionRecord,
  Budget,
  Expenditure,
  ForecastRecord,
  AuditLog,
  Menu,
  Feedback,
} from '../types';

export const INITIAL_MESSES: Mess[] = [
  {
    id: 'mess-1',
    name: 'Falcon Hostel Mess',
    location: 'North Campus, Block A',
    headcount_capacity: 450,
    created_at: '2026-01-10T08:00:00Z',
  },
  {
    id: 'mess-2',
    name: 'Eagle Block Mess',
    location: 'South Campus, Sector 4',
    headcount_capacity: 380,
    created_at: '2026-01-10T08:00:00Z',
  },
  {
    id: 'mess-3',
    name: 'Staff & Faculty Mess',
    location: 'Main Administrative Wing',
    headcount_capacity: 150,
    created_at: '2026-01-10T08:00:00Z',
  },
];

export const INITIAL_USERS: AppUser[] = [
  {
    id: 'user-admin',
    name: 'Rajesh Sharma',
    email: 'admin@messmunch.edu',
    role: 'administrator',
    is_active: true,
    avatar_url: 'https://api.dicebear.com/7.x/bottts/svg?seed=AdminChef',
    created_at: '2026-01-10T08:00:00Z',
  },
  {
    id: 'user-storekeeper',
    name: 'Gopal Krishnan',
    email: 'storekeeper@messmunch.edu',
    role: 'store_keeper',
    is_active: true,
    avatar_url: 'https://api.dicebear.com/7.x/bottts/svg?seed=StoreGopal',
    created_at: '2026-01-10T08:00:00Z',
  },
  {
    id: 'user-manager-1',
    name: 'Pooja Verma',
    email: 'falcon.manager@messmunch.edu',
    role: 'mess_manager',
    mess_id: 'mess-1',
    is_active: true,
    avatar_url: 'https://api.dicebear.com/7.x/bottts/svg?seed=PoojaFalcon',
    created_at: '2026-01-10T08:00:00Z',
  },
  {
    id: 'user-manager-2',
    name: 'Suresh Nair',
    email: 'eagle.manager@messmunch.edu',
    role: 'mess_manager',
    mess_id: 'mess-2',
    is_active: true,
    avatar_url: 'https://api.dicebear.com/7.x/bottts/svg?seed=SureshEagle',
    created_at: '2026-01-10T08:00:00Z',
  },
  {
    id: 'user-finance',
    name: 'Anjali Deshmukh',
    email: 'finance@messmunch.edu',
    role: 'finance_staff',
    is_active: true,
    avatar_url: 'https://api.dicebear.com/7.x/bottts/svg?seed=AnjaliFinance',
    created_at: '2026-01-10T08:00:00Z',
  },
  {
    id: 'user-vendor',
    name: 'Kisan Agro Representative',
    email: 'vendor@kisanagro.in',
    role: 'vendor',
    is_active: true,
    avatar_url: 'https://api.dicebear.com/7.x/bottts/svg?seed=VendorRep',
    created_at: '2026-01-10T08:00:00Z',
  },
];

export const INITIAL_VENDORS: Vendor[] = [
  {
    id: 'ven-1',
    name: 'Kisan Agro Traders',
    contact_phone: '+91 98450 12345',
    contact_email: 'sales@kisanagro.in',
    category: 'Grains & Pulses',
    tax_id: '29ABCDE1234F1Z5',
    is_active: true,
    rating: 4.8,
    created_at: '2026-01-10T08:00:00Z',
  },
  {
    id: 'ven-2',
    name: 'Pavitra Dairy Cooperative',
    contact_phone: '+91 98220 54321',
    contact_email: 'supply@pavitradairy.com',
    category: 'Dairy Products',
    tax_id: '27AABCP9876C1Z2',
    is_active: true,
    rating: 4.9,
    created_at: '2026-01-11T08:00:00Z',
  },
  {
    id: 'ven-3',
    name: 'Subhiksha Mandi Wholesale',
    contact_phone: '+91 97401 99887',
    contact_email: 'orders@subhikshamandi.co',
    category: 'Fresh Vegetables & Roots',
    tax_id: '29XYZPA5544B2Z9',
    is_active: true,
    rating: 4.6,
    created_at: '2026-01-12T08:00:00Z',
  },
  {
    id: 'ven-4',
    name: 'Golden Drop Edible Oils Ltd',
    contact_phone: '+91 94480 33221',
    contact_email: 'bulk@goldendrop.in',
    category: 'Oils & Fats',
    tax_id: '29LMNOP3344D1Z8',
    is_active: true,
    rating: 4.5,
    created_at: '2026-01-15T08:00:00Z',
  },
  {
    id: 'ven-5',
    name: 'Malabar Spices & Plantation Co.',
    contact_phone: '+91 98470 66778',
    contact_email: 'contact@malabarspices.org',
    category: 'Spices & Condiments',
    tax_id: '32QWERT7788P1Z3',
    is_active: true,
    rating: 4.9,
    created_at: '2026-01-15T08:00:00Z',
  },
];

// ~30 realistic Indian ration items
export const INITIAL_ITEMS: Item[] = [
  // Grains & Cereals
  { id: 'item-1', name: 'Basmati Rice (A-Grade)', unit: 'kg', category: 'Grains & Cereals', reorder_threshold: 300, shelf_life_days: 180, approx_unit_cost: 65, created_at: '2026-01-10T00:00:00Z' },
  { id: 'item-2', name: 'Sona Masoori Rice', unit: 'kg', category: 'Grains & Cereals', reorder_threshold: 400, shelf_life_days: 180, approx_unit_cost: 48, created_at: '2026-01-10T00:00:00Z' },
  { id: 'item-3', name: 'Chakki Fresh Atta (Whole Wheat)', unit: 'kg', category: 'Grains & Cereals', reorder_threshold: 350, shelf_life_days: 90, approx_unit_cost: 38, created_at: '2026-01-10T00:00:00Z' },
  { id: 'item-4', name: 'Maida (Refined Flour)', unit: 'kg', category: 'Grains & Cereals', reorder_threshold: 80, shelf_life_days: 90, approx_unit_cost: 34, created_at: '2026-01-10T00:00:00Z' },
  { id: 'item-5', name: 'Rawa / Sooji (Semolina)', unit: 'kg', category: 'Grains & Cereals', reorder_threshold: 60, shelf_life_days: 90, approx_unit_cost: 42, created_at: '2026-01-10T00:00:00Z' },
  { id: 'item-6', name: 'Poha (Thick Flattened Rice)', unit: 'kg', category: 'Grains & Cereals', reorder_threshold: 50, shelf_life_days: 120, approx_unit_cost: 45, created_at: '2026-01-10T00:00:00Z' },

  // Pulses & Lentils
  { id: 'item-7', name: 'Toor Dal (Pigeon Peas)', unit: 'kg', category: 'Pulses & Lentils', reorder_threshold: 200, shelf_life_days: 150, approx_unit_cost: 145, created_at: '2026-01-10T00:00:00Z' },
  { id: 'item-8', name: 'Moong Dal (Split Yellow)', unit: 'kg', category: 'Pulses & Lentils', reorder_threshold: 120, shelf_life_days: 150, approx_unit_cost: 115, created_at: '2026-01-10T00:00:00Z' },
  { id: 'item-9', name: 'Chana Dal (Bengal Gram)', unit: 'kg', category: 'Pulses & Lentils', reorder_threshold: 100, shelf_life_days: 150, approx_unit_cost: 85, created_at: '2026-01-10T00:00:00Z' },
  { id: 'item-10', name: 'Kabuli Chana (White Chickpeas)', unit: 'kg', category: 'Pulses & Lentils', reorder_threshold: 80, shelf_life_days: 180, approx_unit_cost: 130, created_at: '2026-01-10T00:00:00Z' },
  { id: 'item-11', name: 'Rajma (Kashmiri Red Kidney Beans)', unit: 'kg', category: 'Pulses & Lentils', reorder_threshold: 90, shelf_life_days: 180, approx_unit_cost: 140, created_at: '2026-01-10T00:00:00Z' },
  { id: 'item-12', name: 'Urad Dal (Split White)', unit: 'kg', category: 'Pulses & Lentils', reorder_threshold: 75, shelf_life_days: 150, approx_unit_cost: 125, created_at: '2026-01-10T00:00:00Z' },

  // Oils & Fats
  { id: 'item-13', name: 'Sunflower Cooking Oil', unit: 'litre', category: 'Oils & Fats', reorder_threshold: 150, shelf_life_days: 180, approx_unit_cost: 125, created_at: '2026-01-10T00:00:00Z' },
  { id: 'item-14', name: 'Mustard Oil (Kachi Ghani)', unit: 'litre', category: 'Oils & Fats', reorder_threshold: 60, shelf_life_days: 210, approx_unit_cost: 140, created_at: '2026-01-10T00:00:00Z' },
  { id: 'item-15', name: 'Pure Desi Ghee', unit: 'kg', category: 'Oils & Fats', reorder_threshold: 40, shelf_life_days: 180, approx_unit_cost: 580, created_at: '2026-01-10T00:00:00Z' },

  // Vegetables
  { id: 'item-16', name: 'Pahadi Potatoes (Aloo)', unit: 'kg', category: 'Vegetables', reorder_threshold: 250, shelf_life_days: 20, approx_unit_cost: 25, created_at: '2026-01-10T00:00:00Z' },
  { id: 'item-17', name: 'Nasik Red Onions (Pyaaz)', unit: 'kg', category: 'Vegetables', reorder_threshold: 220, shelf_life_days: 25, approx_unit_cost: 32, created_at: '2026-01-10T00:00:00Z' },
  { id: 'item-18', name: 'Fresh Tomatoes (Tamatar)', unit: 'kg', category: 'Vegetables', reorder_threshold: 120, shelf_life_days: 7, approx_unit_cost: 28, created_at: '2026-01-10T00:00:00Z' },
  { id: 'item-19', name: 'Green Chillies (Hari Mirch)', unit: 'kg', category: 'Vegetables', reorder_threshold: 15, shelf_life_days: 10, approx_unit_cost: 50, created_at: '2026-01-10T00:00:00Z' },
  { id: 'item-20', name: 'Fresh Ginger (Adrak)', unit: 'kg', category: 'Vegetables', reorder_threshold: 20, shelf_life_days: 20, approx_unit_cost: 95, created_at: '2026-01-10T00:00:00Z' },
  { id: 'item-21', name: 'Garlic Bulbs (Lahsun)', unit: 'kg', category: 'Vegetables', reorder_threshold: 25, shelf_life_days: 35, approx_unit_cost: 160, created_at: '2026-01-10T00:00:00Z' },

  // Dairy
  { id: 'item-22', name: 'Fresh Paneer (Cottage Cheese)', unit: 'kg', category: 'Dairy', reorder_threshold: 60, shelf_life_days: 4, approx_unit_cost: 340, created_at: '2026-01-10T00:00:00Z' },
  { id: 'item-23', name: 'Pasteurized Toned Milk', unit: 'litre', category: 'Dairy', reorder_threshold: 200, shelf_life_days: 3, approx_unit_cost: 56, created_at: '2026-01-10T00:00:00Z' },
  { id: 'item-24', name: 'Fresh Plain Curd (Dahi)', unit: 'kg', category: 'Dairy', reorder_threshold: 80, shelf_life_days: 4, approx_unit_cost: 65, created_at: '2026-01-10T00:00:00Z' },

  // Spices & Condiments
  { id: 'item-25', name: 'Tata Iodized Salt', unit: 'kg', category: 'Spices & Condiments', reorder_threshold: 100, shelf_life_days: 365, approx_unit_cost: 24, created_at: '2026-01-10T00:00:00Z' },
  { id: 'item-26', name: 'Refined White Sugar', unit: 'kg', category: 'Spices & Condiments', reorder_threshold: 150, shelf_life_days: 365, approx_unit_cost: 42, created_at: '2026-01-10T00:00:00Z' },
  { id: 'item-27', name: 'Turmeric Powder (Haldi)', unit: 'kg', category: 'Spices & Condiments', reorder_threshold: 20, shelf_life_days: 240, approx_unit_cost: 190, created_at: '2026-01-10T00:00:00Z' },
  { id: 'item-28', name: 'Red Chilli Powder (Kashmiri Lal)', unit: 'kg', category: 'Spices & Condiments', reorder_threshold: 25, shelf_life_days: 240, approx_unit_cost: 260, created_at: '2026-01-10T00:00:00Z' },
  { id: 'item-29', name: 'Coriander Powder (Dhaniya)', unit: 'kg', category: 'Spices & Condiments', reorder_threshold: 30, shelf_life_days: 200, approx_unit_cost: 175, created_at: '2026-01-10T00:00:00Z' },
  { id: 'item-30', name: 'Whole Cumin Seeds (Jeera)', unit: 'kg', category: 'Spices & Condiments', reorder_threshold: 15, shelf_life_days: 300, approx_unit_cost: 320, created_at: '2026-01-10T00:00:00Z' },
  { id: 'item-31', name: 'Assam CTC Tea Dust', unit: 'kg', category: 'Beverages', reorder_threshold: 40, shelf_life_days: 240, approx_unit_cost: 290, created_at: '2026-01-10T00:00:00Z' },
];

export const INITIAL_POS: PurchaseOrder[] = [
  {
    id: 'po-101',
    vendor_id: 'ven-1',
    status: 'closed',
    created_by: 'user-storekeeper',
    created_at: '2026-09-15T09:30:00Z',
    closed_at: '2026-09-18T14:20:00Z',
    lines: [
      { id: 'pol-1', po_id: 'po-101', item_id: 'item-1', ordered_qty: 600, received_qty: 600, unit_price: 64 },
      { id: 'pol-2', po_id: 'po-101', item_id: 'item-3', ordered_qty: 500, received_qty: 500, unit_price: 37 },
      { id: 'pol-3', po_id: 'po-101', item_id: 'item-7', ordered_qty: 300, received_qty: 300, unit_price: 142 },
    ],
  },
  {
    id: 'po-102',
    vendor_id: 'ven-4',
    status: 'partially_received',
    created_by: 'user-storekeeper',
    created_at: '2026-10-05T10:00:00Z',
    closed_at: null,
    lines: [
      { id: 'pol-4', po_id: 'po-102', item_id: 'item-13', ordered_qty: 300, received_qty: 180, unit_price: 122 },
      { id: 'pol-5', po_id: 'po-102', item_id: 'item-14', ordered_qty: 100, received_qty: 100, unit_price: 138 },
      { id: 'pol-6', po_id: 'po-102', item_id: 'item-15', ordered_qty: 60, received_qty: 30, unit_price: 575 },
    ],
  },
  {
    id: 'po-103',
    vendor_id: 'ven-2',
    status: 'open',
    created_by: 'user-admin',
    created_at: '2026-10-11T11:15:00Z',
    closed_at: null,
    lines: [
      { id: 'pol-7', po_id: 'po-103', item_id: 'item-22', ordered_qty: 90, received_qty: 0, unit_price: 335 },
      { id: 'pol-8', po_id: 'po-103', item_id: 'item-23', ordered_qty: 350, received_qty: 0, unit_price: 55 },
      { id: 'pol-9', po_id: 'po-103', item_id: 'item-24', ordered_qty: 120, received_qty: 0, unit_price: 64 },
    ],
  },
  {
    id: 'po-104',
    vendor_id: 'ven-3',
    status: 'open',
    created_by: 'user-storekeeper',
    created_at: '2026-10-12T14:45:00Z',
    closed_at: null,
    lines: [
      { id: 'pol-10', po_id: 'po-104', item_id: 'item-16', ordered_qty: 400, received_qty: 0, unit_price: 24 },
      { id: 'pol-11', po_id: 'po-104', item_id: 'item-17', ordered_qty: 350, received_qty: 0, unit_price: 31 },
      { id: 'pol-12', po_id: 'po-104', item_id: 'item-18', ordered_qty: 150, received_qty: 0, unit_price: 27 },
    ],
  },
];

// Seed stock transactions ledger
export const INITIAL_TRANSACTIONS: StockTransaction[] = [
  // Bulk receipts from PO 101
  { id: 'tx-1', type: 'receipt', item_id: 'item-1', quantity: 600, source: 'vendor', destination: 'central_store', po_id: 'po-101', created_by: 'user-storekeeper', created_at: '2026-09-18T14:20:00Z' },
  { id: 'tx-2', type: 'receipt', item_id: 'item-3', quantity: 500, source: 'vendor', destination: 'central_store', po_id: 'po-101', created_by: 'user-storekeeper', created_at: '2026-09-18T14:22:00Z' },
  { id: 'tx-3', type: 'receipt', item_id: 'item-7', quantity: 300, source: 'vendor', destination: 'central_store', po_id: 'po-101', created_by: 'user-storekeeper', created_at: '2026-09-18T14:25:00Z' },

  // Partial receipts from PO 102
  { id: 'tx-4', type: 'receipt', item_id: 'item-13', quantity: 180, source: 'vendor', destination: 'central_store', po_id: 'po-102', created_by: 'user-storekeeper', created_at: '2026-10-06T11:00:00Z' },
  { id: 'tx-5', type: 'receipt', item_id: 'item-14', quantity: 100, source: 'vendor', destination: 'central_store', po_id: 'po-102', created_by: 'user-storekeeper', created_at: '2026-10-06T11:05:00Z' },
  { id: 'tx-6', type: 'receipt', item_id: 'item-15', quantity: 30, source: 'vendor', destination: 'central_store', po_id: 'po-102', created_by: 'user-storekeeper', created_at: '2026-10-06T11:10:00Z' },

  // Vegetable and Dairy baseline receipts
  { id: 'tx-7', type: 'receipt', item_id: 'item-16', quantity: 450, source: 'vendor', destination: 'central_store', po_id: null, created_by: 'user-storekeeper', created_at: '2026-10-08T07:30:00Z' },
  { id: 'tx-8', type: 'receipt', item_id: 'item-17', quantity: 400, source: 'vendor', destination: 'central_store', po_id: null, created_by: 'user-storekeeper', created_at: '2026-10-08T07:35:00Z' },
  { id: 'tx-9', type: 'receipt', item_id: 'item-18', quantity: 180, source: 'vendor', destination: 'central_store', po_id: null, created_by: 'user-storekeeper', created_at: '2026-10-10T08:00:00Z' },
  { id: 'tx-10', type: 'receipt', item_id: 'item-22', quantity: 55, source: 'vendor', destination: 'central_store', po_id: null, created_by: 'user-storekeeper', created_at: '2026-10-11T07:00:00Z' }, // Low Paneer
  { id: 'tx-11', type: 'receipt', item_id: 'item-23', quantity: 280, source: 'vendor', destination: 'central_store', po_id: null, created_by: 'user-storekeeper', created_at: '2026-10-12T06:30:00Z' },
  { id: 'tx-12', type: 'receipt', item_id: 'item-24', quantity: 70, source: 'vendor', destination: 'central_store', po_id: null, created_by: 'user-storekeeper', created_at: '2026-10-12T06:45:00Z' },

  // Spices receipts
  { id: 'tx-13', type: 'receipt', item_id: 'item-25', quantity: 150, source: 'vendor', destination: 'central_store', created_by: 'user-storekeeper', created_at: '2026-09-20T10:00:00Z' },
  { id: 'tx-14', type: 'receipt', item_id: 'item-26', quantity: 200, source: 'vendor', destination: 'central_store', created_by: 'user-storekeeper', created_at: '2026-09-20T10:10:00Z' },
  { id: 'tx-15', type: 'receipt', item_id: 'item-27', quantity: 40, source: 'vendor', destination: 'central_store', created_by: 'user-storekeeper', created_at: '2026-09-20T10:15:00Z' },
  { id: 'tx-16', type: 'receipt', item_id: 'item-31', quantity: 60, source: 'vendor', destination: 'central_store', created_by: 'user-storekeeper', created_at: '2026-09-20T10:20:00Z' },

  // Issues to Falcon Mess (mess-1)
  { id: 'tx-17', type: 'issue', item_id: 'item-1', quantity: 220, source: 'central_store', destination: 'mess', mess_id: 'mess-1', created_by: 'user-storekeeper', created_at: '2026-10-09T09:00:00Z' },
  { id: 'tx-18', type: 'issue', item_id: 'item-3', quantity: 180, source: 'central_store', destination: 'mess', mess_id: 'mess-1', created_by: 'user-storekeeper', created_at: '2026-10-09T09:05:00Z' },
  { id: 'tx-19', type: 'issue', item_id: 'item-7', quantity: 110, source: 'central_store', destination: 'mess', mess_id: 'mess-1', created_by: 'user-storekeeper', created_at: '2026-10-09T09:10:00Z' },
  { id: 'tx-20', type: 'issue', item_id: 'item-13', quantity: 45, source: 'central_store', destination: 'mess', mess_id: 'mess-1', created_by: 'user-storekeeper', created_at: '2026-10-09T09:15:00Z' },
  { id: 'tx-21', type: 'issue', item_id: 'item-16', quantity: 140, source: 'central_store', destination: 'mess', mess_id: 'mess-1', created_by: 'user-storekeeper', created_at: '2026-10-10T08:30:00Z' },
  { id: 'tx-22', type: 'issue', item_id: 'item-22', quantity: 20, source: 'central_store', destination: 'mess', mess_id: 'mess-1', created_by: 'user-storekeeper', created_at: '2026-10-12T07:30:00Z' },
  { id: 'tx-23', type: 'issue', item_id: 'item-23', quantity: 90, source: 'central_store', destination: 'mess', mess_id: 'mess-1', created_by: 'user-storekeeper', created_at: '2026-10-12T07:35:00Z' },

  // Issues to Eagle Mess (mess-2)
  { id: 'tx-24', type: 'issue', item_id: 'item-1', quantity: 180, source: 'central_store', destination: 'mess', mess_id: 'mess-2', created_by: 'user-storekeeper', created_at: '2026-10-09T10:00:00Z' },
  { id: 'tx-25', type: 'issue', item_id: 'item-3', quantity: 150, source: 'central_store', destination: 'mess', mess_id: 'mess-2', created_by: 'user-storekeeper', created_at: '2026-10-09T10:05:00Z' },
  { id: 'tx-26', type: 'issue', item_id: 'item-7', quantity: 90, source: 'central_store', destination: 'mess', mess_id: 'mess-2', created_by: 'user-storekeeper', created_at: '2026-10-09T10:10:00Z' },
  { id: 'tx-27', type: 'issue', item_id: 'item-13', quantity: 40, source: 'central_store', destination: 'mess', mess_id: 'mess-2', created_by: 'user-storekeeper', created_at: '2026-10-09T10:15:00Z' },

  // Adjustments (Damaged sacks / Spoilage)
  { id: 'tx-28', type: 'adjustment', item_id: 'item-18', quantity: 8, source: 'central_store', destination: 'waste', reason_code: 'spoilage', created_by: 'user-storekeeper', created_at: '2026-10-11T16:00:00Z' },
  { id: 'tx-29', type: 'adjustment', item_id: 'item-3', quantity: 5, source: 'central_store', destination: 'waste', reason_code: 'damage', created_by: 'user-storekeeper', created_at: '2026-10-07T12:00:00Z' },
];

export const INITIAL_CONSUMPTION: ConsumptionRecord[] = [
  // Falcon Mess yesterday
  { id: 'con-1', mess_id: 'mess-1', item_id: 'item-1', date: '2026-10-12', quantity_used: 48, headcount: 412, recorded_by: 'user-manager-1', created_at: '2026-10-12T20:30:00Z' },
  { id: 'con-2', mess_id: 'mess-1', item_id: 'item-3', date: '2026-10-12', quantity_used: 35, headcount: 412, recorded_by: 'user-manager-1', created_at: '2026-10-12T20:30:00Z' },
  { id: 'con-3', mess_id: 'mess-1', item_id: 'item-7', date: '2026-10-12', quantity_used: 24, headcount: 412, recorded_by: 'user-manager-1', created_at: '2026-10-12T20:30:00Z' },
  { id: 'con-4', mess_id: 'mess-1', item_id: 'item-13', date: '2026-10-12', quantity_used: 9.5, headcount: 412, recorded_by: 'user-manager-1', created_at: '2026-10-12T20:30:00Z' },
  { id: 'con-5', mess_id: 'mess-1', item_id: 'item-16', date: '2026-10-12', quantity_used: 30, headcount: 412, recorded_by: 'user-manager-1', created_at: '2026-10-12T20:30:00Z' },
  { id: 'con-6', mess_id: 'mess-1', item_id: 'item-23', date: '2026-10-12', quantity_used: 45, headcount: 412, recorded_by: 'user-manager-1', created_at: '2026-10-12T20:30:00Z' },

  // Eagle Mess yesterday
  { id: 'con-7', mess_id: 'mess-2', item_id: 'item-1', date: '2026-10-12', quantity_used: 42, headcount: 355, recorded_by: 'user-manager-2', created_at: '2026-10-12T21:00:00Z' },
  { id: 'con-8', mess_id: 'mess-2', item_id: 'item-7', date: '2026-10-12', quantity_used: 20, headcount: 355, recorded_by: 'user-manager-2', created_at: '2026-10-12T21:00:00Z' },
];

export const INITIAL_BUDGETS: Budget[] = [
  {
    id: 'bud-1',
    mess_id: 'mess-1',
    period_start: '2026-10-01',
    period_end: '2026-10-31',
    allocated_amount: 350000,
    created_by: 'user-finance',
    created_at: '2026-09-28T10:00:00Z',
  },
  {
    id: 'bud-2',
    mess_id: 'mess-2',
    period_start: '2026-10-01',
    period_end: '2026-10-31',
    allocated_amount: 290000,
    created_by: 'user-finance',
    created_at: '2026-09-28T10:00:00Z',
  },
  {
    id: 'bud-3',
    mess_id: 'mess-3',
    period_start: '2026-10-01',
    period_end: '2026-10-31',
    allocated_amount: 140000,
    created_by: 'user-finance',
    created_at: '2026-09-28T10:00:00Z',
  },
];

export const INITIAL_EXPENDITURES: Expenditure[] = [
  {
    id: 'exp-1',
    po_id: 'po-101',
    vendor_id: 'ven-1',
    amount: 99500,
    date: '2026-09-22',
    recorded_by: 'user-finance',
    created_at: '2026-09-22T11:30:00Z',
  },
  {
    id: 'exp-2',
    po_id: 'po-102',
    vendor_id: 'ven-4',
    amount: 52950,
    date: '2026-10-08',
    recorded_by: 'user-finance',
    created_at: '2026-10-08T15:00:00Z',
  },
];

export const INITIAL_FORECASTS: ForecastRecord[] = [
  {
    id: 'fc-1',
    mess_id: 'mess-1',
    item_id: 'item-1',
    period_start: '2026-10-14',
    period_end: '2026-10-21',
    predicted_qty: 340,
    method: 'seasonal_arima',
    confidence: 0.94,
    historical_trend: [310, 325, 330, 315, 345, 335, 350, 340],
    generated_at: '2026-10-13T06:00:00Z',
  },
  {
    id: 'fc-2',
    mess_id: 'mess-1',
    item_id: 'item-7',
    period_start: '2026-10-14',
    period_end: '2026-10-21',
    predicted_qty: 165,
    method: 'exponential_smoothing',
    confidence: 0.89,
    historical_trend: [150, 155, 160, 158, 162, 170, 168, 165],
    generated_at: '2026-10-13T06:00:00Z',
  },
  {
    id: 'fc-3',
    mess_id: 'mess-1',
    item_id: 'item-13',
    period_start: '2026-10-14',
    period_end: '2026-10-21',
    predicted_qty: 70,
    method: 'moving_average',
    confidence: 0.82,
    historical_trend: [65, 68, 72, 69, 74, 71, 75, 70],
    generated_at: '2026-10-13T06:00:00Z',
  },
  {
    id: 'fc-4',
    mess_id: 'mess-2',
    item_id: 'item-1',
    period_start: '2026-10-14',
    period_end: '2026-10-21',
    predicted_qty: 290,
    method: 'seasonal_arima',
    confidence: 0.91,
    historical_trend: [270, 280, 275, 290, 285, 295, 288, 290],
    generated_at: '2026-10-13T06:00:00Z',
  },
];

export const INITIAL_MENUS: Menu[] = [
  {
    id: 'menu-1',
    mess_id: 'mess-1',
    date: '2026-10-13',
    meal: 'Breakfast',
    items: [
      { name: 'Idli & Medu Vada', category: 'Main' },
      { name: 'Hot Sambar & Coconut Chutney', category: 'Side' },
      { name: 'Masala Filter Coffee', category: 'Beverage' },
    ],
    created_by: 'user-manager-1',
  },
  {
    id: 'menu-2',
    mess_id: 'mess-1',
    date: '2026-10-13',
    meal: 'Lunch',
    items: [
      { name: 'Jeera Rice & Tawa Roti', category: 'Staple' },
      { name: 'Paneer Butter Masala', category: 'Gravy' },
      { name: 'Yellow Dal Tadka & Cucumber Salad', category: 'Side' },
      { name: 'Cold Sweet Lassi', category: 'Dessert' },
    ],
    created_by: 'user-manager-1',
  },
];

export const INITIAL_FEEDBACK: Feedback[] = [
  {
    id: 'fb-1',
    mess_id: 'mess-1',
    menu_id: 'menu-1',
    submitted_by: 'Student Rep (Aryan K.)',
    rating: 5,
    comment: 'Breakfast idlis were super soft and sambar was piping hot!',
    created_at: '2026-10-13T09:15:00Z',
  },
  {
    id: 'fb-2',
    mess_id: 'mess-1',
    menu_id: 'menu-2',
    submitted_by: 'Mess Committee (Sneha)',
    rating: 4,
    comment: 'Paneer gravy had great aroma, please ensure more salads are served on time.',
    created_at: '2026-10-13T13:45:00Z',
  },
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'aud-1',
    actor_id: 'user-admin',
    actor_name: 'Rajesh Sharma',
    actor_role: 'administrator',
    action: 'INITIALIZE_SYSTEM',
    entity_type: 'SYSTEM',
    entity_id: 'SYS-ROOT',
    before_value: null,
    after_value: { status: 'INITIALIZED', messes_count: 3, items_count: 31 },
    created_at: '2026-09-01T00:00:00Z',
  },
  {
    id: 'aud-2',
    actor_id: 'user-storekeeper',
    actor_name: 'Gopal Krishnan',
    actor_role: 'store_keeper',
    action: 'RECEIVE_DELIVERY',
    entity_type: 'PURCHASE_ORDER',
    entity_id: 'po-101',
    before_value: { status: 'open', received_qty: 0 },
    after_value: { status: 'closed', received_lines: 3, all_fulfilled: true },
    created_at: '2026-09-18T14:26:00Z',
  },
  {
    id: 'aud-3',
    actor_id: 'user-finance',
    actor_name: 'Anjali Deshmukh',
    actor_role: 'finance_staff',
    action: 'RECORD_EXPENDITURE',
    entity_type: 'EXPENDITURE',
    entity_id: 'exp-1',
    before_value: null,
    after_value: { po_id: 'po-101', vendor: 'Kisan Agro Traders', amount: 99500 },
    created_at: '2026-09-22T11:32:00Z',
  },
  {
    id: 'aud-4',
    actor_id: 'user-storekeeper',
    actor_name: 'Gopal Krishnan',
    actor_role: 'store_keeper',
    action: 'ISSUE_TO_MESS',
    entity_type: 'STOCK_TRANSACTION',
    entity_id: 'tx-17',
    before_value: { central_stock_rice: 600, mess_stock_rice: 0 },
    after_value: { central_stock_rice: 380, mess_stock_rice: 220, mess_id: 'mess-1' },
    created_at: '2026-10-09T09:02:00Z',
  },
  {
    id: 'aud-5',
    actor_id: 'user-manager-1',
    actor_name: 'Pooja Verma',
    actor_role: 'mess_manager',
    action: 'RECORD_DAILY_CONSUMPTION',
    entity_type: 'CONSUMPTION_RECORD',
    entity_id: 'con-1',
    before_value: null,
    after_value: { date: '2026-10-12', headcount: 412, items_logged: 6 },
    created_at: '2026-10-12T20:31:00Z',
  },
];
