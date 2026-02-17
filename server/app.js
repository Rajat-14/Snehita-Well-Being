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

// Middleware
app.use(cors({
  credentials: true,
  origin: ["http://localhost:3000", "http://localhost:3001", process.env.BASE_URL].filter(Boolean)
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
