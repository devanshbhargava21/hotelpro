const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    roomid: { type: mongoose.Schema.Types.ObjectId, ref: "Room", required: true },
    userid: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    roomNumber: { type: String, required: true },
    type: { type: String, required: true },
    username: { type: String, required: true },
    phone: { type: String, required: true },
    fromdate: { type: Date, required: true },
    todate: { type: Date, required: true },
    totaldays: { type: Number, required: true },
    totalAmount: { type: Number, required: true },
    // Only non-sensitive card info is stored (never the full number or CVV)
    cardDetails: {
      cardholdername: { type: String, required: true },
      last4: { type: String, required: true },
      expmonthyear: { type: String, required: true },
    },
    status: { type: String, enum: ["booked", "cancelled"], default: "booked" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);
