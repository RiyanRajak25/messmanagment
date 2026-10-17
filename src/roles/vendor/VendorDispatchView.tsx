import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../api/client';
import { PurchaseOrder, Vendor, Item } from '../../types';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Modal } from '../../components/Modal';
import { useToast } from '../../components/Toast';
import { Badge, Breadcrumb, StatCard, TableControls, Accordion } from '../../components/ui';
import {
  Truck,
  Package,
  CheckCircle2,
  Clock,
  FileSpreadsheet,
  Building,
  Calendar,
  Send,
  Mountain,
  Phone,
  FileText,
  ShieldCheck,
  AlertTriangle,
  QrCode,
  Printer,
  Navigation,
  MapPin,
  TrendingUp,
  PackageCheck,
  Radio,
} from 'lucide-react';

export interface ConsignmentRecord {
  id: string;
  challan_no: string;
  po_id: string;
  vendor_id: string;
  vehicle_no: string;
  driver_name: string;
  driver_phone: string;
  gps_lock_id: string;
  seal_no: string;
  reefer_temp?: string;
  departure_time: string;
  eta: string;
  status: 'pending' | 'in_transit' | 'checkpoint_cleared' | 'delivered';
  current_waypoint: string;
  items_summary: string;
  total_weight_kg: number;
  notes: string;
}

const STORAGE_KEY = 'messmunch_vendor_consignments';

export const VendorDispatchView: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [selectedVendorId, setSelectedVendorId] = useState<string>('vendor-1');
  const [pos, setPos] = useState<PurchaseOrder[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Consignments state
  const [consignments, setConsignments] = useState<ConsignmentRecord[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch {
      // ignore
    }
    // Default seed consignments
    return [
      {
        id: 'CSG-2026-081',
        challan_no: 'CHAL-2026-8912',
        po_id: 'po-1',
        vendor_id: 'vendor-1',
        vehicle_no: 'HP-01-AB-4021',
        driver_name: 'Kuldeep Verma',
        driver_phone: '+91 98160 55412',
        gps_lock_id: 'GPS-LK-904',
        seal_no: 'SEAL-SEC-44102',
        reefer_temp: 'Ambient (Dry Sealed)',
        departure_time: '2026-10-14T06:30:00Z',
        eta: '2026-10-15T18:00:00Z',
        status: 'in_transit',
        current_waypoint: 'Pass Checkpoint Transit Base (Sector 04)',
        items_summary: 'Basmati Rice (Grade A) - 500 kg, Toor Dal - 250 kg',
        total_weight_kg: 750,
        notes: 'Winter convoy equipped with heavy-duty snow chains and dual tarpaulin seals.',
      },
      {
        id: 'CSG-2026-080',
        challan_no: 'CHAL-2026-7840',
        po_id: 'po-2',
        vendor_id: 'vendor-1',
        vehicle_no: 'HP-02-TR-9122',
        driver_name: 'Satnam Singh',
        driver_phone: '+91 98055 23190',
        gps_lock_id: 'GPS-LK-887',
        seal_no: 'SEAL-SEC-43890',
        reefer_temp: '+3.8°C (Insulated)',
        departure_time: '2026-10-12T05:00:00Z',
        eta: '2026-10-13T14:30:00Z',
        status: 'delivered',
        current_waypoint: 'Central Depot Unloading Bay 02',
        items_summary: 'Pasteurized Butter & Dairy Fats - 200 Litres',
        total_weight_kg: 200,
        notes: 'Goods Receipt Note GRN-2026-004 issued by Storekeeper Patel.',
      },
      {
        id: 'CSG-2026-079',
        challan_no: 'CHAL-2026-6110',
        po_id: 'po-3',
        vendor_id: 'vendor-1',
        vehicle_no: 'HP-01-CD-1120',
        driver_name: 'Mohinder Paul',
        driver_phone: '+91 94180 88712',
        gps_lock_id: 'GPS-LK-754',
        seal_no: 'SEAL-SEC-42099',
        reefer_temp: 'Ambient (Dry Staples)',
        departure_time: '2026-10-08T07:15:00Z',
        eta: '2026-10-09T16:00:00Z',
        status: 'delivered',
        current_waypoint: 'Central Supply Depot Silo Intake',
        items_summary: 'Whole Wheat Atta (Stone Milled) - 800 kg',
        total_weight_kg: 800,
        notes: 'Quality lab cleared with 100% moisture tolerance adherence.',
      },
    ];
  });

  // Modal states
  const [isDispatchModalOpen, setIsDispatchModalOpen] = useState(false);
  const [isChallanModalOpen, setIsChallanModalOpen] = useState(false);
  const [isTrackModalOpen, setIsTrackModalOpen] = useState(false);
  const [selectedConsignment, setSelectedConsignment] = useState<ConsignmentRecord | null>(null);

  // New Dispatch Form state
  const [selectedPoId, setSelectedPoId] = useState('');
  const [vehicleNo, setVehicleNo] = useState('HP-01-AB-6055');
  const [driverName, setDriverName] = useState('Ranjeet Thakur');
  const [driverPhone, setDriverPhone] = useState('+91 98170 33891');
  const [sealNo, setSealNo] = useState(`SEAL-SEC-${Math.floor(10000 + Math.random() * 90000)}`);
  const [reeferTemp, setReeferTemp] = useState('Ambient (Dry Sealed)');
  const [etaDays, setEtaDays] = useState('1');
  const [dispatchNotes, setDispatchNotes] = useState('Government approved grain bags, tamper-evident barcode labels intact.');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(consignments));
    } catch {
      // ignore
    }
  }, [consignments]);

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      try {
        const [vData, poData, iData] = await Promise.all([
          api.vendors.list(),
          api.purchaseOrders.list(),
          api.items.list(),
        ]);
        setVendors(vData);
        setPos(poData);
        setItems(iData);
        if (vData.length > 0) {
          setSelectedVendorId(vData[0].id);
        }
        if (poData.length > 0) {
          setSelectedPoId(poData[0].id);
        }
      } catch (err) {
        console.error('Failed to load dispatch data', err);
        toast({ type: 'error', title: 'Error', message: 'Failed to load consignment records' });
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [toast]);

  const activeVendor = vendors.find((v) => v.id === selectedVendorId) || vendors[0];
  const getItem = (itemId: string) => items.find((i) => i.id === itemId);

  // Scoped POs for this vendor
  const vendorPos = pos.filter((po) => po.vendor_id === selectedVendorId);

  const handleCreateDispatch = (e: React.FormEvent) => {
    e.preventDefault();
    const po = pos.find((p) => p.id === selectedPoId);
    if (!po) {
      toast({ type: 'error', title: 'Invalid PO', message: 'Select an active supply order.' });
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const challanNumber = `CHAL-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
      const summaryItems = po.lines
        .map((l) => {
          const it = getItem(l.item_id);
          return `${it?.name || l.item_id} (${l.ordered_qty} ${it?.unit || 'units'})`;
        })
        .join(', ');

      const totalWeight = po.lines.reduce((acc, l) => acc + l.ordered_qty, 0);

      const newRecord: ConsignmentRecord = {
        id: `CSG-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
        challan_no: challanNumber,
        po_id: po.id,
        vendor_id: selectedVendorId,
        vehicle_no: vehicleNo.trim().toUpperCase(),
        driver_name: driverName.trim(),
        driver_phone: driverPhone.trim(),
        gps_lock_id: `GPS-LK-${Math.floor(100 + Math.random() * 900)}`,
        seal_no: sealNo.trim(),
        reefer_temp: reeferTemp,
        departure_time: new Date().toISOString(),
        eta: new Date(Date.now() + parseInt(etaDays, 10) * 86400000).toISOString(),
        status: 'in_transit',
        current_waypoint: 'Departed Regional Distribution Warehouse',
        items_summary: summaryItems || 'General Provisions Consignment',
        total_weight_kg: totalWeight || 500,
        notes: dispatchNotes,
      };

      setConsignments((prev) => [newRecord, ...prev]);
      setIsSubmitting(false);
      setIsDispatchModalOpen(false);

      toast({
        title: 'Consignment Dispatched',
        message: `Delivery Challan ${challanNumber} issued for ${po.id}. Vehicle registered in transit.`,
      });
    }, 450);
  };

  const exportCSV = () => {
    if (consignments.length === 0) {
      toast({ type: 'warning', title: 'No Data', message: 'No consignments to export.' });
      return;
    }
    const headers = [
      'Consignment ID',
      'Challan No',
      'PO Ref',
      'Vehicle No',
      'Driver Name',
      'Driver Phone',
      'GPS Lock ID',
      'Seal Code',
      'Departure',
      'ETA',
      'Status',
      'Waypoint',
      'Weight (kg)',
    ];
    const rows = consignments.map((c) => [
      c.id,
      c.challan_no,
      c.po_id,
      c.vehicle_no,
      `"${c.driver_name}"`,
      c.driver_phone,
      c.gps_lock_id,
      c.seal_no,
      c.departure_time,
      c.eta,
      c.status.toUpperCase(),
      `"${c.current_waypoint}"`,
      c.total_weight_kg,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Consignment_Dispatch_Ledger_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({ title: 'Export Complete', message: 'Dispatch manifest downloaded as CSV.' });
  };

  const filteredConsignments = consignments.filter((c) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      c.challan_no.toLowerCase().includes(q) ||
      c.id.toLowerCase().includes(q) ||
      c.po_id.toLowerCase().includes(q) ||
      c.vehicle_no.toLowerCase().includes(q) ||
      c.driver_name.toLowerCase().includes(q) ||
      c.items_summary.toLowerCase().includes(q);

    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const inTransitCount = consignments.filter((c) => c.status === 'in_transit' || c.status === 'checkpoint_cleared').length;
  const deliveredCount = consignments.filter((c) => c.status === 'delivered').length;
  const totalWeightTonnes = (consignments.reduce((acc, c) => acc + c.total_weight_kg, 0) / 1000).toFixed(1);

  return (
    <div className="flex flex-col gap-6 pb-12 font-body text-pine">
      {/* Navigation Breadcrumb */}
      <Breadcrumb
        items={[
          { label: 'Central Logistics', href: '/vendor' },
          { label: 'Consignment Dispatch & Gate Passes', current: true },
        ]}
      />

      {/* Header Banner */}
      <div className="p-6 md:p-8 bg-night text-snow rounded-card border border-sand/40 shadow-elevation flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-control bg-olive/70 border border-gold/40 flex items-center justify-center text-gold shrink-0 shadow-subtle">
            <Truck className="w-6 h-6" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-badge bg-gold/15 border border-gold/40 text-gold text-[10px] font-heading font-bold uppercase tracking-wider mb-1.5">
              <Mountain className="w-3.5 h-3.5 text-gold" />
              <span>CONTRACTED SUPPLY AGENCY • LOGISTICS TELEMETRY</span>
            </div>
            <h1 className="font-heading font-extrabold text-2xl md:text-3xl text-snow tracking-tight">
              Consignment Dispatch Console &amp; Gate Passes
            </h1>
            <p className="text-xs text-sand font-medium mt-1">
              {activeVendor?.name || 'Kisan Agro Products Ltd.'} • Vehicle tracking, delivery challans, tamper-evident seals &amp; transit telemetry.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsDispatchModalOpen(true)}
            icon={<Send className="w-3.5 h-3.5" />}
          >
            Dispatch Consignment
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={exportCSV}
            icon={<FileSpreadsheet className="w-3.5 h-3.5" />}
            className="text-snow border-sand/40 hover:bg-olive-deep"
          >
            Export Manifest CSV
          </Button>
        </div>
      </div>

      {/* Operational Module Sub-Navigation Bar */}
      <div className="bg-white border border-sand/60 rounded-card p-1.5 shadow-subtle overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-1.5 min-w-max">
          <button
            type="button"
            onClick={() => navigate('/vendor')}
            className="flex items-center gap-2 px-3.5 py-2 rounded-control text-xs font-heading font-bold text-olive hover:text-olive-deep hover:bg-snow transition-all"
          >
            <PackageCheck className="w-3.5 h-3.5 text-sand" />
            <span>Supplier Orders &amp; Indents</span>
          </button>
          <button
            type="button"
            onClick={() => navigate('/vendor/dispatch')}
            className="flex items-center gap-2 px-3.5 py-2 rounded-control text-xs font-heading font-bold bg-olive text-snow shadow-subtle border border-sand/30 transition-all"
          >
            <Truck className="w-3.5 h-3.5 text-gold" />
            <span>Consignment Dispatch &amp; Gate Passes</span>
          </button>
          <button
            type="button"
            onClick={() => navigate('/vendor/performance')}
            className="flex items-center gap-2 px-3.5 py-2 rounded-control text-xs font-heading font-bold text-olive hover:text-olive-deep hover:bg-snow transition-all"
          >
            <TrendingUp className="w-3.5 h-3.5 text-sand" />
            <span>SLA &amp; Delivery Scorecard</span>
          </button>
        </div>
      </div>

      {/* Telemetry KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Active Shipments En Route"
          value={`${inTransitCount}`}
          icon={<Truck className="w-5 h-5 text-gold" />}
          trend={{ value: `${inTransitCount} Active`, direction: 'up', label: 'GPS tracked' }}
          subtitle="Mountain transit"
          variant="gold"
        />
        <StatCard
          label="Total Cargo Dispatched"
          value={`${totalWeightTonnes} MT`}
          icon={<Package className="w-5 h-5 text-olive" />}
          trend={{ value: '+12.4%', direction: 'up', label: 'Quarterly intake' }}
          subtitle="All grain & provisions"
        />
        <StatCard
          label="Depot Deliveries Cleared"
          value={`${deliveredCount}`}
          icon={<CheckCircle2 className="w-5 h-5 text-success" />}
          trend={{ value: '100% Passed QC', direction: 'up', label: 'Depot verified' }}
          subtitle="GRN acknowledged"
        />
        <StatCard
          label="Average Transit Duration"
          value="18.5 Hrs"
          icon={<Clock className="w-5 h-5 text-glacier" />}
          trend={{ value: 'T+1 Avg', direction: 'neutral', label: 'On Schedule' }}
          subtitle="Regional depot corridor"
        />
      </div>

      {/* Table Controls Toolbar */}
      <Card className="p-4 bg-white border border-sand/60 shadow-subtle">
        <TableControls<string>
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder="Search by challan no, vehicle number, driver name, PO ID..."
          filterChips={[
            { id: 'all', label: 'All Consignments', count: consignments.length },
            { id: 'in_transit', label: 'En Route', count: consignments.filter((c) => c.status === 'in_transit').length },
            { id: 'delivered', label: 'Delivered to Depot', count: consignments.filter((c) => c.status === 'delivered').length },
          ]}
          activeFilter={statusFilter}
          onFilterChange={setStatusFilter}
          totalResults={filteredConsignments.length}
          onExport={exportCSV}
        />
      </Card>

      {/* Consignments Ledger Table */}
      <div className="rounded-card border border-sand/60 bg-white shadow-subtle overflow-hidden">
        <div className="p-4 bg-snow border-b border-sand/40 flex items-center justify-between">
          <div>
            <h3 className="font-heading font-extrabold text-base text-olive-deep">
              Vehicular Consignment Register &amp; Challans
            </h3>
            <p className="text-xs text-pine/70">
              Active transport convoys, vehicle serials, seal verification codes, and gate checkpoints.
            </p>
          </div>
          <span className="px-2.5 py-1 rounded-badge bg-gold/15 text-gold text-[10px] font-heading font-bold border border-gold/40 uppercase">
            Live Telemetry Feed
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="table-operational w-full text-left border-collapse">
            <thead>
              <tr className="bg-olive-deep text-sand text-[10px] font-heading font-bold uppercase tracking-wider select-none">
                <th className="py-3 px-4">Challan / Consignment</th>
                <th className="py-3 px-4">PO Reference</th>
                <th className="py-3 px-4">Carrier &amp; Driver</th>
                <th className="py-3 px-4">Commodity Payload</th>
                <th className="py-3 px-4">Departure &amp; ETA</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sand/20 text-xs font-sans text-olive-deep">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-pine/60">
                    Loading consignment records...
                  </td>
                </tr>
              ) : filteredConsignments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-pine/60 italic">
                    No consignments match the selected search or filter criteria.
                  </td>
                </tr>
              ) : (
                filteredConsignments.map((c) => {
                  return (
                    <tr key={c.id} className="hover:bg-snow/60 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-olive-deep">
                        <div className="flex items-center gap-2">
                          <QrCode className="w-4 h-4 text-olive shrink-0" />
                          <span>{c.challan_no}</span>
                        </div>
                        <div className="text-[10px] text-pine/60 font-sans mt-0.5">
                          ID: {c.id} • Seal: {c.seal_no}
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded bg-snow border border-sand/40 font-mono font-bold text-pine text-xs">
                          {c.po_id}
                        </span>
                        <div className="text-[10px] text-pine/60 mt-0.5">
                          Central Supply Depot
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-heading font-bold text-sm text-olive-deep flex items-center gap-1.5">
                          <Truck className="w-3.5 h-3.5 text-olive shrink-0" />
                          <span>{c.vehicle_no}</span>
                        </div>
                        <div className="text-[11px] text-pine/70 mt-0.5">
                          {c.driver_name} ({c.driver_phone})
                        </div>
                      </td>

                      <td className="py-3.5 px-4 max-w-xs">
                        <div className="font-medium text-xs text-olive-deep line-clamp-1">
                          {c.items_summary}
                        </div>
                        <div className="text-[10px] font-mono text-pine/60 mt-0.5">
                          Payload Weight: <strong className="text-pine">{c.total_weight_kg} kg</strong> • {c.reefer_temp}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-xs font-mono">
                        <div>Dept: {c.departure_time.split('T')[0]}</div>
                        <div className="text-olive font-bold text-[11px]">
                          ETA: {c.eta.split('T')[0]}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        {c.status === 'delivered' ? (
                          <Badge variant="success">
                            <CheckCircle2 className="w-3 h-3 mr-1" /> DELIVERED
                          </Badge>
                        ) : (
                          <Badge variant="gold" pulse>
                            <Radio className="w-3 h-3 mr-1 animate-spin" /> EN ROUTE
                          </Badge>
                        )}
                        <div className="text-[10px] text-pine/60 font-mono mt-1 truncate max-w-[140px]">
                          {c.current_waypoint}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedConsignment(c);
                              setIsTrackModalOpen(true);
                            }}
                            className="p-1.5 rounded-control border border-sand bg-snow hover:bg-white text-olive hover:text-olive-deep transition-colors"
                            title="Track Waypoint Telemetry"
                          >
                            <Navigation className="w-3.5 h-3.5" />
                          </button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedConsignment(c);
                              setIsChallanModalOpen(true);
                            }}
                            icon={<Printer className="w-3.5 h-3.5" />}
                            className="text-xs font-bold"
                          >
                            Gate Pass
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Progressive Disclosure: Cold-Chain & Mountain Route Directives Accordion */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 px-1">
          <ShieldCheck className="w-4 h-4 text-gold" />
          <h4 className="font-heading font-extrabold text-xs uppercase tracking-wider text-olive-deep">
            Mountain Logistics Directives &amp; High-Altitude Transit Compliance
          </h4>
        </div>
        <Accordion
          items={[
            {
              id: 'transit-security',
              title: 'Tamper-Evident Seal Verification & Security Inspection Protocol',
              subtitle: 'Mandatory seal checks at regional transit checkposts',
              badge: <Badge variant="gold">MANDATORY</Badge>,
              children: (
                <div className="text-xs text-pine/80 space-y-2 leading-relaxed pt-2">
                  <p>
                    All grain and provisions carriers entering the central valley transit corridor must maintain unbroken serial-numbered tamper-evident wire seals on container latches. Seals are verified against the Delivery Challan at the Sector 04 Mountain Checkpost.
                  </p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Broken or substituted seals result in immediate quarantine of the entire consignment.</li>
                    <li>Vehicles must carry functional digital temperature data-loggers for dairy and cold-chain items.</li>
                    <li>Transporters must log checkpoint entry and exit timestamps with the duty logistics officer.</li>
                  </ul>
                </div>
              ),
            },
            {
              id: 'weather-convoy',
              title: 'Extreme Weather & High-Altitude Convoy Regulations',
              subtitle: 'Snow clearance, chains, and mandatory emergency survival rations',
              children: (
                <div className="text-xs text-pine/80 space-y-2 leading-relaxed pt-2">
                  <p>
                    Between November and April, all supply vehicles must carry heavy-duty snow chains, double thermal tarpaulins, and 72-hour driver survival kits. Convoy movements are cleared exclusively between 07:00 HRS and 17:00 HRS.
                  </p>
                </div>
              ),
            },
          ]}
        />
      </div>

      {/* DISPATCH NEW CONSIGNMENT MODAL */}
      {isDispatchModalOpen && (
        <Modal
          isOpen={isDispatchModalOpen}
          onClose={() => setIsDispatchModalOpen(false)}
          title="Dispatch Consignment & Generate Delivery Challan"
          description="Register vehicle, driver credentials, and container seals for depot intake."
        >
          <form onSubmit={handleCreateDispatch} className="flex flex-col gap-4 font-body text-pine mt-2">
            <div>
              <label className="block text-xs font-heading font-bold text-olive-deep uppercase tracking-wider mb-1">
                Select Awarded Supply Order (PO) *
              </label>
              <select
                value={selectedPoId}
                onChange={(e) => setSelectedPoId(e.target.value)}
                className="w-full px-3 py-2 text-xs font-mono font-medium rounded-control border border-sand bg-snow focus:outline-none focus:border-olive"
                required
              >
                {vendorPos.map((po) => (
                  <option key={po.id} value={po.id}>
                    {po.id} • {po.created_at.split('T')[0]} ({po.lines.length} Commodities - {po.status.toUpperCase()})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-heading font-bold text-olive-deep uppercase tracking-wider mb-1">
                  Vehicle Registration No. *
                </label>
                <input
                  type="text"
                  value={vehicleNo}
                  onChange={(e) => setVehicleNo(e.target.value)}
                  placeholder="e.g. HP-01-AB-4021"
                  className="w-full px-3 py-2 text-xs font-mono font-bold uppercase rounded-control border border-sand bg-snow focus:outline-none focus:border-olive"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-heading font-bold text-olive-deep uppercase tracking-wider mb-1">
                  Driver Full Name *
                </label>
                <input
                  type="text"
                  value={driverName}
                  onChange={(e) => setDriverName(e.target.value)}
                  placeholder="e.g. Kuldeep Verma"
                  className="w-full px-3 py-2 text-xs font-medium rounded-control border border-sand bg-snow focus:outline-none focus:border-olive"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-heading font-bold text-olive-deep uppercase tracking-wider mb-1">
                  Driver Contact Phone *
                </label>
                <input
                  type="tel"
                  value={driverPhone}
                  onChange={(e) => setDriverPhone(e.target.value)}
                  placeholder="+91 98160 00000"
                  className="w-full px-3 py-2 text-xs font-mono rounded-control border border-sand bg-snow focus:outline-none focus:border-olive"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-heading font-bold text-olive-deep uppercase tracking-wider mb-1">
                  Container Tamper Seal No. *
                </label>
                <input
                  type="text"
                  value={sealNo}
                  onChange={(e) => setSealNo(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-mono font-bold rounded-control border border-sand bg-snow focus:outline-none focus:border-olive"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-heading font-bold text-olive-deep uppercase tracking-wider mb-1">
                  Transit Atmosphere / Reefer Temp
                </label>
                <select
                  value={reeferTemp}
                  onChange={(e) => setReeferTemp(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-control border border-sand bg-snow focus:outline-none focus:border-olive"
                >
                  <option value="Ambient (Dry Sealed)">Ambient (Dry Sealed Staples)</option>
                  <option value="+2°C to +4°C (Cold-Chain Dairy)">+2°C to +4°C (Cold-Chain Dairy)</option>
                  <option value="-18°C (Deep Frozen)">-18°C (Deep Frozen)</option>
                  <option value="Moisture Proof Tarpaulin">Moisture Proof Tarpaulin (Grains)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-heading font-bold text-olive-deep uppercase tracking-wider mb-1">
                  Estimated Transit Time (Days)
                </label>
                <select
                  value={etaDays}
                  onChange={(e) => setEtaDays(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-mono rounded-control border border-sand bg-snow focus:outline-none focus:border-olive"
                >
                  <option value="1">1 Day (Express Mountain Corridor)</option>
                  <option value="2">2 Days (Standard Convoy)</option>
                  <option value="3">3 Days (Heavy Snow Protocol)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-heading font-bold text-olive-deep uppercase tracking-wider mb-1">
                Dispatch Instructions / Packaging Notes
              </label>
              <textarea
                value={dispatchNotes}
                onChange={(e) => setDispatchNotes(e.target.value)}
                rows={2}
                className="w-full px-3 py-2 text-xs rounded-control border border-sand bg-snow focus:outline-none focus:border-olive resize-none"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-sand/40">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsDispatchModalOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="sm"
                disabled={isSubmitting}
                icon={<Send className="w-3.5 h-3.5" />}
              >
                {isSubmitting ? 'Registering Dispatch...' : 'Issue Delivery Challan & Dispatch'}
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* OFFICIAL PRINTABLE DELIVERY CHALLAN / GATE PASS MODAL */}
      {isChallanModalOpen && selectedConsignment && (
        <Modal
          isOpen={isChallanModalOpen}
          onClose={() => setIsChallanModalOpen(false)}
          title="Official Transporter Gate Pass & Delivery Challan"
          description={`Central Supply Directorate • Form L-409 • ${selectedConsignment.challan_no}`}
        >
          <div className="flex flex-col gap-4 font-body text-pine mt-1 print:p-0">
            {/* Formal Institutional Gate Pass Box */}
            <div className="p-5 rounded-card border-2 border-olive bg-white shadow-subtle space-y-4">
              <div className="flex items-start justify-between border-b-2 border-olive pb-3">
                <div className="space-y-0.5">
                  <div className="text-[10px] font-mono uppercase tracking-widest text-olive font-extrabold">
                    GOVERNMENT OF INDIA • MINISTRY OF LOGISTICS &amp; PROVISIONS
                  </div>
                  <h3 className="font-heading font-extrabold text-lg text-olive-deep">
                    STATION SUPPLY CONSIGNMENT DELIVERY CHALLAN
                  </h3>
                  <p className="text-xs text-pine/70">
                    Official authorized gate pass for provisioning vehicles entering Station Supply Depot.
                  </p>
                </div>
                <div className="p-2 border border-sand bg-snow rounded text-center shrink-0">
                  <QrCode className="w-12 h-12 text-olive mx-auto" />
                  <span className="text-[9px] font-mono text-pine/60 block mt-1">SEAL CHECK PASS</span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs border-b border-sand/40 pb-3 font-mono">
                <div>
                  <span className="text-[10px] text-pine/60 font-sans uppercase font-bold block">Challan No</span>
                  <span className="font-bold text-olive-deep text-sm">{selectedConsignment.challan_no}</span>
                </div>
                <div>
                  <span className="text-[10px] text-pine/60 font-sans uppercase font-bold block">PO Reference</span>
                  <span className="font-bold text-olive-deep text-sm">{selectedConsignment.po_id}</span>
                </div>
                <div>
                  <span className="text-[10px] text-pine/60 font-sans uppercase font-bold block">Vehicle No</span>
                  <span className="font-bold text-pine text-sm">{selectedConsignment.vehicle_no}</span>
                </div>
                <div>
                  <span className="text-[10px] text-pine/60 font-sans uppercase font-bold block">Security Seal</span>
                  <span className="font-bold text-success text-sm">{selectedConsignment.seal_no}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-snow p-3 rounded border border-sand/40">
                <div>
                  <span className="text-[10px] text-pine/60 uppercase font-bold block">Authorized Supplier</span>
                  <strong className="text-olive-deep text-sm block">{activeVendor?.name || 'Kisan Agro Products Ltd.'}</strong>
                  <span className="text-pine/70 text-[11px]">GSTIN: {activeVendor?.tax_id || '02AABCK4021M1ZN'}</span>
                </div>
                <div>
                  <span className="text-[10px] text-pine/60 uppercase font-bold block">Driver Credentials</span>
                  <strong className="text-pine text-sm block">{selectedConsignment.driver_name}</strong>
                  <span className="text-pine/70 font-mono text-[11px]">Mobile: {selectedConsignment.driver_phone}</span>
                </div>
              </div>

              <div>
                <span className="text-[10px] font-heading font-bold uppercase tracking-wider text-olive-deep block mb-1.5">
                  Consignment Cargo Manifest
                </span>
                <div className="p-3 bg-white border border-sand/60 rounded text-xs space-y-1">
                  <div className="font-medium text-olive-deep">{selectedConsignment.items_summary}</div>
                  <div className="text-pine/70 font-mono text-[11px] pt-1 border-t border-sand/30 flex justify-between">
                    <span>Total Net Weight: <strong>{selectedConsignment.total_weight_kg} kg</strong></span>
                    <span>Atmosphere: <strong>{selectedConsignment.reefer_temp}</strong></span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 pt-4 border-t-2 border-dashed border-sand/60 text-xs">
                <div className="text-center pt-6 border-t border-pine/30">
                  <span className="font-heading font-bold text-olive-deep block">Transporter / Dispatch Officer</span>
                  <span className="text-[10px] text-pine/60 block">Regional Logistics Hub</span>
                </div>
                <div className="text-center pt-6 border-t border-pine/30">
                  <span className="font-heading font-bold text-olive-deep block">Receiving Storekeeper</span>
                  <span className="text-[10px] text-pine/60 block">Central Supply Depot Gate Check</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-[10px] font-mono text-pine/60">
                Generated via Station Automated Provisions Network (RMS-SAP)
              </span>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsChallanModalOpen(false)}
                >
                  Close
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    window.print();
                    toast({ title: 'Print Dispatch', message: 'Gate pass sent to local printer queue.' });
                  }}
                  icon={<Printer className="w-3.5 h-3.5" />}
                >
                  Print Official Gate Pass
                </Button>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* WAYPOINT TRACKER MODAL */}
      {isTrackModalOpen && selectedConsignment && (
        <Modal
          isOpen={isTrackModalOpen}
          onClose={() => setIsTrackModalOpen(false)}
          title="Consignment Transit Telemetry & Waypoints"
          description={`Live corridor status for ${selectedConsignment.challan_no}`}
        >
          <div className="flex flex-col gap-4 font-body text-pine mt-2">
            <div className="p-3 bg-night text-snow rounded-card border border-sand/40 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-sand font-mono uppercase block">Live Tracking Target</span>
                <span className="font-heading font-extrabold text-base text-snow">
                  {selectedConsignment.vehicle_no} • {selectedConsignment.challan_no}
                </span>
              </div>
              <Badge variant="gold" pulse>
                GPS ACTIVE
              </Badge>
            </div>

            {/* Stepper Timeline */}
            <div className="space-y-4 py-2 pl-4 border-l-2 border-olive/30 relative ml-2">
              <div className="relative">
                <span className="w-3 h-3 rounded-full bg-success absolute -left-[23px] top-1 ring-4 ring-white" />
                <h5 className="font-heading font-bold text-xs text-olive-deep">1. Warehouse Dispatch Verified</h5>
                <p className="text-[11px] text-pine/70 font-mono">
                  {selectedConsignment.departure_time.split('T')[0]} 06:30 HRS • Regional Depot Hub
                </p>
                <span className="text-[10px] text-pine/60 block mt-0.5">Seals inspected and GPS telemetry registered.</span>
              </div>

              <div className="relative">
                <span className={`w-3 h-3 rounded-full absolute -left-[23px] top-1 ring-4 ring-white ${
                  selectedConsignment.status === 'delivered' || selectedConsignment.status === 'checkpoint_cleared'
                    ? 'bg-success'
                    : 'bg-gold animate-pulse'
                }`} />
                <h5 className="font-heading font-bold text-xs text-olive-deep">2. Mountain Pass Checkpoint Cleared</h5>
                <p className="text-[11px] text-pine/70 font-mono">Sector 04 High-Altitude Transit Gate</p>
                <span className="text-[10px] text-pine/60 block mt-0.5">Physical barrier clearance and seal integrity check confirmed.</span>
              </div>

              <div className="relative">
                <span className={`w-3 h-3 rounded-full absolute -left-[23px] top-1 ring-4 ring-white ${
                  selectedConsignment.status === 'delivered' ? 'bg-success' : 'bg-sand/60'
                }`} />
                <h5 className="font-heading font-bold text-xs text-olive-deep">3. Central Supply Depot Intake</h5>
                <p className="text-[11px] text-pine/70 font-mono">Unloading Bay 02 • Silos &amp; Cold Storage</p>
                <span className="text-[10px] text-pine/60 block mt-0.5">Gross weighbridge reading and lab sample extraction.</span>
              </div>

              <div className="relative">
                <span className={`w-3 h-3 rounded-full absolute -left-[23px] top-1 ring-4 ring-white ${
                  selectedConsignment.status === 'delivered' ? 'bg-success' : 'bg-sand/60'
                }`} />
                <h5 className="font-heading font-bold text-xs text-olive-deep">4. Goods Receipt Note (GRN) Acknowledgment</h5>
                <p className="text-[11px] text-pine/70 font-mono">Storekeeper Ledger Mutation</p>
                <span className="text-[10px] text-pine/60 block mt-0.5">Consignment transferred to derived active stock ledger.</span>
              </div>
            </div>

            <div className="flex items-center justify-end pt-2 border-t border-sand/40">
              <Button
                variant="primary"
                size="sm"
                onClick={() => setIsTrackModalOpen(false)}
              >
                Close Telemetry
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default VendorDispatchView;
