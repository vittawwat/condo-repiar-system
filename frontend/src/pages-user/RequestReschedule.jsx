import { useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./RequestReschedule.css";

export default function ReschedulePage() {
  const { ticket_id } = useParams();
  const [requestedDate, setRequestedDate] = useState("");
  const [reason, setReason] = useState("");


  console.log(requestedDate);
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!requestedDate) {
      alert("กรุณาเลือกวันนัดใหม่");
      return;
    }

    try {

      await axios.post(
        `/api/tickets/${ticket_id}/reschedule`, 
      {
        requested_date: requestedDate,
        reason,
      });

      alert("ส่งคำขอเปลี่ยนวันนัดเรียบร้อย");

      clearForm();
      // ถ้าใช้ LIFF
      // liff.closeWindow();

    } catch (err) {
      console.error(err.message);
      alert(err.response?.data?.message || "เกิดข้อผิดพลาด");
  }};

  const clearForm = () => {
    setRequestedDate("")
    setReason("")
  }
  return (
    <div className="reschedule-page">

      <div className="card">

        <div className="header">
          <h1>📅 RequestReschedule</h1>
          <p>
            Please select a new appointment date and provide a reason for the reschedule request.
          </p>
        </div>

        <form onSubmit={handleSubmit}>

          <div className="form-group">
            <label>New Appointment Date</label>

            <input
              type="datetime-local"
              value={requestedDate}
              onChange={(e) => setRequestedDate(e.target.value)}

              required
            />
          </div>

          <div className="form-group">
            <label>Reason</label>

            <textarea
              rows="5"
              placeholder="For example: I have an appointment and will not be available at home."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </div>

          <button className="submit-btn"> Submit Request </button>

        </form>

      </div>

    </div>
  );
}
