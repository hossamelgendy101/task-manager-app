import mongoose from 'mongoose';

import { env } from './env.js';

let connectionPromise;

export async function connectToDatabase() {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (connectionPromise) {
    return connectionPromise;
  }

  connectionPromise = mongoose.connect(env.mongoUri).catch((error) => {
    connectionPromise = null;

    if (error?.name === 'MongooseServerSelectionError') {
      error.message = `Could not connect to MongoDB at ${env.mongoUri}. Make sure MongoDB is running or update MONGO_URI.`;
    }

    throw error;
  });

  return connectionPromise;
}
