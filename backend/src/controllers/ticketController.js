const ticketModel = require("../models/ticketModel")
const userModel = require("../models/residentModel");
const technicianModel = require("../models/technicianModel")

const { pushMessage } = require("../services/line_push_message")
const { sendAppointmentFlex } = require("../services/line_flex_message")
const { canChangeStatus } = require("../utils/ticketStatus")

async function createTicket(req, res) {
  try {
    const user_id = req.user.user_id
    const { title, detail, category } = req.body

    if (!user_id) {
      return res.status(400).json({
        message: "User not found."
      })
    }

    if (!title || !detail || !category) {
      return res.status(400).json({
        message: "Please fill in all the information.",
      })
    }

    const result = await ticketModel.createTicket(user_id, title, detail, category);

    res.status(201).json({
      message: "success",
      ticket_id: result.insertId,
      req: req.user,
      line_id: req.user.sub,


    })
  } catch (error) {

    console.error("createTicket error:", error);
    return res.status(500).json({
      message: "server Error",
      Error: error.message
    })
  }
}

async function getTicket(req, res) {
  try {
    const { status } = req.query
    console.log("getTicketStatus", status);

    if (status) {
      const result = await ticketModel.getTicketByStatus(status)

      return res.status(200).json({
        message: "success",
        ticket_status: status,
        tickets: result
      })
    }
    const result = await ticketModel.getListTickets();

    console.log("getListTicket", result);
    res.status(200).json({
      tickets: result
    })

  } catch (error) {
    console.log("message", error.message);
    res.status(500).json({
      message: "server error",
      error: error.message
    })
  }
}

async function getMyTickets(req, res) {
  try {
    const user_id = req.user.user_id
    const { status } = req.query

    if (!user_id) {
      return res.status(400).json({
        message: "User not found."
      })
    }

    const result = await ticketModel.getTicketsByUser(user_id, status)

    res.status(200).json({
      message: "success",
      tickets: result
    })

  } catch (error) {
    console.error("getMyTickets error:", error);
    return res.status(500).json({
      message: "server error",
      error: error.message
    })
  }
}

async function getMyTicketById(req, res) {
  try {
    const { ticket_id } = req.params
    const user_id = req.user.user_id

    const result = await ticketModel.getTicketById(ticket_id);

    if (!result.length) {
      return res.status(404).json({
        message: "ticket not found"
      })
    }

    if (result[0].user_id !== user_id) {
      // ตอบ 404 เหมือนไม่พบ ticket แทน 403 เพื่อไม่ให้เดา ticket_id ของคนอื่นได้
      return res.status(404).json({
        message: "ticket not found",
      })
    }

    const ticket_images = await ticketModel.getTicketImageById(ticket_id)

    const ticket = formatTicket(result, ticket_images)

    res.status(200).json({
      ticket
    })
  } catch (error) {
    console.error("getMyTicketById error:", error);
    return res.status(500).json({
      message: "server error",
      error: error.message
    })
  }
}

async function getTicketById(req, res) {
  try {
    const { ticket_id } = req.params

    const result = await ticketModel.getTicketById(ticket_id);

    const ticket_images = await ticketModel.getTicketImageById(ticket_id)
    console.log("ticket_images", ticket_images);

    if (!result.length) {
      return res.status(404).json({
        message: "ticket not found"
      })
    }

    const ticket = formatTicket(result, ticket_images)

    // console.log("ticket จาก db =", ticket)
    res.status(200).json({
      ticket
    })
  } catch (error) {
    console.log("message", error.message);
    res.status(500).json({
      message: "server error",
      error: error.message
    })
  }
}

async function getTicketByStatus(req, res) {
  try {
    const { status } = req.query.status
    console.log("getTicketStatus", status);

    const result = ticketModel.getTicketByStatus(status)

    res.status(200).json({
      message: "success",
      ticket_status: status,
      tickets: result
    })
  } catch (error) {
    res.status(500).json({
      message: "server error",
      error: error.message
    })
  }
}

async function updateStatusTicket(req, res) {
  try {
    const { ticket_id } = req.params
    const { status } = req.body

    const tickets = await ticketModel.getTicketById(ticket_id)
    const ticket_images = await ticketModel.getTicketImageById(ticket_id)

    const ticket = formatTicket(tickets, ticket_images)

    if (!ticket) {
      res.status(400).json({
        message: "Ticket not found"
      })
    }
    console.log("updateTicket", ticket);

    if (!canChangeStatus(ticket.status, status)) {
      return res.status(400).json({
        message: `Cannot change status from ${ticket.status} to ${status}`
      })
    }

    const result = await ticketModel.updateStatusTicket(ticket_id, status)

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Ticket not found"
      })
    }

    // ใช้งานได้ค่อยเปิดตอนใช้งานจริง
    // await pushMessage(ticket.line_id, "นิติรับทราบปัญหาของคุณแล้ว กำลังประสานงานหาช่าง")

    res.status(200).json({
      message: "Ticket updated successfully",
      line_id: ticket.line_id
      // result: result,
      // row: result.changedRows
    })
  } catch (error) {
    res.status(500).json({
      message: "server error",
      error: error.message
    })
  }
}

async function assignTechnician(req, res) {
  try {
    const { ticket_id } = req.params
    const { technician_id, appointment_date, status } = req.body
    // console.log(technician);

    const ticket = await ticketModel.checkTicketById(ticket_id)
    console.log("line_id", ticket.line_id);

    if (!ticket) {
      return res.status(400).json({
        success: false,
        message: "not found ticket"
      })
    }

    if (!canChangeStatus(ticket.status, status)) {
      return res.status(400).json({
        message: `Cannot change status from ${ticket.status} to ${status}`
      })
    }
    const technician = await technicianModel.getTechnicianById(technician_id)

    if (!technician) {
      return res.status(400).json({
        success: false,
        message: "not found technician"
      })
    }

    await ticketModel.createAppointment(ticket_id, technician_id, appointment_date, status)

    // ใช้งานได้แล้วค่อยเปิดตอนใช้จริง
    // try {
    //   await sendAppointmentFlex(ticket.line_id, {
    //     ticket_id: ticket.ticket_id,
    //     title: ticket.title,
    //     technicianName: `${technician.firstname} ${technician.lastname}`,
    //     technicianPhone: technician.phone,
    //     appointmentDate: new Date(appointment_date).toLocaleString("th-TH", {
    //       dateStyle: "short",
    //       timeStyle: "short",
    //     }),
    //     ticketId: ticket.ticket_id,
    //   });
    // } catch (flexError) {
    //   // ไม่ทำให้ทั้ง request fail แค่เพราะส่งข้อความไม่สำเร็จ
    //   // เพราะ ticket นัดช่างสำเร็จแล้วจริง แค่แจ้งเตือนพลาด
    //   console.error("ส่ง Flex Message ไม่สำเร็จ:", flexError.message);
    // }

    res.status(200).json({
      success: true,
      message: "send Appointment to residents success"
    })

  } catch (error) {
    console.log(error.message)
    return res.status(500).json({
      success: false,
      message: "server error",
      error: error.message
    })

  }
}

async function requestAppointmentChange(req, res) {

  const { ticket_id } = req.params;
  const { requested_date, reason } = req.body;

  try {
    // 1. ตรวจสอบว่า Ticket มีอยู่จริง
    const ticket = await ticketModel.checkTicketById(ticket_id)

    if (!ticket) {
      res.status(404).json({
        success: false,
        message: "not found ticket"
      })
    }
    // 2. เพิ่มคำขอเปลี่ยนวันนัด
    const result = await ticketModel.createAppointment_requests(ticket_id, requested_date, reason)
    // 3. อัปเดตสถานะ นัดหมายแจ้งซ่อม
    const appointmentStatus = await ticketModel.updateAppointment_status(ticket_id, "reschedule_requested")

    return res.status(201).json({
      success: true,
      message: "ส่งคำขอเปลี่ยนวันนัดเรียบร้อย",
      request_id: result.insertId
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
};

async function cancelTicket(req, res) {
  try {
    const { ticket_id } = req.params
    const user_id = req.user.user_id
    const { reason } = req.body
 
    if (!reason) {
      return res.status(400).json({
        message: "Please provide a reason."
      })
    }
 
    const result = await ticketModel.getTicketById(ticket_id);
 
    if (!result.length) {
      return res.status(404).json({
        message: "ticket not found"
      })
    }
 
    if (result[0].user_id !== user_id) {
      return res.status(404).json({
        message: "ticket not found"
      })
    }
 
    if (!canChangeStatus(result[0].status, "cancelled")) {
      return res.status(400).json({
        message: "This ticket can no longer be cancelled."
      })
    }
 
    await ticketModel.cancelTicket(ticket_id, reason)
 
    res.status(200).json({
      message: "success"
    })
 
  } catch (error) {
    console.error("cancelTicket error:", error);
    return res.status(500).json({
      message: "server error",
      error: error.message
    })
  }
}

const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

/**
 * GET /api/tickets/search?start_date=YYYY-MM-DD&end_date=YYYY-MM-DD(optional)
 */
async function searchByDate(req, res) {
  try {
    const { start_date, end_date } = req.query;


    // validate: บังคับต้องมี start_date เสมอ
    if (!start_date) {
      return res.status(400).json({ error: 'กรุณาระบุวันเริ่มต้น (start_date)' });
    }
    if (end_date && end_date < start_date) {
      return res.status(400).json({
        error: 'วันสิ้นสุดต้องไม่มาก่อนวันเริ่มต้น'
      });
    }
    if (!DATE_REGEX.test(start_date)) {
      return res.status(400).json({ error: 'รูปแบบ start_date ไม่ถูกต้อง ต้องเป็น YYYY-MM-DD' });
    }
    if (end_date && !DATE_REGEX.test(end_date)) {
      return res.status(400).json({ error: 'รูปแบบ end_date ไม่ถูกต้อง ต้องเป็น YYYY-MM-DD' });
    }

    const tickets = await ticketModel.findByDateRange(start_date, end_date || null);

    return res.json({
      start_date,
      end_date: end_date || null,
      total: tickets.length,
      data: tickets,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: 'เกิดข้อผิดพลาดในการดึงข้อมูล',
      message: err.message
    });
  }
}

async function submitRepairExpense(req, res) {
  const { ticket_id } = req.params;
  const { status, total_cost, reason } = req.body;

  try {
    const ticket = await ticketModel.checkTicketById(ticket_id);

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'not found ticket'
      });
    }

    if (total_cost == null || total_cost === '') {
      return res.status(400).json({
        success: false,
        message: 'กรุณาระบุค่าใช้จ่าย'
      });
    }

    if (isNaN(total_cost) || total_cost < 0) {
      return res.status(400).json({
        success: false,
        message: 'ค่าใช้จ่ายต้องเป็นตัวเลขมากกว่าหรือเท่ากับ 0'
      });
    }

    await ticketModel.updateRepairExpense( ticket_id, status, total_cost, reason || null );

    // 4. ส่งผลลัพธ์กลับ
    return res.status(200).json({
      success: true,
      message: 'บันทึกค่าใช้จ่ายเรียบร้อย',
      data: {
        ticket_id: ticket_id,
        total_cost: total_cost,
        reason: reason || null
      }
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
}

function formatTicket(ticketById, ticket_images) {

  if (!ticketById.length) return null
  console.log("ticketById_info", ticketById);

  const fullname = ticketById[0].firstname + " " + ticketById[0].lastname;
  const ticket = {
    ticket_id: ticketById[0].ticket_id,
    line_id: ticketById[0].line_id,
    name: ticketById[0].fullname,
    room: ticketById[0].room_number,
    create_at: ticketById[0].created_at,
    title: ticketById[0].title,
    detail: ticketById[0].detail,
    status: ticketById[0].status,
    total_cost: ticketById[0].total_cost,
    reason: ticketById[0].reason,
    before_images: [],
    technician_id: ticketById[0].technician_id,
    technician_name: fullname,
    technician_phone: ticketById[0].phone,
    technician_skill: ticketById[0].skill,
    technician_profile: ticketById[0].profile_image_url,
    appointment_date: ticketById[0].appointment_date,
    appointment_status: ticketById[0].appointment_status,
  }

  for (const row of ticket_images) {
    console.log("loop add images", row);

    if (row.image_url && row.image_type === "before") {
      ticket.before_images.push(row.image_url)
    }
  }
  // console.log("in data Ticket", ticket);

  return ticket
}

module.exports = {
  createTicket,
  getTicket,
  getMyTickets,
  getMyTicketById,
  getTicketById,
  getTicketByStatus,
  updateStatusTicket,
  assignTechnician,
  requestAppointmentChange,
  searchByDate,
  submitRepairExpense,
  cancelTicket
}