const Blog = require("../model/blog");
const Quiz = require("../model/quiz");
const Testimonial = require("../model/testimonial");

exports.getBlogs = async (req, res) => {
    try {
        const blogs = await Blog.findAll();
        res.json(blogs);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch blogs" });
    }
};

exports.getQuizzes = async (req, res) => {
    try {
        const quizzes = await Quiz.findAll();
        res.json(quizzes);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch quizzes" });
    }
};

exports.getTestimonials = async (req, res) => {
    try {
        const testimonials = await Testimonial.findAll();
        console.log("Fetched testimonials count:", testimonials.length);
        res.json(testimonials);
    } catch (error) {
        console.error("Error fetching testimonials:", error);
        res.status(500).json({ error: "Failed to fetch testimonials" });
    }
};
