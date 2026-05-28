# 🚀 SalesFlow CRM

A modern, full-stack Customer Relationship Management (CRM) application with seamless **Tally Prime** integration. Built to streamline ledger management, contact details, and bank account synchronization directly into Tally using its JSON API.

## ✨ Key Features
* **Modern UI:** Built with React, Tailwind CSS, and Lucide Icons for a clean, responsive user experience.
* **Dynamic Forms:** Handles complex dynamic inputs (like multiple mobile numbers) using `react-hook-form` and `useFieldArray`.
* **Tally Prime Integration:** * Direct synchronization of Ledger Masters.
  * Native support for Tally's Contact Details and Bank Details arrays.
  * Overcomes Tally's XML/JSON limitations using a custom Node.js middleware.
* **Architecture:** Clean separation of concerns with distinct `frontend` and `backend` directories.

## 🛠️ Tech Stack
* **Frontend:** React.js, Vite, Tailwind CSS, React Hook Form, Lucide React
* **Backend:** Node.js, Express.js, CORS
* **Database / ERP:** Tally Prime (JSON API via Localhost:3000)

## 📁 Project Structure
```text
SalesFlow-CRM/
├── frontend/       # React application (UI & State Management)
└── backend/        # Node.js Server (Tally Middleware API)