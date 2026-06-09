const jwt = require("jsonwebtoken");
const userModel = require("../models/residentModel");

const lineMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {

            return res.status(401).json({
                message: "No token"
            });

        }
        const token = authHeader.split(" ")[1];
        console.log("TOKEN:", token);   

        const user_line = jwt.decode(token);
        console.log("DECODED:", user_line);

        const user = await userModel.findUserByLineId(user_line.sub)

        // if(!user){
        //     return res.status(401).json({ 
        //         message: "User not found" 
        //     })
        // }

        // res.status(201).json({
        //     message: "success",
        //     // token_lind: token,
        //     user_line: user_line
        // })
        console.log("lineMiddleware",user_line.sub);
        
        req.user = user_line;

        next();

    } catch(error){
        console.log(error);

        return res.status(401).json({
            message: "Invalid token",
            error: error.message
        });
    }
}

module.exports = { lineMiddleware }