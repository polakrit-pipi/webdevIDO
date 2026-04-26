import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../config/database';
import { env } from '../config/env';

/**
 * POST /api/auth/local
 * Login with identifier (email/username) + password.
 * Returns JWT + user object (Strapi-compatible format).
 */
export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      res.status(400).json({
        error: { message: 'identifier and password are required' },
      });
      return;
    }

    // Find user by email or username
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: identifier },
          { username: identifier },
        ],
      },
    });

    if (!user) {
      res.status(400).json({
        error: { message: 'Invalid identifier or password' },
      });
      return;
    }

    if (user.blocked) {
      res.status(400).json({
        error: { message: 'Your account has been blocked' },
      });
      return;
    }

    // Verify password
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      res.status(400).json({
        error: { message: 'Invalid identifier or password' },
      });
      return;
    }

    // Issue JWT
    const token = jwt.sign({ id: user.id }, env.JWT_SECRET, {
      expiresIn: env.JWT_EXPIRES_IN as any,
    });

    // Return same format as Strapi
    const { password: _, ...userWithoutPassword } = user;
    res.json({
      jwt: token,
      user: userWithoutPassword,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/custom-register
 * Register a new user with profile + address data.
 * Returns JWT + user object.
 */
export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { username, email, password, firstname, lastname, address } = req.body;

    if (!username || !email || !password) {
      res.status(400).json({
        error: { message: 'กรุณากรอก Username, Email และ Password' },
      });
      return;
    }

    // Check if user already exists
    const existing = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });

    if (existing) {
      res.status(400).json({
        error: { message: 'Email or username already taken' },
      });
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        firstname: firstname || null,
        lastname: lastname || null,
        address: address || null,
        role: 'authenticated',
        provider: 'local',
        confirmed: true,
      },
    });

    // Issue JWT
    const token = jwt.sign({ id: newUser.id }, env.JWT_SECRET, {
      expiresIn: env.JWT_EXPIRES_IN as any,
    });

    const { password: _, ...userWithoutPassword } = newUser;
    res.json({
      jwt: token,
      user: userWithoutPassword,
    });
  } catch (error) {
    next(error);
  }
};
