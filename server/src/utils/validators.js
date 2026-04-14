const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const allowedTaskStatuses = ['todo', 'in-progress', 'done'];

export function validateRegisterInput(body) {
  const errors = {};
  const name = body?.name?.trim();
  const email = body?.email?.trim().toLowerCase();
  const password = body?.password ?? '';

  if (!name) {
    errors.name = 'Name is required.';
  } else if (name.length < 2) {
    errors.name = 'Name must be at least 2 characters.';
  }

  if (!email) {
    errors.email = 'Email is required.';
  } else if (!emailPattern.test(email)) {
    errors.email = 'Enter a valid email address.';
  }

  if (!password) {
    errors.password = 'Password is required.';
  } else if (password.length < 8) {
    errors.password = 'Password must be at least 8 characters.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    sanitizedData: {
      name,
      email,
      password,
    },
  };
}

export function validateLoginInput(body) {
  const errors = {};
  const email = body?.email?.trim().toLowerCase();
  const password = body?.password ?? '';

  if (!email) {
    errors.email = 'Email is required.';
  } else if (!emailPattern.test(email)) {
    errors.email = 'Enter a valid email address.';
  }

  if (!password) {
    errors.password = 'Password is required.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    sanitizedData: {
      email,
      password,
    },
  };
}

export function validateTaskInput(body) {
  const errors = {};
  const title = body?.title?.trim();
  const description = body?.description?.trim() || '';
  const status = body?.status?.trim();

  if (!title) {
    errors.title = 'Title is required.';
  } else if (title.length < 3) {
    errors.title = 'Title must be at least 3 characters.';
  } else if (title.length > 120) {
    errors.title = 'Title must be 120 characters or less.';
  }

  if (description.length > 600) {
    errors.description = 'Description must be 600 characters or less.';
  }

  if (!status) {
    errors.status = 'Status is required.';
  } else if (!allowedTaskStatuses.includes(status)) {
    errors.status = 'Status must be todo, in-progress, or done.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    sanitizedData: {
      title,
      description,
      status,
    },
  };
}

export function validateTaskStatus(status) {
  if (!allowedTaskStatuses.includes(status)) {
    return {
      isValid: false,
      errors: {
        status: 'Status must be todo, in-progress, or done.',
      },
    };
  }

  return {
    isValid: true,
    errors: {},
  };
}

