import React, { useState, useEffect } from 'react';
import { noticesService } from '../../services/noticesService.ts';
import type { Notice } from '../../types/index.ts';
import { Button } from '../../components/ui/Button.tsx';
import { Input } from '../../components/ui/Input.tsx';
import { Textarea } from '../../components/ui/Textarea.tsx';
import { Modal } from '../../components/ui/Modal.tsx';
import { useToast } from '../../components/ui/Toast.tsx';
import { isNoticeActive } from '../../utils/helpers.ts';
import { Plus, Trash2, Bell, CheckCircle, Clock } from 'lucide-react';

export const NoticesAdmin: React.FC = () => {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newNotice, setNewNotice] = useState<Omit<Notice, 'id'>>({
    text_en: '',
    text_ur: '',
    starts_at: new Date().toISOString().substring(0, 10),
    ends_at: new Date(Date.now() + 30 * 86400000).toISOString().substring(0, 10),
    is_active: true
  });
  const { toast } = useToast();

  const loadData = () => {
    noticesService.getAll().then(setNotices);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleToggleActive = async (notice: Notice) => {
    try {
      await noticesService.update(notice.id, { is_active: !notice.is_active });
      toast('Notice status updated.', 'info');
      loadData();
    } catch {
      toast('Failed to update.', 'error');
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNotice.text_en.trim()) {
      toast('English notice text is required.', 'error');
      return;
    }

    try {
      await noticesService.create({
        ...newNotice,
        starts_at: new Date(newNotice.starts_at).toISOString(),
        ends_at: new Date(newNotice.ends_at).toISOString()
      });
      toast('Announcement notice published!', 'success');
      setIsModalOpen(false);
      setNewNotice({
        text_en: '',
        text_ur: '',
        starts_at: new Date().toISOString().substring(0, 10),
        ends_at: new Date(Date.now() + 30 * 86400000).toISOString().substring(0, 10),
        is_active: true
      });
      loadData();
    } catch {
      toast('Failed to save notice.', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this announcement?')) return;
    try {
      await noticesService.remove(id);
      toast('Notice deleted.', 'info');
      loadData();
    } catch {
      toast('Failed to delete.', 'error');
    }
  };

  return (
    <div className="space-y-6 text-start">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Announcement Notices Banner</h1>
          <p className="text-xs text-slate-500 mt-1">
            Publish urgent admission notices, holiday alerts, and announcements at the top of the website.
          </p>
        </div>
        <Button variant="primary" icon={<Plus className="w-4 h-4" />} onClick={() => setIsModalOpen(true)}>
          Create Notice
        </Button>
      </div>

      <div className="space-y-4">
        {notices.map((n) => {
          const isActiveNow = isNoticeActive(n);

          return (
            <div
              key={n.id}
              className={`p-5 rounded-2xl border transition-all ${
                isActiveNow
                  ? 'bg-amber-50/40 border-amber-300 shadow-xs'
                  : 'bg-white border-slate-200'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                        isActiveNow
                          ? 'bg-amber-500 text-slate-950 animate-pulse'
                          : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      <Bell className="w-3 h-3" />
                      <span>{isActiveNow ? 'ACTIVE NOW ON SITE' : 'INACTIVE / EXPIRED'}</span>
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      {new Date(n.starts_at).toLocaleDateString()} to {new Date(n.ends_at).toLocaleDateString()}
                    </span>
                  </div>

                  <p className="font-semibold text-slate-900 text-sm leading-relaxed">
                    {n.text_en}
                  </p>
                  {n.text_ur && (
                    <p className="text-xs text-teal-800 leading-relaxed font-medium" dir="rtl">
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
                    className="text-red-600 hover:bg-red-50"
                    onClick={() => handleDelete(n.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Post New Website Notice"
        maxWidth="md"
      >
        <form onSubmit={handleSave} className="space-y-4 text-start">
          <Textarea
            label="Notice Text (English)"
            placeholder="e.g. Admissions Open for Session 2026-2027! Limited beds available."
            value={newNotice.text_en}
            onChange={(e) => setNewNotice({ ...newNotice, text_en: e.target.value })}
            required
            rows={3}
          />

          <Textarea
            label="Notice Text (Urdu)"
            placeholder="مثلاً: نئے سیشن کے داخلے جاری ہیں! محدود نشستیں دستیاب ہیں۔"
            value={newNotice.text_ur}
            onChange={(e) => setNewNotice({ ...newNotice, text_ur: e.target.value })}
            dir="rtl"
            rows={3}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              type="date"
              label="Start Date"
              value={newNotice.starts_at}
              onChange={(e) => setNewNotice({ ...newNotice, starts_at: e.target.value })}
              required
            />
            <Input
              type="date"
              label="End Date"
              value={newNotice.ends_at}
              onChange={(e) => setNewNotice({ ...newNotice, ends_at: e.target.value })}
              required
            />
          </div>

          <div className="pt-3 border-t flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Publish Notice
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
