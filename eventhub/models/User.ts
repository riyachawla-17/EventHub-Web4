import mongoose, { Schema, model, models } from 'mongoose';

const userSchema = new Schema({
  userId: { type: Number, unique: true, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
}, { timestamps: true });

const User = models.User || model('User', userSchema);
export default User;
