const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const PORT = process.env.PORT || 3000;

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const residentsRoute = require("./routes/residentsRoute");
const ticketRoute = require("./routes/ticketRoute")

app.use("/api/residents", residentsRoute);
app.use("/api/tickets", ticketRoute);



app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});