import React from 'react';

export type BadgeVariant =
  | 'default'
  | 'gold'
  | 'outline'
  | 'destructive'
  | 'success'
  | 'glacier'
  | 'altitude';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  pulse?: boolean;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

/**
 * Modern Badge Component (shadcn / Tailwind UI style)
 * ====================================================
 * Formal institutional design tokens with optional live pulse pip.
 */
export const Badge: React.FC<BadgeProps> = ({
  variant = 'default',
  pulse = false,
  icon,
  children,
  className = '',
  ...props
}) => {
  const variantStyles: Record<BadgeVariant, { container: string; pipColor?: string }> = {
    default: {
      container: 'bg-olive text-snow border-olive/80',
      pipColor: 'bg-gold',
    },
    gold: {
      container: 'bg-gold/15 text-gold border-gold/40',
      pipColor: 'bg-gold',
    },
    outline: {
      container: 'bg-transparent text-olive border-sand/70 hover:bg-olive/5',
      pipColor: 'bg-olive',
    },
    destructive: {
      container: 'bg-danger/10 text-danger border-danger/30',
      pipColor: 'bg-danger',
    },
    success: {
      container: 'bg-success/10 text-success border-success/30',
      pipColor: 'bg-success',
    },
    glacier: {
      container: 'bg-glacier/10 text-glacier border-glacier/30',
      pipColor: 'bg-glacier',
    },
    altitude: {
      container: 'bg-night text-snow border-sand/40 font-mono',
      pipColor: 'bg-saffron',
    },
  };

  const style = variantStyles[variant] || variantStyles.default;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-badge text-[11px] font-heading font-bold uppercase tracking-wider border shadow-subtle select-none transition-colors duration-150 ${style.container} ${className}`}
      {...props}
    >
      {pulse && (
        <span
          className={`w-1.5 h-1.5 rounded-full ${style.pipColor ?? 'bg-current'} status-pip-pulse`}
          aria-hidden="true"
        />
      )}
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </span>
  );
};
