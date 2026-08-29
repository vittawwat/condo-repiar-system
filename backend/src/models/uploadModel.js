const pool = require("../config/db")

exports.insertTicketImage = async ( ticket_id, image_type, uploaded_by, image_url ) => {
  const [row] = await pool.query(
    "INSERT INTO ticket_images (ticket_id, image_type, uploaded_by, image_url) VALUE (?, ?, ?, ?)",
    [ ticket_id, image_type, uploaded_by, image_url ]
  );

  return row;
};

// exports.insertTechnicainProfile = async (profile_image_url) => {
//   const [row] = await pool.query(
//     "INSERT INTO technician ( profile_image_url ) VALUE (?)",
//     [image_url]
//   );
//    return row;
// }