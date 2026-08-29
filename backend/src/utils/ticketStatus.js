const allowedTransitions = {
  pending: ["acknowledged", "cancelled"],
  acknowledged: ["in_progress", "cancelled"],
  in_progress: ["completed"],
  completed: [],
  cancelled: []
}

function canChangeStatus(currentStatus, newStatus) {
  return (
    allowedTransitions[currentStatus]?.includes(newStatus)
  )
}

function formatTicketNumber(data) {

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
module.exports = {
  canChangeStatus,
  formatTicketNumber
}