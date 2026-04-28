import { Request, Response, NextFunction } from 'express';
import prisma from '../config/database';
import { wrapCollection, wrapSingle } from '../utils/strapiCompat';

/**
 * POST /api/wishlists
 * Add a product to wishlist. Auto-associates with authenticated user.
 */
export const createWishlist = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { data } = req.body;
    if (!data) {
      res.status(400).json({ error: { message: 'Missing data' } });
      return;
    }

    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ error: { message: 'Authentication required' } });
      return;
    }

    // Resolve product — can be numeric id or documentId
    let productId: number | null = null;
    if (data.product) {
      if (typeof data.product === 'number') {
        productId = data.product;
      } else if (typeof data.product === 'string') {
        const product = await prisma.product.findUnique({ where: { documentId: data.product } });
        productId = product?.id || null;
      }
    }

    const wishlist = await prisma.wishlist.create({
      data: {
        userId,
        productId,
        publishedAt: data.publishedAt ? new Date(data.publishedAt) : new Date(),
        added_at: new Date(),
      },
      include: { product: true },
    });

    res.status(201).json(wrapSingle(wishlist));
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/wishlists/:documentId
 * Remove a wishlist entry.
 */
export const deleteWishlist = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const documentId = req.params.documentId as string;

    const wishlist = await prisma.wishlist.findUnique({ where: { documentId } });
    if (!wishlist) {
      res.status(404).json({ error: { message: 'Wishlist item not found' } });
      return;
    }

    await prisma.wishlist.delete({ where: { documentId } });

    res.json(wrapSingle(wishlist));
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/wishlists
 * List all wishlists (usually filtered by user via populate on /users/me).
 */
export const getWishlists = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const wishlists = await prisma.wishlist.findMany({
      where: { publishedAt: { not: null } },
      include: { product: true },
      orderBy: { createdAt: 'desc' },
    });

    res.json(wrapCollection(wishlists));
  } catch (error) {
    next(error);
  }
};
