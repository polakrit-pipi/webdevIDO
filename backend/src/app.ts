import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import path from 'path';
import { env } from './config/env';
import apiRoutes from './routes';
import adminRoutes from './routes/admin.routes';
import { errorHandler } from './middleware/errorHandler';

/**
 * Create and configure the Express application.
 * AdminJS is loaded dynamically to avoid issues during build.
 */
export async function createApp() {
  const app = express();

  // ============================================
  // Core Middleware
  // ============================================
  app.use(cors({
    origin: true, // Allow all origins in dev; restrict in production
    credentials: true,
  }));
  app.use(morgan(env.NODE_ENV === 'production' ? 'combined' : 'dev'));

  // ============================================
  // Static File Serving (uploads / media)
  // ============================================
  app.use('/uploads', express.static(path.resolve(env.UPLOAD_DIR)));

  // ============================================
  // Body Parsers, API Routes & Admin API
  // ============================================
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true }));
  app.use('/api', apiRoutes);
  app.use('/api/admin', adminRoutes);
  console.log('✅ Custom Admin API mounted at /api/admin');

  // Health check
  app.get('/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // ============================================
  // Error Handler (must be last)
  // ============================================
  app.use(errorHandler);

  return app;
}
