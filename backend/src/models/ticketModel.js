const pool = require("../config/db")

exports.checkTicketById = async(ticket_id) => {
    const [row] = await pool.query(
        "SELECT ticket_id, user_id FROM tickets WHERE ticket_id = ?",
        [ticket_id]
    )
    return row[0] || null
}

exports.createTicket = async(user_id, title, detail, category) => {
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

exports.getTicketById = async (ticket_id) =>{
    const [row] = await pool.query(
        `
        SELECT t.ticket_id, t.title, t.detail, t.category, t.status, t.created_at,
        r.line_id, r.fullname, r.room_number,
        ti.image_id, ti.image_type, ti.image_url, ti.uploaded_by
        FROM tickets t
        JOIN residents r

        ON t.user_id = r.user_id

        LEFT JOIN ticket_images ti
        ON t.ticket_id = ti.ticket_id

        WHERE t.ticket_id = ?;
        `,[ticket_id]
    )
    return row
}

exports.getTicketByStatus = async (status) =>{
    const [row] = await pool.query(
        // "SELECT * FROM tickets WHERE status = ?"
        `
        SELECT t.*, r.room_number
        FROM tickets as t
        JOIN residents as r

        ON t.user_id = r.user_id

        WHERE t.status = ?
        `,[status]
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