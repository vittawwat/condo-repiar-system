const express = require("express")
const router = express.Router()

const { createTicket } = require("../controllers/ticketController")
const { uploadImages, debugRaw } = require("../middleware/uploadMiddleware")
const { uploadTicketImages } = require("../controllers/uploadController")

router.post("/create-ticket", createTicket)
router.post("/tickets/:ticket_id/images",uploadImages,uploadTicketImages)

module.exports = router; 