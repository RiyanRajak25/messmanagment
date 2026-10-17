import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  UtensilsCrossed,
  Package,
  FileSpreadsheet,
  Menu as MenuIcon,
  X,
  History,
  Layers,
  LogOut,
  Sparkles,
} from 'lucide-react';

export const MobileNav: React.FC = () => {
  const { role, switchRole, logout } = useAuth();
  const location = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Bottom tabs capped at 4 items
  const getBottomTabs = () => {
    switch (role) {
      case 'mess_manager':
        return [
          { label: 'Today', path: '/mess', icon: <UtensilsCrossed className="w-5 h-5" /> },
          { label: 'My Stock', path: '/mess/stock', icon: <Package className="w-5 h-5" /> },
          { label: 'History', path: '/mess/history', icon: <History className="w-5 h-5" /> },
        ];
      case 'store_keeper':
        return [
          { label: 'Pantry', path: '/store', icon: <LayoutDashboard className="w-5 h-5" /> },
          { label: 'Receive', path: '/store/receive', icon: <Package className="w-5 h-5" /> },
          { label: 'Issue', path: '/store/issue', icon: <UtensilsCrossed className="w-5 h-5" /> },
          { label: 'Ledger', path: '/store/ledger', icon: <FileSpreadsheet className="w-5 h-5" /> },
        ];
      case 'finance_staff':
        return [
          { label: 'Overview', path: '/finance', icon: <LayoutDashboard className="w-5 h-5" /> },
          { label: 'Budgets', path: '/finance/budgets', icon: <FileSpreadsheet className="w-5 h-5" /> },
          { label: 'Payments', path: '/finance/payments', icon: <Package className="w-5 h-5" /> },
        ];
      default:
        // Admin
        return [
          { label: 'HQ', path: '/admin', icon: <LayoutDashboard className="w-5 h-5" /> },
          { label: 'Messes', path: '/admin/messes', icon: <UtensilsCrossed className="w-5 h-5" /> },
          { label: 'Audit', path: '/admin/audit', icon: <FileSpreadsheet className="w-5 h-5" /> },
        ];
    }
  };

  const tabs = getBottomTabs();

  return (
    <>
      {/* Fixed Bottom Tab Bar for Mobile */}
      <nav className="xl:hidden fixed bottom-0 inset-x-0 z-40 bg-canvas/95 backdrop-blur-md border-t-2.5 border-ink h-16 flex items-center justify-around px-2 shadow-chibi-modal select-none">
        {tabs.map((tab) => {
          const isActive = location.pathname === tab.path;
          return (
            <Link
              key={tab.path}
              to={tab.path}
              className={`flex flex-col items-center justify-center flex-1 py-1 font-bold transition-all ${
                isActive ? 'text-ink -translate-y-1' : 'text-crust/70 hover:text-ink'
              }`}
            >
              <div
                className={`p-1 rounded-full ${
                  isActive ? 'bg-yolk border-2 border-ink shadow-chibi-sm' : ''
                }`}
              >
                {tab.icon}
              </div>
              <span className="text-[10px] mt-0.5">{tab.label}</span>
            </Link>
          );
        })}

        {/* More Drawer Trigger */}
        <button
          type="button"
          onClick={() => setDrawerOpen(true)}
          className="flex flex-col items-center justify-center flex-1 py-1 font-bold text-crust hover:text-ink"
        >
          <div className="p-1 rounded-full">
            <MenuIcon className="w-5 h-5" />
          </div>
          <span className="text-[10px] mt-0.5">More</span>
        </button>
      </nav>

      {/* Hamburger Drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="fixed inset-0 bg-ink/40 backdrop-blur-sm"
            onClick={() => setDrawerOpen(false)}
          />
          <div className="relative w-80 h-full bg-canvas border-l-2.5 border-ink p-6 z-10 flex flex-col justify-between overflow-y-auto">
            <div>
              <div className="flex items-center justify-between pb-4 border-b-2 border-ink">
                <span className="font-display font-extrabold text-lg text-ink">Menu Navigation</span>
                <button
                  type="button"
                  onClick={() => setDrawerOpen(false)}
                  className="w-8 h-8 rounded-full border-2 border-ink bg-surface-container flex items-center justify-center"
                >
                  <X className="w-4 h-4 stroke-[3]" />
                </button>
              </div>

              <div className="py-4 flex flex-col gap-2">
                <Link
                  to="/design-system"
                  onClick={() => setDrawerOpen(false)}
                  className="px-4 py-2.5 rounded-full border-2 border-ink bg-surface-container-high text-xs font-bold text-ink flex items-center gap-2"
                >
                  <Layers className="w-4 h-4" />
                  <span>Living Style Guide (/design-system)</span>
                </Link>

                <div className="mt-4 pt-4 border-t border-ink/10">
                  <p className="text-[11px] font-extrabold uppercase tracking-wider text-crust mb-2">
                    Switch App Role:
                  </p>
                  {(['administrator', 'store_keeper', 'mess_manager', 'finance_staff', 'vendor'] as const).map(
                    (r) => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => {
                          switchRole(r);
                          setDrawerOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-full text-xs font-bold mb-1 transition-colors ${
                          role === r
                            ? 'bg-yolk text-ink border-2 border-ink'
                            : 'hover:bg-surface-container text-ink'
                        }`}
                      >
                        {r.replace('_', ' ').toUpperCase()}
                      </button>
                    )
                  )}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t-2 border-ink">
              <button
                type="button"
                onClick={() => {
                  logout();
                  setDrawerOpen(false);
                }}
                className="w-full py-2.5 rounded-full border-2 border-ink bg-tomato text-white text-xs font-bold flex items-center justify-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
