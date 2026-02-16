const express = require("express");
const router = express.Router();
const achievementController = require("../controllers/achievementController");
const organizationInfoController = require("../controllers/organizationInfoController");
const messageController = require("../controllers/messageController");
const contactDetailController = require("../controllers/contactDetailController");
const teamMemberController = require("../controllers/teamMemberController");

// Achievement routes
router.get("/achievements", achievementController.getAchievements);
router.get("/achievement/:id", achievementController.getAchievementById);
router.post("/achievement", achievementController.createAchievement);
router.put("/achievement/:id", achievementController.updateAchievement);
router.delete("/achievement/:id", achievementController.deleteAchievement);

// Organization Info routes
router.get("/organization-info/type/:type", organizationInfoController.getOrganizationInfoByType);
router.get("/organization-info", organizationInfoController.getAllOrganizationInfo);
router.post("/organization-info", organizationInfoController.createOrganizationInfo);
router.put("/organization-info/:id", organizationInfoController.updateOrganizationInfo);
router.delete("/organization-info/:id", organizationInfoController.deleteOrganizationInfo);

// Message routes
router.get("/messages/type/:type", messageController.getMessagesByType);
router.get("/messages", messageController.getAllMessages);
router.get("/message/:id", messageController.getMessageById);
router.post("/message", messageController.createMessage);
router.put("/message/:id", messageController.updateMessage);
router.delete("/message/:id", messageController.deleteMessage);

// Contact Detail routes
router.get("/contact-details", contactDetailController.getAllContactDetails);
router.get("/contact-detail/:id", contactDetailController.getContactDetailById);
router.post("/contact-detail", contactDetailController.createContactDetail);
router.put("/contact-detail/:id", contactDetailController.updateContactDetail);
router.delete("/contact-detail/:id", contactDetailController.deleteContactDetail);

// Team Member routes
router.get("/team-members", teamMemberController.getTeamMembers);
router.get("/team-members/type/:type", teamMemberController.getTeamMembersByType);
router.get("/team-member/:id", teamMemberController.getTeamMemberById);
router.post("/team-member", teamMemberController.createTeamMember);
router.put("/team-member/:id", teamMemberController.updateTeamMember);
router.delete("/team-member/:id", teamMemberController.deleteTeamMember);

// Counselor routes
const counselorController = require("../controllers/counselorController");
router.get("/counselors", counselorController.getAllCounselors);

module.exports = router;
