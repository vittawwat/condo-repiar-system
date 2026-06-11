// services/lineService.js
const axios = require("axios")

const LINE_API = "https://api.line.me/v2/bot/message/push"
const TOKEN = process.env.Channel_access_token_v2

const pushMessage = async (line_id, message) => {
  try {
    await axios.post(LINE_API, {
      to: line_id,
      messages: [
        {
          type: "text",
          text: message
        }
      ]
    }, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${TOKEN}`
      }
    })
    // console.log("channel_access", TOKEN);
    
    // console.log("push message success")
  } catch (err) {
    // console.log("push message error:", err.response?.data)
    // console.log("status =", err.response?.status)

    console.log("LINE_API =", LINE_API)

    console.log(
      JSON.stringify({
        to: line_id,
        messages: [
          {
            type: "text",
            text: message
          }
        ]
      }, null, 2)
    )
  }
}

module.exports = { pushMessage }