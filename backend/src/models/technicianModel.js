const pool = require("../config/db")

exports.createTechnician = async(name, phone ,skill) => {
    const [row] = await pool.query(
        "INSERT INTO technicians(name, phone, skill) VALUE(?,?,?)",
        [name, phone, skill]
    )
    return row
}