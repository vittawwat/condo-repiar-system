const userModel = require("../models/userModel");

async function registerUser(req, res) {
    try {
    const {line_id, fullname, room_number, phone} = req.body

    if(!line_id || !fullname || !room_number || !phone){
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
  try{
    const { line_id } = req.body

    if(!line_id){
      res.status(400).json("ข้อมูลไม่ถูกต้อง")
    }
  
  const result = await userModel.findUserByLineId(line_id)

  // res.json(result)
  if(!result){
    res.status(200).json({
      newUser: true,
      message: "ยังไม่ได้ ลงทะเบียน"
    })
  } else {
    res.status(200).json({
      newUser: false,
      message:"ลงทะเบียนแล้ว"
    })
  }

  } catch(error){
    res.status(500).json({
      message: "Server Error",
      error: error.message
    })
  }
}

module.exports = { registerUser , checkUser}