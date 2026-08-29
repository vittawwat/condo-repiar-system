const express = require("express")
const router = express.Router()

const { registerResident,
        getRegistrationStatus,
        getMe,
        loginResidents } = require("../controllers/residentController")
const { residentMiddleware } = require("../middleware/residentMiddleware");
const { lineMiddleware } = require("../middleware/lineMiddleware")

// gen-token_line สำหรับเทส postman เพื่อใช้ login ในการเทส api ของ residents
const { generateToken } = require("../../generateToken")
router.post("/generateToken-test",generateToken)
//===========================================//

router.post("/login",lineMiddleware,loginResidents)

router.post("/register",registerResident)

// ฟังก์ชันนี้จุดประสงค์คือการ "ดึงข้อมูล/ตรวจสอบสถานะ"
router.get("/registration-status",lineMiddleware,getRegistrationStatus)

router.get("/me",residentMiddleware,getMe)

module.exports = router;  