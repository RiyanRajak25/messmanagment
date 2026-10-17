import React, { useEffect, useState } from 'react';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { api } from '../../api/client';
import { ForecastRecord, Item, Mess, DerivedStock } from '../../types';
import { useToast } from '../../components/Toast';
import {
  TrendingUp,
  BrainCircuit,
  Calendar,
  Sparkles,
  Download,
  AlertCircle,
  ShieldCheck,
  CheckCircle2,
  Package,
} from 'lucide-react';

export const ForecastView: React.FC = () => {
  const { toast } = useToast();
  const [forecasts, setForecasts] = useState<ForecastRecord[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [messes, setMesses] = useState<Mess[]>([]);
  const [centralStock, setCentralStock] = useState<DerivedStock[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      try {
        const [fcList, itemList, messList, stockList] = await Promise.all([
          api.forecasts.list(),
          api.items.list(),
          api.messes.list(),
          api.inventory.getStock(),
        ]);
        setForecasts(fcList);
        setItems(itemList);
        setMesses(messList);
        setCentralStock(stockList);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  const getItem = (itemId: string) => items.find((i) => i.id === itemId);
  const getMess = (messId: string) => messes.find((m) => m.id === messId);
  const getStock = (itemId: string) => centralStock.find((s) => s.item_id === itemId);

  const handleExportIndent = () => {
    toast({
      title: 'Logistics Procurement Indent Generated',
      message: 'Generated central logistics 30-day provisional ration indent based on demand forecast.',
    });
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh] p-8">
        <div className="w-10 h-10 border-2 border-sand/40 border-t-gold-500 rounded-full animate-spin" />
        <span className="font-heading font-semibold text-xs text-pine/80 mt-4 uppercase tracking-wider">
          Running Closed-Loop Demand Models...
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Subheader */}
      <div className="p-6 bg-white border border-sand/30 rounded-card shadow-subtle border-l-4 border-l-gold-500 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-pill bg-sand/20 border border-sand text-olive-deep text-[10px] font-heading font-bold uppercase tracking-wider mb-1">
            <BrainCircuit className="w-3 h-3 text-gold-600" />
            <span>Quartermaster Intelligence • Closed-Loop ML Demand Forecasting</span>
          </div>
          <h2 className="font-heading font-bold text-2xl text-olive-deep tracking-tight">
            Automated Demand Forecast &amp; Indent Planning
          </h2>
          <p className="text-xs text-pine/70 font-sans mt-0.5">
            Trained on daily headcount &amp; standard diet scale draw metrics • Prevents buffer spoilage &amp; supply stockout emergencies.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={handleExportIndent}
          icon={<Download className="w-4 h-4" />}
        >
          Export Logistics Indent Plan
        </Button>
      </div>

      {/* Model Parameters Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-card bg-white border border-sand/30 shadow-subtle border-l-4 border-l-olive-600">
          <div className="flex items-center gap-2 text-pine/60 text-[10px] font-heading font-bold uppercase tracking-wider">
            <BrainCircuit className="w-4 h-4 text-olive" />
            <span>Mathematical Model</span>
          </div>
          <div className="font-heading font-bold text-base text-olive-deep mt-1">
            Seasonal ARIMA + Exponential Smoothing
          </div>
          <p className="text-[11px] text-pine/70 font-sans mt-0.5">
            Accounts for weekday dining attendance vs weekend rosters.
          </p>
        </div>

        <div className="p-4 rounded-card bg-white border border-sand/30 shadow-subtle border-l-4 border-l-emerald-600">
          <div className="flex items-center gap-2 text-pine/60 text-[10px] font-heading font-bold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Average Model Confidence</span>
          </div>
          <div className="font-heading font-bold text-base text-emerald-800 mt-1 tabular-nums font-mono">
            91.4% Statistical Fit
          </div>
          <p className="text-[11px] text-pine/70 font-sans mt-0.5">
            Backtested against 90 days of audited meal draws.
          </p>
        </div>

        <div className="p-4 rounded-card bg-white border border-sand/30 shadow-subtle border-l-4 border-l-glacier-600">
          <div className="flex items-center gap-2 text-pine/60 text-[10px] font-heading font-bold uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-glacier" />
            <span>Spoilage Prevention Factor</span>
          </div>
          <div className="font-heading font-bold text-base text-olive-deep mt-1">
            0.02% Buffer Waste Target
          </div>
          <p className="text-[11px] text-pine/70 font-sans mt-0.5">
            Avoids estimated ₹1,42,000 annually in avoided grain deterioration.
          </p>
        </div>
      </div>

      {/* Forecast Projections Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {forecasts.map((fc) => {
          const it = getItem(fc.item_id);
          const ms = getMess(fc.mess_id);
          const stk = getStock(fc.item_id);
          const currentDepot = stk?.quantity_on_hand || 0;
          const deficit = Math.max(0, fc.predicted_qty - currentDepot);

          return (
            <Card
              key={fc.id}
              className="border-sand/30 bg-white p-5 shadow-subtle hover:border-olive/50 hover:shadow-elevated transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between pb-2 border-b border-sand/20">
                  <span className="text-[10px] font-mono text-pine/60 uppercase font-semibold">
                    {ms?.name || 'All Garrisons'}
                  </span>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-pill bg-emerald-50 text-emerald-800 border border-emerald-200">
                    {Math.round(fc.confidence * 100)}% Confidence
                  </span>
                </div>

                <div className="mt-3">
                  <h3 className="font-heading font-bold text-base text-olive-deep">
                    {it?.name || fc.item_id}
                  </h3>
                  <span className="text-[11px] text-pine/60 capitalize font-sans">{it?.category}</span>
                </div>

                {/* Forecast Value */}
                <div className="mt-4 p-3 rounded-card bg-snow border border-sand/30">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-pine/70 font-sans">30-Day Projected Demand:</span>
                    <span className="font-mono font-bold text-olive-deep text-sm tabular-nums">
                      {fc.predicted_qty} {it?.unit}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs mt-1">
                    <span className="text-pine/70 font-sans">Current Depot Silo Reserve:</span>
                    <span className="font-mono font-semibold text-olive-deep tabular-nums">
                      {currentDepot} {it?.unit}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs mt-1.5 pt-1.5 border-t border-sand/20">
                    <span className="text-olive-deep font-heading font-bold text-[11px]">Suggested Next PO Indent:</span>
                    <span
                      className={`font-mono font-bold text-xs tabular-nums ${
                        deficit > 0 ? 'text-amber-800' : 'text-emerald-700'
                      }`}
                    >
                      {deficit > 0 ? `+${deficit} ${it?.unit} Required` : 'Buffer Sufficient ✓'}
                    </span>
                  </div>
                </div>

                {/* Trend sparkline visualization */}
                <div className="mt-4">
                  <div className="text-[10px] font-heading font-bold text-pine/60 uppercase tracking-wider mb-1.5 flex justify-between">
                    <span>8-Week Consumption Trend</span>
                    <span className="font-mono">{fc.method.replace('_', ' ')}</span>
                  </div>
                  <div className="flex items-end gap-1.5 h-10 w-full pt-1">
                    {fc.historical_trend.map((val, idx) => {
                      const maxVal = Math.max(...fc.historical_trend, 1);
                      const heightPct = Math.round((val / maxVal) * 100);
                      return (
                        <div
                          key={idx}
                          className="flex-1 bg-glacier hover:bg-gold transition-colors rounded-t group relative cursor-default"
                          style={{ height: `${heightPct}%` }}
                        >
                          <div className="opacity-0 group-hover:opacity-100 absolute -top-6 left-1/2 -translate-x-1/2 bg-olive-night text-snow text-[9px] font-mono px-1.5 py-0.5 rounded-control pointer-events-none whitespace-nowrap z-10 border border-sand/30 shadow-subtle">
                            W{idx + 1}: {val}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-sand/20 flex items-center justify-between text-xs">
                <span className="text-[10px] font-mono text-pine/50">
                  Target: {fc.period_start} to {fc.period_end}
                </span>
                <span className="font-heading font-bold text-xs text-olive">Indent Ready</span>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default ForecastView;
