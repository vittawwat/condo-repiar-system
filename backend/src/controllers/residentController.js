const userModel = require("../models/residentModel");
const jwt = require("jsonwebtoken");

async function registerResidents(req, res) {
  try {
    const { line_id, fullname, room_number, phone } = req.body

    if (!line_id || !fullname || !room_number || !phone) {
      return res.status(400).json({
        success: false,
        message: "Please fill in all the information."
      })
    }
    const result = await userModel.registerResidents(line_id, fullname, room_number, phone);

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

async function getRegistrationStatus(req, res) {
  try {
    // const { line_id } = req.body
    const line_id = req.query.line_id // การรับข้อมูล Query Parameter (?line_id=xxx)

    if (!line_id) {
      return res.status(400).json("ข้อมูลไม่ถูกต้อง")
    }

    const result = await userModel.findUserByLineId(line_id)

    if (!result) {
      return res.status(200).json({
        newUser: true,
        message: "ยังไม่ได้ลงทะเบียน",
      })
    } else {
      return res.status(200).json({
        newUser: false,
        message: "ลงทะเบียนแล้ว",
        resident: result
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

    console.log("getMe_userFromToken", req.user);

    const result = await userModel.findUserByLineId(line_id)

    console.log("controller", result);

    res.status(200).json({
      success: true,
      isRegistered: true,

      // TokenUser: req.headers.authorization,
      line_id_From_Token: req.user.sub,

      resident_info: {
        user_id: result.user_id,
        name: result.fullname,
        room_number: result.room_number,
        phone: result.phone
      }
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Server error"
    });

  }

};

module.exports = { registerResidents, getRegistrationStatus, getMe }