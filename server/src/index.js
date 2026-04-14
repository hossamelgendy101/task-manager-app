import cors from 'cors';
import express from 'express';
import helmet from 'helmet';

import { connectToDatabase } from './config/database.js';
import { env } from './config/env.js';
import { errorHandler, notFoundHandler } from './middleware/errorMiddleware.js';
import authRoutes from './routes/authRoutes.js';
import taskRoutes from './routes/taskRoutes.js';

const app = express();

const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
];

app.disable('x-powered-by');
app.use(helmet());

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error('Origin is not allowed by CORS.'));
    },
    credentials: true,
  }),
);

app.use(express.json({ limit: '1mb' }));

app.get('/api/health', (_req, res) => {
  res.json({
    environment: env.nodeEnv,
    status: 'ok',
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

async function startServer() {
  await connectToDatabase();

  app.listen(env.port, () => {
    console.log(`Server is running on port ${env.port}`);
  });
}

startServer().catch((error) => {
  console.error('Failed to start server');
  console.error(error.message);

  if (env.isDevelopment && error.message?.includes('Could not connect to MongoDB')) {
    console.error('Tip: start MongoDB locally or replace MONGO_URI in server/.env with a working MongoDB Atlas connection string.');
  }

  if (env.isDevelopment && !error.message?.includes('Could not connect to MongoDB')) {
    console.error(error);
  }

  process.exit(1);
});