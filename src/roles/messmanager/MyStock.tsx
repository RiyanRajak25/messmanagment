import React, { useEffect, useState } from 'react';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { AltitudeGauge } from '../../components/AltitudeGauge';
import { StatusChip } from '../../components/StatusChip';
import { Drawer } from '../../components/Drawer';
import { Input } from '../../components/Input';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../api/client';
import { DerivedStock, Mess } from '../../types';
import { useToast } from '../../components/Toast';
import {
  LayoutGrid,
  List,
  Search,
  Package,
  AlertTriangle,
  Building2,
  Mountain,
  Compass,
} from 'lucide-react';

export const MyStock: React.FC = () => {
  const { mess_id } = useAuth();
  const { toast } = useToast();

  const [mess, setMess] = useState<Mess | null>(null);
  const [stock, setStock] = useState<DerivedStock[]>([]);
  const [viewMode, setViewMode] = useState<'jars' | 'table'>('jars');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeItemDrawer, setActiveItemDrawer] = useState<DerivedStock | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      try {
        const messes = await api.messes.list();
        const activeMess = messes.find((m) => m.id === (mess_id || 'mess-1')) || messes[0];
        setMess(activeMess);

        const stockRes = await api.messes.getStock(activeMess.id);
        setStock(stockRes);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [mess_id]);

  const categories = ['All', 'Grains & Cereals', 'Pulses & Lentils', 'Oils & Fats', 'Vegetables', 'Dairy', 'Spices & Condiments'];

  const filteredStock = stock.filter((s) => {
    const matchesSearch = s.item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || s.item.category.toLowerCase().replace('&', '').includes(selectedCategory.toLowerCase().replace('&', ''));
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="flex flex-col gap-6 pb-12 font-body text-pine">
      {/* Header Banner */}
      <div className="p-6 md:p-8 bg-night text-snow rounded-card border border-sand/40 shadow-elevation flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-control bg-olive/70 border border-gold/40 flex items-center justify-center text-gold shrink-0 shadow-subtle">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-badge bg-gold/15 border border-gold/40 text-gold text-[10px] font-heading font-bold uppercase tracking-wider mb-1.5">
              <Mountain className="w-3.5 h-3.5 text-gold" />
              <span>{mess?.name || 'INSTITUTIONAL MESS'} • PANTRY AUDIT</span>
            </div>
            <h1 className="font-heading font-extrabold text-2xl md:text-3xl text-snow tracking-tight">
              Mess Hall Pantry Reserves
            </h1>
            <p className="text-xs text-sand font-medium mt-1">
              Authorized reserves allocated to {mess?.name} • Derived from Central Supply Depot dispatches.
            </p>
          </div>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-2">
          <div className="inline-flex items-center p-1 bg-olive-deep rounded-control border border-sand/30 shadow-subtle">
            <button
              type="button"
              onClick={() => setViewMode('jars')}
              className={`px-3 py-1.5 rounded text-xs font-heading font-bold flex items-center gap-1.5 transition-colors ${
                viewMode === 'jars' ? 'bg-gold text-night shadow-subtle' : 'text-sand hover:text-snow'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Elevation Cards</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={`px-3 py-1.5 rounded text-xs font-heading font-bold flex items-center gap-1.5 transition-colors ${
                viewMode === 'table' ? 'bg-gold text-night shadow-subtle' : 'text-sand hover:text-snow'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>Logistics Table</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 select-none no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-badge text-xs font-heading font-bold border whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-olive text-snow border-olive shadow-subtle'
                  : 'bg-snow text-pine/70 border-sand/40 hover:border-olive'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Field */}
        <div className="w-full md:w-72">
          <Input
            placeholder="Search pantry commodities..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            icon={<Search className="w-4 h-4 text-pine/50" />}
          />
        </div>
      </div>

      {/* Jars Grid View */}
      {viewMode === 'jars' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredStock.map((s) => (
            <div
              key={s.item_id}
              onClick={() => setActiveItemDrawer(s)}
              className="p-4 rounded-card border border-sand/60 bg-white shadow-subtle hover:border-olive cursor-pointer transition-all flex flex-col justify-between gap-4"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <span className="text-[10px] font-heading font-bold uppercase tracking-wider text-olive px-2 py-0.5 rounded-badge bg-olive/10 border border-olive/20 inline-block mb-1">
                      {s.item.category.replace('_', ' ')}
                    </span>
                    <h4 className="font-heading font-extrabold text-sm text-olive-deep">
                      {s.item.name}
                    </h4>
                  </div>
                  <StatusChip type="stock" value={s.status} size="sm" />
                </div>

                <div className="text-xs text-pine/70 font-mono mb-3">
                  Reserve: <span className="font-bold text-pine">{s.days_of_stock_left} days left</span>
                </div>

                <AltitudeGauge
                  value={s.quantity_on_hand}
                  max={Math.max(s.quantity_on_hand * 1.5, 50)}
                  unit={s.item.unit}
                  threshold={15}
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
      ) : (
        /* Operational Logistics Table View */
        <div className="rounded-card border border-sand/60 bg-white shadow-subtle overflow-hidden">
          <div className="overflow-x-auto">
            <table className="table-operational">
              <thead>
                <tr>
                  <th>Commodity Name</th>
                  <th>Category</th>
                  <th>On-Hand Qty</th>
                  <th>Estimated Reserve</th>
                  <th>Health Status</th>
                  <th className="text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredStock.map((s) => (
                  <tr
                    key={s.item_id}
                    onClick={() => setActiveItemDrawer(s)}
                    className="cursor-pointer hover:bg-snow/60 transition-colors"
                  >
                    <td className="font-heading font-bold text-pine">{s.item.name}</td>
                    <td className="font-mono text-xs">{s.item.category.replace('_', ' ')}</td>
                    <td className="font-mono font-bold text-olive-deep">
                      {s.quantity_on_hand} {s.item.unit}
                    </td>
                    <td>
                      <span className="font-mono font-semibold text-pine/70">
                        {s.days_of_stock_left > 0 ? `${s.days_of_stock_left} days left` : 'Depleted'}
                      </span>
                    </td>
                    <td>
                      <StatusChip type="stock" value={s.status} size="sm" />
                    </td>
                    <td className="text-right">
                      <Button size="sm" variant="outline">
                        Inspect
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Detail Drawer for Selected Commodity */}
      <Drawer
        isOpen={!!activeItemDrawer}
        onClose={() => setActiveItemDrawer(null)}
        title={activeItemDrawer?.item.name || 'Commodity Inspection'}
        subtitle={`Pantry Reserve in ${mess?.name}`}
      >
        {activeItemDrawer && (
          <div className="flex flex-col gap-6 font-body text-pine">
            <div className="p-4 bg-snow border border-sand/40 rounded-control flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-pine/70 block">On-Hand Reserve</span>
                <p className="font-heading font-extrabold text-2xl text-olive-deep mt-0.5">
                  {activeItemDrawer.quantity_on_hand} {activeItemDrawer.item.unit}
                </p>
              </div>
              <StatusChip type="stock" value={activeItemDrawer.status} />
            </div>

            {/* Altitude Gauge in Drawer */}
            <div className="p-4 bg-white border border-sand/40 rounded-control">
              <span className="text-xs font-heading font-bold text-olive block mb-2">Elevation Reserve Scale:</span>
              <AltitudeGauge
                value={activeItemDrawer.quantity_on_hand}
                max={Math.max(activeItemDrawer.quantity_on_hand * 1.5, 60)}
                unit={activeItemDrawer.item.unit}
                threshold={15}
                size="md"
              />
            </div>

            <div className="flex flex-col gap-2.5 text-xs font-mono">
              <div className="flex justify-between py-2 border-b border-sand/30">
                <span className="text-pine/70">Base Commodity Unit:</span>
                <span className="font-bold text-pine">{activeItemDrawer.item.unit}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-sand/30">
                <span className="text-pine/70">Category:</span>
                <span className="font-bold text-pine">{activeItemDrawer.item.category.replace('_', ' ')}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-sand/30">
                <span className="text-pine/70">Estimated Days Remaining:</span>
                <span className="font-bold text-danger">{activeItemDrawer.days_of_stock_left} days</span>
              </div>
              <div className="flex justify-between py-2 border-b border-sand/30">
                <span className="text-pine/70">Standard Shelf Life:</span>
                <span className="font-bold text-pine">{activeItemDrawer.item.shelf_life_days} days</span>
              </div>
            </div>

            {/* Quick Restock Request Chip */}
            <div className="p-4 rounded-control border border-sand/50 bg-gold/10 flex flex-col gap-2">
              <span className="font-heading font-bold text-xs text-night flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-night" /> Indent Re-allocation Signal
              </span>
              <p className="text-xs text-pine/80 leading-relaxed">
                Unit messes receive stocks via Central Depot transfers. Dispatch an operational requisition alert to Subedar Ramesh Patel.
              </p>
              <Button
                variant="primary"
                size="sm"
                className="mt-2"
                onClick={() => {
                  toast({
                    title: 'Depot Indent Signal Transmitted',
                    message: `Notified Central Supply Depot quartermaster for ${activeItemDrawer.item.name}.`,
                  });
                  setActiveItemDrawer(null);
                }}
              >
                Send Requisition Alert to Depot
              </Button>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
};

export default MyStock;
