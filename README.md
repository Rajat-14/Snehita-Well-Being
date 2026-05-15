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

```bash
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

OS used - Linux , Windows , MAC OS (any will do)
Software - Docker, Postgres 

### 1️⃣ Clone the Repository

```bash
git clone <your-repo-link>
cd Snehita-Well-Being
```

---

### 2️⃣ Environment Setup

Create a `.env` file inside the backend directory:

```env
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

## 🌐 Production Deployment

The application is live and publicly accessible at:

> **🔗 https://iitrpr.ac.in/snehita-well-being**

Hosted on the **IIT Ropar institutional server**.

---

### 🏛️ Deployment Architecture

```text
                        Internet
                           │
                    ┌──────▼──────┐
                    │    NGINX    │  (Port 80 / 443 — HTTPS)
                    │ Web Server  │
                    └──────┬──────┘
                           │
              ┌────────────┴────────────┐
              │                         │
     Static Files                Reverse Proxy
  (React Build /dist)         (API requests → /api/*)
              │                         │
     Served directly            ┌───────▼───────┐
                                │  Node.js API  │
                                │  (Express.js) │
                                │  via PM2      │
                                └───────┬───────┘
                                        │
                                ┌───────▼───────┐
                                │  PostgreSQL   │
                                │   Database    │
                                └───────┬───────┘
```

---

### ⚙️ Services & Process Management

| Service | Technology | Manager |
|---|---|---|
| Frontend (static files) | React (production build) | Nginx |
| Backend API | Node.js / Express.js | PM2 |
| Reverse Proxy | Nginx | systemd |
| Database | PostgreSQL | systemd |

#### Nginx

- Serves the React production build (`client/build/`) as static files
- Proxies all `/api/*` requests to the Node.js backend
- Handles HTTPS termination

#### PM2

- Keeps the Node.js backend running persistently across server reboots
- Automatically restarts the process on crashes

---

### 🛠️ Common Maintenance Commands

#### PM2 — Backend Process

```bash
# View running processes
pm2 list

# Restart the backend
pm2 restart snehita-backend

# View live logs
pm2 logs snehita-backend

# Stop the backend
pm2 stop snehita-backend

# Save process list to survive reboots
pm2 save
```

#### Nginx

```bash
# Test configuration syntax
sudo nginx -t

# Reload configuration (no downtime)
sudo systemctl reload nginx

# Restart Nginx
sudo systemctl restart nginx

# View Nginx error logs
sudo tail -f /var/log/nginx/error.log
```

#### Deploying Updates

```bash
# 1. Pull latest changes
git pull origin main

# 2. Install backend dependencies (if changed)
cd server && npm install

# 3. Rebuild frontend
cd ../client && npm install && npm run build

# 4. Restart backend
pm2 restart snehita-backend
```

---

### 🔍 Search Engine Optimization (SEO)

The application has been optimized for search engine discoverability:

- Proper `<title>` tags and meta descriptions on all pages
- Semantic HTML structure with correct heading hierarchy (`h1` → `h2` → `h3`)
- Open Graph and relevant meta tags for social sharing
- Canonical URLs configured

✅ The website appears in Google search results for **"Snehita Well Being IIT Ropar"**.

---
