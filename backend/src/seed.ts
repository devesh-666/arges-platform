/**
 * Seed script — inserts all user types into MongoDB Atlas
 * Run: npx tsx src/seed.ts
 */
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from './models/User';
import { Device } from './models/Device';
import { Family } from './models/Family';
import { Helper } from './models/Helper';
import { Alert } from './models/Alert';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/arges_vision';

async function seed() {
  console.log('Connecting to MongoDB...');
  await mongoose.connect(MONGODB_URI);
  console.log('Connected:', mongoose.connection.name);

  // Clear existing data
  console.log('Clearing existing data...');
  await Promise.all([
    User.deleteMany({}),
    Device.deleteMany({}),
    Family.deleteMany({}),
    Helper.deleteMany({}),
    Alert.deleteMany({}),
  ]);

  console.log('Inserting users...');

  // ============ ADMIN ============
  const admin = await User.create({
    name: 'Admin',
    email: 'admin@arges.app',
    phone: '+919000000001',
    role: 'admin',
    language: 'en',
    status: 'active',
    twoFactorEnabled: true,
    biometricLock: true,
    passkeys: [{ id: 'pk-admin', name: 'Windows Hello', platform: 'Windows' }],
  });

  // ============ BLIND USERS ============
  const ravi = await User.create({
    name: 'Ravi Kumar',
    email: 'ravi@arges.app',
    phone: '+919876543210',
    role: 'blind',
    language: 'ta',
    status: 'active',
    location: { lat: 11.0168, lng: 76.9558, address: 'Coimbatore, TN', updatedAt: new Date() },
    privacy: {
      gpsAlwaysVisible: true,
      videoRequiresConsent: true,
      audioRequiresConsent: true,
      emergencyAutoGrant: true,
      autoDeclineAfterSeconds: 30,
      reminderIntervalMinutes: 5,
    },
  });

  const priyaDevi = await User.create({
    name: 'Priya Devi',
    email: 'priya.devi@arges.app',
    phone: '+919876543217',
    role: 'blind',
    language: 'ta',
    status: 'active',
    location: { lat: 13.0827, lng: 80.2707, address: 'Chennai, TN', updatedAt: new Date() },
  });

  const anjali = await User.create({
    name: 'Anjali Rao',
    email: 'anjali@arges.app',
    phone: '+919876543218',
    role: 'blind',
    language: 'kn',
    status: 'active',
    location: { lat: 12.9716, lng: 77.5946, address: 'Bengaluru, KA', updatedAt: new Date() },
  });

  // ============ FAMILY HEAD ============
  const lakshmi = await User.create({
    name: 'Lakshmi Ammal',
    email: 'lakshmi@arges.app',
    phone: '+919876543211',
    role: 'family_head',
    relation: 'mother',
    language: 'ta',
    status: 'active',
    twoFactorEnabled: true,
    biometricLock: true,
    passkeys: [
      { id: 'pk-l1', name: 'Windows Hello', platform: 'Windows' },
      { id: 'pk-l2', name: 'iPhone 15 Pro (Face ID)', platform: 'iOS' },
    ],
  });

  // ============ FAMILY MEMBERS ============
  const suresh = await User.create({
    name: 'Suresh Kumar',
    email: 'suresh@arges.app',
    phone: '+919876543212',
    role: 'family_member',
    relation: 'father',
    language: 'ta',
    status: 'active',
    twoFactorEnabled: true,
  });

  const karthik = await User.create({
    name: 'Karthik Ravi',
    email: 'karthik@arges.app',
    phone: '+919876543213',
    role: 'family_member',
    relation: 'brother',
    language: 'en',
    status: 'active',
    twoFactorEnabled: true,
  });

  const priyaSister = await User.create({
    name: 'Priya Ravi',
    email: 'priya@arges.app',
    phone: '+919876543214',
    role: 'family_member',
    relation: 'sister',
    language: 'ta',
    status: 'pending',
  });

  // ============ HELPERS ============
  const vikram = await User.create({
    name: 'Vikram Singh',
    email: 'vikram@arges.app',
    phone: '+919876543215',
    role: 'helper',
    language: 'hi',
    status: 'active',
    location: { lat: 18.5204, lng: 73.8567, address: 'Pune, MH', updatedAt: new Date() },
  });

  const deepa = await User.create({
    name: 'Deepa Nair',
    email: 'deepa@arges.app',
    phone: '+919876543216',
    role: 'helper',
    language: 'ml',
    status: 'active',
    location: { lat: 9.9312, lng: 76.2673, address: 'Kochi, KL', updatedAt: new Date() },
  });

  console.log('Users inserted. Creating devices...');

  // ============ DEVICES ============
  await Device.create([
    {
      code: 'ARG-7K3M9-P2Q8R-4X',
      userId: ravi._id,
      name: 'ARGES-0014',
      firmware: 'v2.1.3',
      status: 'online',
      battery: 87,
      temperature: 38,
      uptime: 8040,
      faceVerified: true,
      lastFaceCheck: new Date(),
      location: { lat: 11.0168, lng: 76.9558 },
    },
    {
      code: 'ARG-8L4N0-Q3R9S-5Y',
      userId: priyaDevi._id,
      name: 'ARGES-0089',
      firmware: 'v2.1.3',
      status: 'updating',
      battery: 42,
      temperature: 41,
      uptime: 21600,
      faceVerified: false,
      lastFaceCheck: new Date(Date.now() - 3600000),
      location: { lat: 13.0827, lng: 80.2707 },
    },
    {
      code: 'ARG-9M5O1-R4S0T-6Z',
      userId: anjali._id,
      name: 'ARGES-0512',
      firmware: 'v2.1.3',
      status: 'online',
      battery: 94,
      temperature: 35,
      uptime: 28800,
      faceVerified: true,
      lastFaceCheck: new Date(),
      location: { lat: 12.9716, lng: 77.5946 },
    },
  ]);

  console.log('Devices inserted. Creating family...');

  // ============ FAMILY TREE ============
  await Family.create({
    headId: lakshmi._id,
    blindUserId: ravi._id,
    members: [
      { userId: suresh._id, name: 'Suresh Kumar', relation: 'father', permissions: { canRequestVideo: true, canSeeGPS: true }, joinedAt: new Date() },
      { userId: karthik._id, name: 'Karthik Ravi', relation: 'brother', permissions: { canRequestVideo: true, canSeeGPS: true }, joinedAt: new Date() },
      { userId: priyaSister._id, name: 'Priya Ravi', relation: 'sister', permissions: { canRequestVideo: true, canSeeGPS: true }, joinedAt: new Date() },
    ],
  });

  console.log('Family inserted. Creating helpers...');

  // ============ HELPERS ============
  await Helper.create([
    {
      userId: vikram._id,
      verified: true,
      identityVerified: true,
      sessions: 284,
      rating: 4.9,
      badges: ['Top Helper', '250+ Club', 'Verified', 'Fast Responder'],
      avgResponseTime: 2.4,
      languages: ['en', 'hi', 'mr'],
      totalHours: 47,
    },
    {
      userId: deepa._id,
      verified: true,
      identityVerified: true,
      sessions: 231,
      rating: 4.8,
      badges: ['250+ Club', 'Verified'],
      avgResponseTime: 3.1,
      languages: ['en', 'ml', 'ta'],
      totalHours: 38,
    },
  ]);

  console.log('Helpers inserted. Creating alerts...');

  // ============ ALERTS ============
  await Alert.create([
    { userId: priyaDevi._id, userName: 'Priya Devi', type: 'sos', status: 'unresolved', location: { lat: 13.0827, lng: 80.2707, address: 'Chennai, TN' } },
    { userId: ravi._id, userName: 'Ravi Kumar', type: 'fall', status: 'resolved', location: { lat: 11.0168, lng: 76.9558, address: 'Coimbatore, TN' } },
    { userId: anjali._id, userName: 'Anjali Rao', type: 'hazard', status: 'resolved', location: { lat: 12.9716, lng: 77.5946, address: 'Bengaluru, KA' } },
  ]);

  console.log('Alerts inserted.');

  // ============ SUMMARY ============
  const counts = await Promise.all([
    User.countDocuments(),
    Device.countDocuments(),
    Family.countDocuments(),
    Helper.countDocuments(),
    Alert.countDocuments(),
  ]);

  console.log('\n==========================================');
  console.log('  SEED COMPLETE');
  console.log('==========================================');
  console.log(`Users:    ${counts[0]}`);
  console.log(`Devices:  ${counts[1]}`);
  console.log(`Families: ${counts[2]}`);
  console.log(`Helpers:  ${counts[3]}`);
  console.log(`Alerts:   ${counts[4]}`);
  console.log('\n==========================================');
  console.log('  LOGIN CREDENTIALS (email = username)');
  console.log('==========================================');
  console.log('ADMIN:        admin@arges.app');
  console.log('FAMILY HEAD:  lakshmi@arges.app (Mother)');
  console.log('FAMILY MEMBER: suresh@arges.app (Father)');
  console.log('FAMILY MEMBER: karthik@arges.app (Brother)');
  console.log('FAMILY MEMBER: priya@arges.app (Sister - pending)');
  console.log('BLIND USER:   ravi@arges.app');
  console.log('BLIND USER:   priya.devi@arges.app');
  console.log('BLIND USER:   anjali@arges.app');
  console.log('HELPER:       vikram@arges.app');
  console.log('HELPER:       deepa@arges.app');
  console.log('\nDevice pairing code: ARG-7K3M9-P2Q8R-4X');
  console.log('==========================================\n');

  await mongoose.disconnect();
  console.log('Done.');
}

seed().catch(err => {
  console.error('Seed failed:', err);
  process.exit(1);
});
