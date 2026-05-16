const pool = require("../config/db")

exports.registerUser = async (line_id,fullname,room_number,phone) => {
    
    const row = await pool.query(
        "INSERT INTO residents (line_id, fullname, room_number, phone) VALUE (?, ?, ?, ?)",
        [line_id,fullname,room_number,phone]

    )
     return row
}

exports.findUserByLineId = async (line_id) => {
    const [row] = await pool.query(
        "SELECT * FROM residents WHERE line_id = ? ",
        [line_id]
    )
    return row[0] || null
}