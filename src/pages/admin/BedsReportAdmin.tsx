import React, { useState, useEffect, useMemo } from 'react';
import {
  BedDouble,
  UserPlus,
  UserCheck,
  DoorOpen,
  Wallet,
  FileDown,
  FileSpreadsheet,
  Printer,
  Share2,
  Search,
  Edit2,
  LogOut,
  Phone,
  MessageCircle,
  CheckCircle2,
  Clock,
  AlertCircle,
  Wrench,
  Copy,
  Check,
  Mail,
  RotateCcw,
  CalendarRange
} from 'lucide-react';
import { roomsService } from '../../services/roomsService.ts';
import { bedAllocationService } from '../../services/bedAllocationService.ts';
import { hostelInfoService } from '../../services/hostelInfoService.ts';
import { mockStore } from '../../services/mockStore.ts';
import type {
  BedAllocation,
  BedPaymentStatus,
  BedRosterItem,
  BedStatus,
  HostelInfo,
  ResidentCategory,
  Room,
  StayDurationUnit
} from '../../types/index.ts';
import {
  buildCompleteBedRoster,
  buildShareableReportText,
  computeBedReportSummary,
  computeCheckOutDate,
  defaultUnitLabelForRoom,
  formatDisplayDate,
  formatStayDuration,
  generateBedReportCsv,
  getStayRemainingInfo,
  getTodayIsoDate,
  validateBedAllocationInput
} from '../../utils/bedReport.ts';
import {
  downloadBedReportPdf,
  generateBedReportPdfArtifact,
  triggerBlobDownload,
  type GeneratedBedReportPdf
} from '../../utils/bedReportPdf.ts';
import {
  formatCurrency,
  generateWhatsAppLink,
  normalizeImageUrl,
  pickLang
} from '../../utils/helpers.ts';
import { useI18n } from '../../i18n/I18nContext.tsx';
import { Button } from '../../components/ui/Button.tsx';
import { Input } from '../../components/ui/Input.tsx';
import { Select } from '../../components/ui/Select.tsx';
import { Textarea } from '../../components/ui/Textarea.tsx';
import { Modal } from '../../components/ui/Modal.tsx';
import { useToast } from '../../components/ui/Toast.tsx';

interface BedFormState {
  id?: string;
  room_id: string;
  bed_number: number;
  unit_label: string;
  status: BedStatus;
  resident_name: string;
  resident_phone: string;
  cnic_or_id: string;
  resident_category: ResidentCategory;
  institution_or_workplace: string;
  check_in_date: string;
  duration_value: number;
  duration_unit: StayDurationUnit;
  check_out_date: string;
  agreed_rent: number;
  security_deposit: number;
  payment_status: BedPaymentStatus;
  notes: string;
}

const DURATION_PRESETS: { label: string; value: number; unit: StayDurationUnit }[] = [
  { label: '15 Days', value: 15, unit: 'days' },
  { label: '30 Days', value: 30, unit: 'days' },
  { label: '45 Days', value: 45, unit: 'days' },
  { label: '3 Months', value: 3, unit: 'months' },
  { label: '6 Months', value: 6, unit: 'months' },
  { label: '12 Months', value: 12, unit: 'months' }
];

export const BedsReportAdmin: React.FC = () => {
  const { lang } = useI18n();
  const { toast } = useToast();

  const [rooms, setRooms] = useState<Room[]>([]);
  const [allocations, setAllocations] = useState<BedAllocation[]>([]);
  const [hostelInfo, setHostelInfo] = useState<HostelInfo>(() => mockStore.hostelInfo);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | BedStatus>('all');
  const [roomFilter, setRoomFilter] = useState<string>('all');
  const [durationUnitFilter, setDurationUnitFilter] = useState<'all' | StayDurationUnit>('all');
  const [paymentFilter, setPaymentFilter] = useState<'all' | BedPaymentStatus>('all');

  // Edit / Assign Modal
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [formState, setFormState] = useState<BedFormState | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Vacate Confirmation Modal
  const [itemToVacate, setItemToVacate] = useState<BedRosterItem | null>(null);
  const [vacating, setVacating] = useState(false);

  // Share PDF Modal
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [sharePdfArtifact, setSharePdfArtifact] = useState<GeneratedBedReportPdf | null>(null);
  const [copiedSummary, setCopiedSummary] = useState(false);

  const loadAll = async () => {
    try {
      const [fetchedRooms, fetchedAllocations, fetchedInfo] = await Promise.all([
        roomsService.getAll(),
        bedAllocationService.getAll(),
        hostelInfoService.get()
      ]);
      setRooms(fetchedRooms);
      setAllocations(fetchedAllocations);
      setHostelInfo(fetchedInfo);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
    const unsubBeds = bedAllocationService.subscribe(loadAll);
    const unsubMock = mockStore.subscribe(loadAll);
    return () => {
      unsubBeds();
      unsubMock();
    };
  }, []);

  const fullRoster = useMemo(
    () => buildCompleteBedRoster(rooms, allocations),
    [rooms, allocations]
  );

  const overallSummary = useMemo(
    () => computeBedReportSummary(fullRoster),
    [fullRoster]
  );

  const filteredRoster = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return fullRoster.filter((item) => {
      if (statusFilter !== 'all' && item.status !== statusFilter) return false;
      if (roomFilter !== 'all' && item.room.id !== roomFilter && item.room.slug !== roomFilter) {
        return false;
      }
      if (durationUnitFilter !== 'all') {
        if (!item.allocation || item.allocation.duration_unit !== durationUnitFilter) {
          return false;
        }
      }
      if (paymentFilter !== 'all') {
        if (!item.allocation || item.allocation.payment_status !== paymentFilter) {
          return false;
        }
      }
      if (q) {
        const a = item.allocation;
        const haystack = [
          item.unit_label,
          `bed #${item.bed_number}`,
          `bed ${item.bed_number}`,
          item.room.name_en,
          item.room.name_ur,
          item.status,
          a?.resident_name || '',
          a?.resident_phone || '',
          a?.cnic_or_id || '',
          a?.institution_or_workplace || '',
          a?.notes || ''
        ]
          .join(' ')
          .toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }, [fullRoster, searchQuery, statusFilter, roomFilter, durationUnitFilter, paymentFilter]);

  const filteredSummary = useMemo(
    () => computeBedReportSummary(filteredRoster),
    [filteredRoster]
  );

  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    statusFilter !== 'all' ||
    roomFilter !== 'all' ||
    durationUnitFilter !== 'all' ||
    paymentFilter !== 'all';

  const activeScopeLabel = useMemo(() => {
    const parts: string[] = [];
    if (roomFilter !== 'all') {
      const matched = rooms.find((r) => r.id === roomFilter || r.slug === roomFilter);
      if (matched) parts.push(matched.name_en);
    }
    if (statusFilter !== 'all') parts.push(`Status: ${statusFilter}`);
    if (durationUnitFilter !== 'all') parts.push(`Unit: ${durationUnitFilter}`);
    if (paymentFilter !== 'all') parts.push(`Fee: ${paymentFilter}`);
    return parts.length > 0 ? parts.join(' | ') : 'All Rooms & Beds';
  }, [roomFilter, statusFilter, durationUnitFilter, paymentFilter, rooms]);

  const resetFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setRoomFilter('all');
    setDurationUnitFilter('all');
    setPaymentFilter('all');
  };

  const openModalForBed = (item: BedRosterItem) => {
    const a = item.allocation;
    const today = getTodayIsoDate();
    const defaultDurationVal = a ? a.duration_value : 6;
    const defaultDurationUnit: StayDurationUnit = a ? a.duration_unit : 'months';
    const checkIn = a ? a.check_in_date : today;
    const checkOut = a
      ? a.check_out_date
      : computeCheckOutDate(checkIn, defaultDurationVal, defaultDurationUnit);

    setFormErrors({});
    setFormState({
      id: a?.id,
      room_id: item.room.id,
      bed_number: item.bed_number,
      unit_label: item.unit_label || defaultUnitLabelForRoom(item.room),
      status: a ? item.status : 'occupied',
      resident_name: a?.resident_name || '',
      resident_phone: a?.resident_phone || '',
      cnic_or_id: a?.cnic_or_id || '',
      resident_category: a?.resident_category || 'student',
      institution_or_workplace: a?.institution_or_workplace || '',
      check_in_date: checkIn,
      duration_value: defaultDurationVal,
      duration_unit: defaultDurationUnit,
      check_out_date: checkOut,
      agreed_rent: a ? a.agreed_rent : item.room.monthly_fee,
      security_deposit: a ? a.security_deposit : item.room.security_deposit,
      payment_status: a?.payment_status || 'paid',
      notes: a?.notes || ''
    });
    setIsEditModalOpen(true);
  };

  const handleOpenQuickAssign = () => {
    const firstVacant = fullRoster.find((r) => r.status === 'vacant') || fullRoster[0];
    if (!firstVacant) {
      toast('Please create at least one room before assigning beds.', 'error');
      return;
    }
    openModalForBed(firstVacant);
  };

  const handleRoomSelectionChange = (newRoomId: string) => {
    if (!formState) return;
    const selectedRoom = rooms.find((r) => r.id === newRoomId);
    if (!selectedRoom) return;
    const vacantInRoom = fullRoster.find(
      (item) => item.room.id === selectedRoom.id && item.status === 'vacant'
    );
    const targetBedNum = vacantInRoom ? vacantInRoom.bed_number : 1;
    const existingItem = fullRoster.find(
      (item) => item.room.id === selectedRoom.id && item.bed_number === targetBedNum
    );
    if (existingItem) {
      openModalForBed(existingItem);
    } else {
      setFormState({
        ...formState,
        room_id: selectedRoom.id,
        bed_number: 1,
        unit_label: defaultUnitLabelForRoom(selectedRoom),
        agreed_rent: selectedRoom.monthly_fee,
        security_deposit: selectedRoom.security_deposit
      });
    }
  };

  const handleBedNumberChange = (nextBedNum: number) => {
    if (!formState) return;
    const matchingItem = fullRoster.find(
      (item) => item.room.id === formState.room_id && item.bed_number === nextBedNum
    );
    if (matchingItem && matchingItem.allocation) {
      openModalForBed(matchingItem);
      return;
    }
    setFormState({
      ...formState,
      bed_number: nextBedNum
    });
  };

  const updateTimingFields = (
    nextCheckIn: string,
    nextDurationVal: number,
    nextDurationUnit: StayDurationUnit
  ) => {
    if (!formState) return;
    const computedOut = computeCheckOutDate(nextCheckIn, nextDurationVal, nextDurationUnit);
    setFormState({
      ...formState,
      check_in_date: nextCheckIn,
      duration_value: nextDurationVal,
      duration_unit: nextDurationUnit,
      check_out_date: computedOut || formState.check_out_date
    });
  };

  const handleSaveAllocation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState) return;

    const targetRoom = rooms.find((r) => r.id === formState.room_id);
    if (!targetRoom) {
      setFormErrors({ room_id: 'Please select a valid room.' });
      return;
    }

    if (formState.status === 'vacant') {
      setSaving(true);
      try {
        await bedAllocationService.vacateBed(targetRoom, formState.bed_number);
        toast(
          `${formState.unit_label} · Bed #${formState.bed_number} marked vacant.`,
          'info'
        );
        setIsEditModalOpen(false);
        await loadAll();
      } catch (err) {
        toast(err instanceof Error ? err.message : 'Failed to update bed.', 'error');
      } finally {
        setSaving(false);
      }
      return;
    }

    const validationErrors = validateBedAllocationInput(formState);
    if (Object.keys(validationErrors).length > 0) {
      setFormErrors(validationErrors);
      return;
    }

    setSaving(true);
    try {
      await bedAllocationService.saveAllocation(formState, targetRoom);
      toast(
        `Saved ${formState.resident_name || 'bed'} for ${formState.unit_label} · Bed #${formState.bed_number}!`,
        'success'
      );
      setIsEditModalOpen(false);
      await loadAll();
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Failed to save bed allocation.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleConfirmVacate = async () => {
    if (!itemToVacate) return;
    setVacating(true);
    try {
      await bedAllocationService.vacateBed(itemToVacate.room, itemToVacate.bed_number);
      toast(
        `${itemToVacate.unit_label} · Bed #${itemToVacate.bed_number} vacated and available for new allotment.`,
        'info'
      );
      setItemToVacate(null);
      await loadAll();
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Failed to vacate bed.', 'error');
    } finally {
      setVacating(false);
    }
  };

  const handleDownloadPdf = () => {
    try {
      const artifact = downloadBedReportPdf(filteredRoster, hostelInfo, activeScopeLabel);
      toast(`Downloaded ${artifact.filename} (${artifact.sizeKb} KB)`, 'success');
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Could not generate PDF report.', 'error');
    }
  };

  const handleDownloadCsv = () => {
    try {
      const csv = generateBedReportCsv(filteredRoster);
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const filename = `sadiqabad-hostel-beds-report-${getTodayIsoDate()}.csv`;
      triggerBlobDownload(blob, filename);
      toast(`Downloaded ${filename}`, 'success');
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Could not export CSV.', 'error');
    }
  };

  const handlePrintReport = () => {
    window.print();
  };

  const handleOpenSharePdf = () => {
    try {
      const artifact = generateBedReportPdfArtifact(
        filteredRoster,
        hostelInfo,
        activeScopeLabel
      );
      setSharePdfArtifact(artifact);
      setCopiedSummary(false);
      setIsShareModalOpen(true);
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Could not prepare PDF for sharing.', 'error');
    }
  };

  const shareSummaryText = useMemo(
    () =>
      buildShareableReportText(
        filteredSummary,
        filteredRoster,
        hostelInfo?.name_en || 'Sadiqabad Student Hostel'
      ),
    [filteredSummary, filteredRoster, hostelInfo]
  );

  const canNativeSharePdfFile = useMemo(() => {
    if (!sharePdfArtifact || typeof navigator === 'undefined') return false;
    try {
      return (
        typeof navigator.share === 'function' &&
        typeof navigator.canShare === 'function' &&
        navigator.canShare({ files: [sharePdfArtifact.file] })
      );
    } catch {
      return false;
    }
  }, [sharePdfArtifact]);

  const handleNativeSystemSharePdf = async () => {
    if (!sharePdfArtifact) return;
    if (canNativeSharePdfFile) {
      try {
        await navigator.share({
          title: `${hostelInfo?.name_en || 'Sadiqabad Student Hostel'} — All Beds Report`,
          text: shareSummaryText,
          files: [sharePdfArtifact.file]
        });
        toast('PDF report shared successfully!', 'success');
        return;
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') return;
      }
    }
    triggerBlobDownload(sharePdfArtifact.blob, sharePdfArtifact.filename);
    toast(
      `PDF saved (${sharePdfArtifact.filename}). Attach it directly in WhatsApp or Email.`,
      'info'
    );
  };

  const handleCopyShareSummary = async () => {
    try {
      await navigator.clipboard.writeText(shareSummaryText);
      setCopiedSummary(true);
      toast('Report summary copied to clipboard!', 'success');
      setTimeout(() => setCopiedSummary(false), 2500);
    } catch {
      toast('Could not copy automatically. Please copy from the preview box.', 'error');
    }
  };

  const selectedModalRoom = formState
    ? rooms.find((r) => r.id === formState.room_id) || rooms[0]
    : null;

  return (
    <div className="space-y-6 text-start print-report-container">
      {/* PRINT-ONLY OFFICIAL HEADER */}
      <div className="hidden print-only-header border-b-2 border-slate-900 pb-4 mb-5">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img
              src={normalizeImageUrl(hostelInfo?.logo_url) || '/logo.png'}
              alt="Hostel Logo"
              className="w-12 h-12 object-contain"
            />
            <div>
              <div className="text-xl font-extrabold text-slate-900">
                {hostelInfo?.name_en || 'Sadiqabad Student Hostel'}
              </div>
              <p className="text-xs text-slate-600">
                {hostelInfo?.address_en || 'Main College Road, Near Punjab College, Sadiqabad'} · Tel:{' '}
                {hostelInfo?.phone || '0304-7862410'}
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm font-bold text-teal-800">
              Official All-Beds & Resident Register
            </div>
            <div className="text-xs text-slate-600 tabular-nums">
              Date: {formatDisplayDate(getTodayIsoDate())} · Scope: {activeScopeLabel}
            </div>
          </div>
        </div>
        <div className="mt-3 pt-3 border-t border-slate-200 flex flex-wrap items-center gap-6 text-xs font-semibold text-slate-800 tabular-nums">
          <span>Total Beds: {filteredSummary.totalBeds}</span>
          <span>Occupied: {filteredSummary.occupiedBeds} ({filteredSummary.occupancyRate}%)</span>
          <span>Reserved: {filteredSummary.reservedBeds}</span>
          <span>Vacant: {filteredSummary.vacantBeds}</span>
          <span>Active Monthly Rent Roll: {formatCurrency(filteredSummary.expectedMonthlyRevenue)}</span>
        </div>
      </div>

      {/* SCREEN TOP HEADER & REPORT ACTIONS */}
      <div className="no-print flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            {lang === 'ur'
              ? 'تمام بیڈز اور رہائشیوں کی مکمل رپورٹ'
              : 'All Beds & Resident Occupancy Report'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {lang === 'ur'
              ? 'کون سا بیڈ کس نے، کب اور کتنے دن یا مہینوں کے لیے لیا ہے — مکمل ریکارڈ، ترمیم، پرنٹ اور پی ڈی ایف شیئرنگ'
              : 'Track every bed across all rooms — who allotted it, check-in date, stay duration in days or months, edit records, print, or export & share PDF.'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <Button
            variant="primary"
            size="sm"
            onClick={handleOpenQuickAssign}
            icon={<UserPlus className="w-4 h-4" />}
            className="whitespace-nowrap shrink-0"
          >
            {lang === 'ur' ? 'بیڈ الاٹ کریں' : 'Assign Resident'}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownloadPdf}
            icon={<FileDown className="w-4 h-4" />}
            className="whitespace-nowrap shrink-0"
          >
            {lang === 'ur' ? 'پی ڈی ایف ڈاؤن لوڈ' : 'Download PDF'}
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={handleDownloadCsv}
            icon={<FileSpreadsheet className="w-4 h-4 text-emerald-700" />}
            className="whitespace-nowrap shrink-0"
          >
            CSV
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={handlePrintReport}
            icon={<Printer className="w-4 h-4 text-slate-700" />}
            className="whitespace-nowrap shrink-0"
          >
            {lang === 'ur' ? 'پرنٹ رپورٹ' : 'Print'}
          </Button>
          <Button
            variant="accent"
            size="sm"
            onClick={handleOpenSharePdf}
            icon={<Share2 className="w-4 h-4" />}
            className="whitespace-nowrap shrink-0"
          >
            {lang === 'ur' ? 'پی ڈی ایف شیئر کریں' : 'Share PDF'}
          </Button>
        </div>
      </div>

      {/* 4 KPI SUMMARY CARDS */}
      <div className="no-print grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-white rounded-2xl border border-slate-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-600">
              {lang === 'ur' ? 'کل بیڈز کی تعداد' : 'Total Hostel Beds'}
            </span>
            <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
              <BedDouble className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tabular-nums">
            {overallSummary.totalBeds}
          </div>
          <p className="text-xs text-slate-500 mt-1 tabular-nums">
            Across {rooms.length} room categories
          </p>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-teal-800">
              {lang === 'ur' ? 'آباد اور بک شدہ بیڈز' : 'Occupied & Reserved'}
            </span>
            <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-teal-800 tabular-nums">
            {overallSummary.occupiedBeds + overallSummary.reservedBeds}
          </div>
          <p className="text-xs text-slate-600 mt-1 tabular-nums">
            {overallSummary.occupancyRate}% occupancy · {overallSummary.occupiedBeds} active,{' '}
            {overallSummary.reservedBeds} reserved
          </p>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-emerald-800">
              {lang === 'ur' ? 'خالی دستیاب بیڈز' : 'Vacant Beds'}
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <DoorOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-700 tabular-nums">
            {overallSummary.vacantBeds}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Ready for immediate student allotment
          </p>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-amber-800">
              {lang === 'ur' ? 'ماہانہ فعال کرایہ' : 'Active Monthly Rent Roll'}
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 num-ltr tabular-nums">
            {formatCurrency(overallSummary.expectedMonthlyRevenue)}
          </div>
          <p className="text-xs text-slate-500 mt-1 tabular-nums">
            {overallSummary.paidCount} paid · {overallSummary.pendingCount} pending/partial
          </p>
        </div>
      </div>

      {/* INTERACTIVE ROOM-BY-ROOM VISUAL BED MAP */}
      {rooms.length > 0 && (
        <div className="no-print bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                {lang === 'ur'
                  ? 'کمروں کے لحاظ سے تمام بیڈز کا نقشہ (تبدیلی کے لیے کسی بھی بیڈ پر کلک کریں)'
                  : 'Room-by-Room Bed Map — Click Any Bed to Assign or Edit'}
              </h2>
              <p className="text-xs text-slate-500">
                Live visual overview of every bed across all hostel rooms
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600">
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-700" />
                <span>Occupied</span>
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-600" />
                <span>Reserved</span>
              </span>
              <span className="inline-flex items-center gap-1.5">
                <DoorOpen className="w-3.5 h-3.5 text-slate-500" />
                <span>Vacant</span>
              </span>
            </div>
          </div>

          <div className="divide-y divide-slate-100">
            {rooms.map((room, roomIdx) => {
              const roomBeds = fullRoster.filter((r) => r.room.id === room.id);
              const unitDefault = defaultUnitLabelForRoom(room, roomIdx);
              const occupiedInRoom = roomBeds.filter((b) => b.status !== 'vacant').length;

              return (
                <div key={room.id} className="py-3.5 first:pt-1 last:pb-1">
                  <div className="flex flex-wrap items-baseline justify-between gap-2 mb-2.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-mono font-semibold text-teal-800">
                        {unitDefault}
                      </span>
                      <span aria-hidden="true" className="text-slate-300">·</span>
                      <span className="text-sm font-bold text-slate-900">
                        {pickLang(room, 'name', lang)}
                      </span>
                      <span aria-hidden="true" className="text-slate-300">·</span>
                      <span className="text-xs text-slate-500 num-ltr tabular-nums">
                        {formatCurrency(room.monthly_fee)}/mo
                      </span>
                    </div>
                    <span className="text-xs text-slate-500 tabular-nums">
                      {occupiedInRoom} / {room.beds_total} beds allotted
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                    {roomBeds.map((bedItem) => {
                      const alloc = bedItem.allocation;
                      const isOccupied = bedItem.status === 'occupied';
                      const isReserved = bedItem.status === 'reserved';
                      const isMaint = bedItem.status === 'maintenance';

                      const tileStyles = isOccupied
                        ? 'border-teal-300 bg-teal-50/60 hover:bg-teal-50 text-slate-900'
                        : isReserved
                        ? 'border-amber-300 bg-amber-50/50 hover:bg-amber-50 text-slate-900'
                        : isMaint
                        ? 'border-slate-300 bg-slate-100 hover:bg-slate-200/70 text-slate-600'
                        : 'border-dashed border-slate-300 bg-slate-50/50 hover:border-teal-500 hover:bg-teal-50/30 text-slate-700';

                      return (
                        <button
                          key={bedItem.key}
                          type="button"
                          onClick={() => openModalForBed(bedItem)}
                          aria-label={
                            alloc
                              ? `Edit ${room.name_en} Bed ${bedItem.bed_number} (${alloc.resident_name})`
                              : `Assign ${room.name_en} Bed ${bedItem.bed_number} (Vacant)`
                          }
                          className={`p-3 rounded-xl border text-start transition cursor-pointer flex items-start justify-between gap-2 ${tileStyles}`}
                        >
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5 text-xs font-bold">
                              {isOccupied ? (
                                <CheckCircle2 className="w-3.5 h-3.5 text-teal-700 shrink-0" />
                              ) : isReserved ? (
                                <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                              ) : isMaint ? (
                                <Wrench className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                              ) : (
                                <DoorOpen className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                              )}
                              <span className="tabular-nums">Bed #{bedItem.bed_number}</span>
                            </div>

                            {alloc ? (
                              <>
                                <div className="text-xs font-bold text-slate-900 truncate mt-1">
                                  {alloc.resident_name}
                                </div>
                                <div className="text-[11px] text-slate-600 mt-0.5 tabular-nums">
                                  {formatStayDuration(alloc.duration_value, alloc.duration_unit, lang)} ·{' '}
                                  {formatDisplayDate(alloc.check_in_date)}
                                </div>
                              </>
                            ) : (
                              <div className="text-xs text-slate-600 font-medium mt-1">
                                {isMaint
                                  ? 'Under Maintenance'
                                  : lang === 'ur'
                                  ? 'خالی — الاٹ کرنے کے لیے کلک کریں'
                                  : 'Vacant — Click to Assign'}
                              </div>
                            )}
                          </div>
                          <Edit2 className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SEARCH & FILTER BAR */}
      <div className="no-print bg-white rounded-2xl border border-slate-200 p-4 space-y-3">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <label htmlFor="beds-report-search" className="sr-only">
              Search beds by resident name, phone, CNIC, college, or room
            </label>
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              id="beds-report-search"
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                lang === 'ur'
                  ? 'نام، فون نمبر، شناختی کارڈ، کالج یا کمرہ تلاش کریں...'
                  : 'Search resident name, mobile, CNIC, college/workplace, or room...'
              }
              className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-700/25 focus:border-teal-700"
            />
          </div>

          {/* Segmented Status Filter */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl overflow-x-auto scrollbar-none">
            {(
              [
                { id: 'all', label: `All (${fullRoster.length})` },
                { id: 'occupied', label: `Occupied (${overallSummary.occupiedBeds})` },
                { id: 'vacant', label: `Vacant (${overallSummary.vacantBeds})` },
                { id: 'reserved', label: `Reserved (${overallSummary.reservedBeds})` }
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setStatusFilter(tab.id)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition whitespace-nowrap shrink-0 cursor-pointer tabular-nums ${
                  statusFilter === tab.id
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Secondary Dropdown Filters */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100">
          <div className="flex flex-wrap items-center gap-2.5">
            <select
              aria-label="Filter by room category"
              value={roomFilter}
              onChange={(e) => setRoomFilter(e.target.value)}
              className="text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-700"
            >
              <option value="all">All Room Categories</option>
              {rooms.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name_en}
                </option>
              ))}
            </select>

            <select
              aria-label="Filter by stay duration unit"
              value={durationUnitFilter}
              onChange={(e) => setDurationUnitFilter(e.target.value as 'all' | StayDurationUnit)}
              className="text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-700"
            >
              <option value="all">All Stay Durations (Days & Months)</option>
              <option value="months">Monthly Stays (Months)</option>
              <option value="days">Short / Daily Stays (Days)</option>
            </select>

            <select
              aria-label="Filter by fee payment status"
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value as 'all' | BedPaymentStatus)}
              className="text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-700"
            >
              <option value="all">All Fee Statuses</option>
              <option value="paid">Fee Paid</option>
              <option value="pending">Fee Pending</option>
              <option value="partial">Partial Payment</option>
            </select>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={resetFilters}
                className="inline-flex items-center gap-1 text-xs font-semibold text-teal-700 hover:text-teal-900 px-2 py-1 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Filters</span>
              </button>
            )}
          </div>

          <span className="text-xs text-slate-500 tabular-nums">
            Showing <strong>{filteredRoster.length}</strong> of {fullRoster.length} beds
          </span>
        </div>
      </div>

      {/* COMPLETE BED-BY-BED DATA TABLE */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden print-report-card">
        {loading ? (
          <div className="p-8 space-y-3">
            {[1, 2, 3, 4, 5].map((n) => (
              <div key={n} className="h-11 bg-slate-100 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : filteredRoster.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <p className="text-sm font-semibold text-slate-700">
              No beds match your current search or filter selection.
            </p>
            <Button variant="outline" size="sm" onClick={resetFilters}>
              Clear All Filters
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-start text-xs border-collapse print-report-table">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600">
                  <th className="py-3 px-4 text-start font-semibold whitespace-nowrap">
                    Bed & Status
                  </th>
                  <th className="py-3 px-4 text-start font-semibold min-w-[240px]">
                    {lang === 'ur'
                      ? 'رہائشی اور رابطہ نمبر (کس نے لیا)'
                      : 'Resident & Contact (Who)'}
                  </th>
                  <th className="py-3 px-3 text-start font-semibold whitespace-nowrap">
                    {lang === 'ur' ? 'تاریخ الاٹمنٹ (کب لیا)' : 'Check-In & Out (When)'}
                  </th>
                  <th className="py-3 px-3 text-start font-semibold whitespace-nowrap">
                    {lang === 'ur' ? 'مدت (کتنے دن / ماہ)' : 'Duration (Days / Months)'}
                  </th>
                  <th className="py-3 px-3 text-end font-semibold whitespace-nowrap">
                    Rent & Fee
                  </th>
                  <th className="py-3 px-4 text-end font-semibold whitespace-nowrap no-print">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRoster.map((item) => {
                  const a = item.allocation;
                  const stayInfo = a ? getStayRemainingInfo(a.check_out_date) : null;
                  const waLink = a
                    ? generateWhatsAppLink(
                        a.resident_phone,
                        `Assalam o Alaikum ${a.resident_name}, regarding your hostel bed (${item.unit_label} - Bed #${item.bed_number}) at Sadiqabad Student Hostel.`
                      )
                    : '';

                  return (
                    <tr
                      key={item.key}
                      className={`hover:bg-slate-50/80 transition ${
                        item.status === 'vacant' ? 'bg-slate-50/40' : ''
                      }`}
                    >
                      {/* Unit, Bed & Status */}
                      <td className="py-3 px-4 whitespace-nowrap align-top">
                        <div className="font-bold text-slate-900 tabular-nums">
                          {item.unit_label} · Bed #{item.bed_number}
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          {pickLang(item.room, 'name', lang)}
                        </div>
                        <div className="mt-1">
                          {item.status === 'occupied' ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-teal-800">
                              <CheckCircle2 className="w-3 h-3 text-teal-700 shrink-0" />
                              <span>{lang === 'ur' ? 'آباد' : 'Occupied'}</span>
                            </span>
                          ) : item.status === 'reserved' ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700">
                              <Clock className="w-3 h-3 text-amber-600 shrink-0" />
                              <span>{lang === 'ur' ? 'بک شدہ' : 'Reserved'}</span>
                            </span>
                          ) : item.status === 'maintenance' ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-600">
                              <Wrench className="w-3 h-3 text-slate-500 shrink-0" />
                              <span>Maintenance</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500">
                              <DoorOpen className="w-3 h-3 text-slate-400 shrink-0" />
                              <span>{lang === 'ur' ? 'خالی' : 'Vacant'}</span>
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Resident & Contact (Kis Ny) */}
                      <td className="py-3 px-4 align-top max-w-md">
                        {a ? (
                          <div className="space-y-0.5">
                            <div className="flex flex-wrap items-center gap-x-2.5 gap-y-0.5">
                              <span className="font-bold text-slate-900">{a.resident_name}</span>
                              <span className="inline-flex items-center gap-1">
                                <span className="font-mono text-slate-700 num-ltr tabular-nums">
                                  {a.resident_phone}
                                </span>
                                <a
                                  href={`tel:${a.resident_phone.replace(/[^0-9+]/g, '')}`}
                                  className="no-print p-0.5 rounded text-slate-400 hover:text-teal-700 hover:bg-slate-100 transition"
                                  aria-label={`Call ${a.resident_name}`}
                                >
                                  <Phone className="w-3.5 h-3.5" />
                                </a>
                                <a
                                  href={waLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="no-print p-0.5 rounded text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 transition"
                                  aria-label={`WhatsApp ${a.resident_name}`}
                                >
                                  <MessageCircle className="w-3.5 h-3.5" />
                                </a>
                              </span>
                            </div>
                            <div className="text-[11px] text-slate-600 leading-snug">
                              <span>
                                {a.resident_category === 'job_holder' ? 'Job Holder' : 'Student'}
                              </span>
                              {a.institution_or_workplace && (
                                <>
                                  <span aria-hidden="true"> · </span>
                                  <span>{a.institution_or_workplace}</span>
                                </>
                              )}
                              {a.cnic_or_id && (
                                <>
                                  <span aria-hidden="true"> · </span>
                                  <span className="font-mono tabular-nums">{a.cnic_or_id}</span>
                                </>
                              )}
                            </div>
                            {a.notes && (
                              <div className="text-[11px] text-slate-500 italic line-clamp-2">
                                Note: {a.notes}
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="text-slate-400">
                            {item.status === 'maintenance'
                              ? 'Temporarily blocked for maintenance'
                              : lang === 'ur'
                              ? 'نئے طالب علم کے لیے دستیاب ہے'
                              : 'Available for new student allotment'}
                          </span>
                        )}
                      </td>

                      {/* Check-In & Check-Out (Kab) */}
                      <td className="py-3 px-3 whitespace-nowrap align-top tabular-nums">
                        {a ? (
                          <div>
                            <div className="font-semibold text-slate-900">
                              In: {formatDisplayDate(a.check_in_date)}
                            </div>
                            <div className="text-[11px] text-slate-500 mt-0.5">
                              Out: {formatDisplayDate(a.check_out_date)}
                            </div>
                          </div>
                        ) : (
                          <span className="text-slate-300">—</span>
                        )}
                      </td>

                      {/* Stay Duration (Kitny dinu ya month k ly) */}
                      <td className="py-3 px-3 whitespace-nowrap align-top tabular-nums">
                        {a ? (
                          <div>
                            <div className="font-bold text-slate-900 inline-flex items-center gap-1">
                              <CalendarRange className="w-3.5 h-3.5 text-teal-700 shrink-0" />
                              <span>
                                {formatStayDuration(a.duration_value, a.duration_unit, lang)}
                              </span>
                            </div>
                            {stayInfo && (
                              <div
                                className={`text-[11px] font-medium mt-0.5 ${
                                  stayInfo.state === 'expired'
                                    ? 'text-red-600'
                                    : stayInfo.state === 'expiring_soon'
                                    ? 'text-amber-700'
                                    : 'text-slate-500'
                                }`}
                              >
                                {lang === 'ur' ? stayInfo.labelUr : stayInfo.labelEn}
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="text-slate-300">—</span>
                        )}
                      </td>

                      {/* Rent & Fee Status */}
                      <td className="py-3 px-3 whitespace-nowrap text-end align-top tabular-nums">
                        {a ? (
                          <div className="flex flex-col items-end gap-0.5">
                            <span className="font-mono font-bold text-slate-900 num-ltr">
                              {formatCurrency(a.agreed_rent)}
                            </span>
                            <span
                              className={`text-[11px] font-semibold inline-flex items-center justify-end gap-1 ${
                                a.payment_status === 'paid'
                                  ? 'text-emerald-700'
                                  : a.payment_status === 'partial'
                                  ? 'text-amber-700'
                                  : 'text-red-600'
                              }`}
                            >
                              {a.payment_status === 'paid' ? (
                                <CheckCircle2 className="w-3 h-3" />
                              ) : (
                                <AlertCircle className="w-3 h-3" />
                              )}
                              <span className="capitalize">{a.payment_status}</span>
                            </span>
                          </div>
                        ) : (
                          <span className="font-mono text-slate-500 num-ltr">
                            {formatCurrency(item.room.monthly_fee)}/mo
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 whitespace-nowrap text-end align-top no-print">
                        {a ? (
                          <div className="inline-flex items-center justify-end gap-1">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openModalForBed(item)}
                              aria-label={`Edit ${item.unit_label} Bed ${item.bed_number}`}
                              icon={<Edit2 className="w-3.5 h-3.5" />}
                              className="py-1 px-2.5 text-xs whitespace-nowrap"
                            >
                              Edit
                            </Button>
                            <button
                              type="button"
                              onClick={() => setItemToVacate(item)}
                              aria-label={`Vacate ${item.unit_label} Bed ${item.bed_number}`}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition cursor-pointer"
                              title="Vacate Bed"
                            >
                              <LogOut className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openModalForBed(item)}
                            aria-label={`Assign ${item.unit_label} Bed ${item.bed_number}`}
                            icon={<UserPlus className="w-3.5 h-3.5" />}
                            className="py-1 px-2.5 text-xs whitespace-nowrap"
                          >
                            Assign Bed
                          </Button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* EDIT / ASSIGN BED ALLOCATION MODAL */}
      {formState && (
        <Modal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          title={
            formState.id
              ? `Edit Bed Record — ${formState.unit_label} · Bed #${formState.bed_number}`
              : `Assign Resident — ${formState.unit_label} · Bed #${formState.bed_number}`
          }
          maxWidth="2xl"
        >
          <form onSubmit={handleSaveAllocation} noValidate className="space-y-5 text-start">
            {/* Room, Bed Number, Door Label & Status */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <div className="sm:col-span-2">
                <Select
                  label="Room Category"
                  value={formState.room_id}
                  error={formErrors.room_id}
                  onChange={(e) => handleRoomSelectionChange(e.target.value)}
                >
                  {rooms.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name_en} ({formatCurrency(r.monthly_fee)}/mo)
                    </option>
                  ))}
                </Select>
              </div>

              <Select
                label="Bed Number"
                value={String(formState.bed_number)}
                onChange={(e) => handleBedNumberChange(Number(e.target.value) || 1)}
              >
                {Array.from(
                  { length: Math.max(1, selectedModalRoom?.beds_total || 1) },
                  (_, idx) => idx + 1
                ).map((num) => (
                  <option key={num} value={String(num)}>
                    Bed #{num}
                  </option>
                ))}
              </Select>

              <Input
                label="Room / Door Label"
                value={formState.unit_label}
                onChange={(e) =>
                  setFormState({ ...formState, unit_label: e.target.value })
                }
                placeholder="e.g. Room 101"
              />
            </div>

            {/* Occupancy Status */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Select
                label="Bed Occupancy Status"
                value={formState.status}
                onChange={(e) => {
                  setFormErrors({});
                  setFormState({
                    ...formState,
                    status: e.target.value as BedStatus
                  });
                }}
              >
                <option value="occupied">Occupied (Active Resident)</option>
                <option value="reserved">Reserved (Upcoming Move-In)</option>
                <option value="maintenance">Under Maintenance</option>
                <option value="vacant">Vacant (Clear Resident)</option>
              </Select>

              {(formState.status === 'occupied' || formState.status === 'reserved') && (
                <>
                  <Select
                    label="Resident Category"
                    value={formState.resident_category}
                    onChange={(e) =>
                      setFormState({
                        ...formState,
                        resident_category: e.target.value as ResidentCategory
                      })
                    }
                  >
                    <option value="student">College / University Student</option>
                    <option value="job_holder">Job Holder / Professional</option>
                  </Select>

                  <Input
                    label="CNIC / Student Roll No."
                    value={formState.cnic_or_id}
                    onChange={(e) =>
                      setFormState({ ...formState, cnic_or_id: e.target.value })
                    }
                    placeholder="e.g. 31304-1234567-1"
                  />
                </>
              )}
            </div>

            {(formState.status === 'occupied' || formState.status === 'reserved') && (
              <>
                {/* Resident Identity (Kis Ny) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Resident Full Name (Kis Ny)"
                    required
                    value={formState.resident_name}
                    error={formErrors.resident_name}
                    onChange={(e) => {
                      if (formErrors.resident_name) {
                        setFormErrors({ ...formErrors, resident_name: '' });
                      }
                      setFormState({ ...formState, resident_name: e.target.value });
                    }}
                    placeholder="e.g. Muhammad Usman Tariq"
                  />

                  <Input
                    label="Mobile / WhatsApp Number"
                    required
                    value={formState.resident_phone}
                    error={formErrors.resident_phone}
                    onChange={(e) => {
                      if (formErrors.resident_phone) {
                        setFormErrors({ ...formErrors, resident_phone: '' });
                      }
                      setFormState({ ...formState, resident_phone: e.target.value });
                    }}
                    placeholder="0304-7861234"
                  />
                </div>

                <Input
                  label="College, University, Academy or Workplace"
                  value={formState.institution_or_workplace}
                  onChange={(e) =>
                    setFormState({
                      ...formState,
                      institution_or_workplace: e.target.value
                    })
                  }
                  placeholder="e.g. Punjab Group of Colleges, Sadiqabad / Fauji Fertilizer (FFC)"
                />

                {/* Allotment Date & Stay Duration in Days or Months (Kab & Kitny Dinu ya Month k ly) */}
                <div className="p-4 rounded-xl bg-teal-50/40 border border-teal-200/70 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-xs font-bold text-slate-900">
                      Stay Schedule — Allotment Date (Kab) & Duration in Days or Months
                    </span>
                    <div className="flex flex-wrap items-center gap-1">
                      {DURATION_PRESETS.map((preset) => (
                        <button
                          key={preset.label}
                          type="button"
                          onClick={() =>
                            updateTimingFields(
                              formState.check_in_date,
                              preset.value,
                              preset.unit
                            )
                          }
                          className={`px-2 py-0.5 rounded-md text-[11px] font-semibold border transition cursor-pointer ${
                            formState.duration_value === preset.value &&
                            formState.duration_unit === preset.unit
                              ? 'bg-teal-700 text-white border-teal-700'
                              : 'bg-white text-slate-700 border-slate-200 hover:border-teal-600'
                          }`}
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                    <Input
                      type="date"
                      label="Check-In Date (Kab)"
                      required
                      value={formState.check_in_date}
                      error={formErrors.check_in_date}
                      onChange={(e) =>
                        updateTimingFields(
                          e.target.value,
                          formState.duration_value,
                          formState.duration_unit
                        )
                      }
                    />

                    <Input
                      type="number"
                      min={1}
                      label="Stay Duration"
                      required
                      value={formState.duration_value}
                      error={formErrors.duration_value}
                      onChange={(e) =>
                        updateTimingFields(
                          formState.check_in_date,
                          Math.max(1, parseInt(e.target.value, 10) || 1),
                          formState.duration_unit
                        )
                      }
                    />

                    <Select
                      label="Duration Unit"
                      value={formState.duration_unit}
                      onChange={(e) =>
                        updateTimingFields(
                          formState.check_in_date,
                          formState.duration_value,
                          e.target.value as StayDurationUnit
                        )
                      }
                    >
                      <option value="months">Months (ماہ)</option>
                      <option value="days">Days (دن)</option>
                    </Select>

                    <Input
                      type="date"
                      label="Check-Out Date"
                      value={formState.check_out_date}
                      onChange={(e) =>
                        setFormState({ ...formState, check_out_date: e.target.value })
                      }
                    />
                  </div>
                </div>

                {/* Rent & Payment Status */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Input
                    type="number"
                    min={0}
                    label="Agreed Rent (PKR)"
                    value={formState.agreed_rent}
                    error={formErrors.agreed_rent}
                    onChange={(e) =>
                      setFormState({
                        ...formState,
                        agreed_rent: Math.max(0, parseInt(e.target.value, 10) || 0)
                      })
                    }
                  />

                  <Input
                    type="number"
                    min={0}
                    label="Security Deposit (PKR)"
                    value={formState.security_deposit}
                    onChange={(e) =>
                      setFormState({
                        ...formState,
                        security_deposit: Math.max(0, parseInt(e.target.value, 10) || 0)
                      })
                    }
                  />

                  <Select
                    label="Fee Payment Status"
                    value={formState.payment_status}
                    onChange={(e) =>
                      setFormState({
                        ...formState,
                        payment_status: e.target.value as BedPaymentStatus
                      })
                    }
                  >
                    <option value="paid">Paid</option>
                    <option value="pending">Pending</option>
                    <option value="partial">Partial Payment</option>
                  </Select>
                </div>
              </>
            )}

            <Textarea
              label="Admin Remarks / Notes"
              rows={2}
              value={formState.notes}
              onChange={(e) => setFormState({ ...formState, notes: e.target.value })}
              placeholder="Optional notes (e.g. fee receipt #, parent phone, exam session details)..."
            />

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setIsEditModalOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" variant="primary" loading={saving}>
                Save Bed Record
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* VACATE CONFIRMATION MODAL */}
      {itemToVacate && (
        <Modal
          isOpen={!!itemToVacate}
          onClose={() => setItemToVacate(null)}
          title="Vacate Bed & Clear Allotment"
          maxWidth="sm"
        >
          <div className="space-y-4 text-start">
            <p className="text-sm text-slate-600 leading-relaxed">
              Mark{' '}
              <strong className="text-slate-900">
                {itemToVacate.unit_label} · Bed #{itemToVacate.bed_number}
              </strong>{' '}
              {itemToVacate.allocation ? (
                <>
                  (currently allotted to{' '}
                  <strong className="text-slate-900">
                    {itemToVacate.allocation.resident_name}
                  </strong>
                  )
                </>
              ) : null}{' '}
              as vacant? Room bed availability will automatically increase by 1.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="secondary" onClick={() => setItemToVacate(null)}>
                Cancel
              </Button>
              <Button variant="danger" loading={vacating} onClick={handleConfirmVacate}>
                Confirm Vacate Bed
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* SHARE PDF REPORT MODAL */}
      {sharePdfArtifact && (
        <Modal
          isOpen={isShareModalOpen}
          onClose={() => setIsShareModalOpen(false)}
          title="Share All-Beds Report in PDF"
          maxWidth="lg"
        >
          <div className="space-y-4 text-start">
            {/* Generated PDF File Card */}
            <div className="p-4 rounded-xl bg-teal-50/60 border border-teal-200 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="text-sm font-bold text-slate-900 truncate">
                  {sharePdfArtifact.filename}
                </div>
                <div className="text-xs text-slate-600 mt-0.5 tabular-nums">
                  Ready · {sharePdfArtifact.sizeKb} KB · Official A4 Landscape PDF ({filteredRoster.length}{' '}
                  beds)
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  triggerBlobDownload(sharePdfArtifact.blob, sharePdfArtifact.filename);
                  toast(`Downloaded ${sharePdfArtifact.filename}`, 'success');
                }}
                icon={<FileDown className="w-4 h-4" />}
                className="shrink-0 whitespace-nowrap"
              >
                Save PDF
              </Button>
            </div>

            {/* Primary Share Channels */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Button
                variant="primary"
                onClick={handleNativeSystemSharePdf}
                icon={<Share2 className="w-4 h-4" />}
                className="w-full whitespace-nowrap"
              >
                {canNativeSharePdfFile ? 'Share PDF File Now' : 'Download PDF to Share'}
              </Button>

              <a
                href={`https://wa.me/?text=${encodeURIComponent(shareSummaryText)}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  triggerBlobDownload(sharePdfArtifact.blob, sharePdfArtifact.filename);
                }}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 min-h-[44px] rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold transition whitespace-nowrap"
              >
                <MessageCircle className="w-4 h-4 shrink-0" />
                <span>Download PDF + WhatsApp</span>
              </a>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <a
                href={`mailto:?subject=${encodeURIComponent(
                  `${hostelInfo?.name_en || 'Sadiqabad Student Hostel'} - All Beds Report (${getTodayIsoDate()})`
                )}&body=${encodeURIComponent(shareSummaryText)}`}
                onClick={() => {
                  triggerBlobDownload(sharePdfArtifact.blob, sharePdfArtifact.filename);
                }}
                className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 text-xs font-semibold transition whitespace-nowrap"
              >
                <Mail className="w-4 h-4 text-teal-700 shrink-0" />
                <span>Download PDF + Email Report</span>
              </a>

              <button
                type="button"
                onClick={handleCopyShareSummary}
                className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 text-xs font-semibold transition cursor-pointer whitespace-nowrap"
              >
                {copiedSummary ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Summary Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-slate-600 shrink-0" />
                    <span>Copy Report Summary</span>
                  </>
                )}
              </button>
            </div>

            {/* Report Summary Preview */}
            <div>
              <span className="block text-xs font-semibold text-slate-700 mb-1.5">
                Report Summary Preview
              </span>
              <pre className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-700 font-mono whitespace-pre-wrap max-h-44 overflow-y-auto leading-relaxed">
                {shareSummaryText}
              </pre>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
