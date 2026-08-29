const express = require("express");

const router = express.Router();

const { getRepairExpenseReport,

} = require('../controllers/reportController')


router.get("/repair", getRepairExpenseReport);


module.exports = router;