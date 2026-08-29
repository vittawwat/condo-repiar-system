const { debug } = require("util");
const technicianModel = require("../models/technicianModel");
const fs = require("fs")

async function createTechnician(req, res) {
  const file = req.file
  try {
    const { firstname, lastname, phone, skill } = req.body
    const profile_image_url = file ? file.filename : null
    console.log("profile_image_url",profile_image_url);

    if( !firstname || !lastname || !phone || !skill ){

      if (file) fs.unlinkSync(file.path)
      console.log("file.path",file.path);
        
      return res.status(400).json({
      success: false,
      message: "Please fill in all the information."
      })
    }

    const result = await technicianModel.createTechnician(firstname, lastname, phone, skill, profile_image_url)
    
    return res.status(201).json({
      success: true,
      message: "Create technician success"
    })

  } catch (error) {
    if (file) {
      fs.unlinkSync(file.path)
    }
    return res.status(500).json({
      success: false,
      message: "Server Error",
      debug: error.message
    });
  }
}

// อัพเดตข้อมูลช่าง
async function updateTechnician(req, res) {
  const file = req.file
  try {
    const { technician_id } = req.params
    const { firstname, lastname, phone, skill } = req.body
    // const file = req.file
    // const filename = file.filename
    // console.log("file", file);
    // console.log("filename", file.filename);
    

    const technician = await technicianModel.getTechnicianById(technician_id)
    if (!technician) {
      if (file) fs.unlinkSync(file.path)
      return res.status(404).json({ message: "ไม่พบข้อมูลช่าง" })
    }
    
    let profile_image_url = technician.profile_image_url

    // ลบรูปเก่าก่อนถ้ามี
    if(file){
      profile_image_url = file.filename

    if (technician.profile_image_url) {
      fs.unlinkSync(`uploads/technicians/${technician.profile_image_url}`)
    }
    } else {
      profile_image_url = technician.profile_image_url
    }

    await technicianModel.updateTechnician(technician_id, firstname, lastname, phone, skill, profile_image_url )

    return res.status(200).json({ message: "แก้ไขข้อมูลสำเร็จ" })

  } catch (error) {
    if (file) fs.unlinkSync(file.path)
    return res.status(500).json({ message: "Server Error", debug: error.message })
  }
}

async function getTechnicians(req, res) {
  try{
    const technicians = await technicianModel.getAllTechnicians()

    return res.status(200).json({
      message: true,
      Alltechnicians: technicians
    })
  } catch(error){
    return res.status(500).json({ 
      message: "Server Error",
      debug: error.message
    })
  }
}

module.exports = { createTechnician, updateTechnician, getTechnicians }