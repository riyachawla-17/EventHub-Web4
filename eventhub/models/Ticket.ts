import mongoose from 'mongoose';

const ticketSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event' },
  qrCode: String,
  used: { type: Boolean, default: false }
});

export default mongoose.models.Ticket || mongoose.model('Ticket', ticketSchema);