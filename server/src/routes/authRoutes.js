import bcrypt from 'bcrypt';
import express from 'express';
import jwt from 'jsonwebtoken';

import { env } from '../config/env.js';
import { requireAuth } from '../middleware/authMiddleware.js';
import { User } from '../models/User.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { createHttpError } from '../utils/httpError.js';
import { serializeUser } from '../utils/serializers.js';
import {
  validateLoginInput,
  validateRegisterInput,
} from '../utils/validators.js';

const router = express.Router();

function createToken(user) {
  return jwt.sign(
    {
      email: user.email,
      name: user.name,
    },
    env.jwtSecret,
    {
      algorithm: 'HS256',
      expiresIn: env.jwtExpiresIn,
      issuer: 'task-manager-server',
      subject: user._id.toString(),
    },
  );
}

router.post(
  '/register',
  asyncHandler(async (req, res) => {
    const { isValid, errors, sanitizedData } = validateRegisterInput(req.body);

    if (!isValid) {
      throw createHttpError(400, 'Validation failed.', errors);
    }

    const existingUser = await User.findOne({ email: sanitizedData.email });

    if (existingUser) {
      throw createHttpError(409, 'An account with this email already exists.');
    }

    const passwordHash = await bcrypt.hash(sanitizedData.password, 12);

    const user = await User.create({
      name: sanitizedData.name,
      email: sanitizedData.email,
      passwordHash,
    });

    const token = createToken(user);

    res.status(201).json({
      message: 'Account created successfully.',
      token,
      user: serializeUser(user),
    });
  }),
);

router.post(
  '/login',
  asyncHandler(async (req, res) => {
    const { isValid, errors, sanitizedData } = validateLoginInput(req.body);

    if (!isValid) {
      throw createHttpError(400, 'Validation failed.', errors);
    }

    const user = await User.findOne({ email: sanitizedData.email });

    if (!user) {
      throw createHttpError(401, 'Invalid email or password.');
    }

    const isPasswordValid = await bcrypt.compare(
      sanitizedData.password,
      user.passwordHash,
    );

    if (!isPasswordValid) {
      throw createHttpError(401, 'Invalid email or password.');
    }

    const token = createToken(user);

    res.json({
      message: 'Login successful.',
      token,
      user: serializeUser(user),
    });
  }),
);

router.get(
  '/me',
  requireAuth,
  asyncHandler(async (req, res) => {
    res.json({
      user: serializeUser(req.user),
    });
  }),
);

export default router;
