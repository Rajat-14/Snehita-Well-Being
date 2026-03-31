const express = require("express");
const router = express.Router();
const appointmentController = require("../controllers/appointmentController");
const { authenticate } = require("../db/jwt.config");

router.post("/create", authenticate, appointmentController.createAppointment);
router.get("/data", authenticate, appointmentController.getAppointments);
router.post("/send-email", authenticate, appointmentController.sendEmail);
router.get("/bookedSlots", authenticate, appointmentController.getBookedSlots);
router.get("/counselor/appointments", authenticate, appointmentController.getCounselorAppointments);
router.get("/counselor/analytics", authenticate, appointmentController.getAnalyticsData);
router.put("/status/:id", authenticate, appointmentController.updateAppointmentStatus);
router.put("/notes/:id", authenticate, appointmentController.updateAppointmentNotes);
router.post("/request-cancellation/:id", authenticate, appointmentController.requestCancellationEmail);
router.put("/appointment/:id/reschedule", authenticate, appointmentController.rescheduleAppointment);

router.get("/public-availability", appointmentController.getPublicCounselorAvailability); // Public endpoint, no auth required
router.get("/counselor/prior-count", authenticate, appointmentController.getPriorAppointmentCount);
router.get("/counselor/patient-history/:userId", authenticate, appointmentController.getPatientHistory);
router.post("/book-followup", authenticate, appointmentController.bookFollowUp);
router.get("/:id", authenticate, appointmentController.getAppointmentById);

router.post("/counselor/block-slot", authenticate, appointmentController.blockSlot);
router.post("/counselor/unblock-slot", authenticate, appointmentController.unblockSlot);

router.post("/counselor/block-day", authenticate, appointmentController.blockDay);
router.post("/counselor/unblock-day", authenticate, appointmentController.unblockDay);

module.exports = router;
