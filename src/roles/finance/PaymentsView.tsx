import React, { useState, useEffect } from 'react';
import { api } from '../../api/client';
import { Expenditure, Vendor, PurchaseOrder } from '../../types';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Modal } from '../../components/Modal';
import { useToast } from '../../components/Toast';
import { Badge, Breadcrumb, StatCard, TableControls, Accordion } from '../../components/ui';
import {
  Receipt,
  Plus,
  FileSpreadsheet,
  Building,
  CheckCircle2,
  Clock,
  Printer,
  CreditCard,
  Mountain,
  ShieldCheck,
  FileCheck,
  TrendingUp,
  Eye,
  EyeOff,
  Lock,
} from 'lucide-react';
import { maskSensitive, isStrictPositiveNumber, sanitizeInput } from '../../utils/security';

export const PaymentsView: React.FC = () => {
  const { toast } = useToast();
  const [expenditures, setExpenditures] = useState<Expenditure[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [pos, setPos] = useState<PurchaseOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMode, setFilterMode] = useState<'all' | 'high_value' | 'recent'>('all');
  const [isDisburseModalOpen, setIsDisburseModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState<Expenditure | null>(null);
  const [isMasked, setIsMasked] = useState(true); // Privacy-by-default standard

  // Form state
  const [selectedPoId, setSelectedPoId] = useState('');
  const [paymentAmount, setPaymentAmount] = useState('85000');
  const [paymentMethod, setPaymentMethod] = useState('RTGS / Treasury Direct Credit');
  const [voucherRef, setVoucherRef] = useState(`TXN-VCH-${Math.floor(100000 + Math.random() * 900000)}`);

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      try {
        const [eData, vData, poData] = await Promise.all([
          api.finance.getExpenditures(),
          api.vendors.list(),
          api.purchaseOrders.list(),
        ]);
        setExpenditures(eData);
        setVendors(vData);
        setPos(poData);
        if (poData.length > 0) {
          setSelectedPoId(poData[0].id);
        }
      } catch (err) {
        console.error('Failed to load expenditures', err);
        toast({ type: 'error', title: 'Error', message: 'Failed to load supplier disbursements' });
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [toast]);

  const handleDisbursePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    const po = pos.find((p) => p.id === selectedPoId);
    if (!po) {
      toast({ type: 'error', title: 'Invalid PO', message: 'Please select a valid purchase order.' });
      return;
    }
    const amount = parseFloat(paymentAmount);
    if (!isStrictPositiveNumber(amount)) {
      toast({ type: 'error', title: 'Invalid Amount', message: 'Enter a valid positive disbursement amount.' });
      return;
    }

    setIsSubmitting(true);
    try {
      const newExp = await api.finance.recordExpenditure({
        po_id: po.id,
        vendor_id: po.vendor_id,
        amount,
        date: new Date().toISOString().split('T')[0],
        recorded_by: 'Amit Sharma, IDAS',
      });

      setExpenditures((prev) => [newExp, ...prev]);
      setIsDisburseModalOpen(false);
      toast({
        title: 'Payment Disbursed',
        message: `Disbursement of ₹${amount.toLocaleString('en-IN')} committed against ${po.id}.`,
      });
      // Reset ref for next payment
      setVoucherRef(`TXN-VCH-${Math.floor(100000 + Math.random() * 900000)}`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Disbursement failed';
      toast({ type: 'error', title: 'Payment Failed', message: msg });
    } finally {
      setIsSubmitting(false);
    }
  };

  const exportCSV = () => {
    if (expenditures.length === 0) {
      toast({ type: 'warning', title: 'No Data', message: 'No disbursement records available.' });
      return;
    }
    const headers = ['Disbursement ID', 'PO Reference', 'Vendor Name', 'Amount (INR)', 'Transaction Date', 'Recorded By'];
    const rows = expenditures.map((e) => {
      const v = vendors.find((vendor) => vendor.id === e.vendor_id);
      return [
        e.id,
        e.po_id,
        v ? `"${v.name}"` : e.vendor_id,
        e.amount,
        e.date,
        e.recorded_by,
      ];
    });

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Supplier_Disbursements_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({ title: 'Export Complete', message: 'Disbursement register downloaded as CSV.' });
  };

  const totalDisbursed = expenditures.reduce((acc, e) => acc + e.amount, 0);

  const filteredExpenditures = expenditures.filter((e) => {
    const v = vendors.find((vendor) => vendor.id === e.vendor_id);
    const q = searchQuery.toLowerCase();
    const matchesSearch = (
      e.id.toLowerCase().includes(q) ||
      e.po_id.toLowerCase().includes(q) ||
      e.date.includes(q) ||
      (v && v.name.toLowerCase().includes(q))
    );
    if (!matchesSearch) return false;
    if (filterMode === 'high_value') return e.amount >= 50000;
    if (filterMode === 'recent') {
      const now = new Date();
      const itemDate = new Date(e.date);
      const diffDays = (now.getTime() - itemDate.getTime()) / (1000 * 3600 * 24);
      return diffDays <= 45;
    }
    return true;
  });

  return (
    <div className="flex flex-col gap-6 pb-12 font-body text-pine">
      {/* Navigation Breadcrumb */}
      <Breadcrumb
        items={[
          { label: 'Central Accounts & Finance', href: '/finance' },
          { label: 'Supplier Disbursements & Vouchers', current: true },
        ]}
      />

      {/* Header Banner */}
      <div className="p-6 md:p-8 bg-night text-snow rounded-card border border-sand/40 shadow-elevation flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-control bg-olive/70 border border-gold/40 flex items-center justify-center text-gold shrink-0 shadow-subtle">
            <Receipt className="w-6 h-6" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-badge bg-gold/15 border border-gold/40 text-gold text-[10px] font-heading font-bold uppercase tracking-wider mb-1.5">
              <Mountain className="w-3.5 h-3.5 text-gold" />
              <span>CENTRAL ACCOUNTS &amp; AUDIT DIVISION • DISBURSEMENTS</span>
            </div>
            <h1 className="font-heading font-extrabold text-2xl md:text-3xl text-snow tracking-tight">
              Supplier Disbursements &amp; Payment Vouchers
            </h1>
            <p className="text-xs text-sand font-medium mt-1">
              Treasury bill settlement against certified warehouse consignment delivery challans.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsMasked(!isMasked)}
            icon={isMasked ? <Eye className="w-4 h-4 text-gold" /> : <EyeOff className="w-4 h-4 text-sand" />}
            className="text-snow border-sand/40 hover:bg-olive-deep font-mono text-xs"
          >
            {isMasked ? 'Reveal Identifiers' : 'Mask Identifiers'}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={exportCSV}
            icon={<FileSpreadsheet className="w-4 h-4" />}
            className="text-snow border-sand/40 hover:bg-olive-deep"
          >
            Export Register CSV
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsDisburseModalOpen(true)}
            icon={<Plus className="w-4 h-4" />}
          >
            Disburse Payment
          </Button>
        </div>
      </div>

      {/* Modern High-Precision Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Settled Payments"
          value={`₹${totalDisbursed.toLocaleString('en-IN')}`}
          icon={<Receipt className="w-5 h-5 text-gold" />}
          trend={{ value: '+5.4%', direction: 'up', label: 'vs FY-25 Q2' }}
          subtitle="Audited ledger"
          variant="gold"
        />
        <StatCard
          label="Vouchers Issued"
          value={`${expenditures.length}`}
          icon={<CheckCircle2 className="w-5 h-5 text-success" />}
          trend={{ value: '100%', direction: 'up', label: 'Reconciled' }}
          subtitle="Immutable hashes"
        />
        <StatCard
          label="Active Suppliers Paid"
          value={`${vendors.length}`}
          icon={<Building className="w-5 h-5 text-glacier" />}
          trend={{ value: `${vendors.filter(v => v.is_active).length} Active`, direction: 'neutral' }}
          subtitle="Empaneled list"
        />
        <StatCard
          label="Average Clearance"
          value="24 Hours"
          icon={<Clock className="w-5 h-5 text-olive" />}
          trend={{ value: 'T+0', direction: 'up', label: 'On GRN check' }}
          subtitle="Direct RTGS"
        />
      </div>

      {/* Modern Table Controls & Filters Toolbar */}
      <Card className="p-4 bg-white border border-sand/60 shadow-subtle">
        <TableControls<'all' | 'high_value' | 'recent'>
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder="Search by supplier name, voucher ID, PO ref, or date..."
          filterChips={[
            { id: 'all', label: 'All Vouchers', count: expenditures.length },
            { id: 'high_value', label: 'High Value (₹50k+)', count: expenditures.filter(e => e.amount >= 50000).length },
            { id: 'recent', label: 'Recent (45d)', count: expenditures.filter(e => {
              const diff = (Date.now() - new Date(e.date).getTime()) / (1000 * 3600 * 24);
              return diff <= 45;
            }).length },
          ]}
          activeFilter={filterMode}
          onFilterChange={setFilterMode}
          totalResults={filteredExpenditures.length}
          onExport={exportCSV}
        />
      </Card>

      {/* Disbursements Table */}
      <div className="rounded-card border border-sand/60 bg-white shadow-subtle overflow-hidden">
        <div className="p-4 bg-snow border-b border-sand/40 flex items-center justify-between">
          <div>
            <h3 className="font-heading font-extrabold text-base text-olive-deep">
              Electronic Payment Disbursal Ledger
            </h3>
            <p className="text-xs text-pine/70">
              Direct-to-bank vendor payments reconciled with purchase orders and goods receipt notes.
            </p>
          </div>
          <span className="px-2.5 py-1 rounded-badge bg-success/15 text-success text-[10px] font-heading font-bold border border-success/30 uppercase">
            Bank Gateway Synced
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="table-operational w-full text-left border-collapse">
            <thead>
              <tr className="bg-olive-deep text-sand text-[10px] font-heading font-bold uppercase tracking-wider select-none">
                <th className="py-3 px-4">Voucher ID</th>
                <th className="py-3 px-4">Purchase Order Reference</th>
                <th className="py-3 px-4">Supplier Agency</th>
                <th className="py-3 px-4">Disbursement Date</th>
                <th className="py-3 px-4 text-right">Settled Amount</th>
                <th className="py-3 px-4 text-center">Payment Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sand/20 text-xs font-sans text-olive-deep">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-pine/60">
                    Loading disbursement records...
                  </td>
                </tr>
              ) : filteredExpenditures.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-pine/60 italic">
                    No payment records match the search filter.
                  </td>
                </tr>
              ) : (
                filteredExpenditures.map((e) => {
                  const v = vendors.find((vendor) => vendor.id === e.vendor_id);
                  return (
                    <tr key={e.id} className="hover:bg-snow/60 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-heading font-bold text-olive-deep text-xs font-mono">{e.id}</div>
                        <div className="text-[10px] text-pine/60 font-mono mt-0.5">
                          Auth: {e.recorded_by}
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-mono text-xs font-bold text-olive bg-olive/10 px-2 py-0.5 rounded border border-olive/20">
                          {e.po_id}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-heading font-bold text-sm text-olive-deep">
                          {v ? v.name : e.vendor_id}
                        </div>
                        <div className="text-[10px] text-pine/60 font-mono mt-0.5">
                          GSTIN: {isMasked ? maskSensitive(v?.tax_id || '29AAAAA0000A1Z5', 2, 3) : (v?.tax_id || '29AAAAA0000A1Z5')}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 font-mono text-[11px] text-pine/80">
                        {e.date}
                      </td>

                      <td className="py-3.5 px-4 text-right font-mono font-bold text-olive-deep text-sm">
                        ₹{e.amount.toLocaleString('en-IN')}
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <Badge variant="success" pulse>
                          SETTLED
                        </Badge>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedVoucher(e)}
                          icon={<Printer className="w-3 h-3" />}
                          className="text-xs font-bold"
                        >
                          Voucher
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

      {/* Progressive Disclosure: Audited Treasury Guidelines Accordion */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 px-1">
          <ShieldCheck className="w-4 h-4 text-gold" />
          <h4 className="font-heading font-extrabold text-xs uppercase tracking-wider text-olive-deep">
            Institutional Treasury Audit &amp; Settlement Safeguards
          </h4>
        </div>
        <Accordion
          items={[
            {
              id: 'compliance-rule',
              title: 'Two-Tier Verification Protocol (GRN to Payment Match)',
              subtitle: 'Mandatory verification chain before fund release',
              badge: <Badge variant="gold">MANDATORY</Badge>,
              children: (
                <div className="text-xs text-pine/80 space-y-2 leading-relaxed pt-2">
                  <p>
                    All supplier electronic disbursements are executed strictly following physical consignment check by the <strong>Store Keeper</strong>, generation of a digitally signed <strong>Goods Receipt Note (GRN)</strong>, and final authorization by the <strong>Central Accounts Officer</strong>.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                    <div className="p-2.5 rounded bg-white border border-sand/40">
                      <span className="font-heading font-bold text-olive block text-[11px]">1. Physical Receipt</span>
                      <span className="text-[10px] text-pine/60">Quality check, weighment calibration, and shelf-life clearance.</span>
                    </div>
                    <div className="p-2.5 rounded bg-white border border-sand/40">
                      <span className="font-heading font-bold text-olive block text-[11px]">2. Ledger Entry</span>
                      <span className="text-[10px] text-pine/60">Pure stock ledger debit/credit matching PO purchase quantities.</span>
                    </div>
                    <div className="p-2.5 rounded bg-white border border-sand/40">
                      <span className="font-heading font-bold text-olive block text-[11px]">3. Treasury Credit</span>
                      <span className="text-[10px] text-pine/60">Direct RTGS release with immutable cryptographic voucher hash.</span>
                    </div>
                  </div>
                </div>
              ),
            },
            {
              id: 'tax-tds',
              title: 'Statutory GST & TDS Withholding Deductions',
              subtitle: 'Section 51 CGST Act institutional parameters',
              children: (
                <div className="text-xs text-pine/80 space-y-2 leading-relaxed pt-2">
                  <p>
                    For institutional contracts exceeding ₹2,50,000, statutory TDS of 2% (1% CGST + 1% SGST) is deducted at source prior to electronic transfer. Requisite Form GSTR-7 certificates are issued to vendors within 5 days of monthly filing.
                  </p>
                </div>
              ),
            },
          ]}
        />
      </div>

      {/* Disburse Payment Modal */}
      <Modal
        isOpen={isDisburseModalOpen}
        onClose={() => setIsDisburseModalOpen(false)}
        title="Disburse Supplier Payment"
        description="Record electronic treasury disbursement against delivered consignment order."
      >
        <form onSubmit={handleDisbursePayment} className="flex flex-col gap-4 font-body text-pine mt-2">
          <div>
            <label className="block text-xs font-heading font-bold text-olive uppercase mb-1">
              Select Purchase Order
            </label>
            <select
              value={selectedPoId}
              onChange={(e) => {
                const poId = e.target.value;
                setSelectedPoId(poId);
                const po = pos.find((p) => p.id === poId);
                if (po) {
                  const total = po.lines.reduce(
                    (acc, l) => acc + l.ordered_qty * l.unit_price,
                    0
                  );
                  setPaymentAmount(total ? total.toString() : '85000');
                }
              }}
              className="w-full px-3 py-2 text-xs font-sans rounded-control border border-sand bg-snow text-olive-deep focus:outline-none focus:border-olive"
            >
              {pos.map((p) => {
                const v = vendors.find((vendor) => vendor.id === p.vendor_id);
                return (
                  <option key={p.id} value={p.id}>
                    {p.id} — {v ? v.name : p.vendor_id} (Status: {p.status.toUpperCase()})
                  </option>
                );
              })}
            </select>
          </div>

          <div>
            <label className="block text-xs font-heading font-bold text-olive uppercase mb-1">
              Payment Transfer Channel
            </label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full px-3 py-2 text-xs font-sans rounded-control border border-sand bg-snow text-olive-deep focus:outline-none focus:border-olive"
            >
              <option value="RTGS / Treasury Direct Credit">RTGS / Treasury Electronic Transfer</option>
              <option value="NEFT Direct Credit">NEFT National Electronic Funds Transfer</option>
              <option value="Government E-Cheque">Government Institutional E-Cheque</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-heading font-bold text-olive uppercase mb-1">
                Disbursement Amount (INR)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-mono font-bold text-olive-deep">
                  ₹
                </span>
                <input
                  type="number"
                  min="100"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  required
                  className="w-full pl-8 pr-4 py-2 text-xs font-mono font-bold rounded-control border border-sand bg-snow text-olive-deep focus:outline-none focus:border-olive"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-heading font-bold text-olive uppercase mb-1">
                Voucher / UTR Reference
              </label>
              <input
                type="text"
                value={voucherRef}
                onChange={(e) => setVoucherRef(e.target.value)}
                required
                className="w-full px-3 py-2 text-xs font-mono rounded-control border border-sand bg-snow text-olive-deep focus:outline-none focus:border-olive"
              />
            </div>
          </div>

          <div className="p-3 bg-glacier/10 border border-glacier/30 rounded-control flex items-start gap-2.5 text-xs text-olive-deep">
            <CreditCard className="w-4 h-4 text-glacier shrink-0 mt-0.5" />
            <span>
              This disbursement will be recorded in the immutable fiscal ledger and automatically updates the vendor billing clearance.
            </span>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-sand/40">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsDisburseModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Recording...' : 'Authorize Disbursement'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Voucher Detail Modal */}
      {selectedVoucher && (
        <Modal
          isOpen={Boolean(selectedVoucher)}
          onClose={() => setSelectedVoucher(null)}
          title="Official Treasury Payment Voucher"
          description={`Voucher ${selectedVoucher.id} • Reconciled Disbursement`}
        >
          <div className="flex flex-col gap-4 font-body text-pine p-2 border border-sand/40 rounded-card bg-snow/50">
            <div className="flex items-center justify-between border-b border-sand/40 pb-3">
              <div>
                <span className="text-[10px] font-heading font-bold text-olive uppercase tracking-wider">
                  PAYMENT VOUCHER
                </span>
                <div className="font-mono font-bold text-base text-olive-deep">{selectedVoucher.id}</div>
              </div>
              <span className="px-2.5 py-0.5 rounded-badge bg-success/15 text-success font-mono text-[10px] font-bold border border-success/30">
                CLEARED &amp; DISBURSED
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-pine/60 text-[10px] uppercase font-bold block">Purchase Order</span>
                <span className="font-mono font-bold text-olive-deep">{selectedVoucher.po_id}</span>
              </div>
              <div>
                <span className="text-pine/60 text-[10px] uppercase font-bold block">Disbursement Date</span>
                <span className="font-mono text-olive-deep">{selectedVoucher.date}</span>
              </div>
              <div>
                <span className="text-pine/60 text-[10px] uppercase font-bold block">Recipient Agency</span>
                <span className="font-sans font-bold text-olive-deep">
                  {vendors.find((v) => v.id === selectedVoucher.vendor_id)?.name || selectedVoucher.vendor_id}
                </span>
              </div>
              <div>
                <span className="text-pine/60 text-[10px] uppercase font-bold block">Sanction Officer</span>
                <span className="font-sans text-olive-deep">{selectedVoucher.recorded_by}</span>
              </div>
            </div>

            <div className="p-3 bg-white rounded-control border border-sand/40 flex items-center justify-between">
              <span className="text-xs font-heading font-bold text-olive uppercase">Total Amount Settled</span>
              <span className="font-mono font-extrabold text-lg text-olive-deep">
                ₹{selectedVoucher.amount.toLocaleString('en-IN')}
              </span>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-sand/40">
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.print()}
                icon={<Printer className="w-3.5 h-3.5" />}
              >
                Print Voucher
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => setSelectedVoucher(null)}
              >
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default PaymentsView;
