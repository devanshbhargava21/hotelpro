const router = require("express").Router();
const { protect, adminOnly } = require("../middleware/auth");
const auth = require("../controllers/authController");
const room = require("../controllers/roomController");
const booking = require("../controllers/bookingController");

// Auth
router.post("/auth/signup", auth.signup);
router.post("/auth/login", auth.login);

// Users (admin)
router.get("/users", protect, adminOnly, auth.getUsers);

// Rooms
router.get("/rooms", room.getRooms);
router.get("/rooms/available", protect, room.getAvailableRooms);
router.post("/rooms", protect, adminOnly, room.addRoom);

// Bookings
router.post("/bookings", protect, booking.createBooking);
router.get("/bookings/mine", protect, booking.myBookings);
router.get("/bookings", protect, adminOnly, booking.allBookings);
router.post("/bookings/:id/cancel", protect, booking.cancelBooking);

module.exports = router;
