import React, { useEffect, useState } from 'react';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { PortionStepper } from '../../components/PortionStepper';
import { StatusChip } from '../../components/StatusChip';
import { api } from '../../api/client';
import { PurchaseOrder, Vendor, Item } from '../../types';
import { useToast } from '../../components/Toast';
import { useNavigate } from 'react-router-dom';
import {
  Truck,
  ArrowDownLeft,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  Package,
  ShieldCheck,
  Warehouse,
  Mountain,
} from 'lucide-react';

export const ReceiveDeliveryWizard: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const [pos, setPos] = useState<PurchaseOrder[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [selectedPoId, setSelectedPoId] = useState<string>('');
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [deliveries, setDeliveries] = useState<Record<string, number>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      try {
        const [poList, vendorList, itemList] = await Promise.all([
          api.purchaseOrders.list(),
          api.vendors.list(),
          api.items.list(),
        ]);
        const pending = poList.filter((p) => p.status === 'open' || p.status === 'partially_received');
        setPos(pending);
        setVendors(vendorList);
        setItems(itemList);

        if (pending.length > 0) {
          setSelectedPoId(pending[0].id);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  const selectedPO = pos.find((p) => p.id === selectedPoId);
  const selectedVendor = vendors.find((v) => v.id === selectedPO?.vendor_id);

  useEffect(() => {
    if (selectedPO) {
      const initialDeliveries: Record<string, number> = {};
      selectedPO.lines.forEach((line) => {
        const remaining = Math.max(0, line.ordered_qty - line.received_qty);
        initialDeliveries[line.id] = remaining;
      });
      setDeliveries(initialDeliveries);
    }
  }, [selectedPoId]);

  const handleDeliveryChange = (lineId: string, val: number) => {
    setDeliveries((prev) => ({ ...prev, [lineId]: val }));
  };

  const hasAnyItemsToReceive = Object.values(deliveries).some((qty) => qty > 0);

  const overDeliveryLines = selectedPO?.lines.filter((line) => {
    const incoming = deliveries[line.id] || 0;
    return line.received_qty + incoming > line.ordered_qty;
  }) || [];

  const handleConfirmReceive = async () => {
    if (!selectedPO) return;
    setIsSubmitting(true);
    try {
      const deliveryPayload = Object.entries(deliveries)
        .filter(([, qty]) => qty > 0)
        .map(([line_id, received_qty]) => ({
          line_id,
          received_qty,
        }));

      await api.purchaseOrders.receiveDelivery(selectedPO.id, deliveryPayload);

      toast({
        title: 'Consignment Received & Stock Posted',
        message: `Indent ${selectedPO.id} intake verified. Physical stock appended to Central Depot ledger.`,
      });

      navigate('/store');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to receive delivery';
      toast({ type: 'error', title: 'Receipt Failed', message: msg });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3">
        <div className="w-10 h-10 border-3 border-olive border-t-gold rounded-full animate-spin" />
        <span className="font-heading font-bold text-xs uppercase tracking-wider text-olive">
          Loading In-Transit Consignments...
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 pb-12 max-w-4xl mx-auto font-body text-pine">
      {/* Wizard Operational Header */}
      <div className="p-6 md:p-8 bg-night text-snow rounded-card border border-sand/40 shadow-elevation flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-control bg-olive/70 border border-gold/40 flex items-center justify-center text-gold shrink-0 shadow-subtle">
            <Truck className="w-6 h-6" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-badge bg-gold/15 border border-gold/40 text-gold text-[10px] font-heading font-bold uppercase tracking-wider mb-1.5">
              <Mountain className="w-3 h-3 text-gold" />
              <span>CENTRAL SUPPLY DEPOT • INTAKE WIZARD</span>
            </div>
            <h1 className="font-heading font-extrabold text-2xl md:text-3xl text-snow tracking-tight">
              Receive Vendor Consignment
            </h1>
            <p className="text-xs text-sand font-medium mt-1">
              Step-by-step verification • Partial intake &amp; over-delivery audit • Direct posting to Central Depot ledger.
            </p>
          </div>
        </div>

        {/* Stepper Pipeline */}
        <div className="flex items-center gap-2 bg-olive-deep/80 px-4 py-2 border border-sand/30 rounded-control shadow-subtle text-xs font-heading font-bold select-none">
          <span className={`px-2 py-0.5 rounded ${currentStep === 1 ? 'bg-gold text-night' : 'text-sand'}`}>
            1. Select PO
          </span>
          <span className="text-sand/40">/</span>
          <span className={`px-2 py-0.5 rounded ${currentStep === 2 ? 'bg-gold text-night' : 'text-sand'}`}>
            2. Intake Tally
          </span>
          <span className="text-sand/40">/</span>
          <span className={`px-2 py-0.5 rounded ${currentStep === 3 ? 'bg-gold text-night' : 'text-sand'}`}>
            3. Commit
          </span>
        </div>
      </div>

      {/* STEP 1: Select Purchase Order */}
      {currentStep === 1 && (
        <Card className="flex flex-col gap-6 border border-sand/60 shadow-subtle">
          <div>
            <h3 className="font-heading font-extrabold text-xl text-olive-deep">
              Step 1: Select Consignment Purchase Order
            </h3>
            <p className="text-xs text-pine/70 mt-0.5">
              Select the active vendor indent against which delivery trucks have arrived at Depot Gate 1.
            </p>
          </div>

          {pos.length === 0 ? (
            <div className="p-8 text-center bg-snow rounded-control border border-sand/30">
              <p className="font-heading font-bold text-sm text-olive-deep">No Open Purchase Orders Found</p>
              <p className="text-xs text-pine/70 mt-1">All supplier orders have already been fulfilled or none were raised.</p>
              <Button variant="primary" size="sm" className="mt-4" onClick={() => navigate('/store/create-po')}>
                Raise New Purchase Order
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pos.map((po) => {
                const vendor = vendors.find((v) => v.id === po.vendor_id);
                const isSelected = po.id === selectedPoId;
                const totalOrdered = po.lines.reduce((acc, l) => acc + l.ordered_qty, 0);
                const totalReceived = po.lines.reduce((acc, l) => acc + l.received_qty, 0);
                const pct = Math.round((totalReceived / (totalOrdered || 1)) * 100);

                return (
                  <button
                    key={po.id}
                    type="button"
                    onClick={() => setSelectedPoId(po.id)}
                    className={`p-5 rounded-control border text-left transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'border-olive bg-olive/10 shadow-elevation ring-2 ring-olive/20'
                        : 'border-sand/40 bg-white hover:border-sand hover:bg-snow/50'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between pb-2">
                        <span className="font-mono font-bold text-sm text-olive-deep uppercase">
                          {po.id}
                        </span>
                        <StatusChip type="po" value={po.status} size="sm" />
                      </div>
                      <h4 className="font-heading font-bold text-sm text-pine">{vendor?.name || 'Contracted Supplier'}</h4>
                      <p className="text-xs text-pine/70 mt-0.5 font-mono">{vendor?.category}</p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-sand/30">
                      <div className="flex justify-between text-xs font-heading font-semibold text-pine mb-1.5">
                        <span>Fulfillment: {totalReceived} / {totalOrdered} units</span>
                        <span className="font-mono tabular-nums">{pct}%</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-sand/30 overflow-hidden">
                        <div className="h-full bg-glacier rounded-full transition-all" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          <div className="flex justify-end pt-4 border-t border-sand/30">
            <Button
              variant="primary"
              size="lg"
              disabled={!selectedPO}
              onClick={() => setCurrentStep(2)}
              icon={<ArrowRight className="w-5 h-5 stroke-[2.5]" />}
            >
              Continue to Commodity Intake
            </Button>
          </div>
        </Card>
      )}

      {/* STEP 2: Line Steppers with Partial & Over-delivery Logic */}
      {currentStep === 2 && selectedPO && (
        <Card className="flex flex-col gap-6 border border-sand/60 shadow-subtle">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-sand/30 gap-2">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-heading font-extrabold text-xl text-olive-deep">
                  Step 2: Unload Quantities for {selectedPO.id}
                </h3>
                <StatusChip type="po" value={selectedPO.status} size="sm" />
              </div>
              <p className="text-xs text-pine/70 mt-0.5">
                Supplier: <strong className="text-pine font-heading">{selectedVendor?.name}</strong> • Adjust each tally to the exact weight/units verified at the weighbridge.
              </p>
            </div>
          </div>

          {/* Over-delivery Warning Chip */}
          {overDeliveryLines.length > 0 && (
            <div className="p-3.5 bg-danger/10 border border-danger/30 rounded-control flex items-center gap-3 text-pine text-xs font-bold">
              <AlertTriangle className="w-5 h-5 text-danger shrink-0" />
              <span>
                Over-Delivery Detected: Received count exceeds indent for {overDeliveryLines.map((l) => items.find((i) => i.id === l.item_id)?.name).join(', ')}. Ledger will record actual verified intake.
              </span>
            </div>
          )}

          {/* Lines Steppers List */}
          <div className="flex flex-col gap-4">
            {selectedPO.lines.map((line) => {
              const item = items.find((i) => i.id === line.item_id);
              const remaining = Math.max(0, line.ordered_qty - line.received_qty);
              const incoming = deliveries[line.id] || 0;
              const isOver = line.received_qty + incoming > line.ordered_qty;

              return (
                <div
                  key={line.id}
                  className={`p-4 rounded-control border flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all ${
                    isOver ? 'border-danger/40 bg-danger/5' : 'border-sand/40 bg-white shadow-subtle'
                  }`}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-heading font-extrabold text-base text-olive-deep">{item?.name}</h4>
                      {isOver && (
                        <span className="text-[10px] font-heading font-bold px-2 py-0.5 rounded-badge bg-danger text-snow">
                          +{line.received_qty + incoming - line.ordered_qty} {item?.unit} Surplus
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-pine/70 mt-1 font-mono">
                      <span>Contract: <strong className="text-pine">{line.ordered_qty} {item?.unit}</strong></span>
                      <span>•</span>
                      <span>Prev. Received: <strong className="text-pine">{line.received_qty} {item?.unit}</strong></span>
                      <span>•</span>
                      <span>Remaining Expected: <strong className="text-success font-bold">{remaining} {item?.unit}</strong></span>
                    </div>
                  </div>

                  {/* Incoming Delivery Stepper */}
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-heading font-bold text-pine/80">Delivered Now:</span>
                    <PortionStepper
                      value={incoming}
                      onChange={(v) => handleDeliveryChange(line.id, v)}
                      unit={item?.unit || 'kg'}
                      step={item?.unit === 'kg' || item?.unit === 'litre' ? 5 : 1}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-between pt-4 border-t border-sand/30">
            <Button variant="outline" onClick={() => setCurrentStep(1)} icon={<ArrowLeft className="w-4 h-4" />}>
              Back to PO Selection
            </Button>
            <Button
              variant="primary"
              size="lg"
              disabled={!hasAnyItemsToReceive}
              onClick={() => setCurrentStep(3)}
              icon={<ArrowRight className="w-5 h-5 stroke-[2.5]" />}
            >
              Review Delivery Intake
            </Button>
          </div>
        </Card>
      )}

      {/* STEP 3: Review & Final Commit */}
      {currentStep === 3 && selectedPO && (
        <Card className="flex flex-col gap-6 border border-sand/60 shadow-subtle">
          <div>
            <h3 className="font-heading font-extrabold text-xl text-olive-deep">
              Step 3: Review &amp; Post Delivery Intake
            </h3>
            <p className="text-xs text-pine/70 mt-0.5">
              Confirming will append receipt transactions to the Central Depot ledger and register an immutable station audit entry.
            </p>
          </div>

          <div className="p-4 bg-snow rounded-control border border-sand/40 flex flex-col gap-2">
            <div className="flex justify-between text-xs pb-2 border-b border-sand/20">
              <span className="text-pine/70 font-bold">Consignment Order:</span>
              <span className="font-mono font-bold text-olive-deep">{selectedPO.id}</span>
            </div>
            <div className="flex justify-between text-xs pb-2 border-b border-sand/20">
              <span className="text-pine/70 font-bold">Vendor Name:</span>
              <span className="font-heading font-bold text-pine">{selectedVendor?.name}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-pine/70 font-bold">Intake Timestamp:</span>
              <span className="font-mono text-pine">{new Date().toLocaleString('en-IN')}</span>
            </div>
          </div>

          {/* Operational High-Density Intake Table */}
          <div className="overflow-x-auto rounded-control border border-sand/40">
            <table className="table-operational">
              <thead>
                <tr>
                  <th>Commodity</th>
                  <th>Contract Indent</th>
                  <th>Intake Now</th>
                  <th>Post-Intake Total</th>
                </tr>
              </thead>
              <tbody>
                {selectedPO.lines.map((line) => {
                  const item = items.find((i) => i.id === line.item_id);
                  const incoming = deliveries[line.id] || 0;
                  const newTotal = line.received_qty + incoming;

                  return (
                    <tr key={line.id}>
                      <td className="font-heading font-bold text-pine">{item?.name}</td>
                      <td className="font-mono">{line.ordered_qty} {item?.unit}</td>
                      <td className="font-mono font-bold text-success">+{incoming} {item?.unit}</td>
                      <td className="font-mono font-bold">{newTotal} / {line.ordered_qty} {item?.unit}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="flex justify-between pt-4 border-t border-sand/30">
            <Button variant="outline" onClick={() => setCurrentStep(2)} icon={<ArrowLeft className="w-4 h-4" />}>
              Back to Steppers
            </Button>
            <Button
              variant="primary"
              size="lg"
              isLoading={isSubmitting}
              onClick={handleConfirmReceive}
              icon={<ShieldCheck className="w-5 h-5 stroke-[2.5]" />}
            >
              Post to Central Depot Ledger
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};

export default ReceiveDeliveryWizard;
