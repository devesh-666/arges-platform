import mongoose, { Document, Schema } from 'mongoose';

export interface IHelper extends Document {
  userId: mongoose.Types.ObjectId;
  verified: boolean;
  identityVerified: boolean;
  sessions: number;
  rating: number;
  badges: string[];
  avgResponseTime: number;
  languages: string[];
  maxDistance: number;
  autoAcceptUrgent: boolean;
  totalHours: number;
}

const helperSchema = new Schema<IHelper>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  verified: { type: Boolean, default: false },
  identityVerified: { type: Boolean, default: false },
  sessions: { type: Number, default: 0 },
  rating: { type: Number, default: 5.0 },
  badges: { type: [String], default: [] },
  avgResponseTime: { type: Number, default: 5 },
  languages: { type: [String], default: ['en'] },
  maxDistance: { type: Number, default: 50 },
  autoAcceptUrgent: { type: Boolean, default: false },
  totalHours: { type: Number, default: 0 },
});

export const Helper = mongoose.model<IHelper>('Helper', helperSchema);
