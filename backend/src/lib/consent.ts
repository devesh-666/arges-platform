import { AccessRequest, IAccessRequest } from '../models/AccessRequest';

/**
 * Consent System — handles the permission-based video/audio access flow
 *
 * Flow:
 * 1. Family member requests access → creates AccessRequest (status: pending)
 * 2. Blind user hears voice prompt → responds accept/decline
 * 3. If accepted → status: active, expiresAt set, streaming enabled
 * 4. After duration → status: ended (auto-revoke)
 * 5. Blind user can say "stop viewing" → status: ended (revokedBy: user)
 */

export async function createRequest(data: {
  fromUserId: string;
  fromUserName: string;
  fromUserRelation: string;
  toUserId: string;
  type: 'video_audio' | 'audio_only' | 'emergency';
  durationMinutes: number;
  message?: string;
}): Promise<IAccessRequest> {
  const req = new AccessRequest({
    ...data,
    status: 'pending',
    createdAt: new Date(),
  });
  await req.save();
  return req;
}

export async function respondToRequest(
  requestId: string,
  accepted: boolean
): Promise<IAccessRequest | null> {
  const req = await AccessRequest.findById(requestId);
  if (!req || req.status !== 'pending') return null;

  req.status = accepted ? 'active' : 'declined';
  req.respondedAt = new Date();

  if (accepted) {
    req.expiresAt = new Date(Date.now() + req.durationMinutes * 60 * 1000);
  }

  await req.save();
  return req;
}

export async function revokeAccess(
  requestId: string,
  revokedBy: 'user' | 'family' | 'timeout' | 'system'
): Promise<void> {
  await AccessRequest.findByIdAndUpdate(requestId, {
    status: 'ended',
    revokedBy,
  });
}

export async function getActiveRequest(userId: string): Promise<IAccessRequest | null> {
  return AccessRequest.findOne({
    toUserId: userId,
    status: 'active',
    expiresAt: { $gt: new Date() },
  });
}

/** Voice prompt text spoken to the blind user */
export function generateVoicePrompt(
  relation: string,
  name: string,
  type: string,
  duration: number
): string {
  const typeName = type === 'video_audio' ? 'camera and microphone' : type === 'audio_only' ? 'microphone' : 'emergency access';
  return `Your ${relation} ${name} is requesting access to your ${typeName} for ${duration} minutes. Say accept or decline.`;
}
