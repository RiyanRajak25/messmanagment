import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../api/client';
import { PurchaseOrder, Vendor, Item } from '../../types';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Modal } from '../../components/Modal';
import { useToast } from '../../components/Toast';
import { Badge, Breadcrumb, StatCard, TableControls, Accordion } from '../../components/ui';
import {
  FileText,
  FileSpreadsheet,
  Building,
  CheckCircle2,
  Clock,
  Search,
  Scale,
  Mountain,
  ShieldCheck,
  Printer,
  CreditCard,
  QrCode,
  DollarSign,
  AlertTriangle,
  Receipt,
} from 'lucide-react';

export const POFinancialView: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [pos, setPos] = useState<PurchaseOrder[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedPo, setSelectedPo] = useState<PurchaseOrder | null>(null);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [preClearedPos, setPreClearedPos] = useState<Record<string, boolean>>({});

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
      {/* Navigation Breadcrumb */}
      <Breadcrumb
        items={[
          { label: 'Central Accounts', href: '/finance' },
          { label: 'Commercial Contract Indents & PO Ledger', current: true },
        ]}
      />

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

      {/* Modern High-Precision Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Contract Commitment"
          value={`₹${totalCommittedValue.toLocaleString('en-IN')}`}
          icon={<FileText className="w-5 h-5 text-gold" />}
          trend={{ value: `${pos.length} Orders`, direction: 'neutral' }}
          subtitle="Annual procurement"
          variant="gold"
        />
        <StatCard
          label="Delivered & Reconciled"
          value={`₹${totalDeliveredValue.toLocaleString('en-IN')}`}
          icon={<CheckCircle2 className="w-5 h-5 text-success" />}
          trend={{ value: `${Math.round((totalDeliveredValue / (totalCommittedValue || 1)) * 100)}% Fulfilled`, direction: 'up', label: 'Depot received' }}
          subtitle="Passed QC test"
        />
        <StatCard
          label="Pending Consignment Value"
          value={`₹${(totalPendingValue > 0 ? totalPendingValue : 0).toLocaleString('en-IN')}`}
          icon={<Clock className="w-5 h-5 text-glacier" />}
          trend={{ value: 'In-Transit', direction: 'neutral' }}
          subtitle="Awaiting bay intake"
        />
        <StatCard
          label="Certified Supply Agencies"
          value={`${vendors.length}`}
          icon={<Building className="w-5 h-5 text-olive" />}
          trend={{ value: '100% Empaneled', direction: 'up', label: 'Verified GST' }}
          subtitle="Active vendors"
        />
      </div>

      {/* Modern Table Controls & Filters Toolbar */}
      <Card className="p-4 bg-white border border-sand/60 shadow-subtle">
        <TableControls<string>
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder="Search by PO ID, vendor name, or commodity..."
          filterChips={[
            { id: 'all', label: 'All Orders', count: pos.length },
            { id: 'open', label: 'Open / In Transit', count: pos.filter((p) => p.status === 'open').length },
            { id: 'partially_received', label: 'Partially Received', count: pos.filter((p) => p.status === 'partially_received').length },
            { id: 'closed', label: 'Closed & Settled', count: pos.filter((p) => p.status === 'closed').length },
          ]}
          activeFilter={statusFilter}
          onFilterChange={setStatusFilter}
          totalResults={filteredPos.length}
          onExport={exportCSV}
        />
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
                <th className="py-3 px-4 text-center">Pre-Clearance</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sand/20 text-xs font-sans text-olive-deep">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-pine/60">
                    Loading commercial orders...
                  </td>
                </tr>
              ) : filteredPos.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-pine/60 italic">
                    No purchase orders match the filter criteria.
                  </td>
                </tr>
              ) : (
                filteredPos.map((po) => {
                  const v = getVendor(po.vendor_id);
                  const total = calculatePoTotal(po);
                  const delivered = calculatePoDeliveredValue(po);
                  const isFullyDelivered = po.lines.every((l) => l.received_qty >= l.ordered_qty);
                  const isPreCleared = preClearedPos[po.id];

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
                          <Badge variant="success">
                            <CheckCircle2 className="w-3 h-3 mr-1" /> FULFILLED
                          </Badge>
                        ) : delivered > 0 ? (
                          <Badge variant="gold" pulse>
                            <Clock className="w-3 h-3 mr-1" /> PARTIAL
                          </Badge>
                        ) : (
                          <Badge variant="glacier">
                            <Clock className="w-3 h-3 mr-1" /> IN TRANSIT
                          </Badge>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        {isPreCleared ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-success bg-success/15 border border-success/30 px-2 py-0.5 rounded">
                            <CheckCircle2 className="w-3 h-3" /> AUDITED
                          </span>
                        ) : (
                          <span className="text-[10px] font-mono text-pine/50">
                            Pending Audit
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

      {/* Progressive Disclosure: Commercial Contracts Accordion */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 px-1">
          <ShieldCheck className="w-4 h-4 text-gold" />
          <h4 className="font-heading font-extrabold text-xs uppercase tracking-wider text-olive-deep">
            Commercial Procurement &amp; Invoice Settlement Regulations
          </h4>
        </div>
        <Accordion
          items={[
            {
              id: 'invoice-3way',
              title: 'Mandatory 3-Way Invoice Matching Rule (PO vs Challan vs GRN)',
              subtitle: 'Pre-requisite for all Treasury disbursements',
              badge: <Badge variant="gold">AUDIT DIRECTIVE</Badge>,
              children: (
                <div className="text-xs text-pine/80 space-y-2 leading-relaxed pt-2">
                  <p>
                    Disbursement vouchers are authorized only after an automated 3-way match verifies:
                  </p>
                  <ol className="list-decimal pl-5 space-y-1">
                    <li>Sanctioned rates on the original Purchase Order.</li>
                    <li>Transporter Delivery Challan and verified container seal numbers.</li>
                    <li>Actual accepted net weight recorded on the Storekeeper’s Goods Receipt Note (GRN).</li>
                  </ol>
                  <p className="text-pine/70 font-mono text-[11px] pt-1">
                    Discrepancies exceeding 0.5% require physical reconciliation before RTGS issuance.
                  </p>
                </div>
              ),
            },
            {
              id: 'advance-payments',
              title: 'Prohibition of Unsecured Advance Payments',
              subtitle: 'Statutory compliance under Central Accounts Manual',
              children: (
                <div className="text-xs text-pine/80 space-y-2 leading-relaxed pt-2">
                  <p>
                    No advances are released to private contractors without a corresponding irrevocable Bank Guarantee from a scheduled commercial bank covering 110% of the advance sum.
                  </p>
                </div>
              ),
            },
          ]}
        />
      </div>

      {/* PO AUDIT DETAILS & PRE-CLEARANCE MODAL */}
      {selectedPo && (
        <Modal
          isOpen={Boolean(selectedPo)}
          onClose={() => setSelectedPo(null)}
          title="Purchase Order Financial & Commercial Audit"
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
                  ₹{Math.round(calculatePoTotal(selectedPo) * 1.05).toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between gap-2 pt-2 border-t border-sand/40">
              <Button
                variant={preClearedPos[selectedPo.id] ? 'outline' : 'primary'}
                size="sm"
                onClick={() => {
                  setPreClearedPos((prev) => ({ ...prev, [selectedPo.id]: true }));
                  toast({
                    title: 'PO Pre-Cleared for Payment',
                    message: `Audit endorsement stamped on ${selectedPo.id}. Ready for treasury voucher generation.`,
                  });
                }}
                icon={<ShieldCheck className="w-3.5 h-3.5" />}
              >
                {preClearedPos[selectedPo.id] ? 'Pre-Cleared ✓' : 'Pre-Clear for Disbursement'}
              </Button>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsPrintModalOpen(true)}
                  icon={<Printer className="w-3.5 h-3.5" />}
                >
                  Print Audit Sheet
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => navigate('/finance/payments')}
                  icon={<CreditCard className="w-3.5 h-3.5" />}
                >
                  Disburse Voucher
                </Button>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* PRINT COMMERCIAL AUDIT STATEMENT MODAL */}
      {isPrintModalOpen && selectedPo && (
        <Modal
          isOpen={isPrintModalOpen}
          onClose={() => setIsPrintModalOpen(false)}
          title="Official Commercial Audit & Settlement Sheet"
          description={`Central Accounts Division • Audit Voucher #${selectedPo.id}`}
        >
          <div className="flex flex-col gap-4 font-body text-pine mt-2">
            <div className="p-5 rounded-card border-2 border-olive bg-white space-y-4">
              <div className="flex justify-between items-start border-b-2 border-olive pb-3">
                <div>
                  <div className="text-[10px] font-mono uppercase tracking-widest text-olive font-extrabold">
                    GOVERNMENT OF INDIA • DEFENCE ACCOUNTS / AUDIT DIRECTORATE
                  </div>
                  <h4 className="font-heading font-extrabold text-base text-olive-deep">
                    COMMERCIAL INVOICE PRE-AUDIT &amp; CLEARANCE CERTIFICATE
                  </h4>
                  <p className="text-xs text-pine/60 font-mono">
                    Audit Voucher Ref: AUD-{selectedPo.id.toUpperCase()}-2026
                  </p>
                </div>
                <div className="p-1.5 border border-sand bg-snow rounded text-center shrink-0">
                  <QrCode className="w-10 h-10 text-olive mx-auto" />
                  <span className="text-[9px] font-mono text-pine/60 block mt-0.5">AUDIT PASS</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs bg-snow p-3 rounded font-mono">
                <div>
                  <span className="text-[10px] text-pine/60 font-sans uppercase font-bold block">Contractor Agency</span>
                  <strong className="text-olive-deep text-sm block">{getVendor(selectedPo.vendor_id)?.name}</strong>
                  <span className="text-pine/70 text-[11px]">GSTIN: {getVendor(selectedPo.vendor_id)?.tax_id}</span>
                </div>
                <div>
                  <span className="text-[10px] text-pine/60 font-sans uppercase font-bold block">Commercial Settlement Sum</span>
                  <strong className="text-olive-deep text-sm block">₹{Math.round(calculatePoTotal(selectedPo) * 1.05).toLocaleString('en-IN')}</strong>
                  <span className="text-pine/70 text-[11px]">Payment Mode: RTGS Direct Credit</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 pt-4 border-t-2 border-dashed border-sand/60 text-xs">
                <div className="text-center pt-6 border-t border-pine/30">
                  <span className="font-heading font-bold text-olive-deep block">Auditor (Commercial Bills)</span>
                  <span className="text-[10px] text-pine/60 block">Central Accounts Office</span>
                </div>
                <div className="text-center pt-6 border-t border-pine/30">
                  <span className="font-heading font-bold text-olive-deep block">Senior Accounts Officer</span>
                  <span className="text-[10px] text-pine/60 block">Disbursing Authority</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-sand/40">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsPrintModalOpen(false)}
              >
                Close
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  window.print();
                  toast({ title: 'Print Audit Sheet', message: 'Audit sheet sent to printer queue.' });
                }}
                icon={<Printer className="w-3.5 h-3.5" />}
              >
                Print Commercial Audit Sheet
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default POFinancialView;
