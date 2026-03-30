import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';

const ADMIN_JWT_SECRET = env.JWT_SECRET + '_admin';

export interface AdminTokenPayload {
  email: string;
  role: 'admin';
  iat?: number;
  exp?: number;
}

/**
 * Generates a signed admin JWT (24h expiry).
 */
export function signAdminToken(email: string): string {
  return jwt.sign({ email, role: 'admin' }, ADMIN_JWT_SECRET, { expiresIn: '24h' });
}

/**
 * Express middleware — verifies the Bearer token for admin routes.
 */
export function verifyAdminToken(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: { status: 401, message: 'Admin token required' } });
    return;
  }

  const token = authHeader.slice(7);

  try {
    const payload = jwt.verify(token, ADMIN_JWT_SECRET) as AdminTokenPayload;
    if (payload.role !== 'admin') {
      res.status(403).json({ error: { status: 403, message: 'Not an admin token' } });
      return;
    }
    (req as any).admin = payload;
    next();
  } catch (err) {
    res.status(401).json({ error: { status: 401, message: 'Invalid or expired admin token' } });
  }
}
