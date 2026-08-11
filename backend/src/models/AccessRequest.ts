import mongoose, { Document, Schema } from 'mongoose';

export interface IAccessRequest extends Document {
  fromUserId: mongoose.Types.ObjectId;
  fromUserName: string;
  fromUserRelation: string;
  toUserId: mongoose.Types.ObjectId;
  type: 'video_audio' | 'audio_only' | 'emergency';
  durationMinutes: number;
  message?: string;
  status: 'pending' | 'accepted' | 'declined' | 'expired' | 'active' | 'ended';
  createdAt: Date;
  respondedAt?: Date;
  expiresAt?: Date;
  revokedBy?: 'user' | 'family' | 'timeout' | 'system';
}

const requestSchema = new Schema<IAccessRequest>({
  fromUserId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  fromUserName: { type: String, required: true },
  fromUserRelation: { type: String, default: '' },
  toUserId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['video_audio', 'audio_only', 'emergency'], default: 'video_audio' },
  durationMinutes: { type: Number, default: 15 },
  message: { type: String, default: '' },
  status: { type: String, enum: ['pending', 'accepted', 'declined', 'expired', 'active', 'ended'], default: 'pending' },
  createdAt: { type: Date, default: Date.now },
  respondedAt: { type: Date },
  expiresAt: { type: Date },
  revokedBy: { type: String, enum: ['user', 'family', 'timeout', 'system'] },
});

export const AccessRequest = mongoose.model<IAccessRequest>('AccessRequest', requestSchema);
