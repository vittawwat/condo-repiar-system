const pool = require("../config/db")

exports.getPendingNotifications = async () => {
    //ต้องกลับมาแก้ status เปลี่ยนเป็น request_status ใน DB ของ appointment_requests
  const [rows] = await pool.query(
    `
    SELECT
    ar.request_id, ar.ticket_id, ar.requested_date, ar.reason, ar.status AS request_status, ar.created_at,
    t.title, t.category, t.appointment_date AS current_appointment_date,
    r.fullname AS resident_name, r.room_number, r.phone AS resident_phone
    FROM appointment_requests ar
    JOIN tickets t ON t.ticket_id = ar.ticket_id
    JOIN residents r ON r.user_id = t.user_id
    WHERE ar.status = 'pending'
    ORDER BY ar.created_at ASC
     `
  );

  return rows;
};

exports.getPendingCount = async () => {
  const [[row]] = await pool.query(
    `SELECT COUNT(*) AS count FROM appointment_requests WHERE status = 'pending'`
  );

  return row.count;
};

exports.updateRequestStatus = async (requestId, status) => {
  const [result] = await pool.query(
    `UPDATE appointment_requests
     SET status = ?, processed_at = NOW()
     WHERE request_id = ?`,
    [status, requestId]
  );

  return result;
};

exports.getRequestById = async (requestId) => {
  const [[row]] = await pool.query(
    `
    SELECT request_id, ticket_id, requested_date, status
    FROM appointment_requests
    WHERE request_id = ?
    `,
    [requestId]
  );

  return row;
};

exports.approveRequest = async (requestId, ticketId, requestedDate) => {

  await pool.query(
    `
    UPDATE tickets
    SET appointment_date = ?,
        appointment_status = 'confirmed'
    WHERE ticket_id = ?
    `,
    [requestedDate, ticketId]
  );

  await pool.query(
    `
    UPDATE appointment_requests
    SET status = 'approved',
        processed_at = NOW()
    WHERE request_id = ?
    `,
    [requestId]
  );
};

exports.rejectRequest = async (requestId,ticketId,newAppointmentDate) => {

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    await connection.query(
      `
      UPDATE tickets
      SET appointment_date = ?,
          appointment_status = 'confirmed'
      WHERE ticket_id = ?
      `,
      [newAppointmentDate, ticketId]
    );

    await connection.query(
      `
      UPDATE appointment_requests
      SET status = 'rejected',
          processed_at = NOW()
      WHERE request_id = ?
      `,
      [requestId]
    );

    await connection.commit();

  } catch (err) {

    await connection.rollback();
    throw err;

  } finally {

    connection.release();

  }
};