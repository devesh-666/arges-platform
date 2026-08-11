import mongoose, { Document, Schema } from 'mongoose';

export interface IAuditLog extends Document {
  actorId: mongoose.Types.ObjectId;
  actorName: string;
  action: string;
  type: 'create' | 'update' | 'delete' | 'access' | 'security';
  targetId?: mongoose.Types.ObjectId;
  metadata?: Record<string, unknown>;
  timestamp: Date;
  hash: string;
}

const auditSchema = new Schema<IAuditLog>({
  actorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  actorName: { type: String, required: true },
  action: { type: String, required: true },
  type: { type: String, enum: ['create', 'update', 'delete', 'access', 'security'], default: 'access' },
  targetId: { type: Schema.Types.ObjectId },
  metadata: { type: Schema.Types.Mixed },
  timestamp: { type: Date, default: Date.now },
  hash: { type: String, required: true },
});

export const AuditLog = mongoose.model<IAuditLog>('AuditLog', auditSchema);
