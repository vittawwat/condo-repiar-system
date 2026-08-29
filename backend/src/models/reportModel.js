const pool = require("../config/db")

exports.getRepairExpenseReport = async (startDate, endDate) => {

  const [rows] = await pool.query(
    `
    SELECT
      t.ticket_id,
      t.created_at,
      r.room_number,
      t.title,
      t.category,
      CONCAT(tech.firstname, ' ', tech.lastname) AS technician_name,
      t.total_cost,
      t.reason
    FROM tickets t

    JOIN residents r
      ON t.user_id = r.user_id

    LEFT JOIN technicians tech
      ON t.technician_id = tech.technician_id

    WHERE t.status = 'completed'
      AND DATE(t.created_at) BETWEEN ? AND ?

    ORDER BY t.created_at DESC
    `,
    [startDate, endDate]
  );

  return rows;
};