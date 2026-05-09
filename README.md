# 🚀 LeadFloww

LeadFloww is a microservices-based Lead Management System built for managing leads efficiently with a clean UI and scalable backend architecture.

---

# 🛠️ Tech Stack

- **Frontend:** Next.js, Tailwind CSS, Zustand
- **Auth Service:** Golang + JWT
- **Lead Service:** Node.js + Express
- **Database:** MongoDB Atlas
- **Deployment:** Docker, Nginx, AWS EC2
- **SSL:** Certbot

---

# 🏗️ Architecture

The project is divided into 3 services:

## Frontend Service
Built using Next.js with a modern pill-based UI.

### Features
- Login / Signup
- Dashboard
- Lead Management
- Fast Search Bar
- Search Text Highlighting
- Debounced Search
- Zustand for state management

---

## Auth Service (Golang + Gin)
Handles:
- User Authentication
- JWT Token Generation
- Secure Login & Signup

---

## Lead Service (Node.js)
Handles:
- Create / Update / Delete Leads
- Search Leads
- Notes Timeline

---

# 🗄️ Why MongoDB Atlas?

Initially MongoDB was running directly on the EC2 Free Tier server, but the server kept crashing because MongoDB consumed too much RAM.

To solve this, the database was moved to **MongoDB Atlas (Cloud Database)** which reduced server load and improved stability.

---

# 🐳 Docker Deployment

The application runs inside 3 Docker containers:

- Frontend Container
- Auth Service Container
- Lead Service Container

Docker makes deployment simple and keeps all services isolated.

Run the project:

```bash
docker-compose up -d --build
```

---

# 🌐 Deployment

- Hosted on AWS EC2
- Nginx used as Reverse Proxy
- Certbot used for HTTPS / SSL

### Routes

| Route | Service |
|---|---|
| `/` | Frontend |
| `/api/auth` | Auth Service |
| `/api/leads` | Lead Service |

---

# 📂 Folder Structure

```plaintext
lead-flow/
├── auth-service/
├── lead-service/
├── lead-webservice/
└── deployment/
```

---

# ✨ Main Features

- Microservices Architecture
- JWT Authentication
- Modern UI
- Search Highlighting
- Debounced Search
- Timeline Notes
- Dockerized Deployment
- HTTPS Support
- Cloud Database


# Why Golang + Express for a Simple Project?

This project could have been built using a single backend service, but I wanted to learn and apply microservices architecture in a real-world project.

I used:

Golang for the Auth Service to learn high-performance backend development and JWT-based authentication.
Node.js + Express for the Lead Service because of its fast development speed and flexibility for CRUD operations.

The main goal was not just building a CRM, but also learning how different backend services communicate and scale independently.
