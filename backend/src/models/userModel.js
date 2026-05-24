const pool = require("../config/db")

exports.registerUser = async (line_id,fullname,room_number,phone) => {
    
    const row = await pool.query(
        "INSERT INTO residents (line_id, fullname, room_number, phone) VALUE (?, ?, ?, ?)",
        [line_id,fullname,room_number,phone]

    )
     return row
}

exports.findUserByLineId = async(line_id) => {
    const [row] = await pool.query(
        "SELECT * FROM residents WHERE line_id = ?",
        [line_id]
    )
    // Debug
    // console.log("ROWS:", row);
    return row[0] || null
}

exports.checkUserById = async(user_id) => {
    const [row] = await pool.query(
        "SELECT * FROM residents WHERE user_id = ?",
        [user_id]
    )

    return row[0] || null
}
exports.createTicket = async(user_id, title, detail, category) => {
    const row = await pool.query(
        "INSERT INTO tickets(user_id, title, detail, category) VALUE(?, ?, ?, ?)",
        [user_id, title, detail, category] 
    )

    return row
}