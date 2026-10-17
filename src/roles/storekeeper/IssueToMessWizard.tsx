import React, { useEffect, useState } from 'react';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { PortionStepper } from '../../components/PortionStepper';
import { StatusChip } from '../../components/StatusChip';
import { api } from '../../api/client';
import { Mess, DerivedStock, Item } from '../../types';
import { useToast } from '../../components/Toast';
import { useNavigate } from 'react-router-dom';
import {
  ArrowUpRight,
  Home,
  AlertTriangle,
  ArrowLeft,
  Package,
  Trash2,
  Scale,
  Mountain,
  Building2,
  CheckCircle2,
} from 'lucide-react';

interface IssueLine {
  item_id: string;
  quantity: number;
}

export const IssueToMessWizard: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const [messes, setMesses] = useState<Mess[]>([]);
  const [stock, setStock] = useState<DerivedStock[]>([]);
  const [selectedMessId, setSelectedMessId] = useState<string>('');
  const [selectedItems, setSelectedItems] = useState<Record<string, number>>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      try {
        const [messList, stockList] = await Promise.all([
          api.messes.list(),
          api.inventory.getStock(),
        ]);
        setMesses(messList);
        setStock(stockList);
        if (messList.length > 0) {
          setSelectedMessId(messList[0].id);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  const selectedMess = messes.find((m) => m.id === selectedMessId);

  const getAvailableStock = (itemId: string): number => {
    const s = stock.find((item) => item.item_id === itemId);
    return s?.quantity_on_hand || 0;
  };

  const getItem = (itemId: string): Item | undefined => {
    return stock.find((s) => s.item_id === itemId)?.item;
  };

  const handleQuantityChange = (itemId: string, qty: number) => {
    setSelectedItems((prev) => {
      const copy = { ...prev };
      if (qty <= 0) {
        delete copy[itemId];
      } else {
        copy[itemId] = qty;
      }
      return copy;
    });
  };

  const handleQuickAdd = (itemId: string, addQty: number) => {
    const current = selectedItems[itemId] || 0;
    const available = getAvailableStock(itemId);
    const newQty = Math.min(available, current + addQty);
    handleQuantityChange(itemId, newQty);
  };

  const handleRemoveItem = (itemId: string) => {
    setSelectedItems((prev) => {
      const copy = { ...prev };
      delete copy[itemId];
      return copy;
    });
  };

  const overStockItemIds = Object.entries(selectedItems)
    .filter(([itemId, qty]) => qty > getAvailableStock(itemId))
    .map(([itemId]) => itemId);

  const hasItemsToIssue = Object.keys(selectedItems).length > 0;
  const canSubmit = hasItemsToIssue && overStockItemIds.length === 0 && !isSubmitting;

  const totalWeightKg = Object.entries(selectedItems).reduce((sum, [itemId, qty]) => {
    const item = getItem(itemId);
    return item?.unit === 'kg' ? sum + qty : sum;
  }, 0);

  const totalVolumeLitre = Object.entries(selectedItems).reduce((sum, [itemId, qty]) => {
    const item = getItem(itemId);
    return item?.unit === 'litre' ? sum + qty : sum;
  }, 0);

  const handleConfirmIssue = async () => {
    if (!selectedMessId || !canSubmit) return;
    setIsSubmitting(true);
    try {
      const lines = Object.entries(selectedItems).map(([item_id, quantity]) => ({
        item_id,
        quantity,
      }));

      await api.inventory.issueToMess({
        mess_id: selectedMessId,
        items: lines,
      });

      toast({
        title: 'Provisions Dispatched to Institutional Mess',
        message: `Issued ${lines.length} ration lines to ${selectedMess?.name}. Depot ledger updated.`,
      });

      navigate('/store/ledger');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to issue stock';
      toast({ type: 'error', title: 'Dispatch Failed', message: msg });
    } finally {
      setIsSubmitting(false);
    }
  };

  const categories = ['all', ...Array.from(new Set(stock.map((s) => s.item.category)))];
  const filteredStock = stock.filter((s) => {
    const matchesSearch = s.item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'all' || s.item.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3">
        <div className="w-10 h-10 border-3 border-olive border-t-gold rounded-full animate-spin" />
        <span className="font-heading font-bold text-xs uppercase tracking-wider text-olive">
          Loading Central Depot Silo Reserves...
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 pb-12 max-w-5xl mx-auto font-body text-pine">
      {/* Wizard Operational Header */}
      <div className="p-6 md:p-8 bg-night text-snow rounded-card border border-sand/40 shadow-elevation flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-control bg-olive/70 border border-gold/40 flex items-center justify-center text-gold shrink-0 shadow-subtle">
            <ArrowUpRight className="w-6 h-6" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-badge bg-gold/15 border border-gold/40 text-gold text-[10px] font-heading font-bold uppercase tracking-wider mb-1.5">
              <Mountain className="w-3.5 h-3.5 text-gold" />
              <span>CENTRAL SUPPLY DEPOT • PROVISION ISSUE</span>
            </div>
            <h1 className="font-heading font-extrabold text-2xl md:text-3xl text-snow tracking-tight">
              Issue Ration to Institutional Mess
            </h1>
            <p className="text-xs text-sand font-medium mt-1">
              Transfer provisions from Central Depot to institutional messes • Real-time ledger deduction with safety validation.
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

      {/* Main Form Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Item Picker & Quantities */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Step 1: Select Target Mess */}
          <Card className="flex flex-col gap-4 border border-sand/60 shadow-subtle">
            <div className="flex items-center justify-between">
              <h3 className="font-heading font-extrabold text-base text-olive-deep flex items-center gap-2">
                <Building2 className="w-5 h-5 text-olive" />
                <span>1. Select Destination Mess Facility</span>
              </h3>
              <span className="text-xs font-mono text-sand/80 font-bold uppercase">MANDATORY</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {messes.map((mess) => {
                const isSelected = mess.id === selectedMessId;
                return (
                  <button
                    key={mess.id}
                    type="button"
                    onClick={() => setSelectedMessId(mess.id)}
                    className={`p-4 rounded-control border text-left transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'border-olive bg-olive/10 shadow-elevation ring-2 ring-olive/20'
                        : 'border-sand/40 bg-white hover:border-sand hover:bg-snow/50'
                    }`}
                  >
                    <div>
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-olive block">
                        {mess.location}
                      </span>
                      <h4 className="font-heading font-bold text-sm text-olive-deep mt-0.5">
                        {mess.name}
                      </h4>
                    </div>
                    <div className="mt-3 pt-2 border-t border-sand/30 flex items-center justify-between text-xs">
                      <span className="text-pine/70">Sanction Capacity</span>
                      <span className="font-mono font-bold text-pine">{mess.headcount_capacity} diners</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </Card>

          {/* Step 2: Pick Commodities & Quantities */}
          <Card className="flex flex-col gap-5 border border-sand/60 shadow-subtle">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-heading font-extrabold text-base text-olive-deep flex items-center gap-2">
                  <Package className="w-5 h-5 text-gold" />
                  <span>2. Select Commodities to Dispatch</span>
                </h3>
                <p className="text-xs text-pine/70 mt-0.5">
                  Quantities will be deducted from Central Depot and assigned to {selectedMess?.name || 'Mess'}.
                </p>
              </div>

              {/* Search input */}
              <input
                type="text"
                placeholder="Search grains, pulses, dairy..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="px-3.5 py-1.5 text-xs font-medium rounded-control border border-sand bg-snow focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold"
              />
            </div>

            {/* Category filter pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 text-xs font-heading font-bold rounded-badge border capitalize whitespace-nowrap transition-all ${
                    selectedCategory === cat
                      ? 'bg-olive text-snow border-olive shadow-subtle'
                      : 'bg-snow text-pine/70 border-sand/40 hover:border-olive'
                  }`}
                >
                  {cat === 'all' ? 'All Silos' : cat.replace('_', ' ')}
                </button>
              ))}
            </div>

            {/* Commodities List */}
            <div className="flex flex-col gap-3 max-h-[500px] overflow-y-auto pr-1">
              {filteredStock.length === 0 ? (
                <div className="p-8 text-center text-pine/60 text-xs font-medium bg-snow rounded-control border border-sand/30">
                  No ration items found matching search criteria.
                </div>
              ) : (
                filteredStock.map((s) => {
                  const currentQty = selectedItems[s.item_id] || 0;
                  const isSelected = currentQty > 0;
                  const isOver = currentQty > s.quantity_on_hand;

                  return (
                    <div
                      key={s.item_id}
                      className={`p-4 rounded-control border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                        isOver
                          ? 'border-danger/40 bg-danger/5'
                          : isSelected
                          ? 'border-olive bg-olive/5 shadow-subtle'
                          : 'border-sand/40 bg-white hover:border-sand'
                      }`}
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-heading font-extrabold text-sm text-olive-deep">
                            {s.item.name}
                          </h4>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-badge bg-sand/20 text-pine/80 uppercase">
                            {s.item.category.replace('_', ' ')}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <span
                            className={`text-xs font-mono px-2 py-0.5 rounded border ${
                              s.quantity_on_hand <= 0
                                ? 'bg-danger/10 text-danger border-danger/30 font-bold'
                                : 'bg-olive/10 text-olive-deep border-olive/20'
                            }`}
                          >
                            Depot Stock: {s.quantity_on_hand} {s.item.unit}
                          </span>
                          {s.quantity_on_hand <= s.item.reorder_threshold && (
                            <span className="text-[10px] font-heading font-bold text-danger flex items-center gap-1">
                              <AlertTriangle className="w-3 h-3" /> Low reserve
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Stepper + Quick additions */}
                      <div className="flex items-center gap-2">
                        {/* Quick Add Chips */}
                        <div className="hidden sm:flex items-center gap-1">
                          {[10, 25, 50].map((delta) => (
                            <button
                              key={delta}
                              type="button"
                              onClick={() => handleQuickAdd(s.item_id, delta)}
                              disabled={s.quantity_on_hand <= 0}
                              className="px-2 py-1 text-[10px] font-heading font-bold rounded-control border border-sand/60 bg-snow hover:bg-gold hover:text-night hover:border-gold transition-all disabled:opacity-30"
                            >
                              +{delta}
                            </button>
                          ))}
                        </div>

                        {/* Stepper */}
                        <PortionStepper
                          value={currentQty}
                          unit={s.item.unit}
                          step={s.item.unit === 'kg' ? 5 : 1}
                          min={0}
                          max={s.quantity_on_hand * 2}
                          onChange={(val) => handleQuantityChange(s.item_id, val)}
                        />

                        {isSelected && (
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(s.item_id)}
                            className="p-2 rounded-control border border-sand/40 text-pine/60 hover:text-danger hover:border-danger transition-all"
                            title="Remove"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>

                      {/* Over-allocation warning */}
                      {isOver && (
                        <div className="sm:hidden text-xs font-bold text-danger flex items-center gap-1">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          Exceeds available depot reserve ({s.quantity_on_hand} {s.item.unit})!
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </Card>
        </div>

        {/* Right Col: Dispatch Manifest & Submit */}
        <div className="flex flex-col gap-6">
          <Card className="sticky top-6 flex flex-col gap-5 border border-sand/60 shadow-elevation bg-white">
            <div className="flex items-center justify-between pb-3 border-b border-sand/30">
              <h3 className="font-heading font-extrabold text-base text-olive-deep flex items-center gap-2">
                <Scale className="w-5 h-5 text-gold" />
                <span>Dispatch Manifest</span>
              </h3>
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-badge bg-gold text-night">
                {Object.keys(selectedItems).length} Items
              </span>
            </div>

            {/* Target Mess Cardlet */}
            <div className="p-3 rounded-control bg-snow border border-sand/40">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-olive block">
                Destination Mess Facility
              </span>
              <h4 className="font-heading font-extrabold text-sm text-olive-deep">
                {selectedMess?.name}
              </h4>
              <p className="text-xs text-pine/70 font-mono mt-0.5">{selectedMess?.location}</p>
            </div>

            {/* Commodities Selected List */}
            <div className="flex flex-col gap-2 max-h-56 overflow-y-auto pr-1">
              {Object.keys(selectedItems).length === 0 ? (
                <div className="p-4 text-center text-xs text-pine/60 font-medium italic">
                  No commodities selected yet. Use steppers or quick-add buttons on the left.
                </div>
              ) : (
                Object.entries(selectedItems).map(([itemId, qty]) => {
                  const item = getItem(itemId);
                  const available = getAvailableStock(itemId);
                  const isOver = qty > available;

                  return (
                    <div
                      key={itemId}
                      className={`flex items-center justify-between p-2.5 rounded-control border ${
                        isOver
                          ? 'border-danger/40 bg-danger/10 text-danger'
                          : 'border-sand/40 bg-snow/50'
                      }`}
                    >
                      <div>
                        <div className="font-heading font-bold text-xs text-pine">{item?.name}</div>
                        <div className="text-[10px] text-pine/70 font-mono">
                          Avail: {available} {item?.unit}
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="font-mono font-bold text-sm text-olive-deep tabular-nums">
                          {qty} {item?.unit}
                        </span>
                        {isOver && (
                          <div className="text-[10px] font-heading font-bold text-danger">EXCEEDED</div>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Running Totals Capsule */}
            <div className="p-4 rounded-control bg-olive/10 border border-olive/20 flex flex-col gap-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-olive">
                Transfer Totals
              </span>
              <div className="flex justify-between items-center text-xs font-heading font-semibold text-pine">
                <span>Dry Ration Weight:</span>
                <span className="font-mono font-bold text-olive-deep tabular-nums">{totalWeightKg.toFixed(1)} kg</span>
              </div>
              <div className="flex justify-between items-center text-xs font-heading font-semibold text-pine">
                <span>Oils &amp; Liquid Dairy:</span>
                <span className="font-mono font-bold text-olive-deep tabular-nums">{totalVolumeLitre.toFixed(1)} L</span>
              </div>
            </div>

            {/* Over-allocation warning banner */}
            {overStockItemIds.length > 0 && (
              <div className="p-3 rounded-control bg-danger text-snow border border-danger flex items-start gap-2 shadow-subtle">
                <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5 text-snow" />
                <div className="text-xs font-heading font-bold">
                  Cannot dispatch: One or more selected items exceed available Central Depot stock reserves.
                </div>
              </div>
            )}

            {/* Single Big Submit Button */}
            <Button
              variant="primary"
              size="lg"
              disabled={!canSubmit}
              onClick={handleConfirmIssue}
              className="w-full text-sm py-3 font-heading font-bold shadow-subtle"
              icon={<ArrowUpRight className="w-5 h-5 stroke-[2.5]" />}
            >
              {isSubmitting ? 'Recording Dispatch...' : 'Confirm & Dispatch Stock'}
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default IssueToMessWizard;
