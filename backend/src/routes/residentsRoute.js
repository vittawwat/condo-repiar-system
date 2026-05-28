const express = require("express")
const router = express.Router()

const { registerResidents,getRegistrationStatus,getMe } = require("../controllers/residentController")
const { residentMiddleware } = require("../middleware/residentMiddleware");

router.post("/register",registerResidents)

// ฟังก์ชันนี้จุดประสงค์คือการ "ดึงข้อมูล/ตรวจสอบสถานะ"
router.get("/registration-status",getRegistrationStatus)

router.get("/me", residentMiddleware,getMe)


module.exports = router;  