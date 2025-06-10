import mongoose, { Schema } from 'mongoose';

const eventSchema = new Schema(
  {
    title: { type: String, required: true },
    description: String,
    capacity: Number,
    from: Date,
    to: Date,
    time: String,
    venue: String,
    location: {
      address: String,
      lat: Number,
      lng: Number,
    },
    attendees: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    qrCodes: [String],
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  {
    timestamps: true,
    collection: 'events',
  }
);

const Event = mongoose.models.Event || mongoose.model('Event', eventSchema);

export default Event;