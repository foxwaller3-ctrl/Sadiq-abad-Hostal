import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Home, Building2, Sparkles, UtensilsCrossed, Images, MapPin, ShieldCheck, PhoneCall, ArrowRight } from 'lucide-react';
import { useI18n } from '../../i18n/I18nContext.tsx';
import { LanguageSwitcher } from './LanguageSwitcher.tsx';
import { Button } from '../ui/Button.tsx';
import { hostelInfoService } from '../../services/hostelInfoService.ts';
import { pickLang } from '../../utils/helpers.ts';
import type { HostelInfo } from '../../types/index.ts';

export const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [hostelInfo, setHostelInfo] = useState<HostelInfo | null>(null);
  const { lang, t, dir } = useI18n();
  const location = useLocation();

  useEffect(() => {
    hostelInfoService.get().then(setHostelInfo);
  }, []);

  // Close drawer when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { to: '/', label: t('nav.home'), icon: Home },
    { to: '/rooms', label: t('nav.rooms'), icon: Building2 },
    { to: '/facilities', label: t('nav.facilities'), icon: Sparkles },
    { to: '/mess', label: t('nav.mess'), icon: UtensilsCrossed },
    { to: '/gallery', label: t('nav.gallery'), icon: Images },
    { to: '/location', label: t('nav.location'), icon: MapPin },
    { to: '/rules-faq', label: t('nav.rulesFaq'), icon: ShieldCheck },
    { to: '/about', label: t('nav.about'), icon: null },
    { to: '/contact', label: t('nav.contact'), icon: PhoneCall }
  ];

  const hostelName = hostelInfo ? pickLang(hostelInfo, 'name', lang) : 'Sadiqabad Student Hostel';

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Brand Name */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-xl bg-teal-700 flex items-center justify-center text-white shadow-md group-hover:bg-teal-800 transition duration-200">
              <Building2 className="w-6 h-6" />
            </div>
            <div className="flex flex-col text-start">
              <span className="font-extrabold text-base md:text-lg text-slate-900 tracking-tight leading-tight group-hover:text-teal-700 transition">
                {hostelName}
              </span>
              <span className="text-xs text-teal-700 font-semibold tracking-wider uppercase">
                {lang === 'ur' ? 'محفوظ رہائش و میس' : 'Sadiqabad • Punjab'}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-150 ${
                    isActive
                      ? 'text-teal-700 font-bold bg-teal-50'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Header Actions */}
          <div className="hidden sm:flex items-center gap-3">
            <LanguageSwitcher />
            <Link to="/contact#inquiry">
              <Button variant="accent" size="sm" className="font-bold">
                {t('nav.bookNow')}
              </Button>
            </Link>
          </div>

          {/* Mobile Actions: Language & Hamburger */}
          <div className="flex items-center gap-2 lg:hidden">
            <LanguageSwitcher />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-slate-700 hover:text-teal-700 hover:bg-slate-100 rounded-xl transition duration-150 cursor-pointer"
              aria-label={isOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isOpen}
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 top-20 z-50 bg-slate-950/50 backdrop-blur-xs flex flex-col justify-start">
          <div className="bg-white border-b border-slate-200 px-6 py-6 shadow-xl flex flex-col gap-2 max-h-[calc(100vh-5rem)] overflow-y-auto">
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.to;
                const Icon = link.icon;
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center justify-between px-4 py-3 rounded-xl text-base font-semibold transition ${
                      isActive
                        ? 'bg-teal-50 text-teal-800'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {Icon && <Icon className="w-5 h-5 text-teal-700" />}
                      <span>{link.label}</span>
                    </div>
                    <ArrowRight className={`w-4 h-4 text-slate-400 ${dir === 'rtl' ? 'rotate-180' : ''}`} />
                  </Link>
                );
              })}
            </div>

            <div className="pt-4 border-t border-slate-100 flex flex-col gap-3">
              <Link to="/contact#inquiry" onClick={() => setIsOpen(false)}>
                <Button variant="accent" size="lg" className="w-full font-bold">
                  {t('nav.bookNow')}
                </Button>
              </Link>
              <Link to="/admin" onClick={() => setIsOpen(false)} className="text-center text-xs text-slate-500 hover:text-teal-700 py-1">
                {t('nav.admin')}
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
