import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Menu,
  X,
  Home,
  Building2,
  Sparkles,
  UtensilsCrossed,
  Images,
  MapPin,
  ShieldCheck,
  PhoneCall,
  Info,
  ArrowRight
} from 'lucide-react';
import { useI18n } from '../../i18n/I18nContext.tsx';
import { LanguageSwitcher } from './LanguageSwitcher.tsx';
import { Button } from '../ui/Button.tsx';
import { hostelInfoService } from '../../services/hostelInfoService.ts';
import { mockStore } from '../../services/mockStore.ts';
import { pickLang, normalizeImageUrl } from '../../utils/helpers.ts';
import type { HostelInfo } from '../../types/index.ts';

export const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [hostelInfo, setHostelInfo] = useState<HostelInfo>(() => mockStore.hostelInfo);
  const [logoFailed, setLogoFailed] = useState(false);
  const { lang, t, dir } = useI18n();
  const location = useLocation();

  useEffect(() => {
    let active = true;
    const fetchInfo = () => {
      hostelInfoService.get().then((info) => {
        if (active) {
          setHostelInfo(info);
          setLogoFailed(false);
        }
      });
    };
    fetchInfo();
    const unsubscribe = mockStore.subscribe(fetchInfo);
    return () => {
      active = false;
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  // Concise 5-item desktop navigation adhering to Top Bar Contract
  const desktopNavLinks = [
    { to: '/rooms', label: t('nav.rooms') },
    { to: '/facilities', label: t('nav.facilities') },
    { to: '/mess', label: t('nav.mess') },
    { to: '/gallery', label: t('nav.gallery') },
    { to: '/rules-faq', label: t('nav.rulesFaq') }
  ];

  // Full 9-page navigation in mobile drawer
  const mobileNavLinks = [
    { to: '/', label: t('nav.home'), icon: Home },
    { to: '/rooms', label: t('nav.rooms'), icon: Building2 },
    { to: '/facilities', label: t('nav.facilities'), icon: Sparkles },
    { to: '/mess', label: t('nav.mess'), icon: UtensilsCrossed },
    { to: '/gallery', label: t('nav.gallery'), icon: Images },
    { to: '/location', label: t('nav.location'), icon: MapPin },
    { to: '/rules-faq', label: t('nav.rulesFaq'), icon: ShieldCheck },
    { to: '/about', label: t('nav.about'), icon: Info },
    { to: '/contact', label: t('nav.contact'), icon: PhoneCall }
  ];

  const hostelName = hostelInfo ? pickLang(hostelInfo, 'name', lang) : 'Sadiqabad Student Hostel';
  const logoUrl = normalizeImageUrl(hostelInfo?.logo_url) || '/logo.png';

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-2 sm:gap-6 lg:gap-8 h-16 sm:h-20">
          {/* Zone 1: Single-line Brand Wordmark + Official Logo */}
          <Link to="/" className="flex items-center gap-2.5 sm:gap-3 group shrink min-w-0">
            {logoUrl && !logoFailed ? (
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-white border border-slate-200 p-1 flex items-center justify-center overflow-hidden shrink-0">
                <img
                  src={logoUrl}
                  alt={hostelName}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    if ((e.currentTarget as HTMLImageElement).src !== window.location.origin + '/logo.png') {
                      (e.currentTarget as HTMLImageElement).src = '/logo.png';
                    } else {
                      setLogoFailed(true);
                    }
                  }}
                />
              </div>
            ) : (
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-teal-700 flex items-center justify-center text-white shrink-0">
                <Building2 className="w-5 h-5" />
              </div>
            )}
            <span className="font-extrabold text-sm sm:text-lg text-slate-900 tracking-tight whitespace-nowrap truncate max-w-[150px] sm:max-w-none group-hover:text-teal-700 transition-colors">
              {hostelName}
            </span>
          </Link>

          {/* Zone 2: Clean single-line text navigation links */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-600">
            {desktopNavLinks.map((link) => {
              const isActive = location.pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`py-1 border-b-2 transition-colors duration-150 whitespace-nowrap shrink-0 ${
                    isActive
                      ? 'border-teal-700 text-teal-800 font-bold'
                      : 'border-transparent hover:text-slate-900 hover:border-slate-300'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Zone 3: Language Switcher & Primary CTA */}
          <div className="hidden lg:flex items-center gap-3 shrink-0">
            <LanguageSwitcher />
            <Link to="/contact#inquiry" className="shrink-0">
              <Button variant="accent" size="sm" className="font-bold whitespace-nowrap">
                {t('nav.bookNow')}
              </Button>
            </Link>
          </div>

          {/* Mobile & Tablet Actions: Language & Hamburger */}
          <div className="flex items-center gap-2 lg:hidden shrink-0">
            <LanguageSwitcher />
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-slate-700 hover:text-teal-700 hover:bg-slate-100 rounded-xl transition duration-150 cursor-pointer"
              aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={isOpen}
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 top-16 sm:top-20 z-50 bg-slate-950/50 backdrop-blur-xs flex flex-col justify-start">
          <div className="bg-white border-b border-slate-200 px-6 py-5 shadow-xl flex flex-col gap-2 max-h-[calc(100vh-4rem)] overflow-y-auto">
            <div className="flex flex-col gap-1">
              {mobileNavLinks.map((link) => {
                const isActive = location.pathname === link.to;
                const Icon = link.icon;
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-semibold transition ${
                      isActive
                        ? 'bg-teal-50 text-teal-800'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {Icon && <Icon className="w-4 h-4 text-teal-700 shrink-0" />}
                      <span>{link.label}</span>
                    </div>
                    <ArrowRight className={`w-4 h-4 text-slate-400 ${dir === 'rtl' ? 'rotate-180' : ''}`} />
                  </Link>
                );
              })}
            </div>

            <div className="pt-3 border-t border-slate-100 flex flex-col gap-2.5">
              <Link to="/contact#inquiry" onClick={() => setIsOpen(false)}>
                <Button variant="accent" size="md" className="w-full font-bold">
                  {t('nav.bookNow')}
                </Button>
              </Link>
              <Link
                to="/admin"
                onClick={() => setIsOpen(false)}
                className="text-center text-xs text-slate-500 hover:text-teal-700 py-1"
              >
                {t('nav.admin')}
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
