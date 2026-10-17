import React from 'react';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

export interface StatCardProps {
  label: string;
  value: React.ReactNode;
  icon?: React.ReactNode;
  trend?: {
    value: string;
    direction?: 'up' | 'down' | 'neutral';
    label?: string;
  };
  subtitle?: string;
  subValue?: string;
  variant?: 'default' | 'gold' | 'olive' | 'night';
  accentColor?: string;
  onClick?: () => void;
  className?: string;
}

/**
 * Modern StatCard (Tailwind UI / Tremor pattern)
 * ==============================================
 * Displays key logistics metrics with high-contrast typography,
 * JetBrains Mono tabular numerals, and directional trend indicators.
 */
export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  icon,
  trend,
  subtitle,
  subValue,
  variant = 'default',
  accentColor,
  onClick,
  className = '',
}) => {
  const displaySubtitle = subtitle || subValue;
  const isClickable = Boolean(onClick);

  const variantStyles = {
    default: {
      card: 'bg-white border-sand/60',
      iconBg: 'bg-olive/10 text-olive border-olive/20',
      labelColor: 'text-pine/70',
      valueColor: 'text-pine',
    },
    gold: {
      card: 'bg-white border-gold/40 shadow-subtle',
      iconBg: 'bg-gold/15 text-gold border-gold/30',
      labelColor: 'text-pine/70',
      valueColor: 'text-olive-deep',
    },
    olive: {
      card: 'bg-olive text-snow border-olive-deep shadow-elevation',
      iconBg: 'bg-snow/15 text-gold border-snow/20',
      labelColor: 'text-snow/80',
      valueColor: 'text-snow',
    },
    night: {
      card: 'bg-night text-snow border-sand/40 shadow-elevation',
      iconBg: 'bg-gold/15 text-gold border-gold/30',
      labelColor: 'text-sand',
      valueColor: 'text-snow',
    },
  }[variant];

  return (
    <div
      onClick={onClick}
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
      onKeyDown={(e) => {
        if (isClickable && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onClick?.();
        }
      }}
      className={`relative p-5 rounded-card border shadow-subtle transition-all duration-200 select-none ${variantStyles.card} ${
        isClickable ? 'cursor-pointer hover:border-gold hover:shadow-elevation hover:-translate-y-0.5' : ''
      } ${className}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1 flex-1 min-w-0">
          <p className={`text-[11px] font-heading font-bold uppercase tracking-wider truncate ${variantStyles.labelColor}`}>
            {label}
          </p>
          <div className={`text-2xl sm:text-3xl font-extrabold font-mono tabular-nums tracking-tight ${variantStyles.valueColor}`}>
            {value}
          </div>
        </div>

        {icon && (
          <div className={`w-10 h-10 rounded-control border flex items-center justify-center shrink-0 shadow-subtle ${variantStyles.iconBg}`}>
            {icon}
          </div>
        )}
      </div>

      {(trend || displaySubtitle) && (
        <div className="mt-3 pt-3 border-t border-sand/30 flex items-center justify-between text-xs gap-2">
          {trend ? (
            <div className="flex items-center gap-1.5 font-medium">
              <span
                className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-mono font-bold ${
                  trend.direction === 'up'
                    ? 'bg-success/15 text-success border border-success/30'
                    : trend.direction === 'down'
                    ? 'bg-danger/15 text-danger border border-danger/30'
                    : 'bg-sand/20 text-pine/70 border border-sand/40'
                }`}
              >
                {trend.direction === 'up' && <ArrowUpRight className="w-3 h-3" />}
                {trend.direction === 'down' && <ArrowDownRight className="w-3 h-3" />}
                {trend.direction === 'neutral' && <Minus className="w-3 h-3" />}
                {trend.value}
              </span>
              {trend.label && (
                <span className={`text-[11px] truncate ${variant === 'olive' || variant === 'night' ? 'text-sand/90' : 'text-pine/60'}`}>
                  {trend.label}
                </span>
              )}
            </div>
          ) : (
            <div />
          )}

          {displaySubtitle && (
            <span className={`text-[11px] font-mono truncate text-right ${variant === 'olive' || variant === 'night' ? 'text-sand/80' : 'text-pine/50'}`}>
              {displaySubtitle}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
