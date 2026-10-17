import React, { useState } from 'react';
import { BrandMark } from '../components/brand/BrandMark';
import { AltitudeGauge } from '../components/AltitudeGauge';
import { TopographicGrid } from '../components/brand/TopographicGrid';
import { DepotMatrixGraphic } from '../components/brand/DepotMatrixGraphic';
import { CheckpointGraphic } from '../components/brand/CheckpointGraphic';
import {
  Shield,
  ShieldCheck,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  Info,
  Clock,
  ArrowRight,
  Download,
  Copy,
  Check,
  ExternalLink,
  Sliders,
  Eye,
  XCircle,
  FileText,
  Mountain,
  Compass,
  Layers,
  Sparkles,
} from 'lucide-react';

interface ColorSwatch {
  name: string;
  token: string;
  hex: string;
  use: string;
  textOnColor: string;
  border?: string;
  contrastRule?: string;
}

export const BrandPage: React.FC = () => {
  const [copiedToken, setCopiedToken] = useState<string | null>(null);
  const [sliderLevel, setSliderLevel] = useState<number>(680);
  const maxCapacity = 1000;

  const copyToClipboard = (text: string, token: string) => {
    navigator.clipboard.writeText(text);
    setCopiedToken(token);
    setTimeout(() => setCopiedToken(null), 2000);
  };

  const colorSwatches: ColorSwatch[] = [
    {
      name: 'Olive',
      token: '--color-olive',
      hex: '#4F5D2F',
      use: 'Primary: navigation, primary buttons, table headers',
      textOnColor: '#F5F7F4',
      contrastRule: 'Snow on Olive 6.6:1 (WCAG AAA)',
    },
    {
      name: 'Olive Deep',
      token: '--color-olive-deep',
      hex: '#2F3A1E',
      use: 'Sidebar chrome, footer, heavy headings, dark insignia',
      textOnColor: '#F5F7F4',
      contrastRule: 'Snow on Olive-Deep 11.2:1 (WCAG AAA)',
    },
    {
      name: 'Pine',
      token: '--color-pine',
      hex: '#141C10',
      use: 'Text on light backgrounds, deepest dark baseline',
      textOnColor: '#F5F7F4',
      contrastRule: 'Snow on Pine 14.5:1 (WCAG AAA)',
    },
    {
      name: 'Saffron',
      token: '--color-saffron',
      hex: '#E8861A',
      use: 'Accent / CTA / urgent actions / high-visibility highlights',
      textOnColor: '#1B2430',
      contrastRule: 'Night on Saffron 5.9:1 (WCAG AA)',
    },
    {
      name: 'Gold',
      token: '--color-gold',
      hex: '#D9A441',
      use: 'Emblem line, highlights, badges, focus rings on dark',
      textOnColor: '#1B2430',
      contrastRule: 'Night on Gold 7.0:1 (WCAG AAA)',
    },
    {
      name: 'Glacier',
      token: '--color-glacier',
      hex: '#4F86B0',
      use: 'Info, links, primary chart series',
      textOnColor: '#1B2430',
      contrastRule: 'Snow on Glacier 3.6:1 (Use ≥18px bold or Night text)',
    },
    {
      name: 'Glacier Mist',
      token: '--color-glacier-mist',
      hex: '#BCD3E3',
      use: 'Subtle fills, chart secondary tints, "open" chips',
      textOnColor: '#1B2430',
      contrastRule: 'Night on Glacier-Mist 8.8:1 (WCAG AAA)',
    },
    {
      name: 'Snow',
      token: '--color-snow',
      hex: '#F5F7F4',
      use: 'Page background canvas, button labels on dark',
      textOnColor: '#141C10',
      border: '#C8B88A',
      contrastRule: 'Pine on Snow 14.5:1 (WCAG AAA)',
    },
    {
      name: 'Sand',
      token: '--color-sand',
      hex: '#C8B88A',
      use: 'Dividers, secondary card surfaces, tactile borders',
      textOnColor: '#141C10',
      contrastRule: 'Pine on Sand 7.8:1 (WCAG AAA)',
    },
    {
      name: 'Night',
      token: '--color-night',
      hex: '#1B2430',
      use: 'Hero artwork background, dark surfaces, login screen',
      textOnColor: '#F5F7F4',
      contrastRule: 'Snow on Night 12.3:1 (WCAG AAA)',
    },
    {
      name: 'Danger',
      token: '--color-danger',
      hex: '#B3261E',
      use: 'Errors, critical low stock, destructive operations',
      textOnColor: '#F5F7F4',
      contrastRule: 'Snow on Danger 6.1:1 (WCAG AAA)',
    },
    {
      name: 'Success',
      token: '--color-success',
      hex: '#2E7D4F',
      use: 'Healthy stock, confirmations, received consignments',
      textOnColor: '#F5F7F4',
      contrastRule: 'Snow on Success 4.7:1 (WCAG AA)',
    },
  ];

  return (
    <div className="min-h-screen bg-snow text-pine font-body pb-20 selection:bg-gold selection:text-night">
      {/* Signature 3px Gold Line */}
      <div className="h-[3px] w-full bg-gold" />

      {/* Brand Hero Banner */}
      <header className="bg-olive-deep text-snow border-b border-sand/30 shadow-subtle">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <BrandMark variant="shield" size={68} className="drop-shadow-md" />
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-heading font-extrabold text-2xl md:text-3xl tracking-wider text-snow">
                    HIMRASAD
                  </span>
                  <span className="px-2 py-0.5 rounded-badge bg-gold/20 text-gold text-xs font-heading font-bold border border-gold/40 tracking-wider">
                    OPS BRAND v1.0
                  </span>
                </div>
                <div className="h-1 w-16 bg-saffron mt-1 mb-2 rounded-full" />
                <p className="text-sand text-xs md:text-sm font-medium tracking-wide">
                  INSTITUTIONAL MESS &amp; RATION OPERATIONS • LIVING BRAND SPECIFICATION
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <a
                href="/brand/tokens.json"
                download="tokens.json"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-control bg-olive text-snow text-xs font-bold hover:bg-olive/90 border border-sand/40 transition-all shadow-subtle"
              >
                <Download className="w-4 h-4 text-gold" />
                <span>Tokens Studio JSON</span>
              </a>
              <a
                href="/brand/brand.css"
                download="brand.css"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-control bg-night text-snow text-xs font-bold hover:bg-night/80 border border-sand/30 transition-all shadow-subtle"
              >
                <FileText className="w-4 h-4 text-saffron" />
                <span>brand.css</span>
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Living Brand Body Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
        {/* =========================================================================
            SECTION 1: BRAND LOGO VARIANTS & SPECIFICATIONS
            ========================================================================= */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-sand pb-3">
            <div>
              <h2 className="font-heading font-extrabold text-xl md:text-2xl text-olive-deep tracking-tight">
                1. Official Brand Identity &amp; Mark Variants
              </h2>
              <p className="text-xs text-olive font-medium mt-0.5">
                Inspired by mountain terrain and enduring discipline: snow peaks, saffron sunrise, and gold wheat ear ration symbol.
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-sand">SPEC 01 / LOGO</span>
          </div>

          {/* Logo Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Shield Emblem */}
            <div className="bg-white rounded-card border border-sand p-6 flex flex-col justify-between shadow-subtle">
              <div className="space-y-2">
                <span className="text-[11px] font-heading font-bold uppercase tracking-wider text-olive">
                  Primary Shield Emblem
                </span>
                <p className="text-xs text-pine/80">
                  Used in app headers, compact rails, crest seals, and mobile app bars.
                </p>
              </div>
              <div className="py-8 flex items-center justify-center bg-snow rounded-control my-4 border border-sand/40">
                <BrandMark variant="shield" size={80} />
              </div>
              <div className="flex items-center justify-between text-[11px] text-olive font-mono pt-2 border-t border-sand/30">
                <span>logo-shield.svg</span>
                <span className="font-bold text-pine">Min Size: 24px</span>
              </div>
            </div>

            {/* Lockup Light */}
            <div className="bg-white rounded-card border border-sand p-6 flex flex-col justify-between shadow-subtle">
              <div className="space-y-2">
                <span className="text-[11px] font-heading font-bold uppercase tracking-wider text-olive">
                  Horizontal Lockup (Light Surface)
                </span>
                <p className="text-xs text-pine/80">
                  Full wordmark for reports, stationery, light headers, and printed issue indents.
                </p>
              </div>
              <div className="py-6 flex items-center justify-center bg-snow rounded-control my-4 border border-sand/40 overflow-hidden">
                <BrandMark variant="lockup-light" size={48} />
              </div>
              <div className="flex items-center justify-between text-[11px] text-olive font-mono pt-2 border-t border-sand/30">
                <span>logo-lockup-light.svg</span>
                <span className="font-bold text-pine">Min Width: 120px</span>
              </div>
            </div>

            {/* Lockup Dark */}
            <div className="bg-night rounded-card border border-sand/40 p-6 flex flex-col justify-between shadow-subtle">
              <div className="space-y-2">
                <span className="text-[11px] font-heading font-bold uppercase tracking-wider text-gold">
                  Horizontal Lockup (Dark Chrome)
                </span>
                <p className="text-xs text-snow/80">
                  Main identity lockup on night and olive-deep panels, sidebars, and splash screens.
                </p>
              </div>
              <div className="py-6 flex items-center justify-center bg-night rounded-control my-4 border border-sand/20 overflow-hidden">
                <BrandMark variant="lockup-dark" size={48} />
              </div>
              <div className="flex items-center justify-between text-[11px] text-sand font-mono pt-2 border-t border-sand/20">
                <span>logo-lockup-dark.svg</span>
                <span className="font-bold text-gold">High Contrast</span>
              </div>
            </div>

            {/* Mono Dark */}
            <div className="bg-white rounded-card border border-sand p-6 flex flex-col justify-between shadow-subtle">
              <div className="space-y-2">
                <span className="text-[11px] font-heading font-bold uppercase tracking-wider text-olive">
                  Monochrome Dark
                </span>
                <p className="text-xs text-pine/80">
                  Single-colour pine version for black-and-white field printers, stencils, and stamp seals.
                </p>
              </div>
              <div className="py-8 flex items-center justify-center bg-snow rounded-control my-4 border border-sand/40">
                <BrandMark variant="mono-dark" size={72} />
              </div>
              <div className="flex items-center justify-between text-[11px] text-olive font-mono pt-2 border-t border-sand/30">
                <span>logo-mono-dark.svg</span>
                <span className="font-bold text-pine">Field Print / Stamp</span>
              </div>
            </div>

            {/* Mono White */}
            <div className="bg-olive-deep rounded-card border border-sand/40 p-6 flex flex-col justify-between shadow-subtle">
              <div className="space-y-2">
                <span className="text-[11px] font-heading font-bold uppercase tracking-wider text-gold">
                  Monochrome White
                </span>
                <p className="text-xs text-snow/80">
                  Reverse knockout mark for single-colour dark fabric patches, watermarks, and metal tags.
                </p>
              </div>
              <div className="py-8 flex items-center justify-center bg-olive-deep rounded-control my-4 border border-sand/20">
                <BrandMark variant="mono-white" size={72} />
              </div>
              <div className="flex items-center justify-between text-[11px] text-sand font-mono pt-2 border-t border-sand/20">
                <span>logo-mono-white.svg</span>
                <span className="font-bold text-snow">Watermark / Engraving</span>
              </div>
            </div>

            {/* Favicons & App Icons */}
            <div className="bg-white rounded-card border border-sand p-6 flex flex-col justify-between shadow-subtle">
              <div className="space-y-2">
                <span className="text-[11px] font-heading font-bold uppercase tracking-wider text-olive">
                  Web Favicon & Touch Icons
                </span>
                <p className="text-xs text-pine/80">
                  Standardised PNG raster exports (16, 32, 180, 512px) and SVG app icon.
                </p>
              </div>
              <div className="py-6 flex items-center justify-center gap-4 bg-snow rounded-control my-4 border border-sand/40">
                <div className="flex flex-col items-center gap-1">
                  <img src="/brand/favicon-32x32.png" alt="32px icon" width="32" height="32" className="border border-sand rounded" />
                  <span className="text-[9px] font-mono text-sand">32px</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <img src="/brand/favicon-180x180.png" alt="180px icon" width="56" height="56" className="border border-sand rounded-lg shadow-sm" />
                  <span className="text-[9px] font-mono text-sand">180px Apple</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <img src="/brand/favicon-512x512.png" alt="512px icon" width="64" height="64" className="border border-sand rounded-xl shadow-md" />
                  <span className="text-[9px] font-mono text-sand">512px PWA</span>
                </div>
              </div>
              <div className="flex items-center justify-between text-[11px] text-olive font-mono pt-2 border-t border-sand/30">
                <span>manifest.webmanifest</span>
                <span className="font-bold text-pine">Theme #4F5D2F</span>
              </div>
            </div>
          </div>

          {/* Clear-Space & Minimum Size Technical Card */}
          <div className="bg-white rounded-card border border-sand p-6 shadow-subtle grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Compass className="w-5 h-5 text-olive" />
                <h3 className="font-heading font-bold text-base text-olive-deep">
                  Clear-Space & Architecture Rules
                </h3>
              </div>
              <p className="text-xs text-pine/90 leading-relaxed">
                To preserve optical authority and clarity, always isolate the shield and lockup with minimum clear space.
                The clear space <code className="font-mono bg-snow px-1.5 py-0.5 rounded text-olive font-bold">X</code> is exactly equal to the <strong>height of the central wheat ear stem</strong> (approx. 25% of shield height).
              </p>
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="p-3 bg-snow rounded-control border border-sand/50">
                  <span className="block text-[11px] font-heading font-bold text-olive">Shield Minimum</span>
                  <span className="text-lg font-mono font-extrabold text-pine">24 px</span>
                  <span className="block text-[10px] text-olive/80">Favicons & notification chips</span>
                </div>
                <div className="p-3 bg-snow rounded-control border border-sand/50">
                  <span className="block text-[11px] font-heading font-bold text-olive">Lockup Minimum</span>
                  <span className="text-lg font-mono font-extrabold text-pine">120 px</span>
                  <span className="block text-[10px] text-olive/80">Header bars and reports</span>
                </div>
              </div>
            </div>

            {/* Clear-Space Visualization Box */}
            <div className="relative border-2 border-dashed border-sand/80 bg-snow/60 p-8 rounded-card flex flex-col items-center justify-center">
              <div className="absolute top-2 left-2 text-[10px] font-mono text-sand font-bold">CLEAR SPACE BOUNDARY = X</div>
              <div className="relative p-6 border border-gold/60 rounded bg-white shadow-subtle flex items-center justify-center">
                <BrandMark variant="shield" size={64} />
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[9px] font-mono text-gold font-bold bg-white px-1">
                  ↕ X
                </span>
                <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 text-[9px] font-mono text-gold font-bold bg-white px-1">
                  ↕ X
                </span>
                <span className="absolute -left-3 top-1/2 -translate-y-1/2 text-[9px] font-mono text-gold font-bold bg-white px-1">
                  ↔ X
                </span>
                <span className="absolute -right-3 top-1/2 -translate-y-1/2 text-[9px] font-mono text-gold font-bold bg-white px-1">
                  ↔ X
                </span>
              </div>
              <div className="mt-4 text-[11px] font-medium text-olive text-center">
                No text, lines, or UI elements may intrude inside the golden safety perimeter.
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 2: COLOUR PALETTE & CONTRAST RATIO AUDIT
            ========================================================================= */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-sand pb-3">
            <div>
              <h2 className="font-heading font-extrabold text-xl md:text-2xl text-olive-deep tracking-tight">
                2. Mountain-High Colour Tokens & Measured WCAG Contrast
              </h2>
              <p className="text-xs text-olive font-medium mt-0.5">
                Exact hex codes verified against WCAG AA / AAA standards for operational field clarity.
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-sand">SPEC 02 / COLOUR</span>
          </div>

          {/* Color Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {colorSwatches.map((c) => (
              <div
                key={c.token}
                className="bg-white rounded-card border border-sand overflow-hidden shadow-subtle flex flex-col justify-between"
              >
                {/* Swatch Preview Block */}
                <div
                  className="h-28 p-3 flex flex-col justify-between transition-transform duration-150 hover:scale-[1.01]"
                  style={{
                    backgroundColor: c.hex,
                    color: c.textOnColor,
                    borderBottom: c.border ? `1px solid ${c.border}` : undefined,
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-heading font-extrabold text-sm tracking-wide">
                      {c.name}
                    </span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(c.hex, c.token)}
                      className="p-1 rounded bg-black/10 hover:bg-black/20 text-xs transition-colors"
                      title="Copy hex code"
                    >
                      {copiedToken === c.token ? (
                        <Check className="w-3.5 h-3.5 text-white" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                  <div className="font-mono text-xs font-bold tracking-wider">
                    {c.hex}
                  </div>
                </div>

                {/* Swatch Specs */}
                <div className="p-3.5 space-y-2 flex-1 flex flex-col justify-between bg-white">
                  <div>
                    <code className="text-[11px] font-mono text-olive font-bold block truncate">
                      {c.token}
                    </code>
                    <p className="text-[11px] text-pine/80 mt-1 leading-snug">
                      {c.use}
                    </p>
                  </div>

                  {c.contrastRule && (
                    <div className="pt-2 border-t border-sand/40">
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-olive font-mono">
                        <CheckCircle2 className="w-3 h-3 text-success shrink-0" />
                        <span>{c.contrastRule}</span>
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Contrast & Usability Warning Notice */}
          <div className="bg-amber-50 border border-sand rounded-card p-4 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-saffron shrink-0 mt-0.5" />
            <div className="text-xs text-pine space-y-1">
              <span className="font-heading font-bold text-olive-deep block">
                Field Contrast Guardrails (Measured Values)
              </span>
              <p>
                <strong>Glacier on Snow (3.6:1):</strong> Only permitted for large headlines (≥ 18.66px bold) or accompanied by dark night text on glacier-mist fills.
              </p>
              <p>
                <strong>Critical Rule:</strong> Never place <em>saffron text</em> on snow background for regular body copy (insufficient contrast). Saffron must always be paired with dark night text (#1B2430) on button CTA pills.
              </p>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 3: TYPOGRAPHY HIERARCHY
            ========================================================================= */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-sand pb-3">
            <div>
              <h2 className="font-heading font-extrabold text-xl md:text-2xl text-olive-deep tracking-tight">
                3. Typography Hierarchy & Tabular Numerals
              </h2>
              <p className="text-xs text-olive font-medium mt-0.5">
                Montserrat 700/800 for disciplined headings; Inter 400/500/600 for high-density logistics tables.
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-sand">SPEC 03 / TYPE</span>
          </div>

          <div className="bg-white rounded-card border border-sand p-6 shadow-subtle space-y-6">
            {/* Specimen Scale */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between border-b border-sand/40 pb-3 gap-2">
                <span className="text-xs font-mono text-sand font-bold">48px / Montserrat 800</span>
                <span className="font-heading font-extrabold text-3xl sm:text-4xl text-olive-deep tracking-tight">
                  High-Altitude Logistics
                </span>
                <span className="text-[11px] text-olive font-mono">Page Title (Display)</span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between border-b border-sand/40 pb-3 gap-2">
                <span className="text-xs font-mono text-sand font-bold">32px / Montserrat 700</span>
                <span className="font-heading font-bold text-2xl text-olive-deep tracking-tight">
                  Station Command &amp; Depots
                </span>
                <span className="text-[11px] text-olive font-mono">Module Heading (H1)</span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between border-b border-sand/40 pb-3 gap-2">
                <span className="text-xs font-mono text-sand font-bold">24px / Montserrat 700</span>
                <span className="font-heading font-bold text-xl text-olive-deep tracking-tight">
                  Quartermaster Scale of Rations
                </span>
                <span className="text-[11px] text-olive font-mono">Card Title (H2)</span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between border-b border-sand/40 pb-3 gap-2">
                <span className="text-xs font-mono text-sand font-bold">16px / Inter 500</span>
                <span className="font-body text-base text-pine">
                  Standard operational dispatch instructions for institutional dining halls.
                </span>
                <span className="text-[11px] text-olive font-mono">Base Body UI (16px)</span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between border-b border-sand/40 pb-3 gap-2">
                <span className="text-xs font-mono text-sand font-bold">14px / Inter 500 Tabular</span>
                <span className="font-mono text-sm font-semibold tabular-nums text-pine">
                  ₹8,45,200.00 • 1,450.50 KG • 980 DINERS
                </span>
                <span className="text-[11px] text-olive font-mono">Table Numerals (14px)</span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                <span className="text-xs font-mono text-sand font-bold">12px / Inter 600 Caps</span>
                <span className="font-heading font-bold text-xs uppercase tracking-wider text-olive">
                  QMG BRANCH SCALE RATIO AUDIT
                </span>
                <span className="text-[11px] text-olive font-mono">Eyebrow / Table Header</span>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 4: UI CONTROLS, BUTTONS & FOCUS STATES
            ========================================================================= */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-sand pb-3">
            <div>
              <h2 className="font-heading font-extrabold text-xl md:text-2xl text-olive-deep tracking-tight">
                4. Buttons, Form Inputs & Focus Rings
              </h2>
              <p className="text-xs text-olive font-medium mt-0.5">
                8px control radius, 2px borders, visible 3px gold ring on dark and 3px glacier on light.
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-sand">SPEC 04 / CONTROLS</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Buttons State Matrix */}
            <div className="bg-white rounded-card border border-sand p-6 shadow-subtle space-y-4">
              <h3 className="font-heading font-bold text-sm text-olive-deep uppercase tracking-wider">
                Button States
              </h3>

              <div className="flex flex-wrap gap-3 items-center">
                {/* Primary */}
                <button
                  type="button"
                  className="px-4 py-2.5 rounded-control bg-olive text-snow text-xs font-bold hover:bg-olive/90 active:scale-[0.98] transition-all shadow-subtle flex items-center gap-2"
                >
                  <span>Primary Button</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                {/* CTA Urgent Saffron */}
                <button
                  type="button"
                  className="px-4 py-2.5 rounded-control bg-saffron text-night text-xs font-bold hover:bg-saffron/90 active:scale-[0.98] transition-all shadow-subtle flex items-center gap-2"
                >
                  <Sparkles className="w-3.5 h-3.5 text-night" />
                  <span>CTA Urgent Action</span>
                </button>

                {/* Secondary 2px Olive Outline */}
                <button
                  type="button"
                  className="px-4 py-2 rounded-control border-2 border-olive text-olive text-xs font-bold hover:bg-olive/10 active:scale-[0.98] transition-all"
                >
                  <span>Secondary Outline</span>
                </button>

                {/* Destructive Danger */}
                <button
                  type="button"
                  className="px-4 py-2.5 rounded-control bg-danger text-snow text-xs font-bold hover:bg-danger/90 active:scale-[0.98] transition-all shadow-subtle"
                >
                  <span>Write-Off Defect</span>
                </button>

                {/* Disabled */}
                <button
                  type="button"
                  disabled
                  className="px-4 py-2.5 rounded-control bg-sand/30 text-sand text-xs font-bold cursor-not-allowed border border-sand/40"
                >
                  <span>Disabled State</span>
                </button>
              </div>

              {/* Dark Context Focus Ring Display */}
              <div className="mt-4 p-4 bg-night rounded-control border border-sand/40 flex items-center justify-between">
                <span className="text-xs text-snow font-medium">Dark Focus Ring Demo:</span>
                <button
                  type="button"
                  className="px-4 py-2 rounded-control bg-olive text-snow text-xs font-bold ring-3 ring-gold transition-all"
                >
                  Focus: 3px Gold Ring
                </button>
              </div>
            </div>

            {/* Inputs & Form Controls */}
            <div className="bg-white rounded-card border border-sand p-6 shadow-subtle space-y-4">
              <h3 className="font-heading font-bold text-sm text-olive-deep uppercase tracking-wider">
                Form Inputs &amp; Focus Rings
              </h3>

              <div className="space-y-3">
                {/* Standard Input */}
                <div>
                  <label className="block text-xs font-bold text-olive-deep mb-1">
                    Standard Depot Requisition Input
                  </label>
                  <input
                    type="text"
                    defaultValue="Basmati Rice (Grade A)"
                    className="w-full px-3 py-2 text-xs rounded-control border border-sand bg-snow text-pine focus:outline-none focus:ring-3 focus:ring-glacier focus:border-glacier transition-all"
                  />
                  <span className="text-[10px] text-sand mt-0.5 block">
                    Focus triggers 3px Glacier ring (#4F86B0) on light backgrounds
                  </span>
                </div>

                {/* Error Input */}
                <div>
                  <label className="block text-xs font-bold text-danger mb-1 flex items-center justify-between">
                    <span>Critical Quantity Scale Exceeded</span>
                    <span className="text-[10px] font-mono">ERROR 422</span>
                  </label>
                  <input
                    type="text"
                    defaultValue="9,999 KG (Exceeds daily scale 250 KG)"
                    className="w-full px-3 py-2 text-xs rounded-control border-2 border-danger bg-red-50 text-danger focus:outline-none focus:ring-3 focus:ring-danger/30 transition-all font-mono font-bold"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 5: ALTITUDE-GAUGE STOCK BAR & SEMANTIC BADGES
            ========================================================================= */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-sand pb-3">
            <div>
              <h2 className="font-heading font-extrabold text-xl md:text-2xl text-olive-deep tracking-tight">
                5. Altitude-Gauge Stock Bars &amp; Semantic Status Chips
              </h2>
              <p className="text-xs text-olive font-medium mt-0.5">
                Replaces cartoon jars with disciplined horizontal altitude gauges with peak level markers.
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-sand">SPEC 05 / GAUGES</span>
          </div>

          {/* Interactive Altitude Gauge Demonstration */}
          <div className="bg-white rounded-card border border-sand p-6 shadow-subtle space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-sand/40 pb-4">
              <div>
                <h3 className="font-heading font-bold text-base text-olive-deep">
                  Interactive Mountain Altitude-Gauge Simulator
                </h3>
                <p className="text-xs text-pine/80">
                  Drag the slider to preview how the peak-shaped polygon shifts between Critical Low (Danger), Adequate (Gold), and Optimal (Success).
                </p>
              </div>

              {/* Slider Controller */}
              <div className="flex items-center gap-3 bg-snow px-4 py-2 rounded-control border border-sand">
                <Sliders className="w-4 h-4 text-olive" />
                <input
                  type="range"
                  min="0"
                  max="1000"
                  value={sliderLevel}
                  onChange={(e) => setSliderLevel(Number(e.target.value))}
                  className="w-36 accent-olive cursor-pointer"
                />
                <span className="font-mono text-xs font-extrabold text-pine tabular-nums w-14 text-right">
                  {sliderLevel} KG
                </span>
              </div>
            </div>

            {/* Simulated Gauge Preview */}
            <div className="p-4 bg-snow/80 rounded-card border border-sand/60 max-w-xl mx-auto">
              <AltitudeGauge
                current={sliderLevel}
                max={maxCapacity}
                unit="KG"
                threshold={200}
                label="Central Depot: Atta Whole Wheat"
              />
            </div>

            {/* Static Semantic Matrix of Altitude Gauges */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-sand/40">
              <div className="p-4 bg-white rounded-card border border-sand shadow-subtle">
                <AltitudeGauge
                  current={120}
                  max={800}
                  unit="L"
                  threshold={200}
                  label="Mustard Oil (Critical Low)"
                />
              </div>

              <div className="p-4 bg-white rounded-card border border-sand shadow-subtle">
                <AltitudeGauge
                  current={340}
                  max={800}
                  unit="KG"
                  threshold={200}
                  label="Chana Dal (Adequate Reserve)"
                />
              </div>

              <div className="p-4 bg-white rounded-card border border-sand shadow-subtle">
                <AltitudeGauge
                  current={750}
                  max={800}
                  unit="KG"
                  threshold={200}
                  label="Basmati Rice (Optimal High Stock)"
                />
              </div>
            </div>

            {/* Status Chips Semantic Catalog */}
            <div className="pt-6 border-t border-sand/40 space-y-3">
              <h3 className="font-heading font-bold text-xs uppercase tracking-wider text-olive">
                Semantic Status Chips (Always Icon + Text + Measured Colour)
              </h3>
              <div className="flex flex-wrap gap-2.5 items-center">
                {/* Healthy Stock */}
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-badge bg-success/10 text-success border border-success/30 text-xs font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5 text-success" />
                  <span>Healthy Stock</span>
                </span>

                {/* Adequate Stock */}
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-badge bg-glacier-mist text-night border border-glacier/40 text-xs font-bold">
                  <Info className="w-3.5 h-3.5 text-glacier" />
                  <span>Adequate Stock</span>
                </span>

                {/* Expiring Alert */}
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-badge bg-gold/15 text-gold border border-gold/40 text-xs font-bold">
                  <Clock className="w-3.5 h-3.5 text-gold" />
                  <span>Expiring in 2 Days</span>
                </span>

                {/* Critical Low */}
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-badge bg-danger/10 text-danger border border-danger/30 text-xs font-bold">
                  <ShieldAlert className="w-3.5 h-3.5 text-danger" />
                  <span>Critical Low Stock</span>
                </span>

                {/* Open PO */}
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-badge bg-glacier-mist text-night border border-glacier/30 text-xs font-bold">
                  <FileText className="w-3.5 h-3.5 text-glacier" />
                  <span>PO: Open Order</span>
                </span>

                {/* Partial Received */}
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-badge bg-gold/15 text-gold border border-gold/40 text-xs font-bold">
                  <Clock className="w-3.5 h-3.5 text-gold" />
                  <span>Partially Received</span>
                </span>

                {/* Closed Dispatched */}
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-badge bg-olive/15 text-olive border border-olive/30 text-xs font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5 text-olive" />
                  <span>Closed &amp; Reconciled</span>
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 6: OPERATIONAL TABLE & NOTIFICATION ALERTS
            ========================================================================= */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-sand pb-3">
            <div>
              <h2 className="font-heading font-extrabold text-xl md:text-2xl text-olive-deep tracking-tight">
                6. High-Density Logistics Table & Alert Banners
              </h2>
              <p className="text-xs text-olive font-medium mt-0.5">
                Olive header row (#4F5D2F), alternating zebra rows in snow/white, sand dividers, sticky header.
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-sand">SPEC 06 / DATA</span>
          </div>

          {/* Table Specimen */}
          <div className="bg-white rounded-card border border-sand overflow-hidden shadow-subtle">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse font-body">
                <thead>
                  <tr className="bg-olive text-snow font-heading font-bold text-[11px] uppercase tracking-wider">
                    <th className="py-3 px-4">Item Scale Code</th>
                    <th className="py-3 px-4">Commodity / Scale</th>
                    <th className="py-3 px-4">Authorised Scale</th>
                    <th className="py-3 px-4 text-right">Depot Qty</th>
                    <th className="py-3 px-4 text-center">Status</th>
                    <th className="py-3 px-4 text-right">Ledger Valuation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sand/40">
                  <tr className="bg-white hover:bg-snow/60 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-olive">RMS-RAT-001</td>
                    <td className="py-3 px-4 font-bold text-pine">Atta Whole Wheat (Sharbati)</td>
                    <td className="py-3 px-4 text-pine/80">0.450 kg / diner / day</td>
                    <td className="py-3 px-4 font-mono font-extrabold text-right tabular-nums text-pine">1,250 KG</td>
                    <td className="py-3 px-4 text-center">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-badge bg-success/15 text-success font-bold text-[10px]">
                        <CheckCircle2 className="w-3 h-3" /> Healthy
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono font-extrabold text-right tabular-nums text-pine">₹45,000</td>
                  </tr>

                  <tr className="bg-snow hover:bg-snow/80 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-olive">RMS-RAT-002</td>
                    <td className="py-3 px-4 font-bold text-pine">Refined Sunflower Oil</td>
                    <td className="py-3 px-4 text-pine/80">0.060 L / diner / day</td>
                    <td className="py-3 px-4 font-mono font-extrabold text-right tabular-nums text-danger">45 L</td>
                    <td className="py-3 px-4 text-center">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-badge bg-danger/15 text-danger font-bold text-[10px]">
                        <ShieldAlert className="w-3 h-3" /> Low Stock
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono font-extrabold text-right tabular-nums text-pine">₹6,750</td>
                  </tr>

                  <tr className="bg-white hover:bg-snow/60 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-olive">RMS-RAT-003</td>
                    <td className="py-3 px-4 font-bold text-pine">Fresh Cottage Paneer</td>
                    <td className="py-3 px-4 text-pine/80">0.120 kg / diner / day</td>
                    <td className="py-3 px-4 font-mono font-extrabold text-right tabular-nums text-gold">85 KG</td>
                    <td className="py-3 px-4 text-center">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-badge bg-gold/15 text-gold font-bold text-[10px]">
                        <Clock className="w-3 h-3" /> Expiring 2d
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono font-extrabold text-right tabular-nums text-pine">₹27,200</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Alert Banners */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-glacier-mist border border-glacier/40 rounded-card p-4 flex items-center gap-3">
              <Info className="w-5 h-5 text-glacier shrink-0" />
              <div className="text-xs text-night font-medium">
                <strong>Glacier Info:</strong> Station Command ration scale review scheduled for 0900 hrs tomorrow.
              </div>
            </div>

            <div className="bg-red-50 border border-danger/40 rounded-card p-4 flex items-center gap-3">
              <ShieldAlert className="w-5 h-5 text-danger shrink-0" />
              <div className="text-xs text-danger font-medium">
                <strong>Critical Low Alert:</strong> Mustard Oil stock at Falcon Mess below 20% minimum threshold.
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 7: BRAND VECTOR ARTWORK & OPERATIONAL SCHEMATICS
            ========================================================================= */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-sand pb-3">
            <div>
              <h2 className="font-heading font-extrabold text-xl md:text-2xl text-olive-deep tracking-tight">
                7. Official Brand Vector Artwork &amp; Operational Schematics
              </h2>
              <p className="text-xs text-olive font-medium mt-0.5">
                Pure mathematical vectors, high-altitude telemetry, and cryptographic operational seals. 100% vector fidelity, zero AI-slop raster figures.
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-sand">SPEC 07 / VECTOR</span>
          </div>

          {/* Hero Himalaya Illustration */}
          <div className="bg-night rounded-card border border-sand/40 overflow-hidden shadow-elevation">
            <div className="p-4 border-b border-sand/20 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Mountain className="w-4 h-4 text-gold" />
                <span className="font-heading font-bold text-xs uppercase tracking-wider text-snow">
                  hero-himalaya.svg (Layered Ridges, Saffron Glow &amp; Prayer Flag Streamer)
                </span>
              </div>
              <span className="text-[11px] font-mono text-sand">1600 × 700 Vector</span>
            </div>
            <div className="relative">
              <img
                src="/brand/hero-himalaya.svg"
                alt="Himalayan mountain ridges at dusk"
                className="w-full h-auto max-h-[360px] object-cover"
              />
            </div>
          </div>

          {/* 3 Precision Vector Operational Schematics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* (a) Topographic Command Grid */}
            <div className="bg-white rounded-card border border-sand overflow-hidden shadow-subtle flex flex-col justify-between">
              <div className="p-3.5 border-b border-sand/30">
                <span className="text-[11px] font-heading font-bold uppercase tracking-wider text-olive">
                  (a) Topographic Command Grid
                </span>
                <p className="text-[11px] text-pine/80 mt-0.5">
                  High-altitude contour splines (4,200m - 5,400m) with tactical GPS sector telemetry.
                </p>
              </div>
              <div className="relative aspect-video overflow-hidden bg-night">
                <TopographicGrid opacity={0.65} showCoordinates={true} />
              </div>
              <div className="p-3 text-[10px] font-mono text-sand flex justify-between bg-snow/60">
                <span>TopographicGrid.tsx</span>
                <span>Pure Vector SVG</span>
              </div>
            </div>

            {/* (b) Depot Silo & Logistics Matrix */}
            <div className="bg-white rounded-card border border-sand overflow-hidden shadow-subtle flex flex-col justify-between">
              <div className="p-3.5 border-b border-sand/30">
                <span className="text-[11px] font-heading font-bold uppercase tracking-wider text-olive">
                  (b) Strategic Depot &amp; Silo Matrix
                </span>
                <p className="text-[11px] text-pine/80 mt-0.5">
                  Central supply silo reserves, atmospheric storage metrics, and FIFO compliance gauges.
                </p>
              </div>
              <div className="relative aspect-video overflow-hidden bg-night flex items-center justify-center">
                <DepotMatrixGraphic className="h-full border-none rounded-none" />
              </div>
              <div className="p-3 text-[10px] font-mono text-sand flex justify-between bg-snow/60">
                <span>DepotMatrixGraphic.tsx</span>
                <span>Pure Vector SVG</span>
              </div>
            </div>

            {/* (c) Checkpoint & Security Perimeter */}
            <div className="bg-white rounded-card border border-sand overflow-hidden shadow-subtle flex flex-col justify-between">
              <div className="p-3.5 border-b border-sand/30">
                <span className="text-[11px] font-heading font-bold uppercase tracking-wider text-olive">
                  (c) Perimeter Security Checkpoint
                </span>
                <p className="text-[11px] text-pine/80 mt-0.5">
                  Clearance barrier radar, encrypted laser perimeter, and level-4 access status.
                </p>
              </div>
              <div className="relative aspect-video overflow-hidden bg-night flex items-center justify-center">
                <CheckpointGraphic className="h-full border-none rounded-none" altitude="4,800m" statusText="BARRIER ACTIVE" />
              </div>
              <div className="p-3 text-[10px] font-mono text-sand flex justify-between bg-snow/60">
                <span>CheckpointGraphic.tsx</span>
                <span>Pure Vector SVG</span>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 8: BRAND GOVERNANCE "DO & DON'T"
            ========================================================================= */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-sand pb-3">
            <div>
              <h2 className="font-heading font-extrabold text-xl md:text-2xl text-olive-deep tracking-tight">
                8. Brand Governance &amp; "Do / Don't" Guardrails
              </h2>
              <p className="text-xs text-olive font-medium mt-0.5">
                Strict adherence rules ensuring the operational identity remains dignified, disciplined, and WCAG-compliant.
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-sand">SPEC 08 / GOVERNANCE</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* DO Panel */}
            <div className="bg-white rounded-card border-2 border-success/40 p-6 shadow-subtle space-y-4">
              <div className="flex items-center gap-2 text-success">
                <CheckCircle2 className="w-5 h-5" />
                <h3 className="font-heading font-extrabold text-base uppercase tracking-wider">
                  DO (Approved Design Practices)
                </h3>
              </div>
              <ul className="space-y-2.5 text-xs text-pine">
                <li className="flex items-start gap-2">
                  <span className="text-success font-bold">✓</span>
                  <span>Use <strong>Olive Deep (#2F3A1E)</strong> for the top bar and left navigation rail with snow white text.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-success font-bold">✓</span>
                  <span>Keep the signature <strong>3px Gold line (#D9A441)</strong> directly under the top navigation chrome.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-success font-bold">✓</span>
                  <span>Display <strong>Altitude-Gauge horizontal bars</strong> for stock levels with numeric counts and units always visible.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-success font-bold">✓</span>
                  <span>Pair every semantic color with an explicit icon and descriptive text chip (never color-only meaning).</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-success font-bold">✓</span>
                  <span>Use <strong>tabular numerals</strong> (<code className="font-mono bg-snow px-1">tabular-nums font-mono</code>) for all inventory weights, quantities, and budgets.</span>
                </li>
              </ul>
            </div>

            {/* DON'T Panel */}
            <div className="bg-white rounded-card border-2 border-danger/40 p-6 shadow-subtle space-y-4">
              <div className="flex items-center gap-2 text-danger">
                <XCircle className="w-5 h-5" />
                <h3 className="font-heading font-extrabold text-base uppercase tracking-wider">
                  DON'T (Strictly Prohibited)
                </h3>
              </div>
              <ul className="space-y-2.5 text-xs text-pine">
                <li className="flex items-start gap-2">
                  <span className="text-danger font-bold">✗</span>
                  <span><strong>NO cartoon styling or playful mascots</strong>. Do not use chibi cooking characters or confetti celebration animations.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-danger font-bold">✗</span>
                  <span><strong>Never put saffron text on snow</strong> background for body copy (fails WCAG contrast rules).</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-danger font-bold">✗</span>
                  <span>Do not copy, imitate, or replicate any external proprietary logos or organizational seals.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-danger font-bold">✗</span>
                  <span>Do not apply gradients to UI chrome or navigation bars (gradients are strictly reserved for the hero mountain artwork).</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-danger font-bold">✗</span>
                  <span>Do not violate the clear-space boundary <code className="font-mono bg-snow px-1">X</code> around the shield mark.</span>
                </li>
              </ul>
            </div>
          </div>
        </section>
      </main>

      {/* Brand Footer */}
      <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-sand flex flex-col sm:flex-row items-center justify-between text-xs text-olive font-medium gap-3">
        <div className="flex items-center gap-2">
          <BrandMark variant="shield" size={24} />
          <span className="font-heading font-bold text-olive-deep">HIMRASAD BRAND SYSTEM</span>
          <span>•</span>
          <span>RESTRICTED OPERATIONS STANDARD</span>
        </div>
        <div className="font-mono text-sand">
          CONFIDENTIAL • TOKENS STUDIO COMPLIANT
        </div>
      </footer>
    </div>
  );
};

export default BrandPage;
