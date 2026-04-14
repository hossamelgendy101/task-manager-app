import express from 'express';

import { requireAuth } from '../middleware/authMiddleware.js';
import { Task } from '../models/Task.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { createHttpError } from '../utils/httpError.js';
import { serializeTask } from '../utils/serializers.js';
import {
  validateTaskInput,
  validateTaskStatus,
} from '../utils/validators.js';

const router = express.Router();

router.use(requireAuth);

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const userTasks = await Task.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .lean();

    res.json({
      tasks: userTasks.map(serializeTask),
    });
  }),
);

router.post(
  '/',
  asyncHandler(async (req, res) => {
    const { isValid, errors, sanitizedData } = validateTaskInput(req.body);

    if (!isValid) {
      throw createHttpError(400, 'Validation failed.', errors);
    }

    const task = await Task.create({
      userId: req.user._id,
      title: sanitizedData.title,
      description: sanitizedData.description,
      status: sanitizedData.status,
    });

    res.status(201).json({
      message: 'Task created successfully.',
      task: serializeTask(task),
    });
  }),
);

router.put(
  '/:taskId',
  asyncHandler(async (req, res) => {
    const { isValid, errors, sanitizedData } = validateTaskInput(req.body);

    if (!isValid) {
      throw createHttpError(400, 'Validation failed.', errors);
    }

    const task = await Task.findOne({
      _id: req.params.taskId,
      userId: req.user._id,
    });

    if (!task) {
      throw createHttpError(404, 'Task not found.');
    }

    task.title = sanitizedData.title;
    task.description = sanitizedData.description;
    task.status = sanitizedData.status;
    await task.save();

    res.json({
      message: 'Task updated successfully.',
      task: serializeTask(task),
    });
  }),
);

router.patch(
  '/:taskId/status',
  asyncHandler(async (req, res) => {
    const status = req.body?.status?.trim();
    const { isValid, errors } = validateTaskStatus(status);

    if (!isValid) {
      throw createHttpError(400, 'Validation failed.', errors);
    }

    const task = await Task.findOne({
      _id: req.params.taskId,
      userId: req.user._id,
    });

    if (!task) {
      throw createHttpError(404, 'Task not found.');
    }

    task.status = status;
    await task.save();

    res.json({
      message: 'Task status updated successfully.',
      task: serializeTask(task),
    });
  }),
);

router.delete(
  '/:taskId',
  asyncHandler(async (req, res) => {
    const task = await Task.findOneAndDelete({
      _id: req.params.taskId,
      userId: req.user._id,
    });

    if (!task) {
      throw createHttpError(404, 'Task not found.');
    }

    res.json({
      message: 'Task deleted successfully.',
    });
  }),
);

export default router;
