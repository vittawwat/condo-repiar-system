const express = require("express")
const router = express.Router()

const { createTicket, 
        getTicket, 
        getTicketById,
        getTicketByStatus,
        updateStatusTicket,
        assignTechnician,
        requestAppointmentChange,
        searchByDate,
        submitRepairExpense,
        getMyTickets,
        getMyTicketById,
        cancelTicket
    } = require("../controllers/ticketController")
// const { uploadImages } = require("../middleware/uploadMiddleware")
const { uploadTicketBefore } = require("../middleware/uploadMiddleware")
const { uploadBeforeImages } = require("../controllers/uploadController")
const { residentMiddleware } = require("../middleware/residentMiddleware");


router.post("/", residentMiddleware,createTicket)
router.post("/:ticket_id/images/before",residentMiddleware,uploadTicketBefore,uploadBeforeImages)
router.get("/my",residentMiddleware,getMyTickets)
router.get("/my/:ticket_id",residentMiddleware,getMyTicketById)
router.patch("/my/:ticket_id/cancel",residentMiddleware,cancelTicket)


router.get("/",getTicket)
router.get('/search', searchByDate);

router.get("/:ticket_id",getTicketById)


router.patch("/:ticket_id",updateStatusTicket)
router.post("/:ticket_id/reschedule",requestAppointmentChange)
//=========ทำ in-progress phase 1 ============//
//=====เพิ่ม ข้อมูลของช่างที่จะซ่อมแล้วก็นัดวัน =========//
router.patch("/:ticket_id/assign",assignTechnician)
//=========ทำ in-progress phase 2 ============//
//=====เพิ่ม ค่าใช้จ่ายพร้อมทั้งบอกรายระเอียดการซ่อม=========//
router.patch('/:ticket_id/expense',submitRepairExpense);
//======================================//

// เทส flex message
const {flexMessage, webhook} = require("../services/line_flex_message")
const { lineMiddleware } = require("../middleware/lineMiddleware")
router.post("/check-flex",flexMessage)
router.post("/webhook", webhook)


module.exports = router; 