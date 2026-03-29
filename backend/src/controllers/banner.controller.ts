import { Request, Response, NextFunction } from 'express';
import prisma from '../config/database';
import { wrapSingle } from '../utils/strapiCompat';

/**
 * GET /api/banner
 * Returns the single banner entry (single-type).
 * Supports populate=* for Image field.
 */
export const getBanner = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const banner = await prisma.banner.findFirst({
      where: { publishedAt: { not: null } },
    });

    res.json(wrapSingle(banner));
  } catch (error) {
    next(error);
  }
};
