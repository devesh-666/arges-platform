import mongoose, { Document, Schema } from 'mongoose';

export interface IAlert extends Document {
  userId: mongoose.Types.ObjectId;
  userName: string;
  type: 'sos' | 'fall' | 'hazard' | 'stranger' | 'face_mismatch';
  status: 'resolved' | 'unresolved';
  location: { lat: number; lng: number; address: string };
  createdAt: Date;
  resolvedAt?: Date;
  notes?: string;
}

const alertSchema = new Schema<IAlert>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  userName: { type: String, required: true },
  type: { type: String, enum: ['sos', 'fall', 'hazard', 'stranger', 'face_mismatch'], required: true },
  status: { type: String, enum: ['resolved', 'unresolved'], default: 'unresolved' },
  location: {
    lat: { type: Number, default: 0 },
    lng: { type: Number, default: 0 },
    address: { type: String, default: '' },
  },
  createdAt: { type: Date, default: Date.now },
  resolvedAt: { type: Date },
  notes: { type: String, default: '' },
});

export const Alert = mongoose.model<IAlert>('Alert', alertSchema);
