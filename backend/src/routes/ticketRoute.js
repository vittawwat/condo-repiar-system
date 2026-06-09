const express = require("express")
const router = express.Router()

const { createTicket, 
        getTicket, 
        getTicketById,
        getTicketByStatus,
        updateStatusTicket 
    } = require("../controllers/ticketController")
const { uploadImages } = require("../middleware/uploadMiddleware")
const { uploadTicketImages } = require("../controllers/uploadController")
const { residentMiddleware } = require("../middleware/residentMiddleware");


router.post("/", residentMiddleware,createTicket)
router.post("/:ticket_id/images",residentMiddleware,uploadImages,uploadTicketImages)

router.get("/",getTicket)
router.get("/:ticket_id",getTicketById)
router.patch("/:ticket_id",updateStatusTicket)

module.exports = router; 