import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import { BrandMark } from '../components/brand/BrandMark';
import { TopographicGrid } from '../components/brand/TopographicGrid';
import {
  ShieldCheck,
  ArrowRight,
  Lock,
  Mountain,
  Compass,
  Eye,
  EyeOff,
  AlertTriangle,
  ShieldAlert,
  Clock,
  KeyRound,
} from 'lucide-react';
import { rateLimiter, evaluatePasswordStrength } from '../utils/security';

export const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('storekeeper@messmunch.edu');
  const [password, setPassword] = useState('HimRasad@2026#Secure');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>('store_keeper');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [lockoutSeconds, setLockoutSeconds] = useState(0);

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

  // Lockout countdown timer
  useEffect(() => {
    if (lockoutSeconds <= 0) return;
    const interval = setInterval(() => {
      setLockoutSeconds((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [lockoutSeconds]);

  const handleSelectRole = (acc: typeof demoAccounts[0]) => {
    setSelectedRole(acc.role);
    setEmail(acc.email);
    setErrorMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Check rate limit status
    const rateCheck = rateLimiter.check(email);
    if (!rateCheck.allowed) {
      setLockoutSeconds(rateCheck.remainingLockoutSeconds);
      setErrorMessage(`Authentication locked: Too many failed attempts. Cooldown in progress.`);
      return;
    }

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
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Invalid credentials or inactive service identity';
      setErrorMessage(msg);
      const updatedCheck = rateLimiter.check(email);
      if (!updatedCheck.allowed) {
        setLockoutSeconds(updatedCheck.remainingLockoutSeconds);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const passStrength = evaluatePasswordStrength(password);

  return (
    <div className="min-h-screen bg-snow text-pine flex flex-col md:flex-row font-body selection:bg-gold selection:text-night">
      {/* =========================================================================
          LEFT PANEL: NIGHT BACKGROUND WITH HERO ARTWORK & TECHNICAL TELEMETRY
          ========================================================================= */}
      <div className="w-full md:w-1/2 lg:w-5/12 bg-night text-snow p-8 md:p-12 lg:p-16 flex flex-col justify-between relative overflow-hidden border-b md:border-b-0 md:border-r border-sand/40">
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

          <div className="pt-4 flex flex-wrap items-center gap-2 text-[11px] font-mono text-sand/80">
            <span className="px-2 py-0.5 rounded bg-white/10 border border-white/20 flex items-center gap-1.5">
              <ShieldCheck className="w-3 h-3 text-success" />
              <span>TLS 1.3 Strict Simulated Protocol</span>
            </span>
            <span className="px-2 py-0.5 rounded bg-white/10 border border-white/20 flex items-center gap-1.5">
              <Lock className="w-3 h-3 text-gold" />
              <span>Anti-Brute Force Sentinel Active</span>
            </span>
          </div>
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
        <div className="w-full max-w-lg space-y-6">
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
          <div className="space-y-2">
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

          {/* Error / Lockout Banner */}
          {errorMessage && (
            <div className="p-3.5 rounded-control bg-saffron/10 border border-saffron/30 text-saffron-dark text-xs flex items-start gap-2.5">
              <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5 text-saffron" />
              <div>
                <span className="font-bold block">Authentication Notice</span>
                <span>{errorMessage}</span>
              </div>
            </div>
          )}

          {lockoutSeconds > 0 && (
            <div className="p-3.5 rounded-control bg-night text-snow border border-gold/40 text-xs flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gold animate-pulse" />
                <span className="font-medium">Temporary Rate Limit Lockout Active</span>
              </div>
              <span className="font-mono font-bold text-gold text-sm">{lockoutSeconds}s</span>
            </div>
          )}

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
                  disabled={lockoutSeconds > 0}
                  required
                  className="w-full px-3.5 py-2.5 text-xs rounded-control border border-sand bg-snow text-pine focus:outline-none focus:ring-3 focus:ring-glacier focus:border-glacier transition-all font-mono font-medium disabled:opacity-50"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-olive-deep">
                  Security Passcode
                </label>
                <span className="text-[10px] font-mono text-pine/60">
                  Rating: <strong className="text-olive">{passStrength.label}</strong>
                </span>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={lockoutSeconds > 0}
                  required
                  className="w-full px-3.5 py-2.5 pr-10 text-xs rounded-control border border-sand bg-snow text-pine focus:outline-none focus:ring-3 focus:ring-glacier focus:border-glacier transition-all font-mono disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-pine/60 hover:text-olive transition-colors"
                  tabIndex={-1}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Password strength mini bar */}
              <div className="mt-1.5 flex items-center gap-1">
                {[1, 2, 3, 4].map((step) => (
                  <div
                    key={step}
                    className={`h-1 flex-1 rounded-full transition-colors ${
                      passStrength.score >= step
                        ? passStrength.score >= 3
                          ? 'bg-success'
                          : 'bg-gold'
                        : 'bg-sand/30'
                    }`}
                  />
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || lockoutSeconds > 0}
              className="w-full py-3 px-4 rounded-control bg-olive text-snow text-xs font-heading font-extrabold uppercase tracking-wider hover:bg-olive/90 active:scale-[0.98] transition-all shadow-subtle flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>{isLoading ? 'Verifying Credentials...' : 'Sign In to Operations Console'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="p-3 bg-sand/15 rounded-control border border-sand/40 text-[11px] text-pine/80 font-mono flex items-center gap-2">
            <KeyRound className="w-4 h-4 text-olive shrink-0" />
            <span>SESSION LIFETIME: 8 HOURS • AUTO-LOCKOUT AFTER 15 MIN INACTIVITY</span>
          </div>

          <div className="text-center text-[10px] text-sand font-mono tracking-wider">
            RESTRICTED INSTITUTIONAL PORTAL • ALL TRANSACTIONS ARE CRYPTOGRAPHICALLY SIGNED & AUDITED
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
