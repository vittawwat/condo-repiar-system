const express = require("express")
const router = express.Router()

const userController = require("../controllers/userController")
const { userMiddleware } = require("../middleware/userMiddleware");

router.post("/register",userController.registerUser)
router.post("/check-user", userController.checkUser)
router.get("/me", userMiddleware, userController.getMe)
router.post("/create-ticket", userController.createTicket)


module.exports = router;  