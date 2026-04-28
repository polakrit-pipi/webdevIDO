import { Request, Response, NextFunction } from 'express';
import prisma from '../config/database';
import { wrapCollection, wrapSingle } from '../utils/strapiCompat';

/**
 * GET /api/new-products
 * List all new/featured products with optional populate.
 */
export const getNewProducts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const include: any = {};

    // Handle populate=*
    const pop = req.query.populate;
    if (pop === '*' || pop) {
      include.product = true;
    }

    const newProducts = await prisma.newProduct.findMany({
      where: { publishedAt: { not: null } },
      include,
      orderBy: { createdAt: 'desc' },
    });

    res.json(wrapCollection(newProducts));
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/new-products/:documentId
 */
export const getNewProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const documentId = req.params.documentId as string;

    const newProduct = await prisma.newProduct.findUnique({
      where: { documentId },
      include: { product: true },
    });

    if (!newProduct) {
      res.status(404).json({ error: { message: 'NewProduct not found' } });
      return;
    }

    res.json(wrapSingle(newProduct));
  } catch (error) {
    next(error);
  }
};
