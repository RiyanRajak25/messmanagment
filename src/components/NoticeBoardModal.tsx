import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Modal } from './Modal';
import { Button } from './Button';
import { useToast } from './Toast';
import {
  Bell,
  AlertTriangle,
  Info,
  Calendar,
  CheckCircle2,
  Send,
  Plus,
  ShieldCheck,
  Tag,
  Mountain,
} from 'lucide-react';

export interface StationNotice {
  id: string;
  title: string;
  category: 'Urgent Ops' | 'Supply Chain' | 'Inspection' | 'Routine';
  priority: 'high' | 'medium' | 'low';
  issuer: string;
  date: string;
  content: string;
  target: string;
  isAcknowledged: boolean;
}

interface NoticeBoardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const INITIAL_NOTICES: StationNotice[] = [
  {
    id: 'NOTICE-2026-081',
    title: 'Winter High-Altitude Scaled Ration Transition Effective 01 Nov',
    category: 'Urgent Ops',
    priority: 'high',
    issuer: 'Director Rajesh Verma, Station Directorate',
    date: '2026-10-15',
    content:
      'Pursuant to institutional high-altitude metabolic directives, all dining messes will transition to the Winter Scale (+800 kcal per diner daily). Central depot will begin dispatching fortified ghee, condensed milk, and honey rations starting next Monday.',
    target: 'All 3 Dining Messes & Central Depot',
    isAcknowledged: false,
  },
  {
    id: 'NOTICE-2026-079',
    title: 'Bi-Weekly Depot Unloading Bay Vehicle Sanitization & Tally Hours',
    category: 'Supply Chain',
    priority: 'medium',
    issuer: 'Ramesh Patel, Quartermaster Depot',
    date: '2026-10-14',
    content:
      'Depot intake gates will operate from 06:00 to 18:30 IST. Transporters arriving after 18:30 must anchor at Lower Transit Depot staging bay. Consignments must retain physical quality certification seals.',
    target: 'Central Supply Depot & Certified Suppliers',
    isAcknowledged: true,
  },
  {
    id: 'NOTICE-2026-075',
    title: 'Quarterly Food Hygiene & Water Safety Audit Inspection',
    category: 'Inspection',
    priority: 'high',
    issuer: 'Institutional Health & Standards Directorate',
    date: '2026-10-12',
    content:
      'Central Inspection Team will visit Falcon Mess, Eagle Mess, and Officer Dining Hall on 18 Oct for swab testing, dry storage pest barrier audit, and grain moisture verification.',
    target: 'Mess Managers & Head Cooks',
    isAcknowledged: true,
  },
  {
    id: 'NOTICE-2026-072',
    title: 'Fiscal Reconciliation Close for September Tender Disbursements',
    category: 'Routine',
    priority: 'low',
    issuer: 'Amit Sharma, Central Accounts Officer',
    date: '2026-10-10',
    content:
      'All verified supplier vouchers for September consignments have been settled via electronic treasury clearance. Pending challan disputes must be lodged by 20 Oct.',
    target: 'Finance Desk & Vendors',
    isAcknowledged: true,
  },
];

export const NoticeBoardModal: React.FC<NoticeBoardModalProps> = ({ isOpen, onClose }) => {
  const { role } = useAuth();
  const { toast } = useToast();

  const [notices, setNotices] = useState<StationNotice[]>(INITIAL_NOTICES);
  const [filter, setFilter] = useState<'all' | 'unread' | 'high'>('all');
  const [isComposing, setIsComposing] = useState(false);

  // New notice form states
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<'Urgent Ops' | 'Supply Chain' | 'Inspection' | 'Routine'>('Urgent Ops');
  const [newPriority, setNewPriority] = useState<'high' | 'medium' | 'low'>('medium');
  const [newContent, setNewContent] = useState('');
  const [newTarget, setNewTarget] = useState('All Station Facilities');

  const handleAcknowledge = (id: string) => {
    setNotices((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isAcknowledged: true } : n))
    );
    toast({
      title: 'Advisory Acknowledged',
      message: 'Your acknowledgment has been logged in station communications records.',
    });
  };

  const handlePublishNotice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) {
      toast({ type: 'warning', title: 'Missing Info', message: 'Please provide both title and announcement details.' });
      return;
    }

    const created: StationNotice = {
      id: `NOTICE-2026-${Math.floor(100 + Math.random() * 900)}`,
      title: newTitle,
      category: newCategory,
      priority: newPriority,
      issuer: 'Station Command Administration',
      date: new Date().toISOString().split('T')[0],
      content: newContent,
      target: newTarget,
      isAcknowledged: false,
    };

    setNotices([created, ...notices]);
    setIsComposing(false);
    setNewTitle('');
    setNewContent('');

    toast({
      title: 'Announcement Broadcasted',
      message: 'Urgent station notice transmitted across all terminal consoles.',
    });
  };

  const filteredNotices = notices.filter((n) => {
    if (filter === 'unread') return !n.isAcknowledged;
    if (filter === 'high') return n.priority === 'high';
    return true;
  });

  const unreadCount = notices.filter((n) => !n.isAcknowledged).length;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Station Operational Notice Board & Broadcasts"
      description="Official directives, weather and altitude advisories, logistics notices, and safety bulletins."
      maxWidth="xl"
    >
      <div className="flex flex-col gap-4 font-body text-pine">
        {/* Top Control Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 bg-snow rounded-control border border-sand/60">
          <div className="flex items-center gap-2">
            {[
              { id: 'all', label: `All Notices (${notices.length})` },
              { id: 'unread', label: `Pending Action (${unreadCount})` },
              { id: 'high', label: 'High Priority Only' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFilter(tab.id as any)}
                className={`px-3 py-1.5 rounded-control text-xs font-heading font-bold transition-all ${
                  filter === tab.id
                    ? 'bg-olive text-snow shadow-subtle'
                    : 'text-pine/70 hover:text-olive-deep hover:bg-sand/30'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {role === 'administrator' && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsComposing(!isComposing)}
              icon={isComposing ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
            >
              {isComposing ? 'View Board' : 'Broadcast Advisory'}
            </Button>
          )}
        </div>

        {/* Compose Form for Administrator */}
        {isComposing && (
          <form
            onSubmit={handlePublishNotice}
            className="p-4 rounded-card bg-white border border-sand shadow-elevation flex flex-col gap-3.5 text-xs animate-fade-in"
          >
            <div className="flex items-center justify-between pb-2 border-b border-sand/40">
              <span className="font-heading font-extrabold text-sm text-olive-deep uppercase tracking-wider">
                Broadcast Station Advisory
              </span>
              <span className="text-[10px] font-mono font-bold text-danger bg-danger/10 px-2 py-0.5 rounded border border-danger/30">
                DIRECTORATE LEVEL AUTH
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-[11px] font-heading font-bold text-olive uppercase mb-1">
                  Advisory Title / Headline
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Grain Moisture Inspection Schedule"
                  required
                  className="w-full px-3 py-2 text-xs font-semibold rounded-control border border-sand bg-snow text-olive-deep focus:outline-none focus:border-olive"
                />
              </div>

              <div>
                <label className="block text-[11px] font-heading font-bold text-olive uppercase mb-1">
                  Category
                </label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs font-sans rounded-control border border-sand bg-snow text-olive-deep focus:outline-none focus:border-olive"
                >
                  <option value="Urgent Ops">Urgent Ops</option>
                  <option value="Supply Chain">Supply Chain</option>
                  <option value="Inspection">Inspection</option>
                  <option value="Routine">Routine</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-heading font-bold text-olive uppercase mb-1">
                  Priority Rating
                </label>
                <select
                  value={newPriority}
                  onChange={(e) => setNewPriority(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs font-sans rounded-control border border-sand bg-snow text-olive-deep focus:outline-none focus:border-olive"
                >
                  <option value="high">High Priority (Immediate Action)</option>
                  <option value="medium">Medium Priority (Standard Advisory)</option>
                  <option value="low">Low Priority (Routine Info)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-heading font-bold text-olive uppercase mb-1">
                  Target Units / Messes
                </label>
                <input
                  type="text"
                  value={newTarget}
                  onChange={(e) => setNewTarget(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-sans rounded-control border border-sand bg-snow text-olive-deep focus:outline-none focus:border-olive"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-heading font-bold text-olive uppercase mb-1">
                Directive Text / Operational Instructions
              </label>
              <textarea
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                rows={3}
                placeholder="Enter complete instructions, dates, and mandatory guidelines..."
                required
                className="w-full px-3 py-2 text-xs font-sans rounded-control border border-sand bg-snow text-olive-deep focus:outline-none focus:border-olive"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-sand/40">
              <Button type="button" variant="outline" size="sm" onClick={() => setIsComposing(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="sm" icon={<Send className="w-3.5 h-3.5" />}>
                Broadcast to Terminals
              </Button>
            </div>
          </form>
        )}

        {/* Notices Roster */}
        <div className="flex flex-col gap-3 max-h-[420px] overflow-y-auto pr-1 no-scrollbar">
          {filteredNotices.length === 0 ? (
            <div className="p-8 text-center text-xs font-medium text-pine/60 bg-snow rounded-card border border-sand/40">
              No notices match the selected filter.
            </div>
          ) : (
            filteredNotices.map((notice) => {
              const isUrgent = notice.priority === 'high';
              return (
                <div
                  key={notice.id}
                  className={`p-4 rounded-card border transition-all ${
                    !notice.isAcknowledged
                      ? 'bg-white border-l-4 border-l-gold border-sand/60 shadow-subtle'
                      : 'bg-snow/60 border-sand/40'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-0.5 rounded-badge text-[9px] font-heading font-extrabold uppercase border ${
                          isUrgent
                            ? 'bg-danger/10 text-danger border-danger/30'
                            : 'bg-olive/10 text-olive border-olive/30'
                        }`}
                      >
                        {notice.category}
                      </span>
                      <span className="font-mono text-[10px] text-pine/50 font-bold">
                        {notice.id}
                      </span>
                      <span className="text-[10px] text-pine/40">•</span>
                      <span className="text-[10px] font-mono text-pine/60 flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-sand" /> {notice.date}
                      </span>
                    </div>

                    <span className="text-[10px] font-sans font-semibold text-pine/70">
                      Scope: <strong className="text-olive-deep">{notice.target}</strong>
                    </span>
                  </div>

                  <h4 className="font-heading font-extrabold text-sm text-olive-deep mb-1.5">
                    {notice.title}
                  </h4>

                  <p className="text-xs text-pine/80 font-body leading-relaxed mb-3">
                    {notice.content}
                  </p>

                  <div className="flex items-center justify-between pt-2.5 border-t border-sand/30 text-[11px]">
                    <span className="text-pine/60 italic">Issued by: {notice.issuer}</span>

                    {notice.isAcknowledged ? (
                      <span className="text-success font-bold font-mono flex items-center gap-1 text-[10px]">
                        <CheckCircle2 className="w-3.5 h-3.5" /> ACKNOWLEDGED
                      </span>
                    ) : (
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleAcknowledge(notice.id)}
                        icon={<CheckCircle2 className="w-3.5 h-3.5 text-night" />}
                      >
                        Mark Acknowledged
                      </Button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </Modal>
  );
};

export default NoticeBoardModal;
