const express = require("express")
const router = express.Router()

const { createTechnician, updateTechnician, getTechnicians } = require("../controllers/techniciansController")
const { uploadTechnicianProfile } = require("../middleware/uploadMiddleware")


router.post("/",uploadTechnicianProfile,createTechnician)
router.get("/",getTechnicians)

router.patch("/:technician_id",uploadTechnicianProfile,updateTechnician)

module.exports = router;  
