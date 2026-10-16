import React, { useState, useEffect } from 'react';
import { facilitiesService } from '../../services/facilitiesService.ts';
import type { Facility } from '../../types/index.ts';
import { Button } from '../../components/ui/Button.tsx';
import { Input } from '../../components/ui/Input.tsx';
import { Textarea } from '../../components/ui/Textarea.tsx';
import { Modal } from '../../components/ui/Modal.tsx';
import { useToast } from '../../components/ui/Toast.tsx';
import { Plus, Edit2, Trash2, Eye, EyeOff, Sparkles } from 'lucide-react';

export const FacilitiesAdmin: React.FC = () => {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [editingFac, setEditingFac] = useState<Facility | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const loadFacilities = () => {
    facilitiesService.getAll().then(setFacilities);
  };

  useEffect(() => {
    loadFacilities();
  }, []);

  const handleOpenAdd = () => {
    setEditingFac({
      id: '',
      title_en: '',
      title_ur: '',
      description_en: '',
      description_ur: '',
      icon_url: 'sparkles',
      is_published: true,
      sort_order: facilities.length + 1
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (fac: Facility) => {
    setEditingFac({ ...fac });
    setIsModalOpen(true);
  };

  const handleTogglePublish = async (fac: Facility) => {
    try {
      await facilitiesService.update(fac.id, { is_published: !fac.is_published });
      toast(`Facility ${fac.is_published ? 'hidden' : 'published'}!`, 'info');
      loadFacilities();
    } catch {
      toast('Failed to update facility.', 'error');
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingFac) return;

    if (!editingFac.title_en.trim()) {
      toast('Title is required.', 'error');
      return;
    }

    setLoading(true);
    try {
      if (editingFac.id) {
        await facilitiesService.update(editingFac.id, editingFac);
        toast('Facility updated!', 'success');
      } else {
        await facilitiesService.create(editingFac);
        toast('New facility created!', 'success');
      }
      setIsModalOpen(false);
      loadFacilities();
    } catch {
      toast('Failed to save facility.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this facility?')) return;
    try {
      await facilitiesService.remove(id);
      toast('Facility removed.', 'info');
      loadFacilities();
    } catch {
      toast('Failed to delete.', 'error');
    }
  };

  return (
    <div className="space-y-6 text-start">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Manage Hostel Facilities</h1>
          <p className="text-xs text-slate-500 mt-1">
            Edit facilities, amenities, and service descriptions shown on the website.
          </p>
        </div>
        <Button variant="primary" icon={<Plus className="w-4 h-4" />} onClick={handleOpenAdd}>
          Add Facility
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {facilities.map((fac) => (
          <div
            key={fac.id}
            className="p-5 bg-white rounded-2xl border border-slate-200 shadow-2xs flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                  icon: {fac.icon_url}
                </span>
                <button
                  onClick={() => handleTogglePublish(fac)}
                  className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full cursor-pointer ${
                    fac.is_published
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {fac.is_published ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                  <span>{fac.is_published ? 'Visible' : 'Hidden'}</span>
                </button>
              </div>

              <h3 className="font-bold text-base text-slate-900 mb-0.5">{fac.title_en}</h3>
              <p className="text-xs text-teal-800 font-semibold mb-2" dir="rtl">
                {fac.title_ur || '—'}
              </p>
              <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                {fac.description_en}
              </p>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-end gap-2">
              <Button variant="secondary" size="sm" onClick={() => handleOpenEdit(fac)}>
                <Edit2 className="w-3.5 h-3.5" />
                <span>Edit</span>
              </Button>
              <Button variant="ghost" size="sm" onClick={() => handleDelete(fac.id)} className="text-red-600 hover:bg-red-50">
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Modal */}
      {editingFac && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={editingFac.id ? 'Edit Facility' : 'Add Facility'}
          maxWidth="lg"
        >
          <form onSubmit={handleSave} className="space-y-4 text-start">
            <Input
              label="Facility Title (English)"
              value={editingFac.title_en}
              onChange={(e) => setEditingFac({ ...editingFac, title_en: e.target.value })}
              required
            />

            <Input
              label="Facility Title (Urdu)"
              value={editingFac.title_ur}
              onChange={(e) => setEditingFac({ ...editingFac, title_ur: e.target.value })}
              dir="rtl"
            />

            <Input
              label="Icon Key (wifi, droplet, zap, flame, wind, utensils, shirt, book-open, video, shield-check, bike, sparkles, bed)"
              value={editingFac.icon_url}
              onChange={(e) => setEditingFac({ ...editingFac, icon_url: e.target.value })}
              required
            />

            <Textarea
              label="Description (English)"
              value={editingFac.description_en}
              onChange={(e) => setEditingFac({ ...editingFac, description_en: e.target.value })}
              rows={3}
            />

            <Textarea
              label="Description (Urdu)"
              value={editingFac.description_ur}
              onChange={(e) => setEditingFac({ ...editingFac, description_ur: e.target.value })}
              dir="rtl"
              rows={3}
            />

            <div className="pt-4 border-t flex justify-end gap-2">
              <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" loading={loading}>
                Save Facility
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
