import React, { useEffect, useState } from 'react';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { api } from '../../api/client';
import { Vendor } from '../../types';
import { useToast } from '../../components/Toast';
import {
  Truck,
  ShieldCheck,
  Star,
  CheckCircle2,
  Mail,
  Phone,
  FileText,
  Plus,
  Search,
  Building,
  X,
} from 'lucide-react';

export const VendorsView: React.FC = () => {
  const { toast } = useToast();
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // New vendor form state
  const [newVendorName, setNewVendorName] = useState('');
  const [newVendorCategory, setNewVendorCategory] = useState('Grains & Cereals');
  const [newVendorTaxId, setNewVendorTaxId] = useState('');
  const [newVendorPhone, setNewVendorPhone] = useState('');
  const [newVendorEmail, setNewVendorEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      try {
        const list = await api.vendors.list();
        setVendors(list);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  const handleCreateVendor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVendorName || !newVendorTaxId) return;

    setIsSubmitting(true);
    try {
      const created = await api.vendors.create({
        name: newVendorName,
        category: newVendorCategory,
        tax_id: newVendorTaxId,
        contact_phone: newVendorPhone || '+91 98110 00000',
        contact_email: newVendorEmail || `${newVendorName.toLowerCase().replace(/\s+/g, '')}@provisions.in`,
        is_active: true,
        rating: 4.8,
      });

      toast({
        title: 'Provisions Supplier Enpanelled',
        message: `${created.name} registered under supplier registry. Eligible for procurement indents.`,
      });

      setVendors((prev) => [created, ...prev]);
      setIsAddModalOpen(false);

      // Reset form
      setNewVendorName('');
      setNewVendorTaxId('');
      setNewVendorPhone('');
      setNewVendorEmail('');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to register vendor';
      toast({ type: 'error', title: 'Registration Failed', message: msg });
    } finally {
      setIsSubmitting(false);
    }
  };

  const categories = ['all', ...Array.from(new Set(vendors.map((v) => v.category)))];
  const filteredVendors = vendors.filter((v) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      v.name.toLowerCase().includes(q) ||
      v.category.toLowerCase().includes(q) ||
      v.tax_id.toLowerCase().includes(q);
    const matchesCat = categoryFilter === 'all' || v.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh] p-8">
        <div className="w-10 h-10 border-2 border-sand/40 border-t-gold-500 rounded-full animate-spin" />
        <span className="font-heading font-semibold text-xs text-pine/80 mt-4 uppercase tracking-wider">
          Loading Contracted Provisions Suppliers...
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
            <Building className="w-3 h-3 text-gold-600" />
            <span>Station Command • Directorate of Procurement</span>
          </div>
          <h2 className="font-heading font-bold text-2xl text-olive-deep tracking-tight">
            Registered Provisions Suppliers &amp; Contractors
          </h2>
          <p className="text-xs text-pine/70 font-sans mt-0.5">
            Authorized provisioning agencies, GSTIN compliance records, performance audits &amp; active tenders.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => setIsAddModalOpen(true)}
          icon={<Plus className="w-4 h-4" />}
        >
          Enpanel New Supplier
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <Card className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 border-sand/30 bg-white">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-pine/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search supplier by name, GSTIN, or commodity sector..."
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

      {/* Vendors Table */}
      <div className="rounded-card border border-sand/30 bg-white shadow-subtle overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table-operational w-full text-left border-collapse">
            <thead>
              <tr className="bg-olive-deep text-sand text-[10px] font-heading font-bold uppercase tracking-wider select-none">
                <th className="py-3 px-4">Supplier &amp; Registration</th>
                <th className="py-3 px-4">Supply Sector</th>
                <th className="py-3 px-4">GSTIN / Tax ID</th>
                <th className="py-3 px-4">Contact Coordinates</th>
                <th className="py-3 px-4 text-center">Quality Rating</th>
                <th className="py-3 px-4 text-right">Compliance Clearance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sand/20 text-xs font-sans text-olive-deep">
              {filteredVendors.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-pine/60 italic font-sans">
                    No authorized suppliers match the filter criteria.
                  </td>
                </tr>
              ) : (
                filteredVendors.map((v) => (
                  <tr key={v.id} className="hover:bg-snow/60 transition-colors">
                    {/* Supplier Name & ID */}
                    <td className="py-3.5 px-4">
                      <div className="font-heading font-bold text-olive-deep text-sm">{v.name}</div>
                      <div className="font-mono text-[10px] text-pine/60 uppercase mt-0.5">
                        SUPPLIER-ID: {v.id}
                      </div>
                    </td>

                    {/* Sector */}
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-pill bg-sand/20 border border-sand/40 text-olive-deep text-[11px] font-heading font-semibold">
                        {v.category}
                      </span>
                    </td>

                    {/* GSTIN */}
                    <td className="py-3.5 px-4 font-mono text-[11px] text-olive-deep font-semibold">
                      {v.tax_id}
                    </td>

                    {/* Contact */}
                    <td className="py-3.5 px-4">
                      <div className="flex flex-col gap-0.5 text-[11px] font-sans text-pine">
                        <span className="flex items-center gap-1.5">
                          <Phone className="w-3 h-3 text-sand-500" /> {v.contact_phone}
                        </span>
                        <span className="flex items-center gap-1.5 text-pine/70 font-mono text-[10px]">
                          <Mail className="w-3 h-3 text-sand-500" /> {v.contact_email}
                        </span>
                      </div>
                    </td>

                    {/* Rating */}
                    <td className="py-3.5 px-4 text-center">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-pill bg-sand/20 text-olive-deep border border-sand font-mono font-bold text-xs">
                        <Star className="w-3 h-3 fill-gold text-gold" />
                        {v.rating || 4.8} / 5.0
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4 text-right">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-pill bg-emerald-50 text-emerald-800 border border-emerald-300 text-[10px] font-mono font-bold uppercase">
                        <ShieldCheck className="w-3 h-3 text-emerald-700" /> Verified Supplier
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Enpanel New Vendor Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-olive-night/60 backdrop-blur-sm flex items-center justify-center p-4">
          <Card className="max-w-lg w-full bg-white p-6 shadow-elevated border-sand/40 border-t-4 border-t-gold-500 rounded-card animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-sand/30">
              <h3 className="font-heading font-bold text-lg text-olive-deep flex items-center gap-2">
                <Building className="w-5 h-5 text-gold-600" />
                Enpanel Certified Supplier Agency
              </h3>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="text-pine/50 hover:text-olive-deep font-bold p-1 rounded-control hover:bg-snow transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateVendor} className="flex flex-col gap-4 mt-4">
              <div>
                <label className="block text-xs font-heading font-bold text-olive-deep mb-1">
                  Supplier Entity Name <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kendriya Agro Cooperative Federation"
                  value={newVendorName}
                  onChange={(e) => setNewVendorName(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-sans rounded-control border border-sand bg-snow focus:outline-none focus:border-olive focus:ring-1 focus:ring-olive text-olive-deep"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-heading font-bold text-olive-deep mb-1">
                    Commodity Category
                  </label>
                  <select
                    value={newVendorCategory}
                    onChange={(e) => setNewVendorCategory(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-heading font-semibold rounded-control border border-sand bg-white text-olive-deep focus:outline-none focus:border-olive"
                  >
                    <option value="Grains & Cereals">Grains &amp; Cereals</option>
                    <option value="Pulses & Lentils">Pulses &amp; Lentils</option>
                    <option value="Dairy & Milk">Dairy &amp; Milk</option>
                    <option value="Oils & Fats">Oils &amp; Fats</option>
                    <option value="Spices & Condiments">Spices &amp; Condiments</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-heading font-bold text-olive-deep mb-1">
                    GSTIN / Military Tax ID <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 07AAAAA0000A1Z5"
                    value={newVendorTaxId}
                    onChange={(e) => setNewVendorTaxId(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-mono font-medium rounded-control border border-sand bg-snow focus:outline-none focus:border-olive focus:ring-1 focus:ring-olive text-olive-deep uppercase"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-heading font-bold text-olive-deep mb-1">
                    Official Telephone
                  </label>
                  <input
                    type="tel"
                    placeholder="+91 98110 00000"
                    value={newVendorPhone}
                    onChange={(e) => setNewVendorPhone(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-mono rounded-control border border-sand bg-snow focus:outline-none focus:border-olive text-olive-deep"
                  />
                </div>
                <div>
                  <label className="block text-xs font-heading font-bold text-olive-deep mb-1">
                    Official Contact Email
                  </label>
                  <input
                    type="email"
                    placeholder="contracts@agency.in"
                    value={newVendorEmail}
                    onChange={(e) => setNewVendorEmail(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-mono rounded-control border border-sand bg-snow focus:outline-none focus:border-olive text-olive-deep"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-sand/30 flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsAddModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  disabled={isSubmitting || !newVendorName || !newVendorTaxId}
                >
                  {isSubmitting ? 'Enpanelling...' : 'Register Supplier'}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
};

export default VendorsView;
