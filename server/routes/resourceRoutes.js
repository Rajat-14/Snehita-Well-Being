const express = require("express");
const router = express.Router();
const resourceController = require("../controllers/resourceController");

const upload = require('../middleware/upload');

router.get("/blogs", resourceController.getBlogs);
router.post("/blogs", upload, resourceController.createBlog);
router.delete("/blogs/:id", resourceController.deleteBlog);
router.get("/quizzes", resourceController.getQuizzes);
router.get("/testimonials", resourceController.getTestimonials);
router.get("/counselors", resourceController.getCounselors);

module.exports = router;
