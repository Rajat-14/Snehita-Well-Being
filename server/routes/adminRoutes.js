const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const contactDetailController = require("../controllers/contactDetailController");
const isAdmin = require("../middleware/isAdmin");

const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Helper: create a multer instance for a given subfolder
const makeUploader = (subfolder) => {
    const dest = path.join(__dirname, "../uploads", subfolder);
    if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
    const storage = multer.diskStorage({
        destination: (req, file, cb) => cb(null, dest),
        filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
    });
    return multer({ storage });
};

const uploadGeneral = makeUploader("");          // General (existing)
const uploadAchievement = makeUploader("achievements");
const uploadTestimonial = makeUploader("testimonials");

// Admin Middleware applies to all nested routes
router.use(isAdmin);

// Organization Info
router.get("/org-info", adminController.getOrgInfo);
router.post("/org-info", adminController.addOrgInfo);
router.post("/org-info/reorder", adminController.reorderOrgInfo);
router.put("/org-info/:id", adminController.updateOrgInfo);
router.delete("/org-info/:id", adminController.deleteOrgInfo);

// Team Members
router.get("/team", adminController.getTeamMembers);
router.post("/team", adminController.addTeamMember);
router.post("/team/reorder", adminController.reorderTeamMembers);
router.put("/team/:id", adminController.updateTeamMember);
router.delete("/team/:id", adminController.deleteTeamMember);

// Contact Details (admin-protected)
router.get("/contact-details", contactDetailController.getAllContactDetails);
router.post("/contact-details", contactDetailController.createContactDetail);
router.put("/contact-details/:id", contactDetailController.updateContactDetail);
router.delete("/contact-details/:id", contactDetailController.deleteContactDetail);

// Upload endpoints
router.post("/upload", uploadGeneral.single("image"), adminController.uploadImage);
router.post("/upload/achievement", uploadAchievement.single("image"), adminController.uploadImage);
router.post("/upload/testimonial", uploadTestimonial.single("image"), adminController.uploadImage);

// Achievements (admin)
router.get("/achievements", adminController.getAchievements);
router.post("/achievement", adminController.addAchievement);
router.put("/achievement/:id", adminController.updateAchievement);
router.delete("/achievement/:id", adminController.deleteAchievement);

// Testimonials (admin)
router.get("/testimonials", adminController.getTestimonials);
router.post("/testimonial", adminController.addTestimonial);
router.put("/testimonial/:id", adminController.updateTestimonial);
router.delete("/testimonial/:id", adminController.deleteTestimonial);

module.exports = router;

