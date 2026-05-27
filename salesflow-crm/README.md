# SalesFlow CRM

## Overview
SalesFlow CRM is a frontend web application built to manage sales leads, contacts, and deals. It features a responsive dashboard layout with a fully functional Lead Management system. Users can view, search, create, edit, and delete leads, with all data persisting locally in the browser. 

## Key Features
* **Smart Filtering:** Filter leads instantly by name, company, or pipeline status.
* **Dynamic Routing:** Dedicated detail pages for each lead using URL parameters.
* **Form Validation:** Robust "Create" and "Edit" forms ensuring proper email formats, 10-digit phone numbers, and required fields.
* **CRUD Operations:** Full ability to Create, Read, Update, and Delete lead records.
* **Data Persistence:** Uses `localStorage` to save user modifications so data survives browser refreshes.

## Tech Stack
* **Frontend:** React.js
* **Build Tool:** Vite
* **Styling:** Tailwind CSS
* **Routing:** React Router v6
* **Form Management:** React Hook Form
* **Icons:** Lucide React

## How to Run the Project Locally
If you want to run this project on your machine, follow these steps:

1. Clone the repository:
   `git clone [insert-your-github-link-here]`
2. Go into the project folder:
   `cd salesflow-crm`
3. Install the dependencies:
   `npm install`
4. Start the local development server:
   `npm run dev`

## Folder Structure
Here is a quick look at how the code is organized:
* `/src/components/` - Contains reusable layout pieces like the Sidebar, Header, and main Layout.
* `/src/pages/` - Contains the main screens (`Leads.jsx`, `LeadDetail.jsx`, `LeadForm.jsx`).
* `/src/mockData/` - Contains `leadsData.js` which initializes the mock data and handles `localStorage` logic.