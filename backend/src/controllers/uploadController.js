
const uploadModel = require("../models/uploadModel")
const ticketModel = require("../models/ticketModel")
const fs = require("fs");

const cleanupFiles = (files) => {
  if (files) files.forEach(f => fs.unlinkSync(f.path))
}

async function uploadTicketImages(req, res) {
  try {
    const { ticket_id } = req.params
    // const { image_type, uploaded_by } = req.body
    const files = req.files
    const user_id = req.user.user_id

    console.log("params:", req.params);
    console.log("type:", typeof ticket_id);
    console.log("files:", req.files);

    const ticket = await ticketModel.checkTicketById(ticket_id)

    if (!ticket) {
      // ถ้า multer เซฟไปแล้วค่อยลบ
      cleanupFiles(files)
      return res.status(400).json({
        message: "ไม่พบข้อมูลแจ้งซ่อม"
      });
    }

     if (!files || files.length < 2) {
      cleanupFiles(files)
      return res.status(400).json({ 
        message: "ต้องอัปโหลดอย่างน้อย 2 รูป" 
      })
    }

    if (ticket.user_id !== user_id) {
      cleanupFiles(files)
      return res.status(403).json({ 
        message: "ไม่มีสิทธิ์อัปโหลด" 
      })
    }

    for (const file of files) {
      await uploadModel.insertTicketImage(
        ticket_id,
        "before",      // hardcode
        "resident",
        file.filename
      )
    }

    res.status(201).json({ message: "upload success" })

  } catch (err) {
    cleanupFiles(files)
    if (err.errno === 1452) {
      return res.status(500).json({
        message: "ไม่พบข้อมูลแจ้งซ่อม",
        Error: err.mesage
      })
    }
    console.log(err)
    return res.status(500).json({
      message: "server Error",
      Error: err.message
    })
  }
}
module.exports = { uploadTicketImages }