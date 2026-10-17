import React, { useState } from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import { StatTile } from './StatTile';
import {
  Flame,
  Scale,
  Activity,
  HeartPulse,
  Apple,
  TrendingUp,
  Download,
  Info,
  CheckCircle2,
} from 'lucide-react';

interface RationNutritionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RationNutritionModal: React.FC<RationNutritionModalProps> = ({ isOpen, onClose }) => {
  const [dinersCount, setDinersCount] = useState<number>(320);
  const [scaleType, setScaleType] = useState<'high_altitude' | 'standard_plains'>('high_altitude');
  const [dietaryType, setDietaryType] = useState<'vegetarian' | 'regular_mixed'>('regular_mixed');

  // Ration consumption standard factors per diner
  const isHighAlt = scaleType === 'high_altitude';

  // Target kcal
  const targetKcal = isHighAlt ? 3850 : 3050;
  const targetProteinG = isHighAlt ? 115 : 95;
  const targetCarbsG = isHighAlt ? 520 : 420;
  const targetFatG = isHighAlt ? 110 : 80;

  // Breakdown across meals
  const mealDistribution = [
    {
      meal: 'Morning Breakfast',
      time: '06:30 - 08:30 IST',
      items: isHighAlt
        ? 'Dalia Porridge with Fortified Milk, Boiled Eggs / Chana, Whole Wheat Parathas, Tea with Jaggery'
        : 'Poha / Upma with Peanuts, Boiled Eggs / Sprouts, Chai, Bananas',
      kcal: Math.round(targetKcal * 0.28),
      protein: Math.round(targetProteinG * 0.26),
      carbs: Math.round(targetCarbsG * 0.3),
      fat: Math.round(targetFatG * 0.25),
    },
    {
      meal: 'Midday Lunch',
      time: '12:00 - 14:00 IST',
      items:
        'Chana Dal Tadka, Seasonal Sabzi (Potatoes & Peas), Steamed Basmati Rice, Fresh Tandoori Rotis, Curd / Buttermilk',
      kcal: Math.round(targetKcal * 0.4),
      protein: Math.round(targetProteinG * 0.42),
      carbs: Math.round(targetCarbsG * 0.42),
      fat: Math.round(targetFatG * 0.38),
    },
    {
      meal: 'Evening Dinner',
      time: '19:00 - 21:00 IST',
      items: dietaryType === 'regular_mixed'
        ? 'Egg Curry / Paneer Bhurji, Arhar Dal Fry, Jeera Rice, Whole Wheat Phulkas, Gur (Jaggery)'
        : 'Matar Paneer, Rajma Masala, Steamed Rice, Whole Wheat Phulkas, Gur (Jaggery)',
      kcal: Math.round(targetKcal * 0.32),
      protein: Math.round(targetProteinG * 0.32),
      carbs: Math.round(targetCarbsG * 0.28),
      fat: Math.round(targetFatG * 0.37),
    },
  ];

  const totalFlourDailyKg = Math.round((dinersCount * (isHighAlt ? 0.45 : 0.38)));
  const totalRiceDailyKg = Math.round((dinersCount * (isHighAlt ? 0.25 : 0.2)));
  const totalDalDailyKg = Math.round((dinersCount * (isHighAlt ? 0.15 : 0.12)));
  const totalOilDailyL = Math.round((dinersCount * (isHighAlt ? 0.08 : 0.06)));

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Ration Scale Nutritional & Calorie Breakdown"
      description="Calculate institutional dietary standards, caloric energy quotas, and macro-nutritional balances."
      maxWidth="xl"
    >
      <div className="flex flex-col gap-5 font-body text-pine text-xs">
        {/* Controls Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 bg-snow rounded-card border border-sand/60">
          <div>
            <label className="block text-[11px] font-heading font-bold text-olive uppercase mb-1">
              Active Dining Strength
            </label>
            <input
              type="number"
              min={10}
              max={2000}
              value={dinersCount}
              onChange={(e) => setDinersCount(Math.max(1, parseInt(e.target.value) || 0))}
              className="w-full px-3 py-1.5 font-mono font-bold text-xs rounded-control border border-sand bg-white text-olive-deep focus:outline-none focus:border-olive"
            />
          </div>

          <div>
            <label className="block text-[11px] font-heading font-bold text-olive uppercase mb-1">
              Operational Terrain Scale
            </label>
            <select
              value={scaleType}
              onChange={(e) => setScaleType(e.target.value as any)}
              className="w-full px-3 py-1.5 font-sans text-xs rounded-control border border-sand bg-white text-olive-deep focus:outline-none focus:border-olive"
            >
              <option value="high_altitude">High-Altitude Extreme (3,850 kcal)</option>
              <option value="standard_plains">Standard Station Scale (3,050 kcal)</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-heading font-bold text-olive uppercase mb-1">
              Dietary Composition
            </label>
            <select
              value={dietaryType}
              onChange={(e) => setDietaryType(e.target.value as any)}
              className="w-full px-3 py-1.5 font-sans text-xs rounded-control border border-sand bg-white text-olive-deep focus:outline-none focus:border-olive"
            >
              <option value="regular_mixed">Standard Mixed (Egg &amp; Dairy)</option>
              <option value="vegetarian">Pure Vegetarian (Pulse &amp; Paneer)</option>
            </select>
          </div>
        </div>

        {/* Nutritional Target Bento Tiles */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 bg-white border border-sand/60 rounded-card shadow-subtle border-l-4 border-l-gold">
            <span className="text-[10px] font-heading font-bold text-olive uppercase">Caloric Intake</span>
            <div className="text-xl font-heading font-extrabold text-olive-deep mt-0.5">
              {targetKcal} <span className="text-xs font-normal text-pine/60">kcal/d</span>
            </div>
            <span className="text-[10px] text-success font-bold font-mono">100% Scale Quota</span>
          </div>

          <div className="p-3 bg-white border border-sand/60 rounded-card shadow-subtle border-l-4 border-l-glacier">
            <span className="text-[10px] font-heading font-bold text-olive uppercase">Daily Protein</span>
            <div className="text-xl font-heading font-extrabold text-olive-deep mt-0.5">
              {targetProteinG} <span className="text-xs font-normal text-pine/60">g/d</span>
            </div>
            <span className="text-[10px] text-glacier font-bold font-mono">Tissue Repair</span>
          </div>

          <div className="p-3 bg-white border border-sand/60 rounded-card shadow-subtle border-l-4 border-l-olive">
            <span className="text-[10px] font-heading font-bold text-olive uppercase">Complex Carbs</span>
            <div className="text-xl font-heading font-extrabold text-olive-deep mt-0.5">
              {targetCarbsG} <span className="text-xs font-normal text-pine/60">g/d</span>
            </div>
            <span className="text-[10px] text-olive font-bold font-mono">Endurance Energy</span>
          </div>

          <div className="p-3 bg-white border border-sand/60 rounded-card shadow-subtle border-l-4 border-l-sand">
            <span className="text-[10px] font-heading font-bold text-olive uppercase">Essential Fats</span>
            <div className="text-xl font-heading font-extrabold text-olive-deep mt-0.5">
              {targetFatG} <span className="text-xs font-normal text-pine/60">g/d</span>
            </div>
            <span className="text-[10px] text-pine/60 font-bold font-mono">Cold Thermogenesis</span>
          </div>
        </div>

        {/* Meal-by-Meal Distribution Table */}
        <div className="border border-sand/60 rounded-card overflow-hidden bg-white shadow-subtle">
          <div className="p-3 bg-snow border-b border-sand/40 flex items-center justify-between">
            <span className="font-heading font-extrabold text-xs text-olive-deep uppercase tracking-wider">
              Meal-by-Meal Nutritional Allotment (Per Diner)
            </span>
            <span className="font-mono text-[10px] text-pine/60">
              Total Diners: <strong>{dinersCount} Personnel</strong>
            </span>
          </div>

          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-snow/60 border-b border-sand/30 font-heading font-bold text-[10px] text-olive uppercase tracking-wider">
                <th className="p-2.5">Meal Window</th>
                <th className="p-2.5">Scaled Menu Composition</th>
                <th className="p-2.5 text-right">Energy (kcal)</th>
                <th className="p-2.5 text-right">Protein</th>
                <th className="p-2.5 text-right">Carbs</th>
                <th className="p-2.5 text-right">Fats</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sand/20 text-xs">
              {mealDistribution.map((m, idx) => (
                <tr key={idx} className="hover:bg-snow/40">
                  <td className="p-2.5 font-bold text-olive-deep">
                    <div>{m.meal}</div>
                    <div className="text-[10px] font-mono text-pine/50 font-normal">{m.time}</div>
                  </td>
                  <td className="p-2.5 text-pine/80 text-[11px] max-w-xs">{m.items}</td>
                  <td className="p-2.5 text-right font-mono font-bold text-olive-deep">{m.kcal}</td>
                  <td className="p-2.5 text-right font-mono text-pine">{m.protein}g</td>
                  <td className="p-2.5 text-right font-mono text-pine">{m.carbs}g</td>
                  <td className="p-2.5 text-right font-mono text-pine">{m.fat}g</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Aggregated Daily Kitchen Draw Quantities */}
        <div className="p-3.5 bg-snow rounded-card border border-sand/60 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="font-heading font-extrabold text-xs text-olive-deep uppercase tracking-wider">
              Total Recommended Daily Kitchen Commodity Draw for {dinersCount} Diners
            </span>
            <span className="text-[10px] font-mono text-gold font-bold bg-night px-2 py-0.5 rounded">
              DERIVED SCALE
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-1">
            <div className="p-2.5 bg-white rounded-control border border-sand/40">
              <span className="text-pine/60 text-[11px] block">Atta / Whole Wheat Flour:</span>
              <strong className="font-mono text-sm text-olive-deep">{totalFlourDailyKg} kg / day</strong>
            </div>
            <div className="p-2.5 bg-white rounded-control border border-sand/40">
              <span className="text-pine/60 text-[11px] block">Rice (Non-Basmati):</span>
              <strong className="font-mono text-sm text-olive-deep">{totalRiceDailyKg} kg / day</strong>
            </div>
            <div className="p-2.5 bg-white rounded-control border border-sand/40">
              <span className="text-pine/60 text-[11px] block">Pulses / Dal Mix:</span>
              <strong className="font-mono text-sm text-olive-deep">{totalDalDailyKg} kg / day</strong>
            </div>
            <div className="p-2.5 bg-white rounded-control border border-sand/40">
              <span className="text-pine/60 text-[11px] block">Cooking Oil / Vanaspati:</span>
              <strong className="font-mono text-sm text-olive-deep">{totalOilDailyL} Litres / day</strong>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2 border-t border-sand/40">
          <Button variant="primary" size="sm" onClick={onClose}>
            Done &amp; Return to Dashboard
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default RationNutritionModal;
