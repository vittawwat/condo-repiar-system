const jwt = require("jsonwebtoken");
const { findUserByLineId } = require("../models/residentModel");

const residentMiddleware = async (req, res, next) => {

    try {

        const authHeader = req.headers.authorization;

        console.log("HEADER:", authHeader);

        if (!authHeader) {

            return res.status(401).json({
                message: "No token"
            });

        }

        const token = authHeader.split(" ")[1];
        // console.log("TOKEN:", token);

        // แปลงข้อมูลจาก token 
        const decoded = jwt.decode(token);
        console.log("DECODED:", decoded);

        // เช็คว่ามาจาก Line จริงๆ
        // if (decoded.iss !== "https://access.line.me") {
        //     return res.status(401).json({ message: "Invalid token" })
        // }

        const user = await findUserByLineId(decoded.sub)
        console.log("checkUserLineId middle", user);

        if (!user) {
            return res.status(401).json({ message: "ไม่พบผู้ใช้งาน" })
        }
        // นำข้อมูลเก็บใน req เพื่อนำไปใช้งานต่อ
        req.user = user;

        next();

    } catch (error) {

        console.log(error);

        return res.status(401).json({
            message: "Invalid token"
        });

    }

};

module.exports = { residentMiddleware }