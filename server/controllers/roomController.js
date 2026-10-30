const Room = require("../models/Room");
const Booking = require("../models/Booking");

exports.getRooms = async (req, res, next) => {
  try {
    res.json(await Room.find().sort({ roomNumber: 1 }));
  } catch (err) {
    next(err);
  }
};

// Rooms with no active booking overlapping [from, to)
exports.getAvailableRooms = async (req, res, next) => {
  try {
    const from = new Date(req.query.from);
    const to = new Date(req.query.to);
    if (isNaN(from) || isNaN(to) || to <= from)
      return res.status(400).json({ message: "Valid from/to dates required (to must be after from)" });

    const busy = await Booking.find({
      status: "booked",
      fromdate: { $lt: to },
      todate: { $gt: from },
    }).distinct("roomid");

    res.json(await Room.find({ _id: { $nin: busy } }).sort({ roomNumber: 1 }));
  } catch (err) {
    next(err);
  }
};

exports.addRoom = async (req, res, next) => {
  try {
    const { roomNumber, capacity, rent, photos, type, description } = req.body;
    if (!roomNumber || !capacity || !rent || !type)
      return res.status(400).json({ message: "Room number, capacity, rent and type are required" });
    if (await Room.findOne({ roomNumber: String(roomNumber).trim() }))
      return res.status(409).json({ message: "Room number already exists" });

    const room = await Room.create({
      roomNumber,
      capacity,
      rent,
      type,
      description,
      photos: (photos || []).filter(Boolean),
    });
    res.status(201).json(room);
  } catch (err) {
    next(err);
  }
};
