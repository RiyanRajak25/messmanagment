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
  TrendingUp,
  Award,
  CheckCircle2,
  Clock,
  ShieldCheck,
  FileSpreadsheet,
  AlertTriangle,
  Mountain,
  Package,
  Truck,
  Star,
  FileText,
  Printer,
  Calendar,
  Building,
  Check,
  PackageCheck,
  Scale,
} from 'lucide-react';

interface QualityInspection {
  id: string;
  consignment_ref: string;
  commodity_name: string;
  inspection_date: string;
  moisture_pct: string;
  purity_pct: string;
  foreign_matter: string;
  packaging_condition: string;
  verdict: 'PASSED' | 'PASSED_GRADE_1' | 'ACCEPT_MINOR_VARIATION';
  inspector_name: string;
}

export const VendorPerformanceView: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [selectedVendorId, setSelectedVendorId] = useState<string>('vendor-1');
  const [pos, setPos] = useState<PurchaseOrder[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCertificateModalOpen, setIsCertificateModalOpen] = useState(false);

  // Quality Inspection Records
  const [inspections] = useState<QualityInspection[]>([
    {
      id: 'QC-2026-114',
      consignment_ref: 'CHAL-2026-8912',
      commodity_name: 'Basmati Rice (Grade A)',
      inspection_date: '2026-10-15',
      moisture_pct: '11.2% (Norm < 13%)',
      purity_pct: '99.8%',
      foreign_matter: 'Nil Detected',
      packaging_condition: 'Sealed 50kg Jute Bags, Tamper Tagged',
      verdict: 'PASSED_GRADE_1',
      inspector_name: 'Capt. R. Sharma, Food Inspection Officer',
    },
    {
      id: 'QC-2026-113',
      consignment_ref: 'CHAL-2026-7840',
      commodity_name: 'Pasteurized Butter & Fats',
      inspection_date: '2026-10-13',
      moisture_pct: '15.4% (Within Standard)',
      purity_pct: '100% Milk Fat',
      foreign_matter: 'Zero Impurities',
      packaging_condition: 'Insulated Cold Containers (+3.8°C)',
      verdict: 'PASSED',
      inspector_name: 'Dr. Meena Kapoor, Station Dietetics Officer',
    },
    {
      id: 'QC-2026-110',
      consignment_ref: 'CHAL-2026-6110',
      commodity_name: 'Whole Wheat Atta',
      inspection_date: '2026-10-09',
      moisture_pct: '11.8% (Norm < 12.5%)',
      purity_pct: '99.6%',
      foreign_matter: '< 0.05% Bran',
      packaging_condition: 'Triple-Layered Poly-lined Bags',
      verdict: 'PASSED_GRADE_1',
      inspector_name: 'Capt. R. Sharma, Food Inspection Officer',
    },
    {
      id: 'QC-2026-104',
      consignment_ref: 'CHAL-2026-4420',
      commodity_name: 'Toor Dal (Polished)',
      inspection_date: '2026-10-02',
      moisture_pct: '10.5% (Norm < 12%)',
      purity_pct: '99.4%',
      foreign_matter: '< 0.1% Organic Husk',
      packaging_condition: 'Moisture-proof double sealed',
      verdict: 'PASSED',
      inspector_name: 'Storekeeper Ramesh Patel',
    },
  ]);

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
        console.error('Failed to load performance data', err);
        toast({ type: 'error', title: 'Error', message: 'Failed to load supplier performance records' });
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [toast]);

  const activeVendor = vendors.find((v) => v.id === selectedVendorId) || vendors[0];
  const vendorPos = pos.filter((po) => po.vendor_id === selectedVendorId);

  const exportCSV = () => {
    const headers = [
      'Inspection ID',
      'Consignment Challan',
      'Commodity',
      'Date',
      'Moisture Content',
      'Purity Index',
      'Foreign Matter',
      'Packaging Condition',
      'Verdict',
      'Inspector Name',
    ];
    const rows = inspections.map((i) => [
      i.id,
      i.consignment_ref,
      `"${i.commodity_name}"`,
      i.inspection_date,
      `"${i.moisture_pct}"`,
      `"${i.purity_pct}"`,
      `"${i.foreign_matter}"`,
      `"${i.packaging_condition}"`,
      i.verdict,
      `"${i.inspector_name}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Supplier_Quality_Inspection_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({ title: 'Export Complete', message: 'Quality inspection audit downloaded as CSV.' });
  };

  return (
    <div className="flex flex-col gap-6 pb-12 font-body text-pine">
      {/* Navigation Breadcrumb */}
      <Breadcrumb
        items={[
          { label: 'Central Logistics', href: '/vendor' },
          { label: 'SLA & Delivery Performance Scorecard', current: true },
        ]}
      />

      {/* Header Banner */}
      <div className="p-6 md:p-8 bg-night text-snow rounded-card border border-sand/40 shadow-elevation flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-control bg-gold/20 border border-gold/40 flex items-center justify-center text-gold shrink-0 shadow-subtle">
            <Award className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-badge bg-gold/15 border border-gold/40 text-gold text-[10px] font-heading font-bold uppercase tracking-wider mb-1.5">
              <Mountain className="w-3.5 h-3.5 text-gold" />
              <span>CONTRACTED PROVISIONS SUPPLIER • VENDOR AUDIT SCORECARD</span>
            </div>
            <h1 className="font-heading font-extrabold text-2xl md:text-3xl text-snow tracking-tight">
              Supplier SLA &amp; Quality Compliance Scorecard
            </h1>
            <p className="text-xs text-sand font-medium mt-1">
              {activeVendor?.name || 'Kisan Agro Products Ltd.'} • On-time delivery ratios, sensory inspection pass rates, cold-chain compliance &amp; annual empanelment.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsCertificateModalOpen(true)}
            icon={<Award className="w-3.5 h-3.5" />}
          >
            Compliance Certificate
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={exportCSV}
            icon={<FileSpreadsheet className="w-3.5 h-3.5" />}
            className="text-snow border-sand/40 hover:bg-olive-deep"
          >
            Export Audit Ledger
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
            className="flex items-center gap-2 px-3.5 py-2 rounded-control text-xs font-heading font-bold text-olive hover:text-olive-deep hover:bg-snow transition-all"
          >
            <Truck className="w-3.5 h-3.5 text-sand" />
            <span>Consignment Dispatch &amp; Gate Passes</span>
          </button>
          <button
            type="button"
            onClick={() => navigate('/vendor/performance')}
            className="flex items-center gap-2 px-3.5 py-2 rounded-control text-xs font-heading font-bold bg-olive text-snow shadow-subtle border border-sand/30 transition-all"
          >
            <TrendingUp className="w-3.5 h-3.5 text-gold" />
            <span>SLA &amp; Delivery Scorecard</span>
          </button>
        </div>
      </div>

      {/* Executive Vendor Rating Card */}
      <div className="p-6 rounded-card border-2 border-gold/40 bg-gradient-to-r from-night via-night/95 to-olive-deep text-snow shadow-elevation flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-card bg-gold/20 border border-gold/40 flex flex-col items-center justify-center text-gold shadow-subtle shrink-0">
            <span className="font-heading font-extrabold text-2xl leading-none">4.9</span>
            <span className="text-[10px] font-mono font-bold mt-0.5">/ 5.0</span>
          </div>
          <div>
            <div className="flex items-center gap-1 text-gold mb-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-gold text-gold" />
              ))}
              <span className="text-xs font-heading font-bold text-sand ml-1">Grade-A Station Contractor</span>
            </div>
            <h3 className="font-heading font-extrabold text-xl text-snow">
              Kisan Agro Products Ltd. • Certified Provisions Agency
            </h3>
            <p className="text-xs text-sand/80 font-mono mt-0.5">
              Empanelment Code: <strong className="text-snow">VND-AGRO-01</strong> • Annual Rate Contract Active through FY 2026-27
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <Badge variant="gold">
            <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
            ZERO DEFECT RATING
          </Badge>
          <Badge variant="success">
            <ShieldCheck className="w-3.5 h-3.5 mr-1" />
            100% AUDIT COMPLIANT
          </Badge>
        </div>
      </div>

      {/* Key Metric StatCards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="On-Time Delivery (OTIF)"
          value="96.8%"
          icon={<Clock className="w-5 h-5 text-gold" />}
          trend={{ value: '+1.8%', direction: 'up', label: 'vs 95% SLA Target' }}
          subtitle="All mountain routes"
          variant="gold"
        />
        <StatCard
          label="Laboratory Quality Index"
          value="99.4%"
          icon={<ShieldCheck className="w-5 h-5 text-success" />}
          trend={{ value: 'Passed', direction: 'up', label: '0.6% Rejection' }}
          subtitle="Moisture & purity check"
        />
        <StatCard
          label="Cold-Chain Temperature"
          value="100%"
          icon={<CheckCircle2 className="w-5 h-5 text-glacier" />}
          trend={{ value: 'Zero Excursions', direction: 'neutral' }}
          subtitle="Reefer data verified"
        />
        <StatCard
          label="Avg. Payment Clearance"
          value="24 Hours"
          icon={<Scale className="w-5 h-5 text-olive" />}
          trend={{ value: 'T+1 Avg', direction: 'up', label: 'Direct RTGS' }}
          subtitle="Fastest turnaround"
        />
      </div>

      {/* Commodity Category Fulfillment Matrix */}
      <Card className="p-5 bg-white border border-sand/60 shadow-subtle space-y-4">
        <div>
          <h3 className="font-heading font-extrabold text-base text-olive-deep">
            Commodity Fulfillment &amp; Quality Parameters by Category
          </h3>
          <p className="text-xs text-pine/70">
            Fulfillment accuracy and moisture testing compliance verified at Central Depot Silos.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { category: 'Grains & Cereals', delivered: '14,200 kg', otif: '98.2%', qc: '99.6%', status: 'Optimal' },
            { category: 'Pulses & Lentils', delivered: '6,400 kg', otif: '95.5%', qc: '99.1%', status: 'Standard' },
            { category: 'Edible Oils & Fats', delivered: '2,800 L', otif: '100%', qc: '100%', status: 'Optimal' },
            { category: 'Preserved & Packaged', delivered: '4,100 Pks', otif: '96.0%', qc: '99.0%', status: 'Standard' },
          ].map((cat) => (
            <div key={cat.category} className="p-4 rounded-card border border-sand/60 bg-snow/40 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-heading font-bold text-sm text-olive-deep">{cat.category}</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-badge bg-success/15 text-success font-bold">
                  {cat.status}
                </span>
              </div>
              <div className="text-xl font-mono font-extrabold text-pine">{cat.delivered}</div>
              <div className="pt-2 border-t border-sand/30 flex justify-between text-xs text-pine/70 font-mono">
                <span>OTIF: <strong className="text-pine">{cat.otif}</strong></span>
                <span>QC: <strong className="text-success">{cat.qc}</strong></span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Quality Inspection Audit Ledger */}
      <div className="rounded-card border border-sand/60 bg-white shadow-subtle overflow-hidden">
        <div className="p-4 bg-snow border-b border-sand/40 flex items-center justify-between">
          <div>
            <h3 className="font-heading font-extrabold text-base text-olive-deep">
              Station Food Laboratory Quality Inspection Register
            </h3>
            <p className="text-xs text-pine/70">
              Lab tests conducted on delivery batches by the Station Food Inspection Unit prior to silo discharge.
            </p>
          </div>
          <span className="px-2.5 py-1 rounded-badge bg-gold/15 text-gold text-[10px] font-heading font-bold border border-gold/40 uppercase">
            FSSAI &amp; AGMARK Standard
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="table-operational w-full text-left border-collapse">
            <thead>
              <tr className="bg-olive-deep text-sand text-[10px] font-heading font-bold uppercase tracking-wider select-none">
                <th className="py-3 px-4">Inspection Ref</th>
                <th className="py-3 px-4">Consignment Challan</th>
                <th className="py-3 px-4">Commodity Sample</th>
                <th className="py-3 px-4">Moisture &amp; Purity Lab Test</th>
                <th className="py-3 px-4">Packaging &amp; Seals</th>
                <th className="py-3 px-4 text-center">Lab Verdict</th>
                <th className="py-3 px-4 text-right">Inspecting Authority</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sand/20 text-xs font-sans text-olive-deep">
              {inspections.map((i) => (
                <tr key={i.id} className="hover:bg-snow/60 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-olive-deep">
                    <div>{i.id}</div>
                    <div className="text-[10px] text-pine/60 font-sans mt-0.5">{i.inspection_date}</div>
                  </td>

                  <td className="py-3.5 px-4 font-mono">
                    <span className="px-2 py-0.5 rounded bg-snow border border-sand/40 font-bold text-pine text-xs">
                      {i.consignment_ref}
                    </span>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="font-heading font-bold text-olive-deep text-sm block">
                      {i.commodity_name}
                    </span>
                    <span className="text-[10px] text-pine/60">Sample Batch Random Extract</span>
                  </td>

                  <td className="py-3.5 px-4 font-mono">
                    <div className="text-xs font-bold text-pine">{i.moisture_pct}</div>
                    <div className="text-[11px] text-success font-semibold">Purity: {i.purity_pct} ({i.foreign_matter})</div>
                  </td>

                  <td className="py-3.5 px-4 text-xs text-pine/80">
                    {i.packaging_condition}
                  </td>

                  <td className="py-3.5 px-4 text-center">
                    <Badge variant="success">
                      <Check className="w-3 h-3 mr-1" />
                      {i.verdict === 'PASSED_GRADE_1' ? 'GRADE-1 PASS' : 'PASSED'}
                    </Badge>
                  </td>

                  <td className="py-3.5 px-4 text-right text-xs">
                    <span className="font-medium text-olive-deep block">{i.inspector_name}</span>
                    <span className="text-[10px] text-pine/60 font-mono">Signed &amp; Digitally Logged</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Contract Empanelment & Guarantee Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 bg-white border border-sand/60 space-y-2">
          <div className="flex items-center gap-2 text-olive">
            <Building className="w-4 h-4" />
            <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-olive-deep">
              Annual Rate Contract (ARC)
            </h4>
          </div>
          <p className="text-xs text-pine/80">
            Contract Ref: <strong className="font-mono text-pine">ARC/HQ/2026/04</strong>. Valid through <strong>31-MAR-2027</strong>. Fixed rate schedule for 31 scaled provisioning items.
          </p>
        </Card>

        <Card className="p-4 bg-white border border-sand/60 space-y-2">
          <div className="flex items-center gap-2 text-gold">
            <ShieldCheck className="w-4 h-4" />
            <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-olive-deep">
              Bank Guarantee &amp; Security Deposit
            </h4>
          </div>
          <p className="text-xs text-pine/80">
            Performance Bank Guarantee (PBG) of <strong>₹5,00,000</strong> pledged with State Bank of India (Central Station Branch). Zero encashment risk.
          </p>
        </Card>

        <Card className="p-4 bg-white border border-sand/60 space-y-2">
          <div className="flex items-center gap-2 text-success">
            <CheckCircle2 className="w-4 h-4" />
            <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-olive-deep">
              Demurrage &amp; Penalties
            </h4>
          </div>
          <p className="text-xs text-pine/80">
            Demurrage Incurred: <strong>₹0 (NIL)</strong>. Zero liquidated damages assessed across 12 consecutive billing cycles.
          </p>
        </Card>
      </div>

      {/* SLA & Governance Accordion */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 px-1">
          <ShieldCheck className="w-4 h-4 text-gold" />
          <h4 className="font-heading font-extrabold text-xs uppercase tracking-wider text-olive-deep">
            Supply Terms &amp; Quality Tolerance Governance Norms
          </h4>
        </div>
        <Accordion
          items={[
            {
              id: 'sla-penalties',
              title: 'Liquidated Damages & Delivery Schedule Adherence Rules',
              subtitle: 'Penalties for transit delays without prior force majeure declaration',
              badge: <Badge variant="gold">CONTRACT CLAUSE</Badge>,
              children: (
                <div className="text-xs text-pine/80 space-y-2 leading-relaxed pt-2">
                  <p>
                    Suppliers are required to deliver consignments within <strong>5 business days</strong> of purchase order placement. In the event of unexcused delays, liquidated damages are levied at 0.5% per week up to a maximum of 10% of order value.
                  </p>
                  <p>
                    Weather closures at high-altitude passes are acknowledged as force majeure upon receipt of regional highway clearance advisories.
                  </p>
                </div>
              ),
            },
            {
              id: 'rejection-replacement',
              title: 'Immediate Consignment Replacement & Lab Re-Testing Protocol',
              subtitle: 'Procedures in the event of sub-standard grain or compromised seals',
              children: (
                <div className="text-xs text-pine/80 space-y-2 leading-relaxed pt-2">
                  <p>
                    If any consignment sample fails moisture, foreign matter, or sensory inspection, the contractor must uplift the rejected cargo within <strong>48 hours</strong> and replace it with approved Grade-1 stock at zero additional cost to the Station Supply Depot.
                  </p>
                </div>
              ),
            },
          ]}
        />
      </div>

      {/* COMPLIANCE CERTIFICATE MODAL */}
      {isCertificateModalOpen && (
        <Modal
          isOpen={isCertificateModalOpen}
          onClose={() => setIsCertificateModalOpen(false)}
          title="Official Supplier SLA Compliance Certificate"
          description="Institutional Certification of Satisfactory Provisioning Performance"
        >
          <div className="flex flex-col gap-4 font-body text-pine mt-2">
            <div className="p-6 rounded-card border-2 border-gold bg-snow space-y-4 text-center">
              <div className="w-14 h-14 rounded-full bg-gold/20 border-2 border-gold mx-auto flex items-center justify-center text-gold">
                <Award className="w-8 h-8" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold tracking-widest text-olive uppercase block">
                  CENTRAL LOGISTICS COMMAND • ANNUAL AUDIT DIVISION
                </span>
                <h3 className="font-heading font-extrabold text-xl text-olive-deep mt-1">
                  CERTIFICATE OF QUALITY &amp; SLA EXCELLENCE
                </h3>
                <p className="text-xs text-pine/70 mt-1">
                  Presented to <strong>{activeVendor?.name || 'Kisan Agro Products Ltd.'}</strong>
                </p>
              </div>

              <div className="p-4 bg-white rounded border border-sand/40 text-xs text-left space-y-2 font-mono">
                <div className="flex justify-between">
                  <span>Contract Reference:</span>
                  <strong>ARC/HQ/2026/04</strong>
                </div>
                <div className="flex justify-between">
                  <span>On-Time Delivery Rate:</span>
                  <strong className="text-success">96.8% (Target: 95.0%)</strong>
                </div>
                <div className="flex justify-between">
                  <span>Quality Lab Compliance:</span>
                  <strong className="text-success">99.4% Pass Rate</strong>
                </div>
                <div className="flex justify-between">
                  <span>Total Provisions Delivered:</span>
                  <strong>27.5 Metric Tonnes</strong>
                </div>
                <div className="flex justify-between">
                  <span>Audit Clearance:</span>
                  <strong className="text-olive">ZERO DEFECT CERTIFIED</strong>
                </div>
              </div>

              <div className="pt-4 border-t border-sand/60 flex justify-between items-center text-xs text-pine/60 font-mono">
                <span>Verified: Station Director HQ</span>
                <span>Date: {new Date().toISOString().split('T')[0]}</span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-sand/40">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsCertificateModalOpen(false)}
              >
                Close
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  window.print();
                  toast({ title: 'Print Certificate', message: 'Certificate queued for printing.' });
                }}
                icon={<Printer className="w-3.5 h-3.5" />}
              >
                Print Certificate
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default VendorPerformanceView;
