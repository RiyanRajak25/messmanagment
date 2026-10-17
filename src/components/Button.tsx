import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

export interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  variant?: 'primary' | 'secondary' | 'danger' | 'mint' | 'soft' | 'ghost' | 'outline' | 'cta';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  children: React.ReactNode;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  children,
  icon,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-heading font-bold select-none transition-all rounded-control focus:outline-none focus:ring-3 focus:ring-glacier focus:border-glacier disabled:opacity-50 disabled:cursor-not-allowed';

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs gap-1.5 min-h-[32px]',
    md: 'px-4 py-2.5 text-xs gap-2 min-h-[40px]',
    lg: 'px-6 py-3 text-sm gap-2.5 min-h-[48px]',
  }[size];

  const variantStyles = {
    // Primary: olive with snow text
    primary:
      'bg-olive text-snow hover:bg-olive/90 active:scale-[0.98] shadow-subtle border border-sand/40',
    // CTA / urgent: saffron with night text
    cta:
      'bg-saffron text-night hover:bg-saffron/90 active:scale-[0.98] shadow-subtle font-extrabold',
    // Secondary: 2px olive outline
    secondary:
      'border-2 border-olive text-olive bg-transparent hover:bg-olive/10 active:scale-[0.98]',
    // Destructive: danger with snow text
    danger:
      'bg-danger text-snow hover:bg-danger/90 active:scale-[0.98] shadow-subtle',
    // Mint / Success
    mint:
      'bg-success text-snow hover:bg-success/90 active:scale-[0.98] shadow-subtle',
    // Outline: 1px sand border
    outline:
      'border border-sand bg-white text-pine hover:bg-snow active:scale-[0.98] shadow-subtle',
    soft:
      'bg-snow text-pine hover:bg-sand/20 active:scale-[0.98] border border-sand/40',
    ghost:
      'bg-transparent text-pine hover:bg-snow border-transparent shadow-none',
  }[variant] || 'bg-olive text-snow shadow-subtle';

  return (
    <motion.button
      whileTap={disabled || isLoading ? undefined : { scale: 0.98 }}
      transition={{ duration: 0.1 }}
      disabled={disabled || isLoading}
      className={`${baseStyles} ${sizeStyles} ${variantStyles} ${className}`}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span>Processing...</span>
        </span>
      ) : (
        <>
          {icon && <span className="shrink-0">{icon}</span>}
          <span>{children}</span>
        </>
      )}
    </motion.button>
  );
};

export default Button;
