const pool = require("../config/db")

exports.createTechnician = async(firstname, lastname, phone ,skill,profile_image_url) => {
    const [row] = await pool.query(
        "INSERT INTO technicians(firstname, lastname, phone, skill,profile_image_url) VALUE(?,?,?,?,?)",
        [firstname, lastname, phone, skill,profile_image_url]
    )
    return row
}

exports.getTechnicianById = async (id) => {
  const [rows] = await pool.query(
    "SELECT * FROM technicians WHERE technician_id = ?",
    [id]
  )
  return rows[0]
}

exports.getAllTechnicians = async () => {
  const [rows] = await pool.query(
    "SELECT * FROM technicians"
  )
  return rows 
}

exports.updateTechnician = async (technician_id, firstname, lastname, phone ,skill,profile_image_url) => {
  const [row] = await pool.query(
    `UPDATE technicians 
    SET 
    firstname = ?, lastname = ?, phone = ?, skill = ?,
    profile_image_url = ? 
    WHERE technician_id = ?
    `,
    [ firstname, lastname, phone ,skill,profile_image_url,technician_id ]
  )
  return row
}