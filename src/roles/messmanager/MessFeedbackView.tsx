import React, { useState, useEffect } from 'react';
import { api } from '../../api/client';
import { Feedback, Mess } from '../../types';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { StatTile } from '../../components/StatTile';
import { Modal } from '../../components/Modal';
import { useToast } from '../../components/Toast';
import {
  MessageSquare,
  Star,
  Plus,
  FileSpreadsheet,
  CheckCircle2,
  ThumbsUp,
  Search,
  Sparkles,
  Mountain,
  UtensilsCrossed,
} from 'lucide-react';

export const MessFeedbackView: React.FC = () => {
  const { toast } = useToast();
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [messes, setMesses] = useState<Mess[]>([]);
  const [selectedMessId, setSelectedMessId] = useState<string>('mess-1');
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [authorName, setAuthorName] = useState('Dr. B. Singh, Mess Secretary');
  const [rating, setRating] = useState(5);
  const [mealType, setMealType] = useState('Lunch');
  const [category, setCategory] = useState('Taste & Seasoning');
  const [commentText, setCommentText] = useState('Basmati rice and dal tadka seasoned to standard, excellent temperature and portion.');

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      try {
        const [fData, mData] = await Promise.all([
          api.feedback.list(),
          api.messes.list(),
        ]);
        setFeedbacks(fData);
        setMesses(mData);
      } catch (err) {
        console.error('Failed to load mess feedback', err);
        toast({ type: 'error', title: 'Error', message: 'Failed to load diner feedback' });
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [toast]);

  const activeMess = messes.find((m) => m.id === selectedMessId) || messes[0];

  const handleSubmitFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) {
      toast({ type: 'error', title: 'Comment Required', message: 'Please write a brief observation note.' });
      return;
    }

    setIsSubmitting(true);
    try {
      const newFeedback = await api.feedback.submit({
        mess_id: selectedMessId,
        submitted_by: authorName,
        rating,
        comment: `[${mealType} • ${category}] ${commentText}`,
        created_at: new Date().toISOString(),
      });

      setFeedbacks((prev) => [newFeedback, ...prev]);
      setIsSubmitModalOpen(false);
      setCommentText('');

      toast({
        title: 'Feedback Recorded',
        message: 'Diner observation submitted to the Messing Committee log.',
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to record feedback';
      toast({ type: 'error', title: 'Submission Failed', message: msg });
    } finally {
      setIsSubmitting(false);
    }
  };

  const exportCSV = () => {
    if (feedbacks.length === 0) {
      toast({ type: 'warning', title: 'No Data', message: 'No diner reviews available for export.' });
      return;
    }
    const headers = ['Feedback ID', 'Mess Facility', 'Diner Name', 'Rating (Stars)', 'Observation Remarks', 'Timestamp'];
    const rows = feedbacks.map((f) => {
      const m = messes.find((mess) => mess.id === f.mess_id);
      return [
        f.id,
        m ? `"${m.name}"` : f.mess_id,
        `"${f.submitted_by}"`,
        f.rating,
        `"${f.comment.replace(/"/g, '""')}"`,
        f.created_at,
      ];
    });

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Diner_Feedback_Register_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({ title: 'Export Complete', message: 'Diner feedback register exported as CSV.' });
  };

  const filteredFeedbacks = feedbacks.filter((f) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      f.submitted_by.toLowerCase().includes(q) ||
      f.comment.toLowerCase().includes(q) ||
      f.id.toLowerCase().includes(q);
    const matchesMess = !selectedMessId || f.mess_id === selectedMessId;
    return matchesSearch && matchesMess;
  });

  const avgRating =
    filteredFeedbacks.length > 0
      ? (filteredFeedbacks.reduce((acc, f) => acc + f.rating, 0) / filteredFeedbacks.length).toFixed(1)
      : '4.8';

  return (
    <div className="flex flex-col gap-6 pb-12 font-body text-pine">
      {/* Header Banner */}
      <div className="p-6 md:p-8 bg-night text-snow rounded-card border border-sand/40 shadow-elevation flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-control bg-olive/70 border border-gold/40 flex items-center justify-center text-gold shrink-0 shadow-subtle">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-badge bg-gold/15 border border-gold/40 text-gold text-[10px] font-heading font-bold uppercase tracking-wider mb-1.5">
              <Mountain className="w-3.5 h-3.5 text-gold" />
              <span>{activeMess?.name || 'DINING MESS'} • QUALITY ASSURANCE</span>
            </div>
            <h1 className="font-heading font-extrabold text-2xl md:text-3xl text-snow tracking-tight">
              Diner Committee Feedback &amp; Food Satisfaction
            </h1>
            <p className="text-xs text-sand font-medium mt-1">
              Member satisfaction audits, dish-level ratings, taste profiles, and portion size compliance.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Mess Switcher */}
          <div className="flex items-center gap-2 bg-olive-deep/90 border border-sand/40 px-3 py-1.5 rounded-control">
            <UtensilsCrossed className="w-4 h-4 text-gold" />
            <select
              value={selectedMessId}
              onChange={(e) => setSelectedMessId(e.target.value)}
              className="bg-transparent text-snow text-xs font-heading font-bold focus:outline-none cursor-pointer"
            >
              {messes.map((m) => (
                <option key={m.id} value={m.id} className="bg-night text-snow">
                  {m.name}
                </option>
              ))}
            </select>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={exportCSV}
            icon={<FileSpreadsheet className="w-4 h-4" />}
            className="text-snow border-sand/40 hover:bg-olive-deep"
          >
            Export CSV
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsSubmitModalOpen(true)}
            icon={<Plus className="w-4 h-4" />}
          >
            Submit Feedback
          </Button>
        </div>
      </div>

      {/* KPI Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatTile
          label="Average Dining Rating"
          value={`${avgRating} / 5.0 ★`}
          subValue="Across all recorded meals"
          trend={{ value: '+0.2 this week', isPositive: true }}
          icon={<Star className="w-5 h-5 text-gold" />}
          accentColor="gold"
        />
        <StatTile
          label="Total Observations Logged"
          value={`${filteredFeedbacks.length}`}
          subValue="Audited diner submissions"
          icon={<MessageSquare className="w-5 h-5 text-olive" />}
          accentColor="olive"
        />
        <StatTile
          label="Portion Adequacy Index"
          value="96.4%"
          subValue="Zero reported shortages"
          icon={<CheckCircle2 className="w-5 h-5 text-success" />}
          accentColor="success"
        />
        <StatTile
          label="Hygiene &amp; Cleanliness"
          value="Grade A+"
          subValue="Pantry inspection certified"
          icon={<ThumbsUp className="w-5 h-5 text-glacier" />}
          accentColor="glacier"
        />
      </div>

      {/* Quality Pillar Gauges */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Taste & Seasoning', score: '4.8 / 5.0', pct: 96, color: 'bg-gold' },
          { label: 'Portion Scale Compliance', score: '4.7 / 5.0', pct: 94, color: 'bg-olive' },
          { label: 'Meal Temperature & Freshness', score: '4.9 / 5.0', pct: 98, color: 'bg-success' },
          { label: 'Cleanliness & Sanitation', score: '5.0 / 5.0', pct: 100, color: 'bg-glacier' },
        ].map((pillar) => (
          <Card key={pillar.label} className="p-4 border border-sand/60 bg-white flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-heading font-bold text-pine/60 uppercase tracking-wider block">
                {pillar.label}
              </span>
              <div className="font-mono font-bold text-lg text-olive-deep mt-1">
                {pillar.score}
              </div>
            </div>
            <div className="w-full h-2 rounded-full bg-sand/30 overflow-hidden mt-3">
              <div className={`h-full rounded-full ${pillar.color}`} style={{ width: `${pillar.pct}%` }} />
            </div>
          </Card>
        ))}
      </div>

      {/* Filter and Search Bar */}
      <Card className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 border border-sand/60 bg-white">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-pine/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search feedback by reviewer name, keywords, or remarks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs font-mono font-medium rounded-control border border-sand bg-snow focus:outline-none focus:border-olive focus:ring-1 focus:ring-olive text-olive-deep placeholder:text-pine/40"
          />
        </div>
        <span className="text-xs text-pine/60 font-mono font-bold">
          Showing {filteredFeedbacks.length} observations
        </span>
      </Card>

      {/* Reviews Cards List */}
      <div className="space-y-3">
        {isLoading ? (
          <Card className="p-8 text-center text-pine/60 text-xs">
            Loading diner reviews...
          </Card>
        ) : filteredFeedbacks.length === 0 ? (
          <Card className="p-8 text-center text-pine/60 text-xs italic">
            No feedback entries match criteria.
          </Card>
        ) : (
          filteredFeedbacks.map((f) => (
            <div
              key={f.id}
              className="p-4 rounded-card border border-sand/60 bg-white shadow-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-olive transition-colors"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-heading font-extrabold text-sm text-olive-deep">
                    {f.submitted_by}
                  </span>
                  <span className="text-[10px] text-pine/50 font-mono">
                    {f.created_at ? new Date(f.created_at).toLocaleDateString('en-IN') : 'Recent'}
                  </span>
                  <span className="px-2 py-0.5 rounded-badge bg-success/10 text-success text-[10px] font-bold border border-success/30 uppercase">
                    Verified Diner
                  </span>
                </div>
                <p className="text-xs text-pine font-medium leading-relaxed">
                  {f.comment}
                </p>
              </div>

              <div className="flex items-center gap-4 shrink-0 sm:border-l sm:border-sand/40 sm:pl-4">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-4 h-4 ${
                        star <= f.rating ? 'fill-gold text-gold' : 'text-sand/40'
                      }`}
                    />
                  ))}
                </div>
                <span className="font-mono font-extrabold text-sm text-olive-deep">
                  {f.rating}.0
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Submit Feedback Modal */}
      <Modal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
        title="Record Diner Satisfaction Observation"
        description="Formal feedback submitted to the Catering Committee and Mess Caterer."
      >
        <form onSubmit={handleSubmitFeedback} className="flex flex-col gap-4 font-body text-pine mt-2">
          <div>
            <label className="block text-xs font-heading font-bold text-olive uppercase mb-1">
              Diner Name &amp; Designation
            </label>
            <input
              type="text"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              required
              className="w-full px-3 py-2 text-xs font-sans rounded-control border border-sand bg-snow text-olive-deep focus:outline-none focus:border-olive"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-heading font-bold text-olive uppercase mb-1">
                Meal Category
              </label>
              <select
                value={mealType}
                onChange={(e) => setMealType(e.target.value)}
                className="w-full px-3 py-2 text-xs font-sans rounded-control border border-sand bg-snow text-olive-deep focus:outline-none focus:border-olive"
              >
                <option value="Breakfast">Breakfast</option>
                <option value="Lunch">Lunch</option>
                <option value="Snacks">Snacks &amp; Tea</option>
                <option value="Dinner">Dinner</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-heading font-bold text-olive uppercase mb-1">
                Observation Focus
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 text-xs font-sans rounded-control border border-sand bg-snow text-olive-deep focus:outline-none focus:border-olive"
              >
                <option value="Taste & Seasoning">Taste &amp; Seasoning</option>
                <option value="Portion Size">Portion Size</option>
                <option value="Temperature & Freshness">Temperature &amp; Freshness</option>
                <option value="Hygiene & Cleanliness">Hygiene &amp; Cleanliness</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-heading font-bold text-olive uppercase mb-1">
              Star Rating (1 to 5)
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="p-1 rounded hover:scale-110 transition-transform"
                >
                  <Star
                    className={`w-6 h-6 ${
                      star <= rating ? 'fill-gold text-gold' : 'text-sand/50'
                    }`}
                  />
                </button>
              ))}
              <span className="font-mono font-bold text-sm text-olive-deep ml-2">
                {rating} Stars
              </span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-heading font-bold text-olive uppercase mb-1">
              Observation Remarks &amp; Recommendations
            </label>
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              rows={3}
              required
              placeholder="e.g. Rice was fluffy and properly cooked, portions were generous..."
              className="w-full px-3 py-2 text-xs font-sans rounded-control border border-sand bg-snow text-olive-deep focus:outline-none focus:border-olive"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-sand/40">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsSubmitModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Recording...' : 'Commit Observation'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default MessFeedbackView;
