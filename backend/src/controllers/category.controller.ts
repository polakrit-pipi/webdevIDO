import { Request, Response, NextFunction } from 'express';
import prisma from '../config/database';
import { wrapCollection, wrapSingle } from '../utils/strapiCompat';

/**
 * GET /api/categories
 * List all categories. Supports populate=categoryPic.
 */
export const getCategories = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const categories = await prisma.category.findMany({
      where: { publishedAt: { not: null } },
      orderBy: { createdAt: 'desc' },
    });

    res.json(wrapCollection(categories));
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/categories/:documentId
 */
export const getCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const documentId = req.params.documentId as string;

    const category = await prisma.category.findUnique({
      where: { documentId },
      include: { pro_cats: true },
    });

    if (!category) {
      res.status(404).json({ error: { message: 'Category not found' } });
      return;
    }

    res.json(wrapSingle(category));
  } catch (error) {
    next(error);
  }
};
