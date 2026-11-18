# Library Management System — BIWA2110

A full-stack library management application built to match the assignment brief:
- React + Vite frontend, React Router, reusable components, hooks and controlled forms
- Express REST API with CRUD routes for books, transactions and users
- MySQL database for books, users and borrowing/stock history
- Dashboard with low-stock warning (fewer than 2 copies)

## Requirements
- Node.js 18 or newer
- MySQL Server 8 or compatible
- npm

## 1. Configure the backend

Open a terminal:

```bash
cd backend
npm install
```

Copy `.env.example` to `.env`, then edit the values to match your MySQL setup. The MySQL service must be running. The configured account needs permission to create the database and tables the first time you initialize it.

```env
PORT=5000
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=library_management
JWT_SECRET=replace_this_with_a_long_random_secret
```

Initialize the database and its tables:

```bash
npm run db:setup
```

This runs the schema in `database/library.sql`. You can also run that SQL file directly in MySQL Workbench.

Create the first administrator account:

```bash
npm run seed
```

The seed command creates this local demonstration account if it does not already exist:
- Email: `admin@library.local`
- Password: `Admin123!`

Change this password after signing in in a real deployment. This sample account is for local coursework demonstration only.

Start the API. It checks the MySQL connection before listening and prints a connection error if the settings are incorrect:

```bash
npm run dev
```

The API runs at `http://localhost:5000`. Open `http://localhost:5000/api/health` in a browser; it should return `{"status":"ok","database":"connected"}` before using the frontend.

## 2. Start the React frontend

Open a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Open the local URL printed by Vite (normally `http://localhost:5173`).
Sign in using the demonstration administrator credentials above.

If the frontend cannot reach the API, keep the backend terminal open and check that `/api/health` returns a connected status. If the backend reports a MySQL error, start your MySQL service and correct the connection values in `backend/.env`.

## Main API routes

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/books` | List books |
| POST | `/api/books` | Add a book |
| PUT | `/api/books/:id` | Update a book |
| DELETE | `/api/books/:id` | Delete a book |
| GET | `/api/transactions` | List transaction history |
| POST | `/api/transactions` | Borrow, return or restock |
| GET | `/api/users` | List users |
| POST | `/api/users` | Add a user |
| PUT | `/api/users/:id` | Update a user |
| DELETE | `/api/users/:id` | Delete a user |
| POST | `/api/auth/login` | Sign in |

All API routes except health and login require a bearer token. The frontend attaches the token automatically.

## Important business rules
- A borrow transaction is rejected if the requested quantity is greater than available stock.
- A return or restock transaction increases stock.
- Borrowing and stock updates are performed in a MySQL transaction to avoid partial updates.
- The dashboard marks books with fewer than 2 available copies as low stock.
- User passwords are hashed with bcrypt and are never returned by the API.
- A user's role is either `admin` or `member`.

## Project structure

```text
library-management-system/
├── frontend/
├── backend/
└── database/
```

## GitHub submission

Create a new GitHub repository, then from the project root run:

```bash
git init
git add .
git commit -m "Build library management system"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/library-management-system.git
git push -u origin main
```

Replace the example repository URL with your own. Do not upload your real `.env` file; it is excluded by `.gitignore`.

## Coursework note
Use this project as a learning implementation. Read the comments and practise explaining:
- how `useState` stores UI data and `useEffect` loads data,
- how React Router changes pages,
- how controlled forms validate user input,
- how Fetch API sends requests to Express,
- how Express routes perform CRUD operations,
- how SQL foreign keys connect users, books and transactions.
