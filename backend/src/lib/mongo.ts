import mongoose from 'mongoose';

export async function connectDB() {
  const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/arges_vision';
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('MongoDB connected:', mongoose.connection.name);
  } catch (err) {
    console.error('MongoDB connection error:', (err as Error).message);
    console.log('Running in mock mode (no database). API will return mock data.');
  }
}

export function isConnected() {
  return mongoose.connection.readyState === 1;
}
