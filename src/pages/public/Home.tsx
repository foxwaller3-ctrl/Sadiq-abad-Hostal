import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Wifi,
  Shield,
  Utensils,
  Zap,
  ArrowRight,
  Phone,
  MessageCircle,
  MapPin,
  Star,
  CheckCircle,
  ExternalLink,
  Bed,
  Sparkles
} from 'lucide-react';
import { roomsService } from '../../services/roomsService.ts';
import { messService } from '../../services/messService.ts';
import { reviewsService } from '../../services/reviewsService.ts';
import { hostelInfoService } from '../../services/hostelInfoService.ts';
import { settingsService } from '../../services/settingsService.ts';
import type { Room, MessPlan, Review, HostelInfo } from '../../types/index.ts';
import { useI18n } from '../../i18n/I18nContext.tsx';
import {
  pickLang,
  formatCurrency,
  getAvailabilityStatus,
  generateWhatsAppLink
} from '../../utils/helpers.ts';
import { Button } from '../../components/ui/Button.tsx';
import { Badge } from '../../components/ui/Badge.tsx';
import { Card } from '../../components/ui/Card.tsx';
import { SeoHead } from '../../components/common/SeoHead.tsx';

export const Home: React.FC = () => {
  const { lang, t, dir } = useI18n();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [messPlans, setMessPlans] = useState<MessPlan[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [hostelInfo, setHostelInfo] = useState<HostelInfo | null>(null);
  const [whatsappTemplate, setWhatsappTemplate] = useState('');

  useEffect(() => {
    roomsService.getPublished().then(setRooms);
    messService.getPlans().then(setMessPlans);
    reviewsService.getVisible().then(setReviews);
    hostelInfoService.get().then(setHostelInfo);
    settingsService.get().then((s) => {
      setWhatsappTemplate(pickLang(s, 'whatsapp_message_template', lang));
    });
  }, [lang]);

  const phone = hostelInfo?.phone || '0300-1234567';
  const whatsapp = hostelInfo?.whatsapp || '0300-1234567';
  const waLink = generateWhatsAppLink(whatsapp, whatsappTemplate || 'Assalam o Alaikum, I want to book a room.');
  const telLink = `tel:${phone.replace(/[^0-9+]/g, '')}`;

  return (
    <div>
      <SeoHead />

      {/* 1. HERO SECTION */}
      <section className="relative bg-slate-900 text-white overflow-hidden py-20 lg:py-28">
        {/* Background Image with Dark Gradient Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1920&q=80"
            alt="Sadiqabad Student Hostel Room"
            className="w-full h-full object-cover opacity-25 scale-105"
            fetchPriority="high"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-900/85 to-teal-950/70" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-6 text-start">
            {/* Top pill badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs md:text-sm font-semibold backdrop-blur-xs">
              <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>{lang === 'ur' ? 'داخلے جاری ہیں – سیشن ۲۰۲۶' : 'Admissions Open for Session 2026'}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
              {t('hero.tagline')}
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-slate-300 leading-relaxed font-normal max-w-2xl">
              {t('hero.subtext')}
            </p>

            {/* CTAs */}
            <div className="pt-2 flex flex-wrap items-center gap-3 sm:gap-4">
              <Link to="/contact#inquiry">
                <Button variant="accent" size="lg" className="font-bold">
                  {t('hero.ctaBook')}
                </Button>
              </Link>
              <a href={waLink} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="lg" className="border-emerald-500 text-emerald-300 hover:bg-emerald-950/50 hover:text-white" icon={<MessageCircle className="w-5 h-5 text-emerald-400" />}>
                  {t('hero.ctaWhatsApp')}
                </Button>
              </a>
              <a href={telLink}>
                <Button variant="ghost" size="lg" className="text-slate-300 hover:text-white hover:bg-slate-800" icon={<Phone className="w-4 h-4" />}>
                  {t('hero.ctaCall')}
                </Button>
              </a>
            </div>

            {/* 4 Trust Badges */}
            <div className="pt-8 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 text-xs font-medium text-slate-300">
              <div className="flex items-center gap-2 bg-slate-800/50 p-2.5 rounded-xl border border-slate-700/50 backdrop-blur-xs">
                <Wifi className="w-4 h-4 text-teal-400 shrink-0" />
                <span>{t('hero.badgeWifi')}</span>
              </div>
              <div className="flex items-center gap-2 bg-slate-800/50 p-2.5 rounded-xl border border-slate-700/50 backdrop-blur-xs">
                <Shield className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{t('hero.badgeCctv')}</span>
              </div>
              <div className="flex items-center gap-2 bg-slate-800/50 p-2.5 rounded-xl border border-slate-700/50 backdrop-blur-xs">
                <Utensils className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{t('hero.badgeMess')}</span>
              </div>
              <div className="flex items-center gap-2 bg-slate-800/50 p-2.5 rounded-xl border border-slate-700/50 backdrop-blur-xs">
                <Zap className="w-4 h-4 text-yellow-400 shrink-0" />
                <span>{t('hero.badgePower')}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. HIGHLIGHTS STRIP: Why Students Choose Us */}
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="p-6 bg-slate-50 border-slate-200" hoverable>
              <div className="w-12 h-12 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center mb-4">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-slate-900 mb-2">
                {t('highlights.safe')}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {t('highlights.safeDesc')}
              </p>
            </Card>

            <Card className="p-6 bg-slate-50 border-slate-200" hoverable>
              <div className="w-12 h-12 rounded-xl bg-cyan-100 text-cyan-800 flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-slate-900 mb-2">
                {t('highlights.clean')}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {t('highlights.cleanDesc')}
              </p>
            </Card>

            <Card className="p-6 bg-slate-50 border-slate-200" hoverable>
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center mb-4">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-slate-900 mb-2">
                {t('highlights.affordable')}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {t('highlights.affordableDesc')}
              </p>
            </Card>

            <Card className="p-6 bg-slate-50 border-slate-200" hoverable>
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center mb-4">
                <Bed className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-slate-900 mb-2">
                {t('highlights.comfortable')}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {t('highlights.comfortableDesc')}
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* 3. ROOMS PREVIEW SECTION */}
      <section className="py-16 lg:py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-teal-700">
                {lang === 'ur' ? 'کمرے اور کرایہ' : 'Accommodations'}
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
                {t('rooms.title')}
              </h2>
              <p className="text-sm sm:text-base text-slate-600 mt-1">
                {t('rooms.subtitle')}
              </p>
            </div>
            <Link to="/rooms">
              <Button variant="outline" size="sm" icon={<ArrowRight className={`w-4 h-4 ${dir === 'rtl' ? 'rotate-180' : ''}`} />}>
                {lang === 'ur' ? 'تمام کمرے دیکھیں' : 'View All Rooms'}
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {rooms.slice(0, 4).map((room) => {
              const avail = getAvailabilityStatus(room.beds_available);
              const roomName = pickLang(room, 'name', lang);
              const badgeVariant =
                avail === 'available' ? 'success' : avail === 'limited' ? 'warning' : 'danger';
              const badgeText =
                avail === 'available'
                  ? `${room.beds_available} ${t('rooms.bedsAvailable')}`
                  : avail === 'limited'
                  ? `${t('rooms.only')} ${room.beds_available} ${t('rooms.bedsLeft')}`
                  : t('rooms.soldOut');

              return (
                <Card key={room.id} className="overflow-hidden flex flex-col" hoverable>
                  {/* Photo with fixed 4:3 aspect ratio */}
                  <div className="aspect-[4/3] w-full bg-slate-200 relative overflow-hidden">
                    <img
                      src={room.image_urls[0] || 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=600&q=80'}
                      alt={roomName}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute top-3 right-3">
                      <Badge variant={badgeVariant}>{badgeText}</Badge>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-bold text-base text-slate-900 mb-1">{roomName}</h3>
                      <div className="flex items-baseline gap-1 mt-2 mb-3">
                        <span className="text-xl font-extrabold text-teal-800 num-ltr">
                          {formatCurrency(room.monthly_fee)}
                        </span>
                        <span className="text-xs text-slate-500 font-medium">
                          {t('rooms.perMonth')}
                        </span>
                      </div>

                      <div className="space-y-1.5 mb-4 text-xs text-slate-600">
                        {room.features.slice(0, 3).map((f, idx) => (
                          <div key={idx} className="flex items-center gap-1.5">
                            <CheckCircle className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                            <span>{lang === 'ur' ? f.ur || f.en : f.en}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
                      <Link to={`/contact?room=${room.room_type}#inquiry`} className="flex-1">
                        <Button variant="primary" size="sm" className="w-full">
                          {t('rooms.inquireNow')}
                        </Button>
                      </Link>
                      <Link to="/rooms">
                        <Button variant="secondary" size="sm">
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

      {/* 4. MESS PREVIEW */}
      <section className="py-16 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5 space-y-4 text-start">
              <span className="text-xs font-bold uppercase tracking-wider text-teal-700">
                {lang === 'ur' ? 'کھانا اور مینو' : 'Dining & Mess'}
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                {t('mess.title')}
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                {t('mess.subtitle')}
              </p>
              <p className="text-xs text-slate-500 bg-amber-50 p-3 rounded-xl border border-amber-200">
                {t('mess.optionalNote')}
              </p>
              <div className="pt-2">
                <Link to="/mess">
                  <Button variant="primary" size="md">
                    {lang === 'ur' ? 'ہفتہ وار مینو دیکھیں' : 'View Full Weekly Menu'}
                  </Button>
                </Link>
              </div>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-4">
              {messPlans.map((plan) => (
                <div
                  key={plan.id}
                  className="p-5 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-teal-50/50 hover:border-teal-300 transition-all text-start flex flex-col justify-between"
                >
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm mb-1">
                      {pickLang(plan, 'name', lang)}
                    </h4>
                    <div className="text-lg font-extrabold text-teal-800 my-2 num-ltr">
                      {plan.price_monthly === 0 ? 'Rs. 0' : formatCurrency(plan.price_monthly)}
                      <span className="text-xs font-normal text-slate-500 ms-1">/mo</span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {pickLang(plan, 'description', lang)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 5. REVIEWS SECTION */}
      <section className="py-16 lg:py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-700">
              {lang === 'ur' ? 'تاثرات' : 'Testimonials'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              {t('reviews.title')}
            </h2>
            <p className="text-sm sm:text-base text-slate-600 mt-1">
              {t('reviews.subtitle')}
            </p>
            <p className="text-xs text-slate-400 italic mt-1">{t('reviews.sampleNotice')}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {reviews.slice(0, 4).map((rev) => (
              <Card key={rev.id} className="p-6 flex flex-col justify-between text-start" hoverable>
                <div>
                  <div className="flex items-center gap-1 mb-3 text-amber-500">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-500" />
                    ))}
                  </div>
                  <p className="text-sm text-slate-700 leading-relaxed italic mb-4">
                    "{pickLang(rev, 'comment', lang)}"
                  </p>
                </div>
                <div className="pt-3 border-t border-slate-100">
                  <span className="font-bold text-xs text-slate-900 block">{rev.name}</span>
                  <span className="text-[11px] text-teal-700 font-medium">Resident</span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 6. LOCATION MINI-SECTION */}
      <section className="py-16 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-slate-900 to-teal-950 text-white rounded-3xl p-6 sm:p-10 shadow-xl overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-5 space-y-4 text-start">
                <span className="text-xs font-bold uppercase tracking-wider text-teal-400">
                  {lang === 'ur' ? 'ہاسٹل کا پتہ' : 'Campus Location'}
                </span>
                <h3 className="text-2xl sm:text-3xl font-bold text-white">
                  {t('location.title')}
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {hostelInfo ? pickLang(hostelInfo, 'address', lang) : 'Sadiqabad, Punjab'}
                </p>
                <div className="flex items-center gap-2 text-xs text-slate-300 font-medium">
                  <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>{lang === 'ur' ? 'کالجز اور بس اسٹینڈ کے بالکل قریب' : 'Walking distance from main colleges and bus station'}</span>
                </div>
                <div className="pt-2 flex flex-wrap gap-3">
                  <Link to="/location">
                    <Button variant="accent" size="md">
                      {lang === 'ur' ? 'مکمل راستہ اور فاصلہ دیکھیں' : 'View Full Location & Map'}
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="lg:col-span-7 rounded-2xl overflow-hidden border border-slate-700/60 shadow-lg aspect-[16/9]">
                <iframe
                  src={hostelInfo?.map_embed_url || 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d111244.69800531557!2d70.05267398188164!3d28.307525283457193!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39375e2a22ab072d%3A0xc3191cb142646c07!2sSadiqabad%2C%20Rahim%20Yar%20Khan%2C%20Punjab!5e0!3m2!1sen!2s!4v1700000000000!5m2!1sen!2s'}
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
            {lang === 'ur' ? 'اپنی سیٹ آج ہی محفوظ کروائیں' : 'Reserve Your Seat Before Spots Fill Up'}
          </h2>
          <p className="mt-3 text-base text-teal-100 max-w-2xl mx-auto">
            {lang === 'ur'
              ? 'صرف ۶۰ سیکنڈ میں آن لائن فارم جمع کروائیں یا براہ راست واٹس ایپ پر ہاسٹل وارڈن سے بات کریں۔'
              : 'Submit an admission inquiry in less than 60 seconds or reach out directly on WhatsApp.'}
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link to="/contact#inquiry">
              <Button variant="accent" size="lg" className="font-bold">
                {t('hero.ctaBook')}
              </Button>
            </Link>
            <a href={waLink} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-teal-900" icon={<MessageCircle className="w-5 h-5 text-emerald-300" />}>
                {t('hero.ctaWhatsApp')}
              </Button>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};
