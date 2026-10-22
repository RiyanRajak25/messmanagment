# HIMRASAD — Institutional Mess & Ration Management System
## Complete System Guide, Feature Catalog & Role Access Manual

---

### Table of Contents
1. [Executive Overview & Mission](#1-executive-overview--mission)
2. [Technical Architecture & Security Suite](#2-technical-architecture--security-suite)
3. [User Roles, Credentials & Quick Switcher](#3-user-roles-credentials--quick-switcher)
4. [Detailed Role Breakdown & Feature Capabilities](#4-detailed-role-breakdown--feature-capabilities)
   - [Role 1: Station Administrator (`administrator`)](#role-1-station-administrator-administrator)
   - [Role 2: Central Depot Storekeeper (`store_keeper`)](#role-2-central-depot-storekeeper-store_keeper)
   - [Role 3: Institutional Mess Caterer / Manager (`mess_manager`)](#role-3-institutional-mess-caterer--manager-mess_manager)
   - [Role 4: Central Accounts & Finance Officer (`finance_staff`)](#role-4-central-accounts--finance-officer-finance_staff)
   - [Role 5: Contracted Provisions Supplier (`vendor`)](#role-5-contracted-provisions-supplier-vendor)
5. [Role-Based Access Control (RBAC) Matrix](#5-role-based-access-control-rbac-matrix)
6. [Global System-Wide Tools & Utilities](#6-global-system-wide-tools--utilities)
7. [Cyber Security & Defense Controls](#7-cyber-security--defense-controls)
8. [Getting Started & Operational Workflows](#8-getting-started--operational-workflows)

---

### 1. Executive Overview & Mission

**HIMRASAD** is an enterprise-grade institutional supply and ration management system engineered for high-discipline environments, university campus hostels, governmental establishments, and high-altitude logistics facilities.

#### Core Mission
- **Zero Wastage**: Eliminate stock pilferage and spoilage through precision shelf-life tracking and scale-of-ration calculations.
- **Pure Append-Only Accounting**: All central store stock is mathematically derived from immutable debit/credit transactions (Receipts, Issues, Adjustments) with no manual arbitrary overrides.
- **Two-Tier Verification Chain**: Strict checks connecting vendor delivery receipts (Goods Receipt Notes) directly to treasury disbursements.
- **Row-Level Partitioning**: Mess Managers can only access and record data for their assigned facility, preventing unauthorized data tampering.
- **Institutional Aesthetic**: Designed with a military/institutional color palette (Deep Forest Pine, Mountain Olive, Warm Gold, Himalayan Snow, Terracotta Saffron) and responsive data tables, charts, and stepper wizards.

---

### 2. Technical Architecture & Security Suite

- **Frontend Core**: React 18, TypeScript, Vite, TailwindCSS (configured with strict design tokens), Lucide React iconography.
- **Client Mock API & Persistence**: Mock Service Worker (MSW) simulating realistic network latency (150–350ms) with persistent `localStorage` storage engine (`StorageEngine`) and sample datasets.
- **Cyber Security Layer**:
  - Content Security Policy (CSP) and HTTP security headers in `index.html`.
  - Anti-XSS payload sanitizer (`sanitizeInput`, `sanitizePayload`).
  - Strict numeric boundary controls (`isStrictPositiveNumber`, `isNonNegativeInteger`).
  - Anti-Brute Force Sentinel with 5-attempt threshold and 60-second cooldown timer.
  - Institutional Session Inactivity Auto-Lockout after 15 minutes of idle time.
  - Tamper-Evident Security Event Logger for unauthorized access attempts.
  - Production Crash Shield (`ErrorBoundary`) preventing white screens and stack trace leakage.
  - Sensitive financial data masking toggle (`maskSensitive`).

---

### 3. User Roles, Credentials & Quick Switcher

The system includes 5 authorized roles. Users can log in using their credentials or select any account with a single click from the **Operational Authentication** screen (`/login`) or the **Quick Role Switcher** dropdown in the top navigation bar.

| Role Key | Official Appointment | Demo User Name | Service Email / Login ID | Password | Primary Assigned Scope |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `administrator` | **Station Administrator** | Rajesh Verma | `admin@messmunch.edu` | `HimRasad@2026#Secure` | Central Command, System Oversight & Master Data |
| `store_keeper` | **Central Depot Storekeeper** | Ramesh Patel | `storekeeper@messmunch.edu` | `HimRasad@2026#Secure` | Central Warehouse, PO Receipts & Mess Issues |
| `mess_manager` | **Institutional Mess Caterer** | Pooja Singh | `falcon.manager@messmunch.edu` | `HimRasad@2026#Secure` | Falcon Mess (Assigned to `mess-1`) |
| `finance_staff` | **Central Accounts Officer** | Amit Sharma | `finance@messmunch.edu` | `HimRasad@2026#Secure` | Budgets, PO Costing & Supplier Disbursements |
| `vendor` | **Provisions Supplier** | Kisan Agro Products Ltd. | `vendor@kisanagro.in` | `HimRasad@2026#Secure` | Supply Orders, Consignment Dispatch & Challans |

---

### 4. Detailed Role Breakdown & Feature Capabilities

---

#### Role 1: Station Administrator (`administrator`)
> **Primary Authority**: Full administrative, operational, audit, and configuration access across all institutional installations.

**Default Route**: `/admin`  
**Accessible Sub-Routes**:
- `/admin` — Station Command Console
- `/admin/messes` — Institutional Mess Installations Directory
- `/admin/vendors` — Certified Provisions Suppliers Directory
- `/admin/items` — Master Provisions Catalog & Nutritional Specifications
- `/admin/users` — Station Personnel & Access Control
- `/admin/audit` — Tamper-Evident System Audit Trail
- `/admin/forecast` — Predictive Ration Demand Forecasting

##### What the Administrator Can Manage & Use:
1. **Station Command Overview**:
   - Real-time station telemetry: Total messes active, registered vendors, total provisioning value, open purchase orders.
   - Station-wide consumption trends and high-altitude buffer status.
   - Quick jump to audit anomalies and system maintenance triggers.
2. **Mess Installations Management (`/admin/messes`)**:
   - View all registered mess facilities (Falcon Mess, Eagle Mess, Staff Mess) with live headcount capacity and location details.
   - Add new mess facilities and configure their dining capacity.
3. **Certified Provisions Supplier Management (`/admin/vendors`)**:
   - Register new vendors with category tags, GSTIN/Tax ID, official phone, and contact email.
   - Inspect vendor compliance ratings, performance scores, and active delivery contracts.
4. **Master Provisions Catalog (`/admin/items`)**:
   - Maintain the standard provisions dictionary (Grains, Pulses, Oils, Dairy, Vegetables, Spices).
   - Set reorder thresholds (minimum safety reserve) and shelf life duration (days).
   - Track approximate unit costs (INR) for budgeting.
5. **Personnel Access Management (`/admin/users`)**:
   - Review authorized personnel across all appointments.
   - Inspect user activity status, assigned mess bindings, and role permissions.
6. **Immutable Audit Trail (`/admin/audit`)**:
   - Inspect every system modification: who acted, when, what changed (before/after JSON snapshot), and the affected entity.
   - Filter audit events by action type (`CREATE_PURCHASE_ORDER`, `ISSUE_TO_MESS`, `STOCK_ADJUSTMENT`, `LOG_DAILY_CONSUMPTION`, etc.).
7. **Predictive Demand Forecasting (`/admin/forecast`)**:
   - Run predictive algorithms projecting 7-day, 14-day, and 30-day requirement buffers based on seasonal factors, historical consumption, and mess headcounts.

---

#### Role 2: Central Depot Storekeeper (`store_keeper`)
> **Primary Authority**: Complete custody of the Central Supply Warehouse, physical intake of supplier consignments, quota distribution to mess halls, wastage recording, and procurement order initiation.

**Default Route**: `/store`  
**Accessible Sub-Routes**:
- `/store` — Central Depot Operations Dashboard
- `/store/receive` — Consignment Delivery Intake Wizard
- `/store/issue` — Quota Ration Issue to Mess Wizard
- `/store/adjustments` — Stock Adjustments & Wastage Logging
- `/store/create-po` — Procurement Purchase Order Generator
- `/store/ledger` — Immutable Stock Transaction Ledger

##### What the Storekeeper Can Manage & Use:
1. **Depot Operations Dashboard (`/store`)**:
   - Live inventory status across all warehouse items: Quantity On Hand, Days of Stock Left, Stock Health Badge (`fresh`, `adequate`, `low`, `expiring`).
   - Urgent Expiry Warning ticker alerting when goods are within 3–10 days of shelf-life expiry.
   - Visual stock level cards with unit indicators (kg, litre, packet, piece).
2. **Consignment Intake Wizard (`/store/receive`)**:
   - Step-by-step receipt workflow against open Purchase Orders.
   - Record delivered quantities line by line; automatically increments received count and marks PO as `partially_received` or `closed`.
   - Quality inspection check, physical weighment certification, and automatic generation of append-only `receipt` transactions in the stock ledger.
3. **Quota Ration Issue Wizard (`/store/issue`)**:
   - Select destination mess installation (e.g. Falcon Mess, Eagle Mess).
   - Add multiple ration items with automated stock sufficiency validation (prevents overdrawing warehouse balance).
   - Dispatches items, debits central warehouse balance, credits mess inventory, and logs digital dispatch records.
4. **Stock Adjustments & Wastage Logging (`/store/adjustments`)**:
   - Log inventory corrections with mandatory institutional reason codes: `wastage`, `damage`, `count_correction`, or `spoilage`.
   - Automatic balance validation (rejects negative numbers, non-numeric values, or quantities exceeding available stock).
   - Instantly logged to audit trail with before/after state snapshots.
5. **Purchase Order Creation (`/store/create-po`)**:
   - Draft and issue official purchase orders to certified suppliers.
   - Dynamic line items builder with item selector, order quantity, negotiated unit price, and automatic total calculations.
6. **Immutable Stock Transaction Ledger (`/store/ledger`)**:
   - Comprehensive append-only audit register showing every transaction (Receipt, Issue, Adjustment, Return).
   - Filter by Item, Transaction Type, Source, Destination, and Date range.
   - One-click **Export Ledger CSV** button for official accounting records.

---

#### Role 3: Institutional Mess Caterer / Manager (`mess_manager`)
> **Primary Authority**: Day-to-day culinary management of assigned mess hall, headcount recording, scale-of-ration consumption calculation, local pantry tracking, meal planning, and diner feedback review.

**Default Route**: `/mess`  
**Accessible Sub-Routes**:
- `/mess` — Daily Ration Entry & Mess Dashboard
- `/mess/stock` — Mess Pantry Stock & Jar Visualizer
- `/mess/history` — Meal Consumption History & Analytics
- `/mess/menu` — 7-Day Meal Schedule & Nutrition Balance
- `/mess/feedback` — Diner Quality Feedback & Ratings

##### What the Mess Manager Can Manage & Use:
1. **Daily Meal Consumption Entry (`/mess`)**:
   - Enter today's dining headcount (breakfast, lunch, dinner).
   - Scale-of-Ration Auto-Calculator: Automatically computes authorized standard entitlement per diner (e.g. 120g Rice, 80g Dal, 30g Cooking Oil per head).
   - Log exact quantities drawn from mess stock for preparation; updates remaining local mess inventory and logs an immutable consumption record.
   - Supports editing/correcting today's entry before end-of-day lock.
2. **Mess Local Stock & Pantry Jars (`/mess/stock`)**:
   - Inspect local mess pantry inventory (independent of central warehouse).
   - High-precision visual **Pantry Jars** showing fill percentages, remaining days of ration, and threshold indicators.
   - High-Altitude Altitude Gauge displaying cooking time adjustments for elevation.
3. **Consumption History & Trend Analysis (`/mess/history`)**:
   - Full historical register of previous daily consumption logs.
   - Headcount-to-consumption ratio charts demonstrating kitchen portion control efficiency.
   - Export meal logs to CSV for quarterly board inspections.
4. **Institutional Meal Planner (`/mess/menu`)**:
   - Weekly/daily schedule covering Breakfast, Lunch, Dinner, and Evening Snacks.
   - Add menu items with nutritional information (calories, protein, carbs, fats).
   - Row-level protection ensures managers can only edit the menu for their assigned mess.
5. **Diner Quality & Feedback Sentinel (`/mess/feedback`)**:
   - Review diner ratings and feedback comments across categories (Taste, Quality, Hygiene, Portion Size).
   - Sentiment analysis and average satisfaction rating gauges.
   - Submit real-time kitchen responses and remedial actions.

---

#### Role 4: Central Accounts & Finance Officer (`finance_staff`)
> **Primary Authority**: Budget allocation, expenditure accounting, procurement order financial reconciliation, statutory tax withholding (GST/TDS), and electronic supplier payments.

**Default Route**: `/finance`  
**Accessible Sub-Routes**:
- `/finance` — Financial Telemetry Dashboard
- `/finance/budgets` — Mess Budget Allocations & Sanctioned Caps
- `/finance/payments` — Supplier Disbursements & Payment Vouchers
- `/finance/po-view` — Procurement Orders Financial Ledger
- `/finance/audit` — Fiscal Audit Reconciliation & Anomaly Checks

##### What the Finance Officer Can Manage & Use:
1. **Financial Operations Dashboard (`/finance`)**:
   - Key fiscal metrics: Total Allocated Budget, Cumulative Expenditures, Remaining Sanctioned Funds, Outstanding Vendor Liabilities.
   - Monthly burn-rate graphs and budget utilization percentage gauges.
   - High-value transaction telemetry and pending disbursement flags.
2. **Mess Budget Allocations (`/finance/budgets`)**:
   - Allocate and monitor annual/quarterly fiscal budgets for each individual mess facility.
   - Visual progress bars showing expenditure vs allocated amount.
   - Strict budget ceiling alerts preventing over-expenditure beyond approved funds.
3. **Supplier Disbursements & Payment Vouchers (`/finance/payments`)**:
   - Authorize electronic payment disbursements against fulfilled purchase orders.
   - Automatic two-tier verification check (matches PO lines and Goods Receipt Notes before payment release).
   - Mandatory statutory compliance checks: Section 51 CGST Act 2% TDS deductions on eligible institutional contracts.
   - Generates official, printable **Payment Vouchers** with unique transaction IDs and audit stamps.
   - **Privacy Masking Toggle**: Sensitive banking accounts and GSTIN numbers masked by default (e.g. `29••••••••A1Z5`) to prevent shoulder surfing.
   - Export full disbursement register to CSV.
4. **PO Financial Ledger (`/finance/po-view`)**:
   - Track financial commitments (encumbrances) for all active purchase orders.
   - Breakdown of ordered value, received value, and settled vs pending balances.
5. **Fiscal Audit Trail (`/finance/audit`)**:
   - Financial ledger reconciliation comparing stock transaction volume to currency disbursed.
   - Immediate detection of ledger imbalances or anomalous invoice figures.

---

#### Role 5: Contracted Provisions Supplier (`vendor`)
> **Primary Authority**: Contracted supplier interface for tracking purchase orders, issuing electronic dispatch challans, tracking consignment transit, and reviewing delivery SLA performance.

**Default Route**: `/vendor`  
**Accessible Sub-Routes**:
- `/vendor` — Supplier Portal Overview
- `/vendor/orders` — Contracted Purchase Orders & Fulfillment
- `/vendor/dispatch` — Consignment Dispatch & Electronic Gate Passes
- `/vendor/performance` — Supplier SLA & Quality Scorecard

##### What the Vendor Can Manage & Use:
1. **Supplier Portal Overview (`/vendor`)**:
   - Welcome banner with certified vendor credentials, active contract category, and official GSTIN.
   - Summary tiles: Open Orders, Total Consignments Dispatched, Pending Receipts, Cumulative Billed Value.
2. **Purchase Order Fulfillment (`/vendor/orders`)**:
   - Real-time list of institutional purchase orders issued by Central Depot.
   - Line-item breakdown of requested quantities, delivery timelines, and agreed unit rates.
   - Status tracking (`open`, `partially_received`, `closed`).
3. **Consignment Dispatch & Gate Pass Generator (`/vendor/dispatch`)**:
   - Issue new dispatches for open orders with vehicle registration number, driver name, and dispatch date.
   - Generates an official printable **Consignment Delivery Challan & Gate Pass** complete with QR verification code.
   - Allows tracking consignments en route to Central Depot.
4. **Supplier Quality & SLA Scorecard (`/vendor/performance`)**:
   - Institutional vendor performance metrics: On-Time Delivery Rate, Quality Acceptance Percentage, Rejection Rate, and Net SLA Rating.
   - Visual compliance radar keeping vendors informed of their contractual standing.

---

### 5. Role-Based Access Control (RBAC) Matrix

The table below outlines exact operational permissions enforced both on the client via [RoleGuard](file:///c:/Users/RIYAN/Desktop/Projects/mess%20management/src/components/RoleGuard.tsx) and on the backend/mock API via [handlers.ts](file:///c:/Users/RIYAN/Desktop/Projects/mess%20management/src/mocks/handlers.ts).

| Operational Domain | Feature / Action | Admin | Storekeeper | Mess Manager | Finance | Vendor |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: |
| **Authentication** | Sign in / Session refresh |  Yes |  Yes |  Yes |  Yes |  Yes |
| | Anti-Brute Force Lockout Protection |  Yes |  Yes |  Yes |  Yes |  Yes |
| | Auto Inactivity Logout (15 min) |  Yes |  Yes |  Yes |  Yes |  Yes |
| **Central Warehouse** | View Central Stock Balance |  Yes |  Yes |  Read Only |  Read Only |  No |
| | Receive PO Consignment (GRN) |  Yes |  Yes |  No |  No |  No |
| | Issue Ration Quota to Mess |  Yes |  Yes |  No |  No |  No |
| | Stock Adjustments (Wastage/Spoilage) |  Yes |  Yes |  No |  No |  No |
| | View Immutable Stock Ledger |  Yes |  Yes |  No |  Read Only |  No |
| **Mess Facilities** | View Mess Pantry Stock |  All |  All |  Own Mess |  No |  No |
| | Record Daily Meal Consumption |  Yes |  No |  Own Mess |  No |  No |
| | Edit/Correct Today's Headcount |  Yes |  No |  Own Mess |  No |  No |
| | Plan Weekly Meal Menus |  Yes |  No |  Own Mess |  No |  No |
| | View/Submit Diner Feedback |  Yes |  No |  Own Mess |  No |  No |
| **Procurement & POs**| Create Purchase Orders |  Yes |  Yes |  No |  No |  No |
| | View Purchase Orders |  Yes |  Yes |  No |  Yes |  Own POs |
| | Create Dispatch Challan / Gate Pass |  No |  No |  No |  No |  Yes |
| | View Supplier Performance SLA |  Yes |  Yes |  No |  Yes |  Own Score |
| **Finance & Accounts**| Allocate Mess Budgets |  Yes |  No |  No |  Yes |  No |
| | Record & Authorize Payments |  Yes |  No |  No |  Yes |  No |
| | Print Treasury Payment Vouchers |  Yes |  No |  No |  Yes |  No |
| | Mask/Reveal Sensitive Financial Data |  Yes |  No |  No |  Yes |  No |
| | Reconcile Fiscal Audit Trail |  Yes |  No |  No |  Yes |  No |
| **Master Data** | Add / Manage Mess Facilities |  Yes |  No |  No |  No |  No |
| | Add / Onboard Vendors |  Yes |  No |  No |  No |  No |
| | Edit Items & Shelf Life Thresholds |  Yes |  No |  No |  No |  No |
| | Manage User Roles & Appointments |  Yes |  No |  No |  No |  No |
| | Full Tamper-Evident System Audit |  Yes |  No |  No |  Read Only |  No |

---

### 6. Global System-Wide Tools & Utilities

Available across the entire application interface to maximize operational agility:

1. **Universal Command Palette (`Ctrl+K` or `Cmd+K`)**:
   - Instant search across all modules, pages, quick role switching, and master actions from any screen.
2. **Central Multi-Format Data Export Modal**:
   - Click the **Export** icon in the top navigation bar to generate standardized CSV registers, Stock Summaries, or printable ledgers.
3. **Station Notice Board Modal**:
   - Station-wide broadcast communications, severe weather operational bulletins, and delivery schedules.
4. **Interactive Ration Nutrition & Calorie Calculator**:
   - Access official nutrition tables, protein/carb/fat macro distributions, and standard daily calorie entitlements per individual diner.
5. **Interactive Chibi Pot Mascot Assistant**:
   - Helpful in-app mascot offering contextual pantry optimization tips, expiry warnings, and role-specific shortcuts.
6. **High-Altitude Operational Telemetry Gauge**:
   - Compensates boiling temperatures and cooking times based on station altitude (e.g. 11,500 ft elevation adjustment).
7. **High-Precision Expiry Meter**:
   - Color-coded visual alert meter categorizing warehouse stock by freshness (`fresh`, `adequate`, `low`, `expiring`).
8. **Living Design System (`/design-system`)**:
   - Comprehensive gallery of all custom buttons, badges, cards, table controls, form inputs, dialogs, and typography tokens.
9. **Living Brand Identity Specification (`/brand`)**:
   - Complete design and heraldry specification for the **HIMRASAD** brand (color palettes, vector logo lockups, typography guidelines, and institutional standards).

---

### 7. Cyber Security & Defense Controls

1. **Anti-XSS & Script Injection Neutralization**:
   - All text inputs (comments, notes, vendor names, menu items) are sanitized via `sanitizeInput()`, stripping `<script>`, `<iframe>`, `javascript:`, and DOM event handlers.
   - Outbound API requests recursively sanitize JSON payloads.
2. **Content Security Policy (CSP) & Defense Headers**:
   - Embedded meta policy in `index.html` blocking unauthorized origins, object execution, and frame embedding (`X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`).
3. **Anti-Brute Force Sentinel**:
   - Tracks authentication attempts. Exceeding 5 failed sign-ins triggers an automatic 60-second lockout with a live countdown display.
4. **Institutional Inactivity Session Auto-Lock**:
   - Tracks user interactions. Sessions automatically terminate after 15 minutes of inactivity to protect unattended terminal hardware.
5. **Tamper-Evident Security Event Logging**:
   - Records high/critical security events (unauthorized access attempts, invalid tokens, brute-force triggers) into an append-only security log.
6. **Sensitive Identifier Masking**:
   - Banking account numbers and GSTINs are masked by default to protect against shoulder-surfing in public finance rooms.
7. **Production Crash Shield (`ErrorBoundary`)**:
   - Traps unhandled React exceptions, presents a recovery screen with an incident reference ID, and avoids exposing raw code stack traces.

---

### 8. Getting Started & Operational Workflows

#### Starting the Development Server
```bash
npm run dev
```
Open your browser to `http://localhost:5173`.

#### Recommended End-to-End Walkthrough
1. **Log in as Station Administrator** (`admin@messmunch.edu`):
   - Review station telemetry on the **Command Console** (`/admin`).
   - Review registered messes and items catalog.
2. **Switch to Storekeeper** (`storekeeper@messmunch.edu`):
   - Open **Receive Delivery Wizard** (`/store/receive`) and receive delivery against an open PO.
   - Open **Issue To Mess Wizard** (`/store/issue`) and dispatch 50 kg Rice and 25 kg Dal to Falcon Mess.
   - Check the **Stock Ledger** (`/store/ledger`) to see both transactions recorded with zero manual override.
3. **Switch to Mess Manager** (`falcon.manager@messmunch.edu`):
   - Navigate to **Daily Entry** (`/mess`). Notice the newly issued stock ready in pantry.
   - Enter today's diner headcount (e.g. 420) and log today's meal consumption.
   - Check **My Stock** (`/mess/stock`) to watch pantry jars update dynamically.
4. **Switch to Finance Officer** (`finance@messmunch.edu`):
   - Open **Supplier Disbursements** (`/finance/payments`).
   - Click **Disburse Payment**, select the fulfilled PO, and commit payment.
   - Toggle the **Mask/Reveal Identifiers** button to verify sensitive data privacy.
   - View and print the generated **Payment Voucher**.
5. **Switch to Vendor** (`vendor@kisanagro.in`):
   - View newly updated purchase order status and generate a **Consignment Dispatch Gate Pass** (`/vendor/dispatch`).

---
*HIMRASAD System Manual • Institutional Ration Operations • Central Logistics Specification 2026*
