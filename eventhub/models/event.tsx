import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  title: String,
  description: String,
  date: Date,
  time: String,
  venue: String,
  capacity: Number,
  attendees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  location: {
    lat: Number,
    lng: Number,
    address: String
  },
  qrCodes: [{
    userId: mongoose.Schema.Types.ObjectId,
    code: String,
    scanned: { type: Boolean, default: false }
  }]
});

export default mongoose.models.Event || mongoose.model('Event', eventSchema);
