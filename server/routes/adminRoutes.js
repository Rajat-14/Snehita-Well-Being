const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const contactDetailController = require("../controllers/contactDetailController");
const isAdmin = require("../middleware/isAdmin");

const multer = require("multer");
const path = require("path");

// Configure multer for disk storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, "../uploads"));
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

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

// Upload endpoint
router.post("/upload", upload.single("image"), adminController.uploadImage);

module.exports = router;
