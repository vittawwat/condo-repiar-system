const jwt = require("jsonwebtoken")
require("dotenv").config()
console.log(process.env.MOCK_LINE_TOKEN_SECRET)

async function generateToken(req, res) {
  try {
    const { line_id } = req.body

    const token = jwt.sign(
      {
        sub: line_id
      },
      process.env.MOCK_LINE_TOKEN_SECRET,
      { expiresIn: "1d" }
    )

    res.status(201).json({
      success:true,
      line_access_token: token
    })
  } catch (error) {
    res.status(500).json({
      message: "server error",
      error: error.message
    })
  }
  console.log(token)
}

module.exports = { generateToken }
