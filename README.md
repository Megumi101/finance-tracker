# 💰 Finance Tracker App

A modern full-stack web application to manage personal finances, track income & expenses, and analyze spending habits.

---

## ✨ Overview

Finance Tracker helps users monitor their financial activity in a simple and intuitive way. Users can record transactions, categorize expenses, and visualize financial data through interactive dashboards.

---

## 🚀 Features

### 🔐 Authentication

* User registration & login
* Secure password hashing
* JWT-based authentication
* Protected routes

---

### 💸 Transaction Management

* Add income & expense
* Edit and delete transactions
* Add notes/description
* Categorize transactions

---

### 📊 Dashboard & Analytics

* Total balance overview
* Income vs expense summary
* Interactive charts (daily/monthly)
* Category-based analysis

---

### 🗂️ Category Management

* Custom categories
* Category color & icon support
* Category filtering

---

### 📅 Filtering & Reports

* Filter by date range
* Monthly reports
* Transaction history

---

### 🎯 Budgeting (Optional Feature)

* Set monthly budget
* Track spending vs budget
* Alert when exceeding limit

---

## 🛠️ Tech Stack

### Frontend

* React.js (Vite)
* Tailwind CSS
* Axios
* Chart.js / Recharts

### Backend

* Node.js
* Express.js

### Database

* PostgreSQL
* Prisma ORM

---

## 📁 Project Structure

```bash
finance-tracker/
│
├── client/          # Frontend (React)
├── server/          # Backend (Node.js)
├── prisma/          # Prisma schema & migrations
├── .env
└── README.md
```

---

## ⚙️ Getting Started

### 1. Clone Repository

```bash
git clone https://github.com/your-username/finance-tracker.git
cd finance-tracker
```

---

### 2. Setup Environment Variables

Create `.env` file in root or server folder:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/finance_tracker"
JWT_SECRET="your_secret_key"
PORT=5000
```

---

### 3. Install Dependencies

#### Backend

```bash
cd server
npm install
```

#### Frontend

```bash
cd client
npm install
```

---

### 4. Setup Database (Prisma)

```bash
npx prisma migrate dev --name init
npx prisma generate
```

---

### 5. Run the App

#### Backend

```bash
cd server
npm run dev
```

#### Frontend

```bash
cd client
npm run dev
```

---

## 🌐 API Endpoints

### Auth

* `POST /api/auth/register`
* `POST /api/auth/login`

### Transactions

* `GET /api/transactions`
* `POST /api/transactions`
* `PUT /api/transactions/:id`
* `DELETE /api/transactions/:id`

### Categories

* `GET /api/categories`
* `POST /api/categories`

---

## 🗄️ Database Models

* User
* Transaction
* Category
* Budget

---

## 📸 Screenshots

> 

---

## 🚀 Deployment

* Frontend: Vercel / Netlify
* Backend: Railway / Render
* Database: Supabase / Neon

---

## 🧪 Future Improvements

* 🔔 Notification system
* 📱 Mobile (PWA)
* 🤖 AI financial insights
* 💳 Multi-account support
* 📤 Export to PDF/Excel

---

## 👤 Author

**Your Name**
GitHub: https://github.com/Chiiaa
GitHub: https://github.com/AdityaYsf

---

## ⭐ Support

If you find this project useful, please consider giving it a ⭐ on GitHub!
