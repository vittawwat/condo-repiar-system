import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import {
  checkCategory,
  checkStatus,
  formatTicketNumber,
  formatDateTime,
  formatMoney,
} from "../utils/ticketUtils";
import "./TicketDetail.css";

// สถานะที่ยังยกเลิกได้เอง (ต้องตรงกับ allowedTransitions ฝั่ง backend: pending, acknowledged)
const CANCELLABLE_STATUSES = ["pending", "acknowledged"];

export default function TicketDetail() {
  const { ticket_id } = useParams();
  const navigate = useNavigate();

  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [cancelling, setCancelling] = useState(false);

  const token = localStorage.getItem("token");

  const fetchTicket = async () => {
    if (!token) {
      setError("กรุณา login");
      setLoading(false);
      return;
    }

    try {
      const res = await axios.get(`/api/tickets/my/${ticket_id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTicket(res.data.ticket);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "โหลดข้อมูลไม่สำเร็จ");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTicket();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ticket_id]);

  const handleCancel = async () => {
    if (!cancelReason.trim()) {
      alert("กรุณาระบุเหตุผลในการยกเลิก");
      return;
    }

    setCancelling(true);

    try {
      await axios.patch(
        `/api/tickets/my/${ticket_id}/cancel`,
        { reason: cancelReason },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("ยกเลิกรายการแจ้งซ่อมเรียบร้อย");
      setShowCancelModal(false);
      fetchTicket();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "ยกเลิกไม่สำเร็จ");
    } finally {
      setCancelling(false);
    }
  };

  if (loading) return <p className="ticket-detail-info">กำลังโหลด...</p>;
  if (error) return <p className="ticket-detail-info ticket-detail-error">{error}</p>;
  if (!ticket) return null;

  const canCancel = CANCELLABLE_STATUSES.includes(ticket.status);

  console.log(ticket);
  
  return (
    <div className="ticket-detail-page">
      <div className="ticket-detail-card">
        <button className="back-link" onClick={() => navigate("/my-tickets")}>
          ← กลับไปรายการแจ้งซ่อม
        </button>

        <div className="ticket-detail-top">
          <span className="ticket-detail-number">{formatTicketNumber(ticket.ticket_id)}</span>
          <span className={`ticket-detail-status status-${ticket.status}`}>
            {checkStatus(ticket.status)}
          </span>
        </div>

        <h1 className="ticket-detail-title">{ticket.title}</h1>
        <p className="ticket-detail-meta">
          {checkCategory(ticket.category)} · แจ้งเมื่อ {formatDateTime(ticket.create_at)}
        </p>

        <div className="ticket-detail-section">
          <div className="ticket-detail-label">รายละเอียดปัญหา</div>
          <p className="ticket-detail-text">{ticket.detail}</p>
        </div>

        {ticket.before_images?.length > 0 && (
          <div className="ticket-detail-images">
            {ticket.before_images.map((img, i) => (
              <img
                key={i}
                src={`/uploads/tickets/before/${img}`}
                alt={`รูปที่ ${i + 1}`}
                className="ticket-detail-image"
              />
            ))}
          </div>
        )}

        {ticket.technician_id && (
          <div className="ticket-detail-section">
            <div className="ticket-detail-label">ข้อมูลช่างที่จะเข้าซ่อม</div>

            <div className="technician-box">
              {ticket.technician_profile ? (
                <img
                  src={`/uploads/technicians/${ticket.technician_profile}`}
                  alt={ticket.technician_name}
                  className="technician-box-avatar"
                />
              ) : (
                <div className="technician-box-avatar technician-box-avatar--placeholder">
                  ช่าง
                </div>
              )}

              <div>
                <div className="technician-box-name">{ticket.technician_name}</div>
                {ticket.technician_skill && (
                  <div className="technician-box-skill">{ticket.technician_skill}</div>
                )}
                <div className="technician-box-phone">📞 {ticket.technician_phone}</div>
              </div>
            </div>

            {ticket.appointment_date && (
              <p className="ticket-detail-appointment">
                📅 นัดหมาย {formatDateTime(ticket.appointment_date)}
              </p>
            )}
          </div>
        )}

        {ticket.status === "completed" && (
          <div className="ticket-detail-section">
            <div className="ticket-detail-label">สรุปค่าใช้จ่าย</div>
            <p className="ticket-detail-text">
              ค่าใช้จ่าย: <strong>{formatMoney(ticket.total_cost)} บาท</strong>
            </p>
            <p className="ticket-detail-text">รายละเอียดการซ่อม: {ticket.reason}</p>
          </div>
        )}

        {ticket.status === "acknowledged" && ticket.appointment_status === "reschedule_requested" && (
          <p className="ticket-detail-note">
            📨 ส่งคำขอเปลี่ยนวันนัดแล้ว กำลังรอนิติตอบกลับ
          </p>
        )}

        {ticket.appointment_status === "confirmed" && !ticket.total_cost && ticket.appointment_date && (
          <button
            className="reschedule-btn"
            onClick={() => navigate(`/reschedule/${ticket.ticket_id}`)}
          >
            📅 ขอเปลี่ยนวันนัด
          </button>
        )}

        {canCancel && (
          <button className="cancel-ticket-btn" onClick={() => setShowCancelModal(true)}>
            ยกเลิกรายการแจ้งซ่อม
          </button>
        )}
      </div>

      {showCancelModal && (
        <div className="cancel-modal-overlay" onClick={() => setShowCancelModal(false)}>
          <div className="cancel-modal" onClick={(e) => e.stopPropagation()}>
            <h2>ยกเลิกรายการแจ้งซ่อม</h2>
            <p>กรุณาระบุเหตุผลที่ต้องการยกเลิก</p>

            <textarea
              rows="4"
              placeholder="เช่น แก้ปัญหาได้เองแล้ว"
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
            />

            <div className="cancel-modal-actions">
              <button
                className="cancel-modal-close-btn"
                onClick={() => setShowCancelModal(false)}
                disabled={cancelling}
              >
                ปิด
              </button>
              <button
                className="cancel-modal-confirm-btn"
                onClick={handleCancel}
                disabled={cancelling}
              >
                {cancelling ? "กำลังยกเลิก..." : "ยืนยันยกเลิก"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}