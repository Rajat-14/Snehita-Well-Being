const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const upload = require("../config/uploadConfig");

// User routes
router.post("/user/register", authController.register);
router.post("/user/login", authController.login);
router.post("/user/sendotp", authController.sendOtp);
router.post("/user/sendloginotp", authController.sendLoginOtp);
router.post("/user/otpverify", authController.otpVerify);
router.post("/user/newpassword", authController.changePassword);

// Global auth routes
router.get("/login/success", authController.getLoginSuccess);
router.get("/logout", authController.logout);

router.put("/user/profile", upload.single('profilePic'), authController.updateProfile);
router.post("/user/upload-profile-pic", upload.single('profilePic'), authController.uploadProfilePic);
router.get("/user/profile-pic/:userId", authController.getUserProfilePic);

module.exports = router;

