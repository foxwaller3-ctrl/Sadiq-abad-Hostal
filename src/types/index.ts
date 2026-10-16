export type Lang = 'en' | 'ur';
export type RoomType = 'single' | 'double' | 'triple' | 'quad';
export type InquiryStatus = 'new' | 'contacted' | 'booked' | 'rejected';
export type HostelType = 'boys' | 'girls' | 'both';

export interface LocalizedString {
  en: string;
  ur: string;
}

export interface HostelInfo {
  id: number;
  name_en: string;
  name_ur: string;
  tagline_en: string;
  tagline_ur: string;
  about_en: string;
  about_ur: string;
  phone: string;
  whatsapp: string;
  email: string;
  address_en: string;
  address_ur: string;
  map_embed_url: string;
  latitude?: number;
  longitude?: number;
  office_hours_en: string;
  office_hours_ur: string;
  social_links: {
    facebook?: string;
    instagram?: string;
    youtube?: string;
  };
  logo_url: string;
  hostel_type: HostelType;
  updated_at?: string;
}

export interface SiteSettings {
  id: number;
  seo_title_en: string;
  seo_title_ur: string;
  seo_description_en: string;
  seo_description_ur: string;
  default_language: Lang;
  whatsapp_message_template_en: string;
  whatsapp_message_template_ur: string;
  updated_at?: string;
}

export interface Room {
  id: string;
  slug: string;
  name_en: string;
  name_ur: string;
  room_type: RoomType;
  beds_total: number;
  beds_available: number;
  monthly_fee: number;
  security_deposit: number;
  admission_fee: number;
  description_en: string;
  description_ur: string;
  features: LocalizedString[];
  image_urls: string[];
  is_published: boolean;
  sort_order: number;
  created_at?: string;
  updated_at?: string;
}

export interface Facility {
  id: string;
  title_en: string;
  title_ur: string;
  description_en: string;
  description_ur: string;
  icon_url: string;
  is_published: boolean;
  sort_order: number;
}

export interface MessPlan {
  id: string;
  name_en: string;
  name_ur: string;
  price_monthly: number;
  description_en: string;
  description_ur: string;
  is_active: boolean;
  sort_order: number;
}

export interface MessMenuDay {
  id: string;
  day_of_week: number; // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  breakfast_en: string;
  breakfast_ur: string;
  lunch_en: string;
  lunch_ur: string;
  dinner_en: string;
  dinner_ur: string;
}

export type GalleryCategory = 'rooms' | 'mess' | 'bathrooms' | 'study_area' | 'building' | 'surroundings';

export interface GalleryItem {
  id: string;
  category: GalleryCategory;
  image_url: string;
  caption_en: string;
  caption_ur: string;
  is_published: boolean;
  sort_order: number;
}

export interface Rule {
  id: string;
  text_en: string;
  text_ur: string;
  is_published: boolean;
  sort_order: number;
}

export interface Faq {
  id: string;
  question_en: string;
  question_ur: string;
  answer_en: string;
  answer_ur: string;
  is_published: boolean;
  sort_order: number;
}

export interface Review {
  id: string;
  name: string;
  rating: number; // 1 to 5
  comment_en: string;
  comment_ur: string;
  is_visible: boolean;
  created_at: string;
}

export interface Notice {
  id: string;
  text_en: string;
  text_ur: string;
  starts_at: string;
  ends_at: string;
  is_active: boolean;
}

export interface Inquiry {
  id: string;
  name: string;
  phone: string;
  room_type?: RoomType | null;
  wants_mess?: boolean | null;
  move_in_date?: string | null;
  category: 'student' | 'job' | 'other';
  message?: string | null;
  status: InquiryStatus;
  admin_notes?: string | null;
  source_lang: Lang;
  created_at: string;
}

export interface AuthSession {
  user: {
    id: string;
    email: string;
    role: 'admin';
  } | null;
}
