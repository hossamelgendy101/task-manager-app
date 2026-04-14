import jwt from 'jsonwebtoken';

import { env } from '../config/env.js';
import { User } from '../models/User.js';
import { createHttpError } from '../utils/httpError.js';

export async function requireAuth(req, _res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    return next(createHttpError(401, 'Authorization token is required.'));
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = jwt.verify(token, env.jwtSecret, {
      algorithms: ['HS256'],
    });
    const user = await User.findById(payload.sub).select('_id name email');

    if (!user) {
      return next(createHttpError(401, 'Invalid authentication token.'));
    }

    req.user = user;
    return next();
  } catch {
    return next(createHttpError(401, 'Invalid or expired authentication token.'));
  }
}
