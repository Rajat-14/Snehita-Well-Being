# Snehita Well-Being Platform - Complete Architecture Overview

## 🏗️ Project Structure (3-Tier Architecture)

```
┌─────────────────────────────────────────────────────────────────┐
│                      CLIENT (React.js)                          │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ Components │ Redux Store │ Routes │ Services (API Calls)│   │
│  └──────────────────────────────────────────────────────────┘   │
└────────────────────┬────────────────────────────────────────────┘
                     │ HTTP/HTTPS Requests (Port 3000)
                     │ REST API Endpoints
                     │
┌────────────────────▼────────────────────────────────────────────┐
│                   SERVER (Node.js + Express)                    │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ Routes │ Controllers │ Middleware │ Authentication (JWT) │   │
│  └──────────────────────────────────────────────────────────┘   │
└────────────────────┬────────────────────────────────────────────┘
                     │ Sequelize ORM Queries (Port 8000)
                     │
┌────────────────────▼────────────────────────────────────────────┐
│              DATABASE (PostgreSQL)                              │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ Users │ Counselors │ Appointments │ Blogs │ Quizzes      │   │
│  │ Teams │ Resources │ Achievements │ Contact │ Admin       │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📱 FRONTEND STRUCTURE (React.js)

### Directory Layout
```
client/src/
├── index.js                    # React Root (Redux Provider + Router)
├── index.css                   # Global Styles
├── components/                 # UI Components (44+ components)
│   ├── aboutUs/               # About Us Pages
│   ├── aboutWebsite/          # Website Info
│   ├── admin/                 # Admin Dashboard & Login
│   │   ├── AdminLogin.jsx
│   │   └── AdminDashboard.jsx
│   ├── appointment/           # Appointment Features
│   │   ├── appointment.js     # Main Appointment Component
│   │   ├── ClientAppointment.js
│   │   ├── CounselorAnalytics.js   # Counselor Dashboard
│   │   └── CounselorDashboard.js
│   ├── blogs/                 # Blog Display & Management
│   ├── home/                  # Landing Page
│   ├── login_signup/          # Authentication
│   │   ├── login/Login.jsx
│   │   ├── signup/Register.jsx
│   │   ├── Profile.jsx
│   │   ├── otp/otp.jsx
│   │   └── forgotPassword/
│   ├── FunQuizzes/           # Mental Health Quizzes (15+ quizzes)
│   │   ├── SleepQuiz
│   │   ├── AngerQuiz
│   │   ├── AnxietyQuiz
│   │   ├── DepressionTest
│   │   ├── StressQuiz
│   │   ├── HappinessQuiz
│   │   └── ... (more quizzes)
│   ├── TeamPage/             # Team & Counselors Display
│   ├── contactUs/            # Contact Form
│   ├── services/             # Services Info
│   ├── layout/               # Layout Wrapper & Navigation
│   ├── common/               # Reusable Components
│   ├── assets/               # Static Images & Icons
│   │   ├── AchievementsPhotos/
│   │   ├── BlogsPics/
│   │   └── ...
│   └── templates/
└── redux/                      # State Management
    ├── store/index.js         # Redux Store Configuration
    ├── actions/               # Action Creators
    ├── reducers/              # Reducer Functions
    └── (Global State for: User, Appointments, Theme, etc.)
```

### Frontend Key Features:
- **Routing**: React Router v6 - handles navigation between pages
- **State Management**: Redux Toolkit - manages:
  - User authentication state
  - Appointment data
  - UI state (loading, errors)
  - User profiles
- **Lazy Loading**: Components are lazily loaded for better performance
- **Responsive Design**: Mobile-first CSS approach

---

## 🖥️ BACKEND STRUCTURE (Node.js + Express)

### Server Architecture
```
server/
├── app.js                    # Express Server Entry Point
├── config/
│   ├── emailConfig.js        # Email Service (Nodemailer)
│   └── uploadConfig.js       # File Upload Configuration (Multer)
├── db/
│   ├── database.js           # Sequelize Connection to PostgreSQL
│   └── jwt.config.js         # JWT Authentication Middleware
├── model/                    # Database Models (Sequelize ORM)
│   ├── userSchema.js         # User Model
│   ├── counselor.js          # Counselor Model
│   ├── appointment.js        # Appointment Model
│   ├── blog.js               # Blog Model
│   ├── quiz.js               # Quiz Model
│   ├── achievement.js        # Achievement Model
│   ├── role.js               # Role/Admin Model
│   ├── teamMember.js         # Team Member Model
│   ├── contactDetail.js      # Contact Information
│   ├── organizationInfo.js   # Org Details
│   ├── testimonial.js        # User Testimonials
│   └── userOtp.js            # OTP for Email Verification
├── controllers/              # Business Logic
│   ├── authController.js     # Authentication Logic
│   ├── appointmentController.js
│   ├── counselorController.js
│   ├── mediaController.js    # File/Image Handling
│   ├── adminController.js
│   ├── resourceController.js
│   ├── messageController.js
│   └── ... (more controllers)
├── routes/                   # API Endpoints
│   ├── authRoutes.js         # Auth endpoints
│   ├── appointmentRoutes.js  # Appointment endpoints
│   ├── adminRoutes.js        # Admin endpoints
│   ├── resourceRoutes.js     # Resource endpoints
│   ├── mediaRoutes.js        # Media endpoints
│   └── infoRoutes.js         # Info endpoints
├── middleware/
│   ├── isAdmin.js            # Admin Authorization Middleware
│   └── upload.js             # File Upload Middleware
├── uploads/                  # Stored Files
│   ├── achievements/
│   └── team/buddies/
└── package.json              # Node.js Dependencies
```

### Backend Key Technologies:
- **Framework**: Express.js (Web server)
- **Database ORM**: Sequelize (PostgreSQL)
- **Authentication**: JWT (JSON Web Tokens)
- **File Upload**: Multer
- **Email**: Nodemailer
- **Validation**: Validator.js
- **Password Encryption**: Bcrypt

---

## 🗄️ DATABASE MODELS & RELATIONSHIPS

### Core Models:

#### 1. **User Model** (Users/Patients)
```
- id (Primary Key)
- person_name
- email (Unique)
- mobileNumber
- gender
- profilePic (Base64)
- isStarred (marked by counselors)
- timestamps (createdAt, updatedAt)
```

#### 2. **Counselor Model**
```
- id (Primary Key)
- name
- email (Foreign Key → Role.email)
- createdAt, updatedAt
```
**Relationship**: Counselor → Role (One-to-One)

#### 3. **Appointment Model**
```
- id (Primary Key)
- User Information:
  - fullName, email, mobileNumber, age, gender
- Problem Details:
  - problemDescription, problemExtent, problemRelatedWith, modeOfReferral
- Appointment Details:
  - appointmentDate, timeSlot, counselorName
- Status Management:
  - status (pending, confirmed, rejected, completed, blocked, resolved, followup, postponed, absent)
  - notes (counselor's session notes)
  - rejectionNote
- userId (Foreign Key → User.id)
- Timestamps
```

#### 4. **Role Model** (Admin/Counselor Credentials)
```
- email (Primary Key)
- password (Bcrypt hashed)
- role (admin, counselor)
- createdAt, updatedAt
```

#### 5. **Blog Model**
```
- id, title, content, author
- images/media
- timestamps
```

#### 6. **Quiz Model**
```
- id, title, questions, answers
- Stores quiz templates
```

#### 7. **Achievement Model**
```
- id, title, description, image
- Employee achievements/testimonials
```

#### 8. **TeamMember Model**
```
- id, name, designation, image
- profileLink
- timestamps
```

#### 9. **ContactDetail Model**
```
- id, email, phone, address, socialLinks
- Organization contact information
```

#### 10. **OrganizationInfo Model**
```
- id, name, description, logo, details
- Organization metadata
```

#### 11. **UserOtp Model**
```
- id, email, otp, expiresAt
- Temporary OTP storage for email verification
```

#### 12. **Testimonial Model**
```
- id, userId, content, rating
- User reviews and feedback
```

### Database Relationships:
```
Role ──1:1──> Counselor
User ──1:Many──> Appointment
User ──1:Many──> Testimonial
```

---

## 🔌 API ENDPOINTS & FLOW

### Authentication Routes (`/authRoutes.js`)
```
POST   /user/register           → Register new user
POST   /user/login              → User login
POST   /user/sendotp            → Send OTP to email
POST   /user/otpverify          → Verify OTP
POST   /user/newpassword        → Change password
GET    /login/success           → Check if logged in
GET    /logout                  → Logout user
PUT    /user/profile            → Update profile
PUT    /user/star/:userId       → Counselor marks user as starred
POST   /user/upload-profile-pic → Upload profile picture
GET    /user/profile-pic/:userId → Fetch profile picture
```

### Appointment Routes (`/appointmentRoutes.js`)
```
POST   /create                           → Create appointment
GET    /data                             → Get all user's appointments
POST   /send-email                       → Send appointment email
GET    /bookedSlots                      → Get available time slots
GET    /counselor/appointments           → Get counselor's appointments
GET    /counselor/analytics              → Get counselor analytics
PUT    /status/:id                       → Update appointment status
PUT    /notes/:id                        → Add counselor notes
GET    /counselor/patient-history/:userId → Patient appointment history
PUT    /appointment/:id/reschedule       → Reschedule appointment
POST   /counselor/block-slot             → Block specific time slot
POST   /counselor/unblock-slot           → Unblock time slot
POST   /counselor/block-day              → Block entire day
POST   /counselor/unblock-day            → Unblock day
GET    /public-availability              → Get counselor availability (public)
```

### Resource Routes (`/resourceRoutes.js`)
```
Endpoints for blogs, quizzes, resources
```

### Admin Routes (`/adminRoutes.js`)
```
Admin dashboard, user management, appointment management
```

### Media Routes (`/mediaRoutes.js`)
```
File upload/download endpoints
```

### Info Routes (`/infoRoutes.js`)
```
Website information, team, achievements, testimonials
```

---

## 🔐 AUTHENTICATION & SECURITY FLOW

### Authentication Pipeline:
```
User (Client)
    │
    ├─ Enters credentials
    │
    └──────────────────────────────────────┐
                                           │
Frontend (React)                           │
    │                                      │
    ├─ Sends POST /user/login             │
    │  with email & password              │
    │                                      │
    └──────────────────────────────────────┤
                                           │
Express Server                            │
    │◄──────────────────────────────────────┘
    │
    ├─ authController.login()
    │
    ├─ Query: User.findOne({ where: { email } })
    │
    ├─ Verify: bcrypt.compare(password, hashedPassword)
    │
    ├─ Generate JWT Token (via jwt.config.js)
    │
    └─ Response: { token, user_data }
         │
         └──────────────────────────────────────┐
                                               │
Frontend Redux Store                          │
    │◄──────────────────────────────────────────┘
    │
    ├─ Save token in Redux state
    │
    ├─ Save token in localStorage (for persistence)
    │
    └─ Set Authorization header for future requests
         │
         └──────────────────────────────────────┐
                                               │
All Protected API Calls                       │
    │◄──────────────────────────────────────────┘
    │
    ├─ Include "Authorization: Bearer <token>"
    │
    └─────────────────────────────────────────┐
                                             │
Express Middleware (authenticate)            │
    │◄────────────────────────────────────────┘
    │
    ├─ Verify JWT token
    │
    ├─ Extract userId from token
    │
    └─ Allow/Deny request
```

### JWT Implementation:
- **Algorithm**: HS256 (HMAC with SHA-256)
- **Payload**: userId, email, role
- **Storage**: localStorage (client-side)
- **Sent With**: Authorization header as Bearer token
- **Verified By**: jwt.config.js middleware

---

## 📊 DATA FLOW EXAMPLE: APPOINTMENT BOOKING

```
STEP 1: User fills appointment form
┌─────────────────────────────┐
│ React Component             │
│ (appointment.js)            │
│ - Collects form data        │
│ - Validates input           │
│ - Calls API                 │
└──────────────┬──────────────┘
               │
               ├─ POST /create
               │ { fullName, email, appointmentDate, ... }
               │ Header: { Authorization: Bearer token }
               │
STEP 2: Server receives request
┌──────────────────────────────────────┐
│ Express + Middleware                 │
│ 1. authenticate middleware           │
│    - Verify JWT token                │
│    - Extract userId                  │
│                                      │
│ 2. appointmentController.create()    │
│    - Validate data                   │
│    - Check counselor availability    │
│                                      │
│ 3. Query Database                    │
│    - Appointment.create()            │
│    - Save to DB                      │
│                                      │
│ 4. Send Response                     │
│    - Return appointment ID           │
│    - Return status: 'pending'        │
└──────────────┬───────────────────────┘
               │
               ├─ Response: { id, status, message }
               │
STEP 3: Frontend receives response
┌──────────────────────────┐
│ React Component          │
│ - Dispatch Redux action  │
│ - Update UI              │
│ - Show confirmation      │
│ - Redirect to dashboard  │
└──────────────────────────┘

STEP 4: Database stores appointment
┌──────────────────────────────┐
│ PostgreSQL Table             │
│ Appointments                 │
│ ├─ id: auto-increment        │
│ ├─ userId: from JWT          │
│ ├─ appointmentDate: [date]   │
│ ├─ status: 'pending'         │
│ ├─ counselorName: [name]     │
│ ├─ createdAt: timestamp      │
│ └─ ...other fields           │
└──────────────────────────────┘
```

---

## 🔄 API CALL FLOW WITH DATABASE

### Generic Request Flow:
```
┌──────────────────────────────────────────────────────────┐
│  CLIENT (React - /components/*)                          │
│  └─ Makes API call: axios.post('/endpoint', data)       │
└──────────────────┬───────────────────────────────────────┘
                   │ HTTP Request
                   │ Headers: { Authorization: Bearer JWT }
                   │ Body: { data fields }
                   │
┌──────────────────▼───────────────────────────────────────┐
│  SERVER (Express - app.js)                              │
│  ├─ Route Matching (app.use('/route', router))          │
│  ├─ Middleware Chain:                                   │
│  │  1. CORS Middleware                                  │
│  │  2. Body Parser (JSON)                               │
│  │  3. Cookie Parser                                    │
│  │  4. Session Middleware                               │
│  │                                                       │
│  ├─ Route Handler (routes/*.js)                         │
│  │  └─ authenticate middleware (JWT verification)       │
│  │                                                       │
│  ├─ Controller Logic (controllers/*.js)                 │
│  │  └─ Validate & process data                          │
└──────────────────┬───────────────────────────────────────┘
                   │ Sequelize ORM
                   │ Query: Model.findAll(), .create(), etc
                   │
┌──────────────────▼───────────────────────────────────────┐
│  DATABASE (PostgreSQL)                                  │
│  └─ Tables with relationships                           │
│     ├─ SELECT/INSERT/UPDATE/DELETE operations          │
│     └─ Return results to controller                     │
└──────────────────┬───────────────────────────────────────┘
                   │ Query Result
                   │
┌──────────────────▼───────────────────────────────────────┐
│  CONTROLLER                                             │
│  ├─ Process results                                    │
│  ├─ Format response                                    │
│  ├─ res.json({ data, status })                        │
└──────────────────┬───────────────────────────────────────┘
                   │ HTTP Response
                   │ Status: 200, 400, 401, 404, 500
                   │ Body: { data, message }
                   │
┌──────────────────▼───────────────────────────────────────┐
│  FRONTEND (React)                                       │
│  ├─ Receive response                                   │
│  ├─ Dispatch Redux action                              │
│  ├─ Update component state                             │
│  ├─ Re-render UI                                       │
└──────────────────────────────────────────────────────────┘
```

---

## 🚀 REQUEST EXAMPLES

### Example 1: Login Request
```
CLIENT REQUEST:
POST http://localhost:8000/user/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123"
}

SERVER PROCESSING:
1. authController.login()
2. User.findOne({ where: { email } })
3. bcrypt.compare(password, hashed_password)
4. JWT token generation
5. Response sent

SERVER RESPONSE:
{
  "message": "Login Successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 5,
    "person_name": "John Doe",
    "email": "user@example.com"
  }
}

CLIENT SIDE:
- Store token in localStorage
- Set Redux state
- Redirect to dashboard
```

### Example 2: Create Appointment
```
CLIENT REQUEST:
POST http://localhost:8000/create
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "fullName": "Jane Smith",
  "email": "jane@example.com",
  "mobileNumber": "9876543210",
  "appointmentDate": "2024-04-15",
  "timeSlot": "10:00 AM - 10:30 AM",
  "counselorName": "Dr. Smith",
  "problemDescription": "Anxiety issues",
  "problemExtent": "Moderate"
}

SERVER PROCESSING:
1. Authenticate middleware verifies JWT
2. appointmentController.createAppointment()
3. Validate appointment details
4. Check counselor availability
5. Appointment.create() in database
6. Send confirmation email (via Nodemailer)

SERVER RESPONSE:
{
  "message": "Appointment created successfully",
  "appointment": {
    "id": 42,
    "userId": 5,
    "appointmentDate": "2024-04-15",
    "timeSlot": "10:00 AM - 10:30 AM",
    "status": "pending",
    "counselorName": "Dr. Smith",
    "createdAt": "2024-03-30T10:30:00Z"
  }
}

CLIENT SIDE:
- Dispatch Redux action (ADD_APPOINTMENT)
- Show success toast notification
- Redirect to appointment confirmation page
```

### Example 3: Fetch Counselor Analytics
```
CLIENT REQUEST:
GET http://localhost:8000/counselor/analytics
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

SERVER PROCESSING:
1. Authenticate middleware verifies JWT
2. appointmentController.getAnalyticsData()
3. Query appointments for counselor:
   - COUNT total appointments
   - COUNT by status (pending, confirmed, completed)
   - GROUP BY date for trend analysis
4. Aggregate results

SERVER RESPONSE:
{
  "totalAppointments": 156,
  "byStatus": {
    "pending": 12,
    "confirmed": 45,
    "completed": 89,
    "rejected": 10
  },
  "thisMonth": 34,
  "completionRate": 87.5
}

CLIENT SIDE:
- Dispatch Redux action (UPDATE_ANALYTICS)
- CounselorAnalytics component renders charts
- Display metrics on dashboard
```

---

## 📂 FILE UPLOAD FLOW

```
User uploads profile picture
│
├─ React sends FormData to /user/upload-profile-pic
│  └─ Multer middleware (upload.single('profilePic'))
│
├─ File stored in server/uploads/profilePics/
│
├─ Path saved in User model
│
└─ Frontend fetches via /user/profile-pic/:userId
   └─ Server serves static file from uploads directory
```

---

## 🐳 DEPLOYMENT (Docker)

```
Docker Structure:
├── docker-compose.yml
├── backend/Dockerfile    (Node.js container)
└── frontend/Dockerfile   (React/Nginx container)

Containers:
1. Backend (Port 8000)
   - Node.js + Express
   - Connected to PostgreSQL

2. Frontend (Port 3000)
   - React app served by Nginx
   - Makes API calls to backend

3. PostgreSQL (Port 5432)
   - Persists data
```

---

## 🔗 KEY INTEGRATION POINTS

1. **Frontend → Backend**: REST API calls via axios
2. **Backend → Database**: Sequelize ORM queries
3. **Authentication**: JWT tokens verify user identity
4. **File Storage**: Multer handles uploads, served as static files
5. **Email**: Nodemailer sends appointment confirmations
6. **State Management**: Redux synchronizes UI with server data

---

## 📝 Summary

**Snehita Well-Being** is a **full-stack mental health platform** built with:
- **Frontend**: React with Redux state management
- **Backend**: Express.js with Sequelize ORM
- **Database**: PostgreSQL with 12+ interconnected tables
- **Security**: JWT-based authentication + Bcrypt passwords
- **Features**: Appointment booking, counselor analytics, quiz system, team/blog management

The architecture follows a **3-tier model** where the client interacts with REST APIs, controllers process logic, and database models persist data with proper relationships and validations.
