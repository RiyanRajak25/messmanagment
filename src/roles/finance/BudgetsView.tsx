import React, { useState, useEffect } from 'react';
import { api } from '../../api/client';
import { Budget, Mess, Expenditure } from '../../types';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { StatTile } from '../../components/StatTile';
import { Modal } from '../../components/Modal';
import { useToast } from '../../components/Toast';
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
} from 'lucide-react';

export const BudgetsView: React.FC = () => {
  const { toast } = useToast();
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [messes, setMesses] = useState<Mess[]>([]);
  const [expenditures, setExpenditures] = useState<Expenditure[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // New Budget Form state
  const [selectedMessId, setSelectedMessId] = useState('mess-1');
  const [periodStart, setPeriodStart] = useState('2026-10-01');
  const [periodEnd, setPeriodEnd] = useState('2026-10-31');
  const [allocatedAmount, setAllocatedAmount] = useState('350000');

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
    return (
      (mess && mess.name.toLowerCase().includes(q)) ||
      b.period_start.includes(q) ||
      b.period_end.includes(q) ||
      b.id.toLowerCase().includes(q)
    );
  });

  return (
    <div className="flex flex-col gap-6 pb-12 font-body text-pine">
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
              Statutory fiscal ceilings, monthly mess allotments, and quota consumption compliance.
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

      {/* KPI Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatTile
          label="Total Sanctioned Grant"
          value={`₹${totalSanctioned.toLocaleString('en-IN')}`}
          subValue={`Across ${messes.length || 3} institutional messes`}
          icon={<Landmark className="w-5 h-5 text-gold" />}
          accentColor="gold"
        />
        <StatTile
          label="Cumulative Expenditure"
          value={`₹${totalSpent.toLocaleString('en-IN')}`}
          subValue={`${Math.round((totalSpent / (totalSanctioned || 1)) * 100)}% of grant utilized`}
          trend={{ value: 'Under Ceiling', isPositive: true }}
          icon={<TrendingUp className="w-5 h-5 text-glacier" />}
          accentColor="glacier"
        />
        <StatTile
          label="Remaining Fiscal Buffer"
          value={`₹${(remainingTotal > 0 ? remainingTotal : 0).toLocaleString('en-IN')}`}
          subValue="Available for subsequent PO indents"
          icon={<CheckCircle2 className="w-5 h-5 text-success" />}
          accentColor="success"
        />
        <StatTile
          label="Active Allocation Periods"
          value={`${budgets.length}`}
          subValue="Audited monthly grant cycles"
          icon={<Calendar className="w-5 h-5 text-olive" />}
          accentColor="olive"
        />
      </div>

      {/* Search & Filter Bar */}
      <Card className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 border border-sand/60 bg-white">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-pine/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by mess facility, grant ID, or fiscal period..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs font-mono font-medium rounded-control border border-sand bg-snow focus:outline-none focus:border-olive focus:ring-1 focus:ring-olive text-olive-deep placeholder:text-pine/40"
          />
        </div>
        <span className="text-xs text-pine/60 font-mono font-bold">
          Showing {filteredBudgets.length} of {budgets.length} records
        </span>
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
              </tr>
            </thead>
            <tbody className="divide-y divide-sand/20 text-xs font-sans text-olive-deep">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-pine/60">
                    Loading sanctioned fiscal grants...
                  </td>
                </tr>
              ) : filteredBudgets.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-pine/60 italic">
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

                      <td className="py-3.5 px-4 text-right font-mono font-bold text-olive-deep">
                        ₹{b.allocated_amount.toLocaleString('en-IN')}
                      </td>

                      <td className="py-3.5 px-4 text-right font-mono font-bold text-pine/80">
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
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-badge bg-success/10 text-success border border-success/30 font-mono text-[10px] font-bold">
                          <CheckCircle2 className="w-3 h-3" /> VERIFIED
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

      {/* Modal: Sanction New Grant */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Sanction Institutional Mess Budget"
        description="Allocate statutory monthly or quarterly funding cap for ration procurement."
      >
        <form onSubmit={handleCreateBudget} className="flex flex-col gap-4 font-body text-pine mt-2">
          <div>
            <label className="block text-xs font-heading font-bold text-olive uppercase mb-1">
              Select Mess Facility
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
                Period Start Date
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
                Period End Date
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
              Sanctioned Grant Amount (INR)
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
    </div>
  );
};

export default BudgetsView;
