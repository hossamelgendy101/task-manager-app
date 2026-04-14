import cors from 'cors';
import express from 'express';
import helmet from 'helmet';

import { connectToDatabase } from '../server/src/config/database.js';
import { env } from '../server/src/config/env.js';
import {
  errorHandler,
  notFoundHandler,
} from '../server/src/middleware/errorMiddleware.js';
import authRoutes from '../server/src/routes/authRoutes.js';
import taskRoutes from '../server/src/routes/taskRoutes.js';
import { createHttpError } from '../server/src/utils/httpError.js';

const app = express();

app.disable('x-powered-by');
app.use(helmet());
app.use(
  cors({
    credentials: true,
    origin(origin, callback) {
      if (!origin || env.clientUrls.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(createHttpError(403, 'Origin is not allowed by CORS.'));
    },
  }),
);
app.use(express.json({ limit: '1mb' }));

app.get('/health', (_req, res) => {
  res.json({
    environment: env.nodeEnv,
    status: 'ok',
  });
});

app.use('/auth', authRoutes);
app.use('/tasks', taskRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default async function handler(req, res) {
  await connectToDatabase();
  return app(req, res);
}
