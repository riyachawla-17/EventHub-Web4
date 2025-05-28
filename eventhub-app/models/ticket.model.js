const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema({
  rsvpId: { type: mongoose.Schema.Types.ObjectId, ref: "RSVP" },
  qrCode: String,
  scanned: { type: Boolean, default: false },
  scannedAt: Date,
  scannedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
}, { timestamps: true });

module.exports = mongoose.model("Ticket", ticketSchema);
