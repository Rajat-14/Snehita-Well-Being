const Blog = require("../model/blog");
const Quiz = require("../model/quiz");
const Testimonial = require("../model/testimonial");

const Counselor = require("../model/counselor");

exports.getBlogs = async (req, res) => {
    try {
        const blogs = await Blog.findAll();
        res.json(blogs);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch blogs" });
    }
};

exports.getCounselors = async (req, res) => {
    try {
        const counselors = await Counselor.findAll();
        res.status(200).json(counselors);
    } catch (error) {
        console.error("Error fetching counselors:", error);
        res.status(500).json({ error: "Failed to fetch counselors" });
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

exports.createBlog = async (req, res) => {
    try {
        const { title, content, type, link } = req.body;

        // Map types to folder names (Must match upload middleware)
        const folderMap = {
            "Anxiety": "Anxiety",
            "Anger": "Anger",
            "Habit": "habit",
            "Goals Setting": "motivation",
            "Stress": "stress",
            "Depression": "depression",
            "Internet Usage": "internetUsage",
            "Time-Management": "timeManagement",
            "Sleep and Body Image": "sleep"
        };

        const folderName = folderMap[type] || type;

        // If file exists, save path as "FolderName/Filename"
        const pic = req.file ? `${folderName}/${req.file.filename}` : 'default.jpg';

        const newBlog = await Blog.create({
            title,
            content,
            type,
            link,
            pic
        });

        res.status(201).json(newBlog);
    } catch (error) {
        console.error("Error creating blog:", error);
        res.status(500).json({ error: "Failed to create blog" });
    }
};

exports.deleteBlog = async (req, res) => {
    try {
        const { id } = req.params;
        const blog = await Blog.findByPk(id);

        if (!blog) {
            return res.status(404).json({ error: "Blog not found" });
        }

        await blog.destroy();
        res.json({ message: "Blog deleted successfully" });
    } catch (error) {
        console.error("Error deleting blog:", error);
        res.status(500).json({ error: "Failed to delete blog" });
    }
};
