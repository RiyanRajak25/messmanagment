import React, { useEffect, useState } from 'react';
import { Sidebar } from './Sidebar';
import { TopHeader } from './TopHeader';
import { AlertTicker } from './AlertTicker';
import { MobileNav } from './MobileNav';
import { WifiOff, ShieldCheck } from 'lucide-react';
import { BrandMark } from '../brand/BrandMark';

export const AppShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <div className="min-h-screen bg-snow text-pine flex font-body antialiased">
      {/* Auto-Minimizing Left Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area (Offset by 80px for the compact sidebar rail) */}
      <div className="flex-1 min-w-0 pl-20 flex flex-col min-h-screen">
        {/* Offline Alert Banner */}
        {!isOnline && (
          <div className="bg-danger text-snow text-xs font-bold py-2 px-4 text-center border-b border-sand flex items-center justify-center gap-2 select-none z-50">
            <WifiOff className="w-4 h-4" />
            <span>OFFLINE BUFFER: All transactions will synchronize with central logistics supply depot upon connection.</span>
          </div>
        )}

        {/* Top High-Altitude Classification Bar with 3px Gold Signature Line */}
        <TopHeader />

        {/* Live Ration Pulse Banner */}
        <AlertTicker />

        {/* Primary Page Canvas */}
        <main className="flex-1 w-full max-w-[1360px] mx-auto px-4 md:px-8 py-6 md:py-8">
          {children}
        </main>

        {/* Mobile Navigation (For small touchscreens) */}
        <MobileNav />

        {/* Institutional Logistics Command Footer */}
        <footer className="w-full max-w-[1360px] mx-auto px-4 md:px-8 py-6 border-t border-sand flex flex-col sm:flex-row items-center justify-between text-xs text-olive font-medium gap-3 select-none">
          <div className="flex items-center gap-2.5">
            <BrandMark variant="shield" size={18} />
            <span className="font-heading font-extrabold text-olive-deep">HIMRASAD • INSTITUTIONAL MESS &amp; RATION OPERATIONS</span>
            <span className="text-sand">•</span>
            <span>CENTRAL LOGISTICS COMMAND</span>
            <span className="text-sand">•</span>
            <span>INSTITUTIONAL RATION SCALE</span>
          </div>
          <div className="flex items-center gap-3">
            <a href="/brand" className="underline hover:text-olive-deep font-heading font-bold text-olive">
              Brand Guidelines
            </a>
            <span>•</span>
            <span className="font-mono text-gold bg-night px-2 py-0.5 rounded text-[10px] font-bold">
              VERIFIED SECURE
            </span>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default AppShell;
