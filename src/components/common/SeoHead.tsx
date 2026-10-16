import { useEffect } from 'react';
import { useI18n } from '../../i18n/I18nContext.tsx';

export interface SeoHeadProps {
  title?: string;
  description?: string;
}

export const SeoHead: React.FC<SeoHeadProps> = ({ title, description }) => {
  const { lang, t } = useI18n();

  useEffect(() => {
    const defaultTitle =
      lang === 'ur'
        ? 'صادق آباد اسٹوڈنٹ ہاسٹل – کمرے، میس اور وائی فائی'
        : 'Sadiqabad Student Hostel – Rooms, Mess, WiFi & Security';

    const defaultDesc =
      lang === 'ur'
        ? 'صادق آباد میں سستے اور محفوظ ہاسٹل کمرے، میس اور وائی فائی کے ساتھ۔ فیس دیکھیں اور آج ہی بک کریں۔'
        : 'Affordable, safe student hostel rooms with mess and high-speed WiFi in Sadiqabad.';

    const pageTitle = title ? `${title} | Sadiqabad Hostel` : defaultTitle;
    document.title = pageTitle;

    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', description || defaultDesc);

    // Update OpenGraph
    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', pageTitle);

    let ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', description || defaultDesc);
  }, [title, description, lang, t]);

  return null;
};
