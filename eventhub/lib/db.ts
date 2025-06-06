import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error('Please define MONGODB_URI in .env.local');
}

let cached = (global as any).mongoose || { conn: null };

export const connectDB = async () => {
  if (cached.conn) return cached.conn;
  cached.conn = await mongoose.connect(MONGODB_URI, {
    dbName: 'eventhub',
  });
  (global as any).mongoose = cached;
  return cached.conn;
};
