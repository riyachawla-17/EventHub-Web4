import mongoose, { Schema } from 'mongoose';

const eventSchema = new Schema(
  {
    eventId: { type: Number, unique: true, required: true },
    title: { type: String, required: true },
    description: String,
    capacity: Number,
    from: Date,
    to: Date,
    time: String,
    street: String,
    city: String,
    image: {
      data: Buffer,
      contentType: String,
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