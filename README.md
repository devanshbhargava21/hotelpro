# HotelPro: Hotel Management System (MERN)

A full-stack hotel room booking application with two roles.

- **Customer:** sign up, log in, check room availability by date, book and pay, view booking history, cancel a booking.
- **Admin:** view all bookings, view all rooms, add a room, view all registered users.

**Tech stack:** React (Vite) · Bootstrap 5 · Node.js · Express · MongoDB (Mongoose) · JWT · bcrypt
**Backend pattern:** MVC (models, controllers, routes) plus auth middleware.

---

## Features

- JWT login with bcrypt-hashed passwords; protected routes on both server and client
- Role-based access (customer and admin dashboards)
- Date-based availability: only rooms free for the chosen dates are bookable
- Double-booking prevention (overlapping dates are rejected by the server)
- Payment popup with card validation (simulated gateway, no real charge)
- Booking history with cancel option
- Admin dashboard with tabs: All Bookings, All Rooms, Add Room, All Users
- Responsive UI with a home page carousel

## Project structure

```
hotelpro/
├── server/
│   ├── controllers/     authController, roomController, bookingController
│   ├── middleware/      auth.js (JWT check + admin check)
│   ├── models/          User, Room, Booking
│   ├── routes/          index.js (all API routes)
│   ├── index.js         Express app + MongoDB connection
│   ├── seed.js          Creates demo users and rooms
│   └── .env.example
├── client/
│   └── src/
│       ├── components/  Home, Login, SignUp, UserHome, BookingModal,
│       │                MyBookings, AdminHome, Navbar, ProtectedRoute ...
│       ├── api.js       Axios instance (adds the JWT automatically)
│       └── App.jsx      Routes
├── .gitignore
└── README.md
```

## Prerequisites

| Tool | Check with | Notes |
| --- | --- | --- |
| Node.js 18 or newer | `node -v` | https://nodejs.org (LTS) |
| MongoDB Community Server | MongoDB service running | https://www.mongodb.com/try/download/community (or a free MongoDB Atlas cluster) |
| Git | `git --version` | https://git-scm.com |

## How to run locally

Open **two terminals**: one for the backend and one for the frontend.

### 1. Backend

```bash
cd server
```

Create your `.env` from the example (needed after cloning from GitHub):

```bash
# Windows (Command Prompt / PowerShell)
copy .env.example .env
# macOS / Linux / Git Bash
cp .env.example .env
```

Then:

```bash
npm install
npm run seed     # creates demo admin, demo customer and 4 rooms (run once)
npm run dev      # starts the API on http://localhost:8001
```

You should see `Connected to MongoDB` and `Server running on http://localhost:8001`.

### 2. Frontend

```bash
cd client
npm install
npm run dev
```

Open **http://localhost:5173**.

### 3. Demo logins (created by the seed script)

| Role | Email | Password |
| --- | --- | --- |
| Admin | `admin@hotelpro.com` | `Admin@123` |
| Customer | `guest@hotelpro.com` | `Guest@123` |

You can also create new accounts from the **SignUp** page.

## Environment variables (`server/.env`)

| Variable | Example | Purpose |
| --- | --- | --- |
| `PORT` | `8001` | API port |
| `MONGO_URI` | `mongodb://127.0.0.1:27017/hotelpro` | MongoDB connection string (use your Atlas string for cloud) |
| `JWT_SECRET` | long random string | Secret used to sign tokens. Change it before deploying |
| `JWT_EXPIRES` | `1d` | Token lifetime |

Optional (`client/.env`): `VITE_API_URL=http://localhost:8001/api` if you change the backend port.

## Quick test checklist

1. Sign up as a customer, then log in.
2. Choose arrival and departure dates and click **Check Availability**.
3. Click **BOOK NOW** on a room. In the payment popup use:
   - Card number: `4242 4242 4242 4242`
   - Expiry: `12/30`
   - CVV: `123`
   - Any card holder name
4. The booking appears in **My Bookings**. Click **Cancel Booking** to cancel it.
5. Log out and log in as admin. Check the four tabs: All Bookings, All Rooms, Add Room, All Users.
6. Add a room as admin and confirm it shows in All Rooms.
7. Book the same room for overlapping dates again. The server rejects it.

## API reference

Base URL: `http://localhost:8001/api`. Protected routes need the header `Authorization: Bearer <token>`.

| Method | Path | Access | Purpose |
| --- | --- | --- | --- |
| POST | `/auth/signup` | Public | Register a user |
| POST | `/auth/login` | Public | Returns `{ token, user }` |
| GET | `/rooms` | Public | List all rooms |
| GET | `/rooms/available?from=&to=` | Logged in | Rooms free for the given dates |
| POST | `/rooms` | Admin | Add a room |
| POST | `/bookings` | Logged in | Create a booking with payment details |
| GET | `/bookings/mine` | Logged in | My bookings |
| POST | `/bookings/:id/cancel` | Owner or admin | Cancel a booking |
| GET | `/bookings` | Admin | All bookings |
| GET | `/users` | Admin | All users (passwords excluded) |

## Database collections

- **users:** name, email (unique), password (hashed), phone, type (`admin` / `ordinary`)
- **rooms:** roomNumber (unique), capacity, rent, photos, type (`Delux` / `Non-Delux`), description
- **bookings:** room, user, dates, totaldays, totalAmount, status (`booked` / `cancelled`), card holder name, card last 4 digits, expiry

## Security notes

- Passwords are hashed with bcrypt and never returned by the API.
- Every protected request verifies the JWT; admin routes also check the role on the server.
- The total price is calculated on the server (nights × rent), so the client cannot change it.
- Payment is **simulated** for demo purposes. The full card number and CVV are validated but **never stored**; only the last 4 digits are saved.
- `.env` is excluded from Git. Only `.env.example` is committed.
- Known limitation: the SignUp form lets a user choose the Admin type, as in the project reference. For a real deployment, restrict admin creation (for example with an access code or by creating admins only through the seed script).

## Push to GitHub

Run these from the project root (the folder that contains `client`, `server` and `.gitignore`).

```bash
git init
git add .
git status          # check: NO .env file and NO node_modules in the list
git commit -m "HotelPro hotel management system"
git branch -M main
git remote add origin https://github.com/<your-username>/hotelpro.git
git push -u origin main
```

Create the empty repository on GitHub first (leave README, .gitignore and license unchecked). If Git asks you to sign in, use the browser sign-in or a personal access token; GitHub does not accept your account password for pushes.

Later changes:

```bash
git add .
git commit -m "Describe what you changed"
git push
```

## Troubleshooting

| Problem | Fix |
| --- | --- |
| `MongoDB connection error` | MongoDB is not running. Start the **MongoDB Server** service (`services.msc`), or use an Atlas connection string |
| `JWT_SECRET` or `MONGO_URI` is undefined | You have not created `server/.env` from `.env.example` |
| Login shows "Is the server running?" | The backend is not running. Run `npm run dev` inside `server` |
| Rooms list is empty | Run `npm run seed` inside `server`, or add rooms as admin |
| `EADDRINUSE: port 8001` | Another program uses the port. Change `PORT` in `server/.env` and set `VITE_API_URL` in `client/.env` |
| Logged out suddenly / 401 errors | The token expired (1 day). Log in again |
| `npm` command not found | Install Node.js, then restart VS Code |

## Future scope

Real payment gateway (Stripe / Razorpay), email confirmations, edit and delete rooms, room image upload, check-in / check-out tracking, reviews and ratings, admin reports and charts, multiple hotels.

## Screenshots

Add screenshots of Login, Register, Room list, Payment popup, My Bookings and the Admin tabs here.