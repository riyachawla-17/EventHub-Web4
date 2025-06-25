import mongoose, { Schema } from 'mongoose';
if (mongoose.models.Event) {
  delete mongoose.models.Event;
}
const eventSchema = new Schema(
  {
    title: { type: String, required: true },
    description: String,
    capacity: Number,
    from: Date,
    to: Date,
    street: String,
    city: String,
    image: String,
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