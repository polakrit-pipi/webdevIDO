import { Request, Response, NextFunction } from 'express';
import prisma from '../config/database';
import { wrapCollection, wrapSingle } from '../utils/strapiCompat';

/**
 * GET /api/transactions
 * List transactions for the authenticated user.
 */
export const getTransactions = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?.id;

    const transactions = await prisma.transaction.findMany({
      where: {
        userId,
        publishedAt: { not: null },
      },
      include: {
        items: { include: { product: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(wrapCollection(transactions));
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/transactions/:documentId
 */
export const getTransaction = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const documentId = req.params.documentId as string;

    const transaction = await prisma.transaction.findUnique({
      where: { documentId },
      include: {
        items: { include: { product: true } },
      },
    });

    if (!transaction) {
      res.status(404).json({ error: { message: 'Transaction not found' } });
      return;
    }

    res.json(wrapSingle(transaction));
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/transactions
 * Create a new transaction/order.
 */
export const createTransaction = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { data } = req.body;
    const userId = req.user?.id;

    if (!data || !userId) {
      res.status(400).json({ error: { message: 'Missing data or authentication' } });
      return;
    }

    // Resolve order items
    const orderItems = await Promise.all(
      (data.items || []).map(async (item: any) => {
        let productId: number | null = null;
        if (item.product) {
          if (typeof item.product === 'number') {
            productId = item.product;
          } else if (typeof item.product === 'string') {
            const product = await prisma.product.findUnique({ where: { documentId: item.product } });
            productId = product?.id || null;
          }
        }

        return {
          quantity: item.quantity || 1,
          price_at_purchase: item.price_at_purchase,
          selected_sku: item.selected_sku,
          productId,
        };
      })
    );

    const transaction = await prisma.transaction.create({
      data: {
        userId,
        order_status: data.order_status || 'Pending',
        total_summary: data.total_summary,
        tracking_info: data.tracking_info,
        publishedAt: new Date(),
        items: { create: orderItems },
      },
      include: {
        items: { include: { product: true } },
      },
    });

    res.status(201).json(wrapSingle(transaction));
  } catch (error) {
    next(error);
  }
};
