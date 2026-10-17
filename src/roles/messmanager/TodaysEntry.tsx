import React, { useEffect, useState } from 'react';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { PortionStepper } from '../../components/PortionStepper';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../api/client';
import { DerivedStock, Mess, ConsumptionRecord } from '../../types';
import { useToast } from '../../components/Toast';
import {
  Users,
  UtensilsCrossed,
  Send,
  AlertTriangle,
  CheckCircle2,
  Edit3,
  Scale,
  ShieldAlert,
  Building2,
  Mountain,
} from 'lucide-react';

export const TodaysEntry: React.FC = () => {
  const { user, mess_id } = useAuth();
  const { toast } = useToast();

  const [mess, setMess] = useState<Mess | null>(null);
  const [stock, setStock] = useState<DerivedStock[]>([]);
  const [headcount, setHeadcount] = useState(420);
  const [portions, setPortions] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [existingRecord, setExistingRecord] = useState<ConsumptionRecord[]>([]);
  const [isEditingExisting, setIsEditingExisting] = useState(false);

  const todayStr = new Date().toISOString().split('T')[0];

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      try {
        const messes = await api.messes.list();
        const activeMess = messes.find((m) => m.id === (mess_id || 'mess-1')) || messes[0];
        setMess(activeMess);

        const [stockRes, historyRes] = await Promise.all([
          api.messes.getStock(activeMess.id),
          api.consumption.getHistory(activeMess.id),
        ]);

        setStock(stockRes);

        const todaysHistory = historyRes.filter((h) => h.date === todayStr);
        if (todaysHistory.length > 0) {
          setExistingRecord(todaysHistory);
          setHeadcount(todaysHistory[0].headcount);
          const mapped: Record<string, number> = {};
          todaysHistory.forEach((h) => {
            mapped[h.item_id] = h.quantity_used;
          });
          setPortions(mapped);
        } else {
          const mapped: Record<string, number> = {};
          stockRes.forEach((s) => {
            if (s.quantity_on_hand > 0) {
              const defaultQty = s.item.category.includes('grain') ? 35 : s.item.category.includes('dairy') ? 15 : 10;
              mapped[s.item_id] = Math.min(s.quantity_on_hand, defaultQty);
            } else {
              mapped[s.item_id] = 0;
            }
          });
          setPortions(mapped);
        }
      } catch (err) {
        console.error('Error loading Mess Manager today screen:', err);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [mess_id]);

  const handleSameAsYesterday = async () => {
    if (!mess) return;
    try {
      const historyRes = await api.consumption.getHistory(mess.id);
      const pastRecords = historyRes.filter((h) => h.date !== todayStr);
      if (pastRecords.length === 0) {
        toast({ type: 'warning', title: 'No prior records found', message: 'Starting with standard institutional quota scales.' });
        return;
      }
      const latestDate = pastRecords[0].date;
      const recordsForLatestDate = pastRecords.filter((h) => h.date === latestDate);

      setHeadcount(recordsForLatestDate[0].headcount);
      const newPortions: Record<string, number> = { ...portions };
      recordsForLatestDate.forEach((r) => {
        newPortions[r.item_id] = r.quantity_used;
      });
      setPortions(newPortions);
      toast({
        title: 'Muster Scale Applied',
        message: `Loaded exact portion batches and headcount (${recordsForLatestDate[0].headcount}) from ${latestDate}.`,
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handlePortionChange = (itemId: string, val: number) => {
    setPortions((prev) => ({ ...prev, [itemId]: val }));
  };

  const overConsumptionItems = stock.filter((s) => {
    const attempted = portions[s.item_id] || 0;
    return attempted > s.quantity_on_hand;
  });

  const hasOverConsumption = overConsumptionItems.length > 0;

  const totalWeightKg = Object.entries(portions).reduce((acc, [itemId, qty]) => {
    const item = stock.find((s) => s.item_id === itemId)?.item;
    if (item?.unit === 'kg') return acc + qty;
    return acc;
  }, 0);

  const totalVolumeLitres = Object.entries(portions).reduce((acc, [itemId, qty]) => {
    const item = stock.find((s) => s.item_id === itemId)?.item;
    if (item?.unit === 'litre') return acc + qty;
    return acc;
  }, 0);

  const itemsLoggedCount = Object.values(portions).filter((q) => q > 0).length;

  const handleSubmit = async () => {
    if (!mess) return;

    if (hasOverConsumption) {
      toast({
        type: 'error',
        title: 'Over-Consumption Blocked',
        message: `Entered quota exceeds on-hand pantry stock for ${overConsumptionItems[0].item.name}.`,
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const entries = Object.entries(portions)
        .filter(([, qty]) => qty > 0)
        .map(([item_id, quantity_used]) => ({
          item_id,
          quantity_used,
        }));

      await api.consumption.submitDaily({
        mess_id: mess.id,
        date: todayStr,
        headcount,
        entries,
      });

      toast({
        title: isEditingExisting ? "Today's Draw Updated" : 'Daily Meal Ration Logged',
        message: `${entries.length} commodities deducted from ${mess.name} pantry ledger.`,
      });

      setExistingRecord(
        entries.map((e, idx) => ({
          id: `con-${Date.now()}-${idx}`,
          mess_id: mess.id,
          item_id: e.item_id,
          date: todayStr,
          quantity_used: e.quantity_used,
          headcount,
          recorded_by: user?.id || 'unknown',
          created_at: new Date().toISOString(),
        }))
      );
      setIsEditingExisting(false);

      const updatedStock = await api.messes.getStock(mess.id);
      setStock(updatedStock);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Submission failed';
      toast({ type: 'error', title: 'Submission Error', message: msg });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3">
        <div className="w-10 h-10 border-3 border-olive border-t-gold rounded-full animate-spin" />
        <span className="font-heading font-bold text-xs uppercase tracking-wider text-olive">
          Loading {mess?.name || 'Mess'} Pantry Reserves...
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 pb-12 font-body text-pine">
      {/* Mess Hall Identity Header */}
      <div className="p-6 md:p-8 bg-night text-snow rounded-card border border-sand/40 shadow-elevation flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-control bg-olive/70 border border-gold/40 flex items-center justify-center text-gold shrink-0 shadow-subtle">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-badge bg-gold/15 border border-gold/40 text-gold text-[10px] font-heading font-bold uppercase tracking-wider mb-1.5">
              <Mountain className="w-3 h-3 text-gold" />
              <span>{mess?.name} • DAILY MEAL DRAW</span>
            </div>
            <h1 className="font-heading font-extrabold text-2xl md:text-3xl text-snow tracking-tight">
              Daily Meal Ration Entry
            </h1>
            <p className="text-xs text-sand font-medium mt-1">
              Log daily ration consumption for {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short' })} • Direct muster deduction.
            </p>
          </div>
        </div>

        {/* Quick Fill Action */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleSameAsYesterday}
            className="text-snow border-sand/40 hover:bg-olive-deep"
          >
            Pre-fill Yesterday's Draw
          </Button>
        </div>
      </div>

      {/* Duplicate-Entry Guard Banner */}
      {existingRecord.length > 0 && !isEditingExisting && (
        <Card className="bg-snow border-l-4 border-l-success border border-sand/50 shadow-subtle flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-control bg-success/15 border border-success/30 flex items-center justify-center text-success shrink-0">
              <CheckCircle2 className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="font-heading font-extrabold text-sm text-olive-deep">
                Today's Meal Entry is Already Recorded
              </h3>
              <p className="text-xs text-pine/70 font-mono">
                Muster roll verified for {existingRecord[0].headcount} diners ({existingRecord.length} commodities deducted).
              </p>
            </div>
          </div>

          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsEditingExisting(true)}
            icon={<Edit3 className="w-4 h-4" />}
          >
            Modify Today's Draw
          </Button>
        </Card>
      )}

      {/* Over-Consumption Block Alert Banner */}
      {hasOverConsumption && (
        <div className="p-4 bg-danger/10 border border-danger/30 rounded-control flex items-center justify-between gap-3 text-pine select-none shadow-subtle">
          <div className="flex items-center gap-2.5">
            <ShieldAlert className="w-5 h-5 text-danger shrink-0 stroke-[2.5]" />
            <div className="text-xs font-bold leading-tight">
              <span>Over-Consumption Alert: </span>
              <span className="font-normal">
                Draw quantity exceeds unit pantry stock for {overConsumptionItems.map((o) => `${o.item.name} (${portions[o.item_id]} > ${o.quantity_on_hand} ${o.item.unit})`).join(', ')}. Please reduce portion or raise an indent request to Quartermaster.
              </span>
            </div>
          </div>
        </div>
      )}

      {/* STEP 1: Headcount Stepper Capsule */}
      <Card className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white border border-sand/60 shadow-subtle">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-control border border-sand/50 bg-olive/10 flex items-center justify-center text-olive shrink-0">
            <Users className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-heading font-extrabold text-base text-olive-deep">
                1. Diners Headcount Counted Today
              </h3>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-badge bg-snow border border-sand/40 text-pine/70">
                Capacity: {mess?.headcount_capacity}
              </span>
            </div>
            <p className="text-xs text-pine/70 font-medium mt-0.5 max-w-md">
              Tally of all staff, diners, and registered members dining across breakfast, lunch, and dinner rations.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <PortionStepper
            value={headcount}
            onChange={setHeadcount}
            unit="diners"
            step={5}
            min={10}
            max={mess?.headcount_capacity || 500}
          />
        </div>
      </Card>

      {/* STEP 2: Ration Items Portion Stepper Grid */}
      <Card className="border border-sand/60 shadow-subtle bg-white">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-sand/30 gap-3">
          <div>
            <h3 className="font-heading font-extrabold text-base text-olive-deep">
              2. Commodities Drawn for Today's Meals
            </h3>
            <p className="text-xs text-pine/70 mt-0.5">
              Portion steppers locked to standard army issue units.
            </p>
          </div>

          {/* Running Totals Capsule */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-control bg-snow border border-sand/40 text-xs font-heading font-bold text-olive-deep">
              <Scale className="w-4 h-4 text-olive" />
              <span>Dry Ration: <strong className="font-mono text-olive-deep">{totalWeightKg.toFixed(1)} kg</strong></span>
              {totalVolumeLitres > 0 && (
                <>
                  <span className="text-sand">•</span>
                  <span>Oils/Dairy: <strong className="font-mono text-olive-deep">{totalVolumeLitres.toFixed(1)} L</strong></span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Commodity Portion Rows */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {stock.map((s) => {
            const currentPortion = portions[s.item_id] || 0;
            const isExceeded = currentPortion > s.quantity_on_hand;
            const isZeroStock = s.quantity_on_hand <= 0;

            return (
              <div
                key={s.item_id}
                className={`p-3.5 rounded-control border transition-all flex items-center justify-between gap-3 ${
                  isExceeded
                    ? 'border-danger/40 bg-danger/5'
                    : currentPortion > 0
                    ? 'border-sand/60 bg-snow/60 shadow-subtle'
                    : 'border-sand/30 bg-snow/20 opacity-70'
                }`}
              >
                <div className="flex-1 min-w-0 pr-2">
                  <div className="flex items-center gap-2">
                    <h4 className="font-heading font-bold text-sm text-olive-deep truncate" title={s.item.name}>
                      {s.item.name}
                    </h4>
                    {isExceeded && (
                      <span className="text-[10px] font-heading font-bold px-1.5 py-0.2 rounded bg-danger text-snow">
                        Exceeded
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-pine/70 font-mono mt-0.5">
                    <span>
                      In pantry:{' '}
                      <strong className={`tabular-nums ${s.quantity_on_hand <= 5 ? 'text-danger font-bold' : 'text-pine'}`}>
                        {s.quantity_on_hand} {s.item.unit}
                      </strong>
                    </span>
                    <span className="text-sand">•</span>
                    <span>
                      {s.days_of_stock_left}d reserve
                    </span>
                  </div>
                </div>

                <PortionStepper
                  value={currentPortion}
                  onChange={(v) => handlePortionChange(s.item_id, v)}
                  unit={s.item.unit}
                  step={s.item.unit === 'kg' || s.item.unit === 'litre' ? 0.5 : 1}
                  disabled={isZeroStock}
                />
              </div>
            );
          })}
        </div>

        {/* Submission Bottom Actions */}
        <div className="mt-8 pt-4 border-t border-sand/30 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-pine/70 font-medium">
            <span>Logging {itemsLoggedCount} commodities for {headcount} diners. </span>
            <span className="text-success font-bold">Registers strictly to {mess?.name} muster log.</span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {isEditingExisting && (
              <Button
                variant="outline"
                onClick={() => setIsEditingExisting(false)}
              >
                Cancel Edit
              </Button>
            )}

            <Button
              variant="primary"
              size="lg"
              isLoading={isSubmitting}
              disabled={hasOverConsumption || itemsLoggedCount === 0}
              onClick={handleSubmit}
              icon={<Send className="w-4 h-4 stroke-[2.5]" />}
              className="flex-1 sm:flex-initial min-w-[220px]"
            >
              {isEditingExisting ? "Save Updated Today's Entry" : "Submit Today's Meal Entry"}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default TodaysEntry;
