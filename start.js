// Enterprise Mall - Render.com Production Entry Point
// Run: node start.js (from project root)

const path = require('path');

const rootDir = __dirname;

// Set env vars for deployment — Render sets CWD to repo root
process.env.CLIENT_DIST = process.env.CLIENT_DIST || path.join(rootDir, 'client', 'dist');
process.env.DATABASE_URL = process.env.DATABASE_URL || 'file:' + path.join(rootDir, 'server', 'prisma', 'dev.db').replace(/\\/g, '/');
process.env.NODE_ENV = process.env.NODE_ENV || 'production';
process.env.PORT = process.env.PORT || '10000';

console.log('[Enterprise Mall] Starting production server...');
console.log('[Enterprise Mall] PORT:', process.env.PORT);
console.log('[Enterprise Mall] DATABASE_URL:', process.env.DATABASE_URL);
console.log('[Enterprise Mall] CLIENT_DIST:', process.env.CLIENT_DIST);

// Start the server
require('./server/dist/index.js');
