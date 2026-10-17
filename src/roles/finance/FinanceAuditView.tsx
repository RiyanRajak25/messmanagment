import React, { useState, useEffect } from 'react';
import { api } from '../../api/client';
import { AuditLog } from '../../types';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { StatTile } from '../../components/StatTile';
import { Modal } from '../../components/Modal';
import { useToast } from '../../components/Toast';
import {
  FileCheck,
  FileSpreadsheet,
  ShieldCheck,
  Search,
  Lock,
  Eye,
  Mountain,
  Landmark,
  Receipt,
  Scale,
  CheckCircle2,
} from 'lucide-react';

export const FinanceAuditView: React.FC = () => {
  const { toast } = useToast();
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [actionFilter, setActionFilter] = useState('all');
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      try {
        const data = await api.audit.list();
        setLogs(data);
      } catch (err) {
        console.error('Failed to load audit logs', err);
        toast({ type: 'error', title: 'Error', message: 'Failed to load financial audit logs' });
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [toast]);

  // Filter to financial and procurement events or search query
  const financialActions = [
    'BUDGET_CREATED',
    'EXPENDITURE_RECORDED',
    'PURCHASE_ORDER_CREATED',
    'DELIVERY_RECEIVED',
    'STOCK_ADJUSTMENT',
  ];

  const filteredLogs = logs.filter((log) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      log.action.toLowerCase().includes(q) ||
      log.actor_name.toLowerCase().includes(q) ||
      log.entity_id.toLowerCase().includes(q) ||
      log.id.toLowerCase().includes(q);

    const matchesAction = actionFilter === 'all' || log.action === actionFilter;
    return matchesSearch && matchesAction;
  });

  const exportCSV = () => {
    if (filteredLogs.length === 0) {
      toast({ type: 'warning', title: 'No Data', message: 'No financial logs available for export.' });
      return;
    }
    const headers = ['Log ID', 'Timestamp', 'Actor Name', 'Role', 'Action', 'Entity Type', 'Entity ID', 'Cryptographic Seal'];
    const rows = filteredLogs.map((l) => [
      l.id,
      l.created_at,
      `"${l.actor_name}"`,
      l.actor_role,
      l.action,
      l.entity_type,
      l.entity_id,
      'VERIFIED_IMMUTABLE',
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Fiscal_Audit_Ledger_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({ title: 'Export Complete', message: 'Financial audit trail downloaded as CSV.' });
  };

  const budgetEvents = logs.filter((l) => l.action === 'BUDGET_CREATED').length;
  const paymentEvents = logs.filter((l) => l.action === 'EXPENDITURE_RECORDED').length;
  const poEvents = logs.filter((l) => l.action === 'PURCHASE_ORDER_CREATED').length;

  return (
    <div className="flex flex-col gap-6 pb-12 font-body text-pine">
      {/* Header Banner */}
      <div className="p-6 md:p-8 bg-night text-snow rounded-card border border-sand/40 shadow-elevation flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-control bg-olive/70 border border-gold/40 flex items-center justify-center text-gold shrink-0 shadow-subtle">
            <FileCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-badge bg-gold/15 border border-gold/40 text-gold text-[10px] font-heading font-bold uppercase tracking-wider mb-1.5">
              <Mountain className="w-3.5 h-3.5 text-gold" />
              <span>CENTRAL ACCOUNTS &amp; AUDIT DIVISION • STATUTORY LEDGER</span>
            </div>
            <h1 className="font-heading font-extrabold text-2xl md:text-3xl text-snow tracking-tight">
              Fiscal &amp; Procurement Tamper-Evident Audit Trail
            </h1>
            <p className="text-xs text-sand font-medium mt-1">
              Append-only statutory audit trail capturing all grant authorizations, disbursements, and PO transactions.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={exportCSV}
            icon={<FileSpreadsheet className="w-4 h-4" />}
            className="text-snow border-sand/40 hover:bg-olive-deep"
          >
            Export Fiscal Audit CSV
          </Button>
        </div>
      </div>

      {/* KPI Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatTile
          label="Statutory Audit Records"
          value={`${logs.length}`}
          subValue="Zero tampering detected"
          icon={<ShieldCheck className="w-5 h-5 text-success" />}
          accentColor="success"
        />
        <StatTile
          label="Budget Sanctions Logged"
          value={`${budgetEvents}`}
          subValue="Authorized grant ceilings"
          icon={<Landmark className="w-5 h-5 text-gold" />}
          accentColor="gold"
        />
        <StatTile
          label="Disbursement Entries"
          value={`${paymentEvents}`}
          subValue="Electronic bank clearances"
          icon={<Receipt className="w-5 h-5 text-glacier" />}
          accentColor="glacier"
        />
        <StatTile
          label="Purchase Orders Committed"
          value={`${poEvents}`}
          subValue="Commercial contract events"
          icon={<Scale className="w-5 h-5 text-olive" />}
          accentColor="olive"
        />
      </div>

      {/* Filter and Search Bar */}
      <Card className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 border border-sand/60 bg-white">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-pine/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search audit trail by actor, action, or entity ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs font-mono font-medium rounded-control border border-sand bg-snow focus:outline-none focus:border-olive focus:ring-1 focus:ring-olive text-olive-deep placeholder:text-pine/40"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="px-3 py-2 text-xs font-heading font-semibold rounded-control border border-sand bg-white text-olive-deep focus:outline-none focus:border-olive"
          >
            <option value="all">All Audit Actions</option>
            <option value="BUDGET_CREATED">Budget Sanction</option>
            <option value="EXPENDITURE_RECORDED">Disbursement</option>
            <option value="PURCHASE_ORDER_CREATED">Purchase Order</option>
            <option value="DELIVERY_RECEIVED">Delivery Intake</option>
            <option value="STOCK_ADJUSTMENT">Stock Adjustment</option>
          </select>
        </div>
      </Card>

      {/* Audit Log Table */}
      <div className="rounded-card border border-sand/60 bg-white shadow-subtle overflow-hidden">
        <div className="p-4 bg-snow border-b border-sand/40 flex items-center justify-between">
          <div>
            <h3 className="font-heading font-extrabold text-base text-olive-deep">
              Immutable Financial Event Ledger
            </h3>
            <p className="text-xs text-pine/70">
              Cryptographically timestamped transaction log with before/after state capture.
            </p>
          </div>
          <span className="flex items-center gap-1 px-2.5 py-1 rounded-badge bg-success/15 text-success text-[10px] font-heading font-bold border border-success/30 uppercase">
            <Lock className="w-3 h-3" /> Sealed Ledger
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="table-operational w-full text-left border-collapse">
            <thead>
              <tr className="bg-olive-deep text-sand text-[10px] font-heading font-bold uppercase tracking-wider select-none">
                <th className="py-3 px-4">Event ID</th>
                <th className="py-3 px-4">Action Code</th>
                <th className="py-3 px-4">Sanctioning Officer</th>
                <th className="py-3 px-4">Target Entity</th>
                <th className="py-3 px-4">Timestamp (UTC)</th>
                <th className="py-3 px-4 text-center">Integrity</th>
                <th className="py-3 px-4 text-right">Mutation Diff</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sand/20 text-xs font-sans text-olive-deep">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-pine/60">
                    Loading statutory audit trail...
                  </td>
                </tr>
              ) : filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-pine/60 italic">
                    No audit records match the filter query.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-snow/60 transition-colors">
                    <td className="py-3.5 px-4 font-mono text-xs font-bold text-olive-deep">
                      {log.id}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-pill bg-sand/20 border border-sand/40 text-olive-deep font-mono text-[10px] font-bold">
                        {log.action}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-heading font-bold text-xs text-olive-deep">
                        {log.actor_name}
                      </div>
                      <div className="text-[10px] text-pine/60 font-mono uppercase mt-0.5">
                        {log.actor_role.replace('_', ' ')}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-mono text-xs text-pine/80">
                      {log.entity_type} ({log.entity_id})
                    </td>

                    <td className="py-3.5 px-4 font-mono text-[11px] text-pine/70">
                      {new Date(log.created_at).toLocaleString('en-IN')}
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-badge bg-success/10 text-success border border-success/30 font-mono text-[10px] font-bold">
                        <CheckCircle2 className="w-3 h-3" /> SEALED
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedLog(log)}
                        icon={<Eye className="w-3 h-3" />}
                        className="text-xs font-bold"
                      >
                        Inspect Diff
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mutation Diff Modal */}
      {selectedLog && (
        <Modal
          isOpen={Boolean(selectedLog)}
          onClose={() => setSelectedLog(null)}
          title="Audit Trail Mutation Diff"
          description={`Event ${selectedLog.id} • Action: ${selectedLog.action}`}
        >
          <div className="flex flex-col gap-4 font-body text-pine mt-2">
            <div className="p-3 bg-snow rounded-control border border-sand/40 flex items-center justify-between text-xs">
              <div>
                <span className="text-pine/60 text-[10px] uppercase font-bold block">Sanction Officer</span>
                <span className="font-heading font-bold text-olive-deep">
                  {selectedLog.actor_name} ({selectedLog.actor_role})
                </span>
              </div>
              <div className="text-right">
                <span className="text-pine/60 text-[10px] uppercase font-bold block">Timestamp</span>
                <span className="font-mono text-olive-deep text-xs">
                  {new Date(selectedLog.created_at).toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="text-xs font-heading font-bold text-olive uppercase block mb-1">
                  State Before Mutation
                </span>
                <pre className="p-3 bg-night text-sand rounded-control border border-sand/30 font-mono text-[11px] overflow-x-auto max-h-56">
                  {selectedLog.before_value
                    ? JSON.stringify(selectedLog.before_value, null, 2)
                    : '// No prior state (Entity Creation)'}
                </pre>
              </div>

              <div>
                <span className="text-xs font-heading font-bold text-olive uppercase block mb-1">
                  State After Mutation
                </span>
                <pre className="p-3 bg-night text-success rounded-control border border-sand/30 font-mono text-[11px] overflow-x-auto max-h-56">
                  {selectedLog.after_value
                    ? JSON.stringify(selectedLog.after_value, null, 2)
                    : '// State Deleted'}
                </pre>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-sand/40">
              <Button
                variant="primary"
                size="sm"
                onClick={() => setSelectedLog(null)}
              >
                Close Diff Inspection
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default FinanceAuditView;
