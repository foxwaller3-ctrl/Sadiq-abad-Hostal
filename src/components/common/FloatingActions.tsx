import React, { useState, useEffect } from 'react';
import { Phone, MessageCircle } from 'lucide-react';
import { hostelInfoService } from '../../services/hostelInfoService.ts';
import { settingsService } from '../../services/settingsService.ts';
import { mockStore } from '../../services/mockStore.ts';
import { generateWhatsAppLink, pickLang } from '../../utils/helpers.ts';
import { useI18n } from '../../i18n/I18nContext.tsx';

export const FloatingActions: React.FC = () => {
  const [phone, setPhone] = useState('0304-7862410');
  const [whatsapp, setWhatsapp] = useState('0304-7862410');
  const [template, setTemplate] = useState(
    'Assalam o Alaikum, I want to inquire about room availability and fees at Sadiqabad Student Hostel.'
  );
  const { lang } = useI18n();

  useEffect(() => {
    const load = () => {
      hostelInfoService.get().then((info) => {
        if (info.phone) setPhone(info.phone);
        if (info.whatsapp) setWhatsapp(info.whatsapp);
      });
      settingsService.get().then((settings) => {
        const msg = pickLang(settings, 'whatsapp_message_template', lang);
        if (msg) setTemplate(msg);
      });
    };
    load();
    return mockStore.subscribe(load);
  }, [lang]);

  const waLink = generateWhatsAppLink(whatsapp, template);
  const telLink = `tel:${phone.replace(/[^0-9+]/g, '')}`;

  return (
    <div className="fixed bottom-4 right-4 z-40 flex items-center gap-2.5 pointer-events-none">
      {/* Call button */}
      <a
        href={telLink}
        className="pointer-events-auto flex items-center justify-center w-11 h-11 bg-teal-700 hover:bg-teal-800 text-white rounded-full shadow-lg transition-transform duration-150 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-teal-500"
        aria-label="Call Hostel Directly"
        title="Call Hostel Directly"
      >
        <Phone className="w-5 h-5" />
      </a>

      {/* WhatsApp button */}
      <a
        href={waLink}
        target="_blank"
        rel="noopener noreferrer"
        className="pointer-events-auto flex items-center justify-center w-12 h-12 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full shadow-lg transition-transform duration-150 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        aria-label="Chat on WhatsApp"
        title="Chat on WhatsApp"
      >
        <MessageCircle className="w-6 h-6" />
      </a>
    </div>
  );
};
