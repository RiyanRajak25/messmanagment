import React from 'react';
import { Shield, ShieldAlert, ShieldCheck, Lock, Activity, Sparkles, Mountain } from 'lucide-react';

export interface InsigniaProps {
  size?: 'sm' | 'md' | 'lg' | 'hero';
  mood?: 'happy' | 'cooking' | 'alert' | 'sleepy' | 'locked' | 'verified';
  className?: string;
  showSteam?: boolean; // Maintained for backwards compatibility
}

/**
 * InstitutionalInsignia (formerly ChibiPotMascot)
 * ===============================================
 * Authoritative vector institutional operations emblem.
 * Replaces cartoon/AI-slop mascot illustrations with a dignified, high-precision
 * heraldic mountain seal, central supply wheat laurels, and operational telemetry.
 */
export const InstitutionalInsignia: React.FC<InsigniaProps> = ({
  size = 'md',
  mood = 'happy',
  className = '',
}) => {
  const sizeMap = {
    sm: { container: 'w-10 h-10', icon: 'w-4 h-4', font: 'text-[9px]' },
    md: { container: 'w-24 h-24', icon: 'w-8 h-8', font: 'text-[11px]' },
    lg: { container: 'w-36 h-36', icon: 'w-12 h-12', font: 'text-xs' },
    hero: { container: 'w-56 h-56 md:w-64 md:h-64', icon: 'w-16 h-16', font: 'text-sm' },
  }[size];

  // Visual variants based on operational mood/state
  const moodConfig = {
    happy: {
      borderColor: 'border-gold',
      ringColor: '#D9A441',
      bgGradient: 'from-olive-deep via-night to-pine',
      accentColor: 'text-gold',
      label: 'VERIFIED',
      icon: <ShieldCheck className="text-gold" />,
    },
    verified: {
      borderColor: 'border-gold',
      ringColor: '#D9A441',
      bgGradient: 'from-olive-deep via-night to-pine',
      accentColor: 'text-gold',
      label: 'VERIFIED',
      icon: <ShieldCheck className="text-gold" />,
    },
    cooking: {
      borderColor: 'border-glacier',
      ringColor: '#4F86B0',
      bgGradient: 'from-night via-olive-deep to-night',
      accentColor: 'text-glacier',
      label: 'STATION ACTIVE',
      icon: <Activity className="text-glacier animate-pulse" />,
    },
    alert: {
      borderColor: 'border-saffron',
      ringColor: '#E8861A',
      bgGradient: 'from-night via-night to-olive-deep',
      accentColor: 'text-saffron',
      label: 'LOW QUOTA NOTICE',
      icon: <ShieldAlert className="text-saffron" />,
    },
    locked: {
      borderColor: 'border-danger',
      ringColor: '#B3261E',
      bgGradient: 'from-night via-[#200A0A] to-night',
      accentColor: 'text-danger',
      label: 'CLEARANCE LOCKED',
      icon: <Lock className="text-danger" />,
    },
    sleepy: {
      borderColor: 'border-sand/40',
      ringColor: '#C8B88A',
      bgGradient: 'from-night via-night to-pine',
      accentColor: 'text-sand',
      label: 'STANDBY',
      icon: <Mountain className="text-sand" />,
    },
  }[mood] ?? {
    borderColor: 'border-gold',
    ringColor: '#D9A441',
    bgGradient: 'from-olive-deep via-night to-pine',
    accentColor: 'text-gold',
    label: 'VERIFIED',
    icon: <ShieldCheck className="text-gold" />,
  };

  return (
    <div className={`relative inline-flex flex-col items-center justify-center select-none ${className}`}>
      {/* Outer Tactical Insignia Container */}
      <div
        className={`relative ${sizeMap.container} rounded-full bg-gradient-to-b ${moodConfig.bgGradient} border-2 ${moodConfig.borderColor} shadow-elevation flex items-center justify-center overflow-hidden`}
      >
        {/* Radar Telemetry SVG Overlay */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Outer Compass Ticks */}
          <circle cx="50" cy="50" r="46" stroke={moodConfig.ringColor} strokeWidth="1" strokeDasharray="2 4" strokeOpacity="0.4" />
          <circle cx="50" cy="50" r="38" stroke={moodConfig.ringColor} strokeWidth="0.8" strokeOpacity="0.25" />
          
          {/* Concentric Altitude Rings */}
          <line x1="50" y1="4" x2="50" y2="10" stroke={moodConfig.ringColor} strokeWidth="1.5" />
          <line x1="50" y1="90" x2="50" y2="96" stroke={moodConfig.ringColor} strokeWidth="1.5" />
          <line x1="4" y1="50" x2="10" y2="50" stroke={moodConfig.ringColor} strokeWidth="1.5" />
          <line x1="90" y1="50" x2="96" y2="50" stroke={moodConfig.ringColor} strokeWidth="1.5" />

          {/* Faceted Mountain Peaks in Vector */}
          <polygon points="18,68 50,28 82,68" fill="#1B2430" stroke="#C8B88A" strokeWidth="0.8" strokeOpacity="0.6" />
          <polygon points="50,28 82,68 50,68" fill="#4F5D2F" fillOpacity="0.5" />
          <polygon points="34,68 50,42 66,68" fill="#F5F7F4" fillOpacity="0.85" />
          {/* Wheat Sheaves / Laurel Base Curve */}
          <path
            d="M 24 72 Q 50 82 76 72"
            fill="none"
            stroke="#D9A441"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>

        {/* Center Operational Emblem Icon */}
        <div className={`relative z-10 flex items-center justify-center ${moodConfig.accentColor} drop-shadow-md`}>
          {React.cloneElement(moodConfig.icon, {
            className: sizeMap.icon,
          })}
        </div>

        {/* Subtle Ambient Glow */}
        <div className="absolute inset-0 bg-gradient-to-t from-gold/10 to-transparent pointer-events-none" />
      </div>

      {/* Subtitle Badge (for larger sizes) */}
      {(size === 'lg' || size === 'hero') && (
        <div className="mt-3 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-badge bg-night/90 border border-sand/40 text-[10px] font-mono tracking-wider text-sand shadow-subtle">
          <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
          <span>{moodConfig.label}</span>
        </div>
      )}
    </div>
  );
};

// Backwards-compatible export mapping
export const ChibiPotMascot = InstitutionalInsignia;
