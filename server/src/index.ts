// Enterprise Mall - Server Entry Point
// Initializes Express app, connects to database, mounts middleware and routes

import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import path from 'path';

import { connectDatabase } from './config/database';
import { SERVER_CONFIG } from './config/server';
import { errorHandler } from './middleware/errorHandler';
import { mountRoutes } from './routes';

/**
 * Recursively transform JSON-string 'images' fields into arrays.
 * SQLite stores images as JSON strings; this middleware auto-parses them for the frontend.
 */
function transformImages(obj: any): any {
  if (!obj || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map(transformImages);
  // Preserve Date objects — don't transform into empty {}
  if (obj instanceof Date) return obj;

  const result: any = {};
  for (const key of Object.keys(obj)) {
    const val = obj[key];
    if (key === 'images' && typeof val === 'string') {
      try { result[key] = JSON.parse(val); } catch { result[key] = []; }
    } else if (typeof val === 'object' && val !== null) {
      result[key] = transformImages(val);
    } else {
      result[key] = val;
    }
  }
  return result;
}

const app = express();

// Middleware: JSON parsing
app.use(express.json());

// Middleware: CORS
app.use(cors({
  origin: SERVER_CONFIG.corsOrigin,
  credentials: true,
}));

// Middleware: Auto-parse JSON-string 'images' fields in API responses (SQLite compatibility)
app.use((_req: express.Request, res: express.Response, next: express.NextFunction) => {
  const originalJson = res.json.bind(res);
  res.json = (data: any) => originalJson(transformImages(data));
  next();
});

// Middleware: Static files for uploads
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Mount all API routes
mountRoutes(app);

// Production: Serve built React frontend
const clientDistPath = process.env.CLIENT_DIST
  ? path.resolve(process.env.CLIENT_DIST)
  : path.join(process.cwd(), '..', 'client', 'dist');
app.use(express.static(clientDistPath));

// SPA fallback: All non-API routes serve index.html
app.get('*', (_req: express.Request, res: express.Response) => {
  res.sendFile(path.join(clientDistPath, 'index.html'));
});

// Global error handler (must be mounted after all routes)
app.use(errorHandler);

// Start server
const startServer = async (): Promise<void> => {
  try {
    await connectDatabase();
    app.listen(SERVER_CONFIG.port, () => {
      console.log(`[Enterprise Mall] Server running on http://localhost:${SERVER_CONFIG.port}`);
      console.log(`[Enterprise Mall] Environment: ${SERVER_CONFIG.nodeEnv}`);
    });
  } catch (error) {
    console.error('[Enterprise Mall] Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export default app;
