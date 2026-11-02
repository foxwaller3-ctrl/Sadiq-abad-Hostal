import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { BedRosterItem, HostelInfo } from '../types/index.ts';
import {
  computeBedReportSummary,
  formatDisplayDate,
  formatStayDuration,
  getTodayIsoDate
} from './bedReport.ts';
import { formatCurrency } from './helpers.ts';

/**
 * Strips non-ASCII characters so jsPDF built-in Helvetica font never prints garbled glyphs.
 */
function toPdfSafeAscii(value: string | null | undefined, fallback = '-'): string {
  if (!value) return fallback;
  const normalized = value
    .replace(/[·•]/g, '-')
    .replace(/[–—]/g, '-')
    .replace(/[^\x20-\x7E]/g, '')
    .trim();
  return normalized || fallback;
}

export interface GeneratedBedReportPdf {
  doc: jsPDF;
  blob: Blob;
  file: File;
  filename: string;
  sizeKb: number;
}

/**
 * Generates a real A4 Landscape PDF report containing hostel branding, summary KPIs,
 * and the complete bed-by-bed resident roster (who, when, days/months duration, rent & fee status).
 */
export function generateBedReportPdfArtifact(
  roster: BedRosterItem[],
  hostelInfo?: HostelInfo | null,
  filterLabel = 'All Rooms & Beds'
): GeneratedBedReportPdf {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4'
  });

  const summary = computeBedReportSummary(roster);
  const todayIso = getTodayIsoDate();
  const displayDate = formatDisplayDate(todayIso);
  const hostelName = toPdfSafeAscii(hostelInfo?.name_en, 'Sadiqabad Student Hostel');
  const address = toPdfSafeAscii(
    hostelInfo?.address_en,
    'Main College Road, Near Punjab College, Sadiqabad'
  );
  const phone = toPdfSafeAscii(hostelInfo?.phone, '0304-7861234');

  // Top Header Band (Teal #0f766e)
  doc.setFillColor(15, 118, 110);
  doc.rect(0, 0, 297, 26, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(15);
  doc.text(hostelName, 12, 11);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.text(`${address}  |  Contact: ${phone}`, 12, 18);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('ALL-BEDS OCCUPANCY & RESIDENT REPORT', 285, 11, { align: 'right' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.text(`Report Date: ${displayDate}  |  Scope: ${toPdfSafeAscii(filterLabel)}`, 285, 18, {
    align: 'right'
  });

  // KPI Summary Strip
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(12, 30, 273, 14, 2, 2, 'FD');

  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);

  const kpiItems = [
    `Total Beds: ${summary.totalBeds}`,
    `Occupied: ${summary.occupiedBeds} (${summary.occupancyRate}%)`,
    `Reserved: ${summary.reservedBeds}`,
    `Vacant: ${summary.vacantBeds}`,
    `Active Rent Roll: ${formatCurrency(summary.expectedMonthlyRevenue)}`,
    `Fees Paid: ${summary.paidCount} | Pending: ${summary.pendingCount}`
  ];
  doc.text(kpiItems.join('     |     '), 16, 38.8);

  // Table Rows
  const bodyRows = roster.map((item, idx) => {
    const a = item.allocation;
    const statusText = item.status.toUpperCase();
    const residentText = a
      ? `${toPdfSafeAscii(a.resident_name)}${a.cnic_or_id ? ` (${toPdfSafeAscii(a.cnic_or_id)})` : ''}`
      : 'Vacant - Available for Allotment';
    const categoryOrg = a
      ? `${a.resident_category === 'job_holder' ? 'Job' : 'Student'}${
          a.institution_or_workplace ? ` - ${toPdfSafeAscii(a.institution_or_workplace)}` : ''
        }`
      : '-';
    const phoneText = a ? toPdfSafeAscii(a.resident_phone) : '-';
    const checkInText = a ? formatDisplayDate(a.check_in_date) : '-';
    const durationText = a ? formatStayDuration(a.duration_value, a.duration_unit, 'en') : '-';
    const checkOutText = a ? formatDisplayDate(a.check_out_date) : '-';
    const rentFeeText = a
      ? `${formatCurrency(a.agreed_rent)} (${a.payment_status.toUpperCase()})`
      : `${formatCurrency(item.room.monthly_fee)}/mo`;

    return [
      String(idx + 1),
      `${toPdfSafeAscii(item.unit_label)} - Bed #${item.bed_number}`,
      toPdfSafeAscii(item.room.name_en),
      statusText,
      residentText,
      phoneText,
      categoryOrg,
      checkInText,
      durationText,
      checkOutText,
      rentFeeText
    ];
  });

  autoTable(doc, {
    startY: 48,
    margin: { left: 12, right: 12, bottom: 14 },
    head: [
      [
        '#',
        'Unit & Bed',
        'Room Category',
        'Status',
        'Resident (Kis Ny)',
        'Mobile',
        'College / Workplace',
        'Check-In (Kab)',
        'Duration',
        'Check-Out',
        'Rent & Fee'
      ]
    ],
    body: bodyRows,
    styles: {
      font: 'helvetica',
      fontSize: 7.5,
      cellPadding: 2.2,
      textColor: [30, 41, 59],
      lineColor: [226, 232, 240],
      lineWidth: 0.2
    },
    headStyles: {
      fillColor: [15, 23, 42],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 7.8
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252]
    },
    didParseCell: (hookData) => {
      if (hookData.section === 'body' && hookData.column.index === 3) {
        const raw = String(hookData.cell.raw || '');
        if (raw === 'OCCUPIED') {
          hookData.cell.styles.textColor = [15, 118, 110];
          hookData.cell.styles.fontStyle = 'bold';
        } else if (raw === 'VACANT') {
          hookData.cell.styles.textColor = [22, 163, 74];
          hookData.cell.styles.fontStyle = 'bold';
        } else if (raw === 'RESERVED') {
          hookData.cell.styles.textColor = [180, 83, 9];
          hookData.cell.styles.fontStyle = 'bold';
        } else {
          hookData.cell.styles.textColor = [100, 116, 139];
        }
      }
    },
    didDrawPage: (data) => {
      const pageCount = doc.getNumberOfPages();
      doc.setFontSize(7.5);
      doc.setTextColor(100, 116, 139);
      doc.text(
        `${hostelName} - Official Bed Occupancy & Resident Register`,
        12,
        203
      );
      doc.text(`Page ${data.pageNumber} of ${pageCount}`, 285, 203, { align: 'right' });
    }
  });

  const filename = `sadiqabad-hostel-beds-report-${todayIso}.pdf`;
  const blob = doc.output('blob');
  const file = new File([blob], filename, { type: 'application/pdf' });
  const sizeKb = Math.max(1, Math.round(blob.size / 1024));

  return { doc, blob, file, filename, sizeKb };
}

/**
 * Triggers a direct client-side download of a Blob without using window.open.
 */
export function triggerBlobDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}

export function downloadBedReportPdf(
  roster: BedRosterItem[],
  hostelInfo?: HostelInfo | null,
  filterLabel?: string
): GeneratedBedReportPdf {
  const artifact = generateBedReportPdfArtifact(roster, hostelInfo, filterLabel);
  triggerBlobDownload(artifact.blob, artifact.filename);
  return artifact;
}
