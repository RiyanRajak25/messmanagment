import React from 'react';
import { BrandMark } from './brand/BrandMark';
import { Button } from './Button';

export interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  mood?: 'happy' | 'alert' | 'sleepy' | 'locked';
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  actionLabel,
  onAction,
  className = '',
}) => {
  return (
    <div
      className={`p-10 flex flex-col items-center text-center justify-center bg-white border border-sand/60 rounded-card shadow-subtle ${className}`}
    >
      <div className="w-14 h-14 rounded-card bg-gold/15 border border-gold/40 flex items-center justify-center text-gold mb-4 shadow-subtle">
        <BrandMark variant="shield" size={32} />
      </div>
      <h3 className="text-lg font-heading font-extrabold text-olive-deep">{title}</h3>
      <p className="text-xs text-pine/70 max-w-md mt-1.5 mb-5 font-body leading-relaxed">{description}</p>
      {actionLabel && onAction && (
        <Button variant="primary" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
