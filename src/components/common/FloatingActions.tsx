import React, { useState, useEffect } from 'react';
import { Phone, MessageCircle } from 'lucide-react';
import { hostelInfoService } from '../../services/hostelInfoService.ts';
import { settingsService } from '../../services/settingsService.ts';
import { generateWhatsAppLink, pickLang } from '../../utils/helpers.ts';
import { useI18n } from '../../i18n/I18nContext.tsx';

export const FloatingActions: React.FC = () => {
  const [phone, setPhone] = useState('0300-1234567');
  const [whatsapp, setWhatsapp] = useState('0300-1234567');
  const [template, setTemplate] = useState('Assalam o Alaikum, I want to inquire about hostel admission.');
  const { lang } = useI18n();

  useEffect(() => {
    hostelInfoService.get().then((info) => {
      if (info.phone) setPhone(info.phone);
      if (info.whatsapp) setWhatsapp(info.whatsapp);
    });
    settingsService.get().then((settings) => {
      const msg = pickLang(settings, 'whatsapp_message_template', lang);
      if (msg) setTemplate(msg);
    });
  }, [lang]);

  const waLink = generateWhatsAppLink(whatsapp, template);
  const telLink = `tel:${phone.replace(/[^0-9+]/g, '')}`;

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-3 pointer-events-none">
      {/* Call button */}
      <a
        href={telLink}
        className="pointer-events-auto flex items-center justify-center w-12 h-12 bg-teal-700 hover:bg-teal-800 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95 group focus:outline-none focus:ring-2 focus:ring-teal-500"
        aria-label="Call Hostel Directly"
        title="Call Hostel Directly"
      >
        <Phone className="w-5 h-5 group-hover:rotate-12 transition-transform" />
      </a>

      {/* WhatsApp button */}
      <a
        href={waLink}
        target="_blank"
        rel="noopener noreferrer"
        className="pointer-events-auto flex items-center justify-center w-14 h-14 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full shadow-xl hover:shadow-2xl transition-all duration-200 hover:scale-105 active:scale-95 group focus:outline-none focus:ring-2 focus:ring-emerald-500 relative"
        aria-label="Chat on WhatsApp"
        title="Chat on WhatsApp"
      >
        <MessageCircle className="w-7 h-7 group-hover:scale-110 transition-transform" />
        <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-white"></span>
        </span>
      </a>
    </div>
  );
};
