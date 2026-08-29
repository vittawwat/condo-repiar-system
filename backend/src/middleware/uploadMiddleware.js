const { createUploader } = require("./uploadFatoryMiddleware")

module.exports = {
  uploadTicketBefore: createUploader("tickets/before").array("images", 3),
  uploadTicketAfter: createUploader("tickets/after").array("images", 3),
  uploadTechnicianProfile: createUploader("technicians").single("image"),

}