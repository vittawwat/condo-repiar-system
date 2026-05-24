const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");

async function registerUser(req, res) {
  try {
    const { line_id, fullname, room_number, phone } = req.body

    if (!line_id || !fullname || !room_number || !phone) {
      return res.status(400).json({
        success: false,
        message: "Please fill in all the information."
      })
    }
    const result = await userModel.registerUser(line_id, fullname, room_number, phone);

    res.status(201).json({
      success: true,
      message: "Create user success",
    });

  } catch (err) {

    if (err.errno === 1062) {
      return res.status(400).json({
        success: false,
        message: "User already exists"
      });
    }

    res.status(500).json({
      success: false,
      message: "Server Error",
      debug: err.message
    });
  }
};

async function checkUser(req, res) {
  try {
    const { line_id } = req.body

    if (!line_id) {
      return res.status(400).json("ข้อมูลไม่ถูกต้อง")
    }

    const result = await userModel.findUserByLineId(line_id)

    // res.json(result)
    if (!result) {
      return res.status(200).json({
        newUser: true,
        message: "ยังไม่ได้ ลงทะเบียน",
      })
    } else {
      return res.status(200).json({
        newUser: false,
        message: "ลงทะเบียนแล้ว"
      })
    }

  } catch (error) {
    return res.status(500).json({
      message: "Server Error",
      error: error.message
    })
  }
}

async function getMe(req, res) {
  try {
    const line_id = req.user.sub

    const result = await userModel.findUserByLineId(line_id)

    console.log("controller", result);

    res.status(200).json({
      success: "complete",
      TokenUser: req.headers.authorization,
      user_id: result.user_id,
      result: result,
      
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Server error"
    });

  }

};
async function createTicket(req, res) {
  try{
    const {user_id, title, detail, category} = req.body

    const user = await userModel.checkUserById(user_id)

    if(!user) {
      return res.status(404).json({
        message: "ไม่พบข้อมูลผู้ใช้งาน",
        user: user
      });
    }

    const result = await userModel.createTicket(user_id, title, detail, category)

    res.status(201).json({
      message:"success",
      user: user 
    })
  } catch(error) {
    res.status(500).json({
      message: "server Error",
      Error: error.message})
  }
}
module.exports = { registerUser, checkUser, getMe, createTicket }