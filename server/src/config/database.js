import mongoose from 'mongoose';

import { env } from './env.js';

export async function connectToDatabase() {
  try {
    await mongoose.connect(env.mongoUri);
  } catch (error) {
    if (error?.name === 'MongooseServerSelectionError') {
      error.message = `Could not connect to MongoDB at ${env.mongoUri}. Make sure MongoDB is running or update MONGO_URI.`;
    }

    throw error;
  }
}
