const pool = require("../config/db")

exports.checkTicketById = async (ticket_id) => {
  const [row] = await pool.query(
    `
        SELECT t.*, r.line_id
        FROM tickets t
        JOIN residents r ON t.user_id = r.user_id
        WHERE t.ticket_id = ?
        `, [ticket_id]
  )
  return row[0] || null
}

exports.createTicket = async (user_id, title, detail, category) => {
  const [row] = await pool.query(
    "INSERT INTO tickets(user_id, title, detail, category) VALUE(?, ?, ?, ?)",
    [user_id, title, detail, category]
  )

  return row
}

exports.getListTickets = async () => {
  const [row] = await pool.query(
    `
        SELECT t.ticket_id, t.category, t.title, t.created_at, t.status,
        r.room_number 
        FROM tickets as t
        join residents as r 
        ON t.user_id = r.user_id
        `
  )
  return row
}

exports.getTicketsByUser = async (user_id, status) => {
    let query = `
        SELECT t.ticket_id, t.category, t.title, t.status, t.created_at,
        t.appointment_date, t.appointment_status,
        r.room_number
        FROM tickets t
        JOIN residents r
        ON t.user_id = r.user_id
        WHERE t.user_id = ?
    `
    const params = [user_id]
 
    if (status) {
        query += ` AND t.status = ?`
        params.push(status)
    }
 
    query += ` ORDER BY t.created_at DESC`
 
    const [row] = await pool.query(query, params)
    return row
}

exports.getTicketById = async (ticket_id) => {
  const [row] = await pool.query(
    `
        SELECT 
        t.ticket_id, t.user_id, t.title, t.detail, t.category, t.created_at, t.status, t.technician_id, t.appointment_date, appointment_status, t.total_cost, t.reason,
        r.line_id, r.fullname, r.room_number,
        tech.firstname, tech.lastname, tech.phone, tech.skill, tech.profile_image_url
        FROM tickets t

        JOIN residents r
        ON t.user_id = r.user_id
        LEFT JOIN technicians tech 
        ON t.technician_id = tech.technician_id
        WHERE t.ticket_id = ?; 
        `, [ticket_id]
  )
  return row
}

exports.getTicketImageById = async (ticket_id) => {
  const [row] = await pool.query(
    `
        SELECT image_type, image_url 
        FROM ticket_images 
        WHERE ticket_id = ?;
        `, [ticket_id]
  )
  return row
}

exports.getTicketByStatus = async (status) => {
  const [row] = await pool.query(
    // "SELECT * FROM tickets WHERE status = ?"
    `
        SELECT t.*, r.room_number
        FROM tickets as t
        JOIN residents as r

        ON t.user_id = r.user_id

        WHERE t.status = ?
        `, [status]
  )
  return row
}

exports.updateStatusTicket = async (ticket_id, status) => {
  const [row] = await pool.query(
    `
       UPDATE tickets 
       SET 
       status = ? 
       WHERE ticket_id = ? 
       ` ,
    [status, ticket_id]
  )
  return row
}

exports.createAppointment = async (ticket_id, technician_id, appointment_date, status) => {
  const [row] = await pool.query(
    `
        UPDATE tickets
        SET
        technician_id = ?,
        appointment_date = ?,
        appointment_status = 'confirmed',
        status = ?
        WHERE ticket_id = ?
        `,
    [technician_id, appointment_date, status, ticket_id]
  )
  return row
}

exports.createAppointment_requests = async (ticket_id, requested_date, reason) => {
  const [row] = await pool.query(
    `
      INSERT INTO appointment_requests(ticket_id, requested_date, reason)
      VALUES (?, ?, ?)
      `,
    [ticket_id, requested_date, reason]
  )
  return row
}

exports.updateAppointment_status = async (ticket_id, appointment_status) => {
  const [row] = await pool.query(
    `
        UPDATE tickets 
        SET 
        appointment_status = ?
        WHERE ticket_id = ?
        `,
    [appointment_status, ticket_id]
  )
  return row
}

exports.cancelTicket = async (ticket_id, reason) => {
  const [result] = await pool.query(
    `UPDATE tickets
     SET status = 'cancelled', reason = ?
     WHERE ticket_id = ?`,
    [reason, ticket_id]
  );
 
  return result;
};

/**
 * ค้นหา ticket ตามช่วงวันที่ที่แจ้งซ่อม (created_at)
 * @param {string} startDate - วันเริ่มต้น รูปแบบ YYYY-MM-DD (บังคับ)
 * @param {string|null} endDate - วันสิ้นสุด รูปแบบ YYYY-MM-DD (ไม่บังคับ)
 * @returns {Promise} รายการ ticket ที่ตรงเงื่อนไข
 */
exports.findByDateRange = async (startDate, endDate) => {
  let sql = `
    SELECT
      t.ticket_id,
      t.title,
      t.detail,
      t.category,
      t.status,
      t.appointment_date,
      t.appointment_status,
      t.created_at,
      t.updated_at,
      r.fullname AS resident_name,
      r.room_number,
      CONCAT(tech.firstname, ' ', tech.lastname) AS technician_name
    FROM tickets t
    LEFT JOIN residents r
      ON t.user_id = r.user_id
    LEFT JOIN technicians tech
      ON t.technician_id = tech.technician_id
    WHERE t.created_at >= ?
  `;

  const params = [startDate];

  if (endDate) {
    // +1 วัน แล้วใช้ < แทน <= เพื่อครอบคลุมถึง 23:59:59 ของวันที่เลือกจริง ๆ
    const endPlusOne = new Date(endDate + 'T00:00:00');
    endPlusOne.setDate(endPlusOne.getDate() + 1);
    const endParam = endPlusOne.toISOString().split('T')[0];

    sql += ' AND t.created_at < ?';
    params.push(endParam);
  }

  sql += ' ORDER BY t.created_at DESC';

  const [rows] = await pool.query(sql, params);
  return rows;
};

exports.updateRepairExpense = async (ticket_id, status, total_cost, reason) => {
  const [result] = await pool.query(
    `UPDATE tickets
     SET status = ?, total_cost = ?, reason = ?
     WHERE ticket_id = ?`,
    [status, total_cost, reason, ticket_id]
  );

  return result;
};
