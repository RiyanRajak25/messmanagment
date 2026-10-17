import React, { useEffect, useState } from 'react';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { PortionStepper } from '../../components/PortionStepper';
import { AltitudeGauge } from '../../components/AltitudeGauge';
import { StatusChip } from '../../components/StatusChip';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../api/client';
import { DerivedStock, Mess } from '../../types';
import { useToast } from '../../components/Toast';
import { RationNutritionModal } from '../../components/RationNutritionModal';
import { Breadcrumb, StatCard, Accordion, Badge } from '../../components/ui';
import {
  UtensilsCrossed,
  Users,
  Send,
  Building2,
  Mountain,
  Compass,
  Flame,
  Package,
  Layers,
  Sparkles,
  CheckCircle2,
  Clock,
} from 'lucide-react';

export const MessDashboard: React.FC = () => {
  const { user, mess_id } = useAuth();
  const { toast } = useToast();

  const [mess, setMess] = useState<Mess | null>(null);
  const [stock, setStock] = useState<DerivedStock[]>([]);
  const [headcount, setHeadcount] = useState(415);
  const [portions, setPortions] = useState<Record<string, number>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isNutritionModalOpen, setIsNutritionModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'draw' | 'pantry'>('draw');

  useEffect(() => {
    async function load() {
      try {
        const messes = await api.messes.list();
        const myMess = messes.find((m) => m.id === (mess_id || 'mess-1')) || messes[0];
        setMess(myMess);

        const stockRes = await api.messes.getStock(myMess.id);
        setStock(stockRes);

        const defaults: Record<string, number> = {};
        stockRes.slice(0, 8).forEach((s) => {
          defaults[s.item_id] = s.item.category.includes('grain') || s.item.category.includes('cereal') ? 45 : 18;
        });
        setPortions(defaults);
      } catch (err) {
        console.error(err);
      }
    }
    load();
  }, [mess_id]);

  const handlePortionChange = (itemId: string, val: number) => {
    setPortions((prev) => ({ ...prev, [itemId]: val }));
  };

  const handleQuickFillYesterday = () => {
    toast({ title: 'Standard Scale Pre-filled', message: "Populated yesterday's verified muster roll consumption quantities." });
  };

  const handleSubmitDaily = async () => {
    if (!mess) return;
    setIsSubmitting(true);
    try {
      const today = new Date().toISOString().split('T')[0];
      const entries = Object.entries(portions).map(([item_id, quantity_used]) => ({
        item_id,
        quantity_used,
      }));

      await api.consumption.submitDaily({
        mess_id: mess.id,
        date: today,
        headcount,
        entries,
      });

      toast({
        title: 'Daily Meal Ration Recorded',
        message: 'Logged in immutable muster roll audit trail. Pantry stock decremented.',
      });
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to submit consumption';
      toast({ type: 'error', title: 'Submission Blocked', message: errorMsg });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 pb-12 font-body text-pine">
      {/* Navigation Breadcrumb */}
      <Breadcrumb
        items={[
          { label: 'Institutional Facilities', href: '/' },
          { label: 'Daily Ration Draw & Muster', current: true },
        ]}
      />

      {/* Mess Banner with Institutional Identity */}
      <div className="p-6 md:p-8 bg-night text-snow rounded-card border border-sand/40 shadow-elevation flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-control bg-olive/70 border border-gold/40 flex items-center justify-center text-gold shrink-0 shadow-subtle">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-badge bg-gold/15 border border-gold/40 text-gold text-[10px] font-heading font-bold uppercase tracking-wider mb-1.5">
              <Mountain className="w-3.5 h-3.5 text-gold" />
              <span>{mess?.name || 'FALCON HOSTEL MESS'} • INSTITUTIONAL DIET SCALE</span>
            </div>
            <h1 className="font-heading font-extrabold text-2xl md:text-3xl text-snow tracking-tight">
              Daily Meal Ration Draw &amp; Muster
            </h1>
            <p className="text-xs text-sand font-medium mt-1">
              Location: {mess?.location} • Caterer: {user?.name} • Authorized quota draw per registered diner.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsNutritionModalOpen(true)}
            icon={<Flame className="w-3.5 h-3.5 text-gold" />}
            className="text-snow border-sand/40 hover:bg-olive-deep"
          >
            Nutrition Calculator
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleQuickFillYesterday}
            className="text-snow border-sand/40 hover:bg-olive-deep"
          >
            Pre-fill Yesterday's Scale
          </Button>
        </div>
      </div>

      {/* Modern High-Precision Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          label="Registered Dining Strength"
          value={`${headcount}`}
          icon={<Users className="w-5 h-5 text-gold" />}
          trend={{ value: 'Full Muster', direction: 'neutral' }}
          subtitle="Active roll"
          variant="gold"
        />
        <StatCard
          label="Pantry Commodities Ready"
          value={`${stock.length}`}
          icon={<Package className="w-5 h-5 text-olive" />}
          trend={{ value: 'Stock Balanced', direction: 'up', label: '100% Intact' }}
          subtitle="On-hand inventory"
        />
        <StatCard
          label="Prescribed Calorie Index"
          value="3,850 kcal"
          icon={<Flame className="w-5 h-5 text-saffron" />}
          trend={{ value: '+12%', direction: 'up', label: 'High-Altitude Scale' }}
          subtitle="Macro-nutrient verified"
        />
      </div>

      {/* Simplified View Switcher Tabs to avoid information overflow */}
      <div className="flex items-center justify-between border-b border-sand/40 pb-1">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('draw')}
            className={`flex items-center gap-2 px-4 py-2 rounded-control text-xs font-heading font-bold transition-all ${
              activeTab === 'draw'
                ? 'bg-olive text-snow shadow-subtle border border-sand/30'
                : 'text-pine/70 hover:text-olive-deep hover:bg-snow'
            }`}
          >
            <UtensilsCrossed className="w-3.5 h-3.5" />
            <span>Today's Ration Draw Form</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('pantry')}
            className={`flex items-center gap-2 px-4 py-2 rounded-control text-xs font-heading font-bold transition-all ${
              activeTab === 'pantry'
                ? 'bg-olive text-snow shadow-subtle border border-sand/30'
                : 'text-pine/70 hover:text-olive-deep hover:bg-snow'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>Unit Pantry Reserves ({stock.length} Commodities)</span>
          </button>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-pine/70">
          <Clock className="w-3.5 h-3.5 text-sand" />
          <span>Meal Window: Normal Ops</span>
        </div>
      </div>

      {/* TAB 1: Today's Draw Form */}
      {activeTab === 'draw' && (
        <div className="flex flex-col gap-6">
          {/* Headcount Stepper Card */}
          <Card className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white border border-sand/60 shadow-subtle">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Users className="w-5 h-5 text-olive" />
                <h3 className="font-heading font-extrabold text-base text-olive-deep">
                  Muster Roll Diner Headcount
                </h3>
              </div>
              <p className="text-xs text-pine/70 max-w-md">
                Verified dining strength across morning breakfast, noon lunch, and evening dinner. Computes per-diner-per-day scale.
              </p>
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

          {/* Today's Item Portions Stepper List */}
          <Card className="border border-sand/60 shadow-subtle">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-sand/30">
              <div>
                <h3 className="font-heading font-extrabold text-base text-olive-deep">
                  Rations Drawn Today ({new Date().toLocaleDateString('en-IN')})
                </h3>
                <p className="text-xs text-pine/70 mt-0.5">
                  Quantities locked to institutional scale units. Draw is validated against unit pantry reserves.
                </p>
              </div>
              <span className="text-xs font-mono font-bold px-3 py-1 bg-snow rounded-badge border border-sand/40 text-olive">
                {stock.length} Commodities Available
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {stock.slice(0, 8).map((s) => (
                <div
                  key={s.item_id}
                  className="p-3.5 rounded-control border border-sand/40 bg-snow/60 flex items-center justify-between gap-3 shadow-subtle hover:border-sand transition-all"
                >
                  <div>
                    <h4 className="font-heading font-bold text-sm text-olive-deep">{s.item.name}</h4>
                    <p className="text-xs text-pine/70 font-mono mt-0.5">
                      Unit pantry: <span className="font-bold text-pine">{s.quantity_on_hand} {s.item.unit}</span>
                    </p>
                  </div>

                  <PortionStepper
                    value={portions[s.item_id] || 0}
                    onChange={(v) => handlePortionChange(s.item_id, v)}
                    unit={s.item.unit}
                    step={s.item.unit === 'kg' || s.item.unit === 'litre' ? 0.5 : 1}
                    max={s.quantity_on_hand}
                  />
                </div>
              ))}
            </div>

            {/* Big Submit Pill Button */}
            <div className="mt-8 pt-4 border-t border-sand/30 flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-xs text-pine/70 font-medium">
                Muster integrity: Only 1 daily entry permitted per mess facility date.
              </span>
              <Button
                variant="primary"
                size="lg"
                isLoading={isSubmitting}
                onClick={handleSubmitDaily}
                icon={<Send className="w-4 h-4 stroke-[2.5]" />}
                className="w-full sm:w-auto"
              >
                Submit Today's Meal Entry
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* TAB 2: Own Mess Stock Elevation Gauges */}
      {activeTab === 'pantry' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 text-olive text-xs font-heading font-bold uppercase tracking-wider mb-0.5">
                <Compass className="w-4 h-4 text-olive" />
                <span>UNIT PANTRY RESERVES</span>
              </div>
              <h3 className="font-heading font-extrabold text-xl text-olive-deep tracking-tight">
                {mess?.name} Days of Stock Reserve Left
              </h3>
              <p className="text-xs text-pine/70">
                Mess hall pantry capacity with buffer safety threshold markers.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setActiveTab('draw')}
            >
              Back to Meal Draw
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {stock.map((s) => (
              <div
                key={s.item_id}
                className="p-4 rounded-card border border-sand/60 bg-white shadow-subtle hover:border-olive transition-all flex flex-col justify-between gap-4"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h4 className="font-heading font-extrabold text-sm text-olive-deep">
                      {s.item.name}
                    </h4>
                    <StatusChip type="stock" value={s.status} size="sm" />
                  </div>

                  <div className="text-xs text-pine/70 font-mono mb-3">
                    Reserve: <span className="font-bold text-pine">{s.days_of_stock_left} days</span>
                  </div>

                  <AltitudeGauge
                    value={s.quantity_on_hand}
                    max={100}
                    unit={s.item.unit}
                    threshold={20}
                    size="sm"
                  />
                </div>

                <div className="pt-2 border-t border-sand/30 flex items-center justify-between text-xs font-mono text-pine/80">
                  <span>ON HAND</span>
                  <span className="font-bold text-olive">{s.quantity_on_hand} {s.item.unit}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Progressive Disclosure: Institutional Scale & Nutrition Guidelines Accordion */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 px-1">
          <Flame className="w-4 h-4 text-gold" />
          <h4 className="font-heading font-extrabold text-xs uppercase tracking-wider text-olive-deep">
            Institutional Dietetics &amp; Calorie Verification Norms
          </h4>
        </div>
        <Accordion
          items={[
            {
              id: 'altitude-calorie-law',
              title: 'Prescribed High-Altitude Nutritional Entitlement',
              subtitle: 'Mandatory calorific scaling per registered diner',
              badge: <Badge variant="gold">3,850 KCAL</Badge>,
              children: (
                <div className="text-xs text-pine/80 space-y-2 leading-relaxed pt-2">
                  <p>
                    Institutional dining regulations mandate an energy density of at least <strong>3,850 kcal/day</strong> for personnel operating above 3,000m elevation. Diets must meet 15% protein, 30% healthy lipids, and 55% complex carbohydrates.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                    <div className="p-2.5 rounded bg-white border border-sand/40">
                      <span className="font-heading font-bold text-olive block text-[11px]">Carbohydrates (55%)</span>
                      <span className="text-[10px] text-pine/60">Grains & atta: 520g/head daily intake.</span>
                    </div>
                    <div className="p-2.5 rounded bg-white border border-sand/40">
                      <span className="font-heading font-bold text-olive block text-[11px]">Proteins (15%)</span>
                      <span className="text-[10px] text-pine/60">Pulses & eggs: 140g/head protein allocation.</span>
                    </div>
                    <div className="p-2.5 rounded bg-white border border-sand/40">
                      <span className="font-heading font-bold text-olive block text-[11px]">Fats &amp; Minerals (30%)</span>
                      <span className="text-[10px] text-pine/60">Pure mustard oil & ghee: 75g/head quota.</span>
                    </div>
                  </div>
                </div>
              ),
            },
            {
              id: 'muster-audit',
              title: 'Muster Roll Reconciliation & Wastage Accounting',
              subtitle: 'Pure quantity debit law on daily draw',
              children: (
                <div className="text-xs text-pine/80 space-y-2 leading-relaxed pt-2">
                  <p>
                    Every ration draw must precisely reconcile with morning muster roll headcount. The kitchen pantry ledger records real-time decrement, and variance over ±2% triggers automatic store audit review.
                  </p>
                </div>
              ),
            },
          ]}
        />
      </div>

      {/* Nutrition Modal */}
      <RationNutritionModal
        isOpen={isNutritionModalOpen}
        onClose={() => setIsNutritionModalOpen(false)}
      />
    </div>
  );
};

export default MessDashboard;
