import React, { useState, useEffect } from 'react';
import { api } from '../../api/client';
import { PurchaseOrder, Vendor, Item } from '../../types';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { StatTile } from '../../components/StatTile';
import { Modal } from '../../components/Modal';
import { useToast } from '../../components/Toast';
import {
  FileText,
  FileSpreadsheet,
  Building,
  CheckCircle2,
  Clock,
  Search,
  Scale,
  Mountain,
} from 'lucide-react';

export const POFinancialView: React.FC = () => {
  const { toast } = useToast();
  const [pos, setPos] = useState<PurchaseOrder[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedPo, setSelectedPo] = useState<PurchaseOrder | null>(null);

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      try {
        const [poData, vData, iData] = await Promise.all([
          api.purchaseOrders.list(),
          api.vendors.list(),
          api.items.list(),
        ]);
        setPos(poData);
        setVendors(vData);
        setItems(iData);
      } catch (err) {
        console.error('Failed to load purchase orders', err);
        toast({ type: 'error', title: 'Error', message: 'Failed to load purchase order financial ledger' });
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [toast]);

  const getItem = (itemId: string) => items.find((i) => i.id === itemId);
  const getVendor = (vendorId: string) => vendors.find((v) => v.id === vendorId);

  const calculatePoTotal = (po: PurchaseOrder) => {
    return po.lines.reduce((acc, l) => acc + l.ordered_qty * l.unit_price, 0);
  };

  const calculatePoDeliveredValue = (po: PurchaseOrder) => {
    return po.lines.reduce((acc, l) => acc + l.received_qty * l.unit_price, 0);
  };

  const totalCommittedValue = pos.reduce((acc, po) => acc + calculatePoTotal(po), 0);
  const totalDeliveredValue = pos.reduce((acc, po) => acc + calculatePoDeliveredValue(po), 0);
  const totalPendingValue = totalCommittedValue - totalDeliveredValue;

  const exportCSV = () => {
    if (pos.length === 0) {
      toast({ type: 'warning', title: 'No Data', message: 'No purchase orders available for export.' });
      return;
    }
    const headers = ['PO ID', 'Vendor', 'Status', 'Commodity', 'Ordered Qty', 'Received Qty', 'Unit Price (INR)', 'Committed Value (INR)', 'Delivered Value (INR)', 'Created At'];
    const rows: (string | number)[][] = [];

    pos.forEach((po) => {
      const v = getVendor(po.vendor_id);
      po.lines.forEach((line) => {
        const item = getItem(line.item_id);
        rows.push([
          po.id,
          v ? `"${v.name}"` : po.vendor_id,
          po.status.toUpperCase(),
          item ? `"${item.name}"` : line.item_id,
          line.ordered_qty,
          line.received_qty,
          line.unit_price,
          line.ordered_qty * line.unit_price,
          line.received_qty * line.unit_price,
          po.created_at,
        ]);
      });
    });

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `PO_Financial_Ledger_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({ title: 'Export Complete', message: 'PO Financial Ledger exported as CSV.' });
  };

  const filteredPos = pos.filter((po) => {
    const v = getVendor(po.vendor_id);
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      po.id.toLowerCase().includes(q) ||
      (v && v.name.toLowerCase().includes(q)) ||
      po.lines.some((l) => {
        const it = getItem(l.item_id);
        return it && it.name.toLowerCase().includes(q);
      });
    const matchesStatus = statusFilter === 'all' || po.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="flex flex-col gap-6 pb-12 font-body text-pine">
      {/* Header Banner */}
      <div className="p-6 md:p-8 bg-night text-snow rounded-card border border-sand/40 shadow-elevation flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-control bg-olive/70 border border-gold/40 flex items-center justify-center text-gold shrink-0 shadow-subtle">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-badge bg-gold/15 border border-gold/40 text-gold text-[10px] font-heading font-bold uppercase tracking-wider mb-1.5">
              <Mountain className="w-3.5 h-3.5 text-gold" />
              <span>CENTRAL ACCOUNTS &amp; AUDIT DIVISION • COMMERCIAL CONTRACTS</span>
            </div>
            <h1 className="font-heading font-extrabold text-2xl md:text-3xl text-snow tracking-tight">
              Purchase Order Financial &amp; Cost Variance Ledger
            </h1>
            <p className="text-xs text-sand font-medium mt-1">
              Unit prices, delivery fulfillment rates, commitment values, and vendor commercial audits.
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
            Export Financial Ledger
          </Button>
        </div>
      </div>

      {/* KPI Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatTile
          label="Total Contract Commitment"
          value={`₹${totalCommittedValue.toLocaleString('en-IN')}`}
          subValue={`Across ${pos.length} purchase orders`}
          icon={<FileText className="w-5 h-5 text-gold" />}
          accentColor="gold"
        />
        <StatTile
          label="Delivered &amp; Reconciled"
          value={`₹${totalDeliveredValue.toLocaleString('en-IN')}`}
          subValue={`${Math.round((totalDeliveredValue / (totalCommittedValue || 1)) * 100)}% received in silos`}
          trend={{ value: 'Verified', isPositive: true }}
          icon={<CheckCircle2 className="w-5 h-5 text-success" />}
          accentColor="success"
        />
        <StatTile
          label="Pending Consignment Value"
          value={`₹${(totalPendingValue > 0 ? totalPendingValue : 0).toLocaleString('en-IN')}`}
          subValue="Awaiting depot bay unload"
          icon={<Clock className="w-5 h-5 text-glacier" />}
          accentColor="glacier"
        />
        <StatTile
          label="Certified Supply Agencies"
          value={`${vendors.length}`}
          subValue="Active tender contracts"
          icon={<Building className="w-5 h-5 text-olive" />}
          accentColor="olive"
        />
      </div>

      {/* Filter and Search Bar */}
      <Card className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 border border-sand/60 bg-white">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-pine/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by PO ID, vendor name, or commodity..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs font-mono font-medium rounded-control border border-sand bg-snow focus:outline-none focus:border-olive focus:ring-1 focus:ring-olive text-olive-deep placeholder:text-pine/40"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs font-heading font-semibold rounded-control border border-sand bg-white text-olive-deep focus:outline-none focus:border-olive"
          >
            <option value="all">All PO Statuses</option>
            <option value="open">Open / In Transit</option>
            <option value="partial">Partially Delivered</option>
            <option value="closed">Closed &amp; Settled</option>
          </select>
        </div>
      </Card>

      {/* PO Financial Ledger Table */}
      <div className="rounded-card border border-sand/60 bg-white shadow-subtle overflow-hidden">
        <div className="p-4 bg-snow border-b border-sand/40 flex items-center justify-between">
          <div>
            <h3 className="font-heading font-extrabold text-base text-olive-deep">
              Purchase Order Commercial Register
            </h3>
            <p className="text-xs text-pine/70">
              Ordered vs received values per line item with contracted unit rates.
            </p>
          </div>
          <span className="px-2.5 py-1 rounded-badge bg-gold/15 text-gold text-[10px] font-heading font-bold border border-gold/40 uppercase">
            Contract Audit Active
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="table-operational w-full text-left border-collapse">
            <thead>
              <tr className="bg-olive-deep text-sand text-[10px] font-heading font-bold uppercase tracking-wider select-none">
                <th className="py-3 px-4">PO Identifier</th>
                <th className="py-3 px-4">Contractor Agency</th>
                <th className="py-3 px-4">Commodity Lines</th>
                <th className="py-3 px-4 text-right">Committed Value</th>
                <th className="py-3 px-4 text-right">Delivered Value</th>
                <th className="py-3 px-4 text-center">Fulfillment Status</th>
                <th className="py-3 px-4 text-right">Inspection</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sand/20 text-xs font-sans text-olive-deep">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-pine/60">
                    Loading commercial orders...
                  </td>
                </tr>
              ) : filteredPos.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-pine/60 italic">
                    No purchase orders match the filter criteria.
                  </td>
                </tr>
              ) : (
                filteredPos.map((po) => {
                  const v = getVendor(po.vendor_id);
                  const total = calculatePoTotal(po);
                  const delivered = calculatePoDeliveredValue(po);
                  const isFullyDelivered = po.lines.every((l) => l.received_qty >= l.ordered_qty);

                  return (
                    <tr key={po.id} className="hover:bg-snow/60 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-olive-deep">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs">{po.id}</span>
                        </div>
                        <div className="text-[10px] text-pine/60 font-sans mt-0.5">
                          {po.created_at.split('T')[0]}
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-heading font-bold text-sm text-olive-deep">
                          {v ? v.name : po.vendor_id}
                        </div>
                        <div className="text-[10px] text-pine/60 font-mono mt-0.5">
                          GSTIN: {v?.tax_id || '29AAAAA0000A1Z5'}
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex flex-col gap-1">
                          {po.lines.map((l) => {
                            const it = getItem(l.item_id);
                            return (
                              <div key={l.item_id} className="flex items-center gap-2 text-xs">
                                <span className="font-semibold text-olive-deep">{it?.name || l.item_id}:</span>
                                <span className="font-mono text-pine/70 text-[11px]">
                                  {l.received_qty} / {l.ordered_qty} {it?.unit} @ ₹{l.unit_price}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-right font-mono font-bold text-olive-deep text-sm">
                        ₹{total.toLocaleString('en-IN')}
                      </td>

                      <td className="py-3.5 px-4 text-right font-mono font-bold text-pine/80 text-sm">
                        ₹{delivered.toLocaleString('en-IN')}
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        {isFullyDelivered ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-badge bg-success/10 text-success border border-success/30 font-mono text-[10px] font-bold">
                            <CheckCircle2 className="w-3 h-3" /> FULFILLED
                          </span>
                        ) : delivered > 0 ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-badge bg-gold/15 text-gold border border-gold/40 font-mono text-[10px] font-bold">
                            <Clock className="w-3 h-3" /> PARTIAL
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-badge bg-glacier/15 text-glacier border border-glacier/30 font-mono text-[10px] font-bold">
                            <Clock className="w-3 h-3" /> IN TRANSIT
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedPo(po)}
                          className="text-xs font-bold"
                        >
                          Audit Details
                        </Button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* PO Audit Details Modal */}
      {selectedPo && (
        <Modal
          isOpen={Boolean(selectedPo)}
          onClose={() => setSelectedPo(null)}
          title="Purchase Order Financial Audit"
          description={`Comprehensive Line Items Breakdown • ${selectedPo.id}`}
        >
          <div className="flex flex-col gap-4 font-body text-pine mt-2">
            <div className="p-3 bg-snow rounded-control border border-sand/40 flex items-center justify-between text-xs">
              <div>
                <span className="text-pine/60 text-[10px] uppercase font-bold block">Contractor</span>
                <span className="font-heading font-bold text-olive-deep text-sm">
                  {getVendor(selectedPo.vendor_id)?.name || selectedPo.vendor_id}
                </span>
              </div>
              <div className="text-right">
                <span className="text-pine/60 text-[10px] uppercase font-bold block">Current Status</span>
                <span className="font-mono font-bold text-olive uppercase">{selectedPo.status}</span>
              </div>
            </div>

            <div className="overflow-x-auto rounded-control border border-sand/40">
              <table className="w-full text-xs text-left">
                <thead className="bg-olive text-snow text-[10px] font-heading font-bold uppercase">
                  <tr>
                    <th className="p-2.5">Item Name</th>
                    <th className="p-2.5 text-right">Ordered</th>
                    <th className="p-2.5 text-right">Received</th>
                    <th className="p-2.5 text-right">Unit Rate</th>
                    <th className="p-2.5 text-right">Total (INR)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sand/20 bg-white">
                  {selectedPo.lines.map((line) => {
                    const it = getItem(line.item_id);
                    return (
                      <tr key={line.item_id}>
                        <td className="p-2.5 font-bold text-olive-deep">
                          {it?.name || line.item_id}
                        </td>
                        <td className="p-2.5 text-right font-mono">
                          {line.ordered_qty} {it?.unit}
                        </td>
                        <td className="p-2.5 text-right font-mono text-success font-bold">
                          {line.received_qty} {it?.unit}
                        </td>
                        <td className="p-2.5 text-right font-mono">
                          ₹{line.unit_price}
                        </td>
                        <td className="p-2.5 text-right font-mono font-bold text-olive-deep">
                          ₹{(line.ordered_qty * line.unit_price).toLocaleString('en-IN')}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="p-3.5 bg-white border border-sand/60 rounded-card flex flex-col gap-1.5 text-xs">
              <div className="flex justify-between text-pine/80">
                <span>Contract Subtotal:</span>
                <span className="font-mono font-bold">₹{calculatePoTotal(selectedPo).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-pine/80">
                <span>GST (Estimated 5% on rations):</span>
                <span className="font-mono font-bold">₹{Math.round(calculatePoTotal(selectedPo) * 0.05).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-base font-extrabold text-olive-deep border-t border-sand/40 pt-2 mt-1">
                <span>Net Audit Payable:</span>
                <span className="font-mono">
                  ₹{(calculatePoTotal(selectedPo) * 1.05).toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-sand/40">
              <Button
                variant="primary"
                size="sm"
                onClick={() => setSelectedPo(null)}
              >
                Close Audit
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default POFinancialView;
