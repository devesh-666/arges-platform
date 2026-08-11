import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/arges';

export async function connectDB() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ MongoDB connected:', mongoose.connection.name);
  } catch (err) {
    console.error('❌ MongoDB connection error:', err);
    console.log('⚠️  Running in mock mode (no database). API will return mock data.');
  }
}

export function isConnected() {
  return mongoose.connection.readyState === 1;
}
