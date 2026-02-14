const express = require("express");
const router = express.Router();
const resourceController = require("../controllers/resourceController");

router.get("/blogs", resourceController.getBlogs);
router.get("/quizzes", resourceController.getQuizzes);
router.get("/testimonials", resourceController.getTestimonials);

module.exports = router;
