export function checkCategory(category) {
  const map = {
    plumbing: "ประปา",
    electric: "ไฟฟ้า",
    aircon: "แอร์",
    other: "อื่นๆ"
  }

  return map[category] || category
}

export function checkStatus(status) {
  const map = {
    pending: "กำลังรอการรับเรื่อง",
    acknowledged: "รับเรื่องแล้ว",
    in_progress: "กำลังดำเนินการ",
    completed: "เสร็จสิ้น",
    cancelled: "ยกเลิก"
  }

  return map[status] || status
}

export function nextStatus(status) {
  const map = {
    pending: "รับเรื่อง",
    acknowledged: "นัดหมายช่าง",
    in_progress: "ปิดงาน",
    completed: "ดูรายระเอียด",
    cancelled: "ดูรายระเอียด"
  }

  return map[status] || status
}

export function countByStatus(tickets, status) {
  return tickets.filter(
    ticket => ticket.status === status
  ).length
}

export function formatTicketNumber(data) {

  // ถ้าส่งเป็น object
  if (typeof data === 'object' && data !== null) {

    const date = new Date(data.created_at);
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');

    return `T-${y}${m}-${String(data.ticket_id).padStart(4, '0')}`;
  }

  // ถ้าส่งเป็นเลข id อย่างเดียว
  return `T-${String(data).padStart(4, '0')}`;
}

// utils/formatDate.js
export function formatDateTime(dateString) {
    if (!dateString) return '-';

    const date = dateString.replace('T', ' ').replace('.000Z', '');

    const [datePart, timePart] = date.split(' ');
    const [year, month, day] = datePart.split('-');

    return `${day}/${month}/${Number(year) + 543} ${timePart}`;
}

export const formatDateOnly = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("th-TH", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
    });
};

/* =========================
   Money
========================= */

export function formatMoney(amount) {

    return Number(amount || 0).toLocaleString(
        "th-TH",
        {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }
    );
}
export function formatPrintDate() {
    const now = new Date();

    return now.toLocaleDateString("th-TH", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
    });
};