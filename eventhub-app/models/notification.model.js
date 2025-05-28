const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: "Event" },
  type: { type: String, enum: ["confirmation", "reminder"] },
  sentAt: Date,
  status: { type: String, enum: ["sent", "failed"] }
}, { timestamps: true });

module.exports = mongoose.model("Notification", notificationSchema);
