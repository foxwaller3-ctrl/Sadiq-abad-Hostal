import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  Award,
  CheckCircle,
  BedDouble,
  Sparkles
} from 'lucide-react';
import { hostelInfoService } from '../../services/hostelInfoService.ts';
import { mockStore } from '../../services/mockStore.ts';
import type { HostelInfo } from '../../types/index.ts';
import { useI18n } from '../../i18n/I18nContext.tsx';
import { pickLang } from '../../utils/helpers.ts';
import { Button } from '../../components/ui/Button.tsx';
import { Card } from '../../components/ui/Card.tsx';
import { SeoHead } from '../../components/common/SeoHead.tsx';

export const About: React.FC = () => {
  const [hostelInfo, setHostelInfo] = useState<HostelInfo | null>(null);
  const { lang } = useI18n();

  useEffect(() => {
    const load = () => hostelInfoService.get().then(setHostelInfo);
    load();
    return mockStore.subscribe(load);
  }, []);

  const aboutText = hostelInfo
    ? pickLang(hostelInfo, 'about', lang)
    : 'A safe, clean and comfortable hostel in Sadiqabad.';
  const hostelName = hostelInfo ? pickLang(hostelInfo, 'name', lang) : 'Sadiqabad Student Hostel';

  return (
    <div className="py-12 lg:py-20">
      <SeoHead
        title={lang === 'ur' ? 'ہمارے بارے میں' : 'About Us'}
        description={aboutText}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-semibold text-teal-700">
            {lang === 'ur' ? 'ہمارا تعارف' : 'Our Story'}
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mt-2 text-balance">
            {lang === 'ur' ? 'صادق آباد اسٹوڈنٹ ہاسٹل کے بارے میں' : 'About Sadiqabad Student Hostel'}
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
            {aboutText}
          </p>
        </div>

        {/* Stats Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 text-center">
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center mx-auto mb-3">
              <BedDouble className="w-5 h-5" />
            </div>
            <div className="text-3xl sm:text-4xl font-extrabold text-teal-700 mb-1 tabular-nums">100+</div>
            <div className="text-xs sm:text-sm font-semibold text-slate-600">
              {lang === 'ur' ? 'کل بیڈز کی گنجائش' : 'Total Bed Capacity'}
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-200 text-center">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center mx-auto mb-3">
              <Award className="w-5 h-5" />
            </div>
            <div className="text-3xl sm:text-4xl font-extrabold text-teal-700 mb-1 tabular-nums">10+</div>
            <div className="text-xs sm:text-sm font-semibold text-slate-600">
              {lang === 'ur' ? 'سالوں کا قابل اعتماد تجربہ' : 'Years of Trust'}
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-200 text-center">
            <div className="w-10 h-10 rounded-xl bg-cyan-50 text-cyan-700 flex items-center justify-center mx-auto mb-3">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="text-3xl sm:text-4xl font-extrabold text-teal-700 mb-1 tabular-nums">13</div>
            <div className="text-xs sm:text-sm font-semibold text-slate-600">
              {lang === 'ur' ? 'ہمہ جہت سہولیات' : 'Hostel Amenities'}
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-200 text-center">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto mb-3">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="text-3xl sm:text-4xl font-extrabold text-teal-700 mb-1 tabular-nums">24/7</div>
            <div className="text-xs sm:text-sm font-semibold text-slate-600">
              {lang === 'ur' ? 'سی سی ٹی وی و گارڈ سیکیورٹی' : 'CCTV & Power Backup'}
            </div>
          </div>
        </div>

        {/* Mission & Values */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          <div className="space-y-6 text-start">
            <div className="flex items-center gap-2 text-xs font-semibold text-teal-700">
              <Award className="w-4 h-4 text-teal-600 shrink-0" />
              <span>{lang === 'ur' ? 'ہمارا مشن اور اقدار' : 'Our Mission & Values'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
              {lang === 'ur'
                ? 'طلبہ کو گھر جیسا محفوظ اور تعلیمی ماحول فراہم کرنا'
                : 'Dedicated to Providing a Secure, Disciplined & Home-like Environment'}
            </h2>
            <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
              {lang === 'ur'
                ? 'ہمارا بنیادی مقصد صادق آباد اور گردونواح سے آنے والے طلبہ کو ایک ایسا محفوظ ٹھکانہ دینا ہے جہاں وہ بغیر کسی پریشانی کے اپنی پڑھائی پر توجہ دے سکیں۔ والدین کا اعتماد ہماری سب سے بڑی کامیابی ہے۔'
                : 'Our primary objective is to provide students coming from Sadiqabad and surrounding areas with a secure sanctuary where they can concentrate on academics with zero domestic worries. Parental peace of mind is our highest benchmark.'}
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-teal-700 shrink-0 mt-0.5" />
                <span className="text-sm text-slate-700 font-medium">
                  {lang === 'ur'
                    ? 'تعلیمی یکسوئی اور رات کو مکمل خاموشی کا ضابطہ'
                    : 'Strict quiet hours for undisrupted night studying'}
                </span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-teal-700 shrink-0 mt-0.5" />
                <span className="text-sm text-slate-700 font-medium">
                  {lang === 'ur'
                    ? 'تازہ سبزیوں اور معیاری چکن کے ساتھ روزانہ تازہ کھانا'
                    : 'Daily freshly prepared meals with hygienic halal ingredients'}
                </span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-teal-700 shrink-0 mt-0.5" />
                <span className="text-sm text-slate-700 font-medium">
                  {lang === 'ur'
                    ? 'والدین سے مسلسل رابطہ اور مکمل رہنمائی'
                    : 'Open communication and periodic updates with parents'}
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-3xl overflow-hidden border border-slate-200 aspect-[4/3]">
            <img
              src="/images/study-hall.jpg"
              alt="Sadiqabad Student Hostel Quiet Study Hall"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Owner / Warden Message */}
        <Card className="p-8 sm:p-12 bg-gradient-to-r from-teal-900 to-slate-900 text-white rounded-3xl mb-16">
          <div className="max-w-3xl space-y-4 text-start">
            <span className="text-xs font-semibold text-teal-300">
              {lang === 'ur' ? 'وارڈن کا پیغام' : 'Message from the Warden'}
            </span>
            <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white leading-snug">
              {lang === 'ur'
                ? '"ہم ہر طالب علم کو اپنے خاندان کی طرح سمجھتے ہیں اور ان کے تحفظ اور اخلاقی تربیت کی مکمل ذمہ داری لیتے ہیں۔"'
                : '"We consider every resident student as part of our own family, taking utmost care of their security, well-being, and academic success."'}
            </h3>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              {lang === 'ur'
                ? 'ہاسٹل لائف انسان کی زندگی کا سب سے یادگار دور ہوتا ہے۔ ہماری کوشش ہوتی ہے کہ آپ کو ایک ایسا صاف اور دوستانہ ماحول ملے جہاں آپ کی ذہنی صلاحیتیں نکھریں۔'
                : 'Hostel years are the most transformative phase of a young person’s journey. Our mission is to provide an encouraging, disciplined setting where students build habits of excellence.'}
            </p>
            <div className="pt-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-teal-700 text-white flex items-center justify-center shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <span className="block font-bold text-white text-base">Hostel Administration</span>
                <span className="text-xs text-teal-300">{hostelName}</span>
              </div>
            </div>
          </div>
        </Card>

        {/* CTA */}
        <div className="text-center">
          <Link to="/contact">
            <Button variant="accent" size="lg" className="font-bold">
              {lang === 'ur' ? 'ہاسٹل کا وزٹ شیڈول کریں' : 'Schedule a Campus Visit'}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
