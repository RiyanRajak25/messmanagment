# HIMRASAD — Brand Identity & Design System Guide

> **Theme**: Himalayan institutional operations tool. Disciplined, dependable, mountain-high, calm under pressure.
> **Status**: Official Living Brand Standard v1.0. Tokens Studio & WCAG AA/AAA compliant.

---

## 1. Core Brand Philosophy

The **HIMRASAD** (Himalayan Mess & Ration Management System) identity is inspired by high-altitude institutional logistics. The visual tone is structured, legible, quietly proud, and designed for rigorous operations in extreme environments.

- **Palette Inspiration**: Olive fabric, snow-capped peaks, glacier light, high-altitude dusk skies, and mountain prayer-flag color accents.
- **Tone**: Serious operations tool. No cartoon styling, no playful mascots, no bouncy confetti.
- **Insignia Rule**: This is an inspired-by design. It does not replicate or imitate any real official emblem, seal, or organizational name.

---

## 2. Color Tokens & Usage Matrix

| Token | Hex | Intended Use | Contrast Ratio & Measurement |
| :--- | :--- | :--- | :--- |
| `olive` | `#4F5D2F` | Primary navigation, primary buttons, table headers | Snow on Olive: **6.6:1** ✓ (WCAG AAA) |
| `olive-deep` | `#2F3A1E` | Sidebar chrome, footer, heavy headings, dark insignia | Snow on Olive-Deep: **11.2:1** ✓ (WCAG AAA) |
| `pine` | `#141C10` | Primary text on light canvas, deepest dark | Snow on Pine: **14.5:1** ✓ (WCAG AAA) |
| `saffron` | `#E8861A` | Accent / CTA / urgent operations / high-priority action | Night on Saffron: **5.9:1** ✓ (WCAG AA) |
| `gold` | `#D9A441` | Emblem line, highlights, badges, focus rings on dark | Night on Gold: **7.0:1** ✓ (WCAG AAA) |
| `glacier` | `#4F86B0` | Information chips, links, primary chart series | Snow on Glacier: **3.6:1** *(Large text ≥18px only)* |
| `glacier-mist` | `#BCD3E3` | Subtle fills, chart tints, "open" chips | Night on Glacier-Mist: **8.8:1** ✓ (WCAG AAA) |
| `snow` | `#F5F7F4` | Page background canvas, button labels on dark | Pine on Snow: **14.5:1** ✓ (WCAG AAA) |
| `sand` | `#C8B88A` | Dividers, secondary surfaces, tactile borders | Pine on Sand: **7.8:1** ✓ (WCAG AAA) |
| `night` | `#1B2430` | Hero artwork background, dark surfaces, login screen | Snow on Night: **12.3:1** ✓ (WCAG AAA) |
| `danger` | `#B3261E` | Errors, low stock alerts, write-offs, destructive | Snow on Danger: **6.1:1** ✓ (WCAG AAA) |
| `success` | `#2E7D4F` | Healthy stock, confirmations, received consignments | Snow on Success: **4.7:1** ✓ (WCAG AA) |

### Strict Contrast Guardrails
1. **Never place saffron text on snow background** for regular body copy. Saffron must always be paired with dark night text (`#1B2430`) on CTA pills.
2. **Glacier text on snow (3.6:1)** is strictly restricted to large bold headlines (≥ 18.66px bold) or accompanied by dark night text on glacier-mist fills.
3. **Always pair color with an icon and a text label** — never convey status through color alone.

---

## 3. Semantic Mapping

| Operational Status | Token | Semantic Color | Required Icon | Description |
| :--- | :--- | :--- | :--- | :--- |
| **Healthy Stock** | `success` | `#2E7D4F` | `CheckCircle2` | Stock ≥ 60% of sanctioned scale |
| **Adequate Stock** | `glacier-mist` | `#BCD3E3` | `Info` | Stock between 25% and 60% |
| **Expiring Stock** | `gold` | `#D9A441` | `Clock` | Batches expiring within 72 hours |
| **Critical Low Stock** | `danger` | `#B3261E` | `ShieldAlert` | Stock below 20% reorder threshold |
| **Open Purchase Order** | `glacier-mist`| `#BCD3E3` | `FileText` | Issued indent awaiting ASC/CSD dispatch |
| **Partial Consignment** | `gold` | `#D9A441` | `Clock` | Goods partially delivered to depot |
| **Closed PO / Complete**| `olive` | `#4F5D2F` | `CheckCircle2` | Fully reconciled and stock ledger credited |

---

## 4. Typography System

- **Headings**: `Montserrat` (700 Bold / 800 ExtraBold). Slight letter-spacing (`0.02` to `0.06em`) on uppercase labels and wordmarks.
- **Body & UI**: `Inter` (400 Regular / 500 Medium / 600 SemiBold).
- **Tabular Numerals**: All quantities, weights, dates, and currency must use tabular figures (`font-mono tabular-nums`).
- **Scale Hierarchy**:
  - `48px`: Display page heroes
  - `32px`: Main module headings (H1)
  - `24px`: Section & card headings (H2)
  - `20px`: Modal titles & subheaders (H3)
  - `16px`: Base body text & primary controls
  - `14px`: Logistics table data & form inputs
  - `12px`: Eyebrows, status badges & table column headers

---

## 5. Shape, Depth & Geometry

- **Radii**:
  - `8px` (`rounded-control`): Buttons, form inputs, toggles
  - `12px` (`rounded-card`): Cards, containers, modals
  - `999px` (`rounded-badge` / `rounded-pill`): Badges, status chips, avatar counters
- **Borders**:
  - `1px sand` (`#C8B88A`): Standard card borders
  - `2px olive` (`#4F5D2F`): Secondary button outline
  - `3px gold` (`#D9A441`): Signature accent line beneath the top navigation chrome
- **Shadows**:
  - Subtle & Low: `0 1px 2px rgba(20,28,16,.08)` and `0 4px 12px rgba(20,28,16,.06)`
  - **No hard cartoon shadows**; no gradients on UI chrome (gradients reserved solely for hero mountain artwork).
- **Focus Rings**:
  - Dark surfaces: `3px gold` (`#D9A441`)
  - Light surfaces: `3px glacier` (`#4F86B0`)

---

## 6. How to Swap In an Official Logo

If an official military, police, or government emblem is provided in the future, the architecture requires changing **only one component and dropping files into `/public/brand/`**:

### Step 1: Replace SVG Files in `/public/brand/`
Replace the following files with the official vector assets:
- `public/brand/logo-shield.svg`: New official shield / crest
- `public/brand/logo-lockup-light.svg`: Official emblem + typography for light surfaces
- `public/brand/logo-lockup-dark.svg`: Official emblem + typography for dark chrome
- `public/brand/logo-mono-dark.svg`: Single-color dark version for print
- `public/brand/logo-mono-white.svg`: Single-color white version for stamps
- `public/brand/favicon.svg`: Icon for browser tab

### Step 2: Update `<BrandMark />` Component
Edit [BrandMark.tsx](file:///c:/Users/RIYAN/Desktop/Projects/mess%20management/src/components/brand/BrandMark.tsx):
- If the aspect ratio or sizing varies, adjust `SIZE_PRESETS` in `BrandMark.tsx`.
- Because all navigation bars, sidebars, login cards, and footers import `<BrandMark />`, your changes will immediately propagate across all 20+ screens.

### Clear-Space & Minimum Size Constraints
- **Clear-Space Rule**: Keep clear space $X$ (equal to 25% of mark height) completely unobstructed by text or borders.
- **Minimum Dimensions**:
  - Shield Mark: $\ge 24\text{px}$
  - Horizontal Lockup: $\ge 120\text{px}$

---

## 7. Deliverables & Asset Directory

All assets are structured in `/public/brand/`:
```
public/brand/
├── logo-shield.svg           # High-altitude mountain shield emblem
├── logo-lockup-light.svg     # Shield + HIMRASAD wordmark (light)
├── logo-lockup-dark.svg      # Shield + HIMRASAD wordmark (dark)
├── logo-mono-dark.svg        # Single-color dark for field print
├── logo-mono-white.svg       # Single-color white for stencils/patches
├── favicon.svg               # Vector browser favicon
├── favicon-16x16.png         # 16px raster favicon
├── favicon-32x32.png         # 32px raster favicon
├── favicon-180x180.png       # 180px Apple touch icon
├── favicon-512x512.png       # 512px PWA icon
├── hero-himalaya.svg         # Layered mountain ridges, dusk & prayer flags
├── hero-himalaya.png         # Raster master backup
├── login-bg-valley.jpg       # (a) AI Scene: Misty pine valley at dawn
├── empty-storehouse.jpg      # (b) AI Scene: Mountain-hut storehouse with grain
├── barrier-pass.jpg          # (c) AI Scene: High mountain pass barrier check post
├── tokens.json               # Tokens Studio format for Figma import
├── brand.css                 # CSS variables & typography tokens
└── manifest.webmanifest      # PWA manifest (theme-color #4F5D2F)
```

---

## 8. Figma Tokens Studio Import

To import these tokens into Figma:
1. Open the **Tokens Studio for Figma** plugin.
2. Select **Tools > Load from file/URL**.
3. Select `public/brand/tokens.json`.
4. All color tokens, typography scales, border radii, and shadows will map directly to Figma Styles and Variables.
