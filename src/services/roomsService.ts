import { mockStore } from './mockStore.ts';
import { supabase } from './supabaseClient.ts';
import type { Room } from '../types/index.ts';
import type { TablesInsert, TablesUpdate } from '../types/database.ts';
import { asRow, asRows, stripSystemFields, throwIfSupabaseError } from './serviceHelpers.ts';
import { enrichRooms } from './seedEnrichment.ts';
import { ensureUniqueSlug, getRoomImages, slugifyRoomName } from '../utils/helpers.ts';

function sanitizeRoomNumbers<T extends Partial<Room>>(room: T): T {
  const next = { ...room };
  if (next.beds_total !== undefined) {
    next.beds_total = Math.max(1, Math.round(Number(next.beds_total) || 1));
  }
  if (next.beds_available !== undefined) {
    const maxBeds = next.beds_total !== undefined ? next.beds_total : Infinity;
    next.beds_available = Math.max(0, Math.min(maxBeds, Math.round(Number(next.beds_available) || 0)));
  }
  if (next.monthly_fee !== undefined) {
    next.monthly_fee = Math.max(0, Math.round(Number(next.monthly_fee) || 0));
  }
  if (next.security_deposit !== undefined) {
    next.security_deposit = Math.max(0, Math.round(Number(next.security_deposit) || 0));
  }
  if (next.admission_fee !== undefined) {
    next.admission_fee = Math.max(0, Math.round(Number(next.admission_fee) || 0));
  }
  return next;
}

export const roomsService = {
  async getPublished(): Promise<Room[]> {
    if (supabase) {
      const { data, error } = await supabase
        .from('rooms')
        .select('*')
        .eq('is_published', true)
        .order('sort_order');
      throwIfSupabaseError(error);
      return enrichRooms(asRows<Room>(data));
    }
    await mockStore.delay();
    return mockStore.rooms
      .filter((r) => r.is_published)
      .map((r) => ({ ...r, image_urls: getRoomImages(r) }))
      .sort((a, b) => a.sort_order - b.sort_order);
  },

  async getBySlug(slug: string): Promise<Room | null> {
    if (supabase) {
      const { data, error } = await supabase
        .from('rooms')
        .select('*')
        .eq('slug', slug)
        .eq('is_published', true)
        .maybeSingle();
      throwIfSupabaseError(error);
      if (!data) return null;
      return enrichRooms([data as unknown as Room])[0] ?? null;
    }
    await mockStore.delay();
    const room = mockStore.rooms.find((r) => r.slug === slug && r.is_published);
    return room ? { ...room, image_urls: getRoomImages(room) } : null;
  },

  async getAll(): Promise<Room[]> {
    if (supabase) {
      const { data, error } = await supabase.from('rooms').select('*').order('sort_order');
      throwIfSupabaseError(error);
      return enrichRooms(asRows<Room>(data));
    }
    await mockStore.delay();
    return [...mockStore.rooms]
      .map((r) => ({ ...r, image_urls: getRoomImages(r) }))
      .sort((a, b) => a.sort_order - b.sort_order);
  },

  async getById(id: string): Promise<Room | null> {
    if (supabase) {
      const { data, error } = await supabase.from('rooms').select('*').eq('id', id).maybeSingle();
      throwIfSupabaseError(error);
      if (!data) return null;
      return enrichRooms([data as unknown as Room])[0] ?? null;
    }
    await mockStore.delay();
    const room = mockStore.rooms.find((r) => r.id === id);
    return room ? { ...room, image_urls: getRoomImages(room) } : null;
  },

  async create(roomData: Omit<Room, 'id' | 'created_at' | 'updated_at'> & { id?: string }): Promise<Room> {
    const cleanInput = sanitizeRoomNumbers(stripSystemFields(roomData));
    const cleanedImages = (cleanInput.image_urls || []).map((u) => u.trim()).filter(Boolean);

    if (supabase) {
      const existing = await this.getAll();
      const uniqueSlug = ensureUniqueSlug(
        cleanInput.slug || slugifyRoomName(cleanInput.name_en),
        existing.map((r) => r.slug)
      );
      const insertPayload = {
        ...cleanInput,
        slug: uniqueSlug,
        image_urls: cleanedImages.length > 0 ? cleanedImages : getRoomImages({ room_type: cleanInput.room_type, image_urls: [] }),
        features: Array.isArray(cleanInput.features) ? cleanInput.features : []
      };

      const { data, error } = await supabase
        .from('rooms')
        .insert(insertPayload as unknown as TablesInsert<'rooms'>)
        .select('*')
        .single();
      throwIfSupabaseError(error);
      mockStore.notify();
      return asRow<Room>(data, 'Created room');
    }

    await mockStore.delay();
    const uniqueSlug = ensureUniqueSlug(
      cleanInput.slug || slugifyRoomName(cleanInput.name_en),
      mockStore.rooms.map((r) => r.slug)
    );
    const newRoom: Room = {
      ...cleanInput,
      slug: uniqueSlug,
      image_urls: cleanedImages.length > 0 ? cleanedImages : getRoomImages({ room_type: cleanInput.room_type, image_urls: [] }),
      id: 'room-' + Date.now(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    mockStore.rooms.push(newRoom);
    mockStore.notify();
    return { ...newRoom };
  },

  async update(id: string, patch: Partial<Room>): Promise<Room> {
    const safePatch = sanitizeRoomNumbers(stripSystemFields(patch));
    if (safePatch.image_urls !== undefined) {
      safePatch.image_urls = safePatch.image_urls.map((u) => u.trim()).filter(Boolean);
    }

    if (supabase) {
      // Ensure beds_available <= beds_total if only one of them was passed in patch
      if (safePatch.beds_total !== undefined && safePatch.beds_available === undefined) {
        const current = await this.getById(id);
        if (current && current.beds_available > safePatch.beds_total) {
          safePatch.beds_available = safePatch.beds_total;
        }
      }
      const { data, error } = await supabase
        .from('rooms')
        .update(safePatch as unknown as TablesUpdate<'rooms'>)
        .eq('id', id)
        .select('*')
        .single();
      throwIfSupabaseError(error);
      mockStore.notify();
      return asRow<Room>(data, 'Updated room');
    }

    await mockStore.delay();
    const index = mockStore.rooms.findIndex((r) => r.id === id);
    if (index === -1) throw new Error('Room not found');
    const merged = sanitizeRoomNumbers({
      ...mockStore.rooms[index],
      ...safePatch,
      updated_at: new Date().toISOString()
    });
    mockStore.rooms[index] = merged;
    mockStore.notify();
    return { ...mockStore.rooms[index] };
  },

  async remove(id: string): Promise<void> {
    if (supabase) {
      const { error } = await supabase.from('rooms').delete().eq('id', id);
      throwIfSupabaseError(error);
      mockStore.notify();
      return;
    }
    await mockStore.delay();
    mockStore.rooms = mockStore.rooms.filter((r) => r.id !== id);
    mockStore.notify();
  },

  async reorder(orderedIds: string[]): Promise<void> {
    if (supabase) {
      for (let index = 0; index < orderedIds.length; index += 1) {
        const { error } = await supabase
          .from('rooms')
          .update({ sort_order: index + 1 })
          .eq('id', orderedIds[index]);
        throwIfSupabaseError(error);
      }
      mockStore.notify();
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
