const { registerResident } = require("../../../controllers/residentController")
const userModel = require("../../../models/residentModel")

jest.mock("../../../models/residentModel")

let req
let res

beforeEach(() => {
  req = {
    body: {}
  }

  res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn()
  }

  jest.clearAllMocks()
})

 // ==========================
  // Missing Required Fields
  // ==========================
  test("should return 400 when required fields are missing", async () => {

    req.body = {
      line_id: "U123"
    }

    await registerResident(req, res)

    expect(res.status).toHaveBeenCalledWith(400)

    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Please fill in all the information."
    })

  })

  // ==========================
  // Register Success
  // ==========================
  test("should create resident successfully", async () => {

    req.body = {
      line_id: "U123",
      fullname: "Test User",
      room_number: "A101",
      phone: "0999999999"
    }

    userModel.registerResident.mockResolvedValue({
      insertId: 1
    })

    await registerResident(req, res)

    expect(userModel.registerResident)
      .toHaveBeenCalledWith(
        "U123",
        "Test User",
        "A101",
        "0999999999"
      )

    expect(res.status).toHaveBeenCalledWith(201)

    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: "Create user success"
    })

  })

  // ==========================
  // Duplicate User
  // ==========================
  test("should return 400 when user already exists", async () => {

    req.body = {
      line_id: "U123",
      fullname: "Test User",
      room_number: "A101",
      phone: "0999999999"
    }

    userModel.registerResident.mockRejectedValue({
      errno: 1062
    })

    await registerResident(req, res)

    expect(res.status).toHaveBeenCalledWith(400)

    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "User already exists"
    })

  })

  // ==========================
  // Server Error
  // ==========================
  test("should return 500 when database error occurs", async () => {

    req.body = {
      line_id: "U123",
      fullname: "Test User",
      room_number: "A101",
      phone: "0999999999"
    }

    userModel.registerResident.mockRejectedValue(
      new Error("Database Error")
    )

    await registerResident(req, res)

    expect(res.status).toHaveBeenCalledWith(500)

    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Server Error",
      debug: "Database Error"
    })

  })