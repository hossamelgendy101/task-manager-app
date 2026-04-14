import dotenv from 'dotenv';

dotenv.config();

const nodeEnv = process.env.NODE_ENV || 'development';

function required(name) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`${name} is required.`);
  }

  return value;
}

function parseOrigins(value) {
  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

const jwtSecret = required('JWT_SECRET');

if (jwtSecret.length < 16) {
  throw new Error('JWT_SECRET must be at least 16 characters long.');
}

export const env = {
  clientUrls: parseOrigins(process.env.CLIENT_URLS || 'http://localhost:5173'),
  isDevelopment: nodeEnv === 'development',
  isProduction: nodeEnv === 'production',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  jwtSecret,
  mongoUri: required('MONGO_URI'),
  nodeEnv,
  port: Number(process.env.PORT || 5000),
};
