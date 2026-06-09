const express = require("express")
const router = express.Router()

const { generateToken } = require("../../generateToken")

router.post("/generate-line-token", generateToken)

module.exports = router