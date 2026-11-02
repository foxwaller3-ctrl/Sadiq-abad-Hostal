import React, { useState, useEffect } from 'react';
import { facilitiesService } from '../../services/facilitiesService.ts';
import type { Facility } from '../../types/index.ts';
import { Button } from '../../components/ui/Button.tsx';
import { Input } from '../../components/ui/Input.tsx';
import { Textarea } from '../../components/ui/Textarea.tsx';
import { Modal } from '../../components/ui/Modal.tsx';
import { useToast } from '../../components/ui/Toast.tsx';
import { Plus, Edit2, Trash2, Eye, EyeOff } from 'lucide-react';
import {
  FACILITY_ICON_OPTIONS,
  FacilityIcon
} from '../../components/common/SemanticIcon.tsx';

export const FacilitiesAdmin: React.FC = () => {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [editingFac, setEditingFac] = useState<Facility | null>(null);
  const [facToDelete, setFacToDelete] = useState<Facility | null>(null);
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
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Failed to save facility.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!facToDelete) return;
    try {
      await facilitiesService.remove(facToDelete.id);
      toast('Facility removed.', 'info');
      setFacToDelete(null);
      loadFacilities();
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Failed to delete.', 'error');
    }
  };

  return (
    <div className="space-y-6 text-start">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Manage Hostel Facilities</h1>
          <p className="text-xs text-slate-500 mt-1">
            Add, edit, reorder, or hide hostel amenities and service descriptions shown on the website.
          </p>
        </div>
        <Button variant="primary" icon={<Plus className="w-4 h-4" />} onClick={handleOpenAdd}>
          Add Facility
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {facilities.map((fac) => {
          return (
            <div
              key={fac.id}
              className="p-5 bg-white rounded-2xl border border-slate-200 shadow-2xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200 text-teal-700 flex items-center justify-center">
                    <FacilityIcon
                      iconKey={fac.icon_url}
                      fallbackText={fac.title_en}
                      className="w-5 h-5"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleTogglePublish(fac)}
                    className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-md cursor-pointer ${
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
                <p className="text-xs text-teal-800 font-semibold font-urdu mb-2" dir="rtl">
                  {fac.title_ur || '—'}
                </p>
                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {fac.description_en}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] font-mono text-slate-400">#{fac.sort_order}</span>
                <div className="flex items-center gap-2">
                  <Button variant="secondary" size="sm" onClick={() => handleOpenEdit(fac)}>
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setFacToDelete(fac)}
                    className="text-red-600 hover:bg-red-50"
                    aria-label={`Delete ${fac.title_en}`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
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
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <Input
                  label="Facility Title (English)"
                  value={editingFac.title_en}
                  onChange={(e) => setEditingFac({ ...editingFac, title_en: e.target.value })}
                  required
                />
              </div>
              <Input
                type="number"
                label="Display Order"
                min={1}
                value={editingFac.sort_order}
                onChange={(e) =>
                  setEditingFac({
                    ...editingFac,
                    sort_order: parseInt(e.target.value, 10) || 1
                  })
                }
              />
            </div>

            <Input
              label="Facility Title (Urdu - اردو)"
              value={editingFac.title_ur}
              onChange={(e) => setEditingFac({ ...editingFac, title_ur: e.target.value })}
              dir="rtl"
            />

            {/* Visual Icon Picker */}
            <div className="space-y-2">
              <span className="block text-xs font-semibold text-slate-700">Select Facility Icon</span>
              <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                {FACILITY_ICON_OPTIONS.map(({ key, label, Icon }) => {
                  const selected = editingFac.icon_url === key;
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setEditingFac({ ...editingFac, icon_url: key })}
                      className={`p-2 rounded-xl border flex flex-col items-center gap-1 text-[10px] font-semibold transition cursor-pointer ${
                        selected
                          ? 'bg-teal-50 border-teal-600 text-teal-800'
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <Textarea
              label="Description (English)"
              value={editingFac.description_en}
              onChange={(e) => setEditingFac({ ...editingFac, description_en: e.target.value })}
              rows={3}
            />

            <Textarea
              label="Description (Urdu - اردو)"
              value={editingFac.description_ur}
              onChange={(e) => setEditingFac({ ...editingFac, description_ur: e.target.value })}
              dir="rtl"
              rows={3}
            />

            <div className="pt-4 border-t border-slate-100 flex justify-end gap-2">
              <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" loading={loading}>
                Save Facility
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Delete Confirmation Modal */}
      {facToDelete && (
        <Modal
          isOpen={!!facToDelete}
          onClose={() => setFacToDelete(null)}
          title="Delete Facility"
          maxWidth="sm"
        >
          <div className="space-y-4 text-start">
            <p className="text-sm text-slate-600">
              Delete <strong className="text-slate-900">{facToDelete.title_en}</strong> from hostel facilities?
            </p>
            <div className="flex justify-end gap-2">
              <Button variant="secondary" onClick={() => setFacToDelete(null)}>
                Cancel
              </Button>
              <Button variant="danger" onClick={handleConfirmDelete}>
                Delete Facility
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
