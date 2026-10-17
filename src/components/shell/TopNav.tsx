import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';
import {
  Bell,
  Search,
  LogOut,
  Sparkles,
  ChevronDown,
  Layers,
  RotateCcw,
  Shield,
  ShieldCheck,
  Building2,
  Lock,
} from 'lucide-react';

interface NavLinkItem {
  label: string;
  path: string;
}

export const TopNav: React.FC = () => {
  const { user, role, switchRole, logout, resetDemoData } = useAuth();
  const location = useLocation();
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [hasNewAlert, setHasNewAlert] = useState(true);

  // Role-specific navigation definitions
  const getNavLinks = (): NavLinkItem[] => {
    switch (role) {
      case 'administrator':
        return [
          { label: 'Command Overview', path: '/admin' },
          { label: 'Dining Messes', path: '/admin/messes' },
          { label: 'Certified Suppliers', path: '/admin/vendors' },
          { label: 'Ration Scale Catalog', path: '/admin/items' },
          { label: 'Staff & Personnel', path: '/admin/users' },
          { label: 'Station Audit Trail', path: '/admin/audit' },
          { label: 'Quartermaster Forecast', path: '/admin/forecast' },
        ];
      case 'store_keeper':
        return [
          { label: 'Central Supply Depot', path: '/store' },
          { label: 'Receive Consignment', path: '/store/receive' },
          { label: 'Issue to Mess', path: '/store/issue' },
          { label: 'Write-Offs & Adjustments', path: '/store/adjustments' },
          { label: 'Raise Indent (PO)', path: '/store/create-po' },
          { label: 'Stock Ledger', path: '/store/ledger' },
        ];
      case 'mess_manager':
        return [
          { label: "Today's Ration Draw", path: '/mess' },
          { label: 'Unit Pantry Stock', path: '/mess/stock' },
          { label: 'Consumption Log', path: '/mess/history' },
          { label: 'Mess Menu Board', path: '/mess/menu' },
        ];
      case 'finance_staff':
        return [
          { label: 'Accounts Desk', path: '/finance' },
          { label: 'Sanctioned Budgets', path: '/finance/budgets' },
          { label: 'Supplier Disbursements', path: '/finance/payments' },
          { label: 'Contract Indents', path: '/finance/po-view' },
          { label: 'Fiscal Audit Trail', path: '/finance/audit' },
        ];
      case 'vendor':
        return [{ label: 'Supplier Portal', path: '/vendor' }];
      default:
        return [];
    }
  };

  const navLinks = getNavLinks();

  const roleLabels: Record<UserRole, { title: string; designation: string; color: string }> = {
    administrator: {
      title: 'Station Administration HQ',
      designation: 'Director Rajesh Verma, Station Director',
      color: 'bg-yolk text-white',
    },
    store_keeper: {
      title: 'Central Supply Depot',
      designation: 'Ramesh Patel, Quartermaster',
      color: 'bg-mint text-white',
    },
    mess_manager: {
      title: 'Hostel Mess Manager',
      designation: 'Pooja Singh, Mess Caterer',
      color: 'bg-olive-deep text-white',
    },
    finance_staff: {
      title: 'Central Accounts Officer',
      designation: 'Amit Sharma, Accounts Officer',
      color: 'bg-slate-700 text-white',
    },
    vendor: {
      title: 'Certified Provisions Supplier',
      designation: 'Kisan Agro Products Ltd.',
      color: 'bg-slate-500 text-white',
    },
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200 select-none shadow-sm">
      {/* Top Security & Classification Bar */}
      <div className="w-full bg-slate-900 text-slate-300 px-4 md:px-8 py-1 text-[10px] font-bold tracking-widest uppercase flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-emerald-400 font-extrabold">SECURE LOGISTICS NETWORK • INSTITUTIONAL RMS</span>
          <span className="hidden sm:inline text-slate-500">|</span>
          <span className="hidden sm:inline text-slate-400">DIRECTORATE GENERAL OF SUPPLIES & LOGISTICS</span>
        </div>
        <div className="flex items-center gap-2 text-slate-400">
          <span className="px-1.5 py-0.5 rounded bg-slate-800 text-[9px] font-mono text-amber-400 border border-slate-700">
            AUTHENTICATED
          </span>
          <span className="hidden md:inline font-mono">HQ: CENTRAL LOGISTICS DIVISION</span>
        </div>
      </div>

      <div className="max-w-[1360px] mx-auto px-4 md:px-8 h-18 flex items-center justify-between gap-4 py-2">
        {/* Left: Brand Identity with Crest */}
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center text-amber-400 shadow-sm group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-6 h-6 stroke-[2]" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-display font-extrabold text-lg text-slate-900 tracking-tight leading-none">
                  HIMRASAD RMS
                </span>
                <span className="text-[9px] font-black px-1.5 py-0.2 rounded bg-amber-500/15 text-amber-700 border border-amber-500/30">
                  INSTITUTIONAL
                </span>
              </div>
              <span className="text-[11px] font-bold text-slate-500 tracking-wide mt-0.5">
                Integrated Ration & Mess Accounting System
              </span>
            </div>
          </Link>

          {/* Desktop Role Navigation Links */}
          <nav className="hidden xl:flex items-center gap-1 p-1 bg-slate-100/80 border border-slate-200/90 rounded-xl">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right Actions: Switch Role, User Info, Notifications */}
        <div className="flex items-center gap-3">
          {/* Quick Role Switcher Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowRoleMenu(!showRoleMenu)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 transition-colors shadow-sm"
              title="Switch military appointment / role"
            >
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
              <div className="text-left hidden sm:block">
                <div className="text-[10px] uppercase font-black text-slate-400 leading-tight">
                  Appointment
                </div>
                <div className="text-xs font-bold text-slate-900 truncate max-w-[170px]">
                  {role ? roleLabels[role]?.title : 'Officer In-Charge'}
                </div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1" />
            </button>

            {/* Role Menu Popover */}
            {showRoleMenu && (
              <div className="absolute right-0 mt-2 w-72 rounded-xl bg-white border border-slate-200 shadow-xl p-2 z-50 flex flex-col gap-1">
                <div className="px-3 py-2 border-b border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] font-black uppercase text-slate-400">
                    Switch Active Appointment
                  </span>
                  <span className="text-[10px] font-mono text-emerald-600 font-bold">● Active</span>
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
                  const meta = roleLabels[r];
                  const isCurrent = role === r;
                  return (
                    <button
                      key={r}
                      type="button"
                      onClick={() => {
                        switchRole(r);
                        setShowRoleMenu(false);
                      }}
                      className={`w-full text-left p-2.5 rounded-lg text-xs transition-colors flex items-center justify-between ${
                        isCurrent
                          ? 'bg-slate-900 text-white font-bold'
                          : 'hover:bg-slate-100 text-slate-800'
                      }`}
                    >
                      <div>
                        <div className="font-bold">{meta.title}</div>
                        <div className={`text-[10px] ${isCurrent ? 'text-slate-300' : 'text-slate-500'}`}>
                          {meta.designation}
                        </div>
                      </div>
                      {isCurrent && <ShieldCheck className="w-4 h-4 text-emerald-400" />}
                    </button>
                  );
                })}

                <div className="pt-2 border-t border-slate-100 mt-1 flex items-center justify-between px-2">
                  <button
                    type="button"
                    onClick={() => {
                      resetDemoData();
                      setShowRoleMenu(false);
                    }}
                    className="text-[11px] font-bold text-slate-500 hover:text-slate-900 flex items-center gap-1"
                  >
                    <RotateCcw className="w-3 h-3" /> Re-seed Test Data
                  </button>
                  <button
                    type="button"
                    onClick={logout}
                    className="text-[11px] font-bold text-red-600 hover:underline flex items-center gap-1"
                  >
                    <LogOut className="w-3 h-3" /> Logout
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Institutional Station Status Telemetry */}
          <div className="hidden lg:flex items-center gap-2 pl-3 border-l border-sand/40">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-badge bg-olive/10 border border-olive/30 text-[10px] font-mono text-olive-deep font-bold">
              <span className="w-2 h-2 rounded-full bg-success status-pip-pulse" />
              <span>STATION 01 • ACTIVE</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopNav;
