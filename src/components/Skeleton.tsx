import React from 'react';

interface SkeletonProps {
  className?: string;
  variant?: 'pill' | 'card' | 'circle' | 'text';
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '', variant = 'text' }) => {
  const variantStyles = {
    pill: 'rounded-full h-10',
    card: 'rounded-[2rem] border-2 border-ink/20 h-48',
    circle: 'rounded-full w-12 h-12',
    text: 'rounded-full h-4 w-3/4',
  }[variant];

  return (
    <div
      className={`animate-pulse bg-surface-container-high/60 ${variantStyles} ${className}`}
    />
  );
};
