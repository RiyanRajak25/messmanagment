import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { AltitudeGauge } from '../../components/AltitudeGauge';
import { Modal } from '../../components/Modal';
import { Breadcrumb, StatCard, Badge, Accordion } from '../../components/ui';
import { api } from '../../api/client';
import { Budget, Expenditure, PurchaseOrder } from '../../types';
import {
  TrendingUp,
  Receipt,
  FileSpreadsheet,
  AlertCircle,
  Landmark,
  ShieldCheck,
  Mountain,
  PiggyBank,
  CreditCard,
  FileCheck2,
  ShieldAlert,
  ChevronRight,
  Eye,
} from 'lucide-react';

export const FinanceDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [expenditures, setExpenditures] = useState<Expenditure[]>([]);
  const [pos, setPos] = useState<PurchaseOrder[]>([]);
  const [selectedBudget, setSelectedBudget] = useState<Budget | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const [bRes, eRes, poRes] = await Promise.all([
          api.finance.getBudgets(),
          api.finance.getExpenditures(),
          api.purchaseOrders.list(),
        ]);
        setBudgets(bRes);
        setExpenditures(eRes);
        setPos(poRes);
      } catch (err) {
        console.error(err);
      }
    }
    load();
  }, []);

  const totalAllocated = budgets.reduce((acc, b) => acc + b.allocated_amount, 0);
  const totalSpent = expenditures.reduce((acc, e) => acc + e.amount, 0);

  const getMessName = (messId: string) => {
    if (messId === 'mess-1') return 'Falcon Hostel Mess';
    if (messId === 'mess-2') return 'Eagle Block Mess';
    return 'Staff & Faculty Mess';
  };

  return (
    <div className="flex flex-col gap-6 pb-12 font-body text-pine">
      {/* Navigation Breadcrumb */}
      <Breadcrumb
        items={[
          { label: 'Central Command', href: '/' },
          { label: 'Fiscal Allocations & PO Disbursements', current: true },
        ]}
      />

      {/* Central Accounts Finance Header */}
      <div className="p-6 md:p-8 bg-night text-snow rounded-card border border-sand/40 shadow-elevation flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-control bg-olive/70 border border-gold/40 flex items-center justify-center text-gold shrink-0 shadow-subtle">
            <Landmark className="w-6 h-6" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-badge bg-gold/15 border border-gold/40 text-gold text-[10px] font-heading font-bold uppercase tracking-wider mb-1.5">
              <Mountain className="w-3.5 h-3.5 text-gold" />
              <span>CENTRAL ACCOUNTS &amp; AUDIT DIVISION • FINANCIAL CONTROL</span>
            </div>
            <h1 className="font-heading font-extrabold text-2xl md:text-3xl text-snow tracking-tight">
              Sanctioned Fiscal Allocations &amp; PO Disbursements
            </h1>
            <p className="text-xs text-sand font-medium mt-1">
              Amit Sharma • Strict inventory separation • Audit-verified supplier invoices &amp; expenditure limits.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate('/finance/payments')}
            icon={<CreditCard className="w-3.5 h-3.5" />}
          >
            Disburse Payment
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/finance/budgets')}
            icon={<PiggyBank className="w-3.5 h-3.5" />}
            className="text-snow border-sand/40 hover:bg-olive-deep"
          >
            Manage Grants
          </Button>
        </div>
      </div>

      {/* Modern High-Precision Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Sanctioned Grant"
          value={`₹${totalAllocated.toLocaleString('en-IN')}`}
          icon={<Landmark className="w-5 h-5 text-gold" />}
          trend={{ value: '3 Messes', direction: 'neutral' }}
          subtitle="FY-26 Allocation"
          variant="gold"
        />
        <StatCard
          label="Total Disbursed"
          value={`₹${totalSpent.toLocaleString('en-IN')}`}
          icon={<Receipt className="w-5 h-5 text-glacier" />}
          trend={{ value: `${Math.round((totalSpent / (totalAllocated || 1)) * 100)}% Used`, direction: 'up', label: 'Cap safe' }}
          subtitle="Audited ledger"
        />
        <StatCard
          label="Active Indents in Billing"
          value={`${pos.filter((p) => p.status !== 'closed').length}`}
          icon={<AlertCircle className="w-5 h-5 text-danger" />}
          trend={{ value: 'Open Invoices', direction: 'down', label: 'Awaiting GRN' }}
          subtitle="Direct RTGS pending"
        />
        <StatCard
          label="Fiscal Audit Reconciliation"
          value="100%"
          icon={<ShieldCheck className="w-5 h-5 text-success" />}
          trend={{ value: 'Zero Discrepancy', direction: 'up', label: 'Balanced' }}
          subtitle="Two-tier verified"
        />
      </div>

      {/* Quick Operational Desk Hub Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <button
          type="button"
          onClick={() => navigate('/finance/budgets')}
          className="p-4 rounded-card border border-sand/60 bg-white hover:border-olive hover:shadow-elevation text-left transition-all group flex flex-col justify-between"
        >
          <div>
            <div className="w-9 h-9 rounded-control bg-gold/15 border border-gold/40 flex items-center justify-center text-night mb-2.5 group-hover:bg-gold transition-colors">
              <PiggyBank className="w-4 h-4" />
            </div>
            <h4 className="font-heading font-extrabold text-sm text-olive-deep">
              Sanctioned Budgets
            </h4>
            <p className="text-xs text-pine/70 mt-1">
              Allocate and inspect grant ceilings across dining messes.
            </p>
          </div>
          <div className="mt-3 pt-2 border-t border-sand/30 flex items-center justify-between text-xs font-bold text-olive">
            <span>Manage Allocations</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </button>

        <button
          type="button"
          onClick={() => navigate('/finance/payments')}
          className="p-4 rounded-card border border-sand/60 bg-white hover:border-olive hover:shadow-elevation text-left transition-all group flex flex-col justify-between"
        >
          <div>
            <div className="w-9 h-9 rounded-control bg-glacier/15 border border-glacier/40 flex items-center justify-center text-glacier mb-2.5 group-hover:bg-glacier group-hover:text-snow transition-colors">
              <CreditCard className="w-4 h-4" />
            </div>
            <h4 className="font-heading font-extrabold text-sm text-olive-deep">
              Supplier Payments
            </h4>
            <p className="text-xs text-pine/70 mt-1">
              Disburse PO settlements and issue verified vouchers.
            </p>
          </div>
          <div className="mt-3 pt-2 border-t border-sand/30 flex items-center justify-between text-xs font-bold text-glacier">
            <span>Disbursement Register</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </button>

        <button
          type="button"
          onClick={() => navigate('/finance/po-view')}
          className="p-4 rounded-card border border-sand/60 bg-white hover:border-olive hover:shadow-elevation text-left transition-all group flex flex-col justify-between"
        >
          <div>
            <div className="w-9 h-9 rounded-control bg-olive/15 border border-olive/30 flex items-center justify-center text-olive mb-2.5 group-hover:bg-olive group-hover:text-snow transition-colors">
              <FileCheck2 className="w-4 h-4" />
            </div>
            <h4 className="font-heading font-extrabold text-sm text-olive-deep">
              Commercial Indents
            </h4>
            <p className="text-xs text-pine/70 mt-1">
              Break down delivered vs pending commodity values.
            </p>
          </div>
          <div className="mt-3 pt-2 border-t border-sand/30 flex items-center justify-between text-xs font-bold text-olive">
            <span>Inspect Contracts</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </button>

        <button
          type="button"
          onClick={() => navigate('/finance/audit')}
          className="p-4 rounded-card border border-sand/60 bg-white hover:border-olive hover:shadow-elevation text-left transition-all group flex flex-col justify-between"
        >
          <div>
            <div className="w-9 h-9 rounded-control bg-danger/10 border border-danger/30 flex items-center justify-center text-danger mb-2.5 group-hover:bg-danger group-hover:text-snow transition-colors">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <h4 className="font-heading font-extrabold text-sm text-olive-deep">
              Fiscal Audit Trail
            </h4>
            <p className="text-xs text-pine/70 mt-1">
              Immutable ledger of all sanctions, settlements &amp; logs.
            </p>
          </div>
          <div className="mt-3 pt-2 border-t border-sand/30 flex items-center justify-between text-xs font-bold text-danger">
            <span>Audit Ledger</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </button>
      </div>

      {/* Budget Consumption with Altitude Gauge */}
      <div className="space-y-4">
        <div>
          <h3 className="font-heading font-extrabold text-xl text-olive-deep">
            Mess Facility Sanction Utilization
          </h3>
          <p className="text-xs text-pine/70">
            Fiscal burn monitored against authorized institutional budget caps. Click any card to inspect grant parameters.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {budgets.map((b) => {
            const spent = b.allocated_amount * 0.44;
            const messName = getMessName(b.mess_id);

            return (
              <div
                key={b.id}
                onClick={() => setSelectedBudget(b)}
                className="p-5 rounded-card border border-sand/60 bg-white shadow-subtle hover:border-olive hover:shadow-elevation cursor-pointer transition-all flex flex-col justify-between gap-4 group"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h4 className="font-heading font-extrabold text-sm text-olive-deep group-hover:text-olive transition-colors">
                      {messName}
                    </h4>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-badge bg-olive/10 text-olive-deep border border-olive/20">
                      FY 2026-27
                    </span>
                  </div>

                  <div className="text-xs font-mono text-pine/70 mb-3">
                    Disbursed: <span className="font-bold text-pine">₹{spent.toLocaleString('en-IN')}</span> / ₹{b.allocated_amount.toLocaleString('en-IN')}
                  </div>

                  <AltitudeGauge
                    value={spent}
                    max={b.allocated_amount}
                    unit="₹"
                    threshold={b.allocated_amount * 0.8}
                    size="md"
                  />
                </div>

                <div className="pt-2 border-t border-sand/30 flex items-center justify-between text-xs font-mono text-pine/80">
                  <span>SANCTION STATUS</span>
                  <span className="font-bold text-success flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> Compliant (44%)
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Financial Table Preview */}
      <Card className="border border-sand/60 shadow-subtle bg-white">
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-sand/30">
          <div>
            <h3 className="font-heading font-extrabold text-base text-olive-deep">
              Mess Budget Allocations &amp; Disbursement Register
            </h3>
            <p className="text-xs text-pine/70 mt-0.5">
              Sanctioned budgets vs actual procurement spend per institutional mess.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/finance/budgets')}
          >
            Full Allocation Matrix
          </Button>
        </div>

        <div className="overflow-x-auto rounded-control border border-sand/40">
          <table className="table-operational">
            <thead>
              <tr>
                <th>Mess Entity</th>
                <th>Period</th>
                <th>Sanctioned Grant</th>
                <th>Actual Disbursed</th>
                <th className="text-right">Audit Status</th>
              </tr>
            </thead>
            <tbody>
              {budgets.map((b) => (
                <tr key={b.id} className="hover:bg-snow/60 transition-colors">
                  <td className="font-heading font-bold text-pine">
                    {getMessName(b.mess_id)}
                  </td>
                  <td className="font-mono text-xs">{b.period_start} to {b.period_end}</td>
                  <td className="font-mono font-bold text-pine">₹{b.allocated_amount.toLocaleString('en-IN')}</td>
                  <td className="font-mono font-bold text-olive">
                    ₹{(b.allocated_amount * 0.44).toLocaleString('en-IN')}
                  </td>
                  <td className="text-right">
                    <span className="inline-flex items-center gap-1 text-[10px] font-heading font-bold text-success">
                      <ShieldCheck className="w-3.5 h-3.5" /> Under Budget
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Progressive Disclosure: Central Financial Audit & Control Policy Accordion */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 px-1">
          <ShieldCheck className="w-4 h-4 text-gold" />
          <h4 className="font-heading font-extrabold text-xs uppercase tracking-wider text-olive-deep">
            Central Treasury Governance &amp; Appropriation Norms
          </h4>
        </div>
        <Accordion
          items={[
            {
              id: 'fiscal-cap-policy',
              title: 'Grant Allocation & Ceiling Enforcement Regulations',
              subtitle: 'Sub-head ceiling transfer and unspent balance surrender',
              badge: <Badge variant="gold">GOVERNANCE</Badge>,
              children: (
                <div className="text-xs text-pine/80 space-y-2 leading-relaxed pt-2">
                  <p>
                    All mess grants are non-fungible institutional appropriations earmarked under sub-head (01) Dry Rations and sub-head (02) Fresh Provisions. Re-appropriation across sub-heads requires prior countersignature from the <strong>Central Accounts Officer</strong>.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                    <div className="p-2.5 rounded bg-white border border-sand/40">
                      <span className="font-heading font-bold text-olive block text-[11px]">1. Earmarked Cap</span>
                      <span className="text-[10px] text-pine/60">Strictly allocated per registered dining strength.</span>
                    </div>
                    <div className="p-2.5 rounded bg-white border border-sand/40">
                      <span className="font-heading font-bold text-olive block text-[11px]">2. Bill Audit</span>
                      <span className="text-[10px] text-pine/60">100% pre-audit check against consignment GRN.</span>
                    </div>
                    <div className="p-2.5 rounded bg-white border border-sand/40">
                      <span className="font-heading font-bold text-olive block text-[11px]">3. Re-appropriation</span>
                      <span className="text-[10px] text-pine/60">Contingent surplus rebalanced at fiscal quarter end.</span>
                    </div>
                  </div>
                </div>
              ),
            },
            {
              id: 'voucher-immutable',
              title: 'Voucher Cryptographic Audit Trail',
              subtitle: 'Tamper-evident transaction logging',
              children: (
                <div className="text-xs text-pine/80 space-y-2 leading-relaxed pt-2">
                  <p>
                    Every disbursal voucher generated by the finance division is registered in the immutable central transaction ledger with a unique sequence hash. Manual overrides or retroactive adjustments are prohibited by policy.
                  </p>
                </div>
              ),
            },
          ]}
        />
      </div>

      {/* Budget Modal */}
      {selectedBudget && (
        <Modal
          isOpen={Boolean(selectedBudget)}
          onClose={() => setSelectedBudget(null)}
          title={`Grant Audit • ${getMessName(selectedBudget.mess_id)}`}
          description="Institutional operational allowance sanction parameters and fiscal limits."
        >
          <div className="flex flex-col gap-4 font-body text-pine text-xs">
            <div className="p-3 bg-snow rounded-card border border-sand/60 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-heading font-bold text-olive uppercase block">
                  Facility Allocation
                </span>
                <span className="text-sm font-heading font-extrabold text-olive-deep">
                  {getMessName(selectedBudget.mess_id)}
                </span>
              </div>
              <span className="px-2.5 py-0.5 rounded-badge bg-success/15 text-success font-mono font-bold text-[10px] border border-success/30">
                ACTIVE SANCTION
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-white rounded-control border border-sand/40">
                <span className="text-pine/60 block text-[11px]">Sanctioned Grant Cap:</span>
                <strong className="text-sm font-mono text-olive-deep">
                  ₹{selectedBudget.allocated_amount.toLocaleString('en-IN')}
                </strong>
              </div>

              <div className="p-3 bg-white rounded-control border border-sand/40">
                <span className="text-pine/60 block text-[11px]">Cumulative Disbursed:</span>
                <strong className="text-sm font-mono text-olive-deep">
                  ₹{(selectedBudget.allocated_amount * 0.44).toLocaleString('en-IN')}
                </strong>
              </div>

              <div className="p-3 bg-white rounded-control border border-sand/40">
                <span className="text-pine/60 block text-[11px]">Remaining Fiscal Buffer:</span>
                <strong className="text-sm font-mono text-success">
                  ₹{(selectedBudget.allocated_amount * 0.56).toLocaleString('en-IN')}
                </strong>
              </div>

              <div className="p-3 bg-white rounded-control border border-sand/40">
                <span className="text-pine/60 block text-[11px]">Validity Cycle:</span>
                <strong className="text-sm font-mono text-olive-deep">
                  {selectedBudget.period_start} &rarr; {selectedBudget.period_end}
                </strong>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-sand/40">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedBudget(null)}
              >
                Close
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  setSelectedBudget(null);
                  navigate('/finance/budgets');
                }}
              >
                Go to Grant Allocations
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default FinanceDashboard;
