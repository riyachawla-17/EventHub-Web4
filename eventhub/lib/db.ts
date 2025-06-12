import mongoose from 'mongoose';

let isConnected: boolean = false;

export default async function dbConnect() {
  if (isConnected) {
    return;
  }

  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error('MONGODB_URI not set in environment');
  }

  try {
    const db = await mongoose.connect(uri);

    isConnected = !!db.connections[0].readyState;
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
}
