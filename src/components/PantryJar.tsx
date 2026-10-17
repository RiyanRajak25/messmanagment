import React from 'react';
import { motion } from 'framer-motion';

export interface PantryJarProps {
  name: string;
  quantity: number;
  unit: string;
  maxCapacity?: number;
  daysLeft: number;
  status: 'fresh' | 'adequate' | 'low' | 'expiring';
  category?: string;
  onClick?: () => void;
  className?: string;
}

export const PantryJar: React.FC<PantryJarProps> = ({
  name,
  quantity,
  unit,
  maxCapacity = 500,
  daysLeft,
  status,
  category,
  onClick,
  className = '',
}) => {
  // Calculate percentage fill (between 10% and 95%)
  const rawPct = Math.min(100, Math.max(0, Math.round((quantity / maxCapacity) * 100)));
  const fillPercentage = Math.min(95, Math.max(12, rawPct));

  // Determine colors based on status
  const statusConfig = {
    fresh: {
      fillColor: '#4EBA6F',
      bubbleColor: '#7ae696',
      badgeBg: 'bg-tertiary-fixed text-on-tertiary-fixed',
      label: 'Healthy Stock',
      wobble: false,
    },
    adequate: {
      fillColor: '#FFC83B',
      bubbleColor: '#ffdf9b',
      badgeBg: 'bg-primary-fixed text-on-primary-fixed',
      label: 'Adequate',
      wobble: false,
    },
    low: {
      fillColor: '#FF5A36',
      bubbleColor: '#ffdad2',
      badgeBg: 'bg-secondary-fixed text-on-secondary-fixed',
      label: 'Low Stock Alert',
      wobble: true,
    },
    expiring: {
      fillColor: '#FF5A36',
      bubbleColor: '#ffdad2',
      badgeBg: 'bg-secondary-container text-white',
      label: 'Expiring Soon',
      wobble: true,
    },
  }[status];

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
      onClick={onClick}
      className={`chibi-card p-4 flex flex-col items-center text-center cursor-pointer select-none bg-canvas hover:shadow-chibi-hover transition-all ${
        status === 'low' || status === 'expiring' ? 'ring-2 ring-tomato/40' : ''
      } ${className}`}
    >
      {/* Top Status Badge */}
      <div className="w-full flex justify-between items-center text-xs pb-2">
        <span className={`px-2.5 py-0.5 rounded-full font-bold text-[11px] uppercase tracking-wider ${statusConfig.badgeBg}`}>
          {statusConfig.label}
        </span>
        {category && <span className="text-[11px] font-semibold text-crust truncate max-w-[90px]">{category}</span>}
      </div>

      {/* Glass Jar SVG Visual */}
      <div
        className={`relative w-28 h-36 my-2 bg-[#f0eee9] border-2.5 border-ink rounded-t-xl rounded-b-3xl p-1 flex flex-col justify-end overflow-hidden shadow-inner ${
          statusConfig.wobble ? 'animate-jar-wobble' : ''
        }`}
      >
        {/* Jar Wooden Lid */}
        <div className="absolute top-0 inset-x-2 h-3.5 bg-[#d8cbaf] border-b-2 border-ink rounded-full shadow-sm z-10 flex items-center justify-center">
          <div className="w-6 h-0.5 bg-ink/30 rounded-full" />
        </div>

        {/* Liquid Fill Level */}
        <motion.div
          initial={{ height: 0 }}
          animate={{ height: `${fillPercentage}%` }}
          transition={{ type: 'spring', stiffness: 200, damping: 25, delay: 0.1 }}
          style={{ backgroundColor: statusConfig.fillColor }}
          className="w-full rounded-b-2xl relative transition-all flex flex-col justify-center items-center text-ink font-bold shadow-sm"
        >
          {/* Surface Meniscus Wave */}
          <div
            className="absolute top-0 inset-x-0 h-1.5 opacity-60 rounded-full"
            style={{ backgroundColor: statusConfig.bubbleColor }}
          />

          {/* Fill Percentage Pill */}
          <span className="text-[11px] font-extrabold px-1.5 py-0.5 rounded-full bg-white/75 text-ink tabular-nums shadow-sm">
            {rawPct}%
          </span>
        </motion.div>

        {/* Specular Highlight Streak */}
        <div className="absolute inset-y-2 left-2 w-1.5 bg-white/50 rounded-full pointer-events-none z-10" />
      </div>

      {/* Item Title */}
      <h4 className="font-bold text-sm text-ink truncate w-full mt-1" title={name}>
        {name}
      </h4>

      {/* Big Tactile Number */}
      <p className="text-xl font-extrabold text-ink mt-0.5 tabular-nums">
        {quantity} <span className="text-xs font-semibold text-crust lowercase">{unit}</span>
      </p>

      {/* Days Left Countdown Pill */}
      <div
        className={`w-full mt-2.5 py-1 px-2 rounded-full text-center text-xs font-bold ${
          daysLeft <= 3
            ? 'bg-secondary-fixed text-on-secondary-fixed'
            : 'bg-surface-container-low text-crust'
        }`}
      >
        {daysLeft <= 0 ? 'Zero Reserve!' : `Sufficient for ${daysLeft} days`}
      </div>
    </motion.div>
  );
};
