// pages/Notifications.jsx
import { useEffect, useState } from 'react';
import axios from 'axios';
import './Notifications.css';
import {
  formatDateTime,
  formatTicketNumber
} from "../utils/ticketUtils";
import DateTimePicker from "../components/DateTimePicker";

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectDate, setRejectDate] = useState('');

  const fetchNotifications = async () => {
    try {
      const res = await axios.get('/api/notifications');
      setNotifications(res.data);
      console.log("notifications", res.data);

    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  // เปิด Popup ของปุ่มอนุมัติ
  const handleOpenApprove = (item) => {
    setSelectedNotification(item);
    setShowApproveModal(true);
  };

  // ปิด Popup ของปุ่มอนุมัติ
  const handleCloseApprove = () => {
    setShowApproveModal(false);
    setSelectedNotification(null);
  };

  // เปิด Popup ของปุ่มไม่อนุมัติ
  const handleOpenReject = (item) => {
    setSelectedNotification(item);
    setRejectDate('');
    setShowRejectModal(true);
  };

  // ปิด Popup ของปุ่มไม่อนุมัติ
  const handleCloseReject = () => {
    setShowRejectModal(false);
    setSelectedNotification(null);
    setRejectDate('');
  };

  // ยืนยันอนุมัติ
  const handleApprove = async () => {
    try {
      await axios.patch(
        `/api/notifications/${selectedNotification.request_id}/approve`
      );

      // เอารายการที่อนุมัติแล้วออกจาก pending
      setNotifications(prev =>
        prev.filter(
          item => item.request_id !== selectedNotification.request_id
        )
      );

      handleCloseApprove();
      alert("ยืนยันวันนัดใหม่สำเร็จ");
    } catch (err) {
      console.error("Approve error:", err);
    }
  };

  // ไม่อนุมัติ
  const handleReject = async () => {
    if (!rejectDate) {
      alert('กรุณาเลือกวันนัดใหม่');
      return;
    }

    try {
      await axios.patch(
        `/api/notifications/${selectedNotification.request_id}/reject`,
        {
          new_appointment_date: rejectDate
        }
      );

      // เอารายการที่จัดการแล้วออกจาก pending
      setNotifications(prev =>
        prev.filter(
          item =>
            item.request_id !== selectedNotification.request_id
        )
      );

      handleCloseReject();
      alert("ยืนยันวันนัดใหม่สำเร็จ");

    } catch (err) {
      console.error("Reject error:", err);
    }
  };
  return (
    <div className="notifications-page">

      <div className="page-header">
        <h2>การแจ้งเตือน</h2>
      </div>

      {notifications.length > 0 && (
        <div className="page-header">
          <h3>คำขอเปลี่ยนวันนัดค้างดำเนินการ</h3>
        </div>
      )}

      {notifications.length === 0 ? (

        <div className="empty-state">
          ไม่มีคำขอเปลี่ยนวันนัดค้างดำเนินการ
        </div>

      ) : (

        <table className="notif-table">
          <thead>
            <tr>
              <th>เลขงาน</th>
              <th>เรื่อง</th>
              <th>หมายเหตุ</th>
              <th>เบอร์ติดต่อลูกบ้าน</th>
              <th>วันนัดเก่า</th>
              <th>วันนัดใหม่</th>
              <th>สถานะ</th>
              <th>ดำเนินงาน</th>
            </tr>
          </thead>

          <tbody>
            {notifications.map(item => (
              <tr key={item.request_id}>

                <td>
                  {formatTicketNumber(item.ticket_id)}
                </td>

                <td>
                  {item.title}
                </td>

                <td>
                  {item.reason}
                </td>

                <td>
                  {item.resident_phone}
                </td>

                <td>
                  <span className="old">
                    {formatDateTime(item.current_appointment_date)}
                  </span>
                </td>

                <td>
                  <span className="new">
                    {formatDateTime(item.requested_date)}
                  </span>
                </td>

                <td>
                  <span className="status-pill pending">
                    รอดำเนินการ
                  </span>
                </td>

                <td>
                  <button
                    className="manage-btn"
                    onClick={() => handleOpenApprove(item)}
                  >
                    อนุมัติ
                  </button>

                  <button
                    className="reject-btn"
                    onClick={() => handleOpenReject(item)}
                  >
                    ปฏิเสธ
                  </button>
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* =========================
          Approve Modal
      ========================= */}
      {showApproveModal && selectedNotification && (
        <div className="approve-modal-overlay" onClick={handleCloseApprove}>

          <div className="approve-modal" onClick={(e) => e.stopPropagation()}>

            <h3>
              ยืนยันการเปลี่ยนวันนัด
            </h3>

            <p>
              คุณต้องการอนุมัติการเปลี่ยนวันนัดของงาน
              <strong>
                {' '}
                {formatTicketNumber(
                  selectedNotification.ticket_id
                )}
              </strong>
              {' '}หรือไม่?
            </p>

            <div className="appointment-change">

              {/* วันนัดเก่า */}
              <div className="appointment-date old-date">

                <span>
                  วันนัดเดิม
                </span>

                <strong>
                  {formatDateTime(
                    selectedNotification.current_appointment_date
                  )}
                </strong>

              </div>

              {/* ลูกศร */}
              <div className="appointment-arrow">
                →
              </div>

              {/* วันนัดใหม่ */}
              <div className="appointment-date new-date">

                <span>
                  วันนัดใหม่
                </span>

                <strong>
                  {formatDateTime(
                    selectedNotification.requested_date
                  )}
                </strong>

              </div>

            </div>

            <div className="approve-modal-actions">

              <button
                className="cancel-btn"
                onClick={handleCloseApprove}
              >
                ยกเลิก
              </button>

              <button
                className="confirm-approve-btn"
                onClick={handleApprove}
              >
                ยืนยันการอนุมัติ
              </button>

            </div>

          </div>

        </div>
      )}
      {showRejectModal && selectedNotification && (
        <div
          className="approve-modal-overlay"
          onClick={handleCloseReject}
        >
          <div
            className="approve-modal reject-modal"
            onClick={(e) => e.stopPropagation()}
          >

            <h3>เปลี่ยนวันนัดใหม่</h3>

            <p className="reject-message">
              กรุณากำหนดวันนัดใหม่
            </p>

            {/* วันที่ลูกบ้านเสนอ */}
            <div className="requested-date-box">
              <span>วันที่ลูกบ้านเสนอ</span>

              <strong>
                {formatDateTime(
                  selectedNotification.requested_date
                )}
              </strong>
            </div>

            {/* กรอกวันใหม่ */}
            <div className="reject-date-form">

              <label>
                กำหนดวันนัดใหม่
              </label>

              <DateTimePicker
                value={rejectDate}
                onChange={setRejectDate}
              />

            </div>

            <div className="approve-modal-actions">

              <button
                className="cancel-btn"
                onClick={handleCloseReject}
              >
                ยกเลิก
              </button>

              <button
                className="confirm-reject-btn"
                onClick={handleReject}
              >
                ยืนยันการเปลี่ยนวัน
              </button>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}

export default Notifications;