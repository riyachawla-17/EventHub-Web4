import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event' },
  type: { type: String, enum: ['confirmation', 'reminder'], required: true },
  status: { type: String, enum: ['pending', 'sent'], default: 'pending' },
  scheduledAt: Date,
  sentAt: Date
});

export default mongoose.models.Notification || mongoose.model('Notification', notificationSchema);
