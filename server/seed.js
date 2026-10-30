// Run once: npm run seed  -> creates demo admin, demo guest and 4 rooms (skips ones that exist)
require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");
const Room = require("./models/Room");

const img = (id) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=800&q=70`;

const users = [
  { name: "Admin", email: "admin@hotelpro.com", password: "Admin@123", phone: "9999999999", type: "admin" },
  { name: "Guest", email: "guest@hotelpro.com", password: "Guest@123", phone: "9876543210", type: "ordinary" },
];

const rooms = [
  { roomNumber: "101", capacity: 2, rent: 1200, type: "Delux", description: "Luxury room with city view", photos: [img("photo-1631049307264-da0ec9d70304")] },
  { roomNumber: "102", capacity: 3, rent: 1800, type: "Delux", description: "Spacious suite with balcony", photos: [img("photo-1618773928121-c32242e63f39")] },
  { roomNumber: "103", capacity: 2, rent: 900, type: "Non-Delux", description: "Comfortable standard room", photos: [img("photo-1590490360182-c33d57733427")] },
  { roomNumber: "104", capacity: 5, rent: 2500, type: "Delux", description: "Family room with two beds", photos: [img("photo-1566665797739-1674de7a421a")] },
];

(async () => {
  await mongoose.connect(process.env.MONGO_URI);
  for (const u of users) {
    if (!(await User.findOne({ email: u.email }))) {
      await User.create({ ...u, password: await bcrypt.hash(u.password, 10) });
      console.log("Created user", u.email);
    }
  }
  for (const r of rooms) {
    if (!(await Room.findOne({ roomNumber: r.roomNumber }))) {
      await Room.create(r);
      console.log("Created room", r.roomNumber);
    }
  }
  console.log("Seed done");
  await mongoose.disconnect();
})().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
