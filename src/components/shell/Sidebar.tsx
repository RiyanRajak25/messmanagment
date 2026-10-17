import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';
import { BrandMark } from '../brand/BrandMark';
import {
  ShieldCheck,
  Activity,
  Building2,
  Truck,
  Scale,
  Users,
  FileText,
  TrendingUp,
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
  Landmark,
  PiggyBank,
  CreditCard,
  FileCheck2,
  ShieldAlert,
  ChevronRight,
  LogOut,
  RotateCcw,
  ChevronDown,
  Lock,
  Mountain,
  Compass,
  MessageSquare,
  PackageCheck,
  User,
} from 'lucide-react';
import { UserProfileModal } from '../UserProfileModal';

interface SidebarNavItem {
  label: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

export const Sidebar: React.FC = () => {
  const { user, role, switchRole, logout, resetDemoData } = useAuth();
  const location = useLocation();
  const [isHovered, setIsHovered] = useState(false);
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Role-specific navigation definitions
  const getNavItems = (): SidebarNavItem[] => {
    switch (role) {
      case 'administrator':
        return [
          { label: 'Command Overview', path: '/admin', icon: Activity },
          { label: 'Institutional Messes', path: '/admin/messes', icon: Building2 },
          { label: 'Provisions Suppliers', path: '/admin/vendors', icon: Truck },
          { label: 'Ration Scale Catalog', path: '/admin/items', icon: Scale },
          { label: 'Personnel & Users', path: '/admin/users', icon: Users },
          { label: 'Station Audit Trail', path: '/admin/audit', icon: FileText },
          { label: 'Demand Forecast', path: '/admin/forecast', icon: TrendingUp },
        ];
      case 'store_keeper':
        return [
          { label: 'Central Supply Depot', path: '/store', icon: Warehouse },
          { label: 'Receive Consignment', path: '/store/receive', icon: ArrowDownLeft },
          { label: 'Issue to Mess', path: '/store/issue', icon: ArrowUpRight },
          { label: 'Write-Offs & Adjustments', path: '/store/adjustments', icon: SlidersHorizontal },
          { label: 'Raise Indent (PO)', path: '/store/create-po', icon: FilePlus2 },
          { label: 'Stock Ledger', path: '/store/ledger', icon: BookOpen },
        ];
      case 'mess_manager':
        return [
          { label: "Today's Ration Draw", path: '/mess', icon: CalendarCheck },
          { label: 'Unit Pantry Stock', path: '/mess/stock', icon: Package },
          { label: 'Consumption Log', path: '/mess/history', icon: History },
          { label: 'Mess Menu Board', path: '/mess/menu', icon: Calendar },
          { label: 'Diner Feedback', path: '/mess/feedback', icon: MessageSquare },
        ];
      case 'finance_staff':
        return [
          { label: 'Accounts Desk', path: '/finance', icon: Landmark },
          { label: 'Sanctioned Budgets', path: '/finance/budgets', icon: PiggyBank },
          { label: 'Supplier Disbursements', path: '/finance/payments', icon: CreditCard },
          { label: 'Contract Indents', path: '/finance/po-view', icon: FileCheck2 },
          { label: 'Fiscal Audit Trail', path: '/finance/audit', icon: ShieldAlert },
        ];
      case 'vendor':
        return [
          { label: 'Supplier Orders', path: '/vendor', icon: PackageCheck },
          { label: 'Dispatch Consignment', path: '/vendor/dispatch', icon: Truck },
          { label: 'Delivery Performance', path: '/vendor/performance', icon: TrendingUp },
        ];
      default:
        return [];
    }
  };

  const navItems = getNavItems();

  const roleMeta: Record<UserRole, { title: string; designation: string; rank: string }> = {
    administrator: {
      title: 'Station Command HQ',
      designation: 'Station Administrator',
      rank: 'Rajesh Verma',
    },
    store_keeper: {
      title: 'Central Supply Depot',
      designation: 'Central Storekeeper',
      rank: 'Ramesh Patel',
    },
    mess_manager: {
      title: 'Institutional Mess',
      designation: 'Mess Caterer / Manager',
      rank: 'Pooja Singh',
    },
    finance_staff: {
      title: 'Central Accounts & Finance',
      designation: 'Finance Officer',
      rank: 'Amit Sharma',
    },
    vendor: {
      title: 'Certified Provisions Supplier',
      designation: 'Supplier Representative',
      rank: 'Kisan Agro Products',
    },
  };

  const currentRoleMeta = role ? roleMeta[role] : roleMeta.administrator;

  return (
    <aside
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setShowRoleMenu(false);
      }}
      className={`fixed top-0 left-0 bottom-0 z-50 h-screen bg-olive-deep text-snow flex flex-col justify-between border-r border-sand/30 shadow-elevation transition-all duration-300 ease-in-out select-none font-body ${
        isHovered ? 'w-80' : 'w-20'
      }`}
    >
      {/* Top Header & Insignia */}
      <div className="flex flex-col">
        {/* Brand Header */}
        <div className="h-20 px-4 flex items-center border-b border-sand/30 gap-3 overflow-hidden">
          <Link to="/" className="flex items-center gap-3 shrink-0">
            <BrandMark
              variant="shield"
              size={isHovered ? 40 : 34}
              className="drop-shadow-sm shrink-0"
            />

            {/* Expanded Title (Smooth Fade & Slide) */}
            <div
              className={`flex flex-col transition-all duration-300 whitespace-nowrap overflow-hidden ${
                isHovered ? 'opacity-100 max-w-[240px]' : 'opacity-0 max-w-0 pointer-events-none'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <span className="font-heading font-extrabold text-sm tracking-wider text-snow leading-tight">
                  HIMRASAD
                </span>
                <span className="text-[9px] font-heading font-bold px-1.5 py-0.2 rounded bg-gold/20 text-gold border border-gold/40">
                  RMS
                </span>
              </div>
              <div className="h-0.5 w-12 bg-saffron mt-0.5 rounded-full" />
              <span className="text-[10px] font-medium text-sand tracking-wide truncate mt-0.5">
                Mess &amp; Ration Operations
              </span>
            </div>
          </Link>
        </div>

        {/* Current Officer / Appointment Capsule */}
        <div className="p-3 border-b border-sand/30">
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowRoleMenu(!showRoleMenu)}
              className={`w-full rounded-control transition-all flex items-center gap-3 text-left ${
                isHovered
                  ? 'p-2.5 bg-olive/50 hover:bg-olive/70 border border-sand/40'
                  : 'p-1.5 justify-center hover:bg-olive/50'
              }`}
              title={isHovered ? 'Switch appointment' : `${currentRoleMeta.title}: ${currentRoleMeta.rank}`}
            >
              <div className="w-8 h-8 rounded-control bg-gold text-night font-heading font-extrabold flex items-center justify-center text-xs shrink-0 shadow-subtle">
                {currentRoleMeta.rank.charAt(0)}
              </div>

              {isHovered && (
                <div className="flex-1 min-w-0 overflow-hidden">
                  <div className="text-[9px] font-heading font-extrabold uppercase text-gold tracking-wider truncate">
                    {currentRoleMeta.title}
                  </div>
                  <div className="text-xs font-bold text-snow truncate">
                    {currentRoleMeta.rank}
                  </div>
                  <div className="text-[10px] text-sand truncate">
                    {currentRoleMeta.designation}
                  </div>
                </div>
              )}

              {isHovered && <ChevronDown className="w-3.5 h-3.5 text-sand shrink-0" />}
            </button>

            {/* Appointment Switcher Popover */}
            {showRoleMenu && isHovered && (
              <div className="absolute top-full left-0 mt-1.5 w-72 rounded-card bg-night border border-sand/40 shadow-elevation p-2 z-50 flex flex-col gap-1 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-2.5 py-1.5 border-b border-sand/20 flex items-center justify-between">
                  <span className="text-[10px] font-heading font-bold uppercase text-sand tracking-wider">
                    Switch Active Appointment
                  </span>
                  <span className="text-[10px] font-mono text-success font-bold">● Active</span>
                </div>

                {(
                  [
                    'administrator',
                    'store_keeper',
                    'mess_manager',
                    'finance_staff',
                    'vendor',
                  ] as UserRole[]
                ).map((r) => {
                  const meta = roleMeta[r];
                  const isCurrent = role === r;
                  return (
                    <button
                      key={r}
                      type="button"
                      onClick={() => {
                        switchRole(r);
                        setShowRoleMenu(false);
                      }}
                      className={`w-full px-2.5 py-2 rounded-control text-left flex items-center justify-between transition-colors ${
                        isCurrent
                          ? 'bg-olive text-snow font-bold'
                          : 'text-sand hover:text-snow hover:bg-olive-deep/70'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <div
                          className={`w-6 h-6 rounded-control flex items-center justify-center text-[10px] font-heading font-bold ${
                            isCurrent ? 'bg-gold text-night' : 'bg-sand/30 text-sand'
                          }`}
                        >
                          {meta.rank.charAt(0)}
                        </div>
                        <div className="truncate">
                          <div className="text-xs font-bold truncate text-snow">{meta.rank}</div>
                          <div className="text-[10px] text-sand truncate">{meta.title}</div>
                        </div>
                      </div>
                      {isCurrent && <ShieldCheck className="w-4 h-4 text-gold shrink-0" />}
                    </button>
                  );
                })}

                <div className="pt-2 border-t border-sand/20 mt-1 flex flex-col gap-1.5 px-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      setIsProfileOpen(true);
                      setShowRoleMenu(false);
                    }}
                    className="w-full text-[11px] font-heading font-bold text-snow hover:text-gold flex items-center gap-1.5 py-1 text-left"
                  >
                    <User className="w-3.5 h-3.5 text-gold" /> Personnel Profile &amp; Clearance
                  </button>

                  <div className="flex items-center justify-between pt-1 border-t border-sand/15">
                    <button
                      type="button"
                      onClick={() => {
                        resetDemoData();
                        setShowRoleMenu(false);
                      }}
                      className="text-[10px] font-bold text-sand hover:text-snow flex items-center gap-1"
                    >
                      <RotateCcw className="w-3 h-3" /> Re-seed Data
                    </button>
                    <button
                      type="button"
                      onClick={logout}
                      className="text-[10px] font-bold text-danger hover:underline flex items-center gap-1"
                    >
                      <LogOut className="w-3 h-3" /> Logout
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Items Roster */}
        <nav className="p-2.5 flex flex-col gap-1 overflow-y-auto max-h-[calc(100vh-270px)] no-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`relative group/link flex items-center gap-3 rounded-control transition-all ${
                  isHovered ? 'px-3 py-2.5' : 'p-3 justify-center'
                } ${
                  isActive
                    ? 'bg-olive text-snow font-bold border-l-3 border-gold shadow-subtle'
                    : 'text-sand hover:text-snow hover:bg-olive/40'
                }`}
                title={!isHovered ? item.label : undefined}
              >
                <Icon
                  className={`w-4 h-4 shrink-0 transition-transform duration-200 group-hover/link:scale-105 ${
                    isActive ? 'text-gold' : 'text-sand group-hover/link:text-snow'
                  }`}
                />

                {/* Expanded Text Label */}
                <span
                  className={`text-xs whitespace-nowrap transition-all duration-300 overflow-hidden ${
                    isHovered
                      ? 'opacity-100 max-w-[240px]'
                      : 'opacity-0 max-w-0 pointer-events-none'
                  }`}
                >
                  {item.label}
                </span>

                {item.badge && isHovered && (
                  <span className="ml-auto text-[9px] font-mono px-1.5 py-0.5 rounded-badge bg-gold text-night font-bold">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Central Operations Badge */}
      <div className="p-3 border-t border-sand/30">
        <div
          className={`rounded-control bg-night/80 border border-sand/30 p-2.5 flex items-center gap-3 ${
            isHovered ? '' : 'justify-center'
          }`}
        >
          <div className="w-8 h-8 rounded-control bg-olive/60 flex items-center justify-center text-gold shrink-0 border border-sand/30">
            <Mountain className="w-4 h-4" />
          </div>

          {isHovered && (
            <div className="flex-1 min-w-0 overflow-hidden">
              <div className="text-[10px] font-heading font-bold text-snow truncate">
                Central Depot Station
              </div>
              <div className="text-[9px] font-mono text-sand truncate">
                Ration Scale: Verified Normal
              </div>
            </div>
          )}
        </div>

        {isHovered && (
          <div className="mt-2 text-[9px] font-mono text-sand/80 px-1 flex items-center justify-between">
            <span>HQ: CENTRAL LOGISTICS</span>
            <span className="text-gold font-bold">v1.0 OPS</span>
          </div>
        )}
      </div>

      {/* User Personnel Profile Modal */}
      <UserProfileModal isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
    </aside>
  );
};

export default Sidebar;
