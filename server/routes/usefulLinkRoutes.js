const express = require("express");
const router = express.Router();
const usefulLinkController = require("../controllers/usefulLinkController");
const uploadUsefulLink = require("../middleware/uploadUsefulLink");

router.get("/", usefulLinkController.getUsefulLinks);
router.post("/", uploadUsefulLink, usefulLinkController.createUsefulLink);
router.put("/:id", uploadUsefulLink, usefulLinkController.updateUsefulLink);
router.delete("/:id", usefulLinkController.deleteUsefulLink);

module.exports = router;
