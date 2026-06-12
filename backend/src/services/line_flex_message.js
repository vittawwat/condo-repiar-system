const line = require("@line/bot-sdk")

const client = new line.messagingApi.MessagingApiClient({
    channelAccessToken: process.env.Channel_access_token_v2
})

async function checkFlexmessage(req, res) {
    try {

        const { line_id } = req.body

        const ticketData = {
            ticket_id: 15,
            technicianName: "สมชาย ใจดี",
            technicianPhone: "081-234-5678",
            appointmentDate: "15/06/2026 10:00 น.",
            ticketId: 15
        }

        await sendAppointmentFlex(line_id, ticketData)

        return res.status(200).json({
            message: "Flex Message sent"
        })

    } catch (error) {
        console.error(error)

        if (error.body) {
            console.log(error.body)
        }

        return res.status(500).json({
            message: error.message
        })
    }
}

async function webhook(req, res) {

    console.log("========== WEBHOOK ==========")
    console.log(JSON.stringify(req.body, null, 2))
    console.log("=============================")
    console.log("========== BODY ==========")
    console.log(JSON.stringify(req.body))
    console.log("=============================")

    const event = req.body.events[0]

    let action = ""
    
    if (event.type === "postback") {

        const params = new URLSearchParams(
            event.postback.data
        )
        console.log(params);

        action = params.get("action")
        const ticketId = params.get("ticket_id")

        console.log({
            action,
            ticketId
        })
    }
    // return res.sendStatus(200)

    if (action === "confirm") {

        await client.replyMessage({
            replyToken: event.replyToken,
            messages: [
                {
                    type: "text",
                    text: "✅ ยืนยันวันนัดเรียบร้อยแล้ว"
                }
            ]
        })

    }
    return res.sendStatus(200)
}

async function sendAppointmentFlex(line_id, ticketData) {
    await client.pushMessage({
        to: line_id,
        messages: [
            {
                type: "flex",
                altText: "นัดหมายช่างซ่อม", // ข้อความที่แสดงตอน notification
                contents: {
                    type: "bubble",
                    header: {
                        type: "box",
                        layout: "vertical",
                        backgroundColor: "#06C755",
                        contents: [
                            {
                                type: "text",
                                text: "🔧 นัดหมายช่างซ่อม",
                                color: "#ffffff",
                                weight: "bold",
                                size: "md"
                            }
                        ]
                    },
                    body: {
                        type: "box",
                        layout: "vertical",
                        spacing: "md",
                        contents: [
                            {
                                type: "text",
                                text: `Ticket #${ticketData.ticket_id}`,
                                color: "#000000",
                                weight: "bold",
                                size: "xl"
                            },

                            {
                                type: "box",
                                layout: "horizontal",
                                contents: [
                                    {
                                        type: "text",
                                        text: "ช่าง",
                                        color: "#888888",
                                        size: "sm",
                                        flex: 2
                                    },
                                    {
                                        type: "text",
                                        text: ticketData.technicianName,
                                        size: "sm",
                                        flex: 5
                                    }
                                ]
                            },

                            {
                                type: "box",
                                layout: "horizontal",
                                contents: [
                                    {
                                        type: "text",
                                        text: "เบอร์โทร",
                                        color: "#888888",
                                        size: "sm",
                                        flex: 2
                                    },
                                    {
                                        type: "text",
                                        text: ticketData.technicianPhone,
                                        size: "sm",
                                        flex: 5
                                    }
                                ]
                            },

                            {
                                type: "box",
                                layout: "horizontal",
                                contents: [
                                    {
                                        type: "text",
                                        text: "วันนัด",
                                        color: "#888888",
                                        size: "sm",
                                        flex: 2
                                    },
                                    {
                                        type: "text",
                                        text: ticketData.appointmentDate,
                                        size: "sm",
                                        flex: 5,
                                        wrap: true
                                    }
                                ]
                            }
                        ]
                    },
                    footer: {
                        type: "box",
                        layout: "horizontal",
                        spacing: "sm",
                        contents: [
                            {
                                type: "button",
                                style: "primary",
                                color: "#06C755",
                                action: {
                                    type: "postback",
                                    label: "✅ ยืนยันความสะดวก",
                                    data: `action=confirm&ticket_id=${ticketData.ticketId}`
                                }
                            },
                            {
                                type: "button",
                                style: "secondary",
                                action: {
                                    type: "postback",
                                    label: "📅 ขอเปลี่ยนวันนัด",
                                    data: `action=reschedule&ticket_id=${ticketData.ticketId}`
                                }
                            }
                        ]
                    }
                }
            }
        ]
    })
}

module.exports = { checkFlexmessage, webhook }