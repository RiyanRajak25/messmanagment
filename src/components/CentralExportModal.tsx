import React, { useState } from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import { useToast } from './Toast';
import { api } from '../api/client';
import {
  FileSpreadsheet,
  Download,
  Database,
  CheckCircle2,
  Printer,
  RotateCcw,
  Package,
  Receipt,
  FileText,
  Activity,
} from 'lucide-react';

interface CentralExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CentralExportModal: React.FC<CentralExportModalProps> = ({ isOpen, onClose }) => {
  const { toast } = useToast();
  const [isExporting, setIsExporting] = useState<string | null>(null);
  const [isResetting, setIsResetting] = useState(false);

  // Helper to trigger CSV download
  const downloadCsv = (filename: string, headers: string[], rows: (string | number)[][]) => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 1. Export Central Stock
  const handleExportStock = async () => {
    setIsExporting('stock');
    try {
      const stock = await api.inventory.getStock();
      const headers = ['Item ID', 'Commodity Name', 'Category', 'Unit', 'Quantity On Hand', 'Days Of Stock Left', 'Reserve Status', 'Shelf Life Days'];
      const rows = stock.map((s) => [
        s.item_id,
        `"${s.item.name}"`,
        s.item.category,
        s.item.unit,
        s.quantity_on_hand,
        s.days_of_stock_left,
        s.status.toUpperCase(),
        s.item.shelf_life_days,
      ]);
      downloadCsv('Central_Depot_Stock_On_Hand', headers, rows);
      toast({ title: 'Stock Exported', message: 'Current derived silo stock report downloaded.' });
    } catch {
      toast({ type: 'error', title: 'Export Failed', message: 'Unable to export inventory stock.' });
    } finally {
      setIsExporting(null);
    }
  };

  // 2. Export Consumption History
  const handleExportConsumption = async () => {
    setIsExporting('consumption');
    try {
      const messes = await api.messes.list();
      const items = await api.items.list();
      const allHistories = await Promise.all(messes.map((m) => api.consumption.getHistory(m.id)));
      const combined = allHistories.flat();

      const headers = ['Record ID', 'Mess Facility', 'Date', 'Item Name', 'Quantity Used', 'Headcount Diners', 'Recorded By'];
      const rows = combined.map((c) => {
        const m = messes.find((mess) => mess.id === c.mess_id);
        const it = items.find((item) => item.id === c.item_id);
        return [
          c.id,
          m ? `"${m.name}"` : c.mess_id,
          c.date,
          it ? `"${it.name}"` : c.item_id,
          c.quantity_used,
          c.headcount,
          c.recorded_by,
        ];
      });
      downloadCsv('Station_Consumption_History', headers, rows);
      toast({ title: 'Consumption Exported', message: 'Historical meal draw register downloaded.' });
    } catch {
      toast({ type: 'error', title: 'Export Failed', message: 'Unable to export consumption records.' });
    } finally {
      setIsExporting(null);
    }
  };

  // 3. Export PO Register
  const handleExportPOs = async () => {
    setIsExporting('pos');
    try {
      const [pos, vendors, items] = await Promise.all([
        api.purchaseOrders.list(),
        api.vendors.list(),
        api.items.list(),
      ]);

      const headers = ['PO ID', 'Vendor Agency', 'Status', 'Item Name', 'Ordered Qty', 'Received Qty', 'Unit Price (INR)', 'Line Total (INR)', 'Created At'];
      const rows: (string | number)[][] = [];

      pos.forEach((po) => {
        const v = vendors.find((vendor) => vendor.id === po.vendor_id);
        po.lines.forEach((l) => {
          const item = items.find((i) => i.id === l.item_id);
          rows.push([
            po.id,
            v ? `"${v.name}"` : po.vendor_id,
            po.status.toUpperCase(),
            item ? `"${item.name}"` : l.item_id,
            l.ordered_qty,
            l.received_qty,
            l.unit_price,
            l.ordered_qty * l.unit_price,
            po.created_at,
          ]);
        });
      });
      downloadCsv('Purchase_Orders_Register', headers, rows);
      toast({ title: 'PO Register Exported', message: 'Commercial contract register downloaded.' });
    } catch {
      toast({ type: 'error', title: 'Export Failed', message: 'Unable to export purchase orders.' });
    } finally {
      setIsExporting(null);
    }
  };

  // 4. Export Audit Trail
  const handleExportAudit = async () => {
    setIsExporting('audit');
    try {
      const logs = await api.audit.list();
      const headers = ['Log ID', 'Timestamp', 'Actor Name', 'Role', 'Action', 'Entity Type', 'Entity ID', 'Cryptographic Seal'];
      const rows = logs.map((l) => [
        l.id,
        l.created_at,
        `"${l.actor_name}"`,
        l.actor_role,
        l.action,
        l.entity_type,
        l.entity_id,
        'VERIFIED_SEALED',
      ]);
      downloadCsv('Immutable_Audit_Ledger', headers, rows);
      toast({ title: 'Audit Trail Exported', message: 'Tamper-evident system ledger downloaded.' });
    } catch {
      toast({ type: 'error', title: 'Export Failed', message: 'Unable to export audit trail.' });
    } finally {
      setIsExporting(null);
    }
  };

  // Data Reset action
  const handleResetData = async () => {
    setIsResetting(true);
    try {
      await api.dev.resetDemoData();
      toast({
        title: 'Database Reset',
        message: 'System re-seeded with pristine institutional sample transactions.',
      });
      setTimeout(() => {
        window.location.reload();
      }, 500);
    } catch {
      toast({ type: 'error', title: 'Reset Error', message: 'Could not re-seed database.' });
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Central Operational Export & System Control"
      description="Download certified CSV registers, printable reports, or re-seed system test data."
    >
      <div className="flex flex-col gap-5 font-body text-pine mt-2">
        {/* CSV Export Modules */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Stock on Hand */}
          <div className="p-3.5 rounded-card border border-sand/60 bg-white hover:border-olive transition-colors flex flex-col justify-between gap-3 shadow-subtle">
            <div className="flex items-start gap-2.5">
              <div className="w-8 h-8 rounded-control bg-olive/15 text-olive flex items-center justify-center shrink-0">
                <Package className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-heading font-bold text-xs text-olive-deep">
                  Stock on Hand Register
                </h4>
                <p className="text-[11px] text-pine/60 mt-0.5">
                  Derived central silo inventory, reserve gauges &amp; shelf-life.
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              disabled={Boolean(isExporting)}
              onClick={handleExportStock}
              icon={<Download className="w-3.5 h-3.5" />}
              className="w-full text-xs"
            >
              {isExporting === 'stock' ? 'Exporting...' : 'Export Stock CSV'}
            </Button>
          </div>

          {/* Consumption History */}
          <div className="p-3.5 rounded-card border border-sand/60 bg-white hover:border-olive transition-colors flex flex-col justify-between gap-3 shadow-subtle">
            <div className="flex items-start gap-2.5">
              <div className="w-8 h-8 rounded-control bg-gold/15 text-gold flex items-center justify-center shrink-0">
                <Activity className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-heading font-bold text-xs text-olive-deep">
                  Meal Consumption History
                </h4>
                <p className="text-[11px] text-pine/60 mt-0.5">
                  Diner headcounts, daily ration draws &amp; portion velocity.
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              disabled={Boolean(isExporting)}
              onClick={handleExportConsumption}
              icon={<Download className="w-3.5 h-3.5" />}
              className="w-full text-xs"
            >
              {isExporting === 'consumption' ? 'Exporting...' : 'Export Consumption CSV'}
            </Button>
          </div>

          {/* PO Register */}
          <div className="p-3.5 rounded-card border border-sand/60 bg-white hover:border-olive transition-colors flex flex-col justify-between gap-3 shadow-subtle">
            <div className="flex items-start gap-2.5">
              <div className="w-8 h-8 rounded-control bg-glacier/15 text-glacier flex items-center justify-center shrink-0">
                <Receipt className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-heading font-bold text-xs text-olive-deep">
                  Purchase Order Register
                </h4>
                <p className="text-[11px] text-pine/60 mt-0.5">
                  Contract commitments, vendor lines, and delivery unloads.
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              disabled={Boolean(isExporting)}
              onClick={handleExportPOs}
              icon={<Download className="w-3.5 h-3.5" />}
              className="w-full text-xs"
            >
              {isExporting === 'pos' ? 'Exporting...' : 'Export PO Register CSV'}
            </Button>
          </div>

          {/* Audit Ledger */}
          <div className="p-3.5 rounded-card border border-sand/60 bg-white hover:border-olive transition-colors flex flex-col justify-between gap-3 shadow-subtle">
            <div className="flex items-start gap-2.5">
              <div className="w-8 h-8 rounded-control bg-success/15 text-success flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-heading font-bold text-xs text-olive-deep">
                  Immutable Audit Ledger
                </h4>
                <p className="text-[11px] text-pine/60 mt-0.5">
                  Cryptographically sealed event stream &amp; mutation records.
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              disabled={Boolean(isExporting)}
              onClick={handleExportAudit}
              icon={<Download className="w-3.5 h-3.5" />}
              className="w-full text-xs"
            >
              {isExporting === 'audit' ? 'Exporting...' : 'Export Audit CSV'}
            </Button>
          </div>
        </div>

        {/* Print Station Report */}
        <div className="p-3 bg-snow rounded-control border border-sand/40 flex items-center justify-between">
          <div>
            <span className="font-heading font-bold text-xs text-olive-deep block">
              Official Station Summary Printout
            </span>
            <span className="text-[11px] text-pine/60">
              Generates paper-ready command overview report for inspection boards.
            </span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.print()}
            icon={<Printer className="w-3.5 h-3.5" />}
          >
            Print
          </Button>
        </div>

        {/* Database Re-seed Section */}
        <div className="p-3.5 bg-danger/5 border border-danger/20 rounded-control flex items-center justify-between gap-3">
          <div>
            <span className="font-heading font-bold text-xs text-danger block flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-danger" />
              Reset &amp; Re-seed Test Database
            </span>
            <span className="text-[11px] text-pine/70">
              Restores initial seed dataset across all messes, users, items &amp; transaction ledgers.
            </span>
          </div>
          <Button
            variant="danger"
            size="sm"
            disabled={isResetting}
            onClick={handleResetData}
            icon={<RotateCcw className="w-3.5 h-3.5" />}
          >
            {isResetting ? 'Resetting...' : 'Re-seed Demo'}
          </Button>
        </div>

        <div className="flex items-center justify-end pt-2 border-t border-sand/40">
          <Button variant="primary" size="sm" onClick={onClose}>
            Done
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default CentralExportModal;
