// Enterprise Mall - Server Configuration
// Aggregates server-level settings for use across the application

import { PORT, NODE_ENV, CORS_ORIGIN } from './index';

export const SERVER_CONFIG = {
  port: PORT,
  nodeEnv: NODE_ENV,
  corsOrigin: CORS_ORIGIN,
};
