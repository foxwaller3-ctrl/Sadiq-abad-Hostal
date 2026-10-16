import React, { useState, useEffect } from 'react';
import { roomsService } from '../../services/roomsService.ts';
import type { Room, RoomType } from '../../types/index.ts';
import { Button } from '../../components/ui/Button.tsx';
import { Input } from '../../components/ui/Input.tsx';
import { Textarea } from '../../components/ui/Textarea.tsx';
import { Select } from '../../components/ui/Select.tsx';
import { Modal } from '../../components/ui/Modal.tsx';
import { Badge } from '../../components/ui/Badge.tsx';
import { useToast } from '../../components/ui/Toast.tsx';
import { formatCurrency, getAvailabilityStatus } from '../../utils/helpers.ts';
import { Plus, Edit2, Trash2, Check, Eye, EyeOff } from 'lucide-react';

export const RoomsAdmin: React.FC = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [roomToDelete, setRoomToDelete] = useState<Room | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const loadRooms = () => {
    roomsService.getAll().then(setRooms);
  };

  useEffect(() => {
    loadRooms();
  }, []);

  const handleOpenAdd = () => {
    setEditingRoom({
      id: '',
      slug: `room-${Date.now()}`,
      name_en: '',
      name_ur: '',
      room_type: 'single',
      beds_total: 1,
      beds_available: 1,
      monthly_fee: 10000,
      security_deposit: 5000,
      admission_fee: 2000,
      description_en: '',
      description_ur: '',
      features: [
        { en: 'Bed + Mattress', ur: 'بیڈ اور گدا' },
        { en: 'Study Table & Chair', ur: 'اسٹڈی ٹیبل اور کرسی' },
        { en: 'Wardrobe', ur: 'الماری' },
        { en: 'WiFi', ur: 'وائی فائی' }
      ],
      image_urls: [
        'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80'
      ],
      is_published: true,
      sort_order: rooms.length + 1
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (room: Room) => {
    setEditingRoom({ ...room });
    setIsModalOpen(true);
  };

  const handleTogglePublish = async (room: Room) => {
    try {
      await roomsService.update(room.id, { is_published: !room.is_published });
      toast(`Room ${room.is_published ? 'unpublished' : 'published'}!`, 'info');
      loadRooms();
    } catch {
      toast('Failed to update room.', 'error');
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRoom) return;

    if (!editingRoom.name_en.trim()) {
      toast('Please enter a room name.', 'error');
      return;
    }

    setLoading(true);
    try {
      if (editingRoom.id) {
        await roomsService.update(editingRoom.id, editingRoom);
        toast('Room updated successfully!', 'success');
      } else {
        await roomsService.create(editingRoom);
        toast('New room created successfully!', 'success');
      }
      setIsModalOpen(false);
      loadRooms();
    } catch (err) {
      toast('Error saving room.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!roomToDelete) return;
    try {
      await roomsService.remove(roomToDelete.id);
      toast('Room deleted.', 'info');
      setIsDeleteModalOpen(false);
      setRoomToDelete(null);
      loadRooms();
    } catch {
      toast('Failed to delete room.', 'error');
    }
  };

  return (
    <div className="space-y-6 text-start">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Rooms & Capacity Management</h1>
          <p className="text-xs text-slate-500 mt-1">
            Update room pricing, bed availability, and specifications in real-time.
          </p>
        </div>
        <Button variant="primary" icon={<Plus className="w-4 h-4" />} onClick={handleOpenAdd}>
          Add New Room
        </Button>
      </div>

      {/* Rooms Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-start text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600">
                <th className="py-3 px-4 text-start font-semibold">Photo</th>
                <th className="py-3 px-4 text-start font-semibold">Room Name</th>
                <th className="py-3 px-4 text-start font-semibold">Type</th>
                <th className="py-3 px-4 text-start font-semibold">Monthly Fee</th>
                <th className="py-3 px-4 text-start font-semibold">Beds (Avail / Total)</th>
                <th className="py-3 px-4 text-start font-semibold">Status</th>
                <th className="py-3 px-4 text-end font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rooms.map((room) => {
                const availStatus = getAvailabilityStatus(room.beds_available);
                const badgeVariant =
                  availStatus === 'available'
                    ? 'success'
                    : availStatus === 'limited'
                    ? 'warning'
                    : 'danger';

                return (
                  <tr key={room.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3 px-4">
                      <img
                        src={room.image_urls[0] || 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=100&q=80'}
                        alt={room.name_en}
                        className="w-12 h-9 object-cover rounded-lg border border-slate-200"
                      />
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-bold text-slate-900 block">{room.name_en}</span>
                      <span className="text-[11px] text-slate-500">{room.name_ur || '—'}</span>
                    </td>
                    <td className="py-3 px-4 capitalize text-slate-700 font-medium">
                      {room.room_type}
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-teal-800 text-sm num-ltr">
                      {formatCurrency(room.monthly_fee)}
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant={badgeVariant}>
                        {room.beds_available} / {room.beds_total} Beds
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => handleTogglePublish(room)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold cursor-pointer transition ${
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
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(room)}
                          className="p-1.5 rounded-lg text-slate-600 hover:text-teal-700 hover:bg-slate-100 transition cursor-pointer"
                          title="Edit Room"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setRoomToDelete(room);
                            setIsDeleteModalOpen(true);
                          }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition cursor-pointer"
                          title="Delete Room"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {editingRoom && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={editingRoom.id ? 'Edit Room' : 'Add New Room'}
          maxWidth="2xl"
        >
          <form onSubmit={handleSave} className="space-y-4 text-start">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Room Name (English)"
                value={editingRoom.name_en}
                onChange={(e) =>
                  setEditingRoom({ ...editingRoom, name_en: e.target.value })
                }
                required
              />
              <Input
                label="Room Name (Urdu - اردو)"
                value={editingRoom.name_ur}
                onChange={(e) =>
                  setEditingRoom({ ...editingRoom, name_ur: e.target.value })
                }
                dir="rtl"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Select
                label="Room Category"
                value={editingRoom.room_type}
                onChange={(e) =>
                  setEditingRoom({
                    ...editingRoom,
                    room_type: e.target.value as RoomType
                  })
                }
              >
                <option value="single">Single Room (1 Bed)</option>
                <option value="double">Double Sharing (2 Beds)</option>
                <option value="triple">Triple Sharing (3 Beds)</option>
                <option value="quad">Economy (4 Sharing)</option>
              </Select>

              <Input
                type="number"
                label="Total Beds"
                value={editingRoom.beds_total}
                min={1}
                onChange={(e) =>
                  setEditingRoom({
                    ...editingRoom,
                    beds_total: parseInt(e.target.value) || 1
                  })
                }
                required
              />

              <Input
                type="number"
                label="Available Beds Now"
                value={editingRoom.beds_available}
                min={0}
                max={editingRoom.beds_total}
                onChange={(e) =>
                  setEditingRoom({
                    ...editingRoom,
                    beds_available: parseInt(e.target.value) || 0
                  })
                }
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Input
                type="number"
                label="Monthly Rent (PKR)"
                value={editingRoom.monthly_fee}
                min={0}
                onChange={(e) =>
                  setEditingRoom({
                    ...editingRoom,
                    monthly_fee: parseInt(e.target.value) || 0
                  })
                }
                required
              />

              <Input
                type="number"
                label="Refundable Security (PKR)"
                value={editingRoom.security_deposit}
                min={0}
                onChange={(e) =>
                  setEditingRoom({
                    ...editingRoom,
                    security_deposit: parseInt(e.target.value) || 0
                  })
                }
              />

              <Input
                type="number"
                label="Admission Fee (PKR)"
                value={editingRoom.admission_fee}
                min={0}
                onChange={(e) =>
                  setEditingRoom({
                    ...editingRoom,
                    admission_fee: parseInt(e.target.value) || 0
                  })
                }
              />
            </div>

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
                label="Description (Urdu)"
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

            <Input
              label="Image URL"
              value={editingRoom.image_urls[0] || ''}
              onChange={(e) =>
                setEditingRoom({
                  ...editingRoom,
                  image_urls: [e.target.value]
                })
              }
              placeholder="https://images.unsplash.com/..."
            />

            <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" variant="primary" loading={loading}>
                Save Room
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
              <strong className="text-slate-900">{roomToDelete.name_en}</strong>? This action
              cannot be undone.
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
