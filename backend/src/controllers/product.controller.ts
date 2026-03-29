import { Request, Response, NextFunction } from 'express';
import prisma from '../config/database';
import { wrapCollection, wrapSingle, parsePopulate } from '../utils/strapiCompat';

/**
 * GET /api/products
 * List all products with optional populate and filters.
 */
export const getProducts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Build include from populate params
    const include = buildProductInclude(req.query);

    const products = await prisma.product.findMany({
      where: {
        publishedAt: { not: null }, // Only published
      },
      include,
      orderBy: { createdAt: 'desc' },
    });

    res.json(wrapCollection(products));
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/products/:documentId
 * Get a single product by documentId.
 */
export const getProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const documentId = req.params.documentId as string;
    const include = buildProductInclude(req.query);

    const product = await prisma.product.findUnique({
      where: { documentId },
      include,
    });

    if (!product) {
      res.status(404).json({ error: { message: 'Product not found' } });
      return;
    }

    res.json(wrapSingle(product));
  } catch (error) {
    next(error);
  }
};

/**
 * Parse product-specific populate query params.
 *
 * Frontend sends:
 *   populate[variants][populate]=*
 *   populate[cat_pro][populate]=categoryPic
 */
function buildProductInclude(query: any): any {
  const include: any = {};

  if (!query.populate) {
    return { variants: true, cat_pro: true };
  }

  const pop = query.populate;

  // populate=* → include everything
  if (pop === '*') {
    return {
      variants: true,
      cat_pro: true,
      wishlists: true,
    };
  }

  if (typeof pop === 'object') {
    // Handle variants
    if (pop.variants) {
      include.variants = true; // Variants are always fully included
    }

    // Handle cat_pro (category relation)
    if (pop.cat_pro) {
      include.cat_pro = true; // Category is flat, no nested populate needed
    }

    // Handle wishlists
    if (pop.wishlists) {
      include.wishlists = true;
    }
  }

  return include;
}
