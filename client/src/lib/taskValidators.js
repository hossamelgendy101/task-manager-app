import { TASK_STATUSES } from '../constants/taskOptions';

const allowedStatuses = TASK_STATUSES.map((item) => item.value);

export function validateTaskForm(values) {
  const errors = {};
  const trimmedTitle = values.title.trim();
  const trimmedDescription = values.description.trim();

  if (!trimmedTitle) {
    errors.title = 'Title is required.';
  } else if (trimmedTitle.length < 3) {
    errors.title = 'Title must be at least 3 characters.';
  } else if (trimmedTitle.length > 120) {
    errors.title = 'Title must be 120 characters or less.';
  }

  if (trimmedDescription.length > 600) {
    errors.description = 'Description must be 600 characters or less.';
  }

  if (!allowedStatuses.includes(values.status)) {
    errors.status = 'Select a valid status.';
  }

  return errors;
}

