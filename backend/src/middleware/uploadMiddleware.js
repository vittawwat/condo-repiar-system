const multer = require("multer")
const path = require("path")

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9)

    cb(null, uniqueName + path.extname(file.originalname))
  }
})

const upload = multer({
  storage,
  limits: {
    // files: 3,              // global limit (ทั้ง request)
    fileSize: 5 * 1024 * 1024
  }
}) 

const uploadImages = upload.array("images", 3)

const debugRaw = (req, res, next) => {
  console.log("files:", req.files)
  next()
}

module.exports = { uploadImages, debugRaw }