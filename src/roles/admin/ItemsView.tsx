import React, { useEffect, useState } from 'react';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { api } from '../../api/client';
import { Item } from '../../types';
import { useToast } from '../../components/Toast';
import {
  Package,
  Layers,
  Clock,
  AlertTriangle,
  Search,
  Filter,
  CheckCircle2,
  ShieldCheck,
  Scale,
  Sparkles,
} from 'lucide-react';

export const ItemsView: React.FC = () => {
  const { toast } = useToast();
  const [items, setItems] = useState<Item[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      try {
        const list = await api.items.list();
        setItems(list);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  const categories = ['all', ...Array.from(new Set(items.map((i) => i.category)))];
  const filteredItems = items.filter((item) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      item.name.toLowerCase().includes(q) || item.category.toLowerCase().includes(q);
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const totalItems = items.length;
  const grainItems = items.filter((i) => i.category === 'Grains & Cereals').length;
  const pulseItems = items.filter((i) => i.category === 'Pulses & Lentils').length;
  const avgShelfLife = Math.round(
    items.reduce((acc, i) => acc + i.shelf_life_days, 0) / (items.length || 1)
  );

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh] p-8">
        <div className="w-10 h-10 border-2 border-sand/40 border-t-gold-500 rounded-full animate-spin" />
        <span className="font-heading font-semibold text-xs text-pine/80 mt-4 uppercase tracking-wider">
          Auditing Master Scale of Rations Catalog...
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
            <Scale className="w-3 h-3 text-gold-600" />
            <span>Quartermaster Division • Scale of Rations Specification</span>
          </div>
          <h2 className="font-heading font-bold text-2xl text-olive-deep tracking-tight">
            Master Ration Commodity Catalog
          </h2>
          <p className="text-xs text-pine/70 font-sans mt-0.5">
            Standard institutional scales, base procurement units, central reserve thresholds &amp; maximum rotational shelf-life.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() =>
            toast({
              title: 'Scale Regulation Protocol',
              message: 'Scale adjustments require Directorate Board approval.',
            })
          }
          icon={<Scale className="w-4 h-4" />}
        >
          Add Scaled Commodity
        </Button>
      </div>

      {/* KPI Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-card bg-white border border-sand/30 shadow-subtle border-l-4 border-l-olive-600 flex flex-col justify-between">
          <span className="text-[10px] font-heading font-bold uppercase tracking-wider text-pine/60">
            Total Scaled Commodities
          </span>
          <span className="font-mono font-bold text-2xl text-olive-deep mt-1 tabular-nums">
            {totalItems} Items
          </span>
          <span className="text-[11px] text-pine/60 font-sans mt-0.5">Approved Master Specification</span>
        </div>

        <div className="p-4 rounded-card bg-white border border-sand/30 shadow-subtle border-l-4 border-l-gold-500 flex flex-col justify-between">
          <span className="text-[10px] font-heading font-bold uppercase tracking-wider text-pine/60">
            Grains &amp; Cereal Silos
          </span>
          <span className="font-mono font-bold text-2xl text-gold-600 mt-1 tabular-nums">
            {grainItems} Commodities
          </span>
          <span className="text-[11px] text-pine/60 font-sans mt-0.5">Basmati, Sona Masoori, Atta, Poha</span>
        </div>

        <div className="p-4 rounded-card bg-white border border-sand/30 shadow-subtle border-l-4 border-l-emerald-600 flex flex-col justify-between">
          <span className="text-[10px] font-heading font-bold uppercase tracking-wider text-pine/60">
            Pulses &amp; High Protein
          </span>
          <span className="font-mono font-bold text-2xl text-emerald-800 mt-1 tabular-nums">
            {pulseItems} Lentils
          </span>
          <span className="text-[11px] text-pine/60 font-sans mt-0.5">Toor, Moong, Chana, Rajma</span>
        </div>

        <div className="p-4 rounded-card bg-white border border-sand/30 shadow-subtle border-l-4 border-l-glacier-600 flex flex-col justify-between">
          <span className="text-[10px] font-heading font-bold uppercase tracking-wider text-pine/60">
            Average Shelf Life
          </span>
          <span className="font-mono font-bold text-2xl text-olive-deep mt-1 tabular-nums">
            {avgShelfLife} Days
          </span>
          <span className="text-[11px] text-pine/60 font-sans mt-0.5">Rotational Silo Expiry Cycle</span>
        </div>
      </div>

      {/* Search & Category Filter Toolbar */}
      <Card className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 border-sand/30 bg-white">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-pine/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search ration commodity by name or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs font-mono font-medium rounded-control border border-sand bg-snow focus:outline-none focus:border-olive focus:ring-1 focus:ring-olive text-olive-deep placeholder:text-pine/40"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 text-xs font-heading font-semibold rounded-control border border-sand bg-white text-olive-deep focus:outline-none focus:border-olive"
          >
            <option value="all">All Commodity Sectors</option>
            {categories.filter((c) => c !== 'all').map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </Card>

      {/* Master Catalog Table */}
      <div className="rounded-card border border-sand/30 bg-white shadow-subtle overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table-operational w-full text-left border-collapse">
            <thead>
              <tr className="bg-olive-deep text-sand text-[10px] font-heading font-bold uppercase tracking-wider select-none">
                <th className="py-3 px-4">Commodity Name</th>
                <th className="py-3 px-4">Category Sector</th>
                <th className="py-3 px-4 text-center">Standard Unit</th>
                <th className="py-3 px-4 text-right">Reorder Threshold</th>
                <th className="py-3 px-4 text-right">Shelf Life</th>
                <th className="py-3 px-4 text-right">Scale Unit Rate (₹)</th>
                <th className="py-3 px-4 text-right">Compliance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sand/20 text-xs font-sans text-olive-deep">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-pine/60 italic font-sans">
                    No ration commodities match the search query.
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-snow/60 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-heading font-bold text-olive-deep text-sm">{item.name}</div>
                      <div className="font-mono text-[10px] text-pine/60 uppercase mt-0.5">
                        ITEM CODE: {item.id}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-pill bg-sand/20 border border-sand/40 text-olive-deep text-[11px] font-heading font-semibold">
                        {item.category}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <span className="font-mono font-bold text-olive-deep uppercase px-2 py-0.5 rounded-control bg-snow border border-sand text-xs">
                        {item.unit}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right font-mono font-bold text-olive-deep tabular-nums">
                      {item.reorder_threshold} {item.unit}
                    </td>

                    <td className="py-3.5 px-4 text-right font-mono text-pine tabular-nums">
                      {item.shelf_life_days} days
                    </td>

                    <td className="py-3.5 px-4 text-right font-mono font-bold text-olive-deep tabular-nums">
                      ₹{item.approx_unit_cost.toFixed(2)} / {item.unit}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <span className="inline-flex items-center gap-1 text-[10px] font-heading font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-pill border border-emerald-300">
                        <CheckCircle2 className="w-3 h-3 text-emerald-700" /> Institutional Standard
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ItemsView;
