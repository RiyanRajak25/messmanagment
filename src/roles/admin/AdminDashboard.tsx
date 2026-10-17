import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card } from '../../components/Card';
import { StatTile } from '../../components/StatTile';
import { Button } from '../../components/Button';
import { StatusChip } from '../../components/StatusChip';
import { Breadcrumb, StatCard, Badge, Accordion } from '../../components/ui';
import { api } from '../../api/client';
import { Mess, DerivedStock, PurchaseOrder, Vendor } from '../../types';
import { MessesView } from './MessesView';
import { VendorsView } from './VendorsView';
import { ItemsView } from './ItemsView';
import { UsersView } from './UsersView';
import { AuditLogView } from './AuditLogView';
import { ForecastView } from './ForecastView';
import {
  Shield,
  ShieldCheck,
  Building2,
  Users,
  TrendingUp,
  FileText,
  AlertTriangle,
  ArrowRight,
  Truck,
  Package,
  Layers,
  Scale,
  Calendar,
  CheckCircle2,
  Activity,
  ArrowUpRight,
  Download,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

export const AdminDashboard: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Determine active tab from URL path
  const getTabFromPath = () => {
    const path = location.pathname;
    if (path.includes('/admin/messes')) return 'messes';
    if (path.includes('/admin/vendors')) return 'vendors';
    if (path.includes('/admin/items')) return 'items';
    if (path.includes('/admin/users')) return 'users';
    if (path.includes('/admin/audit')) return 'audit';
    if (path.includes('/admin/forecast')) return 'forecast';
    return 'overview';
  };

  const activeTab = getTabFromPath();

  const handleTabChange = (tabId: string) => {
    if (tabId === 'overview') navigate('/admin');
    else navigate(`/admin/${tabId}`);
  };

  const [messes, setMesses] = useState<Mess[]>([]);
  const [stock, setStock] = useState<DerivedStock[]>([]);
  const [pos, setPos] = useState<PurchaseOrder[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      try {
        const [mList, sList, poList, vList] = await Promise.all([
          api.messes.list(),
          api.inventory.getStock(),
          api.purchaseOrders.list(),
          api.vendors.list(),
        ]);
        setMesses(mList);
        setStock(sList);
        setPos(poList);
        setVendors(vList);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  const totalDinersStrength = messes.reduce((acc, m) => acc + m.headcount_capacity, 0);
  const pendingPOs = pos.filter((p) => p.status === 'open' || p.status === 'partially_received');
  const alertStockCount = stock.filter((s) => s.status === 'low' || s.quantity_on_hand <= s.item.reorder_threshold).length;

  // Station 7-day ration consumption trend mock for chart
  const weeklyTrendData = [
    { day: 'Mon', rationKg: 342, diners: 920 },
    { day: 'Tue', rationKg: 356, diners: 935 },
    { day: 'Wed', rationKg: 380, diners: 960 },
    { day: 'Thu', rationKg: 365, diners: 940 },
    { day: 'Fri', rationKg: 395, diners: 975 },
    { day: 'Sat', rationKg: 410, diners: 980 },
    { day: 'Sun', rationKg: 425, diners: 980 },
  ];

  return (
    <div className="flex flex-col gap-6 pb-12 font-body selection:bg-gold selection:text-night">
      {/* Navigation Breadcrumb */}
      <Breadcrumb
        items={[
          { label: 'Headquarters', href: '/admin' },
          { label: 'Station Logistics Command' },
        ]}
      />

      {/* Station Commander Command Header (Night Background) */}
      <div className="p-6 md:p-8 bg-night text-snow rounded-card shadow-elevation border border-sand/40 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-card bg-gold/15 border border-gold/40 flex items-center justify-center text-gold shadow-subtle shrink-0">
            <ShieldCheck className="w-8 h-8 stroke-[2.2]" />
          </div>
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-badge bg-gold/20 text-gold text-[10px] font-heading font-extrabold uppercase tracking-widest mb-1.5 border border-gold/30">
              <span>CENTRAL LOGISTICS HEADQUARTERS • OPERATIONS DIRECTORATE</span>
            </div>
            <h1 className="font-heading font-extrabold text-2xl md:text-3xl tracking-tight text-snow">
              Station Administration &amp; Logistics Command
            </h1>
            <p className="text-xs md:text-sm text-sand font-medium mt-0.5">
              Dr. Rajesh Verma, Station Director • Oversight of 3 Dining Messes, Central Supply Depot &amp; Supply Contracts.
            </p>
          </div>
        </div>

        {/* Status Indicators */}
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="success" pulse>
            ALL 3 MESSES ONLINE
          </Badge>
          <Badge variant="gold">
            <Shield className="w-3.5 h-3.5 mr-1" />
            STANDARDS COMPLIANT
          </Badge>
        </div>
      </div>

      {/* Primary KPI StatCards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Ration Strength"
          value={`${totalDinersStrength || 980}`}
          subValue="Across 3 Dining Messes"
          trend={{ value: 'Full Strength', direction: 'up' }}
          icon={<Users className="w-5 h-5" />}
          accentColor="gold"
        />
        <StatCard
          label="Central Depot Valuation"
          value="₹8,45,200"
          subValue="Across 31 Scaled Items"
          trend={{ value: 'Derived Stock', direction: 'up' }}
          icon={<Package className="w-5 h-5" />}
          accentColor="success"
        />
        <StatCard
          label="Sanctioned Budget Drawn"
          value="44.2%"
          subValue="₹3,45,000 of ₹7.8L Cap"
          trend={{ value: 'Within Scale', direction: 'neutral' }}
          icon={<TrendingUp className="w-5 h-5" />}
          accentColor="glacier"
        />
        <StatCard
          label="Active Tenders & Alerts"
          value={`${pendingPOs.length} POs / ${alertStockCount} Alerts`}
          subValue="Supply Tenders in Transit"
          trend={{ value: 'Under Control', direction: 'down' }}
          icon={<AlertTriangle className="w-5 h-5" />}
          accentColor="danger"
        />
      </div>

      {/* Formal Sub-Module Navigation Bar */}
      <div className="bg-white border border-sand rounded-card p-1.5 shadow-subtle overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-1.5 min-w-max">
          {[
            { id: 'overview', label: 'Command Overview', icon: Activity },
            { id: 'messes', label: 'Dining Messes', icon: Building2 },
            { id: 'vendors', label: 'Certified Suppliers', icon: Truck },
            { id: 'items', label: 'Scale of Rations Catalog', icon: Scale },
            { id: 'users', label: 'Personnel & Clearances', icon: Users },
            { id: 'audit', label: 'Station Audit Trail', icon: FileText },
            { id: 'forecast', label: 'Quartermaster Forecast', icon: TrendingUp },
          ].map((tab) => {
            const Icon = tab.icon;
            const isCurrent = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => handleTabChange(tab.id)}
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
      </div>

      {/* TAB CONTENT: Command Overview */}
      {activeTab === 'overview' && (
        <div className="flex flex-col gap-6">
          {/* Main Grid: Mess Overview & Consumption Velocity Chart */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2 Cols: 7-Day Station Ration Consumption Velocity */}
            <Card className="lg:col-span-2 flex flex-col justify-between">
              <div className="flex items-center justify-between pb-3 border-b border-sand/40">
                <div>
                  <div className="inline-flex items-center gap-1.5 text-[10px] font-heading font-bold text-olive uppercase tracking-wider">
                    <Activity className="w-3.5 h-3.5 text-gold" />
                    <span>Station Consumption Analytics</span>
                  </div>
                  <h3 className="font-heading font-bold text-lg text-olive-deep">
                    Weekly Scaled Ration Draw Velocity (kg)
                  </h3>
                </div>
                <span className="text-xs font-mono font-bold text-olive tabular-nums">
                  Total Fed: 6,650 Plates / Week
                </span>
              </div>

              <div className="h-64 w-full mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#C8B88A" strokeOpacity={0.25} vertical={false} />
                    <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#4F5D2F' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: '#4F5D2F' }} axisLine={false} tickLine={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1B2430',
                        borderRadius: '8px',
                        border: '1px solid #C8B88A',
                        color: '#F5F7F4',
                        fontSize: '12px',
                        fontWeight: 'bold',
                      }}
                      formatter={(val: number) => [`${val} kg`, 'Ration Draw']}
                    />
                    <Bar dataKey="rationKg" fill="#4F86B0" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-4 pt-3 border-t border-sand/40 flex items-center justify-between text-xs text-olive">
                <span>Average Per-Diner Scale: 0.385 kg / day</span>
                <span className="font-bold text-success flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Audit Status: Reconciled 100% ✓
                </span>
              </div>
            </Card>

            {/* Right Col: Dining Mess Facility Cards */}
            <Card className="flex flex-col gap-4">
              <div className="flex items-center justify-between pb-2 border-b border-sand/40">
                <h3 className="font-heading font-bold text-base text-olive-deep flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-olive" />
                  Dining Mess Facilities
                </h3>
                <button
                  type="button"
                  onClick={() => handleTabChange('messes')}
                  className="text-xs font-heading font-bold text-gold hover:underline"
                >
                  Manage All →
                </button>
              </div>

              <div className="flex flex-col gap-3">
                {messes.map((m) => (
                  <div
                    key={m.id}
                    className="p-3.5 rounded-control border border-sand bg-snow/80 hover:bg-snow transition-colors flex items-center justify-between"
                  >
                    <div>
                      <h4 className="font-heading font-bold text-sm text-olive-deep">{m.name}</h4>
                      <p className="text-xs text-pine/70 mt-0.5">{m.location}</p>
                    </div>
                    <div className="text-right">
                      <span className="font-mono font-extrabold text-xs text-pine tabular-nums block">
                        {m.headcount_capacity} Diners
                      </span>
                      <span className="text-[10px] text-success font-bold font-mono">Pantry Grade A</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-2 pt-3 border-t border-sand/40">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-xs font-bold"
                  onClick={() => handleTabChange('messes')}
                >
                  View Mess Allocations
                </Button>
              </div>
            </Card>
          </div>

          {/* Quick Command Directives Launchpad */}
          <div>
            <h3 className="font-heading font-bold text-base text-olive-deep mb-3">
              Quartermaster Administrative Operations
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <button
                type="button"
                onClick={() => handleTabChange('vendors')}
                className="p-4 rounded-card border border-sand bg-white hover:bg-snow hover:border-olive/60 transition-all text-left shadow-subtle flex flex-col justify-between"
              >
                <div>
                  <div className="w-8 h-8 rounded-control bg-gold/15 text-gold flex items-center justify-center font-bold mb-2 border border-gold/30">
                    <Truck className="w-4 h-4" />
                  </div>
                  <h4 className="font-heading font-bold text-sm text-olive-deep">Certified Suppliers</h4>
                  <p className="text-xs text-pine/70 mt-1">
                    Manage 5 contracted supply agencies, GSTIN records &amp; active tenders.
                  </p>
                </div>
                <div className="mt-3 text-xs font-heading font-bold text-olive flex items-center gap-1">
                  Enpanel Agency <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleTabChange('items')}
                className="p-4 rounded-card border border-sand bg-white hover:bg-snow hover:border-olive/60 transition-all text-left shadow-subtle flex flex-col justify-between"
              >
                <div>
                  <div className="w-8 h-8 rounded-control bg-success/15 text-success flex items-center justify-center font-bold mb-2 border border-success/30">
                    <Scale className="w-4 h-4" />
                  </div>
                  <h4 className="font-heading font-bold text-olive-deep text-sm">Scale of Rations</h4>
                  <p className="text-xs text-pine/70 mt-1">
                    Catalog of 31 approved army ration items, units, thresholds &amp; shelf life.
                  </p>
                </div>
                <div className="mt-3 text-xs font-heading font-bold text-olive flex items-center gap-1">
                  Audit Scale <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleTabChange('users')}
                className="p-4 rounded-card border border-sand bg-white hover:bg-snow hover:border-olive/60 transition-all text-left shadow-subtle flex flex-col justify-between"
              >
                <div>
                  <div className="w-8 h-8 rounded-control bg-glacier/15 text-glacier flex items-center justify-center font-bold mb-2 border border-glacier/30">
                    <Users className="w-4 h-4" />
                  </div>
                  <h4 className="font-heading font-bold text-olive-deep text-sm">Personnel &amp; Ranks</h4>
                  <p className="text-xs text-pine/70 mt-1">
                    Officers &amp; Havildars appointed to Store, Messes &amp; Accounts branches.
                  </p>
                </div>
                <div className="mt-3 text-xs font-heading font-bold text-olive flex items-center gap-1">
                  View Appointments <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleTabChange('audit')}
                className="p-4 rounded-card border border-sand bg-white hover:bg-snow hover:border-olive/60 transition-all text-left shadow-subtle flex flex-col justify-between"
              >
                <div>
                  <div className="w-8 h-8 rounded-control bg-night text-gold flex items-center justify-center font-bold mb-2 border border-sand/40">
                    <FileText className="w-4 h-4" />
                  </div>
                  <h4 className="font-heading font-bold text-olive-deep text-sm">Master Audit Log</h4>
                  <p className="text-xs text-pine/70 mt-1">
                    Tamper-evident operational event log with immutable mutation history.
                  </p>
                </div>
                <div className="mt-3 text-xs font-heading font-bold text-olive flex items-center gap-1">
                  Inspect Trail <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </button>
            </div>
          </div>

          {/* Operational Directives & Compliance Standards (Progressive Disclosure) */}
          <div className="bg-white border border-sand rounded-card p-6 shadow-subtle">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-control bg-olive/10 text-olive flex items-center justify-center font-bold border border-olive/20">
                <ShieldCheck className="w-5 h-5 text-olive" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-base text-olive-deep">
                  Station Logistics Directives &amp; Operational Governance
                </h3>
                <p className="text-xs text-pine/70">
                  Standing operating instructions authorized by Station Command for ration scaling and emergency reserves.
                </p>
              </div>
            </div>

            <Accordion
              items={[
                {
                  id: 'scaling-governance',
                  title: 'Scale of Rations Governance & Daily Entitlement Controls',
                  badge: 'MANDATORY',
                  badgeVariant: 'gold',
                  content: (
                    <div className="space-y-3 text-xs text-pine/80 leading-relaxed">
                      <p>
                        Daily mess rations are governed under the authorized <strong>Scale of Rations Schedule</strong>. All dining messes (Officers, JCOs, and Personnel Messes) must requisition commodities strictly against verified headcounts authenticated at 06:00 HRS daily.
                      </p>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Maximum allowable wastage variance must not exceed <strong>1.5%</strong> across dry staples.</li>
                        <li>High-altitude nutritional calorie thresholds are set to minimum <strong>4,200 kcal/day</strong> per diner.</li>
                        <li>Substitutions are permitted only via approved emergency equivalent matrices with Station Director sign-off.</li>
                      </ul>
                    </div>
                  ),
                },
                {
                  id: 'winter-stocking',
                  title: 'Station Emergency Buffer Quotas & Extreme Weather Reserve Protocol',
                  badge: 'SEASONAL',
                  badgeVariant: 'altitude',
                  content: (
                    <div className="space-y-3 text-xs text-pine/80 leading-relaxed">
                      <p>
                        During passes closure and extreme operational weather, the Central Depot must preserve a non-diminishing <strong>90-day reserve buffer</strong> across essential life-support commodities:
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
                        <div className="p-2.5 rounded-control bg-snow border border-sand/60">
                          <span className="font-heading font-bold text-olive text-[11px] block">GRAINS &amp; FLOUR</span>
                          <span className="font-mono text-sm font-bold text-pine">45 MT Minimum</span>
                        </div>
                        <div className="p-2.5 rounded-control bg-snow border border-sand/60">
                          <span className="font-heading font-bold text-olive text-[11px] block">EDIBLE OILS &amp; GHEE</span>
                          <span className="font-mono text-sm font-bold text-pine">6,500 L Reserve</span>
                        </div>
                        <div className="p-2.5 rounded-control bg-snow border border-sand/60">
                          <span className="font-heading font-bold text-olive text-[11px] block">PRESERVED RATIONS</span>
                          <span className="font-mono text-sm font-bold text-pine">12,000 Pks Instant</span>
                        </div>
                      </div>
                    </div>
                  ),
                },
                {
                  id: 'procurement-sanctions',
                  title: 'Financial Delegation of Powers & Multi-Level Sanctions',
                  badge: 'FINANCIAL',
                  badgeVariant: 'glacier',
                  content: (
                    <div className="space-y-2 text-xs text-pine/80 leading-relaxed">
                      <p>
                        Financial approval thresholds for supply procurement and contractor disbursements are delegated as follows:
                      </p>
                      <ul className="list-disc pl-5 space-y-1">
                        <li><strong>Mess Manager / Storekeeper:</strong> Local emergency purchase up to ₹25,000 per indent.</li>
                        <li><strong>Senior Accounts Officer:</strong> Sanction of regular contracted tenders up to ₹2,50,000.</li>
                        <li><strong>Station Director (HQ):</strong> Unlimited financial sanction subject to central board audit clearance.</li>
                      </ul>
                    </div>
                  ),
                },
              ]}
            />
          </div>
        </div>
      )}

      {/* SUB-VIEW TABS */}
      {activeTab === 'messes' && <MessesView />}
      {activeTab === 'vendors' && <VendorsView />}
      {activeTab === 'items' && <ItemsView />}
      {activeTab === 'users' && <UsersView />}
      {activeTab === 'audit' && <AuditLogView />}
      {activeTab === 'forecast' && <ForecastView />}
    </div>
  );
};

export default AdminDashboard;
