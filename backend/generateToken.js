const jwt = require("jsonwebtoken")
require("dotenv").config()
console.log(process.env.JWT_SECRET)

const token = jwt.sign(
  {
    user_id: 4,
    line_id: "U2005"
  },
  process.env.JWT_SECRET,
  { expiresIn: "1d" }
)

console.log(token)