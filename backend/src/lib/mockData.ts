/**
 * Mock data — used when MongoDB is not connected (development mode)
 * This lets the frontend work immediately without a database.
 */

export const mockUsers = [
  { _id: 'u1', name: 'Ravi Kumar', email: 'ravi@arges.app', phone: '+919876543210', role: 'blind', relation: '', language: 'ta', status: 'active', location: { lat: 11.0168, lng: 76.9558, address: 'Coimbatore, TN', updatedAt: new Date() }, createdAt: new Date('2026-08-01'), lastActive: new Date() },
  { _id: 'u2', name: 'Lakshmi Ammal', email: 'lakshmi@arges.app', phone: '+919876543211', role: 'family_head', relation: 'mother', language: 'ta', status: 'active', createdAt: new Date('2026-08-01'), lastActive: new Date() },
  { _id: 'u3', name: 'Suresh Kumar', email: 'suresh@arges.app', phone: '+919876543212', role: 'family_member', relation: 'father', language: 'ta', status: 'active', createdAt: new Date('2026-08-02'), lastActive: new Date() },
  { _id: 'u4', name: 'Karthik Ravi', email: 'karthik@arges.app', phone: '+919876543213', role: 'family_member', relation: 'brother', language: 'en', status: 'active', createdAt: new Date('2026-08-03'), lastActive: new Date() },
  { _id: 'u5', name: 'Priya Ravi', email: 'priya@arges.app', phone: '+919876543214', role: 'family_member', relation: 'sister', language: 'ta', status: 'pending', createdAt: new Date('2026-08-05'), lastActive: new Date() },
  { _id: 'u6', name: 'Vikram Singh', email: 'vikram@arges.app', phone: '+919876543215', role: 'helper', relation: '', language: 'hi', status: 'active', location: { lat: 18.5204, lng: 73.8567, address: 'Pune, MH', updatedAt: new Date() }, createdAt: new Date('2026-07-15'), lastActive: new Date() },
  { _id: 'u7', name: 'Deepa Nair', email: 'deepa@arges.app', phone: '+919876543216', role: 'helper', relation: '', language: 'ml', status: 'active', createdAt: new Date('2026-07-20'), lastActive: new Date() },
  { _id: 'u8', name: 'Priya Devi', email: 'priya.d@arges.app', phone: '+919876543217', role: 'blind', relation: '', language: 'ta', status: 'suspended', location: { lat: 13.0827, lng: 80.2707, address: 'Chennai, TN', updatedAt: new Date() }, createdAt: new Date('2026-07-10'), lastActive: new Date() },
  { _id: 'u9', name: 'Anjali Rao', email: 'anjali@arges.app', phone: '+919876543218', role: 'blind', relation: '', language: 'kn', status: 'active', location: { lat: 12.9716, lng: 77.5946, address: 'Bengaluru, KA', updatedAt: new Date() }, createdAt: new Date('2026-08-05'), lastActive: new Date() },
  { _id: 'u10', name: 'Admin', email: 'admin@arges.app', phone: '+919876543219', role: 'admin', relation: '', language: 'en', status: 'active', createdAt: new Date('2026-01-01'), lastActive: new Date() },
];

export const mockDevices = [
  { _id: 'd1', code: 'ARG-7K3M9-P2Q8R-4X', userId: 'u1', name: 'ARGES-0014', firmware: 'v2.1.3', status: 'online', battery: 87, temperature: 38, uptime: 8040, faceVerified: true, lastFaceCheck: new Date(), location: { lat: 11.0168, lng: 76.9558 }, pairedAt: new Date('2026-08-01'), lastSeen: new Date() },
  { _id: 'd2', code: 'ARG-8L4N0-Q3R9S-5Y', userId: 'u8', name: 'ARGES-0089', firmware: 'v2.1.3', status: 'updating', battery: 42, temperature: 41, uptime: 21600, faceVerified: false, lastFaceCheck: new Date(Date.now() - 3600000), location: { lat: 13.0827, lng: 80.2707 }, pairedAt: new Date('2026-07-10'), lastSeen: new Date() },
  { _id: 'd3', code: 'ARG-9M5O1-R4S0T-6Z', userId: 'u9', name: 'ARGES-0512', firmware: 'v2.1.3', status: 'online', battery: 94, temperature: 35, uptime: 28800, faceVerified: true, lastFaceCheck: new Date(), location: { lat: 12.9716, lng: 77.5946 }, pairedAt: new Date('2026-08-05'), lastSeen: new Date() },
];

export const mockAlerts = [
  { _id: 'a1', userId: 'u8', userName: 'Priya Devi', type: 'sos', status: 'unresolved', location: { lat: 13.0827, lng: 80.2707, address: 'Chennai, TN' }, createdAt: new Date(Date.now() - 720000) },
  { _id: 'a2', userId: 'u1', userName: 'Ravi Kumar', type: 'fall', status: 'resolved', location: { lat: 11.0168, lng: 76.9558, address: 'Coimbatore, TN' }, createdAt: new Date(Date.now() - 1680000) },
  { _id: 'a3', userId: 'u9', userName: 'Anjali Rao', type: 'hazard', status: 'resolved', location: { lat: 12.9716, lng: 77.5946, address: 'Bengaluru, KA' }, createdAt: new Date(Date.now() - 3600000) },
];

export const mockRequests = [
  { _id: 'r1', fromUserId: 'u3', fromUserName: 'Suresh', fromUserRelation: 'father', toUserId: 'u1', type: 'video_audio', durationMinutes: 15, status: 'pending', createdAt: new Date(Date.now() - 120000) },
  { _id: 'r2', fromUserId: 'u4', fromUserName: 'Karthik', fromUserRelation: 'brother', toUserId: 'u1', type: 'audio_only', durationMinutes: 30, status: 'pending', createdAt: new Date(Date.now() - 60000) },
];
