import { Request, Response, NextFunction } from 'express';
import prisma from '../config/database';
import { wrapSingle } from '../utils/strapiCompat';

/**
 * POST /api/carts
 * Create a new cart for a user.
 */
export const createCart = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { data } = req.body;
    if (!data) {
      res.status(400).json({ error: { message: 'Missing data' } });
      return;
    }

    // Determine the user: from body or from auth
    const userId = data.user || req.user?.id;
    if (!userId) {
      res.status(400).json({ error: { message: 'User is required' } });
      return;
    }

    // Resolve user by numeric id or documentId
    let resolvedUserId: number;
    if (typeof userId === 'number') {
      resolvedUserId = userId;
    } else {
      const user = await prisma.user.findUnique({ where: { documentId: String(userId) } });
      if (!user) {
        res.status(404).json({ error: { message: 'User not found' } });
        return;
      }
      resolvedUserId = user.id;
    }

    // Build cart items
    const cartItems = (data.items || []).map((item: any) => ({
      sku: item.sku,
      quantity: item.quantity || 1,
      price_at_added: item.price_at_added,
      added_at: item.added_at ? new Date(item.added_at) : new Date(),
      productId: item.product ? resolveProductId(item.product) : undefined,
    }));

    // Need to resolve product IDs that might be documentIds
    const resolvedItems = await Promise.all(
      cartItems.map(async (item: any) => {
        if (item.productId && typeof item.productId === 'string') {
          const product = await prisma.product.findUnique({ where: { documentId: item.productId } });
          return { ...item, productId: product?.id || null };
        }
        return item;
      })
    );

    const cart = await prisma.cart.create({
      data: {
        userId: resolvedUserId,
        publishedAt: data.publishedAt ? new Date(data.publishedAt) : new Date(),
        items: {
          create: resolvedItems,
        },
      },
      include: {
        items: { include: { product: { include: { variants: true } } } },
      },
    });

    res.status(201).json(wrapSingle(cart));
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/carts/:documentId
 * Update a cart (replace items).
 */
export const updateCart = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const documentId = req.params.documentId as string;
    const { data } = req.body;

    if (!data) {
      res.status(400).json({ error: { message: 'Missing data' } });
      return;
    }

    const cart = await prisma.cart.findUnique({ where: { documentId } });
    if (!cart) {
      res.status(404).json({ error: { message: 'Cart not found' } });
      return;
    }

    // Delete existing items and replace with new ones
    await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });

    // Build and resolve new items
    const newItems = await Promise.all(
      (data.items || []).map(async (item: any) => {
        let productId: number | null = null;

        if (item.product) {
          if (typeof item.product === 'number') {
            productId = item.product;
          } else if (typeof item.product === 'string') {
            const product = await prisma.product.findUnique({ where: { documentId: item.product } });
            productId = product?.id || null;
          } else if (typeof item.product === 'object' && item.product.documentId) {
            const product = await prisma.product.findUnique({ where: { documentId: item.product.documentId } });
            productId = product?.id || null;
          }
        }

        return {
          sku: item.sku,
          quantity: item.quantity || 1,
          price_at_added: item.price_at_added,
          added_at: item.added_at ? new Date(item.added_at) : new Date(),
          productId,
          cartId: cart.id,
        };
      })
    );

    await prisma.cartItem.createMany({ data: newItems });

    const updatedCart = await prisma.cart.findUnique({
      where: { documentId },
      include: {
        items: { include: { product: { include: { variants: true } } } },
      },
    });

    res.json(wrapSingle(updatedCart));
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/carts/:documentId
 */
export const getCart = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const documentId = req.params.documentId as string;

    const cart = await prisma.cart.findUnique({
      where: { documentId },
      include: {
        items: { include: { product: { include: { variants: true } } } },
      },
    });

    if (!cart) {
      res.status(404).json({ error: { message: 'Cart not found' } });
      return;
    }

    res.json(wrapSingle(cart));
  } catch (error) {
    next(error);
  }
};

function resolveProductId(product: any): any {
  if (typeof product === 'number') return product;
  if (typeof product === 'string') return product; // Will be resolved later
  if (typeof product === 'object' && product.documentId) return product.documentId;
  return null;
}
