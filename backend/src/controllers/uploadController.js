
const uploadModel = require("../models/uploadModel")
const ticketModel = require("../models/ticketModel")
const fs = require("fs");

const cleanupFiles = (files) => {
  if (files) files.forEach(f => fs.unlinkSync(f.path))
}

// shared function
const handleImageUpload = async (req, res, image_type, uploaded_by) => {
  const files = req.files
  try {
    const { ticket_id } = req.params

    const ticket = await ticketModel.checkTicketById(ticket_id)
    if (!ticket) {
      cleanupFiles(files)
      return res.status(404).json({ message: "ไม่พบข้อมูลแจ้งซ่อม" })
    }

    if (!files || files.length < 2) {
      cleanupFiles(files)
      return res.status(400).json({ message: "ต้องอัปโหลดอย่างน้อย 2 รูป" })
    }

    for (const file of files) {
      await uploadModel.insertTicketImage(ticket_id, image_type, uploaded_by, file.filename)
    }

    return res.status(201).json({ message: "upload success" })

  } catch (err) {
    cleanupFiles(files)
    console.error(err)
    return res.status(500).json({ message: "server error", error: err.message })
  }
}

// resident อัพรูปก่อนซ่อม
const uploadBeforeImages = async (req, res) => {
  // เช็คเจ้าของ ticket เฉพาะ resident
  const ticket = await ticketModel.checkTicketById(req.params.ticket_id)
  if (ticket?.user_id !== req.user.user_id) {
    cleanupFiles(req.files)
    return res.status(403).json({ message: "ไม่มีสิทธิ์อัปโหลด" })
  }
  return handleImageUpload(req, res, "before", "resident")
}


// admin อัพรูปหลังซ่อมเสร็จ
const uploadAfterImages = async (req, res) => {
  return handleImageUpload(req, res, "after", "admin")
}

module.exports = { uploadBeforeImages }