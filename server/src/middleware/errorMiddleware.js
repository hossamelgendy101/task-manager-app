export function notFoundHandler(_req, res) {
  res.status(404).json({
    message: 'Route not found.',
  });
}

function normalizeMongoError(err) {
  if (err?.code === 11000) {
    return {
      statusCode: 409,
      message: 'A record with this value already exists.',
    };
  }

  if (err?.name === 'CastError') {
    return {
      statusCode: 404,
      message: 'Requested record was not found.',
    };
  }

  if (err?.name === 'ValidationError') {
    const details = Object.fromEntries(
      Object.entries(err.errors).map(([key, value]) => [key, value.message]),
    );

    return {
      statusCode: 400,
      message: 'Validation failed.',
      details,
    };
  }

  return null;
}

export function errorHandler(err, _req, res, _next) {
  const normalizedError = normalizeMongoError(err);
  const statusCode = normalizedError?.statusCode || err.statusCode || 500;
  const message =
    normalizedError?.message ||
    err.message ||
    'Internal server error.';
  const details = normalizedError?.details || err.details;
  const isOperational = statusCode < 500;

  res.status(statusCode).json({
    message: isOperational ? message : 'Something went wrong.',
    ...(details ? { errors: details } : {}),
    ...(!isOperational && process.env.NODE_ENV !== 'production'
      ? { debug: message }
      : {}),
  });
}
