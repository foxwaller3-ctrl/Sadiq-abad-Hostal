import { mockStore } from './mockStore.ts';
import type { Room } from '../types/index.ts';

export const roomsService = {
  async getPublished(): Promise<Room[]> {
    await mockStore.delay();
    return mockStore.rooms
      .filter((r) => r.is_published)
      .sort((a, b) => a.sort_order - b.sort_order);
  },

  async getBySlug(slug: string): Promise<Room | null> {
    await mockStore.delay();
    const room = mockStore.rooms.find((r) => r.slug === slug);
    return room ? { ...room } : null;
  },

  async getAll(): Promise<Room[]> {
    await mockStore.delay();
    return [...mockStore.rooms].sort((a, b) => a.sort_order - b.sort_order);
  },

  async getById(id: string): Promise<Room | null> {
    await mockStore.delay();
    const room = mockStore.rooms.find((r) => r.id === id);
    return room ? { ...room } : null;
  },

  async create(roomData: Omit<Room, 'id' | 'created_at' | 'updated_at'>): Promise<Room> {
    await mockStore.delay();
    const newRoom: Room = {
      ...roomData,
      id: `room-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    mockStore.rooms.push(newRoom);
    mockStore.notify();
    return { ...newRoom };
  },

  async update(id: string, patch: Partial<Room>): Promise<Room> {
    await mockStore.delay();
    const index = mockStore.rooms.findIndex((r) => r.id === id);
    if (index === -1) throw new Error('Room not found');

    mockStore.rooms[index] = {
      ...mockStore.rooms[index],
      ...patch,
      updated_at: new Date().toISOString()
    };
    mockStore.notify();
    return { ...mockStore.rooms[index] };
  },

  async remove(id: string): Promise<void> {
    await mockStore.delay();
    mockStore.rooms = mockStore.rooms.filter((r) => r.id !== id);
    mockStore.notify();
  },

  async reorder(orderedIds: string[]): Promise<void> {
    await mockStore.delay();
    orderedIds.forEach((id, index) => {
      const room = mockStore.rooms.find((r) => r.id === id);
      if (room) {
        room.sort_order = index + 1;
      }
    });
    mockStore.notify();
  }
};
