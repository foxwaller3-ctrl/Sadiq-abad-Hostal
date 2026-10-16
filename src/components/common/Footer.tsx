import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Building2, Phone, Mail, MapPin, Clock, ShieldCheck, Heart } from 'lucide-react';
import { useI18n } from '../../i18n/I18nContext.tsx';
import { hostelInfoService } from '../../services/hostelInfoService.ts';
import { pickLang } from '../../utils/helpers.ts';
import type { HostelInfo } from '../../types/index.ts';

export const Footer: React.FC = () => {
  const [hostelInfo, setHostelInfo] = useState<HostelInfo | null>(null);
  const { lang, t } = useI18n();

  useEffect(() => {
    hostelInfoService.get().then(setHostelInfo);
  }, []);

  const hostelName = hostelInfo ? pickLang(hostelInfo, 'name', lang) : 'Sadiqabad Student Hostel';
  const address = hostelInfo ? pickLang(hostelInfo, 'address', lang) : 'Sadiqabad, Punjab';
  const officeHours = hostelInfo ? pickLang(hostelInfo, 'office_hours', lang) : '9:00 AM – 9:00 PM';
  const phone = hostelInfo?.phone || '0300-1234567';
  const email = hostelInfo?.email || 'info@sadiqabadhostel.pk';

  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Col 1: Hostel branding & description */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-teal-600 flex items-center justify-center text-white">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-white leading-tight">
                  {hostelName}
                </h3>
                <span className="text-xs text-teal-400 font-medium">
                  {lang === 'ur' ? 'محفوظ و معیاری رہائش' : 'Sadiqabad, Punjab'}
                </span>
              </div>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              {t('footer.about')}
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs text-teal-400 font-medium">
              <ShieldCheck className="w-4 h-4" />
              <span>{lang === 'ur' ? 'طلبہ اور ملازمین کے لیے بااعتماد' : 'Verified & Secure Residence'}</span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-4">
            <h4 className="font-bold text-white text-base tracking-wide border-b border-slate-800 pb-2">
              {t('footer.quickLinks')}
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/rooms" className="hover:text-teal-400 transition">
                  {t('nav.rooms')}
                </Link>
              </li>
              <li>
                <Link to="/facilities" className="hover:text-teal-400 transition">
                  {t('nav.facilities')}
                </Link>
              </li>
              <li>
                <Link to="/mess" className="hover:text-teal-400 transition">
                  {t('nav.mess')}
                </Link>
              </li>
              <li>
                <Link to="/gallery" className="hover:text-teal-400 transition">
                  {t('nav.gallery')}
                </Link>
              </li>
              <li>
                <Link to="/location" className="hover:text-teal-400 transition">
                  {t('nav.location')}
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-teal-400 transition">
                  {t('nav.about')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Guidelines & Portal */}
          <div className="space-y-4">
            <h4 className="font-bold text-white text-base tracking-wide border-b border-slate-800 pb-2">
              {t('footer.legal')}
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/rules-faq" className="hover:text-teal-400 transition">
                  {t('footer.rules')}
                </Link>
              </li>
              <li>
                <Link to="/rules-faq" className="hover:text-teal-400 transition">
                  {t('footer.faq')}
                </Link>
              </li>
              <li>
                <Link to="/rooms#fees" className="hover:text-teal-400 transition">
                  {t('footer.feePolicy')}
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-teal-400 transition">
                  {t('nav.contact')}
                </Link>
              </li>
              <li className="pt-2">
                <Link
                  to="/admin"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition"
                >
                  <span>🔐 {t('footer.adminLogin')}</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact & Office Timing */}
          <div className="space-y-4">
            <h4 className="font-bold text-white text-base tracking-wide border-b border-slate-800 pb-2">
              {t('contact.infoTitle')}
            </h4>
            <div className="space-y-3 text-sm text-slate-300">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
                <span className="leading-snug">{address}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-teal-400 shrink-0" />
                <a href={`tel:${phone.replace(/[^0-9+]/g, '')}`} className="hover:text-teal-400 font-mono num-ltr">
                  {phone}
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-teal-400 shrink-0" />
                <a href={`mailto:${email}`} className="hover:text-teal-400">
                  {email}
                </a>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
                <div>
                  <span className="block font-semibold text-slate-200">{t('location.officeHours')}</span>
                  <span className="text-xs text-slate-400">{officeHours}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div className="mt-12 pt-8 border-t border-slate-800 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>
            © {new Date().getFullYear()} {hostelName}. {t('footer.allRights')}
          </p>
          <p className="flex items-center gap-1">
            <span>Built with care for students in Sadiqabad</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 inline fill-rose-500" />
          </p>
        </div>
      </div>
    </footer>
  );
};
