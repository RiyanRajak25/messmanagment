import React from 'react';
import { PackageCheck, ShieldCheck, Database, Layers } from 'lucide-react';

interface DepotMatrixGraphicProps {
  className?: string;
}

/**
 * DepotMatrixGraphic
 * ==================
 * Authoritative vector logistics depot matrix schematic.
 * Replaces raster AI-generated images with pure vector warehouse silos,
 * RFID pallet racks, atmospheric storage seals, and inventory telemetry.
 */
export const DepotMatrixGraphic: React.FC<DepotMatrixGraphicProps> = ({
  className = '',
}) => {
  return (
    <div className={`relative w-full overflow-hidden rounded-card bg-night border border-sand/40 select-none ${className}`}>
      <svg
        className="w-full h-full min-h-[176px]"
        viewBox="0 0 600 240"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="depotGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#4F5D2F" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#1B2430" stopOpacity="0.8" />
          </linearGradient>
          <linearGradient id="grainFill" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#D9A441" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#D9A441" stopOpacity="0.2" />
          </linearGradient>
        </defs>

        {/* Structural Isometric Grid */}
        <pattern id="siloGrid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#C8B88A" strokeWidth="0.4" strokeOpacity="0.12" />
        </pattern>
        <rect width="600" height="240" fill="url(#siloGrid)" />

        {/* 4 Central Grain & Commodity Silos (Cross-Section) */}
        {/* Silo A: Rice Sona Masoori */}
        <g transform="translate(60, 45)">
          <rect x="0" y="0" width="100" height="135" rx="6" fill="#141C10" stroke="#C8B88A" strokeWidth="1.2" />
          <rect x="6" y="35" width="88" height="94" rx="4" fill="url(#grainFill)" />
          <line x1="6" y1="35" x2="94" y2="35" stroke="#D9A441" strokeWidth="2" strokeDasharray="3 2" />
          <text x="50" y="22" fill="#F5F7F4" fontSize="10" fontWeight="bold" fontFamily="monospace" textAnchor="middle">SILO A-1</text>
          <text x="50" y="85" fill="#1B2430" fontSize="11" fontWeight="bold" fontFamily="sans-serif" textAnchor="middle">RICE</text>
          <text x="50" y="100" fill="#1B2430" fontSize="9" fontWeight="bold" fontFamily="monospace" textAnchor="middle">78% CAP</text>
        </g>

        {/* Silo B: Whole Wheat Flour */}
        <g transform="translate(180, 45)">
          <rect x="0" y="0" width="100" height="135" rx="6" fill="#141C10" stroke="#C8B88A" strokeWidth="1.2" />
          <rect x="6" y="55" width="88" height="74" rx="4" fill="url(#grainFill)" />
          <line x1="6" y1="55" x2="94" y2="55" stroke="#D9A441" strokeWidth="2" strokeDasharray="3 2" />
          <text x="50" y="22" fill="#F5F7F4" fontSize="10" fontWeight="bold" fontFamily="monospace" textAnchor="middle">SILO A-2</text>
          <text x="50" y="88" fill="#1B2430" fontSize="11" fontWeight="bold" fontFamily="sans-serif" textAnchor="middle">ATTA</text>
          <text x="50" y="103" fill="#1B2430" fontSize="9" fontWeight="bold" fontFamily="monospace" textAnchor="middle">62% CAP</text>
        </g>

        {/* Silo C: Dal Arhar & Pulses */}
        <g transform="translate(300, 45)">
          <rect x="0" y="0" width="100" height="135" rx="6" fill="#141C10" stroke="#C8B88A" strokeWidth="1.2" />
          <rect x="6" y="25" width="88" height="104" rx="4" fill="url(#grainFill)" />
          <line x1="6" y1="25" x2="94" y2="25" stroke="#D9A441" strokeWidth="2" strokeDasharray="3 2" />
          <text x="50" y="22" fill="#F5F7F4" fontSize="10" fontWeight="bold" fontFamily="monospace" textAnchor="middle">SILO A-3</text>
          <text x="50" y="80" fill="#1B2430" fontSize="11" fontWeight="bold" fontFamily="sans-serif" textAnchor="middle">PULSES</text>
          <text x="50" y="95" fill="#1B2430" fontSize="9" fontWeight="bold" fontFamily="monospace" textAnchor="middle">86% CAP</text>
        </g>

        {/* Silo D: Mustard Oil & Fats Tank */}
        <g transform="translate(420, 45)">
          <rect x="0" y="0" width="100" height="135" rx="6" fill="#141C10" stroke="#4F86B0" strokeWidth="1.2" />
          <rect x="6" y="70" width="88" height="59" rx="4" fill="#4F86B0" fillOpacity="0.4" />
          <line x1="6" y1="70" x2="94" y2="70" stroke="#4F86B0" strokeWidth="2" strokeDasharray="3 2" />
          <text x="50" y="22" fill="#F5F7F4" fontSize="10" fontWeight="bold" fontFamily="monospace" textAnchor="middle">TANK T-1</text>
          <text x="50" y="95" fill="#F5F7F4" fontSize="11" fontWeight="bold" fontFamily="sans-serif" textAnchor="middle">OIL / GHEE</text>
          <text x="50" y="110" fill="#BCD3E3" fontSize="9" fontWeight="bold" fontFamily="monospace" textAnchor="middle">48% CAP</text>
        </g>

        {/* Climate & Preservation Telemetry Banner */}
        <g fill="#C8B88A" fontSize="9" fontFamily="monospace" opacity="0.8">
          <text x="60" y="200">STORAGE HUMIDITY: 38% RH</text>
          <text x="230" y="200">TEMP: -4.2°C [OPTIMAL]</text>
          <text x="420" y="200">ATMOSPHERE: N2 INERT SEAL</text>
        </g>
      </svg>

      {/* Top Header Label */}
      <div className="absolute top-2 inset-x-3 flex items-center justify-between text-[10px] font-mono text-sand border-b border-sand/20 pb-1.5">
        <span className="flex items-center gap-1.5 text-gold font-bold">
          <Database className="w-3 h-3" /> CENTRAL SUPPLY RESERVE • SILO SCHEMATIC
        </span>
        <span className="text-success flex items-center gap-1 font-semibold">
          <ShieldCheck className="w-3 h-3" /> ROTATION STABLE
        </span>
      </div>

      {/* Bottom Status Strip */}
      <div className="absolute bottom-1 inset-x-3 flex items-center justify-between text-[10px] font-mono text-sand/80">
        <span>DEPOT SECTOR: 01-ALPHA</span>
        <span>FIFO COMPLIANCE: 100%</span>
      </div>
    </div>
  );
};
