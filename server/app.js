const express = require("express");
const path = require("path");
require("dotenv").config();
const Role = require("./model/role");
const Counselor = require("./model/counselor");
const Achievement = require("./model/achievement");
const OrganizationInfo = require("./model/organizationInfo");

const ContactDetail = require("./model/contactDetail");
const TeamMember = require("./model/teamMember");
const Blog = require("./model/blog");
const Quiz = require("./model/quiz");
const Testimonial = require("./model/testimonial");
const Appointment = require("./model/appointment");
const UsefulLink = require("./model/usefulLink");
const fs = require("fs");
const cors = require("cors");
const sequelize = require("./db/database");
const cookieParser = require("cookie-parser");
const session = require("express-session");

const app = express();
const PORT = process.env.PORT || 8000;
const BASE_URL = process.env.BASE_URL;

// Import Routes
const authRoutes = require("./routes/authRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");
const resourceRoutes = require("./routes/resourceRoutes");
const mediaRoutes = require("./routes/mediaRoutes");
const infoRoutes = require("./routes/infoRoutes");
const adminRoutes = require("./routes/adminRoutes");
const quizManagementRoutes = require("./routes/quizManagementRoutes");
const usefulLinkRoutes = require("./routes/usefulLinkRoutes");

// Middleware
const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',').map(url => url.trim()) 
  : ["http://localhost:3000", "http://localhost:3001", process.env.BASE_URL].filter(Boolean);

app.use(cors({
  credentials: true,
  origin: allowedOrigins
}));
app.use(express.json());
app.use(cookieParser());
// Debugging middleware for uploads
// Debugging middleware for uploads
app.use('/uploads', (req, res, next) => {
  const requestPath = req.path;
  console.log(`[Static] Request for: /uploads${requestPath}`);
  next();
});

// Serve Blog Images from Client Assets
const clientAssetsPath = path.join(__dirname, '../../client/src/components/assets/BlogsPics');
app.use('/uploads/blogs', express.static(clientAssetsPath));

// Serve Useful Links Images from Client Assets
const usefulLinkAssetsPath = path.join(__dirname, '../../client/src/components/assets/UsefullLinks');
app.use('/uploads/useful-links', express.static(usefulLinkAssetsPath));

// Serve Quiz Images from FunQuizzes assets (Docker mounted volume)
const quizAssetsPath = path.join(__dirname, '../../client/src/components/FunQuizzes/assets');
app.use('/api/quiz-assets', express.static(quizAssetsPath));

// Serve other uploads from server/uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.static('public'));  // For serving public assets

app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

// Mount Routes
app.use("/", authRoutes);
app.use("/", appointmentRoutes);
app.use("/api", resourceRoutes);
app.use("/api", infoRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/manage-quizzes", quizManagementRoutes);
app.use("/api/useful-links", usefulLinkRoutes);
app.use("/home", mediaRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
});

// Database Connection and Server Start
sequelize
  .sync({ alter: true })  // Sync models with database, updating schema as needed
  .then(() => {
    console.log("Database connected and synced");
    app.listen(PORT, () => {
      console.log(`server start at port no ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
    process.exit(1);
  });
