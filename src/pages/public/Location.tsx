import React, { useState, useEffect } from 'react';
import {
  MapPin,
  Clock,
  Compass,
  Phone,
  MessageCircle,
  ExternalLink,
  GraduationCap,
  Bus,
  ShoppingBag,
  Building
} from 'lucide-react';
import { hostelInfoService } from '../../services/hostelInfoService.ts';
import type { HostelInfo } from '../../types/index.ts';
import { useI18n } from '../../i18n/I18nContext.tsx';
import { pickLang, generateWhatsAppLink } from '../../utils/helpers.ts';
import { Card } from '../../components/ui/Card.tsx';
import { Button } from '../../components/ui/Button.tsx';
import { SeoHead } from '../../components/common/SeoHead.tsx';

export const Location: React.FC = () => {
  const { lang, t } = useI18n();
  const [hostelInfo, setHostelInfo] = useState<HostelInfo | null>(null);

  useEffect(() => {
    hostelInfoService.get().then(setHostelInfo);
  }, []);

  const address = hostelInfo ? pickLang(hostelInfo, 'address', lang) : 'Sadiqabad, Punjab';
  const officeHours = hostelInfo ? pickLang(hostelInfo, 'office_hours', lang) : '9:00 AM – 9:00 PM';
  const phone = hostelInfo?.phone || '0300-1234567';
  const whatsapp = hostelInfo?.whatsapp || '0300-1234567';
  const mapUrl =
    hostelInfo?.map_embed_url ||
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d111244.69800531557!2d70.05267398188164!3d28.307525283457193!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39375e2a22ab072d%3A0xc3191cb142646c07!2sSadiqabad%2C%20Rahim%20Yar%20Khan%2C%20Punjab!5e0!3m2!1sen!2s!4v1700000000000!5m2!1sen!2s';

  const directionsLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    'Sadiqabad Student Hostel Kacha Sadiq Road Sadiqabad Punjab'
  )}`;

  const nearbyPlaces = [
    {
      title: lang === 'ur' ? 'پنجاب کالج اور اکیڈمیز' : 'Punjab College & Academies',
      distance: lang === 'ur' ? '۳ سے ۵ منٹ کی پیدل مسافت' : '3 - 5 mins walking distance',
      icon: GraduationCap
    },
    {
      title: lang === 'ur' ? 'جنرل بس اسٹینڈ صادق آباد' : 'General Bus Stand Sadiqabad',
      distance: lang === 'ur' ? '۵ منٹ ڈرائیو' : '5 mins drive',
      icon: Bus
    },
    {
      title: lang === 'ur' ? 'مین بازار اور فارمیسیز' : 'Main Bazaar, Banks & Pharmacy',
      distance: lang === 'ur' ? '۲ منٹ کی مسافت' : '2 mins walking distance',
      icon: ShoppingBag
    },
    {
      title: lang === 'ur' ? 'تحصیل ہیڈکوارٹر ہسپتال' : 'Civil / THQ Hospital Sadiqabad',
      distance: lang === 'ur' ? '۸ منٹ ڈرائیو' : '8 mins drive',
      icon: Building
    }
  ];

  return (
    <div className="py-12 lg:py-16">
      <SeoHead
        title={lang === 'ur' ? 'ہاسٹل کا پتہ اور راستہ' : 'Location & Directions'}
        description={lang === 'ur' ? 'صادق آباد اسٹوڈنٹ ہاسٹل کا پتہ، گوگل میپ اور قریبی اہم مقامات' : 'Find directions and landmark distances to Sadiqabad Student Hostel.'}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-teal-700">
            {lang === 'ur' ? 'آسان رسائی' : 'Easy Access'}
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-1">
            {t('location.title')}
          </h1>
          <p className="mt-3 text-base text-slate-600">
            {t('location.subtitle')}
          </p>
        </div>

        {/* Address and Info Card */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10 text-start">
          <Card className="p-6 bg-white" hoverable>
            <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center mb-4">
              <MapPin className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-slate-900 mb-2">
              {t('location.addressTitle')}
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed mb-4">
              {address}
            </p>
            <a
              href={directionsLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-700 hover:text-teal-900"
            >
              <span>{t('location.getDirections')}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </Card>

          <Card className="p-6 bg-white" hoverable>
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center mb-4">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-slate-900 mb-2">
              {t('location.officeHours')}
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed mb-1">
              {officeHours}
            </p>
            <span className="text-xs text-slate-500">
              {lang === 'ur' ? 'والدین اور طلبہ کسی بھی وقت تشریف لا سکتے ہیں' : 'Parents and students are welcome daily'}
            </span>
          </Card>

          <Card className="p-6 bg-white" hoverable>
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-4">
              <Compass className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-slate-900 mb-2">
              {lang === 'ur' ? 'براہ راست رہنمائی' : 'Direct Assistance'}
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed mb-4">
              {lang === 'ur' ? 'اگر راستہ تلاش کرنے میں مشکل ہو تو وارڈن کو کال کریں۔' : 'Call our warden if you need guidance reaching the hostel.'}
            </p>
            <div className="flex items-center gap-2">
              <a href={`tel:${phone.replace(/[^0-9+]/g, '')}`}>
                <Button variant="primary" size="sm" icon={<Phone className="w-3.5 h-3.5" />}>
                  {lang === 'ur' ? 'کال کریں' : 'Call Office'}
                </Button>
              </a>
              <a
                href={generateWhatsAppLink(whatsapp, 'Assalam o Alaikum, I need directions to the hostel.')}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="outline" size="sm" icon={<MessageCircle className="w-3.5 h-3.5 text-emerald-600" />}>
                  WhatsApp
                </Button>
              </a>
            </div>
          </Card>
        </div>

        {/* Google Map Embed */}
        <div className="bg-white rounded-3xl border border-slate-200 p-4 sm:p-6 shadow-xs mb-16">
          <div className="w-full aspect-[16/9] rounded-2xl overflow-hidden shadow-inner border border-slate-200">
            <iframe
              src={mapUrl}
              className="w-full h-full border-0"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Hostel Google Map Location"
            />
          </div>
          <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3 px-2">
            <span className="text-xs text-slate-500">
              📍 Sadiqabad, District Rahim Yar Khan, Punjab, Pakistan
            </span>
            <a
              href={directionsLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="accent" size="sm" icon={<ExternalLink className="w-4 h-4" />}>
                {t('location.getDirections')}
              </Button>
            </a>
          </div>
        </div>

        {/* Nearby Landmarks & Proximity */}
        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-6 text-start">
            {t('location.nearbyTitle')}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-start">
            {nearbyPlaces.map((place, idx) => {
              const Icon = place.icon;
              return (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs hover:border-teal-400 transition"
                >
                  <div className="w-10 h-10 rounded-xl bg-slate-100 text-teal-800 flex items-center justify-center mb-3">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-sm text-slate-900 mb-1">{place.title}</h4>
                  <span className="text-xs font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full inline-block">
                    {place.distance}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
