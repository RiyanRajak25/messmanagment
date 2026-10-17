# HIMRASAD — Institutional Mess & Ration Supply Command

> A production-grade, role-based institutional ration and mess supply management web application built with **React 18 + Vite + TypeScript + Tailwind CSS + Framer Motion**.
> Features the **HIMRASAD Himalayan visual identity**: disciplined, dependable, mountain-high, calm under pressure, and structured for operational field clarity.

---

## 1. Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Run local development server
npm run dev

# 3. Run automated test suite (18 Vitest unit & integration tests)
npm test

# 4. Compile production bundle
npm run build

# 5. Open browser at http://localhost:3000
```

---

## 2. Living Brand Identity & Specification

Navigate to:
```
http://localhost:3000/brand
```

This route acts as the **living design specification**, documenting:
- **Official Brand Mark & Shield Emblems**: Primary Shield Emblem, light/dark horizontal lockups, monochrome stamps, touch icons, and web manifest.
- **Mountain-High Color Tokens & WCAG Contrast**:
  - **Olive** (`#4F5D2F`) & **Olive Deep** (`#2F3A1E`) — Primary navigation, buttons, and command headers.
  - **Snow** (`#F5F7F4`) — High-altitude canvas background.
  - **Night** (`#1B2430`) — Hero surfaces and login screens.
  - **Glacier** (`#4F86B0`) & **Glacier-Mist** (`#BCD3E3`) — Information chips, charts, and secondary indicators.
  - **Sand** (`#C8B88A`) & **Gold** (`#D9A441`) — Dividers, card borders, and the signature 3px top border.
  - **Saffron** (`#E8861A`) — High-visibility CTA badges.
  - **Danger** (`#B3261E`) & **Success** (`#2E7D4F`) — Critical low stock alerts and verified compliance tags.
- **Typography Hierarchy**: Montserrat 700/800 for disciplined headings; Inter 400/500/600 for dense operational tables and tabular numerals.
- **Interactive Altitude Gauge Simulator**: Visualizing stock reserves against mountain elevation lines.
- **Tokens Studio Export**: [`public/brand/tokens.json`](file:///c:/Users/RIYAN/Desktop/Projects/mess%20management/public/brand/tokens.json) and [`public/brand/brand.css`](file:///c:/Users/RIYAN/Desktop/Projects/mess%20management/public/brand/brand.css).

---

## 3. Demo Role Appointments & Credentials

All 5 roles have pre-configured credentials with instant one-click switching in the top navigation bar or on the login screen:

| Role | Appointed Member | Login Email | Operational Command Scope |
| :--- | :--- | :--- | :--- |
| **Administrator** | Dr. Rajesh Verma | `admin@messmunch.edu` | **Station Command HQ**: All units, ration catalog, audit trails, and closed-loop ML forecasts. |
| **Store Keeper** | Subedar Ramesh Patel | `storekeeper@messmunch.edu` | **Central Supply Depot**: Silo reserves, delivery unloads, ration issues, and write-offs. |
| **Mess Manager** | Pooja Singh | `falcon.manager@messmunch.edu` | **Hostel Mess (Falcon)**: Daily 2-minute meal entry for 415 diners, pantry reserves, and consumption history. |
| **Finance Staff** | Amit Sharma, IDAS | `finance@messmunch.edu` | **Central Accounts & Audit**: Sanctioned grant utilization, PO payments, expenditure ledgers, and fiscal audits. |
| **Provisions Contractor** | Kisan Agro Products Ltd. | `vendor@kisanagro.in` | **Supplier Portal**: External provisions supplier console. |

---

## 4. Key Architectural Guarantees & Domain Rules

1. **Pure Derived Stock Ledger**: Current stock is **never** stored as an editable counter in UI state. Current stock is mathematically derived from the append-only `stock_transaction` ledger:
   - $\text{Central Store Reserve} = \sum \text{receipts} - \sum \text{issues} - \sum \text{adjustments}$
   - $\text{Mess Pantry Reserve} = \sum \text{issues received} - \sum \text{daily consumption}$
2. **Cryptographic Role Isolation**: Mess Managers cannot access Central Depot PO creation or Accounts ledgers. Accessing an unauthorized route redirects to the barrier checkpoint (`/403`).
3. **Auto-Minimizing Left Sidebar**: Sidebar auto-minimizes when the cursor leaves and expands on hover to 320px (`w-80`) with zero text clipping.
4. **Append-Only Tamper-Evident Audit Trail**: Every stock movement, delivery intake, issue, and daily meal entry automatically generates an immutable audit record with JSON before/after state diff.
5. **Operational Data Tables (`.table-operational`)**: Deep-olive table headers (`#2F3A1E`), alternating row contrast, sand dividers, and monospace numerals for maximum field readability.
6. **No Cartoons or Playful Mascots**: All casual animations, playful confetti, and chibi mascots have been replaced with formal mountain altitude gauges, status pills, and radar pulses.

---

## 5. Architectural Decisions & Ambiguities Resolved

- **Consumption Exceeding Stock**: Blocked with an inline validation alert, requiring an audited Store Keeper stock issue before submission.
- **Expiry Tracking**: Tracked per commodity (shelf-life days + delivery receipt timestamp), with data schemas ready for batch-level tracking.
- **Supply Route**: Messes draw rations exclusively through the Central Supply Depot; only Central Depot interfaces directly with suppliers via POs.
- **Budgeting**: Budgets can be created and reviewed by Finance Staff and Station Administrators.
- **Single Manager per Mess**: Default 1-to-1 mapping in demo, but schema tolerates multiple staff members per mess.

---

## 6. End-to-End Walkthrough Demo Script

To walk the complete closed loop:
$$\text{Create PO} \longrightarrow \text{Receive Consignment} \longrightarrow \text{Issue to Mess} \longrightarrow \text{Log Meal Draw} \longrightarrow \text{Forecast Demand} \longrightarrow \text{Audit Trail Inspection}$$

Refer to [`DEMO_SCRIPT.md`](file:///c:/Users/RIYAN/Desktop/Projects/mess%20management/DEMO_SCRIPT.md) for step-by-step instructions.

---

## 7. Connecting to a Live Backend API

The app utilizes a typed API client in [`src/api/client.ts`](file:///c:/Users/RIYAN/Desktop/Projects/mess%20management/src/api/client.ts) and MSW for offline mocking.
To connect to a production Node.js / Django / Go REST backend:
1. Update `API_BASE` in [`src/api/client.ts`](file:///c:/Users/RIYAN/Desktop/Projects/mess%20management/src/api/client.ts) to your backend base URL (e.g. `https://api.himrasad.gov.in`).
2. Disable MSW initialization in [`src/main.tsx`](file:///c:/Users/RIYAN/Desktop/Projects/mess%20management/src/main.tsx).
