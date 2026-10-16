import React from 'react';
import { Link } from 'react-router-dom';
import { Home, PhoneCall, HelpCircle } from 'lucide-react';
import { Button } from '../../components/ui/Button.tsx';
import { useI18n } from '../../i18n/I18nContext.tsx';
import { SeoHead } from '../../components/common/SeoHead.tsx';

export const NotFound: React.FC = () => {
  const { lang, t } = useI18n();

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-16 px-4">
      <SeoHead title="404 - Page Not Found" />

      <div className="max-w-md w-full text-center space-y-6">
        <div className="w-20 h-20 rounded-3xl bg-teal-50 text-teal-700 flex items-center justify-center mx-auto shadow-xs border border-teal-200">
          <HelpCircle className="w-10 h-10" />
        </div>

        <div>
          <span className="text-4xl sm:text-5xl font-extrabold text-teal-800 tracking-tight block">
            404
          </span>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mt-2">
            {t('common.pageNotFound')}
          </h1>
          <p className="text-sm text-slate-600 mt-2 leading-relaxed">
            {t('common.pageNotFoundDesc')}
          </p>
        </div>

        <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
          <Link to="/">
            <Button variant="primary" size="md" icon={<Home className="w-4 h-4" />}>
              {t('common.backToHome')}
            </Button>
          </Link>
          <Link to="/contact">
            <Button variant="outline" size="md" icon={<PhoneCall className="w-4 h-4" />}>
              {t('nav.contact')}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
