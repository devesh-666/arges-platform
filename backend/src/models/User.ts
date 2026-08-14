import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  phone: string;
  role: 'blind' | 'family_head' | 'family_member' | 'helper' | 'admin';
  relation?: string;
  language: string;
  status: 'active' | 'suspended' | 'offline' | 'pending';
  location?: {
    lat: number;
    lng: number;
    address: string;
    updatedAt: Date;
  };
  privacy: {
    gpsAlwaysVisible: boolean;
    videoRequiresConsent: boolean;
    audioRequiresConsent: boolean;
    emergencyAutoGrant: boolean;
    autoDeclineAfterSeconds: number;
    reminderIntervalMinutes: number;
  };
  passkeys: Array<{
    id: string;
    name: string;
    platform: string;
    createdAt: Date;
    lastUsed: Date;
  }>;
  twoFactorEnabled: boolean;
  biometricLock: boolean;
  createdAt: Date;
  lastActive: Date;
}

const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, default: '' }, // hashed with bcrypt
  phone: { type: String, default: '' },
  role: { type: String, enum: ['blind', 'family_head', 'family_member', 'helper', 'admin'], default: 'family_head' },
  relation: { type: String, default: '' },
  language: { type: String, default: 'en' },
  status: { type: String, enum: ['active', 'suspended', 'offline', 'pending'], default: 'active' },
  location: {
    lat: Number,
    lng: Number,
    address: String,
    updatedAt: { type: Date, default: Date.now },
  },
  privacy: {
    gpsAlwaysVisible: { type: Boolean, default: true },
    videoRequiresConsent: { type: Boolean, default: true },
    audioRequiresConsent: { type: Boolean, default: true },
    emergencyAutoGrant: { type: Boolean, default: true },
    autoDeclineAfterSeconds: { type: Number, default: 30 },
    reminderIntervalMinutes: { type: Number, default: 5 },
  },
  passkeys: [{
    id: String,
    name: String,
    platform: String,
    createdAt: { type: Date, default: Date.now },
    lastUsed: { type: Date, default: Date.now },
  }],
  twoFactorEnabled: { type: Boolean, default: false },
  biometricLock: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  lastActive: { type: Date, default: Date.now },
});

export const User = mongoose.model<IUser>('User', userSchema);
