import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { roomsService } from '../../services/roomsService.ts';
import { uploadHostelMedia } from '../../services/mediaService.ts';
import type { Room, RoomType, LocalizedString } from '../../types/index.ts';
import { Button } from '../../components/ui/Button.tsx';
import { Input } from '../../components/ui/Input.tsx';
import { Textarea } from '../../components/ui/Textarea.tsx';
import { Select } from '../../components/ui/Select.tsx';
import { Modal } from '../../components/ui/Modal.tsx';
import { Badge } from '../../components/ui/Badge.tsx';
import { useToast } from '../../components/ui/Toast.tsx';
import {
  formatCurrency,
  getAvailabilityStatus,
  getRoomPrimaryImage,
  ROOM_TYPE_DEFAULT_IMAGES,
  slugifyRoomName
} from '../../utils/helpers.ts';
import {
  Plus,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  Upload,
  Star,
  X,
  ArrowUp,
  ArrowDown,
  Copy,
  Minus,
  ClipboardList
} from 'lucide-react';

const PRESET_ROOM_PHOTOS = [
  { label: 'Single Study Room', url: '/images/room-single.jpg' },
  { label: 'Executive 2-Sharing', url: '/images/room-double.jpg' },
  { label: 'Standard 3-Sharing', url: '/images/room-triple.jpg' },
  { label: 'Economy 4-Sharing', url: '/images/room-quad.jpg' },
  { label: 'Clean Washroom', url: '/images/clean-washroom.jpg' },
  { label: 'Quiet Study Hall', url: '/images/study-hall.jpg' },
  { label: 'Mess Dining Hall', url: '/images/mess-dining.jpg' }
];

export const RoomsAdmin: React.FC = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [roomToDelete, setRoomToDelete] = useState<Room | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { toast } = useToast();

  const loadRooms = () => {
    roomsService.getAll().then(setRooms);
  };

  useEffect(() => {
    loadRooms();
  }, []);

  const handleOpenAdd = () => {
    setSlugManuallyEdited(false);
    setNewImageUrl('');
    setEditingRoom({
      id: '',
      slug: '',
      name_en: '',
      name_ur: '',
      room_type: 'double',
      beds_total: 2,
      beds_available: 2,
      monthly_fee: 8500,
      security_deposit: 4000,
      admission_fee: 1500,
      description_en: '',
      description_ur: '',
      features: [
        { en: 'Wooden Beds + Orthopedic Mattresses', ur: 'لکڑی کے بیڈز مع آرام دہ گدے' },
        { en: 'Dedicated Study Desk & Chair', ur: 'الگ اسٹڈی ٹیبل اور کرسی' },
        { en: 'Personal Lockable Wardrobe', ur: 'ذاتی تالے والی الماری' },
        { en: 'High-Speed Fiber WiFi & UPS Backup', ur: 'فائبر وائی فائی اور یو پی ایس بیک اپ' }
      ],
      image_urls: ['/images/room-double.jpg', '/images/clean-washroom.jpg'],
      is_published: true,
      sort_order: rooms.length + 1
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (room: Room) => {
    setSlugManuallyEdited(true);
    setNewImageUrl('');
    setEditingRoom({
      ...room,
      features: Array.isArray(room.features) ? room.features.map((f) => ({ ...f })) : [],
      image_urls: Array.isArray(room.image_urls) ? [...room.image_urls] : []
    });
    setIsModalOpen(true);
  };

  const handleDuplicateRoom = async (room: Room) => {
    try {
      await roomsService.create({
        ...room,
        name_en: `${room.name_en} (Copy)`,
        slug: `${room.slug}-copy`,
        sort_order: rooms.length + 1
      });
      toast('Room duplicated! You can now edit its details and price.', 'success');
      loadRooms();
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Failed to duplicate room.', 'error');
    }
  };

  const handleAdjustBeds = async (room: Room, delta: number) => {
    const nextAvail = Math.max(0, Math.min(room.beds_total, room.beds_available + delta));
    if (nextAvail === room.beds_available) return;
    try {
      await roomsService.update(room.id, { beds_available: nextAvail });
      loadRooms();
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Failed to update bed count.', 'error');
    }
  };

  const handleMoveRoom = async (index: number, direction: -1 | 1) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= rooms.length) return;
    const reordered = [...rooms];
    const [moved] = reordered.splice(index, 1);
    reordered.splice(targetIndex, 0, moved);
    setRooms(reordered);
    try {
      await roomsService.reorder(reordered.map((r) => r.id));
      toast('Room display order updated.', 'info');
      loadRooms();
    } catch {
      toast('Failed to reorder rooms.', 'error');
      loadRooms();
    }
  };

  const handleTogglePublish = async (room: Room) => {
    try {
      await roomsService.update(room.id, { is_published: !room.is_published });
      toast(`Room ${room.is_published ? 'hidden from public site' : 'published live'}!`, 'info');
      loadRooms();
    } catch {
      toast('Failed to update room visibility.', 'error');
    }
  };

  const handleUploadRoomPhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0 || !editingRoom) return;
    setUploadingPhoto(true);
    try {
      const uploadedUrls: string[] = [];
      for (let i = 0; i < files.length; i += 1) {
        const url = await uploadHostelMedia(files[i], 'rooms');
        uploadedUrls.push(url);
      }
      setEditingRoom((prev) =>
        prev ? { ...prev, image_urls: [...prev.image_urls, ...uploadedUrls] } : null
      );
      toast(`${uploadedUrls.length} photo(s) uploaded!`, 'success');
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Failed to upload room photo.', 'error');
    } finally {
      setUploadingPhoto(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleAddImageUrl = () => {
    if (!editingRoom || !newImageUrl.trim()) return;
    const trimmed = newImageUrl.trim();
    if (!editingRoom.image_urls.includes(trimmed)) {
      setEditingRoom({
        ...editingRoom,
        image_urls: [...editingRoom.image_urls, trimmed]
      });
    }
    setNewImageUrl('');
  };

  const handleSetPrimaryPhoto = (idx: number) => {
    if (!editingRoom || idx === 0) return;
    const next = [...editingRoom.image_urls];
    const [chosen] = next.splice(idx, 1);
    next.unshift(chosen);
    setEditingRoom({ ...editingRoom, image_urls: next });
  };

  const handleRemovePhoto = (idx: number) => {
    if (!editingRoom) return;
    setEditingRoom({
      ...editingRoom,
      image_urls: editingRoom.image_urls.filter((_, i) => i !== idx)
    });
  };

  const handleAddFeature = () => {
    if (!editingRoom) return;
    setEditingRoom({
      ...editingRoom,
      features: [...editingRoom.features, { en: '', ur: '' }]
    });
  };

  const handleUpdateFeature = (idx: number, key: keyof LocalizedString, val: string) => {
    if (!editingRoom) return;
    const next = editingRoom.features.map((item, i) =>
      i === idx ? { ...item, [key]: val } : item
    );
    setEditingRoom({ ...editingRoom, features: next });
  };

  const handleRemoveFeature = (idx: number) => {
    if (!editingRoom) return;
    setEditingRoom({
      ...editingRoom,
      features: editingRoom.features.filter((_, i) => i !== idx)
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRoom) return;

    if (!editingRoom.name_en.trim()) {
      toast('Please enter an English room name.', 'error');
      return;
    }

    const cleanedFeatures = editingRoom.features.filter((f) => f.en.trim() || f.ur.trim());
    const cleanedImages = editingRoom.image_urls.map((u) => u.trim()).filter(Boolean);
    const finalPayload: Room = {
      ...editingRoom,
      slug: editingRoom.slug.trim() || slugifyRoomName(editingRoom.name_en),
      beds_available: Math.min(editingRoom.beds_total, Math.max(0, editingRoom.beds_available)),
      features: cleanedFeatures,
      image_urls:
        cleanedImages.length > 0
          ? cleanedImages
          : [ROOM_TYPE_DEFAULT_IMAGES[editingRoom.room_type]]
    };

    setLoading(true);
    try {
      if (editingRoom.id) {
        await roomsService.update(editingRoom.id, finalPayload);
        toast('Room details, photos & pricing updated live on website!', 'success');
      } else {
        await roomsService.create(finalPayload);
        toast('New room created and published on the website!', 'success');
      }
      setIsModalOpen(false);
      loadRooms();
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Error saving room.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!roomToDelete) return;
    try {
      await roomsService.remove(roomToDelete.id);
      toast('Room deleted permanently. You can add a new room anytime.', 'info');
      setIsDeleteModalOpen(false);
      setRoomToDelete(null);
      loadRooms();
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Failed to delete room.', 'error');
    }
  };

  return (
    <div className="space-y-6 text-start">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Rooms, Photos & Pricing Management</h1>
          <p className="text-xs text-slate-500 mt-1">
            Add new rooms, upload distinct room photos, adjust monthly fees, update live bed availability, or delete and recreate rooms anytime.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <Link to="/admin/beds">
            <Button
              variant="outline"
              icon={<ClipboardList className="w-4 h-4" />}
              className="whitespace-nowrap"
            >
              All Beds & Resident Report
            </Button>
          </Link>
          <Button
            variant="primary"
            icon={<Plus className="w-4 h-4" />}
            onClick={handleOpenAdd}
            className="whitespace-nowrap"
          >
            Add New Room
          </Button>
        </div>
      </div>

      {/* Rooms Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-start text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600">
                <th className="py-3 px-4 text-start font-semibold">Order</th>
                <th className="py-3 px-4 text-start font-semibold">Photo</th>
                <th className="py-3 px-4 text-start font-semibold">Room Name & Slug</th>
                <th className="py-3 px-4 text-start font-semibold">Category</th>
                <th className="py-3 px-4 text-start font-semibold">Monthly Rent</th>
                <th className="py-3 px-4 text-start font-semibold">Live Beds (Avail / Total)</th>
                <th className="py-3 px-4 text-start font-semibold">Visibility</th>
                <th className="py-3 px-4 text-end font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rooms.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-10 text-center text-slate-500">
                    No rooms added yet. Click <strong>Add New Room</strong> to create your first room listing.
                  </td>
                </tr>
              ) : (
                rooms.map((room, index) => {
                  const availStatus = getAvailabilityStatus(room.beds_available);
                  const badgeVariant =
                    availStatus === 'available'
                      ? 'success'
                      : availStatus === 'limited'
                      ? 'warning'
                      : 'danger';

                  return (
                    <tr key={room.id} className="hover:bg-slate-50/70 transition">
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            disabled={index === 0}
                            onClick={() => handleMoveRoom(index, -1)}
                            className="p-1 rounded hover:bg-slate-200 disabled:opacity-30 cursor-pointer"
                            aria-label={`Move ${room.name_en} up`}
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            disabled={index === rooms.length - 1}
                            onClick={() => handleMoveRoom(index, 1)}
                            className="p-1 rounded hover:bg-slate-200 disabled:opacity-30 cursor-pointer"
                            aria-label={`Move ${room.name_en} down`}
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <img
                          src={getRoomPrimaryImage(room)}
                          alt={room.name_en}
                          referrerPolicy="no-referrer"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src =
                              ROOM_TYPE_DEFAULT_IMAGES[room.room_type] || '/images/room-single.jpg';
                          }}
                          className="w-14 h-10 object-cover rounded-lg border border-slate-200"
                        />
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-bold text-slate-900 block">{room.name_en}</span>
                        <span className="text-[11px] text-teal-700 font-urdu block">
                          {room.name_ur || '—'}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">/{room.slug}</span>
                      </td>
                      <td className="py-3 px-4 capitalize text-slate-700 font-medium">
                        {room.room_type}
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-teal-800 text-sm num-ltr whitespace-nowrap">
                        {formatCurrency(room.monthly_fee)}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleAdjustBeds(room, -1)}
                            disabled={room.beds_available <= 0}
                            className="w-6 h-6 rounded-md border border-slate-200 bg-white hover:bg-slate-100 flex items-center justify-center disabled:opacity-40 cursor-pointer"
                            aria-label={`Decrease available beds for ${room.name_en}`}
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <Badge variant={badgeVariant}>
                            {room.beds_available} / {room.beds_total} Beds
                          </Badge>
                          <button
                            type="button"
                            onClick={() => handleAdjustBeds(room, 1)}
                            disabled={room.beds_available >= room.beds_total}
                            className="w-6 h-6 rounded-md border border-slate-200 bg-white hover:bg-slate-100 flex items-center justify-center disabled:opacity-40 cursor-pointer"
                            aria-label={`Increase available beds for ${room.name_en}`}
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => handleTogglePublish(room)}
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer transition ${
                            room.is_published
                              ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                              : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                          }`}
                        >
                          {room.is_published ? (
                            <>
                              <Eye className="w-3 h-3" />
                              <span>Published</span>
                            </>
                          ) : (
                            <>
                              <EyeOff className="w-3 h-3" />
                              <span>Hidden</span>
                            </>
                          )}
                        </button>
                      </td>
                      <td className="py-3 px-4 text-end whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(room)}
                            className="p-1.5 rounded-lg text-slate-600 hover:text-teal-700 hover:bg-slate-100 transition cursor-pointer"
                            title="Edit Room"
                            aria-label={`Edit ${room.name_en}`}
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDuplicateRoom(room)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-700 hover:bg-indigo-50 transition cursor-pointer"
                            title="Duplicate Room"
                            aria-label={`Duplicate ${room.name_en}`}
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setRoomToDelete(room);
                              setIsDeleteModalOpen(true);
                            }}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition cursor-pointer"
                            title="Delete Room"
                            aria-label={`Delete ${room.name_en}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {editingRoom && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={editingRoom.id ? `Edit Room — ${editingRoom.name_en}` : 'Add New Room Listing'}
          maxWidth="2xl"
        >
          <form onSubmit={handleSave} className="space-y-5 text-start max-h-[78vh] overflow-y-auto pr-1">
            {/* Names */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Room Name (English)"
                value={editingRoom.name_en}
                onChange={(e) => {
                  const val = e.target.value;
                  setEditingRoom({
                    ...editingRoom,
                    name_en: val,
                    slug: slugManuallyEdited ? editingRoom.slug : slugifyRoomName(val)
                  });
                }}
                placeholder="e.g. Executive 2-Bed Sharing Room"
                required
              />
              <Input
                label="Room Name (Urdu - اردو)"
                value={editingRoom.name_ur}
                onChange={(e) =>
                  setEditingRoom({ ...editingRoom, name_ur: e.target.value })
                }
                placeholder="مثلاً: ایگزیکٹو ۲ بیڈ شیئرنگ روم"
                dir="rtl"
              />
            </div>

            {/* Slug, Type & Sort Order */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Select
                label="Room Category"
                value={editingRoom.room_type}
                onChange={(e) => {
                  const nextType = e.target.value as RoomType;
                  setEditingRoom({
                    ...editingRoom,
                    room_type: nextType
                  });
                }}
              >
                <option value="single">Single Room (1 Bed)</option>
                <option value="double">Double Sharing (2 Beds)</option>
                <option value="triple">Triple Sharing (3 Beds)</option>
                <option value="quad">Economy (4 Sharing)</option>
              </Select>

              <Input
                label="URL Slug (Unique)"
                value={editingRoom.slug}
                onChange={(e) => {
                  setSlugManuallyEdited(true);
                  setEditingRoom({ ...editingRoom, slug: slugifyRoomName(e.target.value) });
                }}
                placeholder="auto-generated-from-name"
              />

              <Input
                type="number"
                label="Display Order"
                value={editingRoom.sort_order}
                min={1}
                onChange={(e) =>
                  setEditingRoom({
                    ...editingRoom,
                    sort_order: parseInt(e.target.value, 10) || 1
                  })
                }
              />
            </div>

            {/* Beds & Fees */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              <Input
                type="number"
                label="Total Beds"
                value={editingRoom.beds_total}
                min={1}
                onChange={(e) => {
                  const total = Math.max(1, parseInt(e.target.value, 10) || 1);
                  setEditingRoom({
                    ...editingRoom,
                    beds_total: total,
                    beds_available: Math.min(editingRoom.beds_available, total)
                  });
                }}
                required
              />

              <Input
                type="number"
                label="Available Beds"
                value={editingRoom.beds_available}
                min={0}
                max={editingRoom.beds_total}
                onChange={(e) =>
                  setEditingRoom({
                    ...editingRoom,
                    beds_available: Math.min(
                      editingRoom.beds_total,
                      Math.max(0, parseInt(e.target.value, 10) || 0)
                    )
                  })
                }
                required
              />

              <Input
                type="number"
                label="Monthly Rent"
                value={editingRoom.monthly_fee}
                min={0}
                onChange={(e) =>
                  setEditingRoom({
                    ...editingRoom,
                    monthly_fee: Math.max(0, parseInt(e.target.value, 10) || 0)
                  })
                }
                required
              />

              <Input
                type="number"
                label="Security (PKR)"
                value={editingRoom.security_deposit}
                min={0}
                onChange={(e) =>
                  setEditingRoom({
                    ...editingRoom,
                    security_deposit: Math.max(0, parseInt(e.target.value, 10) || 0)
                  })
                }
              />

              <Input
                type="number"
                label="Admission Fee"
                value={editingRoom.admission_fee}
                min={0}
                onChange={(e) =>
                  setEditingRoom({
                    ...editingRoom,
                    admission_fee: Math.max(0, parseInt(e.target.value, 10) || 0)
                  })
                }
              />
            </div>

            {/* Descriptions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Textarea
                label="Description (English)"
                value={editingRoom.description_en}
                onChange={(e) =>
                  setEditingRoom({
                    ...editingRoom,
                    description_en: e.target.value
                  })
                }
                rows={3}
              />
              <Textarea
                label="Description (Urdu - اردو)"
                value={editingRoom.description_ur}
                onChange={(e) =>
                  setEditingRoom({
                    ...editingRoom,
                    description_ur: e.target.value
                  })
                }
                dir="rtl"
                rows={3}
              />
            </div>

            {/* Multi-Photo Manager */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="text-xs font-bold text-slate-800 block">
                    Room Photos Gallery ({editingRoom.image_urls.length})
                  </span>
                  <span className="text-[11px] text-slate-500">
                    First photo is shown on the room card. Upload from computer, paste URL, or pick a built-in photo.
                  </span>
                </div>
                <div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/png,image/jpeg,image/webp,image/svg+xml"
                    onChange={handleUploadRoomPhoto}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    loading={uploadingPhoto}
                    onClick={() => fileInputRef.current?.click()}
                    icon={<Upload className="w-3.5 h-3.5" />}
                  >
                    Upload Photo(s)
                  </Button>
                </div>
              </div>

              {/* Add URL input */}
              <div className="flex gap-2">
                <div className="flex-1">
                  <Input
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    placeholder="Paste image URL (https://... or /images/...)"
                  />
                </div>
                <Button type="button" variant="outline" size="sm" onClick={handleAddImageUrl}>
                  Add URL
                </Button>
              </div>

              {/* Quick Preset Picker */}
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[11px] font-semibold text-slate-500 me-1">Quick Add:</span>
                {PRESET_ROOM_PHOTOS.map((preset) => (
                  <button
                    key={preset.url}
                    type="button"
                    onClick={() => {
                      if (!editingRoom.image_urls.includes(preset.url)) {
                        setEditingRoom({
                          ...editingRoom,
                          image_urls: [...editingRoom.image_urls, preset.url]
                        });
                      }
                    }}
                    className="text-[11px] px-2 py-1 rounded-md bg-white border border-slate-200 hover:border-teal-600 text-slate-700 hover:text-teal-800 transition cursor-pointer"
                  >
                    + {preset.label}
                  </button>
                ))}
              </div>

              {/* Photo Thumbnails */}
              {editingRoom.image_urls.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
                  {editingRoom.image_urls.map((url, idx) => (
                    <div
                      key={`${url}-${idx}`}
                      className={`relative rounded-xl overflow-hidden border bg-white ${
                        idx === 0 ? 'border-teal-600 ring-2 ring-teal-600/20' : 'border-slate-200'
                      }`}
                    >
                      <div className="aspect-[4/3] bg-slate-100">
                        <img
                          src={url}
                          alt={`Room preview ${idx + 1}`}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-1.5 flex items-center justify-between bg-white text-[10px]">
                        {idx === 0 ? (
                          <span className="font-bold text-teal-700 flex items-center gap-1">
                            <Star className="w-3 h-3 fill-teal-600 text-teal-600" />
                            Cover
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleSetPrimaryPhoto(idx)}
                            className="text-slate-600 hover:text-teal-700 font-semibold cursor-pointer"
                          >
                            Make Cover
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleRemovePhoto(idx)}
                          className="text-slate-400 hover:text-red-600 p-0.5 cursor-pointer"
                          aria-label="Remove photo"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Room Features / Amenities Editor */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-800 block">
                    Room Amenities & Features ({editingRoom.features.length})
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Bullet points displayed on the room card and room detail modal.
                  </span>
                </div>
                <Button type="button" variant="outline" size="sm" onClick={handleAddFeature}>
                  + Add Feature
                </Button>
              </div>

              <div className="space-y-2">
                {editingRoom.features.map((feat, idx) => (
                  <div key={idx} className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-center">
                    <div className="sm:col-span-5">
                      <Input
                        placeholder="Feature in English (e.g. Attached Bath)"
                        value={feat.en}
                        onChange={(e) => handleUpdateFeature(idx, 'en', e.target.value)}
                      />
                    </div>
                    <div className="sm:col-span-6">
                      <Input
                        placeholder="اردو میں خصوصیت (مثلاً: اٹیچ واش روم)"
                        value={feat.ur}
                        onChange={(e) => handleUpdateFeature(idx, 'ur', e.target.value)}
                        dir="rtl"
                      />
                    </div>
                    <div className="sm:col-span-1 flex justify-end">
                      <button
                        type="button"
                        onClick={() => handleRemoveFeature(idx)}
                        className="p-2 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 cursor-pointer"
                        aria-label="Remove feature"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Publish toggle */}
            <label className="flex items-center gap-2.5 text-xs font-semibold text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={editingRoom.is_published}
                onChange={(e) =>
                  setEditingRoom({ ...editingRoom, is_published: e.target.checked })
                }
                className="rounded text-teal-700 focus:ring-teal-700"
              />
              <span>Show this room immediately on the public website</span>
            </label>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" variant="primary" loading={loading}>
                {editingRoom.id ? 'Save Room Changes' : 'Publish New Room'}
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Delete Confirmation Modal */}
      {roomToDelete && (
        <Modal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          title="Confirm Delete Room"
          maxWidth="sm"
        >
          <div className="space-y-4 text-start">
            <p className="text-sm text-slate-600">
              Are you sure you want to delete{' '}
              <strong className="text-slate-900">{roomToDelete.name_en}</strong>? It will be removed from the public website immediately, and you can add a new room anytime.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="secondary" onClick={() => setIsDeleteModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="danger" onClick={handleDelete}>
                Delete Room
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
