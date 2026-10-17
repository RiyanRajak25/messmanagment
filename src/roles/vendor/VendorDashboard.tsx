import React, { useState, useEffect } from 'react';
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
} from 'lucide-react';

interface DispatchRecord {
  po_id: string;
  challan_no: string;
  vehicle_no: string;
  driver_name: string;
  driver_phone: string;
  dispatch_time: string;
  eta: string;
  notes: string;
}

export const VendorDashboard: React.FC = () => {
  const { toast } = useToast();
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [selectedVendorId, setSelectedVendorId] = useState<string>('vendor-1');
  const [pos, setPos] = useState<PurchaseOrder[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Dispatch Modal state
  const [isDispatchModalOpen, setIsDispatchModalOpen] = useState(false);
  const [dispatchPo, setDispatchPo] = useState<PurchaseOrder | null>(null);
  const [challanNo, setChallanNo] = useState(`CHAL-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`);
  const [vehicleNo, setVehicleNo] = useState('HP-01-AB-4021');
  const [driverName, setDriverName] = useState('Kuldeep Verma');
  const [driverPhone, setDriverPhone] = useState('+91 98160 55412');
  const [etaDate, setEtaDate] = useState(new Date(Date.now() + 86400000).toISOString().split('T')[0]);
  const [dispatchNotes, setDispatchNotes] = useState('Sealed batch, moisture-controlled transit container.');
  const [dispatches, setDispatches] = useState<Record<string, DispatchRecord>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      } catch (err) {
        console.error('Failed to load vendor portal data', err);
        toast({ type: 'error', title: 'Error', message: 'Failed to load supplier orders' });
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

  const calculatePoTotal = (po: PurchaseOrder) => {
    return po.lines.reduce((acc, l) => acc + l.ordered_qty * l.unit_price, 0);
  };

  const calculateDelivered = (po: PurchaseOrder) => {
    return po.lines.reduce((acc, l) => acc + l.received_qty * l.unit_price, 0);
  };

  const totalOrdersCount = vendorPos.length;
  const totalBilledValue = vendorPos.reduce((acc, po) => acc + calculatePoTotal(po), 0);
  const deliveredValue = vendorPos.reduce((acc, po) => acc + calculateDelivered(po), 0);
  const pendingOrders = vendorPos.filter((po) => po.status !== 'closed').length;

  const handleOpenDispatchModal = (po: PurchaseOrder) => {
    setDispatchPo(po);
    setChallanNo(`CHAL-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`);
    setIsDispatchModalOpen(true);
  };

  const handleConfirmDispatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dispatchPo) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const record: DispatchRecord = {
        po_id: dispatchPo.id,
        challan_no: challanNo,
        vehicle_no: vehicleNo,
        driver_name: driverName,
        driver_phone: driverPhone,
        dispatch_time: new Date().toISOString(),
        eta: etaDate,
        notes: dispatchNotes,
      };

      setDispatches((prev) => ({
        ...prev,
        [dispatchPo.id]: record,
      }));

      setIsSubmitting(false);
      setIsDispatchModalOpen(false);

      toast({
        title: 'Dispatch Confirmed',
        message: `Consignment for ${dispatchPo.id} marked In-Transit under Challan #${challanNo}.`,
      });
    }, 400);
  };

  const exportCSV = () => {
    if (vendorPos.length === 0) {
      toast({ type: 'warning', title: 'No Data', message: 'No orders available for export.' });
      return;
    }
    const headers = ['PO ID', 'Date', 'Commodity', 'Ordered Qty', 'Delivered Qty', 'Unit Rate (INR)', 'Order Value (INR)', 'Status', 'Challan No'];
    const rows: (string | number)[][] = [];

    vendorPos.forEach((po) => {
      const disp = dispatches[po.id];
      po.lines.forEach((l) => {
        const item = getItem(l.item_id);
        rows.push([
          po.id,
          po.created_at.split('T')[0],
          item ? `"${item.name}"` : l.item_id,
          l.ordered_qty,
          l.received_qty,
          l.unit_price,
          l.ordered_qty * l.unit_price,
          po.status.toUpperCase(),
          disp ? disp.challan_no : 'PENDING_DISPATCH',
        ]);
      });
    });

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Supplier_Orders_${selectedVendorId}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({ title: 'Export Complete', message: 'Supplier orders register downloaded as CSV.' });
  };

  const filteredOrders = vendorPos.filter((po) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      po.id.toLowerCase().includes(q) ||
      po.lines.some((l) => {
        const it = getItem(l.item_id);
        return it && it.name.toLowerCase().includes(q);
      });
    const matchesStatus = statusFilter === 'all' || po.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="flex flex-col gap-6 pb-12 font-body text-pine">
      {/* Navigation Breadcrumb */}
      <Breadcrumb
        items={[
          { label: 'Central Logistics', href: '/' },
          { label: 'Certified Provisions Supplier Console', current: true },
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
              <span>CERTIFIED PROVISIONS SUPPLIER PORTAL • LOGISTICS BAY</span>
            </div>
            <h1 className="font-heading font-extrabold text-2xl md:text-3xl text-snow tracking-tight">
              {activeVendor?.name || 'Provisions Supplier Console'}
            </h1>
            <p className="text-xs text-sand font-medium mt-1 flex flex-wrap items-center gap-2">
              <span>GSTIN: {activeVendor?.tax_id || '07AAAAA0000A1Z5'}</span>
              <span>•</span>
              <span>Category: {activeVendor?.category || 'Certified Provisions'}</span>
              <span>•</span>
              <span className="text-gold font-bold">Rating: {activeVendor?.rating || 4.8} / 5.0 ★</span>
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Vendor Switcher */}
          <div className="flex items-center gap-2 bg-olive-deep/90 border border-sand/40 px-3 py-1.5 rounded-control">
            <Building className="w-4 h-4 text-gold" />
            <select
              value={selectedVendorId}
              onChange={(e) => setSelectedVendorId(e.target.value)}
              className="bg-transparent text-snow text-xs font-heading font-bold focus:outline-none cursor-pointer"
            >
              {vendors.map((v) => (
                <option key={v.id} value={v.id} className="bg-night text-snow">
                  {v.name}
                </option>
              ))}
            </select>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={exportCSV}
            icon={<FileSpreadsheet className="w-4 h-4" />}
            className="text-snow border-sand/40 hover:bg-olive-deep"
          >
            Export Orders CSV
          </Button>
        </div>
      </div>

      {/* Modern High-Precision Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Indents Awarded"
          value={`${totalOrdersCount}`}
          icon={<Package className="w-5 h-5 text-gold" />}
          trend={{ value: `${vendorPos.length} Orders`, direction: 'neutral' }}
          subtitle="Annual contract"
          variant="gold"
        />
        <StatCard
          label="Total Contract Value"
          value={`₹${totalBilledValue.toLocaleString('en-IN')}`}
          icon={<FileText className="w-5 h-5 text-olive" />}
          trend={{ value: '+8.2%', direction: 'up', label: 'FY-26 Quota' }}
          subtitle="Cumulative billing"
        />
        <StatCard
          label="Delivered & Received"
          value={`₹${deliveredValue.toLocaleString('en-IN')}`}
          icon={<CheckCircle2 className="w-5 h-5 text-success" />}
          trend={{ value: '100% Verified', direction: 'up', label: 'At depot' }}
          subtitle="Passed QC check"
        />
        <StatCard
          label="Pending Consignments"
          value={`${pendingOrders}`}
          icon={<Clock className="w-5 h-5 text-glacier" />}
          trend={{ value: `${pendingOrders > 0 ? 'Urgent' : 'Clear'}`, direction: pendingOrders > 0 ? 'down' : 'up' }}
          subtitle="In-transit / intake"
        />
      </div>

      {/* Modern Table Controls & Filters Toolbar */}
      <Card className="p-4 bg-white border border-sand/60 shadow-subtle">
        <TableControls<string>
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder="Search my orders by PO number, item name, or challan..."
          filterChips={[
            { id: 'all', label: 'All Orders', count: vendorPos.length },
            { id: 'open', label: 'Awaiting Dispatch', count: vendorPos.filter(p => p.status === 'open').length },
            { id: 'partially_received', label: 'Partially Delivered', count: vendorPos.filter(p => p.status === 'partially_received').length },
            { id: 'closed', label: 'Fully Delivered', count: vendorPos.filter(p => p.status === 'closed').length },
          ]}
          activeFilter={statusFilter}
          onFilterChange={setStatusFilter}
          totalResults={filteredOrders.length}
          onExport={exportCSV}
        />
      </Card>

      {/* My Purchase Orders Table */}
      <div className="rounded-card border border-sand/60 bg-white shadow-subtle overflow-hidden">
        <div className="p-4 bg-snow border-b border-sand/40 flex items-center justify-between">
          <div>
            <h3 className="font-heading font-extrabold text-base text-olive-deep">
              Contracted Consignments &amp; Supply Orders
            </h3>
            <p className="text-xs text-pine/70">
              Procurement indents raised by the Central Supply Depot for this supplier agency.
            </p>
          </div>
          <span className="px-2.5 py-1 rounded-badge bg-gold/15 text-gold text-[10px] font-heading font-bold border border-gold/40 uppercase">
            Official PO Register
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="table-operational w-full text-left border-collapse">
            <thead>
              <tr className="bg-olive-deep text-sand text-[10px] font-heading font-bold uppercase tracking-wider select-none">
                <th className="py-3 px-4">PO Number</th>
                <th className="py-3 px-4">Issue Date</th>
                <th className="py-3 px-4">Commodity Lines</th>
                <th className="py-3 px-4 text-right">Contract Value</th>
                <th className="py-3 px-4">Dispatch Reference</th>
                <th className="py-3 px-4 text-center">Depot Status</th>
                <th className="py-3 px-4 text-right">Logistics Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sand/20 text-xs font-sans text-olive-deep">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-pine/60">
                    Loading vendor purchase orders...
                  </td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-pine/60 italic">
                    No purchase orders found for {activeVendor?.name}.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((po) => {
                  const total = calculatePoTotal(po);
                  const isDelivered = po.status === 'closed' || po.lines.every((l) => l.received_qty >= l.ordered_qty);
                  const dispatch = dispatches[po.id];

                  return (
                    <tr key={po.id} className="hover:bg-snow/60 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-olive-deep text-xs">
                        {po.id}
                        <div className="text-[10px] text-pine/60 font-sans mt-0.5">
                          Auth: {po.created_by}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 font-mono text-[11px] text-pine/80">
                        {po.created_at.split('T')[0]}
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex flex-col gap-1">
                          {po.lines.map((l) => {
                            const item = getItem(l.item_id);
                            return (
                              <div key={l.item_id} className="flex items-center gap-1.5 text-xs">
                                <span className="font-bold text-olive-deep">{item?.name || l.item_id}</span>
                                <span className="text-pine/70 font-mono text-[11px]">
                                  ({l.ordered_qty} {item?.unit || 'kg'} @ ₹{l.unit_price})
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-right font-mono font-bold text-olive-deep text-sm">
                        ₹{total.toLocaleString('en-IN')}
                      </td>

                      <td className="py-3.5 px-4">
                        {dispatch ? (
                          <div className="flex flex-col">
                            <span className="font-mono text-xs font-bold text-olive-deep">
                              {dispatch.challan_no}
                            </span>
                            <span className="text-[10px] text-pine/60 font-mono">
                              Veh: {dispatch.vehicle_no}
                            </span>
                          </div>
                        ) : (
                          <span className="text-xs text-pine/50 italic">
                            Awaiting Dispatch
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        {isDelivered ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-badge bg-success/10 text-success border border-success/30 font-mono text-[10px] font-bold">
                            <CheckCircle2 className="w-3 h-3" /> DELIVERED
                          </span>
                        ) : dispatch ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-badge bg-gold/15 text-gold border border-gold/40 font-mono text-[10px] font-bold">
                            <Truck className="w-3 h-3" /> IN TRANSIT
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-badge bg-glacier/15 text-glacier border border-glacier/30 font-mono text-[10px] font-bold">
                            <Clock className="w-3 h-3" /> PENDING
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        {isDelivered ? (
                          <span className="text-xs font-mono font-bold text-success">
                            Receipt Confirmed ✓
                          </span>
                        ) : (
                          <Button
                            variant={dispatch ? 'outline' : 'primary'}
                            size="sm"
                            onClick={() => handleOpenDispatchModal(po)}
                            icon={<Send className="w-3 h-3" />}
                            className="text-xs font-bold"
                          >
                            {dispatch ? 'Update ASN' : 'Dispatch Consignment'}
                          </Button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Progressive Disclosure: Supplier Transit & Quality Guidelines Accordion */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 px-1">
          <ShieldCheck className="w-4 h-4 text-gold" />
          <h4 className="font-heading font-extrabold text-xs uppercase tracking-wider text-olive-deep">
            Institutional Provisions Delivery &amp; Cold-Chain Standards
          </h4>
        </div>
        <Accordion
          items={[
            {
              id: 'asn-protocol',
              title: 'Advanced Shipping Notice (ASN) & Challan Policy',
              subtitle: 'Mandatory dispatch pre-notification parameters',
              badge: <Badge variant="gold">REQUIRED</Badge>,
              children: (
                <div className="text-xs text-pine/80 space-y-2 leading-relaxed pt-2">
                  <p>
                    All consignments en route to high-altitude depots must be preceded by an authenticated ASN with vehicle registration number, driver biometric verification, and GPS tracking link. Intakes without valid ASN will be held at checkpoint security.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                    <div className="p-2.5 rounded bg-white border border-sand/40">
                      <span className="font-heading font-bold text-olive block text-[11px]">1. Lead Time</span>
                      <span className="text-[10px] text-pine/60">Minimum 6-hour advance notification before transit window.</span>
                    </div>
                    <div className="p-2.5 rounded bg-white border border-sand/40">
                      <span className="font-heading font-bold text-olive block text-[11px]">2. Seal Number</span>
                      <span className="text-[10px] text-pine/60">Tamper-evident container seal recorded on invoice challan.</span>
                    </div>
                    <div className="p-2.5 rounded bg-white border border-sand/40">
                      <span className="font-heading font-bold text-olive block text-[11px]">3. Intake Gate</span>
                      <span className="text-[10px] text-pine/60">Weighbridge calibration certificate matching PO weight ±0.5%.</span>
                    </div>
                  </div>
                </div>
              ),
            },
            {
              id: 'perishable-rules',
              title: 'Grain & Perishable Storage Moisture Tolerances',
              subtitle: 'FSSAI Institutional Specifications',
              children: (
                <div className="text-xs text-pine/80 space-y-2 leading-relaxed pt-2">
                  <p>
                    Grains, pulses, and dry rations must have moisture levels strictly below 12.5%. Mustard oil and ghee consignments must bear Agmark/FSSAI certified batch testing certificates. Refusal to meet standards triggers automatic supplier debit and consignment rejection.
                  </p>
                </div>
              ),
            },
          ]}
        />
      </div>

      {/* Dispatch Consignment Modal */}
      {dispatchPo && (
        <Modal
          isOpen={isDispatchModalOpen}
          onClose={() => setIsDispatchModalOpen(false)}
          title="Consignment Dispatch Notice (ASN)"
          description={`Issue Advanced Shipping Notice for ${dispatchPo.id}`}
        >
          <form onSubmit={handleConfirmDispatch} className="flex flex-col gap-4 font-body text-pine mt-2">
            <div className="p-3 bg-snow rounded-control border border-sand/40 flex items-center justify-between text-xs">
              <div>
                <span className="text-pine/60 text-[10px] uppercase font-bold block">Consignment Destination</span>
                <span className="font-heading font-bold text-olive-deep">
                  Central Supply Depot • Logistics Bay
                </span>
              </div>
              <div className="text-right">
                <span className="text-pine/60 text-[10px] uppercase font-bold block">Purchase Order</span>
                <span className="font-mono font-bold text-olive">{dispatchPo.id}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-heading font-bold text-olive uppercase mb-1">
                  Delivery Challan No.
                </label>
                <input
                  type="text"
                  value={challanNo}
                  onChange={(e) => setChallanNo(e.target.value)}
                  required
                  className="w-full px-3 py-2 text-xs font-mono font-bold rounded-control border border-sand bg-snow text-olive-deep focus:outline-none focus:border-olive"
                />
              </div>

              <div>
                <label className="block text-xs font-heading font-bold text-olive uppercase mb-1">
                  Transporter Vehicle No.
                </label>
                <input
                  type="text"
                  value={vehicleNo}
                  onChange={(e) => setVehicleNo(e.target.value)}
                  required
                  className="w-full px-3 py-2 text-xs font-mono font-bold rounded-control border border-sand bg-snow text-olive-deep focus:outline-none focus:border-olive"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-heading font-bold text-olive uppercase mb-1">
                  Driver Name
                </label>
                <input
                  type="text"
                  value={driverName}
                  onChange={(e) => setDriverName(e.target.value)}
                  required
                  className="w-full px-3 py-2 text-xs font-sans rounded-control border border-sand bg-snow text-olive-deep focus:outline-none focus:border-olive"
                />
              </div>

              <div>
                <label className="block text-xs font-heading font-bold text-olive uppercase mb-1">
                  Driver Contact Phone
                </label>
                <input
                  type="text"
                  value={driverPhone}
                  onChange={(e) => setDriverPhone(e.target.value)}
                  required
                  className="w-full px-3 py-2 text-xs font-mono rounded-control border border-sand bg-snow text-olive-deep focus:outline-none focus:border-olive"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-heading font-bold text-olive uppercase mb-1">
                Estimated Depot Arrival Date (ETA)
              </label>
              <input
                type="date"
                value={etaDate}
                onChange={(e) => setEtaDate(e.target.value)}
                required
                className="w-full px-3 py-2 text-xs font-mono rounded-control border border-sand bg-snow text-olive-deep focus:outline-none focus:border-olive"
              />
            </div>

            <div>
              <label className="block text-xs font-heading font-bold text-olive uppercase mb-1">
                Batch Quality &amp; Transit Seal Notes
              </label>
              <textarea
                value={dispatchNotes}
                onChange={(e) => setDispatchNotes(e.target.value)}
                rows={2}
                className="w-full px-3 py-2 text-xs font-sans rounded-control border border-sand bg-snow text-olive-deep focus:outline-none focus:border-olive"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-sand/40">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsDispatchModalOpen(false)}
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
                {isSubmitting ? 'Transmitting...' : 'Confirm Dispatch Notice'}
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default VendorDashboard;
