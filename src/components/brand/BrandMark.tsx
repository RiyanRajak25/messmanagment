import React from 'react';

export type BrandVariant = 
  | 'shield' 
  | 'lockup-light' 
  | 'lockup-dark' 
  | 'mono-dark' 
  | 'mono-white';

export interface BrandMarkProps {
  /** Variant of the brand identity to render */
  variant?: BrandVariant;
  /** Size in pixels (height or width scaling) or preset */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number;
  /** Optional custom class */
  className?: string;
  /** Optional alt or accessible title */
  alt?: string;
}

const SIZE_PRESETS = {
  xs: { height: 24, shieldWidth: 22, lockupWidth: 83 },
  sm: { height: 32, shieldWidth: 29, lockupWidth: 110 },
  md: { height: 44, shieldWidth: 40, lockupWidth: 152 },
  lg: { height: 60, shieldWidth: 55, lockupWidth: 207 },
  xl: { height: 80, shieldWidth: 73, lockupWidth: 276 },
};

/**
 * BrandMark Component
 * ==================
 * Single swappable slot for the HIMRASAD brand identity.
 * To replace with an official military or police insignia in the future,
 * update only this component or drop a new asset into /public/brand/.
 */
export const BrandMark: React.FC<BrandMarkProps> = ({
  variant = 'shield',
  size = 'md',
  className = '',
  alt = 'HIMRASAD — Mess & Ration Management',
}) => {
  const isNumber = typeof size === 'number';
  const preset = !isNumber ? SIZE_PRESETS[size] : null;

  const isLockup = variant === 'lockup-light' || variant === 'lockup-dark';

  let height = isNumber ? size : preset?.height ?? 44;
  let width: number | undefined;

  if (isNumber) {
    width = isLockup ? Math.round(size * 3.45) : Math.round(size * 0.91);
  } else if (preset) {
    width = isLockup ? preset.lockupWidth : preset.shieldWidth;
  }

  const assetMap: Record<BrandVariant, string> = {
    shield: '/brand/logo-shield.svg',
    'lockup-light': '/brand/logo-lockup-light.svg',
    'lockup-dark': '/brand/logo-lockup-dark.svg',
    'mono-dark': '/brand/logo-mono-dark.svg',
    'mono-white': '/brand/logo-mono-white.svg',
  };

  const src = assetMap[variant] || assetMap.shield;

  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={`inline-block select-none object-contain transition-transform duration-200 ${className}`}
      style={{
        height: `${height}px`,
        width: width ? `${width}px` : 'auto',
      }}
      loading="eager"
    />
  );
};

export default BrandMark;
