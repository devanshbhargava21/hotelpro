const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema(
  {
    roomNumber: { type: String, required: true, unique: true, trim: true },
    capacity: { type: Number, required: true, min: 1 },
    rent: { type: Number, required: true, min: 0 },
    photos: [{ type: String }],
    type: { type: String, enum: ["Delux", "Non-Delux"], required: true },
    description: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Room", roomSchema);
