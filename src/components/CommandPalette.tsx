import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import {
  Search,
  Command,
  ArrowRight,
  Warehouse,
  ArrowDownLeft,
  ArrowUpRight,
  SlidersHorizontal,
  FilePlus2,
  BookOpen,
  CalendarCheck,
  Package,
  History,
  Calendar,
  MessageSquare,
  Landmark,
  PiggyBank,
  CreditCard,
  FileCheck2,
  ShieldAlert,
  Building2,
  Truck,
  Scale,
  Users,
  FileText,
  TrendingUp,
  RotateCcw,
  User,
  Bell,
  FileSpreadsheet,
  Printer,
  ShieldCheck,
  X,
} from 'lucide-react';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenProfile: () => void;
  onOpenNoticeBoard: () => void;
  onOpenExportHub: () => void;
}

interface PaletteItem {
  id: string;
  title: string;
  category: 'Navigation' | 'Quick Actions' | 'Switch Appointment';
  icon: React.ComponentType<{ className?: string }>;
  action: () => void;
  badge?: string;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onOpenProfile,
  onOpenNoticeBoard,
  onOpenExportHub,
}) => {
  const navigate = useNavigate();
  const { switchRole, resetDemoData, role } = useAuth();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Global Ctrl+K / Cmd+K listener handled in parent or here
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Reset search when opening
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  const items: PaletteItem[] = [
    // Quick Actions
    {
      id: 'act-export',
      title: 'Open Central Export Hub (CSV Stock & POs)',
      category: 'Quick Actions',
      icon: FileSpreadsheet,
      action: () => {
        onClose();
        onOpenExportHub();
      },
      badge: 'Data Export',
    },
    {
      id: 'act-notices',
      title: 'Station Operational Notice Board',
      category: 'Quick Actions',
      icon: Bell,
      action: () => {
        onClose();
        onOpenNoticeBoard();
      },
      badge: 'Advisories',
    },
    {
      id: 'act-profile',
      title: 'Personnel Profile & Security Credentials',
      category: 'Quick Actions',
      icon: User,
      action: () => {
        onClose();
        onOpenProfile();
      },
      badge: 'Account',
    },
    {
      id: 'act-reseed',
      title: 'Re-Seed Demo Data (Pristine Sample Transactions)',
      category: 'Quick Actions',
      icon: RotateCcw,
      action: () => {
        onClose();
        resetDemoData();
      },
      badge: 'Dev Utility',
    },

    // Navigation - Store Keeper
    {
      id: 'nav-store',
      title: 'Central Supply Depot Overview',
      category: 'Navigation',
      icon: Warehouse,
      action: () => {
        navigate('/store');
        onClose();
      },
    },
    {
      id: 'nav-receive',
      title: 'Receive Consignment (Unload Supplier Truck)',
      category: 'Navigation',
      icon: ArrowDownLeft,
      action: () => {
        navigate('/store/receive');
        onClose();
      },
    },
    {
      id: 'nav-issue',
      title: 'Issue Rations to Institutional Mess',
      category: 'Navigation',
      icon: ArrowUpRight,
      action: () => {
        navigate('/store/issue');
        onClose();
      },
    },
    {
      id: 'nav-adjustments',
      title: 'Depot Condemnation & Stock Adjustments',
      category: 'Navigation',
      icon: SlidersHorizontal,
      action: () => {
        navigate('/store/adjustments');
        onClose();
      },
    },
    {
      id: 'nav-create-po',
      title: 'Raise Indent / Purchase Order (Store)',
      category: 'Navigation',
      icon: FilePlus2,
      action: () => {
        navigate('/store/create-po');
        onClose();
      },
    },
    {
      id: 'nav-ledger',
      title: 'Depot Stock Ledger (Immutable History)',
      category: 'Navigation',
      icon: BookOpen,
      action: () => {
        navigate('/store/ledger');
        onClose();
      },
    },

    // Navigation - Mess Manager
    {
      id: 'nav-mess',
      title: "Today's Ration Draw & Headcount Cert",
      category: 'Navigation',
      icon: CalendarCheck,
      action: () => {
        navigate('/mess');
        onClose();
      },
    },
    {
      id: 'nav-pantry',
      title: 'Unit Pantry Stock on Hand',
      category: 'Navigation',
      icon: Package,
      action: () => {
        navigate('/mess/stock');
        onClose();
      },
    },
    {
      id: 'nav-history',
      title: 'Consumption Log & Daily Issue Tallies',
      category: 'Navigation',
      icon: History,
      action: () => {
        navigate('/mess/history');
        onClose();
      },
    },
    {
      id: 'nav-menu',
      title: 'Weekly Mess Menu Board',
      category: 'Navigation',
      icon: Calendar,
      action: () => {
        navigate('/mess/menu');
        onClose();
      },
    },
    {
      id: 'nav-feedback',
      title: 'Diner Meal Feedback & Satisfaction',
      category: 'Navigation',
      icon: MessageSquare,
      action: () => {
        navigate('/mess/feedback');
        onClose();
      },
    },

    // Navigation - Finance
    {
      id: 'nav-finance',
      title: 'Accounts Desk & Financial Health',
      category: 'Navigation',
      icon: Landmark,
      action: () => {
        navigate('/finance');
        onClose();
      },
    },
    {
      id: 'nav-budgets',
      title: 'Sanctioned Budgets & Grant Allocations',
      category: 'Navigation',
      icon: PiggyBank,
      action: () => {
        navigate('/finance/budgets');
        onClose();
      },
    },
    {
      id: 'nav-payments',
      title: 'Supplier Payment Disbursements & Vouchers',
      category: 'Navigation',
      icon: CreditCard,
      action: () => {
        navigate('/finance/payments');
        onClose();
      },
    },
    {
      id: 'nav-po-view',
      title: 'Commercial Purchase Order Liabilities',
      category: 'Navigation',
      icon: FileCheck2,
      action: () => {
        navigate('/finance/po-view');
        onClose();
      },
    },
    {
      id: 'nav-finance-audit',
      title: 'Fiscal Audit Ledger & Discrepancy Checks',
      category: 'Navigation',
      icon: ShieldAlert,
      action: () => {
        navigate('/finance/audit');
        onClose();
      },
    },

    // Navigation - Admin
    {
      id: 'nav-admin',
      title: 'Station Administration Command Overview',
      category: 'Navigation',
      icon: ShieldCheck,
      action: () => {
        navigate('/admin');
        onClose();
      },
    },
    {
      id: 'nav-messes',
      title: 'Institutional Dining Messes Management',
      category: 'Navigation',
      icon: Building2,
      action: () => {
        navigate('/admin/messes');
        onClose();
      },
    },
    {
      id: 'nav-vendors',
      title: 'Certified Provisions Suppliers Directory',
      category: 'Navigation',
      icon: Truck,
      action: () => {
        navigate('/admin/vendors');
        onClose();
      },
    },
    {
      id: 'nav-items',
      title: 'Ration Scale Commodities Catalog',
      category: 'Navigation',
      icon: Scale,
      action: () => {
        navigate('/admin/items');
        onClose();
      },
    },
    {
      id: 'nav-users',
      title: 'Station Personnel & Clearance Roles',
      category: 'Navigation',
      icon: Users,
      action: () => {
        navigate('/admin/users');
        onClose();
      },
    },
    {
      id: 'nav-audit',
      title: 'Station Tamper-Evident Audit Trail',
      category: 'Navigation',
      icon: FileText,
      action: () => {
        navigate('/admin/audit');
        onClose();
      },
    },
    {
      id: 'nav-forecast',
      title: 'Quartermaster 30-Day Demand Forecast',
      category: 'Navigation',
      icon: TrendingUp,
      action: () => {
        navigate('/admin/forecast');
        onClose();
      },
    },

    // Navigation - Vendor
    {
      id: 'nav-vendor',
      title: 'Certified Supplier Portal & POs',
      category: 'Navigation',
      icon: Truck,
      action: () => {
        navigate('/vendor');
        onClose();
      },
    },

    // Switch Role Quick Actions
    {
      id: 'role-admin',
      title: 'Switch Appointment: Station Administrator',
      category: 'Switch Appointment',
      icon: ShieldCheck,
      action: () => {
        switchRole('administrator');
        onClose();
      },
      badge: role === 'administrator' ? 'Active' : undefined,
    },
    {
      id: 'role-store',
      title: 'Switch Appointment: Central Store Keeper',
      category: 'Switch Appointment',
      icon: Warehouse,
      action: () => {
        switchRole('store_keeper');
        onClose();
      },
      badge: role === 'store_keeper' ? 'Active' : undefined,
    },
    {
      id: 'role-mess',
      title: 'Switch Appointment: Unit Mess Manager',
      category: 'Switch Appointment',
      icon: CalendarCheck,
      action: () => {
        switchRole('mess_manager');
        onClose();
      },
      badge: role === 'mess_manager' ? 'Active' : undefined,
    },
    {
      id: 'role-finance',
      title: 'Switch Appointment: Central Accounts Officer',
      category: 'Switch Appointment',
      icon: Landmark,
      action: () => {
        switchRole('finance_staff');
        onClose();
      },
      badge: role === 'finance_staff' ? 'Active' : undefined,
    },
    {
      id: 'role-vendor',
      title: 'Switch Appointment: Certified Provisions Supplier',
      category: 'Switch Appointment',
      icon: Truck,
      action: () => {
        switchRole('vendor');
        onClose();
      },
      badge: role === 'vendor' ? 'Active' : undefined,
    },
  ];

  const filteredItems = items.filter(
    (i) =>
      i.title.toLowerCase().includes(query.toLowerCase()) ||
      i.category.toLowerCase().includes(query.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 md:pt-24 px-4 bg-night/80 backdrop-blur-sm animate-fade-in select-none">
      <div
        className="w-full max-w-2xl bg-white border border-sand rounded-card shadow-elevation overflow-hidden flex flex-col font-body text-pine"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="p-3.5 bg-snow border-b border-sand flex items-center gap-3">
          <Search className="w-5 h-5 text-olive shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Type a view, action, or command... (e.g. 'Issue', 'Budget', 'Export', 'Ledger')"
            className="flex-1 bg-transparent text-sm md:text-base font-heading font-semibold text-olive-deep placeholder:text-pine/40 focus:outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="p-1 rounded-control text-pine/50 hover:text-pine"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-badge bg-sand/30 text-[10px] font-mono font-bold text-pine/70 border border-sand/50">
            ESC to close
          </span>
        </div>

        {/* Results List */}
        <div className="max-h-[380px] overflow-y-auto p-2 flex flex-col gap-1 divide-y divide-sand/15 no-scrollbar">
          {filteredItems.length === 0 ? (
            <div className="p-8 text-center text-xs font-medium text-pine/60">
              No matching commands or views found for &ldquo;<span className="font-bold text-olive-deep">{query}</span>&rdquo;.
            </div>
          ) : (
            filteredItems.map((item, idx) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={item.action}
                  className="w-full px-3 py-2.5 rounded-control text-left flex items-center justify-between gap-3 hover:bg-snow transition-colors group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-control bg-olive/10 border border-sand/60 flex items-center justify-center text-olive group-hover:bg-olive group-hover:text-snow shrink-0 transition-colors">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-heading font-bold text-olive-deep group-hover:text-olive truncate">
                        {item.title}
                      </div>
                      <div className="text-[10px] text-pine/60 font-mono">
                        {item.category}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {item.badge && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-badge bg-gold/20 text-night border border-gold/40 font-bold">
                        {item.badge}
                      </span>
                    )}
                    <ArrowRight className="w-3.5 h-3.5 text-sand group-hover:text-olive group-hover:translate-x-0.5 transition-all" />
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Footer shortcuts helper */}
        <div className="px-4 py-2.5 bg-snow border-t border-sand text-[10px] font-mono text-pine/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span>
              <strong className="text-olive-deep font-bold">HIMRASAD</strong> Operational Command Palette
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span>Jump to any station module instantly</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommandPalette;
