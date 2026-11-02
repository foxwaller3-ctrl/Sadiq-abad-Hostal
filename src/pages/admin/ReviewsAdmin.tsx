import React, { useState, useEffect } from 'react';
import { reviewsService } from '../../services/reviewsService.ts';
import { mockStore } from '../../services/mockStore.ts';
import type { Review } from '../../types/index.ts';
import { Button } from '../../components/ui/Button.tsx';
import { Input } from '../../components/ui/Input.tsx';
import { Textarea } from '../../components/ui/Textarea.tsx';
import { Select } from '../../components/ui/Select.tsx';
import { Modal } from '../../components/ui/Modal.tsx';
import { useToast } from '../../components/ui/Toast.tsx';
import { Plus, Trash2, Edit2, Star, Eye, EyeOff, AlertTriangle } from 'lucide-react';

export const ReviewsAdmin: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Review | null>(null);
  const [deleting, setDeleting] = useState(false);
  const { toast } = useToast();

  const loadData = () => {
    reviewsService.getAll().then(setReviews);
  };

  useEffect(() => {
    loadData();
    return mockStore.subscribe(loadData);
  }, []);

  const openCreateModal = () => {
    setEditingReview({
      id: '',
      name: '',
      rating: 5,
      comment_en: '',
      comment_ur: '',
      is_visible: true,
      created_at: new Date().toISOString()
    });
    setIsModalOpen(true);
  };

  const openEditModal = (rev: Review) => {
    setEditingReview({ ...rev });
    setIsModalOpen(true);
  };

  const handleToggleVisibility = async (rev: Review) => {
    try {
      await reviewsService.update(rev.id, { is_visible: !rev.is_visible });
      toast(rev.is_visible ? 'Review hidden from home page.' : 'Review shown on home page.', 'info');
      loadData();
    } catch {
      toast('Failed to update visibility.', 'error');
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingReview) return;

    const cleanName = editingReview.name.trim().slice(0, 60);
    if (cleanName.length < 2) {
      toast('Reviewer name must be at least 2 characters.', 'error');
      return;
    }

    try {
      if (editingReview.id) {
        await reviewsService.update(editingReview.id, {
          ...editingReview,
          name: cleanName
        });
        toast('Review updated successfully!', 'success');
      } else {
        await reviewsService.create({
          name: cleanName,
          rating: editingReview.rating,
          comment_en: editingReview.comment_en,
          comment_ur: editingReview.comment_ur,
          is_visible: editingReview.is_visible
        });
        toast('Review added successfully!', 'success');
      }
      setIsModalOpen(false);
      setEditingReview(null);
      loadData();
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Failed to save review.', 'error');
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await reviewsService.remove(deleteTarget.id);
      toast('Review removed.', 'info');
      setDeleteTarget(null);
      loadData();
    } catch {
      toast('Failed to delete review.', 'error');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6 text-start">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Student & Parent Reviews</h1>
          <p className="text-xs text-slate-500 mt-1">
            Add, edit, or toggle resident and parent testimonials displayed on the public home page.
          </p>
        </div>
        <Button variant="primary" icon={<Plus className="w-4 h-4" />} onClick={openCreateModal}>
          Add Review
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {reviews.map((rev) => (
          <div
            key={rev.id}
            className={`p-5 bg-white rounded-2xl border transition flex flex-col justify-between ${
              rev.is_visible ? 'border-slate-200' : 'border-slate-200 bg-slate-50/70 opacity-75'
            }`}
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
                  className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-md cursor-pointer transition ${
                    rev.is_visible
                      ? 'text-emerald-700 hover:bg-emerald-50'
                      : 'text-slate-500 hover:bg-slate-100'
                  }`}
                >
                  {rev.is_visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  <span>{rev.is_visible ? 'Visible' : 'Hidden'}</span>
                </button>
              </div>

              <h4 className="font-bold text-sm text-slate-900 mb-1">{rev.name}</h4>
              <p className="text-xs text-slate-600 leading-relaxed mb-2">
                "{rev.comment_en}"
              </p>
              {rev.comment_ur && (
                <p className="text-xs text-teal-800 leading-relaxed font-urdu" dir="rtl">
                  "{rev.comment_ur}"
                </p>
              )}
            </div>

            <div className="pt-3 mt-3 border-t border-slate-100 flex justify-end gap-1.5">
              <button
                onClick={() => openEditModal(rev)}
                className="p-1.5 text-slate-500 hover:text-teal-700 rounded-lg hover:bg-slate-100 transition cursor-pointer"
                aria-label={`Edit review by ${rev.name}`}
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setDeleteTarget(rev)}
                className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition cursor-pointer"
                aria-label={`Delete review by ${rev.name}`}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Review Modal */}
      {editingReview && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={editingReview.id ? 'Edit Resident Review' : 'Add Resident Review'}
        >
          <form onSubmit={handleSave} className="space-y-4 text-start">
            <Input
              label="Reviewer Name & College / Role (max 60 chars)"
              value={editingReview.name}
              maxLength={60}
              onChange={(e) => setEditingReview({ ...editingReview, name: e.target.value })}
              placeholder="e.g. M. Huzaifa · FSc, Punjab College Sadiqabad"
              required
            />

            <Select
              label="Star Rating"
              value={String(editingReview.rating)}
              onChange={(e) =>
                setEditingReview({ ...editingReview, rating: parseInt(e.target.value) || 5 })
              }
            >
              <option value="5">5 Stars — Excellent</option>
              <option value="4">4 Stars — Very Good</option>
              <option value="3">3 Stars — Good</option>
            </Select>

            <Textarea
              label="Comment (English)"
              value={editingReview.comment_en}
              onChange={(e) =>
                setEditingReview({ ...editingReview, comment_en: e.target.value })
              }
              placeholder="Feedback about rooms, mess quality, quiet study hours, WiFi..."
              rows={3}
              required
            />

            <Textarea
              label="Comment (Urdu)"
              value={editingReview.comment_ur}
              onChange={(e) =>
                setEditingReview({ ...editingReview, comment_ur: e.target.value })
              }
              placeholder="ہاسٹل اور کھانے کے متعلق اردو تاثرات..."
              dir="rtl"
              rows={3}
            />

            <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={editingReview.is_visible}
                onChange={(e) =>
                  setEditingReview({ ...editingReview, is_visible: e.target.checked })
                }
                className="rounded text-teal-700 focus:ring-teal-700"
              />
              <span>Show this review publicly on Home Page</span>
            </label>

            <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
              <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                {editingReview.id ? 'Save Changes' : 'Add Review'}
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Delete Review Modal */}
      {deleteTarget && (
        <Modal
          isOpen={!!deleteTarget}
          onClose={() => setDeleteTarget(null)}
          title="Delete Review"
          maxWidth="sm"
        >
          <div className="space-y-4 text-start">
            <div className="flex items-start gap-3 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-900">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                Permanently remove the review by <strong className="font-semibold">{deleteTarget.name}</strong>?
              </p>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="secondary" onClick={() => setDeleteTarget(null)}>
                Cancel
              </Button>
              <Button
                type="button"
                variant="danger"
                loading={deleting}
                onClick={handleConfirmDelete}
              >
                Delete Review
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
