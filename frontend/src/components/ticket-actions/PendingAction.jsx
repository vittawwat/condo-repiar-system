import axios from "axios";
import "./PendingAction.css";
export default function PendingAction({ ticketData, onSuccess, onClose, }) {
  async function handleAcknowledge() {
    try {

      await axios.patch(`/api/tickets/${ticketData.ticket_id}`, {
        status: "acknowledged",
      });

      alert("รับเรื่องสำเร็จ");

      onSuccess();
      onClose();

    } catch (error) {
      console.error(error);
      alert("รับเรื่องไม่สำเร็จ");
    }
  }

  return (
    <div className="action-footer">
      <button type="button" className="cancel-btn" onClick={onClose}>
        ยกเลิก
      </button>

      <button type="button" className="ack-btn" onClick={handleAcknowledge}>
        ยืนยันรับเรื่อง
      </button>
    </div>
  );
}