const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const path = require("path")

const PORT = process.env.PORT || 3000;

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname,"..", "uploads")))
console.log("dir",__dirname)

const residentsRoute = require("./routes/residentsRoute");
const ticketRoute = require("./routes/ticketRoute")
const technicianRoute = require("./routes/technicianRoute")
const devRoute = require("./routes/devRoute")

app.use("/api/residents", residentsRoute);
app.use("/api/tickets", ticketRoute);
app.use("/api/technician",technicianRoute);


//====================================//
// สำหรับ genarete lineToken ไว้ test Login in postman //
app.use("/api/dev", devRoute)
//==================================//


module.exports = app
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });