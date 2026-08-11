import { Router } from 'express';
import { signToken } from '../lib/jwt';
import { User } from '../models/User';
import { Device } from '../models/Device';
import { Family } from '../models/Family';
import { isConnected } from '../lib/mongo';
import { mockUsers } from '../lib/mockData';

const router = Router();

// POST /api/auth/signup — Family Head registration
router.post('/signup', async (req, res) => {
  try {
    const { name, email, phone, relation, language, blindUserName, blindUserAge, deviceCode, privacy } = req.body;

    if (!name || !email || !deviceCode) {
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }

    if (isConnected()) {
      // Check device exists and isn't paired
      const device = await Device.findOne({ code: deviceCode.toUpperCase() });
      if (!device) {
        return res.status(404).json({ success: false, error: 'Device not found. Check your 15-digit code.' });
      }
      if (device.userId) {
        return res.status(409).json({ success: false, error: 'Device already paired to another account.' });
      }

      // Create Family Head user
      const head = new User({
        name, email, phone, role: 'family_head', relation, language,
        status: 'active', privacy: {
          gpsAlwaysVisible: privacy?.gpsAlwaysVisible ?? true,
          videoRequiresConsent: privacy?.videoRequiresConsent ?? true,
          audioRequiresConsent: privacy?.audioRequiresConsent ?? true,
          emergencyAutoGrant: privacy?.emergencyAutoGrant ?? true,
          autoDeclineAfterSeconds: 30,
          reminderIntervalMinutes: 5,
        },
      });
      await head.save();

      // Create Blind User
      const blindUser = new User({
        name: blindUserName, email: `${blindUserName.toLowerCase().replace(/\s/g, '.')}@arges.app`,
        role: 'blind', language, status: 'active',
      });
      await blindUser.save();

      // Pair device to blind user
      device.userId = blindUser._id;
      await device.save();

      // Create family
      const family = new Family({
        headId: head._id,
        blindUserId: blindUser._id,
        members: [],
      });
      await family.save();

      const token = signToken({ userId: head._id.toString(), email, role: 'family_head' });
      return res.json({ success: true, data: { token, user: head } });
    } else {
      // Mock mode
      const user = mockUsers.find(u => u.role === 'family_head')!;
      const token = signToken({ userId: user._id, email: user.email, role: user.role });
      return res.json({ success: true, data: { token, user } });
    }
  } catch (err) {
    res.status(500).json({ success: false, error: 'Signup failed' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, error: 'Email required' });

    if (isConnected()) {
      const user = await User.findOne({ email: email.toLowerCase() });
      if (!user) return res.status(404).json({ success: false, error: 'User not found' });

      const token = signToken({ userId: user._id.toString(), email: user.email, role: user.role });
      return res.json({ success: true, data: { token, user } });
    } else {
      const user = mockUsers.find(u => u.email === email) || mockUsers[1];
      const token = signToken({ userId: user._id, email: user.email, role: user.role });
      return res.json({ success: true, data: { token, user } });
    }
  } catch (err) {
    res.status(500).json({ success: false, error: 'Login failed' });
  }
});

// GET /api/auth/me — get current user from token
router.get('/me', async (req, res) => {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) return res.status(401).json({ success: false, error: 'No token' });

  const { verifyToken } = await import('../lib/jwt');
  const payload = verifyToken(header.substring(7));
  if (!payload) return res.status(401).json({ success: false, error: 'Invalid token' });

  if (isConnected()) {
    const user = await User.findById(payload.userId);
    if (!user) return res.status(404).json({ success: false, error: 'User not found' });
    return res.json({ success: true, data: user });
  } else {
    const user = mockUsers.find(u => u._id === payload.userId) || mockUsers[1];
    return res.json({ success: true, data: user });
  }
});

export default router;
