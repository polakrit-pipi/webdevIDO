import { Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';
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
      where: { userId, publishedAt: { not: null } },
      include: { items: { include: { product: true } } },
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
      include: { items: { include: { product: true } } },
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
        order_status: 'Pending',
        payment_status: 'unpaid',
        total_summary: data.total_summary,
        tracking_info: data.tracking_info,
        shipping_address: data.shipping_address ?? null,
        publishedAt: new Date(),
        items: { create: orderItems },
      },
      include: { items: { include: { product: true } } },
    });

    res.status(201).json(wrapSingle(transaction));
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/transactions/:documentId/slip
 * User submits payment slip after bank transfer.
 * Body: { slip_url: string, slip_transferred_at: string (ISO datetime) }
 */
export const submitSlip = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const documentId = req.params.documentId as string;
    const userId = req.user?.id;
    const { slip_url, slip_transferred_at } = req.body;

    if (!slip_url || !slip_transferred_at) {
      res.status(400).json({ error: { message: 'slip_url and slip_transferred_at are required' } });
      return;
    }

    const tx = await prisma.transaction.findUnique({ where: { documentId } });
    if (!tx) { res.status(404).json({ error: { message: 'Transaction not found' } }); return; }
    if (tx.userId !== userId) { res.status(403).json({ error: { message: 'Forbidden' } }); return; }
    if (tx.payment_status === 'confirmed') {
      res.status(400).json({ error: { message: 'Payment already confirmed' } });
      return;
    }

    const updated = await prisma.transaction.update({
      where: { documentId },
      data: {
        slip_url,
        slip_transferred_at: new Date(slip_transferred_at),
        payment_status: 'slip_submitted',
      },
      include: { items: { include: { product: true } } },
    });

    res.json(wrapSingle(updated));
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/transactions/:documentId/return
 * Authenticated user requests a return/replacement for their own delivered order.
 *
 * Body:
 * {
 *   returnReason: "สินค้าชำรุด" | "ผิดไซส์" | "ผิดสี" | "อื่นๆ"
 *   reasonDetail?: string
 *   items: Array<{ productName: string; originalSku: string; newSku: string; quantity: number }>
 * }
 */
export const requestReturn = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const documentId = req.params.documentId as string;
    const userId = req.user?.id;
    const { returnReason, reasonDetail, items } = req.body;

    // ── Validate input ──────────────────────────────────────────
    if (!returnReason) {
      res.status(400).json({ error: { message: 'returnReason is required' } });
      return;
    }
    if (!items || !Array.isArray(items) || items.length === 0) {
      res.status(400).json({ error: { message: 'items array is required and must not be empty' } });
      return;
    }

    // ── Find original order ─────────────────────────────────────
    const order = await prisma.transaction.findUnique({
      where: { documentId },
      include: { items: { include: { product: true } } },
    });
    if (!order) {
      res.status(404).json({ error: { message: 'Transaction not found' } });
      return;
    }

    // ── Ownership check ─────────────────────────────────────────
    if (order.userId !== userId) {
      res.status(403).json({ error: { message: 'Forbidden: this order does not belong to you' } });
      return;
    }

    // ── Business rules ──────────────────────────────────────────
    if (order.order_status !== 'Delivered') {
      res.status(400).json({
        error: { message: 'คำขอคืนสินค้าทำได้เฉพาะ order ที่ได้รับแล้ว (Delivered) เท่านั้น' },
      });
      return;
    }
    if (order.payment_status !== 'confirmed') {
      res.status(400).json({
        error: { message: 'คำขอคืนสินค้าทำได้เฉพาะ order ที่ยืนยันการชำระเงินแล้วเท่านั้น' },
      });
      return;
    }

    // ── Prevent duplicate active return ─────────────────────────
    const existingReturn = await prisma.returnOrder.findFirst({
      where: {
        originalOrderId: order.id,
        status: { notIn: ['Cancelled'] },
      },
    });
    if (existingReturn) {
      res.status(409).json({
        error: { message: 'มีคำขอคืนสินค้าที่กำลังดำเนินการอยู่แล้วสำหรับ order นี้' },
      });
      return;
    }

    // ── Create ReturnOrder ───────────────────────────────────────
    const returnOrder = await prisma.returnOrder.create({
      data: {
        originalOrderId: order.id,
        returnReason: reasonDetail ? `${returnReason}: ${reasonDetail}` : returnReason,
        items: items,
        itemsPrice: 0,
        shippingCost: 0,
        shippingAddress: order.shipping_address ?? Prisma.JsonNull,
        status: 'Pending',
      },
      include: {
        originalOrder: {
          include: {
            user: { select: { id: true, username: true, email: true } },
            items: { include: { product: { select: { id: true, ProductName: true } } } },
          },
        },
      },
    });

    res.status(201).json(returnOrder);
  } catch (error) {
    next(error);
  }
};
