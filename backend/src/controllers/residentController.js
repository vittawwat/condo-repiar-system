const userModel = require("../models/residentModel");
const jwt = require("jsonwebtoken");

async function registerResident(req, res) {
  try {
    const { line_id, fullname, room_number, phone } = req.body

    if (!line_id || !fullname || !room_number || !phone) {
      return res.status(400).json({
        success: false,
        message: "Please fill in all the information."
      })
    }
    const result = await userModel.registerResident(line_id, fullname, room_number, phone);

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
        isRegistered: false,
        message: "Unregistered user",
      })
    }
    if (result) {
      const token = jwt.sign(
        {
          user_id: result.user_id,
          line_id: result.line_id
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "1d"
        }
      )
      return res.status(200).json({
        isRegistered: true,
        message: "User already registered",
        resident: result,
        token: token
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

    // res.json(req.user)
    // const line_id = req.user.sub
    // console.log("getMe_userFromToken", req.user);
    // const result = await userModel.findUserByLineId(line_id)
    // console.log("controller", result);

    res.status(200).json({
      success: true,
      isRegistered: true,
      message: "User data retrieved successfully",
      resident_info: {
        user: req.user
      }
    });

  } catch (error) {

    res.status(500).json({
      message: "Server error",
      error: error.message
    });

  }

};

module.exports = { registerResident, getRegistrationStatus, getMe }