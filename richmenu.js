const axios = require("axios");
const fs = require("fs"); // จำเป็นต้องใช้เพื่ออ่านไฟล์รูปภาพ

const CHANNEL_ACCESS_TOKEN = "y6wB+xonSeN+oSl9hHRqVuLaZd+EXDidRLhPzsAHoBek+z/Rb9mp8kZi7Ju/jVP2rEMt/F2wVLMwqN5ipD2atwI6abHO4Shwv1HB2J3sqZQl9hsQ6abhQSvOu4xSe99vJiGDCNx0mmrCg6VuAeESqgdB04t89/1O/w1cDnyilFU=";
const LIFF_URL = "https://liff.line.me/2010319742-9sL2cWIB"; // LIFF ID ของคุณ

async function main() {
  try {
    // 1. สร้างโครงสร้าง Rich Menu
    const richMenu = {
      size: {
        width: 2500,
        height: 1686
      },
      selected: true,
      name: "main menu",
      chatBarText: "เมนู",
      areas: [
        {
          bounds: { x: 0, y: 0, width: 1250, height: 843 },
          action: {
            type: "uri", // เปลี่ยนจาก message เป็น uri
            uri: LIFF_URL // ใส่ Link LIFF เพื่อให้วิ่งไปเข้า Gatekeeper ที่เราวางแผนไว้
          }
        },
        {
          bounds: { x: 1250, y: 0, width: 1250, height: 843 },
          action: {
            type: "message",
            text: "ข้อมูลห้อง"
          }
        },
        {
          bounds: { x: 0, y: 843, width: 1250, height: 843 },
          action: {
            type: "message",
            text: "ประวัติ"
          }
        },
        {
          bounds: { x: 1250, y: 843, width: 1250, height: 843 },
          action: {
            type: "message",
            text: "โปรไฟล์"
          }
        }
      ]
    };

    console.log("1. กำลังสร้างโครงสร้าง Rich Menu...");
    const createRes = await axios.post(
      "https://api.line.me/v2/bot/richmenu",
      richMenu,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${CHANNEL_ACCESS_TOKEN}`
        }
      }
    );
    const richMenuId = createRes.data.richMenuId;
    console.log("-> ได้รับ Rich Menu ID:", richMenuId);

    // 2. อัปโหลดรูปภาพ (ต้องมีไฟล์ richmenu.jpg ในโฟลเดอร์เดียวกับโค้ดนี้)
    console.log("2. กำลังอัปโหลดรูปภาพ...");
    const imageBuffer = fs.readFileSync("./richmenu1.jpg");
    await axios.post(
      `https://api-data.line.me/v2/bot/richmenu/${richMenuId}/content`,
      imageBuffer,
      {
        headers: {
          "Content-Type": "image/jpeg", // หรือ image/png แล้วแต่ไฟล์ของคุณ
          Authorization: `Bearer ${CHANNEL_ACCESS_TOKEN}`
        }
      }
    );
    console.log("-> อัปโหลดรูปภาพสำเร็จ!");

    // 3. เซ็ตเป็นค่าเริ่มต้นให้ทุกคนเห็น
    console.log("3. กำลังตั้งค่าเป็น Rich Menu เริ่มต้น...");
    await axios.post(
      `https://api.line.me/v2/bot/user/all/richmenu/${richMenuId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${CHANNEL_ACCESS_TOKEN}`
        }
      }
    );
    console.log("-> ตั้งค่าเริ่มต้นสำเร็จ! เปิด LINE ในมือถือเพื่อดูผลลัพธ์ได้เลย");

  } catch (error) {
    console.error("เกิดข้อผิดพลาด:", error.response ? error.response.data : error.message);
  }
}

// สั่งให้ฟังก์ชันเริ่มทำงาน
main();