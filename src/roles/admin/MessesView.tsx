import React, { useEffect, useState } from 'react';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { api } from '../../api/client';
import { Mess, DerivedStock } from '../../types';
import { useToast } from '../../components/Toast';
import {
  Building2,
  Users,
  MapPin,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  Plus,
  ShieldCheck,
  ChevronRight,
  TrendingUp,
  X,
} from 'lucide-react';

export const MessesView: React.FC = () => {
  const { toast } = useToast();
  const [messes, setMesses] = useState<Mess[]>([]);
  const [messStocks, setMessStocks] = useState<Record<string, DerivedStock[]>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMess, setSelectedMess] = useState<Mess | null>(null);

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      try {
        const messList = await api.messes.list();
        setMesses(messList);

        // Fetch stock snapshot for each mess
        const stockMap: Record<string, DerivedStock[]> = {};
        for (const m of messList) {
          try {
            stockMap[m.id] = await api.messes.getStock(m.id);
          } catch {
            stockMap[m.id] = [];
          }
        }
        setMessStocks(stockMap);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh] p-8">
        <div className="w-10 h-10 border-2 border-sand/40 border-t-gold-500 rounded-full animate-spin" />
        <span className="font-heading font-semibold text-xs text-pine/80 mt-4 uppercase tracking-wider">
          Inspecting Dining Mess Facilities...
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
            <Building2 className="w-3 h-3 text-gold-600" />
            <span>Station Command • Unit Mess Facilities</span>
          </div>
          <h2 className="font-heading font-bold text-2xl text-olive-deep tracking-tight">
            Dining Hall &amp; Hostel Mess Directory
          </h2>
          <p className="text-xs text-pine/70 font-sans mt-0.5">
            Active campus dining halls, sanctioned ration strengths, appointed mess secretaries &amp; live pantry reserves.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() =>
            toast({
              title: 'Sanction Directive Required',
              message: 'Mess commissioning requires Station Director sanction order.',
            })
          }
          icon={<Plus className="w-4 h-4" />}
        >
          Commission Unit Mess
        </Button>
      </div>

      {/* Messes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {messes.map((m) => {
          const stocks = messStocks[m.id] || [];
          const lowStockCount = stocks.filter((s) => s.status === 'low').length;
          const totalStockUnits = stocks.reduce((acc, s) => acc + s.quantity_on_hand, 0);

          return (
            <Card
              key={m.id}
              className="flex flex-col justify-between border-sand/30 bg-white p-6 shadow-subtle hover:border-olive/60 hover:shadow-elevated transition-all rounded-card"
            >
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-sand/20">
                  <span className="text-[10px] font-mono font-bold text-pine/60 uppercase">
                    UNIT ID: {m.id}
                  </span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-pill bg-emerald-50 text-emerald-800 border border-emerald-300 text-[10px] font-mono font-semibold">
                    <CheckCircle2 className="w-3 h-3 text-emerald-700" /> Operational
                  </span>
                </div>

                <div className="mt-4">
                  <h3 className="font-heading font-bold text-lg text-olive-deep">
                    {m.name}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-pine/70 mt-1 font-sans">
                    <MapPin className="w-3.5 h-3.5 text-sand-500" />
                    <span>{m.location}</span>
                  </div>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-2 gap-3 mt-5 pt-4 border-t border-sand/20 text-xs">
                  <div className="p-2.5 rounded-card bg-snow border border-sand/30">
                    <span className="text-[10px] font-heading font-bold text-pine/60 uppercase block">
                      Ration Strength
                    </span>
                    <span className="font-mono font-bold text-base text-olive-deep tabular-nums">
                      {m.headcount_capacity}
                    </span>
                    <span className="text-[10px] text-pine/60 block font-sans">Sanctioned diners</span>
                  </div>

                  <div className="p-2.5 rounded-card bg-snow border border-sand/30">
                    <span className="text-[10px] font-heading font-bold text-pine/60 uppercase block">
                      On-Hand Reserve
                    </span>
                    <span className="font-mono font-bold text-base text-olive-deep tabular-nums">
                      {totalStockUnits.toFixed(0)}
                    </span>
                    <span className="text-[10px] text-pine/60 block font-sans">Scale units</span>
                  </div>
                </div>

                {/* Stock Health Signal */}
                <div className="mt-4 flex items-center justify-between text-xs font-sans">
                  <span className="text-pine/70">Pantry Alert Status:</span>
                  {lowStockCount > 0 ? (
                    <span className="inline-flex items-center gap-1 text-danger font-mono font-bold text-xs">
                      <AlertTriangle className="w-3.5 h-3.5" /> {lowStockCount} below scale
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-emerald-800 font-mono font-semibold text-xs">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" /> Stocks Sufficient
                    </span>
                  )}
                </div>
              </div>

              <div className="mt-6 pt-3 border-t border-sand/20 flex items-center justify-between">
                <span className="text-[10px] font-mono text-pine/50">
                  Grade A Certified Station Facility
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedMess(m)}
                  className="text-xs font-heading font-bold text-olive hover:text-olive-deep flex items-center gap-1 underline underline-offset-2"
                >
                  Inspect Pantry <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Selected Mess Drilldown Drawer / Card */}
      {selectedMess && (
        <Card className="border border-sand/40 bg-white p-6 shadow-elevated rounded-card mt-2 border-t-4 border-t-gold-500 animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-4 border-b border-sand/30">
            <div>
              <div className="text-[10px] font-mono text-pine/60 uppercase">
                Detailed Pantry Reserve Audit
              </div>
              <h3 className="font-heading font-bold text-xl text-olive-deep">
                {selectedMess.name} — Current Ration Holdings
              </h3>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedMess(null)}
              icon={<X className="w-4 h-4" />}
            >
              Close Drilldown
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            {(messStocks[selectedMess.id] || []).slice(0, 8).map((s) => (
              <div
                key={s.item_id}
                className="p-3 rounded-card border border-sand/30 bg-snow flex items-center justify-between text-xs"
              >
                <div>
                  <div className="font-heading font-bold text-olive-deep">{s.item.name}</div>
                  <div className="text-[10px] text-pine/60 capitalize font-sans">{s.item.category}</div>
                </div>
                <div className="text-right">
                  <div className="font-mono font-bold text-olive-deep tabular-nums">
                    {s.quantity_on_hand} {s.item.unit}
                  </div>
                  <div className="text-[10px] font-mono font-bold text-emerald-800">
                    {s.days_of_stock_left} days left
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default MessesView;
