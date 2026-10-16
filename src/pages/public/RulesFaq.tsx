import React, { useState, useEffect } from 'react';
import { ShieldCheck, HelpCircle, MessageCircle, AlertTriangle } from 'lucide-react';
import { rulesService } from '../../services/rulesService.ts';
import { faqsService } from '../../services/faqsService.ts';
import { hostelInfoService } from '../../services/hostelInfoService.ts';
import type { Rule, Faq } from '../../types/index.ts';
import { useI18n } from '../../i18n/I18nContext.tsx';
import { pickLang, generateWhatsAppLink } from '../../utils/helpers.ts';
import { Accordion } from '../../components/ui/Accordion.tsx';
import { Button } from '../../components/ui/Button.tsx';
import { Card } from '../../components/ui/Card.tsx';
import { SeoHead } from '../../components/common/SeoHead.tsx';

export const RulesFaq: React.FC = () => {
  const { lang, t } = useI18n();
  const [rules, setRules] = useState<Rule[]>([]);
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [whatsapp, setWhatsapp] = useState('0300-1234567');

  useEffect(() => {
    rulesService.getPublished().then(setRules);
    faqsService.getPublished().then(setFaqs);
    hostelInfoService.get().then((info) => {
      if (info.whatsapp) setWhatsapp(info.whatsapp);
    });
  }, []);

  const accordionItems = faqs.map((faq) => ({
    id: faq.id,
    title: pickLang(faq, 'question', lang),
    content: pickLang(faq, 'answer', lang)
  }));

  const waLink = generateWhatsAppLink(
    whatsapp,
    lang === 'ur'
      ? 'السلام علیکم، مجھے ہاسٹل کے قواعد اور ایڈمشن کے حوالے سے کچھ معلومات درکار ہیں۔'
      : 'Assalam o Alaikum, I have questions regarding hostel rules and admission requirements.'
  );

  return (
    <div className="py-12 lg:py-16">
      <SeoHead
        title={lang === 'ur' ? 'ہاسٹل کے قواعد و ضوابط اور عمومی سوالات' : 'Rules & FAQ'}
        description={lang === 'ur' ? 'صادق آباد اسٹوڈنٹ ہاسٹل کا ضابطہ اخلاق اور اکثر پوچھے جانے والے سوالات' : 'Hostel code of conduct, gate timings, and answers to common resident questions.'}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-wider text-teal-700">
            {lang === 'ur' ? 'ڈسپلن اور رہنمائی' : 'Discipline & Policies'}
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-1">
            {t('rulesFaq.title')}
          </h1>
          <p className="mt-3 text-base text-slate-600">
            {t('rulesFaq.subtitle')}
          </p>
        </div>

        {/* Two Columns Grid: Rules on Left, FAQs on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-16 text-start">
          {/* Rules Section (lg:col-span-6) */}
          <div className="lg:col-span-6 space-y-6">
            <div className="flex items-center gap-3 pb-2 border-b border-slate-200">
              <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-800 flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  {t('rulesFaq.rulesTitle')}
                </h2>
                <span className="text-xs text-slate-500">
                  {lang === 'ur' ? 'تمام رہائشیوں کے لیے لازمی ضابطہ' : 'Mandatory code of conduct for all residents'}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              {rules.map((rule, idx) => (
                <div
                  key={rule.id}
                  className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex items-start gap-3 hover:border-teal-300 transition"
                >
                  <span className="w-7 h-7 rounded-lg bg-teal-700 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <p className="text-sm text-slate-700 leading-relaxed font-medium">
                    {pickLang(rule, 'text', lang)}
                  </p>
                </div>
              ))}
            </div>

            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200/80 text-xs text-amber-900 flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <span>
                {lang === 'ur'
                  ? 'ہاسٹل کے اصولوں کی خلاف ورزی پر سیکیورٹی ضبط یا فوری اخراج کا فیصلہ کیا جا سکتا ہے۔'
                  : 'Violation of core hostel discipline rules may result in forfeiture of deposit or expulsion.'}
              </span>
            </div>
          </div>

          {/* FAQs Section (lg:col-span-6) */}
          <div className="lg:col-span-6 space-y-6">
            <div className="flex items-center gap-3 pb-2 border-b border-slate-200">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center font-bold">
                <HelpCircle className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  {t('rulesFaq.faqTitle')}
                </h2>
                <span className="text-xs text-slate-500">
                  {lang === 'ur' ? 'والدین اور طلبہ کے اہم سوالات' : 'Helpful answers for parents and new residents'}
                </span>
              </div>
            </div>

            <Accordion items={accordionItems} defaultOpenId={faqs[0]?.id} />
          </div>
        </div>

        {/* WhatsApp Questions CTA */}
        <Card className="p-8 sm:p-10 bg-gradient-to-r from-teal-800 to-slate-900 text-white rounded-3xl text-center">
          <h3 className="text-2xl font-bold mb-2">
            {t('rulesFaq.moreQuestions')}
          </h3>
          <p className="text-sm text-teal-100 max-w-xl mx-auto mb-6">
            {lang === 'ur'
              ? 'اگر آپ کے پاس کوئی خاص سوال یا رہائشی ضرورت ہے تو بلا جھجھک واٹس ایپ پر ہاسٹل انتظامیہ سے رابطہ کریں۔'
              : 'Our administration team is available on WhatsApp daily to address your individual queries.'}
          </p>
          <a href={waLink} target="_blank" rel="noopener noreferrer">
            <Button variant="accent" size="lg" className="font-bold" icon={<MessageCircle className="w-5 h-5" />}>
              {t('rulesFaq.askWhatsApp')}
            </Button>
          </a>
        </Card>
      </div>
    </div>
  );
};
