import React from 'react';
import { Lock, ShieldAlert } from 'lucide-react';

interface CheckpointGraphicProps {
  className?: string;
  altitude?: string;
  statusText?: string;
}

/**
 * CheckpointGraphic
 * =================
 * Authoritative vector perimeter security graphic.
 * Replaces raster AI-generated images with high-contrast tactical security geometry,
 * radar scanning vectors, laser barrier fences, and encrypted perimeter lock indicators.
 */
export const CheckpointGraphic: React.FC<CheckpointGraphicProps> = ({
  className = '',
  altitude = '4,800m',
  statusText = 'CHECKPOINT BARRIER ACTIVE',
}) => {
  return (
    <div className={`relative w-full overflow-hidden rounded-card bg-night border border-sand/40 select-none ${className}`}>
      {/* Background Vector Grid */}
      <svg
        className="w-full h-full min-h-[176px]"
        viewBox="0 0 600 220"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="laserBeam" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#B3261E" stopOpacity="0.1" />
            <stop offset="50%" stopColor="#B3261E" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#B3261E" stopOpacity="0.1" />
          </linearGradient>
          <radialGradient id="checkpointRadar" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#B3261E" stopOpacity="0.3" />
            <stop offset="80%" stopColor="#B3261E" stopOpacity="0.05" />
            <stop offset="100%" stopColor="#B3261E" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Security Cross-Hatch */}
        <pattern id="checkGrid" width="30" height="30" patternUnits="userSpaceOnUse">
          <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#C8B88A" strokeWidth="0.4" strokeOpacity="0.12" />
        </pattern>
        <rect width="600" height="220" fill="url(#checkGrid)" />

        {/* Radar concentric arcs */}
        <circle cx="300" cy="110" r="100" stroke="#B3261E" strokeWidth="1" strokeDasharray="4 4" strokeOpacity="0.3" />
        <circle cx="300" cy="110" r="70" stroke="#B3261E" strokeWidth="1" strokeOpacity="0.4" />
        <circle cx="300" cy="110" r="40" fill="url(#checkpointRadar)" />

        {/* Laser Perimeter Barrier Lines */}
        <line x1="20" y1="90" x2="580" y2="90" stroke="url(#laserBeam)" strokeWidth="2" strokeDasharray="12 4" />
        <line x1="20" y1="110" x2="580" y2="110" stroke="#B3261E" strokeWidth="2.5" strokeOpacity="0.9" />
        <line x1="20" y1="130" x2="580" y2="130" stroke="url(#laserBeam)" strokeWidth="2" strokeDasharray="12 4" />

        {/* Warning Hazard Diagonal Chevrons */}
        <g stroke="#D9A441" strokeWidth="1.5" strokeOpacity="0.35">
          <line x1="40" y1="80" x2="60" y2="140" />
          <line x1="80" y1="80" x2="100" y2="140" />
          <line x1="120" y1="80" x2="140" y2="140" />
          <line x1="460" y1="80" x2="480" y2="140" />
          <line x1="500" y1="80" x2="520" y2="140" />
          <line x1="540" y1="80" x2="560" y2="140" />
        </g>

        {/* Mountain Silhouette in Background */}
        <path
          d="M 50 160 L 150 90 L 250 160 L 350 100 L 450 150 L 550 95 L 600 160 V 220 H 0 Z"
          fill="#141C10"
          opacity="0.6"
        />

        {/* Checkpoint Coordinates & Sector Data */}
        <g fill="#C8B88A" fontSize="9" fontFamily="monospace" opacity="0.65">
          <text x="30" y="32">SECTOR PERIMETER: NORTH PASS</text>
          <text x="30" y="46">GATE ID: CP-ALPHA-04</text>
          <text x="570" y="32" textAnchor="end">ENCRYPTION: HARDWARE SHA-256</text>
          <text x="570" y="46" textAnchor="end">CLEARANCE: LEVEL-4 REQUIRED</text>
        </g>
      </svg>

      {/* Center Shield Lock Badge */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="flex flex-col items-center justify-center p-3 rounded-card bg-night/90 border border-danger/60 shadow-modal backdrop-blur-sm">
          <div className="w-10 h-10 rounded-full bg-danger/20 border border-danger flex items-center justify-center text-danger mb-1.5 animate-pulse">
            <Lock className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-heading font-extrabold tracking-widest text-snow uppercase">
            RESTRICTED ACCESS
          </span>
        </div>
      </div>

      {/* Bottom Telemetry Bar */}
      <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-night via-night/90 to-transparent p-3 pt-6 flex items-center justify-between text-[11px] font-mono text-sand">
        <span className="flex items-center gap-1.5 text-danger font-bold tracking-wide">
          <span className="w-2 h-2 rounded-full bg-danger inline-block animate-ping" />
          <ShieldAlert className="w-3.5 h-3.5" /> {statusText}
        </span>
        <span className="bg-night/70 px-2 py-0.5 rounded border border-sand/30 font-semibold text-snow">
          ALTITUDE: {altitude}
        </span>
      </div>
    </div>
  );
};
