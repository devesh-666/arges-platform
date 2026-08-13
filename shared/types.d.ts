export type UserRole = 'blind' | 'family_head' | 'family_member' | 'helper' | 'admin';
export type UserStatus = 'active' | 'suspended' | 'offline' | 'pending';
export type FamilyRelation = 'mother' | 'father' | 'brother' | 'sister' | 'uncle' | 'aunt' | 'grandmother' | 'grandfather' | 'cousin' | 'spouse' | 'child' | 'guardian' | 'other';
export type Language = 'en' | 'hi' | 'ta' | 'te' | 'mr' | 'bn' | 'kn';
export type AlertType = 'sos' | 'fall' | 'hazard' | 'stranger' | 'face_mismatch';
export type AlertStatus = 'resolved' | 'unresolved';
export type RequestStatus = 'pending' | 'accepted' | 'declined' | 'expired' | 'active' | 'ended';
export type RequestType = 'video_audio' | 'audio_only' | 'emergency';
export type DeviceStatus = 'online' | 'offline' | 'updating';
export interface User {
    _id: string;
    name: string;
    email: string;
    phone: string;
    role: UserRole;
    relation?: FamilyRelation;
    language: Language;
    status: UserStatus;
    location?: {
        lat: number;
        lng: number;
        address: string;
        updatedAt: Date;
    };
    privacy: PrivacySettings;
    passkeys: Passkey[];
    createdAt: Date;
    lastActive: Date;
}
export interface PrivacySettings {
    gpsAlwaysVisible: boolean;
    videoRequiresConsent: boolean;
    audioRequiresConsent: boolean;
    emergencyAutoGrant: boolean;
    privacyModeUntil?: Date;
    autoDeclineAfterSeconds: number;
    reminderIntervalMinutes: number;
}
export interface Passkey {
    id: string;
    name: string;
    platform: string;
    createdAt: Date;
    lastUsed: Date;
}
export interface Device {
    _id: string;
    code: string;
    userId: string;
    name: string;
    firmware: string;
    status: DeviceStatus;
    battery: number;
    temperature: number;
    uptime: number;
    faceVerified: boolean;
    lastFaceCheck?: Date;
    location: {
        lat: number;
        lng: number;
    };
    pairedAt: Date;
    lastSeen: Date;
}
export interface Family {
    _id: string;
    headId: string;
    blindUserId: string;
    members: FamilyMember[];
    createdAt: Date;
}
export interface FamilyMember {
    userId: string;
    name: string;
    relation: FamilyRelation;
    role: 'family_member';
    permissions: {
        canRequestVideo: boolean;
        canSeeGPS: boolean;
    };
    joinedAt: Date;
}
export interface AccessRequest {
    _id: string;
    fromUserId: string;
    fromUserName: string;
    fromUserRelation: FamilyRelation;
    toUserId: string;
    type: RequestType;
    durationMinutes: number;
    message?: string;
    status: RequestStatus;
    createdAt: Date;
    respondedAt?: Date;
    expiresAt?: Date;
    revokedBy?: 'user' | 'family' | 'timeout' | 'system';
}
export interface Alert {
    _id: string;
    userId: string;
    userName: string;
    type: AlertType;
    status: AlertStatus;
    location: {
        lat: number;
        lng: number;
        address: string;
    };
    createdAt: Date;
    resolvedAt?: Date;
    notes?: string;
}
export interface AuditLog {
    _id: string;
    actorId: string;
    actorName: string;
    action: string;
    type: 'create' | 'update' | 'delete' | 'access' | 'security';
    targetId?: string;
    metadata?: Record<string, unknown>;
    timestamp: Date;
    hash: string;
}
export interface Helper {
    _id: string;
    userId: string;
    verified: boolean;
    identityVerified: boolean;
    sessions: number;
    rating: number;
    badges: string[];
    avgResponseTime: number;
    languages: Language[];
    maxDistance: number;
    autoAcceptUrgent: boolean;
    totalHours: number;
}
export interface ApiResponse<T = unknown> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}
export interface PaginatedResponse<T> {
    success: boolean;
    data: T[];
    total: number;
    page: number;
    limit: number;
}
export interface SignupRequest {
    name: string;
    email: string;
    phone: string;
    relation: FamilyRelation;
    language: Language;
    blindUserName: string;
    blindUserAge: number;
    blindUserPhone: string;
    deviceCode: string;
    privacy: Partial<PrivacySettings>;
}
export interface LoginRequest {
    email: string;
    passkeyId?: string;
}
export interface AuthResponse {
    token: string;
    user: User;
}
