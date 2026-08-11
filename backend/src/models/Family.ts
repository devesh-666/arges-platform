import mongoose, { Document, Schema } from 'mongoose';

export interface IFamilyMember {
  userId: mongoose.Types.ObjectId;
  name: string;
  relation: string;
  permissions: {
    canRequestVideo: boolean;
    canSeeGPS: boolean;
  };
  joinedAt: Date;
}

export interface IFamily extends Document {
  headId: mongoose.Types.ObjectId;
  blindUserId: mongoose.Types.ObjectId;
  members: IFamilyMember[];
  createdAt: Date;
}

const familySchema = new Schema<IFamily>({
  headId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  blindUserId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  members: [{
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    name: String,
    relation: String,
    permissions: {
      canRequestVideo: { type: Boolean, default: true },
      canSeeGPS: { type: Boolean, default: true },
    },
    joinedAt: { type: Date, default: Date.now },
  }],
  createdAt: { type: Date, default: Date.now },
});

export const Family = mongoose.model<IFamily>('Family', familySchema);
