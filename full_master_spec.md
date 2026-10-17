<USER_REQUEST>
use all these, for context and reference-
@[c:\Users\RIYAN\Desktop\Projects\mess management\stitch_chibi_mess_ration_tracker] @[c:\Users\RIYAN\Desktop\Projects\mess management\animated_svg.html] @[c:\Users\RIYAN\Desktop\Projects\mess management\RMS_Complete_Documentation.pdf] @[c:\Users\RIYAN\Desktop\Projects\mess management\RMS-Ration Management System .pdf] @[c:\Users\RIYAN\Desktop\Projects\mess management\DESIGN.md] 

# MASTER PROMPT: MessMunch, Mess & Ration Management Web App

> Paste everything below the line into your AI builder (Claude Code, Cursor, v0, Lovable, Bolt, Google Stitch, etc.).
> Attach with it: `PRD.md`, `DESIGN.md`, `code.html` and `screen.png` from your Stitch export.
> Tip: build in the phases listed in section 12, one phase per message. Do not ask for the whole app in one shot.

---

## 0. ROLE

You are a senior product designer and front-end engineer. Build **MessMunch**, a production-quality, role-based web app for managing ration supply across multiple institutional messes. The attached `PRD.md` is the source of truth for behavior, roles, data and API. The attached `DESIGN.md`, `code.html` and `screen.png` are the source of truth for visual style. If they conflict, the PRD wins on behavior and DESIGN.md wins on looks.

## 1. WHAT THE PRODUCT IS (one paragraph)

A closed feedback loop: **Vendors → Procurement (POs) → Central Store → Distribution to messes → Daily consumption → Demand forecast → next PO.** Stock is never typed in; it is always derived from an append-only `stock_transaction` ledger. Every mutation is written to an immutable audit log. Five roles see five different apps: **Administrator, Store Keeper, Mess Manager, Finance Staff, Vendor (Phase 2, build only a locked "coming soon" shell).**

## 2. VISUAL DIRECTION: "Chibi Kitchen" (follow DESIGN.md exactly)

Cozy anime-kitchen + playful neo-brutalism. Warm, tactile, game-like, but still a serious tool people use daily.

**Tokens (put them in `tailwind.config` and as CSS variables; never hard-code hex in components):**
- Fills: yolk `#FFC83B` (primary), tomato `#FF5A36` (urgent/destructive), mint `#4EBA6F` (healthy/success), canvas `#FFFDF8`, ink/borders/text `#2B231D`, crust `#5C3A21` (secondary text).
- Note: the Stitch Tailwind config maps `primary` to dark gold `#785a00`. Use `primary-container #FFC83B` for button and chip **fills** and `#785a00` only for small text on light backgrounds.
- Fonts: **Epilogue** 700/800 for headings, **Plus Jakarta Sans** 500/700 for body, labels and numbers. Use tabular numerals for all quantities.
- Shape: buttons, chips, inputs = pill (`9999px`); cards, tiles, modals = `2rem` radius.
- Depth: 2 to 2.5px solid ink border plus hard offset shadow `0 4px 0 0 #2B231D`. Hover lifts `translateY(-2px)` with shadow 6px. Active presses `translateY(4px)` with shadow 0. Modals use an 8px shadow over a 40% ink scrim.
- Layout: 12-col desktop (max 1280px, 48px margins, 24px gutters), 8-col tablet, 4-col mobile.

**Chibi-ness budget (important for usability):** Personality lives in the shell, empty states, loading states, mascot moments, buttons, badges and celebration moments. **Dense data screens (tables, ledgers, audit log, forms) must stay calm:** use 1.5px ink outer border on the table container only, subtle row dividers in crust at 15% opacity, no per-row heavy borders or shadows, 14 to 15px text, and a sticky header. Readability beats cuteness on any screen where someone works for more than 30 seconds.

## 3. HOW TO USE FIGMA, FRAMER AND UIVERSE.IO (read carefully)

I cannot give you live access to these tools, so apply them as **sources of patterns**, not plugins:

**Figma → structure & system.** Before coding, define the design system the way a Figma file would be organised:
- Variables/tokens: color, radius, spacing, shadow, type scale.
- A component library with **variants and states**: Button (primary/danger/soft/ghost × default/hover/pressed/disabled/loading), Input, Select, Stepper, Badge, Card, Table, Modal, Drawer, Toast, Tabs, Stat tile, Empty state.
- Auto-layout thinking: consistent 4/8px spacing scale, no magic numbers, every component responsive.
- Output a `/design-system` route (a living style guide page) showing every component in every state. This is my Figma replacement.
- Also output `tokens.json` I can import into Figma (Tokens Studio format).

**Framer / Framer Motion → motion.** Use the `framer-motion` library for all animation:
- Page transitions: fade + 12px slide, 200 to 250ms.
- Staggered entrance for dashboard tiles and list rows (40ms stagger).
- Buttons: spring squish on press (`stiffness 500, damping 25`).
- Number count-up on stat tiles; progress bars and jars fill with a spring.
- Shared-element/`layoutId` transitions for tab indicators and table row → detail drawer.
- Success: confetti burst of rice grains / sparkles (small, under 800ms) on "stock received", "PO closed", "daily entry submitted".
- **Respect `prefers-reduced-motion`**: disable all non-essential motion.

**Uiverse.io → micro-interactions.** Take the *idea and CSS technique* of community components and **restyle them to our tokens** (ink border, hard shadow, pill, warm palette). Use for:
- Buttons: pressable 3D/"push" button (primary actions).
- Toggles/switches and animated checkboxes (bounce on check).
- Loaders: a bowl/pot/rice-grain spinner instead of a generic spinner.
- Cards: hover-lift bento tiles.
- Inputs: floating-label inputs with yolk focus shadow.
- Radio/segmented selectors for period filters.
- Notification bell with a jiggle on new alert.
Do not paste foreign CSS verbatim. Rewrite it as Tailwind or CSS-module components, and keep a `CREDITS.md` listing any uiverse.io inspiration (check each element's license before reuse).

## 4. TECH STACK (frontend only; mock the backend)

- **React 18 + Vite + TypeScript**, Tailwind CSS, `framer-motion`, React Router v6, TanStack Query, React Hook Form + Zod, Recharts (recolor to our palette, thick ink strokes), Radix UI primitives for accessible dialogs, menus, tabs and toasts (restyled), lucide-react or Material Symbols for icons.
- **Role-aware routing with code splitting:** each role's screens are lazy-loaded from `/src/roles/<role>/`. A Mess Manager bundle must never import Finance code (PRD: "never loads the vendor-payment screen's code").
- **Mock API:** use MSW (Mock Service Worker) so the whole app works with no backend. Implement the exact endpoints in PRD §8 with realistic latency (200 to 600ms) and error cases. Put the typed API client in `/src/api/` so I can swap the base URL for the real Node/Django backend later.
- **Auth mock:** login screen with a role picker for demo (dev only), JWT-shaped payload containing `role` and `mess_id`. A Mess Manager's `mess_id` comes from the token, never from a URL or form field.
- Route guards are for UX only. Show a friendly 403 page ("This pantry is locked 🔒") if a role hits a forbidden route, and have the mock API return real 403s too.

## 5. APP SHELL

- **Top bar:** logo + mascot, role-specific pill nav (see §6), global search, notification bell (low-stock/expiry count), user avatar with a role chip and logout. Reuse the layout from `screen.png`.
- **Mobile:** bottom tab bar (4 items max) + hamburger drawer. Mess Manager and Store Keeper flows are mobile-first (they work on phones in the kitchen).
- **Ticker strip under the nav** (as in the Stitch design): live alerts like "Low stock: Sunflower Oil 45 L · Expiry: Paneer in 2 days".
- Breadcrumbs on deep pages, toasts bottom-right, dark mode **not** required.

## 6. SCREENS PER ROLE (map to PRD §3, §5, §6)

### 6.1 Administrator ("Head Chef HQ")
1. **Dashboard:** summary bar (total stock value, budget used %, active alerts, open POs), stock overview jars (see 7.1), low-stock & expiry alerts, mess drill-down cards, budget vs spend chart, vendor performance leaderboard, forecast summary, recent audit trail.
2. **Messes:** list + detail (stock, consumption history, headcount trend).
3. **Vendors:** CRUD table, deactivate (soft delete), performance drawer.
4. **Items:** CRUD with unit, category, reorder threshold, shelf life.
5. **Users:** table, create/deactivate, role dropdown, mess assignment.
6. **Reports & Audit log:** filterable audit table with before/after JSON diff viewer; CSV export.
7. **Forecast:** per mess and item, predicted qty, confidence meter, method label.

### 6.2 Store Keeper ("Pantry Command")
1. **Dashboard:** central stock jars/table toggle, expiry watchlist, pending POs with received/ordered progress bars, quick actions **[Receive delivery]** and **[Issue to mess]**, recent transactions, vendor list. **No money anywhere.**
2. **Receive delivery wizard:** pick PO → per-line received qty steppers (supports partial; warn if over-delivery) → review → confirm. PO status chip updates (`open → partially_received → closed`).
3. **Issue to mess:** mess selector, item lines with steppers, live "available in central store" hint, inline error if insufficient stock.
4. **Adjustments:** item, qty, **required reason code** (wastage, damage, count correction).
5. **Create PO:** vendor, lines, **suggested order quantity from forecast** shown beside each line with an "Apply" chip.
6. **Ledger:** full `stock_transaction` table with type chips, filters, direction arrows (in/out).

### 6.3 Mess Manager ("My Mess")
1. **Today's entry (hero screen, under 2 minutes):** big headcount stepper, one row per item with a portion stepper, "same as yesterday" quick-fill chip, running total, single big **Submit** pill. Show duplicate-entry guard (one entry per mess/item/date) with an "Edit today's entry" path.
2. **My stock:** only own mess; jars with days-of-stock-left.
3. **History:** consumption per day chart + table, per-head usage metric.
4. **Menu & feedback (optional flag):** daily menu editor, ratings view.
5. Header always shows the mess name. No cross-mess totals anywhere.

### 6.4 Finance Staff ("Ledger Desk")
1. **Dashboard:** budget vs actual per mess (bar), burn-rate line, overdue vendor payments.
2. **Budgets:** create/edit per mess + period.
3. **Vendor payments & expenditure:** record expenditure against PO + vendor.
4. **PO financial view:** unit price × ordered/received qty, variance chip.
5. **Audit log (read-only)** and **Export** (CSV; PDF button can be a stub).
6. **No inventory edit controls rendered at all.**

### 6.5 Vendor (Phase 2)
A locked "Vendor portal coming soon" shell only. Do not build.

### 6.6 Shared
Login, forgot-password stub, profile, 403, 404, offline banner, global error boundary.

## 7. SIGNATURE COMPONENTS

**7.1 Pantry Jars (stock visual):** glass-jar SVG filled to % of max stock; color = mint (healthy), yolk (adequate), tomato (low, jar gently wobbles). Under it: item, quantity + unit, "Sufficient for N days". Toggle to a dense table view (default on small screens and for Store Keeper power use). Always show the number, never rely on fill color alone.

**7.2 Portion Stepper:** capsule `[−] 12.5 kg [+]`, long-press to accelerate, tap the number to type, unit locked to the item's base unit. Never allow negatives.

**7.3 Expiry Meter:** segmented pill bar green → orange with days-left label.

**7.4 Status chips:** PO (open/partial/closed/cancelled), stock (fresh/standard/expiring/low), transaction types (receipt/issue/adjustment/return) with an icon + text, never color alone.

**7.5 Forecast card:** predicted qty, confidence meter, sparkline of last 8 weeks, "Apply to PO" action.

**7.6 Audit diff drawer:** side-by-side before/after JSON, actor chip, timestamp in local time with a UTC tooltip.

**7.7 Mascot:** a small pot/bowl character used on empty states, loaders, 403/404 and success moments. Create an **original** character (do not copy any existing anime or brand character).

## 8. STATES (every screen must have all of these)

Loading skeleton (chibi shimmer), empty (mascot + helpful next action), error with retry, partial/offline, success toast, permission-denied. Forms: inline validation, disabled-until-valid submit, optimistic UI only where safe. **Never optimistic-update stock numbers**; refetch after any ledger write because stock is derived.

## 9. DATA RULES THE UI MUST RESPECT (from PRD §11)

1. Stock is read-only everywhere. The only way to change it is Receive, Issue, Adjust (with reason) or Consumption.
2. Show base units consistently (kg, litre, piece). No unit mixing in one table.
3. Insufficient stock → block with a clear message, never silently clamp.
4. Partial deliveries: show ordered / received / remaining on each line.
5. Soft-delete only ("Deactivate"), never "Delete" for users and vendors.
6. Dates and times: display in the user's local timezone (default Asia/Kolkata), store/send UTC.
7. Currency: ₹ with Indian digit grouping (₹1,25,000).
8. Any mutation confirmation says what was recorded ("Logged in audit trail ✓").
9. Mess Manager UI never displays another mess's data or any cross-mess aggregate.

## 10. SEED DATA FOR THE DEMO

3 messes (e.g. Falcon Hostel, Eagle Block, Staff Mess), ~30 realistic Indian ration items (basmati rice, toor dal, sunflower oil, atta, potatoes, onions, paneer, milk, sugar, tea, turmeric, etc.), 5 vendors, 6 months of consumption/ledger history with weekday/weekend and festival seasonality, a few POs in each status, 2 to 3 low-stock items, 2 expiring items, budgets per mess, forecast records with varied confidence. Include a "Reset demo data" dev button.

## 11. QUALITY BAR

- **Accessibility:** WCAG AA contrast (ink on cream passes; check text on yolk, tomato and mint), visible focus ring (yolk shadow + ink border), full keyboard navigation, labelled inputs, `aria-live` for toasts, 44px minimum touch targets, don't encode meaning by color alone.
- **Performance:** route-level code splitting, virtualized tables above 200 rows, images lazy-loaded, Lighthouse perf ≥ 90 on dashboard (mobile).
- **Responsive:** test at 360, 768, 1024, 1440px. No horizontal scroll. Tables become stacked cards on mobile.
- **Code quality:** strict TypeScript, feature folders, no component over ~200 lines, reusable hooks, Zod schemas shared between forms and mock API, ESLint + Prettier, a few Vitest + Testing Library tests (role guard, stepper, insufficient-stock error) and 2 Playwright flows (receive delivery; mess daily entry).

## 12. BUILD ORDER (do ONE phase, then stop and show me)

1. **Foundation:** project setup, tokens, Tailwind config, fonts, `/design-system` page with all components and states, app shell, login + role routing, MSW + typed API client.
2. **Mess Manager** flow (smallest role, proves the system): today's entry, my stock, history.
3. **Store Keeper:** dashboard, receive wizard, issue, adjustments, ledger.
4. **Admin:** dashboard, vendors, items, users, messes.
5. **Finance:** budgets, payments, PO financial view, audit log.
6. **Forecast + alerts + CSV export**, then polish: motion pass, mascot states, a11y audit, README.

After each phase: list what you built, what is mocked, and any PRD ambiguity you resolved (see §13).

## 13. AMBIGUITIES: DECIDE AND FLAG, DON'T BLOCK

Use these defaults and list them in the README so I can change them:
- Mess consumption above on-hand stock → **blocked** with an explicit, audited manager override request.
- Expiry tracked **per item** (shelf life + receipt date), with the data model ready for per-batch later.
- Messes order only via the central store.
- Budgets creatable by Finance and Admin.
- No PO approval step.
- One Mess Manager per mess (UI tolerates several).

## 14. DO NOT

- Do not build a student-facing portal. The Stitch screen includes RSVP/opt-out, calorie meter, chef roster, WhatsApp install banner and community polls. These are **out of scope** for the MVP. Reuse only the visual language, the pantry jars, the meal board (as the optional Menu feature) and the corkboard idea (as an Announcements widget on the Admin dashboard).
- Do not store current stock as an editable field anywhere in UI state.
- Do not rely on UI hiding for security; guards are UX, the (mock) API enforces roles.
- Do not use stock photos of people or copy existing characters, logos or artwork.
- Do not use gradients, glassmorphism, soft diffuse shadows, thin 1px borders on cards, or generic blue/purple SaaS styling. It must look like the attached `screen.png`.
- Do not ship placeholder lorem ipsum. Use realistic mess content throughout.

## 15. DELIVERABLES

Running app (`npm run dev`), `/design-system` page, `tokens.json`, `CREDITS.md`, `README.md` (setup, role demo logins, decisions from §13, how to point at the real API), and a short `DEMO_SCRIPT.md` that walks the full loop: **create PO → receive (partial) → issue to mess → log consumption → view forecast → raise next PO**, showing the audit trail entries produced at each step.

Start with Phase 1 now.
</USER_REQUEST>
<ADDITIONAL_METADATA>
The current local time is: 2026-10-13T15:02:37+05:30.

The user has mentioned some items in the form @[ITEM]. Here is extra information about the items that were mentioned by the user, in the order that they appear:

@[c:\Users\RIYAN\Desktop\Projects\mess management\stitch_chibi_mess_ration_tracker] is a [File]:
c:\Users\RIYAN\Desktop\Projects\mess management\stitch_chibi_mess_ration_tracker
@[c:\Users\RIYAN\Desktop\Projects\mess management\animated_svg.html] is a [File]:
c:\Users\RIYAN\Desktop\Projects\mess management\animated_svg.html
@[c:\Users\RIYAN\Desktop\Projects\mess management\RMS_Complete_Documentation.pdf] is a [File]:
c:\Users\RIYAN\Desktop\Projects\mess management\RMS_Complete_Documentation.pdf
@[c:\Users\RIYAN\Desktop\Projects\mess management\RMS-Ration Management System .pdf] is a [File]:
c:\Users\RIYAN\Desktop\Projects\mess management\RMS-Ration Management System .pdf
@[c:\Users\RIYAN\Desktop\Projects\mess management\DESIGN.md] is a [File]:
c:\Users\RIYAN\Desktop\Projects\mess management\DESIGN.md
</ADDITIONAL_METADATA>
<USER_SETTINGS_CHANGE>
The user changed setting `Model Selection` from None to Gemini 3.8 Flash (High). No need to comment on this change if the user doesn't ask about it. If reporting what model you are, please use a human readable name instead of the exact string.
</USER_SETTINGS_CHANGE>