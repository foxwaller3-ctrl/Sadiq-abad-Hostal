import React, { useState, useEffect } from 'react';
import { galleryService } from '../../services/galleryService.ts';
import { uploadHostelMedia, deleteHostelMedia } from '../../services/mediaService.ts';
import type { GalleryItem, GalleryCategory } from '../../types/index.ts';
import { Button } from '../../components/ui/Button.tsx';
import { Input } from '../../components/ui/Input.tsx';
import { Select } from '../../components/ui/Select.tsx';
import { Modal } from '../../components/ui/Modal.tsx';
import { useToast } from '../../components/ui/Toast.tsx';
import { Plus, Trash2, Eye, EyeOff, Image as ImageIcon } from 'lucide-react';

export const GalleryAdmin: React.FC = () => {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newItem, setNewItem] = useState<Omit<GalleryItem, 'id'>>({
    category: 'rooms',
    image_url: '',
    caption_en: '',
    caption_ur: '',
    is_published: true,
    sort_order: 1
  });
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { toast } = useToast();

  const loadData = () => {
    galleryService.getAll().then(setItems);
  };

  useEffect(() => {
    loadData();
  }, []);

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
    if (!newItem.image_url.trim() && !selectedFile) {
      toast('Image URL is required.', 'error');
      return;
    }

    setLoading(true);
    try {
      const uploadedUrl = selectedFile ? await uploadHostelMedia(selectedFile, 'gallery') : newItem.image_url.trim();
      await galleryService.create({ ...newItem, image_url: uploadedUrl });
      toast('New photo added to gallery!', 'success');
      setIsModalOpen(false);
      setSelectedFile(null);
      setNewItem({
        category: 'rooms',
        image_url: '',
        caption_en: '',
        caption_ur: '',
        is_published: true,
        sort_order: items.length + 1
      });
      loadData();
    } catch {
      toast('Failed to save photo.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this photo from gallery?')) return;
    try {
      const item = items.find((photo) => photo.id === id);
      await galleryService.remove(id);
      if (item) {
        try { await deleteHostelMedia(item.image_url); } catch { /* row removal succeeded; orphaned storage can be cleaned later */ }
      }
      toast('Photo deleted.', 'info');
      loadData();
    } catch {
      toast('Failed to delete.', 'error');
    }
  };

  return (
    <div className="space-y-6 text-start">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Gallery Photos Management</h1>
          <p className="text-xs text-slate-500 mt-1">
            Upload and organize authentic hostel photos across rooms, mess, and study hall.
          </p>
        </div>
        <Button variant="primary" icon={<Plus className="w-4 h-4" />} onClick={() => setIsModalOpen(true)}>
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
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-2 left-2 text-[10px] font-bold uppercase tracking-wider bg-slate-900/80 text-white px-2 py-0.5 rounded-full backdrop-blur-xs">
                  {item.category.replace('_', ' ')}
                </span>
              </div>
              <div className="p-3 text-xs space-y-1">
                <p className="font-semibold text-slate-800 line-clamp-1">{item.caption_en || 'No caption'}</p>
                <p className="text-teal-700 font-medium line-clamp-1" dir="rtl">{item.caption_ur || '—'}</p>
              </div>
            </div>

            <div className="p-3 pt-0 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => handleTogglePublish(item)}
                className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full cursor-pointer ${
                  item.is_published ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'
                }`}
              >
                {item.is_published ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                <span>{item.is_published ? 'Published' : 'Hidden'}</span>
              </button>
              <button
                onClick={() => handleDelete(item.id)}
                className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg transition cursor-pointer"
                title="Delete photo"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Photo Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add Photo to Gallery"
        maxWidth="md"
      >
        <form onSubmit={handleSave} className="space-y-4 text-start">
          <div className="space-y-3">
            <Input
              label="Upload image (optional)"
              type="file"
              accept="image/png,image/jpeg,image/webp,image/svg+xml"
              onChange={(e) => setSelectedFile(e.target.files?.[0] ?? null)}
            />
            <p className="text-xs text-slate-500">PNG, JPG, WebP or SVG; maximum 5 MB. A selected file is uploaded to the private-write/public-read hostel-media bucket when you save.</p>
            <Input
              label="Or use an Image URL"
              value={newItem.image_url}
              onChange={(e) => setNewItem({ ...newItem, image_url: e.target.value })}
              placeholder="https://images.unsplash.com/..."
              required={!selectedFile}
            />
            {selectedFile && <p className="text-xs text-teal-700">Selected: {selectedFile.name}</p>}
          </div>

          <Select
            label="Category"
            value={newItem.category}
            onChange={(e) =>
              setNewItem({ ...newItem, category: e.target.value as GalleryCategory })
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
            label="Caption (English)"
            value={newItem.caption_en}
            onChange={(e) => setNewItem({ ...newItem, caption_en: e.target.value })}
            placeholder="e.g. Spacious Double Room with study desks"
          />

          <Input
            label="Caption (Urdu)"
            value={newItem.caption_ur}
            onChange={(e) => setNewItem({ ...newItem, caption_ur: e.target.value })}
            placeholder="مثلاً: کشادہ ڈبل روم مع اسٹڈی ٹیبلز"
            dir="rtl"
          />

          <div className="pt-3 border-t flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" loading={loading}>
              Add Photo
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
