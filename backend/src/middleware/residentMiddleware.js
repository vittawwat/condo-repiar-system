const jwt = require("jsonwebtoken");

exports.residentMiddleware = (req, res, next) => {

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
        // console.log("DECODED:", decoded);
        
        // นำข้อมูลเก็บใน req เพื่อนำไปใช้งานต่อ
        req.user = decoded;

        next();

    } catch (error) {

        console.log(error);

        return res.status(401).json({
            message: "Invalid token"
        });

    }

};