import { Request, Response, NextFunction } from 'express';
import prisma from '../config/database';
import { wrapSingle } from '../utils/strapiCompat';

/**
 * GET /api/color
 * Returns the single color config entry (single-type).
 * Frontend expects: { data: { color: {...} } }
 */
export const getColor = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const color = await prisma.color.findFirst({
      where: { publishedAt: { not: null } },
    });

    res.json(wrapSingle(color));
  } catch (error) {
    next(error);
  }
};
