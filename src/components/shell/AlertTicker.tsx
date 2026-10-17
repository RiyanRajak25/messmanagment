import React from 'react';
import { AlertCircle, ShieldCheck, Mountain } from 'lucide-react';

interface AlertTickerProps {
  alerts?: string[];
}

export const AlertTicker: React.FC<AlertTickerProps> = ({
  alerts = [
    'Low stock: Refined Mustard Oil (45 L remaining) · Auto-indent advised for central depot',
    'Shelf Alert: Full Cream Milk batch expires in 2 days · Priority rotation for morning breakfast service',
    'Logistics Dispatch: Central Supply Silo Grade A+ Reconciled · Zero physical variance',
  ],
}) => {
  return (
    <div className="w-full bg-sand/15 border-b border-sand text-pine py-1.5 px-4 md:px-8 flex items-center justify-between text-xs select-none font-body">
      <div className="flex items-center gap-2.5 max-w-full overflow-hidden">
        <span className="shrink-0 flex items-center gap-1.5 bg-olive-deep text-gold px-2.5 py-0.5 rounded-badge text-[9px] tracking-wider uppercase font-heading font-extrabold border border-gold/30">
          <Mountain className="w-3 h-3 text-gold" />
          <span>LIVE RATION PULSE</span>
        </span>
        <div className="flex items-center gap-4 text-pine font-medium truncate text-[11px] md:text-xs">
          <span>{alerts[0]}</span>
          <span className="hidden lg:inline text-sand">•</span>
          <span className="hidden lg:inline text-olive font-semibold">{alerts[1]}</span>
        </div>
      </div>

      <div className="hidden md:flex items-center gap-3 text-[11px] font-bold text-olive-deep shrink-0">
        <span className="flex items-center gap-1.5 text-success">
          <ShieldCheck className="w-3.5 h-3.5 text-success" />
          <span>All 3 Dining Messes Operational</span>
        </span>
      </div>
    </div>
  );
};

export default AlertTicker;
