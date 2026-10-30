const Booking = require("../models/Booking");
const Room = require("../models/Room");
const User = require("../models/User");

const DAY = 24 * 60 * 60 * 1000;

exports.createBooking = async (req, res, next) => {
  try {
    const { roomid, fromdate, todate, cardDetails = {} } = req.body;
    const from = new Date(fromdate);
    const to = new Date(todate);
    if (isNaN(from) || isNaN(to) || to <= from)
      return res.status(400).json({ message: "Check-out must be after check-in" });

    const today = new Date(new Date().toISOString().slice(0, 10));
    if (from < today) return res.status(400).json({ message: "Check-in date cannot be in the past" });

    // Payment validation (simulated gateway — card data is NOT stored in full)
    const number = String(cardDetails.cardnumber || "").replace(/\s/g, "");
    const cvv = String(cardDetails.cvvcode || "");
    const exp = String(cardDetails.expmonthyear || "");
    const holder = String(cardDetails.cardholdername || "").trim();
    if (!/^\d{16}$/.test(number)) return res.status(400).json({ message: "Card number must be 16 digits" });
    if (!/^\d{3,4}$/.test(cvv)) return res.status(400).json({ message: "Invalid CVV" });
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(exp)) return res.status(400).json({ message: "Expiry must be MM/YY" });
    const [m, y] = exp.split("/").map(Number);
    if (new Date(2000 + y, m, 1) <= new Date()) return res.status(400).json({ message: "Card has expired" });
    if (!holder) return res.status(400).json({ message: "Card holder name required" });

    const room = await Room.findById(roomid);
    if (!room) return res.status(404).json({ message: "Room not found" });

    const clash = await Booking.findOne({
      roomid,
      status: "booked",
      fromdate: { $lt: to },
      todate: { $gt: from },
    });
    if (clash) return res.status(409).json({ message: "Room is not available for these dates" });

    const user = await User.findById(req.user.id);
    const totaldays = Math.round((to - from) / DAY);

    const booking = await Booking.create({
      roomid: room._id,
      userid: user._id,
      roomNumber: room.roomNumber,
      type: room.type,
      username: user.name,
      phone: user.phone,
      fromdate: from,
      todate: to,
      totaldays,
      totalAmount: totaldays * room.rent,
      cardDetails: { cardholdername: holder, last4: number.slice(-4), expmonthyear: exp },
    });
    res.status(201).json({ message: "Booking confirmed", booking });
  } catch (err) {
    next(err);
  }
};

exports.myBookings = async (req, res, next) => {
  try {
    res.json(await Booking.find({ userid: req.user.id }).sort({ createdAt: -1 }));
  } catch (err) {
    next(err);
  }
};

exports.allBookings = async (req, res, next) => {
  try {
    res.json(await Booking.find().sort({ createdAt: -1 }));
  } catch (err) {
    next(err);
  }
};

exports.cancelBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    if (String(booking.userid) !== req.user.id && req.user.type !== "admin")
      return res.status(403).json({ message: "Not allowed to cancel this booking" });
    if (booking.status === "cancelled") return res.status(400).json({ message: "Already cancelled" });

    booking.status = "cancelled";
    await booking.save();
    res.json({ message: "Booking cancelled", booking });
  } catch (err) {
    next(err);
  }
};
