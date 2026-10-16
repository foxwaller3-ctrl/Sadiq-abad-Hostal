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
  Phone
} from 'lucide-react';
import { inquiriesService } from '../../services/inquiriesService.ts';
import { roomsService } from '../../services/roomsService.ts';
import { mockStore } from '../../services/mockStore.ts';
import type { Inquiry, Room } from '../../types/index.ts';
import { useI18n } from '../../i18n/I18nContext.tsx';
import { generateWhatsAppLink } from '../../utils/helpers.ts';
import { Card } from '../../components/ui/Card.tsx';
import { Button } from '../../components/ui/Button.tsx';
import { Badge } from '../../components/ui/Badge.tsx';

export const Dashboard: React.FC = () => {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const { lang, t } = useI18n();

  const loadData = () => {
    inquiriesService.getAll().then(setInquiries);
    roomsService.getAll().then(setRooms);
  };

  useEffect(() => {
    loadData();
    return mockStore.subscribe(loadData);
  }, []);

  const newInquiries = inquiries.filter((i) => i.status === 'new');
  const totalBeds = rooms.reduce((acc, r) => acc + r.beds_total, 0);
  const availableBeds = rooms.reduce((acc, r) => acc + r.beds_available, 0);

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
            Real-time inquiries and capacity tracker for Sadiqabad Student Hostel
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link to="/admin/inquiries">
            <Button variant="accent" size="sm" icon={<Inbox className="w-4 h-4" />}>
              View All Inquiries ({inquiries.length})
            </Button>
          </Link>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <Card className="p-6 bg-white border-amber-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">
              New Inquiries
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
              <Inbox className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 mb-1">
            {newInquiries.length}
          </div>
          <span className="text-xs text-amber-700 font-medium">
            Requires follow-up call
          </span>
        </Card>

        <Card className="p-6 bg-white border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
              Total Inquiries
            </span>
            <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 mb-1">
            {inquiries.length}
          </div>
          <span className="text-xs text-slate-500 font-medium">
            Lifetime student inquiries
          </span>
        </Card>

        <Card className="p-6 bg-white border-teal-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-teal-800 uppercase tracking-wider">
              Available Beds
            </span>
            <div className="w-9 h-9 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold">
              <CheckCircle className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-teal-800 mb-1">
            {availableBeds}
          </div>
          <span className="text-xs text-teal-700 font-medium">
            Vacant for new admissions
          </span>
        </Card>

        <Card className="p-6 bg-white border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
              Total Beds
            </span>
            <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold">
              <Bed className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 mb-1">
            {totalBeds}
          </div>
          <span className="text-xs text-slate-500 font-medium">
            Across {rooms.length} room categories
          </span>
        </Card>
      </div>

      {/* Quick Actions Strip */}
      <div className="p-5 bg-white rounded-2xl border border-slate-200/90 shadow-2xs">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
          Quick Management Actions
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Link
            to="/admin/rooms"
            className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 hover:bg-teal-50 border border-slate-200 hover:border-teal-300 text-xs font-bold text-slate-800 transition"
          >
            <PlusCircle className="w-4 h-4 text-teal-700" />
            <span>Manage Rooms</span>
          </Link>

          <Link
            to="/admin/mess"
            className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 hover:bg-teal-50 border border-slate-200 hover:border-teal-300 text-xs font-bold text-slate-800 transition"
          >
            <Utensils className="w-4 h-4 text-amber-600" />
            <span>Update Mess Menu</span>
          </Link>

          <Link
            to="/admin/notices"
            className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 hover:bg-teal-50 border border-slate-200 hover:border-teal-300 text-xs font-bold text-slate-800 transition"
          >
            <Bell className="w-4 h-4 text-rose-600" />
            <span>Post Notice</span>
          </Link>

          <Link
            to="/admin/hostel-info"
            className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 hover:bg-teal-50 border border-slate-200 hover:border-teal-300 text-xs font-bold text-slate-800 transition"
          >
            <Building className="w-4 h-4 text-indigo-600" />
            <span>Edit Hostel Info</span>
          </Link>
        </div>
      </div>

      {/* Recent Inquiries Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-base text-slate-900">Recent Inquiries</h3>
            <span className="text-xs text-slate-500">
              Latest applications submitted by students and professionals
            </span>
          </div>
          <Link
            to="/admin/inquiries"
            className="text-xs font-bold text-teal-700 hover:text-teal-900 flex items-center gap-1"
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
              {inquiries.slice(0, 5).map((inq) => {
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
                    <td className="py-3 px-4 text-slate-500 font-mono whitespace-nowrap">
                      {dateFormatted}
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-bold text-slate-900 block">{inq.name}</span>
                      <span className="text-[11px] text-slate-500 capitalize">
                        {inq.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-700 whitespace-nowrap num-ltr">
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
                          title="Call Applicant"
                        >
                          <Phone className="w-3.5 h-3.5" />
                        </a>
                        <a
                          href={waLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 transition"
                          title="WhatsApp Applicant"
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
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
