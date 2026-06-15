const express = require("express")
const router = express.Router()

const { createTechnicians } = require("../controllers/techniciansController")

router.post("/",createTechnicians)

module.exports = router;  
