const ticketModel = require("../models/ticketModel")
const userModel = require("../models/residentModel");

const { pushMessage } = require("../services/line_push_message")

async function createTicket(req, res) {
  try {
    const user_id = req.user.user_id
    const { title, detail, category } = req.body

    if(!user_id){
      return res.status(400).json({
        message: "User not found."
      })
    }
    
    if(!title || !detail || !category) {
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

async function getTicketById(req, res) {
  try {
    const { ticket_id } = req.params

    const result = await ticketModel.getTicketById(ticket_id);

    if (!result.length) {
      return res.status(404).json({
        message: "ticket not found"
      })
    }

    const ticket = formatTicket(result)

    console.log("ticket จาก db =", ticket)
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
    const ticket = formatTicket(tickets)

    if (!ticket) {
      res.status(400).json({
        message: "Ticket not found"
      })
    }
    console.log("updateTicket", ticket);
    // console.log("user_id",ticket.user_id);


    const currentStatus = ticket.status

    const allowedTransitions = {
      pending: ["acknowledged"],
      acknowledged: ["in_progress"],
      in_progress: ["completed"],
      completed: []
    }
    console.log("curren", currentStatus);
    console.log("newStatus", status);

    const isAllowed = allowedTransitions[currentStatus]?.includes(status)

    console.log("isAllow", isAllowed);

    if (!isAllowed) {
      return res.status(400).json({
        message: `Cannot change status from ${currentStatus} to ${status}`,
        isAllowed: isAllowed
      })
    }

    const result = await ticketModel.updateStatusTicket(ticket_id, status)

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Ticket not found"
      })
    }

    if (result.changedRows === 0) {
      return res.status(400).json({
        message: "No changes detected"
      })
    }

    // pushmessage
    // ticket.user_id
    await pushMessage(ticket.line_id, "นิติรับทราบปัญหาของคุณแล้ว กำลังประสานงานหาช่าง")

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

function formatTicket(tickets) {

  if (!tickets.length) return null

  const ticket = {
    ticket_id: tickets[0].ticket_id,
    line_id: tickets[0].line_id,
    name: tickets[0].fullname,
    room: tickets[0].room_number,
    create_at: tickets[0].created_at,
    title: tickets[0].title,
    detail: tickets[0].detail,
    status: tickets[0].status,
    before_images: []
  }

  for (const row of tickets) {
    console.log("loop add images", row);

    if (row.image_url && row.image_type === "before") {
      ticket.before_images.push(row.image_url)
    }
  }
  console.log("in data Ticket", ticket);

  return ticket
}

module.exports = {
  createTicket,
  getTicket,
  getTicketById,
  getTicketByStatus,
  updateStatusTicket
}

