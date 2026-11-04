import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Info,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  MessageCircle,
  LayoutGrid,
  Users,
  BedDouble,
  BedSingle,
  CalendarClock,
  RotateCcw,
  FileCheck2
} from 'lucide-react';
import { roomsService } from '../../services/roomsService.ts';
import { hostelInfoService } from '../../services/hostelInfoService.ts';
import { mockStore } from '../../services/mockStore.ts';
import type { Room } from '../../types/index.ts';
import { useI18n } from '../../i18n/I18nContext.tsx';
import {
  pickLang,
  formatCurrency,
  getAvailabilityStatus,
  getRoomImages,
  getRoomPrimaryImage,
  generateWhatsAppLink,
  ROOM_TYPE_DEFAULT_IMAGES
} from '../../utils/helpers.ts';
import { Button } from '../../components/ui/Button.tsx';
import { Card } from '../../components/ui/Card.tsx';
import { Modal } from '../../components/ui/Modal.tsx';
import { EmptyState } from '../../components/ui/States.tsx';
import { SeoHead } from '../../components/common/SeoHead.tsx';
import { AmenityIcon } from '../../components/common/SemanticIcon.tsx';

export const Rooms: React.FC = () => {
  const { lang, t } = useI18n();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [whatsapp, setWhatsapp] = useState('0304-7862410');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'asc' | 'desc'>('asc');
  const [activeModalRoom, setActiveModalRoom] = useState<Room | null>(null);
  const [modalImageIndex, setModalImageIndex] = useState(0);

  useEffect(() => {
    const load = () => {
      roomsService.getPublished().then(setRooms);
      hostelInfoService.get().then((info) => {
        if (info.whatsapp) setWhatsapp(info.whatsapp);
      });
    };
    load();
    return mockStore.subscribe(load);
  }, []);

  const filterOptions = [
    { id: 'all', label: t('rooms.filterAll'), Icon: LayoutGrid },
    { id: 'quad', label: t('rooms.filterQuad'), Icon: Users },
    { id: 'triple', label: t('rooms.filterTriple'), Icon: Users },
    { id: 'double', label: t('rooms.filterDouble'), Icon: BedDouble },
    { id: 'single', label: t('rooms.filterSingle'), Icon: BedSingle }
  ];

  const filteredRooms = rooms
    .filter((r) => {
      if (selectedType === 'all') return true;
      return r.room_type === selectedType;
    })
    .sort((a, b) => {
      return sortBy === 'asc'
        ? a.monthly_fee - b.monthly_fee
        : b.monthly_fee - a.monthly_fee;
    });

  const openRoomModal = (room: Room) => {
    setActiveModalRoom(room);
    setModalImageIndex(0);
  };

  const modalImages = activeModalRoom ? getRoomImages(activeModalRoom) : [];

  return (
    <div className="py-12 lg:py-16">
      <SeoHead
        title={lang === 'ur' ? 'کمرے اور ماہانہ فیس' : 'Rooms & Monthly Fees'}
        description={
          lang === 'ur'
            ? 'صادق آباد اسٹوڈنٹ ہاسٹل میں سنگل اور شیئرنگ کمروں کی مناسب ماہانہ فیس اور سہولیات'
            : 'Explore affordable single and shared student rooms with transparent monthly rent in Sadiqabad.'
        }
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="text-xs font-semibold text-teal-700">
            {lang === 'ur' ? 'رہائش کے اختیارات اور مناسب کرایہ' : 'Furnished Student Living Spaces'}
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-1">
            {t('rooms.title')}
          </h1>
          <p className="mt-3 text-base text-slate-600">
            {t('rooms.subtitle')}
          </p>
        </div>

        {/* Filter & Sort Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-white rounded-2xl border border-slate-200 mb-10">
          {/* Interactive Segmented Filter Controls */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl overflow-x-auto w-full sm:w-auto scrollbar-none">
            {filterOptions.map((opt) => {
              const TabIcon = opt.Icon;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setSelectedType(opt.id)}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs md:text-sm font-semibold rounded-lg transition duration-150 whitespace-nowrap shrink-0 cursor-pointer ${
                    selectedType === opt.id
                      ? 'bg-white text-slate-900 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <TabIcon className="w-3.5 h-3.5 shrink-0" />
                  <span>{opt.label}</span>
                </button>
              );
            })}
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end">
            <SlidersHorizontal className="w-4 h-4 text-slate-400" />
            <select
              aria-label="Sort rooms by monthly rent"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'asc' | 'desc')}
              className="text-xs md:text-sm font-medium bg-slate-50 border border-slate-300 rounded-xl px-3 py-1.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-700"
            >
              <option value="asc">{t('rooms.sortLowest')}</option>
              <option value="desc">{t('rooms.sortHighest')}</option>
            </select>
          </div>
        </div>

        {/* Rooms Grid */}
        {filteredRooms.length === 0 ? (
          <EmptyState
            title={t('rooms.empty')}
            action={{
              label: t('rooms.filterAll'),
              onClick: () => setSelectedType('all')
            }}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {filteredRooms.map((room) => {
              const avail = getAvailabilityStatus(room.beds_available);
              const roomName = pickLang(room, 'name', lang);
              const primaryImg = getRoomPrimaryImage(room);
              const fallbackImg =
                ROOM_TYPE_DEFAULT_IMAGES[room.room_type] || '/images/room-single.jpg';
              const statusColor =
                avail === 'available'
                  ? 'text-emerald-700'
                  : avail === 'limited'
                  ? 'text-amber-700'
                  : 'text-rose-700';
              const statusText =
                avail === 'available'
                  ? `${room.beds_available} ${t('rooms.bedsAvailable')}`
                  : avail === 'limited'
                  ? lang === 'en' && room.beds_available === 1
                    ? 'Only 1 bed left'
                    : `${t('rooms.only')} ${room.beds_available} ${t('rooms.bedsLeft')}`
                  : t('rooms.soldOut');

              return (
                <Card key={room.id} className="overflow-hidden flex flex-col justify-between hover-frame-shake" hoverable>
                  <div>
                    {/* Fixed aspect ratio 4:3 for distinct room photo */}
                    <div
                      onClick={() => openRoomModal(room)}
                      className="aspect-[4/3] w-full bg-slate-200 relative overflow-hidden group cursor-pointer"
                    >
                      <img
                        src={primaryImg}
                        alt={roomName}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                        onError={(e) => {
                          const target = e.currentTarget as HTMLImageElement;
                          if (!target.src.endsWith(fallbackImg)) {
                            target.src = fallbackImg;
                          }
                        }}
                      />
                    </div>

                    <div className="p-5 text-start">
                      <div className={`text-xs font-semibold mb-1 tabular-nums ${statusColor}`}>
                        {statusText} · {room.beds_total} {lang === 'ur' ? 'کل بیڈز' : 'Total Beds'}
                      </div>
                      <h3 className="font-bold text-lg text-slate-900 mb-1">{roomName}</h3>

                      <div className="flex items-baseline gap-1 mt-1 mb-4">
                        <span className="text-2xl font-extrabold text-teal-800 num-ltr tabular-nums">
                          {formatCurrency(room.monthly_fee)}
                        </span>
                        <span className="text-xs text-slate-500 font-medium">
                          {t('rooms.perMonth')}
                        </span>
                      </div>

                      {/* Key features */}
                      <div className="space-y-2 mb-4 text-xs text-slate-600">
                        {room.features.slice(0, 4).map((f, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <AmenityIcon
                              text={f.en || f.ur}
                              className="w-3.5 h-3.5 text-teal-700 shrink-0"
                            />
                            <span>{lang === 'ur' ? f.ur || f.en : f.en}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="p-5 pt-3 border-t border-slate-100 flex items-center gap-2">
                    <Link to={`/contact?room=${room.slug}#inquiry`} className="flex-1">
                      <Button variant="primary" size="sm" className="w-full whitespace-nowrap">
                        {t('rooms.inquireNow')}
                      </Button>
                    </Link>
                    <Button
                      variant="secondary"
                      size="sm"
                      className="whitespace-nowrap"
                      onClick={() => openRoomModal(room)}
                    >
                      {t('rooms.viewDetails')}
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        {/* Fee Policy Block */}
        <div id="fees" className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-10">
          <div className="flex items-center gap-3 mb-6 text-start">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold shrink-0">
              <Info className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900">
                {t('rooms.notesTitle')}
              </h3>
              <p className="text-xs text-slate-500">
                {lang === 'ur'
                  ? 'شفاف اور طالب علم دوست ہاسٹل فیس پالیسی'
                  : 'Transparent student-friendly rent and refundable security rules'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-start">
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="w-9 h-9 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center mb-3">
                <CalendarClock className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-teal-700 block mb-1">
                {lang === 'ur' ? '۰۱. ماہانہ ادائیگی کی تاریخ' : '01. Payment Window'}
              </span>
              <p className="text-sm text-slate-700 leading-relaxed">
                {t('rooms.note1')}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="w-9 h-9 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center mb-3">
                <RotateCcw className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-teal-700 block mb-1">
                {lang === 'ur' ? '۰۲. واپسی قابل سیکیورٹی' : '02. Refundable Security'}
              </span>
              <p className="text-sm text-slate-700 leading-relaxed">
                {t('rooms.note2')}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="w-9 h-9 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center mb-3">
                <FileCheck2 className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-teal-700 block mb-1">
                {lang === 'ur' ? '۰۳. داخلہ رجسٹریشن فیس' : '03. One-Time Registration'}
              </span>
              <p className="text-sm text-slate-700 leading-relaxed">
                {t('rooms.note3')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ROOM DETAIL MODAL */}
      {activeModalRoom && (
        <Modal
          isOpen={!!activeModalRoom}
          onClose={() => setActiveModalRoom(null)}
          title={pickLang(activeModalRoom, 'name', lang)}
          maxWidth="2xl"
          footer={
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-start">
              <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                <span className="text-lg font-extrabold text-teal-800 num-ltr tabular-nums">
                  {formatCurrency(activeModalRoom.monthly_fee)}
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  {t('rooms.perMonth')}
                </span>
                <span aria-hidden="true" className="text-slate-300">·</span>
                <span className="text-xs text-slate-600 tabular-nums">
                  <strong className="font-bold text-emerald-700">
                    {activeModalRoom.beds_available}
                  </strong>{' '}
                  {t('rooms.bedsAvailable')}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <a
                  href={generateWhatsAppLink(
                    whatsapp,
                    `Assalam o Alaikum, I want to book "${activeModalRoom.name_en}" (${formatCurrency(
                      activeModalRoom.monthly_fee
                    )}/mo) at Sadiqabad Student Hostel.`
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button
                    variant="outline"
                    size="sm"
                    className="whitespace-nowrap"
                    icon={<MessageCircle className="w-4 h-4 text-emerald-600" />}
                  >
                    {lang === 'ur' ? 'واٹس ایپ پر بک کریں' : 'Book via WhatsApp'}
                  </Button>
                </a>
                <Link
                  to={`/contact?room=${activeModalRoom.slug}#inquiry`}
                  onClick={() => setActiveModalRoom(null)}
                >
                  <Button variant="accent" size="sm" className="font-bold whitespace-nowrap">
                    {t('rooms.inquireNow')}
                  </Button>
                </Link>
              </div>
            </div>
          }
        >
          <div className="space-y-6 text-start">
            {/* Modal Image Gallery */}
            <div className="space-y-2.5">
              <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden bg-slate-900">
                <img
                  src={modalImages[modalImageIndex] || modalImages[0]}
                  alt={pickLang(activeModalRoom, 'name', lang)}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src =
                      ROOM_TYPE_DEFAULT_IMAGES[activeModalRoom.room_type] ||
                      '/images/room-single.jpg';
                  }}
                />
                {modalImages.length > 1 && (
                  <div className="absolute inset-x-3 bottom-3 flex items-center justify-between">
                    <button
                      type="button"
                      aria-label="Previous room photo"
                      onClick={() =>
                        setModalImageIndex((prev) =>
                          prev === 0 ? modalImages.length - 1 : prev - 1
                        )
                      }
                      className="p-1.5 rounded-full bg-slate-900/80 text-white hover:bg-slate-900 transition cursor-pointer"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <span className="text-xs bg-slate-900/80 text-white px-2.5 py-1 rounded-md font-mono tabular-nums">
                      {modalImageIndex + 1} / {modalImages.length}
                    </span>
                    <button
                      type="button"
                      aria-label="Next room photo"
                      onClick={() =>
                        setModalImageIndex((prev) =>
                          prev === modalImages.length - 1 ? 0 : prev + 1
                        )
                      }
                      className="p-1.5 rounded-full bg-slate-900/80 text-white hover:bg-slate-900 transition cursor-pointer"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </div>

              {/* Thumbnail Strip */}
              {modalImages.length > 1 && (
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {modalImages.map((imgUrl, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setModalImageIndex(idx)}
                      aria-label={`View photo ${idx + 1}`}
                      className={`w-20 aspect-[4/3] rounded-lg overflow-hidden border-2 shrink-0 cursor-pointer transition ${
                        modalImageIndex === idx
                          ? 'border-teal-700 ring-2 ring-teal-700/30'
                          : 'border-slate-200 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={imgUrl}
                        alt=""
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Description */}
            <p className="text-sm text-slate-600 leading-relaxed">
              {pickLang(activeModalRoom, 'description', lang)}
            </p>

            {/* Features List */}
            <div>
              <h4 className="font-bold text-sm text-slate-900 mb-3">
                {t('rooms.modalFeatures')}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
                {activeModalRoom.features.map((f, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-50 border border-slate-100"
                  >
                    <AmenityIcon
                      text={f.en || f.ur}
                      className="w-4 h-4 text-teal-700 shrink-0"
                    />
                    <span>{lang === 'ur' ? f.ur || f.en : f.en}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Detailed Fee Structure Table */}
            <div>
              <h4 className="font-bold text-sm text-slate-900 mb-3">
                {t('rooms.modalFeeStructure')}
              </h4>
              <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
                <div className="flex justify-between p-3 border-b border-slate-100 bg-slate-50">
                  <span className="text-slate-600">{t('rooms.modalMonthly')}</span>
                  <span className="font-bold text-slate-900 num-ltr tabular-nums">
                    {formatCurrency(activeModalRoom.monthly_fee)}
                  </span>
                </div>
                <div className="flex justify-between p-3 border-b border-slate-100">
                  <span className="text-slate-600">{t('rooms.modalRefundable')}</span>
                  <span className="font-bold text-slate-900 num-ltr tabular-nums">
                    {formatCurrency(activeModalRoom.security_deposit)}
                  </span>
                </div>
                <div className="flex justify-between p-3 border-b border-slate-100 bg-slate-50">
                  <span className="text-slate-600">{t('rooms.modalAdmission')}</span>
                  <span className="font-bold text-slate-900 num-ltr tabular-nums">
                    {formatCurrency(activeModalRoom.admission_fee)}
                  </span>
                </div>
                <div className="flex justify-between p-3 bg-teal-50 text-teal-900 font-extrabold text-sm">
                  <span>{t('rooms.modalTotalInitial')}</span>
                  <span className="num-ltr tabular-nums">
                    {formatCurrency(
                      activeModalRoom.monthly_fee +
                        activeModalRoom.security_deposit +
                        activeModalRoom.admission_fee
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
