import {
  initialHostelInfo,
  initialSiteSettings,
  initialRooms,
  initialFacilities,
  initialMessPlans,
  initialMessMenu,
  initialGallery,
  initialRules,
  initialFaqs,
  initialReviews,
  initialNotices,
  initialInquiries
} from '../data/mock/mockData.ts';
import type {
  HostelInfo,
  SiteSettings,
  Room,
  Facility,
  MessPlan,
  MessMenuDay,
  GalleryItem,
  Rule,
  Faq,
  Review,
  Notice,
  Inquiry
} from '../types/index.ts';

class MockDataStore {
  hostelInfo: HostelInfo = { ...initialHostelInfo };
  siteSettings: SiteSettings = { ...initialSiteSettings };
  rooms: Room[] = [...initialRooms];
  facilities: Facility[] = [...initialFacilities];
  messPlans: MessPlan[] = [...initialMessPlans];
  messMenu: MessMenuDay[] = [...initialMessMenu];
  gallery: GalleryItem[] = [...initialGallery];
  rules: Rule[] = [...initialRules];
  faqs: Faq[] = [...initialFaqs];
  reviews: Review[] = [...initialReviews];
  notices: Notice[] = [...initialNotices];
  inquiries: Inquiry[] = [...initialInquiries];

  private listeners: (() => void)[] = [];

  subscribe(listener: () => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  notify() {
    this.listeners.forEach((listener) => listener());
  }

  async delay(ms: number = 80): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

export const mockStore = new MockDataStore();
