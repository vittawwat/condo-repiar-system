const pool = require("../config/db")

exports.insertTicketImage = async ( ticket_id, image_type, image_url ) => {
  const row = await pool.query(
    "INSERT INTO ticket_images (ticket_id, image_type, image_url) VALUE (?, ?, ?)",
    [ ticket_id, image_type, image_url ]
  );

  return row;
};
