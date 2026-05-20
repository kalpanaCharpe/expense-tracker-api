# Expense Tracker API

A RESTful backend API for managing personal finances, transactions, categories and analytics built using Node.js, Express.js, MongoDB, JWT Authentication and Swagger Documentation.

---

## Features

- User Authentication using JWT
- Protected Routes
- Category Management
- Transaction Management
- Financial Analytics
- Pagination, Filtering & Sorting
- Swagger API Documentation
- MongoDB Aggregation Pipelines
- Secure REST APIs
- Rate Limiting & Security Middleware
- Error Handling Middleware
- MongoDB Atlas Integration
- Render Deployment

---

## Tech Stack

- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- JWT Authentication
- Swagger
- Render
- Helmet
- Express Rate Limit

---

## Project Structure

```bash
src/
│
├── config/
├── controllers/
├── docs/
├── middleware/
├── models/
├── routes/
├── utils/
├── app.js
└── server.js
```

---

## Installation

### Clone Repository

```bash
git clone https://github.com/yourusername/expense-tracker-api.git
```

### Move Into Project Folder

```bash
cd expense-tracker-api
```

### Install Dependencies

```bash
npm install
```

---

## Environment Variables

Create a `.env` file in the root directory.

```env
PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_secret_key

NODE_ENV=development
```

---

## Run Development Server

```bash
npm run dev
```

---

## Production Start

```bash
npm start
```

---

## Base URL

```bash
https://expense-tracker-api-k7z5.onrender.com
```

Replace with your deployed Render backend URL.

---

## API Documentation

Swagger Documentation:

```bash
https://expense-tracker-api-k7z5.onrender.com/docs
```

---

## Authentication

Protected routes require JWT token.

Example:

```http
Authorization: Bearer your_token
```

---

## API Modules

- Authentication APIs
- Category Management APIs
- Transaction Management APIs
- Analytics APIs

Complete API documentation available in Swagger Docs.
---

# Security Features

- JWT Authentication
- Protected Routes
- Helmet Security Middleware
- Rate Limiting
- Error Handling Middleware
- Secure Password Hashing using bcryptjs

---

# Deployment

- Backend deployed on Render
- Database hosted on MongoDB Atlas

---

# Testing

You can test APIs using:

- Swagger Docs
- Postman
- Thunder Client

---

# Author

Kalpana Charpe
