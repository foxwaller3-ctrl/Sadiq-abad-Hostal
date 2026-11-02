import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Inbox,
  Bed,
  CheckCircle,
  Clock,
  PlusCircle,
  Utensils,
  Bell,
  Building,
  ArrowRight,
  MessageCircle,
  Phone,
  Image as ImageIcon,
  Settings,
  Database,
  RefreshCw,
  Images,
  ClipboardList
} from 'lucide-react';
import { inquiriesService } from '../../services/inquiriesService.ts';
import { roomsService } from '../../services/roomsService.ts';
import { bedAllocationService } from '../../services/bedAllocationService.ts';
import { hostelInfoService } from '../../services/hostelInfoService.ts';
import { syncRealisticDataToSupabase } from '../../services/supabaseSeedSync.ts';
import { mockStore } from '../../services/mockStore.ts';
import { normalizeImageUrl, generateWhatsAppLink } from '../../utils/helpers.ts';
import { buildCompleteBedRoster, computeBedReportSummary } from '../../utils/bedReport.ts';
import type { Inquiry, Room, HostelInfo, BedAllocation } from '../../types/index.ts';
import { useI18n } from '../../i18n/I18nContext.tsx';
import { Card } from '../../components/ui/Card.tsx';
import { Button } from '../../components/ui/Button.tsx';
import { Badge } from '../../components/ui/Badge.tsx';
import { useToast } from '../../components/ui/Toast.tsx';

export const Dashboard: React.FC = () => {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [bedAllocations, setBedAllocations] = useState<BedAllocation[]>([]);
  const [hostelInfo, setHostelInfo] = useState<HostelInfo | null>(null);
  const [syncing, setSyncing] = useState(false);
  const [syncStep, setSyncStep] = useState('');
  const { lang } = useI18n();
  const { toast } = useToast();

  const loadData = () => {
    inquiriesService.getAll().then(setInquiries);
    roomsService.getAll().then(setRooms);
    bedAllocationService.getAll().then(setBedAllocations);
    hostelInfoService.get().then(setHostelInfo);
  };

  useEffect(() => {
    loadData();
    const unsubInquiries = inquiriesService.subscribe(loadData);
    const unsubBeds = bedAllocationService.subscribe(loadData);
    const unsubMock = mockStore.subscribe(loadData);
    return () => {
      unsubInquiries();
      unsubBeds();
      unsubMock();
    };
  }, []);

  const handleSyncToSupabase = async () => {
    setSyncing(true);
    setSyncStep('Starting Supabase sync...');
    try {
      const result = await syncRealisticDataToSupabase((step) => setSyncStep(step));
      toast(result.summary, 'success');
      loadData();
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Supabase sync failed.', 'error');
    } finally {
      setSyncing(false);
      setSyncStep('');
    }
  };

  const newInquiries = inquiries.filter((i) => i.status === 'new');
  const bedSummary = computeBedReportSummary(buildCompleteBedRoster(rooms, bedAllocations));
  const totalBeds = bedSummary.totalBeds;
  const availableBeds = bedSummary.vacantBeds;

  const getStatusBadgeVariant = (status: Inquiry['status']) => {
    switch (status) {
      case 'new':
        return 'accent';
      case 'contacted':
        return 'primary';
      case 'booked':
        return 'success';
      case 'rejected':
        return 'danger';
    }
  };

  return (
    <div className="space-y-8 text-start">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            {lang === 'ur' ? 'ایڈمن ڈیش بورڈ' : 'Hostel Overview'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time inquiries, room inventory, and full website CMS for Sadiqabad Student Hostel
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link to="/admin/beds">
            <Button variant="primary" size="sm" icon={<ClipboardList className="w-4 h-4" />}>
              All Beds Report ({bedSummary.occupiedBeds}/{totalBeds})
            </Button>
          </Link>
          <Link to="/admin/hostel-info">
            <Button variant="outline" size="sm" icon={<ImageIcon className="w-4 h-4 text-teal-700" />}>
              Manage Logo
            </Button>
          </Link>
          <Link to="/admin/inquiries">
            <Button variant="accent" size="sm" icon={<Inbox className="w-4 h-4" />}>
              View All Inquiries ({inquiries.length})
            </Button>
          </Link>
        </div>
      </div>

      {/* Branding + One-Click Supabase Sync Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Active Branding / Logo Strip */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 p-1 flex items-center justify-center overflow-hidden shrink-0">
              <img
                src={normalizeImageUrl(hostelInfo?.logo_url) || '/logo.png'}
                alt="Official Logo"
                referrerPolicy="no-referrer"
                className="w-full h-full object-contain"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = '/logo.png';
                }}
              />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 text-xs">
                <span className="font-bold text-sm text-slate-900">
                  Official Hostel Logo
                </span>
                <span aria-hidden="true" className="text-slate-300">·</span>
                <span className="font-semibold text-emerald-700">Active</span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5 truncate max-w-xs">
                {hostelInfo?.logo_url || 'https://kommodo.ai/i/0IV3pZTemc49bUwLxmEI'}
              </p>
            </div>
          </div>
          <Link to="/admin/hostel-info" className="shrink-0">
            <Button variant="secondary" size="sm" icon={<Settings className="w-3.5 h-3.5" />}>
              Configure Logo
            </Button>
          </Link>
        </div>

        {/* One-Click Supabase Production Sync Card */}
        <div className="p-4 rounded-2xl bg-white border border-teal-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center shrink-0 mt-0.5">
              <Database className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <span className="font-bold text-sm text-slate-900 block">
                Supabase Database & Storage Sync
              </span>
              <p className="text-xs text-slate-500 mt-0.5 leading-snug">
                {syncing
                  ? syncStep
                  : 'Push authentic Sadiqabad room photos, student-friendly prices & menu directly into Supabase.'}
              </p>
            </div>
          </div>
          <Button
            variant="primary"
            size="sm"
            loading={syncing}
            icon={<RefreshCw className="w-3.5 h-3.5" />}
            onClick={handleSyncToSupabase}
            className="shrink-0"
          >
            {syncing ? 'Syncing...' : 'Sync Data to Supabase'}
          </Button>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <Card className="p-6 bg-white border-amber-200/80">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-amber-800">
              New Inquiries
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
              <Inbox className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 mb-1 tabular-nums">
            {newInquiries.length}
          </div>
          <span className="text-xs text-amber-700 font-medium">
            Requires follow-up call
          </span>
        </Card>

        <Card className="p-6 bg-white border-slate-200">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-600">
              Total Inquiries
            </span>
            <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 mb-1 tabular-nums">
            {inquiries.length}
          </div>
          <span className="text-xs text-slate-500 font-medium">
            Lifetime student inquiries
          </span>
        </Card>

        <Card className="p-6 bg-white border-teal-200/80">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-teal-800">
              Available Beds
            </span>
            <div className="w-9 h-9 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold">
              <CheckCircle className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-teal-800 mb-1 tabular-nums">
            {availableBeds}
          </div>
          <span className="text-xs text-teal-700 font-medium">
            Vacant for new admissions
          </span>
        </Card>

        <Card className="p-6 bg-white border-slate-200">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-600">
              Total Beds
            </span>
            <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold">
              <Bed className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 mb-1 tabular-nums">
            {totalBeds}
          </div>
          <span className="text-xs text-slate-500 font-medium tabular-nums">
            Across {rooms.length} room categories
          </span>
        </Card>
      </div>

      {/* Quick Actions Strip */}
      <div className="p-5 bg-white rounded-2xl border border-slate-200">
        <h3 className="text-xs font-bold text-slate-600 mb-3">
          Quick Content Management
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <Link
            to="/admin/beds"
            className="flex items-center gap-2.5 p-3 rounded-xl bg-teal-50/70 hover:bg-teal-100/70 border border-teal-200 text-xs font-bold text-teal-900 transition"
          >
            <ClipboardList className="w-4 h-4 text-teal-700 shrink-0" />
            <span>Beds Report & PDF</span>
          </Link>

          <Link
            to="/admin/rooms"
            className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 hover:bg-teal-50 border border-slate-200 hover:border-teal-300 text-xs font-bold text-slate-800 transition"
          >
            <PlusCircle className="w-4 h-4 text-teal-700 shrink-0" />
            <span>Rooms & Prices</span>
          </Link>

          <Link
            to="/admin/mess"
            className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 hover:bg-teal-50 border border-slate-200 hover:border-teal-300 text-xs font-bold text-slate-800 transition"
          >
            <Utensils className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Mess & Menu</span>
          </Link>

          <Link
            to="/admin/gallery"
            className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 hover:bg-teal-50 border border-slate-200 hover:border-teal-300 text-xs font-bold text-slate-800 transition"
          >
            <Images className="w-4 h-4 text-cyan-600 shrink-0" />
            <span>Photo Gallery</span>
          </Link>

          <Link
            to="/admin/notices"
            className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 hover:bg-teal-50 border border-slate-200 hover:border-teal-300 text-xs font-bold text-slate-800 transition"
          >
            <Bell className="w-4 h-4 text-rose-600 shrink-0" />
            <span>Post Notice</span>
          </Link>

          <Link
            to="/admin/hostel-info"
            className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 hover:bg-teal-50 border border-slate-200 hover:border-teal-300 text-xs font-bold text-slate-800 transition"
          >
            <Building className="w-4 h-4 text-indigo-600 shrink-0" />
            <span>Hostel Profile</span>
          </Link>
        </div>
      </div>

      {/* Recent Inquiries Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="p-5 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-base text-slate-900">Recent Inquiries</h3>
            <span className="text-xs text-slate-500">
              Latest room booking applications submitted by students and working professionals
            </span>
          </div>
          <Link
            to="/admin/inquiries"
            className="text-xs font-bold text-teal-700 hover:text-teal-900 flex items-center gap-1 whitespace-nowrap"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-start text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600">
                <th className="py-3 px-4 text-start font-semibold">Date</th>
                <th className="py-3 px-4 text-start font-semibold">Applicant</th>
                <th className="py-3 px-4 text-start font-semibold">Phone / WhatsApp</th>
                <th className="py-3 px-4 text-start font-semibold">Room & Mess</th>
                <th className="py-3 px-4 text-start font-semibold">Status</th>
                <th className="py-3 px-4 text-end font-semibold">Quick Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {inquiries.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500">
                    No student inquiries submitted yet.
                  </td>
                </tr>
              ) : (
                inquiries.slice(0, 5).map((inq) => {
                  const dateFormatted = new Date(inq.created_at).toLocaleDateString('en-PK', {
                    month: 'short',
                    day: 'numeric'
                  });
                  const waLink = generateWhatsAppLink(
                    inq.phone,
                    `Assalam o Alaikum ${inq.name}, thank you for inquiring about Sadiqabad Student Hostel.`
                  );

                  return (
                    <tr key={inq.id} className="hover:bg-slate-50/70 transition">
                      <td className="py-3 px-4 text-slate-500 font-mono whitespace-nowrap tabular-nums">
                        {dateFormatted}
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-bold text-slate-900 block">{inq.name}</span>
                        <span className="text-[11px] text-slate-500 capitalize">
                          {inq.category}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-700 whitespace-nowrap num-ltr tabular-nums">
                        {inq.phone}
                      </td>
                      <td className="py-3 px-4 text-slate-700">
                        <span className="capitalize font-medium block">
                          {inq.room_type || 'Any Room'}
                        </span>
                        <span className="text-[11px] text-slate-500">
                          {inq.wants_mess === true
                            ? 'With Mess'
                            : inq.wants_mess === false
                            ? 'No Mess'
                            : 'Mess Not Specified'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant={getStatusBadgeVariant(inq.status)}>
                          {inq.status.toUpperCase()}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-end whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <a
                            href={`tel:${inq.phone.replace(/[^0-9+]/g, '')}`}
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-teal-50 text-slate-700 hover:text-teal-700 transition"
                            aria-label={`Call ${inq.name}`}
                          >
                            <Phone className="w-3.5 h-3.5" />
                          </a>
                          <a
                            href={waLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 transition"
                            aria-label={`WhatsApp ${inq.name}`}
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                          </a>
                          <Link to="/admin/inquiries">
                            <Button variant="ghost" size="sm" className="text-xs py-1 px-2">
                              Manage
                            </Button>
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
