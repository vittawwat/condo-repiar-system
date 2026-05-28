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