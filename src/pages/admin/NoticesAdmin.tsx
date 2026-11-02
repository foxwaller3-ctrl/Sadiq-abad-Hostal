import React, { useState, useEffect } from 'react';
import { noticesService } from '../../services/noticesService.ts';
import { mockStore } from '../../services/mockStore.ts';
import type { Notice } from '../../types/index.ts';
import { Button } from '../../components/ui/Button.tsx';
import { Input } from '../../components/ui/Input.tsx';
import { Textarea } from '../../components/ui/Textarea.tsx';
import { Modal } from '../../components/ui/Modal.tsx';
import { useToast } from '../../components/ui/Toast.tsx';
import { isNoticeActive } from '../../utils/helpers.ts';
import { Plus, Trash2, Edit2, Bell, AlertTriangle } from 'lucide-react';

export const NoticesAdmin: React.FC = () => {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNotice, setEditingNotice] = useState<Notice | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Notice | null>(null);
  const [deleting, setDeleting] = useState(false);
  const { toast } = useToast();

  const loadData = () => {
    noticesService.getAll().then(setNotices);
  };

  useEffect(() => {
    loadData();
    return mockStore.subscribe(loadData);
  }, []);

  const openCreateModal = () => {
    setEditingNotice({
      id: '',
      text_en: '',
      text_ur: '',
      starts_at: new Date().toISOString().substring(0, 10),
      ends_at: new Date(Date.now() + 30 * 86400000).toISOString().substring(0, 10),
      is_active: true
    });
    setIsModalOpen(true);
  };

  const openEditModal = (notice: Notice) => {
    setEditingNotice({
      ...notice,
      starts_at: notice.starts_at.substring(0, 10),
      ends_at: notice.ends_at.substring(0, 10)
    });
    setIsModalOpen(true);
  };

  const handleToggleActive = async (notice: Notice) => {
    try {
      await noticesService.update(notice.id, { is_active: !notice.is_active });
      toast('Notice status updated.', 'info');
      loadData();
    } catch {
      toast('Failed to update status.', 'error');
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingNotice) return;

    if (!editingNotice.text_en.trim()) {
      toast('English notice text is required.', 'error');
      return;
    }

    const startIso = new Date(`${editingNotice.starts_at}T00:00:00Z`).toISOString();
    const endIso = new Date(`${editingNotice.ends_at}T23:59:59Z`).toISOString();
    if (new Date(endIso).getTime() < new Date(startIso).getTime()) {
      toast('End date must be on or after the start date.', 'error');
      return;
    }

    try {
      if (editingNotice.id) {
        await noticesService.update(editingNotice.id, {
          text_en: editingNotice.text_en,
          text_ur: editingNotice.text_ur,
          starts_at: startIso,
          ends_at: endIso,
          is_active: editingNotice.is_active
        });
        toast('Announcement notice updated!', 'success');
      } else {
        await noticesService.create({
          text_en: editingNotice.text_en,
          text_ur: editingNotice.text_ur,
          starts_at: startIso,
          ends_at: endIso,
          is_active: editingNotice.is_active
        });
        toast('Announcement notice published!', 'success');
      }
      setIsModalOpen(false);
      setEditingNotice(null);
      loadData();
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Failed to save notice.', 'error');
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await noticesService.remove(deleteTarget.id);
      toast('Notice deleted.', 'info');
      setDeleteTarget(null);
      loadData();
    } catch {
      toast('Failed to delete notice.', 'error');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6 text-start">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Announcement Notices Banner</h1>
          <p className="text-xs text-slate-500 mt-1">
            Publish admission alerts, holiday schedules, and top-of-site announcements.
          </p>
        </div>
        <Button variant="primary" icon={<Plus className="w-4 h-4" />} onClick={openCreateModal}>
          Create Notice
        </Button>
      </div>

      {notices.length === 0 ? (
        <div className="p-10 bg-white rounded-2xl border border-slate-200 text-center space-y-3">
          <Bell className="w-8 h-8 text-slate-400 mx-auto" />
          <p className="text-sm font-semibold text-slate-800">No announcements posted yet</p>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Create a notice to display an announcement bar at the top of the public website (for example, new session admissions or Eid holidays).
          </p>
          <Button variant="outline" size="sm" onClick={openCreateModal}>
            Post First Notice
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {notices.map((n) => {
            const isActiveNow = isNoticeActive(n);

            return (
              <div
                key={n.id}
                className={`p-5 rounded-2xl border transition-all ${
                  isActiveNow
                    ? 'bg-amber-50/40 border-amber-300'
                    : 'bg-white border-slate-200'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <span
                        className={`inline-flex items-center gap-1 font-bold ${
                          isActiveNow ? 'text-amber-800' : 'text-slate-500'
                        }`}
                      >
                        <Bell className="w-3.5 h-3.5" />
                        <span>{isActiveNow ? 'Active on Website' : 'Inactive / Scheduled'}</span>
                      </span>
                      <span aria-hidden="true" className="text-slate-300">·</span>
                      <span className="text-slate-500 font-mono tabular-nums">
                        {new Date(n.starts_at).toLocaleDateString()} – {new Date(n.ends_at).toLocaleDateString()}
                      </span>
                    </div>

                    <p className="font-semibold text-slate-900 text-sm leading-relaxed">
                      {n.text_en}
                    </p>
                    {n.text_ur && (
                      <p className="text-xs text-teal-800 leading-relaxed font-medium font-urdu" dir="rtl">
                        {n.text_ur}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleToggleActive(n)}
                    >
                      {n.is_active ? 'Disable' : 'Enable'}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openEditModal(n)}
                      aria-label="Edit notice"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:bg-red-50"
                      onClick={() => setDeleteTarget(n)}
                      aria-label="Delete notice"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create / Edit Modal */}
      {editingNotice && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={editingNotice.id ? 'Edit Website Notice' : 'Post New Website Notice'}
          maxWidth="md"
        >
          <form onSubmit={handleSave} className="space-y-4 text-start">
            <Textarea
              label="Notice Text (English)"
              placeholder="e.g. Admissions Open for Session 2026–2027! Limited seats available near Punjab College."
              value={editingNotice.text_en}
              onChange={(e) =>
                setEditingNotice({ ...editingNotice, text_en: e.target.value })
              }
              required
              rows={3}
            />

            <Textarea
              label="Notice Text (Urdu)"
              placeholder="مثلاً: نئے سیشن کے داخلے جاری ہیں! محدود نشستیں دستیاب ہیں۔"
              value={editingNotice.text_ur}
              onChange={(e) =>
                setEditingNotice({ ...editingNotice, text_ur: e.target.value })
              }
              dir="rtl"
              rows={3}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                type="date"
                label="Start Date"
                value={editingNotice.starts_at}
                onChange={(e) =>
                  setEditingNotice({ ...editingNotice, starts_at: e.target.value })
                }
                required
              />
              <Input
                type="date"
                label="End Date"
                value={editingNotice.ends_at}
                onChange={(e) =>
                  setEditingNotice({ ...editingNotice, ends_at: e.target.value })
                }
                required
              />
            </div>

            <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={editingNotice.is_active}
                onChange={(e) =>
                  setEditingNotice({ ...editingNotice, is_active: e.target.checked })
                }
                className="rounded text-teal-700 focus:ring-teal-700"
              />
              <span>Active immediately within date range</span>
            </label>

            <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
              <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                {editingNotice.id ? 'Save Changes' : 'Publish Notice'}
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <Modal
          isOpen={!!deleteTarget}
          onClose={() => setDeleteTarget(null)}
          title="Delete Announcement"
          maxWidth="sm"
        >
          <div className="space-y-4 text-start">
            <div className="flex items-start gap-3 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-900">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                Are you sure you want to delete this announcement: <strong className="font-semibold">"{deleteTarget.text_en}"</strong>?
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
                Delete Notice
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
