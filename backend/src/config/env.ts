import dotenv from 'dotenv';
dotenv.config();

export const env = {
  // Server
  PORT: parseInt(process.env.PORT || '1337', 10),
  HOST: process.env.HOST || '0.0.0.0',
  NODE_ENV: process.env.NODE_ENV || 'development',

  // Database
  DATABASE_URL: process.env.DATABASE_URL || 'postgresql://idoidentity:idoidentity_pass@localhost:5432/db?schema=public',

  // JWT
  JWT_SECRET: process.env.JWT_SECRET || 'DiRtebBIc961b6uGYGdk5A==',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '30d',

  // Admin
  ADMIN_EMAIL: process.env.ADMIN_EMAIL || 'admin@ideabyido.com',
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || 'admin123',
  SESSION_SECRET: process.env.SESSION_SECRET || 'super-secret-session-key-change-in-production',

  // Upload
  UPLOAD_DIR: process.env.UPLOAD_DIR || './public/uploads',
};
