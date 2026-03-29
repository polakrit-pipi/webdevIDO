import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import prisma from '../config/database';

// Extend Express Request to include user
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

/**
 * JWT Authentication middleware.
 * Extracts Bearer token from Authorization header, verifies it,
 * and attaches the user to req.user.
 */
export const authenticate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ error: { message: 'Missing or invalid authorization header' } });
      return;
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, env.JWT_SECRET) as { id: number };

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!user || user.blocked) {
      res.status(401).json({ error: { message: 'User not found or blocked' } });
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: { message: 'Invalid or expired token' } });
  }
};

/**
 * Optional auth — attaches user if token is valid, but doesn't block if missing.
 */
export const optionalAuth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next();
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, env.JWT_SECRET) as { id: number };

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (user && !user.blocked) {
      req.user = user;
    }
  } catch {
    // Token invalid — just continue without user
  }
  next();
};
