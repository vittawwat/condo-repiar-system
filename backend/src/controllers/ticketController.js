const ticketModel = require("../models/ticketModel")
const userModel = require("../models/residentModel");

async function createTicket(req, res) {
  try {
    const user_id = req.user.user_id
    const { title, detail, category } = req.body

    // ไม่ต้องเช็ค เพราะ เช็คผ่าน middleware แล้ว
    // const user = await userModel.checkUserById(user_id)
    // if(!user) {
    //   return res.status(404).json({
    //     message: "ไม่พบข้อมูลผู้ใช้งาน",
    //     user: user
    //   });
    // }

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

async function getListTicket(req, res) {
  try {
    const result = await ticketModel.getListTickets();

    console.log("getListTicket", result);
    res.status(200).json({
      allTicket: result
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

    const ticket = {
      ticket_id: result[0].ticket_id,
      name: result[0].fullname,
      room: result[0].room_number,
      create_at: result[0].created_at,
      title: result[0].title,
      detail: result[0].detail,
      before_images: []
    }

    //  result.forEach((result) => {
    //   if (result.image_url && result.image_type === "before") {
    //     ticket.before_images.push(result.image_url)
    //   }
    // })

    for (const row of result) {
      console.log("loop add images", row);

      if (row.image_url && row.image_type === "before") {
        ticket.before_images.push(row.image_url)
      }
    }
    // console.log("getTicketById", ticket)
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
module.exports = { createTicket, getListTicket, getTicketById }