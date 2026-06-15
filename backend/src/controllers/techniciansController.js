const technicianModel = require("../models/technicianModel");

async function createTechnicians(req, res) {
    try {
        const { name, phone, skill } = req.body

        const result = await technicianModel.createTechnician(name, phone, skill)

        res.status(201).json({
            success: true,
            message: "Create technician success"
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server Error",
            debug: err.message
        });
    }
}

module.exports = { createTechnicians }