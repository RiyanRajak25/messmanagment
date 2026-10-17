# HIMRASAD — Institutional Mess & Ration Supply Demo Script

> **Operational Scenario:** High-Altitude Campus Ration Provisioning & Closed-Loop Lifecycle  
> **System:** HIMRASAD (Himalayan Ration Supply Command)  
> **Application URL:** [http://localhost:3000](http://localhost:3000)  
> **Living Specification:** [http://localhost:3000/brand](http://localhost:3000/brand)  

---

## 1. Quick Role Credentials & Appointments

The system enforces role-based access control. You can log in via credentials or click the quick-role buttons on the login screen or in the top command bar:

| Appointment / Role | Officer / Appointed Member | Login Email | Primary Command Scope |
| :--- | :--- | :--- | :--- |
| **Store Keeper** | Subedar Ramesh Patel | `storekeeper@messmunch.edu` | Central Supply Depot: Intake, issues, write-offs, PO raising |
| **Mess Manager** | Pooja Singh | `falcon.manager@messmunch.edu` | Falcon Hostel Mess: Daily meal entry (415 diners), pantry reserves |
| **Station Administrator** | Col. Rajesh Verma | `admin@messmunch.edu` | Station HQ Command: Scale catalog, audit log, closed-loop ML forecasts |
| **Finance Officer** | Amit Sharma, IDAS | `finance@messmunch.edu` | Central Accounts Division: Grant utilization, PO payments, disbursement audit |
| **Contractor** | Kisan Agro Products Ltd. | `vendor@kisanagro.in` | Certified Provisions Supplier: External supplier portal |

---

## 2. The 6-Step Closed-Loop Demonstration Walkthrough

Follow this 5-minute walkthrough to test the full operational supply chain cycle:
$$\text{Create PO} \longrightarrow \text{Receive Consignment} \longrightarrow \text{Issue to Mess} \longrightarrow \text{Log Meal Draw} \longrightarrow \text{Forecast Demand} \longrightarrow \text{Audit Trail Inspection}$$

---

### Step 1: Raise a Procurement Indent (Create PO)
1. **Login** as **Subedar Ramesh Patel (Store Keeper)** at [http://localhost:3000/login](http://localhost:3000/login).
2. From the command dashboard or auto-minimizing sidebar, navigate to **Procurement Indents** (`/store/create-po`).
3. **Select Provisions Contractor**: Choose `Kisan Agro Traders` or `Golden Drop Edible Oils`.
4. **Select Scaled Commodity**: Choose `Basmati Rice (A-Grade)`.
5. **Specify Indent Quantity**: Enter `500 kg`.
6. Click **"Authorize & Issue Purchase Order"**.
7. **Expected Result**:
   - A success notification appears in the bottom right: *"Purchase Order (PO) Raised Successfully"*.
   - A new purchase order (e.g., `PO-105`) appears under **Active Consignments in Transit** on the Quartermaster Stock Headquarters.
   - An immutable audit trail record is generated: `action: "PURCHASE_ORDER_CREATED"`.

---

### Step 2: Unload & Receive Consignment at Depot Bay
1. From the sidebar or dashboard, navigate to **Receive Consignment** (`/store/receive`).
2. **Step 1 (Select PO)**: Click on the newly created or open PO card (e.g., `PO-105` or `PO-102`), then click **"Continue to Commodity Intake"**.
3. **Step 2 (Intake Tally)**:
   - Verify contracted quantities.
   - Enter Received Quantity (e.g., `100 kg` for a partial consignment, or full `500 kg`).
   - Notice the over-delivery guard: typing more than the ordered quantity triggers a real-time specification warning.
   - Click **"Continue to Delivery Review & Audit"**.
4. **Step 3 (Commit to Ledger)**:
   - Delivery Challan ID and Vehicle Number are recorded.
   - Click **"Confirm & Commit Consignment Receipt"**.
5. **Expected Result**:
   - Central Depot Silo stock increases dynamically.
   - The altitude gauge for Basmati Rice updates in real-time.
   - Audit trail registers: `action: "DELIVERY_RECEIVED"`.

---

### Step 3: Issue Ration Quota to Dining Hall
1. Navigate to **Issue to Mess** (`/store/issue`).
2. **Select Unit Mess**: Click on **Falcon Hostel Mess** (450 sanctioned capacity).
3. **Add Commodity**:
   - Under Basmati Rice, click the `+50` quick chip or type `50 kg`.
4. Click **"Confirm & Dispatch Stock"**.
5. **Expected Result**:
   - Central Depot on-hand reserve is reduced by `50 kg`.
   - Falcon Mess on-hand pantry reserve increases by `50 kg`.
   - Audit trail registers: `action: "ISSUE_TO_MESS"`, recording actor `Gopal Krishnan (store_keeper)` and target `Falcon Hostel Mess`.

---

### Step 4: Record Daily Meal Ration Consumption
1. Switch to **Pooja Singh (Mess Manager)** via the top header switcher or login screen.
2. Navigate to **Daily Meal Ration Entry** (`/mess`).
3. **Verify Headcount**:
   - Headcount stepper shows **415 diners** (staff, diners, and registered members).
4. **Portion Scale Steppers**:
   - Set Basmati Rice draw to `45 kg`.
   - Notice the real-time over-consumption warning: if the draw exceeds current pantry reserves, the row turns danger-red with an *"Exceeded"* badge.
5. Click **"Submit Today's Meal Entry"** (or click **"Modify Today's Draw"** if already recorded).
6. **Expected Result**:
   - Falcon Hostel Mess on-hand pantry stock is decremented by `45 kg`.
   - An immutable audit log records: `action: "CONSUMPTION_RECORDED"`, recording `415 diners` and item breakdown.

---

### Step 5: Check Closed-Loop ML Demand Forecast
1. Switch to **Col. Rajesh Verma (Administrator)** via the top header switcher.
2. Navigate to **Quartermaster Intelligence • Forecast** (`/admin/forecast`).
3. **Review Machine Learning Metrics**:
   - **Mathematical Model**: Seasonal ARIMA + Exponential Smoothing accounting for weekday dining attendance vs weekend rosters.
   - **Statistical Fit**: Backtested against 90 days of audited meal draws (91.4% confidence).
   - **Waste Prevention Factor**: 0.02% buffer target.
4. **Review 30-Day Projected Demand**:
   - Inspect projected consumption for Basmati Rice, Wheat Atta, and Mustard Oil.
   - Review 8-week historical trend sparklines.
5. Click **"Export Logistics Indent Plan"**.
6. **Expected Result**:
   - Central 30-day provisional ration indent is compiled and exported.

---

### Step 6: Inspect Tamper-Evident Audit Log
1. Navigate to **Master Audit Log** (`/admin/audit`).
2. **Verify Immutable Event Ledger**:
   - The newest records appear at the top:
     - `ISSUE_TO_MESS` (Gopal Krishnan • Falcon Hostel Mess)
     - `DELIVERY_RECEIVED`
     - `PURCHASE_ORDER_CREATED`
     - `CONSUMPTION_RECORDED` (Pooja Verma • 415 diners)
   - Every record is accompanied by a green **SEALED** security badge.
3. **Inspect Mutation Diff**:
   - Click **"Inspect Diff"** on the top record.
   - The inspection modal opens with a gold top border:
     - **Actor**: Name, appointment, and timestamp.
     - **State Before Mutation**: Original JSON state snapshot.
     - **State After Mutation**: Resulting JSON payload with green syntax highlighting.
4. **Export CSV**:
   - Click **"Export Official Audit Log (CSV)"** to download the complete tamper-evident audit ledger with comma-separated event rows and timestamps.

---

## 3. Summary of Demonstrated Architectural Guarantees

1. **Pure Derived Stock**: Stock is never stored as an editable counter in UI state; it is mathematically derived from the append-only transaction ledger.
2. **Cryptographic Role Isolation**: Mess Managers cannot access Central Depot PO creation or Accounts ledgers; attempting to access `/finance` immediately directs to the 4,800m altitude barrier checkpoint (`/403`).
3. **Zero Cartoon Mascots**: Complete Himalayan institutional design system with structured typography, altitude gauges, and disciplined contrast.
