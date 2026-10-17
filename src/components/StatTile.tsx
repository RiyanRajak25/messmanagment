import React from 'react';
import { motion } from 'framer-motion';

export interface StatTileProps {
  label: string;
  value: string | number;
  subValue?: string;
  unit?: string;
  icon: React.ReactNode;
  trend?: {
    value: string;
    isPositive?: boolean;
    label?: string;
  };
  accentColor?: 'yolk' | 'tomato' | 'mint' | 'crust' | 'gold' | 'danger' | 'success' | 'glacier' | 'olive';
  className?: string;
}

export const StatTile: React.FC<StatTileProps> = ({
  label,
  value,
  subValue,
  unit,
  icon,
  trend,
  accentColor = 'gold',
  className = '',
}) => {
  // 4px left border in semantic color
  const borderLeftColor = {
    yolk: 'border-l-gold',
    gold: 'border-l-gold',
    tomato: 'border-l-danger',
    danger: 'border-l-danger',
    mint: 'border-l-success',
    success: 'border-l-success',
    glacier: 'border-l-glacier',
    olive: 'border-l-olive',
    crust: 'border-l-olive',
  }[accentColor] || 'border-l-olive';

  const iconBg = {
    yolk: 'bg-gold/15 text-gold border-gold/40',
    gold: 'bg-gold/15 text-gold border-gold/40',
    tomato: 'bg-danger/15 text-danger border-danger/40',
    danger: 'bg-danger/15 text-danger border-danger/40',
    mint: 'bg-success/15 text-success border-success/40',
    success: 'bg-success/15 text-success border-success/40',
    glacier: 'bg-glacier/15 text-glacier border-glacier/40',
    olive: 'bg-olive/15 text-olive border-olive/40',
    crust: 'bg-sand/30 text-pine border-sand',
  }[accentColor] || 'bg-olive/15 text-olive border-olive/40';

  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.15, ease: 'easeOut' }}
      className={`p-5 flex flex-col justify-between bg-white border border-sand border-l-4 ${borderLeftColor} rounded-card shadow-subtle select-none font-body ${className}`}
    >
      <div className="flex items-center justify-between pb-3">
        <span className="text-xs font-heading font-bold uppercase tracking-wider text-olive">
          {label}
        </span>
        <div className={`w-9 h-9 rounded-control border flex items-center justify-center shrink-0 ${iconBg}`}>
          {icon}
        </div>
      </div>

      <div className="flex items-baseline gap-2 my-1">
        <span className="text-2xl md:text-3xl font-mono font-extrabold text-pine tabular-nums tracking-tight">
          {value}
        </span>
        {unit && <span className="text-xs font-heading font-bold text-olive uppercase">{unit}</span>}
      </div>

      <div className="flex items-center justify-between text-xs pt-3 border-t border-sand/40">
        {subValue && <span className="text-pine/70 font-medium text-[11px] truncate">{subValue}</span>}
        {trend && (
          <span
            className={`font-mono text-[10px] font-bold px-2 py-0.5 rounded-badge border shrink-0 ${
              trend.isPositive
                ? 'bg-success/10 text-success border-success/30'
                : 'bg-danger/10 text-danger border-danger/30'
            }`}
          >
            {trend.value}
          </span>
        )}
      </div>
    </motion.div>
  );
};

export default StatTile;
