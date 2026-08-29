import { useState } from 'react';
import axios from 'axios';

export default function InProgressAction({ ticketData, onSuccess, onClose }) {
  console.log("inprogress",ticketData);
  
  const [totalCost, setTotalCost] = useState(ticketData.total_cost || '');
  const [reason, setReason] = useState(ticketData.reason || '');

  const handleSubmitExpense = async (e) => {
    e.preventDefault();

    try {
      await axios.patch(
        `/api/tickets/${ticketData.ticket_id}/expense`,
        {
          status: "completed",
          total_cost: totalCost,
          reason
        }
      );

      alert('บันทึกค่าใช้จ่ายเรียบร้อย');

      onSuccess();
      onClose();

    } catch (error) {
      console.error(error);
      alert('บันทึกค่าใช้จ่ายไม่สำเร็จ');
    }
  };

  return (
    <form className="expense-form" onSubmit={handleSubmitExpense}>

      <h3>แจ้งค่าใช้จ่ายซ่อม</h3>

      <div className="form-group">
        <label>ค่าใช้จ่าย (บาท)</label>
        <input
          type="number"
          min="0"
          value={totalCost}
          onChange={(e) => setTotalCost(e.target.value)}
          placeholder="กรอกจำนวนเงิน"
          required
        />
      </div>

      <div className="form-group">
        <h1 className="expense-title">รายละเอียดค่าใช้จ่าย</h1>
        <textarea
          rows="3"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="เช่น ค่าอะไหล่ ค่าแรง"
        />
      </div>
      <div className="action-footer">
        <button type="button" className="cancel-btn" onClick={onClose}>
          ยกเลิก
        </button>
        <button type="submit" className="confirm-btn">
          บันทึกค่าใช้จ่าย
        </button>
      </div>
    </form>
  );
}