# Snehita Well-Being 🌿

A full-stack web application designed to support mental health and well-being through appointment scheduling and structured interaction between users and professionals.

---

## 📌 Overview

**Snehita Well-Being** provides a platform where users can connect with professionals and book appointments in a secure and user-friendly environment.

The system focuses on:

* Seamless appointment booking
* Secure authentication
* Clean and responsive interface
* Scalable backend architecture

---

## 🎯 Objectives

* Provide an accessible mental health support platform
* Enable easy appointment scheduling and management
* Ensure secure storage and handling of user data
* Deliver a smooth user experience

---

## 🏗️ Tech Stack

### Frontend

* React.js
* React Router

### Backend

* Node.js
* Express.js
* RESTful APIs

### Database

* PostgreSQL

### DevOps

* Docker & Docker Compose
* Environment configuration using `.env`

---

## 🗂️ Project Structure

```
Snehita-Well-Being/
│
├── frontend/
│   ├── src/
│   ├── components/
│
├── backend/
│   ├── routes/
│   ├── controllers/
│   ├── models/
│
├── infra/
│   ├── docker/
│   └── docker-compose.yml
│
└── README.md
```

---

## ⚙️ Features

### 👤 User Features

* User registration and login
* View available professionals
* Book and manage appointments
* Profile management

### 🩺 Admin / Professional Features

* Manage appointments
* View user details
* Update availability

---

## 🚀 Setup Instructions

### 1️⃣ Clone the Repository

```bash
git clone <your-repo-link>
cd Snehita-Well-Being
```

---

### 2️⃣ Environment Setup

Create a `.env` file inside the backend directory:

```
PORT=5000
DATABASE_URL=your_postgres_connection_string
MAIL=your_email_address
PASSWORD=your_email_password
SECRET=your_jwt_secret_key
BASE_URL=http://localhost:3001
```

---

### 3️⃣ Run Using Docker (Recommended)

```bash
docker-compose up --build
```

---

### 4️⃣ Run Manually

#### Backend

```bash
cd backend
npm install
npm start
```

#### Frontend

```bash
cd frontend
npm install
npm start
```

---

## 🔐 Security Features

* JWT-based authentication
* Protected API routes
* Environment-based configuration
* Secure password hashing

---

## 📊 System Design Highlights

* Modular MVC backend structure
* RESTful API architecture
* PostgreSQL relational database design
* Containerized deployment using Docker

---

## 🧪 Future Enhancements

* Real-time chat integration
* Appointment reminders
* Video consultation support
* Payment gateway integration
* Enhanced role-based access control

---


