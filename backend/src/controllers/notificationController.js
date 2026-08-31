const notificationModel = require('../models/notificationModel');
const ticketModel = require('../models/ticketModel');
const { sendAppointmentConfirmedFlex } = require('../services/line_flex_message');

// ดึงข้อมูล ticket + ช่าง + line_id ของลูกบ้าน แล้วยิง flex แจ้งวันนัดที่ยืนยันแล้วกลับไป
// ไม่ทำให้ request fail ถ้าส่งแจ้งเตือนไม่สำเร็จ เพราะการอนุมัติ/ปรับวันในระบบสำเร็จไปแล้วจริง
async function notifyAppointmentConfirmed(ticket_id) {
  try {
    const rows = await ticketModel.getTicketById(ticket_id);
    
    if (!rows.length) return;

    const t = rows[0];
    const technicianName = t.firstname ? `${t.firstname} ${t.lastname}` : "-";

    await sendAppointmentConfirmedFlex(t.line_id, {
      ticket_id: t.ticket_id,
      title: t.title,
      technicianName,
      technicianPhone: t.phone,
      appointmentDate: t.appointment_date
        ? new Date(t.appointment_date).toLocaleString("th-TH", {
            dateStyle: "short",
            timeStyle: "short",
          })
        : "-",
    });
  } catch (flexError) {
    console.error("ส่ง Flex Message ยืนยันวันนัดไม่สำเร็จ:", flexError.message);
  }
}

async function getNotifications(req, res) {
  try {

    const rows = await notificationModel.getPendingNotifications();
    res.status(200).json(rows);

  } catch (err) {
    console.error(err);
    res.status(500).json({ 
    error: 'Failed to fetch notifications',
    message: err.message
    });
  }
};

async function getNotificationCount(req, res) {
  try {
    const count = await notificationModel.getPendingCount();
    res.status(200).json({ count });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch count' });
  }
};

async function updateNotificationStatus (req, res) {
  const { status } = req.body;

  if (!['approved', 'rejected'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }

  try {
    await notificationModel.updateRequestStatus(req.params.id, status);
    res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update' });
  }
};

async function approveAppointmentRequest(req, res) {
  try {
    const  { request_id }  = req.params
    // เช็คก่อน
    const request = await notificationModel.getRequestById(request_id);

    if (!request) {
      return res.status(404).json({ 
        message: "request not found",
        requesttttId: request,
        test: "test"
      });
    }

    if (request.status !== 'pending') {
      return res.status(400).json({ error: 'Request already processed' });
    }

    // ทำงานจริง
    await notificationModel.approveRequest( request_id,request.ticket_id,request.requested_date );

    await notifyAppointmentConfirmed(request.ticket_id);

    res.status(200).json({ 
      success: true ,
      message: "Reschedule Requested Complete"
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to approve request' });
  }
}

async function rejectedAppointmentRequest(req, res) {
  try {
    const { request_id } = req.params;
    const { new_appointment_date } = req.body;

    // เช็คว่ามีวันใหม่ส่งมาหรือไม่
    if (!new_appointment_date) {
      return res.status(400).json({
        error: "กรุณาระบุวันนัดใหม่"
      });
    }

    // เช็ค request
    const request = await notificationModel.getRequestById(request_id);

    if (!request) {
      return res.status(404).json({
        message: "request not found"
      });
    }

    // เช็คว่ายัง pending อยู่หรือไม่
    if (request.status !== 'pending') {
      return res.status(400).json({
        error: 'Request already processed'
      });
    }

    // ทำงานจริง
    await notificationModel.rejectRequest(
      request_id,
      request.ticket_id,
      new_appointment_date
    );

    await notifyAppointmentConfirmed(request.ticket_id);

    res.status(200).json({
      success: true,
      message: "Reject request and reschedule complete"
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: 'Failed to reject request',
      message: err.message,

    });
  }
}
module.exports = { getNotifications, 
  getNotificationCount, 
  updateNotificationStatus, 
  approveAppointmentRequest,
  rejectedAppointmentRequest
}