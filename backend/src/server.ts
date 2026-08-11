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
app.use(cors({ origin: ['http://localhost:5173', 'http://localhost:8765', 'http://127.0.0.1:5173'] }));
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
