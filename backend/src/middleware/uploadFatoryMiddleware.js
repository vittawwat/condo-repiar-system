const multer = require("multer")
const path = require("path")

const createStorage = (folder) => 
  multer.diskStorage({
  destination: `uploads/${folder}/`,
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9)
    cb(null, uniqueName + path.extname(file.originalname))
  }
})

const createUploader = (folder, limitMB = 5) => 
multer({
  storage: createStorage(folder),
  limits: { fileSize: limitMB * 1024 * 1024 }
})


module.exports = { createUploader }