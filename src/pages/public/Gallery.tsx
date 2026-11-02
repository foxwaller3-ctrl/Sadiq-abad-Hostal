import React, { useState, useEffect } from 'react';
import {
  Maximize2,
  Images,
  BedDouble,
  UtensilsCrossed,
  BookOpen,
  Bath,
  Building2,
  Compass
} from 'lucide-react';
import { galleryService } from '../../services/galleryService.ts';
import { mockStore } from '../../services/mockStore.ts';
import type { GalleryItem } from '../../types/index.ts';
import { useI18n } from '../../i18n/I18nContext.tsx';
import { pickLang, normalizeImageUrl } from '../../utils/helpers.ts';
import { Lightbox } from '../../components/ui/Lightbox.tsx';
import { SeoHead } from '../../components/common/SeoHead.tsx';
import { EmptyState } from '../../components/ui/States.tsx';

export const Gallery: React.FC = () => {
  const { lang, t } = useI18n();
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [selectedCat, setSelectedCat] = useState<string>('all');
  const [activeLightboxIndex, setActiveLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    const load = () => galleryService.getPublished().then(setItems);
    load();
    return mockStore.subscribe(load);
  }, []);

  const categories = [
    { id: 'all', label: t('gallery.catAll'), Icon: Images },
    { id: 'rooms', label: t('gallery.catRooms'), Icon: BedDouble },
    { id: 'mess', label: t('gallery.catMess'), Icon: UtensilsCrossed },
    { id: 'study_area', label: t('gallery.catStudy'), Icon: BookOpen },
    { id: 'bathrooms', label: t('gallery.catBathrooms'), Icon: Bath },
    { id: 'building', label: t('gallery.catBuilding'), Icon: Building2 },
    { id: 'surroundings', label: t('gallery.catSurroundings'), Icon: Compass }
  ];

  const filteredItems = items.filter((item) => {
    if (selectedCat === 'all') return true;
    return item.category === selectedCat;
  });

  const activeItem =
    activeLightboxIndex !== null ? filteredItems[activeLightboxIndex] : null;

  const handleNext = () => {
    if (activeLightboxIndex !== null) {
      setActiveLightboxIndex((prev) =>
        prev! === filteredItems.length - 1 ? 0 : prev! + 1
      );
    }
  };

  const handlePrev = () => {
    if (activeLightboxIndex !== null) {
      setActiveLightboxIndex((prev) =>
        prev! === 0 ? filteredItems.length - 1 : prev! - 1
      );
    }
  };

  return (
    <div className="py-12 lg:py-16">
      <SeoHead
        title={lang === 'ur' ? 'تصویری گیلری' : 'Photo Gallery'}
        description={lang === 'ur' ? 'صادق آباد اسٹوڈنٹ ہاسٹل کے کمروں، میس اور عمارت کی اصلی تصاویر' : 'Take a photo tour of Sadiqabad Student Hostel rooms, mess, study hall, and building.'}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="text-xs font-semibold text-teal-700">
            {lang === 'ur' ? 'تصویریں' : 'Visual Tour'}
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-1">
            {t('gallery.title')}
          </h1>
          <p className="mt-3 text-base text-slate-600">
            {t('gallery.subtitle')}
          </p>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center justify-center gap-1.5 overflow-x-auto pb-3 mb-10 scrollbar-none">
          {categories.map((cat) => {
            const CatIcon = cat.Icon;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCat(cat.id)}
                className={`inline-flex items-center gap-1.5 px-4 py-2 text-xs md:text-sm font-semibold rounded-xl transition duration-150 whitespace-nowrap shrink-0 cursor-pointer ${
                  selectedCat === cat.id
                    ? 'bg-teal-700 text-white shadow-xs'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <CatIcon className="w-4 h-4 shrink-0" />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Gallery Grid */}
        {filteredItems.length === 0 ? (
          <EmptyState
            title={lang === 'ur' ? 'اس کیٹیگری میں کوئی تصویر نہیں ہے' : 'No photos in this category'}
            action={{
              label: t('gallery.catAll'),
              onClick: () => setSelectedCat('all')
            }}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems.map((item, index) => {
              const caption = pickLang(item, 'caption', lang);

              return (
                <div
                  key={item.id}
                  onClick={() => setActiveLightboxIndex(index)}
                  className="group relative rounded-2xl overflow-hidden bg-slate-200 aspect-[4/3] cursor-pointer shadow-xs hover:shadow-xl transition-all duration-300"
                >
                  <img
                    src={normalizeImageUrl(item.image_url) || '/images/hero-hostel.jpg'}
                    alt={caption || 'Hostel photo'}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                    onError={(e) => {
                      const target = e.currentTarget as HTMLImageElement;
                      if (!target.src.endsWith('/images/hero-hostel.jpg')) {
                        target.src = '/images/hero-hostel.jpg';
                      }
                    }}
                  />
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4 flex flex-col justify-end text-start">
                    <div className="flex items-center justify-between text-white">
                      <p className="text-xs font-medium line-clamp-2">{caption}</p>
                      <div className="p-2 rounded-full bg-white/20 backdrop-blur-xs text-white shrink-0 ms-2">
                        <Maximize2 className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {activeItem && (
        <Lightbox
          isOpen={activeLightboxIndex !== null}
          onClose={() => setActiveLightboxIndex(null)}
          imageUrl={activeItem.image_url}
          caption={pickLang(activeItem, 'caption', lang)}
          currentIndex={activeLightboxIndex ?? 0}
          total={filteredItems.length}
          onNext={handleNext}
          onPrev={handlePrev}
        />
      )}
    </div>
  );
};
