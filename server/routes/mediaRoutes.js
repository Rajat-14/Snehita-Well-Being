const express = require("express");
const router = express.Router();
const mediaController = require("../controllers/mediaController");

router.get("/video", mediaController.streamVideo);

module.exports = router;
