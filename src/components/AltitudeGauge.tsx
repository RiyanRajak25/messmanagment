import React from 'react';
import { ShieldAlert, CheckCircle2, AlertTriangle, Mountain } from 'lucide-react';

export interface AltitudeGaugeProps {
  current?: number;
  value?: number;
  max: number;
  unit: string;
  threshold?: number;
  label?: string;
  className?: string;
  showTicks?: boolean;
  size?: 'sm' | 'md' | 'lg' | string;
}

export const AltitudeGauge: React.FC<AltitudeGaugeProps> = ({
  current,
  value,
  max,
  unit,
  threshold = 0.2 * max,
  label,
  className = '',
  showTicks = true,
  size = 'md',
}) => {
  const actualCurrent = current ?? value ?? 0;
  const percentage = Math.min(100, Math.max(0, Math.round((actualCurrent / (max || 1)) * 100)));

  // Semantic Color & Status Rule
  let statusColor = 'bg-success';
  let textColor = 'text-success';
  let borderColor = 'border-success';
  let statusText = 'Healthy Stock';
  let StatusIcon = CheckCircle2;

  if (actualCurrent <= threshold || percentage <= 20) {
    statusColor = 'bg-danger';
    textColor = 'text-danger';
    borderColor = 'border-danger';
    statusText = 'Critical Low';
    StatusIcon = ShieldAlert;
  } else if (percentage <= 45) {
    statusColor = 'bg-gold';
    textColor = 'text-gold';
    borderColor = 'border-gold';
    statusText = 'Adequate';
    StatusIcon = AlertTriangle;
  } else {
    statusColor = 'bg-success';
    textColor = 'text-success';
    borderColor = 'border-success';
    statusText = 'Optimal Stock';
    StatusIcon = CheckCircle2;
  }

  return (
    <div className={`flex flex-col gap-1.5 select-none font-body ${className}`}>
      {/* Header Info */}
      <div className="flex items-center justify-between text-xs font-semibold">
        <div className="flex items-center gap-1.5">
          <Mountain className="w-3.5 h-3.5 text-olive" />
          <span className="text-pine font-bold truncate">{label || 'Stock Gauge'}</span>
        </div>
        <div className="flex items-center gap-1.5 font-mono tabular-nums">
          <span className="font-extrabold text-pine text-sm">{actualCurrent.toLocaleString()}</span>
          <span className="text-olive text-[11px] font-semibold">{unit}</span>
          <span className="text-sand font-medium text-[11px]">/ {max.toLocaleString()} {unit}</span>
        </div>
      </div>

      {/* Altitude Bar Container */}
      <div className="relative pt-3 pb-1">
        {/* Mountain Peak Marker at Current Level */}
        <div
          className="absolute -top-1 transition-all duration-500 ease-out flex flex-col items-center -translate-x-1/2 pointer-events-none z-10"
          style={{ left: `${percentage}%` }}
        >
          {/* Small Mountain Peak Shape Polygon */}
          <svg width="12" height="10" viewBox="0 0 12 10" className="drop-shadow-sm">
            <polygon points="6,0 12,10 0,10" fill={
              percentage <= 20 ? '#B3261E' : percentage <= 45 ? '#D9A441' : '#2E7D4F'
            } />
          </svg>
        </div>

        {/* Gauge Track */}
        <div className="relative h-2.5 w-full bg-snow border border-sand rounded-full overflow-hidden shadow-inner">
          {/* Active Fill */}
          <div
            className={`h-full ${statusColor} transition-all duration-500 ease-out rounded-full`}
            style={{ width: `${percentage}%` }}
          />
        </div>

        {/* Altitude Gauge Tick Marks (0%, 25%, 50%, 75%, 100%) */}
        {showTicks && (
          <div className="flex justify-between px-0.5 mt-1 text-[9px] font-mono text-sand font-bold tracking-tight">
            <span>0m</span>
            <span>25%</span>
            <span>50%</span>
            <span>75%</span>
            <span>100% (High Cap)</span>
          </div>
        )}
      </div>

      {/* Status Meta Indicator */}
      <div className="flex items-center justify-between text-[11px] text-olive font-medium pt-0.5">
        <div className="flex items-center gap-1">
          <StatusIcon className={`w-3 h-3 ${textColor}`} />
          <span className={`font-bold ${textColor}`}>{statusText}</span>
        </div>
        <span className="font-mono text-xs font-bold text-pine">{percentage}% Cap</span>
      </div>
    </div>
  );
};

export default AltitudeGauge;
