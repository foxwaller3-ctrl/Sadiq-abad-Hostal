import React, { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Building,
  Bed,
  Sparkles,
  Utensils,
  Image,
  FileText,
  Star,
  Inbox,
  Bell,
  Settings,
  LogOut,
  ExternalLink,
  Menu,
  X,
  ShieldCheck
} from 'lucide-react';
import { authService } from '../services/authService.ts';
import { inquiriesService } from '../services/inquiriesService.ts';
import { useI18n } from '../i18n/I18nContext.tsx';
import { LanguageSwitcher } from '../components/common/LanguageSwitcher.tsx';

export const AdminLayout: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [newInquiriesCount, setNewInquiriesCount] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const { t, lang } = useI18n();

  useEffect(() => {
    let active = true;
    authService.getSession()
      .then((session) => {
        if (!active) return;
        if (!session.user) {
          navigate('/admin/login', { replace: true });
          return;
        }
        setLoading(false);
      })
      .catch(() => {
        if (active) navigate('/admin/login', { replace: true });
      });
    return () => {
      active = false;
    };
  }, [navigate]);

  useEffect(() => {
    let active = true;
    const refreshCount = () => {
      inquiriesService.getAll()
        .then((items) => {
          if (active) setNewInquiriesCount(items.filter((item) => item.status === 'new').length);
        })
        .catch(() => {
          if (active) setNewInquiriesCount(0);
        });
    };
    refreshCount();
    const unsubscribe = inquiriesService.subscribe(refreshCount);
    return () => {
      active = false;
      unsubscribe();
    };
  }, [location.pathname]);

  const handleLogout = async () => {
    await authService.logout();
    navigate('/admin/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <div className="animate-pulse text-teal-800 font-semibold text-sm">
          Loading Admin Portal...
        </div>
      </div>
    );
  }

  const menuItems = [
    { to: '/admin', label: t('admin.dashboard'), icon: LayoutDashboard },
    {
      to: '/admin/inquiries',
      label: t('admin.inquiries'),
      icon: Inbox,
      badge: newInquiriesCount > 0 ? newInquiriesCount : undefined
    },
    { to: '/admin/hostel-info', label: t('admin.hostelInfo'), icon: Building },
    { to: '/admin/rooms', label: t('admin.rooms'), icon: Bed },
    { to: '/admin/facilities', label: t('admin.facilities'), icon: Sparkles },
    { to: '/admin/mess', label: t('admin.mess'), icon: Utensils },
    { to: '/admin/gallery', label: t('admin.gallery'), icon: Image },
    { to: '/admin/rules-faq', label: t('admin.rulesFaq'), icon: FileText },
    { to: '/admin/reviews', label: t('admin.reviews'), icon: Star },
    { to: '/admin/notices', label: t('admin.notices'), icon: Bell },
    { to: '/admin/settings', label: t('admin.settings'), icon: Settings }
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row text-slate-800">
      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-slate-900 text-slate-300 shrink-0 border-r border-slate-800">
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-teal-600 flex items-center justify-center text-white font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-white text-sm leading-tight">Admin Portal</h2>
              <span className="text-[11px] text-teal-400">Owner Dashboard</span>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive =
              item.to === '/admin'
                ? location.pathname === '/admin'
                : location.pathname.startsWith(item.to);
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition ${
                  isActive
                    ? 'bg-teal-700 text-white font-semibold shadow-xs'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-amber-500 text-slate-950">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-800 space-y-2">
          <Link
            to="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>View Public Website</span>
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 w-full py-2 px-3 rounded-lg text-rose-400 hover:bg-rose-950/40 text-xs font-semibold transition cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>{t('admin.logout')}</span>
          </button>
        </div>
      </aside>

      {/* Main Admin Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="h-16 bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
              aria-label="Toggle admin menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <span className="text-xs md:text-sm font-semibold text-slate-500">
              {lang === 'ur' ? 'صادق آباد اسٹوڈنٹ ہاسٹل ایڈمن' : 'Sadiqabad Student Hostel Admin'}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <Link
              to="/"
              target="_blank"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-teal-700 hover:text-teal-800 bg-teal-50 px-3 py-1.5 rounded-lg border border-teal-200 transition"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Live Site</span>
            </Link>
          </div>
        </header>

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-slate-900 text-slate-300 p-4 border-b border-slate-800 space-y-1">
            {menuItems.map((item) => {
              const isActive =
                item.to === '/admin'
                  ? location.pathname === '/admin'
                  : location.pathname.startsWith(item.to);
              const Icon = item.icon;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm ${
                    isActive ? 'bg-teal-700 text-white font-bold' : 'text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span className="px-1.5 py-0.2 text-xs font-bold rounded-full bg-amber-500 text-slate-950">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-3 py-2 text-rose-400 text-sm font-bold"
            >
              <LogOut className="w-4 h-4" />
              <span>{t('admin.logout')}</span>
            </button>
          </div>
        )}

        {/* Admin Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
