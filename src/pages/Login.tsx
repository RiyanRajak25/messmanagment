import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import { BrandMark } from '../components/brand/BrandMark';
import { TopographicGrid } from '../components/brand/TopographicGrid';
import { ShieldCheck, ArrowRight, Lock, Key, Mountain, Compass, Users } from 'lucide-react';

export const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('storekeeper@messmunch.edu');
  const [selectedRole, setSelectedRole] = useState<UserRole>('store_keeper');
  const [isLoading, setIsLoading] = useState(false);

  const demoAccounts: { role: UserRole; name: string; title: string; email: string; tag: string }[] = [
    {
      role: 'administrator',
      name: 'Rajesh Verma',
      title: 'Station Administrator',
      email: 'admin@messmunch.edu',
      tag: 'Central Operations & Audit Oversight',
    },
    {
      role: 'store_keeper',
      name: 'Ramesh Patel',
      title: 'Central Depot Storekeeper',
      email: 'storekeeper@messmunch.edu',
      tag: 'Central Supply Depot & Consignment Issues',
    },
    {
      role: 'mess_manager',
      name: 'Pooja Singh',
      title: 'Institutional Mess Caterer',
      email: 'falcon.manager@messmunch.edu',
      tag: 'Falcon Mess Daily Ration Draw',
    },
    {
      role: 'finance_staff',
      name: 'Amit Sharma',
      title: 'Central Accounts & Finance Officer',
      email: 'finance@messmunch.edu',
      tag: 'Sanctioned Budgets & PO Disbursements',
    },
    {
      role: 'vendor',
      name: 'Kisan Agro Products Ltd.',
      title: 'Certified Provisions Supplier',
      email: 'vendor@kisanagro.in',
      tag: 'Contracted Supplier Portal',
    },
  ];

  const handleSelectRole = (acc: typeof demoAccounts[0]) => {
    setSelectedRole(acc.role);
    setEmail(acc.email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await login(email, selectedRole);
      const roleRouteMap: Record<UserRole, string> = {
        administrator: '/admin',
        store_keeper: '/store',
        mess_manager: '/mess',
        finance_staff: '/finance',
        vendor: '/vendor',
      };
      navigate(roleRouteMap[selectedRole]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-snow text-pine flex flex-col md:flex-row font-body selection:bg-gold selection:text-night">
      {/* =========================================================================
          LEFT PANEL: NIGHT BACKGROUND WITH HERO ARTWORK & TAGLINE
          ========================================================================= */}
      <div className="w-full md:w-1/2 lg:w-5/12 bg-night text-snow p-8 md:p-12 lg:p-16 flex flex-col justify-between relative overflow-hidden border-b md:border-b-0 md:border-r border-sand/40">
        {/* Authoritative Vector Topographic Command Grid & Elevation Telemetry (Zero AI Slop) */}
        <TopographicGrid opacity={0.3} showCoordinates={true} />
        <div className="absolute inset-0 bg-gradient-to-t from-night via-night/85 to-transparent pointer-events-none" />

        {/* Top Header & Lockup */}
        <div className="relative z-10 space-y-6">
          <BrandMark variant="lockup-dark" size={56} className="drop-shadow-md" />
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-badge bg-gold/15 text-gold border border-gold/40 text-xs font-heading font-bold tracking-wider">
            <Mountain className="w-3.5 h-3.5 text-gold" />
            <span>CENTRAL SUPPLY HEADQUARTERS • INSTITUTIONAL OPERATIONS</span>
          </div>
        </div>

        {/* Centerpiece Hero Statement */}
        <div className="relative z-10 my-12 space-y-4">
          <div className="h-1 w-20 bg-saffron rounded-full" />
          <h2 className="font-heading font-extrabold text-3xl sm:text-4xl lg:text-5xl text-snow tracking-tight leading-tight">
            Every ration accounted for.
          </h2>
          <p className="text-sand text-xs md:text-sm font-medium leading-relaxed max-w-md">
            Disciplined supply chain, tamper-evident stock ledger, and quota allocation across all institutional mess facilities.
          </p>
        </div>

        {/* Footer Technical Metadata */}
        <div className="relative z-10 flex items-center justify-between text-[11px] text-sand/80 font-mono border-t border-sand/20 pt-4">
          <span>CENTRAL SUPPLY SPECIFICATION</span>
          <span className="text-gold font-bold">HQ: CENTRAL LOGISTICS DIVISION</span>
        </div>
      </div>

      {/* =========================================================================
          RIGHT PANEL: SNOW CARD WITH LOGIN FORM & APPOINTMENTS
          ========================================================================= */}
      <div className="w-full md:w-1/2 lg:w-7/12 bg-snow p-6 sm:p-10 md:p-14 lg:p-20 flex flex-col justify-center items-center">
        <div className="w-full max-w-lg space-y-8">
          <div>
            <div className="flex items-center gap-2 text-olive text-xs font-heading font-bold uppercase tracking-wider mb-1">
              <Compass className="w-4 h-4 text-olive" />
              <span>Official System Sign-In</span>
            </div>
            <h1 className="font-heading font-extrabold text-2xl md:text-3xl text-olive-deep tracking-tight">
              Operational Authentication
            </h1>
            <p className="text-xs md:text-sm text-pine/80 mt-1">
              Select an authorized institutional role or enter registered service credentials.
            </p>
          </div>

          {/* Quick Demo Appointment Switcher Cards */}
          <div className="space-y-2.5">
            <span className="text-[11px] font-heading font-bold uppercase tracking-wider text-olive block">
              Select Authorized Role:
            </span>
            <div className="grid grid-cols-1 gap-2">
              {demoAccounts.map((acc) => {
                const isSelected = selectedRole === acc.role;
                return (
                  <button
                    key={acc.role}
                    type="button"
                    onClick={() => handleSelectRole(acc)}
                    className={`p-3 rounded-card text-left transition-all flex items-center justify-between border ${
                      isSelected
                        ? 'bg-white border-2 border-olive shadow-subtle'
                        : 'bg-white/70 border-sand hover:bg-white hover:border-olive/60'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-control flex items-center justify-center font-heading font-extrabold text-xs shrink-0 ${
                          isSelected ? 'bg-olive text-snow' : 'bg-sand/30 text-olive-deep'
                        }`}
                      >
                        {acc.name.charAt(0)}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-olive-deep flex items-center gap-2">
                          <span>{acc.name}</span>
                          <span className="text-[10px] text-olive font-medium">({acc.title})</span>
                        </div>
                        <div className="text-[11px] text-pine/70 font-medium">{acc.tag}</div>
                      </div>
                    </div>
                    {isSelected && <ShieldCheck className="w-4 h-4 text-success shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sign In Form */}
          <form onSubmit={handleSubmit} className="bg-white rounded-card border border-sand p-6 shadow-subtle space-y-4">
            <div>
              <label className="block text-xs font-bold text-olive-deep mb-1">
                Authorized Service Email / ID
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 text-xs rounded-control border border-sand bg-snow text-pine focus:outline-none focus:ring-3 focus:ring-glacier focus:border-glacier transition-all font-mono font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-olive-deep mb-1">
                Security Passcode
              </label>
              <input
                type="password"
                defaultValue="••••••••••••"
                required
                className="w-full px-3.5 py-2.5 text-xs rounded-control border border-sand bg-snow text-pine focus:outline-none focus:ring-3 focus:ring-glacier focus:border-glacier transition-all font-mono"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-control bg-olive text-snow text-xs font-heading font-extrabold uppercase tracking-wider hover:bg-olive/90 active:scale-[0.98] transition-all shadow-subtle flex items-center justify-center gap-2"
            >
              <span>{isLoading ? 'Verifying Credentials...' : 'Sign In to Operations Console'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="text-center text-[11px] text-sand font-medium">
            RESTRICTED INSTITUTIONAL PORTAL • UNAUTHORISED ACCESS IS STRICTLY MONITORED
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
