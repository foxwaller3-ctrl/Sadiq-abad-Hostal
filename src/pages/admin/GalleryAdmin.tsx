import React, { useState, useEffect } from 'react';
import { galleryService } from '../../services/galleryService.ts';
import { uploadHostelMedia, deleteHostelMedia } from '../../services/mediaService.ts';
import type { GalleryItem, GalleryCategory } from '../../types/index.ts';
import { Button } from '../../components/ui/Button.tsx';
import { Input } from '../../components/ui/Input.tsx';
import { Select } from '../../components/ui/Select.tsx';
import { Modal } from '../../components/ui/Modal.tsx';
import { useToast } from '../../components/ui/Toast.tsx';
import { Plus, Trash2, Edit2, Eye, EyeOff } from 'lucide-react';

export const GalleryAdmin: React.FC = () => {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);
  const [itemToDelete, setItemToDelete] = useState<GalleryItem | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { toast } = useToast();

  const loadData = () => {
    galleryService.getAll().then(setItems);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenAdd = () => {
    setSelectedFile(null);
    setEditingItem({
      id: '',
      category: 'rooms',
      image_url: '',
      caption_en: '',
      caption_ur: '',
      is_published: true,
      sort_order: items.length + 1
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: GalleryItem) => {
    setSelectedFile(null);
    setEditingItem({ ...item });
    setIsModalOpen(true);
  };

  const handleTogglePublish = async (item: GalleryItem) => {
    try {
      await galleryService.update(item.id, { is_published: !item.is_published });
      toast(`Photo ${item.is_published ? 'hidden' : 'published'}!`, 'info');
      loadData();
    } catch {
      toast('Failed to update status.', 'error');
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;
    if (!editingItem.image_url.trim() && !selectedFile) {
      toast('Please upload an image file or provide an image URL.', 'error');
      return;
    }

    setLoading(true);
    try {
      const uploadedUrl = selectedFile
        ? await uploadHostelMedia(selectedFile, 'gallery')
        : editingItem.image_url.trim();

      if (editingItem.id) {
        await galleryService.update(editingItem.id, {
          ...editingItem,
          image_url: uploadedUrl
        });
        toast('Gallery photo updated!', 'success');
      } else {
        await galleryService.create({
          ...editingItem,
          image_url: uploadedUrl
        });
        toast('New photo added to gallery!', 'success');
      }
      setIsModalOpen(false);
      setSelectedFile(null);
      setEditingItem(null);
      loadData();
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Failed to save photo.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;
    try {
      await galleryService.remove(itemToDelete.id);
      try {
        await deleteHostelMedia(itemToDelete.image_url);
      } catch {
        // storage cleanup is best-effort
      }
      toast('Photo deleted from gallery.', 'info');
      setItemToDelete(null);
      loadData();
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Failed to delete photo.', 'error');
    }
  };

  return (
    <div className="space-y-6 text-start">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Gallery Photos Management</h1>
          <p className="text-xs text-slate-500 mt-1">
            Upload, edit captions, categorize, or remove hostel photos across rooms, mess, washrooms, and study hall.
          </p>
        </div>
        <Button variant="primary" icon={<Plus className="w-4 h-4" />} onClick={handleOpenAdd}>
          Add Photo
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs flex flex-col justify-between"
          >
            <div>
              <div className="aspect-[4/3] bg-slate-100 relative overflow-hidden">
                <img
                  src={item.image_url}
                  alt={item.caption_en || 'Hostel'}
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = '/images/hero-hostel.jpg';
                  }}
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-2 left-2 text-[10px] font-bold uppercase tracking-wider bg-slate-900/80 text-white px-2 py-0.5 rounded-md backdrop-blur-xs">
                  {item.category.replace('_', ' ')}
                </span>
              </div>
              <div className="p-3 text-xs space-y-1">
                <p className="font-semibold text-slate-800 line-clamp-1">
                  {item.caption_en || 'No caption'}
                </p>
                <p className="text-teal-700 font-medium font-urdu line-clamp-1" dir="rtl">
                  {item.caption_ur || '—'}
                </p>
              </div>
            </div>

            <div className="p-3 pt-2 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={() => handleTogglePublish(item)}
                className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-md cursor-pointer ${
                  item.is_published ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'
                }`}
              >
                {item.is_published ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                <span>{item.is_published ? 'Published' : 'Hidden'}</span>
              </button>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => handleOpenEdit(item)}
                  className="p-1.5 text-slate-500 hover:text-teal-700 rounded-lg hover:bg-slate-100 transition cursor-pointer"
                  title="Edit photo"
                  aria-label={`Edit ${item.caption_en || 'photo'}`}
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setItemToDelete(item)}
                  className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition cursor-pointer"
                  title="Delete photo"
                  aria-label={`Delete ${item.caption_en || 'photo'}`}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Photo Modal */}
      {editingItem && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={editingItem.id ? 'Edit Gallery Photo' : 'Add Photo to Gallery'}
          maxWidth="md"
        >
          <form onSubmit={handleSave} className="space-y-4 text-start">
            <div className="space-y-3">
              <Input
                label="Upload Image File (PNG, JPG, WebP — max 5 MB)"
                type="file"
                accept="image/png,image/jpeg,image/webp,image/svg+xml"
                onChange={(e) => setSelectedFile(e.target.files?.[0] ?? null)}
              />
              <Input
                label="Or Image URL"
                value={editingItem.image_url}
                onChange={(e) => setEditingItem({ ...editingItem, image_url: e.target.value })}
                placeholder="https://... or /images/room-double.jpg"
                required={!selectedFile}
              />
              {selectedFile && (
                <p className="text-xs text-teal-700 font-medium">
                  Selected file: {selectedFile.name}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select
                label="Category"
                value={editingItem.category}
                onChange={(e) =>
                  setEditingItem({ ...editingItem, category: e.target.value as GalleryCategory })
                }
              >
                <option value="rooms">Bedrooms (کمرے)</option>
                <option value="mess">Mess & Dining (میس و کچن)</option>
                <option value="study_area">Study Hall (اسٹڈی ایریا)</option>
                <option value="bathrooms">Washrooms (واش رومز)</option>
                <option value="building">Building Exterior (عمارت)</option>
                <option value="surroundings">Surroundings & Lounge (آس پاس)</option>
              </Select>

              <Input
                type="number"
                label="Display Order"
                min={1}
                value={editingItem.sort_order}
                onChange={(e) =>
                  setEditingItem({
                    ...editingItem,
                    sort_order: parseInt(e.target.value, 10) || 1
                  })
                }
              />
            </div>

            <Input
              label="Caption (English)"
              value={editingItem.caption_en}
              onChange={(e) => setEditingItem({ ...editingItem, caption_en: e.target.value })}
              placeholder="e.g. Executive 2-Bed Sharing Room with study desks"
            />

            <Input
              label="Caption (Urdu - اردو)"
              value={editingItem.caption_ur}
              onChange={(e) => setEditingItem({ ...editingItem, caption_ur: e.target.value })}
              placeholder="مثلاً: کشادہ ڈبل روم مع اسٹڈی ٹیبلز"
              dir="rtl"
            />

            <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
              <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" loading={loading}>
                {editingItem.id ? 'Save Changes' : 'Add Photo'}
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Delete Confirmation Modal */}
      {itemToDelete && (
        <Modal
          isOpen={!!itemToDelete}
          onClose={() => setItemToDelete(null)}
          title="Delete Gallery Photo"
          maxWidth="sm"
        >
          <div className="space-y-4 text-start">
            <p className="text-sm text-slate-600">
              Remove this photo from the website gallery?
            </p>
            <div className="flex justify-end gap-2">
              <Button variant="secondary" onClick={() => setItemToDelete(null)}>
                Cancel
              </Button>
              <Button variant="danger" onClick={handleConfirmDelete}>
                Delete Photo
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
