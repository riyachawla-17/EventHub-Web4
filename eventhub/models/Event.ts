import mongoose, { Schema, model, models } from 'mongoose';

const eventSchema = new Schema({
  title: { type: String, required: true },
  description: String,
  date: Date,
  time: String,
  venue: String,
  location: {
    address: String,
    lat: Number,
    lng: Number,
  },
  capacity: Number,
  attendees: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  qrCodes: [String],
  createdBy: { type: Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

const Event = models.Event || model('Event', eventSchema);
export default Event;
