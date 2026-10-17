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
  DerivedStock,
  UserRole,
} from '../types';
import {
  INITIAL_MESSES,
  INITIAL_USERS,
  INITIAL_VENDORS,
  INITIAL_ITEMS,
  INITIAL_POS,
  INITIAL_TRANSACTIONS,
  INITIAL_CONSUMPTION,
  INITIAL_BUDGETS,
  INITIAL_EXPENDITURES,
  INITIAL_FORECASTS,
  INITIAL_MENUS,
  INITIAL_FEEDBACK,
  INITIAL_AUDIT_LOGS,
} from './seedData';

const STORAGE_KEY = 'messmunch_db_v1';

interface StorageSchema {
  messes: Mess[];
  users: AppUser[];
  vendors: Vendor[];
  items: Item[];
  purchaseOrders: PurchaseOrder[];
  stockTransactions: StockTransaction[];
  consumptionRecords: ConsumptionRecord[];
  budgets: Budget[];
  expenditures: Expenditure[];
  forecasts: ForecastRecord[];
  menus: Menu[];
  feedback: Feedback[];
  auditLogs: AuditLog[];
}

function loadFromStorage(): StorageSchema {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Failed to load storage, resetting to defaults', e);
  }
  return resetStorage();
}

export function saveStorage(data: StorageSchema) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save to localStorage', e);
  }
}

export function resetStorage(): StorageSchema {
  const fresh: StorageSchema = {
    messes: [...INITIAL_MESSES],
    users: [...INITIAL_USERS],
    vendors: [...INITIAL_VENDORS],
    items: [...INITIAL_ITEMS],
    purchaseOrders: JSON.parse(JSON.stringify(INITIAL_POS)),
    stockTransactions: [...INITIAL_TRANSACTIONS],
    consumptionRecords: [...INITIAL_CONSUMPTION],
    budgets: [...INITIAL_BUDGETS],
    expenditures: [...INITIAL_EXPENDITURES],
    forecasts: [...INITIAL_FORECASTS],
    menus: [...INITIAL_MENUS],
    feedback: [...INITIAL_FEEDBACK],
    auditLogs: [...INITIAL_AUDIT_LOGS],
  };
  saveStorage(fresh);
  return fresh;
}

let db = loadFromStorage();

export const StorageEngine = {
  reset() {
    db = resetStorage();
    return db;
  },

  getData() {
    return db;
  },

  // Log to append-only Audit Trail
  logAudit(
    actor: { id: string; name: string; role: UserRole },
    action: string,
    entityType: string,
    entityId: string,
    beforeValue: Record<string, unknown> | null,
    afterValue: Record<string, unknown> | null
  ) {
    const newLog: AuditLog = {
      id: `aud-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      actor_id: actor.id,
      actor_name: actor.name,
      actor_role: actor.role,
      action,
      entity_type: entityType,
      entity_id: entityId,
      before_value: beforeValue,
      after_value: afterValue,
      created_at: new Date().toISOString(),
    };
    db.auditLogs.unshift(newLog);
    saveStorage(db);
    return newLog;
  },

  // Derived Central Store Stock calculation from the ledger
  getCentralStock(): DerivedStock[] {
    const items = db.items;
    const txs = db.stockTransactions;

    return items.map((item) => {
      // Stock = (receipts to central_store) - (issues from central_store) - (adjustments from central_store)
      let qty = 0;
      let lastReceived: string | undefined = undefined;

      for (const tx of txs) {
        if (tx.item_id === item.id) {
          if (tx.destination === 'central_store') {
            qty += tx.quantity;
            if (!lastReceived || new Date(tx.created_at) > new Date(lastReceived)) {
              lastReceived = tx.created_at;
            }
          }
          if (tx.source === 'central_store') {
            qty -= tx.quantity;
          }
        }
      }

      // Determine days left roughly based on threshold (or fallback)
      const avgDailyUse = Math.max(1, item.reorder_threshold / 10);
      const daysOfStockLeft = Math.max(0, Math.round(qty / avgDailyUse));

      let status: 'fresh' | 'adequate' | 'low' | 'expiring' = 'fresh';
      if (qty <= item.reorder_threshold * 0.5) {
        status = 'low';
      } else if (qty <= item.reorder_threshold) {
        status = 'adequate';
      }

      // Check shelf life vs receipt
      if (lastReceived) {
        const receivedDate = new Date(lastReceived).getTime();
        const expiryDate = receivedDate + item.shelf_life_days * 24 * 60 * 60 * 1000;
        const daysToExpiry = Math.round((expiryDate - Date.now()) / (24 * 60 * 60 * 1000));
        if (daysToExpiry <= 3) {
          status = 'expiring';
        }
      }

      return {
        item_id: item.id,
        item,
        quantity_on_hand: Math.max(0, Number(qty.toFixed(2))),
        days_of_stock_left: daysOfStockLeft,
        status,
        last_received_at: lastReceived,
      };
    });
  },

  // Derived Mess Stock for a specific mess
  getMessStock(messId: string): DerivedStock[] {
    const items = db.items;
    const txs = db.stockTransactions;
    const consumptions = db.consumptionRecords.filter((c) => c.mess_id === messId);

    return items.map((item) => {
      // Received by mess from central_store
      let received = 0;
      for (const tx of txs) {
        if (tx.item_id === item.id && tx.destination === 'mess' && tx.mess_id === messId) {
          received += tx.quantity;
        }
      }

      // Consumed by mess
      let consumed = 0;
      for (const c of consumptions) {
        if (c.item_id === item.id) {
          consumed += c.quantity_used;
        }
      }

      const qty = Math.max(0, received - consumed);
      const avgDaily = Math.max(1, consumed / Math.max(1, consumptions.length) || 10);
      const daysOfStockLeft = Math.max(0, Math.round(qty / avgDaily));

      let status: 'fresh' | 'adequate' | 'low' | 'expiring' = 'fresh';
      if (qty <= 15) {
        status = 'low';
      } else if (qty <= 40) {
        status = 'adequate';
      }

      return {
        item_id: item.id,
        item,
        quantity_on_hand: Number(qty.toFixed(2)),
        days_of_stock_left: daysOfStockLeft,
        status,
      };
    });
  },
};
