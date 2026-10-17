import React, { useEffect, useState } from 'react';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { PortionStepper } from '../../components/PortionStepper';
import { api } from '../../api/client';
import { Vendor, Item, ForecastRecord, DerivedStock } from '../../types';
import { useToast } from '../../components/Toast';
import { useNavigate } from 'react-router-dom';
import {
  FilePlus2,
  Truck,
  ArrowLeft,
  Package,
  Plus,
  Trash2,
  TrendingUp,
  ShieldCheck,
  Mountain,
} from 'lucide-react';

interface POLineDraft {
  item_id: string;
  ordered_qty: number;
}

export const CreatePOView: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [stock, setStock] = useState<DerivedStock[]>([]);
  const [forecasts, setForecasts] = useState<ForecastRecord[]>([]);
  const [selectedVendorId, setSelectedVendorId] = useState<string>('');
  const [lines, setLines] = useState<POLineDraft[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      try {
        const [vendorList, itemList, stockList, forecastList] = await Promise.all([
          api.vendors.list(),
          api.items.list(),
          api.inventory.getStock(),
          api.forecasts.list(),
        ]);
        setVendors(vendorList);
        setItems(itemList);
        setStock(stockList);
        setForecasts(forecastList);

        if (vendorList.length > 0) {
          setSelectedVendorId(vendorList[0].id);
        }

        const lowStockItems = stockList
          .filter((s) => s.status === 'low' || s.quantity_on_hand <= s.item.reorder_threshold)
          .slice(0, 3);

        if (lowStockItems.length > 0) {
          setLines(
            lowStockItems.map((s) => {
              const fc = forecastList.find((f) => f.item_id === s.item_id);
              return {
                item_id: s.item_id,
                ordered_qty: fc?.predicted_qty || s.item.reorder_threshold * 2,
              };
            })
          );
        } else if (itemList.length > 0) {
          setLines([{ item_id: itemList[0].id, ordered_qty: 100 }]);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  const selectedVendor = vendors.find((v) => v.id === selectedVendorId);

  const getForecastFor = (itemId: string): ForecastRecord | undefined => {
    return forecasts.find((f) => f.item_id === itemId);
  };

  const getItem = (itemId: string): Item | undefined => {
    return items.find((i) => i.id === itemId);
  };

  const getStock = (itemId: string): DerivedStock | undefined => {
    return stock.find((s) => s.item_id === itemId);
  };

  const handleAddLine = () => {
    const existingIds = new Set(lines.map((l) => l.item_id));
    const nextAvailable = items.find((i) => !existingIds.has(i.id));
    if (nextAvailable) {
      const fc = getForecastFor(nextAvailable.id);
      setLines((prev) => [
        ...prev,
        {
          item_id: nextAvailable.id,
          ordered_qty: fc?.predicted_qty || 50,
        },
      ]);
    }
  };

  const handleRemoveLine = (index: number) => {
    setLines((prev) => prev.filter((_, i) => i !== index));
  };

  const handleItemChange = (index: number, itemId: string) => {
    const fc = getForecastFor(itemId);
    setLines((prev) => {
      const copy = [...prev];
      copy[index] = {
        item_id: itemId,
        ordered_qty: fc?.predicted_qty || 50,
      };
      return copy;
    });
  };

  const handleQuantityChange = (index: number, qty: number) => {
    setLines((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], ordered_qty: qty };
      return copy;
    });
  };

  const handleApplyForecast = (index: number, suggestedQty: number) => {
    handleQuantityChange(index, suggestedQty);
    toast({
      title: 'Demand Forecast Applied',
      message: `Set indent quantity to ${suggestedQty} based on institutional consumption trend.`,
    });
  };

  const canSubmit =
    selectedVendorId &&
    lines.length > 0 &&
    lines.every((l) => l.ordered_qty > 0) &&
    !isSubmitting;

  const handleSubmitPO = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    setIsSubmitting(true);
    try {
      const payloadLines = lines.map((l) => {
        const it = getItem(l.item_id);
        return {
          item_id: l.item_id,
          ordered_qty: l.ordered_qty,
          unit_price: it?.approx_unit_cost || 50,
        };
      });

      const po = await api.purchaseOrders.create({
        vendor_id: selectedVendorId,
        lines: payloadLines,
      });

      toast({
        title: 'Indent (PO) Raised Successfully',
        message: `Indent #${po.id} submitted for ${selectedVendor?.name}. Ready for consignment dispatch.`,
      });

      navigate('/store');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to create PO';
      toast({ type: 'error', title: 'Indent Failed', message: msg });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3">
        <div className="w-10 h-10 border-3 border-olive border-t-gold rounded-full animate-spin" />
        <span className="font-heading font-bold text-xs uppercase tracking-wider text-olive">
          Loading Contracted Suppliers &amp; Forecasts...
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 pb-12 max-w-5xl mx-auto font-body text-pine">
      {/* Header */}
      <div className="p-6 md:p-8 bg-night text-snow rounded-card border border-sand/40 shadow-elevation flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-control bg-olive/70 border border-gold/40 flex items-center justify-center text-gold shrink-0 shadow-subtle">
            <FilePlus2 className="w-6 h-6" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-badge bg-gold/15 border border-gold/40 text-gold text-[10px] font-heading font-bold uppercase tracking-wider mb-1.5">
              <Mountain className="w-3 h-3 text-gold" />
              <span>CENTRAL SUPPLY DEPOT (LOGISTICS) • INDENT PROCUREMENT</span>
            </div>
            <h1 className="font-heading font-extrabold text-2xl md:text-3xl text-snow tracking-tight">
              Raise Ration Indent (PO)
            </h1>
            <p className="text-xs text-sand font-medium mt-1">
              Procure provisions from registered certified suppliers • Demand forecast guidance with 1-click apply.
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

      <form onSubmit={handleSubmitPO} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Vendor & Order Lines */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Step 1: Select Supplier */}
          <Card className="flex flex-col gap-4 border border-sand/60 shadow-subtle">
            <h3 className="font-heading font-extrabold text-base text-olive-deep flex items-center gap-2">
              <Truck className="w-5 h-5 text-olive" />
              <span>1. Choose Contracted Provisions Supplier</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {vendors.map((v) => {
                const isSelected = v.id === selectedVendorId;
                return (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => setSelectedVendorId(v.id)}
                    className={`p-4 rounded-control border text-left transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'border-olive bg-olive/10 shadow-elevation ring-2 ring-olive/20'
                        : 'border-sand/40 bg-white hover:border-sand hover:bg-snow/50'
                    }`}
                  >
                    <div>
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-olive block">
                        {v.category}
                      </span>
                      <h4 className="font-heading font-bold text-sm text-olive-deep mt-0.5">
                        {v.name}
                      </h4>
                    </div>
                    <div className="mt-3 pt-2 border-t border-sand/30 text-[10px] font-mono font-bold text-pine/70">
                      {v.rating ? `${v.rating}★ Verified Supplier` : 'Contracted Provisions Supplier'}
                    </div>
                  </button>
                );
              })}
            </div>
          </Card>

          {/* Step 2: PO Line Items with Forecast Chips */}
          <Card className="flex flex-col gap-5 border border-sand/60 shadow-subtle">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-heading font-extrabold text-base text-olive-deep flex items-center gap-2">
                  <Package className="w-5 h-5 text-gold" />
                  <span>2. Commodity Indent Quantities</span>
                </h3>
                <p className="text-xs text-pine/70 mt-0.5">
                  Pure quantity procurement. Forecast model projects seasonal requirements based on mess draw velocity.
                </p>
              </div>

              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={handleAddLine}
                disabled={lines.length >= items.length}
                icon={<Plus className="w-4 h-4" />}
              >
                Add Commodity
              </Button>
            </div>

            {/* Line Rows */}
            <div className="flex flex-col gap-4">
              {lines.map((line, idx) => {
                const it = getItem(line.item_id);
                const curStock = getStock(line.item_id);
                const fc = getForecastFor(line.item_id);

                return (
                  <div
                    key={idx}
                    className="p-4 rounded-control border border-sand/40 bg-snow/50 hover:border-sand transition-all flex flex-col gap-3 shadow-subtle"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      {/* Commodity Selector */}
                      <div className="flex-1">
                        <select
                          value={line.item_id}
                          onChange={(e) => handleItemChange(idx, e.target.value)}
                          className="w-full px-3 py-2 rounded-control border border-sand bg-white font-heading font-semibold text-xs text-pine focus:outline-none focus:border-gold"
                        >
                          {items.map((item) => (
                            <option key={item.id} value={item.id}>
                              {item.name} ({item.category.replace('_', ' ')}) — Unit: {item.unit}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Stepper + Delete */}
                      <div className="flex items-center gap-2">
                        <PortionStepper
                          value={line.ordered_qty}
                          unit={it?.unit || 'kg'}
                          step={it?.unit === 'kg' ? 10 : 5}
                          min={1}
                          onChange={(val) => handleQuantityChange(idx, val)}
                        />

                        {lines.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveLine(idx)}
                            className="p-2 rounded-control border border-sand/40 text-pine/60 hover:text-danger hover:border-danger transition-all"
                            title="Remove row"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Stock & Forecast Intelligence Pill */}
                    <div className="pt-2 border-t border-sand/30 flex flex-wrap items-center justify-between gap-2 text-xs">
                      <div className="flex items-center gap-3 text-pine/70 font-mono text-[11px]">
                        <span>
                          Depot Stock:{' '}
                          <strong className="text-olive-deep font-bold">
                            {curStock?.quantity_on_hand || 0} {it?.unit}
                          </strong>
                        </span>
                        <span>
                          Reorder Threshold: <strong className="text-pine font-bold">{it?.reorder_threshold} {it?.unit}</strong>
                        </span>
                      </div>

                      {/* Demand Forecast Suggestion Chip */}
                      {fc && (
                        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-badge bg-gold/15 border border-gold/40">
                          <TrendingUp className="w-3.5 h-3.5 text-gold" />
                          <span className="text-[11px] font-heading font-bold text-night">
                            Forecast: <strong className="font-mono">{fc.predicted_qty} {it?.unit}</strong>
                          </span>
                          <button
                            type="button"
                            onClick={() => handleApplyForecast(idx, fc.predicted_qty)}
                            className="ml-1 px-2 py-0.5 rounded-badge bg-gold text-night text-[10px] font-heading font-extrabold uppercase hover:bg-olive hover:text-snow transition-all shadow-subtle"
                          >
                            Apply
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Right Col: Summary & Dispatch */}
        <div className="flex flex-col gap-6">
          <Card className="sticky top-6 flex flex-col gap-5 border border-sand/60 shadow-elevation bg-white">
            <div className="flex items-center justify-between pb-3 border-b border-sand/30">
              <h3 className="font-heading font-extrabold text-base text-olive-deep flex items-center gap-2">
                <FilePlus2 className="w-5 h-5 text-olive" />
                <span>Indent Manifest</span>
              </h3>
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-badge bg-gold text-night">
                {lines.length} Lines
              </span>
            </div>

            {/* Vendor Cardlet */}
            <div className="p-3.5 rounded-control bg-snow border border-sand/40">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-olive block">
                Contracted Supplier
              </span>
              <h4 className="font-heading font-extrabold text-sm text-olive-deep">
                {selectedVendor?.name}
              </h4>
              <p className="text-xs text-pine/70 mt-0.5 font-mono">
                Category: {selectedVendor?.category} • {selectedVendor?.rating ? `${selectedVendor.rating}★ Rated` : 'Approved Agency'}
              </p>
            </div>

            {/* Lines Breakdown */}
            <div className="flex flex-col gap-2 max-h-56 overflow-y-auto pr-1">
              {lines.map((l, idx) => {
                const it = getItem(l.item_id);
                return (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2.5 rounded-control border border-sand/40 bg-snow/50 text-xs"
                  >
                    <span className="font-heading font-semibold text-pine">{it?.name}</span>
                    <span className="font-mono font-bold text-olive-deep tabular-nums">
                      {l.ordered_qty} {it?.unit}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Pure Quantity Total */}
            <div className="p-4 rounded-control bg-olive/10 border border-olive/20 flex flex-col gap-1.5">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-olive">
                Consignment Scale
              </span>
              <div className="flex justify-between items-center text-xs font-heading font-semibold text-pine">
                <span>Commodity Lines:</span>
                <span className="font-mono font-bold text-olive-deep tabular-nums">{lines.length}</span>
              </div>
              <div className="flex justify-between items-center text-xs font-heading font-semibold text-pine">
                <span>Total Unit Volume:</span>
                <span className="font-mono font-bold text-olive-deep tabular-nums">
                  {lines.reduce((acc, l) => acc + l.ordered_qty, 0)} units
                </span>
              </div>
            </div>

            {/* Store Keeper Notice: Pure quantity role */}
            <div className="p-3 rounded-control bg-snow border border-sand/30 flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
              <p className="text-[11px] text-pine/70 font-medium">
                Storekeeper Scope: Official costs and contractor disbursements are audited and sanctioned by Central Finance Staff.
              </p>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={!canSubmit}
              className="w-full text-sm py-3 font-heading font-bold shadow-subtle"
              icon={<FilePlus2 className="w-5 h-5 stroke-[2.5]" />}
            >
              {isSubmitting ? 'Raising Indent...' : 'Raise Consignment Indent (PO)'}
            </Button>
          </Card>
        </div>
      </form>
    </div>
  );
};

export default CreatePOView;
