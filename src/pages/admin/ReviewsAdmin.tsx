import React, { useState, useEffect } from 'react';
import { reviewsService } from '../../services/reviewsService.ts';
import type { Review } from '../../types/index.ts';
import { Button } from '../../components/ui/Button.tsx';
import { Input } from '../../components/ui/Input.tsx';
import { Textarea } from '../../components/ui/Textarea.tsx';
import { Select } from '../../components/ui/Select.tsx';
import { Modal } from '../../components/ui/Modal.tsx';
import { useToast } from '../../components/ui/Toast.tsx';
import { Plus, Trash2, Star, Eye, EyeOff, AlertCircle } from 'lucide-react';

export const ReviewsAdmin: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newReview, setNewReview] = useState({
    name: '',
    rating: 5,
    comment_en: '',
    comment_ur: '',
    is_visible: true
  });
  const { toast } = useToast();

  const loadData = () => {
    reviewsService.getAll().then(setReviews);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleToggleVisibility = async (rev: Review) => {
    try {
      await reviewsService.update(rev.id, { is_visible: !rev.is_visible });
      toast(`Review visibility changed.`, 'info');
      loadData();
    } catch {
      toast('Failed to update.', 'error');
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReview.name.trim()) {
      toast('Name is required.', 'error');
      return;
    }

    try {
      await reviewsService.create(newReview);
      toast('Review added successfully!', 'success');
      setIsModalOpen(false);
      setNewReview({
        name: '',
        rating: 5,
        comment_en: '',
        comment_ur: '',
        is_visible: true
      });
      loadData();
    } catch {
      toast('Failed to save review.', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this review?')) return;
    try {
      await reviewsService.remove(id);
      toast('Review removed.', 'info');
      loadData();
    } catch {
      toast('Failed to delete.', 'error');
    }
  };

  return (
    <div className="space-y-6 text-start">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Student & Parent Reviews</h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage feedback testimonials shown on the public home page.
          </p>
        </div>
        <Button variant="primary" icon={<Plus className="w-4 h-4" />} onClick={() => setIsModalOpen(true)}>
          Add Review
        </Button>
      </div>

      <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
        <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
        <span>
          <strong>PRD Policy Note:</strong> Initial sample reviews are for visual layout demonstration. Please replace with authentic resident reviews or hide them before taking the website live.
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {reviews.map((rev) => (
          <div
            key={rev.id}
            className="p-5 bg-white rounded-2xl border border-slate-200 shadow-2xs flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1 text-amber-500">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-500" />
                  ))}
                </div>
                <button
                  onClick={() => handleToggleVisibility(rev)}
                  className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full cursor-pointer ${
                    rev.is_visible
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {rev.is_visible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                  <span>{rev.is_visible ? 'Visible' : 'Hidden'}</span>
                </button>
              </div>

              <h4 className="font-bold text-sm text-slate-900 mb-1">{rev.name}</h4>
              <p className="text-xs text-slate-600 italic leading-relaxed mb-2">
                "{rev.comment_en}"
              </p>
              {rev.comment_ur && (
                <p className="text-xs text-teal-800 leading-relaxed" dir="rtl">
                  "{rev.comment_ur}"
                </p>
              )}
            </div>

            <div className="pt-3 mt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => handleDelete(rev.id)}
                className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition cursor-pointer"
                title="Delete review"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Review Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add Resident Review"
      >
        <form onSubmit={handleSave} className="space-y-4 text-start">
          <Input
            label="Reviewer Name (and College/Role)"
            value={newReview.name}
            onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
            placeholder="e.g. Ali Raza (Punjab College)"
            required
          />

          <Select
            label="Star Rating"
            value={String(newReview.rating)}
            onChange={(e) => setNewReview({ ...newReview, rating: parseInt(e.target.value) })}
          >
            <option value="5">5 Stars (⭐⭐⭐⭐⭐)</option>
            <option value="4">4 Stars (⭐⭐⭐⭐)</option>
            <option value="3">3 Stars (⭐⭐⭐)</option>
          </Select>

          <Textarea
            label="Comment (English)"
            value={newReview.comment_en}
            onChange={(e) => setNewReview({ ...newReview, comment_en: e.target.value })}
            placeholder="Feedback about the rooms, mess, WiFi, etc."
            rows={3}
            required
          />

          <Textarea
            label="Comment (Urdu)"
            value={newReview.comment_ur}
            onChange={(e) => setNewReview({ ...newReview, comment_ur: e.target.value })}
            placeholder="ہاسٹل اور کھانے کے متعلق اردو تاثرات..."
            dir="rtl"
            rows={3}
          />

          <div className="pt-3 border-t flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Add Review
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
