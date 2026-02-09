# 🚗 Hub-to-Hub Vehicle Rental Platform

![MERN Stack](https://img.shields.io/badge/MERN-Full%20Stack-blue?style=for-the-badge&logo=mongodb)
![Socket.io](https://img.shields.io/badge/Socket.io-Real%20Time-black?style=for-the-badge&logo=socket.io)
![Tesseract.js](https://img.shields.io/badge/AI-OCR%20KYC-green?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-In%20Development-orange?style=for-the-badge)

## 📖 Project Overview
The **Hub-to-Hub Vehicle Rental Platform** is a decentralized "One-Way" rental system designed to solve the *dead leg* problem in traditional car rentals. Unlike standard services that require round-trips, this platform enables users to rent a vehicle from **Hub A** and drop it off at **Hub B** via a partner network.

The core USP is a **"Return Load" Algorithm** that identifies displaced vehicles and dynamically prices them with discounts to incentivize users to drive them back to their home hub, optimizing fleet distribution.

---

## 🏗 System Architecture
The application is built on the **MERN Stack** (MongoDB, Express, React, Node.js) with a distinct separation of concerns:

* **Backend:** Node.js/Express REST API with Role-Based Access Control (RBAC).
* **Real-Time Layer:** A dedicated **Socket.io** server handles GPS telemetry and negotiation chat.
* **Database:** MongoDB with **Geospatial Indexing (2dsphere)** for location-based fleet queries.
* **AI Service:** Tesseract.js integration for automated KYC (Driver License OCR).

### 📂 Folder Structure
```bash
/Hub-to-Hub-Vehicle-Rental-Platform
├── /server (Backend API & Socket)
│   ├── /config       # DB & Cloudinary Config
│   ├── /controllers  # Business Logic
│   ├── /models       # Mongoose Schemas (User, Vehicle, Booking)
│   ├── /routes       # API Endpoints
│   ├── /sockets      # Real-time Handlers (GPS, Chat)
│   └── /jobs         # Cron Jobs (Deposit Release)
└── /client (Frontend UI)
    ├── /src
    │   ├── /features # Redux Slices
    │   └── /pages    # React Views
