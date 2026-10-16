import React, { useState, useEffect } from 'react';
import { Bell, X } from 'lucide-react';
import { noticesService } from '../../services/noticesService.ts';
import type { Notice } from '../../types/index.ts';
import { useI18n } from '../../i18n/I18nContext.tsx';
import { pickLang } from '../../utils/helpers.ts';

export const NoticeBar: React.FC = () => {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [dismissed, setDismissed] = useState(false);
  const { lang } = useI18n();

  useEffect(() => {
    noticesService.getActive().then((list) => {
      setNotices(list);
    });
  }, []);

  if (dismissed || notices.length === 0) return null;

  const notice = notices[0];
  const text = pickLang(notice, 'text', lang);

  return (
    <div className="bg-amber-500 text-slate-950 px-4 py-2 text-xs md:text-sm font-semibold flex items-center justify-between border-b border-amber-600/20 shadow-xs relative z-40">
      <div className="flex items-center gap-2 max-w-5xl mx-auto text-center px-4">
        <Bell className="w-4 h-4 shrink-0 animate-bounce" />
        <span className="line-clamp-1">{text}</span>
      </div>
      <button
        onClick={() => setDismissed(true)}
        className="p-1 hover:bg-amber-600/30 rounded-md transition duration-150 cursor-pointer"
        aria-label="Dismiss notice"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
