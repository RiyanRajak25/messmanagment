import React from 'react';

interface TopographicGridProps {
  className?: string;
  opacity?: number;
  showCoordinates?: boolean;
}

/**
 * TopographicGrid
 * ===============
 * Pure mathematical vector situational command schematic.
 * Replaces raster AI-generated textures with high-precision topographic contour vectors,
 * elevation gradients (4,200m - 5,400m), and tactical GPS telemetry.
 */
export const TopographicGrid: React.FC<TopographicGridProps> = ({
  className = '',
  opacity = 0.25,
  showCoordinates = true,
}) => {
  return (
    <div
      className={`absolute inset-0 pointer-events-none overflow-hidden select-none ${className}`}
      style={{ opacity }}
      aria-hidden="true"
    >
      <svg
        className="w-full h-full object-cover"
        viewBox="0 0 1200 900"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="gridGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#D9A441" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#4F86B0" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#C8B88A" stopOpacity="0.2" />
          </linearGradient>
          <radialGradient id="radarScan" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#D9A441" stopOpacity="0.25" />
            <stop offset="70%" stopColor="#D9A441" stopOpacity="0.05" />
            <stop offset="100%" stopColor="#D9A441" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Tactical Crosshatch Grid */}
        <pattern id="tacGrid" width="60" height="60" patternUnits="userSpaceOnUse">
          <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#C8B88A" strokeWidth="0.5" strokeOpacity="0.15" />
          <circle cx="0" cy="0" r="1.5" fill="#D9A441" fillOpacity="0.3" />
        </pattern>
        <rect width="1200" height="900" fill="url(#tacGrid)" />

        {/* Concentric Range Rings */}
        <g stroke="#C8B88A" strokeOpacity="0.2" strokeWidth="1" strokeDasharray="3 4">
          <circle cx="600" cy="450" r="160" />
          <circle cx="600" cy="450" r="280" />
          <circle cx="600" cy="450" r="400" />
          <circle cx="600" cy="450" r="520" />
        </g>
        <circle cx="600" cy="450" r="320" fill="url(#radarScan)" />

        {/* Cardinal Axes */}
        <line x1="600" y1="50" x2="600" y2="850" stroke="#C8B88A" strokeOpacity="0.25" strokeWidth="1" strokeDasharray="6 6" />
        <line x1="100" y1="450" x2="1100" y2="450" stroke="#C8B88A" strokeOpacity="0.25" strokeWidth="1" strokeDasharray="6 6" />

        {/* Elevation Contour Lines (Mathematical Smooth Splines) */}
        {/* Layer 1 - Ridge 5,200m */}
        <path
          d="M -50 220 Q 200 180 400 240 T 800 210 T 1250 260"
          fill="none"
          stroke="#D9A441"
          strokeWidth="1.2"
          strokeOpacity="0.4"
        />
        {/* Layer 2 - Ridge 4,800m */}
        <path
          d="M -50 320 Q 180 260 420 340 T 780 300 T 1250 380"
          fill="none"
          stroke="#C8B88A"
          strokeWidth="1"
          strokeOpacity="0.35"
        />
        {/* Layer 3 - Ridge 4,400m Pass */}
        <path
          d="M -50 440 Q 240 380 460 470 T 850 410 T 1250 510"
          fill="none"
          stroke="#4F86B0"
          strokeWidth="1.2"
          strokeOpacity="0.35"
        />
        {/* Layer 4 - Base Contour 3,900m */}
        <path
          d="M -50 580 Q 280 500 520 610 T 900 540 T 1250 640"
          fill="none"
          stroke="#C8B88A"
          strokeWidth="0.8"
          strokeOpacity="0.25"
        />
        {/* Layer 5 - High Valley */}
        <path
          d="M -50 720 Q 320 640 580 740 T 980 680 T 1250 780"
          fill="none"
          stroke="#D9A441"
          strokeWidth="0.9"
          strokeOpacity="0.3"
        />

        {/* Topographic Elevation Index Marks */}
        <g fill="#D9A441" opacity="0.6" fontSize="9" fontFamily="monospace" fontWeight="600">
          <text x="75" y="215">ELEV: 5,240m</text>
          <text x="75" y="315">ELEV: 4,880m</text>
          <text x="75" y="435">ELEV: 4,420m [PASS WAYPOINT]</text>
          <text x="75" y="575">ELEV: 3,960m</text>
          <text x="75" y="715">ELEV: 3,620m [BASE DEPOT]</text>
        </g>

        {/* Triangulation Survey Nodes */}
        <g fill="#D9A441" stroke="#1B2430" strokeWidth="1.5">
          <polygon points="400,240 406,252 394,252" />
          <polygon points="780,300 786,312 774,312" />
          <polygon points="850,410 856,422 844,422" />
          <polygon points="520,610 526,622 514,622" />
        </g>

        {/* GPS Telemetry & Operational Sector Marks */}
        {showCoordinates && (
          <g fill="#C8B88A" opacity="0.5" fontSize="10" fontFamily="monospace">
            <text x="40" y="50">HIMRASAD // SECTOR GRID 01-H</text>
            <text x="40" y="70">LAT: 34° 09&apos; 14&quot; N</text>
            <text x="40" y="88">LON: 77° 34&apos; 32&quot; E</text>
            <text x="960" y="50" textAnchor="end">SYSTEM: RATION CONTROL</text>
            <text x="960" y="70" textAnchor="end">STATUS: CONTINUOUS RECON</text>
            <text x="960" y="88" textAnchor="end">LEDGER: CRYPTO-VERIFIED</text>
          </g>
        )}
      </svg>
    </div>
  );
};
