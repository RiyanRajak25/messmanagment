---
name: ChibiKitchen / MessMunch
colors:
  surface: '#fbf9f4'
  surface-dim: '#dbdad5'
  surface-bright: '#fbf9f4'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f5f3ee'
  surface-container: '#efeee9'
  surface-container-high: '#eae8e3'
  surface-container-highest: '#e4e2de'
  on-surface: '#1b1c19'
  on-surface-variant: '#4f4634'
  inverse-surface: '#30312e'
  inverse-on-surface: '#f2f1ec'
  outline: '#817661'
  outline-variant: '#d2c5ad'
  surface-tint: '#785a00'
  primary: '#785a00'
  on-primary: '#ffffff'
  primary-container: '#ffc83b'
  on-primary-container: '#715400'
  inverse-primary: '#f5bf31'
  secondary: '#b52603'
  on-secondary: '#ffffff'
  secondary-container: '#fd5835'
  on-secondary-container: '#570c00'
  tertiary: '#006d34'
  on-tertiary: '#ffffff'
  tertiary-container: '#7ae696'
  on-tertiary-container: '#006731'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdf9b'
  primary-fixed-dim: '#f5bf31'
  on-primary-fixed: '#251a00'
  on-primary-fixed-variant: '#5b4300'
  secondary-fixed: '#ffdad2'
  secondary-fixed-dim: '#ffb4a3'
  on-secondary-fixed: '#3d0600'
  on-secondary-fixed-variant: '#8c1900'
  tertiary-fixed: '#8df9a7'
  tertiary-fixed-dim: '#71dc8d'
  on-tertiary-fixed: '#00210b'
  on-tertiary-fixed-variant: '#005226'
  background: '#fbf9f4'
  on-background: '#1b1c19'
  surface-variant: '#e4e2de'
typography:
  display-lg:
    fontFamily: Epilogue
    fontSize: 48px
    fontWeight: '800'
    lineHeight: 56px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Epilogue
    fontSize: 34px
    fontWeight: '800'
    lineHeight: 42px
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: Epilogue
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Epilogue
    fontSize: 26px
    fontWeight: '700'
    lineHeight: 34px
    letterSpacing: 0em
  headline-md:
    fontFamily: Epilogue
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
  headline-sm:
    fontFamily: Epilogue
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  title-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '700'
    lineHeight: 26px
  title-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '700'
    lineHeight: 24px
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '500'
    lineHeight: 28px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 15px
    fontWeight: '500'
    lineHeight: 22px
  body-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 18px
  label-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '700'
    lineHeight: 20px
    letterSpacing: 0.02em
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.04em
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 11px
    fontWeight: '700'
    lineHeight: 14px
    letterSpacing: 0.05em
rounded:
  sm: 0.5rem
  DEFAULT: 1rem
  md: 1.5rem
  lg: 2rem
  xl: 3rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-tablet: 1.25rem
  gutter-desktop: 1.5rem
  margin: 1rem
  margin-tablet: 2rem
  margin-desktop: 3rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

This design system blends cozy anime kitchen aesthetics with tactile, storybook-inspired physical interactions. It addresses culinary planning, inventory tracking, and communal mess hall ration management with warmth, friendliness, and clarity. The emotional atmosphere centers on comfort, nourishment, culinary joy, and approachability—transforming chore-like kitchen coordination into a delightful, game-like ritual.

Visually, the style merges soft graphic illustrative lines with playful neo-brutalist softness:
- Thick, warm, friendly outlines (2px–3px in warm charcoal ink) ground all interactive containers.
- Hyper-tactile, "squishy" physical elements, such as pill-shaped buttons with offset cartoon drop-shadows.
- Generous internal padding and pillowy surfaces resembling Japanese bento boxes, warm diner menus, and animated culinary scenes.

## Colors

The color palette draws directly from wholesome culinary ingredients, leaning into warm light-mode surfaces with high-contrast, deeply legible dark outlines.

- **Primary (`#FFC83B`) — Sunny Egg Yolk**: The core identity hue for primary interactions, featured ingredients, and joyful focal points.
- **Secondary (`#FF5A36`) — Ripe Tomato**: Direct action prompts, urgent alerts, cooking timers, and attention-grabbing callouts.
- **Tertiary (`#4EBA6F`) — Fresh Mint/Parsley**: Balanced nutrition meters, successful inventory updates, pantry replenishment states, and fresh produce badges.
- **Surface & Canvas (`#FFFDF8`) — Steamed Rice Cream**: The primary canvas background; a gentle, warm off-white that eliminates screen glare while providing cozy contrast.
- **Ink & Outline (`#2B231D`) — Warm Charcoal Ink**: Used for all structural borders, outlines, iconography, and high-contrast typography instead of harsh digital black (`#000000`).
- **Accent Neutral (`#5C3A21`) — Toasted Bread Crust**: Applied to secondary typography, subtle dividers, empty-state sketches, and toasted card trims.

## Typography

The typography pairs the expressive, geometric personality of **Epilogue** for display headers with the round, legible cadence of **Plus Jakarta Sans** for body and labels.

- **Headlines & Storybook Moments**: Rendered in Epilogue (weights 700 to 800). Its wide posture and geometric curvature echo storybook chapter titles and menu headers.
- **Body & Data Density**: Managed through Plus Jakarta Sans (weights 500 to 700). The open counters and soft terminals keep multi-ingredient lists, mess duty rosters, and prep instructions effortlessly legible on both mobile screens and dense desktop dashboards.
- **Uppercase Labels**: Micro-tags, ration counters, and dietary indicators use medium or small labels set in bold Plus Jakarta Sans with generous tracking (+0.02em to +0.05em) for immediate scanning.

## Layout & Spacing

This design system uses a fluid responsive grid structure supported by chunky, balanced spacing:

- **Mobile (<768px)**: 4-column layout with `1rem` (16px) margins and `1rem` (16px) gutters. Cards stack vertically in a clean single-column or 2-column ration tile grid.
- **Tablet (768px - 1024px)**: 8-column layout with `2rem` (32px) outer margins and `1.25rem` (20px) gutters. Pantry and meal planning screens divide smoothly into 4-column cards.
- **Desktop (>1024px)**: 12-column layout capped at a maximum container width of `1280px` with `3rem` (48px) outer margins and `1.5rem` (24px) gutters.

Paddings inside cards and interactive components are intentionally roomy (e.g., `space-md` for compact cards, `space-lg` for bento sections) to create a relaxed, uncluttered, and pillowy layout.

## Elevation & Depth

Visual hierarchy is maintained through cartoon tactile depth rather than diffuse digital drop shadows:

1. **The Solid Cartoon Shadow (Primary Depth Technique)**:
   Elements feature a 2px to 2.5px solid stroke in `#2B231D` combined with a hard, unblurred offset shadow: `box-shadow: 0px 4px 0px 0px #2B231D`. This creates a stamp-like, physical presence reminiscent of board game counters and manga panels.
2. **The Resting State**:
   Flat, creamy containers with a 2px solid `#2B231D` border and a soft ambient tint (`box-shadow: 0px 3px 0px 0px rgba(43, 35, 29, 0.15)`).
3. **The Active/Squish State**:
   On click or touch, elevated buttons and cards translate downwards (`transform: translateY(3px)` or `translateY(4px)`) while reducing the shadow offset to `0px 0px 0px 0px #2B231D`, mimicking a physical button being pressed into dough.
4. **Floating Overlays & Modals**:
   Modal dialogues and drawer menus retain the solid 2.5px `#2B231D` border and cast a prominent `0px 8px 0px 0px #2B231D` shadow over an ambient backdrop scrim of `#2B231D` tinted to 40% opacity.

## Shapes

The design system adopts a Pill-shaped (`roundedness: 3`) geometry:

- **Buttons, Badges, and Micro-tags**: Completely pill-shaped (`border-radius: 9999px`) to create an inviting, candy-like touch target that feels soft and welcoming.
- **Standard Cards, Bento Tiles, and Form Inputs**: Large, friendly corner curves (`border-radius: 2rem` or `32px`) to evoke rounded lunchboxes, ceramic plates, and storybook vignettes.
- **Structural Outlines**: All structural containers are bound by a uniform 2px or 2.5px solid border in `#2B231D`, ensuring that rounded corners remain crisp and defined.

## Components

### Buttons
- **Primary Action (Sunny Yolk)**: Filled with `#FFC83B`, text and icon in `#2B231D`, surrounded by a 2.5px solid `#2B231D` border. Shadow is `0px 4px 0px 0px #2B231D`. Pill-shaped (`border-radius: 9999px`).
- **Destructive / Urgent (Tomato Orange)**: Filled with `#FF5A36`, white or `#FFFDF8` text, 2.5px solid `#2B231D` border with matching hard shadow.
- **Secondary / Soft**: Surface background `#FFFDF8`, 2px solid `#2B231D` outline, resting `0px 2px 0px 0px #2B231D` shadow.
- **Hover & Interaction**: `transform: translateY(-2px)` on hover with increased shadow to `0px 6px 0px 0px #2B231D`; `transform: translateY(4px)` and zero shadow on active press.

### Chips & Badges
- **Pill Badges**: Pill-shaped with a 2px `#2B231D` outline and `0.25rem 0.75rem` padding.
- **Ingredient States**:
  - *Fresh/Surplus*: Background `#4EBA6F` with white/cream text.
  - *Expiring Soon*: Background `#FF5A36` with white text.
  - *Staple/Standard*: Background `#FFC83B` with dark charcoal text.
- Micro-icons (mini spoons, veggies, alert bells) are prefixed with a 4px gap.

### Cards & Bento Compartments
- Grounded on `#FFFDF8` with a 2.5px `#2B231D` solid border and `border-radius: 2rem`.
- Padding is generous (`space-md` to `space-lg`).
- Interactive recipe or ration cards lift gently on hover with a bouncy curve (`cubic-bezier(0.34, 1.56, 0.64, 1)`).

### Input Fields & Search Bars
- Background `#FFFDF8` with 2px solid `#2B231D` border and pill-shaped radius (`9999px` for search/inputs, `1.5rem` for textareas).
- Placeholder text in `#5C3A21` at 60% opacity.
- Focus state expands outline shadow to `0px 3px 0px 0px #FFC83B` while keeping the crisp `#2B231D` stroke intact.

### Checkboxes & Radio Controls
- Custom circular or rounded-box glyphs with a 2.5px `#2B231D` stroke.
- Unchecked: `#FFFDF8` background.
- Checked: `#4EBA6F` or `#FFC83B` fill, displaying a bold `#2B231D` checkmark or center pip. A satisfying bounce animation triggers on toggle.

### Mess Ration Specific Components
- **Portion Stepper**: Pill-shaped capsule containing `[-]`, quantity number, and `[+]` partitioned by 2px `#2B231D` vertical internal dividers.
- **Pantry Expiry Meter**: Segmented progress bar framed by a 2px `#2B231D` track, filled with pill-shaped pill droplets shifting from green (`#4EBA6F`) to orange (`#FF5A36`).
- **Chef Duty Roster Avatar**: Circular portrait badges bordered with a 2px `#2B231D` outline and topped with a tiny chef hat icon indicator.