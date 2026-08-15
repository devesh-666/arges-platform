import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { connectDB, isConnected } from './lib/mongo';
import authRoutes from './routes/auth';
import apiRoutes from './routes/index';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());

// Allowed browser origins. Extra origins can be added via CORS_ORIGINS
// (comma-separated) without a code change — e.g. Netlify deploy previews.
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:8765',
  'http://localhost:8766',
  'http://127.0.0.1:5173',
  // Current production site.
  'https://arges-vision-web.netlify.app',
  // Previous site, kept so any existing links keep working.
  'https://arges-vision.netlify.app',
  ...(process.env.CORS_ORIGINS?.split(',').map((o) => o.trim()).filter(Boolean) ?? []),
];

// Netlify deploy previews are <branch-or-hash>--<site>.netlify.app.
const NETLIFY_PREVIEW = /^https:\/\/[a-z0-9-]+--arges-vision(-web)?\.netlify\.app$/;

app.use(cors({
  origin(origin, callback) {
    // Non-browser callers (curl, health checks, server-to-server) send no Origin.
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    if (NETLIFY_PREVIEW.test(origin)) return callback(null, true);
    // Reject by omitting the CORS header rather than throwing — the browser still
    // blocks the response, but the request doesn't surface as a 500 in the logs.
    return callback(null, false);
  },
}));
app.use(express.json());
app.use(morgan('dev'));

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', db: isConnected() ? 'connected' : 'mock', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api', apiRoutes);

// Error handler
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ success: false, error: 'Internal server error' });
});

// Start
async function start() {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`\n┌──────────────────────────────────────────┐`);
    console.log(`│  ARGES API Server                        │`);
    console.log(`│  http://localhost:${PORT}                   │`);
    console.log(`│  Database: ${isConnected() ? 'MongoDB Connected ✅' : 'Mock Mode (no DB) ⚠️ '}    │`);
    console.log(`└──────────────────────────────────────────┘\n`);
  });
}

start();
