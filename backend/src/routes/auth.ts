import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { signToken } from '../lib/jwt';
import { User } from '../models/User';
import { Device } from '../models/Device';
import { Family } from '../models/Family';
import { isConnected } from '../lib/mongo';
import { mockUsers } from '../lib/mockData';
import { authMiddleware } from '../middleware/auth';
import { sendPasswordChangedEmail, sendWelcomeEmail } from '../lib/mailer';

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

      // Send welcome email
      sendWelcomeEmail(head.email, head.name, 'family_head').catch(() => {});

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

// POST /api/auth/login — supports password OR passkey (email-only)
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email) return res.status(400).json({ success: false, error: 'Email required' });

    if (isConnected()) {
      const user = await User.findOne({ email: email.toLowerCase() });
      if (!user) return res.status(404).json({ success: false, error: 'User not found' });

      // If user has a password set, verify it
      if (user.password && password) {
        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(401).json({ success: false, error: 'Incorrect password' });
      } else if (user.password && !password) {
        return res.status(401).json({ success: false, error: 'Password required. Use password login.' });
      }
      // If no password set, passkey-style login (email only) is allowed

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

// POST /api/auth/set-password — set password for the first time (no old password needed)
router.post('/set-password', authMiddleware, async (req, res) => {
  const { newPassword } = req.body;
  if (!newPassword || newPassword.length < 6) {
    return res.status(400).json({ success: false, error: 'Password must be at least 6 characters' });
  }
  if (!isConnected()) return res.json({ success: true, message: 'Mock mode - password set' });

  const user = await User.findById(req.user!.userId);
  if (!user) return res.status(404).json({ success: false, error: 'User not found' });

  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();
  res.json({ success: true, message: 'Password set successfully' });
});

// POST /api/auth/change-password — change password (requires current password)
router.post('/change-password', authMiddleware, async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ success: false, error: 'Both current and new password are required' });
  }
  if (newPassword.length < 6) {
    return res.status(400).json({ success: false, error: 'New password must be at least 6 characters' });
  }
  if (!isConnected()) return res.json({ success: true, message: 'Mock mode - password changed' });

  const user = await User.findById(req.user!.userId);
  if (!user) return res.status(404).json({ success: false, error: 'User not found' });

  // If user has a password set, verify the current one
  if (user.password) {
    const match = await bcrypt.compare(currentPassword, user.password);
    if (!match) return res.status(401).json({ success: false, error: 'Current password is incorrect' });
  }

  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();

  // Send notification email
  sendPasswordChangedEmail(user.email, user.name).catch(() => {});

  res.json({ success: true, message: 'Password changed successfully' });
});

export default router;
