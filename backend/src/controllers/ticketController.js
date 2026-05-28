const ticketModel = require("../models/ticketModel")
const userModel = require("../models/residentModel");

async function createTicket(req, res) {
  try{
    const {user_id, title, detail, category} = req.body

    const user = await userModel.checkUserById(user_id)

    if(!user) {
      return res.status(404).json({
        message: "ไม่พบข้อมูลผู้ใช้งาน",
        user: user
      });
    }

    const result = await ticketModel.createTicket(user_id, title, detail, category)

    res.status(201).json({
      message:"success",
      Ticket_id: result.insertId,
      user: user 
    })
  } catch(error) {
    res.status(500).json({
      message: "server Error",
      Error: error.message})
  }
}

module.exports = { createTicket }