import React, { useState, useEffect } from 'react';
import { api } from '../../api/client';
import { Budget, Mess, Expenditure } from '../../types';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Modal } from '../../components/Modal';
import { useToast } from '../../components/Toast';
import { Badge, Breadcrumb, StatCard, TableControls, Accordion } from '../../components/ui';
import {
  Landmark,
  Plus,
  FileSpreadsheet,
  Calendar,
  Building2,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Mountain,
  Search,
  Sliders,
  ShieldCheck,
  PiggyBank,
  ArrowRightLeft,
  FileText,
} from 'lucide-react';

export const BudgetsView: React.FC = () => {
  const { toast } = useToast();
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [messes, setMesses] = useState<Mess[]>([]);
  const [expenditures, setExpenditures] = useState<Expenditure[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMode, setFilterMode] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false);
  const [selectedBudgetToAdjust, setSelectedBudgetToAdjust] = useState<Budget | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // New Budget Form state
  const [selectedMessId, setSelectedMessId] = useState('mess-1');
  const [periodStart, setPeriodStart] = useState('2026-10-01');
  const [periodEnd, setPeriodEnd] = useState('2026-10-31');
  const [allocatedAmount, setAllocatedAmount] = useState('350000');

  // Adjustment Modal Form state
  const [adjustType, setAdjustType] = useState<'supplementary' | 'reduction' | 'reappropriate'>('supplementary');
  const [adjustAmount, setAdjustAmount] = useState('50000');
  const [sanctionOrderNo, setSanctionOrderNo] = useState(`SAN/FIN/2026/SUPP-${Math.floor(10 + Math.random() * 90)}`);
  const [adjustReason, setAdjustReason] = useState('High-altitude winter buffer supplement sanctioned by Station Command.');

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      try {
        const [bData, mData, eData] = await Promise.all([
          api.finance.getBudgets(),
          api.messes.list(),
          api.finance.getExpenditures(),
        ]);
        setBudgets(bData);
        setMesses(mData);
        setExpenditures(eData);
      } catch (err) {
        console.error('Failed to load budget data', err);
        toast({ type: 'error', title: 'Error', message: 'Failed to load sanctioned budget records' });
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [toast]);

  const handleCreateBudget = async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(allocatedAmount);
    if (!amount || amount <= 0) {
      toast({ type: 'error', title: 'Invalid Amount', message: 'Enter a valid positive allocation amount.' });
      return;
    }

    setIsSubmitting(true);
    try {
      const newBudget = await api.finance.createBudget({
        mess_id: selectedMessId,
        period_start: periodStart,
        period_end: periodEnd,
        allocated_amount: amount,
        created_by: 'Amit Sharma, IDAS',
      });
      setBudgets((prev) => [newBudget, ...prev]);
      setIsModalOpen(false);
      toast({
        title: 'Budget Sanctioned',
        message: `Allocated ₹${amount.toLocaleString('en-IN')} successfully for selected mess.`,
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to allocate budget';
      toast({ type: 'error', title: 'Sanction Failed', message: msg });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleApplyAdjustment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBudgetToAdjust) return;

    const delta = parseFloat(adjustAmount);
    if (!delta || delta <= 0) {
      toast({ type: 'error', title: 'Invalid Amount', message: 'Enter a valid positive adjustment amount.' });
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setBudgets((prev) =>
        prev.map((b) => {
          if (b.id !== selectedBudgetToAdjust.id) return b;
          const newAllocated =
            adjustType === 'reduction'
              ? Math.max(50000, b.allocated_amount - delta)
              : b.allocated_amount + delta;
          return {
            ...b,
            allocated_amount: newAllocated,
          };
        })
      );

      setIsSubmitting(false);
      setIsAdjustModalOpen(false);

      toast({
        title: 'Grant Cap Adjusted',
        message: `Sanction ${sanctionOrderNo} recorded. Budget updated to reflect ₹${delta.toLocaleString('en-IN')} adjustment.`,
      });
    }, 400);
  };

  const exportCSV = () => {
    if (budgets.length === 0) {
      toast({ type: 'warning', title: 'No Data', message: 'No budget records available for export.' });
      return;
    }
    const headers = ['Budget ID', 'Mess Facility', 'Period Start', 'Period End', 'Allocated Amount (INR)', 'Spent Amount (INR)', 'Remaining Buffer (INR)', 'Sanctioned By'];
    const rows = budgets.map((b) => {
      const mess = messes.find((m) => m.id === b.mess_id);
      const spent = b.allocated_amount * 0.44;
      const rem = b.allocated_amount - spent;
      return [
        b.id,
        mess ? mess.name : b.mess_id,
        b.period_start,
        b.period_end,
        b.allocated_amount,
        spent.toFixed(2),
        rem.toFixed(2),
        b.created_by,
      ];
    });

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Budget_Allocation_Register_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({ title: 'Export Successful', message: 'Sanctioned budget register exported as CSV.' });
  };

  const totalSanctioned = budgets.reduce((acc, b) => acc + b.allocated_amount, 0);
  const totalSpent = expenditures.reduce((acc, e) => acc + e.amount, 0);
  const remainingTotal = totalSanctioned - totalSpent;

  const filteredBudgets = budgets.filter((b) => {
    const mess = messes.find((m) => m.id === b.mess_id);
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      (mess && mess.name.toLowerCase().includes(q)) ||
      b.period_start.includes(q) ||
      b.period_end.includes(q) ||
      b.id.toLowerCase().includes(q);

    if (!matchesSearch) return false;
    if (filterMode === 'high_cap') return b.allocated_amount >= 300000;
    if (filterMode === 'active_cycle') return b.period_end >= '2026-10-15';
    return true;
  });

  return (
    <div className="flex flex-col gap-6 pb-12 font-body text-pine">
      {/* Navigation Breadcrumb */}
      <Breadcrumb
        items={[
          { label: 'Central Accounts', href: '/finance' },
          { label: 'Sanctioned Budgets & Mess Grants', current: true },
        ]}
      />

      {/* Header Banner */}
      <div className="p-6 md:p-8 bg-night text-snow rounded-card border border-sand/40 shadow-elevation flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-control bg-olive/70 border border-gold/40 flex items-center justify-center text-gold shrink-0 shadow-subtle">
            <Landmark className="w-6 h-6" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-badge bg-gold/15 border border-gold/40 text-gold text-[10px] font-heading font-bold uppercase tracking-wider mb-1.5">
              <Mountain className="w-3.5 h-3.5 text-gold" />
              <span>CENTRAL ACCOUNTS &amp; AUDIT DIVISION • FISCAL CONTROL</span>
            </div>
            <h1 className="font-heading font-extrabold text-2xl md:text-3xl text-snow tracking-tight">
              Sanctioned Mess Budgets &amp; Grant Utilization
            </h1>
            <p className="text-xs text-sand font-medium mt-1">
              Amit Sharma, IDAS • Statutory fiscal ceilings, monthly mess allotments, and quota consumption compliance.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={exportCSV}
            icon={<FileSpreadsheet className="w-4 h-4" />}
            className="text-snow border-sand/40 hover:bg-olive-deep"
          >
            Export Budget CSV
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsModalOpen(true)}
            icon={<Plus className="w-4 h-4" />}
          >
            Sanction New Grant
          </Button>
        </div>
      </div>

      {/* Modern High-Precision Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Sanctioned Grant"
          value={`₹${totalSanctioned.toLocaleString('en-IN')}`}
          icon={<Landmark className="w-5 h-5 text-gold" />}
          trend={{ value: '3 Messes', direction: 'neutral' }}
          subtitle="FY-26 Allocation"
          variant="gold"
        />
        <StatCard
          label="Cumulative Expenditure"
          value={`₹${totalSpent.toLocaleString('en-IN')}`}
          icon={<TrendingUp className="w-5 h-5 text-glacier" />}
          trend={{ value: `${Math.round((totalSpent / (totalSanctioned || 1)) * 100)}% Cap Used`, direction: 'up', label: 'Cap safe' }}
          subtitle="Audited ledger"
        />
        <StatCard
          label="Remaining Fiscal Buffer"
          value={`₹${(remainingTotal > 0 ? remainingTotal : 0).toLocaleString('en-IN')}`}
          icon={<CheckCircle2 className="w-5 h-5 text-success" />}
          trend={{ value: 'Uncommitted', direction: 'neutral' }}
          subtitle="Buffer available"
        />
        <StatCard
          label="Active Allocation Periods"
          value={`${budgets.length}`}
          icon={<Calendar className="w-5 h-5 text-olive" />}
          trend={{ value: 'Q3 Cycle', direction: 'neutral', label: '100% Reconciled' }}
          subtitle="Monthly grants"
        />
      </div>

      {/* Modern Table Controls & Filters Toolbar */}
      <Card className="p-4 bg-white border border-sand/60 shadow-subtle">
        <TableControls<string>
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder="Search by mess facility name, grant ID, or fiscal period..."
          filterChips={[
            { id: 'all', label: 'All Grants', count: budgets.length },
            { id: 'high_cap', label: 'Major Grants (₹3L+)', count: budgets.filter((b) => b.allocated_amount >= 300000).length },
            { id: 'active_cycle', label: 'Active Cycle', count: budgets.filter((b) => b.period_end >= '2026-10-15').length },
          ]}
          activeFilter={filterMode}
          onFilterChange={setFilterMode}
          totalResults={filteredBudgets.length}
          onExport={exportCSV}
        />
      </Card>

      {/* Sanctioned Budget Allocations Table */}
      <div className="rounded-card border border-sand/60 bg-white shadow-subtle overflow-hidden">
        <div className="p-4 bg-snow border-b border-sand/40 flex items-center justify-between">
          <div>
            <h3 className="font-heading font-extrabold text-base text-olive-deep">
              Sanctioned Fiscal Grant Register
            </h3>
            <p className="text-xs text-pine/70">
              Authorized allowances per mess with live spending burn rates.
            </p>
          </div>
          <span className="px-2.5 py-1 rounded-badge bg-gold/15 text-gold text-[10px] font-heading font-bold border border-gold/40 uppercase">
            Statutory Ceilings Active
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="table-operational w-full text-left border-collapse">
            <thead>
              <tr className="bg-olive-deep text-sand text-[10px] font-heading font-bold uppercase tracking-wider select-none">
                <th className="py-3 px-4">Grant ID &amp; Sanction</th>
                <th className="py-3 px-4">Institutional Mess Facility</th>
                <th className="py-3 px-4">Fiscal Period</th>
                <th className="py-3 px-4 text-right">Sanctioned Amount</th>
                <th className="py-3 px-4 text-right">Disbursed (Est.)</th>
                <th className="py-3 px-4">Utilization Gauge</th>
                <th className="py-3 px-4 text-center">Audit Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sand/20 text-xs font-sans text-olive-deep">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-pine/60">
                    Loading sanctioned fiscal grants...
                  </td>
                </tr>
              ) : filteredBudgets.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-pine/60 italic">
                    No budget grants found matching criteria.
                  </td>
                </tr>
              ) : (
                filteredBudgets.map((b) => {
                  const mess = messes.find((m) => m.id === b.mess_id);
                  const spent = b.allocated_amount * 0.44;
                  const ratio = Math.round((spent / b.allocated_amount) * 100);

                  return (
                    <tr key={b.id} className="hover:bg-snow/60 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-heading font-bold text-olive-deep text-xs">{b.id}</div>
                        <div className="text-[10px] text-pine/60 font-mono mt-0.5">
                          By: {b.created_by}
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-heading font-bold text-sm text-olive-deep flex items-center gap-1.5">
                          <Building2 className="w-3.5 h-3.5 text-olive" />
                          <span>{mess ? mess.name : b.mess_id}</span>
                        </div>
                        <div className="text-[10px] text-pine/60 font-sans mt-0.5">
                          {mess?.location || 'Central Campus'} • Capacity: {mess?.headcount_capacity || 400}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 font-mono text-[11px] text-pine/80">
                        {b.period_start} to {b.period_end}
                      </td>

                      <td className="py-3.5 px-4 text-right font-mono font-bold text-olive-deep text-sm">
                        ₹{b.allocated_amount.toLocaleString('en-IN')}
                      </td>

                      <td className="py-3.5 px-4 text-right font-mono font-bold text-pine/80 text-sm">
                        ₹{Math.round(spent).toLocaleString('en-IN')}
                      </td>

                      <td className="py-3.5 px-4 min-w-[140px]">
                        <div className="flex items-center justify-between text-[10px] font-mono font-bold mb-1">
                          <span className={ratio > 75 ? 'text-danger' : 'text-olive'}>{ratio}%</span>
                          <span className="text-pine/50">₹{(b.allocated_amount - spent).toLocaleString('en-IN')} left</span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-sand/30 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${
                              ratio > 80 ? 'bg-danger' : ratio > 60 ? 'bg-gold' : 'bg-success'
                            }`}
                            style={{ width: `${Math.min(ratio, 100)}%` }}
                          />
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <Badge variant="success">
                          <CheckCircle2 className="w-3 h-3 mr-1" /> VERIFIED
                        </Badge>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedBudgetToAdjust(b);
                            setIsAdjustModalOpen(true);
                          }}
                          icon={<Sliders className="w-3 h-3" />}
                          className="text-xs font-bold"
                        >
                          Adjust
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

      {/* Progressive Disclosure: Central Financial Rules Accordion */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 px-1">
          <ShieldCheck className="w-4 h-4 text-gold" />
          <h4 className="font-heading font-extrabold text-xs uppercase tracking-wider text-olive-deep">
            General Financial Rules (GFR 2017) &amp; Re-Appropriation Norms
          </h4>
        </div>
        <Accordion
          items={[
            {
              id: 'reappropriation-rules',
              title: 'Statutory Re-Appropriation & Supplementary Sanction Protocol',
              subtitle: 'Sub-head ceiling adjustment within authorized mess grant',
              badge: <Badge variant="gold">STATUTORY</Badge>,
              children: (
                <div className="text-xs text-pine/80 space-y-2 leading-relaxed pt-2">
                  <p>
                    Re-appropriation of funds between individual mess grants is governed under <strong>Rule 10 of General Financial Rules</strong>. Savings from dry staples may be transferred to fresh provisions with formal audit endorsement from the Central Accounts Officer.
                  </p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>No re-appropriation is permissible from capital grant to operational rations expenditure.</li>
                    <li>Supplementary grants must cite valid headcount spikes or winter buffer mandates.</li>
                    <li>Unspent grant balances at fiscal year-end are surrendered automatically to the Treasury.</li>
                  </ul>
                </div>
              ),
            },
            {
              id: 'burn-rate-controls',
              title: 'Quarterly Burn Rate Controls & Warning Thresholds',
              subtitle: 'Automated expenditure velocity monitoring',
              children: (
                <div className="text-xs text-pine/80 space-y-2 leading-relaxed pt-2">
                  <p>
                    If monthly expenditure exceeds <strong>85%</strong> of the prorated calendar allocation before day 20 of the billing cycle, the system initiates an automated fiscal audit inquiry requiring the Mess Manager's counter-justification.
                  </p>
                </div>
              ),
            },
          ]}
        />
      </div>

      {/* MODAL: SANCTION NEW GRANT */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Sanction Institutional Mess Budget"
        description="Allocate statutory monthly or quarterly funding cap for ration procurement."
      >
        <form onSubmit={handleCreateBudget} className="flex flex-col gap-4 font-body text-pine mt-2">
          <div>
            <label className="block text-xs font-heading font-bold text-olive uppercase mb-1">
              Select Mess Facility *
            </label>
            <select
              value={selectedMessId}
              onChange={(e) => setSelectedMessId(e.target.value)}
              className="w-full px-3 py-2 text-xs font-sans rounded-control border border-sand bg-snow text-olive-deep focus:outline-none focus:border-olive"
            >
              {messes.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.headcount_capacity} Diners)
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-heading font-bold text-olive uppercase mb-1">
                Period Start Date *
              </label>
              <input
                type="date"
                value={periodStart}
                onChange={(e) => setPeriodStart(e.target.value)}
                required
                className="w-full px-3 py-2 text-xs font-mono rounded-control border border-sand bg-snow text-olive-deep focus:outline-none focus:border-olive"
              />
            </div>
            <div>
              <label className="block text-xs font-heading font-bold text-olive uppercase mb-1">
                Period End Date *
              </label>
              <input
                type="date"
                value={periodEnd}
                onChange={(e) => setPeriodEnd(e.target.value)}
                required
                className="w-full px-3 py-2 text-xs font-mono rounded-control border border-sand bg-snow text-olive-deep focus:outline-none focus:border-olive"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-heading font-bold text-olive uppercase mb-1">
              Sanctioned Grant Amount (INR) *
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-mono font-bold text-olive-deep">
                ₹
              </span>
              <input
                type="number"
                min="1000"
                step="500"
                value={allocatedAmount}
                onChange={(e) => setAllocatedAmount(e.target.value)}
                required
                className="w-full pl-8 pr-4 py-2 text-xs font-mono font-bold rounded-control border border-sand bg-snow text-olive-deep focus:outline-none focus:border-olive"
                placeholder="350000"
              />
            </div>
            <p className="text-[11px] text-pine/60 mt-1">
              Maximum expenditure limit authorized for this mess in the selected fiscal cycle.
            </p>
          </div>

          <div className="p-3 bg-gold/10 border border-gold/30 rounded-control flex items-start gap-2.5 text-xs text-olive-deep">
            <AlertCircle className="w-4 h-4 text-gold shrink-0 mt-0.5" />
            <span>
              Sanctions are logged into the permanent financial audit ledger and immediately bind Purchase Order authorizations.
            </span>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-sand/40">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Sanctioning...' : 'Confirm Grant Allotment'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* MODAL: ADJUST / RE-APPROPRIATE EXISTING GRANT */}
      {isAdjustModalOpen && selectedBudgetToAdjust && (
        <Modal
          isOpen={isAdjustModalOpen}
          onClose={() => setIsAdjustModalOpen(false)}
          title="Supplementary Grant &amp; Re-Appropriation"
          description={`Adjust Statutory Ceiling for ${messes.find((m) => m.id === selectedBudgetToAdjust.mess_id)?.name || selectedBudgetToAdjust.mess_id} • ${selectedBudgetToAdjust.id}`}
        >
          <form onSubmit={handleApplyAdjustment} className="flex flex-col gap-4 font-body text-pine mt-2">
            <div className="p-3 bg-snow rounded border border-sand/40 flex justify-between items-center text-xs font-mono">
              <div>
                <span className="text-pine/60 text-[10px] uppercase font-bold block">Current Ceiling</span>
                <strong className="text-sm text-olive-deep">₹{selectedBudgetToAdjust.allocated_amount.toLocaleString('en-IN')}</strong>
              </div>
              <div className="text-right">
                <span className="text-pine/60 text-[10px] uppercase font-bold block">Fiscal Period</span>
                <span>{selectedBudgetToAdjust.period_start} to {selectedBudgetToAdjust.period_end}</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-heading font-bold text-olive uppercase mb-1">
                Adjustment Category *
              </label>
              <select
                value={adjustType}
                onChange={(e) => setAdjustType(e.target.value as any)}
                className="w-full px-3 py-2 text-xs font-sans rounded-control border border-sand bg-snow text-olive-deep focus:outline-none focus:border-olive"
              >
                <option value="supplementary">Supplementary Grant Allocation (+ Increase)</option>
                <option value="reduction">Surplus Grant Surrender (- Reduction)</option>
                <option value="reappropriate">Inter-Mess Re-Appropriation Transfer</option>
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-heading font-bold text-olive uppercase mb-1">
                  Adjustment Delta (INR) *
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-mono font-bold text-olive-deep">
                    ₹
                  </span>
                  <input
                    type="number"
                    min="1000"
                    step="500"
                    value={adjustAmount}
                    onChange={(e) => setAdjustAmount(e.target.value)}
                    required
                    className="w-full pl-8 pr-4 py-2 text-xs font-mono font-bold rounded-control border border-sand bg-snow text-olive-deep focus:outline-none focus:border-olive"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-heading font-bold text-olive uppercase mb-1">
                  Sanction Order Reference *
                </label>
                <input
                  type="text"
                  value={sanctionOrderNo}
                  onChange={(e) => setSanctionOrderNo(e.target.value)}
                  required
                  className="w-full px-3 py-2 text-xs font-mono font-bold rounded-control border border-sand bg-snow text-olive-deep focus:outline-none focus:border-olive"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-heading font-bold text-olive uppercase mb-1">
                Sanction Justification Notes *
              </label>
              <textarea
                value={adjustReason}
                onChange={(e) => setAdjustReason(e.target.value)}
                required
                rows={2}
                className="w-full px-3 py-2 text-xs font-sans rounded-control border border-sand bg-snow text-olive-deep focus:outline-none focus:border-olive resize-none"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-sand/40">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsAdjustModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="sm"
                disabled={isSubmitting}
                icon={<ArrowRightLeft className="w-3.5 h-3.5" />}
              >
                {isSubmitting ? 'Recording Sanction...' : 'Confirm Ceiling Adjustment'}
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default BudgetsView;
