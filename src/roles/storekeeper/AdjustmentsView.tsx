import React, { useEffect, useState } from 'react';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { PortionStepper } from '../../components/PortionStepper';
import { api } from '../../api/client';
import { DerivedStock, StockTransaction } from '../../types';
import { useToast } from '../../components/Toast';
import { useNavigate } from 'react-router-dom';
import {
  SlidersHorizontal,
  AlertOctagon,
  AlertTriangle,
  ArrowLeft,
  Package,
  History,
  ShieldCheck,
  Trash2,
  Scale,
  Mountain,
} from 'lucide-react';

const REASON_CODES = [
  { value: 'wastage', label: 'Wastage (Depot handling / high-altitude loss)', icon: Trash2 },
  { value: 'damage', label: 'Damage (Transit puncture, crushed bags)', icon: Package },
  { value: 'spoilage', label: 'Spoilage (Moisture, contamination, cold rot)', icon: AlertTriangle },
  { value: 'count_correction', label: 'Count Correction (Formal physical board audit)', icon: Scale },
] as const;

export const AdjustmentsView: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const [stock, setStock] = useState<DerivedStock[]>([]);
  const [recentAdjustments, setRecentAdjustments] = useState<StockTransaction[]>([]);
  const [selectedItemId, setSelectedItemId] = useState<string>('');
  const [adjustQty, setAdjustQty] = useState<number>(5);
  const [reasonCode, setReasonCode] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      try {
        const [stockList, txList] = await Promise.all([
          api.inventory.getStock(),
          api.inventory.getTransactions(),
        ]);
        setStock(stockList);
        const adjustments = txList.filter((tx) => tx.type === 'adjustment');
        setRecentAdjustments(adjustments.slice(0, 10));

        if (stockList.length > 0) {
          setSelectedItemId(stockList[0].item_id);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  const selectedStock = stock.find((s) => s.item_id === selectedItemId);
  const currentAvailable = selectedStock?.quantity_on_hand || 0;
  const isOverStock = adjustQty > currentAvailable;
  const canSubmit = selectedItemId && adjustQty > 0 && reasonCode !== '' && !isOverStock && !isSubmitting;

  const handleAdjustSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit || !selectedStock) return;

    setIsSubmitting(true);
    try {
      await api.inventory.adjust({
        item_id: selectedItemId,
        quantity: adjustQty,
        reason_code: reasonCode,
      });

      toast({
        title: 'Stock Adjustment Recorded',
        message: `${adjustQty} ${selectedStock.item.unit} adjusted for ${selectedStock.item.name} (${reasonCode}). Written to immutable audit trail.`,
      });

      const [updatedStock, updatedTxs] = await Promise.all([
        api.inventory.getStock(),
        api.inventory.getTransactions(),
      ]);
      setStock(updatedStock);
      setRecentAdjustments(updatedTxs.filter((tx) => tx.type === 'adjustment').slice(0, 10));

      setAdjustQty(5);
      setReasonCode('');
      setNotes('');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Adjustment failed';
      toast({ type: 'error', title: 'Adjustment Error', message: msg });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3">
        <div className="w-10 h-10 border-3 border-olive border-t-gold rounded-full animate-spin" />
        <span className="font-heading font-bold text-xs uppercase tracking-wider text-olive">
          Loading Silo Inventory for Reconciliation...
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 pb-12 max-w-5xl mx-auto font-body text-pine">
      {/* Header */}
      <div className="p-6 md:p-8 bg-night text-snow rounded-card border border-sand/40 shadow-elevation flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-control bg-danger/20 border border-danger/40 flex items-center justify-center text-danger shrink-0 shadow-subtle">
            <SlidersHorizontal className="w-6 h-6" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-badge bg-danger/15 border border-danger/40 text-snow text-[10px] font-heading font-bold uppercase tracking-wider mb-1.5">
              <Mountain className="w-3 h-3 text-gold" />
              <span>CENTRAL SUPPLY DEPOT • CONDEMNATION &amp; WRITE-OFF</span>
            </div>
            <h1 className="font-heading font-extrabold text-2xl md:text-3xl text-snow tracking-tight">
              Stock Adjustments &amp; Condemnations
            </h1>
            <p className="text-xs text-sand font-medium mt-1">
              Record transit damage, wastage, and audit corrections • Mandatory regulatory reason codes • Immutable ledger.
            </p>
          </div>
        </div>

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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Form */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <Card className="flex flex-col gap-6 border border-sand/60 shadow-subtle">
            <div>
              <h3 className="font-heading font-extrabold text-base text-olive-deep flex items-center gap-2">
                <SlidersHorizontal className="w-5 h-5 text-danger" />
                <span>Record Stock Condemnation or Discrepancy</span>
              </h3>
              <p className="text-xs text-pine/70 mt-0.5">
                Every write-off registers an append-only transaction in the ledger. Physical stock is never modified without audit trails.
              </p>
            </div>

            <form onSubmit={handleAdjustSubmit} className="flex flex-col gap-5">
              {/* Item Selector */}
              <div>
                <label className="block text-xs font-heading font-bold uppercase tracking-wider text-olive mb-1.5">
                  1. Select Ration Commodity <span className="text-danger">*</span>
                </label>
                <div className="relative">
                  <select
                    value={selectedItemId}
                    onChange={(e) => setSelectedItemId(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-control border border-sand bg-snow font-heading font-semibold text-xs text-pine focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold appearance-none"
                  >
                    {stock.map((s) => (
                      <option key={s.item_id} value={s.item_id}>
                        {s.item.name} ({s.item.category.replace('_', ' ')}) — On Hand: {s.quantity_on_hand} {s.item.unit}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-pine/60 text-xs">
                    ▼
                  </div>
                </div>
              </div>

              {/* Current Reserve Snapshot */}
              {selectedStock && (
                <div className="p-4 rounded-control bg-snow border border-sand/40 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Package className="w-6 h-6 text-olive" />
                    <div>
                      <h4 className="font-heading font-extrabold text-sm text-olive-deep">
                        {selectedStock.item.name}
                      </h4>
                      <p className="text-xs text-pine/70 font-mono">
                        Shelf life: {selectedStock.item.shelf_life_days} days • Reorder threshold: {selectedStock.item.reorder_threshold} {selectedStock.item.unit}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-pine/70 block">
                      Current Depot Stock
                    </span>
                    <span className="font-mono font-bold text-lg text-olive-deep tabular-nums">
                      {currentAvailable} {selectedStock.item.unit}
                    </span>
                  </div>
                </div>
              )}

              {/* Adjustment Quantity Stepper */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-heading font-bold uppercase tracking-wider text-olive">
                    2. Quantity to Condemn / Adjust <span className="text-danger">*</span>
                  </label>
                  <span className="text-xs font-mono text-pine/70">
                    Base unit: {selectedStock?.item.unit}
                  </span>
                </div>

                <div className="flex items-center gap-4">
                  <PortionStepper
                    value={adjustQty}
                    unit={selectedStock?.item.unit || 'kg'}
                    step={1}
                    min={1}
                    max={currentAvailable * 2}
                    onChange={(val) => setAdjustQty(val)}
                  />

                  {/* Quick-set buttons */}
                  <div className="flex items-center gap-1.5">
                    {[1, 5, 10, 25].map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => setAdjustQty(preset)}
                        className="px-2.5 py-1 text-xs font-heading font-bold rounded-control border border-sand/60 bg-snow hover:bg-gold hover:text-night hover:border-gold transition-all"
                      >
                        {preset} {selectedStock?.item.unit}
                      </button>
                    ))}
                  </div>
                </div>

                {isOverStock && (
                  <p className="mt-2 text-xs font-heading font-bold text-danger flex items-center gap-1">
                    <AlertOctagon className="w-4 h-4" />
                    Cannot adjust {adjustQty} {selectedStock?.item.unit}: Only {currentAvailable} {selectedStock?.item.unit} on hand in Central Depot.
                  </p>
                )}
              </div>

              {/* Mandatory Reason Code */}
              <div>
                <label className="block text-xs font-heading font-bold uppercase tracking-wider text-olive mb-1.5">
                  3. Reason Code <span className="text-danger">* (Strictly Mandatory for Audit)</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {REASON_CODES.map((reason) => {
                    const isSelected = reasonCode === reason.value;
                    const Icon = reason.icon;
                    return (
                      <button
                        key={reason.value}
                        type="button"
                        onClick={() => setReasonCode(reason.value)}
                        className={`p-3.5 rounded-control border text-left transition-all flex items-center gap-3 ${
                          isSelected
                            ? 'border-olive bg-olive/10 shadow-subtle ring-2 ring-olive/20'
                            : 'border-sand/40 bg-white hover:border-sand hover:bg-snow/50'
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-control flex items-center justify-center shrink-0 ${isSelected ? 'bg-olive text-snow' : 'bg-sand/20 text-olive'}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-heading font-extrabold text-xs text-olive-deep">
                            {reason.label}
                          </div>
                          <span className="text-[10px] font-mono text-pine/70 uppercase tracking-wider">
                            Code: {reason.value}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
                {!reasonCode && (
                  <p className="mt-1.5 text-xs text-danger font-medium">
                    Select an official reason code before adjustment can be committed.
                  </p>
                )}
              </div>

              {/* Optional Audit Notes */}
              <div>
                <label className="block text-xs font-heading font-bold uppercase tracking-wider text-olive mb-1.5">
                  4. Quartermaster Verification Remarks (Optional)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Bag puncture identified on Pallet C-2 during morning cold-store inventory inspection."
                  rows={2}
                  className="w-full px-3.5 py-2 rounded-control border border-sand bg-snow text-xs font-medium text-pine placeholder:text-pine/50 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  disabled={!canSubmit}
                  className="w-full text-sm py-3 font-heading font-bold shadow-subtle"
                  icon={<AlertOctagon className="w-5 h-5 stroke-[2.5]" />}
                >
                  {isSubmitting ? 'Recording Condemnation...' : 'Commit Stock Write-Off to Ledger'}
                </Button>
              </div>
            </form>
          </Card>
        </div>

        {/* Right Col: Guidelines & Recent Audit Log */}
        <div className="flex flex-col gap-6">
          <Card className="flex flex-col gap-3 bg-snow border border-sand/60 shadow-subtle">
            <h4 className="font-heading font-extrabold text-sm text-olive-deep flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-success" />
              <span>Audit Integrity Protocols</span>
            </h4>
            <ul className="text-xs text-pine/80 font-medium space-y-2 list-disc list-inside">
              <li>Stock adjustments write a permanent entry to <strong className="text-pine font-mono">stock_transaction</strong>.</li>
              <li>Quantities are never overwritten or deleted directly from database records.</li>
              <li>Every write-off registers a timestamped audit log entry tagged with your Officer ID.</li>
              <li>Discrepancies over 50 kg trigger automated Station Commander review alerts.</li>
            </ul>
          </Card>

          {/* Recent Adjustments Mini Ledger */}
          <Card className="flex flex-col gap-3 border border-sand/60 shadow-subtle">
            <div className="flex items-center justify-between pb-2 border-b border-sand/30">
              <h4 className="font-heading font-extrabold text-sm text-olive-deep flex items-center gap-2">
                <History className="w-4 h-4 text-danger" />
                <span>Recent Write-Offs</span>
              </h4>
              <span className="text-[10px] font-mono font-bold uppercase text-pine/70">Audit Trail</span>
            </div>

            {recentAdjustments.length === 0 ? (
              <p className="text-xs text-pine/60 italic py-4 text-center">
                No recent stock write-offs recorded.
              </p>
            ) : (
              <div className="flex flex-col gap-2 max-h-72 overflow-y-auto pr-1">
                {recentAdjustments.map((tx) => {
                  const item = stock.find((s) => s.item_id === tx.item_id)?.item;
                  return (
                    <div
                      key={tx.id}
                      className="p-2.5 rounded-control border border-sand/40 bg-snow/50 flex items-center justify-between text-xs"
                    >
                      <div>
                        <div className="font-heading font-bold text-pine">{item?.name || tx.item_id}</div>
                        <div className="text-[10px] font-mono text-pine/70 capitalize">
                          Reason: {tx.reason_code?.replace('_', ' ') || 'correction'}
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="font-mono font-bold text-danger tabular-nums">
                          −{tx.quantity} {item?.unit}
                        </span>
                        <div className="text-[10px] font-mono text-pine/60">
                          {new Date(tx.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdjustmentsView;
