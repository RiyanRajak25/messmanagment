# MessMunch — Credits & Design Inspirations

## Visual Design System: "Chibi Kitchen"
- **Style Concept**: Cozy anime-kitchen neo-brutalism blending tactile physical game-like controls with high-density enterprise ration management.
- **Palette**: Sunny Egg Yolk (`#FFC83B`), Ripe Tomato (`#FF5A36`), Fresh Mint (`#4EBA6F`), Steamed Rice Cream (`#FFFDF8`), Warm Charcoal Ink (`#2B231D`), Toasted Crust (`#5C3A21`).
- **Typography**: Epilogue (Display & Headings, 700/800) and Plus Jakarta Sans (Body, Labels, Numerals, 500/700) via Google Fonts (SIL Open Font License).
- **Icons**: Lucide React & Google Material Symbols Outlined (Apache 2.0 / MIT).

## Micro-Interactions & UI Patterns (UIverse.io Inspired Restyling)
All UI patterns adapted from community inspirations were comprehensively rewritten from scratch to adhere to MessMunch's strict 2.5px solid ink outlines, `#2B231D` hard offset shadows, pill radiuses, and Chibi Kitchen design tokens:
1. **Tactile Push Buttons (Pressable 3D Squish)**:
   - Inspiration: UIverse community physical push-button mechanisms.
   - Restyled: Custom spring-squish using `framer-motion` (`stiffness: 500, damping: 25`), 4px hard ink shadow translation to 0px on active press.
2. **Pantry Storage Jars**:
   - Inspiration: Animated glass container and liquid level gauges.
   - Restyled: Custom SVG Glass Jars with dynamic liquid level, reflection highlight, wobble on low stock, and days-remaining countdown.
3. **Capsule Portion Stepper**:
   - Inspiration: Pill segment increment controls.
   - Restyled: Multi-segment capsule with long-press acceleration, direct numeric input, locked base units, and zero-clamp safety.
4. **Chibi Pot Mascot & Steam Animations**:
   - Original Character: Animated boiling hotpot mascot with blushing cheeks, steam trails, and bubbly broth.
5. **Floating Label & Bento Tiles**:
   - Restyled with cream backgrounds, 2.5px ink outlines, and subtle yolk glow highlights.
