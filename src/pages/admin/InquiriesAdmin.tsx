import React, { useState, useEffect } from 'react';
import { inquiriesService } from '../../services/inquiriesService.ts';
import { mockStore } from '../../services/mockStore.ts';
import type { Inquiry, InquiryStatus } from '../../types/index.ts';
import { Button } from '../../components/ui/Button.tsx';
import { Textarea } from '../../components/ui/Textarea.tsx';
import { Badge } from '../../components/ui/Badge.tsx';
import { Modal } from '../../components/ui/Modal.tsx';
import { useToast } from '../../components/ui/Toast.tsx';
import { generateWhatsAppLink } from '../../utils/helpers.ts';
import {
  Search,
  Phone,
  MessageCircle,
  Trash2,
  Download,
  AlertTriangle
} from 'lucide-react';

export const InquiriesAdmin: React.FC = () => {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeInquiry, setActiveInquiry] = useState<Inquiry | null>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [savingNotes, setSavingNotes] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Inquiry | null>(null);
  const [deleting, setDeleting] = useState(false);
  const { toast } = useToast();

  const loadInquiries = () => {
    inquiriesService.getAll().then(setInquiries);
  };

  useEffect(() => {
    loadInquiries();
    const unsubRealtime = inquiriesService.subscribe(loadInquiries);
    const unsubMock = mockStore.subscribe(loadInquiries);
    return () => {
      unsubRealtime();
      unsubMock();
    };
  }, []);

  const filteredInquiries = inquiries.filter((inq) => {
    const matchesStatus =
      selectedStatus === 'all' ? true : inq.status === selectedStatus;
    const matchesSearch =
      inq.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inq.phone.includes(searchTerm);
    return matchesStatus && matchesSearch;
  });

  const handleOpenDetail = (inq: Inquiry) => {
    setActiveInquiry(inq);
    setAdminNotes(inq.admin_notes || '');
  };

  const handleUpdateStatus = async (status: InquiryStatus) => {
    if (!activeInquiry) return;
    try {
      const updated = await inquiriesService.updateStatus(activeInquiry.id, status);
      setActiveInquiry(updated);
      toast(`Status changed to ${status.toUpperCase()}!`, 'success');
      loadInquiries();
    } catch {
      toast('Failed to update status.', 'error');
    }
  };

  const handleSaveNotes = async () => {
    if (!activeInquiry) return;
    setSavingNotes(true);
    try {
      const updated = await inquiriesService.updateNotes(activeInquiry.id, adminNotes);
      setActiveInquiry(updated);
      toast('Admin notes saved.', 'success');
      loadInquiries();
    } catch {
      toast('Failed to save notes.', 'error');
    } finally {
      setSavingNotes(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await inquiriesService.remove(deleteTarget.id);
      toast('Inquiry record deleted.', 'info');
      if (activeInquiry?.id === deleteTarget.id) {
        setActiveInquiry(null);
      }
      setDeleteTarget(null);
      loadInquiries();
    } catch {
      toast('Failed to delete inquiry.', 'error');
    } finally {
      setDeleting(false);
    }
  };

  const handleExportCsv = () => {
    if (filteredInquiries.length === 0) {
      toast('No inquiries to export.', 'info');
      return;
    }

    const escapeCsv = (val: unknown) => {
      const str = String(val ?? '');
      return `"${str.replace(/"/g, '""')}"`;
    };

    const headers = [
      'Submitted At',
      'Applicant Name',
      'Phone',
      'Category',
      'Preferred Room',
      'Wants Mess',
      'Move-In Date',
      'Status',
      'Message',
      'Admin Notes'
    ];

    const rows = filteredInquiries.map((inq) => [
      new Date(inq.created_at).toISOString(),
      inq.name,
      inq.phone,
      inq.category,
      inq.room_type || 'Any',
      inq.wants_mess === true ? 'Yes' : inq.wants_mess === false ? 'No' : 'Unspecified',
      inq.move_in_date || '',
      inq.status,
      inq.message || '',
      inq.admin_notes || ''
    ]);

    const csvContent =
      '\uFEFF' +
      [headers.map(escapeCsv).join(','), ...rows.map((r) => r.map(escapeCsv).join(','))].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `sadiqabad-hostel-inquiries-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast(`Exported ${filteredInquiries.length} inquiries to CSV.`, 'success');
  };

  const getStatusBadge = (status: InquiryStatus) => {
    switch (status) {
      case 'new':
        return <Badge variant="accent">NEW</Badge>;
      case 'contacted':
        return <Badge variant="primary">CONTACTED</Badge>;
      case 'booked':
        return <Badge variant="success">BOOKED</Badge>;
      case 'rejected':
        return <Badge variant="danger">REJECTED</Badge>;
    }
  };

  return (
    <div className="space-y-6 text-start">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Admission Inquiries Management</h1>
          <p className="text-xs text-slate-500 mt-1">
            Track student applications, follow up via WhatsApp, export records, and manage booking statuses.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-amber-800 tabular-nums whitespace-nowrap">
            {inquiries.filter((i) => i.status === 'new').length} New Pending
          </span>
          <Button
            variant="outline"
            size="sm"
            icon={<Download className="w-4 h-4" />}
            onClick={handleExportCsv}
          >
            Download CSV
          </Button>
        </div>
      </div>

      {/* Filters and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-white rounded-2xl border border-slate-200">
        {/* Status Filter Controls */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl overflow-x-auto w-full sm:w-auto scrollbar-none">
          {['all', 'new', 'contacted', 'booked', 'rejected'].map((st) => (
            <button
              key={st}
              onClick={() => setSelectedStatus(st)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg capitalize whitespace-nowrap transition cursor-pointer tabular-nums ${
                selectedStatus === st
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {st} ({st === 'all' ? inquiries.length : inquiries.filter((i) => i.status === st).length})
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="w-full sm:w-64 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search name or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Search inquiries by name or phone"
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-700"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-start text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600">
                <th className="py-3 px-4 font-semibold">Date</th>
                <th className="py-3 px-4 font-semibold">Applicant</th>
                <th className="py-3 px-4 font-semibold">Phone / WhatsApp</th>
                <th className="py-3 px-4 font-semibold">Room & Mess</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 text-end font-semibold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredInquiries.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-slate-500">
                    No inquiries match your current filter.
                  </td>
                </tr>
              ) : (
                filteredInquiries.map((inq) => {
                  const dateStr = new Date(inq.created_at).toLocaleDateString('en-PK', {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  });

                  return (
                    <tr
                      key={inq.id}
                      onClick={() => handleOpenDetail(inq)}
                      className="hover:bg-teal-50/40 cursor-pointer transition"
                    >
                      <td className="py-3 px-4 font-mono text-slate-500 whitespace-nowrap tabular-nums">
                        {dateStr}
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
                        <span className="font-medium capitalize block">
                          {inq.room_type || 'Any Room'}
                        </span>
                        <span className="text-[11px] text-slate-500">
                          {inq.wants_mess === true
                            ? 'Mess: Yes'
                            : inq.wants_mess === false
                            ? 'Mess: No'
                            : 'Mess: N/A'}
                        </span>
                      </td>
                      <td className="py-3 px-4">{getStatusBadge(inq.status)}</td>
                      <td className="py-3 px-4 text-end whitespace-nowrap">
                        <Button variant="ghost" size="sm" className="text-xs">
                          Open Details
                        </Button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {activeInquiry && (
        <Modal
          isOpen={!!activeInquiry}
          onClose={() => setActiveInquiry(null)}
          title={`Inquiry from ${activeInquiry.name}`}
          maxWidth="lg"
        >
          <div className="space-y-5 text-start text-xs sm:text-sm">
            {/* Status and Timestamp */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="text-slate-500">Status:</span>
                {getStatusBadge(activeInquiry.status)}
              </div>
              <span className="text-slate-400 text-xs font-mono tabular-nums">
                {new Date(activeInquiry.created_at).toLocaleString()}
              </span>
            </div>

            {/* Applicant details */}
            <div className="grid grid-cols-2 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div>
                <span className="text-slate-500 block text-xs">Full Name</span>
                <span className="font-bold text-slate-900">{activeInquiry.name}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-xs">Mobile Number</span>
                <span className="font-bold text-slate-900 font-mono num-ltr tabular-nums">
                  {activeInquiry.phone}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block text-xs">Category</span>
                <span className="font-bold text-slate-900 capitalize">
                  {activeInquiry.category}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block text-xs">Expected Move-in</span>
                <span className="font-bold text-slate-900">
                  {activeInquiry.move_in_date || 'Immediate / Unspecified'}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block text-xs">Preferred Room</span>
                <span className="font-bold text-slate-900 capitalize">
                  {activeInquiry.room_type || 'Any Room'}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block text-xs">Wants Mess</span>
                <span className="font-bold text-slate-900">
                  {activeInquiry.wants_mess === true
                    ? 'Yes, required'
                    : activeInquiry.wants_mess === false
                    ? 'No, room only'
                    : 'Not specified'}
                </span>
              </div>
            </div>

            {/* Message */}
            {activeInquiry.message && (
              <div>
                <span className="font-semibold text-slate-700 block mb-1">
                  Applicant Message / Selected Room Notes:
                </span>
                <p className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-700">
                  "{activeInquiry.message}"
                </p>
              </div>
            )}

            {/* Quick Contact Actions */}
            <div className="pt-2 flex flex-wrap gap-2">
              <a
                href={`tel:${activeInquiry.phone.replace(/[^0-9+]/g, '')}`}
                className="flex-1"
              >
                <Button variant="primary" size="sm" className="w-full" icon={<Phone className="w-3.5 h-3.5" />}>
                  Call Directly
                </Button>
              </a>
              <a
                href={generateWhatsAppLink(
                  activeInquiry.phone,
                  `Assalam o Alaikum ${activeInquiry.name}, I am contacting you from Sadiqabad Student Hostel regarding your room booking inquiry.`
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1"
              >
                <Button variant="accent" size="sm" className="w-full" icon={<MessageCircle className="w-3.5 h-3.5" />}>
                  Chat WhatsApp
                </Button>
              </a>
            </div>

            {/* Status Change Buttons */}
            <div>
              <span className="font-semibold text-slate-700 block mb-2">Change Status:</span>
              <div className="flex flex-wrap gap-2">
                <Button
                  size="sm"
                  variant={activeInquiry.status === 'new' ? 'accent' : 'secondary'}
                  onClick={() => handleUpdateStatus('new')}
                >
                  New
                </Button>
                <Button
                  size="sm"
                  variant={activeInquiry.status === 'contacted' ? 'primary' : 'secondary'}
                  onClick={() => handleUpdateStatus('contacted')}
                >
                  Contacted
                </Button>
                <Button
                  size="sm"
                  variant={activeInquiry.status === 'booked' ? 'primary' : 'secondary'}
                  onClick={() => handleUpdateStatus('booked')}
                >
                  Booked / Admitted
                </Button>
                <Button
                  size="sm"
                  variant={activeInquiry.status === 'rejected' ? 'danger' : 'secondary'}
                  onClick={() => handleUpdateStatus('rejected')}
                >
                  Rejected
                </Button>
              </div>
            </div>

            {/* Admin Notes */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <Textarea
                label="Admin Internal Notes (Private)"
                placeholder="e.g. Called applicant, requested 2-Sharing room with college friend, visiting tomorrow..."
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                rows={2}
              />
              <div className="flex justify-between items-center">
                <button
                  type="button"
                  onClick={() => setDeleteTarget(activeInquiry)}
                  className="text-xs text-red-600 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Record</span>
                </button>
                <Button size="sm" variant="primary" loading={savingNotes} onClick={handleSaveNotes}>
                  Save Notes
                </Button>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <Modal
          isOpen={!!deleteTarget}
          onClose={() => setDeleteTarget(null)}
          title="Delete Inquiry Record"
          maxWidth="sm"
        >
          <div className="space-y-4 text-start">
            <div className="flex items-start gap-3 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-900">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                Permanently delete the inquiry record from <strong className="font-semibold">{deleteTarget.name}</strong> ({deleteTarget.phone})?
              </p>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="secondary" onClick={() => setDeleteTarget(null)}>
                Cancel
              </Button>
              <Button
                type="button"
                variant="danger"
                loading={deleting}
                onClick={handleConfirmDelete}
              >
                Delete Inquiry
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
