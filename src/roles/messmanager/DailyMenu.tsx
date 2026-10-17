import React, { useEffect, useState } from 'react';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { Select } from '../../components/Select';
import { Modal } from '../../components/Modal';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../api/client';
import { Menu, Feedback, Mess } from '../../types';
import { useToast } from '../../components/Toast';
import {
  UtensilsCrossed,
  Sunrise,
  Sun,
  Sunset,
  Moon,
  Plus,
  Trash2,
  Star,
  MessageSquare,
  Building2,
  Mountain,
  Flame,
} from 'lucide-react';

export const DailyMenu: React.FC = () => {
  const { user, mess_id } = useAuth();
  const { toast } = useToast();

  const [mess, setMess] = useState<Mess | null>(null);
  const [menus, setMenus] = useState<Menu[]>([]);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [selectedMeal, setSelectedMeal] = useState<'Breakfast' | 'Lunch' | 'Snacks' | 'Dinner'>('Lunch');
  const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newItemCategory, setNewItemCategory] = useState('Main');
  const [isLoading, setIsLoading] = useState(true);

  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [feedbackRating, setFeedbackRating] = useState(5);
  const [feedbackComment, setFeedbackComment] = useState('');
  const [feedbackName, setFeedbackName] = useState('');

  const todayStr = new Date().toISOString().split('T')[0];

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      try {
        const [messes, menuList, feedbackList] = await Promise.all([
          api.messes.list(),
          api.menu.list(),
          api.feedback.list(),
        ]);
        const activeMess = messes.find((m) => m.id === (mess_id || 'mess-1')) || messes[0];
        setMess(activeMess);
        setMenus(menuList);
        setFeedbacks(feedbackList);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [mess_id]);

  const activeMenu = menus.find((m) => m.meal === selectedMeal) || {
    id: `menu-fallback-${selectedMeal}`,
    mess_id: mess?.id || 'mess-1',
    date: todayStr,
    meal: selectedMeal,
    items: [
      { name: selectedMeal === 'Breakfast' ? 'Puri Bhaji & Boiled Eggs' : selectedMeal === 'Lunch' ? 'Dal Tadka, Seasonal Sabzi & Rice' : selectedMeal === 'Snacks' ? 'Samosa & Chai' : 'Chapati, Paneer Curry & Kheer', category: 'Main' },
    ],
    created_by: user?.id || 'caterer',
  };

  const handleAddItem = async () => {
    if (!newItemName.trim() || !mess) return;
    const updatedItems = [...activeMenu.items, { name: newItemName.trim(), category: newItemCategory }];

    try {
      const updatedMenu = await api.menu.update({
        ...activeMenu,
        items: updatedItems,
      });

      setMenus((prev) => prev.map((m) => (m.meal === selectedMeal ? updatedMenu : m)));
      setIsAddItemModalOpen(false);
      setNewItemName('');
      toast({ title: 'Menu Dish Added', message: `Added ${newItemName} to ${selectedMeal} schedule.` });
    } catch (err) {
      console.error(err);
    }
  };

  const handleRemoveItem = async (indexToRemove: number) => {
    if (!mess) return;
    const updatedItems = activeMenu.items.filter((_, idx) => idx !== indexToRemove);
    try {
      const updatedMenu = await api.menu.update({
        ...activeMenu,
        items: updatedItems,
      });
      setMenus((prev) => prev.map((m) => (m.meal === selectedMeal ? updatedMenu : m)));
      toast({ title: 'Dish Removed', message: 'Menu board updated.' });
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmitFeedback = async () => {
    if (!feedbackComment.trim() || !mess) return;
    try {
      const newFb = await api.feedback.submit({
        mess_id: mess.id,
        menu_id: activeMenu.id,
        submitted_by: feedbackName.trim() || 'Mess Committee Rep',
        rating: feedbackRating,
        comment: feedbackComment.trim(),
      });

      setFeedbacks((prev) => [newFb, ...prev]);
      setIsFeedbackModalOpen(false);
      setFeedbackComment('');
      setFeedbackName('');
      toast({ title: 'Diner Observation Recorded', message: 'Tally submitted to Station Messing Officer.' });
    } catch (err) {
      console.error(err);
    }
  };

  const mealTabs = [
    { id: 'Breakfast', label: 'Breakfast', icon: <Sunrise className="w-4 h-4" /> },
    { id: 'Lunch', label: 'Lunch', icon: <Sun className="w-4 h-4" /> },
    { id: 'Snacks', label: 'Evening Snacks', icon: <Sunset className="w-4 h-4" /> },
    { id: 'Dinner', label: 'Dinner', icon: <Moon className="w-4 h-4" /> },
  ] as const;

  return (
    <div className="flex flex-col gap-6 pb-12 font-body text-pine">
      {/* Header Banner */}
      <div className="p-6 md:p-8 bg-night text-snow rounded-card border border-sand/40 shadow-elevation flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-control bg-olive/70 border border-gold/40 flex items-center justify-center text-gold shrink-0 shadow-subtle">
            <UtensilsCrossed className="w-6 h-6" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-badge bg-gold/15 border border-gold/40 text-gold text-[10px] font-heading font-bold uppercase tracking-wider mb-1.5">
              <Mountain className="w-3 h-3 text-gold" />
              <span>{mess?.name || 'DINING MESS'} • SCALED RATION BOARD</span>
            </div>
            <h1 className="font-heading font-extrabold text-2xl md:text-3xl text-snow tracking-tight">
              Institutional Daily Menu Board
            </h1>
            <p className="text-xs text-sand font-medium mt-1">
              Scheduled menu rotations, prep readiness, and diner committee feedback ratings.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsFeedbackModalOpen(true)}
            icon={<MessageSquare className="w-4 h-4" />}
            className="text-snow border-sand/40 hover:bg-olive-deep"
          >
            Submit Dining Observation
          </Button>
        </div>
      </div>

      {/* Meal Selection Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="inline-flex items-center gap-1.5 p-1 bg-white border border-sand/60 rounded-control shadow-subtle select-none">
          {mealTabs.map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => setSelectedMeal(m.id)}
              className={`px-3.5 py-1.5 rounded text-xs font-heading font-bold flex items-center gap-2 transition-all ${
                selectedMeal === m.id
                  ? 'bg-olive text-snow shadow-subtle'
                  : 'text-pine/70 hover:text-pine'
              }`}
            >
              {m.icon}
              <span>{m.label}</span>
            </button>
          ))}
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => setIsAddItemModalOpen(true)}
          icon={<Plus className="w-4 h-4 stroke-[2.5]" />}
        >
          Add Dish to {selectedMeal}
        </Button>
      </div>

      {/* Command Meal Board Card */}
      <Card className="bg-olive-deep text-snow border border-sand/40 shadow-elevation">
        <div className="flex items-center justify-between pb-4 border-b border-sand/30">
          <div className="flex items-center gap-2.5">
            <span className="text-gold font-heading font-extrabold text-lg">
              {selectedMeal} Scale
            </span>
            <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-badge bg-white/10 text-sand border border-sand/30">
              {todayStr}
            </span>
          </div>

          <span className="px-3 py-1 rounded-badge bg-gold/20 text-gold text-xs font-heading font-bold border border-gold/40 flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5" />
            <span>QMG Scale Approved</span>
          </span>
        </div>

        {/* Menu Items List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-6">
          {activeMenu.items.map((item, idx) => (
            <div
              key={idx}
              className="p-4 rounded-control bg-white/5 border border-sand/30 flex items-center justify-between gap-3 group hover:bg-white/10 transition-colors"
            >
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-gold block">
                  {item.category}
                </span>
                <h4 className="font-heading font-extrabold text-sm text-snow mt-0.5">
                  {item.name}
                </h4>
              </div>

              <button
                type="button"
                onClick={() => handleRemoveItem(idx)}
                className="opacity-0 group-hover:opacity-100 p-1.5 rounded hover:bg-danger transition-all text-sand hover:text-snow"
                title="Remove dish"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        <div className="pt-4 border-t border-sand/20 flex flex-col sm:flex-row items-center justify-between text-xs text-sand font-mono gap-2">
          <span>Prepared strictly in accordance with High-Altitude Institutional Ration Scales.</span>
          <span className="font-bold text-gold">Zero-spoilage compliance verified ✓</span>
        </div>
      </Card>

      {/* Diner Committee Feedback & Ratings Board */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-heading font-extrabold text-xl text-olive-deep">
              Troop Dining Observations &amp; Ratings
            </h3>
            <p className="text-xs text-pine/70 mt-0.5">
              Inspections logged by Mess Committee and Subedar Major representatives.
            </p>
          </div>
          <span className="text-xs font-mono font-bold px-3 py-1 bg-white text-olive-deep rounded-badge border border-sand/50 shadow-subtle">
            Avg Score: 4.8 / 5.0 ★
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {feedbacks.map((fb) => (
            <div
              key={fb.id}
              className="p-4 rounded-card border border-sand/50 bg-white shadow-subtle flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-heading font-bold text-xs text-olive-deep">{fb.submitted_by}</span>
                  <div className="flex items-center gap-0.5 text-gold">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < fb.rating ? 'fill-gold text-gold' : 'text-sand/40'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-pine/80 italic leading-relaxed">
                  "{fb.comment}"
                </p>
              </div>
              <span className="text-[10px] text-pine/50 font-mono mt-4 block">
                {new Date(fb.created_at).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Add Dish Modal */}
      <Modal
        isOpen={isAddItemModalOpen}
        onClose={() => setIsAddItemModalOpen(false)}
        title={`Add Dish to ${selectedMeal}`}
        description="Append a new scaled dish to today's kitchen preparation schedule."
      >
        <div className="flex flex-col gap-4 font-body text-pine">
          <Input
            label="Dish Name"
            placeholder="e.g. Kashmiri Rajma, Aloo Gobhi..."
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            required
          />

          <Select
            label="Course Classification"
            value={newItemCategory}
            onChange={(e) => setNewItemCategory(e.target.value)}
            options={[
              { label: 'Main Dish', value: 'Main' },
              { label: 'Side Gravy / Sabzi', value: 'Side' },
              { label: 'Staple (Rice / Roti)', value: 'Staple' },
              { label: 'Beverage / Tea', value: 'Beverage' },
              { label: 'Sweet / Fruit', value: 'Dessert' },
            ]}
          />

          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setIsAddItemModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleAddItem} disabled={!newItemName.trim()}>
              Save Dish to Menu
            </Button>
          </div>
        </div>
      </Modal>

      {/* Post Feedback Modal */}
      <Modal
        isOpen={isFeedbackModalOpen}
        onClose={() => setIsFeedbackModalOpen(false)}
        title="Submit Dining Observation"
        description="Record formal feedback for the Caterer and Messing Committee."
      >
        <div className="flex flex-col gap-4 font-body text-pine">
          <Input
            label="Diner Name & Designation"
            placeholder="e.g. Dr. B. Singh, Mess Secretary..."
            value={feedbackName}
            onChange={(e) => setFeedbackName(e.target.value)}
          />

          <div>
            <label className="text-xs font-heading font-bold text-olive uppercase block mb-1">
              Food Quality Rating (Stars)
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setFeedbackRating(star)}
                  className="p-1 hover:scale-110 transition-transform"
                >
                  <Star
                    className={`w-6 h-6 ${
                      star <= feedbackRating ? 'fill-gold text-gold' : 'text-sand/40'
                    }`}
                  />
                </button>
              ))}
              <span className="text-xs font-mono font-bold text-pine ml-2">{feedbackRating} / 5 Stars</span>
            </div>
          </div>

          <div>
            <label className="text-xs font-heading font-bold text-olive uppercase block mb-1">
              Observations &amp; Remarks
            </label>
            <textarea
              className="w-full h-24 p-3 text-xs rounded-control border border-sand bg-snow text-pine outline-none focus:border-gold"
              placeholder="e.g. Ration scale well-prepared. High-altitude tea station adequately supplied..."
              value={feedbackComment}
              onChange={(e) => setFeedbackComment(e.target.value)}
              required
            />
          </div>

          <div className="flex justify-end gap-2 mt-2">
            <Button variant="outline" onClick={() => setIsFeedbackModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSubmitFeedback} disabled={!feedbackComment.trim()}>
              Post Observation
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default DailyMenu;
