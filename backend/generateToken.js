const jwt = require("jsonwebtoken")
require("dotenv").config()
console.log(process.env.JWT_SECRET)

const token = jwt.sign(
  {
    user_id: 2,
    line_id: "U2001"
  },
  process.env.JWT_SECRET,
  { expiresIn: "1d" }
)

console.log(token)