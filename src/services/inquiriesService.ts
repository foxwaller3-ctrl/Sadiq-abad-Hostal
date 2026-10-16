import { mockStore } from './mockStore.ts';
import { supabase } from './supabaseClient.ts';
import type { Inquiry, InquiryStatus } from '../types/index.ts';
import { validatePakistaniPhone } from '../utils/helpers.ts';
import { asRow, asRows, throwIfSupabaseError } from './serviceHelpers.ts';

export interface CreateInquiryInput {
  name: string;
  phone: string;
  room_type?: Inquiry['room_type'];
  wants_mess?: boolean | null;
  move_in_date?: string | null;
  category: 'student' | 'job' | 'other';
  message?: string | null;
  source_lang?: 'en' | 'ur';
  honeypot?: string;
}

function validateInquiry(input: CreateInquiryInput): void {
  if (!input.name || input.name.trim().length < 2 || input.name.trim().length > 60) {
    throw new Error('Please enter a valid full name (2–60 characters).');
  }
  if (!validatePakistaniPhone(input.phone)) {
    throw new Error('Please provide a valid Pakistani mobile number (e.g. 0300-1234567).');
  }
  if (input.message && input.message.length > 500) {
    throw new Error('Message cannot exceed 500 characters.');
  }
  if (input.move_in_date) {
    const moveIn = new Date(input.move_in_date + 'T00:00:00');
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (Number.isNaN(moveIn.getTime()) || moveIn < today) {
      throw new Error('Move-in date must be today or later.');
    }
  }
}

export const inquiriesService = {
  async create(input: CreateInquiryInput): Promise<Inquiry> {
    if (!supabase) {
      await mockStore.delay(120);
      if (input.honeypot && input.honeypot.trim() !== '') {
        return {
          id: 'inq-bot-' + Date.now(), name: input.name, phone: input.phone,
          category: input.category, status: 'new', source_lang: input.source_lang || 'en',
          created_at: new Date().toISOString()
        };
      }
      validateInquiry(input);
      const newInquiry: Inquiry = {
        id: 'inq-' + Date.now(), name: input.name.trim(), phone: input.phone.trim(),
        room_type: input.room_type || null, wants_mess: input.wants_mess ?? null,
        move_in_date: input.move_in_date || null, category: input.category,
        message: input.message ? input.message.trim() : null, status: 'new',
        admin_notes: null, source_lang: input.source_lang || 'en', created_at: new Date().toISOString()
      };
      mockStore.inquiries.unshift(newInquiry);
      mockStore.notify();
      return { ...newInquiry };
    }

    if (input.honeypot && input.honeypot.trim() !== '') {
      return {
        id: 'spam-ignored', name: input.name, phone: input.phone,
        category: input.category, status: 'new', source_lang: input.source_lang || 'en',
        created_at: new Date().toISOString()
      };
    }
    validateInquiry(input);
    const payload = {
      name: input.name.trim(),
      phone: input.phone.trim(),
      room_type: input.room_type || null,
      wants_mess: input.wants_mess ?? null,
      move_in_date: input.move_in_date || null,
      category: input.category,
      message: input.message ? input.message.trim() : null,
      source_lang: input.source_lang || 'en'
    };
    // Intentionally use minimal returning: visitors have INSERT but no SELECT
    // permission on inquiries, so the submitted record is not read back publicly.
    const { error } = await supabase.from('inquiries').insert(payload);
    throwIfSupabaseError(error);
    return {
      id: 'submitted', ...payload, status: 'new', admin_notes: null,
      created_at: new Date().toISOString()
    };
  },

  async getAll(): Promise<Inquiry[]> {
    if (supabase) {
      const { data, error } = await supabase.from('inquiries').select('*').order('created_at', { ascending: false });
      throwIfSupabaseError(error);
      return asRows<Inquiry>(data);
    }
    await mockStore.delay();
    return [...mockStore.inquiries].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  },

  async getById(id: string): Promise<Inquiry | null> {
    if (supabase) {
      const { data, error } = await supabase.from('inquiries').select('*').eq('id', id).maybeSingle();
      throwIfSupabaseError(error);
      return data as unknown as Inquiry | null;
    }
    await mockStore.delay();
    const item = mockStore.inquiries.find((i) => i.id === id);
    return item ? { ...item } : null;
  },

  async updateStatus(id: string, status: InquiryStatus): Promise<Inquiry> {
    if (supabase) {
      const { data, error } = await supabase.from('inquiries').update({ status }).eq('id', id).select('*').single();
      throwIfSupabaseError(error);
      return asRow<Inquiry>(data, 'Updated inquiry');
    }
    await mockStore.delay();
    const index = mockStore.inquiries.findIndex((i) => i.id === id);
    if (index === -1) throw new Error('Inquiry not found');
    mockStore.inquiries[index] = { ...mockStore.inquiries[index], status };
    mockStore.notify();
    return { ...mockStore.inquiries[index] };
  },

  async updateNotes(id: string, admin_notes: string): Promise<Inquiry> {
    if (supabase) {
      const { data, error } = await supabase.from('inquiries').update({ admin_notes }).eq('id', id).select('*').single();
      throwIfSupabaseError(error);
      return asRow<Inquiry>(data, 'Updated inquiry notes');
    }
    await mockStore.delay();
    const index = mockStore.inquiries.findIndex((i) => i.id === id);
    if (index === -1) throw new Error('Inquiry not found');
    mockStore.inquiries[index] = { ...mockStore.inquiries[index], admin_notes };
    mockStore.notify();
    return { ...mockStore.inquiries[index] };
  },

  async remove(id: string): Promise<void> {
    if (supabase) {
      const { error } = await supabase.from('inquiries').delete().eq('id', id);
      throwIfSupabaseError(error);
      return;
    }
    await mockStore.delay();
    mockStore.inquiries = mockStore.inquiries.filter((i) => i.id !== id);
    mockStore.notify();
  }
};
