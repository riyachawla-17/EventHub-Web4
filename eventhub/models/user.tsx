import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  interests: [String],
  registeredEvents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Event' }],
  attendedEvents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Event' }],
  calendarViewPreferences: {
  showPastEvents: { type: Boolean, default: true },
  categories: [String]
}

});

export default mongoose.models.User || mongoose.model('User', userSchema);
