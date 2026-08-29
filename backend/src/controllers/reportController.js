const reportModel = require('../models/reportModel');


async function getRepairExpenseReport(req, res) {
  try {

    const { start_date, end_date } = req.query;

    if (!start_date || !end_date) {
      return res.status(400).json({
        error: "กรุณาระบุ start_date และ end_date"
      });
    }

    const data = await reportModel.getRepairExpenseReport(
      start_date,
      end_date
    );

    const total_items = data.length;

    const total_cost = data.reduce(
      (sum, item) => sum + Number(item.total_cost || 0),
      0
    );

    res.status(200).json({
      start_date,
      end_date,

      summary: {
        total_items,
        total_cost
      },

      data
    });

  } catch (err) {

    console.error("Expense report error:", err);

    res.status(500).json({
      error: "Failed to get repair expense report"
    });

  }
};

module.exports = {
    getRepairExpenseReport
}