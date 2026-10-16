import { mockStore } from './mockStore.ts';
import type { Inquiry, InquiryStatus } from '../types/index.ts';
import { validatePakistaniPhone } from '../utils/helpers.ts';

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

export const inquiriesService = {
  async create(input: CreateInquiryInput): Promise<Inquiry> {
    await mockStore.delay(120);

    // Honeypot check: silently simulate success without adding record if filled
    if (input.honeypot && input.honeypot.trim() !== '') {
      return {
        id: `inq-bot-${Date.now()}`,
        name: input.name,
        phone: input.phone,
        category: input.category,
        status: 'new',
        source_lang: input.source_lang || 'en',
        created_at: new Date().toISOString()
      };
    }

    if (!input.name || input.name.trim().length < 2) {
      throw new Error('Please enter a valid full name (minimum 2 characters).');
    }

    if (!validatePakistaniPhone(input.phone)) {
      throw new Error('Please provide a valid Pakistani mobile number (e.g. 0300-1234567).');
    }

    const newInquiry: Inquiry = {
      id: `inq-${Date.now()}`,
      name: input.name.trim(),
      phone: input.phone.trim(),
      room_type: input.room_type || null,
      wants_mess: input.wants_mess ?? null,
      move_in_date: input.move_in_date || null,
      category: input.category || 'student',
      message: input.message ? input.message.trim() : null,
      status: 'new',
      admin_notes: null,
      source_lang: input.source_lang || 'en',
      created_at: new Date().toISOString()
    };

    // Prepend to top of list
    mockStore.inquiries.unshift(newInquiry);
    mockStore.notify();

    return { ...newInquiry };
  },

  async getAll(): Promise<Inquiry[]> {
    await mockStore.delay();
    return [...mockStore.inquiries].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  },

  async getById(id: string): Promise<Inquiry | null> {
    await mockStore.delay();
    const item = mockStore.inquiries.find((i) => i.id === id);
    return item ? { ...item } : null;
  },

  async updateStatus(id: string, status: InquiryStatus): Promise<Inquiry> {
    await mockStore.delay();
    const index = mockStore.inquiries.findIndex((i) => i.id === id);
    if (index === -1) throw new Error('Inquiry not found');
    mockStore.inquiries[index] = { ...mockStore.inquiries[index], status };
    mockStore.notify();
    return { ...mockStore.inquiries[index] };
  },

  async updateNotes(id: string, admin_notes: string): Promise<Inquiry> {
    await mockStore.delay();
    const index = mockStore.inquiries.findIndex((i) => i.id === id);
    if (index === -1) throw new Error('Inquiry not found');
    mockStore.inquiries[index] = { ...mockStore.inquiries[index], admin_notes };
    mockStore.notify();
    return { ...mockStore.inquiries[index] };
  },

  async remove(id: string): Promise<void> {
    await mockStore.delay();
    mockStore.inquiries = mockStore.inquiries.filter((i) => i.id !== id);
    mockStore.notify();
  }
};
