import { mockStore } from './mockStore.ts';
import { supabase } from './supabaseClient.ts';
import type { Room } from '../types/index.ts';
import { asRow, asRows, throwIfSupabaseError } from './serviceHelpers.ts';

export const roomsService = {
  async getPublished(): Promise<Room[]> {
    if (supabase) {
      const { data, error } = await supabase.from('rooms').select('*').eq('is_published', true).order('sort_order');
      throwIfSupabaseError(error);
      return asRows<Room>(data);
    }
    await mockStore.delay();
    return mockStore.rooms.filter((r) => r.is_published).sort((a, b) => a.sort_order - b.sort_order);
  },

  async getBySlug(slug: string): Promise<Room | null> {
    if (supabase) {
      const { data, error } = await supabase.from('rooms').select('*').eq('slug', slug).eq('is_published', true).maybeSingle();
      throwIfSupabaseError(error);
      return data as unknown as Room | null;
    }
    await mockStore.delay();
    const room = mockStore.rooms.find((r) => r.slug === slug && r.is_published);
    return room ? { ...room } : null;
  },

  async getAll(): Promise<Room[]> {
    if (supabase) {
      const { data, error } = await supabase.from('rooms').select('*').order('sort_order');
      throwIfSupabaseError(error);
      return asRows<Room>(data);
    }
    await mockStore.delay();
    return [...mockStore.rooms].sort((a, b) => a.sort_order - b.sort_order);
  },

  async getById(id: string): Promise<Room | null> {
    if (supabase) {
      const { data, error } = await supabase.from('rooms').select('*').eq('id', id).maybeSingle();
      throwIfSupabaseError(error);
      return data as unknown as Room | null;
    }
    await mockStore.delay();
    const room = mockStore.rooms.find((r) => r.id === id);
    return room ? { ...room } : null;
  },

  async create(roomData: Omit<Room, 'id' | 'created_at' | 'updated_at'>): Promise<Room> {
    if (supabase) {
      const { data, error } = await supabase.from('rooms').insert(roomData).select('*').single();
      throwIfSupabaseError(error);
      return asRow<Room>(data, 'Created room');
    }
    await mockStore.delay();
    const newRoom: Room = { ...roomData, id: 'room-' + Date.now(), created_at: new Date().toISOString(), updated_at: new Date().toISOString() };
    mockStore.rooms.push(newRoom);
    mockStore.notify();
    return { ...newRoom };
  },

  async update(id: string, patch: Partial<Room>): Promise<Room> {
    if (supabase) {
      const { id: _id, created_at: _createdAt, updated_at: _updatedAt, ...safePatch } = patch;
      const { data, error } = await supabase.from('rooms').update(safePatch).eq('id', id).select('*').single();
      throwIfSupabaseError(error);
      return asRow<Room>(data, 'Updated room');
    }
    await mockStore.delay();
    const index = mockStore.rooms.findIndex((r) => r.id === id);
    if (index === -1) throw new Error('Room not found');
    mockStore.rooms[index] = { ...mockStore.rooms[index], ...patch, updated_at: new Date().toISOString() };
    mockStore.notify();
    return { ...mockStore.rooms[index] };
  },

  async remove(id: string): Promise<void> {
    if (supabase) {
      const { error } = await supabase.from('rooms').delete().eq('id', id);
      throwIfSupabaseError(error);
      return;
    }
    await mockStore.delay();
    mockStore.rooms = mockStore.rooms.filter((r) => r.id !== id);
    mockStore.notify();
  },

  async reorder(orderedIds: string[]): Promise<void> {
    if (supabase) {
      for (let index = 0; index < orderedIds.length; index += 1) {
        const { error } = await supabase.from('rooms').update({ sort_order: index + 1 }).eq('id', orderedIds[index]);
        throwIfSupabaseError(error);
      }
      return;
    }
    await mockStore.delay();
    orderedIds.forEach((id, index) => {
      const room = mockStore.rooms.find((r) => r.id === id);
      if (room) room.sort_order = index + 1;
    });
    mockStore.notify();
  }
};
