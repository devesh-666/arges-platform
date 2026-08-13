import { Router } from 'express';
import { User } from '../models/User';
import { Device } from '../models/Device';
import { Family } from '../models/Family';
import { Alert } from '../models/Alert';
import { AccessRequest } from '../models/AccessRequest';
import { Helper } from '../models/Helper';
import { AuditLog } from '../models/AuditLog';
import { isConnected } from '../lib/mongo';
import { createRequest, respondToRequest, generateVoicePrompt } from '../lib/consent';
import { mockUsers, mockDevices, mockAlerts, mockRequests } from '../lib/mockData';

const router = Router();

// ============================================================
// USERS
// ============================================================
router.get('/users', async (_req, res) => {
  if (isConnected()) {
    const users = await User.find().sort({ createdAt: -1 }).limit(100);
    res.json({ success: true, data: users });
  } else {
    res.json({ success: true, data: mockUsers });
  }
});

router.get('/users/:id', async (req, res) => {
  if (isConnected()) {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, error: 'Not found' });
    res.json({ success: true, data: user });
  } else {
    const user = mockUsers.find(u => u._id === req.params.id) || mockUsers[0];
    res.json({ success: true, data: user });
  }
});

router.patch('/users/:id', async (req, res) => {
  if (isConnected()) {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!user) return res.status(404).json({ success: false, error: 'Not found' });
    res.json({ success: true, data: user });
  } else {
    res.json({ success: true, data: { ...mockUsers[0], ...req.body } });
  }
});

// ============================================================
// DEVICES
// ============================================================
router.get('/devices', async (_req, res) => {
  if (isConnected()) {
    const devices = await Device.find().populate('userId', 'name email').sort({ lastSeen: -1 });
    res.json({ success: true, data: devices });
  } else {
    res.json({ success: true, data: mockDevices });
  }
});

router.get('/devices/:id', async (req, res) => {
  if (isConnected()) {
    const device = await Device.findById(req.params.id).populate('userId');
    if (!device) return res.status(404).json({ success: false, error: 'Not found' });
    res.json({ success: true, data: device });
  } else {
    const device = mockDevices.find(d => d._id === req.params.id) || mockDevices[0];
    res.json({ success: true, data: device });
  }
});

router.patch('/devices/:id', async (req, res) => {
  if (isConnected()) {
    const device = await Device.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, data: device });
  } else {
    res.json({ success: true, data: { ...mockDevices[0], ...req.body } });
  }
});

// ============================================================
// FAMILIES
// ============================================================
router.get('/families', async (_req, res) => {
  if (isConnected()) {
    const families = await Family.find().populate('headId blindUserId');
    res.json({ success: true, data: families });
  } else {
    res.json({ success: true, data: [{ _id: 'f1', headId: 'u2', blindUserId: 'u1', members: mockUsers.filter(u => u.role === 'family_member').map(u => ({ userId: u._id, name: u.name, relation: u.relation, permissions: { canRequestVideo: true, canSeeGPS: true }, joinedAt: u.createdAt })) }] });
  }
});

router.post('/families/:id/members', async (req, res) => {
  const { name, email, relation, permissions } = req.body;
  if (isConnected()) {
    const family = await Family.findById(req.params.id);
    if (!family) return res.status(404).json({ success: false, error: 'Family not found' });

    const newMember = new User({ name, email, role: 'family_member', relation, status: 'pending' });
    await newMember.save();

    family.members.push({
      userId: newMember._id, name, relation,
      permissions: permissions || { canRequestVideo: true, canSeeGPS: true },
      joinedAt: new Date(),
    });
    await family.save();
    res.json({ success: true, data: family });
  } else {
    res.json({ success: true, data: { name, email, relation, added: true } });
  }
});

// ============================================================
// CONSENT REQUESTS
// ============================================================
router.get('/requests', async (_req, res) => {
  if (isConnected()) {
    const requests = await AccessRequest.find().sort({ createdAt: -1 }).limit(50);
    res.json({ success: true, data: requests });
  } else {
    res.json({ success: true, data: mockRequests });
  }
});

router.post('/requests', async (req, res) => {
  const { fromUserId, fromUserName, fromUserRelation, toUserId, type, durationMinutes, message } = req.body;

  if (isConnected()) {
    const reqDoc = await createRequest({ fromUserId, fromUserName, fromUserRelation, toUserId, type, durationMinutes, message });
    const voicePrompt = generateVoicePrompt(fromUserRelation, fromUserName, type, durationMinutes);
    res.json({ success: true, data: reqDoc, voicePrompt });
  } else {
    const voicePrompt = generateVoicePrompt(fromUserRelation || 'brother', fromUserName || 'Karthik', type || 'video_audio', durationMinutes || 15);
    res.json({ success: true, data: { _id: 'r' + Date.now(), ...req.body, status: 'pending' }, voicePrompt });
  }
});

router.post('/requests/:id/respond', async (req, res) => {
  const { accepted } = req.body;
  if (isConnected()) {
    const result = await respondToRequest(req.params.id, accepted);
    if (!result) return res.status(404).json({ success: false, error: 'Request not found or already responded' });
    res.json({ success: true, data: result });
  } else {
    res.json({ success: true, data: { _id: req.params.id, status: accepted ? 'active' : 'declined' } });
  }
});

// ============================================================
// ALERTS
// ============================================================
router.get('/alerts', async (_req, res) => {
  if (isConnected()) {
    const alerts = await Alert.find().sort({ createdAt: -1 }).limit(50);
    res.json({ success: true, data: alerts });
  } else {
    res.json({ success: true, data: mockAlerts });
  }
});

router.post('/alerts', async (req, res) => {
  if (isConnected()) {
    const alert = new Alert(req.body);
    await alert.save();
    res.json({ success: true, data: alert });
  } else {
    res.json({ success: true, data: { _id: 'a' + Date.now(), ...req.body, status: 'unresolved', createdAt: new Date() } });
  }
});

router.patch('/alerts/:id/resolve', async (req, res) => {
  if (isConnected()) {
    const alert = await Alert.findByIdAndUpdate(req.params.id, { status: 'resolved', resolvedAt: new Date() }, { new: true });
    res.json({ success: true, data: alert });
  } else {
    res.json({ success: true, data: { _id: req.params.id, status: 'resolved' } });
  }
});

// ============================================================
// HELPERS
// ============================================================
router.get('/helpers', async (_req, res) => {
  if (isConnected()) {
    const helpers = await Helper.find().populate('userId').sort({ sessions: -1 });
    res.json({ success: true, data: helpers });
  } else {
    res.json({ success: true, data: [
      { _id: 'h1', userId: 'u6', verified: true, identityVerified: true, sessions: 284, rating: 4.9, badges: ['Top Helper', '250+ Club', 'Verified', 'Fast Responder'], avgResponseTime: 2.4, totalHours: 47 },
      { _id: 'h2', userId: 'u7', verified: true, identityVerified: true, sessions: 231, rating: 4.8, badges: ['250+ Club', 'Verified'], avgResponseTime: 3.1, totalHours: 38 },
    ]});
  }
});

// ============================================================
// AUDIT LOGS
// ============================================================
router.get('/audit', async (_req, res) => {
  if (isConnected()) {
    const logs = await AuditLog.find().sort({ timestamp: -1 }).limit(50);
    res.json({ success: true, data: logs });
  } else {
    res.json({ success: true, data: [
      { _id: 'al1', actorId: 'u10', actorName: 'admin@arges', action: 'Pushed OTA v2.2.0 to 100% of devices', type: 'create', timestamp: new Date(Date.now() - 3600000) },
      { _id: 'al2', actorId: 'u10', actorName: 'admin@arges', action: 'Suspended user: Priya Devi (violation of ToS)', type: 'delete', timestamp: new Date(Date.now() - 7200000) },
      { _id: 'al3', actorId: 'system', actorName: 'system', action: 'Flagged device ARGES-0089 — face verification failed 3x', type: 'security', timestamp: new Date(Date.now() - 10800000) },
      { _id: 'al4', actorId: 'u10', actorName: 'admin@arges', action: 'Updated feature flag: MediScan → ENABLED', type: 'update', timestamp: new Date(Date.now() - 18000000) },
      { _id: 'al5', actorId: 'u10', actorName: 'admin@arges', action: 'Override accessed device ARGES-0014 (emergency SOS)', type: 'access', timestamp: new Date(Date.now() - 21600000) },
    ]});
  }
});

// ============================================================
// STATS (dashboard overview)
// ============================================================
router.get('/stats', async (_req, res) => {
  if (isConnected()) {
    const [blindUsers, devices, helpers, families, alerts] = await Promise.all([
      User.countDocuments({ role: 'blind' }),
      Device.countDocuments({ status: 'online' }),
      Helper.countDocuments({ verified: true }),
      Family.countDocuments(),
      Alert.countDocuments({ status: 'unresolved' }),
    ]);
    res.json({ success: true, data: { blindUsers, devices, helpers, families, alerts } });
  } else {
    res.json({ success: true, data: {
      blindUsers: 923, devices: 1924, helpers: 486, families: 1203, alerts: 3,
      totalUsers: 2847, revenue: 840000, subscriptions: 287,
    }});
  }
});

export default router;
