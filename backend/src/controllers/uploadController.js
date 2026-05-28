
const uploadModel = require("../models/uploadModel")
const ticketModel = require("../models/ticketModel")
const fs = require("fs");

async function uploadTicketImages(req, res) {
  try {
    const { ticket_id } = req.params
    const { image_type } = req.body

    const files = req.files

    console.log("params:", req.params);
    console.log("body:", req.body);
    console.log("files:", req.files);

    const ticket = await ticketModel.checkTicketById(ticket_id)

    console.log("ticket id", ticket);

    if (!ticket) {
      // ถ้า multer เซฟไปแล้วค่อยลบ
      if (files) {
        for (const file of files) {
          fs.unlinkSync(
            file.path
          );
        }
      }
      return res.status(400).json({
        message: "ไม่พบ ticket"
      });
    }

    if (!files || files.length < 2) {
      // ลบไฟล์ที่ multer เซฟไว้ก่อน
      for (const file of files || []) {
        fs.unlinkSync(file.path)
      }

      return res.status(400).json({
        message: "ต้องอัปโหลดอย่างน้อย 2 รูป"
      })
    }


    for (const file of files) {
      await uploadModel.insertTicketImage(
        ticket_id,
        image_type,
        file.filename
      )
    }

    res.status(201).json("upload success")

  } catch (err) {
    if (err.errno === 1452) {
      res.status(500).json({
        message: "ไม่พบข้อมูลแจ้งซ่อม",
        Error: err.mesage
      })
    }
    console.log(err)
    res.json(err.message)
  }
}
module.exports = { uploadTicketImages }