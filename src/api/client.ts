import {
  Mess,
  Vendor,
  Item,
  PurchaseOrder,
  StockTransaction,
  ConsumptionRecord,
  Budget,
  Expenditure,
  ForecastRecord,
  AuditLog,
  DerivedStock,
  AppUser,
  UserRole,
} from '../types';

const API_BASE = '/api';

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem('messmunch_token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      ...getAuthHeaders(),
      ...options.headers,
    },
  });

  if (!response.ok) {
    let errorMsg = `Request failed: ${response.status} ${response.statusText}`;
    try {
      const data = await response.json();
      if (data && data.error) {
        errorMsg = data.error;
      }
    } catch {
      // ignore
    }
    throw new Error(errorMsg);
  }

  return response.json();
}

export const api = {
  // Auth
  auth: {
    login: (email: string, role?: UserRole) =>
      request<{ user: AppUser; token: string; role: UserRole; mess_id?: string | null }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, role }),
      }),
  },

  // Dev
  dev: {
    resetDemoData: () => request<{ message: string }>('/dev/reset', { method: 'POST' }),
  },

  // Messes
  messes: {
    list: () => request<Mess[]>('/messes'),
    getStock: (messId: string) => request<DerivedStock[]>(`/messes/${messId}/stock`),
  },

  // Inventory & Central Store
  inventory: {
    getStock: () => request<DerivedStock[]>('/inventory/stock'),
    getExpiring: () => request<DerivedStock[]>('/inventory/expiring'),
    getTransactions: () => request<StockTransaction[]>('/inventory/transactions'),
    adjust: (data: { item_id: string; quantity: number; reason_code: string }) =>
      request<{ transaction: StockTransaction; message: string }>('/inventory/adjustments', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    issueToMess: (data: { mess_id: string; items: { item_id: string; quantity: number }[] }) =>
      request<{ transactions: StockTransaction[]; message: string }>('/distribution/issue', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
  },

  // Consumption (Mess Manager)
  consumption: {
    submitDaily: (data: { mess_id: string; date: string; headcount: number; entries: { item_id: string; quantity_used: number }[] }) =>
      request<{ records: ConsumptionRecord[]; message: string }>('/consumption', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    getHistory: (messId: string) => request<ConsumptionRecord[]>(`/consumption/${messId}/history`),
  },

  // Vendors & Procurement
  vendors: {
    list: () => request<Vendor[]>('/vendors'),
    create: (data: Omit<Vendor, 'id' | 'created_at'>) =>
      request<Vendor>('/vendors', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
  },

  // Items
  items: {
    list: () => request<Item[]>('/items'),
  },

  // Purchase Orders
  purchaseOrders: {
    list: () => request<PurchaseOrder[]>('/purchase-orders'),
    getById: (id: string) => request<PurchaseOrder>(`/purchase-orders/${id}`),
    create: (data: { vendor_id: string; lines: { item_id: string; ordered_qty: number; unit_price: number }[] }) =>
      request<PurchaseOrder>('/purchase-orders', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    receiveDelivery: (poId: string, deliveries: { line_id: string; received_qty: number }[]) =>
      request<{ po: PurchaseOrder; message: string }>(`/purchase-orders/${poId}/receive`, {
        method: 'PATCH',
        body: JSON.stringify({ deliveries }),
      }),
  },

  // Finance & Budgets
  finance: {
    getBudgets: () => request<Budget[]>('/budgets'),
    createBudget: (data: Omit<Budget, 'id' | 'created_at'>) =>
      request<Budget>('/budgets', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    getExpenditures: () => request<Expenditure[]>('/expenditures'),
    recordExpenditure: (data: Omit<Expenditure, 'id' | 'created_at'>) =>
      request<Expenditure>('/expenditures', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
  },

  // Forecasts
  forecasts: {
    list: () => request<ForecastRecord[]>('/forecasts'),
    getByItem: (messId: string, itemId: string) => request<ForecastRecord | null>(`/forecast/${messId}/${itemId}`),
  },

  // Audit Logs
  audit: {
    list: () => request<AuditLog[]>('/reports/audit-log'),
  },

  // Users
  users: {
    list: () => request<AppUser[]>('/users'),
  },

  // Menu
  menu: {
    list: () => request<any[]>('/menu'),
    update: (data: any) =>
      request<any>('/menu', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
  },

  // Feedback
  feedback: {
    list: () => request<any[]>('/feedback'),
    submit: (data: any) =>
      request<any>('/feedback', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
  },
};

