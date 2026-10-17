import React, { useState } from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { PortionStepper } from '../components/PortionStepper';
import { PantryJar } from '../components/PantryJar';
import { ExpiryMeter } from '../components/ExpiryMeter';
import { StatusChip } from '../components/StatusChip';
import { Input } from '../components/Input';
import { Select } from '../components/Select';
import { Tabs } from '../components/Tabs';
import { StatTile } from '../components/StatTile';
import { EmptyState } from '../components/EmptyState';
import { Modal } from '../components/Modal';
import { Drawer } from '../components/Drawer';
import { Skeleton } from '../components/Skeleton';
import { ChibiPotMascot } from '../components/ChibiPotMascot';
import { useToast } from '../components/Toast';
import {
  Sparkles,
  ShoppingBag,
  TrendingUp,
  AlertTriangle,
  ArrowRight,
  Flame,
  Layers,
  Palette,
  Type,
  Maximize2,
  Box,
} from 'lucide-react';

export const DesignSystem: React.FC = () => {
  const { toast, celebrate } = useToast();

  // Interactive component states
  const [stepperVal, setStepperVal] = useState(25.5);
  const [activeTab, setActiveTab] = useState('components');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [inputText, setInputText] = useState('');

  const designTokens = {
    colors: [
      { name: 'Sunny Egg Yolk', hex: '#FFC83B', role: 'Primary Action / Focus / Hero Fills', text: 'text-ink' },
      { name: 'Ripe Tomato', hex: '#FF5A36', role: 'Urgent Alerts / Destructive / Timers', text: 'text-white' },
      { name: 'Fresh Mint', hex: '#4EBA6F', role: 'Healthy Reserves / Success States', text: 'text-white' },
      { name: 'Steamed Rice Cream', hex: '#FFFDF8', role: 'Canvas Surface Background', text: 'text-ink' },
      { name: 'Warm Charcoal Ink', hex: '#2B231D', role: 'Outlines (2.5px), Drop Shadows, Primary Text', text: 'text-white' },
      { name: 'Toasted Bread Crust', hex: '#5C3A21', role: 'Secondary Text, Dividers, Card Accents', text: 'text-white' },
    ],
  };

  return (
    <div className="flex flex-col gap-12 pb-16">
      {/* Living Style Guide Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b-2.5 border-ink">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-yolk border-2 border-ink text-ink text-xs font-extrabold uppercase tracking-wider mb-2 shadow-chibi-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Figma Replacement • Living Style Guide</span>
          </div>
          <h1 className="font-display font-extrabold text-3xl md:text-5xl text-ink tracking-tight">
            Chibi Kitchen Design System
          </h1>
          <p className="font-body text-base text-crust mt-1 max-w-2xl font-semibold">
            Tactile Anime-Kitchen Neo-Brutalism specification: 2.5px solid ink strokes, hard unblurred offset shadows, pill controls, and high-density calm tables.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="mint"
            onClick={() => {
              celebrate();
              toast({ title: 'Sparkle Burst!', message: 'Confetti simulation triggered successfully.' });
            }}
            icon={<Sparkles className="w-4 h-4" />}
          >
            Trigger Celebration
          </Button>
        </div>
      </div>

      {/* SECTION 1: DESIGN TOKENS (Colors, Shadows, Radii) */}
      <section className="flex flex-col gap-6">
        <div className="flex items-center gap-2">
          <Palette className="w-6 h-6 text-tomato stroke-[2.5]" />
          <h2 className="font-display font-extrabold text-2xl text-ink">01. Ingredient Color Tokens</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {designTokens.colors.map((c) => (
            <div
              key={c.hex}
              className="chibi-card p-4 flex flex-col justify-between bg-canvas shadow-chibi-sm"
            >
              <div
                className={`w-full h-20 rounded-2xl border-2 border-ink mb-3 flex items-end p-2.5 shadow-inner ${c.text}`}
                style={{ backgroundColor: c.hex }}
              >
                <span className="font-mono text-xs font-bold bg-ink/75 text-white px-2 py-0.5 rounded-full">
                  {c.hex}
                </span>
              </div>
              <div>
                <h4 className="font-extrabold text-base text-ink">{c.name}</h4>
                <p className="text-xs text-crust font-medium mt-0.5">{c.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 2: INSTITUTIONAL OPERATIONS INSIGNIA */}
      <section className="flex flex-col gap-6">
        <div className="flex items-center gap-2">
          <Flame className="w-6 h-6 text-gold stroke-[2.5]" />
          <h2 className="font-display font-extrabold text-2xl text-ink">02. Official Institutional Insignia &amp; Security Seals</h2>
        </div>

        <Card className="grid grid-cols-2 sm:grid-cols-4 gap-6 items-center text-center">
          <div className="flex flex-col items-center">
            <ChibiPotMascot size="md" mood="happy" />
            <span className="text-xs font-extrabold text-ink mt-3">Verified / Quota Ok</span>
            <span className="text-[10px] font-mono text-sand">Golden Laurel Crest</span>
          </div>
          <div className="flex flex-col items-center">
            <ChibiPotMascot size="md" mood="cooking" />
            <span className="text-xs font-extrabold text-ink mt-3">Station Active</span>
            <span className="text-[10px] font-mono text-sand">Telemetry Sweep</span>
          </div>
          <div className="flex flex-col items-center">
            <ChibiPotMascot size="md" mood="alert" />
            <span className="text-xs font-extrabold text-ink mt-3">Quota Warning</span>
            <span className="text-[10px] font-mono text-sand">Perimeter Alert</span>
          </div>
          <div className="flex flex-col items-center">
            <ChibiPotMascot size="md" mood="locked" />
            <span className="text-xs font-extrabold text-ink mt-3">Restricted Sector</span>
            <span className="text-[10px] font-mono text-sand">403 Cryptographic Lock</span>
          </div>
        </Card>
      </section>

      {/* SECTION 3: BUTTON VARIANTS & STATES */}
      <section className="flex flex-col gap-6">
        <div className="flex items-center gap-2">
          <Box className="w-6 h-6 text-mint stroke-[2.5]" />
          <h2 className="font-display font-extrabold text-2xl text-ink">03. Tactile Push Buttons & States</h2>
        </div>

        <Card className="flex flex-col gap-6">
          <div>
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-crust mb-3">
              Variants (Primary Yolk, Danger Tomato, Mint Success, Soft Surface, Ghost):
            </h4>
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="primary" onClick={() => toast({ title: 'Primary clicked' })}>
                Primary Sunny Yolk
              </Button>
              <Button variant="danger" onClick={() => toast({ type: 'error', title: 'Destructive action' })}>
                Urgent Tomato
              </Button>
              <Button variant="mint" onClick={() => toast({ type: 'success', title: 'Healthy confirmation' })}>
                Mint Success
              </Button>
              <Button variant="soft" onClick={() => toast({ type: 'info', title: 'Soft container action' })}>
                Soft Neutral
              </Button>
              <Button variant="ghost">Ghost Button</Button>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-crust mb-3">
              Sizes & States (Loading spinner, Disabled, With Icons):
            </h4>
            <div className="flex flex-wrap items-center gap-3">
              <Button size="sm" variant="primary">Small Pill</Button>
              <Button size="md" variant="primary">Standard Pill</Button>
              <Button size="lg" variant="primary" icon={<ArrowRight className="w-5 h-5 stroke-[2.5]" />}>
                Large Hero
              </Button>
              <Button variant="primary" isLoading>
                Submitting
              </Button>
              <Button variant="primary" disabled>
                Disabled State
              </Button>
            </div>
          </div>
        </Card>
      </section>

      {/* SECTION 4: SIGNATURE COMPONENTS (Jars, Stepper, Expiry) */}
      <section className="flex flex-col gap-6">
        <div className="flex items-center gap-2">
          <Layers className="w-6 h-6 text-yolk stroke-[2.5]" />
          <h2 className="font-display font-extrabold text-2xl text-ink">04. Signature Mess Ration Components</h2>
        </div>

        {/* 4.1 Pantry Jars */}
        <div>
          <h3 className="font-display font-bold text-lg text-ink mb-3">
            7.1 Pantry Jars (Dynamic Fluid Level, Highlight Reflection, Wobble Alert)
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <PantryJar
              name="Basmati Rice (A-Grade)"
              quantity={480}
              unit="kg"
              maxCapacity={600}
              daysLeft={18}
              status="fresh"
              category="Grains"
            />
            <PantryJar
              name="Toor Dal (Yellow Lentil)"
              quantity={210}
              unit="kg"
              maxCapacity={400}
              daysLeft={9}
              status="adequate"
              category="Pulses"
            />
            <PantryJar
              name="Sunflower Cooking Oil"
              quantity={45}
              unit="litre"
              maxCapacity={300}
              daysLeft={2}
              status="low"
              category="Oils"
            />
            <PantryJar
              name="Fresh Paneer Blocks"
              quantity={20}
              unit="kg"
              maxCapacity={100}
              daysLeft={1}
              status="expiring"
              category="Dairy"
            />
          </div>
        </div>

        {/* 4.2 Portion Stepper & Expiry Meter */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-2">
          <Card>
            <h3 className="font-display font-bold text-lg text-ink mb-2">
              7.2 Portion Stepper (Long-press accelerate & typed edit)
            </h3>
            <p className="text-xs text-crust mb-4">
              Capsule shape with vertical internal dividers. Tap the number to type directly, hold [+] or [−] to rapidly increment.
            </p>
            <div className="flex flex-wrap items-center gap-6">
              <PortionStepper
                value={stepperVal}
                onChange={setStepperVal}
                unit="kg"
                step={0.5}
              />
              <PortionStepper
                value={420}
                onChange={() => {}}
                unit="heads"
                step={5}
              />
            </div>
            <p className="text-xs font-bold text-ink mt-3">
              Active bound value: <span className="tabular-nums text-tomato">{stepperVal} kg</span>
            </p>
          </Card>

          <Card>
            <h3 className="font-display font-bold text-lg text-ink mb-2">
              7.3 Pantry Expiry Meter
            </h3>
            <p className="text-xs text-crust mb-4">
              Segmented pill droplets color-shifting green → orange as shelf-life elapses.
            </p>
            <div className="flex flex-col gap-4">
              <ExpiryMeter daysLeft={14} totalShelfLifeDays={180} />
              <ExpiryMeter daysLeft={4} totalShelfLifeDays={15} />
              <ExpiryMeter daysLeft={1} totalShelfLifeDays={5} />
            </div>
          </Card>
        </div>
      </section>

      {/* SECTION 5: STATUS CHIPS & BADGES */}
      <section className="flex flex-col gap-6">
        <h2 className="font-display font-extrabold text-2xl text-ink">05. Status Chips & Transaction Badges</h2>
        <Card className="flex flex-col gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-crust block mb-2">
              Purchase Order Lifecycle:
            </span>
            <div className="flex flex-wrap gap-2">
              <StatusChip type="po" value="open" />
              <StatusChip type="po" value="partially_received" />
              <StatusChip type="po" value="closed" />
              <StatusChip type="po" value="cancelled" />
            </div>
          </div>

          <div className="pt-2 border-t border-ink/10">
            <span className="text-xs font-bold uppercase tracking-wider text-crust block mb-2">
              Stock Transaction Types (In/Out Direction):
            </span>
            <div className="flex flex-wrap gap-2">
              <StatusChip type="transaction" value="receipt" />
              <StatusChip type="transaction" value="issue" />
              <StatusChip type="transaction" value="adjustment" />
              <StatusChip type="transaction" value="return" />
            </div>
          </div>

          <div className="pt-2 border-t border-ink/10">
            <span className="text-xs font-bold uppercase tracking-wider text-crust block mb-2">
              Inventory Reserve Status:
            </span>
            <div className="flex flex-wrap gap-2">
              <StatusChip type="stock" value="fresh" />
              <StatusChip type="stock" value="adequate" />
              <StatusChip type="stock" value="low" />
              <StatusChip type="stock" value="expiring" />
            </div>
          </div>
        </Card>
      </section>

      {/* SECTION 6: FORM CONTROLS & BENTO STAT TILES */}
      <section className="flex flex-col gap-6">
        <h2 className="font-display font-extrabold text-2xl text-ink">06. Inputs, Selects & Bento Stat Tiles</h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="flex flex-col gap-4">
            <h3 className="font-display font-bold text-lg text-ink">Form Controls</h3>
            <Input
              label="Item Search Query"
              placeholder="e.g. Basmati Rice, Toor Dal..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              hint="Pill-shaped input with 2.5px solid ink border & yolk focus shadow."
            />
            <Input
              label="Input with Error"
              defaultValue="-10"
              error="Negative portion quantities are strictly forbidden."
            />
            <Select
              label="Ration Category Filter"
              options={[
                { label: 'All Categories', value: 'all' },
                { label: 'Grains & Cereals', value: 'grains' },
                { label: 'Pulses & Lentils', value: 'pulses' },
                { label: 'Oils & Fats', value: 'oils' },
              ]}
            />
          </Card>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <StatTile
              label="Total Central Stock"
              value="4,820"
              unit="kg"
              subValue="Across 31 items"
              trend={{ value: '+12%', isPositive: true, label: 'vs last week' }}
              icon={<ShoppingBag className="w-5 h-5" />}
              accentColor="yolk"
            />
            <StatTile
              label="Active Alerts"
              value="3"
              subValue="2 low stock, 1 expiring"
              trend={{ value: 'Action req.', isPositive: false }}
              icon={<AlertTriangle className="w-5 h-5" />}
              accentColor="tomato"
            />
            <StatTile
              label="Headcount Fed Today"
              value="824"
              unit="plates"
              subValue="Falcon & Eagle Mess"
              trend={{ value: '98% RSVP', isPositive: true }}
              icon={<TrendingUp className="w-5 h-5" />}
              accentColor="mint"
            />
            <StatTile
              label="Monthly Spend"
              value="₹1,52,450"
              subValue="Budget ₹3,50,000 (43%)"
              icon={<Flame className="w-5 h-5" />}
              accentColor="crust"
            />
          </div>
        </div>
      </section>

      {/* SECTION 7: DENSE DATA TABLES (Calm Styling per Section 2) */}
      <section className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display font-extrabold text-2xl text-ink">
              07. Calm High-Density Table
            </h2>
            <p className="text-xs text-crust font-medium mt-0.5">
              Outer 1.5px ink border only, subtle 15% opacity dividers, tabular numerals, 14px text.
            </p>
          </div>
        </div>

        <div className="table-chibi overflow-x-auto shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr>
                <th>Item Description</th>
                <th>Category</th>
                <th>On-Hand Qty</th>
                <th>Reorder Threshold</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="font-bold text-ink">Basmati Rice (A-Grade)</td>
                <td>Grains & Cereals</td>
                <td className="font-bold">480.00 kg</td>
                <td>300.00 kg</td>
                <td><StatusChip type="stock" value="fresh" size="sm" /></td>
                <td><Button size="sm" variant="soft">Issue</Button></td>
              </tr>
              <tr>
                <td className="font-bold text-ink">Toor Dal (Yellow Lentil)</td>
                <td>Pulses & Lentils</td>
                <td className="font-bold">210.00 kg</td>
                <td>200.00 kg</td>
                <td><StatusChip type="stock" value="adequate" size="sm" /></td>
                <td><Button size="sm" variant="soft">Issue</Button></td>
              </tr>
              <tr>
                <td className="font-bold text-ink">Sunflower Cooking Oil</td>
                <td>Oils & Fats</td>
                <td className="font-bold text-tomato">45.00 litres</td>
                <td>150.00 litres</td>
                <td><StatusChip type="stock" value="low" size="sm" /></td>
                <td><Button size="sm" variant="danger">Reorder</Button></td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* SECTION 8: OVERLAYS (Modal & Drawer) */}
      <section className="flex flex-col gap-6">
        <h2 className="font-display font-extrabold text-2xl text-ink">08. Modals, Drawers & Empty States</h2>
        <Card className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="font-extrabold text-base text-ink">Overlay Components</h4>
            <p className="text-xs text-crust">
              Modals use 8px solid shadow with 40% ink scrim. Drawers slide smoothly with spring physics.
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="primary" onClick={() => setIsModalOpen(true)}>
              Open Sample Modal
            </Button>
            <Button variant="soft" onClick={() => setIsDrawerOpen(true)}>
              Open Audit Drawer
            </Button>
          </div>
        </Card>

        {/* Empty State Showcase */}
        <EmptyState
          title="No Delivery Sacks Awaiting Unloading"
          description="Central silo is currently calm and fully restocked. All vendor consignments for this shift have been processed into the transaction ledger."
          actionLabel="Raise New Purchase Order"
          onAction={() => toast({ title: 'Navigating to PO Wizard' })}
          mood="happy"
        />
      </section>

      {/* Interactive Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Confirm Stock Dispatch"
        description="This action will deduct inventory from Central Store and record an audit log."
      >
        <p className="text-sm text-ink mb-4 font-medium">
          Are you sure you want to issue <strong className="font-bold">50 kg Basmati Rice</strong> to Falcon Hostel Mess?
        </p>
        <div className="flex justify-end gap-2">
          <Button variant="soft" onClick={() => setIsModalOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              setIsModalOpen(false);
              toast({ title: 'Stock Dispatched', message: 'Logged in audit trail ✓' });
            }}
          >
            Confirm Dispatch
          </Button>
        </div>
      </Modal>

      {/* Interactive Drawer */}
      <Drawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title="Audit Trail Record Details"
        subtitle="ID: aud-10293 • Immutable Transaction Ledger"
      >
        <div className="flex flex-col gap-4 text-xs font-mono">
          <div className="p-3 bg-surface-container-low border border-ink/20 rounded-xl">
            <p className="font-bold text-ink">ACTOR: Gopal Krishnan (Store Keeper)</p>
            <p className="text-crust">ACTION: RECEIVE_DELIVERY</p>
            <p className="text-crust">TIMESTAMP: 2026-10-13 14:30:00 IST</p>
          </div>
          <div>
            <h5 className="font-bold text-ink font-body mb-1">State Diff:</h5>
            <pre className="p-3 bg-ink text-[#FFFDF8] rounded-xl overflow-x-auto text-[11px]">
              {JSON.stringify(
                {
                  before: { status: 'open', received: 0 },
                  after: { status: 'partially_received', received: 180 },
                },
                null,
                2
              )}
            </pre>
          </div>
        </div>
      </Drawer>
    </div>
  );
};
