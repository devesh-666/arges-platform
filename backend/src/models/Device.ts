import mongoose, { Document, Schema } from 'mongoose';

export interface IDevice extends Document {
  code: string;
  userId: mongoose.Types.ObjectId;
  name: string;
  firmware: string;
  status: 'online' | 'offline' | 'updating';
  battery: number;
  temperature: number;
  uptime: number;
  faceVerified: boolean;
  lastFaceCheck?: Date;
  location: { lat: number; lng: number };
  pairedAt: Date;
  lastSeen: Date;
}

const deviceSchema = new Schema<IDevice>({
  code: { type: String, required: true, unique: true, uppercase: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, default: 'ARGES Device' },
  firmware: { type: String, default: 'v2.1.3' },
  status: { type: String, enum: ['online', 'offline', 'updating'], default: 'online' },
  battery: { type: Number, default: 100 },
  temperature: { type: Number, default: 35 },
  uptime: { type: Number, default: 0 },
  faceVerified: { type: Boolean, default: false },
  lastFaceCheck: { type: Date },
  location: { lat: { type: Number, default: 0 }, lng: { type: Number, default: 0 } },
  pairedAt: { type: Date, default: Date.now },
  lastSeen: { type: Date, default: Date.now },
});

export const Device = mongoose.model<IDevice>('Device', deviceSchema);
