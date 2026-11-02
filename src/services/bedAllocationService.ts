import { mockStore } from './mockStore.ts';
import { supabase } from './supabaseClient.ts';
import { roomsService } from './roomsService.ts';
import type { BedAllocation, Room } from '../types/index.ts';
import {
  computeCheckOutDate,
  defaultUnitLabelForRoom,
  getTodayIsoDate,
  validateBedAllocationInput
} from '../utils/bedReport.ts';
import { normalizePakistaniPhoneForDb } from '../utils/helpers.ts';

const STORAGE_KEY = 'sadiqabad_bed_allocations_v1';

const bedListeners = new Set<() => void>();

function notifyBedListeners(): void {
  bedListeners.forEach((listener) => listener());
}

function readLocalAllocations(): BedAllocation[] {
  if (typeof window === 'undefined') {
    return [...mockStore.bedAllocations];
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        mockStore.bedAllocations = parsed;
        return [...parsed];
      }
    }
    const seeded = [...mockStore.bedAllocations];
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded));
    return seeded;
  } catch {
    return [...mockStore.bedAllocations];
  }
}

function writeLocalAllocations(list: BedAllocation[]): void {
  mockStore.bedAllocations = [...list];
  if (typeof window !== 'undefined') {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    } catch {
      // Ignore storage quota issues
    }
  }
}

function matchesRoomAndBed(alloc: BedAllocation, room: Room, bedNumber: number): boolean {
  if (alloc.bed_number !== bedNumber) return false;
  if (alloc.room_id === room.id) return true;
  if (alloc.room_slug && alloc.room_slug === room.slug) return true;
  return false;
}

async function syncRoomAvailableBeds(room: Room, allocations: BedAllocation[]): Promise<void> {
  const totalBeds = Math.max(1, Number(room.beds_total) || 1);
  let nonVacant = 0;
  for (let b = 1; b <= totalBeds; b += 1) {
    const found = allocations.find((a) => matchesRoomAndBed(a, room, b));
    if (found && found.status !== 'vacant') {
      nonVacant += 1;
    }
  }
  const nextAvailable = Math.max(0, totalBeds - nonVacant);

  const mockIdx = mockStore.rooms.findIndex((r) => r.id === room.id || r.slug === room.slug);
  if (mockIdx !== -1) {
    mockStore.rooms[mockIdx] = {
      ...mockStore.rooms[mockIdx],
      beds_available: nextAvailable
    };
  }

  if (supabase) {
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      if (sessionData.session) {
        await roomsService.update(room.id, { beds_available: nextAvailable });
      }
    } catch {
      // Non-fatal if unauthenticated or RLS blocks update in preview
    }
  }
}

export const bedAllocationService = {
  subscribe(listener: () => void): () => void {
    bedListeners.add(listener);
    return () => {
      bedListeners.delete(listener);
    };
  },

  async getAll(): Promise<BedAllocation[]> {
    const local = readLocalAllocations();

    if (supabase) {
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        if (sessionData.session) {
          const { data, error } = await supabase
            .from('bed_allocations')
            .select('*')
            .order('bed_number', { ascending: true });

          if (!error && Array.isArray(data) && data.length > 0) {
            const remote = data as unknown as BedAllocation[];
            writeLocalAllocations(remote);
            return remote;
          }
        }
      } catch {
        // Gracefully fall back to local store if sql/10_bed_allocations.sql hasn't been run yet
      }
    }

    return [...local];
  },

  async saveAllocation(
    input: Partial<BedAllocation> & { room_id: string; bed_number: number },
    room: Room
  ): Promise<BedAllocation> {
    const payloadToCheck: Partial<BedAllocation> = {
      ...input,
      room_id: room.id
    };

    const errors = validateBedAllocationInput(payloadToCheck);
    const errorMessages = Object.values(errors);
    if (errorMessages.length > 0) {
      throw new Error(errorMessages[0]);
    }

    const status = input.status || 'occupied';
    const durationUnit = input.duration_unit === 'days' ? 'days' : 'months';
    const durationValue = Math.max(1, Math.round(Number(input.duration_value) || 1));
    const checkInDate = (input.check_in_date || getTodayIsoDate()).trim();
    const computedOut = computeCheckOutDate(checkInDate, durationValue, durationUnit);
    const checkOutDate = (input.check_out_date || computedOut || checkInDate).trim();

    const normalizedPhone =
      status === 'occupied' || status === 'reserved'
        ? normalizePakistaniPhoneForDb(input.resident_phone || '')
        : (input.resident_phone || '').trim();

    const currentList = readLocalAllocations();
    const existing = currentList.find((a) => matchesRoomAndBed(a, room, input.bed_number));

    const record: BedAllocation = {
      id: existing?.id || input.id || `bed-${room.slug || room.id}-${input.bed_number}-${Date.now()}`,
      room_id: room.id,
      room_slug: room.slug,
      bed_number: input.bed_number,
      unit_label: (input.unit_label || existing?.unit_label || defaultUnitLabelForRoom(room)).trim(),
      status,
      resident_name: (input.resident_name || '').trim(),
      resident_phone: normalizedPhone,
      cnic_or_id: (input.cnic_or_id || '').trim(),
      resident_category: input.resident_category === 'job_holder' ? 'job_holder' : 'student',
      institution_or_workplace: (input.institution_or_workplace || '').trim(),
      check_in_date: checkInDate,
      duration_value: durationValue,
      duration_unit: durationUnit,
      check_out_date: checkOutDate,
      agreed_rent: Math.max(0, Math.round(Number(input.agreed_rent ?? room.monthly_fee) || 0)),
      security_deposit: Math.max(
        0,
        Math.round(Number(input.security_deposit ?? room.security_deposit) || 0)
      ),
      payment_status:
        input.payment_status === 'pending' || input.payment_status === 'partial'
          ? input.payment_status
          : 'paid',
      notes: (input.notes || '').trim(),
      updated_at: new Date().toISOString()
    };

    const filtered = currentList.filter((a) => !matchesRoomAndBed(a, room, input.bed_number));
    const nextList = status === 'vacant' ? filtered : [...filtered, record];
    writeLocalAllocations(nextList);

    if (supabase) {
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        if (sessionData.session) {
          if (status === 'vacant') {
            await supabase
              .from('bed_allocations')
              .delete()
              .eq('room_id', room.id)
              .eq('bed_number', input.bed_number);
          } else {
            const dbRow = {
              room_id: room.id,
              room_slug: room.slug,
              bed_number: record.bed_number,
              unit_label: record.unit_label,
              status: record.status,
              resident_name: record.resident_name,
              resident_phone: record.resident_phone,
              cnic_or_id: record.cnic_or_id || null,
              resident_category: record.resident_category,
              institution_or_workplace: record.institution_or_workplace || null,
              check_in_date: record.check_in_date,
              duration_value: record.duration_value,
              duration_unit: record.duration_unit,
              check_out_date: record.check_out_date,
              agreed_rent: record.agreed_rent,
              security_deposit: record.security_deposit,
              payment_status: record.payment_status,
              notes: record.notes || null,
              updated_at: record.updated_at
            };
            await supabase
              .from('bed_allocations')
              .upsert(dbRow, { onConflict: 'room_id,bed_number' });
          }
        }
      } catch {
        // Keep local persistence seamless if table is not yet migrated in remote Supabase
      }
    }

    await syncRoomAvailableBeds(room, nextList);
    mockStore.notify();
    notifyBedListeners();
    return record;
  },

  async vacateBed(room: Room, bedNumber: number): Promise<void> {
    const currentList = readLocalAllocations();
    const nextList = currentList.filter((a) => !matchesRoomAndBed(a, room, bedNumber));
    writeLocalAllocations(nextList);

    if (supabase) {
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        if (sessionData.session) {
          await supabase
            .from('bed_allocations')
            .delete()
            .eq('room_id', room.id)
            .eq('bed_number', bedNumber);
        }
      } catch {
        // Non-fatal fallback
      }
    }

    await syncRoomAvailableBeds(room, nextList);
    mockStore.notify();
    notifyBedListeners();
  }
};
