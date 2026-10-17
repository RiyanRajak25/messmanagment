import { http, HttpResponse, delay } from 'msw';
import { StorageEngine } from './storage';
import {
  UserRole,
  PurchaseOrder,
  StockTransaction,
  ConsumptionRecord,
  Budget,
  Expenditure,
  Item,
  Vendor,
  AppUser,
} from '../types';

// Helper to simulate realistic latency (200-500ms)
const simulateLatency = async () => {
  await delay(Math.floor(Math.random() * 200) + 200);
};

// Extract user from fake auth header
function getAuthActor(request: Request): { id: string; name: string; role: UserRole; mess_id?: string | null } {
  const authHeader = request.headers.get('Authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    try {
      const token = authHeader.replace('Bearer ', '');
      const decoded = JSON.parse(atob(token));
      return {
        id: decoded.id || 'user-unknown',
        name: decoded.name || 'Anonymous User',
        role: decoded.role || 'mess_manager',
        mess_id: decoded.mess_id,
      };
    } catch {
      // Fallback
    }
  }
  return {
    id: 'user-admin',
    name: 'Rajesh Sharma',
    role: 'administrator',
  };
}

export const handlers = [
  // 1. Auth Login (Mock JWT)
  http.post('/api/auth/login', async ({ request }) => {
    await simulateLatency();
    const body = (await request.json()) as { email: string; role?: UserRole };
    const db = StorageEngine.getData();

    const user = db.users.find((u) => u.email === body.email || (body.role && u.role === body.role));
    if (!user) {
      return HttpResponse.json({ error: 'Invalid credentials or inactive user' }, { status: 401 });
    }

    // Create base64 JWT-shaped payload
    const payload = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      mess_id: user.mess_id || null,
      exp: Math.floor(Date.now() / 1000) + 3600 * 8,
    };
    const token = btoa(JSON.stringify(payload));

    return HttpResponse.json({
      user,
      token,
      role: user.role,
      mess_id: user.mess_id || null,
    });
  }),

  // Dev: Reset Demo Data
  http.post('/api/dev/reset', async ({ request }) => {
    await simulateLatency();
    const actor = getAuthActor(request);
    StorageEngine.reset();
    StorageEngine.logAudit(actor, 'RESET_DEMO_DATA', 'SYSTEM', 'ALL', null, { status: 'RESET_SUCCESS' });
    return HttpResponse.json({ message: 'Demo data reset successfully' });
  }),

  // 2. Messes
  http.get('/api/messes', async () => {
    await simulateLatency();
    const db = StorageEngine.getData();
    return HttpResponse.json(db.messes);
  }),

  // 3. Central Stock (Derived)
  http.get('/api/inventory/stock', async () => {
    await simulateLatency();
    const stock = StorageEngine.getCentralStock();
    return HttpResponse.json(stock);
  }),

  // Expiring inventory
  http.get('/api/inventory/expiring', async () => {
    await simulateLatency();
    const stock = StorageEngine.getCentralStock();
    const expiring = stock.filter((s) => s.status === 'expiring' || s.item.shelf_life_days <= 10);
    return HttpResponse.json(expiring);
  }),

  // Stock Transaction Ledger
  http.get('/api/inventory/transactions', async () => {
    await simulateLatency();
    const db = StorageEngine.getData();
    return HttpResponse.json(db.stockTransactions);
  }),

  // 4. Stock Adjustments (Store Keeper)
  http.post('/api/inventory/adjustments', async ({ request }) => {
    await simulateLatency();
    const actor = getAuthActor(request);
    if (actor.role !== 'store_keeper' && actor.role !== 'administrator') {
      return HttpResponse.json({ error: 'Permission denied: Only Store Keeper or Admin can adjust stock' }, { status: 403 });
    }

    const body = (await request.json()) as {
      item_id: string;
      quantity: number;
      reason_code: 'wastage' | 'damage' | 'count_correction' | 'spoilage';
    };

    if (!body.reason_code) {
      return HttpResponse.json({ error: 'Reason code is strictly required for adjustments' }, { status: 400 });
    }

    const db = StorageEngine.getData();
    const item = db.items.find((i) => i.id === body.item_id);
    if (!item) {
      return HttpResponse.json({ error: 'Item not found' }, { status: 404 });
    }

    // Verify sufficient stock in central store
    const stockList = StorageEngine.getCentralStock();
    const currentStock = stockList.find((s) => s.item_id === body.item_id)?.quantity_on_hand || 0;
    if (body.quantity > currentStock) {
      return HttpResponse.json(
        { error: `Insufficient stock in Central Store! Available: ${currentStock} ${item.unit}, Attempted: ${body.quantity} ${item.unit}` },
        { status: 400 }
      );
    }

    const newTx: StockTransaction = {
      id: `tx-${Date.now()}`,
      type: 'adjustment',
      item_id: body.item_id,
      quantity: body.quantity,
      source: 'central_store',
      destination: 'waste',
      reason_code: body.reason_code,
      created_by: actor.id,
      created_at: new Date().toISOString(),
    };

    db.stockTransactions.unshift(newTx);
    StorageEngine.logAudit(actor, 'STOCK_ADJUSTMENT', 'STOCK_TRANSACTION', newTx.id, { before_stock: currentStock }, { adjusted_qty: body.quantity, reason: body.reason_code });

    return HttpResponse.json({ transaction: newTx, message: 'Stock adjustment recorded in ledger and audit trail' });
  }),

  // 5. Issue Stock to Mess (Store Keeper)
  http.post('/api/distribution/issue', async ({ request }) => {
    await simulateLatency();
    const actor = getAuthActor(request);
    if (actor.role !== 'store_keeper' && actor.role !== 'administrator') {
      return HttpResponse.json({ error: 'Permission denied' }, { status: 403 });
    }

    const body = (await request.json()) as {
      mess_id: string;
      items: { item_id: string; quantity: number }[];
    };

    const db = StorageEngine.getData();
    const mess = db.messes.find((m) => m.id === body.mess_id);
    if (!mess) {
      return HttpResponse.json({ error: 'Mess not found' }, { status: 404 });
    }

    const centralStock = StorageEngine.getCentralStock();

    // Check each line for sufficient stock first
    for (const line of body.items) {
      const stock = centralStock.find((s) => s.item_id === line.item_id);
      const available = stock?.quantity_on_hand || 0;
      if (line.quantity > available) {
        const itemObj = db.items.find((i) => i.id === line.item_id);
        return HttpResponse.json(
          {
            error: `Insufficient stock for ${itemObj?.name || 'item'}! Available: ${available} ${itemObj?.unit || ''}, Requested: ${line.quantity} ${itemObj?.unit || ''}`,
          },
          { status: 400 }
        );
      }
    }

    const createdTxs: StockTransaction[] = [];
    for (const line of body.items) {
      const tx: StockTransaction = {
        id: `tx-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        type: 'issue',
        item_id: line.item_id,
        quantity: line.quantity,
        source: 'central_store',
        destination: 'mess',
        mess_id: body.mess_id,
        created_by: actor.id,
        created_at: new Date().toISOString(),
      };
      db.stockTransactions.unshift(tx);
      createdTxs.push(tx);
    }

    StorageEngine.logAudit(
      actor,
      'ISSUE_TO_MESS',
      'DISTRIBUTION',
      body.mess_id,
      null,
      { mess_name: mess.name, items_count: body.items.length, items: body.items }
    );

    return HttpResponse.json({ transactions: createdTxs, message: `Ration successfully dispatched to ${mess.name}` });
  }),

  // 6. Mess Stock (Mess Manager - own mess only)
  http.get('/api/messes/:id/stock', async ({ params, request }) => {
    await simulateLatency();
    const actor = getAuthActor(request);
    const messId = params.id as string;

    // Row-level guard: Mess Manager can only access own mess
    if (actor.role === 'mess_manager' && actor.mess_id !== messId) {
      return HttpResponse.json({ error: 'Forbidden: You cannot view inventory of another mess hall.' }, { status: 403 });
    }

    const stock = StorageEngine.getMessStock(messId);
    return HttpResponse.json(stock);
  }),

  // 7. Consumption Record (Mess Manager)
  http.post('/api/consumption', async ({ request }) => {
    await simulateLatency();
    const actor = getAuthActor(request);
    if (actor.role !== 'mess_manager' && actor.role !== 'administrator') {
      return HttpResponse.json({ error: 'Permission denied' }, { status: 403 });
    }

    const body = (await request.json()) as {
      mess_id: string;
      date: string;
      headcount: number;
      entries: { item_id: string; quantity_used: number }[];
    };

    // If mess manager, ensure mess_id matches token
    if (actor.role === 'mess_manager' && actor.mess_id !== body.mess_id) {
      return HttpResponse.json({ error: 'Forbidden: Cannot log consumption for another mess' }, { status: 403 });
    }

    const db = StorageEngine.getData();

    // Check duplicate entry for same date and mess
    const existing = db.consumptionRecords.filter((c) => c.mess_id === body.mess_id && c.date === body.date);
    if (existing.length > 0) {
      // Remove previous entries for that date to support edit today's entry
      db.consumptionRecords = db.consumptionRecords.filter((c) => !(c.mess_id === body.mess_id && c.date === body.date));
    }

    const createdRecords: ConsumptionRecord[] = [];
    for (const entry of body.entries) {
      if (entry.quantity_used > 0) {
        const rec: ConsumptionRecord = {
          id: `con-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          mess_id: body.mess_id,
          item_id: entry.item_id,
          date: body.date,
          quantity_used: entry.quantity_used,
          headcount: body.headcount,
          recorded_by: actor.id,
          created_at: new Date().toISOString(),
        };
        db.consumptionRecords.unshift(rec);
        createdRecords.push(rec);
      }
    }

    StorageEngine.logAudit(
      actor,
      'LOG_DAILY_CONSUMPTION',
      'CONSUMPTION',
      body.mess_id,
      existing.length > 0 ? { status: 'OVERWRITTEN_PREVIOUS', previous_count: existing.length } : null,
      { date: body.date, headcount: body.headcount, items_logged: createdRecords.length }
    );

    return HttpResponse.json({ records: createdRecords, message: 'Daily meal consumption successfully logged in audit trail' });
  }),

  // Consumption History
  http.get('/api/consumption/:messId/history', async ({ params, request }) => {
    await simulateLatency();
    const actor = getAuthActor(request);
    const messId = params.messId as string;

    if (actor.role === 'mess_manager' && actor.mess_id !== messId) {
      return HttpResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const db = StorageEngine.getData();
    const history = db.consumptionRecords.filter((c) => c.mess_id === messId);
    return HttpResponse.json(history);
  }),

  // 8. Vendors & Procurement
  http.get('/api/vendors', async () => {
    await simulateLatency();
    const db = StorageEngine.getData();
    return HttpResponse.json(db.vendors);
  }),

  http.post('/api/vendors', async ({ request }) => {
    await simulateLatency();
    const actor = getAuthActor(request);
    if (actor.role !== 'administrator') {
      return HttpResponse.json({ error: 'Only Administrator can add vendors' }, { status: 403 });
    }

    const body = (await request.json()) as Omit<Vendor, 'id' | 'created_at'>;
    const db = StorageEngine.getData();
    const newVendor: Vendor = {
      ...body,
      id: `ven-${Date.now()}`,
      created_at: new Date().toISOString(),
    };
    db.vendors.push(newVendor);
    StorageEngine.logAudit(actor, 'CREATE_VENDOR', 'VENDOR', newVendor.id, null, newVendor as unknown as Record<string, unknown>);
    return HttpResponse.json(newVendor);
  }),

  // 9. Items Catalog
  http.get('/api/items', async () => {
    await simulateLatency();
    const db = StorageEngine.getData();
    return HttpResponse.json(db.items);
  }),

  // 10. Purchase Orders
  http.get('/api/purchase-orders', async () => {
    await simulateLatency();
    const db = StorageEngine.getData();
    return HttpResponse.json(db.purchaseOrders);
  }),

  http.get('/api/purchase-orders/:id', async ({ params }) => {
    await simulateLatency();
    const db = StorageEngine.getData();
    const po = db.purchaseOrders.find((p) => p.id === params.id);
    if (!po) return HttpResponse.json({ error: 'PO not found' }, { status: 404 });
    return HttpResponse.json(po);
  }),

  http.post('/api/purchase-orders', async ({ request }) => {
    await simulateLatency();
    const actor = getAuthActor(request);
    if (actor.role !== 'store_keeper' && actor.role !== 'administrator') {
      return HttpResponse.json({ error: 'Permission denied' }, { status: 403 });
    }

    const body = (await request.json()) as {
      vendor_id: string;
      lines: { item_id: string; ordered_qty: number; unit_price: number }[];
    };

    const db = StorageEngine.getData();
    const poId = `po-${100 + db.purchaseOrders.length + 1}`;
    const newPO: PurchaseOrder = {
      id: poId,
      vendor_id: body.vendor_id,
      status: 'open',
      created_by: actor.id,
      created_at: new Date().toISOString(),
      closed_at: null,
      lines: body.lines.map((l, idx) => ({
        id: `pol-${Date.now()}-${idx}`,
        po_id: poId,
        item_id: l.item_id,
        ordered_qty: l.ordered_qty,
        received_qty: 0,
        unit_price: l.unit_price,
      })),
    };

    db.purchaseOrders.unshift(newPO);
    StorageEngine.logAudit(actor, 'CREATE_PURCHASE_ORDER', 'PURCHASE_ORDER', newPO.id, null, {
      vendor_id: body.vendor_id,
      lines_count: body.lines.length,
    });

    return HttpResponse.json(newPO);
  }),

  // Receive Delivery against PO (Store Keeper)
  http.patch('/api/purchase-orders/:id/receive', async ({ params, request }) => {
    await simulateLatency();
    const actor = getAuthActor(request);
    if (actor.role !== 'store_keeper' && actor.role !== 'administrator') {
      return HttpResponse.json({ error: 'Permission denied' }, { status: 403 });
    }

    const body = (await request.json()) as {
      deliveries: { line_id: string; received_qty: number }[];
    };

    const db = StorageEngine.getData();
    const po = db.purchaseOrders.find((p) => p.id === params.id);
    if (!po) {
      return HttpResponse.json({ error: 'Purchase Order not found' }, { status: 404 });
    }

    const beforeState = JSON.parse(JSON.stringify(po));

    for (const del of body.deliveries) {
      const line = po.lines.find((l) => l.id === del.line_id);
      if (line && del.received_qty > 0) {
        line.received_qty += del.received_qty;

        // Write to append-only stock transaction ledger!
        const tx: StockTransaction = {
          id: `tx-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          type: 'receipt',
          item_id: line.item_id,
          quantity: del.received_qty,
          source: 'vendor',
          destination: 'central_store',
          po_id: po.id,
          created_by: actor.id,
          created_at: new Date().toISOString(),
        };
        db.stockTransactions.unshift(tx);
      }
    }

    // Check if all lines are fully fulfilled
    const allFulfilled = po.lines.every((l) => l.received_qty >= l.ordered_qty);
    const anyReceived = po.lines.some((l) => l.received_qty > 0);

    if (allFulfilled) {
      po.status = 'closed';
      po.closed_at = new Date().toISOString();
    } else if (anyReceived) {
      po.status = 'partially_received';
    }

    StorageEngine.logAudit(actor, 'RECEIVE_PO_DELIVERY', 'PURCHASE_ORDER', po.id, beforeState, {
      status: po.status,
      deliveries: body.deliveries,
    });

    return HttpResponse.json({ po, message: 'Stock delivery received and logged in audit ledger ✓' });
  }),

  // 11. Budgets & Finance
  http.get('/api/budgets', async () => {
    await simulateLatency();
    const db = StorageEngine.getData();
    return HttpResponse.json(db.budgets);
  }),

  http.post('/api/budgets', async ({ request }) => {
    await simulateLatency();
    const actor = getAuthActor(request);
    if (actor.role !== 'finance_staff' && actor.role !== 'administrator') {
      return HttpResponse.json({ error: 'Permission denied' }, { status: 403 });
    }

    const body = (await request.json()) as Omit<Budget, 'id' | 'created_at'>;
    const db = StorageEngine.getData();
    const newBudget: Budget = {
      ...body,
      id: `bud-${Date.now()}`,
      created_at: new Date().toISOString(),
    };
    db.budgets.push(newBudget);
    StorageEngine.logAudit(actor, 'CREATE_BUDGET', 'BUDGET', newBudget.id, null, newBudget as unknown as Record<string, unknown>);
    return HttpResponse.json(newBudget);
  }),

  http.get('/api/expenditures', async () => {
    await simulateLatency();
    const db = StorageEngine.getData();
    return HttpResponse.json(db.expenditures);
  }),

  http.post('/api/expenditures', async ({ request }) => {
    await simulateLatency();
    const actor = getAuthActor(request);
    if (actor.role !== 'finance_staff' && actor.role !== 'administrator') {
      return HttpResponse.json({ error: 'Permission denied' }, { status: 403 });
    }

    const body = (await request.json()) as Omit<Expenditure, 'id' | 'created_at'>;
    const db = StorageEngine.getData();
    const newExp: Expenditure = {
      ...body,
      id: `exp-${Date.now()}`,
      created_at: new Date().toISOString(),
    };
    db.expenditures.push(newExp);
    StorageEngine.logAudit(actor, 'RECORD_EXPENDITURE', 'EXPENDITURE', newExp.id, null, newExp as unknown as Record<string, unknown>);
    return HttpResponse.json(newExp);
  }),

  // 12. Forecasts
  http.get('/api/forecasts', async () => {
    await simulateLatency();
    const db = StorageEngine.getData();
    return HttpResponse.json(db.forecasts);
  }),

  http.get('/api/forecast/:messId/:itemId', async ({ params }) => {
    await simulateLatency();
    const db = StorageEngine.getData();
    const fc = db.forecasts.find((f) => f.mess_id === params.messId && f.item_id === params.itemId);
    return HttpResponse.json(fc || null);
  }),

  // 13. Audit Log (Admin & Finance read-only)
  http.get('/api/reports/audit-log', async ({ request }) => {
    await simulateLatency();
    const actor = getAuthActor(request);
    if (actor.role !== 'administrator' && actor.role !== 'finance_staff') {
      return HttpResponse.json({ error: 'Permission denied: Audit log is restricted' }, { status: 403 });
    }

    const db = StorageEngine.getData();
    return HttpResponse.json(db.auditLogs);
  }),

  // 14. Users Management
  http.get('/api/users', async () => {
    await simulateLatency();
    const db = StorageEngine.getData();
    return HttpResponse.json(db.users);
  }),

  // 15. Menu & Feedback
  http.get('/api/menu', async () => {
    await simulateLatency();
    const db = StorageEngine.getData();
    return HttpResponse.json(db.menus);
  }),

  http.post('/api/menu', async ({ request }) => {
    await simulateLatency();
    const actor = getAuthActor(request);
    const body = (await request.json()) as any;
    const db = StorageEngine.getData();
    // Replace existing menu for that mess and date if exists
    db.menus = db.menus.filter((m) => !(m.mess_id === body.mess_id && m.date === body.date && m.meal === body.meal));
    const newMenu = {
      ...body,
      id: `menu-${Date.now()}`,
      created_by: actor.id,
    };
    db.menus.unshift(newMenu);
    StorageEngine.logAudit(actor, 'UPDATE_MENU', 'MENU', newMenu.id, null, newMenu);
    return HttpResponse.json(newMenu);
  }),

  http.get('/api/feedback', async () => {
    await simulateLatency();
    const db = StorageEngine.getData();
    return HttpResponse.json(db.feedback);
  }),

  http.post('/api/feedback', async ({ request }) => {
    await simulateLatency();
    const body = (await request.json()) as any;
    const db = StorageEngine.getData();
    const newFeedback = {
      ...body,
      id: `fb-${Date.now()}`,
      created_at: new Date().toISOString(),
    };
    db.feedback.unshift(newFeedback);
    return HttpResponse.json(newFeedback);
  }),
];
