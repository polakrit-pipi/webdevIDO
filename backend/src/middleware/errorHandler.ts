import { Request, Response, NextFunction } from 'express';

/**
 * Unified error handler middleware.
 * Catches all errors and returns a consistent JSON response.
 */
export const errorHandler = (err: any, req: Request, res: Response, _next: NextFunction): void => {
  console.error(`[ERROR] ${req.method} ${req.path}:`, err);

  // Prisma known errors
  if (err.code === 'P2002') {
    res.status(409).json({
      error: {
        status: 409,
        name: 'ConflictError',
        message: `A record with this value already exists: ${err.meta?.target?.join(', ')}`,
      },
    });
    return;
  }

  if (err.code === 'P2025') {
    res.status(404).json({
      error: {
        status: 404,
        name: 'NotFoundError',
        message: 'Record not found',
      },
    });
    return;
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    res.status(401).json({
      error: {
        status: 401,
        name: 'UnauthorizedError',
        message: 'Invalid or expired token',
      },
    });
    return;
  }

  // Validation errors
  if (err.name === 'ValidationError') {
    res.status(400).json({
      error: {
        status: 400,
        name: 'ValidationError',
        message: err.message,
      },
    });
    return;
  }

  // Default server error
  const statusCode = err.statusCode || err.status || 500;
  res.status(statusCode).json({
    error: {
      status: statusCode,
      name: err.name || 'InternalServerError',
      message: err.message || 'An unexpected error occurred',
    },
  });
};
