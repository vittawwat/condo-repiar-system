const line = require("@line/bot-sdk")
const { formatTicketNumber } = require("../utils/ticketStatus")

const client = new line.messagingApi.MessagingApiClient({
    channelAccessToken: process.env.Channel_access_token_v2
})
const LIFF_ID = process.env.LIFF_ID_BACKEND

async function flexMessage(req, res) {
    try {

        const { line_id } = req.body

        const ticketData = {
            ticket_id: 2,
            technicianName: "สมชาย ใจดี",
            technicianPhone: "081-234-5678",
            appointmentDate: "15/06/2026 10:00 น.",
            ticketId: 2
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

    // เช็คก่อนว่าข้อมูลที่จำเป็นมาครบไหม กันส่ง Flex ออกไปแบบข้อมูลขาด
    if (!line_id) {
        throw new Error("missing line_id, cannot send flex message");
    }
    if (!ticketData?.ticket_id || !ticketData?.technicianName || !ticketData?.appointmentDate) {
        throw new Error("missing required ticketData fields (ticket_id, technicianName, appointmentDate)");
    }

    const ticket_id = formatTicketNumber(ticketData.ticket_id)
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
                                text: `เลขงาน #${ticket_id}`,
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
                                        text: "หัวข้อ",
                                        color: "#888888",
                                        size: "sm",
                                        flex: 2
                                    },
                                    {
                                        type: "text",
                                        text: ticketData.title,
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
                                style: "secondary",
                                action: {
                                    type: "uri",
                                    label: "📅 ขอเปลี่ยนวันนัด",
                                    uri: `https://liff.line.me/${LIFF_ID}/reschedule/${ticketData.ticketId}`
                                }
                            }
                        ]
                    }
                }
            }
        ]
    })
}

async function sendAppointmentConfirmedFlex(line_id, ticketData) {

    // เช็คก่อนว่าข้อมูลที่จำเป็นมาครบไหม กันส่ง Flex ออกไปแบบข้อมูลขาด
    if (!line_id) {
        throw new Error("missing line_id, cannot send flex message");
    }
    if (!ticketData?.ticket_id || !ticketData?.appointmentDate) {
        throw new Error("missing required ticketData fields (ticket_id, appointmentDate)");
    }

    const ticket_id = formatTicketNumber(ticketData.ticket_id)

    await client.pushMessage({
        to: line_id,
        messages: [
            {
                type: "flex",
                altText: "ยืนยันวันนัดหมายใหม่",
                contents: {
                    type: "bubble",
                    header: {
                        type: "box",
                        layout: "vertical",
                        backgroundColor: "#06C755",
                        contents: [
                            {
                                type: "text",
                                text: "📅 ยืนยันวันนัดหมาย",
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
                                text: `เลขงาน #${ticket_id}`,
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
                                        text: "หัวข้อ",
                                        color: "#888888",
                                        size: "sm",
                                        flex: 2
                                    },
                                    {
                                        type: "text",
                                        text: ticketData.title || "-",
                                        size: "sm",
                                        flex: 5,
                                        wrap: true
                                    }
                                ]
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
                                        text: ticketData.technicianName || "-",
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
                                        text: ticketData.technicianPhone || "-",
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
                                        text: "วันนัดใหม่",
                                        color: "#888888",
                                        size: "sm",
                                        flex: 2
                                    },
                                    {
                                        type: "text",
                                        text: ticketData.appointmentDate,
                                        size: "sm",
                                        flex: 5,
                                        wrap: true,
                                        weight: "bold"
                                    }
                                ]
                            }
                        ]
                    }
                }
            }
        ]
    })
}

async function sendClosedTicketFlex(line_id, ticketData) {

    if (!line_id) {
        throw new Error("missing line_id, cannot send flex message");
    }
    if (!ticketData?.ticket_id || ticketData?.totalCost == null) {
        throw new Error("missing required ticketData fields (ticket_id, totalCost)");
    }

    const ticket_id = formatTicketNumber(ticketData.ticket_id)
    const costText = Number(ticketData.totalCost).toLocaleString("th-TH", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })

    await client.pushMessage({
        to: line_id,
        messages: [
            {
                type: "flex",
                altText: "ปิดงานซ่อมเรียบร้อยแล้ว",
                contents: {
                    type: "bubble",
                    header: {
                        type: "box",
                        layout: "vertical",
                        backgroundColor: "#06C755",
                        contents: [
                            {
                                type: "text",
                                text: "✅ ปิดงานซ่อมเรียบร้อยแล้ว",
                                color: "#ffffff",
                                weight: "bold",
                                size: "md",
                                wrap: true
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
                                text: `เลขงาน #${ticket_id}`,
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
                                        text: "หัวข้อ",
                                        color: "#888888",
                                        size: "sm",
                                        flex: 2
                                    },
                                    {
                                        type: "text",
                                        text: ticketData.title || "-",
                                        size: "sm",
                                        flex: 5,
                                        wrap: true
                                    }
                                ]
                            },
                            {
                                type: "box",
                                layout: "horizontal",
                                contents: [
                                    {
                                        type: "text",
                                        text: "ค่าใช้จ่าย",
                                        color: "#888888",
                                        size: "sm",
                                        flex: 2
                                    },
                                    {
                                        type: "text",
                                        text: `${costText} บาท`,
                                        size: "sm",
                                        flex: 5,
                                        weight: "bold"
                                    }
                                ]
                            },
                            {
                                type: "box",
                                layout: "horizontal",
                                contents: [
                                    {
                                        type: "text",
                                        text: "รายละเอียด",
                                        color: "#888888",
                                        size: "sm",
                                        flex: 2
                                    },
                                    {
                                        type: "text",
                                        text: ticketData.reason || "-",
                                        size: "sm",
                                        flex: 5,
                                        wrap: true
                                    }
                                ]
                            }
                        ]
                    }
                }
            }
        ]
    })
}

module.exports = {
    flexMessage,
    webhook,
    sendAppointmentFlex,
    sendAppointmentConfirmedFlex,
    sendClosedTicketFlex
}