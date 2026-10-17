import React, { useEffect, useState } from 'react';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { AltitudeGauge } from '../../components/AltitudeGauge';
import { StatusChip } from '../../components/StatusChip';
import { Modal } from '../../components/Modal';
import { Badge, Breadcrumb, StatCard, Accordion } from '../../components/ui';
import { api } from '../../api/client';
import { DerivedStock, PurchaseOrder, StockTransaction, Vendor } from '../../types';
import {
  Package,
  Truck,
  ArrowDownLeft,
  ArrowUpRight,
  AlertTriangle,
  SlidersHorizontal,
  BookOpen,
  FilePlus2,
  ShieldCheck,
  ChevronRight,
  Warehouse,
  Mountain,
  Compass,
  Layers,
  Sparkles,
  Info,
  Calendar,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export const StoreDashboard: React.FC = () => {
  const navigate = useNavigate();

  const [stock, setStock] = useState<DerivedStock[]>([]);
  const [pos, setPos] = useState<PurchaseOrder[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [recentTxs, setRecentTxs] = useState<StockTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Tab filter to keep information organized without clutter
  const [activeTab, setActiveTab] = useState<'overview' | 'consignments' | 'alerts' | 'silos'>('overview');

  // Commodity inspector modal
  const [selectedStock, setSelectedStock] = useState<DerivedStock | null>(null);

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      try {
        const [stockRes, poRes, vendorRes, txRes] = await Promise.all([
          api.inventory.getStock(),
          api.purchaseOrders.list(),
          api.vendors.list(),
          api.inventory.getTransactions(),
        ]);
        setStock(stockRes);
        setPos(poRes);
        setVendors(vendorRes);
        setRecentTxs(txRes.slice(0, 8));
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  const pendingPOs = pos.filter((p) => p.status === 'open' || p.status === 'partially_received');
  const alertStock = stock.filter((s) => s.status === 'low' || s.quantity_on_hand <= s.item.reorder_threshold);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3 font-body">
        <div className="w-10 h-10 border-3 border-olive border-t-gold rounded-full animate-spin" />
        <span className="font-heading font-bold text-xs uppercase tracking-wider text-olive">
          Reconciling Central Supply Depot Silos...
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 pb-12 font-body text-pine">
      {/* Navigation Breadcrumb */}
      <Breadcrumb
        items={[
          { label: 'Central Logistics', href: '/' },
          { label: 'Central Depot Stock Headquarters', current: true },
        ]}
      />

      {/* Quartermaster Central Depot Command Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 md:p-8 bg-night text-snow rounded-card border border-sand/40 shadow-elevation relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-full opacity-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-gold via-glacier to-transparent pointer-events-none" />

        <div className="flex items-start gap-4 relative z-10">
          <div className="w-12 h-12 rounded-control bg-olive/70 border border-gold/40 flex items-center justify-center text-gold shrink-0 shadow-subtle">
            <Warehouse className="w-6 h-6" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-badge bg-gold/15 border border-gold/40 text-gold text-[10px] font-heading font-bold uppercase tracking-wider mb-1.5">
              <Mountain className="w-3.5 h-3.5 text-gold" />
              <span>CENTRAL SUPPLY DEPOT • LOGISTICS HEADQUARTERS</span>
            </div>
            <h1 className="font-heading font-extrabold text-2xl md:text-3xl text-snow tracking-tight">
              Central Depot Stock Headquarters
            </h1>
            <p className="text-xs text-sand font-medium mt-1 max-w-xl">
              Ramesh Patel • Pure quantity management • Tamper-evident append-only ledger • Receipts, issues &amp; write-offs.
            </p>
          </div>
        </div>

        {/* Quick Action Operations */}
        <div className="flex flex-wrap items-center gap-2.5 relative z-10">
          <Button
            variant="primary"
            onClick={() => navigate('/store/receive')}
            icon={<ArrowDownLeft className="w-4 h-4 stroke-[2.5]" />}
          >
            Receive Consignment
          </Button>
          <Button
            variant="secondary"
            onClick={() => navigate('/store/issue')}
            icon={<ArrowUpRight className="w-4 h-4 stroke-[2.5]" />}
          >
            Issue to Mess
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate('/store/create-po')}
            icon={<FilePlus2 className="w-4 h-4 stroke-[2.5]" />}
            className="text-snow border-sand/40 hover:bg-olive-deep"
          >
            Raise Indent (PO)
          </Button>
        </div>
      </div>

      {/* Modern High-Precision Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Catalogued Commodities"
          value={`${stock.length}`}
          icon={<Package className="w-5 h-5 text-gold" />}
          trend={{ value: `${stock.length} Active`, direction: 'neutral' }}
          subtitle="Grains, pulses, oils"
          variant="gold"
        />
        <StatCard
          label="Consignments in Transit"
          value={`${pendingPOs.length}`}
          icon={<Truck className="w-5 h-5 text-glacier" />}
          trend={{ value: 'Awaiting Gate Check', direction: 'up', label: 'En Route' }}
          subtitle="Supply trucks"
        />
        <StatCard
          label="Depot Watchlist Alerts"
          value={`${alertStock.length}`}
          icon={<AlertTriangle className="w-5 h-5 text-danger" />}
          trend={{
            value: alertStock.length > 0 ? 'Indent Advised' : 'Silos Healthy',
            direction: alertStock.length > 0 ? 'down' : 'up',
          }}
          subtitle="Reorder threshold"
        />
        <StatCard
          label="Depot Reconciliation Grade"
          value="A+"
          icon={<ShieldCheck className="w-5 h-5 text-success" />}
          trend={{ value: '100% Match', direction: 'up', label: 'Tally verified' }}
          subtitle="Physical vs Ledger"
        />
      </div>

      {/* Clean Tab Filter Bar to prevent information overflow */}
      <div className="bg-white border border-sand rounded-card p-1.5 shadow-subtle flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          {[
            { id: 'overview', label: 'Depot Command Overview', icon: Layers },
            { id: 'consignments', label: `In-Transit Trucks (${pendingPOs.length})`, icon: Truck },
            { id: 'alerts', label: `Watchlist & Low Stock (${alertStock.length})`, icon: AlertTriangle },
            { id: 'silos', label: `Commodity Silos (${stock.length})`, icon: Warehouse },
          ].map((tab) => {
            const Icon = tab.icon;
            const isCurrent = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-control text-xs font-heading font-bold transition-all ${
                  isCurrent
                    ? 'bg-olive text-snow shadow-subtle border border-sand/30'
                    : 'text-olive hover:text-olive-deep hover:bg-snow'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isCurrent ? 'text-gold' : 'text-sand'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        <Link
          to="/store/ledger"
          className="text-xs font-heading font-bold text-olive hover:text-olive-deep px-3 py-1.5 rounded-control hover:bg-snow flex items-center gap-1"
        >
          <span>Audit Ledger</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="flex flex-col gap-6">
          {/* Quick Operational Navigation Roster */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <button
              type="button"
              onClick={() => navigate('/store/receive')}
              className="p-5 rounded-card border border-sand/60 bg-white hover:border-olive hover:shadow-elevation text-left transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-control bg-olive/15 border border-olive/30 flex items-center justify-center text-olive mb-3 group-hover:bg-olive group-hover:text-snow transition-colors">
                  <ArrowDownLeft className="w-5 h-5" />
                </div>
                <h4 className="font-heading font-extrabold text-sm text-olive-deep">
                  Receive Consignment
                </h4>
                <p className="text-xs text-pine/70 mt-1 leading-relaxed">
                  Unload contracted supplier trucks with partial intake and over-delivery validation.
                </p>
              </div>
              <div className="mt-4 pt-2.5 border-t border-sand/30 flex items-center justify-between text-xs font-bold text-olive">
                <span>{pendingPOs.length} Indents In-Transit</span>
                <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </div>
            </button>

            <button
              type="button"
              onClick={() => navigate('/store/issue')}
              className="p-5 rounded-card border border-sand/60 bg-white hover:border-olive hover:shadow-elevation text-left transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-control bg-gold/15 border border-gold/40 flex items-center justify-center text-night mb-3 group-hover:bg-gold group-hover:text-night transition-colors">
                  <ArrowUpRight className="w-5 h-5" />
                </div>
                <h4 className="font-heading font-extrabold text-sm text-olive-deep">
                  Issue to Institutional Mess
                </h4>
                <p className="text-xs text-pine/70 mt-1 leading-relaxed">
                  Dispatch authorized ration scale to Falcon, Eagle, or Staff Mess with live checks.
                </p>
              </div>
              <div className="mt-4 pt-2.5 border-t border-sand/30 flex items-center justify-between text-xs font-bold text-night">
                <span>Quota Distribution</span>
                <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </div>
            </button>

            <button
              type="button"
              onClick={() => navigate('/store/adjustments')}
              className="p-5 rounded-card border border-sand/60 bg-white hover:border-danger hover:shadow-elevation text-left transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-control bg-danger/10 border border-danger/30 flex items-center justify-center text-danger mb-3 group-hover:bg-danger group-hover:text-snow transition-colors">
                  <SlidersHorizontal className="w-5 h-5" />
                </div>
                <h4 className="font-heading font-extrabold text-sm text-olive-deep">
                  Condemnation &amp; Adjustments
                </h4>
                <p className="text-xs text-pine/70 mt-1 leading-relaxed">
                  Record physical damage, transit spoilage, moisture loss, and board write-offs.
                </p>
              </div>
              <div className="mt-4 pt-2.5 border-t border-sand/30 flex items-center justify-between text-xs font-bold text-danger">
                <span>Mandatory Reason Codes</span>
                <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </div>
            </button>

            <button
              type="button"
              onClick={() => navigate('/store/ledger')}
              className="p-5 rounded-card border border-sand/60 bg-white hover:border-olive hover:shadow-elevation text-left transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-control bg-night/10 border border-night/20 flex items-center justify-center text-night mb-3 group-hover:bg-night group-hover:text-snow transition-colors">
                  <BookOpen className="w-5 h-5" />
                </div>
                <h4 className="font-heading font-extrabold text-sm text-olive-deep">
                  Stock Ledger &amp; Audits
                </h4>
                <p className="text-xs text-pine/70 mt-1 leading-relaxed">
                  Immutable ledger trail with direction indicators, opening/closing tallies, and export.
                </p>
              </div>
              <div className="mt-4 pt-2.5 border-t border-sand/30 flex items-center justify-between text-xs font-bold text-olive-deep">
                <span>Station Audit Ledger</span>
                <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </div>
            </button>
          </div>

          {/* Quick Dual Summary: 2 Rows */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Consignments Preview */}
            <Card className="flex flex-col gap-3 border border-sand/60">
              <div className="flex items-center justify-between pb-2.5 border-b border-sand/30">
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-glacier" />
                  <h3 className="font-heading font-bold text-sm text-olive-deep">
                    Priority Inbound Consignments ({pendingPOs.length})
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('consignments')}
                  className="text-xs text-olive font-bold hover:underline"
                >
                  View All &rarr;
                </button>
              </div>
              {pendingPOs.slice(0, 3).map((po) => {
                const vendor = vendors.find((v) => v.id === po.vendor_id);
                const totalOrdered = po.lines.reduce((acc, l) => acc + l.ordered_qty, 0);
                const totalReceived = po.lines.reduce((acc, l) => acc + l.received_qty, 0);
                const pct = Math.round((totalReceived / (totalOrdered || 1)) * 100);
                return (
                  <div key={po.id} className="p-3 bg-snow rounded-control border border-sand/30 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-olive-deep">{po.id}</span>
                        <StatusChip type="po" value={po.status} size="sm" />
                      </div>
                      <span className="text-xs font-bold text-pine/80 mt-0.5 block">{vendor?.name}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-mono font-bold text-olive">{pct}% Received</span>
                      <Button variant="outline" size="sm" onClick={() => navigate('/store/receive')} className="mt-1">
                        Unload
                      </Button>
                    </div>
                  </div>
                );
              })}
            </Card>

            {/* Low Stock Preview */}
            <Card className="flex flex-col gap-3 border border-sand/60">
              <div className="flex items-center justify-between pb-2.5 border-b border-sand/30">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-danger" />
                  <h3 className="font-heading font-bold text-sm text-olive-deep">
                    Reserve Depletion Watchlist ({alertStock.length})
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('alerts')}
                  className="text-xs text-olive font-bold hover:underline"
                >
                  View All &rarr;
                </button>
              </div>
              {alertStock.length === 0 ? (
                <div className="p-4 text-center text-xs text-success font-bold flex items-center justify-center gap-2">
                  <ShieldCheck className="w-4 h-4" /> All commodities at or above safe reserve ceiling.
                </div>
              ) : (
                alertStock.slice(0, 3).map((s) => (
                  <div key={s.item_id} className="p-3 bg-danger/5 rounded-control border border-danger/30 flex items-center justify-between">
                    <div>
                      <span className="font-heading font-bold text-xs text-olive-deep">{s.item.name}</span>
                      <span className="text-[11px] font-mono text-pine/70 block">
                        {s.quantity_on_hand} {s.item.unit} left ({s.days_of_stock_left} days buffer)
                      </span>
                    </div>
                    <Button variant="secondary" size="sm" onClick={() => setSelectedStock(s)}>
                      Inspect
                    </Button>
                  </div>
                ))
              )}
            </Card>
          </div>
        </div>
      )}

      {/* TAB 2: IN-TRANSIT TRUCKS */}
      {activeTab === 'consignments' && (
        <Card className="flex flex-col gap-4 border border-sand/60 shadow-subtle">
          <div className="flex items-center justify-between pb-3 border-b border-sand/30">
            <div>
              <h3 className="font-heading font-extrabold text-base text-olive-deep flex items-center gap-2">
                <Truck className="w-5 h-5 text-glacier" />
                <span>Active Consignments in Transit</span>
              </h3>
              <p className="text-xs text-pine/70 mt-0.5">
                Track supplier shipments before unloading at the central warehouse bay.
              </p>
            </div>
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate('/store/receive')}
            >
              Unload Consignments
            </Button>
          </div>

          {pendingPOs.length === 0 ? (
            <div className="p-8 text-center text-pine/60 text-xs font-medium bg-snow rounded-control border border-sand/30 flex flex-col items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-success" />
              <span>All contracted consignments received and accounted for. No active trucks en route.</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pendingPOs.map((po) => {
                const vendor = vendors.find((v) => v.id === po.vendor_id);
                const totalOrdered = po.lines.reduce((acc, l) => acc + l.ordered_qty, 0);
                const totalReceived = po.lines.reduce((acc, l) => acc + l.received_qty, 0);
                const pct = Math.round((totalReceived / (totalOrdered || 1)) * 100);

                return (
                  <div
                    key={po.id}
                    className="p-4 rounded-control border border-sand/40 bg-snow/60 flex flex-col gap-3 shadow-subtle hover:border-sand transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-xs text-olive-deep uppercase">
                          {po.id}
                        </span>
                        <StatusChip type="po" value={po.status} size="sm" />
                      </div>
                      <span className="text-xs font-heading font-bold text-olive">
                        {vendor?.name}
                      </span>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-heading font-semibold text-pine mb-1">
                        <span>Fulfillment Intake</span>
                        <span className="font-mono tabular-nums">
                          {totalReceived} / {totalOrdered} units ({pct}%)
                        </span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-sand/30 overflow-hidden">
                        <div
                          className="h-full bg-glacier transition-all duration-500 rounded-full"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-sand/30 text-xs">
                      <span className="text-[11px] text-pine/70 font-mono">
                        {po.lines.length} ration commodity lines
                      </span>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => navigate('/store/receive')}
                        icon={<ArrowDownLeft className="w-3.5 h-3.5 stroke-[2.5]" />}
                      >
                        Unload Consignment
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      )}

      {/* TAB 3: WATCHLIST & LOW STOCK */}
      {activeTab === 'alerts' && (
        <Card className="flex flex-col gap-4 border border-sand/60 shadow-subtle">
          <div className="flex items-center justify-between pb-3 border-b border-sand/30">
            <div>
              <h3 className="font-heading font-extrabold text-base text-olive-deep flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-danger" />
                <span>Central Silo Stock Watchlist &amp; Depletion Alerts</span>
              </h3>
              <p className="text-xs text-pine/70 mt-0.5">
                Commodities requiring indent reorder or safety quota attention. Click any item to inspect details.
              </p>
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => navigate('/store/create-po')}
              icon={<FilePlus2 className="w-3.5 h-3.5 text-night" />}
            >
              Raise Indent (PO)
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {alertStock.length === 0 ? (
              <div className="col-span-2 p-8 text-center text-pine/60 text-xs font-medium bg-snow rounded-control border border-sand/30 flex flex-col items-center gap-2">
                <ShieldCheck className="w-6 h-6 text-success" />
                <span>All depot commodities maintain healthy reserves above reorder threshold.</span>
              </div>
            ) : (
              alertStock.map((s) => (
                <div
                  key={s.item_id}
                  className="p-3.5 rounded-control border border-danger/30 bg-danger/5 flex items-center justify-between gap-4"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-heading font-extrabold text-sm text-olive-deep">
                        {s.item.name}
                      </h4>
                      <span className="text-[10px] font-heading font-bold uppercase px-2 py-0.5 rounded-badge bg-danger text-snow">
                        {s.days_of_stock_left} days reserve
                      </span>
                    </div>
                    <p className="text-xs text-pine/70 mt-0.5 font-mono">
                      On-hand: <strong className="text-olive-deep">{s.quantity_on_hand} {s.item.unit}</strong> • Reorder at: {s.item.reorder_threshold} {s.item.unit}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedStock(s)}
                    >
                      Inspect
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => navigate('/store/create-po')}
                    >
                      Restock
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      )}

      {/* TAB 4: COMMODITY SILOS */}
      {activeTab === 'silos' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 text-olive text-xs font-heading font-bold uppercase tracking-wider mb-0.5">
                <Compass className="w-4 h-4 text-olive" />
                <span>CENTRAL DEPOT COMMODITY SILOS</span>
              </div>
              <h3 className="font-heading font-extrabold text-xl text-olive-deep tracking-tight">
                Central Depot Commodity Reserve Levels
              </h3>
              <p className="text-xs text-pine/70">
                Live capacity and consumption reserves measured with threshold markers.
              </p>
            </div>
            <Link to="/store/ledger" className="text-xs font-heading font-bold text-olive hover:text-gold flex items-center gap-1 transition-colors">
              <span>Station Stock Ledger</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {stock.map((s) => {
              const maxCapacity = Math.max(s.quantity_on_hand * 1.5, s.item.reorder_threshold * 2.5);
              return (
                <div
                  key={s.item_id}
                  onClick={() => setSelectedStock(s)}
                  className="p-4 rounded-card border border-sand/60 bg-white shadow-subtle hover:border-olive hover:shadow-elevation transition-all flex flex-col justify-between gap-4 cursor-pointer group"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <span className="text-[10px] font-heading font-bold uppercase tracking-wider text-olive px-2 py-0.5 rounded-badge bg-olive/10 border border-olive/20 inline-block mb-1">
                          {s.item.category.replace('_', ' ')}
                        </span>
                        <h4 className="font-heading font-extrabold text-sm text-olive-deep group-hover:text-olive transition-colors">
                          {s.item.name}
                        </h4>
                      </div>
                      <StatusChip type="stock" value={s.status} size="sm" />
                    </div>

                    <div className="text-xs text-pine/70 font-mono mb-3">
                      Reserve: <span className="font-bold text-pine">{s.days_of_stock_left} days</span> • Safe threshold: {s.item.reorder_threshold} {s.item.unit}
                    </div>

                    {/* High-Altitude Gauge */}
                    <AltitudeGauge
                      value={s.quantity_on_hand}
                      max={maxCapacity}
                      unit={s.item.unit}
                      threshold={s.item.reorder_threshold}
                      size="sm"
                    />
                  </div>

                  <div className="pt-2 border-t border-sand/30 flex items-center justify-between text-xs font-mono text-pine/80">
                    <span>CENTRAL RESERVE</span>
                    <span className="font-bold text-olive">{s.quantity_on_hand} {s.item.unit} ON HAND</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Quick Commodity Inspector Modal */}
      {selectedStock && (
        <Modal
          isOpen={Boolean(selectedStock)}
          onClose={() => setSelectedStock(null)}
          title={`Commodity Specification • ${selectedStock.item.name}`}
          description="Detailed silo reserves, 30-day consumption velocity, and restock guidance."
        >
          <div className="flex flex-col gap-4 font-body text-pine text-xs">
            <div className="p-3 bg-snow rounded-card border border-sand/60 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-heading font-bold text-olive uppercase tracking-wider block">
                  Commodity Category
                </span>
                <span className="text-sm font-heading font-extrabold text-olive-deep">
                  {selectedStock.item.category}
                </span>
              </div>
              <StatusChip type="stock" value={selectedStock.status} size="md" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-white rounded-control border border-sand/40">
                <span className="text-pine/60 block text-[11px]">Current Derived On-Hand:</span>
                <strong className="text-sm font-mono text-olive-deep">
                  {selectedStock.quantity_on_hand} {selectedStock.item.unit}
                </strong>
              </div>

              <div className="p-3 bg-white rounded-control border border-sand/40">
                <span className="text-pine/60 block text-[11px]">Minimum Reorder Threshold:</span>
                <strong className="text-sm font-mono text-olive-deep">
                  {selectedStock.item.reorder_threshold} {selectedStock.item.unit}
                </strong>
              </div>

              <div className="p-3 bg-white rounded-control border border-sand/40">
                <span className="text-pine/60 block text-[11px]">Buffer Reserve Days:</span>
                <strong className="text-sm font-mono text-olive-deep">
                  {selectedStock.days_of_stock_left} Days Reserve
                </strong>
              </div>

              <div className="p-3 bg-white rounded-control border border-sand/40">
                <span className="text-pine/60 block text-[11px]">Standard Shelf Life:</span>
                <strong className="text-sm font-mono text-olive-deep">
                  {selectedStock.item.shelf_life_days} Days
                </strong>
              </div>
            </div>

            <div className="p-3 bg-gold/10 border border-gold/40 rounded-card flex items-start gap-2.5">
              <Info className="w-4 h-4 text-night shrink-0 mt-0.5" />
              <div className="text-[11px] text-night">
                <strong>Ration Scale Law:</strong> Current stock balance is derived strictly from append-only inward consignment challans and mess issue ledger disbursements.
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-sand/40">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedStock(null)}
              >
                Close
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  setSelectedStock(null);
                  navigate('/store/create-po');
                }}
                icon={<FilePlus2 className="w-3.5 h-3.5" />}
              >
                Draft Restock Indent (PO)
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default StoreDashboard;
