import React, { useEffect, useState } from 'react';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { api } from '../../api/client';
import { StockTransaction, Item, Mess } from '../../types';
import { useToast } from '../../components/Toast';
import { useNavigate } from 'react-router-dom';
import {
  BookOpen,
  ArrowDownLeft,
  ArrowUpRight,
  AlertOctagon,
  Download,
  Search,
  ArrowLeft,
  ShieldCheck,
  Mountain,
} from 'lucide-react';

export const LedgerView: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const [transactions, setTransactions] = useState<StockTransaction[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [messes, setMesses] = useState<Mess[]>([]);
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [itemFilter, setItemFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      try {
        const [txList, itemList, messList] = await Promise.all([
          api.inventory.getTransactions(),
          api.items.list(),
          api.messes.list(),
        ]);
        setTransactions(txList);
        setItems(itemList);
        setMesses(messList);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  const getItem = (itemId: string): Item | undefined => {
    return items.find((i) => i.id === itemId);
  };

  const getMess = (messId?: string | null): Mess | undefined => {
    if (!messId) return undefined;
    return messes.find((m) => m.id === messId);
  };

  const filteredTxs = transactions.filter((tx) => {
    const matchesType = typeFilter === 'all' || tx.type === typeFilter;
    const matchesItem = itemFilter === 'all' || tx.item_id === itemFilter;
    const item = getItem(tx.item_id);
    const mess = getMess(tx.mess_id);
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      tx.id.toLowerCase().includes(q) ||
      (item?.name.toLowerCase().includes(q) ?? false) ||
      (mess?.name.toLowerCase().includes(q) ?? false) ||
      (tx.reason_code?.toLowerCase().includes(q) ?? false);
    return matchesType && matchesItem && matchesSearch;
  });

  const totalReceipts = transactions.filter((t) => t.type === 'receipt').length;
  const totalIssues = transactions.filter((t) => t.type === 'issue').length;
  const totalAdjustments = transactions.filter((t) => t.type === 'adjustment').length;

  const handleExportCSV = () => {
    const headers = [
      'Transaction ID',
      'Timestamp',
      'Type',
      'Commodity',
      'Category',
      'Quantity',
      'Unit',
      'Source',
      'Destination',
      'Mess Allocation',
      'Reason / Reference',
      'Created By',
    ];

    const rows = filteredTxs.map((tx) => {
      const it = getItem(tx.item_id);
      const ms = getMess(tx.mess_id);
      return [
        tx.id,
        new Date(tx.created_at).toISOString(),
        tx.type,
        `"${it?.name || tx.item_id}"`,
        it?.category || '',
        tx.quantity,
        it?.unit || '',
        tx.source,
        tx.destination,
        `"${ms?.name || 'N/A'}"`,
        tx.reason_code || tx.po_id || '',
        tx.created_by,
      ].join(',');
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Central_Supply_Depot_Ledger_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: 'Ledger CSV Exported',
      message: `Downloaded ${filteredTxs.length} official central supply depot ledger records.`,
    });
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3">
        <div className="w-10 h-10 border-3 border-olive border-t-gold rounded-full animate-spin" />
        <span className="font-heading font-bold text-xs uppercase tracking-wider text-olive">
          Loading Station Supply Transaction Ledger...
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 pb-12 max-w-6xl mx-auto font-body text-pine">
      {/* Header */}
      <div className="p-6 md:p-8 bg-night text-snow rounded-card border border-sand/40 shadow-elevation flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-control bg-olive/70 border border-gold/40 flex items-center justify-center text-gold shrink-0 shadow-subtle">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-badge bg-gold/15 border border-gold/40 text-gold text-[10px] font-heading font-bold uppercase tracking-wider mb-1.5">
              <Mountain className="w-3 h-3 text-gold" />
              <span>CENTRAL SUPPLY DEPOT (LOGISTICS) • PERMANENT LEDGER</span>
            </div>
            <h1 className="font-heading font-extrabold text-2xl md:text-3xl text-snow tracking-tight">
              Stock Transaction Ledger
            </h1>
            <p className="text-xs text-sand font-medium mt-1">
              Append-only audit trail of every ration receipt, issue, and write-off • Single source of truth for depot stock.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCSV}
            icon={<Download className="w-4 h-4" />}
            className="text-snow border-sand/40 hover:bg-olive-deep"
          >
            Export Ledger CSV
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/store')}
            icon={<ArrowLeft className="w-4 h-4" />}
            className="text-snow border-sand/40 hover:bg-olive-deep"
          >
            Return to Depot
          </Button>
        </div>
      </div>

      {/* KPI Stats Capsule */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-card bg-white border-l-4 border-l-success border border-sand/50 flex items-center justify-between shadow-subtle">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-control bg-success/15 border border-success/30 flex items-center justify-center text-success">
              <ArrowDownLeft className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-pine/70 block">
                Total Receipts
              </span>
              <span className="font-mono font-bold text-xl text-olive-deep tabular-nums">
                {totalReceipts} Intakes
              </span>
            </div>
          </div>
          <span className="text-xs font-mono text-success font-semibold">Vendor Consignments</span>
        </div>

        <div className="p-4 rounded-card bg-white border-l-4 border-l-gold border border-sand/50 flex items-center justify-between shadow-subtle">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-control bg-gold/15 border border-gold/40 flex items-center justify-center text-night">
              <ArrowUpRight className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-pine/70 block">
                Total Issues
              </span>
              <span className="font-mono font-bold text-xl text-olive-deep tabular-nums">
                {totalIssues} Transfers
              </span>
            </div>
          </div>
          <span className="text-xs font-mono text-night font-semibold">Mess Dispatches</span>
        </div>

        <div className="p-4 rounded-card bg-white border-l-4 border-l-danger border border-sand/50 flex items-center justify-between shadow-subtle">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-control bg-danger/10 border border-danger/30 flex items-center justify-center text-danger">
              <AlertOctagon className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-pine/70 block">
                Total Adjustments
              </span>
              <span className="font-mono font-bold text-xl text-olive-deep tabular-nums">
                {totalAdjustments} Write-offs
              </span>
            </div>
          </div>
          <span className="text-xs font-mono text-danger font-semibold">Audited Condemnations</span>
        </div>
      </div>

      {/* Filters & Search Toolbar */}
      <Card className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 border border-sand/60 shadow-subtle">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-pine/50 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by TX ID, commodity, reason, or mess..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs font-medium rounded-control border border-sand bg-snow focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold"
          />
        </div>

        {/* Type Filter Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 no-scrollbar">
          {[
            { id: 'all', label: 'All Transactions' },
            { id: 'receipt', label: 'Receipts' },
            { id: 'issue', label: 'Issues' },
            { id: 'adjustment', label: 'Write-offs' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setTypeFilter(tab.id)}
              className={`px-3 py-1.5 text-xs font-heading font-bold rounded-badge border whitespace-nowrap transition-all ${
                typeFilter === tab.id
                  ? 'bg-olive text-snow border-olive shadow-subtle'
                  : 'bg-snow text-pine/70 border-sand/40 hover:border-olive'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Commodity dropdown filter */}
        <select
          value={itemFilter}
          onChange={(e) => setItemFilter(e.target.value)}
          className="px-3 py-1.5 text-xs font-heading font-medium rounded-control border border-sand bg-snow text-pine focus:outline-none focus:border-gold"
        >
          <option value="all">All Commodities</option>
          {items.map((it) => (
            <option key={it.id} value={it.id}>
              {it.name}
            </option>
          ))}
        </select>
      </Card>

      {/* Operational Logistics Table */}
      <div className="rounded-card border border-sand/60 bg-white shadow-subtle overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table-operational">
            <thead>
              <tr>
                <th>TX ID &amp; Time</th>
                <th>Type &amp; Direction</th>
                <th>Commodity</th>
                <th className="text-right">Quantity</th>
                <th>Transfer Flow</th>
                <th>Reason / Ref</th>
                <th className="text-right">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredTxs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-pine/60 italic">
                    No transactions match the selected filters.
                  </td>
                </tr>
              ) : (
                filteredTxs.map((tx) => {
                  const it = getItem(tx.item_id);
                  const ms = getMess(tx.mess_id);
                  const isReceipt = tx.type === 'receipt';
                  const isIssue = tx.type === 'issue';
                  const isAdjustment = tx.type === 'adjustment';

                  return (
                    <tr key={tx.id}>
                      {/* TX ID & Time */}
                      <td>
                        <div className="font-mono font-bold text-[11px] text-olive-deep uppercase">
                          {tx.id}
                        </div>
                        <div className="text-[10px] text-pine/60 font-mono tabular-nums">
                          {new Date(tx.created_at).toLocaleDateString([], { month: 'short', day: 'numeric' })}{' '}
                          {new Date(tx.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </td>

                      {/* Type & Direction */}
                      <td>
                        <div className="flex items-center gap-1.5">
                          {isReceipt && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-badge bg-success/15 border border-success/30 text-success font-heading font-bold text-[10px]">
                              <ArrowDownLeft className="w-3 h-3 stroke-[2.5]" /> Receipt
                            </span>
                          )}
                          {isIssue && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-badge bg-gold/15 border border-gold/40 text-night font-heading font-bold text-[10px]">
                              <ArrowUpRight className="w-3 h-3 stroke-[2.5]" /> Issue
                            </span>
                          )}
                          {isAdjustment && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-badge bg-danger/10 border border-danger/30 text-danger font-heading font-bold text-[10px]">
                              <AlertOctagon className="w-3 h-3 stroke-[2.5]" /> Write-off
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Commodity */}
                      <td>
                        <div className="font-heading font-bold text-pine">{it?.name || tx.item_id}</div>
                        <div className="text-[10px] text-pine/60 font-mono uppercase">{it?.category.replace('_', ' ')}</div>
                      </td>

                      {/* Quantity */}
                      <td className="text-right">
                        <span
                          className={`font-mono font-bold text-sm tabular-nums ${
                            isReceipt
                              ? 'text-success'
                              : isAdjustment
                              ? 'text-danger'
                              : 'text-olive-deep'
                          }`}
                        >
                          {isReceipt ? '+' : '−'}
                          {tx.quantity} {it?.unit}
                        </span>
                      </td>

                      {/* Transfer Flow */}
                      <td>
                        <div className="flex items-center gap-1 text-[11px] font-mono">
                          <span className="text-pine/70 capitalize">
                            {tx.source.replace('_', ' ')}
                          </span>
                          <span className="text-sand">→</span>
                          <span className="font-bold text-pine">
                            {ms?.name || tx.destination.replace('_', ' ')}
                          </span>
                        </div>
                      </td>

                      {/* Reason / Reference */}
                      <td>
                        {tx.reason_code ? (
                          <span className="px-2 py-0.5 rounded bg-sand/20 text-[10px] font-mono text-pine capitalize">
                            {tx.reason_code.replace('_', ' ')}
                          </span>
                        ) : tx.po_id ? (
                          <span className="font-mono text-[10px] font-bold text-olive-deep bg-olive/10 px-1.5 py-0.5 rounded border border-olive/20">
                            {tx.po_id}
                          </span>
                        ) : (
                          <span className="text-[10px] text-pine/50 italic">Routine transfer</span>
                        )}
                      </td>

                      {/* Audit */}
                      <td className="text-right">
                        <span className="inline-flex items-center gap-1 text-[10px] font-heading font-bold text-success">
                          <ShieldCheck className="w-3.5 h-3.5" /> Reconciled
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LedgerView;
