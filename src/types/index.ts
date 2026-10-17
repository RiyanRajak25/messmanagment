// Database Schema & Domain Types per PRD §5 & Master Prompt

export type UserRole = 'administrator' | 'store_keeper' | 'mess_manager' | 'finance_staff' | 'vendor';

export interface Mess {
  id: string;
  name: string;
  location: string;
  headcount_capacity: number;
  created_at: string;
}

export interface AppUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  mess_id?: string | null;
  is_active: boolean;
  avatar_url?: string;
  created_at: string;
}

export interface Vendor {
  id: string;
  name: string;
  contact_phone: string;
  contact_email: string;
  category: string;
  tax_id: string;
  is_active: boolean;
  rating?: number;
  created_at: string;
}

export type ItemUnit = 'kg' | 'litre' | 'piece' | 'packet';

export type ItemCategory = 'Grains & Cereals' | 'Pulses & Lentils' | 'Oils & Fats' | 'Vegetables' | 'Dairy' | 'Spices & Condiments' | 'Beverages';

export interface Item {
  id: string;
  name: string;
  unit: ItemUnit;
  category: ItemCategory;
  reorder_threshold: number;
  shelf_life_days: number;
  approx_unit_cost: number; // in INR
  created_at: string;
}

export type POStatus = 'open' | 'partially_received' | 'closed' | 'cancelled';

export interface PurchaseOrderLine {
  id: string;
  po_id: string;
  item_id: string;
  ordered_qty: number;
  received_qty: number;
  unit_price: number;
}

export interface PurchaseOrder {
  id: string;
  vendor_id: string;
  status: POStatus;
  lines: PurchaseOrderLine[];
  created_by: string;
  created_at: string;
  closed_at?: string | null;
}

export type TransactionType = 'receipt' | 'issue' | 'adjustment' | 'return';
export type AdjustmentReasonCode = 'wastage' | 'damage' | 'count_correction' | 'spoilage';

export interface StockTransaction {
  id: string;
  type: TransactionType;
  item_id: string;
  quantity: number; // positive number
  source: 'vendor' | 'central_store' | 'mess';
  destination: 'central_store' | 'mess' | 'waste' | 'vendor_return';
  mess_id?: string | null;
  po_id?: string | null;
  reason_code?: AdjustmentReasonCode | null;
  created_by: string;
  created_at: string;
}

export interface ConsumptionRecord {
  id: string;
  mess_id: string;
  item_id: string;
  date: string; // YYYY-MM-DD
  quantity_used: number;
  headcount: number;
  recorded_by: string;
  created_at: string;
}

export interface Budget {
  id: string;
  mess_id: string;
  period_start: string;
  period_end: string;
  allocated_amount: number;
  created_by: string;
  created_at: string;
}

export interface Expenditure {
  id: string;
  po_id: string;
  vendor_id: string;
  amount: number;
  date: string;
  recorded_by: string;
  created_at: string;
}

export interface ForecastRecord {
  id: string;
  mess_id: string;
  item_id: string;
  period_start: string;
  period_end: string;
  predicted_qty: number;
  method: 'moving_average' | 'exponential_smoothing' | 'seasonal_arima';
  confidence: number; // 0 to 1 (e.g. 0.88 = 88%)
  historical_trend: number[]; // last 8 weeks sparkline
  generated_at: string;
}

export interface MenuItem {
  name: string;
  category: string;
}

export interface Menu {
  id: string;
  mess_id: string;
  date: string;
  meal: 'Breakfast' | 'Lunch' | 'Snacks' | 'Dinner';
  items: MenuItem[];
  created_by: string;
}

export interface Feedback {
  id: string;
  mess_id: string;
  menu_id?: string | null;
  submitted_by: string;
  rating: number; // 1 to 5
  comment: string;
  created_at: string;
}

export interface AuditLog {
  id: string;
  actor_id: string;
  actor_name: string;
  actor_role: UserRole;
  action: string;
  entity_type: string;
  entity_id: string;
  before_value: Record<string, unknown> | null;
  after_value: Record<string, unknown> | null;
  created_at: string;
}

// Derived Stock View (Derived from stock_transaction ledger)
export interface DerivedStock {
  item_id: string;
  item: Item;
  quantity_on_hand: number;
  days_of_stock_left: number;
  status: 'fresh' | 'adequate' | 'low' | 'expiring';
  last_received_at?: string;
  earliest_expiry_at?: string;
}

// Auth Session State
export interface AuthSession {
  user: AppUser;
  token: string;
  role: UserRole;
  mess_id?: string | null;
}
