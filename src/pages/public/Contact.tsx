import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Phone,
  MessageCircle,
  Mail,
  MapPin,
  Clock,
  CheckCircle2,
  AlertCircle,
  Send
} from 'lucide-react';
import { hostelInfoService } from '../../services/hostelInfoService.ts';
import { roomsService } from '../../services/roomsService.ts';
import { inquiriesService } from '../../services/inquiriesService.ts';
import { mockStore } from '../../services/mockStore.ts';
import type { HostelInfo, Room, Inquiry } from '../../types/index.ts';
import { useI18n } from '../../i18n/I18nContext.tsx';
import {
  pickLang,
  formatCurrency,
  validatePakistaniPhone,
  generateWhatsAppLink,
  getRoomPrimaryImage,
  ROOM_TYPE_DEFAULT_IMAGES
} from '../../utils/helpers.ts';
import { Input } from '../../components/ui/Input.tsx';
import { Select } from '../../components/ui/Select.tsx';
import { Textarea } from '../../components/ui/Textarea.tsx';
import { Button } from '../../components/ui/Button.tsx';
import { Card } from '../../components/ui/Card.tsx';
import { SeoHead } from '../../components/common/SeoHead.tsx';

export const Contact: React.FC = () => {
  const { lang, t } = useI18n();
  const [searchParams] = useSearchParams();
  const queryRoom = searchParams.get('room') || '';

  const [hostelInfo, setHostelInfo] = useState<HostelInfo | null>(null);
  const [rooms, setRooms] = useState<Room[]>([]);

  // Form State (roomSelection holds room.slug or room.room_type)
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedRoomKey, setSelectedRoomKey] = useState<string>(queryRoom);
  const [wantsMess, setWantsMess] = useState<boolean | null>(true);
  const [moveInDate, setMoveInDate] = useState('');
  const [category, setCategory] = useState<'student' | 'job' | 'other'>('student');
  const [message, setMessage] = useState('');
  const [honeypot, setHoneypot] = useState('');

  // Status & Validation
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [submittedInquiry, setSubmittedInquiry] = useState<Inquiry | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    const load = () => {
      hostelInfoService.get().then(setHostelInfo);
      roomsService.getPublished().then((list) => {
        setRooms(list);
      });
    };
    load();
    return mockStore.subscribe(load);
  }, []);

  useEffect(() => {
    if (queryRoom) {
      setSelectedRoomKey(queryRoom);
    }
  }, [queryRoom]);

  // Match selected room by exact slug first, then fallback to room_type
  const selectedRoom: Room | undefined = rooms.find(
    (r) => r.slug === selectedRoomKey || r.room_type === selectedRoomKey
  );

  const validate = (): boolean => {
    const errs: Record<string, string> = {};

    if (!name.trim() || name.trim().length < 2) {
      errs.name =
        lang === 'ur'
          ? 'برائے مہربانی اپنا مکمل نام درج کریں (کم از کم ۲ حروف)'
          : 'Please enter your full name (minimum 2 characters).';
    }

    if (!phone.trim()) {
      errs.phone =
        lang === 'ur'
          ? 'موبائل نمبر لکھنا لازمی ہے'
          : 'Phone number is required.';
    } else if (!validatePakistaniPhone(phone)) {
      errs.phone =
        lang === 'ur'
          ? 'درست پاکستانی موبائل نمبر درج کریں (مثلاً: 0304-7862410)'
          : 'Please enter a valid Pakistani mobile number (e.g. 0304-7862410 or +92 304 7862410).';
    }

    if (message && message.length > 440) {
      errs.message =
        lang === 'ur'
          ? 'پیغام ۴۴۰ حروف سے زیادہ نہیں ہو سکتا'
          : 'Message cannot exceed 440 characters.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setSubmitError(null);

    try {
      const roomPrefix = selectedRoom
        ? `[Selected: ${selectedRoom.name_en} (${formatCurrency(selectedRoom.monthly_fee)}/mo)] `
        : '';
      const combinedMessage = `${roomPrefix}${message.trim()}`.trim().slice(0, 500);

      const created = await inquiriesService.create({
        name,
        phone,
        room_type: selectedRoom ? selectedRoom.room_type : undefined,
        wants_mess: wantsMess,
        move_in_date: moveInDate || undefined,
        category,
        message: combinedMessage || undefined,
        source_lang: lang,
        honeypot
      });

      setSubmittedInquiry(created);
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : t('contact.errorMsg')
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResetForm = () => {
    setName('');
    setPhone('');
    setSelectedRoomKey('');
    setWantsMess(true);
    setMoveInDate('');
    setCategory('student');
    setMessage('');
    setSubmittedInquiry(null);
    setErrors({});
  };

  const contactPhone = hostelInfo?.phone || '0304-7862410';
  const contactWhatsapp = hostelInfo?.whatsapp || '0304-7862410';
  const address = hostelInfo
    ? pickLang(hostelInfo, 'address', lang)
    : 'Main College Road, Near Punjab College, Sadiqabad, Punjab';
  const officeHours = hostelInfo
    ? pickLang(hostelInfo, 'office_hours', lang)
    : 'Daily 8:00 AM – 10:00 PM';
  const email = hostelInfo?.email || 'admissions@sadiqabadhostel.pk';

  const postSubmitWaMessage = `Assalam o Alaikum, I just submitted a room booking inquiry for Sadiqabad Student Hostel:
• Name: ${submittedInquiry?.name}
• Phone: ${submittedInquiry?.phone}
• Room: ${selectedRoom ? selectedRoom.name_en : submittedInquiry?.room_type || 'Any Available Room'}
• Category: ${submittedInquiry?.category}
• Move-in: ${submittedInquiry?.move_in_date || 'ASAP'}
Please confirm seat availability.`;

  const waFollowUpLink = generateWhatsAppLink(contactWhatsapp, postSubmitWaMessage);

  return (
    <div className="py-12 lg:py-16">
      <SeoHead
        title={lang === 'ur' ? 'رابطہ اور ہاسٹل بکنگ' : 'Contact & Book a Room'}
        description={
          lang === 'ur'
            ? 'صادق آباد اسٹوڈنٹ ہاسٹل میں داخلے اور کمرہ بک کرنے کے لیے آن لائن فارم'
            : 'Reserve your room in 60 seconds or connect directly with our warden on WhatsApp.'
        }
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-semibold text-teal-700">
            {lang === 'ur' ? 'فوری بکنگ و رابطہ' : 'Easy Room Reservation'}
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-1">
            {t('contact.title')}
          </h1>
          <p className="mt-3 text-base text-slate-600">
            {t('contact.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Contact Cards */}
          <div className="lg:col-span-5 space-y-6 text-start">
            <h2 className="text-xl font-bold text-slate-900 border-b border-slate-200 pb-3">
              {t('contact.infoTitle')}
            </h2>

            <div className="space-y-4">
              <Card className="p-5 flex items-start gap-4" hoverable>
                <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-slate-500 block">
                    {t('contact.phone')}
                  </span>
                  <a
                    href={`tel:${contactPhone.replace(/[^0-9+]/g, '')}`}
                    className="text-base font-bold text-slate-900 hover:text-teal-700 font-mono num-ltr tabular-nums"
                  >
                    {contactPhone}
                  </a>
                </div>
              </Card>

              <Card className="p-5 flex items-start gap-4" hoverable>
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-slate-500 block">
                    {t('contact.whatsapp')}
                  </span>
                  <a
                    href={generateWhatsAppLink(
                      contactWhatsapp,
                      'Assalam o Alaikum, I would like to inquire about booking a room at Sadiqabad Student Hostel.'
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-base font-bold text-slate-900 hover:text-emerald-700 font-mono num-ltr tabular-nums"
                  >
                    {contactWhatsapp}
                  </a>
                </div>
              </Card>

              <Card className="p-5 flex items-start gap-4" hoverable>
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-slate-500 block">
                    {t('contact.email')}
                  </span>
                  <a
                    href={`mailto:${email}`}
                    className="text-sm font-bold text-slate-900 hover:text-indigo-700"
                  >
                    {email}
                  </a>
                </div>
              </Card>

              <Card className="p-5 flex items-start gap-4" hoverable>
                <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-slate-500 block">
                    {t('contact.address')}
                  </span>
                  <p className="text-sm font-semibold text-slate-900 leading-snug">
                    {address}
                  </p>
                </div>
              </Card>

              <Card className="p-5 flex items-start gap-4" hoverable>
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-slate-500 block">
                    {t('contact.timing')}
                  </span>
                  <p className="text-sm font-semibold text-slate-900">
                    {officeHours}
                  </p>
                </div>
              </Card>
            </div>
          </div>

          {/* Right Column: Inquiry Form with id="inquiry" */}
          <div className="lg:col-span-7" id="inquiry">
            <Card className="p-6 sm:p-10 bg-white border border-slate-200">
              {submittedInquiry ? (
                /* Success State */
                <div className="text-center py-6 space-y-6">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900">
                      {t('contact.successTitle')}
                    </h3>
                    <p className="mt-2 text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                      {t('contact.successDesc')}
                    </p>
                  </div>

                  {/* Summary of submitted data */}
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs text-start space-y-1.5 max-w-sm mx-auto">
                    <div>
                      <span className="font-semibold text-slate-500">Name:</span>{' '}
                      <span className="font-bold text-slate-900">{submittedInquiry.name}</span>
                    </div>
                    <div>
                      <span className="font-semibold text-slate-500">Phone:</span>{' '}
                      <span className="font-mono num-ltr tabular-nums">{submittedInquiry.phone}</span>
                    </div>
                    {selectedRoom && (
                      <div>
                        <span className="font-semibold text-slate-500">Selected Room:</span>{' '}
                        <span className="font-bold text-teal-800">
                          {pickLang(selectedRoom, 'name', lang)} ({formatCurrency(selectedRoom.monthly_fee)}/mo)
                        </span>
                      </div>
                    )}
                    <div>
                      <span className="font-semibold text-slate-500">Category:</span>{' '}
                      <span className="capitalize">{submittedInquiry.category}</span>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                    <a
                      href={waFollowUpLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:w-auto"
                    >
                      <Button
                        variant="accent"
                        size="md"
                        className="w-full font-bold whitespace-nowrap"
                        icon={<MessageCircle className="w-4 h-4" />}
                      >
                        {t('contact.sendOnWhatsApp')}
                      </Button>
                    </a>
                    <Button
                      variant="secondary"
                      size="md"
                      onClick={handleResetForm}
                      className="w-full sm:w-auto whitespace-nowrap"
                    >
                      {t('contact.submitAnother')}
                    </Button>
                  </div>
                </div>
              ) : (
                /* Main Form */
                <form onSubmit={handleSubmit} noValidate className="space-y-5">
                  <div className="text-start pb-2 border-b border-slate-100">
                    <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
                      {t('contact.formTitle')}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-500 mt-1">
                      {t('contact.formSubtitle')}
                    </p>
                  </div>

                  {/* Selected Room Booking Summary Strip */}
                  {selectedRoom && (
                    <div className="p-3.5 rounded-xl bg-teal-50/70 border border-teal-200 flex items-center gap-3.5 text-start">
                      <img
                        src={getRoomPrimaryImage(selectedRoom)}
                        alt={pickLang(selectedRoom, 'name', lang)}
                        referrerPolicy="no-referrer"
                        className="w-20 h-14 rounded-lg object-cover border border-teal-200 shrink-0"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src =
                            ROOM_TYPE_DEFAULT_IMAGES[selectedRoom.room_type] ||
                            '/images/room-single.jpg';
                        }}
                      />
                      <div className="min-w-0 flex-1">
                        <div className="text-[11px] font-semibold text-teal-700">
                          {lang === 'ur' ? 'منتخب کردہ کمرہ' : 'Selected Room'} ·{' '}
                          <span className="tabular-nums">
                            {selectedRoom.beds_available} {t('rooms.bedsAvailable')}
                          </span>
                        </div>
                        <div className="font-bold text-sm text-slate-900 truncate">
                          {pickLang(selectedRoom, 'name', lang)}
                        </div>
                        <div className="text-xs text-slate-600 num-ltr tabular-nums">
                          <strong className="text-teal-800">{formatCurrency(selectedRoom.monthly_fee)}/mo</strong>{' '}
                          · Security: {formatCurrency(selectedRoom.security_deposit)} (Refundable)
                        </div>
                      </div>
                    </div>
                  )}

                  {submitError && (
                    <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2 text-start">
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
                      <span>{submitError}</span>
                    </div>
                  )}

                  {/* Honeypot field */}
                  <div className="hidden" aria-hidden="true">
                    <input
                      type="text"
                      name="website_url_check"
                      tabIndex={-1}
                      autoComplete="off"
                      value={honeypot}
                      onChange={(e) => setHoneypot(e.target.value)}
                    />
                  </div>

                  {/* Name and Phone Inputs */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label={t('contact.name')}
                      placeholder={t('contact.namePlaceholder')}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      error={errors.name}
                      required
                    />

                    <Input
                      label={t('contact.phoneLabel')}
                      placeholder="0304-7862410"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      error={errors.phone}
                      required
                    />
                  </div>

                  {/* Room Selection & Category */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Select
                      label={t('contact.roomType')}
                      value={selectedRoom ? selectedRoom.slug : selectedRoomKey}
                      onChange={(e) => setSelectedRoomKey(e.target.value)}
                    >
                      <option value="">{t('contact.selectRoom')}</option>
                      {rooms.map((r) => (
                        <option key={r.id} value={r.slug}>
                          {pickLang(r, 'name', lang)} — {formatCurrency(r.monthly_fee)}/mo
                        </option>
                      ))}
                    </Select>

                    <Select
                      label={t('contact.category')}
                      value={category}
                      onChange={(e) => setCategory(e.target.value as 'student' | 'job' | 'other')}
                      required
                    >
                      <option value="student">{t('contact.catStudent')}</option>
                      <option value="job">{t('contact.catJob')}</option>
                      <option value="other">{t('contact.catOther')}</option>
                    </Select>
                  </div>

                  {/* Mess Radio Selection & Move-in Date */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-start">
                    <div>
                      <span className="block text-sm font-semibold text-slate-800 mb-2">
                        {t('contact.wantsMess')}
                      </span>
                      <div className="flex items-center gap-4 pt-1">
                        <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                          <input
                            type="radio"
                            name="wantsMess"
                            checked={wantsMess === true}
                            onChange={() => setWantsMess(true)}
                            className="text-teal-700 focus:ring-teal-700"
                          />
                          <span>{t('contact.yes')}</span>
                        </label>
                        <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                          <input
                            type="radio"
                            name="wantsMess"
                            checked={wantsMess === false}
                            onChange={() => setWantsMess(false)}
                            className="text-teal-700 focus:ring-teal-700"
                          />
                          <span>{t('contact.no')}</span>
                        </label>
                      </div>
                    </div>

                    <Input
                      type="date"
                      label={t('contact.moveInDate')}
                      value={moveInDate}
                      onChange={(e) => setMoveInDate(e.target.value)}
                    />
                  </div>

                  {/* Optional Message */}
                  <Textarea
                    label={t('contact.message')}
                    placeholder={t('contact.messagePlaceholder')}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    error={errors.message}
                    helperText={
                      lang === 'ur'
                        ? 'اختیاری، اپنے کالج یا آمد کی تاریخ لکھ سکتے ہیں'
                        : 'Optional — mention your college, department, or preferred floor'
                    }
                    rows={3}
                  />

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    variant="accent"
                    size="lg"
                    loading={loading}
                    className="w-full font-bold"
                    icon={<Send className="w-4 h-4" />}
                  >
                    {loading ? t('contact.submitting') : t('contact.submit')}
                  </Button>
                </form>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
