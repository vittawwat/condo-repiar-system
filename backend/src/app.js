const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");


dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const userRoute = require("./routes/userRoute");

app.use("/api", userRoute);



app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "API Running"
  });
});
app.get("/api/test", (req, res) => {
  res.json({
    success: true,
    message: "API Running"
  });
});
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});