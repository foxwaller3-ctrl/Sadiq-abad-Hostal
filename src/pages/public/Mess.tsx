import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Utensils,
  Coffee,
  Sun,
  Moon,
  Info,
  Calendar,
  Sparkles,
  Check
} from 'lucide-react';
import { messService } from '../../services/messService.ts';
import type { MessPlan, MessMenuDay } from '../../types/index.ts';
import { useI18n } from '../../i18n/I18nContext.tsx';
import {
  pickLang,
  formatCurrency,
  getDayName
} from '../../utils/helpers.ts';
import { Card } from '../../components/ui/Card.tsx';
import { Button } from '../../components/ui/Button.tsx';
import { Badge } from '../../components/ui/Badge.tsx';
import { SeoHead } from '../../components/common/SeoHead.tsx';

export const Mess: React.FC = () => {
  const { lang, t } = useI18n();
  const [plans, setPlans] = useState<MessPlan[]>([]);
  const [menuDays, setMenuDays] = useState<MessMenuDay[]>([]);
  // Current day index (0 = Sunday, 1 = Monday, etc.)
  const todayIndex = new Date().getDay();
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(todayIndex);

  useEffect(() => {
    messService.getPlans().then(setPlans);
    messService.getMenu().then(setMenuDays);
  }, []);

  // Sort days starting with Monday (1..6, 0)
  const orderedMenuDays = [...menuDays].sort((a, b) => {
    const orderA = a.day_of_week === 0 ? 7 : a.day_of_week;
    const orderB = b.day_of_week === 0 ? 7 : b.day_of_week;
    return orderA - orderB;
  });

  const activeDay =
    menuDays.find((m) => m.day_of_week === selectedDayIndex) || menuDays[0];

  return (
    <div className="py-12 lg:py-16">
      <SeoHead
        title={lang === 'ur' ? 'میس پیکیجز اور ہفتہ وار مینو' : 'Mess Plans & Weekly Menu'}
        description={lang === 'ur' ? 'صادق آباد اسٹوڈنٹ ہاسٹل کا ہفتہ وار مینو اور کھانے کے پیکیجز' : 'Nutritious, home-style 3-time meals with complete weekly dining schedule.'}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-wider text-teal-700">
            {lang === 'ur' ? 'تازہ اور لذیذ کھانا' : 'Dining Excellence'}
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-1">
            {t('mess.title')}
          </h1>
          <p className="mt-3 text-base text-slate-600">
            {t('mess.subtitle')}
          </p>
        </div>

        {/* 1. Mess Plans Cards */}
        <div className="mb-16">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-6 text-start">
            {t('mess.plansTitle')}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan) => {
              const name = pickLang(plan, 'name', lang);
              const desc = pickLang(plan, 'description', lang);
              const isPopular = plan.price_monthly === 9000;

              return (
                <Card
                  key={plan.id}
                  className={`p-6 text-start flex flex-col justify-between relative overflow-hidden ${
                    isPopular ? 'border-2 border-teal-700 bg-teal-50/20' : ''
                  }`}
                  hoverable
                >
                  {isPopular && (
                    <div className="absolute top-0 right-0 bg-teal-700 text-white text-[11px] font-bold px-3 py-1 rounded-bl-xl">
                      {lang === 'ur' ? 'سب سے زیادہ منتخب' : 'Most Popular'}
                    </div>
                  )}

                  <div>
                    <h3 className="font-bold text-lg text-slate-900 mb-2">{name}</h3>
                    <div className="flex items-baseline gap-1 my-3">
                      <span className="text-2xl sm:text-3xl font-extrabold text-teal-800 num-ltr">
                        {plan.price_monthly === 0
                          ? 'Rs. 0'
                          : formatCurrency(plan.price_monthly)}
                      </span>
                      <span className="text-xs text-slate-500 font-medium">
                        {t('rooms.perMonth')}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 leading-relaxed mb-6">
                      {desc}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-100">
                    <Link to="/contact#inquiry">
                      <Button
                        variant={isPopular ? 'primary' : 'outline'}
                        size="sm"
                        className="w-full"
                      >
                        {lang === 'ur' ? 'یہ پیکیج منتخب کریں' : 'Choose Plan'}
                      </Button>
                    </Link>
                  </div>
                </Card>
              );
            })}
          </div>

          <div className="mt-4 p-4 rounded-2xl bg-amber-50 border border-amber-200/80 flex items-start gap-3 text-start">
            <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <p className="text-xs sm:text-sm text-amber-900 leading-relaxed">
              {t('mess.optionalNote')}
            </p>
          </div>
        </div>

        {/* 2. Weekly Menu Schedule */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs mb-16">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-bold text-teal-700 uppercase tracking-wider mb-1">
                <Calendar className="w-4 h-4" />
                <span>{lang === 'ur' ? '۷ دن کا مینو' : '7-Day Dining Schedule'}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                {t('mess.menuTitle')}
              </h2>
            </div>
            <div className="text-xs text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 w-fit">
              {lang === 'ur' ? 'کھانا روزانہ تازہ تیار ہوتا ہے' : 'Fresh ingredients delivered daily'}
            </div>
          </div>

          {/* Desktop Table View (7 days x 3 meals) */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full text-start text-sm border-collapse">
              <thead>
                <tr className="border-b-2 border-slate-200 bg-slate-50 text-slate-700">
                  <th className="py-3 px-4 font-bold text-start w-32">
                    {lang === 'ur' ? 'دن' : 'Day'}
                  </th>
                  <th className="py-3 px-4 font-bold text-start">
                    <div className="flex items-center gap-1.5 text-amber-700">
                      <Coffee className="w-4 h-4" />
                      <span>{t('mess.breakfast')} (7:30 - 9:00 AM)</span>
                    </div>
                  </th>
                  <th className="py-3 px-4 font-bold text-start">
                    <div className="flex items-center gap-1.5 text-teal-700">
                      <Sun className="w-4 h-4" />
                      <span>{t('mess.lunch')} (1:00 - 2:30 PM)</span>
                    </div>
                  </th>
                  <th className="py-3 px-4 font-bold text-start">
                    <div className="flex items-center gap-1.5 text-indigo-700">
                      <Moon className="w-4 h-4" />
                      <span>{t('mess.dinner')} (8:00 - 9:30 PM)</span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orderedMenuDays.map((m) => {
                  const isToday = m.day_of_week === todayIndex;
                  return (
                    <tr
                      key={m.id}
                      className={`hover:bg-slate-50/80 transition ${
                        isToday ? 'bg-teal-50/40 font-medium' : ''
                      }`}
                    >
                      <td className="py-4 px-4 font-bold text-slate-900 flex items-center gap-2">
                        <span>{getDayName(m.day_of_week, lang)}</span>
                        {isToday && (
                          <span className="text-[10px] bg-teal-700 text-white px-2 py-0.5 rounded-full font-bold">
                            {t('mess.todayBadge')}
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-4 text-slate-700">
                        {pickLang(m, 'breakfast', lang)}
                      </td>
                      <td className="py-4 px-4 text-slate-700">
                        {pickLang(m, 'lunch', lang)}
                      </td>
                      <td className="py-4 px-4 text-slate-700">
                        {pickLang(m, 'dinner', lang)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile & Tablet Tab View */}
          <div className="lg:hidden">
            {/* Day selector pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-3 mb-6 scrollbar-none">
              {orderedMenuDays.map((m) => {
                const isSelected = selectedDayIndex === m.day_of_week;
                const isToday = m.day_of_week === todayIndex;

                return (
                  <button
                    key={m.id}
                    onClick={() => setSelectedDayIndex(m.day_of_week)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer flex items-center gap-1 ${
                      isSelected
                        ? 'bg-teal-700 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <span>{getDayName(m.day_of_week, lang)}</span>
                    {isToday && (
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Selected day meal cards */}
            {activeDay && (
              <div className="space-y-4 text-start">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <span className="font-extrabold text-lg text-slate-900">
                    {getDayName(activeDay.day_of_week, lang)}
                  </span>
                  {activeDay.day_of_week === todayIndex && (
                    <Badge variant="accent">{t('mess.todayBadge')}</Badge>
                  )}
                </div>

                <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/80">
                  <div className="flex items-center gap-2 text-amber-800 font-bold text-xs uppercase mb-1">
                    <Coffee className="w-4 h-4" />
                    <span>{t('mess.breakfast')} (7:30 - 9:00 AM)</span>
                  </div>
                  <p className="text-sm font-semibold text-slate-900">
                    {pickLang(activeDay, 'breakfast', lang)}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-teal-50/60 border border-teal-200/80">
                  <div className="flex items-center gap-2 text-teal-800 font-bold text-xs uppercase mb-1">
                    <Sun className="w-4 h-4" />
                    <span>{t('mess.lunch')} (1:00 - 2:30 PM)</span>
                  </div>
                  <p className="text-sm font-semibold text-slate-900">
                    {pickLang(activeDay, 'lunch', lang)}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-200/80">
                  <div className="flex items-center gap-2 text-indigo-800 font-bold text-xs uppercase mb-1">
                    <Moon className="w-4 h-4" />
                    <span>{t('mess.dinner')} (8:00 - 9:30 PM)</span>
                  </div>
                  <p className="text-sm font-semibold text-slate-900">
                    {pickLang(activeDay, 'dinner', lang)}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Inquire CTA */}
        <div className="text-center">
          <Link to="/contact#inquiry">
            <Button variant="accent" size="lg" className="font-bold">
              {t('hero.ctaBook')}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
