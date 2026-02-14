const express = require("express");
const router = express.Router();
const appointmentController = require("../controllers/appointmentController");
const { authenticate } = require("../db/jwt.config");

router.post("/create", authenticate, appointmentController.createAppointment);
router.get("/data", authenticate, appointmentController.getAppointments);
router.post("/send-email", authenticate, appointmentController.sendEmail);
router.get("/bookedSlots", authenticate, appointmentController.getBookedSlots);

module.exports = router;
