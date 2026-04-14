import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 120,
    },
    description: {
      type: String,
      trim: true,
      default: '',
      maxlength: 600,
    },
    status: {
      type: String,
      enum: ['todo', 'in-progress', 'done'],
      required: true,
      default: 'todo',
    },
  },
  {
    timestamps: true,
  },
);

export const Task = mongoose.model('Task', taskSchema);
