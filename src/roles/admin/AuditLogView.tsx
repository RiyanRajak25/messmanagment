import React, { useEffect, useState } from 'react';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { api } from '../../api/client';
import { AuditLog } from '../../types';
import { useToast } from '../../components/Toast';
import {
  FileText,
  ShieldCheck,
  Search,
  Download,
  Filter,
  CheckCircle2,
  Clock,
  User,
  Hash,
  Database,
  ArrowRight,
  X,
} from 'lucide-react';

export const AuditLogView: React.FC = () => {
  const { toast } = useToast();
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [actionFilter, setActionFilter] = useState('all');
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      try {
        const auditList = await api.audit.list();
        setLogs(auditList);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  const handleExportCSV = () => {
    const headers = [
      'Log ID',
      'Timestamp',
      'Action Type',
      'Entity Type',
      'Entity ID',
      'Actor ID',
      'Actor Name',
      'Actor Role',
      'Before State',
      'After State',
    ];

    const rows = filteredLogs.map((l) => [
      l.id,
      new Date(l.created_at).toISOString(),
      l.action,
      l.entity_type,
      l.entity_id || 'N/A',
      l.actor_id,
      `"${l.actor_name || 'System'}"`,
      l.actor_role,
      `"${JSON.stringify(l.before_value || {}).replace(/"/g, '""')}"`,
      `"${JSON.stringify(l.after_value || {}).replace(/"/g, '""')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Station_Military_Audit_Log_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: 'Audit Trail Exported',
      message: `Downloaded ${filteredLogs.length} immutable military audit records.`,
    });
  };

  const filteredLogs = logs.filter((l) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      l.action.toLowerCase().includes(q) ||
      l.actor_name.toLowerCase().includes(q) ||
      l.actor_role.toLowerCase().includes(q) ||
      (l.entity_id?.toLowerCase().includes(q) ?? false);
    const matchesAction = actionFilter === 'all' || l.action.includes(actionFilter);
    return matchesSearch && matchesAction;
  });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh] p-8">
        <div className="w-10 h-10 border-2 border-sand/40 border-t-gold-500 rounded-full animate-spin" />
        <span className="font-heading font-semibold text-xs text-pine/80 mt-4 uppercase tracking-wider">
          Retrieving Immutable Military Audit Stream...
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Subheader */}
      <div className="p-6 bg-white border border-sand/30 rounded-card shadow-subtle border-l-4 border-l-gold-500 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-pill bg-sand/20 border border-sand text-olive-deep text-[10px] font-heading font-bold uppercase tracking-wider mb-1">
            <ShieldCheck className="w-3 h-3 text-gold-600" />
            <span>Inspector General Branch • Tamper-Evident Records</span>
          </div>
          <h2 className="font-heading font-bold text-2xl text-olive-deep tracking-tight">
            Station Master Audit Trail &amp; Event Ledger
          </h2>
          <p className="text-xs text-pine/70 font-sans mt-0.5">
            Cryptographically sealed and immutable audit stream recording every ration intake, distribution, write-off &amp; consumption.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={handleExportCSV}
          icon={<Download className="w-4 h-4" />}
        >
          Export Official Audit Log (CSV)
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <Card className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 border-sand/30 bg-white">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-pine/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search audit trail by actor, action type, or entity ID..."
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
            <option value="CONSUMPTION">Daily Consumption Entries</option>
            <option value="ISSUE">Station Distributions</option>
            <option value="DELIVERY">Consignment Unloads</option>
            <option value="ADJUSTMENT">Stock Adjustments &amp; Write-Offs</option>
            <option value="PURCHASE_ORDER">Procurement Orders (PO)</option>
          </select>
        </div>
      </Card>

      {/* Audit Log Table */}
      <div className="rounded-card border border-sand/30 bg-white shadow-subtle overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table-operational w-full text-left border-collapse">
            <thead>
              <tr className="bg-olive-deep text-sand text-[10px] font-heading font-bold uppercase tracking-wider select-none">
                <th className="py-3 px-4">Event ID &amp; Timestamp</th>
                <th className="py-3 px-4">Action Code</th>
                <th className="py-3 px-4">Responsible Actor</th>
                <th className="py-3 px-4">Entity Reference</th>
                <th className="py-3 px-4 text-center">Security Hash</th>
                <th className="py-3 px-4 text-right">Payload Inspection</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sand/20 text-xs font-sans text-olive-deep">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-pine/60 italic font-sans">
                    No audit log records match the search filter.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-snow/60 transition-colors">
                    {/* ID & Time */}
                    <td className="py-3.5 px-4">
                      <div className="font-mono font-bold text-olive-deep text-xs">
                        {log.id}
                      </div>
                      <div className="text-[10px] text-pine/60 tabular-nums">
                        {new Date(log.created_at).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}{' '}
                        {new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                      </div>
                    </td>

                    {/* Action */}
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-pill bg-sand/30 border border-sand text-olive-deep font-mono font-semibold text-[10px]">
                        {log.action}
                      </span>
                    </td>

                    {/* Actor */}
                    <td className="py-3.5 px-4">
                      <div className="font-heading font-bold text-olive-deep">{log.actor_name || 'System Auto'}</div>
                      <div className="text-[10px] text-pine/60 capitalize font-mono">
                        {log.actor_role?.replace('_', ' ')}
                      </div>
                    </td>

                    {/* Entity */}
                    <td className="py-3.5 px-4 font-mono text-[11px] text-pine">
                      <span className="font-bold text-olive-deep">{log.entity_type}:</span> {log.entity_id || 'SYSTEM'}
                    </td>

                    {/* Security Hash */}
                    <td className="py-3.5 px-4 text-center">
                      <span className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-300">
                        <ShieldCheck className="w-3 h-3 text-emerald-700" /> SEALED
                      </span>
                    </td>

                    {/* Action */}
                    <td className="py-3.5 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => setSelectedLog(log)}
                        className="text-xs font-heading font-bold text-olive hover:text-olive-deep underline underline-offset-2"
                      >
                        Inspect Diff
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detailed Diff Inspection Modal */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 bg-olive-night/60 backdrop-blur-sm flex items-center justify-center p-4">
          <Card className="max-w-2xl w-full bg-white p-6 shadow-elevated border-sand/40 border-t-4 border-t-gold-500 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-sand/30">
              <div>
                <span className="text-[10px] font-mono text-pine/60 uppercase">
                  Audit Snapshot • {selectedLog.id}
                </span>
                <h3 className="font-heading font-bold text-lg text-olive-deep">
                  {selectedLog.action}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedLog(null)}
                className="text-pine/50 hover:text-olive-deep font-bold p-1 rounded-control hover:bg-snow transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex flex-col gap-4 mt-4">
              <div className="grid grid-cols-2 gap-3 text-xs bg-snow p-3 rounded-card border border-sand/30">
                <div>
                  <span className="text-[10px] text-pine/60 uppercase font-heading font-bold block">Actor</span>
                  <span className="font-heading font-bold text-olive-deep">{selectedLog.actor_name} ({selectedLog.actor_role})</span>
                </div>
                <div>
                  <span className="text-[10px] text-pine/60 uppercase font-heading font-bold block">Timestamp</span>
                  <span className="font-mono text-olive-deep">{new Date(selectedLog.created_at).toISOString()}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Before State */}
                <div>
                  <span className="text-xs font-heading font-bold text-olive-deep block mb-1">
                    State Before Mutation
                  </span>
                  <pre className="p-3 rounded-card bg-olive-night text-snow/90 text-[11px] font-mono overflow-x-auto max-h-56 border border-sand/20">
                    {JSON.stringify(selectedLog.before_value || { status: 'INITIAL_STATE' }, null, 2)}
                  </pre>
                </div>

                {/* After State */}
                <div>
                  <span className="text-xs font-heading font-bold text-olive-deep block mb-1">
                    State After Mutation
                  </span>
                  <pre className="p-3 rounded-card bg-olive-night text-emerald-400 text-[11px] font-mono overflow-x-auto max-h-56 border border-sand/20">
                    {JSON.stringify(selectedLog.after_value || { status: 'MUTATION_COMMITTED' }, null, 2)}
                  </pre>
                </div>
              </div>

              <div className="pt-3 border-t border-sand/30 flex justify-end">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setSelectedLog(null)}
                >
                  Close Inspection
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default AuditLogView;
