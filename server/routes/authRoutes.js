const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

// User routes
router.post("/user/register", authController.register);
router.post("/user/login", authController.login);
router.post("/user/sendotp", authController.sendOtp);
router.post("/user/sendotppassword", authController.sendOtpForgotPassword);
router.post("/user/otpverify", authController.otpVerify);
router.post("/user/newpassword", authController.changePassword);

// Global auth routes
router.get("/login/success", authController.getLoginSuccess);
router.get("/logout", authController.logout);

module.exports = router;
