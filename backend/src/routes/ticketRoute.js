const express = require("express")
const router = express.Router()

const { createTicket, getListTicket, getTicketById } = require("../controllers/ticketController")
const { uploadImages } = require("../middleware/uploadMiddleware")
const { uploadTicketImages } = require("../controllers/uploadController")
const { residentMiddleware } = require("../middleware/residentMiddleware");


router.post("/", residentMiddleware,createTicket)
router.post("/:ticket_id/images",residentMiddleware,uploadImages,uploadTicketImages)

router.get("/",getListTicket)
router.get("/:ticket_id",getTicketById)

module.exports = router; 