import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Wifi,
  Droplet,
  Zap,
  Flame,
  Wind,
  Utensils,
  Shirt,
  BookOpen,
  Video,
  ShieldCheck,
  Bike,
  Sparkles,
  Bed,
  CheckCircle2,
  PhoneCall
} from 'lucide-react';
import { facilitiesService } from '../../services/facilitiesService.ts';
import type { Facility } from '../../types/index.ts';
import { useI18n } from '../../i18n/I18nContext.tsx';
import { pickLang } from '../../utils/helpers.ts';
import { Card } from '../../components/ui/Card.tsx';
import { Button } from '../../components/ui/Button.tsx';
import { SeoHead } from '../../components/common/SeoHead.tsx';

const iconMap: Record<string, React.FC<{ className?: string }>> = {
  wifi: Wifi,
  droplet: Droplet,
  zap: Zap,
  flame: Flame,
  wind: Wind,
  utensils: Utensils,
  shirt: Shirt,
  'book-open': BookOpen,
  video: Video,
  'shield-check': ShieldCheck,
  bike: Bike,
  sparkles: Sparkles,
  bed: Bed
};

export const Facilities: React.FC = () => {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const { lang, t } = useI18n();

  useEffect(() => {
    facilitiesService.getPublished().then(setFacilities);
  }, []);

  return (
    <div className="py-12 lg:py-16">
      <SeoHead
        title={lang === 'ur' ? 'ہاسٹل کی سہولیات' : 'Hostel Facilities'}
        description={lang === 'ur' ? 'صادق آباد اسٹوڈنٹ ہاسٹل کی جدید اور آرام دہ سہولیات' : 'Explore all 13 modern facilities provided at Sadiqabad Student Hostel.'}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-wider text-teal-700">
            {lang === 'ur' ? 'جدید رہائشی سہولیات' : 'Comfort & Convenience'}
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-1">
            {t('facilities.title')}
          </h1>
          <p className="mt-3 text-base text-slate-600">
            {t('facilities.subtitle')}
          </p>
        </div>

        {/* 13 Facilities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {facilities.map((fac) => {
            const IconComponent = iconMap[fac.icon_url] || Sparkles;
            const title = pickLang(fac, 'title', lang);
            const desc = pickLang(fac, 'description', lang);

            return (
              <Card key={fac.id} className="p-6 text-start flex flex-col justify-between" hoverable>
                <div>
                  <div className="w-12 h-12 rounded-xl bg-teal-50 border border-teal-200/80 text-teal-700 flex items-center justify-center mb-4">
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-lg text-slate-900 mb-2">{title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{desc}</p>
                </div>
                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center gap-1.5 text-xs text-teal-700 font-semibold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{lang === 'ur' ? 'فیس میں شامل ہے' : 'Included in Rent'}</span>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Bottom CTA Card */}
        <div className="bg-gradient-to-r from-teal-900 to-slate-900 text-white rounded-3xl p-8 sm:p-12 text-center shadow-xl">
          <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">
            {t('facilities.cta')}
          </h3>
          <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto mb-8 leading-relaxed">
            {lang === 'ur'
              ? 'ہمارا ہاسٹل طلبہ کے لیے کھلا ہے۔ آپ خود تشریف لا کر سہولیات اور ماحول کا جائزہ لے سکتے ہیں۔'
              : 'Our doors are open for prospective residents and parents. Visit in person to inspect our living quality.'}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link to="/contact#inquiry">
              <Button variant="accent" size="lg" className="font-bold">
                {t('hero.ctaBook')}
              </Button>
            </Link>
            <Link to="/contact">
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-slate-900" icon={<PhoneCall className="w-4 h-4" />}>
                {t('facilities.ctaBtn')}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
