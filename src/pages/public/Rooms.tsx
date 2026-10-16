import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  CheckCircle,
  Info,
  SlidersHorizontal,
  Bed,
  Shield,
  ArrowRight,
  Sparkles,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { roomsService } from '../../services/roomsService.ts';
import type { Room, RoomType } from '../../types/index.ts';
import { useI18n } from '../../i18n/I18nContext.tsx';
import {
  pickLang,
  formatCurrency,
  getAvailabilityStatus
} from '../../utils/helpers.ts';
import { Button } from '../../components/ui/Button.tsx';
import { Badge } from '../../components/ui/Badge.tsx';
import { Card } from '../../components/ui/Card.tsx';
import { Modal } from '../../components/ui/Modal.tsx';
import { EmptyState } from '../../components/ui/States.tsx';
import { SeoHead } from '../../components/common/SeoHead.tsx';

export const Rooms: React.FC = () => {
  const { lang, t, dir } = useI18n();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [selectedType, setSelectedType] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'asc' | 'desc'>('asc');
  const [activeModalRoom, setActiveModalRoom] = useState<Room | null>(null);
  const [modalImageIndex, setModalImageIndex] = useState(0);

  useEffect(() => {
    roomsService.getPublished().then(setRooms);
  }, []);

  const filterOptions = [
    { id: 'all', label: t('rooms.filterAll') },
    { id: 'single', label: t('rooms.filterSingle') },
    { id: 'double', label: t('rooms.filterDouble') },
    { id: 'triple', label: t('rooms.filterTriple') },
    { id: 'quad', label: t('rooms.filterQuad') }
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

  return (
    <div className="py-12 lg:py-16">
      <SeoHead
        title={lang === 'ur' ? 'کمرے اور ماہانہ فیس' : 'Rooms & Monthly Fees'}
        description={lang === 'ur' ? 'صادق آباد اسٹوڈنٹ ہاسٹل میں سنگل اور شیئرنگ کمروں کی فیس اور سہولیات' : 'Explore single and shared student rooms with full fee breakdown in Sadiqabad.'}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-teal-700">
            {lang === 'ur' ? 'رہائش کے اختیارات' : 'Living Spaces'}
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-1">
            {t('rooms.title')}
          </h1>
          <p className="mt-3 text-base text-slate-600">
            {t('rooms.subtitle')}
          </p>
        </div>

        {/* Filter & Sort Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-white rounded-2xl border border-slate-200/90 shadow-2xs mb-10">
          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
            {filterOptions.map((opt) => (
              <button
                key={opt.id}
                onClick={() => setSelectedType(opt.id)}
                className={`px-3.5 py-1.5 text-xs md:text-sm font-semibold rounded-xl transition duration-150 whitespace-nowrap cursor-pointer ${
                  selectedType === opt.id
                    ? 'bg-teal-700 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end">
            <SlidersHorizontal className="w-4 h-4 text-slate-400" />
            <select
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
              const badgeVariant =
                avail === 'available' ? 'success' : avail === 'limited' ? 'warning' : 'danger';
              const badgeText =
                avail === 'available'
                  ? `${room.beds_available} ${t('rooms.bedsAvailable')}`
                  : avail === 'limited'
                  ? `${t('rooms.only')} ${room.beds_available} ${t('rooms.bedsLeft')}`
                  : t('rooms.soldOut');

              return (
                <Card key={room.id} className="overflow-hidden flex flex-col justify-between" hoverable>
                  <div>
                    {/* Fixed aspect ratio 4:3 for photo */}
                    <div className="aspect-[4/3] w-full bg-slate-200 relative overflow-hidden group">
                      <img
                        src={room.image_urls[0] || 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=600&q=80'}
                        alt={roomName}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                      />
                      <div className="absolute top-3 right-3">
                        <Badge variant={badgeVariant}>{badgeText}</Badge>
                      </div>
                    </div>

                    <div className="p-5 text-start">
                      <h3 className="font-bold text-lg text-slate-900 mb-1">{roomName}</h3>

                      <div className="flex items-baseline gap-1 mt-1 mb-4">
                        <span className="text-2xl font-extrabold text-teal-800 num-ltr">
                          {formatCurrency(room.monthly_fee)}
                        </span>
                        <span className="text-xs text-slate-500 font-medium">
                          {t('rooms.perMonth')}
                        </span>
                      </div>

                      {/* Key features */}
                      <div className="space-y-2 mb-4 text-xs text-slate-600">
                        {room.features.slice(0, 3).map((f, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <CheckCircle className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                            <span>{lang === 'ur' ? f.ur || f.en : f.en}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="p-5 pt-0 border-t border-slate-100 flex items-center gap-2">
                    <Link to={`/contact?room=${room.room_type}#inquiry`} className="flex-1">
                      <Button variant="primary" size="sm" className="w-full">
                        {t('rooms.inquireNow')}
                      </Button>
                    </Link>
                    <Button
                      variant="secondary"
                      size="sm"
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

        {/* Fee Policy Block (PRD 9.3) */}
        <div id="fees" className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-10 shadow-xs">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
              <Info className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900">
                {t('rooms.notesTitle')}
              </h3>
              <p className="text-xs text-slate-500">
                {lang === 'ur' ? 'شفاف اور واضح ہاسٹل فیس پالیسی' : 'Transparent hostel fee and security rules'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-start">
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-xs font-bold text-teal-700 uppercase tracking-wider block mb-1">
                {lang === 'ur' ? '۱. جمع کروانے کی تاریخ' : '1. Payment Window'}
              </span>
              <p className="text-sm text-slate-700 leading-relaxed">
                {t('rooms.note1')}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-xs font-bold text-teal-700 uppercase tracking-wider block mb-1">
                {lang === 'ur' ? '۲. سیکیورٹی ڈپازٹ' : '2. Security Deposit'}
              </span>
              <p className="text-sm text-slate-700 leading-relaxed">
                {t('rooms.note2')}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-xs font-bold text-teal-700 uppercase tracking-wider block mb-1">
                {lang === 'ur' ? '۳. داخلہ فیس' : '3. Registration Fee'}
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
        >
          <div className="space-y-6 text-start">
            {/* Modal Image Gallery */}
            <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden bg-slate-900">
              <img
                src={
                  activeModalRoom.image_urls[modalImageIndex] ||
                  activeModalRoom.image_urls[0] ||
                  'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80'
                }
                alt={pickLang(activeModalRoom, 'name', lang)}
                className="w-full h-full object-cover"
              />
              {activeModalRoom.image_urls.length > 1 && (
                <div className="absolute inset-x-3 bottom-3 flex items-center justify-between">
                  <button
                    onClick={() =>
                      setModalImageIndex((prev) =>
                        prev === 0 ? activeModalRoom.image_urls.length - 1 : prev - 1
                      )
                    }
                    className="p-1.5 rounded-full bg-slate-900/80 text-white hover:bg-slate-900 transition"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <span className="text-xs bg-slate-900/80 text-white px-2.5 py-1 rounded-full font-medium">
                    {modalImageIndex + 1} / {activeModalRoom.image_urls.length}
                  </span>
                  <button
                    onClick={() =>
                      setModalImageIndex((prev) =>
                        prev === activeModalRoom.image_urls.length - 1 ? 0 : prev + 1
                      )
                    }
                    className="p-1.5 rounded-full bg-slate-900/80 text-white hover:bg-slate-900 transition"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
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
                  <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 border border-slate-100">
                    <CheckCircle className="w-4 h-4 text-teal-600 shrink-0" />
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
                  <span className="font-bold text-slate-900 num-ltr">
                    {formatCurrency(activeModalRoom.monthly_fee)}
                  </span>
                </div>
                <div className="flex justify-between p-3 border-b border-slate-100">
                  <span className="text-slate-600">{t('rooms.modalRefundable')}</span>
                  <span className="font-bold text-slate-900 num-ltr">
                    {formatCurrency(activeModalRoom.security_deposit)}
                  </span>
                </div>
                <div className="flex justify-between p-3 border-b border-slate-100 bg-slate-50">
                  <span className="text-slate-600">{t('rooms.modalAdmission')}</span>
                  <span className="font-bold text-slate-900 num-ltr">
                    {formatCurrency(activeModalRoom.admission_fee)}
                  </span>
                </div>
                <div className="flex justify-between p-3 bg-teal-50 text-teal-900 font-extrabold text-sm">
                  <span>{t('rooms.modalTotalInitial')}</span>
                  <span className="num-ltr">
                    {formatCurrency(
                      activeModalRoom.monthly_fee +
                        activeModalRoom.security_deposit +
                        activeModalRoom.admission_fee
                    )}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
              <div className="text-xs text-slate-500">
                <span className="font-bold text-slate-700">{activeModalRoom.beds_available}</span> {t('rooms.bedsAvailable')}
              </div>
              <Link
                to={`/contact?room=${activeModalRoom.room_type}#inquiry`}
                onClick={() => setActiveModalRoom(null)}
              >
                <Button variant="accent" size="md" className="font-bold">
                  {t('rooms.inquireNow')}
                </Button>
              </Link>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
