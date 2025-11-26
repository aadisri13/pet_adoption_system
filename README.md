# Pet Adoption System - Full Stack Application

A full-stack web application for managing pet adoptions, built with Node.js/Express backend and React frontend, integrated with MySQL database using stored procedures, functions, and triggers.

## Tech Stack

### Backend
- Node.js
- Express.js
- mysql2/promise
- dotenv
- cors

### Frontend
- React (Create React App)
- React Router
- Axios
- Tailwind CSS

### Database
- MySQL (pet_adoption_system)

## Features

### Stored Procedures
- `pr_create_adoption_application` - Creates new adoption applications (triggers `trg_adoption_before_insert`)
- `pr_approve_adoption` - Approves adoption applications (triggers `trg_adoption_after_update`)
- `pr_restock_product` - Restocks product inventory

### Stored Functions
- `fn_adopter_fullname` - Returns full name of adopter
- `fn_pet_age_years` - Calculates pet age in years
- `fn_shelter_pets_available` - Returns count of available pets in a shelter

### Database Triggers
- `trg_adoption_before_insert` - Blocks adoption if pet is not available
- `trg_adoption_after_update` - Marks pet as adopted and decrements shelter occupancy when application is approved
- `trg_transactions_after_insert` - Reduces product stock by 1 when transaction is created

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MySQL database with `pet_adoption_system` database
- All stored procedures, functions, and triggers must be created in the database

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory:
```env
DB_HOST=localhost
DB_PORT=33060
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=pet_adoption_system
DB_SSL=true
PORT=5000
```

4. Start the backend server:
```bash
npm start
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. (Optional) Create a `.env` file in the frontend directory if your backend is on a different URL:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

4. Start the frontend development server:
```bash
npm run dev
# or
npm start
```

The frontend will run on `http://localhost:3000`

## Application Routes

### Frontend Routes
- `/` or `/pets` - View available pets
- `/apply/:petId` - Apply for pet adoption
- `/shelters` - Browse shelters and their available pets
- `/admin` - Admin dashboard to approve applications
- `/products` - Product management and restocking
- `/transactions` - Create new transactions

### Backend API Endpoints

#### Pets
- `GET /api/pets` - Get all pets with age
- `GET /api/pets/available` - Get available pets only
- `GET /api/pets/:id` - Get pet by ID

#### Applications
- `GET /api/applications` - Get all applications
- `POST /api/applications` - Create new application (calls `pr_create_adoption_application`)
- `GET /api/applications/:id` - Get application by ID

#### Admin
- `GET /api/admin/pending` - Get pending applications
- `POST /api/admin/approve/:app_no` - Approve application (calls `pr_approve_adoption`)

#### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `POST /api/products/:id/restock` - Restock product (calls `pr_restock_product`)

#### Shelters
- `GET /api/shelters` - Get all shelters with available pets count
- `GET /api/shelters/:id` - Get shelter details with available pets

#### Adopters
- `GET /api/adopters` - Get all adopters with fullname
- `GET /api/adopters/:id` - Get adopter by ID
- `POST /api/adopters` - Create new adopter

#### Transactions
- `GET /api/transactions` - Get all transactions
- `POST /api/transactions` - Create transaction (triggers `trg_transactions_after_insert`)
- `GET /api/transactions/:id` - Get transaction by ID

## Usage Flow

1. **View Available Pets**: Navigate to the pets page to see all available pets with their age calculated using `fn_pet_age_years`

2. **Apply for Adoption**: 
   - Click "Apply for Adoption" on any pet
   - Fill in adopter information (new or existing)
   - Submit application (triggers `trg_adoption_before_insert` to validate pet availability)

3. **Admin Approval**:
   - Navigate to Admin Dashboard
   - Review pending applications
   - Approve applications (triggers `trg_adoption_after_update` to mark pet as adopted and update shelter occupancy)

4. **Product Management**:
   - View all products and their stock levels
   - Restock products using the stored procedure `pr_restock_product`

5. **Create Transactions**:
   - Create transactions for product purchases
   - Automatically reduces product stock via `trg_transactions_after_insert` trigger

6. **Browse Shelters**:
   - View all shelters with available pets count using `fn_shelter_pets_available`
   - Click on a shelter to see its available pets

## Notes

- All stored procedures, functions, and triggers must be properly set up in the MySQL database before running the application
- The application uses stored functions in queries to display calculated values (pet age, adopter fullname, available pets count)
- Database triggers automatically handle business logic (pet availability checks, stock management, shelter occupancy updates)

