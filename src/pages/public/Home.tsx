import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Wifi,
  ShieldCheck,
  UtensilsCrossed,
  Zap,
  ArrowRight,
  Phone,
  MessageCircle,
  MapPin,
  Star,
  BedDouble,
  Sparkles,
  Wallet,
  Coffee
} from 'lucide-react';
import { roomsService } from '../../services/roomsService.ts';
import { messService } from '../../services/messService.ts';
import { reviewsService } from '../../services/reviewsService.ts';
import { hostelInfoService } from '../../services/hostelInfoService.ts';
import { settingsService } from '../../services/settingsService.ts';
import { mockStore } from '../../services/mockStore.ts';
import type { Room, MessPlan, Review, HostelInfo } from '../../types/index.ts';
import { useI18n } from '../../i18n/I18nContext.tsx';
import {
  pickLang,
  formatCurrency,
  getAvailabilityStatus,
  generateWhatsAppLink,
  getRoomPrimaryImage,
  ROOM_TYPE_DEFAULT_IMAGES
} from '../../utils/helpers.ts';
import { Button } from '../../components/ui/Button.tsx';
import { Card } from '../../components/ui/Card.tsx';
import { SeoHead } from '../../components/common/SeoHead.tsx';
import { AmenityIcon } from '../../components/common/SemanticIcon.tsx';
import { AnimatedHeroBanners } from '../../components/common/AnimatedHeroBanners.tsx';
import { triggerPastelBomb } from '../../utils/pastelBomb.ts';

export const Home: React.FC = () => {
  const { lang, t, dir } = useI18n();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [messPlans, setMessPlans] = useState<MessPlan[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [hostelInfo, setHostelInfo] = useState<HostelInfo | null>(null);
  const [whatsappTemplate, setWhatsappTemplate] = useState('');

  useEffect(() => {
    const load = () => {
      roomsService.getPublished().then(setRooms);
      messService.getPlans().then(setMessPlans);
      reviewsService.getVisible().then(setReviews);
      hostelInfoService.get().then(setHostelInfo);
      settingsService.get().then((s) => {
        setWhatsappTemplate(pickLang(s, 'whatsapp_message_template', lang));
      });
    };
    load();
    return mockStore.subscribe(load);
  }, [lang]);

  const phone = hostelInfo?.phone || '0304-7862410';
  const whatsapp = hostelInfo?.whatsapp || '0304-7862410';
  const waLink = generateWhatsAppLink(
    whatsapp,
    whatsappTemplate || 'Assalam o Alaikum, I want to book a room at Sadiqabad Student Hostel.'
  );
  const telLink = `tel:${phone.replace(/[^0-9+]/g, '')}`;

  const lowestRent = rooms.length > 0 ? Math.min(...rooms.map((r) => r.monthly_fee)) : 5500;

  return (
    <div>
      <SeoHead />

      {/* 1. HERO SECTION */}
      <section className="bg-slate-900 text-white border-b border-slate-800 py-12 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          {/* Balanced 2-Column Split */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
            {/* Left Copy Column */}
            <div className="lg:col-span-7 flex flex-col justify-center space-y-6 text-start">
              {/* Clean unboxed regional & session kicker */}
              <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm font-semibold text-teal-300 tracking-wide">
                <span>
                  {lang === 'ur'
                    ? 'داخلے جاری ہیں ۲۰۲۶–۲۷'
                    : 'Admissions Open 2026–27'}
                </span>
                <span aria-hidden="true" className="text-slate-500">·</span>
                <span className="text-slate-300">
                  {lang === 'ur'
                    ? 'مین کالج روڈ، نزدیک پنجاب کالج، صادق آباد'
                    : 'Main College Road, Near Punjab College, Sadiqabad'}
                </span>
              </div>

              <h1
                className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight max-w-2xl text-balance"
              >
                {hostelInfo ? pickLang(hostelInfo, 'tagline', lang) : t('hero.tagline')}
              </h1>

              <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl">
                {t('hero.subtext')}
              </p>

              {/* Starting Price Proof Note */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs sm:text-sm text-slate-300">
                <span>
                  {lang === 'ur' ? 'ماہانہ کرایہ صرف ' : 'Rooms starting from '}
                  <strong className="text-amber-400 font-bold num-ltr tabular-nums">
                    {formatCurrency(lowestRent)}/mo
                  </strong>
                </span>
                <span aria-hidden="true" className="text-slate-600">·</span>
                <span>
                  {lang === 'ur'
                    ? 'واپسی قابل سیکیورٹی · فوری بکنگ دستیاب'
                    : 'Refundable security · Walk-in visits 8 AM – 10 PM'}
                </span>
              </div>

              {/* CTAs */}
              <div className="pt-1 flex flex-wrap items-center gap-3">
                <Link to="/contact#inquiry">
                  <Button variant="accent" size="lg" className="font-bold whitespace-nowrap">
                    {t('hero.ctaBook')}
                  </Button>
                </Link>
                <a href={waLink} target="_blank" rel="noopener noreferrer">
                  <Button
                    variant="outlineDark"
                    size="lg"
                    className="whitespace-nowrap"
                    icon={<MessageCircle className="w-5 h-5 text-emerald-400" />}
                  >
                    {t('hero.ctaWhatsApp')}
                  </Button>
                </a>
                <a href={telLink}>
                  <Button
                    variant="ghostDark"
                    size="lg"
                    className="whitespace-nowrap"
                    icon={<Phone className="w-4 h-4 text-slate-300" />}
                  >
                    {t('hero.ctaCall')}
                  </Button>
                </a>
              </div>
            </div>

            {/* Right Architectural Visual Anchor replaced with Animated 3-Banner Carousel */}
            <div className="lg:col-span-5 flex">
              <AnimatedHeroBanners />
            </div>
          </div>

          {/* Full-width 4-Column Core Facility Strip Below Hero Split with light expand hover */}
          <div className="pt-8 border-t border-slate-800 grid grid-cols-2 lg:grid-cols-4 gap-4 text-xs sm:text-sm font-medium text-slate-200 text-start">
            <div className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 hover-light-expand cursor-default">
              <Wifi className="w-5 h-5 text-teal-400 shrink-0" />
              <span>{t('hero.badgeWifi')}</span>
            </div>
            <div className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 hover-light-expand cursor-default">
              <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0" />
              <span>{t('hero.badgeCctv')}</span>
            </div>
            <div className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 hover-light-expand cursor-default">
              <UtensilsCrossed className="w-5 h-5 text-rose-400 shrink-0" />
              <span>{t('hero.badgeMess')}</span>
            </div>
            <div className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 hover-light-expand cursor-default">
              <Zap className="w-5 h-5 text-yellow-400 shrink-0" />
              <span>{t('hero.badgePower')}</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. ROOMS & REASONABLE STUDENT PRICING SECTION */}
      <section className="py-16 lg:py-24 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4 text-start">
            <div>
              <span className="text-xs font-semibold text-teal-700">
                {lang === 'ur' ? 'کمرے اور ماہانہ کرایہ' : 'Accommodations & Student Pricing'}
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
                {t('rooms.title')}
              </h2>
              <p className="text-sm sm:text-base text-slate-600 mt-1">
                {t('rooms.subtitle')}
              </p>
            </div>
            <Link to="/rooms">
              <Button
                variant="outline"
                size="sm"
                className="whitespace-nowrap"
                icon={<ArrowRight className={`w-4 h-4 ${dir === 'rtl' ? 'rotate-180' : ''}`} />}
              >
                {lang === 'ur' ? 'تمام کمرے اور تفصیل دیکھیں' : 'Compare All Rooms'}
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {rooms.slice(0, 4).map((room) => {
              const avail = getAvailabilityStatus(room.beds_available);
              const roomName = pickLang(room, 'name', lang);
              const primaryImage = getRoomPrimaryImage(room);
              const fallbackImage = ROOM_TYPE_DEFAULT_IMAGES[room.room_type] || '/images/room-single.jpg';
              const statusColor =
                avail === 'available'
                  ? 'text-emerald-700'
                  : avail === 'limited'
                  ? 'text-amber-700'
                  : 'text-rose-700';
              const statusText =
                avail === 'available'
                  ? `${room.beds_available} ${t('rooms.bedsAvailable')}`
                  : avail === 'limited'
                  ? lang === 'en' && room.beds_available === 1
                    ? 'Only 1 bed left'
                    : `${t('rooms.only')} ${room.beds_available} ${t('rooms.bedsLeft')}`
                  : t('rooms.soldOut');

              return (
                <Card key={room.id} className="overflow-hidden flex flex-col" hoverable>
                  {/* Distinct Room Photo with 4:3 aspect ratio */}
                  <div className="aspect-[4/3] w-full bg-slate-200 relative overflow-hidden">
                    <img
                      src={primaryImage}
                      alt={roomName}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                      loading="lazy"
                      onError={(e) => {
                        const target = e.currentTarget as HTMLImageElement;
                        if (!target.src.endsWith(fallbackImage)) {
                          target.src = fallbackImage;
                        }
                      }}
                    />
                  </div>

                  {/* Card Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between text-start">
                    <div>
                      {/* Clean unboxed availability kicker */}
                      <div className={`text-xs font-semibold mb-1 tabular-nums ${statusColor}`}>
                        {statusText}
                      </div>
                      <h3 className="font-bold text-base text-slate-900 mb-1">{roomName}</h3>
                      <div className="flex items-baseline gap-1 mt-2 mb-3">
                        <span className="text-xl font-extrabold text-teal-800 num-ltr tabular-nums">
                          {formatCurrency(room.monthly_fee)}
                        </span>
                        <span className="text-xs text-slate-500 font-medium">
                          {t('rooms.perMonth')}
                        </span>
                      </div>

                      <div className="space-y-1.5 mb-4 text-xs text-slate-600">
                        {room.features.slice(0, 3).map((f, idx) => (
                          <div key={idx} className="flex items-center gap-1.5">
                            <AmenityIcon
                              text={f.en || f.ur}
                              className="w-3.5 h-3.5 text-teal-700 shrink-0"
                            />
                            <span>{lang === 'ur' ? f.ur || f.en : f.en}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
                      <Link to={`/contact?room=${room.slug}#inquiry`} className="flex-1">
                        <Button variant="primary" size="sm" className="w-full whitespace-nowrap">
                          {t('rooms.inquireNow')}
                        </Button>
                      </Link>
                      <Link to="/rooms">
                        <Button
                          variant="secondary"
                          size="sm"
                          className="whitespace-nowrap"
                          onClick={() => triggerPastelBomb()}
                        >
                          {t('rooms.viewDetails')}
                        </Button>
                      </Link>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. WHY STUDENTS & PARENTS TRUST US */}
      <section className="py-16 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {t('highlights.title')}
            </h2>
            <p className="mt-2 text-sm sm:text-base text-slate-600">
              {t('highlights.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-start">
            <Card className="p-6 bg-slate-50 border-slate-200 hover-frame-shake" hoverable>
              <div className="w-11 h-11 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center mb-4">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-slate-900 mb-2">
                {t('highlights.safe')}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {t('highlights.safeDesc')}
              </p>
            </Card>

            <Card className="p-6 bg-slate-50 border-slate-200 hover-frame-shake" hoverable>
              <div className="w-11 h-11 rounded-xl bg-cyan-100 text-cyan-800 flex items-center justify-center mb-4">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-slate-900 mb-2">
                {t('highlights.clean')}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {t('highlights.cleanDesc')}
              </p>
            </Card>

            <Card className="p-6 bg-slate-50 border-slate-200 hover-frame-shake" hoverable>
              <div className="w-11 h-11 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center mb-4">
                <Wallet className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-slate-900 mb-2">
                {t('highlights.affordable')}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {t('highlights.affordableDesc')}
              </p>
            </Card>

            <Card className="p-6 bg-slate-50 border-slate-200 hover-frame-shake" hoverable>
              <div className="w-11 h-11 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center mb-4">
                <BedDouble className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-slate-900 mb-2">
                {t('highlights.comfortable')}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {t('highlights.comfortableDesc')}
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* 4. MESS PREVIEW */}
      <section className="py-16 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5 space-y-4 text-start">
              <span className="text-xs font-semibold text-teal-700">
                {lang === 'ur' ? 'کھانا اور ہفتہ وار مینو' : 'Home-Style Mess & Dining'}
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                {t('mess.title')}
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                {t('mess.subtitle')}
              </p>
              <p className="text-xs text-slate-600 bg-white p-3.5 rounded-xl border border-slate-200">
                {t('mess.optionalNote')}
              </p>
              <div className="pt-2">
                <Link to="/mess">
                  <Button variant="primary" size="md" className="whitespace-nowrap">
                    {lang === 'ur' ? 'ہفتہ وار مینو دیکھیں' : 'View Full 7-Day Menu'}
                  </Button>
                </Link>
              </div>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-4">
              {messPlans.map((plan, idx) => {
                const PlanIcon =
                  plan.price_monthly === 0
                    ? BedDouble
                    : idx === 0
                    ? UtensilsCrossed
                    : Coffee;
                return (
                  <div
                    key={plan.id}
                    className="p-5 rounded-2xl border border-slate-200 bg-white hover:border-teal-300 transition-colors text-start flex flex-col justify-between"
                  >
                    <div>
                      <div className="w-9 h-9 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center mb-3">
                        <PlanIcon className="w-4 h-4" />
                      </div>
                      <h3 className="font-bold text-slate-900 text-sm mb-1">
                        {pickLang(plan, 'name', lang)}
                      </h3>
                      <div className="text-lg font-extrabold text-teal-800 my-2 num-ltr tabular-nums">
                        {plan.price_monthly === 0 ? 'Rs. 0' : formatCurrency(plan.price_monthly)}
                        <span className="text-xs font-normal text-slate-500 ms-1">/mo</span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {pickLang(plan, 'description', lang)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* 5. STUDENT & PARENT REVIEWS SECTION */}
      {reviews.length > 0 && (
        <section className="py-16 lg:py-24 bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-xs font-semibold text-teal-700">
                {lang === 'ur' ? 'طلبہ اور والدین کے تاثرات' : 'Resident & Parent Feedback'}
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
                {t('reviews.title')}
              </h2>
              <p className="text-sm sm:text-base text-slate-600 mt-1">
                {t('reviews.subtitle')}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {reviews.slice(0, 4).map((rev) => (
                <Card key={rev.id} className="p-6 flex flex-col justify-between text-start" hoverable>
                  <div>
                    <div className="flex items-center gap-1 mb-3 text-amber-500">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-500 anim-star-flash" />
                      ))}
                    </div>
                    <p className="text-sm text-slate-700 leading-relaxed mb-4">
                      "{pickLang(rev, 'comment', lang)}"
                    </p>
                  </div>
                  <div className="pt-3 border-t border-slate-100">
                    <span className="font-bold text-xs text-slate-900 block">{rev.name}</span>
                    <span className="text-[11px] text-teal-700 font-medium">
                      {lang === 'ur' ? 'تصدیق شدہ رائے' : 'Verified Resident / Parent'}
                    </span>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 6. LOCATION MINI-SECTION */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-10 overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-5 space-y-4 text-start">
                <span className="text-xs font-semibold text-teal-400">
                  {lang === 'ur' ? 'ہاسٹل کا پتہ' : 'Prime Campus Location'}
                </span>
                <h3 className="text-2xl sm:text-3xl font-bold text-white">
                  {t('location.title')}
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {hostelInfo
                    ? pickLang(hostelInfo, 'address', lang)
                    : 'Main College Road, Near Punjab College, Sadiqabad, Punjab'}
                </p>
                <div className="flex items-center gap-2 text-xs text-slate-300 font-medium">
                  <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>
                    {lang === 'ur'
                      ? 'پنجاب کالج، اکیڈمیز اور مین بس اسٹینڈ کے بالکل قریب'
                      : 'Walking distance from Punjab College, academies & main bus stand'}
                  </span>
                </div>
                <div className="pt-2 flex flex-wrap gap-3">
                  <Link to="/location">
                    <Button variant="accent" size="md" className="whitespace-nowrap">
                      {lang === 'ur' ? 'مکمل راستہ اور فاصلہ دیکھیں' : 'View Full Location & Map'}
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="lg:col-span-7 rounded-2xl overflow-hidden border border-slate-700 aspect-[16/9]">
                <iframe
                  src={
                    hostelInfo?.map_embed_url ||
                    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d111244.69800531557!2d70.05267398188164!3d28.307525283457193!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39375e2a22ab072d%3A0xc3191cb142646c07!2sSadiqabad%2C%20Rahim%20Yar%20Khan%2C%20Punjab!5e0!3m2!1sen!2s!4v1700000000000!5m2!1sen!2s'
                  }
                  className="w-full h-full border-0"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Hostel Google Map Location"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. FINAL CTA BAND */}
      <section className="py-16 bg-teal-800 text-white text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight">
            {lang === 'ur' ? 'اپنی سیٹ آج ہی محفوظ کروائیں' : 'Reserve Your Room Before Seats Fill Up'}
          </h2>
          <p className="mt-3 text-base text-teal-100 max-w-2xl mx-auto">
            {lang === 'ur'
              ? 'صرف ۶۰ سیکنڈ میں آن لائن بکنگ فارم جمع کروائیں یا براہ راست واٹس ایپ پر ہاسٹل وارڈن سے بات کریں۔'
              : 'Submit a room booking inquiry in under 60 seconds or message our resident warden directly on WhatsApp.'}
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link to="/contact#inquiry">
              <Button variant="accent" size="lg" className="font-bold whitespace-nowrap">
                {t('hero.ctaBook')}
              </Button>
            </Link>
            <a href={waLink} target="_blank" rel="noopener noreferrer">
              <Button
                variant="outlineDark"
                size="lg"
                className="border-white hover:bg-white hover:text-teal-900 whitespace-nowrap"
                icon={<MessageCircle className="w-5 h-5 text-emerald-300" />}
              >
                {t('hero.ctaWhatsApp')}
              </Button>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};
